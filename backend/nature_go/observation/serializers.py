from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.staticfiles import finders

from observation.models import Observation, Species


class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    identification_response = serializers.ReadOnlyField()
    image = Base64ImageField(required=True)

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'species', 'location', 'datetime', 'identification_response']

class SpeciesSerializer(serializers.ModelSerializer):
    illustration = Base64ImageField()
    illustration_transparent = Base64ImageField()
    illustration_url = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Species
        fields = ['id', 'name', 'commonNames', 'scientificName', 'genus', 'family', 'descriptions', 'illustration', 'illustration_transparent', 'wikipedia_image_url', 'illustration_url', 'display_name',]

    def has_illustration(self, obj):
        return finders.find(f'species/{obj.scientificName}/illustration_transparent.png') is not None
    
    def get_illustration_url(self, obj):
        request = self.context.get('request')
        if self.has_illustration(obj):
            return request.build_absolute_uri(f'/static/species/{obj.scientificName}/illustration_transparent.png')
        else:
            return request.build_absolute_uri(f'/static/species/unknown/illustration_transparent.png')
    
    def get_display_name(self, obj):
        return obj.commonNames[0] if obj.commonNames else obj.scientificName