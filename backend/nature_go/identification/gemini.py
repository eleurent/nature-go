import json
import requests
import io
import os
import PIL.Image
import google.generativeai as genai
from observation.models import Species, IdentificationCandidate, IdentificationResponse
from django.db.models import Q

CONFIGURED = False
PROMPT_PREFIX = """Identify the species in the picture, taking metadata into account.
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
        'url': 'https://preview.redd.it/whats-this-bird-v0-sx6m25i5pm0d1.jpeg?width=1080&crop=smart&auto=webp&s=004ec0c9d413ca38001a069172b4e35f729aabec',
        'response': [
            {"commonName": "Common starling", "scientificName": "Sturnus vulgaris", "confidence": 0.60},
            {"commonName": "Spotless starling", "scientificName": "Sturnus unicolor", "confidence": 0.40}
        ],
    },
    {
        'metadata': {
            "latitude": 41.909442,
            "longitude": 12.503025,
        },
        'url': 'https://preview.redd.it/what-kind-of-bird-is-this-sighted-in-rome-italy-v0-wzm5jvwva20d1.jpg?width=1080&crop=smart&auto=webp&s=47eb746fd839673f4cceafa4896dd118d21b897d',
        'response': [
            {"commonName": "Hooded crow", "scientificName": "Corvus cornix", "confidence": 0.9},
            {"commonName": "Carrion crow", "scientificName": "Corvus corone", "confidence": 0.1},
            {"commonName": "Eurasian jay", "scientificName": "Garrulus glandarius", "confidence": 0.05}
        ],
    }
]


def configure():
    google_api_key = os.environ.get('GOOGLE_API_KEY', None)
    genai.configure(api_key=google_api_key)
    CONFIGURED = True


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
    if not CONFIGURED: configure()

    def load_image_from_url(image_url: str) -> PIL.Image:
        response = requests.get(image_url, stream=True)
        return PIL.Image.open(io.BytesIO(response.content))

    multimodal_model = genai.GenerativeModel(model_id, generation_config={"response_mime_type": "application/json"})
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
    response = multimodal_model.generate_content(contents) 

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
