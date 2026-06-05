import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# We expect GEMINI_API_KEY to be in the environment for full functionality
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Use flash for fast generation
MODEL_NAME = "gemini-1.5-flash"

def analyze_resume(resume_text: str, target_role: str) -> dict:
    if not GOOGLE_API_KEY:
        # Fallback dummy response if no API key is provided
        return {
            "match_score": 72,
            "missing_skills": ["Cloud Architecture", "Docker", "Agile methodologies"],
            "suggestions": ["Highlight quantifiable achievements", "Add projects related to Cloud"]
        }
        
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert AI Career Coach. Analyze the following resume text against the target role: {target_role}.
        Return ONLY a JSON response exacty matching this structure:
        {{
            "match_score": integer (0 to 100),
            "missing_skills": ["Skill 1", "Skill 2"],
            "suggestions": ["Suggestion 1", "Suggestion 2"]
        }}
        
        Resume Text:
        {resume_text}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # More robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            # Maybe it starts with ``` instead of ```json
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            # Just extract between the first { and last }
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {
            "match_score": 50,
            "missing_skills": ["Error analyzing skills"],
            "suggestions": ["Please verify your API key or try again later."]
        }

def extract_resume_features(resume_text: str) -> dict:
    if not GOOGLE_API_KEY:
        # Fallback dummy response
        return {
            "skills": ["JavaScript", "React", "Node.js"],
            "education": "B.Tech",
            "experience_years": 2
        }
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert Resume Parser API. Extract core metadata from the provided resume text.
        Return ONLY a JSON response exactly matching this structure:
        {{
            "skills": ["List", "Of", "Technical", "Skills"],
            "education": "String representing highest education (e.g., 'B.Tech', 'Masters', 'BCA', 'Diploma', 'Other')",
            "experience_years": Integer representing estimated total years of work experience (use 0 for fresher)
        }}
        
        Resume Text:
        {resume_text}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # More robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API for extraction: {e}")
        return {
            "skills": ["Error extracting"],
            "education": "Unknown",
            "experience_years": 0
        }

def generate_career_roadmap(current: str, target: str, months: int, missing_skills: list | None = None, experience_level: str = "Fresher") -> dict:
    if not GOOGLE_API_KEY:
        # Dynamic fallback response
        detailed = []
        for m in range(1, months + 1):
            if m <= (months // 3) or m == 1:
                focus = "Foundation Skills"
                skills = ["Data Structures", "Algorithms"]
                tools = ["Git", "Command Line"]
                proj = ["Terminal App"]
            elif m <= (2 * months // 3):
                focus = "Intermediate Knowledge"
                skills = ["API Design", "Database Management"]
                tools = ["Docker", "Postman"]
                proj = ["Fullstack CRUD API"]
            else:
                focus = "Advanced Architecture"
                skills = ["System Design", "Cloud Deployment"]
                tools = ["AWS", "Kubernetes"]
                proj = ["Scalable Microservice"]

            detailed.append({
                "month_or_phase": f"Month {m}",
                "focus_area": focus,
                "skills_to_learn": skills,
                "tools_to_practice": tools,
                "projects_to_build": proj,
                "certifications": ["Platform Certification"] if m == months else []
            })
            
        return {
            "brief_roadmap": [
                "1. Master Core Fundamentals",
                "2. Build Foundation Projects",
                "3. Advanced System Concepts",
                "4. Final Polish & Apply"
            ],
            "detailed_roadmap": detailed
        }
    
    try:
        skills_context = f"The user needs to specifically learn these missing skills: {', '.join(missing_skills)}." if missing_skills and len(missing_skills) > 0 else ""
        
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert Career Strategist. Create a detailed, actionable career roadmap for a {experience_level} transitioning from "{current}" to "{target}" over exactly {months} months.
        {skills_context}

        CRITICAL REQUIREMENT: You MUST generate exactly {months} consecutive chronological objects inside the `detailed_roadmap` array. For example, if {months} is 6, generate an object for Month 1, Month 2, Month 3, Month 4, Month 5, and Month 6. DO NOT skip or group months.
        
        Return ONLY a JSON response exactly matching this structure:
        {{
            "brief_roadmap": [
                "String describing high-level step 1",
                "String describing high-level step 2",
                "String describing high-level step 3"
            ],
            "detailed_roadmap": [
                {{
                    "month_or_phase": "Month 1",
                    "focus_area": "Foundational focus",
                    "skills_to_learn": ["Skill 1", "Skill 2"],
                    "tools_to_practice": ["Tool 1", "Tool 2"],
                    "projects_to_build": ["Project Name 1"],
                    "certifications": ["Certification Name"]
                }},
                {{
                    "month_or_phase": "Month 2",
                    "focus_area": "Intermediate focus",
                    "skills_to_learn": ["Skill 3"],
                    "tools_to_practice": ["Tool 3"],
                    "projects_to_build": ["Project Name 2"],
                    "certifications": []
                }}
            ]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # More robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        detailed = []
        for m in range(1, months + 1):
            detailed.append({
                "month_or_phase": f"Month {m}",
                "focus_area": "Fallback Generation",
                "skills_to_learn": ["Failed to generate specific roadmap without API Key."],
                "tools_to_practice": [],
                "projects_to_build": [],
                "certifications": []
            })
            
        return {
            "brief_roadmap": ["Generation Failed - Using Fallback Timeline"],
            "detailed_roadmap": detailed
        }

def simulate_improvements(predicted_role: str, missing_skills: list, experience_years: int) -> dict:
    if not GOOGLE_API_KEY:
        # Fallback dummy response
        return {
            "improvements": [
                {"label": f"Build a {predicted_role} project", "gain": 8},
                {"label": "Gain 1 year relevant experience", "gain": 10},
                {"label": "Earn a role-specific certification", "gain": 5}
            ]
        }
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert AI Career Coach. The user is aiming for the role of "{predicted_role}" and currently has {experience_years} years of experience.
        They are missing the following critical skills: {', '.join(missing_skills) if missing_skills else 'None specifically identified'}.
        
        Generate exactly 3 actionable, highly specific improvements the user can make to increase their resume score.
        For each improvement, assign a realistic point gain between 3 and 12.
        - Gaining a year of experience should be ~10 points.
        - Building a major project with a missing technical skill should be 8-10 points.
        - Learning a core technical skill should be 4-6 points.
        - Avoid generic advice like "Improve communication" or "Network more". Focus on technical gaps and projects.
        
        Return ONLY a JSON response exactly matching this structure:
        {{
            "improvements": [
                {{"label": "Actionable suggestion 1", "gain": 8}},
                {{"label": "Actionable suggestion 2", "gain": 5}},
                {{"label": "Actionable suggestion 3", "gain": 10}}
            ]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # More robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini API for simulations: {e}")
        return {
            "improvements": [
                {"label": f"Gain hands-on experience in {predicted_role}", "gain": 8},
                {"label": "Work on an end-to-end project", "gain": 6},
                {"label": "Learn industry-standard tools", "gain": 4}
            ]
        }

def generate_project_recommendations(role: str, skills: list, missing_skills: list) -> dict:
    if not GOOGLE_API_KEY:
        # Static fallback projects based on common roles
        role_lower = role.toLowerCase() if hasattr(role, 'toLowerCase') else role.lower()
        if "front" in role_lower or "web" in role_lower:
            return {
                "projects": [
                    {
                        "title": "E-Commerce Interface (Amazon Clone)",
                        "domain": "Frontend",
                        "description": "Build a responsive product listing and cart system using modern frameworks.",
                        "skills_used": ["React", "State Management", "Tailwind CSS"],
                        "difficulty": "Intermediate",
                        "estimated_time": "2 weeks",
                        "impact": "+12% Profile Boost",
                        "project_type": "Real-world clone",
                        "github_hint": "Implement search filters, cart persistence, and responsive design."
                    },
                    {
                        "title": "Dashboard with Real-time Analytics",
                        "domain": "Frontend",
                        "description": "Create a data visualization panel with interactive charts and dynamic filtering.",
                        "skills_used": ["React", "Chart.js", "API Integration"],
                        "difficulty": "Intermediate",
                        "estimated_time": "1-2 weeks",
                        "impact": "+10% Profile Boost",
                        "project_type": "Portfolio",
                        "github_hint": "Use Mock APIs for data, focus on chart interactions and theme switching."
                    },
                    {
                        "title": "SaaS Landing Page Template",
                        "domain": "Frontend",
                        "description": "Develop a high-conversion landing page with complex animations and layout.",
                        "skills_used": ["HTML5", "CSS3", "Framer Motion"],
                        "difficulty": "Beginner",
                        "estimated_time": "1 week",
                        "impact": "+8% Profile Boost",
                        "project_type": "Portfolio",
                        "github_hint": "Focus on semantic HTML, accessibility, and smooth scroll animations."
                    }
                ]
            }
        
        # Generic fallback
        return {
            "projects": [
                {
                    "title": f"Full-Stack {role} Management System",
                    "domain": "Full Stack",
                    "description": f"Build a comprehensive system to manage operations and data related to {role} industry standards.",
                    "skills_used": missing_skills[:3] if missing_skills else ["SQL", "API", "Auth"],
                    "difficulty": "Intermediate",
                    "estimated_time": "3 weeks",
                    "impact": "+15% Profile Boost",
                    "project_type": "Real-world clone",
                    "github_hint": "Focus on CRUD operations, authentication, and database schema design."
                },
                {
                    "title": f"{role} Optimization Toolkit",
                    "domain": "Engineering",
                    "description": f"Develop a set of tools to automate and optimize common tasks in a {role} environment.",
                    "skills_used": missing_skills[3:6] if len(missing_skills) > 3 else ["Python", "Automation", "Git"],
                    "difficulty": "Advanced",
                    "estimated_time": "2 weeks",
                    "impact": "+12% Profile Boost",
                    "project_type": "Problem-solving",
                    "github_hint": "Create scripts or a CLI tool to handle data processing or workflow automation."
                }
            ]
        }

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert AI Career Coach. Generate exactly 3 real-world, portfolio-ready projects for a "{role}" candidate.
        The user already knows: {', '.join(skills) if skills else 'None'}.
        CRITICAL: The projects MUST use and help the user master these MISSING skills: {', '.join(missing_skills) if missing_skills else 'industry standard tools'}.
        
        Return ONLY a JSON response exactly matching this structure:
        {{
            "projects": [
                {{
                    "title": "Project Title",
                    "domain": "Frontend | Backend | Data Science | DevOps",
                    "description": "2-3 lines of real-world use case",
                    "skills_used": ["Skill 1", "Skill 2"],
                    "difficulty": "Beginner | Intermediate | Advanced",
                    "estimated_time": "1-2 weeks",
                    "impact": "+12% Profile Boost",
                    "project_type": "Portfolio | Real-world clone | Problem-solving",
                    "github_hint": "Brief implementation details (features)"
                }}
            ]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Robust JSON extraction
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.rfind("```")
            text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.rfind("```")
            text = text[start:end].strip()
        else:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != 0:
                text = text[start:end]
                
        return json.loads(text)
    except Exception as e:
        print(f"Error generating projects: {e}")
        return {"projects": []}

def analyze_skill_gap(role: str, score: int, matched_skills: list, missing_skills: list) -> dict:
    # 1. Handle High Score (>= 80) logic
    if score >= 80:
        return {
            "score": score,
            "status": "job_ready",
            "message": "You're job-ready! 🎉",
            "missing_skills": [],
            "next_level_suggestions": {
                "experience": [
                    "Apply for internships or freelance projects",
                    "Contribute to open source (GitHub)",
                    "Work on real-world production apps"
                ],
                "portfolio": [
                    "Deploy projects on Vercel / AWS",
                    "Add README with screenshots",
                    "Build 2–3 strong portfolio projects"
                ],
                "interview": [
                    "Practice DSA (LeetCode/GFG)",
                    "Prepare core subjects",
                    "Do mock interviews"
                ],
                "networking": [
                    "Optimize LinkedIn profile",
                    "Post your work weekly",
                    "Connect with recruiters"
                ]
            },
            "readiness_insights": {
                "strength": "Strong technical foundation and skill alignment.",
                "focus_area": "Real-world experience, portfolio deployment, and interview readiness."
            }
        }
    
    # 2. Handle Normal Score (< 80) logic
    # If Gemini is available, we can get a custom mentor message
    mentor_message = f"Your fundamentals in {matched_skills[0] if matched_skills else 'your core stack'} are strong. To reach the next level, focus on mastering {missing_skills[0] if missing_skills else 'industry standard tools'}. This will increase your role match significantly."
    
    if GOOGLE_API_KEY and missing_skills:
        try:
            model = genai.GenerativeModel(MODEL_NAME)
            prompt = f"As an AI Career Mentor, give a 1-sentence encouraging advice for a {role} candidate who has {score}% match and is missing {', '.join(missing_skills[:3])}."
            response = model.generate_content(prompt)
            mentor_message = response.text.strip()
        except: pass

    return {
        "score": score,
        "status": "learning",
        "message": mentor_message,
        "missing_skills": missing_skills,
        "next_level_suggestions": None,
        "readiness_insights": {
            "strength": "Identified core competencies",
            "focus_area": "Bridging technical skill gaps"
        }
    }
