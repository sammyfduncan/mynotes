from fastapi import FastAPI, File, UploadFile, Depends, BackgroundTasks, HTTPException, APIRouter
from pathlib import Path
from sqlalchemy.orm import Session
from .database import get_db
from .models import Notes, Content
from .utils import process_content
import uuid, shutil
#defines API routes 

router = APIRouter()

#uploading content 
@router.post("/upload/")
async def upload_file(
    file : UploadFile = File(...),
    db : Session = Depends(get_db),
    background_tasks : BackgroundTasks
    ):
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

        db.add(content)
        db.commit()
        db.refresh(content)

        background_tasks.add_task(process_content, content.id)

        return {"message": f"Processing {file.filename}..."}

#endpoint for receiving processed notes 
@router.get("/results/{content_id}", response_model=Notes)
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

