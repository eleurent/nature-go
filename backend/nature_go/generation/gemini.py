import os
from google import genai
from google.genai import types

client = genai.Client()

def generate_text(contents, model_name='gemini-2.0-flash'):
    response = client.models.generate_content(model=model_name, contents=contents, config=types.GenerateContentConfig(response_mime_type="application/json"))
    return response.text
