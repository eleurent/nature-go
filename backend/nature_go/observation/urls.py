from django.urls import path
from .views import SpeciesListView, SpeciesDetailView, PlantIdentificationView, ObservationView

urlpatterns = [
    path('', SpeciesListView.as_view(), name='species_list'),
    path('species/<int:pk>/', SpeciesDetailView.as_view(), name='species_detail'),
    path('identification/', PlantIdentificationView.as_view(), name='plant_identification'),
    path('observation/<int:pk>/', ObservationView.as_view(), name='observation'),
    # path('identification/confirmation/', PlantIdentificationConfirmationView.as_view(), name='plant_identification_confirmation'),
    # path('identification/result/<int:pk>/', PlantIdentificationResultView.as_view(), name='plant_identification_result'),
]