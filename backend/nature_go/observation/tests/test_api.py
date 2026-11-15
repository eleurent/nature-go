from unittest.mock import MagicMock, patch
import requests
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from identification.plantnet import plantnet_identify
from observation.models import IdentificationResponse, Observation, Species


User = get_user_model()


class SpeciesAndPlantNetTests(TestCase):
    def test_rarity_handles_zero_values(self):
        species = Species(
            type=Species.PLANT_TYPE,
            scientificNameWithoutAuthor='Bellis perennis',
            genus='Bellis',
            family='Asteraceae',
            rarity_gpt=0.0,
            occurences_cdf=0.0,
        )
        self.assertEqual(species.rarity, 'Very Common')

    @patch('identification.plantnet.requests.post')
    def test_plantnet_404_returns_empty_identification_response(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 404
        http_err = requests.exceptions.HTTPError(response=mock_response)
        mock_response.raise_for_status.side_effect = http_err
        mock_post.return_value = mock_response

        with patch('builtins.open', MagicMock()):
            result = plantnet_identify('dummy.jpg', 'flower')

        self.assertIsInstance(result, IdentificationResponse)
        self.assertEqual(result.candidates, [])


class ObservationUpdateValidationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='observer', password='StrongPassword123!')
        self.client.force_authenticate(user=self.user)
        self.observation = Observation.objects.create(
            user=self.user,
            image=SimpleUploadedFile('test.jpg', b'img', content_type='image/jpeg'),
            type=Species.PLANT_TYPE,
            organ='flower',
            identification_response={'results': []},
        )

    def test_out_of_range_candidate_index_returns_400(self):
        response = self.client.patch(
            f'/api/species/observation/{self.observation.id}/',
            {'species': 0},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_integer_candidate_index_returns_400(self):
        response = self.client.patch(
            f'/api/species/observation/{self.observation.id}/',
            {'species': 'abc'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
