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

        #extract text
        if record.file_path.endswith(".pdf"):
            extracted_text = extract_from_pdf(record.file_path)
        elif record.file_path.endswith(".pptx"):
            extracted_text = extract_from_pptx(record.file_path)
        else:
            record.status = "failed"
            return

        #call llm api function


        #update record in memory
        record.notes = extracted_text
        record.status = "complete"

        #commit changes to db
        db.commit()

     
def extract_from_pdf(file_path : str):
    tmp = " "
    
    with open(file_path, "rb") as tmp_file:
        reader = PyPDF2.PdfReader(tmp_file)
        
        for page in reader.pages:
            tmp += page.extract_text()
        return tmp
    
def extract_from_pptx(file_path : str):
    tmp = " "

    prs = Presentation(file_path)

    for slide in prs.slides:
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            for paragraph in shape.text_frame.paragraphs:
                for run in paragraph.runs:
                    tmp += run.text
    return tmp