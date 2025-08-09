from sqlalchemy import Column, Integer, String, Text
from pydantic import BaseModel
from .database import Base
#defines models 

#database model for content of uploaded files 
class Content(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_content = Column(Text)
    notes = Column(Text)
    file_path = Column(String)
    note_file_path = Column(String)
    status = Column(String, default="processing")
    style = Column(String, default="default")

#api response model for generated notes 
class Notes(BaseModel):
    id : int
    filename : str 
    notes : str 

    #enable ORM mode 
    class Config:
        orm_mode = True

#user auth
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_pw = Column(String)
    
    