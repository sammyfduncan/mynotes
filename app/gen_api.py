import os
from google import generativeai
from dotenv import load_dotenv
#utils for llm API

load_dotenv()

#get API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


#hardcoded prompts based on user choice 
PROMPTS = {
    "default" : "Generate well-rounded, informative study notes based on these lecture slides.",
    "concise": "Generate concise study notes based on this lecture.",
    "detailed": "Generate very detailed and well-structured study notes based on this lecture."
}

def gen_notes(file_path : str, style : str) -> str:
    #links api key in .env
    generativeai.configure(api_key=GOOGLE_API_KEY)
    
    #uploads file to google server
    uploaded_file = generativeai.upload_file(path=file_path)

    #create instance of model 
    model = generativeai.GenerativeModel('gemini-2.0-flash')

    #generate notes 
    prompt = PROMPTS.get(style, PROMPTS["default"])

    try:
        response = model.generate_content([prompt, uploaded_file])
        return response.text
    except Exception as e:
        print(f"Error generating {e}")
        return ""




