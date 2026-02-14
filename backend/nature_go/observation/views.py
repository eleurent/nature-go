import ast
import logging
from django.db.models import Count, Min, Q
from generation.audio_description_generation import generate_audio_description
from generation.description_generation import generate_descriptions
from generation.gemini import generate_image, generate_text
from generation.illustration_generation import generate_illustration, generate_illustration_transparent
from generation.replicate import remove_background
from identification import gemini, plantnet
from observation.models import Observation, Species
from observation.permissions import IsAdminOrReadOnly, IsOwner
from observation.serializers import ObservationSerializer, SpeciesListSerializer, SpeciesSerializer, serialize_identification_response
from rest_framework import filters, generics, pagination, permissions, status
from rest_framework import serializers
from rest_framework.response import Response
from user_profile.signals import xp_gained

logger = logging.getLogger(__name__)


class SpeciesList(generics.ListAPIView):
  serializer_class = SpeciesListSerializer

  def get_queryset(self):
    user = self.request.user
    queryset = Species.objects.filter(observation__user=user).distinct()
    ordered_queryset = queryset.annotate(
        discovery_datetime=Min('observation__datetime')
    ).order_by('-discovery_datetime')
    return ordered_queryset


class PlantSpeciesList(SpeciesList):

  def get_queryset(self):
    user = self.request.user
    queryset = Species.objects.filter(
        type=Species.PLANT_TYPE, observation__user=user
    ).distinct()
    ordered_queryset = queryset.annotate(
        discovery_datetime=Min('observation__datetime')
    ).order_by('-discovery_datetime')
    return ordered_queryset


class BirdSpeciesList(SpeciesList):

  def get_queryset(self):
    user = self.request.user
    queryset = Species.objects.filter(
        type=Species.BIRD_TYPE, observation__user=user
    ).distinct()
    ordered_queryset = queryset.annotate(
        discovery_datetime=Min('observation__datetime')
    ).order_by('-discovery_datetime')
    return ordered_queryset


class SpeciesAllList(generics.ListCreateAPIView):
  """This view should return a list of all the species in the database.

  It can be filtered, ordered, and paginated. For instance, to get the top-100
  species with no illustration and highest number of occurences, use
  /path/to/view/?illustration__exact=''&ordering=-occurences_cdf&limit=100
  """

  serializer_class = SpeciesSerializer
  permission_classes = [permissions.IsAdminUser]
  filter_backends = [filters.OrderingFilter]
  pagination_class = pagination.LimitOffsetPagination
  ordering_fields = ['occurences_cdf', 'rarity_gpt']

  def get_queryset(self):
    queryset = Species.objects.all()
    filters = Q()
    for param, value in self.request.query_params.items():
      if param not in [f.name for f in Species._meta.get_fields()]:
        continue
      filters &= Q(**{param: ast.literal_eval(value)})
    queryset = queryset.filter(filters)
    return queryset


class SpeciesLabeledList(generics.ListCreateAPIView):
  """This view should return a list of labeled/unlabeled species in the database.

  ordered by number of observations and occurences.

  - Set desired species type with ?type=bird/plant
  - Change ordering by listing ordering params, e.g.:
    ?ordering=-observation_count&ordering=-rarity_gpt&ordering=-occurences_cdf
  - Filter by either illustration, descriptions, or multiplechoicequestions =
  True/False.
  - Paginate with limit=100.
  """

  serializer_class = SpeciesSerializer
  permission_classes = [permissions.IsAdminUser]
  pagination_class = pagination.LimitOffsetPagination

  def get_queryset(self):
    queryset = Species.objects.all()
    if 'type' in self.request.query_params:
      queryset = queryset.filter(type=self.request.query_params['type'])
    if 'illustration' in self.request.query_params:
      filter = Q(illustration__isnull=True) | Q(illustration__exact='')
      if self.request.query_params['illustration'] == 'True':
        queryset = queryset.exclude(filter)
      else:
        queryset = queryset.filter(filter)
    if 'illustration_transparent' in self.request.query_params:
      filter = Q(illustration_transparent__isnull=True) | Q(
          illustration_transparent__exact=''
      )
      if self.request.query_params['illustration_transparent'] == 'True':
        queryset = queryset.exclude(filter)
      else:
        queryset = queryset.filter(filter)
    if 'descriptions' in self.request.query_params:
      filter = Q(descriptions__isnull=True) | Q(descriptions__exact=[])
      if self.request.query_params['descriptions'] == 'True':
        queryset = queryset.exclude(filter)
      else:
        queryset = queryset.filter(filter)
    if 'multiplechoicequestions' in self.request.query_params:
      has_questions = (
          self.request.query_params['multiplechoicequestions'] == 'True'
      )
      queryset = queryset.filter(
          Q(multiplechoicequestion__isnull=not has_questions)
      )

    ordering = self.request.GET.getlist(
        'ordering', ['-observation_count', '-occurences_cdf']
    )
    queryset = queryset.annotate(
        observation_count=Count('observation')
    ).order_by(*ordering)

    return queryset


class SpeciesDetail(generics.RetrieveUpdateAPIView):
  queryset = Species.objects.all()
  serializer_class = SpeciesSerializer
  permission_classes = [IsAdminOrReadOnly]

  def get_serializer_context(self):
    context = super().get_serializer_context()
    context.update({'request': self.request})
    return context


class SpeciesGenerateDescription(generics.GenericAPIView):
  queryset = Species.objects.all()
  serializer_class = SpeciesSerializer

  def post(self, request, *args, **kwargs):
    del request, args, kwargs
    species = self.get_object()

    if not species.descriptions:
      species.descriptions, _ = generate_descriptions(
          generate_text=generate_text,
          species=species,
          material=None,
      )

    species.save()
    serializer = self.get_serializer(species)
    return Response(serializer.data)


class SpeciesObservationsList(generics.ListAPIView):
  serializer_class = ObservationSerializer

  def get_queryset(self):
    user = self.request.user
    species_id = self.kwargs['pk']
    return Observation.objects.filter(user=user, species=species_id).order_by(
        '-datetime'
    )


class ObservationListCreate(generics.ListCreateAPIView):
  serializer_class = ObservationSerializer

  def get_queryset(self):
    user = self.request.user
    return Observation.objects.filter(user=user, species__isnull=False)

  def create(self, request, *args, **kwargs):
    serializer = ObservationSerializer(data=request.data)
    try:
      serializer.is_valid(raise_exception=True)
    except serializers.ValidationError as e:
      logger.error(e)
      raise e
    # Save the serializer first so we can access the image
    observation = serializer.save(user=self.request.user)

    # Run identification service
    if observation.type == Species.PLANT_TYPE:
      response = plantnet.plantnet_identify(
          image_path=observation.image.path, organ=observation.organ
      )
      observation.identification_response = serialize_identification_response(
          response
      )
      observation.save()
    elif observation.type == Species.BIRD_TYPE:
      response = gemini.gemini_identify_few_shot(
          image_path=observation.image.path, location=observation.location
      )
      observation.identification_response = serialize_identification_response(
          response
      )
      observation.save()

    serializer = ObservationSerializer(instance=observation)
    return Response(serializer.data)


class ObservationUpdate(generics.RetrieveUpdateAPIView):
  serializer_class = ObservationSerializer
  queryset = Observation.objects.all()
  permission_classes = [permissions.IsAuthenticated, IsOwner]

  def update(self, request, *args, **kwargs):
    if 'species' not in request.data:
      return super().update(request, *args, **kwargs)
    instance = self.get_object()
    idx = int(
        request.data['species']
    )  # index of the correct species in the identification response, not species pk
    species_id = instance.identification_response['results'][idx]['species'][
        'id'
    ]
    instance.species = Species.objects.get(pk=species_id)
    instance.save()

    achievements = {}
    if not instance.xp and instance.species:
      achievements = self._compute_achievements(instance)

    data = ObservationSerializer(instance).data
    if achievements:
      data['achievements'] = achievements
    return Response(data)

  def _compute_achievements(self, instance):
    """Capture state before/after XP gain and compute achievement deltas."""
    from poster.posters import POSTERS
    from poster.views import calculate_level
    from user_profile.models import Profile

    user = instance.user

    # --- Snapshot BEFORE ---
    profile, _ = Profile.objects.get_or_create(user=user)
    old_level = profile.level
    is_new_species = (
        Observation.objects.filter(user=user, species=instance.species).count()
        <= 1
    )

    # --- Trigger XP gain ---
    xp_gained.send(sender=instance.__class__, instance=instance)

    # --- Refresh and snapshot AFTER ---
    profile.refresh_from_db()
    instance.refresh_from_db()

    achievements = {}

    # New species?
    if is_new_species:
      species = instance.species
      # Build illustration URL for the reveal animation
      illustration_url = None
      request = self.request
      if species.illustration_transparent:
        illustration_url = request.build_absolute_uri(
            species.illustration_transparent.url
        )
      elif species.illustration:
        illustration_url = request.build_absolute_uri(species.illustration.url)
      achievements['new_species'] = True
      achievements['species_name'] = str(species)
      achievements['species_illustration_url'] = illustration_url
      achievements['species_rarity'] = species.rarity

    # Level up?
    if profile.level > old_level:
      achievements['level_up'] = {
          'old_level': old_level,
          'new_level': profile.level,
      }

    # Poster updates?
    poster_updates = []
    species_type = instance.species.type
    for poster_id, poster in POSTERS.items():
      if poster.get('type', 'bird') != (
          'plant' if species_type == Species.PLANT_TYPE else 'bird'
      ):
        continue
      # Check if observed species is in this poster
      all_poster_species = poster['species'] + poster.get(
          'species_extended', []
      )
      if instance.species.scientificNameWithoutAuthor not in all_poster_species:
        continue
      # Compute old and new levels
      core_species = poster['species']
      all_species = core_species + poster.get('species_extended', [])
      seen_count_new = Species.objects.filter(
          observation__user=user,
          type=species_type,
          scientificNameWithoutAuthor__in=all_species,
      ).count()
      # Old count is one less if this was a new observation of this species
      seen_count_old = seen_count_new - (1 if is_new_species else 0)
      total = len(core_species)
      old_poster_level = calculate_level(seen_count_old, total)
      new_poster_level = calculate_level(seen_count_new, total)
      if new_poster_level != old_poster_level:
        poster_updates.append({
            'poster_name': poster['name'],
            'poster_id': poster_id,
            'old_level': old_poster_level,
            'new_level': new_poster_level,
        })
    if poster_updates:
      achievements['poster_updates'] = poster_updates

    return achievements


class ObservationDelete(generics.DestroyAPIView):
  """Allows the owner of an observation to delete it."""

  queryset = Observation.objects.all()
  serializer_class = ObservationSerializer
  permission_classes = [permissions.IsAuthenticated, IsOwner]


class GenerateIllustrationView(generics.GenericAPIView):
  queryset = Species.objects.all()
  serializer_class = SpeciesSerializer
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request, *args, **kwargs):
    species = self.get_object()
    success = generate_illustration(
        generate_image=generate_image, species=species
    )
    if success:
      serializer = self.get_serializer(species)
      return Response(serializer.data, status=status.HTTP_200_OK)
    else:
      return Response(
          {'error': 'Failed to generate illustration'},
          status=status.HTTP_500_INTERNAL_SERVER_ERROR,
      )


class GenerateTransparentIllustrationView(generics.GenericAPIView):
  queryset = Species.objects.all()
  serializer_class = SpeciesSerializer
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request, *args, **kwargs):
    species = self.get_object()
    success = generate_illustration_transparent(
        remove_background_fn=remove_background, species=species
    )
    if success:
      serializer = self.get_serializer(species)
      return Response(serializer.data, status=status.HTTP_200_OK)
    else:
      return Response(
          {'error': 'Failed to generate transparent illustration'},
          status=status.HTTP_500_INTERNAL_SERVER_ERROR,
      )


class GenerateAudioDescriptionView(generics.GenericAPIView):
  queryset = Species.objects.all()
  serializer_class = SpeciesSerializer
  permission_classes = [
      permissions.IsAuthenticated
  ]  # Or IsAuthenticated, based on actual requirements

  def post(self, request, *args, **kwargs):
    species = self.get_object()

    success = generate_audio_description(species=species)

    if success:
      serializer = self.get_serializer(species)
      return Response(serializer.data, status=status.HTTP_200_OK)
    else:
      # Logger is already defined at module level
      logger.error(
          f'Failed to generate audio description for species ID {species.pk} in'
          ' view.'
      )
      return Response(
          {
              'error': (
                  f'Failed to generate audio description for {str(species)}.'
              )
          },
          status=status.HTTP_500_INTERNAL_SERVER_ERROR,
      )
