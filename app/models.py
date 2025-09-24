from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

# Defines database models 

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
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    guest_session_id = Column(String, unique=True, index=True, nullable=True)
    
    owner = relationship("User", back_populates="notes")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_pw = Column(String)
    
    notes = relationship("Content", back_populates="owner", cascade="all, delete-orphan")