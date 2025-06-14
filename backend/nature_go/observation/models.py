from django.db import models
from django.contrib.auth.models import User
from dataclasses import dataclass
import typing as tp

class Species(models.Model):
    PLANT_TYPE = 'plant'
    BIRD_TYPE = 'bird'
    SPECIES_TYPE_CHOICES = [
        (PLANT_TYPE, PLANT_TYPE),
        (BIRD_TYPE, BIRD_TYPE),
    ]

    type = models.CharField(max_length=10, choices=SPECIES_TYPE_CHOICES)
    scientificNameWithoutAuthor = models.CharField(max_length=255, unique=True)
    scientificNameAuthorship = models.CharField(max_length=255, default='')
    commonNames = models.JSONField(default=list, blank=True)
    protonyms = models.JSONField(default=list, blank=True)
    genus = models.CharField(max_length=255)
    family = models.CharField(max_length=255)
    gbif_id = models.CharField(max_length=20, default='', blank=True)
    powo_id = models.CharField(max_length=20, default='', blank=True)
    avibase_id = models.CharField(max_length=20, default='', blank=True)
    wikipedia_word_count = models.IntegerField(null=True, blank=True)
    number_of_occurrences = models.IntegerField(null=True, blank=True)
    occurences_cdf = models.FloatField(null=True, blank=True)
    rarity_gpt = models.FloatField(null=True, blank=True)
    rarity_status = models.CharField(max_length=31, default='', blank=True)
    descriptions = models.JSONField(default=list, blank=True)
    illustration = models.ImageField(upload_to='species/illustration', blank=True)
    illustration_transparent = models.ImageField(upload_to='species/illustration_transparent', blank=True)
    illustration_reference = models.ImageField(upload_to='species/illustration_reference', blank=True)
    illustration_reference_transparent = models.ImageField(upload_to='species/illustration_reference_transparent', blank=True)
    reference_image_url = models.URLField(max_length=255, blank=True)
    audio_description = models.FileField(upload_to='species/audio_description', blank=True, null=True)

    def __str__(self):
        return self.commonNames[0] if self.commonNames else self.scientificNameWithoutAuthor

    @property
    def rarity(self):
        rgpt = self.rarity_gpt
        ocdf = self.occurences_cdf
        if not rgpt:
            return 'Legendary'

        if ocdf:
            if rgpt <= 2.8:
                return 'Very Common'
            elif (2.8 < rgpt <= 3.4) or ocdf >= 0.3097:
                return 'Common'
            elif (3.4 < rgpt <= 3.6) or (0.11 <= ocdf < 0.3097):
                return 'Uncommon'
            elif (3.6 < rgpt <= 4.2) or (0.01 <= ocdf < 0.11):
                return 'Rare'

        if rgpt <= 2.8:
            return 'Very Common'
        elif 2.8 < rgpt <= 3.4:
            return 'Common'
        elif 3.4 < rgpt <= 3.8:
            return 'Uncommon'
        elif 3.8 < rgpt <= 4.6:
            return 'Rare'
        elif rgpt > 4.6:
            return 'Legendary'

    class Meta:
        verbose_name_plural = 'Species'

class Observation(models.Model):
    ORGAN_CHOICES = [
        ('whole', 'whole'),
        ('leaf', 'leaf'),
        ('flower', 'flower'),
        ('fruit', 'fruit'),
        ('bark', 'bark'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='observation/image')
    type = models.CharField(max_length=10, choices=Species.SPECIES_TYPE_CHOICES)
    organ = models.CharField(max_length=10, choices=ORGAN_CHOICES)
    species = models.ForeignKey(Species, on_delete=models.CASCADE, blank=True, null=True)
    location = models.JSONField(default=dict, blank=True, null=True)
    identification_response = models.JSONField(default=dict, blank=True, null=True)
    datetime = models.DateTimeField(blank=True)
    xp = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return f'{self.species} observed by {self.user}'


@dataclass
class IdentificationCandidate:
    species: Species
    confidence: float

@dataclass
class IdentificationResponse:
    candidates: tp.List[IdentificationCandidate]
    raw_response: tp.Optional[str] = None
