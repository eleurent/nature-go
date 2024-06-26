from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Badge, UserBadge, update_user_badges
from .serializers import UserBadgeSerializer, SpeciesBadgeDetailSerializer, TotalObservationsBadgeDetailSerializer, BadgeDetailSerializer


class BadgeListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserBadgeSerializer

    def get_queryset(self):
        update_user_badges(self.request.user)
        queryset = UserBadge.objects.filter(user=self.request.user)
        levels = ["Bronze", "Silver", "Gold"]
        index_or_minus_one = lambda x: levels.index(x.unlocked_level) if x.unlocked_level in levels else -1
        return sorted(queryset, key=index_or_minus_one, reverse=True)


class BadgeDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'name'  # Use the 'name' field as the lookup

    def get_queryset(self):
        return Badge.objects.all()  # Query all badges

    def get_serializer_class(self):
        badge = self.get_object()  # Fetch the badge instance

        if badge.badge_type == 'species':
            return SpeciesBadgeDetailSerializer
        elif badge.badge_type == 'total_observations':
            return TotalObservationsBadgeDetailSerializer
        else:
            return BadgeDetailSerializer  # Default serializer for other badge types

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user_badge, _ = UserBadge.objects.get_or_create(user=request.user, badge=instance)
        serializer = self.get_serializer(instance)
        return Response({'badge': serializer.data, 'progress': user_badge.progress})