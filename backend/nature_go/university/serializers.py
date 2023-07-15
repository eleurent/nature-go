from rest_framework import serializers
from .models import MultipleChoiceQuestion, Quiz, MultipleChoiceUserAnswer

class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'species', 'prompt', 'answers']

class QuizSerializer(serializers.ModelSerializer):
    multiple_choice_questions = MultipleChoiceQuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = ['id', 'user', 'multiple_choice_questions', 'datetime']
        read_only_fields = ('user', 'multiple_choice_questions', 'datetime')

class MultipleChoiceUserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceUserAnswer
        fields = ['id', 'quiz', 'question', 'user_answer']