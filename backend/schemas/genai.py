from pydantic import BaseModel, Field
from typing import List, Optional

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str = Field(..., description="Parsed text from the user's resume")
    target_role: str = Field(..., description="The job role the user is aiming for")

class ResumeAnalyzeResponse(BaseModel):
    match_score: int = Field(..., description="Percentage match of resume to target role")
    missing_skills: List[str] = Field(..., description="Skills missing from the resume")
    suggestions: List[str] = Field(..., description="Actionable suggestions for improvement")

class ResumeExtractRequest(BaseModel):
    resume_text: str = Field(..., description="Text from the uploaded resume file")

class ResumeExtractResponse(BaseModel):
    skills: List[str] = Field(..., description="Technical skills extracted from the resume")
    education: str = Field(..., description="Highest level of education detected (e.g. B.Tech, Masters, PhD, etc.)")
    experience_years: int = Field(..., description="Estimated years of professional experience as an integer")
    projects: List[str] = Field(default_factory=list, description="List of projects identified in the resume")
    certifications: List[str] = Field(default_factory=list, description="List of certifications identified in the resume")
    score: int = Field(0, description="Calculated resume strength score (0-100)")

class RoadmapRequest(BaseModel):
    current_role: str = Field(..., description="Current job role or education status")
    target_role: str = Field(..., description="The desired future job role")
    timeline_months: int = Field(6, description="Desired timeline to achieve the goal in months")
    missing_skills: List[str] = Field(default_factory=list, description="Target missing skills to focus on")
    experience_level: str = Field("Fresher", description="User's experience level")

class RoadmapDetailedStep(BaseModel):
    month_or_phase: str = Field(..., description="Month or phase identifier")
    focus_area: str = Field(..., description="Main learning focus")
    skills_to_learn: List[str] = Field(default_factory=list, description="Skills to learn")
    tools_to_practice: List[str] = Field(default_factory=list, description="Tools to practice")
    projects_to_build: List[str] = Field(default_factory=list, description="Projects to build")
    certifications: List[str] = Field(default_factory=list, description="Optional certifications")

class RoadmapResponse(BaseModel):
    brief_roadmap: List[str] = Field(..., description="High-level 3-5 key progression steps")
    detailed_roadmap: List[RoadmapDetailedStep] = Field(..., description="Detailed timeline-based roadmap")

class ImprovementSimulation(BaseModel):
    label: str = Field(..., description="Actionable improvement suggestion")
    gain: int = Field(..., description="Point gain for completing this improvement")

class SimulateImprovementsRequest(BaseModel):
    predicted_role: str = Field(..., description="The predicted role for the user")
    missing_skills: List[str] = Field(..., description="List of skills the user is missing")
    experience_years: int = Field(..., description="User's current years of experience")

class SimulateImprovementsResponse(BaseModel):
    improvements: List[ImprovementSimulation] = Field(..., description="Top 3 simulated improvements")

class ProjectRecommendation(BaseModel):
    title: str = Field(..., description="Project title")
    domain: str = Field(..., description="Project domain (e.g., Frontend, Backend, etc.)")
    description: str = Field(..., description="Brief real-world description")
    skills_used: List[str] = Field(..., description="List of skills applied")
    difficulty: str = Field(..., description="Beginner | Intermediate | Advanced")
    estimated_time: str = Field(..., description="Estimated duration (e.g., 2 weeks)")
    impact: str = Field(..., description="Match increase percentage (e.g., +12% Profile Boost)")
    project_type: str = Field(..., description="Type of project (e.g., Real-world clone)")
    github_hint: str = Field(..., description="Brief implementation details")

class ProjectRecommendationRequest(BaseModel):
    role: str = Field(..., description="Target job role")
    skills: List[str] = Field(default_factory=list, description="User's current skills")
    missing_skills: List[str] = Field(default_factory=list, description="User's missing skills")

class ProjectRecommendationResponse(BaseModel):
    projects: List[ProjectRecommendation] = Field(..., description="List of 3 recommended projects")

class SkillGapRequest(BaseModel):
    role: str = Field(..., description="Target job role")
    score: int = Field(..., description="Calculated match score")
    matched_skills: List[str] = Field(default_factory=list, description="User's current skills")
    missing_skills: List[str] = Field(default_factory=list, description="User's missing skills")

class NextLevelSuggestions(BaseModel):
    experience: List[str]
    portfolio: List[str]
    interview: List[str]
    networking: List[str]

class ReadinessInsights(BaseModel):
    strength: str
    focus_area: str

class SkillGapResponse(BaseModel):
    score: int
    status: str = Field("learning", description="learning | job_ready")
    message: str
    missing_skills: List[str] = Field(default_factory=list)
    next_level_suggestions: Optional[NextLevelSuggestions] = None
    readiness_insights: Optional[ReadinessInsights] = None
