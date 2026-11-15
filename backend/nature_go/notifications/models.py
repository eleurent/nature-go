from django.contrib.auth.models import User
from django.db import models


class Notification(models.Model):
    TYPE_LEVEL_UP = 'level_up'
    TYPE_BADGE_UNLOCKED = 'badge_unlocked'
    TYPE_NEW_SPECIES = 'new_species'
    TYPE_QUIZ_COMPLETED = 'quiz_completed'
    TYPE_MILESTONE = 'milestone'
    TYPE_INFO = 'info'

    TYPE_CHOICES = [
        (TYPE_LEVEL_UP, 'Level Up'),
        (TYPE_BADGE_UNLOCKED, 'Badge Unlocked'),
        (TYPE_NEW_SPECIES, 'New Species'),
        (TYPE_QUIZ_COMPLETED, 'Quiz Completed'),
        (TYPE_MILESTONE, 'Milestone'),
        (TYPE_INFO, 'Info'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notifications'
    )
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField(blank=True, default='')
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at', '-id']
        indexes = [
            models.Index(fields=['user', 'is_read', '-created_at']),
        ]

    def __str__(self):
        status = 'read' if self.is_read else 'unread'
        return f'{self.user.username} [{self.notification_type}] {self.title} ({status})'
