from django.contrib import admin
from .models import MultipleChoiceQuestion, Quiz, MultipleChoiceUserAnswer

admin.site.register(MultipleChoiceQuestion)
admin.site.register(MultipleChoiceUserAnswer)
admin.site.register(Quiz)
