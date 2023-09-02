from rest_framework import generics, permissions
from .models import MultipleChoiceQuestion, Quiz
from .serializers import QuizSerializer, AdminMultipleChoiceQuestionSerializer
from .permissions import IsOwner
import random
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import redirect


class MultipleChoiceQuestionListCreate(generics.ListCreateAPIView):
    queryset = MultipleChoiceQuestion.objects.all()
    serializer_class = AdminMultipleChoiceQuestionSerializer
    permission_classes = [permissions.IsAdminUser]


class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        questions = random.sample(list(MultipleChoiceQuestion.objects.all()), 2)
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
        data = QuizCreateView.as_view()(self.request._request).data
        return Quiz.objects.get(pk=data['id'])
    

class QuizRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
