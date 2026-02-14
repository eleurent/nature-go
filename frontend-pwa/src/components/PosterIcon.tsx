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
// High-quality vintage-style icons, designed at 24x24 viewBox
const POSTER_ICONS: Record<string, React.ReactNode> = {
  // Birds - Regional
  birds_us: (
    <g>
      {/* Bald Eagle head profile */}
      <path d="M16 4.5c-2.5 0-4.5 1.5-5 4-.5-1-1.5-1.5-3-1.5-1 0-2 .5-2.5 1.5C5 9 5.5 10 5.5 10s-1 .5-1.5 1c-.5.5-1 1.5-.5 2.5 1 2 4 4 7 4 3 0 5-1.5 6-4 .5-1.5.5-3.5 1-5 .2-.5.5-1 1-1l-3-3zM15 8c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" fill="currentColor" />
      <path d="M17 11.5c-1 0-2 .5-2.5 1.5-.5 1-1 2.5-1.5 3.5-.2.5-.5 1-.5 1.5 0 .5.5 1 1 1h1c1 0 2-.5 2.5-1.5.5-1 1-2.5 1.5-3.5.2-.5.5-1 .5-1.5 0-.5-.5-1-1-1h-1z" fill="currentColor" opacity="0.6" />
    </g>
  ),
  birds_uk: (
    <g>
      {/* European Robin */}
      <path d="M12 4c-3 0-5 2.5-5 5.5 0 1.5.5 3 1.5 4l-1 3.5c-.2.5 0 1 .5 1.2.2.1.5.1.7 0l1.8-1.2c.5.3 1 .5 1.5.5 1.5 0 3.5-1 4.5-2.5.5.5 1.5 1 2.5 1 .5 0 1-.2 1.5-.5-.5-1-1-2-1.5-3C18 10 17 4 12 4zm-1 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="currentColor" />
      <path d="M9 10c0 1.5 1.5 3 3 3s3-1.5 3-3-1.5-3-3-3-3 1.5-3 3z" fill="currentColor" opacity="0.5" />
    </g>
  ),
  birds_france: (
    <g>
      {/* Gallic Rooster head */}
      <path d="M11 2c-1 0-1.5.5-1.5 1 0 .3.2.5.5.7-.5.3-1 .8-1 1.3 0 .5.5.8 1 1-.5.5-1 1-1 2 0 1 .5 2 1.5 2.5L9 12c-1 2-1 4 0 5 .5.5 1.5 1 2.5 1 2 0 3-1 3.5-2 .5-1 .5-2 0-3l-1-2c1-1 2-2 2-3.5 0-1-1-2-2-2-.5 0-1 .2-1.5.5-.2-.5-.5-1-.5-1.5 0-.3.2-.5.5-.5H13c.6 0 1-.4 1-1s-.4-1-1-1h-2zM12.5 7c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
    </g>
  ),
  // Birds - Types
  birds_corvids: (
    <g>
      {/* Raven/Crow profile */}
      <path d="M12 4c-2 0-3.5 1.5-4 3-.5 0-2.5 1-3 1.5-.5.5-.5 1.5 0 2l1.5 1.5C6 13 6 15 5 17c-.5 1 0 2 1 2h2c1 0 2-.5 2.5-1.5.5-1 1-2.5 1.5-3.5 1 0 2-1 3-2 1-1 2-2 2-3.5 0-1.5-1.5-2.5-3-3-.5 0-1 .2-1.5.5-.2-.5-.5-1-.5-1.5zM10.5 7c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
    </g>
  ),
  birds_owls: (
    <g>
      {/* Owl face */}
      <path d="M12 3c-4 0-7 3-7 7 0 2.5 1.5 4.5 3.5 5.5L7 19c-.2.5 0 1 .5 1.5s1 .5 1.5 0l1-2h4l1 2c.5.5 1 .5 1.5 0s.7-1 .5-1.5l-1.5-3.5c2-1 3.5-3 3.5-5.5 0-4-3-7-7-7zm-3 5c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2zm6 0c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z" fill="currentColor" />
      <path d="M12 11l-1 2h2l-1-2z" fill="currentColor" />
    </g>
  ),
  birds_waterfowl: (
    <g>
      {/* Mallard Duck swimming */}
      <path d="M14 5c-2 0-3.5 1.5-3.5 3.5 0 .5.1 1 .3 1.5L9 9c-1 0-2 1-2 2 0 .5.2 1 .5 1.5L6 13c-1 0-2 1-2 2 0 1.5 1.5 2.5 3 2.5h10c2.5 0 4.5-2 4.5-4.5 0-1.5-1-3-2.5-3.5l-2-1c.5-.5 1-1 1-1.5 0-1.5-1.5-2.5-3-2.5-.5 0-1 .2-1.5.5-.2-.5-.5-1-.5-1.5zM12.5 7c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
      <path d="M4 18h16v1H4zM6 19h12v1H6z" fill="currentColor" opacity="0.4" />
    </g>
  ),
  birds_raptors: (
    <g>
      {/* Hawk flying silhouette */}
      <path d="M12 7l-5-2c-1-.5-2 0-2.5.5-.5.5-.5 1.5 0 2l3 2-2 2c-.5.5-.5 1.5 0 2l1.5 1.5c.5.5 1.5.5 2 0l2-2 1 3c.5 1 1.5 1 2.5.5.5-.5 1-1.5.5-2.5l-1-3 3-1c1 .5 2 .5 2.5 0 .5-.5.5-1.5 0-2l-2-2c-.5-.5-1.5-.5-2 0l-1 .5-1-1.5zM12 5l1 2-2 0 1-2z" fill="currentColor" />
    </g>
  ),
  birds_waders: (
    <g>
      {/* Heron standing */}
      <path d="M13 2c-1 0-2 .5-2.5 1.5-.5 1-.5 2 0 3L9 8c-1 0-2 1-2 2v2c0 1 .5 2 1.5 2.5L8 18c-.2.5 0 1 .5 1.5s1 .5 1.5 0l1-4h2l1 4c.5.5 1 .5 1.5 0s.7-1 .5-1.5l-.5-3.5c1-.5 1.5-1.5 1.5-2.5V10c0-1-1-2-2-2l-1-1.5c.5-1 .5-2 0-3L16 2h-3zM12.5 3.5c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
    </g>
  ),
  birds_songbirds: (
    <g>
      {/* Singing bird on branch */}
      <path d="M14 5c-2 0-3.5 1.5-4 3-.5 0-2 .5-2.5 1-.5.5-.5 1.5 0 2l2 1.5c-1 1-1 3 0 4 .5.5 1.5.5 2 0 .5-.5 1-1.5 1-2.5l1-.5c1 0 2-1 2.5-2 .5-1 .5-2 0-3-1-2-2-3-2-3zM13 7c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
      <path d="M11 6l-1-1m-1 1l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 16l16-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  birds_seabirds: (
    <g>
      {/* Gull flying */}
      <path d="M12 8l-4-2c-1-.5-2-.5-2.5 0-.5.5-.5 1.5 0 2l3 2-1 1c-.5.5-.5 1.5 0 2l1 1c.5.5 1.5.5 2 0l1-1h1l1 1c.5.5 1.5.5 2 0l1-1c.5-.5.5-1.5 0-2l-1-1 3-2c.5-.5.5-1.5 0-2-.5-.5-1.5-.5-2.5 0l-4 2zM12 6l1 1-2 0 1-1z" fill="currentColor" />
    </g>
  ),
  birds_colorful: (
    <g>
      {/* Kingfisher */}
      <path d="M14 3c-1.5 0-3 1-3.5 2.5L8 6c-.5 0-2 .5-2.5 1-.5.5-.5 1.5 0 2l2 1.5c-1 1-1 3 .5 4 .5.5 1.5.5 2 0 .5-.5 1-1 1.5-1.5h1l1.5 1.5c.5.5 1 .5 1.5 0 .5-.5.5-1.5 0-2L14 11c1-1 2-2 2-3.5 0-2-2-4.5-2-4.5zM7 7H3v1h4V7zm6 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
    </g>
  ),
  birds_rails_grebes: (
    <g>
      {/* Grebe swimming */}
      <path d="M14 4c-1 0-2 .5-2.5 1.5-.5 1-.5 2 .5 3L11 9c-1 0-2 1-2 2.5 0 1 1 2 2 2.5-1 .5-2 1-3 1H5c-1 0-2 .5-2.5 1.5-.5 1 0 2.5 1 3h10c2 0 4-1.5 4.5-3.5.5-2 0-4-2-5l-1-1c.5-.5 1-1 1.5-2 .5-1.5 0-3-1.5-3zM13.5 6c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
      <path d="M4 19h16v1H4z" fill="currentColor" opacity="0.4" />
    </g>
  ),
  birds_backyard: (
    <g>
      {/* House Sparrow */}
      <path d="M13 5c-2 0-3.5 2-4 3.5L8 9c-.5 0-2 .5-2.5 1-.5.5-.5 1.5 0 2l2 1.5c-1 1.5-1 3 .5 4 .5.2 1.5.2 2-.2 2.5-1.5 4-3 5-5 .5-1.5.5-3 0-4.5-1-1.5-2-2.8-2-2.8zM12 7c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="currentColor" />
      <path d="M3 17l18-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  birds_woodland: (
    <g>
      {/* Woodpecker on trunk */}
      <path d="M16 4c-1 0-2 .5-2.5 1.5-.5 1-.5 2 0 3l-1 .5c-1 0-2 .5-2.5 1.5-.5 1-.5 2 0 3l-.5.5c-.5 0-1 .5-1 1s.5 1.5 1.5 2l1.5-1c.5-.5 1-1 1.5-1 .5 0 1 .5 1.5 1 .5.5 1 .5 1.5 0l2-2c1-1 1.5-2.5 1.5-4 0-1.5-1-3.5-3-5.5zm-.5 3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5z" fill="currentColor" />
      <rect x="6" y="2" width="4" height="20" rx="1" fill="currentColor" opacity="0.7" />
    </g>
  ),
  // Plants
  plants_uk: (
    <g>
      {/* Bluebell */}
      <path d="M12 2c-.5 0-1 .5-1 1v4c0 1-1 2-2 2H8c-.5 0-1 .5-1 1s.5 1 1 1h1c1 0 2 1 2 2v4c0 .5.5 1 1 1s1-.5 1-1v-4c0-1 1-2 2-2h1c.5 0 1-.5 1-1s-.5-1-1-1h-1c-1 0-2-1-2-2V3c0-.5-.5-1-1-1z" fill="currentColor" />
      <path d="M8 10c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm8 0c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM12 18c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" fill="currentColor" opacity="0.7" />
    </g>
  ),
  plants_france: (
    <g>
      {/* Lavender */}
      <path d="M12 18V4m0 14l-2 2m2-2l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm0 5c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm0 5c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" fill="currentColor" />
      <path d="M10 7h-2M14 7h2M10 12h-2M14 12h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </g>
  ),
  plants_us: (
    <g>
      {/* Sunflower */}
      <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor" />
      <path d="M12 4l-1 3-3-1 1 3-3 1 3 1-1 3 3-1 1 3 1-3 3 1-1-3 3-1-3-1 1-3-3 1z" fill="currentColor" opacity="0.6" />
      <path d="M12 16v6m0-6l-2 3m2-3l2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  plants_orchids: (
    <g>
      {/* Orchid */}
      <path d="M12 4c-1 0-2 1.5-2.5 3-.5 1.5-1 3-2.5 3.5 1.5.5 2 2 2.5 3.5.5 1.5 1.5 3 2.5 3 1 0 2-1.5 2.5-3 .5-1.5 1-3 2.5-3.5-1.5-.5-2-2-2.5-3.5-.5-1.5-1.5-3-2.5-3z" fill="currentColor" />
      <path d="M12 9c-1 0-1.5 1-1.5 2s.5 2 1.5 2 1.5-1 1.5-2-.5-2-1.5-2z" fill="currentColor" opacity="0.8" />
      <path d="M9 13l-1 3M15 13l1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  plants_hedgerow: (
    <g>
      {/* Blackberry/Leaves */}
      <path d="M12 4c-2 0-3 2-3 4s1 4 3 4 3-2 3-4-1-4-3-4z" fill="currentColor" />
      <circle cx="11" cy="6" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="13" cy="6" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="11" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="13" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" opacity="0.6" />
      <path d="M12 12c-2 0-3 2-4 4-1 2 0 4 2 4s3-2 4-4-2-4-2-4z" fill="currentColor" opacity="0.5" />
      <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  plants_lawn: (
    <g>
      {/* Daisy */}
      <circle cx="12" cy="8" r="2" fill="currentColor" />
      <path d="M12 3v3m0 4v3m-5-5h3m4 0h3m-6.5-3.5l2 2m3 3l2 2m-7 0l2-2m-2-5l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12v10m0-6l-3-2m3 2l3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
