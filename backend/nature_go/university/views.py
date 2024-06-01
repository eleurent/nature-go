from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from .models import MultipleChoiceQuestion, Quiz
from .serializers import QuizSerializer, AdminMultipleChoiceQuestionSerializer, MultipleChoiceQuestionSerializer
from .permissions import IsOwner
from observation.models import Species, Observation
from generation.question_generation import generate_questions
from generation.gemini import generate_text
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


class MultipleChoiceQuestionGeneration(generics.GenericAPIView):
  queryset = Species.objects.all()
  serializer_class = MultipleChoiceQuestionSerializer

  def post(self, request, *args, **kwargs):
    del request, args, kwargs
    species = self.get_object()
    questions = species.multiplechoicequestion_set
    if species.descriptions and not questions.exists():
        material = '\n '.join(species.descriptions)
        questions, _ = generate_questions(
            generate_text=generate_text,
            species=species,
            material=material,
        )
        questions = [
            MultipleChoiceQuestion(
                species=species,
                **q
            )
            for q in questions
        ]
        [q.save() for q in questions]

    serializer = self.get_serializer(questions, many=True)
    return Response(serializer.data)


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


class QuizGetOrCreateView(generics.RetrieveAPIView, generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def retrieve(self, request, *args, **kwargs):
        recent_quizzes = Quiz.objects.filter(
            user=self.request.user, datetime__gte=timezone.now() - timedelta(hours=24))
        quizzes = [quiz for quiz in recent_quizzes if not quiz.is_answered]

        if quizzes:
            serializer = self.get_serializer(quizzes[0])
            return Response(serializer.data)
        else:
            return QuizCreateView.as_view()(self.request._request)


class QuizRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

