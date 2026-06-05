from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import get_current_user
from schemas.user import User as UserSchema
from bson import ObjectId

router = APIRouter()

@router.get("/me", response_model=UserSchema)
async def read_user_me(current_user: dict = Depends(get_current_user)) -> Any:
    # Safely convert to expected Pydantic schema
    current_user["_id"] = str(current_user["_id"])
    return current_user

@router.get("/predictions")
async def read_user_predictions(current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    user_id = current_user.get("_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found")
        
    # Fetch all prediction history for the authenticated user, newest first
    cursor = db.predictions.find({"user_id": str(user_id)}).sort("created_at", -1)
    predictions = await cursor.to_list(length=100) # limit to 100 recent
    
    # Format ObjectId for JSON serialization
    for pred in predictions:
        pred["_id"] = str(pred["_id"])
        
    return {"predictions": predictions}

@router.get("/latest-prediction")
async def read_user_latest_prediction(current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    user_id = current_user.get("_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found")
        
    # Fetch the single latest prediction sorted by created_at DESC
    prediction = await db.predictions.find_one(
        {"user_id": str(user_id)},
        sort=[("created_at", -1)]
    )
    
    if not prediction:
        return None
        
    role = prediction.get("predicted_role", "")
    
    # Extract user skills
    input_data = prediction.get("input_data", {})
    user_skills = input_data.get("skills", [])
    if isinstance(user_skills, str):
        user_skills = [s.strip() for s in user_skills.split(',') if s.strip()]
        
    user_skills_lower = {s.lower() for s in user_skills if s}
    
    # Load required skills from api.admin
    from api.admin import ROLE_SKILLS
    required = ROLE_SKILLS.get(role, [])
    
    matched_skills = [s for s in required if s.lower() in user_skills_lower]
    missing_skills = [s for s in required if s.lower() not in user_skills_lower]
    
    # Ensure there is a top matched skill or custom skills listed if standard matched_skills is empty
    if not matched_skills and user_skills:
        matched_skills = user_skills[:2]
        
    from datetime import datetime
    created_at = prediction.get("created_at")
    created_at_str = created_at.isoformat() if isinstance(created_at, datetime) else str(created_at)
    
    return {
        "predicted_role": role,
        "confidence_score": prediction.get("confidence_score"),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "created_at": created_at_str
    }

