from pydantic import BaseModel, EmailStr, Field, BeforeValidator, ConfigDict
from typing import Optional, Annotated, Any
from datetime import datetime
from bson import ObjectId

# Custom type for handling ObjectId in Pydantic v2
# This converts string IDs or raw ObjectIds into the desired format
PyObjectId = Annotated[
    str, 
    BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)
]

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "fresher" # fresher, experienced, admin

class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime
