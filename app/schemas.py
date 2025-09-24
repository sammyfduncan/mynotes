from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class TokenData(BaseModel):
    email : Optional[str] = None

class CreateUser(BaseModel):
    email : EmailStr 
    password : str

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

#check if in DB
class UserCheck(BaseModel):
    id : int
    email : str
    hashed_pw : str 

    class Config:
        from_attributes = True

#for user response that doesnt include pw field
class UserOut(BaseModel):
    id : int
    email : EmailStr

    class Config:
        from_attributes = True

#for note response
class NotesOut(BaseModel):
    id: int
    filename: str
    notes: Optional[str] = None
    status: str
    note_file_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


