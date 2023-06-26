from rest_framework import serializers

from observation.models import Observation, Species


class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'species', 'location', 'date']

class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'commonNames', 'scientificName', 'genus', 'family']
