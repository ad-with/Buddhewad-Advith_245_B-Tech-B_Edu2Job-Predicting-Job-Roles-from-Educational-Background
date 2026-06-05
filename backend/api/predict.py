from fastapi import APIRouter, HTTPException, Depends
from schemas.predict import PredictionRequest, PredictionResponse
import joblib
import os
import pandas as pd
import numpy as np
import re
from collections import Counter
from datetime import datetime

# Import shared utils and classes
from ai_engine.utils import (
    SYNERGY_MATRIX, ROLE_TO_DOMAIN, FullFeaturePipeline, JobFeatureTransformer,
    parse_core_subjects, parse_projects, grade_to_numeric, get_internship_score
)
from core.database import get_db
from core.security import get_current_user_optional
from core.rate_limit import limiter
from typing import Optional
from fastapi import Request

router = APIRouter()

# Fix for joblib/pickle: the model was trained with 'import utils'
# but here it is known as 'ai_engine.utils'. We map them to allow unpickling.
import sys
import ai_engine.utils
sys.modules['utils'] = ai_engine.utils

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model_artifacts", "job_predictor.joblib")

model = None

def load_model():
    global model
    if model is None:
        try:
            if os.path.exists(MODEL_PATH):
                model = joblib.load(MODEL_PATH)
            else:
                print(f"Model path not found: {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")

@router.on_event("startup")
async def startup_event():
    load_model()

def scale_confidence(score, min_score=60.0, max_score=95.0, current_min=0.0, current_max=100.0):
    """ Scales raw confidence to a realistic range (e.g. 60-95%) """
    scaled = min_score + (score - current_min) * (max_score - min_score) / (current_max - current_min)
    return min(max_score, max(min_score, scaled))

def get_top_contributors(model, input_df, n=3):
    """
    Identifies the top N features that contributed to the model's prediction
    using feature importance and the actual feature presence.
    """
    try:
        pipeline = model.named_steps['features']
        clf = model.named_steps['classifier']
        
        # Get feature names and importances
        feature_names = pipeline.feature_names_
        importances = clf.feature_importances_
        
        # Transform the single input row
        X_trans = pipeline.transform(input_df)[0]
        
        # Contribution = Importance * Value (for presence)
        contributions = []
        for i, (name, imp) in enumerate(zip(feature_names, importances)):
            val = X_trans[i]
            if val > 0:
                contributions.append((name, imp * val))
        
        # Sort by contribution
        contributions.sort(key=lambda x: x[1], reverse=True)
        return contributions[:n]
    except Exception as e:
        print(f"Error identifying top contributors: {e}")
        return []

@router.post("/", response_model=PredictionResponse)
@limiter.limit("10/minute")
async def predict_job_role(
    payload: PredictionRequest,
    request: Request, # Required by limiter
    db = Depends(get_db),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    if model is None:
        load_model()
    if model is None:
        raise HTTPException(status_code=500, detail="Machine learning model not found. Please train it first.")
    
    try:
        # 1. Prepare Input for Model
        # Map the list-based core_subjects to the string format used in training
        core_subjects_str = ",".join([f"{s.name}:{s.grade}" for s in payload.core_subjects])
        
        # Map projects to string format
        projects_str = "; ".join([f"{p.title}: {', '.join(p.skillsApplied)}" for p in payload.projects])
        
        # Map internships to string format
        internships_str = "; ".join([f"{i.domain}: {i.durationMonths} months" for i in payload.internships])
        
        # Ensure skills is a list
        skills_input = payload.skills if isinstance(payload.skills, list) else [s.strip() for s in payload.skills.split(",")]
        skills_str = ", ".join(skills_input)

        input_data = pd.DataFrame([{
            "degree": payload.degree,
            "specialization": payload.specialization,
            "academic_score": payload.academic_score,
            "marks_10th": payload.marks_10th,
            "marks_12th": payload.marks_12th,
            "skills": skills_str,
            "core_subjects": core_subjects_str,
            "projects": projects_str,
            "internships": internships_str,
            "experience_years": payload.experience_years
        }])
        
        # 2. ML Prediction
        try:
            probas = model.predict_proba(input_data)[0]
            classes = model.classes_
            role_scores = {role: float(prob) * 100 for role, prob in zip(classes, probas)}
        except:
            prediction = model.predict(input_data)[0]
            role_scores = {prediction: 85.0}

        # 3. Synergy Bonuses & Negative Signals (Sanity Check)
        parsed_subjects = parse_core_subjects(core_subjects_str)
        
        for sub_name, grade_val in parsed_subjects.items():
            # Apply Synergy Bonus
            if sub_name in SYNERGY_MATRIX:
                target_roles = SYNERGY_MATRIX[sub_name]
                for role in target_roles:
                    if role in role_scores:
                        if grade_val >= 5: # A or A+
                            role_scores[role] *= 1.3
                        elif grade_val >= 4: # A-
                            role_scores[role] *= 1.15
            
            # Apply Negative Signal (Sanity Check)
            if grade_val <= 1: # C or D
                # Penalize highly technical roles if foundational subjects are weak
                tech_roles = ["Software Engineer", "Backend Developer", "Data Scientist", "System Architect"]
                for role in tech_roles:
                    if role in role_scores:
                        role_scores[role] *= 0.8

        # 4. Identify Top Contributors for Explanation
        top_factors = get_top_contributors(model, input_data)
        
        # 5. Domain Consistency Check Penalty
        # (This is already mostly handled by the model being trained on domain-aligned data, 
        # but we can add a small reinforcement penalty for mismatches)
        
        # 6. Formatting Predictions
        sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
        max_total = sum(role_scores.values()) or 1.0
        
        predictions_formatted = []
        for role, raw_score in sorted_roles[:3]:
            # Scale to realistic 60-95 range
            relative = (raw_score / max_total) * 100
            final_conf = scale_confidence(relative, min_score=60.0, max_score=95.0, current_max=100.0)
            predictions_formatted.append({
                "role": role,
                "score": round(final_conf, 1)
            })

        top_prediction = predictions_formatted[0]
        role = top_prediction["role"]

        # 7. Generate Structured Top Factors
        top_factors_list = []
        
        # Feature-importance driven arrays
        for feature_name, _ in top_factors:
            if 'word_' in feature_name:
                word = feature_name.replace('word_', '')
                top_factors_list.append(f"Strong alignment with '{word.title()}'")
            elif feature_name == 'avg_subject_grade':
                top_factors_list.append("Excellent core educational mastery")
            elif feature_name == 'log_internship_duration':
                top_factors_list.append("Significant internship experience")
            elif feature_name == 'project_count':
                top_factors_list.append("Strong portfolio of applied projects")
        
        # Add synergy-specific highlight if exists
        for sub, target_roles in SYNERGY_MATRIX.items():
            if role in target_roles and parsed_subjects.get(sub, 0) >= 5:
                top_factors_list.append(f"A+ grade in mission-critical '{sub}'")
                break

        # 8. Store Prediction logically in MongoDB
        prediction_doc = {
            "input_data": payload.dict(),
            "predicted_role": role,
            "confidence_score": top_prediction["score"],
            "all_predictions": predictions_formatted,
            "top_factors": top_factors_list,
            "created_at": datetime.utcnow()
        }
        
        # Hybrid Auth: attach user ID if authenticated
        if current_user and current_user.get("_id"):
            prediction_doc["user_id"] = str(current_user["_id"])
            
        await db.predictions.insert_one(prediction_doc)

        return PredictionResponse(
            identified_skills=skills_input,
            predictions=predictions_formatted,
            role=role,
            confidence=top_prediction["score"],
            top_factors=top_factors_list
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

