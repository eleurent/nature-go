from rest_framework import generics, permissions, serializers, status
from .models import MultipleChoiceQuestion, Quiz
from .serializers import QuizSerializer, AdminMultipleChoiceQuestionSerializer
from .permissions import IsOwner
from observation.models import Observation
import random
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import redirect


class MultipleChoiceQuestionListCreate(generics.ListCreateAPIView):
    queryset = MultipleChoiceQuestion.objects.all()
    serializer_class = AdminMultipleChoiceQuestionSerializer
    permission_classes = [permissions.IsAdminUser]


class MultipleChoiceQuestionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = MultipleChoiceQuestion.objects.all()
    serializer_class = AdminMultipleChoiceQuestionSerializer
    permission_classes = [permissions.IsAdminUser]


class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        user = self.request.user
        observed_species = Observation.objects.filter(user=user).values_list('species__id', flat=True)
        questions = MultipleChoiceQuestion.objects.filter(species__id__in=observed_species)
        num_questions = min(5, questions.count())
        questions = random.sample(list(questions), num_questions)
        if not len(questions) > 0:
            raise serializers.ValidationError('Cannot create a quiz because no species with questions have been observed.')
        serializer.save(user=self.request.user, multiple_choice_questions=questions)
        
    def get(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class QuizGetOrCreateView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_object(self):
        recent_quizzes = Quiz.objects.filter(
            user=self.request.user, datetime__gte=timezone.now() - timedelta(hours=24))
        for quiz in recent_quizzes:
            if not quiz.is_answered:
                return quiz
        response = QuizCreateView.as_view()(self.request._request)
        if response.status_code == status.HTTP_200_OK:
            return Quiz.objects.get(pk=response.data['id'])
        else:
            raise serializers.ValidationError('The quiz could not be found or created.')
    

class QuizRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
