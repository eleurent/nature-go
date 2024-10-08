from rest_framework import serializers
from .models import MultipleChoiceQuestion, Quiz, MultipleChoiceUserAnswer
from observation.serializers import SpeciesSerializer
from user_profile.signals import xp_gained

class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    species_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'species', 'question', 'choices', 'species_name']

    def get_species_name(self, obj):
        return str(obj.species)

class AdminMultipleChoiceQuestionSerializer(MultipleChoiceQuestionSerializer):
    # Same with added correct_choice field
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'species', 'question', 'choices', 'species_name', 'correct_choice']


class MultipleChoiceUserAnswerSerializer(serializers.ModelSerializer):
    is_correct = serializers.ReadOnlyField()

    class Meta:
        model = MultipleChoiceUserAnswer
        fields = ['id', 'quiz', 'question', 'user_answer', 'is_correct']

    

class QuizSerializer(serializers.ModelSerializer):
    multiple_choice_questions = MultipleChoiceQuestionSerializer(many=True, read_only=True)
    multiplechoiceuseranswer_set = MultipleChoiceUserAnswerSerializer(many=True, required=False)

    class Meta:
        model = Quiz
        fields = ['id', 'user', 'multiple_choice_questions', 'datetime', 'multiplechoiceuseranswer_set', 'xp']
        read_only_fields = ('user', 'multiple_choice_questions', 'datetime')

    def update(self, instance, validated_data):
        # the serializer can only update the user answers
        if validated_data.get('multiplechoiceuseranswer_set'):
            instance.multiplechoiceuseranswer_set.all().delete()
            [MultipleChoiceUserAnswer.objects.create(**answer)
             for answer in validated_data.get('multiplechoiceuseranswer_set')]
        if not instance.xp and instance.is_answered:
            xp_gained.send(sender=instance.__class__, instance=instance)
        return instance