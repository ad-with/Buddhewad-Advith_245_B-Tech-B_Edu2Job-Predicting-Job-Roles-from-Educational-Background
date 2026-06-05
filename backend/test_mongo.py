import certifi
from pymongo import MongoClient
import ssl

uri = "mongodb+srv://advith498_db_user:Pass%402026@ac-wzsqbwc.4cohjs0.mongodb.net/edu2job?retryWrites=true&w=majority"

print(f"Certifi path: {certifi.where()}")

shard_uri = "mongodb://advith498_db_user:Pass%402026@ac-wzsqbwc-shard-00-00.4cohjs0.mongodb.net:27017/edu2job?authSource=admin&replicaSet=atlas-xxx-shard-0&tls=true"
# Note: I don't know the exact replica set name, but let's try just the host

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_motor():
    try:
        print("Attempting to connect with AsyncIOMotorClient (long timeout)...")
        client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=20000)
        await client.admin.command('ping')
        print("Ping (Motor) successful!")
    except Exception as e:
        print(f"Connection (Motor) failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_motor())
