from django.shortcuts import redirect
from django.views.generic import ListView, DetailView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics

from observation.models import Species, Observation
from observation.serializers import ObservationSerializer, UserSerializer, SpeciesSerializer, CreateUserSerializer


class PlantIdentificationView(LoginRequiredMixin, TemplateView):
    template_name = 'plant_identification.html'

    def post(self, request):
        image = request.FILES['image']
        
        # url = 'https://my-api.com/plantnet'
        # files = {'image': image}
        # response = requests.post(url, files=files)
        # payload = response.json()
        request.session['species_list'] = [
            species.name for species in Species.objects.all().distinct()]


        location = ''
        date = ''
        observation = Observation(
            user=request.user, image=image, species=None, location=location, date=date)
        observation.save()
        return redirect('observation', observation.id)
    

class ObservationView(LoginRequiredMixin, DetailView):
    model = Observation
    template_name = 'observation.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['species_list'] = self.request.session.get('species_list', [])
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        species, created = Species.objects.get_or_create(name=request.POST['species'])
        self.object.species = species
        self.object.save()
        return redirect('observation', self.object.id)


class SpeciesListView(LoginRequiredMixin, ListView):
    model = Species
    template_name = 'species_list.html'

    def get_queryset(self):
        user = self.request.user
        return Species.objects.filter(observation__user=user).distinct()


class SpeciesDetailView(LoginRequiredMixin, DetailView):
    model = Species
    template_name = 'species_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['observations'] = Observation.objects.filter(
            species=self.object, user=self.request.user)
        return context


class ObservationList(generics.ListCreateAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ObservationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SpeciesList(generics.ListAPIView):
    serializer_class = SpeciesSerializer

    def get_queryset(self):
        user = self.request.user
        return Species.objects.filter(observation__user=user).distinct()


class SpeciesDetail(generics.RetrieveAPIView):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer


class SpeciesObservationsList(generics.ListAPIView):
    serializer_class = ObservationSerializer

    def get_queryset(self):
        user = self.request.user
        species_id = self.kwargs['pk']
        return Observation.objects.filter(user=user, species=species_id)


class CreateUserAPIView(generics.CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # We create a token than will be used for future auth
        token = Token.objects.create(user=serializer.instance)
        token_data = {"token": token.key}
        return Response(
            {**serializer.data, **token_data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()

    def get(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)