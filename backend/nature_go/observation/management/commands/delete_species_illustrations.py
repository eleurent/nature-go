from django.core.management.base import BaseCommand
from backend.nature_go.observation.models import Species

class Command(BaseCommand):
    help = 'Deletes all illustration and illustration_transparent files from all Species objects.'

    def handle(self, *args, **options):
        species_list = Species.objects.all()
        for species in species_list:
            if species.illustration:
                species.illustration.delete(save=False)
                self.stdout.write(self.style.SUCCESS(f"Deleted illustration for {species}"))
            if species.illustration_transparent:
                species.illustration_transparent.delete(save=False)
                self.stdout.write(self.style.SUCCESS(f"Deleted illustration_transparent for {species}"))
            species.save()
        self.stdout.write(self.style.SUCCESS("Successfully deleted all species illustrations."))
