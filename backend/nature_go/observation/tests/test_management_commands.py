from io import StringIO
from django.core.management import call_command
from django.test import TestCase
from django.contrib.auth.models import User
from observation.models import Species, Observation
from university.models import MultipleChoiceQuestion
from unittest.mock import patch, MagicMock, ANY, call
from django.core.files.base import ContentFile
from PIL import Image
from io import BytesIO

# Import original functions for use with 'wraps'
from generation.illustration_generation import generate_illustration as original_generate_illustration
from generation.illustration_generation import generate_illustration_transparent as original_generate_illustration_transparent
from generation.description_generation import generate_descriptions as original_generate_descriptions
from generation.question_generation import generate_questions as original_generate_questions

class GenerateContentCommandTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.species1 = Species.objects.create(
            scientificNameWithoutAuthor='Speciesus testus1',
            commonNames=['Test Species 1'],
            type=Species.PLANT_TYPE,
        )
        self.species2 = Species.objects.create(
            scientificNameWithoutAuthor='Speciesus testus2',
            commonNames=['Test Species 2'],
            type=Species.BIRD_TYPE,
            descriptions=['Existing description'],
        )
        with open("dummy_illustration_s2.png", "wb") as f:
            f.write(b"dummy image data")
        # Ensure the illustration field has a name for "exists" check
        self.species2.illustration.save("species2_existing.png", ContentFile(b"dummy data for s2 illustration"), save=True)


        self.species3 = Species.objects.create(
            scientificNameWithoutAuthor='Speciesus unobserved',
            commonNames=['Unobserved Species'],
            type=Species.PLANT_TYPE,
        )
        Observation.objects.create(user=self.user, species=self.species1, image='test.jpg', datetime='2023-01-01T00:00:00Z')
        Observation.objects.create(user=self.user, species=self.species2, image='test2.jpg', datetime='2023-01-01T00:00:00Z')

    @patch('generation.gemini.generate_image')
    @patch('generation.gemini.generate_text')
    @patch('university.models.MultipleChoiceQuestion.objects.create')
    # Patches for service functions at their definition location, using 'wraps'
    # The order of mock arguments in the test method must be reverse of decorators:
    # innermost is first arg. So, mock_service_gen_questions is first.
    @patch('generation.question_generation.generate_questions', wraps=original_generate_questions)
    @patch('generation.description_generation.generate_descriptions', wraps=original_generate_descriptions)
    @patch('generation.illustration_generation.generate_illustration', wraps=original_generate_illustration)
    @patch('generation.illustration_generation.generate_illustration_transparent', wraps=original_generate_illustration_transparent)
    def test_generate_all_content_no_options(self,
                                             mock_service_gen_ill_transparent, # Patched with wraps
                                             mock_service_gen_illustration,    # Patched with wraps
                                             mock_service_gen_descriptions,  # Patched with wraps
                                             mock_service_gen_questions,     # Patched with wraps
                                             mock_mcq_create,
                                             mock_api_generate_text,
                                             mock_api_generate_image
                                             ):
        # --- Configure mock_api_generate_text & mock_api_generate_image ---
        # These mocks will be passed as arguments to the *original* service functions
        # because the service function mocks are configured with 'wraps=True' and the command
        # passes these gemini mocks to them.

        mock_api_generate_text.side_effect = [
            '{"text_output_key": ["value from mock_api_generate_text"]}',
            '[{"question": "Q1 S1 from api_mock?", "choices": ["A", "B"], "correct_choice": 0}]',
            '[{"question": "Q1 S2 from api_mock?", "choices": ["C", "D"], "correct_choice": 1}]',
        ]

        image_pil = Image.new('RGBA', (10, 10), (0,0,0,0))
        byte_io = BytesIO()
        image_pil.save(byte_io, 'PNG')
        valid_png_bytes = byte_io.getvalue()
        mock_api_generate_image.return_value = valid_png_bytes

        # The service mocks (mock_service_gen_illustration, etc.) will now automatically
        # call their respective original functions because of 'wraps=True'.
        # Their internal debug prints should now appear in the command_output.

        # --- Call the command ---
        out = StringIO()
        call_command('generate_content', stdout=out)

        command_output = out.getvalue()
        print("--- Command Output START ---")
        print(command_output)
        print("--- Command Output END ---")

        # --- Assertions ---
        # Check that the service mocks (which wrap the original functions) were called
        mock_service_gen_illustration.assert_called_once_with(mock_api_generate_image, self.species1)
        mock_service_gen_ill_transparent.assert_called_once_with(self.species1)
        mock_service_gen_descriptions.assert_called_once_with(mock_api_generate_text, self.species1)
        mock_service_gen_questions.assert_any_call(mock_api_generate_text, self.species1)
        mock_service_gen_questions.assert_any_call(mock_api_generate_text, self.species2)
        self.assertEqual(mock_service_gen_questions.call_count, 2) # Should be 2 if no recursion

        # Check if the "bool object is not callable" error is ABSENT from the output
        self.assertNotIn("'bool' object is not callable", command_output)

        # If the original functions complete successfully (using the mocked gemini.generate_text),
        # then data should be saved to DB (Species.save is not mocked).
        self.species1.refresh_from_db()
        self.assertTrue(self.species1.illustration is not None and self.species1.illustration.name != '', "Species1 illustration not saved")
        self.assertTrue(self.species1.illustration_transparent is not None and self.species1.illustration_transparent.name != '', "Species1 transparent illustration not saved")
        self.assertEqual(self.species1.descriptions, ["value from mock_api_generate_text"])

        mock_mcq_create.assert_any_call(species=self.species1, question='Q1 S1 from api_mock?', choices=['A', 'B'], correct_choice=0)
        mock_mcq_create.assert_any_call(species=self.species2, question='Q1 S2 from api_mock?', choices=['C', 'D'], correct_choice=1)
        self.assertEqual(mock_mcq_create.call_count, 2)

        # Check that mock_api_generate_text was called by the original service functions
        self.assertEqual(mock_api_generate_text.call_count, 3)
        mock_api_generate_image.assert_called_once()

    # Placeholder for other tests
    def test_placeholder_other_tests_pending(self):
        pass
