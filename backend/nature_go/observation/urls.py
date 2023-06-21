from django.urls import path
from observation import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('', views.SpeciesListView.as_view(), name='species_list'),
    path('species/<int:pk>/', views.SpeciesDetailView.as_view(), name='species_detail'),
    path('identification/', views.PlantIdentificationView.as_view(), name='plant_identification'),
    path('observation/<int:pk>/', views.ObservationView.as_view(), name='observation'),
] + format_suffix_patterns([
    path('api/observations/', views.ObservationList.as_view()),
    path('api/observations/<int:pk>/', views.ObservationDetail.as_view()),
    path('api/users/', views.UserList.as_view()),
    path('api/users/<int:pk>/', views.UserDetail.as_view()),
    path('api/species/', views.SpeciesList.as_view(), name='species-list'),
    path('api/species/<int:pk>/', views.SpeciesDetail.as_view(), name='species-detail'),
    path('api/species/<int:pk>/observations/', views.SpeciesObservationsList.as_view(), name='species-observations-list'),
])