from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .endpoints import router
from .database import Base, engine
import os 
#create dirs if not exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("notes", exist_ok=True)

app = FastAPI()

#include router in app
app.include_router(router)

#init engine 
Base.metadata.create_all(bind=engine)

#configuration to serve static html
app.mount(
    "/static",
    StaticFiles(directory="app/static/"),
    name="static"
)

