'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PosterIcon from '@/components/PosterIcon';
import {
  GameNotification,
  getNotificationTarget,
  useNotifications,
} from '@/contexts/NotificationContext';

function ToastEmblem({ notification }: { notification: GameNotification }) {
  if (
    notification.notification_type === 'badge_unlocked' &&
    notification.data?.poster_id
  ) {
    return (
      <PosterIcon
        posterId={notification.data.poster_id}
        posterName={notification.data.poster_name || 'Field Guide'}
        level={notification.data.new_level || 'Bronze'}
        seenCount={notification.data.seen_count ?? 1}
        totalCount={notification.data.total_count ?? 1}
        size={40}
        showLabel={false}
      />
    );
  }

  const icons: Record<string, string> = {
    level_up: '🎖️',
    badge_unlocked: '🏅',
    new_species: '🔬',
    quiz_completed: '📜',
    milestone: '🧭',
    info: '✉️',
  };

  return (
    <div className="w-10 h-10 rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center text-xl flex-shrink-0">
      {icons[notification.notification_type] || '✉️'}
    </div>
  );
}

function SingleToast({ notification }: { notification: GameNotification }) {
  const router = useRouter();
  const { dismissToast, markAsRead } = useNotifications();

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissToast(notification.id);
    }, 5500);
    return () => clearTimeout(timer);
  }, [notification.id, dismissToast]);

  const handleOpen = async () => {
    await markAsRead([notification.id]);
    const target = getNotificationTarget(notification);
    if (target) {
      router.push(target);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={handleOpen}
      className="pointer-events-auto cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-amber-900/25 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: '#fdf4e3' }}
    >
      <ToastEmblem notification={notification} />
      <div className="flex-1 min-w-0">
        <p className="font-old-standard font-bold text-sm text-nature-brown truncate">
          {notification.title}
        </p>
        {notification.message && (
          <p className="font-old-standard text-xs text-nature-brown/75 line-clamp-2">
            {notification.message}
          </p>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={(e) => {
          e.stopPropagation();
          dismissToast(notification.id);
        }}
        className="text-nature-brown/40 hover:text-nature-brown px-1.5 py-0.5 text-sm flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

export default function NotificationToast() {
  const pathname = usePathname();
  const { activeToasts } = useNotifications();

  if (activeToasts.length === 0 || pathname?.startsWith('/notifications')) {
    return null;
  }

  return (
    <div
      className="fixed left-0 right-0 z-40 flex flex-col items-center gap-2 px-4 pointer-events-none"
      style={{ top: 'max(env(safe-area-inset-top, 12px), 12px)' }}
    >
      <div className="w-full max-w-sm space-y-2">
        {activeToasts.slice(0, 1).map((notif) => (
          <SingleToast key={notif.id} notification={notif} />
        ))}
      </div>
    </div>
  );
}
