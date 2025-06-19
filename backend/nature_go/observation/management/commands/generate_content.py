from django.core.management import BaseCommand
from django.conf import settings
from observation.models import Species, Observation
from university.models import MultipleChoiceQuestion
from generation.illustration_generation import generate_illustration, generate_illustration_transparent
from generation.replicate import remove_background as replicate_remove_background
from generation.description_generation import generate_descriptions
from generation.question_generation import generate_questions
from generation.gemini import generate_image, generate_text as gemini_generate_text_func
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generates missing content (illustrations, descriptions, quiz questions) for all observed species.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--illustrations',
            action='store_true',
            help='Generate missing illustrations.'
        )
        parser.add_argument(
            '--illustrations-transparent',
            action='store_true',
            help='Generate missing transparent illustrations (requires base illustration to exist).'
        )
        parser.add_argument(
            '--descriptions',
            action='store_true',
            help='Generate missing descriptions.'
        )
        parser.add_argument(
            '--questions',
            action='store_true',
            help='Generate missing quiz questions.'
        )

    def handle(self, *args, **options):
        # Use different names for the boolean flags to avoid conflict with imported function names
        gen_illustrations_flag = options['illustrations']
        gen_illustrations_transparent_flag = options['illustrations_transparent']
        gen_descriptions_flag = options['descriptions']
        gen_questions_flag = options['questions']

        # If no specific content type is requested, generate all.
        if not any([gen_illustrations_flag, gen_illustrations_transparent_flag, gen_descriptions_flag, gen_questions_flag]):
            gen_illustrations_flag = True
            gen_illustrations_transparent_flag = True
            gen_descriptions_flag = True
            gen_questions_flag = True

        self.stdout.write("Starting content generation...")
        if gen_illustrations_flag:
            self.stdout.write("- Illustrations will be generated.")
        if gen_illustrations_transparent_flag:
            self.stdout.write("- Transparent illustrations will be generated.")
        if gen_descriptions_flag:
            self.stdout.write("- Descriptions will be generated.")
        if gen_questions_flag:
            self.stdout.write("- Quiz questions will be generated.")

        # Fetch all species IDs that have at least one observation
        observed_species_ids = Observation.objects.values_list('species_id', flat=True).distinct()
        observed_species = Species.objects.filter(id__in=observed_species_ids)

        if not observed_species.exists():
            self.stdout.write(self.style.WARNING("No observed species found. Nothing to process."))
            return

        self.stdout.write(f"Found {observed_species.count()} observed species to process.")

        illustrations_generated_count = 0
        illustrations_transparent_generated_count = 0
        descriptions_generated_count = 0
        questions_generated_count = 0

        for species in observed_species:
            self.stdout.write(f"Processing species: {species} (ID: {species.id})")

            if gen_illustrations_flag:
                if not species.illustration:
                    self.stdout.write(f"  Generating illustration for {species}...")
                    try:
                        # Call the original imported generate_illustration function
                        if generate_illustration(generate_image, species):
                            illustrations_generated_count += 1
                            self.stdout.write(self.style.SUCCESS(f"    Successfully generated illustration for {species}."))
                        else:
                            self.stdout.write(self.style.WARNING(f"    Failed to generate illustration for {species}."))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"    Error generating illustration for {species}: {e}"))
                else:
                    self.stdout.write(f"  Illustration already exists for {species}.")

            if gen_illustrations_transparent_flag:
                if species.illustration:
                    if not species.illustration_transparent:
                        self.stdout.write(f"  Generating transparent illustration for {species}...")
                        try:
                            if generate_illustration_transparent(replicate_remove_background, species):
                                illustrations_transparent_generated_count += 1
                                self.stdout.write(self.style.SUCCESS(f"    Successfully generated transparent illustration for {species}."))
                            else:
                                self.stdout.write(self.style.WARNING(f"    Failed to generate transparent illustration for {species}."))
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"    Error generating transparent illustration for {species}: {e}"))
                    else:
                        self.stdout.write(f"  Transparent illustration already exists for {species}.")
                else:
                    self.stdout.write(self.style.WARNING(f"  Cannot generate transparent illustration for {species} because base illustration does not exist."))


            if gen_descriptions_flag:
                if not species.descriptions:
                    self.stdout.write(f"  Generating descriptions for {species}...")
                    try:
                        # Call the original imported generate_descriptions function
                        descriptions, _ = generate_descriptions(gemini_generate_text_func, species)
                        if descriptions:
                            species.descriptions = descriptions
                            species.save()
                            descriptions_generated_count += 1
                            self.stdout.write(self.style.SUCCESS(f"    Successfully generated descriptions for {species}."))
                        else:
                            self.stdout.write(self.style.WARNING(f"    Failed to generate descriptions for {species} (empty result)."))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"    Error generating descriptions for {species}: {e}"))
                else:
                    self.stdout.write(f"  Descriptions already exist for {species}.")

            if gen_questions_flag:
                if not MultipleChoiceQuestion.objects.filter(species=species).exists():
                    self.stdout.write(f"  Generating quiz questions for {species}...")
                    try:
                        # Call the original imported generate_questions function
                        questions, _ = generate_questions(gemini_generate_text_func, species)
                        if questions:
                            for q_data in questions:
                                MultipleChoiceQuestion.objects.create(
                                    species=species,
                                    question=q_data['question'],
                                    choices=q_data['choices'],
                                    correct_choice=q_data['correct_choice']
                                )
                            questions_generated_count += len(questions)
                            self.stdout.write(self.style.SUCCESS(f"    Successfully generated {len(questions)} questions for {species}."))
                        else:
                            self.stdout.write(self.style.WARNING(f"    Failed to generate questions for {species} (empty result)."))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"    Error generating questions for {species}: {e}"))
                else:
                    self.stdout.write(f"  Quiz questions already exist for {species}.")

        self.stdout.write(self.style.SUCCESS("Content generation complete!"))
        self.stdout.write(f"  Total illustrations generated: {illustrations_generated_count}")
        self.stdout.write(f"  Total transparent illustrations generated: {illustrations_transparent_generated_count}")
        self.stdout.write(f"  Total descriptions generated: {descriptions_generated_count}")
        self.stdout.write(f"  Total questions generated: {questions_generated_count}")
