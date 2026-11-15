'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { api, endpoints } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

export type NotificationType =
  | 'level_up'
  | 'badge_unlocked'
  | 'new_species'
  | 'quiz_completed'
  | 'milestone'
  | 'info';

export interface GameNotification {
  id: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: GameNotification[];
  unreadCount: number;
  activeToasts: GameNotification[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  enqueueNotifications: (
    items: GameNotification[],
    options?: { showToast?: boolean }
  ) => void;
  suppressToastIds: (ids: number[]) => void;
  markAsRead: (ids: number[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissToast: (id: number) => void;
  deleteNotification: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function getNotificationTarget(notif: GameNotification): string | null {
  switch (notif.notification_type) {
    case 'level_up':
    case 'milestone':
      return '/profile';
    case 'badge_unlocked':
      return notif.data?.poster_id
        ? `/poster/detail?id=${encodeURIComponent(notif.data.poster_id)}`
        : '/profile';
    case 'new_species':
      return notif.data?.species_id
        ? `/species/detail?id=${notif.data.species_id}`
        : '/home';
    case 'quiz_completed':
      return '/quiz';
    default:
      return '/notifications';
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { authState } = useAuth();
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeToasts, setActiveToasts] = useState<GameNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toastedIdsRef = useRef<Set<number>>(new Set());
  const suppressedIdsRef = useRef<Set<number>>(new Set());

  const maybeSendBrowserNotification = useCallback(
    (notif: GameNotification) => {
      if (
        typeof window === 'undefined' ||
        !settings.browserNotifications ||
        !('Notification' in window) ||
        window.Notification.permission !== 'granted'
      ) {
        return;
      }
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        return;
      }
      try {
        new window.Notification(notif.title, {
          body: notif.message,
          icon: '/icons/icon-192.png',
          tag: `nature-go-notif-${notif.id}`,
        });
      } catch {
        // Ignore environments where Notification constructor is restricted
      }
    },
    [settings.browserNotifications]
  );

  const queueToastsForUnread = useCallback(
    (items: GameNotification[]) => {
      const fresh = items.filter(
        (n) =>
          !n.is_read &&
          !toastedIdsRef.current.has(n.id) &&
          !suppressedIdsRef.current.has(n.id)
      );
      if (fresh.length === 0) return;

      // Mark all unseen unread IDs so they don't pop up repeatedly across fetches
      fresh.forEach((n) => toastedIdsRef.current.add(n.id));

      // Show up to 3 most recent toasts at once to prevent flooding
      const toDisplay = fresh.slice(0, 3);
      toDisplay.forEach(maybeSendBrowserNotification);
      setActiveToasts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const additions = toDisplay.filter((n) => !existingIds.has(n.id));
        return [...additions, ...prev].slice(0, 3);
      });
    },
    [maybeSendBrowserNotification]
  );

  const fetchNotifications = useCallback(async () => {
    if (!authState.userToken) return;
    setIsLoading(true);
    try {
      const response = await api.get<GameNotification[]>(
        endpoints.notifications.list
      );
      const list = response.data || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.is_read).length);
      queueToastsForUnread(list);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authState.userToken, queueToastsForUnread]);

  const refreshUnreadCount = useCallback(async () => {
    if (!authState.userToken) return;
    try {
      const response = await api.get<{ unread_count: number }>(
        endpoints.notifications.unreadCount
      );
      setUnreadCount(response.data.unread_count ?? 0);
    } catch (error) {
      console.error('Failed to fetch unread notification count:', error);
    }
  }, [authState.userToken]);

  const suppressToastIds = useCallback((ids: number[]) => {
    ids.forEach((id) => {
      suppressedIdsRef.current.add(id);
      toastedIdsRef.current.add(id);
    });
    setActiveToasts((prev) => prev.filter((t) => !ids.includes(t.id)));
  }, []);

  const enqueueNotifications = useCallback(
    (items: GameNotification[], options?: { showToast?: boolean }) => {
      if (!items || items.length === 0) return;
      const showToast = options?.showToast ?? true;
      if (!showToast) {
        items.forEach((n) => {
          suppressedIdsRef.current.add(n.id);
          toastedIdsRef.current.add(n.id);
        });
      }
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const newOnes = items.filter((n) => !existingIds.has(n.id));
        const merged = [...newOnes.reverse(), ...prev];
        setUnreadCount(merged.filter((n) => !n.is_read).length);
        return merged;
      });
      if (showToast) {
        queueToastsForUnread(items);
      }
    },
    [queueToastsForUnread]
  );

  const markAsRead = useCallback(
    async (ids: number[]) => {
      if (!ids || ids.length === 0 || !authState.userToken) return;
      const idSet = new Set(ids);
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          idSet.has(n.id) ? { ...n, is_read: true } : n
        );
        setUnreadCount(updated.filter((n) => !n.is_read).length);
        return updated;
      });
      setActiveToasts((prev) => prev.filter((t) => !idSet.has(t.id)));

      try {
        const response = await api.post<{
          updated: number;
          unread_count: number;
        }>(endpoints.notifications.markRead, { ids });
        if (typeof response.data?.unread_count === 'number') {
          setUnreadCount(response.data.unread_count);
        }
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    },
    [authState.userToken]
  );

  const markAllAsRead = useCallback(async () => {
    if (!authState.userToken) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    setActiveToasts([]);
    try {
      await api.post(endpoints.notifications.markRead, { all: true });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [authState.userToken]);

  const dismissToast = useCallback((id: number) => {
    toastedIdsRef.current.add(id);
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const deleteNotification = useCallback(
    async (id: number) => {
      if (!authState.userToken) return;
      setNotifications((prev) => {
        const next = prev.filter((n) => n.id !== id);
        setUnreadCount(next.filter((n) => !n.is_read).length);
        return next;
      });
      setActiveToasts((prev) => prev.filter((t) => t.id !== id));
      try {
        await api.delete(endpoints.notifications.delete(id));
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },
    [authState.userToken]
  );

  useEffect(() => {
    if (authState.isLoading) return;
    if (!authState.userToken) {
      setNotifications([]);
      setUnreadCount(0);
      setActiveToasts([]);
      toastedIdsRef.current.clear();
      suppressedIdsRef.current.clear();
      return;
    }
    fetchNotifications();
  }, [authState.isLoading, authState.userToken, fetchNotifications]);

  const value = useMemo<NotificationContextType>(
    () => ({
      notifications,
      unreadCount,
      activeToasts,
      isLoading,
      fetchNotifications,
      refreshUnreadCount,
      enqueueNotifications,
      suppressToastIds,
      markAsRead,
      markAllAsRead,
      dismissToast,
      deleteNotification,
    }),
    [
      notifications,
      unreadCount,
      activeToasts,
      isLoading,
      fetchNotifications,
      refreshUnreadCount,
      enqueueNotifications,
      suppressToastIds,
      markAsRead,
      markAllAsRead,
      dismissToast,
      deleteNotification,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}
