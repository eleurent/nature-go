import logging
from rest_framework import generics, permissions, pagination, filters, status
from rest_framework.response import Response
from rest_framework import serializers
from django.db.models import Q, Count, Min
import ast

from observation.models import Species, Observation
from observation.serializers import ObservationSerializer, SpeciesSerializer, serialize_identification_response
from observation.permissions import IsOwner, IsAdminOrReadOnly
from identification import plantnet, gemini
from generation.gemini import generate_text, generate_image
from generation.description_generation import generate_descriptions
from generation.illustration_generation import generate_illustration, generate_illustration_transparent
from generation.audio_description_generation import generate_audio_description
from user_profile.signals import xp_gained

logger = logging.getLogger(__name__)


class SpeciesList(generics.ListAPIView):
    serializer_class = SpeciesSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Species.objects.filter(observation__user=user).distinct()
        ordered_queryset = queryset.annotate(discovery_datetime=Min('observation__datetime')).order_by('-discovery_datetime')
        return ordered_queryset


class PlantSpeciesList(SpeciesList):
    def get_queryset(self):
        user = self.request.user
        queryset = Species.objects.filter(type=Species.PLANT_TYPE, observation__user=user).distinct()
        ordered_queryset = queryset.annotate(discovery_datetime=Min('observation__datetime')).order_by('-discovery_datetime')
        return ordered_queryset

class BirdSpeciesList(SpeciesList):
    def get_queryset(self):
        user = self.request.user
        queryset = Species.objects.filter(type=Species.BIRD_TYPE, observation__user=user).distinct()
        ordered_queryset = queryset.annotate(discovery_datetime=Min('observation__datetime')).order_by('-discovery_datetime')
        return ordered_queryset


class SpeciesAllList(generics.ListCreateAPIView):
    """
        This view should return a list of all the species in the database.
        It can be filtered, ordered, and paginated.
        For instance, to get the top-100 species with no illustration
        and highest number of occurences, use
        /path/to/view/?illustration__exact=''&ordering=-occurences_cdf&limit=100
    """
    serializer_class = SpeciesSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.OrderingFilter]
    pagination_class = pagination.LimitOffsetPagination
    ordering_fields = ['occurences_cdf','rarity_gpt']

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
    """
        This view should return a list of labeled/unlabeled species in the database.
        ordered by number of observations and occurences.
        
        - Set desired species type with ?type=bird/plant
        - Change ordering by listing ordering params, e.g.:
          ?ordering=-observation_count&ordering=-rarity_gpt&ordering=-occurences_cdf
        - Filter by either illustration, descriptions, or multiplechoicequestions = True/False.
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
            filter = Q(illustration_transparent__isnull=True) | Q(illustration_transparent__exact='')
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
            has_questions = self.request.query_params['multiplechoicequestions'] == 'True'
            queryset = queryset.filter(Q(multiplechoicequestion__isnull=not has_questions))
        
        ordering = self.request.GET.getlist('ordering', ['-observation_count', '-occurences_cdf'])
        queryset = queryset.annotate(observation_count=Count('observation')).order_by(*ordering)
        
        return queryset

class SpeciesDetail(generics.RetrieveUpdateAPIView):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
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
        return Observation.objects.filter(user=user, species=species_id).order_by('-datetime')


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
            observation.identification_response = serialize_identification_response(response)
            observation.save()
        elif observation.type == Species.BIRD_TYPE:
            response = gemini.gemini_identify_few_shot(
                image_path=observation.image.path,
                location=observation.location)
            observation.identification_response = serialize_identification_response(response)
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
        idx = int(request.data['species'])  # index of the correct species in the identification response, not species pk
        species_id = instance.identification_response['results'][idx]['species']['id']
        instance.species = Species.objects.get(pk=species_id)
        instance.save()
        if not instance.xp and instance.species:
            xp_gained.send(sender=instance.__class__, instance=instance)

        return Response(ObservationSerializer(instance).data)


class ObservationDelete(generics.DestroyAPIView):
    """
    Allows the owner of an observation to delete it.
    """
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]


class GenerateIllustrationView(generics.GenericAPIView):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        species = self.get_object()
        success = generate_illustration(generate_image=generate_image, species=species)
        # transparent_success = generate_illustration_transparent(species=species)
        # success = success or transparent_success
        if success:
            serializer = self.get_serializer(species)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to generate illustration'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateAudioDescriptionView(generics.GenericAPIView):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    permission_classes = [permissions.IsAdminUser]  # Or IsAuthenticated, based on actual requirements

    def post(self, request, *args, **kwargs):
        species = self.get_object()

        success = generate_audio_description(species=species)

        if success:
            serializer = self.get_serializer(species)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Logger is already defined at module level
            logger.error(f"Failed to generate audio description for species ID {species.pk} in view.")
            return Response(
                {'error': f'Failed to generate audio description for {str(species)}.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
