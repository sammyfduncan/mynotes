from pydantic import BaseModel
from typing import Optional

class TokenData(BaseModel):
    username : Optional[str] = None

class CreateUser(BaseModel):
    username : str 
    password : str
#check if in DB
class UserCheck(BaseModel):
    id : int
    username : str
    hashed_pw : str 

    class Config:
        orm_mode = True

#for user response that doesnt include pw field
class UserOut(BaseModel):
    id : int
    username : str

    class Config:
        from_attributes = True


