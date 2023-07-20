
import os
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.contrib.staticfiles import finders

class Species(models.Model):
    name = models.CharField(max_length=255)
    commonNames = models.JSONField(default=list)
    scientificName = models.CharField(max_length=255)
    genus = models.CharField(max_length=255)
    family = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Species'

class Observation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/observation_image')
    species = models.ForeignKey(Species, on_delete=models.CASCADE, blank=True, null=True)
    location = models.JSONField(default=dict, blank=True)
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.species} observed by {self.user}'