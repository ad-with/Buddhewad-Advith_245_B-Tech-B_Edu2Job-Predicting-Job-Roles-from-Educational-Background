import asyncio
from datetime import datetime
from core.database import get_db, connect_to_mongo

async def test():
    connect_to_mongo()
    db = await get_db()
    
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
    print(growth_agg)

if __name__ == "__main__":
    asyncio.run(test())
