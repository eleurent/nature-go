'use client';

import React from 'react';
import Link from 'next/link';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const { unreadCount } = useNotifications();

  return (
    <Link
      href="/notifications"
      aria-label={
        unreadCount > 0
          ? `Dispatches (${unreadCount} unread)`
          : 'Dispatches'
      }
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-nature-brown/20 shadow hover:bg-white transition-colors text-nature-brown ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-nature-dark text-white text-[10px] font-old-standard font-bold flex items-center justify-center shadow">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
