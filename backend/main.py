from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from core.config import settings
from api import auth, predict, genai, user, admin
from core.database import connect_to_mongo, close_mongo_connection, setup_database_indexes
from core.rate_limit import limiter

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend for Edu2Job AI Career Intelligence System",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Register slowapi limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.on_event("startup")
async def startup_db_client():
    connect_to_mongo()
    await setup_database_indexes()

@app.on_event("shutdown")
def shutdown_db_client():
    close_mongo_connection()

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_STR + "/auth", tags=["auth"])
app.include_router(user.router, prefix=settings.API_V1_STR + "/user", tags=["user"])
app.include_router(predict.router, prefix=settings.API_V1_STR + "/predict", tags=["predict"])
app.include_router(genai.router, prefix=settings.API_V1_STR + "/genai", tags=["genai"])
app.include_router(admin.router, prefix=settings.API_V1_STR + "/admin", tags=["admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Edu2Job API", "status": "online"}

