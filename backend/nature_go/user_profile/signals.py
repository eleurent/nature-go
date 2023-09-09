from django.dispatch import Signal
from .models import Profile

xp_gained = Signal()


def update_profile_xp(sender, **kwargs):
    instance = kwargs["instance"]
    user = instance.user
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.gain_xp_from(instance)
