'use client';

import React from 'react';

// --- Level color palette ---
export const LEVEL_PALETTE = {
  Gold: {
    ring: '#b8860b',
    bg: '#fef9e7',
    icon: '#92400e',
    label: '#78350f',
  },
  Silver: {
    ring: '#6b7280',
    bg: '#f3f4f6',
    icon: '#374151',
    label: '#374151',
  },
  Bronze: {
    ring: '#a0522d',
    bg: '#f5e6d3',
    icon: '#78350f',
    label: '#78350f',
  },
  none: {
    ring: '#c8c0b4',
    bg: '#ede8df',
    icon: '#a09888',
    label: '#a09888',
  },
} as const;

// --- SVG icon paths per poster category ---
// Vintage line-art silhouettes, designed at 24x24 viewBox
const POSTER_ICONS: Record<string, React.ReactNode> = {
  // Birds - Regional (flag-inspired shapes)
  birds_us: (
    <g>
      {/* Bald eagle silhouette */}
      <path d="M12 4c-1 0-3 1.5-3.5 3-.3.8 0 1.5.5 2l-3 3c-.5.5-.5 1 0 1.5l1 1c.5.5 1.2.3 1.5-.2l2.5-3.3c.3.1.7.2 1 .2s.7-.1 1-.2l2.5 3.3c.3.5 1 .7 1.5.2l1-1c.5-.5.5-1 0-1.5l-3-3c.5-.5.8-1.2.5-2C14.8 5.5 13 4 12 4zm-4 9l-2 4c-.3.7 0 1.3.5 1.5l2.5 1c.5.2 1-.1 1.2-.6l1-2.5c-.8-.3-1.5-.8-2-1.4l-1.2-2zm8 0l-1.2 2c-.5.6-1.2 1.1-2 1.4l1 2.5c.2.5.7.8 1.2.6l2.5-1c.5-.2.8-.8.5-1.5l-2-4z" fill="currentColor" />
    </g>
  ),
  birds_uk: (
    <g>
      {/* Robin silhouette */}
      <path d="M12 3c-2 0-3.5 1.5-3.5 3.5 0 .8.3 1.5.7 2.1L7 10.5c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.6-1.6c.6.3 1.3.5 2 .5s1.4-.2 2-.5l1.6 1.6c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4l-2.2-1.9c.4-.6.7-1.3.7-2.1C15.5 4.5 14 3 12 3zm-1.5 4a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12c-1.5 0-2.8.5-3.8 1.2-.6.5-1 1.1-1.2 1.8-.2.7 0 1.4.5 1.8.4.4 1 .5 1.5.3.5-.2.8-.6 1-1.1.2-.5.6-.8 1-.8h2c.4 0 .8.3 1 .8.2.5.5.9 1 1.1.5.2 1.1.1 1.5-.3s.7-1.1.5-1.8c-.2-.7-.6-1.3-1.2-1.8-1-.7-2.3-1.2-3.8-1.2z" fill="currentColor" />
    </g>
  ),
  birds_france: (
    <g>
      {/* Hoopoe-inspired silhouette */}
      <path d="M12 2c-.5 0-1 .3-1.2.7L10 4.5l-1.5-.5c-.4-.2-.9 0-1.1.4-.2.4 0 .9.4 1.1l1.7.6-.3 2H8c-.4 0-.7.2-.9.5l-2 3c-.2.3-.2.7 0 1l.5.8c.2.3.5.4.8.4h2.4l-.3 2.5c-.1.5.2 1 .7 1.1.5.1 1-.2 1.1-.7l.4-2.9h2.6l.4 2.9c.1.5.6.8 1.1.7.5-.1.8-.6.7-1.1L15.2 13h2.4c.3 0 .6-.1.8-.4l.5-.8c.2-.3.2-.7 0-1l-2-3c-.2-.3-.5-.5-.9-.5h-1.2l-.3-2 1.7-.6c.4-.2.6-.7.4-1.1-.2-.4-.7-.6-1.1-.4L14 4.5l-.8-1.8C13 2.3 12.5 2 12 2z" fill="currentColor" />
    </g>
  ),
  // Birds - Types
  birds_corvids: (
    <g>
      {/* Raven/crow silhouette */}
      <path d="M7.5 4C6 4 5 5.5 5 7c0 1 .4 1.8 1 2.3V11c0 .3.1.6.3.8l2 2.5V18c0 .6.4 1 1 1h.5c.3 0 .5-.2.5-.5v-3.3l-2-2.5V11c0-.2 0-.3-.1-.5C7.5 10 7 9.1 7 8c0-1 .5-2 1.5-2 .6 0 1 .3 1.3.7.2.3.5.5.8.5h2.8c.3 0 .6-.2.8-.5.3-.4.7-.7 1.3-.7 1 0 1.5 1 1.5 2 0 1.1-.5 2-1.2 2.5-.1.2-.1.3-.1.5v1.7l-2 2.5v3.3c0 .3.2.5.5.5h.5c.6 0 1-.4 1-1v-3.7l2-2.5c.2-.2.3-.5.3-.8V9.3c.6-.5 1-1.3 1-2.3 0-1.5-1-3-2.5-3-.8 0-1.5.3-2 .8-.3.2-.5.2-.7.2h-2.6c-.2 0-.4 0-.7-.2C9 4.3 8.3 4 7.5 4z" fill="currentColor" />
    </g>
  ),
  birds_owls: (
    <g>
      {/* Owl silhouette */}
      <path d="M12 3c-3 0-5 2-5 5 0 1.5.6 2.8 1.5 3.8V18c0 .6.4 1 1 1h1c.3 0 .5-.2.5-.5V15h2v3.5c0 .3.2.5.5.5h1c.6 0 1-.4 1-1v-6.2c.9-1 1.5-2.3 1.5-3.8 0-3-2-5-5-5zm-2 4.5a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zm-2 2.5c.3 0 .5.1.7.3.1.2.1.4 0 .5-.2.2-.4.2-.7.2s-.5 0-.7-.2c-.1-.1-.1-.3 0-.5.2-.2.4-.3.7-.3z" fill="currentColor" />
    </g>
  ),
  birds_waterfowl: (
    <g>
      {/* Duck silhouette */}
      <path d="M8 6c-1.5 0-2.5 1-2.5 2.5 0 .7.3 1.4.7 1.8L4 13c-.3.4-.3.8 0 1.2l.5.5c.3.3.7.3 1 .1l2.5-2V15c0 1 .5 1.8 1.2 2.3.5.3 1.1.5 1.8.5h2c.7 0 1.3-.2 1.8-.5.7-.5 1.2-1.3 1.2-2.3v-2.2l2.5 2c.3.2.7.2 1-.1l.5-.5c.3-.4.3-.8 0-1.2l-2.2-2.7c.4-.4.7-1.1.7-1.8C17 7 16 6 14.5 6c-.8 0-1.4.3-1.8.7l-.7.7-.7-.7C10.9 6.3 10.3 6 9.5 6H8zm.5 2a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor" />
    </g>
  ),
  birds_raptors: (
    <g>
      {/* Hawk/raptor silhouette */}
      <path d="M12 3c-.5 0-1 .2-1.3.6L9 6H7c-.6 0-1 .4-1 1 0 .3.1.6.3.7L4 10.5c-.3.4-.3.9.1 1.2l1 .8c.4.3.9.2 1.2-.1L8 10v2.5l-2.5 4c-.3.4-.1 1 .3 1.2l1.2.6c.4.2.9.1 1.2-.3L10 15h4l1.8 3c.3.4.8.5 1.2.3l1.2-.6c.4-.2.6-.8.3-1.2L16 12.5V10l1.7 2.4c.3.3.8.4 1.2.1l1-.8c.4-.3.4-.8.1-1.2L17.7 7.7c.2-.1.3-.4.3-.7 0-.6-.4-1-1-1h-2l-1.7-2.4C13 3.2 12.5 3 12 3zm0 3.5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
    </g>
  ),
  birds_waders: (
    <g>
      {/* Heron/wader silhouette */}
      <path d="M11 3c-.4 0-.7.2-.9.5L9 5.5 7.5 5c-.4-.1-.8.1-1 .5-.1.4.1.8.5 1l2 .8V10l-3 4.5c-.2.3-.2.7 0 1l.7.7c.3.3.7.3 1 .1L10 14v2.5c0 .4.2.7.5.9l1 .5c.3.2.7.2 1 0l1-.5c.3-.2.5-.5.5-.9V14l2.3 2.3c.3.2.7.2 1-.1l.7-.7c.2-.3.2-.7 0-1L15 10V7.3l2-.8c.4-.2.6-.6.5-1-.2-.4-.6-.6-1-.5L15 5.5l-1.1-2C13.7 3.2 13.4 3 13 3h-2zm.5 2.5a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor" />
    </g>
  ),
  birds_songbirds: (
    <g>
      {/* Small songbird silhouette */}
      <path d="M14 4c-1.5 0-3 1-3.5 2.5L9 7c-.5.2-.8.5-1 1L6 9.5c-.3.3-.3.8 0 1.1l.7.7c.3.3.7.3 1 .1L9.5 10l.5.5v3c0 .6.4 1 1 1h.5V17c0 .3.2.5.5.5s.5-.2.5-.5v-2.5h1V17c0 .3.2.5.5.5s.5-.2.5-.5v-2.5h.5c.6 0 1-.4 1-1v-3l1.2-.7c.3-.2.5-.5.5-.8s-.1-.6-.3-.8L15.5 7c-.2-1.5-1.2-2.5-2.5-3h1zm-1 2.5a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor" />
    </g>
  ),
  birds_seabirds: (
    <g>
      {/* Seabird/gull silhouette */}
      <path d="M12 4c-.5 0-.9.3-1.1.7L10 7H7.5c-.4 0-.7.2-.9.5L4.5 11c-.2.4-.1.8.2 1.1l1 .7c.3.2.7.2 1-.1l1.3-1.7.5 3V17c0 .3.2.5.5.5s.5-.2.5-.5v-3h2v3c0 .3.2.5.5.5s.5-.2.5-.5v-3.8l.5-3.2 1.3 1.8c.3.3.7.3 1 .1l1-.7c.3-.3.4-.7.2-1.1L18.4 7.5c-.2-.3-.5-.5-.9-.5H15l-.9-2.3c-.2-.4-.6-.7-1.1-.7zm0 3.5a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor" />
    </g>
  ),
  birds_colorful: (
    <g>
      {/* Kingfisher-inspired silhouette */}
      <path d="M10 3c-.4 0-.7.2-.9.5L8 5.5c-.5.5-.5 1.3 0 1.8l1 1V11l-2.5 3c-.3.3-.3.8 0 1.1l.7.7c.3.3.7.3 1.1.1L10 14v2.5c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5V14l1.7 1.9c.4.2.8.2 1.1-.1l.7-.7c.3-.3.3-.8 0-1.1L15 11V8.3l1-1c.5-.5.5-1.3 0-1.8L14.9 3.5c-.2-.3-.5-.5-.9-.5h-4zm2 3a.75.75 0 110 1.5A.75.75 0 0112 6z" fill="currentColor" />
    </g>
  ),
  birds_rails_grebes: (
    <g>
      {/* Grebe/rail silhouette */}
      <path d="M12 3c-.5 0-1 .3-1.2.7L10 5.5H8c-.4 0-.8.2-1 .6L5.5 9c-.2.3-.1.7.1 1l.8.6c.3.2.7.2 1-.1l1.1-1.5.5 2V15c0 .4.2.7.5.9l1 .5c.3.2.7.2 1 0l1-.5c.3-.2.5-.5.5-.9v-4l.5-2L14.6 10.5c.3.3.7.3 1 .1l.8-.6c.2-.3.3-.7.1-1L15 6.1c-.2-.4-.6-.6-1-.6h-2l-.8-1.8c-.2-.4-.7-.7-1.2-.7zm0 4a.75.75 0 110 1.5A.75.75 0 0112 7z" fill="currentColor" />
    </g>
  ),
  birds_backyard: (
    <g>
      {/* House sparrow silhouette with tiny house hint */}
      <path d="M12 2.5l-4 3V6H7v1l-1 .8v5.7c0 .3.2.5.5.5h2V12c0-.6.4-1 1-1h3c.6 0 1 .4 1 1v2h2c.3 0 .5-.2.5-.5V7.8L16 7V6h-1v-.5l-3-3zM11 7h2v2h-2V7zm-1 6v4.5c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5V13h-4z" fill="currentColor" />
    </g>
  ),
  birds_woodland: (
    <g>
      {/* Woodpecker on tree silhouette */}
      <path d="M14 3c-.8 0-1.5.4-2 1l-.5.8-.5-.3c-.3-.2-.7-.1-.9.2-.2.3-.1.7.2.9L11.5 6.5 10 9l-2 1c-.4.2-.6.6-.4 1 .2.4.6.6 1 .4l1.5-.7.5 1.3V16c0 .6.4 1 1 1h.5V20c0 .3.2.5.5.5s.5-.2.5-.5v-3h.5c.6 0 1-.4 1-1v-4l.5-1.3L16.4 11.4c.4.2.8 0 1-.4.2-.4 0-.8-.4-1l-2-1L13.5 6.5l1.2-.9c.3-.2.4-.6.2-.9-.2-.3-.6-.4-.9-.2l-.5.3L14 4c0-.6-.4-1-1-1h1zm-1 3.5a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor" />
    </g>
  ),
  // Plants
  plants_uk: (
    <g>
      {/* Bluebell/wildflower */}
      <path d="M12 2c-.3 0-.5.2-.5.5v3l-2-1.5c-.2-.2-.5-.1-.7.1-.1.2-.1.5.1.7L11.5 7v2l-3-1c-.3-.1-.6.1-.7.4-.1.3.1.6.4.7l3.3 1.1V13l-2.5 2c-.2.2-.3.5-.1.7.1.3.4.3.6.2l2-1.5V18c0 .6.4 1 1 1s1-.4 1-1v-3.6l2 1.5c.2.1.5.1.6-.2.2-.2.1-.5-.1-.7l-2.5-2v-2.8l3.3-1.1c.3-.1.5-.4.4-.7-.1-.3-.4-.5-.7-.4l-3 1V7l2.6-2.2c.2-.2.2-.5.1-.7-.2-.2-.5-.3-.7-.1l-2 1.5v-3c0-.3-.2-.5-.5-.5z" fill="currentColor" />
    </g>
  ),
  plants_france: (
    <g>
      {/* Lavender sprig */}
      <path d="M12 3c-.3 0-.5.2-.5.5V8l-1.5-1c-.2-.2-.5-.1-.7.1-.1.2-.1.5.1.7l2.1 1.4V12h-1c-.3 0-.5.1-.7.3l-1.5 2c-.2.3-.1.6.2.8.3.2.6.1.8-.2l1.2-1.6V17c0 .3.1.5.3.7l1 .8c.2.1.4.1.6 0l1-.8c.2-.2.3-.4.3-.7v-3.7l1.2 1.6c.2.3.5.4.8.2.3-.2.4-.5.2-.8l-1.5-2c-.2-.2-.4-.3-.7-.3h-1V9.2l2.1-1.4c.2-.2.3-.5.1-.7-.2-.2-.5-.3-.7-.1l-1.5 1V3.5c0-.3-.2-.5-.5-.5z" fill="currentColor" />
    </g>
  ),
  plants_us: (
    <g>
      {/* Sunflower/coneflower */}
      <path d="M12 2c-.3 0-.5.1-.7.3l-1.5 2L8 3.5c-.3-.1-.6 0-.8.3-.1.3 0 .6.3.8l1.7.8L8 7.5c-.2.3-.1.6.2.8.3.2.6.1.8-.1l1.5-2 1 .8c-.3.5-.5 1-.5 1.5 0 1.4 1.1 2.5 2.5 2.5S16 9.9 16 8.5c0-.5-.2-1-.5-1.5l1-.8 1.5 2c.2.2.5.3.8.1.3-.2.4-.5.2-.8L17.8 5.4l1.7-.8c.3-.2.4-.5.3-.8-.2-.3-.5-.4-.8-.3l-1.8.8-1.5-2c-.2-.2-.4-.3-.7-.3s-.5.1-.7.3L13 4.5V3.5c0-.3-.1-.6-.3-.8-.2-.2-.4-.4-.7-.4v.2zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 13c-.3 0-.5.2-.5.5v4c0 .3-.1.5-.3.7l-1.5 1.5c-.2.2-.2.5 0 .7.2.2.5.2.7 0l1.6-1.6 1.6 1.6c.2.2.5.2.7 0 .2-.2.2-.5 0-.7l-1.5-1.5c-.2-.2-.3-.4-.3-.7v-4c0-.3-.2-.5-.5-.5z" fill="currentColor" />
    </g>
  ),
  plants_orchids: (
    <g>
      {/* Orchid flower */}
      <path d="M12 2c-1.5 0-2.8.8-3.5 2L7 5.5c-.3.5-.2 1.1.2 1.4.4.3 1 .3 1.3-.1l1-1.3c.4-.5.9-.8 1.5-1V8c-1.7.3-3 1.7-3 3.5 0 1 .4 1.8 1 2.4V18c0 .6.4 1 1 1s1-.4 1-1v-3h2v3c0 .6.4 1 1 1s1-.4 1-1v-4.1c.6-.6 1-1.4 1-2.4 0-1.8-1.3-3.2-3-3.5V4.5c.6.2 1.1.5 1.5 1l1 1.3c.3.4.9.4 1.3.1.4-.3.5-.9.2-1.4L15.5 4c-.7-1.2-2-2-3.5-2zm0 7.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z" fill="currentColor" />
    </g>
  ),
  plants_hedgerow: (
    <g>
      {/* Hedgerow/shrub with berries */}
      <path d="M12 2c-.3 0-.5.2-.5.5V5L9.5 4c-.2-.2-.5-.1-.7.1-.1.2-.1.5.1.7l2.6 1.7V10c-1.3.2-2.5.8-3.3 1.7L6 10c-.2-.2-.5-.3-.7-.1-.3.2-.3.5-.1.7l2 2.2C7 13.5 7 14.2 7 15c0 1.5.6 2.8 1.5 3.5.6.5 1.3.7 2 .7h3c.7 0 1.4-.2 2-.7.9-.7 1.5-2 1.5-3.5 0-.8 0-1.5-.2-2.2l2-2.2c.2-.2.2-.5-.1-.7-.2-.2-.5-.1-.7.1l-2.2 1.7c-.8-.9-2-1.5-3.3-1.7V6.5l2.6-1.7c.2-.2.2-.5.1-.7-.2-.2-.5-.3-.7-.1l-2 1V2.5c0-.3-.2-.5-.5-.5zm-1.5 12a1 1 0 110 2 1 1 0 010-2zm3 0a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
    </g>
  ),
  plants_lawn: (
    <g>
      {/* Daisy/simple flower */}
      <path d="M12 3c-.3 0-.5.2-.5.5v2.7C10.6 6.5 10 7.2 10 8c0 .3.1.6.2.8L8.5 10.5c-.2.2-.2.5 0 .7.2.2.5.2.7 0l1.6-1.7c.3.2.7.3 1.2.3.5 0 .9-.1 1.2-.3l1.6 1.7c.2.2.5.2.7 0 .2-.2.2-.5 0-.7l-1.7-1.7c.1-.2.2-.5.2-.8 0-.8-.6-1.5-1.5-1.8V3.5c0-.3-.2-.5-.5-.5zm-4 9c-.3 0-.5.1-.7.3-.2.2-.1.5.1.7l2 1.5V18c0 .6.4 1 1 1h3.2c.6 0 1-.4 1-1v-3.5l2-1.5c.2-.2.3-.5.1-.7-.2-.2-.5-.3-.7-.1L14 13.8c-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8l-1.9-1.6c-.1-.1-.2-.2-.4-.2h.3z" fill="currentColor" />
    </g>
  ),
};

// Fallback: derive a key from the poster id
function getIconKey(posterId: string): string {
  // Direct match
  if (POSTER_ICONS[posterId]) return posterId;
  // Try prefix match (e.g., "birds_owls" matches "birds_owls")
  const keys = Object.keys(POSTER_ICONS);
  for (const key of keys) {
    if (posterId.startsWith(key)) return key;
  }
  return '';
}

// A simple lettrine fallback when no SVG icon exists
function LettrineIcon({ name, color }: { name: string; color: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontFamily="'Old Standard TT', Georgia, serif"
      fontSize="14"
      fontWeight="bold"
      fontStyle="italic"
      fill={color}
    >
      {initial}
    </text>
  );
}

interface PosterIconProps {
  posterId: string;
  posterName: string;
  level: string | null;
  seenCount: number;
  totalCount: number;
  size?: number;
  showProgress?: boolean;
  showLabel?: boolean;
}

export default function PosterIcon({
  posterId,
  posterName,
  level,
  seenCount,
  totalCount,
  size = 48,
  showProgress = true,
  showLabel = true,
}: PosterIconProps) {
  const palette = level ? LEVEL_PALETTE[level as keyof typeof LEVEL_PALETTE] : LEVEL_PALETTE.none;
  const progress = totalCount > 0 ? seenCount / totalCount : 0;
  const iconKey = getIconKey(posterId);
  const hasIcon = !!iconKey && !!POSTER_ICONS[iconKey];

  // SVG ring dimensions
  const strokeWidth = size >= 56 ? 3 : 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center" style={{ width: size + 16 }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill={palette.bg}
            stroke={palette.ring}
            strokeWidth={0.5}
            opacity={0.5}
          />

          {/* Icon */}
          <g
            transform={`translate(${(size - 24) / 2}, ${(size - 24) / 2})`}
            style={{ color: palette.icon }}
          >
            {hasIcon ? (
              POSTER_ICONS[iconKey]
            ) : (
              <LettrineIcon name={posterName} color={palette.icon} />
            )}
          </g>

          {/* Progress ring (background track) */}
          {showProgress && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={palette.ring}
              strokeWidth={strokeWidth}
              opacity={0.15}
            />
          )}

          {/* Progress ring (filled arc) */}
          {showProgress && progress > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={palette.ring}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-700"
            />
          )}
        </svg>
      </div>

      {showLabel && (
        <span
          className="text-[9px] font-old-standard text-center mt-1 leading-tight line-clamp-2"
          style={{ width: size + 12, color: palette.label }}
        >
          {posterName}
        </span>
      )}
    </div>
  );
}
