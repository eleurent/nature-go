import google.generativeai as genai

def configure(api_key):
    genai.configure(api_key=api_key)

def generate_text(contents, model_name='models/gemini-1.5-flash-latest'):
    model = genai.GenerativeModel(model_name=model_name)
    response = model.generate_content(contents)
    return response.text