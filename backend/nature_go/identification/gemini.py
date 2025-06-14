import json
import requests
import io
import os
import PIL.Image
from google import genai
from google.genai import types
from observation.models import Species, IdentificationCandidate, IdentificationResponse
from django.db.models import Q

client = None
PROMPT_PREFIX = """Identify the species in the picture, taking metadata into account.

Be comprehensive. Return an empty list if there are no species.

Use this JSON schema:
  Result = {"commonName": str, "scientificName": str, "confidence": float}

Return: list[Result].

"""
# Metadata, url, response
BIRD_ID_FEW_SHOTS = [
    {
        'metadata': {
            "latitude": 51.495780,
            "longitude": -0.176399,
        },
        'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Beaumaris_Castle_2015_123.jpg/1080px-Beaumaris_Castle_2015_123.jpg',
        'response': [
            {"commonName": "Common starling", "scientificName": "Sturnus vulgaris", "confidence": 0.70},
            {"commonName": "Spotless starling", "scientificName": "Sturnus unicolor", "confidence": 0.10},
            {"commonName": "Eurasian jackdaw", "scientificName": "Coloeus monedula", "confidence": 0.05},
            {"commonName": "Common Grackle", "scientificName": "Quiscalus quiscula", "confidence": 0.01},
        ],
    },
    {
        'metadata': {
            "latitude": 41.909442,
            "longitude": 12.503025,
        },
        'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flying_Crow.jpg/720px-Flying_Crow.jpg',
        'response': [
            {"commonName": "Hooded crow", "scientificName": "Corvus cornix", "confidence": 0.9},
            {"commonName": "Carrion crow", "scientificName": "Corvus corone", "confidence": 0.1},
            {"commonName": "Eurasian jay", "scientificName": "Garrulus glandarius", "confidence": 0.02},
        ],
    }
]


def gemini_identify_few_shot(
    image_path: str,
    location: str,
    few_shots: list[dict[str, str]],
    model_id: str = 'models/gemini-1.5-flash-latest'
):
    """Identify a species though the Gemini API

    Args:
        image_path (str): path to an image file
        few_shots (list): list of {metadata, image_url, expected_response} dicts

    Returns:
        str: response for the input image
    """

    def load_image_from_url(image_url: str) -> PIL.Image:
        headers = {
            'User-Agent': 'NatureGo/1.0 (https://nature-go.edouardleurent.com; eleurent@gmail.com)'
        }
        response = requests.get(image_url, stream=True, headers=headers)
        return PIL.Image.open(io.BytesIO(response.content))

    examples = [
        (
            str(few_shot['metadata']),
            load_image_from_url(few_shot['url']),
            str(few_shot['response'])
        )
        for few_shot in few_shots]
    image = PIL.Image.open(image_path)
    metadata = str(location)
    contents = (PROMPT_PREFIX,) + sum(examples, ()) + (metadata, image,)

    global client
    if client is None:
        client = genai.Client()
    response = client.models.generate_content(
        model=model_id,
        contents=contents,
        generation_config=types.GenerateContentConfig(response_mime_type="application/json")
    )

    # Parse response
    candidates = []
    candidates_data = json.loads(response.text)
    for candidate_data in candidates_data:
        query = Q(scientificNameWithoutAuthor=candidate_data['scientificName'])
        if not Species.objects.filter(query).exists():
            query |= Q(commonNames__icontains=[candidate_data['commonName']])
        species = Species.objects.filter(query).all()
        candidates.extend([IdentificationCandidate(species=s, confidence=candidate_data['confidence']/len(species)) for s in species])
    return IdentificationResponse(candidates=candidates, raw_response=response.text)
