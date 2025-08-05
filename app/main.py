from fastapi import FastAPI
from .endpoints import router
from .database import Base, engine
app = FastAPI()

#include router in app
app.include_router(router)


#init engine 
Base.metadata.create_all(bind=engine)
