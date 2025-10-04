from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

#handles connection to DB 

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./studynotes.db")

if SQLALCHEMY_DATABASE_URL.startswith("postgres"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

Base = declarative_base()

#create session factory object
# calls create new session instance  
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
    )

#dependency function
def get_db():
    db = SessionLocal()

    try:
        yield db 
    finally:
        db.close()