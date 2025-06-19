from django.core.management.base import BaseCommand
from observation.models import Species
from university.models import MultipleChoiceQuestion

class Command(BaseCommand):
    help = 'Deletes specified content (illustrations, transparent illustrations, descriptions, quiz questions) for Species.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--illustrations',
            action='store_true',
            help='Delete all illustration files.'
        )
        parser.add_argument(
            '--illustrations-transparent',
            action='store_true',
            help='Delete all transparent illustration files.'
        )
        parser.add_argument(
            '--descriptions',
            action='store_true',
            help='Delete all species descriptions.'
        )
        parser.add_argument(
            '--quiz',
            action='store_true',
            help='Delete all quiz questions.'
        )

    def handle(self, *args, **options):
        delete_illustrations = options['illustrations']
        delete_illustrations_transparent = options['illustrations_transparent']
        delete_descriptions = options['descriptions']
        delete_quiz = options['quiz']

        # If no specific flag is set, default to deleting all content types
        no_flags_set = not (delete_illustrations or delete_illustrations_transparent or delete_descriptions or delete_quiz)
        if no_flags_set:
            delete_illustrations = True
            delete_illustrations_transparent = True
            delete_descriptions = True
            delete_quiz = True

        content_deleted = False

        if delete_illustrations:
            species_with_illustrations = Species.objects.filter(illustration__isnull=False)
            if species_with_illustrations.exists():
                for species in species_with_illustrations:
                    if species.illustration:
                        species.illustration.delete(save=False)
                        self.stdout.write(self.style.SUCCESS(f"Successfully deleted illustration for {species.name}"))
                        species.save() # Save after this specific modification
                        content_deleted = True
                self.stdout.write(self.style.SUCCESS("Finished deleting illustrations."))
            else:
                self.stdout.write(self.style.WARNING("No illustrations found to delete."))


        if delete_illustrations_transparent:
            species_with_transparent_illustrations = Species.objects.filter(illustration_transparent__isnull=False)
            if species_with_transparent_illustrations.exists():
                for species in species_with_transparent_illustrations:
                    if species.illustration_transparent:
                        species.illustration_transparent.delete(save=False)
                        self.stdout.write(self.style.SUCCESS(f"Successfully deleted transparent illustration for {species.name}"))
                        species.save() # Save after this specific modification
                        content_deleted = True
                self.stdout.write(self.style.SUCCESS("Finished deleting transparent illustrations."))
            else:
                self.stdout.write(self.style.WARNING("No transparent illustrations found to delete."))

        if delete_descriptions:
            # We need to iterate species by species to handle audio description and save individually
            species_with_descriptions = Species.objects.exclude(descriptions__exact=[]).exclude(descriptions__isnull=True)
            # Also consider species that only have audio descriptions
            species_with_audio_description = Species.objects.filter(audio_description__isnull=False).exclude(audio_description__exact='')

            processed_species_ids = set()

            if species_with_descriptions.exists() or species_with_audio_description.exists():
                # Combine querysets and remove duplicates
                all_relevant_species_ids = set(species_with_descriptions.values_list('id', flat=True)) | set(species_with_audio_description.values_list('id', flat=True))

                for species_id in all_relevant_species_ids:
                    species = Species.objects.get(id=species_id)
                    modified = False
                    if species.descriptions and species.descriptions != []:
                        species.descriptions = []
                        self.stdout.write(self.style.SUCCESS(f"Successfully deleted text descriptions for {species.name}"))
                        modified = True
                        content_deleted = True

                    if species.audio_description:
                        species.audio_description.delete(save=False)
                        self.stdout.write(self.style.SUCCESS(f"Successfully deleted audio description for {species.name}"))
                        modified = True
                        content_deleted = True

                    if modified:
                        species.save()
                self.stdout.write(self.style.SUCCESS("Finished deleting descriptions."))
            else:
                self.stdout.write(self.style.WARNING("No descriptions found to delete."))

        if delete_quiz:
            questions = MultipleChoiceQuestion.objects.all()
            if questions.exists():
                count = questions.count()
                questions.delete()
                self.stdout.write(self.style.SUCCESS(f"Successfully deleted {count} quiz questions."))
                content_deleted = True
            else:
                self.stdout.write(self.style.WARNING("No quiz questions found to delete."))

        if content_deleted:
            self.stdout.write(self.style.SUCCESS("Content deletion process finished."))
        elif not no_flags_set : # Some flags were set but no content found for them
             self.stdout.write(self.style.WARNING("No content found for the specified flags."))
        # If no_flags_set is true and content_deleted is false, it means the database was empty.
        # The individual messages for each content type already cover this.
        elif no_flags_set and not content_deleted:
            self.stdout.write(self.style.SUCCESS("No content found in the database to delete."))
