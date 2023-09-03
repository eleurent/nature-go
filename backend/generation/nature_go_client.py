import dataclasses
import requests
import logging
import io
import base64
from PIL import Image

logger = logging.getLogger(__name__)

BASE_URL = 'http://nature-go.edouardleurent.com'
LOGIN_URL = BASE_URL + '/api/auth/login/'
SPECIES_LIST_URL = BASE_URL + '/api/species/all/'
SPECIES_DETAIL_URL = BASE_URL + '/api/species/{species_id}/'

@dataclasses.dataclass
class NatureGoClient:
    username: str
    password: str

    token: str | None = None

    def login(self):
        response = requests.post(LOGIN_URL, json={'username': self.username, 'password': self.password})
        if response.status_code == 200:
            logger.info('Login successful')
            self.token = response.json()['token']
        else:
            raise ValueError(f'Login failed with status  {response.status_code} and response {response.json()}')

    def get_all_species(self) -> list:
        if self.token is None:
            raise ValueError('Client is not logged in')
        response = requests.get(SPECIES_LIST_URL, headers={'Authorization': f'Token {self.token}'})
        if response.status_code == 200:
            result = response.json()
            logger.info(f'Fetched {len(result)} species')
            return result
        else:
            raise ValueError(f'{SPECIES_LIST_URL} failed with status  {response.status_code} and response {response.json()}')

    def update_species_illustration(self, species_id: int, image: Image, illustration_name: str = 'illustration'):
        if self.token is None:
            raise ValueError('Client is not logged in')
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        image_base64 = base64.b64encode(buffered.getvalue())
        response = requests.patch(SPECIES_DETAIL_URL.format(species_id=species_id),
                                  headers={'Authorization': f'Token {self.token}'},
                                  data={illustration_name: image_base64})
        if response.status_code == 200:
            logger.info(f'Updated illustration for species {species_id}')
        else:
            raise ValueError(f'{SPECIES_DETAIL_URL} failed with status  {response.status_code} and response {response.content}')
