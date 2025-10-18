from fileinput import filename
from fastapi import FastAPI, File, UploadFile, Depends, BackgroundTasks, HTTPException, APIRouter, Header, Form, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from pathlib import Path
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional, List
import boto3
import os

from .database import get_db
from .models import Content, User, Message
from .utils import process_content
from .security import get_current_user, verify_password, create_acc_token, get_pw_hash, current_user_optional, guest_id_optional, ACCESS_TOKEN_EXP
from .schemas import CreateUser, UserOut, NotesOut, PasswordUpdate, MessageCreate
import uuid
from app import security


#defines API routes 
router = APIRouter()
#max file upload size in MB
MAX_SIZE = 10 * 1024 * 1024

#uploading content 
@router.post("/api/upload/", tags=["Note Creation"])
async def upload_file(
    background_tasks : BackgroundTasks,
    file : UploadFile = File(...),
    note_style : str = Form(
         "default",
         description="Note style. Options: default, concise, detailed.",
         example="concise"),
    db : Session = Depends(get_db),
    current_user : Optional[User] = Depends(current_user_optional),
    guest_id : Optional[str] = Depends(guest_id_optional)
    ):
        """
        Upload lecture content to generate notes.
        
        Accepts files in .pdf, .pptx format, saves it,
        and starts background task to process content and 
        generate notes. 
        
        Returns content ID used to poll the results endpoint. 
        """
        #check size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        if file_size > MAX_SIZE:
             raise HTTPException(
                  status_code=413,
                  detail=f"File is over the limit of {MAX_SIZE / (1024 * 1024)}"
             )
        
        #check file type
        ALLOWED_TYPES = [
             "application/pdf",
             "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ]

        if file.content_type not in ALLOWED_TYPES:
             raise HTTPException(
                  status_code=400,
                  detail="Invalid file type, only .pdf or .pptx is supported."
             )

        #save file
        id_unique = uuid.uuid4()
        file_ext = Path(file.filename).suffix
        new_filename = f"{id_unique}{file_ext}"
        
        # Upload to S3 instead of local disk
        s3_client = boto3.client("s3")
        s3_client.upload_fileobj(
            file.file,
            os.getenv("S3_BUCKET_NAME"),
            new_filename
        )
        # The file_path is now the key in S3
        file_path = new_filename

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


#endpoint for receiving processed notes 
@router.get("/api/results/{content_id}",
          response_model=NotesOut,
          tags=["Note Creation"],
          responses={
               202: {"description": "Processing..."},
               404: {"description": "Note not found or permission denied"},
               500: {"description": "Processing failed"}
          }
)
async def receive_notes(
    content_id : int, 
    db : Session = Depends(get_db),
    #use optional dependencies
    current_user : Optional[User] = Depends(current_user_optional),
    guest_id : Optional[str] = Depends(guest_id_optional)
):
    """
    Polls for results of a note generation task. 

    Use 'content_id' obtained from '/upload' endpoint to check status.
    If processing is complete, it returns created notes. Else, it returns 
    status indicating that the task is still in progress. 
    """
    #retrieve the record 
    record = db.query(Content).filter(Content.id == content_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Note not found, or you do not have permission to view it")

    #check status and return accordingly 
    if record.status == "complete":
        return record
    elif record.status == "processing":
        #202 accepted status
        return JSONResponse(content={"detail": "Processing..."}, status_code=202)
    elif record.status == "failed":
        #505 internal server error
        raise HTTPException(status_code=500, detail="Failed to process")
    else:
         return JSONResponse(content={"detail": "Processing..."}, status_code=202)


#endpoint for dashboard to get notes belonging to user
@router.get("/api/dashboard/", response_model=List[NotesOut], tags=["User Dashboard"])
async def get_user_notes(
     db : Session = Depends(get_db),
     current_user : User = Depends(get_current_user)     
):
     """
     Retrieve all notes for authenticated user.

     Endpoint is protected and requires valid access token.
     Returns a list of all previously generated note records for this account.
     """
     notes = db.query(Content).filter(
          Content.owner_id == current_user.id
          ).all()
     return notes      
     
     
@router.get("/download/{content_id}", tags="Note Downloading")
async def download_note(
     content_id : int,
     db : Session = Depends(get_db),
     #optional dependencies to allow guests to download
     current_user : Optional[User] = Depends(security.current_user_optional),
     guest_id : Optional[str] = Depends(guest_id_optional)
     ):
          """
          Download created notes as a .md file. 

          Can be accessed by logged in user or by guest only if have correct
          session ID that was used for upload by the guest.
          """
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

          # Generate a presigned URL for the S3 object
          s3_client = boto3.client("s3", region_name=os.getenv("AWS_REGION"))
          url = s3_client.generate_presigned_url(
              'get_object',
              Params={'Bucket': os.getenv("S3_BUCKET_NAME"), 'Key': record.note_file_path},
              ExpiresIn=3600  # URL expires in 1 hour
          )
          
          return RedirectResponse(url=url)

@router.post("/users/", response_model=UserOut, tags=["Authentication"])
async def new_user(
     user : CreateUser,
     db : Session = Depends(get_db)
):
     """
     Registers new user account.
     Creates a new user user with email and hashed password.
     Email must not be already taken. 
     Returns the new users public info upon successful registration.
     """
     db_user = db.query(User).filter(User.email == user.email).first()

     if (db_user):
          raise HTTPException(status_code=400, detail="Email already registered")
     
     hashed_pw = get_pw_hash(user.password)
     
     db_user = User(email=user.email, hashed_pw=hashed_pw)
     db.add(db_user)
     db.commit()
     db.refresh(db_user)

     return db_user

#token/login endpoint
@router.post("/token", tags=["Authentication"])
async def login_access_token(
     form_data : OAuth2PasswordRequestForm = Depends(),
     db : Session = Depends(get_db)
):
     """
     Log in to get access token.
     Authenticates a user based on email and password provided in form.
     If credentials are valid, returns a JWT bearer token.
     Token can then be used to access protected endpoints. 
     """
     user = db.query(User).filter(
          User.email == form_data.username
     ).first()

     if not user or not verify_password(
          form_data.password,
          user.hashed_pw
     ):
          raise HTTPException(
               status_code=401,
               detail="Incorrect email or password",
               headers={"WWW_Authenticate" : "Bearer"},
          )
     
     #access token expiry logic 
     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXP)
     access_token = create_acc_token(
          data={"sub" : user.email},
          expires_delta=access_token_expires
     )
     return JSONResponse(content={"access_token": access_token, "token_type": "bearer"})

@router.patch("/api/results/{content_id}", response_model=NotesOut, tags=["Note Management"])
async def rename_note(
    content_id: int,
    update_data: dict, # Allows for more fields in the future
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Rename a specific note."""
    note_query = db.query(Content).filter(Content.id == content_id)
    note = note_query.first()

    if note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    if note.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this note")

    if 'filename' in update_data:
        note.filename = update_data['filename']
    if 'notes' in update_data:
        note.notes = update_data['notes']
    
    db.commit()
    db.refresh(note)
    return note

@router.delete("/api/results/{content_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Note Management"])
async def delete_note(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific note owned by the current user."""
    note_query = db.query(Content).filter(Content.id == content_id)
    note = note_query.first()

    if note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    if note.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this note")

    note_query.delete(synchronize_session=False)
    db.commit()
    
    return

@router.patch("/users/me/password", status_code=status.HTTP_200_OK, tags=["Account Management"])
async def update_user_password(
    password_update: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update the current user's password."""
    if not verify_password(password_update.current_password, current_user.hashed_pw):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect current password")
    
    new_hashed_password = get_pw_hash(password_update.new_password)
    current_user.hashed_pw = new_hashed_password
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.delete("/users/me", status_code=status.HTTP_200_OK, tags=["Account Management"])
async def delete_user_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete the current user's account and all their notes."""
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}

@router.get("/users/me", response_model=UserOut, tags=["Users"])
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's information."""
    return current_user

@router.post("/contact", status_code=status.HTTP_201_CREATED, tags=["Contact"])
async def submit_contact_form(
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    """Submit a contact form message."""
    db_message = Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return {"message": "Message sent successfully!"}
