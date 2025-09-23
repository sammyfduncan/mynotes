
import PyPDF2
from pptx import Presentation
from .database import SessionLocal
from .models import Content
from .gen_api import gen_notes
#backend logic 

#worker function to process file contents 
def process_content(content_id : int):
    #creates a database session
    with SessionLocal() as db:
        #retrieve specific content 
        record = db.query(Content).filter(Content.id == content_id).first()
        if not record:
            return

        try: 
            #now call llm util function
            note_str = gen_notes(
                file_path=record.file_path,
                style=record.style
                )
        
            if not note_str:
                record.status = "failed"
                db.commit()
                return

            #call helper
            note_path = save_notes(
                notes_content=note_str,
                content_id=record.id
            )

            #update record in memory
            record.note_file_path = note_path
            record.status = "complete"
            record.notes = note_str

        except Exception as e:
            print(f"Failed to process {content_id}: {e}")
            record.status = "failed"

        finally: 
            #commit changes to db regardless of success
            db.commit()

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
    
    