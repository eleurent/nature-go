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

    def compute_xp(self) -> dict:
        per_question_xp = [mcua.compute_xp() for mcua in self.multiplechoiceuseranswer_set.all()]
        return {
            'total': sum(q['total'] for q in per_question_xp),
            'breakdown': per_question_xp
        }


class MultipleChoiceUserAnswer(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE)
    user_answer = models.IntegerField()

    @property
    def is_correct(self):
        return self.user_answer == self.question.correct_choice

    def compute_xp(self) -> dict:
        difficulty_xp_values = {
            'Easy' : 5,
            'Medium': 10,
            'Hard': 20,
        }
        difficulty_reason = 'Medium'
        difficulty_xp = {
            'value': difficulty_xp_values[difficulty_reason],
            'reason': {'Difficulty': difficulty_reason}
        }

        n_correct_answers = MultipleChoiceUserAnswer.objects.filter(
            quiz__user=self.quiz.user,
            question=self.question,
            user_answer=self.question.correct_choice).count()
        familiarity_reason = (
            'Unfamiliar' if n_correct_answers <= 3 else
            'Familiar' if n_correct_answers <= 6 else
            'Expert' 
        )
        familiarity_xp = {
            'value': np.exp((1-n_correct_answers) / 3),
            'reason': {'Familiarity ratio': familiarity_reason}
        }
        total = difficulty_xp['value'] * familiarity_xp['value']
        return {
            'total': total,
            'breakdown': [difficulty_xp, familiarity_xp]
        }