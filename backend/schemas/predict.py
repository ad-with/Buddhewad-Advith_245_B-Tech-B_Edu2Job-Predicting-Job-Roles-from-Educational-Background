from pydantic import BaseModel, Field
from typing import List, Union

class CoreSubject(BaseModel):
    name: str
    grade: str

class Project(BaseModel):
    title: str
    role: str
    skillsApplied: List[str]

class Internship(BaseModel):
    company: str
    domain: str
    durationMonths: int

class Certification(BaseModel):
    name: str
    platform: str
    domain: str

class PredictionRequest(BaseModel):
    degree: str = Field(..., description="Educational degree (e.g., B.Tech, MBA)")
    specialization: str = Field(..., description="Area of specialization")
    academic_score: float = Field(..., description="CGPA or Percentage")
    is_cgpa: bool = Field(True, description="True if score is CGPA, False if Percentage")
    marks_10th: float = Field(..., description="10th standard percentage")
    marks_12th: float = Field(..., description="12th standard percentage")
    skills: Union[List[str], str] = Field(..., description="List of technical and soft skills (or comma separated string)")
    experience_years: int = Field(0, ge=0, description="Years of professional experience")
    core_subjects: List[CoreSubject] = Field(default_factory=list, description="List of core subjects and grades")
    projects: List[Project] = Field(default_factory=list, description="List of projects")
    internships: List[Internship] = Field(default_factory=list, description="List of internships")
    certifications: List[Certification] = Field(default_factory=list, description="List of certifications")

class RolePrediction(BaseModel):
    role: str = Field(..., description="The predicted job role")
    score: float = Field(..., description="Overall match score percentage")

class PredictionResponse(BaseModel):
    predicted_role: str = Field(None, description="The top predicted job role", alias="role")
    confidence: float = Field(None, description="Confidence score of the top prediction")
    top_factors: List[str] = Field(default_factory=list, description="Array of contributing factors for this prediction")
    
    # Optional detailed debugging blocks
    identified_skills: List[str] = Field(default_factory=list, description="Skills used for this prediction")
    all_predictions: List[RolePrediction] = Field(default_factory=list, description="Top role predictions with scores", alias="predictions")

    class Config:
        populate_by_name = True
