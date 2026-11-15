'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  GameNotification,
  getNotificationTarget,
  useNotifications,
} from '@/contexts/NotificationContext';
import PosterIcon from '@/components/PosterIcon';

type FilterTab = 'all' | 'unread' | 'achievements' | 'discoveries';

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function NotificationEmblem({ notif }: { notif: GameNotification }) {
  if (notif.notification_type === 'badge_unlocked' && notif.data?.poster_id) {
    return (
      <PosterIcon
        posterId={notif.data.poster_id}
        posterName={notif.data.poster_name || 'Field Guide'}
        level={notif.data.new_level || 'Bronze'}
        seenCount={notif.data.seen_count ?? 1}
        totalCount={notif.data.total_count ?? 1}
        size={48}
        showLabel={false}
      />
    );
  }

  const iconMap: Record<string, string> = {
    level_up: '🎖️',
    badge_unlocked: '🏅',
    new_species: '🔬',
    quiz_completed: '📜',
    milestone: '🧭',
    info: '✉️',
  };

  return (
    <div className="w-12 h-12 rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center text-2xl flex-shrink-0">
      {iconMap[notif.notification_type] || '✉️'}
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    if (authState.isLoading) return;
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    fetchNotifications();
  }, [authState.isLoading, authState.userToken, router, fetchNotifications]);

  if (authState.isLoading || !authState.userToken) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'achievements') {
      return (
        n.notification_type === 'level_up' ||
        n.notification_type === 'badge_unlocked' ||
        n.notification_type === 'milestone'
      );
    }
    if (filter === 'discoveries') {
      return (
        n.notification_type === 'new_species' ||
        n.notification_type === 'quiz_completed'
      );
    }
    return true;
  });

  const handleItemClick = async (notif: GameNotification) => {
    if (!notif.is_read) {
      await markAsRead([notif.id]);
    }
    const target = getNotificationTarget(notif);
    if (target && target !== '/notifications') {
      router.push(target);
    }
  };

  return (
    <div className="page-background min-h-screen pb-12">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          className="fixed top-4 right-4 z-10 bg-white/80 px-3 py-1 rounded shadow text-sm font-old-standard text-nature-dark hover:bg-white"
        >
          Mark all read
        </button>
      )}

      <div className="pt-16 px-4 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-old-standard tracking-wider text-nature-brown">
            ❧ Dispatches ❧
          </h1>
          <p className="text-sm font-old-standard text-nature-brown/60 mt-1">
            Commendations, rank promotions, and field notices
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'achievements', label: 'Ranks & Badges' },
              { key: 'discoveries', label: 'Field & Exams' },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-old-standard border transition-colors ${
                filter === tab.key
                  ? 'bg-nature-dark text-white border-nature-dark'
                  : 'bg-white/70 text-nature-brown border-nature-brown/20 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-nature-dark border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center border border-amber-900/15 shadow-sm"
            style={{ backgroundColor: '#fdf4e3' }}
          >
            <div className="text-4xl mb-3">📜</div>
            <p className="font-old-standard text-lg text-nature-brown">
              {filter === 'unread'
                ? 'All dispatches have been read.'
                : 'No dispatches from the Royal Society yet.'}
            </p>
            <p className="font-old-standard text-sm text-nature-brown/60 mt-2">
              Venture into the field or sit an examination to earn your next promotion or badge.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`relative rounded-xl p-4 border transition-all cursor-pointer shadow-sm ${
                  notif.is_read
                    ? 'bg-white/70 border-nature-brown/15 hover:bg-white/90'
                    : 'border-amber-800/35 hover:shadow-md'
                }`}
                style={!notif.is_read ? { backgroundColor: '#fdf4e3' } : undefined}
              >
                <div className="flex items-start gap-3">
                  <NotificationEmblem notif={notif} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!notif.is_read && (
                        <span
                          className="w-2 h-2 rounded-full bg-nature-dark flex-shrink-0"
                          aria-label="Unread"
                        />
                      )}
                      <h2 className="font-old-standard font-bold text-base text-nature-brown truncate">
                        {notif.title}
                      </h2>
                    </div>

                    {notif.message && (
                      <p className="font-old-standard text-sm text-nature-brown/80 mt-1">
                        {notif.message}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-old-standard text-nature-brown/50">
                        {formatRelativeTime(notif.created_at)}
                      </span>
                      <div className="flex items-center gap-3">
                        {!notif.is_read && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead([notif.id]);
                            }}
                            className="text-xs font-old-standard text-nature-dark hover:underline"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          aria-label="Delete notification"
                          className="text-xs font-old-standard text-nature-brown/40 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
