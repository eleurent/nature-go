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
      species_list = poster["species"]
      poster_type = poster.get("type", "bird")

      # Map poster type to Species model type
      species_model_type = (
          Species.PLANT_TYPE if poster_type == "plant" else Species.BIRD_TYPE
      )

      seen_count = Species.objects.filter(
          observation__user=user,
          type=species_model_type,
          scientificNameWithoutAuthor__in=species_list,
      ).count()

      total = len(species_list)
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

    species_list = poster["species"]
    poster_type = poster.get("type", "bird")

    # Map poster type to Species model type
    species_model_type = (
        Species.PLANT_TYPE if poster_type == "plant" else Species.BIRD_TYPE
    )

    user_observed_species = set(
        Observation.objects.filter(
            user=request.user, species__type=species_model_type
        ).values_list("species_id", flat=True)
    )

    poster_species = []
    for species_name in species_list:
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
        })

    poster_species.sort(key=lambda x: x["body_length_cm"] or 0, reverse=True)

    seen_count = sum(1 for s in poster_species if s["is_seen"])
    total_count = len(poster_species)

    return Response({
        "poster_id": poster_id,
        "poster_name": poster["name"],
        "level": calculate_level(seen_count, total_count),
        "seen_count": seen_count,
        "total_count": total_count,
        "species": poster_species,
    })
