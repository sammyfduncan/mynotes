from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .endpoints import router
from .database import Base, engine
app = FastAPI()

#include router in app
app.include_router(router)

#init engine 
Base.metadata.create_all(bind=engine)

#configuration to serve static html
app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static"
)

