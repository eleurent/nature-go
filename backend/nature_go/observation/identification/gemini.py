import json
import requests
import PIL.Image
import PIL.ExifTags
import datetime
import os
import requests
import PIL.Image
import PIL.ExifTags
import google.generativeai as genai
import io
from observation.models import Species, IdentificationCandidate, IdentificationResponse
from django.db.models import Q

GOOGLE_API_KEY =  os.environ.get('GOOGLE_API_KEY', None)
BIRD_ID_FEW_SHOTS = {
    '{"commonName": "Common starling", "scientificName": "Sturnus vulgaris"}': 'https://preview.redd.it/whats-this-bird-v0-sx6m25i5pm0d1.jpeg?width=1080&crop=smart&auto=webp&s=004ec0c9d413ca38001a069172b4e35f729aabec',
    '{"commonName": "Eurasian jay", "scientificName": "Garrulus glandarius"}': 'https://preview.redd.it/what-kind-of-bird-is-this-sighted-in-rome-italy-v0-wzm5jvwva20d1.jpg?width=1080&crop=smart&auto=webp&s=47eb746fd839673f4cceafa4896dd118d21b897d'
}
genai.configure(api_key=GOOGLE_API_KEY)


def gemini_identify_few_shot(image_path: str, few_shots: list[tuple[str, str]], model_id: str = 'models/gemini-1.5-flash-latest'):
    """Identify a plant though the plantnet API

    Args:
        image_path (str): path to an image file
        few_shots (list): list of (image_url, expected_response) pairs

    Returns:
        str: response for the input image
    """

    def load_image_from_url(image_url: str) -> PIL.Image:
        response = requests.get(image_url, stream=True)
        return PIL.Image.open(io.BytesIO(response.content))

    multimodal_model = genai.GenerativeModel(model_id)
    contents = [(load_image_from_url(image_url), prompt) for prompt, image_url in few_shots.items()]
    image = PIL.Image.open(image_path)
    contents = list(sum(contents, (image,)))
    response = multimodal_model.generate_content(contents)

    # Parse response
    candidate_data = json.loads(response.text)
    query = Q()
    if 'commonName' in candidate_data:
        query |= Q(commonNames__icontains=[candidate_data['commonName']])
    if 'scientificName' in candidate_data:
        query |= Q(scientificNameWithoutAuthor=candidate_data['scientificName'])
    species = Species.objects.filter(query).all()
    candidates = [IdentificationCandidate(species=s, confidence=1/len(species)) for s in species]
    return IdentificationResponse(candidates=candidates, raw_response=response.text)
