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
  is_bonus?: boolean;
  rarity?: string;
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

const RARITY_COLORS: Record<string, string> = {
  'Very Common': '#555',
  'Common': '#555',
  'Uncommon': '#15803d',
  'Rare': '#3b82f6',
  'Legendary': '#f97316',
};

function PosterDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authState } = useAuth();
  const [posterData, setPosterData] = useState<PosterData | null>(null);
  const [posterList, setPosterList] = useState<PosterListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

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



  const handleSpeciesClick = (species: PosterSpecies) => {
    if (species.is_seen && species.id) {
      router.push(`/species/detail?id=${species.id}`);
    }
  };

  const computePositions = (species: PosterSpecies[], maxSize: number) => {
    const positions: { x: number; y: number; size: number }[] = [];
    
    species.forEach((s, i) => {
      const sizeScale = s.body_length_cm ? (s.body_length_cm / maxSize) : 0.4;
      const size = Math.max(50, Math.min(100, 100 * sizeScale));
      
      const cols = 4;
      const row = Math.floor(i / cols);
      const col = i % cols;
      const isOffsetRow = row % 2 === 1;
      
      const baseSpacing = 80;
      const x = col * baseSpacing + (isOffsetRow ? baseSpacing / 2 : 0) + 40;
      const y = row * 70 + 50;
      
      positions.push({ x, y, size });
    });
    
    return positions;
  };

  if (!authState.userToken) return null;

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    return url.replace('http://localhost/', API_URL);
  };

  const maxSize = posterData?.species.reduce((max, s) => Math.max(max, s.body_length_cm || 0), 0) || 1;
  const positions = posterData ? computePositions(posterData.species, maxSize) : [];
  const contentHeight = positions.length > 0 ? Math.max(...positions.map(p => p.y)) + 120 : 400;

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#f5f0e6',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      }}
    >
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="fixed top-4 right-4 z-10 flex gap-1 items-center">
        {posterList.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-nature-dark' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      <div className="pt-12 px-2 pb-8 overflow-auto">
        {posterData && (
          <>
            <div className="text-center mb-4">
              <h1 className="text-2xl font-old-standard tracking-wide" style={{ color: '#4a3f35', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>
                ❧ {posterData.poster_name} ❧
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="h-px bg-amber-800/30 w-12" />
                <p className={`text-sm font-old-standard ${posterData.level ? LEVEL_COLORS[posterData.level] : 'text-gray-500'}`}>
                  {posterData.seen_count} of {posterData.total_count} observed
                </p>
                <div className="h-px bg-amber-800/30 w-12" />
              </div>
            </div>

            {isGenerating && (
              <div className="text-center mb-2 text-xs text-gray-600">
                Generating...
              </div>
            )}

            <div 
              className="relative mx-auto"
              style={{ 
                width: 340, 
                height: contentHeight,
              }}
            >
              {posterData.species.map((species, i) => {
                const pos = positions[i];
                if (!pos) return null;
                const imgUrl = getImageUrl(species.illustration_url);

                return (
                  <div
                    key={i}
                    className={`absolute flex flex-col items-center ${species.is_seen ? 'cursor-pointer' : ''}`}
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: 'translate(-50%, -50%)',
                      width: 80,
                    }}
                    onClick={() => handleSpeciesClick(species)}
                  >
                    <div
                      className="relative flex items-center justify-center"
                      style={{ width: pos.size, height: pos.size }}
                    >
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={species.name}
                          width={pos.size}
                          height={pos.size}
                          className="object-contain"
                          style={!species.is_seen ? { filter: 'brightness(0) opacity(0.7)' } : undefined}
                        />
                      ) : (
                        <div
                          className="bg-gray-400 rounded-full"
                          style={{ width: pos.size * 0.7, height: pos.size * 0.7 }}
                        />
                      )}
                    </div>
                    <span 
                      className="text-[8px] text-center font-old-standard leading-tight mt-1"
                      style={{ 
                        maxWidth: 70, 
                        wordWrap: 'break-word', 
                        color: species.is_seen 
                          ? (species.rarity ? RARITY_COLORS[species.rarity] || '#4a3f35' : '#4a3f35')
                          : '#888' 
                      }}
                    >
                      {species.is_seen ? species.name : ''}
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
