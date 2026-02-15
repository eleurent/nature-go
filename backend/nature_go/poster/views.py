"""Views for the poster feature."""

import logging
from generation.species_data_generation import generate_bird_size
from observation.models import Observation, Species
from poster.posters import POSTERS, get_poster
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


def calculate_level(seen_count, total_count):
  """Calculate poster level based on progress percentage."""
  if total_count == 0:
    return None
  percentage = (seen_count / total_count) * 100
  if percentage >= 80:
    return "Gold"
  elif percentage >= 50:
    return "Silver"
  elif percentage >= 20:
    return "Bronze"
  return None


class PosterListView(APIView):
  """List all available posters with user progress."""

  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    posters = []
    user = request.user

    for poster_id, poster in POSTERS.items():
      core_species = poster["species"]
      all_species = core_species + poster.get("species_extended", [])
      poster_type = poster.get("type", "bird")

      # Map poster type to Species model type
      species_model_type = (
          Species.PLANT_TYPE if poster_type == "plant" else Species.BIRD_TYPE
      )

      # Count seen from ALL species (core + extended)
      seen_count = Species.objects.filter(
          observation__user=user,
          type=species_model_type,
          scientificNameWithoutAuthor__in=all_species,
      ).count()

      # Total is just core species (what's displayed)
      total = len(core_species)
      level = calculate_level(seen_count, total)

      posters.append({
          "id": poster_id,
          "name": poster["name"],
          "icon": poster.get("icon", "🐦"),
          "type": poster_type,
          "seen_count": seen_count,
          "total_count": total,
          "level": level,
      })

    return Response(posters)


class PosterDataView(APIView):
  """Get poster data for a specific poster.

  Returns all species for the poster with size data and seen status.
  """

  permission_classes = [permissions.IsAuthenticated]

  def get(self, request, poster_id):
    poster = get_poster(poster_id)
    if not poster:
      return Response(
          {"error": f"Poster '{poster_id}' not found"},
          status=status.HTTP_404_NOT_FOUND,
      )

    core_species = poster["species"]
    poster_type = poster.get("type", "bird")

    # Map poster type to Species model type
    species_model_type = (
        Species.PLANT_TYPE if poster_type == "plant" else Species.BIRD_TYPE
    )

    # Get all user observations for this species type
    user_observed_species = set(
        Observation.objects.filter(
            user=request.user, species__type=species_model_type
        ).values_list("species_id", flat=True)
    )

    # Also get scientific names of observed species for extended matching
    user_observed_sci_names = set(
        Species.objects.filter(id__in=user_observed_species).values_list(
            "scientificNameWithoutAuthor", flat=True
        )
    )

    # Only display core species in the poster
    poster_species = []
    for species_name in core_species:
      species = Species.objects.filter(
          scientificNameWithoutAuthor=species_name,
          type=species_model_type,
      ).first()

      if species:
        if species.body_length_cm is None and poster_type == "bird":
          size = generate_bird_size(str(species))
          if size:
            species.body_length_cm = size
            species.save(update_fields=["body_length_cm"])
            logger.info("Generated size for %s: %scm", species, size)

        illustration_url = None
        if species.illustration_transparent:
          illustration_url = request.build_absolute_uri(
              species.illustration_transparent.url
          )
        elif species.illustration:
          illustration_url = request.build_absolute_uri(
              species.illustration.url
          )

        poster_species.append({
            "id": species.id,
            "name": str(species),
            "scientific_name": species.scientificNameWithoutAuthor,
            "body_length_cm": species.body_length_cm,
            "illustration_url": illustration_url,
            "has_illustration": bool(species.illustration_transparent),
            "is_seen": species.id in user_observed_species,
            "is_bonus": False,
            "rarity": species.rarity,
        })
      else:
        poster_species.append({
            "id": None,
            "name": species_name,
            "scientific_name": species_name,
            "body_length_cm": None,
            "illustration_url": None,
            "has_illustration": False,
            "is_seen": False,
            "is_bonus": False,
            "rarity": None,
        })

    # Add observed extended species as bonus entries
    extended_species_list = poster.get("species_extended", [])
    observed_extended = user_observed_sci_names & set(extended_species_list)

    for species_name in observed_extended:
      species = Species.objects.filter(
          scientificNameWithoutAuthor=species_name,
          type=species_model_type,
      ).first()

      if species:
        illustration_url = None
        if species.illustration_transparent:
          illustration_url = request.build_absolute_uri(
              species.illustration_transparent.url
          )
        elif species.illustration:
          illustration_url = request.build_absolute_uri(
              species.illustration.url
          )

        poster_species.append({
            "id": species.id,
            "name": str(species),
            "scientific_name": species.scientificNameWithoutAuthor,
            "body_length_cm": species.body_length_cm,
            "illustration_url": illustration_url,
            "has_illustration": bool(species.illustration_transparent),
            "is_seen": True,
            "is_bonus": True,
            "rarity": species.rarity,
        })

    poster_species.sort(key=lambda x: x["body_length_cm"] or 0, reverse=True)

    # Count observed bonus species
    observed_bonus_count = len(observed_extended)
    # Core seen + bonus seen
    seen_count = (
        len(user_observed_sci_names & set(core_species)) + observed_bonus_count
    )
    # Core total + observed bonus (total expands as you find bonus species)
    total_count = len(core_species) + observed_bonus_count

    return Response({
        "poster_id": poster_id,
        "poster_name": poster["name"],
        "level": calculate_level(seen_count, len(core_species)),
        "seen_count": seen_count,
        "total_count": total_count,
        "species": poster_species,
    })
