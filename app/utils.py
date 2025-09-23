
import PyPDF2
from pptx import Presentation
from .database import SessionLocal
from .models import Content
from .gen_api import gen_notes
#backend logic 

#worker function to process file contents 
def process_content(content_id : int):
    try:
        with SessionLocal() as db:
            record = db.query(Content).filter(Content.id == content_id).first()
            if not record:
                return
            
        note_str = gen_notes(
            file_path=record.file_path,
            style=record.style
        )

        if not note_str:
            update_note_db(content_id, "", "", "failed")
            return
        
        note_path = save_notes(
            notes_content=note_str,
            content_id=record.id
        )

        update_note_db(content_id, note_str, note_path, "complete")

    except Exception as e:
        print(f"Failed to process {content_id}: {e}")
        update_note_db(content_id, "", "", "failed")


 #helper to save notes file 
def save_notes(
        notes_content : str,
        content_id : int
) -> str:
    note_path = f"notes/notes_{content_id}.md"
    #open in write mode 
    with open(note_path, "w", encoding="utf-8") as f:
        f.write(notes_content)
        return note_path
    
#responsible for updating note record in db
def update_note_db(
        content_id: int,
        note_str: str,
        note_path: str,
        status: str
):
    with SessionLocal() as db:
        record = db.query(Content).filter(Content.id == content_id).first()
        if record:
            record.notes = note_str
            record.note_file_path = note_path
            record.status = status
            db.commit()
        
