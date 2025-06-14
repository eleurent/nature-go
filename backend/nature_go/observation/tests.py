import os
from django.test import TestCase
from django.core.management import call_command
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Species


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
