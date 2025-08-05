from app.database import SessionLocal, engine
from app.models import Content, Base

Base.metadata.create_all(bind=engine)

db = SessionLocal()

lecture_a = Content(
    filename="testa.pdf",
    file_path="/uploads/testa.pdf",
    status="complete",
    notes="Testing testing testing"
    )

db.add(lecture_a)
db.commit()

retrieved = db.query(Content).filter(Content.filename == "testa.pdf").first()
print(f"Retrieved {retrieved.filename}. Status {retrieved.status}")

db.close()
