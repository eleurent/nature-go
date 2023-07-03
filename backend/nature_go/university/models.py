from django.db import models
import random

import observation


class MultipleChoiceQuestion(models.Model):
    species = models.ForeignKey(observation.Species, on_delete=models.CASCADE)
	prompt = models.TextField()
	answers: models.JSONField(default=list)
	correct_answer: models.IntegerField()  # don't serialize ;)

	@staticmethod
	def sample(known_species, quiz_questions):
		known_species_questions = MultipleChoiceQuestion.objects.filter(species in known_species)
		remaining_questions = set(known_species_questions).remove(quiz_questions)
		if remaining_questions:
			return random.choice(remaining_questions)
		else:
			return None