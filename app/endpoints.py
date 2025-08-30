from fileinput import filename
from fastapi import FastAPI, File, UploadFile, Depends, BackgroundTasks, HTTPException, APIRouter, Header, Form
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from pathlib import Path
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional, List
from .database import get_db
from .models import Content, Notes, User
from .utils import process_content
from .security import get_current_user, verify_password, create_acc_token, get_pw_hash, current_user_optional, guest_id_optional, ACCESS_TOKEN_EXP
from .schemas import CreateUser, UserCheck
import uuid, shutil

from app import security

STATIC_DIR = Path(__file__).parent / "static"

#defines API routes 
router = APIRouter()
#max file upload size in MB
MAX_SIZE = 10 * 1024 * 1024

#dependency to read guest ID from custom header
async def guest_id_optional(
          x_guest_id : Optional[str] = Header(None, alias="X-Guest-Id")
) -> Optional[str]:
     return x_guest_id

#uploading content 
@router.post("/upload/")
async def upload_file(
    background_tasks : BackgroundTasks,
    file : UploadFile = File(...),
    note_style : str = Form("default"),
    db : Session = Depends(get_db),
    current_user : Optional[User] = Depends(current_user_optional),
    guest_id : Optional[str] = Depends(guest_id_optional)
    ):
        #check size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        if file_size > MAX_SIZE:
             raise HTTPException(
                  status_code=413,
                  detail=f"File is over the limit of {MAX_SIZE / (1024 * 1024)}"
             )
        
        #save file
        id_unique = uuid.uuid4()
        file_ext = Path(file.filename).suffix
        new_filename = f"{id_unique}{file_ext}"
        #holds unique path object 
        file_path = Path("uploads") / new_filename   
        
        with open(file_path, "wb") as file_obj:
             shutil.copyfileobj(file.file, file_obj)

        owner_id = None
        if current_user:
             #user logged in
             owner_id = current_user.id
        else:
             #guest
               if not guest_id:
                    raise HTTPException(
                    status_code=400,
                    detail="guest ID missing"
                    )
               
               existing_note = db.query(Content).filter(
                    Content.guest_session_id == guest_id
               ).first()

               if existing_note:
                    raise HTTPException(
                         status_code=403,
                         detail="Guest limit reached, login to create more notes"
                    )

        #create database record 
        content = Content(
             filename=file.filename,
             file_path=str(file_path),
             style=note_style,
             owner_id=owner_id, #assosciate w/ current user
             guest_session_id=guest_id if not current_user else None
        )
        
        db.add(content)
        db.commit()
        db.refresh(content)

        background_tasks.add_task(process_content, content.id)

        response_data = {"message": f"Processing {file.filename}...", "content_id": content.id}
        
        return response_data

#endpoints for serving HTML
@router.get("/", response_class=FileResponse)
async def serve_index():
     return STATIC_DIR / "index.html"

@router.get("/upload.html", response_class=FileResponse)
async def serve_upload():
     return STATIC_DIR / "upload.html"

@router.get("/results.html", response_class=FileResponse)
async def serve_results():
     return STATIC_DIR / "results.html"

@router.get("/login.html", response_class=FileResponse)
async def serve_login():
    return STATIC_DIR / "login.html"

@router.get("/register.html", response_class=FileResponse)
async def serve_register():
    return STATIC_DIR / "register.html"

@router.get("/dashboard.html", response_class=FileResponse)
async def serve_dashboard():
    return STATIC_DIR / "dashboard.html"


#endpoint for receiving processed notes 
@router.get("/api/results/{content_id}", response_model=Notes)
async def receive_notes(
    content_id : int, 
    db : Session = Depends(get_db),
    #use optional dependencies
    current_user : Optional[User] = Depends(current_user_optional),
    guest_id : Optional[str] = Depends(guest_id_optional)
):
    #retrieve the record 
    record = db.query(Content).filter(Content.id == content_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Note not found, or you do not have permission to view it")

    #check status and return accordingly 
    if record.status == "complete":
        return record
    elif record.status == "processing":
        #202 accepted status
        raise HTTPException(status_code=202, detail="Proccesing...")
    elif record.status == "failed":
        #505 internal server error
        raise HTTPException(status_code=500, detail="Failed to process")


#endpoint for dashboard to get notes belonging to user
@router.get("/api/dashboard/", response_model=List[Notes])
async def get_user_notes(
     db : Session = Depends(get_db),
     current_user : User = Depends(get_current_user)     
):
     notes = db.query(Content).filter(
          Content.owner_id == current_user.id
          ).all()
     return notes      
     
     
@router.get("/download/{content_id}")
async def download_note(
     content_id : int,
     db : Session = Depends(get_db),
     #optional dependencies to allow guests to download
     current_user : Optional[User] = Depends(security.current_user_optional),
     guest_id : Optional[str] = Depends(guest_id_optional)
     ):
          record = db.query(Content).filter(Content.id == content_id).first()
          
          if not record or not record.note_file_path:
               raise HTTPException(status_code=404, detail="File not found")
          
          #check for ownershup or valid guest session
          is_owner = current_user and record.owner_id == current_user.id
          is_guest = record.guest_session_id and record.guest_session_id == guest_id

          #check permission to download
          if not is_owner and not is_guest:
               raise HTTPException(
                    status_code=403,
                    detail="You've reached your guest download limit.\n"
               )

          return FileResponse(
               path=record.note_file_path,
               filename=f"notes_{record.filename}.md",
               media_type='text/markdown'
     )

#user registration endpoint
@router.post("/users/", response_model=UserCheck)
async def new_user(
     user : CreateUser,
     db : Session = Depends(get_db)
):
     db_user = db.query(User).filter(User.username == user.username).first()

     if (db_user):
          raise HTTPException(status_code=400, detail="Username already registered")
     
     hashed_pw = get_pw_hash(user.password)
     
     db_user = User(username=user.username, hashed_pw=hashed_pw)
     db.add(db_user)
     db.commit()
     db.refresh(db_user)

     return db_user

#token/login endpoint
@router.post("/token")
async def login_access_token(
     form_data : OAuth2PasswordRequestForm = Depends(),
     db : Session = Depends(get_db)
):
     user = db.query(User).filter(
          User.username == form_data.username
     ).first()

     if not user or not verify_password(
          form_data.password,
          user.hashed_pw
     ):
          raise HTTPException(
               status_code=401,
               detail="Incorrect username or password",
               headers={"WWW_Authenticate" : "Bearer"},
          )
     
     #access token expiry logic 
     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXP)
     access_token = create_acc_token(
          data={"sub" : user.username},
          expiry_delta=access_token_expires
     )
     return {"access_token": access_token, "token_type": "bearer"}


     