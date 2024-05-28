import google.generativeai as genai
from identification.gemini import CONFIGURED, configure

def generate_text(contents, model_name='models/gemini-1.5-flash-latest'):
    if not CONFIGURED: configure()
    model = genai.GenerativeModel(model_name=model_name)
    response = model.generate_content(contents)
    return response.text
