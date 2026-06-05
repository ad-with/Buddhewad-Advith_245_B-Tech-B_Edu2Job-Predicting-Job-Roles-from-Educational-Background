import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import joblib
import os
import random
import re

# Import shared utils and classes
from utils import (
    SYNERGY_MATRIX, SPECIALIZATION_MAPPING, ROLE_TO_DOMAIN,
    FullFeaturePipeline, JobFeatureTransformer
)

# Set base directory to the backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Setting seeds for reproducibility
np.random.seed(42)
random.seed(42)

def generate_synthetic_data(num_samples=6000):
    """
    Generates domain-aligned synthetic data with core subjects, projects, and internships.
    """
    roles = list(ROLE_TO_DOMAIN.keys())
    data = []
    
    # Pre-defined pools for projects and certifications by domain
    domain_pools = {
        "AI/Data": {
            "projects": [
                "Stock Price Predictor: Python, TensorFlow, LSTM",
                "Customer Segmentation: Python, Scikit-learn, K-means",
                "NLP Chatbot: Python, NLTK, Flask",
                "Disease Detection: Deep Learning, PyTorch, CNN"
            ],
            "internships": ["Machine Learning Engineer", "Data Scientist", "Data Analyst"],
            "certs": ["Google Data Analytics", "DeepLearning.AI ML Specialization", "IBM Data Science"]
        },
        "Tech": {
            "projects": [
                "E-commerce API: Node.js, Express, MongoDB",
                "Task Management App: React, Redux, Firebase",
                "DevOps Pipeline: Jenkins, Docker, Kubernetes",
                "Portfolio Website: HTML, CSS, JavaScript, Tailwind"
            ],
            "internships": ["Software Developer", "Frontend Developer", "Backend Developer", "DevOps Engineer"],
            "certs": ["AWS Solutions Architect", "Meta Front-End Developer", "Full Stack Open"]
        },
        "Civil": {
            "projects": [
                "Bridge Design: AutoCAD, Structural Analysis",
                "Smart City Drainage: STAAD Pro, Surveying",
                "Residential Complex Planning: Revit, Cost Estimation"
            ],
            "internships": ["Site Engineer", "Structural Intern", "Quantity Surveyor"],
            "certs": ["AutoCAD Professional", "STAAD Pro Certification"]
        },
        "Finance": {
            "projects": [
                "Portfolio Optimization: Python, Excel, Statistics",
                "GST Compliance Tool: Tally, SQL",
                "Risk Analysis Report: Financial Modeling, Valuation"
            ],
            "internships": ["Financial Analyst", "Audit Assistant", "Tax Consultant"],
            "certs": ["CFA Level 1", "Tally Prime Professional"]
        },
        "Management": {
            "projects": [
                "Market Entry Strategy: Research, Strategy",
                "Agile Product Launch: Jira, Scrum",
                "Brand Revitalization: Marketing, Social Media"
            ],
            "internships": ["Product Management", "Marketing Intern", "Business Analyst"],
            "certs": ["Google Project Management", "HubSpot Content Marketing"]
        }
    }

    samples_per_role = num_samples // len(roles)
    
    for role in roles:
        domain = ROLE_TO_DOMAIN[role]
        for _ in range(samples_per_role):
            # Select degree & specialization logically
            if domain in ["AI/Data", "Tech"]:
                degree = random.choice(["B.Tech", "M.Tech", "MCA", "BCA"])
                specialization = random.choice(["Computer Science", "Artificial Intelligence", "Data Science", "Information Technology"])
            elif domain == "Civil":
                degree = random.choice(["B.Tech", "M.Tech", "Diploma"])
                specialization = "Civil Engineering"
            elif domain == "Finance":
                degree = random.choice(["B.Com", "M.Com", "MBA", "BBA"])
                specialization = "Finance"
            elif domain == "Marketing":
                degree = random.choice(["MBA", "BBA", "BA"])
                specialization = "Marketing"
            else:
                degree = random.choice(["B.Sc", "M.Sc", "BA", "MA"])
                specialization = random.choice(list(SPECIALIZATION_MAPPING.keys()))

            # 1. CORE SUBJECTS (Strict domain mapping)
            spec_info = SPECIALIZATION_MAPPING.get(specialization, {'subjects': ["General Subject"], 'skills': ["Communication"]})
            subjects_pool = spec_info['subjects']
            num_subs = random.randint(3, 5)
            selected_subs = random.sample(subjects_pool, min(num_subs, len(subjects_pool)))
            
            sub_grades = []
            for sub in selected_subs:
                if role in SYNERGY_MATRIX.get(sub, []):
                    grade = random.choice(['A+', 'A', 'A-'])
                else:
                    grade = random.choice(['A', 'A-', 'B+', 'B', 'C'])
                sub_grades.append(f"{sub}:{grade}")
            
            core_subjects_str = ",".join(sub_grades)

            # 2. PROJECTS & INTERNSHIPS
            pool = domain_pools.get(domain, domain_pools["Tech"])
            proj_list = random.sample(pool["projects"], random.randint(1, 2))
            projects_str = "; ".join(proj_list)
            
            num_internships = random.randint(0, 2)
            internship_entries = []
            for _ in range(num_internships):
                int_role = random.choice(pool["internships"])
                duration = random.randint(1, 6)
                internship_entries.append(f"{int_role}:{duration} months")
            internships_str = "; ".join(internship_entries)
            
            # 3. SKILLS
            role_skills_pool = spec_info['skills']
            skills = ", ".join(random.sample(role_skills_pool, random.randint(3, len(role_skills_pool))))

            # 4. SCORES & EXPERIENCE
            academic_score = round(random.uniform(7.0, 9.8), 2)
            marks_10th = round(random.uniform(70, 98), 1)
            marks_12th = round(random.uniform(70, 98), 1)
            experience = random.randint(0, 10)

            data.append({
                "degree": degree,
                "specialization": specialization,
                "academic_score": academic_score,
                "marks_10th": marks_10th,
                "marks_12th": marks_12th,
                "skills": skills,
                "core_subjects": core_subjects_str,
                "projects": projects_str,
                "internships": internships_str,
                "experience_years": experience,
                "role": role
            })
    
    df = pd.DataFrame(data)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    data_dir = os.path.join(BASE_DIR, 'data')
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'job_data.csv')
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated with {len(df)} rows at {csv_path}")
    return df

def train_job_model():
    print("Beginning multi-modal model training pipeline...")
    df = generate_synthetic_data(8000)
    
    # Columns to include in X
    cols = ['degree', 'specialization', 'academic_score', 'marks_10th', 'marks_12th', 'skills', 'core_subjects', 'projects', 'internships', 'experience_years']
    X = df[cols]
    y = df['role']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    # Define Model Pipeline using shared FullFeaturePipeline
    model_pipeline = Pipeline(steps=[
        ('features', FullFeaturePipeline()),
        ('classifier', GradientBoostingClassifier(
            n_estimators=150, 
            learning_rate=0.08, 
            max_depth=5, 
            subsample=0.8, 
            random_state=42
        ))
    ])
    
    print("Training Gradient Boosting Classifier...")
    model_pipeline.fit(X_train, y_train)
    
    y_pred = model_pipeline.predict(X_test)
    print(f"Model Training Complete. Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    # Save artifacts
    model_dir = os.path.join(BASE_DIR, 'model_artifacts')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'job_predictor.joblib')
    joblib.dump(model_pipeline, model_path)
    print(f"Model successfully saved to '{model_path}'.")


if __name__ == "__main__":
    train_job_model()
