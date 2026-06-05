from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Edu2Job API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Local MongoDB Connection
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "edu2job"

    
    # JWT Auth
    SECRET_KEY: str = "a_very_secret_key_change_in_production_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    class Config:
        case_sensitive = True

settings = Settings()
