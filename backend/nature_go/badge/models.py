from django.db import models
from django.contrib.auth.models import User
from .badge import BADGE_LOGICS

class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name
    
    @property
    def logic(self):
        return BADGE_LOGICS.get(self.name)

    def check_user_progress(self, user):
        return self.logic.check_user_progress(user)

    @property
    def levels(self):
        """Returns the levels defined in the corresponding BadgeLogic class."""
        self.logic.levels
        return {}


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    unlocked_level = models.CharField(max_length=50, null=True, blank=True) 
    progress = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.username} - {self.badge.name} ({self.unlocked_level})"


def unlock_badge(badge, user):
    user_badge, _ = UserBadge.objects.get_or_create(user=user, badge=badge)
    highest_unlocked_level = None
    unlocked_levels = [level_name for (level_name, data) in user_badge.progress.items() if data["unlocked"]]
    unlocked_levels = sorted(unlocked_levels, key=lambda x: badge.logic.levels[x])
    highest_unlocked_level = unlocked_levels[-1] if unlocked_levels else None
    user_badge.unlocked_level = highest_unlocked_level
    user_badge.progress = badge.check_user_progress(user)
    user_badge.save()


def update_user_badges(user):
    for badge_logic in BADGE_LOGICS.values():
        badge, created = Badge.objects.get_or_create(
            name=badge_logic.name,
            description=badge_logic.description,
        )
        unlock_badge(badge, user)
