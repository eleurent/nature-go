from django.urls import path

from .views import (
    NotificationDeleteView,
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkSingleReadView,
    NotificationUnreadCountView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('unread_count/', NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    path('mark_read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('<int:pk>/read/', NotificationMarkSingleReadView.as_view(), name='notification-mark-single-read'),
    path('<int:pk>/', NotificationDeleteView.as_view(), name='notification-delete'),
]
