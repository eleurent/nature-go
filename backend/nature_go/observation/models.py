
import os
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.contrib.staticfiles import finders

class Species(models.Model):
    commonNames = models.JSONField(default=list, blank=True)
    scientificName = models.CharField(max_length=255, unique=True)
    scientificNameWithoutAuthor = models.CharField(max_length=255)
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
    xp = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return f'{self.species} observed by {self.user}'

    def compute_xp(self) -> dict:
        rarity_xp_values = {
            'Common' : 5,
            'Uncommon': 10,
            'Rare': 20
        }
        rarity_reason = (
            'Uncommon' if not self.species.occurences_cdf else
            'Common' if self.species.occurences_cdf > 0.66 else
            'Uncommon' if self.species.occurences_cdf > 0.33 else
            'Rare'
        )
        rarity_xp = {
            'value': rarity_xp_values[rarity_reason],
            'reason': {'Rarity': rarity_reason}
        }

        familiarity_xp_values = {
            'New' : 50,
            'Unfamiliar': 10,
            'Expert': 5
        }
        n_observations = Observation.objects.filter(user=self.user, species=self.species).count()
        familiarity_reason = (
            'New' if n_observations <= 1 else
            'Unfamiliar' if n_observations <= 3 else
            'Expert' 
        )
        familiarity_xp = {
            'value': familiarity_xp_values[familiarity_reason],
            'reason': {'Familiarity': familiarity_reason}
        }
        total = sum([xp['value'] for xp in [rarity_xp, familiarity_xp]])
        return {
            'total': total,
            'breakdown': [rarity_xp, familiarity_xp]
        }