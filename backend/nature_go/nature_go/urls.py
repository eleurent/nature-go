"""nature_go URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path, re_path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from website.views import serve_pwa


@api_view(['GET'])
def api_root(request):
  return Response({
      'species': reverse('species-list', request=request),
      'auth': request.build_absolute_uri('/api/auth/'),
      'profile': request.build_absolute_uri('/api/profile/'),
      'badge': request.build_absolute_uri('/api/badge/'),
      'poster': request.build_absolute_uri('/api/poster/regions/'),
      'university': request.build_absolute_uri('/api/university/'),
  })


urlpatterns = [
    path('accounts/login/', auth_views.LoginView.as_view(), name='login'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/species/', include('observation.urls')),
    path('api/university/', include('university.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/profile/', include('user_profile.urls')),
    path('api/badge/', include('badge.urls')),
    path('api/poster/', include('poster.urls')),
    path('api-auth/', include('rest_framework.urls')),
    re_path(r'^(?P<path>.*)$', serve_pwa),
]


if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
  urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
