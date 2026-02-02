import json
import requests
import io
import os
import PIL.Image
from google import genai
from google.genai import types
from observation.models import Species, IdentificationCandidate as ModelIdentificationCandidate, IdentificationResponse
from django.db.models import Q
from pydantic import BaseModel

client = None


class IdentificationCandidate(BaseModel):
    commonName: str
    scientificName: str
    confidence: float

PROMPT_PREFIX = """Identify the species in the picture, along with a confidence score in (0, 1), taking metadata into account.

Be comprehensive. Return an empty list if there are no species.

"""

def gemini_identify_few_shot(
    image_path: str,
    location: str,
    model_id: str = 'gemini-3-flash-preview'
):
    """Identify a species though the Gemini API

    Args:
        image_path (str): path to an image file
        location (str): gps coordinates to include as metadata

    Returns:
        str: identification response for the input image
    """

    image = PIL.Image.open(image_path)
    metadata = "Metadata: " + str(location)
    contents = (PROMPT_PREFIX, metadata, image,)

    global client
    if client is None:
        client = genai.Client()
    response = client.models.generate_content(
        model=model_id,
        contents=contents,
        config={
            "response_mime_type": "application/json",
            "response_schema": list[IdentificationCandidate],
        },
    )

    # Parse response
    candidates = []
    candidates_data = json.loads(response.text)
    for candidate_data in candidates_data:
        query = Q(scientificNameWithoutAuthor=candidate_data['scientificName'])
        if not Species.objects.filter(query).exists():
            query |= Q(commonNames__icontains=[candidate_data['commonName']])
        species = Species.objects.filter(query).all()
        candidates.extend([ModelIdentificationCandidate(species=s, confidence=candidate_data['confidence']/len(species)) for s in species])
    return IdentificationResponse(candidates=candidates, raw_response=response.text)
