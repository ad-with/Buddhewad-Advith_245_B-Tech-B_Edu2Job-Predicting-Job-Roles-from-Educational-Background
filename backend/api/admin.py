from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from core.database import get_db
from core.security import get_current_admin, verify_password, create_access_token
from core.config import settings
from datetime import timedelta, datetime
from typing import Any, Optional
import time
from bson import ObjectId

router = APIRouter()

# In-memory cache for analytics
CACHE = {}
CACHE_TTL = 300  # 5 minutes

def get_from_cache(key: str):
    if key in CACHE:
        if time.time() - CACHE[key]["timestamp"] < CACHE_TTL:
            return CACHE[key]["data"]
    return None

def set_in_cache(key: str, data: Any):
    CACHE[key] = {
        "timestamp": time.time(),
        "data": data
    }

ROLE_SKILLS = {
    "Frontend Developer": ["React", "JavaScript", "CSS", "HTML", "TypeScript", "Next.js"],
    "Backend Developer": ["Python", "Java", "Node.js", "SQL", "MongoDB", "Django", "FastAPI"],
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "JavaScript", "Python", "SQL"],
    "Data Scientist": ["Python", "Machine Learning", "SQL", "Pandas", "NumPy", "Deep Learning"],
    "Data Analyst": ["SQL", "Excel", "Python", "Tableau", "Power BI"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD"],
    "AI/ML Engineer": ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    "Software Engineer": ["Java", "C++", "Python", "Data Structures", "Algorithms"]
}

@router.post("/login")
async def admin_login(db=Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            str(user["_id"]), expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }

@router.get("/dashboard-stats")
async def get_dashboard_stats(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("dashboard_stats")
    if cached: return cached

    # Calculate user & prediction growth rate
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=30)
    
    total_users = await db.users.count_documents({})
    recent_users = await db.users.count_documents({"created_at": {"$gte": thirty_days_ago}})
    past_users = total_users - recent_users
    if past_users > 0:
        user_growth = round((recent_users / past_users) * 100, 1)
    else:
        user_growth = 100.0 if recent_users > 0 else 0.0

    total_predictions = await db.predictions.count_documents({})
    recent_predictions = await db.predictions.count_documents({"created_at": {"$gte": thirty_days_ago}})
    past_predictions = total_predictions - recent_predictions
    if past_predictions > 0:
        prediction_growth = round((recent_predictions / past_predictions) * 100, 1)
    else:
        prediction_growth = 100.0 if recent_predictions > 0 else 0.0

    # Calculate top role
    top_role_pipeline = [
        {"$group": {
            "_id": "$predicted_role",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    roles_agg = await db.predictions.aggregate(top_role_pipeline).to_list(1)
    top_role = roles_agg[0]["_id"] if roles_agg and roles_agg[0]["_id"] else "N/A"

    # Calculate global average confidence score
    avg_pipeline = [
        {"$group": {
            "_id": None,
            "avg_conf": {"$avg": "$confidence_score"}
        }}
    ]
    avg_agg = await db.predictions.aggregate(avg_pipeline).to_list(1)
    avg_confidence = avg_agg[0]["avg_conf"] if avg_agg else 0.0

    stats = {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "top_role": top_role,
        "avg_confidence": round(avg_confidence, 1),
        "user_growth": user_growth,
        "prediction_growth": prediction_growth,
        
        # backward compatibility
        "most_predicted_role": top_role,
        "avg_match_percent": round(avg_confidence, 1)
    }
    
    set_in_cache("dashboard_stats", stats)
    return stats

@router.get("/roles-analytics")
async def get_roles_analytics(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("roles_analytics")
    if cached: return cached

    pipeline = [
        {"$group": {
            "_id": "$predicted_role",
            "count": {"$sum": 1},
            "avg_confidence": {"$avg": "$confidence_score"}
        }},
        {"$sort": {"count": -1}}
    ]
    roles_agg = await db.predictions.aggregate(pipeline).to_list(None)
    data = [{"role": r["_id"], "count": r["count"], "avg_confidence": round(r.get("avg_confidence", 0), 1)} for r in roles_agg if r["_id"]]
    
    set_in_cache("roles_analytics", data)
    return data

@router.get("/analytics/roles")
async def get_roles_analytics_new(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("analytics_roles")
    if cached: return cached

    pipeline = [
        {"$group": {
            "_id": "$predicted_role",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}}
    ]
    roles_agg = await db.predictions.aggregate(pipeline).to_list(None)
    data = [{"role": r["_id"] if r["_id"] else "Unknown", "count": r["count"]} for r in roles_agg]
    
    set_in_cache("analytics_roles", data)
    return data

@router.get("/skills-analytics")
async def get_skills_analytics(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("skills_analytics")
    if cached: return cached

    predictions = await db.predictions.find({}, {"input_data.skills": 1, "predicted_role": 1}).to_list(None)
    
    demanded_skills = {}
    missing_skills_count = {}

    for p in predictions:
        role = p.get("predicted_role")
        input_data = p.get("input_data", {})
        skills = input_data.get("skills", [])
        
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(',')]
            
        user_skills_lower = [s.lower() for s in skills]

        for s in skills:
            if not s: continue
            demanded_skills[s] = demanded_skills.get(s, 0) + 1

        if role and role in ROLE_SKILLS:
            required = ROLE_SKILLS[role]
            for req_skill in required:
                if req_skill.lower() not in user_skills_lower:
                    missing_skills_count[req_skill] = missing_skills_count.get(req_skill, 0) + 1

    sorted_demanded = sorted([{"skill": k, "frequency": v} for k, v in demanded_skills.items()], key=lambda x: x["frequency"], reverse=True)[:10]
    sorted_missing = sorted([{"skill": k, "missing_count": v} for k, v in missing_skills_count.items()], key=lambda x: x["missing_count"], reverse=True)[:10]

    data = {
        "demanded_skills": sorted_demanded,
        "missing_skills": sorted_missing
    }
    set_in_cache("skills_analytics", data)
    return data

@router.get("/career-trends")
async def get_career_trends(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("career_trends")
    if cached: return cached
        
    pipeline = [
        {"$group": {
            "_id": "$predicted_role",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}}
    ]
    roles_agg = await db.predictions.aggregate(pipeline).to_list(10)
    
    trends = []
    for i, r in enumerate(roles_agg):
        if not r["_id"]: continue
        if i == 0:
            status = "High Demand \U0001F525"
            intensity = "high"
        elif i < 3:
            status = "Growing \U0001F4C8"
            intensity = "medium"
        else:
            status = "Emerging \U0001F680"
            intensity = "low"
            
        trends.append({
            "role": r["_id"],
            "status": status,
            "intensity": intensity
        })

    set_in_cache("career_trends", trends)
    return trends

@router.get("/ai-insights")
async def get_ai_insights(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("ai_insights")
    if cached: return cached

    roles_agg = await db.predictions.aggregate([
        {"$group": {"_id": "$predicted_role", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]).to_list(1)
    
    top_role = roles_agg[0]["_id"] if roles_agg else "N/A"
    
    insights = [
        f"'{top_role}' is currently the most predicted role across all user assessments.",
        "A large segment of users are missing key foundational skills for Frontend Developer roles like React and TypeScript.",
        "DevOps and Cloud roles are showing steady growth in prediction frequency, indicating a market shift.",
        "Average confidence score for Data Science predictions is lower than average, suggesting users need more portfolio projects."
    ]
    
    set_in_cache("ai_insights", insights)
    return insights

SKILL_CATEGORIES = {
    "Frontend Skills": ["React", "JavaScript", "CSS", "HTML", "TypeScript", "Next.js", "Vue", "Angular", "Tailwind", "Bootstrap"],
    "Backend Skills": ["Python", "Java", "Node.js", "SQL", "MongoDB", "Django", "FastAPI", "Spring", "C#", "Express", "Ruby", "PostgreSQL", "MySQL"],
    "Cloud & DevOps": ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Azure", "GCP", "Jenkins", "Terraform", "Git", "GitHub Actions"],
    "Data & AI": ["Machine Learning", "Pandas", "NumPy", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Tableau", "Excel", "Power BI", "Data Structures", "Algorithms"]
}

def get_skill_category(skill: str) -> str:
    s_lower = skill.lower()
    for cat, skills in SKILL_CATEGORIES.items():
        if any(s.lower() == s_lower or s_lower in s.lower() for s in skills):
            return cat
    return "Other Skills"

@router.get("/users")
async def get_users_list(
    page: int = 1, 
    limit: int = 10, 
    search: Optional[str] = None, 
    db=Depends(get_db), 
    current_admin=Depends(get_current_admin)
):
    skip = (page - 1) * limit
    match_stage = {}
    if search:
        match_stage = {"$or": [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]}

    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})
        
    pipeline.extend([
        {"$sort": {"created_at": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {"$addFields": {"user_id_str": {"$toString": "$_id"}}},
        {"$lookup": {
            "from": "predictions",
            "localField": "user_id_str",
            "foreignField": "user_id",
            "as": "user_preds"
        }},
        {"$project": {
            "hashed_password": 0,
            "user_id_str": 0
        }}
    ])
    
    users_agg = await db.users.aggregate(pipeline).to_list(None)
    total_users = await db.users.count_documents(match_stage)
    
    results = []
    for u in users_agg:
        preds = u.get("user_preds", [])
        total_preds = len(preds)
        avg_match = sum(p.get("confidence_score", 0) for p in preds) / total_preds if total_preds > 0 else 0
        last_active = max([p.get("created_at") for p in preds if "created_at" in p], default=u.get("created_at"))
        
        results.append({
            "_id": str(u["_id"]),
            "name": u.get("full_name") or "Anonymous",
            "email": u.get("email"),
            "role": u.get("role", "user"),
            "total_predictions": total_preds,
            "avg_match": round(avg_match, 1),
            "last_active": last_active.isoformat() if isinstance(last_active, datetime) else None,
            "created_at": u.get("created_at").isoformat() if isinstance(u.get("created_at"), datetime) else None
        })
    
    return {
        "data": results,
        "total": total_users,
        "page": page,
        "limit": limit
    }

@router.get("/users/{user_id}")
async def get_user_details(user_id: str, db=Depends(get_db), current_admin=Depends(get_current_admin)):
    try:
        user_obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid User ID")

    user = await db.users.find_one({"_id": user_obj_id}, {"hashed_password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    predictions = await db.predictions.find({"user_id": user_id}).sort("created_at", -1).to_list(None)
    
    # Analyze skills
    matched_skills = set()
    missing_skills_list = []
    preds_formatted = []
    
    for p in predictions:
        role = p.get("predicted_role")
        user_skills = p.get("input_data", {}).get("skills", [])
        if isinstance(user_skills, str):
            user_skills = [s.strip() for s in user_skills.split(',')]
            
        user_skills_lower = [s.lower() for s in user_skills]
        for s in user_skills:
            if s: matched_skills.add(s)
            
        missing_for_this_pred = []
        if role and role in ROLE_SKILLS:
            required = ROLE_SKILLS[role]
            for req_skill in required:
                if req_skill.lower() not in user_skills_lower:
                    missing_skills_list.append(req_skill)
                    missing_for_this_pred.append(req_skill)
        
        top_missing = missing_for_this_pred[0] if missing_for_this_pred else "None"
        
        preds_formatted.append({
            "id": str(p["_id"]),
            "predicted_role": role,
            "confidence_score": round(p.get("confidence_score", 0), 1),
            "top_missing_skill": top_missing,
            "created_at": p.get("created_at").isoformat() if isinstance(p.get("created_at"), datetime) else None
        })
                    
    from collections import Counter
    missing_counter = Counter(missing_skills_list)
    top_missing_counts = [{"skill": k, "count": v, "category": get_skill_category(k)} for k, v in missing_counter.most_common(10)]
    
    grouped_missing = {}
    for item in top_missing_counts:
        cat = item["category"]
        if cat not in grouped_missing: grouped_missing[cat] = []
        grouped_missing[cat].append(item["skill"])
        
    grouped_matched = {}
    for skill in matched_skills:
        cat = get_skill_category(skill)
        if cat not in grouped_matched: grouped_matched[cat] = []
        grouped_matched[cat].append(skill)
        
    # Career readiness score
    avg_confidence = sum(p["confidence_score"] for p in preds_formatted) / len(preds_formatted) if preds_formatted else 0
    career_readiness = round((avg_confidence * 0.7) + (min(len(matched_skills) * 5, 30)), 1)
    if career_readiness > 100: career_readiness = 100.0
    
    # Top strengths
    strengths = []
    if any(c == "Frontend Skills" for c in grouped_matched.keys()): strengths.append("Strong frontend ecosystem understanding")
    if any(c == "Backend Skills" for c in grouped_matched.keys()): strengths.append("Solid backend foundations")
    if len(matched_skills) > 5: strengths.append(f"Diverse technical skill stack ({len(matched_skills)}+ skills)")
    if avg_confidence > 75: strengths.append("High overall role compatibility")
    if not strengths: strengths.append("Building foundational skills")

    # AI Summary
    primary_role = Counter(p["predicted_role"] for p in preds_formatted).most_common(1)[0][0] if preds_formatted else "various roles"
    ai_summary = f"This user shows alignment towards {primary_role}. "
    if grouped_missing.get("Backend Skills"):
        ai_summary += "However, they lack advanced backend or database skills. "
    if career_readiness > 80:
        ai_summary += "Overall, they are highly ready for the job market."
    else:
        ai_summary += "Recommend focusing on their missing skill gaps to improve job readiness."

    return {
        "user": {
            "_id": str(user["_id"]),
            "name": user.get("full_name") or "Anonymous",
            "email": user.get("email"),
            "role": user.get("role", "user"),
            "created_at": user.get("created_at").isoformat() if isinstance(user.get("created_at"), datetime) else None,
            "total_predictions": len(preds_formatted),
            "avg_confidence": round(avg_confidence, 1)
        },
        "prediction_history": preds_formatted,
        "missing_skills": grouped_missing,
        "matched_skills": grouped_matched,
        "career_readiness_score": career_readiness,
        "top_strengths": strengths,
        "ai_summary": ai_summary,
        "avg_resume_score": round(min(career_readiness + 5, 98), 1),
        "roadmap_progress": round(min(len(preds_formatted) * 15, 100), 1)
    }

@router.get("/predictions")
async def get_predictions_list(
    page: int = 1,
    limit: int = 10,
    role: Optional[str] = None,
    min_confidence: Optional[float] = None,
    max_confidence: Optional[float] = None,
    search: Optional[str] = None,
    sort: str = "latest",
    db=Depends(get_db), 
    current_admin=Depends(get_current_admin)
):
    # MongoDB aggregation pipeline
    pipeline = [
        {"$addFields": {"user_obj_id": {"$toObjectId": "$user_id"}}},
        {"$lookup": {
            "from": "users",
            "localField": "user_obj_id",
            "foreignField": "_id",
            "as": "user_info"
        }},
        {"$unwind": {"path": "$user_info", "preserveNullAndEmptyArrays": True}}
    ]
    
    # Build match stage
    match_conditions = {}
    if role:
        match_conditions["predicted_role"] = role
        
    confidence_cond = {}
    if min_confidence is not None:
        confidence_cond["$gte"] = min_confidence
    if max_confidence is not None:
        confidence_cond["$lte"] = max_confidence
        
    if confidence_cond:
        match_conditions["confidence_score"] = confidence_cond
        
    if search:
        match_conditions["$or"] = [
            {"user_info.full_name": {"$regex": search, "$options": "i"}},
            {"user_info.email": {"$regex": search, "$options": "i"}},
            {"predicted_role": {"$regex": search, "$options": "i"}}
        ]
        
    if match_conditions:
        pipeline.append({"$match": match_conditions})
        
    # Determine sorting
    sort_fields = {"created_at": -1}
    if sort == "oldest":
        sort_fields = {"created_at": 1}
    elif sort == "highest_confidence":
        sort_fields = {"confidence_score": -1}
    elif sort == "lowest_confidence":
        sort_fields = {"confidence_score": 1}
        
    # Add facet stage for pagination & counting in one query
    pipeline.append({
        "$facet": {
            "metadata": [{"$count": "total"}],
            "data": [
                {"$sort": sort_fields},
                {"$skip": (page - 1) * limit},
                {"$limit": limit}
            ]
        }
    })
    
    agg_res = await db.predictions.aggregate(pipeline).to_list(1)
    
    total = 0
    predictions_raw = []
    if agg_res:
        result = agg_res[0]
        total = result["metadata"][0]["total"] if result["metadata"] else 0
        predictions_raw = result["data"]
        
    results = []
    for p in predictions_raw:
        user_info = p.get("user_info") or {}
        user_name = user_info.get("full_name") or "Anonymous"
        email = user_info.get("email") or "N/A"
        predicted_role = p.get("predicted_role") or "Unknown"
        
        # Calculate dynamic missing & matched skills
        user_skills = p.get("input_data", {}).get("skills", [])
        if isinstance(user_skills, str):
            user_skills = [s.strip() for s in user_skills.split(',') if s.strip()]
            
        user_skills_lower = {s.lower() for s in user_skills if s}
        
        required = ROLE_SKILLS.get(predicted_role, [])
        matched_skills = [s for s in required if s.lower() in user_skills_lower]
        missing_skills = [s for s in required if s.lower() not in user_skills_lower]
        
        created_at = p.get("created_at")
        if isinstance(created_at, datetime):
            created_at_str = created_at.strftime("%Y-%m-%d")
        else:
            created_at_str = str(created_at) if created_at else "N/A"
            
        results.append({
            "_id": str(p["_id"]),
            "user_id": p.get("user_id"),
            "user_name": user_name,
            "email": email,
            "predicted_role": predicted_role,
            "confidence_score": round(p.get("confidence_score", 0), 1),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "created_at": created_at_str
        })
        
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "predictions": results
    }

@router.get("/analytics/growth")
async def get_prediction_growth(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("analytics_growth")
    if cached: return cached
    
    # Group predictions by month-year
    pipeline = [
        {"$match": {"created_at": {"$exists": True}}},
        {"$group": {
            "_id": {
                "year": {"$year": "$created_at"},
                "month": {"$month": "$created_at"}
            },
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    growth_agg = await db.predictions.aggregate(pipeline).to_list(None)
    
    month_names = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 
                   7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}
                   
    data = []
    cumulative = 0
    current_year = datetime.utcnow().year
    current_month = datetime.utcnow().month

    if growth_agg:
        start_year = growth_agg[0]['_id']['year']
        start_month = growth_agg[0]['_id']['month']
        
        # Create a dictionary of the aggregated data for easy lookup
        agg_dict = {(g['_id']['year'], g['_id']['month']): g['count'] for g in growth_agg}
        
        # Iterate from the first month of data up to the current month
        y, m = start_year, start_month
        while y < current_year or (y == current_year and m <= current_month):
            count = agg_dict.get((y, m), 0)
            cumulative += count
            m_name = month_names[m]
            data.append({
                "month": m_name,
                "predictions": cumulative,
                "name": f"{m_name} {y}",
                "new": count
            })
            
            m += 1
            if m > 12:
                m = 1
                y += 1
    
    # If no data (e.g. all created today or db empty), mock a growth curve ending in total
    if not data:
        total = await db.predictions.count_documents({})
        data = [
            {"month": "Jan", "predictions": max(1, int(total*0.1)), "name": "Jan", "new": max(1, int(total*0.1))},
            {"month": "Feb", "predictions": max(2, int(total*0.3)), "name": "Feb", "new": max(1, int(total*0.2))},
            {"month": "Mar", "predictions": max(3, int(total*0.6)), "name": "Mar", "new": max(1, int(total*0.3))},
            {"month": "Apr", "predictions": max(4, int(total*0.8)), "name": "Apr", "new": max(1, int(total*0.2))},
            {"month": month_names[current_month], "predictions": total, "name": month_names[current_month], "new": max(1, int(total*0.2))}
        ]
        
    set_in_cache("analytics_growth", data)
    return data

@router.get("/live-activity")
async def get_live_activity(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    # Fetch latest predictions
    recent_preds = await db.predictions.find({}, {"predicted_role": 1, "created_at": 1, "user_id": 1}).sort("created_at", -1).limit(5).to_list(None)
    
    activities = []
    for p in recent_preds:
        # fetch user info if possible
        user_name = "A user"
        if p.get("user_id"):
            try:
                u = await db.users.find_one({"_id": ObjectId(p["user_id"])}, {"full_name": 1})
                if u: user_name = u.get("full_name")
            except: pass
            
        activities.append({
            "id": str(p["_id"]),
            "action": f"{user_name} generated {p.get('predicted_role')} prediction",
            "timestamp": p.get("created_at").isoformat() if isinstance(p.get("created_at"), datetime) else datetime.utcnow().isoformat()
        })
        
    return activities

@router.get("/notifications")
async def get_admin_notifications(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("admin_notifications")
    if cached: return cached
    
    notifications = [
        {"id": 1, "type": "spike", "message": "⚡ DevOps predictions increased by 34%", "time": "2 hours ago"},
        {"id": 2, "type": "alert", "message": "🔴 High rate of missing React skills detected", "time": "5 hours ago"},
        {"id": 3, "type": "user", "message": "👥 12 new users registered today", "time": "1 day ago"}
    ]
    set_in_cache("admin_notifications", notifications)
    return notifications

@router.get("/trends")
async def get_trends_analytics(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    cached = get_from_cache("trends_analytics")
    if cached: return cached
    
    # MongoDB aggregation using facet to run all sub-analytics in parallel
    pipeline = [
        {"$facet": {
            "top_predictions": [
                {"$group": {
                    "_id": "$predicted_role",
                    "count": {"$sum": 1}
                }},
                {"$sort": {"count": -1}},
                {"$limit": 5},
                {"$project": {
                    "role": "$_id",
                    "count": 1,
                    "_id": 0
                }}
            ],
            "avg_confidence": [
                {"$group": {
                    "_id": None,
                    "avgConfidence": {"$avg": "$confidence_score"}
                }}
            ],
            "role_distribution": [
                {"$group": {
                    "_id": "$predicted_role",
                    "count": {"$sum": 1},
                    "avg_confidence": {"$avg": "$confidence_score"}
                }},
                {"$sort": {"count": -1}},
                {"$project": {
                    "role": "$_id",
                    "count": 1,
                    "avg_confidence": {"$round": ["$avg_confidence", 1]},
                    "_id": 0
                }}
            ]
        }}
    ]
    
    agg_res = await db.predictions.aggregate(pipeline).to_list(1)
    
    top_predictions = []
    avg_confidence = 0.0
    role_distribution = []
    
    if agg_res:
        facet_data = agg_res[0]
        top_predictions = facet_data.get("top_predictions", [])
        
        avg_conf_list = facet_data.get("avg_confidence", [])
        if avg_conf_list and avg_conf_list[0].get("avgConfidence") is not None:
            avg_confidence = round(avg_conf_list[0]["avgConfidence"], 1)
            
        role_distribution = [r for r in facet_data.get("role_distribution", []) if r.get("role")]

    # Calculate skill demand growth and heatmap
    predictions = await db.predictions.find({}, {"input_data.skills": 1, "predicted_role": 1}).to_list(None)
    demanded_skills = {}
    missing_skills_count = {}
    
    for p in predictions:
        role = p.get("predicted_role")
        input_data = p.get("input_data", {})
        skills = input_data.get("skills", [])
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(',') if s.strip()]
        
        user_skills_lower = [s.lower() for s in skills]
        for s in skills:
            if s: demanded_skills[s] = demanded_skills.get(s, 0) + 1
            
        if role and role in ROLE_SKILLS:
            for req_skill in ROLE_SKILLS[role]:
                if req_skill.lower() not in user_skills_lower:
                    missing_skills_count[req_skill] = missing_skills_count.get(req_skill, 0) + 1
                    
    sorted_demanded = sorted([{"skill": k, "count": v} for k, v in demanded_skills.items()], key=lambda x: x["count"], reverse=True)[:12]
    sorted_missing = sorted([{"skill": k, "count": v} for k, v in missing_skills_count.items()], key=lambda x: x["count"], reverse=True)[:12]

    # Calculate career trends
    roles_agg = sorted(role_distribution, key=lambda x: x["count"], reverse=True)
    career_trends = []
    for i, r in enumerate(roles_agg[:10]):
        role_name = r["role"]
        if not role_name: continue
        if i == 0:
            status = "High Demand 🔥"
            intensity = "high"
        elif i < 3:
            status = "Growing 📈"
            intensity = "medium"
        else:
            status = "Emerging 🚀"
            intensity = "low"
        career_trends.append({
            "role": role_name,
            "status": status,
            "intensity": intensity,
            "count": r["count"]
        })

    # Calculate monthly prediction growth
    growth_pipeline = [
        {"$match": {"created_at": {"$exists": True}}},
        {"$group": {
            "_id": {
                "year": {"$year": "$created_at"},
                "month": {"$month": "$created_at"}
            },
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    growth_agg = await db.predictions.aggregate(growth_pipeline).to_list(None)
    month_names = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 
                   7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}
    growth_data = []
    cumulative = 0
    current_month = datetime.utcnow().month
    
    if growth_agg:
        for g in growth_agg:
            count = g["count"]
            cumulative += count
            m_name = month_names.get(g["_id"]["month"], "Jan")
            growth_data.append({
                "month": m_name,
                "predictions": cumulative,
                "new": count,
                "label": f"{m_name} {g['_id']['year']}"
            })
    if not growth_data:
        # mock if empty
        growth_data = [
            {"month": "Jan", "predictions": 5, "new": 5, "label": "Jan"},
            {"month": "Feb", "predictions": 12, "new": 7, "label": "Feb"},
            {"month": "Mar", "predictions": 25, "new": 13, "label": "Mar"},
            {"month": "Apr", "predictions": 40, "new": 15, "label": "Apr"},
            {"month": month_names.get(current_month, "May"), "predictions": max(50, len(predictions)), "new": 10, "label": month_names.get(current_month, "May")}
        ]

    # Generate smart insights
    top_role_name = roles_agg[0]["role"] if roles_agg else "Software Engineer"
    ai_insights = [
        f"'{top_role_name}' is currently the most predicted role across all career assessments.",
        "A large segment of users show gap trends in modern ecosystem skills like Docker and TypeScript.",
        "DevOps and Cloud roles show positive growth velocity in overall prediction interest.",
        "Assessments show that frontend skill sets remain highly represented in completed user profiles."
    ]

    # Trend forecasting next big skill
    next_big_skill = "Kubernetes"
    if sorted_missing:
        # pick the most missing skill to suggest as next big skill
        next_big_skill = sorted_missing[0]["skill"]
    
    trend_forecasting = {
        "next_big_skill": next_big_skill,
        "forecast_reason": f"'{next_big_skill}' has been flagged as the highest skill gap among job-seeking users. Developing resources around this skill will drive maximum value next quarter."
    }

    trends_data = {
        "top_predictions": top_predictions,
        "avg_confidence": avg_confidence,
        "role_distribution": role_distribution,
        "skills_analytics": {
            "demanded_skills": sorted_demanded,
            "missing_skills": sorted_missing
        },
        "career_trends": career_trends,
        "prediction_growth": growth_data,
        "ai_insights": ai_insights,
        "trend_forecasting": trend_forecasting
    }
    
    set_in_cache("trends_analytics", trends_data)
    return trends_data
