from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.staticfiles import finders

from observation.models import Observation, Species
from user_profile.signals import xp_gained

class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    identification_response = serializers.ReadOnlyField()
    image = Base64ImageField(required=False)

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'species', 'location', 'datetime', 'identification_response', 'xp']

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        if not instance.xp and instance.species:
            xp_gained.send(sender=instance.__class__, instance=instance)
        return instance

class SpeciesSerializer(serializers.ModelSerializer):
    illustration = Base64ImageField()
    illustration_transparent = Base64ImageField()
    illustration_url = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    total_observations = serializers.SerializerMethodField()
    
    class Meta:
        model = Species
        fields = [
            'id',
            'commonNames',
            'scientificNameWithoutAuthor',
            'genus',
            'family',
            'occurences_cdf',
            'descriptions',
            'illustration',
            'illustration_transparent',
            'reference_image_url',
            'illustration_url',
            'display_name',
            'total_observations'
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
        return str(obj)
    
    def get_total_observations(self, obj):
        return obj.observation_set.count()