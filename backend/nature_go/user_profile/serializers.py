
from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    current_level_xp = serializers.SerializerMethodField()
    next_level_xp = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['username', 'xp', 'level', 'content_unlocked', 'current_level_xp', 'next_level_xp']
        lookup_field = 'username'

    def get_current_level_xp(self, instance):
         return instance.level_xp(instance.level)

    def get_next_level_xp(self, instance):
         return instance.level_xp(instance.level + 1)