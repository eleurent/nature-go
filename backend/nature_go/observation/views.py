import logging
from rest_framework import generics, permissions, pagination, filters
from rest_framework.response import Response
from rest_framework import serializers
from django.db.models import Q, Count, Min
import ast

from observation.models import Species, Observation
from observation.serializers import ObservationSerializer, SpeciesSerializer
from observation.permissions import IsOwner, IsAdminOrReadOnly
from observation import identification
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


class SpeciesObservationsList(generics.ListAPIView):
    serializer_class = ObservationSerializer

    def get_queryset(self):
        user = self.request.user
        species_id = self.kwargs['pk']
        return Observation.objects.filter(user=user, species=species_id)


class ObservationCreate(generics.CreateAPIView):
    serializer_class = ObservationSerializer
    queryset = Observation.objects.none() # dummy queryset

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
            observation.identification_response = identification.plantnet_identify(
                image_path=observation.image.path, organ=observation.organ)
            observation.save()
        elif observation.type == Species.BIRD_TYPE:
            observation.identification_response = identification.bird_identify_mock(
                image_path=observation.image.path)
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
        species_data = instance.identification_response['results'][idx]['species']
        species_data = dict(
            scientificNameWithoutAuthor=species_data['scientificNameWithoutAuthor'],
            scientificNameAuthorship=species_data['scientificNameAuthorship'],
            commonNames=species_data['commonNames'],
            genus=species_data['genus']['scientificNameWithoutAuthor'],
            family=species_data['family']['scientificNameWithoutAuthor'],
        )
        species, created = Species.objects.update_or_create(
            scientificNameWithoutAuthor=species_data['scientificNameWithoutAuthor'],
            defaults=species_data)
        instance.species = species
        instance.save()
        if not instance.xp and instance.species:
            xp_gained.send(sender=instance.__class__, instance=instance)

        return Response(ObservationSerializer(instance).data)