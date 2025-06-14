
from django.test import TestCase
from identification import gemini
from observation.models import Species


class GeminiTestCase(TestCase):
    def setUp(self):
        Species.objects.create(
            type=Species.BIRD_TYPE,
            scientificNameWithoutAuthor='Alcedo atthis',
            commonNames=['Common kingfisher'],
            genus='Alcedo',
            family='Alcedinidae',
        )

    def test_gemini_identification(self):
        image_path = './identification/test_bird_image.jpg'  # TODO: download from link
        location = {}

        response = gemini.gemini_identify_few_shot(
            image_path=image_path,
            location=location,
        )
        print(response)
        self.assertIsNotNone(response)

