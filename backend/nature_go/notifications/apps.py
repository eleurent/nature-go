from django.apps import AppConfig


def handle_level_up(sender, **kwargs):
    from .services import notify_level_up

    user = kwargs.get('user')
    old_level = kwargs.get('old_level')
    new_level = kwargs.get('new_level')
    if user is not None and old_level is not None and new_level is not None and new_level > old_level:
        notify_level_up(user=user, old_level=old_level, new_level=new_level)


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'

    def ready(self):
        from user_profile.signals import level_up

        level_up.connect(handle_level_up, dispatch_uid='notifications_handle_level_up')
