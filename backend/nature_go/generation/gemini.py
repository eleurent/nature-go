import os
import google.generativeai as genai
CONFIGURED = False

def configure():
    google_api_key = os.environ.get('GOOGLE_API_KEY', None)
    genai.configure(api_key=google_api_key)
    CONFIGURED = True

def generate_text(contents, model_name='models/gemini-1.5-flash-latest'):
    if not CONFIGURED: configure()
    model = genai.GenerativeModel(model_name=model_name, generation_config={"response_mime_type": "application/json"})
    response = model.generate_content(contents)
    return response.text
