"""Views for the regional bird poster feature."""

import logging
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from generation.species_data_generation import generate_bird_size
from observation.models import Species
from poster.regions import get_region, get_region_list

logger = logging.getLogger(__name__)


class RegionListView(APIView):
    """List all available regions for bird posters."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        regions = get_region_list()
        return Response(regions)


class PosterDataView(APIView):
    """Get poster data for a specific region.

    Returns all species for the region with size data and seen status.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, region_id):
        region = get_region(region_id)
        if not region:
            return Response(
                {"error": f"Region '{region_id}' not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_species_ids = set(
            Species.objects.filter(
                observation__user=request.user, type=Species.BIRD_TYPE
            ).values_list("id", flat=True)
        )

        poster_species = []
        for bird_name in region["common_birds"]:
            species = Species.objects.filter(
                commonNames__contains=[bird_name], type=Species.BIRD_TYPE
            ).first()

            if not species:
                species = Species.objects.filter(
                    commonNames__icontains=bird_name, type=Species.BIRD_TYPE
                ).first()

            if species:
                if species.body_length_cm is None:
                    size = generate_bird_size(str(species))
                    if size:
                        species.body_length_cm = size
                        species.save(update_fields=["body_length_cm"])
                        logger.info(f"Generated size for {species}: {size}cm")

                illustration_url = None
                if species.illustration_transparent:
                    illustration_url = request.build_absolute_uri(
                        species.illustration_transparent.url
                    )
                elif species.illustration:
                    illustration_url = request.build_absolute_uri(
                        species.illustration.url
                    )

                poster_species.append(
                    {
                        "id": species.id,
                        "name": str(species),
                        "scientific_name": species.scientificNameWithoutAuthor,
                        "body_length_cm": species.body_length_cm,
                        "illustration_url": illustration_url,
                        "is_seen": species.id in user_species_ids,
                    }
                )
            else:
                poster_species.append(
                    {
                        "id": None,
                        "name": bird_name,
                        "scientific_name": None,
                        "body_length_cm": None,
                        "illustration_url": None,
                        "is_seen": False,
                    }
                )

        poster_species.sort(key=lambda x: x["body_length_cm"] or 0, reverse=True)

        return Response(
            {
                "region_id": region_id,
                "region_name": region["name"],
                "species": poster_species,
            }
        )
