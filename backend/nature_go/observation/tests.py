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
            name='Test Species',
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
