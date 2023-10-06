from django.db import models
from django.contrib.auth.models import User
import numpy as np

from university.models import MultipleChoiceUserAnswer, Quiz
from observation.models import Observation


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    avatar = models.CharField(max_length=20, default='', blank=True)
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    content_unlocked = models.JSONField(default=dict)

    def __str__(self):
        return self.user.username
    
    def level_xp(self, level):
        return 10 * level ** 3 - 10

    def gain_xp_from(self, instance):
        if hasattr(instance, 'xp') and instance.xp: return
        if isinstance(instance, Quiz):
            instance.xp = compute_quiz_xp(instance)
        elif isinstance(instance, Observation):
            instance.xp = compute_observation_xp(instance)
        else:
            raise ValueError(f'Unkown XP source: {instance}')
        instance.save()
        self.xp += instance.xp['total']
        if self.xp > self.level_xp(self.level + 1):
            self.level += 1
        self.save()


def compute_observation_xp(obs: Observation) -> dict:
    rarity_xp_values = {
        'Common' : 5,
        'Uncommon': 10,
        'Rare': 20
    }
    rarity_reason = (
        'Uncommon' if not obs.species.occurences_cdf else
        'Common' if obs.species.occurences_cdf > 0.66 else
        'Uncommon' if obs.species.occurences_cdf > 0.33 else
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
    n_observations = Observation.objects.filter(user=obs.user, species=obs.species).count()
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


def compute_quiz_xp(quiz: Quiz) -> dict:
    per_question_xp = [compute_user_answer_xp(mcua) for mcua in quiz.multiplechoiceuseranswer_set.all()]
    return {
        'total': sum(q['total'] for q in per_question_xp),
        'breakdown': per_question_xp
    }


def compute_user_answer_xp(user_answer) -> dict:
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
        quiz__user=user_answer.quiz.user,
        question=user_answer.question,
        user_answer=user_answer.question.correct_choice).count()
    familiarity_reason = (
        'Unfamiliar' if n_correct_answers <= 3 else
        'Familiar' if n_correct_answers <= 6 else
        'Expert' 
    )
    familiarity_xp = {
        'value': np.exp((1-n_correct_answers) / 3),
        'reason': {'Familiarity ratio': familiarity_reason}
    }

    correctness_xp = {
        'value': user_answer.is_correct,
        'reason': {'Correctness': user_answer.is_correct}
    }
    
    total = difficulty_xp['value'] * familiarity_xp['value'] * correctness_xp['value']
    return {
        'total': total,
        'breakdown': [difficulty_xp, familiarity_xp, correctness_xp]
    }