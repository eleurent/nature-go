from django.urls import path
from authentication import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = format_suffix_patterns([
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