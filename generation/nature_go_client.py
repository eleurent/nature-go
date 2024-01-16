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
SPECIES_LABELED_URL = BASE_URL + '/api/species/labeled/'
SPECIES_DETAIL_URL = BASE_URL + '/api/species/{species_id}/'
QUESTION_CREATE_URL = BASE_URL + '/api/university/quiz/questions/'

@dataclasses.dataclass
class NatureGoClient:
    username: str
    password: str

    token: str | None = None

    def login(self):
        response = requests.post(LOGIN_URL, json={'username': self.username, 'password': self.password})
        if response.ok:
            logger.info('Login successful')
            self.token = response.json()['token']
        else:
            raise ValueError(f'Login failed with status  {response.status_code} and response {response}')

    def assert_logged_in(self):
        if self.token is None:
            raise ValueError('Client is not logged in')

    def get_all_species(self, limit=100, offset=0, ordering='-occurences_cdf') -> list:
        self.assert_logged_in()
        params = {'limit': limit, 'offset': offset, 'ordering': ordering}
        response = requests.get(SPECIES_LIST_URL, headers={'Authorization': f'Token {self.token}'}, params=params)
        if response.ok:
            result = response.json()
            logger.info(f'Fetched {len(result)} species')
            return result['results']
        else:
            raise ValueError(f'{SPECIES_LIST_URL} failed with status  {response.status_code} and response {response}')

    def get_labeled_species(
            self,
            type: str = '',
            limit: int = 100,
            offset: int = 0,
            illustration: bool | None = None,
            illustration_transparent: bool | None = None,
            descriptions: bool | None = None,
            multiplechoicequestions: bool | None = None,
            ordering: str | list[str] | None = None,
        ) -> list:
        self.assert_logged_in()
        params = {
            'type': type,
            'limit': limit,
            'offset': offset,
            'illustration': illustration,
            'illustration_transparent': illustration_transparent,
            'descriptions': descriptions,
            'multiplechoicequestions': multiplechoicequestions,
            'ordering': ordering,
        }
        params = {k: v for k, v in params.items() if v is not None}
        response = requests.get(SPECIES_LABELED_URL, headers={'Authorization': f'Token {self.token}'}, params=params)
        if response.ok:
            result = response.json()
            logger.info(f'Fetched {len(result)} species')
            return result['results']
        else:
            raise ValueError(f'{SPECIES_LABELED_URL} failed with status  {response.status_code} and response {response}')



    def update_species_image(self, species_id: int, image: Image, image_name: str = 'illustration'):
        self.assert_logged_in()
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        image_base64 = base64.b64encode(buffered.getvalue())
        response = requests.patch(SPECIES_DETAIL_URL.format(species_id=species_id),
                                  headers={'Authorization': f'Token {self.token}'},
                                  data={image_name: image_base64})
        if response.ok:
            logger.info(f'Updated illustration for species {species_id}')
        else:
            raise ValueError(f'{SPECIES_DETAIL_URL} failed with status  {response.status_code} and response {response.content}')

        
    def update_species_field(self, species_id: int, key: str, value):
        self.assert_logged_in()

        response = requests.patch(SPECIES_DETAIL_URL.format(species_id=species_id),
                                headers={'Authorization': f'Token {self.token}'},
                                json={key: value})
        
        if response.ok:
            logger.info(f'Updated {key} for species {species_id}')
        else:
            raise ValueError(f'{SPECIES_DETAIL_URL} failed with status  {response.status_code} and response {response.content}')  
    
    def get_all_questions(self) -> list:
        self.assert_logged_in()
        response = requests.get(QUESTION_CREATE_URL, headers={'Authorization': f'Token {self.token}'})
        if response.ok:
            result = response.json()
            logger.info(f'Fetched {len(result)} species')
            return result
        else:
            raise ValueError(f'{QUESTION_CREATE_URL} failed with status  {response.status_code} and response {response}')

        
    def post_species_questions(self, species_id: int, questions: list):
        self.assert_logged_in()
        
        for question in questions:
            response = requests.post(QUESTION_CREATE_URL,
                                    headers={'Authorization': f'Token {self.token}'},
                                    json={
                                        'species': species_id,
                                        **question})
            if response.ok:
                logger.info(f'Posted questions for species {species_id}')
            else:
                raise ValueError(f'{QUESTION_CREATE_URL} failed with status  {response.status_code} and response {response.content}')
        
    def post_species_descriptions(self, species_id: int, descriptions: dict):
        self.update_species_field(species_id, 'descriptions', 
            [
                descriptions['short_summary'],
                descriptions['medium_summary'],
                descriptions['long_summary']
            ]
        )