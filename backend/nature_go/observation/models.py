
import os
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.contrib.staticfiles import finders

class Species(models.Model):
    scientificNameWithoutAuthor = models.CharField(max_length=255, unique=False)
    scientificNameAuthorship = models.CharField(max_length=255, default='')
    commonNames = models.JSONField(default=list, blank=True)
    genus = models.CharField(max_length=255)
    family = models.CharField(max_length=255)
    gbif_id = models.CharField(max_length=20, default='')
    powo_id = models.CharField(max_length=20, default='')
    wikipedia_word_count = models.IntegerField(null=True, blank=True)
    number_of_occurrences = models.IntegerField(null=True, blank=True)
    occurences_cdf = models.FloatField(null=True, blank=True)
    rarity_gpt = models.FloatField(null=True, blank=True)
    descriptions = models.JSONField(default=list, blank=True)
    illustration = models.ImageField(upload_to='species/illustration', blank=True)
    illustration_transparent = models.ImageField(upload_to='species/illustration_transparent', blank=True)
    illustration_reference = models.ImageField(upload_to='species/illustration_reference', blank=True)
    illustration_reference_transparent = models.ImageField(upload_to='species/illustration_reference_transparent', blank=True)
    reference_image_url = models.URLField(max_length=255, blank=True)

    def __str__(self):
        return self.commonNames[0] if self.commonNames else self.scientificNameWithoutAuthor

    class Meta:
        verbose_name_plural = 'Species'

class Observation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='observation/image')
    species = models.ForeignKey(Species, on_delete=models.CASCADE, blank=True, null=True)
    location = models.JSONField(default=dict, blank=True, null=True)
    identification_response = models.JSONField(default=dict, blank=True, null=True)
    datetime = models.DateTimeField(auto_now_add=True)
    xp = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return f'{self.species} observed by {self.user}'