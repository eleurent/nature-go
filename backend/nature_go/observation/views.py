import requests
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from observation.models import Species, Observation
from observation.serializers import ObservationSerializer, SpeciesSerializer


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

def plantnet_identify(image_path):
    url = 'https://my-api.plantnet.org/v2/identify/all'
    image_data =  open(image_path, 'rb')
    files = [
        ('images', (image_path, image_data))
    ]
    params = {
        'include-related-images': True,
        'lang': 'en',
        'api-key': '2b10OHTHDcLlYXiJYoOA2bYeOO'
    }
    data = {'organs': ['leaf']}
    response = requests.post(url, files=files, data=data, params=params)
    response.raise_for_status()
    result = response.json()
    return result

class ObservationCreate(generics.CreateAPIView):
    serializer_class = ObservationSerializer

    def create(self, request, *args, **kwargs):
        serializer = ObservationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        observation = serializer.save(user=self.request.user)
        result = plantnet_identify(observation.image.path)
        species_data = result['results'][0]['species']
        species, created = Species.objects.get_or_create(
            name=species_data['scientificNameWithoutAuthor'],
            commonNames=species_data['commonNames'],
            scientificName=species_data['scientificNameWithoutAuthor'],
            genus=species_data['genus']['scientificNameWithoutAuthor'],
            family=species_data['family']['scientificNameWithoutAuthor'],
        )
        observation.species = species
        observation.save()
        serializer = ObservationSerializer(instance=observation)
        return Response(serializer.data)

