import os
from google import generativeai
from dotenv import load_dotenv
#utils for llm API

load_dotenv()

def gen_notes(file_path : str) -> str:
    #links api key in .env
    generativeai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    
    #uploads file to google server
    uploaded_file = generativeai.upload_file(path=file_path)

    #create instance of model 
    model = generativeai.GenerativeModel('gemini-2.0-flash')

    #generate notes 
    prompt = "This is an API test. If you can see this prompt and PDF, say an interesting fact."
    try:
        response = model.generate_content([prompt, uploaded_file])
        return response.text
    except Exception as e:
        print(f"Error generating {e}")
        return ""

    


