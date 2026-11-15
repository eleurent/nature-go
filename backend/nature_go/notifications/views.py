from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        unread_param = self.request.query_params.get('unread')
        if unread_param is not None and unread_param.lower() in ('true', '1'):
            queryset = queryset.filter(is_read=False)

        types_param = self.request.query_params.get('type')
        if types_param:
            allowed_types = [t.strip() for t in types_param.split(',') if t.strip()]
            if allowed_types:
                queryset = queryset.filter(notification_type__in=allowed_types)

        limit_param = self.request.query_params.get('limit')
        if limit_param:
            try:
                limit = max(1, min(200, int(limit_param)))
                return queryset[:limit]
            except ValueError:
                pass
        return queryset[:100]


class NotificationUnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            user=request.user, is_read=False
        ).count()
        return Response({'unread_count': count})


class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        mark_all = bool(request.data.get('all', False))
        ids = request.data.get('ids')

        queryset = Notification.objects.filter(user=request.user, is_read=False)
        if mark_all:
            updated = queryset.update(is_read=True)
        elif isinstance(ids, list):
            try:
                clean_ids = [int(i) for i in ids]
            except (TypeError, ValueError):
                return Response(
                    {'error': 'Notification IDs must be integers.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            updated = queryset.filter(id__in=clean_ids).update(is_read=True)
        else:
            return Response(
                {'error': 'Provide either "all": true or a list of "ids".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        unread_count = Notification.objects.filter(
            user=request.user, is_read=False
        ).count()
        return Response({'updated': updated, 'unread_count': unread_count})


class NotificationMarkSingleReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if not notification.is_read:
            notification.is_read = True
            notification.save(update_fields=['is_read'])
        unread_count = Notification.objects.filter(
            user=request.user, is_read=False
        ).count()
        return Response(
            {
                'notification': NotificationSerializer(notification).data,
                'unread_count': unread_count,
            }
        )


class NotificationDeleteView(generics.DestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
