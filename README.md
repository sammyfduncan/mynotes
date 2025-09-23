# MyNotes

MyNotes allows students to upload their lecture content and receive useful study notes in return, assisted through the use of genAI. 

### Features

- **File uploads**: Accepts .pdf and .pptx lecture files.
- **User authentication**: Secure user login and registration using JWT (JSON web tokens)
- **Guest access**: Allows guests to generate up to 3 notes per session.
- **Background task processing**: Uses background tasks for AI processing to ensure constant API responsiveness. 
- **Customisable note styles**: Users can choose from different note styles to fit their needs.
- **Self documenting**: Interactive API documentation through Swagger UI

### Tech Stack

- **Backend**: Python FastAPI
- **Database**: SQLAlchemy, SQLite
- **Data validation**: Pydantic
- **User authentication**: Passlib (hashing), python-jose (JWT)
- **GenAI**: Google AI Studio (Gemini)


### Setup

- Clone repo
- Create/activate venv and install dependencies
- Create .env in root directory and add secret keys (openssl for secret key and Google AI Studio for API key)
- Run server from root with `uvicorn app.main:app --reload`
- API docs available at ``http://127.0.0.1:8000/docs``
