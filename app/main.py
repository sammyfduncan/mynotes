from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .endpoints import router
from .database import Base, engine
import os 

load_dotenv()

#allowed frontend origins
origins = [
    "http://localhost:3000",
]

#create dirs if not exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("notes", exist_ok=True)

app = FastAPI(
    title="StudyNotes API",
    description="Headless backend API for StudyNotes project (awaiting frontend development)",
    version="1.0.0"
)

#enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#include router in app
app.include_router(router)

#init engine 
Base.metadata.create_all(bind=engine)
