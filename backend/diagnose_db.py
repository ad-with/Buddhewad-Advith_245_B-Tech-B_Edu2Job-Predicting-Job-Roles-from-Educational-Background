import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
import sys

# Replace this with your actual URI to test
MONGO_URI = "mongodb+srv://advith498_db_user:Pass%402026@ac-wzsqbwc.4cohjs0.mongodb.net/edu2job?retryWrites=true&w=majority"

async def test_connection():
    print("--- MongoDB SRV Diagnostic Tool ---")
    print(f"Python Version: {sys.version}")
    print(f"Connection URI: {MONGO_URI}")
    
    try:
        client = AsyncIOMotorClient(
            MONGO_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000
        )
        
        print("Checking DNS resolution (SRV)...")
        # This will trigger DNS lookup
        await client.admin.command('ping')
        print("Success: Ping to MongoDB cluster successful!")
        
        db_list = await client.list_database_names()
        print(f"Success: Databases found: {db_list}")
        
    except Exception as e:
        print("\n--- ERROR DETECTED ---")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {str(e)}")
        print("\nPossible Solutions:")
        print("1. IP WHITELIST: Visit Atlas UI -> Network Access. Your current public IP must be allowed.")
        print("2. DNS ISSUES: Ensure 'dnspython' is installed and your network allows DNS SRV lookups.")
        print("3. CREDENTIALS: Verify the username and password in the connection string.")
    finally:
        print("Diagnostic complete.")

if __name__ == "__main__":
    asyncio.run(test_connection())
