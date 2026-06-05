import asyncio
from core.database import get_db, connect_to_mongo

async def test():
    connect_to_mongo()
    db = await get_db()
    
    # 1. Check direct find
    users = await db.users.find().to_list(None)
    print(f'Direct find: Found {len(users)} users: {[u.get("email") for u in users]}')
    
    # 2. Check aggregate 
    pipeline = [
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
    ]
    users_agg = await db.users.aggregate(pipeline).to_list(None)
    print(f'Aggregate: Found {len(users_agg)} users: {[u.get("email") for u in users_agg]}')

if __name__ == "__main__":
    asyncio.run(test())
