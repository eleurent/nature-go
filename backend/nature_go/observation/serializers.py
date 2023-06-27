from rest_framework import serializers

from observation.models import Observation, Species


class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'species', 'location', 'date']

class SpeciesSerializer(serializers.ModelSerializer):
    illustration_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Species
        fields = ['id', 'name', 'commonNames', 'scientificName', 'genus', 'family', 'illustration_url']

    def get_illustration_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/static/species/{obj.name}/illustration_transparent.png')