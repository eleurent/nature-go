from rest_framework import serializers
from .models import MultipleChoiceQuestion, Quiz, MultipleChoiceUserAnswer
from user_profile.signals import xp_gained

class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'species', 'question', 'choices']

class AdminMultipleChoiceQuestionSerializer(MultipleChoiceQuestionSerializer):
    # Same with added correct_choice field
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'species', 'question', 'choices', 'correct_choice']


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
        if not instance.xp and instance.multiplechoiceuseranswer_set.exists():
            xp_gained.send(sender=instance.__class__, instance=instance)
        return instance