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

