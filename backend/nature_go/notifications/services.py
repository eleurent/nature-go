from observation.models import Observation
from .models import Notification
from .ranks import get_naturalist_title

SPECIES_MILESTONES = [
    (1, 'First Specimen', 'You recorded your very first specimen in the field!'),
    (10, 'Budding Collector', 'You have discovered 10 distinct species!'),
    (25, 'Field Naturalist', 'You have discovered 25 distinct species!'),
    (50, 'Royal Herbarium Fellow', 'You have discovered 50 distinct species!'),
    (100, 'Master Explorer', 'You have discovered 100 distinct species!'),
]


def create_notification(user, notification_type, title, message='', data=None):
    return Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        data=data or {},
    )


def notify_level_up(user, old_level, new_level):
    old_title = get_naturalist_title(old_level)
    new_title = get_naturalist_title(new_level)
    return create_notification(
        user=user,
        notification_type=Notification.TYPE_LEVEL_UP,
        title=f'Promoted to {new_title}!',
        message=(
            f'By order of the Royal Society, you have risen from Level {old_level} '
            f'({old_title}) to Level {new_level} ({new_title}).'
        ),
        data={
            'old_level': old_level,
            'new_level': new_level,
            'old_title': old_title,
            'new_title': new_title,
        },
    )


def notify_badge_unlocked(
    user,
    poster_id,
    poster_name,
    old_level,
    new_level,
    seen_count=None,
    total_count=None,
):
    if not new_level:
        return None
    action_label = 'Badge Unlocked' if not old_level else 'Badge Upgraded'
    return create_notification(
        user=user,
        notification_type=Notification.TYPE_BADGE_UNLOCKED,
        title=f'{poster_name} — {new_level} {action_label}!',
        message=(
            f'You achieved {new_level} rank in the {poster_name} Field Guide.'
        ),
        data={
            'poster_id': poster_id,
            'poster_name': poster_name,
            'old_level': old_level,
            'new_level': new_level,
            'seen_count': seen_count,
            'total_count': total_count,
        },
    )


def notify_new_species(user, species, illustration_url=None):
    species_name = str(species)
    return create_notification(
        user=user,
        notification_type=Notification.TYPE_NEW_SPECIES,
        title=f'New Specimen: {species_name}',
        message=f'Discovered a {species.rarity.lower()} {species.type} and added it to your journal.',
        data={
            'species_id': species.id,
            'species_name': species_name,
            'scientific_name': species.scientificNameWithoutAuthor,
            'species_type': species.type,
            'rarity': species.rarity,
            'illustration_url': illustration_url,
        },
    )


def notify_quiz_completed(user, quiz, xp_total, correct_count, total_count):
    return create_notification(
        user=user,
        notification_type=Notification.TYPE_QUIZ_COMPLETED,
        title=f'Examination Completed ({correct_count}/{total_count})',
        message=f'You earned +{xp_total} XP from your University examination.',
        data={
            'quiz_id': quiz.id,
            'xp_total': xp_total,
            'correct_count': correct_count,
            'total_count': total_count,
        },
    )


def check_observation_milestones(user):
    species_count = (
        Observation.objects.filter(user=user, species__isnull=False)
        .values('species_id')
        .distinct()
        .count()
    )
    created = []
    existing_keys = set(
        Notification.objects.filter(
            user=user, notification_type=Notification.TYPE_MILESTONE
        ).values_list('data__milestone_key', flat=True)
    )
    for threshold, label, description in SPECIES_MILESTONES:
        milestone_key = f'species_{threshold}'
        if species_count >= threshold and milestone_key not in existing_keys:
            notif = create_notification(
                user=user,
                notification_type=Notification.TYPE_MILESTONE,
                title=f'Milestone: {label}',
                message=description,
                data={
                    'milestone_key': milestone_key,
                    'threshold': threshold,
                    'species_count': species_count,
                },
            )
            created.append(notif)
    return created
