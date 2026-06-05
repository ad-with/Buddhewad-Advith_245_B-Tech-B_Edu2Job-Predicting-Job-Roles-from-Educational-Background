import asyncio
import os
import sys

# Add the backend directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
from core.database import connect_to_mongo, close_mongo_connection, db_state
from core.security import get_password_hash

async def create_admin():
    print("--- Create Admin User ---")
    email = input("Enter admin email: ")
    full_name = input("Enter admin full name: ")
    password = input("Enter admin password: ")

    if not email or not full_name or not password:
        print("Error: All fields are required.")
        return

    connect_to_mongo()
    db = db_state.db
    
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        print(f"User with email {email} already exists.")
        if existing_user.get("role") != "admin":
            promote = input("Promote this user to admin? (y/n): ")
            if promote.lower() == 'y':
                await db.users.update_one(
                    {"email": email},
                    {"$set": {"role": "admin"}}
                )
                print("User promoted to admin successfully!")
        else:
            print("User is already an admin.")
    else:
        user_dict = {
            "email": email,
            "hashed_password": get_password_hash(password),
            "full_name": full_name,
            "role": "admin",
            "is_active": True,
            "is_superuser": True,
            "created_at": datetime.utcnow()
        }
        await db.users.insert_one(user_dict)
        print("Admin user created successfully!")
        
    close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(create_admin())
