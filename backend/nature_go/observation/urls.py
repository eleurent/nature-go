from django.urls import path
from observation import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = format_suffix_patterns([
    path('', views.SpeciesList.as_view(), name='species-list'),
    path('plant', views.PlantSpeciesList.as_view(), name='plant-species-list'),
    path('bird', views.BirdSpeciesList.as_view(), name='bird-species-list'),
    path('all/', views.SpeciesAllList.as_view(), name='species-all-list'),
    path('labeled/', views.SpeciesLabeledList.as_view(), name='species-labeled-list'),
    path('<int:pk>/', views.SpeciesDetail.as_view(), name='species-detail'),
    path('<int:pk>/observations/', views.SpeciesObservationsList.as_view(), name='species-observations-list'),
    path('observation/', views.ObservationCreate.as_view(), name='observations-create'),
    path('observation/<int:pk>/', views.ObservationUpdate.as_view(), name='observations-update'),
])