import asyncio
from core.database import get_db, connect_to_mongo
from api.admin import get_users_list

async def test():
    connect_to_mongo()
    db = await get_db()
    try:
        print("Testing get_users_list...")
        res = await get_users_list(db=db, current_admin=None)
        print("Success, found", len(res), "users")
    except Exception as e:
        print("Error in get_users_list:", e)

asyncio.run(test())
