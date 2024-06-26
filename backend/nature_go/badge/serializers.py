from rest_framework import serializers
from .models import Badge, UserBadge
from .badge import SpeciesBadgeLogic, TotalObservationsBadgeLogic
from observation.models import Species, Observation
from observation.serializers import SpeciesSmallSerializer
from django.db.models import Q

class BadgeDetailSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()

class BadgeLevelDetailSerializer(serializers.Serializer):
    level_name = serializers.CharField()
    threshold = serializers.IntegerField()


class SpeciesBadgeDetailSerializer(BadgeDetailSerializer):
    species_list = serializers.SerializerMethodField()
    species_observed = serializers.SerializerMethodField()
    levels = serializers.SerializerMethodField()

    def get_species_list(self, obj):
        serialized_observed = self.get_species_observed(obj)
        all_species_names = list(set(obj.logic.common_species_list).union([species['scientificNameWithoutAuthor'] for species in serialized_observed]))
        all_species_queryset = Species.objects.filter(
            Q(scientificNameWithoutAuthor__in=all_species_names) |
            Q(protonyms__overlap=all_species_names)
        )
        serialized_all = SpeciesSmallSerializer(all_species_queryset, many=True).data
        return serialized_all


    def get_species_observed(self, obj):
        user = self.context['request'].user
        observed_species = Observation.objects.filter(
            Q(user=user, species__scientificNameWithoutAuthor__in=obj.logic.species_list) |
            Q(user=user, species__protonyms__overlap=obj.logic.species_list)
        )
        observed_species = observed_species.values_list('species__scientificNameWithoutAuthor', flat=True).distinct()
        species_queryset = Species.objects.filter(scientificNameWithoutAuthor__in=observed_species)
        serialized_all = SpeciesSmallSerializer(species_queryset, many=True).data
        return serialized_all

    def get_levels(self, obj):
        return BadgeLevelDetailSerializer(obj.levels.items(), many=True).data


class TotalObservationsBadgeDetailSerializer(BadgeDetailSerializer):
    levels = serializers.SerializerMethodField()

    def get_levels(self, obj):
        return BadgeLevelDetailSerializer(obj.levels.items(), many=True).data


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = UserBadge
        fields = ['badge', 'progress', 'unlocked_level']

    def get_badge(self, obj):
        if isinstance(obj.badge.logic, SpeciesBadgeLogic):
            return SpeciesBadgeDetailSerializer(obj.badge, context=self.context).data
        elif isinstance(obj.badge.logic, TotalObservationsBadgeLogic):
            return TotalObservationsBadgeDetailSerializer(obj.badge, context=self.context).data

    def get_progress(self, obj):
        return obj.badge.logic.check_user_progress(obj.user)