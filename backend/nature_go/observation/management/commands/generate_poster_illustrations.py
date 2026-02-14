import logging
from django.core.management import BaseCommand, CommandError
from generation.gemini import generate_image
from generation.illustration_generation import generate_illustration, generate_illustration_transparent
from generation.replicate import remove_background as replicate_remove_background
from observation.models import Species
from poster.posters import POSTERS

logger = logging.getLogger(__name__)


class Command(BaseCommand):
  help = (
      "Pre-generates illustrations and transparent illustrations for all"
      " species in a poster."
  )

  def add_arguments(self, parser):
    parser.add_argument(
        "poster_id",
        type=str,
        help=(
            "ID of the poster to generate illustrations for. Available:"
            f' {", ".join(POSTERS.keys())}'
        ),
    )
    parser.add_argument(
        "--type",
        type=str,
        choices=[Species.PLANT_TYPE, Species.BIRD_TYPE],
        help="Only process species of this type (bird or plant).",
    )
    parser.add_argument(
        "--include-extended",
        action="store_true",
        help=(
            "Also generate for extended species (bonus species), not just core."
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help=(
            "List species that would be processed without generating anything."
        ),
    )

  def handle(self, *args, **options):
    poster_id = options["poster_id"]
    species_type_filter = options.get("type")
    include_extended = options["include_extended"]
    dry_run = options["dry_run"]

    poster = POSTERS.get(poster_id)
    if not poster:
      raise CommandError(
          f"Poster '{poster_id}' not found. Available posters:"
          f" {', '.join(POSTERS.keys())}"
      )

    # Collect scientific names
    species_names = list(poster["species"])
    if include_extended:
      species_names += poster.get("species_extended", [])

    self.stdout.write(f"Poster: {poster['name']} ({poster_id})")
    self.stdout.write(
        f"Species to process: {len(species_names)}"
        f" ({'core + extended' if include_extended else 'core only'})"
    )
    if species_type_filter:
      self.stdout.write(f"Filtering by type: {species_type_filter}")
    if dry_run:
      self.stdout.write(
          self.style.WARNING("DRY RUN — no generation will occur.")
      )
    self.stdout.write("")

    illustrations_generated = 0
    transparents_generated = 0
    skipped = 0
    not_found = 0

    for i, sci_name in enumerate(species_names, 1):
      # Look up species in DB
      qs = Species.objects.filter(scientificNameWithoutAuthor=sci_name)
      if species_type_filter:
        qs = qs.filter(type=species_type_filter)
      species = qs.first()

      if not species:
        self.stdout.write(
            self.style.WARNING(
                f"  [{i}/{len(species_names)}] {sci_name} — not found in"
                " database, skipping."
            )
        )
        not_found += 1
        continue

      display_name = f"{species} ({sci_name})"

      if dry_run:
        has_ill = bool(species.illustration)
        has_trans = bool(species.illustration_transparent)
        status_parts = []
        if not has_ill:
          status_parts.append("needs illustration")
        if not has_trans:
          status_parts.append("needs transparent")
        if not status_parts:
          status_parts.append("all done")
        self.stdout.write(
            f"  [{i}/{len(species_names)}] {display_name} —"
            f" {', '.join(status_parts)}"
        )
        continue

      self.stdout.write(f"  [{i}/{len(species_names)}] {display_name}")

      # Generate illustration if missing
      if not species.illustration:
        self.stdout.write(f"    Generating illustration...")
        try:
          if generate_illustration(generate_image, species):
            illustrations_generated += 1
            self.stdout.write(
                self.style.SUCCESS(f"    ✓ Illustration generated.")
            )
          else:
            self.stdout.write(
                self.style.WARNING(f"    ✗ Illustration generation failed.")
            )
        except Exception as e:
          self.stdout.write(self.style.ERROR(f"    ✗ Error: {e}"))
      else:
        self.stdout.write(f"    Illustration already exists.")

      # Refresh species to pick up any changes from generate_illustration
      species.refresh_from_db()

      # Generate transparent illustration if missing (requires base illustration)
      if species.illustration and not species.illustration_transparent:
        self.stdout.write(f"    Generating transparent illustration...")
        try:
          if generate_illustration_transparent(
              replicate_remove_background, species
          ):
            transparents_generated += 1
            self.stdout.write(
                self.style.SUCCESS(f"    ✓ Transparent illustration generated.")
            )
          else:
            self.stdout.write(
                self.style.WARNING(
                    f"    ✗ Transparent illustration generation failed."
                )
            )
        except Exception as e:
          self.stdout.write(self.style.ERROR(f"    ✗ Error: {e}"))
      elif species.illustration_transparent:
        self.stdout.write(f"    Transparent illustration already exists.")
        skipped += 1
      else:
        self.stdout.write(
            self.style.WARNING(
                f"    Cannot generate transparent — no base illustration."
            )
        )

      # Progress summary
      remaining = len(species_names) - i
      self.stdout.write(
          f"    --- Progress: {illustrations_generated} ill. |"
          f" {transparents_generated} trans. | {not_found} not found |"
          f" {remaining} remaining ---"
      )

    self.stdout.write("")
    if dry_run:
      self.stdout.write(self.style.SUCCESS("Dry run complete."))
    else:
      self.stdout.write(self.style.SUCCESS("Generation complete!"))
      self.stdout.write(f"  Illustrations generated: {illustrations_generated}")
      self.stdout.write(
          f"  Transparent illustrations generated: {transparents_generated}"
      )
      self.stdout.write(f"  Species not found in DB: {not_found}")
