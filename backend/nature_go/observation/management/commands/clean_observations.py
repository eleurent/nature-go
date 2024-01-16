from django.core.management import BaseCommand
from observation.models import Observation
from django.utils import timezone


class Command(BaseCommand):
    help = 'Deletes observations older than N days and no identified species'

    def add_arguments(self, parser):
        parser.add_argument('days', type=int, help='The number of days to look back', default=0)

    def handle(self, *args, **options):
        days_ago = timezone.now() - timezone.timedelta(days=options['days'])
        observations_to_delete = Observation.objects.filter(
            datetime__lt=days_ago,
            species__isnull=True
        )

        count = observations_to_delete.count()
        self.stdout.write(f'Will delete {count} observations. Continue? [Y/n]')
        yes = set(['yes', 'y', 'Y', ''])
        if input().lower() not in yes: return False

        observations_to_delete.delete()

        self.stdout.write(self.style.SUCCESS(f'Deleted {count} observations'))