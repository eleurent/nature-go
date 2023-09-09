import numpy as np
from django.db import models
from django.contrib.auth.models import User

import observation


class MultipleChoiceQuestion(models.Model):
    species = models.ForeignKey(observation.models.Species, on_delete=models.CASCADE)
    question = models.TextField()
    choices = models.JSONField(default=list)
    correct_choice = models.IntegerField()  # don't serialize ;)

    def __str__(self):
        return f'{self.species.scientificNameWithoutAuthor} - {self.question}'


class Quiz(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    multiple_choice_questions = models.ManyToManyField(MultipleChoiceQuestion)
    datetime = models.DateTimeField(auto_now_add=True, blank=True)
    xp = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Quizzes'

    @property
    def is_answered(self):
        return (self.multiplechoiceuseranswer_set.count() ==
                self.multiple_choice_questions.count())


class MultipleChoiceUserAnswer(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE)
    user_answer = models.IntegerField()

    @property
    def is_correct(self):
        return self.user_answer == self.question.correct_choice
