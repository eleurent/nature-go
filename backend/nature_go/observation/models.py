
import os
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.contrib.staticfiles import finders

class Species(models.Model):
    commonNames = models.JSONField(default=list, blank=True)
    scientificName = models.CharField(max_length=255)
    scientificNameWithoutAuthor = models.CharField(max_length=255, unique=True)
    genus = models.CharField(max_length=255)
    family = models.CharField(max_length=255)
    occurences_cdf = models.FloatField(null=True, blank=True)
    descriptions = models.JSONField(default=list, blank=True)
    illustration = models.ImageField(upload_to='species/illustration', blank=True)
    illustration_transparent = models.ImageField(upload_to='species/illustration_transparent', blank=True)
    wikipedia_image_url = models.URLField(max_length=255, blank=True)

    def __str__(self):
        return self.scientificNameWithoutAuthor

    class Meta:
        verbose_name_plural = 'Species'

class Observation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='observation/image')
    species = models.ForeignKey(Species, on_delete=models.CASCADE, blank=True, null=True)
    location = models.JSONField(default=dict, blank=True, null=True)
    identification_response = models.JSONField(default=dict, blank=True, null=True)
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.species} observed by {self.user}'