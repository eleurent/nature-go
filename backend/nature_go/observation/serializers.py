from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.staticfiles import finders

from observation.models import Observation, Species, IdentificationResponse, IdentificationCandidate

class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    identification_response = serializers.ReadOnlyField()
    image = Base64ImageField(required=False)
    species_display_name = serializers.SerializerMethodField()

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'type', 'organ', 'species', 'species_display_name', 'location', 'datetime', 'identification_response', 'xp']

    def get_species_display_name(self, obj):
        return str(obj.species)


class SpeciesSmallSerializer(serializers.ModelSerializer):
    illustration_url = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Species
        fields = [
            'id',
            'scientificNameWithoutAuthor',
            'illustration_url',
            'display_name',
        ]

    def get_illustration_url(self, obj):
        request = self.context.get('request')
        if request is None:
            return None

        if obj.illustration_transparent and obj.type == Species.PLANT_TYPE:
            return request.build_absolute_uri(obj.illustration_transparent.url)
        elif obj.illustration:
            return request.build_absolute_uri(obj.illustration.url)
        else:
            return None
    
    def get_display_name(self, obj):
        return str(obj)


class SpeciesSerializer(SpeciesSmallSerializer):
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
            'type',
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
            'audio_description',
        ]

    def get_num_observations_total(self, obj):
        return obj.observation_set.count()

    def get_num_questions_total(self, obj):
        return obj.multiplechoicequestion_set.count()



def serialize_identification_response(response: IdentificationResponse):
    return {
        'results': [serialize_identification_candidate(candidate) for candidate in response.candidates],
        'raw_response': response.raw_response,
    }

def serialize_identification_candidate(candidate: IdentificationCandidate):
    return {
        'confidence': candidate.confidence,
        'species': SpeciesSerializer(instance=Species.objects.get(pk=candidate.species.id)).data
    }