from rest_framework import generics, permissions
from .models import MultipleChoiceQuestion, Quiz, MultipleChoiceUserAnswer
from .serializers import MultipleChoiceQuestionSerializer, QuizSerializer, MultipleChoiceUserAnswerSerializer
import random
from django.utils import timezone

class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # sample 10 random questions from all available questions
        questions = random.sample(list(MultipleChoiceQuestion.objects.all()), 2)
        # set the user to the request user and the datetime to now
        serializer.save(user=self.request.user, multiple_choice_questions=questions)


    # def create(self, request, *args, **kwargs):
    #     serializer = QuizSerializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     observation = serializer.save(user=self.request.user)
    #     result = plantnet_identify(observation.image.path)
    #     species_data = result['results'][0]['species']
    #     species, created = Species.objects.get_or_create(
    #         name=species_data['scientificNameWithoutAuthor'],
    #         commonNames=species_data['commonNames'],
    #         scientificName=species_data['scientificNameWithoutAuthor'],
    #         genus=species_data['genus']['scientificNameWithoutAuthor'],
    #         family=species_data['family']['scientificNameWithoutAuthor'],
    #     )
    #     observation.species = species
    #     observation.save()
    #     serializer = ObservationSerializer(instance=observation)
    #     return Response(serializer.data)




class QuizRetrieveView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
