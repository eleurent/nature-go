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
        fields = ['id', 'user', 'image', 'organ', 'species', 'location', 'datetime', 'identification_response', 'xp']


class SpeciesSerializer(serializers.ModelSerializer):
    illustration = Base64ImageField()
    illustration_transparent = Base64ImageField()
    illustration_reference = Base64ImageField()
    illustration_reference_transparent = Base64ImageField()
    illustration_url = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    num_observations_total = serializers.SerializerMethodField()
    num_questions_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Species
        fields = [
            'id',
            'scientificNameWithoutAuthor',
            'commonNames',
            'genus',
            'family',
            'gbif_id',
            'powo_id',
            'wikipedia_word_count',
            'number_of_occurrences',
            'occurences_cdf',
            'rarity_gpt',
            'descriptions',
            'illustration',
            'illustration_transparent',
            'illustration_reference',
            'illustration_reference_transparent',
            'reference_image_url',
            'rarity',
            'illustration_url',
            'display_name',
            'num_observations_total',
            'num_questions_total',
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
    
    def get_num_observations_total(self, obj):
        return obj.observation_set.count()

    def get_num_questions_total(self, obj):
        return obj.multiplechoicequestion_set.count()
