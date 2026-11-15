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
  correct_choice = serializers.IntegerField(
      source='question.correct_choice', read_only=True
  )

  class Meta:
    model = MultipleChoiceUserAnswer
    fields = [
        'id',
        'quiz',
        'question',
        'user_answer',
        'is_correct',
        'correct_choice',
    ]


class QuizSerializer(serializers.ModelSerializer):
    multiple_choice_questions = MultipleChoiceQuestionSerializer(many=True, read_only=True)
    multiplechoiceuseranswer_set = MultipleChoiceUserAnswerSerializer(many=True, required=False)

    class Meta:
        model = Quiz
        fields = ['id', 'user', 'multiple_choice_questions', 'datetime', 'multiplechoiceuseranswer_set', 'xp']
        read_only_fields = ('user', 'multiple_choice_questions', 'datetime', 'xp')

    def update(self, instance, validated_data):
        # the serializer can only update the user answers
        answers = validated_data.get('multiplechoiceuseranswer_set')
        if answers is not None:
            valid_question_ids = set(
                instance.multiple_choice_questions.values_list('id', flat=True)
            )
            for answer in answers:
                if answer['question'].id not in valid_question_ids:
                    raise serializers.ValidationError(
                        'Question does not belong to this quiz.'
                    )
            instance.multiplechoiceuseranswer_set.all().delete()
            for answer in answers:
                answer = dict(answer)
                answer['quiz'] = instance
                MultipleChoiceUserAnswer.objects.create(**answer)
        if not instance.xp and instance.is_answered:
            xp_gained.send(sender=instance.__class__, instance=instance)
        return instance
