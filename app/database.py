from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

#handles connection to DB 

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# Construct the URL for PostgreSQL
# This will intentionally fail if the environment variables are not set.
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

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