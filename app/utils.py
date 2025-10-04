import PyPDF2
from pptx import Presentation
import boto3
import os
import tempfile

from .database import SessionLocal
from .models import Content
from .gen_api import gen_notes
#backend logic 

#worker function to process file contents 
def process_content(content_id : int):
    db = SessionLocal()
    record = None
    try:
        record = db.query(Content).filter(Content.id == content_id).first()
        if not record:
            return

        s3_client = boto3.client("s3")
        bucket_name = os.getenv("S3_BUCKET_NAME")
        
        # Download the file from S3 to a temporary local file
        with tempfile.NamedTemporaryFile(delete=True, suffix=os.path.splitext(record.file_path)[1]) as temp_file:
            s3_client.download_fileobj(bucket_name, record.file_path, temp_file)
            temp_file.seek(0)
            
            # Process the local temporary file
            note_str = gen_notes(
                file_path=temp_file.name,
                style=record.style
            )

            if not note_str:
                raise ValueError("Failed to generate notes from content.")

            # Save the generated notes back to S3
            note_key = f"notes_{record.id}.md"
            s3_client.put_object(
                Bucket=bucket_name,
                Key=note_key,
                Body=note_str.encode('utf-8'),
                ContentType='text/markdown'
            )

        # Update the database record
        record.notes = note_str
        record.note_file_path = note_key
        record.status = "complete"
        db.commit()

    except Exception as e:
        print(f"Failed to process {content_id}: {e}")
        if record:
            record.status = "failed"
            db.commit()
    finally:
        db.close()