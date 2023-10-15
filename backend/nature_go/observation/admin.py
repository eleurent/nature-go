from django.contrib import admin
from .models import Species, Observation


class SpeciesAdmin(admin.ModelAdmin):
    search_fields = ('scientificNameWithoutAuthor', 'commonNames')


admin.site.register(Species, SpeciesAdmin)
admin.site.register(Observation)