from fastapi import FastAPI
from .endpoints import router
from .database import Base, engine
import os 

#create dirs if not exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("notes", exist_ok=True)

app = FastAPI(
    title="StudyNotes API",
    description="Headless backend API for StudyNotes project (awaiting frontend development)",
    version="1.0.0"
)

#include router in app
app.include_router(router)

#init engine 
Base.metadata.create_all(bind=engine)
