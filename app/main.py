from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware

# load .env variables before other imports
load_dotenv()

from .endpoints import router
from .database import Base, engine
import os 

from sqladmin import Admin, ModelView
from .models import User, Content, Message
from .admin_auth import authentication_backend
from .security import SECRET_KEY


#allowed frontend origins
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")
origins = CORS_ORIGINS.split(",")

#create dirs if not exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("notes", exist_ok=True)

app = FastAPI(
    title="MyNotes",
    description="MyNotes web app",
    version="1.0.0"
)

# Add session middleware
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

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

#add SQLAdmin
admin = Admin(app, engine, authentication_backend=authentication_backend)

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.email]
    column_searchable_list = [User.email]
    name_plural = "Users"

class ContentAdmin(ModelView, model=Content):
    column_list = [Content.id, Content.filename, Content.status, Content.owner]
    name_plural = "Notes"

class MessageAdmin(ModelView, model=Message):
    column_list = [Message.id, Message.name, Message.email, Message.subject, Message.created_at]
    name_plural = "Messages"

admin.add_view(UserAdmin)
admin.add_view(ContentAdmin)
admin.add_view(MessageAdmin)


