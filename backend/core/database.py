from motor.motor_asyncio import AsyncIOMotorClient
import certifi

from core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_state = Database()

def connect_to_mongo():
    try:
        print(f"Attempting to connect to MongoDB: {settings.MONGO_URI}")
        
        # Determine if we need SSL/TLS (usually for Atlas but not local)
        client_kwargs = {
            "serverSelectionTimeoutMS": 30000,
            "connectTimeoutMS": 20000
        }
        
        if "mongodb+srv" in settings.MONGO_URI:
            client_kwargs["tlsCAFile"] = certifi.where()
            
        db_state.client = AsyncIOMotorClient(
            settings.MONGO_URI,
            **client_kwargs
        )
        db_state.db = db_state.client[settings.MONGO_DB]
        # The connection isn't actually tested until the first operation
        print(f"MongoDB client initialized.")
    except Exception as e:
        print(f"Fatal error during MongoDB client initialization: {e}")
        raise e
    
async def setup_database_indexes():
    """Sets up the initial MongoDB indexes"""
    if db_state.db is not None:
        import pymongo
        await db_state.db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
        await db_state.db.predictions.create_index([("user_id", pymongo.ASCENDING)])
        print("MongoDB Indexes properly configured.")

def close_mongo_connection():

    if db_state.client:
        db_state.client.close()
        print("Closed MongoDB connection")

async def get_db():
    if db_state.db is None:
        connect_to_mongo()
    return db_state.db
