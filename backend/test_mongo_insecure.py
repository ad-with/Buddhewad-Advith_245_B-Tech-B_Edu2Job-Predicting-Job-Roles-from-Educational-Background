import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
import sys

# Replace this with your actual URI to test
MONGO_URI = "mongodb+srv://advith498_db_user:Pass%402026@ac-wzsqbwc.4cohjs0.mongodb.net/edu2job?retryWrites=true&w=majority"

async def test_connection():
    print("--- MongoDB SRV Diagnostic Tool (Insecure Mode) ---")
    print(f"Python Version: {sys.version}")
    
    try:
        print("Testing with tlsAllowInvalidCertificates=True and tlsInsecure=True...")
        client = AsyncIOMotorClient(
            MONGO_URI,
            tlsAllowInvalidCertificates=True,
            tlsInsecure=True,
            serverSelectionTimeoutMS=10000
        )
        
        print("Checking connection...")
        await client.admin.command('ping')
        print("Success: Ping successful in insecure mode!")
        
    except Exception as e:
        print("\n--- ERROR DETECTED EVEN IN INSECURE MODE ---")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {str(e)}")
        print("\nConclusion: This is NOT a certificate validation issue.")
        print("It is likely an IP Whitelist issue or a network protocol mismatch.")

if __name__ == "__main__":
    asyncio.run(test_connection())
