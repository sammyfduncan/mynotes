from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
#handles connection to DB 


DATABASE_URL = "sqlite:///./studynotes.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
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
