from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.staticfiles import finders

from observation.models import Observation, Species


class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    identification_response = serializers.ReadOnlyField()
    image = Base64ImageField(required=False)

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'species', 'location', 'datetime', 'identification_response']

    def update(self, instance, validated_data):
        print('CUSTOM Observation Update')
        super().update(instance, validated_data)
        if not instance.xp and instance.species:
            instance.xp = instance.compute_xp()
            instance.save()
        return instance

class SpeciesSerializer(serializers.ModelSerializer):
    illustration = Base64ImageField()
    illustration_transparent = Base64ImageField()
    illustration_url = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Species
        fields = [
            'id',
            'commonNames',
            'scientificName',
            'scientificNameWithoutAuthor',
            'genus',
            'family',
            'occurences_cdf',
            'descriptions',
            'illustration',
            'illustration_transparent',
            'wikipedia_image_url',
            'illustration_url',
            'display_name',
        ]

    def get_illustration_url(self, obj):
        request = self.context.get('request')
        if bool(obj.illustration_transparent):
            return request.build_absolute_uri(obj.illustration_transparent.url)
        elif bool(obj.illustration):
            return request.build_absolute_uri(obj.illustration.url)
        else:
            return request.build_absolute_uri('/static/img/unkown_species_illustration_transparent.png')
    
    def get_display_name(self, obj):
        return obj.commonNames[0] if obj.commonNames else obj.scientificName