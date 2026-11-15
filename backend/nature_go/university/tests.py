from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from observation.models import Species
from university.models import MultipleChoiceQuestion, Quiz


User = get_user_model()


class QuizSecurityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='student', password='StrongPassword123!')
        self.other_user = User.objects.create_user(username='other', password='StrongPassword123!')
        self.species = Species.objects.create(
            type=Species.BIRD_TYPE,
            scientificNameWithoutAuthor='Turdus merula',
            genus='Turdus',
            family='Turdidae',
        )
        self.question_in_quiz = MultipleChoiceQuestion.objects.create(
            species=self.species,
            question='What is its common name?',
            choices=['Blackbird', 'Robin', 'Sparrow', 'Wren'],
            correct_choice=0,
        )
        self.question_outside_quiz = MultipleChoiceQuestion.objects.create(
            species=self.species,
            question='Where does it nest?',
            choices=['Trees', 'Caves', 'Burrows', 'Cliffs'],
            correct_choice=0,
        )
        self.quiz = Quiz.objects.create(user=self.user)
        self.quiz.multiple_choice_questions.add(self.question_in_quiz)
        self.other_quiz = Quiz.objects.create(user=self.other_user)
        self.client.force_authenticate(user=self.user)

    def test_cannot_inject_arbitrary_xp_on_quiz_patch(self):
        response = self.client.patch(
            f'/api/university/quiz/{self.quiz.id}/',
            {'xp': {'total': 999999}},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.quiz.refresh_from_db()
        self.assertEqual(self.quiz.xp, {})

    def test_cannot_submit_question_outside_quiz(self):
        response = self.client.patch(
            f'/api/university/quiz/{self.quiz.id}/',
            {
                'multiplechoiceuseranswer_set': [
                    {
                        'quiz': self.quiz.id,
                        'question': self.question_outside_quiz.id,
                        'user_answer': 0,
                    }
                ]
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_write_answers_to_other_users_quiz(self):
        response = self.client.patch(
            f'/api/university/quiz/{self.quiz.id}/',
            {
                'multiplechoiceuseranswer_set': [
                    {
                        'quiz': self.other_quiz.id,
                        'question': self.question_in_quiz.id,
                        'user_answer': 0,
                    }
                ]
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.other_quiz.multiplechoiceuseranswer_set.count(), 0)
        self.assertEqual(self.quiz.multiplechoiceuseranswer_set.count(), 1)
