from fastapi import FastAPI, File, UploadFile, Depends
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uuid, shutil

app = FastAPI()

DATABASE_URL = "sqlite:///./studynotes.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
Base = declarative_base()

#database model for content of uploaded files 
class Content(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_content = Column(Text)
    notes = Column(Text)
    file_path = Column(String)
    status = Column(String, default="processing")

#init engine 
Base.metadata.create_all(bind=engine)

#api response model for generated notes 
class Notes(BaseModel):
    id : int
    filename : str 
    notes : str 

    #enable ORM mode 
    class Config:
        orm_mode = True

#create session factory object
# calls create new session instance  
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
    )

#dependency function
def get_db():
    db = SessionLocal()

    try:
        yield db 
    finally:
        db.close()

    
#API endpoints

#uploading content 
@app.post("/upload/")
async def upload_file(
    file : UploadFile = File(...),
    db : Session = Depends(get_db)
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

        return {"message": "Processing {file.filename}..."}
