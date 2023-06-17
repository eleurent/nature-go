import requests
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import ListView, DetailView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Species, Observation

PAYLOAD = {'species': ['Edelweiss', 'Harebell']}


class PlantIdentificationView(LoginRequiredMixin, TemplateView):
    template_name = 'plant_identification.html'

    def post(self, request):
        image = request.FILES['image']
        
        # url = 'https://my-api.com/plantnet'
        # files = {'image': image}
        # response = requests.post(url, files=files)
        # payload = response.json()
        payload = PAYLOAD
        request.session['species_list'] = payload['species']

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


class SpeciesDetailView(LoginRequiredMixin, DetailView):
    model = Species
    template_name = 'species_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['observations'] = Observation.objects.filter(species=self.object)
        return context
