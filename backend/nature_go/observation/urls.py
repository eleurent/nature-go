from django.urls import path
from observation import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

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
    path('api/auth/login/',
        obtain_auth_token,
        name='auth_user_login'),
    path('api/auth/register/',
        views.CreateUserAPIView.as_view(),
        name='auth_user_create'),
    path('api/auth/logout/',
        views.LogoutUserAPIView.as_view(),
        name='auth_user_logout')
])