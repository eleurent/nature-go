from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.shortcuts import redirect, render
from .models import Species, Observation


class SpeciesAdmin(admin.ModelAdmin):
    search_fields = ('scientificNameWithoutAuthor', 'commonNames')
    list_filter = ['type']
    actions = ['delete_illustration']

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('illustration-review/', self.admin_site.admin_view(self.species_illustration_review), name='species_illustration_review'),
        ]
        return custom_urls + urls

    def species_illustration_review(self, request):
        """Visit /admin/observation/species/illustration-review/"""
        
        species = Species.objects.all()
        type_filter = request.GET.get('type')
        if type_filter:
            species = species.filter(type=type_filter)
        ordering = request.GET.get('oredering')
        if ordering:
            species = species.order_by(ordering)
        paginator = Paginator(species, 1)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {
            'page_obj': page_obj,
        }
        return render(request, 'admin/species_illustration_review.html', context)

    def delete_illustration(self, request, queryset):
        for species in queryset:
            species.illustration.delete()
            species.illustration_transparent.delete()
            species.save()

    delete_illustration.short_description = 'Delete illustration'




admin.site.register(Species, SpeciesAdmin)
admin.site.register(Observation)