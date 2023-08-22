import logging
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import serializers

from observation.models import Species, Observation
from observation.serializers import ObservationSerializer, SpeciesSerializer
from observation.permissions import IsOwner
from observation import identification

logger = logging.getLogger(__name__)


class SpeciesList(generics.ListAPIView):
    serializer_class = SpeciesSerializer

    def get_queryset(self):
        user = self.request.user
        return Species.objects.filter(observation__user=user).distinct()


class SpeciesDetail(generics.RetrieveAPIView):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer

    
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

    def create(self, request, *args, **kwargs):
        serializer = ObservationSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            logger.error(e)
            raise e
        # Save the serializer first so we can access the image
        observation = serializer.save(user=self.request.user)
        observation.identification_response = identification.plantnet_identify(observation.image.path)
        observation.location, observation.datetime = identification.read_exif(observation.image.path)
        observation.save()
        serializer = ObservationSerializer(instance=observation)
        return Response(serializer.data)


class ObservationUpdate(generics.RetrieveUpdateAPIView):

    serializer_class = ObservationSerializer
    queryset = Observation.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        idx = request.data['species']  # index of the correct species in the identification response, not species pk
        species_data = instance.identification_response['results'][idx]['species']
        species, created = Species.objects.get_or_create(
            scientificName=species_data['scientificNameWithoutAuthor'],
            defaults=dict(
                name=species_data['scientificNameWithoutAuthor'],
                commonNames=species_data['commonNames'],
                genus=species_data['genus']['scientificNameWithoutAuthor'],
                family=species_data['family']['scientificNameWithoutAuthor'],
            )
        )
        instance.species = species
        instance.save()
        return Response(self.get_serializer(instance).data)