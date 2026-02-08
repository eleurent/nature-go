"""URL routes for the poster feature."""

from django.urls import path
from poster.views import PosterDataView, PosterListView

urlpatterns = [
    path("", PosterListView.as_view(), name="poster-list"),
    path("<str:poster_id>/", PosterDataView.as_view(), name="poster-data"),
]
