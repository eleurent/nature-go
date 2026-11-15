from rest_framework import serializers
from .models import MultipleChoiceQuestion, Quiz, MultipleChoiceUserAnswer
from observation.serializers import SpeciesSerializer
from user_profile.signals import xp_gained

class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    species_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'species', 'question', 'choices', 'species_name']

    def get_species_name(self, obj):
        return str(obj.species)

class AdminMultipleChoiceQuestionSerializer(MultipleChoiceQuestionSerializer):
    # Same with added correct_choice field
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'species', 'question', 'choices', 'species_name', 'correct_choice']


class MultipleChoiceUserAnswerSerializer(serializers.ModelSerializer):
  is_correct = serializers.ReadOnlyField()
  correct_choice = serializers.IntegerField(
      source='question.correct_choice', read_only=True
  )

  class Meta:
    model = MultipleChoiceUserAnswer
    fields = [
        'id',
        'quiz',
        'question',
        'user_answer',
        'is_correct',
        'correct_choice',
    ]


class QuizSerializer(serializers.ModelSerializer):
    multiple_choice_questions = MultipleChoiceQuestionSerializer(many=True, read_only=True)
    multiplechoiceuseranswer_set = MultipleChoiceUserAnswerSerializer(many=True, required=False)

    class Meta:
        model = Quiz
        fields = ['id', 'user', 'multiple_choice_questions', 'datetime', 'multiplechoiceuseranswer_set', 'xp']
        read_only_fields = ('user', 'multiple_choice_questions', 'datetime', 'xp')

    def update(self, instance, validated_data):
        # the serializer can only update the user answers
        answers = validated_data.get('multiplechoiceuseranswer_set')
        if answers is not None:
            valid_question_ids = set(
                instance.multiple_choice_questions.values_list('id', flat=True)
            )
            for answer in answers:
                if answer['question'].id not in valid_question_ids:
                    raise serializers.ValidationError(
                        'Question does not belong to this quiz.'
                    )
            instance.multiplechoiceuseranswer_set.all().delete()
            for answer in answers:
                answer = dict(answer)
                answer['quiz'] = instance
                MultipleChoiceUserAnswer.objects.create(**answer)
        if not instance.xp and instance.is_answered:
            from notifications.models import Notification
            from notifications.serializers import NotificationSerializer
            from notifications.services import notify_quiz_completed
            from user_profile.models import Profile

            profile, _ = Profile.objects.get_or_create(user=instance.user)
            old_level = profile.level
            last_notif = (
                Notification.objects.filter(user=instance.user)
                .order_by('-id')
                .first()
            )
            last_notif_id = last_notif.id if last_notif else 0

            xp_gained.send(sender=instance.__class__, instance=instance)
            instance.refresh_from_db()
            profile.refresh_from_db()

            xp_total = int((instance.xp or {}).get('total', 0))
            user_answers = list(instance.multiplechoiceuseranswer_set.select_related('question'))
            correct_count = sum(1 for a in user_answers if a.is_correct)
            total_count = instance.multiple_choice_questions.count()
            notify_quiz_completed(
                user=instance.user,
                quiz=instance,
                xp_total=xp_total,
                correct_count=correct_count,
                total_count=total_count,
            )

            achievements = {}
            if profile.level > old_level:
                achievements['level_up'] = {
                    'old_level': old_level,
                    'new_level': profile.level,
                }
            if achievements:
                instance._achievements = achievements

            created_notifs = Notification.objects.filter(
                user=instance.user, id__gt=last_notif_id
            ).order_by('id')
            if created_notifs.exists():
                instance._notifications = NotificationSerializer(
                    created_notifs, many=True
                ).data

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if hasattr(instance, '_achievements'):
            data['achievements'] = instance._achievements
        if hasattr(instance, '_notifications'):
            data['notifications'] = instance._notifications
        return data
