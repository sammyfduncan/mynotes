import PyPDF2
from pptx import Presentation
from .database import SessionLocal
from .models import Content
#backend logic 

#worker function to process file contents 
def process_content(content_id : int):
    #creates a database session
    with SessionLocal() as db:
        #retrieve specific content 
        record = db.query(Content).filter(Content.id == content_id).first()
        if not record:
            return

        #now call llm util function



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
            
            

        #update record in memory
        record.file_path = note_path
        record.status = "complete"

        #commit changes to db
        db.commit()

 