from django.db import models
from django.contrib.auth.models import User

import observation


class MultipleChoiceQuestion(models.Model):
    species = models.ForeignKey(observation.models.Species, on_delete=models.CASCADE)
    prompt = models.TextField()
    answers = models.JSONField(default=list)
    correct_answer = models.IntegerField()  # don't serialize ;)

    def __str__(self):
        return f'{self.species.name} - {self.prompt}'


class Quiz(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    multiple_choice_questions = models.ManyToManyField(MultipleChoiceQuestion)
    datetime = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        verbose_name_plural = 'Quizzes'


class MultipleChoiceUserAnswer(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE)
    user_answer = models.IntegerField()

