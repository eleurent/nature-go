import os
# import os # Duplicate os import removed
from django.urls import reverse # Kept: Potentially useful for other API tests
# from django.contrib.auth.models import User # Removed: Was for TestGenerateAudioDescriptionView
from django.core.management import call_command
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.base import ContentFile # For potential future use if checking file content
# from rest_framework.test import APITestCase # Removed: Was for TestGenerateAudioDescriptionView
from rest_framework import status # Kept: Potentially useful for other API tests
# from unittest.mock import patch # Removed: Was for TestGenerateAudioDescriptionView

from django.test import TestCase # Ensure TestCase is imported
from .models import Species
# from .serializers import SpeciesSerializer # If we need to assert serializer output structure


class DeleteSpeciesIllustrationsCommandTest(TestCase):
    def setUp(self):
        # Create dummy illustration files
        self.illustration_file = SimpleUploadedFile(
            name='illustration.jpg',
            content=b'dummy content for illustration',
            content_type='image/jpeg'
        )
        self.illustration_transparent_file = SimpleUploadedFile(
            name='illustration_transparent.png',
            content=b'dummy content for transparent illustration',
            content_type='image/png'
        )

        # Create a Species object with illustrations
        self.species = Species.objects.create(
            scientificNameWithoutAuthor='Test Species Old',
            type=Species.PLANT_TYPE, # Added type as it's a required field
            illustration=self.illustration_file,
            illustration_transparent=self.illustration_transparent_file
        )
        # Store file paths
        self.illustration_path = self.species.illustration.path
        self.illustration_transparent_path = self.species.illustration_transparent.path

    def test_delete_illustrations_command(self):
        # Call the management command
        call_command('delete_species_illustrations')

        # Refresh the species object from the database
        self.species.refresh_from_db()

        # Assert that the illustration fields are empty
        self.assertFalse(self.species.illustration)
        self.assertFalse(self.species.illustration_transparent)

        # Assert that the files no longer exist on the file system
        self.assertFalse(os.path.exists(self.illustration_path))
        self.assertFalse(os.path.exists(self.illustration_transparent_path))


from university.models import MultipleChoiceQuestion # Ensure this import is present or added

class DeleteSpeciesDescriptionQuizCommandTest(TestCase): # Renamed class
    def setUp(self):
        # Create Species 1
        self.species1 = Species.objects.create(
            scientificNameWithoutAuthor="Test Species 1",
            type=Species.PLANT_TYPE,
            descriptions=[{"text": "Description for species 1"}],
            commonNames=["Test Plant 1"]
        )
        MultipleChoiceQuestion.objects.create(
            species=self.species1,
            question="Question 1 for species 1?",
            choices=["A", "B"],
            correct_choice=0
        )

        # Create Species 2
        self.species2 = Species.objects.create(
            scientificNameWithoutAuthor="Test Species 2",
            type=Species.BIRD_TYPE,
            descriptions=[{"text": "Description for species 2"}],
            commonNames=["Test Bird 1"]
        )
        MultipleChoiceQuestion.objects.create(
            species=self.species2,
            question="Question 1 for species 2?",
            choices=["C", "D"],
            correct_choice=1
        )
        MultipleChoiceQuestion.objects.create(
            species=self.species2,
            question="Question 2 for species 2?",
            choices=["E", "F"],
            correct_choice=0
        )

    def test_delete_species_description_quiz_command(self): # Renamed test method
        # Ensure data exists before running the command
        self.assertEqual(Species.objects.count(), 2)
        self.assertTrue(Species.objects.get(id=self.species1.id).descriptions)
        self.assertEqual(MultipleChoiceQuestion.objects.filter(species=self.species1).count(), 1)

        self.assertTrue(Species.objects.get(id=self.species2.id).descriptions)
        self.assertEqual(MultipleChoiceQuestion.objects.filter(species=self.species2).count(), 2)

        # Run the management command
        call_command('delete_species_description_quiz') # Updated command name

        # Assert that descriptions are cleared
        self.species1.refresh_from_db()
        self.assertEqual(self.species1.descriptions, [])

        self.species2.refresh_from_db()
        self.assertEqual(self.species2.descriptions, [])

        # Assert that quiz questions are deleted
        self.assertEqual(MultipleChoiceQuestion.objects.filter(species=self.species1).count(), 0)
        self.assertEqual(MultipleChoiceQuestion.objects.filter(species=self.species2).count(), 0)

        # Ensure species themselves are not deleted
        self.assertEqual(Species.objects.count(), 2)

# Added imports for IllustrationFilenameTest
from io import BytesIO
import re
from unittest.mock import patch, MagicMock
from generation.illustration_generation import generate_illustration, generate_illustration_transparent
# Species, TestCase, and ContentFile are already imported or available from above.

class IllustrationFilenameTest(TestCase):
    def setUp(self):
        self.species = Species.objects.create(
            scientificNameWithoutAuthor='Test Species Name',
            type=Species.PLANT_TYPE,
            commonNames=['Test Plant']
        )
        self.mock_generate_image = MagicMock(return_value=b'dummy image data')

    def tearDown(self):
        Species.objects.all().delete()

    def test_generate_illustration_filename_with_slug(self):
        success = generate_illustration(self.mock_generate_image, self.species)
        self.assertTrue(success, "generate_illustration should return True on success")

        self.assertIsNotNone(self.species.illustration.name, "Illustration name should be set.")
        self.species.refresh_from_db()
        saved_filename = self.species.illustration.name

        expected_pattern = r"^species/illustration/Test_Species_Name_[a-f0-9]{8}_illustration\.png$"
        self.assertIsNotNone(re.match(expected_pattern, saved_filename),
                                 f"Filename '{saved_filename}' does not match pattern '{expected_pattern}'")

    def test_generate_illustration_transparent_filename_with_slug(self):
        initial_illustration_name = 'Test_Species_Name_dummy_illustration.png'
        initial_dummy_content = ContentFile(b'dummy data for initial illustration', name=initial_illustration_name)
        self.species.illustration.save(initial_illustration_name, initial_dummy_content, save=True)
        self.species.refresh_from_db()

        with patch('generation.illustration_generation.Image.open') as mock_image_open, \
             patch('generation.illustration_generation.remove_background_by_pixel') as mock_remove_bg:

            mock_img_instance = MagicMock()
            mock_img_instance.convert.return_value = mock_img_instance
            mock_img_instance.getdata.return_value = []
            mock_img_instance.getpixel.return_value = (0,0,0,0)
            mock_img_instance.save = MagicMock()

            mock_image_open.return_value = mock_img_instance
            mock_remove_bg.return_value = mock_img_instance

            success = generate_illustration_transparent(self.species)
            self.assertTrue(success, "generate_illustration_transparent should return True on success")

        self.assertIsNotNone(self.species.illustration_transparent.name, "Transparent illustration name should be set.")
        self.species.refresh_from_db()
        saved_filename = self.species.illustration_transparent.name

        expected_pattern = r"^species/illustration_transparent/Test_Species_Name_[a-f0-9]{8}_illustration_transparent\.png$"
        self.assertIsNotNone(re.match(expected_pattern, saved_filename),
                                 f"Filename '{saved_filename}' does not match pattern '{expected_pattern}'")
