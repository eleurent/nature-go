from django.apps import AppConfig


class UserProfileConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_profile'

    def ready(self):
        from .signals import xp_gained, update_profile_xp
        xp_gained.connect(update_profile_xp)