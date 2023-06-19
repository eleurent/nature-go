from rest_framework import serializers
from django.contrib.auth.models import User

from observation.models import Observation


class UserSerializer(serializers.ModelSerializer):
    observations = serializers.PrimaryKeyRelatedField(many=True, queryset=Observation.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'observations']


class ObservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Observation
        fields = ['id', 'user', 'image', 'species', 'location', 'date']
