from rest_framework import serializers
from .models import Badge, UserBadge
from .badge import SpeciesBadgeLogic, TotalObservationsBadgeLogic
from observation.models import Observation

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
        return obj.logic.species_list
    
    def get_species_observed(self, obj):
        user = self.context['request'].user
        return list(Observation.objects.filter(user=user, species__scientificNameWithoutAuthor__in=obj.logic.species_list).values_list('species__scientificNameWithoutAuthor', flat=True).distinct())
    
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
        fields = ['badge', 'progress']

    def get_badge(self, obj):
        if isinstance(obj.badge.logic, SpeciesBadgeLogic):
            return SpeciesBadgeDetailSerializer(obj.badge, context=self.context).data
        elif isinstance(obj.badge.logic, TotalObservationsBadgeLogic):
            return TotalObservationsBadgeDetailSerializer(obj.badge, context=self.context).data

    def get_progress(self, obj):
        return obj.badge.logic.check_user_progress(obj.user)