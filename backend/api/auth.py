from datetime import timedelta, datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from core.database import get_db
from core.security import verify_password, create_access_token, get_password_hash
from core.config import settings
from schemas.token import Token
from schemas.user import UserCreate, User as UserSchema

router = APIRouter()

@router.post("/signup", response_model=UserSchema)
async def signup(user_in: UserCreate, db = Depends(get_db)) -> Any:
    existing_user = await db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    user_dict = {
        "email": user_in.email,
        "hashed_password": get_password_hash(user_in.password),
        "full_name": user_in.full_name,
        "role": user_in.role or "fresher",
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_dict)
    
    # Return mapping back to Pydantic
    user_dict["_id"] = result.inserted_id
    return user_dict

@router.post("/login", response_model=Token)
async def login(db = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    return {
        "access_token": create_access_token(
            str(user["_id"]), expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
