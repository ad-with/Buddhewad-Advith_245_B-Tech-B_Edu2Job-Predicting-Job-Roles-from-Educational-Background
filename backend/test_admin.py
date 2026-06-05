import asyncio
from core.database import get_db, db_state, connect_to_mongo
from api.admin import get_dashboard_stats, get_roles_analytics, get_roles_analytics_new, get_skills_analytics, get_career_trends, get_ai_insights

async def test():
    connect_to_mongo()
    db = await get_db()
    try:
        print("Testing get_dashboard_stats...")
        res = await get_dashboard_stats(db=db, current_admin=None)
        print("Success:", res)
    except Exception as e:
        print("Error in get_dashboard_stats:", e)

    try:
        print("Testing get_roles_analytics...")
        res = await get_roles_analytics(db=db, current_admin=None)
        print("Success")
    except Exception as e:
        print("Error in get_roles_analytics:", e)

    try:
        print("Testing get_roles_analytics_new...")
        res = await get_roles_analytics_new(db=db, current_admin=None)
        print("Success")
    except Exception as e:
        print("Error in get_roles_analytics_new:", e)

    try:
        print("Testing get_skills_analytics...")
        res = await get_skills_analytics(db=db, current_admin=None)
        print("Success")
    except Exception as e:
        print("Error in get_skills_analytics:", e)

    try:
        print("Testing get_career_trends...")
        res = await get_career_trends(db=db, current_admin=None)
        print("Success")
    except Exception as e:
        print("Error in get_career_trends:", e)

    try:
        print("Testing get_ai_insights...")
        res = await get_ai_insights(db=db, current_admin=None)
        print("Success")
    except Exception as e:
        print("Error in get_ai_insights:", e)

asyncio.run(test())
