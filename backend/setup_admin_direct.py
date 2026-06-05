import asyncio
from core.database import get_db, connect_to_mongo, close_mongo_connection, db_state
from core.security import get_password_hash
from datetime import datetime

async def setup():
    connect_to_mongo()
    db = db_state.db
    email = 'admin@edu2job.com'
    password = 'admin'
    await db.users.delete_many({'email': email})
    await db.users.insert_one({
        'email': email, 
        'hashed_password': get_password_hash(password), 
        'full_name': 'Super Admin', 
        'role': 'admin', 
        'is_active': True, 
        'is_superuser': True, 
        'created_at': datetime.utcnow()
    })
    print(f'Created {email} with password {password}')
    close_mongo_connection()

if __name__ == '__main__':
    asyncio.run(setup())
