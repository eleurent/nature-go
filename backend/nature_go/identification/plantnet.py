import json
import requests
import os
import requests
from observation.models import Species, IdentificationCandidate, IdentificationResponse

PLANTNET_API_KEY = os.environ.get('PLANTNET_API_KEY', None)


def parse_plantnet(plantnet_response: dict) -> IdentificationResponse:
    candidates = []
    for result in plantnet_response['results']:
        species_data = result['species']
        species_data = dict(
            type=Species.PLANT_TYPE,
            scientificNameWithoutAuthor=species_data['scientificNameWithoutAuthor'],
            scientificNameAuthorship=species_data['scientificNameAuthorship'],
            commonNames=species_data['commonNames'],
            genus=species_data['genus']['scientificNameWithoutAuthor'],
            family=species_data['family']['scientificNameWithoutAuthor'],
        )
        species, created = Species.objects.update_or_create(
            scientificNameWithoutAuthor=species_data['scientificNameWithoutAuthor'],
            defaults=species_data)
        candidates.append(IdentificationCandidate(species=species, confidence=result['score']))
    return IdentificationResponse(candidates=candidates)


def plantnet_identify(image_path: str, organ: str, mock: bool = False):
    """Identify a plant though the plantnet API

    Args:
        image_path (str): path to an image file
        organ (str): organ depicted in the image, in [leaf, flower, fruit, bark]
        mock (bool, optional): Mock API call, for testing. Defaults to False.

    Returns:
        dict: PlantNet API response
    """
    if mock:
        return plantnet_identify_mock()
    url = 'https://my-api.plantnet.org/v2/identify/all'
    params = {
        'include-related-images': True,
        'lang': 'en',
        'api-key': PLANTNET_API_KEY
    }
    data = {'organs': [organ]}
    try:
        with open(image_path, 'rb') as image_data:
            files = [
                ('images', (image_path, image_data))
            ]
            response = requests.post(url, files=files, data=data, params=params, timeout=30)
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            # No result found, see https://my.plantnet.org/doc/faq#Rejection
            return IdentificationResponse(candidates=[])
        else:
            raise e

    data = response.json()
    return parse_plantnet(data)


def plantnet_identify_mock():
    return parse_plantnet(json.load(open('observation/identification/mock_plantnet_response.json')))
