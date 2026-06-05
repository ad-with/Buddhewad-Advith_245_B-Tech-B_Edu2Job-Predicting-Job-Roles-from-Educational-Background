import io
import PyPDF2
from fastapi import APIRouter, HTTPException, File, UploadFile
from schemas.genai import (
    ResumeAnalyzeRequest, ResumeAnalyzeResponse, 
    RoadmapRequest, RoadmapResponse, 
    ResumeExtractRequest, ResumeExtractResponse, 
    SimulateImprovementsRequest, SimulateImprovementsResponse, 
    ProjectRecommendationRequest, ProjectRecommendationResponse,
    SkillGapRequest, SkillGapResponse
)
from ai_engine.genai_service import (
    analyze_resume, generate_career_roadmap, 
    simulate_improvements, generate_project_recommendations,
    analyze_skill_gap
)
from ai_engine.nlp_extractor import extract_resume_features_spacy

router = APIRouter()

@router.post("/resume-analyzer", response_model=ResumeAnalyzeResponse)
async def analyze_resume_endpoint(request: ResumeAnalyzeRequest):
    try:
        result = analyze_resume(request.resume_text, request.target_role)
        return ResumeAnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/resume-extract", response_model=ResumeExtractResponse)
async def extract_resume_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        if file.content_type == "application/pdf" or file.filename.endswith(".pdf"):
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
                resume_text = ""
                for page in pdf_reader.pages:
                    resume_text += page.extract_text() + "\n"
            except Exception as pdf_err:
                raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(pdf_err)}")
        else:
            try:
                resume_text = contents.decode("utf-8")
            except UnicodeDecodeError:
                raise HTTPException(status_code=400, detail="Failed to decode text file. Please ensure it is UTF-8 encoded.")
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the uploaded file.")

        result = extract_resume_features_spacy(resume_text)
        
        if not result.get("skills"):
            result["skills"] = ["No technical skills detected"]

        return ResumeExtractResponse(**result)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@router.post("/career-roadmap", response_model=RoadmapResponse)
async def generate_roadmap_endpoint(request: RoadmapRequest):
    try:
        result = generate_career_roadmap(
            request.current_role, 
            request.target_role, 
            request.timeline_months,
            request.missing_skills,
            request.experience_level
        )
        return RoadmapResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/simulate-improvements", response_model=SimulateImprovementsResponse)
async def simulate_improvements_endpoint(request: SimulateImprovementsRequest):
    try:
        result = simulate_improvements(
            request.predicted_role,
            request.missing_skills,
            request.experience_years
        )
        return SimulateImprovementsResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@router.post("/project-recommendations", response_model=ProjectRecommendationResponse)
async def get_project_recommendations_endpoint(request: ProjectRecommendationRequest):
    try:
        result = generate_project_recommendations(
            request.role,
            request.skills,
            request.missing_skills
        )
        return ProjectRecommendationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Project recommendation failed: {str(e)}")

@router.post("/skill-gap-analysis", response_model=SkillGapResponse)
async def analyze_skill_gap_endpoint(request: SkillGapRequest):
    try:
        result = analyze_skill_gap(
            request.role,
            request.score,
            request.matched_skills,
            request.missing_skills
        )
        return SkillGapResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill gap analysis failed: {str(e)}")
