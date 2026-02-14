'use client';

import React, { useState, useEffect, useCallback } from 'react';

const TITLES: Record<number, string> = {
  1: 'Scout',
  2: 'Field Assistant',
  3: 'Apprentice Naturalist',
  4: 'Undergraduate',
  5: 'PhD Candidate',
  6: 'Postdoctoral Fellow',
  7: 'Assistant Professor',
  8: 'Associate Professor',
  9: 'Professor',
  10: 'Distinguished Professor',
};

function getTitle(level: number): string {
  return TITLES[level] || TITLES[10];
}

interface XpBreakdownItem {
  value: number;
  reason: Record<string, string>;
}

interface Achievements {
  new_species?: boolean;
  species_name?: string;
  level_up?: { old_level: number; new_level: number };
  badge_updates?: { name: string; old_level: string | null; new_level: string | null }[];
  poster_updates?: { poster_name: string; poster_id: string; old_level: string | null; new_level: string | null }[];
}

interface AchievementModalProps {
  xp: {
    total: number;
    breakdown: XpBreakdownItem[];
  };
  achievements?: Achievements;
  onClose: () => void;
}

type Slide = { type: 'xp' } | { type: 'new_species'; name: string } | { type: 'level_up'; old_level: number; new_level: number } | { type: 'badge'; name: string; old_level: string | null; new_level: string | null } | { type: 'poster'; poster_name: string; old_level: string | null; new_level: string | null };

function parseReason(reason: Record<string, string>): string {
  if ('Rarity' in reason) {
    if (reason.Rarity === 'Common' || reason.Rarity === 'Very Common') return 'Common species';
    if (reason.Rarity === 'Uncommon') return 'Uncommon species';
    if (reason.Rarity === 'Rare') return 'Rare species';
    if (reason.Rarity === 'Legendary') return 'Legendary species';
  } else if ('Familiarity' in reason) {
    if (reason.Familiarity === 'New') return 'New species discovered!';
    if (reason.Familiarity === 'Unfamiliar') return 'Unfamiliar';
    if (reason.Familiarity === 'Familiar') return 'Familiar';
    if (reason.Familiarity === 'Expert') return 'Expert';
  }
  return JSON.stringify(reason);
}

const BADGE_LEVEL_EMOJI: Record<string, string> = {
  'Bronze': '🥉',
  'Silver': '🥈',
  'Gold': '🥇',
};

const POSTER_LEVEL_COLORS: Record<string, string> = {
  'Bronze': 'from-amber-600 to-amber-400',
  'Silver': 'from-gray-400 to-gray-200',
  'Gold': 'from-yellow-500 to-yellow-300',
};

export default function AchievementModal({ xp, achievements, onClose }: AchievementModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);
  const [xpCountUp, setXpCountUp] = useState(0);

  // Build slides
  const slides: Slide[] = [{ type: 'xp' }];
  if (achievements?.new_species && achievements.species_name) {
    slides.push({ type: 'new_species', name: achievements.species_name });
  }
  if (achievements?.level_up) {
    slides.push({ type: 'level_up', old_level: achievements.level_up.old_level, new_level: achievements.level_up.new_level });
  }
  if (achievements?.badge_updates) {
    for (const badge of achievements.badge_updates) {
      slides.push({ type: 'badge', name: badge.name, old_level: badge.old_level, new_level: badge.new_level });
    }
  }
  if (achievements?.poster_updates) {
    for (const poster of achievements.poster_updates) {
      slides.push({ type: 'poster', poster_name: poster.poster_name, old_level: poster.old_level, new_level: poster.new_level });
    }
  }

  const isLastSlide = currentSlide >= slides.length - 1;

  // XP count-up animation
  useEffect(() => {
    if (slides[currentSlide]?.type !== 'xp') return;
    const target = xp.total;
    const duration = 800;
    const steps = 20;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setXpCountUp(target);
        clearInterval(interval);
      } else {
        setXpCountUp(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [currentSlide]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback(() => {
    if (isLastSlide) {
      onClose();
      return;
    }
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentSlide(prev => prev + 1);
      setAnimateIn(true);
    }, 200);
  }, [isLastSlide, onClose]);

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={advance}>
      <div
        className={`relative w-[85%] max-w-sm transition-all duration-300 ${
          animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Parchment card */}
        <div className="bg-[#fdf4e3] rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-800/20">
          {/* Decorative top bar */}
          <div className="h-1.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800" />

          <div className="p-6">
            {slide.type === 'xp' && (
              <div>
                <h3 className="text-center font-old-standard text-lg text-amber-900/70 uppercase tracking-widest mb-4">
                  Experience Gained
                </h3>
                {xp.breakdown?.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span className="text-sm text-gray-700 font-old-standard">
                      {parseReason(item.reason).toUpperCase()}
                    </span>
                    <span className="text-sm text-rose-600 font-old-standard font-bold">
                      +{item.value} XP
                    </span>
                  </div>
                ))}
                <hr className="my-3 border-amber-800/20" />
                <div className="flex justify-between items-center">
                  <span className="text-2xl text-gray-800 font-old-standard">TOTAL</span>
                  <span className="text-3xl text-rose-600 font-old-standard font-bold">
                    +{xpCountUp} XP
                  </span>
                </div>
              </div>
            )}

            {slide.type === 'new_species' && (
              <div className="text-center py-4">
                <div className="text-5xl mb-4 animate-bounce">🔬</div>
                <h3 className="font-old-standard text-lg text-amber-900/70 uppercase tracking-widest mb-2">
                  New Discovery!
                </h3>
                <p className="text-2xl font-special-elite text-gray-800 mb-1">
                  {slide.name}
                </p>
                <p className="text-sm text-gray-500 font-old-standard italic">
                  Added to your specimen journal
                </p>
              </div>
            )}

            {slide.type === 'level_up' && (
              <div className="text-center py-4">
                <div className="text-5xl mb-4 animate-bounce">⬆️</div>
                <h3 className="font-old-standard text-lg text-amber-900/70 uppercase tracking-widest mb-2">
                  Promotion!
                </h3>
                <p className="text-sm text-gray-500 font-old-standard mb-2">
                  {getTitle(slide.old_level)}
                </p>
                <div className="text-gray-400 mb-2">↓</div>
                <p className="text-2xl font-special-elite text-gray-800">
                  {getTitle(slide.new_level)}
                </p>
                <p className="text-sm text-amber-700 font-old-standard mt-2">
                  Level {slide.new_level}
                </p>
              </div>
            )}

            {slide.type === 'badge' && (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">
                  {BADGE_LEVEL_EMOJI[slide.new_level || ''] || '🏅'}
                </div>
                <h3 className="font-old-standard text-lg text-amber-900/70 uppercase tracking-widest mb-2">
                  Badge Earned!
                </h3>
                <p className="text-xl font-special-elite text-gray-800 mb-1">
                  {slide.name}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {slide.old_level && (
                    <>
                      <span className="text-sm text-gray-400 font-old-standard">{slide.old_level}</span>
                      <span className="text-gray-400">→</span>
                    </>
                  )}
                  <span className="text-lg font-old-standard font-bold text-amber-700">
                    {slide.new_level}
                  </span>
                </div>
              </div>
            )}

            {slide.type === 'poster' && (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="font-old-standard text-lg text-amber-900/70 uppercase tracking-widest mb-2">
                  Field Guide Progress!
                </h3>
                <p className="text-xl font-special-elite text-gray-800 mb-3">
                  {slide.poster_name}
                </p>
                <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${POSTER_LEVEL_COLORS[slide.new_level || ''] || 'from-gray-300 to-gray-200'}`}>
                  <span className="text-sm font-old-standard font-bold text-white drop-shadow">
                    {slide.new_level} Rank
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom action area */}
          <div className="px-6 pb-5">
            <button
              onClick={advance}
              className="w-full btn-primary text-lg py-3 rounded-full"
            >
              {isLastSlide ? 'OK' : 'Continue'}
            </button>

            {/* Slide indicators */}
            {slides.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentSlide
                        ? 'bg-amber-700 w-4'
                        : i < currentSlide
                        ? 'bg-amber-400'
                        : 'bg-amber-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
