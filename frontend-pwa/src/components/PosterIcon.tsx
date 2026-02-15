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

// A simple lettrine fallback when no SVG icon file exists
function LettrineIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const initial = name.charAt(0).toUpperCase();
  const fontSize = Math.round(size * 0.45);
  return (
    <text
      x={size / 2}
      y={size / 2 + fontSize * 0.35}
      textAnchor="middle"
      fontFamily="'Old Standard TT', Georgia, serif"
      fontSize={fontSize}
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
  const [iconLoaded, setIconLoaded] = React.useState(false);
  const palette = level ? LEVEL_PALETTE[level as keyof typeof LEVEL_PALETTE] : LEVEL_PALETTE.none;
  const progress = totalCount > 0 ? seenCount / totalCount : 0;

  // SVG ring dimensions
  const strokeWidth = size >= 56 ? 3 : 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Icon sizing: extra padding to avoid cropping at circle edge
  const iconInset = strokeWidth + 4;
  const iconSize = size - iconInset * 2;

  // SVG icon file path
  const iconSrc = `/images/poster-icons/${posterId}.svg`;

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

          {/* Lettrine fallback — only shown when SVG icon hasn't loaded */}
          {!iconLoaded && (
            <LettrineIcon name={posterName} color={palette.icon} size={size} />
          )}

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

        {/* Invisible preload to detect if SVG icon file exists */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          onLoad={() => setIconLoaded(true)}
          style={{ display: 'none' }}
        />

        {/* AI-generated SVG icon, tinted with badge color via CSS mask */}
        {iconLoaded && (
          <div
            style={{
              position: 'absolute',
              top: iconInset,
              left: iconInset,
              width: iconSize,
              height: iconSize,
              backgroundColor: palette.icon,
              WebkitMaskImage: `url(${iconSrc})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: `url(${iconSrc})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
          />
        )}
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
