from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile # compute_observation_xp and compute_quiz_xp are part of models, not Profile
from observation.models import Observation, Species
from university.models import Quiz
from notifications.models import Notification
from unittest.mock import patch
from django.utils import timezone

# Removed ProfileModelTests as its mocking pattern was incorrect and it was
# largely redundant with ProfileGainXPMockingTests.
# ProfileGainXPMockingTests now includes tests for profile creation and level_xp calculation.

class ProfileGainXPMockingTests(TestCase):
    def setUp(self):
        # Using a more unique username to avoid clashes if tests run in parallel or state leaks
        self.user = User.objects.create_user(username='testuser_profile_gain_xp', password='password123')
        self.profile = Profile.objects.create(user=self.user)
        self.species = Species.objects.create(
            type=Species.BIRD_TYPE, # Ensure this is a valid choice from Species.SPECIES_TYPE_CHOICES
            scientificNameWithoutAuthor='Testus Specius XP', # Unique scientific name
            genus='Testus',
            family='Testidae',
            rarity_gpt=3.0, 
            occurences_cdf=0.4 
        )

    def test_profile_creation_and_defaults(self):
        """Test that a Profile is created with default XP and level."""
        self.assertIsNotNone(self.profile)
        self.assertEqual(self.profile.user, self.user)
        self.assertEqual(self.profile.xp, 0)
        self.assertEqual(self.profile.level, 1)

    def test_level_xp_calculation(self):
        """Test the level_xp method for correct XP thresholds."""
        self.assertEqual(self.profile.level_xp(1), 0)
        self.assertEqual(self.profile.level_xp(2), 70)
        self.assertEqual(self.profile.level_xp(3), 260)

    @patch('user_profile.models.compute_observation_xp')
    def test_gain_xp_from_observation_level_up_mocked(self, mock_compute_obs_xp):
        mock_compute_obs_xp.return_value = {'total': 100, 'breakdown': []}
        Notification.objects.filter(user=self.user).delete()
        self.profile.xp = 0
        self.profile.level = 1
        self.profile.save()

        observation = Observation.objects.create(
            user=self.user, 
            species=self.species, 
            location=[0,0],
            datetime=timezone.now(),
            type=self.species.type, # Ensure observation type matches species type
            organ=Observation.ORGAN_CHOICES[0][0] # Use a valid organ choice
        )
        self.profile.gain_xp_from(observation)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.xp, 100)
        self.assertEqual(self.profile.level, 2)
        notifications = Notification.objects.filter(user=self.user, type='level_up')
        self.assertEqual(notifications.count(), 1)
        notification = notifications.first()
        self.assertEqual(notification.message, "Congratulations! You've reached Level 2!")
        self.assertFalse(notification.is_read)

    @patch('user_profile.models.compute_observation_xp')
    def test_gain_xp_from_observation_no_level_up_mocked(self, mock_compute_obs_xp):
        mock_compute_obs_xp.return_value = {'total': 10, 'breakdown': []}
        Notification.objects.filter(user=self.user).delete()
        self.profile.xp = 0
        self.profile.level = 1
        self.profile.save()

        observation = Observation.objects.create(
            user=self.user, 
            species=self.species, 
            location=[0,0],
            datetime=timezone.now(),
            type=self.species.type,
            organ=Observation.ORGAN_CHOICES[0][0]
        )
        self.profile.gain_xp_from(observation)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.xp, 10)
        self.assertEqual(self.profile.level, 1)
        self.assertEqual(Notification.objects.filter(user=self.user, type='level_up').count(), 0)

    @patch('user_profile.models.compute_quiz_xp')
    def test_gain_xp_from_quiz_level_up_mocked(self, mock_compute_quiz_xp):
        mock_compute_quiz_xp.return_value = {'total': 80, 'breakdown': []}
        Notification.objects.filter(user=self.user).delete()
        self.profile.xp = 0
        self.profile.level = 1
        self.profile.save()

        quiz = Quiz.objects.create(user=self.user)
        self.profile.gain_xp_from(quiz)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.xp, 80)
        self.assertEqual(self.profile.level, 2)
        notifications = Notification.objects.filter(user=self.user, type='level_up')
        self.assertEqual(notifications.count(), 1)
        notification = notifications.first()
        self.assertEqual(notification.message, "Congratulations! You've reached Level 2!")
        self.assertFalse(notification.is_read)
        
    @patch('user_profile.models.compute_observation_xp') # Ensure this is the correct path to the actual function
    def test_gain_xp_already_processed_mocked(self, mock_compute_obs_xp):
        """Test that XP is not gained again if instance.xp is already set, using mocks."""
        mock_compute_obs_xp.return_value = {'total': 500, 'breakdown': []} 
        self.profile.xp = 0
        self.profile.level = 1
        self.profile.save()
        Notification.objects.filter(user=self.user).delete()

        observation = Observation.objects.create(
            user=self.user, 
            species=self.species, 
            location=[0,0], 
            datetime=timezone.now(),
            type=self.species.type,
            organ=Observation.ORGAN_CHOICES[0][0],
            xp={'total': 50, 'breakdown': []} # XP already set
        )
        
        self.profile.gain_xp_from(observation)
        self.profile.refresh_from_db()

        self.assertEqual(self.profile.xp, 0) 
        self.assertEqual(self.profile.level, 1)
        self.assertEqual(Notification.objects.filter(user=self.user, type='level_up').count(), 0)
        mock_compute_obs_xp.assert_not_called()
