from django.urls import path
from .views import BadgeListView, BadgeDetailView

urlpatterns = [
    path('badges/', BadgeListView.as_view(), name='badge-list'),
    path('badges/<str:badge_name>/', BadgeDetailView.as_view(), name='badge-detail'),
]