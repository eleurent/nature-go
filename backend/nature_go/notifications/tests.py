from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from notifications.models import Notification
from observation.models import Observation, Species
from university.models import MultipleChoiceQuestion, Quiz
from user_profile.models import Profile


User = get_user_model()


class NotificationAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='naturalist', password='StrongPassword123!'
        )
        self.other_user = User.objects.create_user(
            username='rival', password='StrongPassword123!'
        )
        self.client.force_authenticate(user=self.user)

        self.n1 = Notification.objects.create(
            user=self.user,
            notification_type=Notification.TYPE_LEVEL_UP,
            title='Promoted to Field Assistant!',
            message='Level 2 reached.',
            data={'old_level': 1, 'new_level': 2},
        )
        self.n2 = Notification.objects.create(
            user=self.user,
            notification_type=Notification.TYPE_BADGE_UNLOCKED,
            title='Pigeons — Bronze Badge Unlocked!',
            message='Bronze rank achieved.',
            data={'poster_id': 'birds_pigeons', 'new_level': 'Bronze'},
            is_read=True,
        )
        self.other_notif = Notification.objects.create(
            user=self.other_user,
            notification_type=Notification.TYPE_INFO,
            title='Private dispatch',
        )

    def test_list_notifications_scoped_to_user_and_filters(self):
        resp = self.client.get('/api/notifications/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = [n['id'] for n in resp.data]
        self.assertEqual(set(ids), {self.n1.id, self.n2.id})

        unread_resp = self.client.get('/api/notifications/?unread=true')
        self.assertEqual(unread_resp.status_code, status.HTTP_200_OK)
        self.assertEqual([n['id'] for n in unread_resp.data], [self.n1.id])

        type_resp = self.client.get('/api/notifications/?type=badge_unlocked')
        self.assertEqual(type_resp.status_code, status.HTTP_200_OK)
        self.assertEqual([n['id'] for n in type_resp.data], [self.n2.id])

    def test_unread_count_and_mark_read(self):
        count_resp = self.client.get('/api/notifications/unread_count/')
        self.assertEqual(count_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(count_resp.data['unread_count'], 1)

        mark_resp = self.client.post(
            '/api/notifications/mark_read/',
            {'ids': [self.n1.id, self.other_notif.id]},
            format='json',
        )
        self.assertEqual(mark_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(mark_resp.data['updated'], 1)
        self.assertEqual(mark_resp.data['unread_count'], 0)

        self.other_notif.refresh_from_db()
        self.assertFalse(self.other_notif.is_read)

    def test_mark_single_read_and_delete_isolation(self):
        resp = self.client.post(f'/api/notifications/{self.other_notif.id}/read/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

        del_resp = self.client.delete(f'/api/notifications/{self.other_notif.id}/')
        self.assertEqual(del_resp.status_code, status.HTTP_404_NOT_FOUND)

        own_resp = self.client.post(f'/api/notifications/{self.n1.id}/read/')
        self.assertEqual(own_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(own_resp.data['notification']['is_read'])

        own_del = self.client.delete(f'/api/notifications/{self.n2.id}/')
        self.assertEqual(own_del.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Notification.objects.filter(id=self.n2.id).exists())


class ProgressionNotificationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='darwin', password='StrongPassword123!'
        )
        self.client.force_authenticate(user=self.user)
        self.profile, _ = Profile.objects.get_or_create(user=self.user)

        # Columba livia is in the 'birds_pigeons' poster (3 core species -> 1 seen = 33% = Bronze)
        self.pigeon = Species.objects.create(
            type=Species.BIRD_TYPE,
            scientificNameWithoutAuthor='Columba livia',
            commonNames=['Rock Dove'],
            genus='Columba',
            family='Columbidae',
            rarity_gpt=3.5,  # Uncommon -> 10 XP + 50 New = 60 XP (enough for Level 1 -> Level 2 at 70? Wait: level_xp(2)=70)
        )

    def test_observation_confirm_creates_level_badge_species_and_milestone_notifications(self):
        # Give user 15 XP so 60 XP from observation crosses level 2 threshold (70 XP)
        self.profile.xp = 15
        self.profile.save()

        observation = Observation.objects.create(
            user=self.user,
            image=SimpleUploadedFile('pigeon.jpg', b'img', content_type='image/jpeg'),
            type=Species.BIRD_TYPE,
            organ='whole',
            identification_response={
                'results': [{'species': {'id': self.pigeon.id}, 'confidence': 0.95}]
            },
        )

        resp = self.client.patch(
            f'/api/species/observation/{observation.id}/',
            {'species': 0},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('achievements', resp.data)
        self.assertIn('notifications', resp.data)

        self.assertTrue(resp.data['achievements']['new_species'])
        self.assertEqual(
            resp.data['achievements']['level_up'],
            {'old_level': 1, 'new_level': 2},
        )
        poster_ids = [p['poster_id'] for p in resp.data['achievements']['poster_updates']]
        self.assertIn('birds_pigeons', poster_ids)

        notif_types = {n['notification_type'] for n in resp.data['notifications']}
        self.assertIn(Notification.TYPE_NEW_SPECIES, notif_types)
        self.assertIn(Notification.TYPE_LEVEL_UP, notif_types)
        self.assertIn(Notification.TYPE_BADGE_UNLOCKED, notif_types)
        self.assertIn(Notification.TYPE_MILESTONE, notif_types)

        self.assertEqual(
            Notification.objects.filter(user=self.user, is_read=False).count(),
            len(resp.data['notifications']),
        )

    def test_quiz_completion_creates_level_up_and_quiz_notifications(self):
        # Put user right below level 2 (level_xp(2) = 70)
        self.profile.xp = 65
        self.profile.save()

        question = MultipleChoiceQuestion.objects.create(
            species=self.pigeon,
            question='What family does the Rock Dove belong to?',
            choices=['Columbidae', 'Corvidae', 'Strigidae', 'Anatidae'],
            correct_choice=0,
        )
        quiz = Quiz.objects.create(user=self.user)
        quiz.multiple_choice_questions.add(question)

        resp = self.client.patch(
            f'/api/university/quiz/{quiz.id}/',
            {
                'multiplechoiceuseranswer_set': [
                    {
                        'quiz': quiz.id,
                        'question': question.id,
                        'user_answer': 0,
                    }
                ]
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('achievements', resp.data)
        self.assertEqual(
            resp.data['achievements']['level_up'],
            {'old_level': 1, 'new_level': 2},
        )
        self.assertIn('notifications', resp.data)
        notif_types = {n['notification_type'] for n in resp.data['notifications']}
        self.assertIn(Notification.TYPE_LEVEL_UP, notif_types)
        self.assertIn(Notification.TYPE_QUIZ_COMPLETED, notif_types)
