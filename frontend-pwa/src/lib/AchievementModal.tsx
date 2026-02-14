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
  species_illustration_url?: string | null;
  species_rarity?: string;
  level_up?: { old_level: number; new_level: number };
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

type Slide =
  | { type: 'xp' }
  | { type: 'new_species'; name: string; illustrationUrl: string | null; rarity: string }
  | { type: 'level_up'; old_level: number; new_level: number }
  | { type: 'poster'; poster_name: string; old_level: string | null; new_level: string | null };

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



const POSTER_LEVEL_COLORS: Record<string, string> = {
  'Bronze': 'from-amber-600 to-amber-400',
  'Silver': 'from-gray-400 to-gray-200',
  'Gold': 'from-yellow-500 to-yellow-300',
};

const RARITY_COLORS: Record<string, string> = {
  'Very Common': 'text-gray-500',
  'Common': 'text-green-600',
  'Uncommon': 'text-blue-600',
  'Rare': 'text-purple-600',
  'Legendary': 'text-amber-500',
};

const RARITY_BG: Record<string, string> = {
  'Very Common': 'from-gray-400 to-gray-300',
  'Common': 'from-green-500 to-green-400',
  'Uncommon': 'from-blue-500 to-blue-400',
  'Rare': 'from-purple-500 to-purple-400',
  'Legendary': 'from-amber-500 to-yellow-400',
};

// ─── Pokémon-style Species Reveal Slide ───────────────────────────
// Phase 0 (0-1.5s):    Shadow wobbles gently, info shows "???"
// Phase 1 (1.5-3s):    Shake intensifies
// Phase 2 (3-3.4s):    Flash/white-out
// Phase 3 (3.4s+):     Revealed — illustration + name + rarity

type RevealPhase = 0 | 1 | 2 | 3;

function SpeciesRevealSlide({
  name,
  illustrationUrl,
  rarity,
}: {
  name: string;
  illustrationUrl: string | null;
  rarity: string;
}) {
  const [phase, setPhase] = useState<RevealPhase>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => setPhase(3), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const hasIllustration = !!illustrationUrl;

  // Pick animation class for the silhouette image
  const silhouetteAnimClass =
    phase === 0
      ? 'animate-wobble'
      : phase === 1
      ? 'animate-shake'
      : '';

  const rarityColor = RARITY_COLORS[rarity] || 'text-gray-500';
  const rarityBg = RARITY_BG[rarity] || 'from-gray-400 to-gray-300';

  return (
    <div className="text-center py-2 relative overflow-hidden">
      {/* White flash overlay for phase 2 */}
      {phase === 2 && (
        <div className="absolute inset-0 z-10 bg-white animate-flash rounded-2xl" />
      )}

      {/* Illustration / silhouette area */}
      <div className="relative w-40 h-40 mx-auto mb-4">
        {hasIllustration ? (
          <>
            {/* Shadow version (phases 0-2) */}
            {phase < 3 && (
              <img
                src={illustrationUrl!}
                alt="???"
                className={`w-full h-full object-contain ${silhouetteAnimClass}`}
                style={{
                  filter: 'brightness(0)',
                  opacity: phase === 2 ? 0 : 1,
                  transition: 'opacity 0.2s',
                }}
              />
            )}
            {/* Revealed version (phase 3) */}
            {phase === 3 && (
              <img
                src={illustrationUrl!}
                alt={name}
                className="w-full h-full object-contain animate-pop-in"
              />
            )}
          </>
        ) : (
          <>
            {/* No illustration: show mystery emoji, then a question mark → name */}
            {phase < 3 ? (
              <div className={`text-8xl leading-none mt-4 ${silhouetteAnimClass}`}
                   style={{ opacity: phase === 2 ? 0 : 1, transition: 'opacity 0.2s' }}>
                ❓
              </div>
            ) : (
              <div className="text-8xl leading-none mt-4 animate-pop-in">
                🔬
              </div>
            )}
          </>
        )}

        {/* Confetti burst on reveal */}
        {phase === 3 && (
          <div className="absolute inset-[-40px] pointer-events-none overflow-visible">
            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * 360;
              const distance = 60 + Math.random() * 50;
              const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f97316'];
              const color = colors[i % colors.length];
              const size = 6 + Math.random() * 6;
              const shapes = ['rounded-full', 'rounded-none', 'rounded-sm rotate-45'];
              const shape = shapes[i % shapes.length];
              return (
                <span
                  key={i}
                  className={`absolute ${shape} animate-confetti`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    top: '50%',
                    left: '50%',
                    '--confetti-x': `${Math.cos(angle * Math.PI / 180) * distance}px`,
                    '--confetti-y': `${Math.sin(angle * Math.PI / 180) * distance}px`,
                    '--confetti-r': `${Math.random() * 720 - 360}deg`,
                    animationDelay: `${Math.random() * 200}ms`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-old-standard text-lg text-amber-900/70 uppercase tracking-widest mb-2">
        {phase < 3 ? 'New Specimen!' : 'Discovery!'}
      </h3>

      {/* Name: "???" until reveal */}
      <p className={`text-2xl font-special-elite mb-1 transition-all duration-300 ${
        phase < 3 ? 'text-gray-400' : 'text-gray-800'
      }`}>
        {phase < 3 ? '???' : name}
      </p>

      {/* Rarity badge on reveal */}
      {phase === 3 && (
        <div className="animate-fade-up">
          <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-old-standard font-bold text-white bg-gradient-to-r ${rarityBg}`}>
            {rarity}
          </span>
          <p className="text-sm text-gray-500 font-old-standard italic mt-2">
            Added to your specimen journal
          </p>
        </div>
      )}
    </div>
  );
}

// ─── CSS Animations (injected via <style>) ────────────────────────
function AnimationStyles() {
  return (
    <style jsx global>{`
      @keyframes wobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-2deg); }
        75% { transform: rotate(2deg); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        10% { transform: translateX(-4px) rotate(-3deg); }
        20% { transform: translateX(4px) rotate(3deg); }
        30% { transform: translateX(-6px) rotate(-4deg); }
        40% { transform: translateX(6px) rotate(4deg); }
        50% { transform: translateX(-8px) rotate(-5deg); }
        60% { transform: translateX(8px) rotate(5deg); }
        70% { transform: translateX(-6px) rotate(-4deg); }
        80% { transform: translateX(6px) rotate(4deg); }
        90% { transform: translateX(-4px) rotate(-3deg); }
      }
      @keyframes flash {
        0% { opacity: 0; }
        30% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes pop-in {
        0% { transform: scale(0.3); opacity: 0; }
        60% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes confetti {
        0% {
          opacity: 1;
          transform: translate(0, 0) rotate(0deg) scale(1);
        }
        100% {
          opacity: 0;
          transform:
            translate(var(--confetti-x), var(--confetti-y))
            rotate(var(--confetti-r))
            scale(0.3);
        }
      }
      @keyframes fade-up {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-wobble {
        animation: wobble 0.8s ease-in-out infinite;
      }
      .animate-shake {
        animation: shake 0.4s ease-in-out infinite;
      }
      .animate-flash {
        animation: flash 0.4s ease-out forwards;
      }
      .animate-pop-in {
        animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .animate-confetti {
        animation: confetti 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
      .animate-fade-up {
        animation: fade-up 0.4s ease-out forwards;
      }
    `}</style>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────
export default function AchievementModal({ xp, achievements, onClose }: AchievementModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);
  const [xpCountUp, setXpCountUp] = useState(0);
  const [revealComplete, setRevealComplete] = useState(false);

  // Build slides: new species reveal first (most exciting), then XP, level up, poster
  const slides: Slide[] = [];
  if (achievements?.new_species && achievements.species_name) {
    slides.push({
      type: 'new_species',
      name: achievements.species_name,
      illustrationUrl: achievements.species_illustration_url || null,
      rarity: achievements.species_rarity || 'Common',
    });
  }
  slides.push({ type: 'xp' });
  if (achievements?.level_up) {
    slides.push({ type: 'level_up', old_level: achievements.level_up.old_level, new_level: achievements.level_up.new_level });
  }
  if (achievements?.poster_updates) {
    for (const poster of achievements.poster_updates) {
      slides.push({ type: 'poster', poster_name: poster.poster_name, old_level: poster.old_level, new_level: poster.new_level });
    }
  }

  const isLastSlide = currentSlide >= slides.length - 1;
  const slide = slides[currentSlide];

  // For new_species slide: mark reveal complete after animation finishes (3.4s)
  useEffect(() => {
    setRevealComplete(false);
    if (slide?.type === 'new_species') {
      const timer = setTimeout(() => setRevealComplete(true), 3500);
      return () => clearTimeout(timer);
    } else {
      setRevealComplete(true);
    }
  }, [currentSlide]); // eslint-disable-line react-hooks/exhaustive-deps

  // XP count-up animation
  useEffect(() => {
    if (slide?.type !== 'xp') return;
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
    // Don't allow advancing during reveal animation
    if (!revealComplete) return;
    if (isLastSlide) {
      onClose();
      return;
    }
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentSlide(prev => prev + 1);
      setAnimateIn(true);
    }, 200);
  }, [isLastSlide, onClose, revealComplete]);

  return (
    <>
      <AnimationStyles />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={advance}
      >
        <div
          className={`relative w-[85%] max-w-sm transition-all duration-300 ${
            animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Parchment card — fully opaque */}
          <div className="rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-800/20" style={{ backgroundColor: '#fdf4e3' }}>
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
                <SpeciesRevealSlide
                  name={slide.name}
                  illustrationUrl={slide.illustrationUrl}
                  rarity={slide.rarity}
                />
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
                disabled={!revealComplete}
                className={`w-full btn-primary text-lg py-3 rounded-full transition-opacity ${
                  revealComplete ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
                }`}
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
    </>
  );
}
