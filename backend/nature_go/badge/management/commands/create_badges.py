from django.core.management.base import BaseCommand
from badge.models import Badge
from badge.badge import BADGE_LOGICS

class Command(BaseCommand):
    help = "Create badge models based on the badge logic registry."

    def handle(self, *args, **options):
        for badge_logic in BADGE_LOGICS.values():
            badge, created = Badge.objects.get_or_create(
                name=badge_logic.name,
                description=badge_logic.description,
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Successfully created badge: {badge.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Badge already exists: {badge.name}"))