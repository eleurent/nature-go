"""URL routes for the regional bird poster feature."""

from django.urls import path
from poster.views import RegionListView, PosterDataView

urlpatterns = [
    path("regions/", RegionListView.as_view(), name="poster-regions"),
    path("<str:region_id>/", PosterDataView.as_view(), name="poster-data"),
]
