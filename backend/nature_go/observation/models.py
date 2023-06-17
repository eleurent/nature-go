
from django.db import models
from django.contrib.auth.models import User

class Species(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Observation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/observation_image')
    species = models.ForeignKey(Species, on_delete=models.CASCADE, blank=True, null=True)
    location = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.species} observed by {self.user}'