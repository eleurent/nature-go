from django.db import models
from django.db.models import Avg, Case, When, Sum, F
from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    current_level_xp = serializers.SerializerMethodField()
    next_level_xp = serializers.SerializerMethodField()
    species_count = serializers.SerializerMethodField()
    observations_count = serializers.SerializerMethodField()
    quiz_count = serializers.SerializerMethodField()
    quiz_mean_score = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = [
             'username', 
             'avatar',
             'xp', 
             'level', 
             'content_unlocked', 
             'current_level_xp', 
             'next_level_xp',
             'species_count',
             'observations_count',
             'quiz_count',
             'quiz_mean_score',
        ]
        lookup_field = 'username'

    def get_current_level_xp(self, instance):
         return instance.level_xp(instance.level)

    def get_next_level_xp(self, instance):
         return instance.level_xp(instance.level + 1)
    
    def get_species_count(self, instance):
        return len(set(obs.species for obs in instance.user.observation_set.all() if obs.species is not None))

    def get_observations_count(self, instance):
        return instance.user.observation_set.exclude(species=None).count()
    
    def get_quiz_count(self, instance):
        return instance.user.quiz_set.count()

    def get_quiz_mean_score(self, instance):
        quizzes = instance.user.quiz_set.all()

        # Annotate each quiz with the number of correct answers
        quizzes = quizzes.annotate(correct_answers=Sum(Case(
            When(multiplechoiceuseranswer__user_answer=F('multiplechoiceuseranswer__question__correct_choice'), then=1),
            default=0,
            output_field=models.IntegerField()
        )))

        # Aggregate the average number of correct answers across all quizzes
        average_correct_answers = quizzes.aggregate(Avg('correct_answers'))['correct_answers__avg']
        return average_correct_answers