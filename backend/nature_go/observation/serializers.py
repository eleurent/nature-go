from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField

from observation.models import Observation, Species


class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    image = Base64ImageField(required=True)

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'species', 'location', 'datetime']

class SpeciesSerializer(serializers.ModelSerializer):
    illustration_url = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Species
        fields = ['id', 'name', 'display_name', 'commonNames', 'scientificName', 'genus', 'family', 'illustration_url']

    def get_illustration_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/static/species/{obj.name}/illustration_transparent.png')
    
    def get_display_name(self, obj):
        return obj.commonNames[0] if obj.commonNames else obj.scientificName