from django.core.management.base import BaseCommand
from observation.models import Species
from university.models import MultipleChoiceQuestion

class Command(BaseCommand):
    help = 'Deletes all saved descriptions and related quiz questions from all Species.'

    def handle(self, *args, **options):
        for species in Species.objects.all():
            species.descriptions = []  # Changed from species.description = ""
            species.save()

            MultipleChoiceQuestion.objects.filter(species=species).delete()

        self.stdout.write(self.style.SUCCESS('Successfully deleted all species descriptions and related quiz questions.'))
