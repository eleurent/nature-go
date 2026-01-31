from authentication import views
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = format_suffix_patterns([
    path('login/', csrf_exempt(obtain_auth_token), name='auth_user_login'),
    path(
        'register/',
        csrf_exempt(views.CreateUserAPIView.as_view()),
        name='auth_user_create',
    ),
    path('logout/', views.LogoutUserAPIView.as_view(), name='auth_user_logout'),
])
