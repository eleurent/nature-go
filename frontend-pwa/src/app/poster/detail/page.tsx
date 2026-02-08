'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { api, endpoints, API_URL } from '@/lib/api';

interface PosterSpecies {
  id: number | null;
  name: string;
  scientific_name: string | null;
  body_length_cm: number | null;
  illustration_url: string | null;
  has_illustration: boolean;
  is_seen: boolean;
}

interface PosterData {
  poster_id: string;
  poster_name: string;
  level: string | null;
  seen_count: number;
  total_count: number;
  species: PosterSpecies[];
}

interface PosterListItem {
  id: string;
  name: string;
  icon: string;
}

const LEVEL_COLORS: Record<string, string> = {
  'Gold': 'text-yellow-600',
  'Silver': 'text-gray-500',
  'Bronze': 'text-amber-700',
};

function PosterDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authState } = useAuth();
  const [posterData, setPosterData] = useState<PosterData | null>(null);
  const [posterList, setPosterList] = useState<PosterListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const posterId = searchParams.get('id') || '';

  const fetchPosterData = useCallback(async (id: string) => {
    try {
      const response = await api.get(endpoints.poster.data(id));
      setPosterData(response.data);
    } catch (error) {
      console.error('Failed to fetch poster data:', error);
    }
  }, []);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    const fetchPosters = async () => {
      try {
        const response = await api.get(endpoints.poster.list);
        setPosterList(response.data);
        const index = response.data.findIndex((p: PosterListItem) => p.id === posterId);
        if (index >= 0) setCurrentIndex(index);
      } catch (error) {
        console.error('Failed to fetch poster list:', error);
      }
    };

    fetchPosters();
    if (posterId) fetchPosterData(posterId);
  }, [authState.userToken, posterId, router, fetchPosterData]);

  const navigateToPoster = (index: number) => {
    if (index >= 0 && index < posterList.length) {
      const newId = posterList[index].id;
      router.replace(`/poster/detail?id=${newId}`);
      setCurrentIndex(index);
      fetchPosterData(newId);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < posterList.length - 1) {
        navigateToPoster(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        navigateToPoster(currentIndex - 1);
      }
    }
    setTouchStart(null);
  };

  const generateMissingIllustration = async () => {
    if (!posterData || isGenerating) return;

    const missingSpecies = posterData.species.find(s => s.id && !s.has_illustration);
    if (!missingSpecies || !missingSpecies.id) return;

    setIsGenerating(true);
    try {
      await api.post(endpoints.species.generateIllustration(missingSpecies.id));
      await api.post(endpoints.species.generateTransparentIllustration(missingSpecies.id));
      await fetchPosterData(posterData.poster_id);
    } catch (error) {
      console.error('Failed to generate illustration:', error);
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    if (posterData) {
      const hasMissing = posterData.species.some(s => s.id && !s.has_illustration);
      if (hasMissing && !isGenerating) {
        generateMissingIllustration();
      }
    }
  }, [posterData]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!authState.userToken) return null;

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    return url.replace('http://localhost/', API_URL);
  };

  const maxSize = posterData?.species.reduce((max, s) => Math.max(max, s.body_length_cm || 0), 0) || 1;

  return (
    <div
      className="page-background min-h-screen pb-8"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={() => router.push('/profile')}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="pt-16 px-4">
        {posterData && (
          <>
            <div className="text-center mb-4">
              <h1 className="text-2xl font-old-standard">{posterData.poster_name}</h1>
              <p className={`text-lg font-old-standard ${posterData.level ? LEVEL_COLORS[posterData.level] : 'text-gray-400'}`}>
                {posterData.level || 'No level'} • {posterData.seen_count}/{posterData.total_count} species
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => navigateToPoster(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-3 py-1 bg-white/80 rounded shadow disabled:opacity-30"
              >
                ←
              </button>
              <div className="flex gap-1 items-center">
                {posterList.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-nature-dark' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => navigateToPoster(currentIndex + 1)}
                disabled={currentIndex === posterList.length - 1}
                className="px-3 py-1 bg-white/80 rounded shadow disabled:opacity-30"
              >
                →
              </button>
            </div>

            {isGenerating && (
              <div className="text-center mb-4 text-sm text-gray-600">
                Generating illustration...
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              {posterData.species.map((species, i) => {
                const scale = species.body_length_cm ? (species.body_length_cm / maxSize) : 0.3;
                const size = Math.max(40, Math.min(80, 80 * scale));
                const imgUrl = getImageUrl(species.illustration_url);

                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center ${!species.is_seen ? 'opacity-40' : ''}`}
                  >
                    <div
                      className="relative flex items-center justify-center"
                      style={{ width: 80, height: 80 }}
                    >
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={species.name}
                          width={size}
                          height={size}
                          className={`object-contain ${!species.is_seen ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <div
                          className="bg-gray-400 rounded-full"
                          style={{ width: size * 0.8, height: size * 0.8 }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-center line-clamp-2 font-old-standard">
                      {species.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PosterDetailPage() {
  return (
    <Suspense fallback={<div className="page-background min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" /></div>}>
      <PosterDetailContent />
    </Suspense>
  );
}
