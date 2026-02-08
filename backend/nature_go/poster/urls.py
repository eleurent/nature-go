"""URL routes for the poster feature."""

from django.urls import path
from poster.views import PosterDataView, PosterListView, RegionListView

urlpatterns = [
    path("", PosterListView.as_view(), name="poster-list"),
    path("regions/", RegionListView.as_view(), name="poster-regions"),
    path("<str:region_id>/", PosterDataView.as_view(), name="poster-data"),
]
