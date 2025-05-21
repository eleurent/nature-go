from django.test import TestCase
from django.contrib.auth.models import User
from .models import Badge, UserBadge, unlock_badge, update_user_badges, BADGE_LOGICS
from notifications.models import Notification # Import Notification model
from .badge import BadgeLogic # Import BadgeLogic for mocking

# --- Mock Badge Logic for Testing ---
class MockExplorerBadgeLogic(BadgeLogic):
    name = "Explorer"
    description = "Test Explorer Badge"
    levels = {"Bronze": 1, "Silver": 3, "Gold": 5} # observations needed

    def __init__(self):
        super().__init__(name=self.name, description=self.description, levels=self.levels)

    def check_user_progress(self, user):
        # Mock progress - assume user has made 'N' observations
        # This would normally query the Observation model
        if not hasattr(user, 'mock_observations_count'):
            user.mock_observations_count = 0 # Default if not set

        progress_data = {}
        for level_name, required_count in self.levels.items():
            progress_data[level_name] = {
                "unlocked": user.mock_observations_count >= required_count,
                "current_value": user.mock_observations_count,
                "target_value": required_count,
            }
        return progress_data

MOCK_BADGE_LOGICS_DICT = {
    MockExplorerBadgeLogic.name: MockExplorerBadgeLogic()
}

class BadgeNotificationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='badgetester', password='password123')
        # Replace actual BADGE_LOGICS with our mock for testing
        self.original_badge_logics = BADGE_LOGICS.copy() # Save original
        BADGE_LOGICS.clear()
        BADGE_LOGICS.update(MOCK_BADGE_LOGICS_DICT)

        # Create the badge in the database based on the mock logic
        self.explorer_badge_logic = BADGE_LOGICS[MockExplorerBadgeLogic.name]
        self.badge = Badge.objects.create(
            name=self.explorer_badge_logic.name,
            description=self.explorer_badge_logic.description
        )
        Notification.objects.filter(user=self.user).delete() # Clear previous notifications

    def tearDown(self):
        # Restore original BADGE_LOGICS
        BADGE_LOGICS.clear()
        BADGE_LOGICS.update(self.original_badge_logics)

    def test_unlock_badge_first_time_creates_notification(self):
        """Test notification creation when a badge level (Bronze) is unlocked for the first time."""
        self.user.mock_observations_count = 1 # Unlocks Bronze
        
        unlock_badge(self.badge, self.user)
        
        user_badge = UserBadge.objects.get(user=self.user, badge=self.badge)
        self.assertEqual(user_badge.unlocked_level, "Bronze")
        
        notifications = Notification.objects.filter(user=self.user, type='badge_unlocked')
        self.assertEqual(notifications.count(), 1)
        notification = notifications.first()
        expected_message = f"New Badge Unlocked: {self.badge.name} - Bronze!"
        self.assertEqual(notification.message, expected_message)
        self.assertFalse(notification.is_read)

    def test_unlock_new_badge_level_creates_notification(self):
        """Test notification creation when a new, higher badge level (Silver) is unlocked."""
        # First, unlock Bronze
        self.user.mock_observations_count = 1
        unlock_badge(self.badge, self.user)
        Notification.objects.filter(user=self.user).delete() # Clear Bronze notification

        # Now, unlock Silver
        self.user.mock_observations_count = 3 # Unlocks Silver
        unlock_badge(self.badge, self.user)

        user_badge = UserBadge.objects.get(user=self.user, badge=self.badge)
        self.assertEqual(user_badge.unlocked_level, "Silver")

        notifications = Notification.objects.filter(user=self.user, type='badge_unlocked')
        self.assertEqual(notifications.count(), 1)
        notification = notifications.first()
        expected_message = f"New Badge Unlocked: {self.badge.name} - Silver!"
        self.assertEqual(notification.message, expected_message)

    def test_no_notification_if_level_does_not_change(self):
        """Test that no notification is created if the badge progress updates but the highest level remains the same."""
        # Unlock Bronze
        self.user.mock_observations_count = 1
        unlock_badge(self.badge, self.user)
        Notification.objects.filter(user=self.user).delete() # Clear initial notification

        # Increase observations, but not enough to reach Silver
        self.user.mock_observations_count = 2 # Still Bronze
        unlock_badge(self.badge, self.user)

        user_badge = UserBadge.objects.get(user=self.user, badge=self.badge)
        self.assertEqual(user_badge.unlocked_level, "Bronze") # Still Bronze

        notifications = Notification.objects.filter(user=self.user, type='badge_unlocked')
        self.assertEqual(notifications.count(), 0) # No new notification

    def test_no_notification_if_no_level_unlocked_initially(self):
        """Test that no notification is created if no badge level is unlocked."""
        self.user.mock_observations_count = 0 # Not enough for Bronze
        
        unlock_badge(self.badge, self.user)
        
        user_badge = UserBadge.objects.get(user=self.user, badge=self.badge)
        self.assertIsNone(user_badge.unlocked_level)
        
        notifications = Notification.objects.filter(user=self.user, type='badge_unlocked')
        self.assertEqual(notifications.count(), 0)

    def test_update_user_badges_flow(self):
        """Test the update_user_badges function which iterates through all badge logics."""
        # This test relies on the mocked BADGE_LOGICS
        self.user.mock_observations_count = 5 # Should unlock Gold for MockExplorerBadgeLogic
        Notification.objects.filter(user=self.user).delete()

        update_user_badges(self.user) # This should call unlock_badge internally

        user_badge = UserBadge.objects.get(user=self.user, badge__name=MockExplorerBadgeLogic.name)
        self.assertEqual(user_badge.unlocked_level, "Gold")

        notifications = Notification.objects.filter(user=self.user, type='badge_unlocked')
        self.assertEqual(notifications.count(), 1)
        notification = notifications.first()
        expected_message = f"New Badge Unlocked: {MockExplorerBadgeLogic.name} - Gold!"
        self.assertEqual(notification.message, expected_message)

    def test_notification_message_content(self):
        """Ensure the notification message is correctly formatted."""
        self.user.mock_observations_count = self.explorer_badge_logic.levels["Gold"]
        unlock_badge(self.badge, self.user)
        notification = Notification.objects.get(user=self.user, type='badge_unlocked')
        self.assertEqual(notification.message, f"New Badge Unlocked: {self.badge.name} - Gold!")

    def test_multiple_level_jumps_one_notification(self):
        """If progress jumps multiple levels, only one notification for the highest new level."""
        # User starts with 0 observations, no badge level.
        # Then makes 5 observations, directly unlocking Gold.
        self.user.mock_observations_count = 5 # Unlocks Bronze, Silver, Gold
        Notification.objects.filter(user=self.user).delete()

        unlock_badge(self.badge, self.user)

        user_badge = UserBadge.objects.get(user=self.user, badge=self.badge)
        self.assertEqual(user_badge.unlocked_level, "Gold")

        # Should only create one notification for the highest achieved level (Gold)
        notifications = Notification.objects.filter(user=self.user, type='badge_unlocked')
        self.assertEqual(notifications.count(), 1)
        notification = notifications.first()
        expected_message = f"New Badge Unlocked: {self.badge.name} - Gold!"
        self.assertEqual(notification.message, expected_message)

class BadgeModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.badge = Badge.objects.create(name="Test Badge", description="A test badge.")

    def test_user_badge_creation(self):
        user_badge = UserBadge.objects.create(user=self.user, badge=self.badge, unlocked_level="Bronze")
        self.assertEqual(str(user_badge), f"{self.user.username} - {self.badge.name} (Bronze)")
        self.assertEqual(user_badge.user, self.user)
        self.assertEqual(user_badge.badge, self.badge)
        self.assertEqual(user_badge.unlocked_level, "Bronze")
        self.assertEqual(user_badge.progress, {}) # Default

    def test_badge_str(self):
        self.assertEqual(str(self.badge), "Test Badge")

    def test_badge_logic_property(self):
        # This test assumes BADGE_LOGICS might be populated with actual badge logic
        # For this test, we can add a temporary mock entry if needed or ensure it's robust
        # If BADGE_LOGICS['Test Badge'] doesn't exist, it will return None.
        self.assertIsNone(self.badge.logic) # Assuming 'Test Badge' is not in the real BADGE_LOGICS

        # To test with a logic:
        class TempBadgeLogic(BadgeLogic):
            name = "Test Badge"
            description = "A temporary badge for testing."
            levels = {"Basic": 1}
            def __init__(self):
                super().__init__(name=self.name, description=self.description, levels=self.levels)
            def check_user_progress(self, user): 
                return {"Basic": {"unlocked": True, "current_value": 1, "target_value": 1}}

        original_logics = BADGE_LOGICS.copy()
        BADGE_LOGICS['Test Badge'] = TempBadgeLogic() # Instantiate it
        
        # Re-fetch badge or create a new one for this specific logic test
        temp_badge, _ = Badge.objects.get_or_create(name="Test Badge", defaults={'description': "A temporary badge for testing."})
        
        self.assertIsNotNone(temp_badge.logic)
        self.assertIsInstance(temp_badge.logic, TempBadgeLogic)

        BADGE_LOGICS.clear()
        BADGE_LOGICS.update(original_logics)


    def test_user_badge_unique_together(self):
        UserBadge.objects.create(user=self.user, badge=self.badge, unlocked_level="Bronze")
        from django.db.utils import IntegrityError
        with self.assertRaises(IntegrityError):
            UserBadge.objects.create(user=self.user, badge=self.badge, unlocked_level="Silver")
