from fastapi import FastAPI, File, UploadFile, Depends, BackgroundTasks, HTTPException, APIRouter, Form
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from pathlib import Path
from sqlalchemy.orm import Session
from datetime import timedelta
from app import database, models, utils, schemas, security
import uuid, shutil
#defines API routes 

router = APIRouter()
MAX_SIZE = 10 * 1024 * 1024

#uploading content 
@router.post("/upload/")
async def upload_file(
    background_tasks : BackgroundTasks,
    file : UploadFile = File(...),
    note_style : str = Form("default"),
    db : Session = Depends(get_db)
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

        #create database record 
        content = Content()
        content.filename = file.filename
        content.file_path = str(file_path)
        content.style = note_style

        db.add(content)
        db.commit()
        db.refresh(content)

        background_tasks.add_task(process_content, content.id)

        return {"message": f"Processing {file.filename}...", "content_id": content.id}

#endpoint for receiving processed notes 
@router.get("/api/results/{content_id}", response_model=Notes)
async def receive_notes(
    content_id : int, 
    db : Session = Depends(get_db)
):
    #retrieve the record 
    record = db.query(Content).filter(Content.id == content_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Note not found")

    #check status and return accordingly 
    if record.status == "complete":
        return record
    elif record.status == "processing":
        #202 accepted status
        raise HTTPException(status_code=202, detail="Proccesing...")
    elif record.status == "failed":
        #505 internal server error
        raise HTTPException(status_code=500, detail="Failed to process")

#endpoints for serving HTML

@router.get("/", response_class=FileResponse)
async def serve_index():
     return "app/static/index.html"

@router.get("/upload.html", response_class=FileResponse)
async def serve_upload():
     return "app/static/upload.html"

@router.get("/results.html", response_class=FileResponse)
async def serve_results():
     return "app/static/results.html"

@router.get("/download/{content_id}")
async def download_note(content_id : int, db : Session = Depends(get_db)):
     record = db.query(Content).filter(Content.id == content_id).first()
     if not record or not record.note_file_path:
          raise HTTPException(status_code=404, detail="File not found")
     return FileResponse(
          path=record.note_file_path,
          filename=f"notes_{record.filename}.md",
          media_type='text/markdown'
     )

#user registration endpoint
@router.post("/users/", response_model=schemas.UserCheck)
async def new_user(
     user : schemas.CreateUser,
     db : Session = Depends(get_db)
):
     db_user = db.query(models.User).filter(
          models.User.username == user.username
     ).first()

     if (db_user):
          raise HTTPException(status_code=400, detail="Username already registered")
     
     hashed_pw = security.get_pw_hash(user.password)
     db_user = models.User(
          username=user.username,
          hashed_pw = hashed_pw
     )
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
     user = db.query(models.User).filter(
          models.User.username == form_data.username
     ).first()

     if not user or not security.verify_password(
          form_data.password,
          user.hashed_pw
     ):
          raise HTTPException(
               status_code=401,
               detail="Incorrect username or password",
               headers={"WWW_Authenticate"L "Bearer"},
          )
     
     access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXP)
     access_token = security.create_access_token(
          data={"sub" : user.username},
          expires_delta=access_token_expires
     )
     return {"access_token": access_token, "token_type": "bearer"}



     
     

     