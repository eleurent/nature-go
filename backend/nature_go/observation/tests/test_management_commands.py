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

# Helper function to create species with specific content for testing
def create_species_with_content(name, has_illustration=False, has_illustration_transparent=False, has_description=False, has_quiz=False, type=Species.PLANT_TYPE):
    species = Species.objects.create(
        scientificNameWithoutAuthor=f"{name} scientific",
        commonNames=[name],
        type=type
    )

    if has_illustration:
        img = Image.new('RGB', (60, 30), color='red')
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        species.illustration.save(f'{name}_dummy.png', ContentFile(buffer.getvalue()), save=False)

    if has_illustration_transparent:
        img_trans = Image.new('RGBA', (60, 30), color=(0, 255, 0, 0)) # Transparent green
        buffer_trans = BytesIO()
        img_trans.save(buffer_trans, format='PNG')
        species.illustration_transparent.save(f'{name}_dummy_transparent.png', ContentFile(buffer_trans.getvalue()), save=False)

    if has_description:
        species.descriptions = ['Test description for ' + name]
        # To test audio description deletion as well, one could add:
        # species.audio_description.save('dummy_audio.mp3', ContentFile(b"dummy audio data"), save=False)

    species.save() # Save once after all file/field manipulations that don't auto-save

    if has_quiz:
        MultipleChoiceQuestion.objects.create(
            species=species,
            question=f"What is {name}?",
            choices=["Choice A", "Choice B"],
            correct_choice=0
        )
    return species


class DeleteContentCommandTests(TestCase):
    def test_delete_all_no_flags(self):
        species = create_species_with_content("TestSpecies1", has_illustration=True, has_illustration_transparent=True, has_description=True, has_quiz=True)
        # Ensure an observation exists if the command filters by observed species (delete_content does not, but good practice)
        user = User.objects.create_user(username='del_test_user_1', password='password')
        Observation.objects.create(user=user, species=species, image='obs1.jpg', datetime='2023-01-01T00:00:00Z')

        call_command('delete_content')
        species.refresh_from_db()
        self.assertFalse(species.illustration)
        self.assertFalse(species.illustration_transparent)
        self.assertEqual(species.descriptions, [])
        # self.assertFalse(species.audio_description) # If testing audio description
        self.assertFalse(MultipleChoiceQuestion.objects.filter(species=species).exists())

    def test_delete_illustrations_only(self):
        species = create_species_with_content("TestSpecies2", has_illustration=True, has_illustration_transparent=True, has_description=True, has_quiz=True)
        call_command('delete_content', '--illustrations')
        species.refresh_from_db()
        self.assertFalse(species.illustration)
        self.assertTrue(species.illustration_transparent)
        self.assertTrue(species.descriptions)
        self.assertTrue(MultipleChoiceQuestion.objects.filter(species=species).exists())

    def test_delete_illustrations_transparent_only(self):
        species = create_species_with_content("TestSpecies3", has_illustration=True, has_illustration_transparent=True, has_description=True, has_quiz=True)
        call_command('delete_content', '--illustrations-transparent')
        species.refresh_from_db()
        self.assertTrue(species.illustration)
        self.assertFalse(species.illustration_transparent)
        self.assertTrue(species.descriptions)
        self.assertTrue(MultipleChoiceQuestion.objects.filter(species=species).exists())

    def test_delete_descriptions_only(self):
        species = create_species_with_content("TestSpecies4", has_illustration=True, has_illustration_transparent=True, has_description=True, has_quiz=True)
        call_command('delete_content', '--descriptions')
        species.refresh_from_db()
        self.assertTrue(species.illustration)
        self.assertTrue(species.illustration_transparent)
        self.assertEqual(species.descriptions, [])
        self.assertTrue(MultipleChoiceQuestion.objects.filter(species=species).exists())

    def test_delete_quiz_only(self):
        species = create_species_with_content("TestSpecies5", has_illustration=True, has_illustration_transparent=True, has_description=True, has_quiz=True)
        call_command('delete_content', '--quiz')
        species.refresh_from_db()
        self.assertTrue(species.illustration)
        self.assertTrue(species.illustration_transparent)
        self.assertTrue(species.descriptions)
        self.assertFalse(MultipleChoiceQuestion.objects.filter(species=species).exists())

    def test_delete_multiple_flags(self):
        species = create_species_with_content("TestSpecies6", has_illustration=True, has_illustration_transparent=True, has_description=True, has_quiz=True)
        call_command('delete_content', '--illustrations', '--quiz')
        species.refresh_from_db()
        self.assertFalse(species.illustration)
        self.assertTrue(species.illustration_transparent)
        self.assertTrue(species.descriptions)
        self.assertFalse(MultipleChoiceQuestion.objects.filter(species=species).exists())

    def test_delete_non_existent_content(self):
        species = create_species_with_content("TestSpecies7", has_illustration=False, has_illustration_transparent=False, has_description=False, has_quiz=False)
        out = StringIO()
        # It's important that delete_content doesn't require species to be "observed"
        # If it did, this test might fail to find the species unless an observation is created.
        # The delete_content command as written iterates all Species or all Questions.
        call_command('delete_content', '--illustrations', '--descriptions', '--quiz', '--illustrations-transparent', stdout=out)
        species.refresh_from_db()
        self.assertFalse(species.illustration)
        self.assertFalse(species.illustration_transparent)
        self.assertEqual(species.descriptions, [])
        self.assertFalse(MultipleChoiceQuestion.objects.filter(species=species).exists())

        output = out.getvalue()
        self.assertIn("No illustrations found to delete.", output)
        # If the species itself doesn't have transparent illustration field set, it won't be in the queryset.
        # The message "No transparent illustrations found to delete." comes from the queryset being empty.
        self.assertIn("No transparent illustrations found to delete.", output)
        self.assertIn("No descriptions found to delete.", output)
        self.assertIn("No quiz questions found to delete.", output)

# The old GenerateContentCommandTest class is replaced by GenerateContentCommandTests.
# Ensure all necessary imports for patching are present at the top of the file if not already.
# from unittest.mock import patch, ANY (ANY is already imported via `call` or `MagicMock`)

class GenerateContentCommandTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='gentestuser', password='password')
        self.observed_species = Species.objects.create(
            scientificNameWithoutAuthor='Generatorus testus',
            commonNames=['Generator Test Species'],
            type=Species.PLANT_TYPE,
        )
        Observation.objects.create(user=self.user, species=self.observed_species, image='gen_test.jpg', datetime='2023-01-01T00:00:00Z')

    def _get_dummy_image_bytes(self, color='blue'):
        img = Image.new('RGB', (60, 30), color=color)
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        return buffer.getvalue()

    # Patching the service functions as they are imported in the command module
    @patch('observation.management.commands.generate_content.generate_questions')
    @patch('observation.management.commands.generate_content.generate_descriptions')
    @patch('observation.management.commands.generate_content.generate_illustration_transparent')
    @patch('observation.management.commands.generate_content.generate_illustration')
    # Mocks for utilities that are passed into the service functions by the command
    @patch('observation.management.commands.generate_content.gemini_generate_text_func')
    @patch('observation.management.commands.generate_content.replicate_remove_background') # Changed
    @patch('observation.management.commands.generate_content.generate_image') # This is passed to generate_illustration
    def test_generate_all_no_flags(self, mock_util_generate_image, mock_util_replicate_remove_bg, mock_util_gemini_text, # Changed
                                   mock_svc_generate_illustration, mock_svc_generate_transparent,
                                   mock_svc_generate_descriptions, mock_svc_generate_questions):

        # Configure service mocks to indicate success and simulate behavior (e.g., saving files)
        mock_svc_generate_illustration.return_value = True # Assumes service saves file and returns True
        mock_svc_generate_transparent.return_value = True # Assumes service saves file and returns True
        mock_svc_generate_descriptions.return_value = (["Generated Description"], None) # Simulates service returning descriptions
        mock_svc_generate_questions.return_value = ([{"question": "Q Gen?", "choices": ["A", "B"], "correct_choice": 0}], None) # Simulates service

        # (The utility mocks mock_util_... will be implicitly used by the actual services if we weren't mocking services)
        # Since we *are* mocking the service functions directly, we don't need to set up return values for utility mocks here,
        # unless the *command itself* uses them before passing to services, which it doesn't.

        call_command('generate_content')

        mock_svc_generate_illustration.assert_called_once_with(mock_util_generate_image, self.observed_species)
        mock_svc_generate_transparent.assert_called_once_with(mock_util_replicate_remove_bg, self.observed_species) # Changed
        mock_svc_generate_descriptions.assert_called_once_with(mock_util_gemini_text, self.observed_species)
        mock_svc_generate_questions.assert_called_once_with(mock_util_gemini_text, self.observed_species)

        self.observed_species.refresh_from_db()
        # Assertions depend on the mocked services correctly updating the species instance
        # or the command doing so with the return values.
        # The command currently does:
        #   if generate_illustration(...): illustrations_generated_count += 1 (no direct save in command)
        #   if generate_illustration_transparent(...): illustrations_transparent_generated_count += 1 (no direct save)
        #   descriptions, _ = generate_descriptions(...); species.descriptions = descriptions; species.save()
        #   questions, _ = generate_questions(...); MultipleChoiceQuestion.objects.create(...)
        # So, illustration files are expected to be saved by the (mocked) services.
        # Descriptions and Questions are saved by the command.

        # To make this test pass, the mocked services for illustrations need to simulate saving.
        # We can do this by assigning to species fields within the mock's side_effect if needed.
        # For simplicity, let's assume return_value = True implies they did their job.
        # The command doesn't save illustrations directly, it relies on the service.
        # We need to mock the service's effect on the database.
        def save_illustration_effect(*args):
            species_arg = args[1]
            species_arg.illustration.save("mock_ill.png", ContentFile(self._get_dummy_image_bytes()), save=True)
            return True
        mock_svc_generate_illustration.side_effect = save_illustration_effect

        def save_transparent_illustration_effect(*args):
            species_arg = args[1]
            species_arg.illustration_transparent.save("mock_trans_ill.png", ContentFile(self._get_dummy_image_bytes(color='green')), save=True)
            return True
        mock_svc_generate_transparent.side_effect = save_transparent_illustration_effect

        # Re-run call_command after setting up side_effects that save images
        # Clear mocks before re-running
        mock_svc_generate_illustration.reset_mock()
        mock_svc_generate_transparent.reset_mock()
        mock_svc_generate_descriptions.reset_mock()
        mock_svc_generate_questions.reset_mock()
        # Need to re-create species as well or clear fields from previous non-effect calls
        self.observed_species.illustration.delete(save=True)
        self.observed_species.illustration_transparent.delete(save=True)
        self.observed_species.descriptions = []
        MultipleChoiceQuestion.objects.filter(species=self.observed_species).delete()
        self.observed_species.save()

        call_command('generate_content') # Call again with side_effects in place

        self.observed_species.refresh_from_db()
        self.assertTrue(self.observed_species.illustration.name)
        self.assertTrue(self.observed_species.illustration_transparent.name)
        self.assertEqual(self.observed_species.descriptions, ["Generated Description"])
        self.assertTrue(MultipleChoiceQuestion.objects.filter(species=self.observed_species, question="Q Gen?").exists())


    @patch('observation.management.commands.generate_content.generate_questions')
    @patch('observation.management.commands.generate_content.generate_descriptions')
    @patch('observation.management.commands.generate_content.generate_illustration_transparent')
    @patch('observation.management.commands.generate_content.generate_illustration')
    def test_generate_illustrations_only(self, mock_svc_generate_illustration, mock_svc_generate_transparent,
                                         mock_svc_generate_descriptions, mock_svc_generate_questions):
        def save_illustration_effect(*args):
            args[1].illustration.save("mock_ill.png", ContentFile(self._get_dummy_image_bytes()), save=True)
            return True
        mock_svc_generate_illustration.side_effect = save_illustration_effect

        call_command('generate_content', '--illustrations')

        mock_svc_generate_illustration.assert_called_once_with(ANY, self.observed_species) # ANY for generate_image util
        mock_svc_generate_transparent.assert_not_called()
        mock_svc_generate_descriptions.assert_not_called()
        mock_svc_generate_questions.assert_not_called()

        self.observed_species.refresh_from_db()
        self.assertTrue(self.observed_species.illustration.name)
        self.assertFalse(self.observed_species.illustration_transparent.name)
        self.assertEqual(self.observed_species.descriptions, [])
        self.assertFalse(MultipleChoiceQuestion.objects.filter(species=self.observed_species).exists())

    @patch('observation.management.commands.generate_content.generate_questions')
    @patch('observation.management.commands.generate_content.generate_descriptions')
    @patch('observation.management.commands.generate_content.generate_illustration_transparent')
    @patch('observation.management.commands.generate_content.generate_illustration')
    def test_generate_illustrations_transparent_only_base_exists(self, mock_svc_generate_illustration, mock_svc_generate_transparent,
                                                              mock_svc_generate_descriptions, mock_svc_generate_questions):
        # Manually give it a base illustration
        self.observed_species.illustration.save('base.png', ContentFile(self._get_dummy_image_bytes(color='red')), save=True)

        def save_transparent_effect(*args):
            args[1].illustration_transparent.save("mock_trans.png", ContentFile(self._get_dummy_image_bytes(color='green')), save=True)
            return True
        mock_svc_generate_transparent.side_effect = save_transparent_effect

        call_command('generate_content', '--illustrations-transparent')

        mock_svc_generate_illustration.assert_not_called()
        mock_svc_generate_transparent.assert_called_once_with(ANY, self.observed_species) # ANY for remove_background_by_pixel
        mock_svc_generate_descriptions.assert_not_called()
        mock_svc_generate_questions.assert_not_called()

        self.observed_species.refresh_from_db()
        self.assertTrue(self.observed_species.illustration.name) # Should still be there
        self.assertTrue(self.observed_species.illustration_transparent.name)
        self.assertEqual(self.observed_species.descriptions, [])
        self.assertFalse(MultipleChoiceQuestion.objects.filter(species=self.observed_species).exists())

    @patch('observation.management.commands.generate_content.generate_questions')
    @patch('observation.management.commands.generate_content.generate_descriptions')
    @patch('observation.management.commands.generate_content.generate_illustration_transparent')
    @patch('observation.management.commands.generate_content.generate_illustration')
    def test_generate_illustrations_transparent_only_base_not_exists(self, mock_svc_generate_illustration, mock_svc_generate_transparent,
                                                                   mock_svc_generate_descriptions, mock_svc_generate_questions):
        self.assertFalse(self.observed_species.illustration) # Ensure no base illustration

        call_command('generate_content', '--illustrations-transparent')

        mock_svc_generate_illustration.assert_not_called()
        mock_svc_generate_transparent.assert_not_called()
        mock_svc_generate_descriptions.assert_not_called()
        mock_svc_generate_questions.assert_not_called()

        self.observed_species.refresh_from_db()
        self.assertFalse(self.observed_species.illustration.name)
        self.assertFalse(self.observed_species.illustration_transparent.name)

    @patch('observation.management.commands.generate_content.generate_questions')
    @patch('observation.management.commands.generate_content.generate_descriptions')
    @patch('observation.management.commands.generate_content.generate_illustration_transparent')
    @patch('observation.management.commands.generate_content.generate_illustration')
    def test_generate_illustrations_and_transparent(self, mock_svc_generate_illustration, mock_svc_generate_transparent,
                                                  mock_svc_generate_descriptions, mock_svc_generate_questions):
        def save_illustration_effect(*args):
            args[1].illustration.save("mock_ill.png", ContentFile(self._get_dummy_image_bytes()), save=True)
            return True
        mock_svc_generate_illustration.side_effect = save_illustration_effect

        def save_transparent_effect(*args):
            args[1].illustration_transparent.save("mock_trans.png", ContentFile(self._get_dummy_image_bytes(color='green')), save=True)
            return True
        mock_svc_generate_transparent.side_effect = save_transparent_effect

        call_command('generate_content', '--illustrations', '--illustrations-transparent')

        mock_svc_generate_illustration.assert_called_once_with(ANY, self.observed_species)
        mock_svc_generate_transparent.assert_called_once_with(ANY, self.observed_species)
        mock_svc_generate_descriptions.assert_not_called()
        mock_svc_generate_questions.assert_not_called()

        self.observed_species.refresh_from_db()
        self.assertTrue(self.observed_species.illustration.name)
        self.assertTrue(self.observed_species.illustration_transparent.name)

    @patch('observation.management.commands.generate_content.generate_questions')
    @patch('observation.management.commands.generate_content.generate_descriptions')
    @patch('observation.management.commands.generate_content.generate_illustration_transparent')
    @patch('observation.management.commands.generate_content.generate_illustration')
    def test_generate_skip_existing_content(self, mock_svc_generate_illustration, mock_svc_generate_transparent,
                                           mock_svc_generate_descriptions, mock_svc_generate_questions):
        # Clean up species from setUp to avoid interference
        self.observed_species.delete()
        User.objects.filter(username='gentestuser').delete() # clean user too

        # Create a new user for this test
        user_for_skip_test = User.objects.create_user(username='skipuser', password='password')

        # Use the helper to create a species that already has all content
        fully_loaded_species = create_species_with_content(
            name="FullyLoadedObserved",
            has_illustration=True,
            has_illustration_transparent=True,
            has_description=True,
            has_quiz=True
        )
        # Make it observed
        Observation.objects.create(user=user_for_skip_test, species=fully_loaded_species, image='fully_loaded.jpg', datetime='2023-01-01T00:00:00Z')

        call_command('generate_content') # No flags, should try to generate all

        # Assert that none of the generation service functions were called
        mock_svc_generate_illustration.assert_not_called()
        mock_svc_generate_transparent.assert_not_called()
        mock_svc_generate_descriptions.assert_not_called()
        mock_svc_generate_questions.assert_not_called()

        fully_loaded_species.refresh_from_db()
        self.assertTrue(fully_loaded_species.illustration.name)
        self.assertTrue(fully_loaded_species.illustration_transparent.name)
        self.assertTrue(fully_loaded_species.descriptions)
        self.assertTrue(MultipleChoiceQuestion.objects.filter(species=fully_loaded_species).exists())
