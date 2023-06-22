from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.models import User

from observation.models import Observation, Species


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

class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'commonNames', 'scientificName', 'genus', 'family']




class CreateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True,
                                     style={'input_type': 'password'})

    class Meta:
        model = get_user_model()
        fields = ('username', 'password', 'first_name', 'last_name')
        write_only_fields = ('password')
        read_only_fields = ('is_staff', 'is_superuser', 'is_active',)

    def create(self, validated_data):
        user = super(CreateUserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
