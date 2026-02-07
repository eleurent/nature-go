'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, endpoints, API_URL } from '@/lib/api';

interface Region {
  id: string;
  name: string;
}

interface PosterSpecies {
  id: number | null;
  name: string;
  scientific_name: string | null;
  body_length_cm: number | null;
  illustration_url: string | null;
  is_seen: boolean;
}

interface PosterData {
  region_id: string;
  region_name: string;
  species: PosterSpecies[];
}

export default function PosterPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [posterData, setPosterData] = useState<PosterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    const fetchRegions = async () => {
      try {
        const response = await api.get(endpoints.poster.regions);
        setRegions(response.data);
        if (response.data.length > 0) {
          setSelectedRegion(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    };

    fetchRegions();
  }, [authState.userToken, router]);

  useEffect(() => {
    if (!selectedRegion) return;

    const fetchPosterData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(endpoints.poster.data(selectedRegion));
        setPosterData(response.data);
      } catch (error) {
        console.error('Failed to fetch poster data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosterData();
  }, [selectedRegion]);

  if (!authState.userToken) return null;

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    return url.replace('http://localhost/', API_URL);
  };

  const getScale = (species: PosterSpecies, allSpecies: PosterSpecies[]) => {
    const sizes = allSpecies
      .map(s => s.body_length_cm)
      .filter((s): s is number => s !== null);
    
    if (sizes.length === 0) return 1;
    
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);
    const size = species.body_length_cm ?? minSize;
    
    if (maxSize === minSize) return 1.5;
    return 1 + 1.5 * (size - minSize) / (maxSize - minSize);
  };

  const seenCount = posterData?.species.filter(s => s.is_seen).length ?? 0;
  const totalCount = posterData?.species.length ?? 0;

  return (
    <div className="page-background min-h-screen">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="pt-16 px-4 pb-8">
        <h1 className="text-3xl font-old-standard text-center mb-2">
          Regional Bird Poster
        </h1>
        <Image
          src="/images/separator.png"
          alt=""
          width={200}
          height={5}
          className="mx-auto mb-4"
        />

        <div className="max-w-md mx-auto mb-6">
          <label className="block text-center font-old-standard text-lg mb-2">
            Select Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full p-3 rounded border-2 border-nature-dark/30 bg-white/80 font-special-elite text-lg"
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {posterData && (
          <p className="text-center font-old-standard text-lg mb-6">
            {seenCount} of {totalCount} species observed
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" />
          </div>
        ) : posterData ? (
          <div className="bg-[#f5f0e6] rounded-lg p-4 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-old-standard text-center mb-1">
              Birds of {posterData.region_name}
            </h2>
            <p className="text-center text-sm text-gray-500 font-special-elite mb-4">
              Illustrations roughly to scale
            </p>
            
            <div className="flex flex-wrap justify-center items-end gap-2">
              {posterData.species.map((species, index) => {
                const scale = getScale(species, posterData.species);
                const baseSize = 60;
                const size = baseSize * scale;
                const imageUrl = getImageUrl(species.illustration_url);
                
                return (
                  <div
                    key={species.id ?? `unknown-${index}`}
                    className="flex flex-col items-center"
                    style={{ width: `${size + 20}px` }}
                  >
                    {species.id && species.is_seen ? (
                      <Link href={`/species/detail?id=${species.id}`}>
                        <div
                          className="relative transition-transform hover:scale-110"
                          style={{ width: `${size}px`, height: `${size}px` }}
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={species.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-2xl">🐦</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div
                        className="relative"
                        style={{ width: `${size}px`, height: `${size}px` }}
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={species.name}
                            fill
                            className="object-contain"
                            style={{
                              filter: 'grayscale(100%) brightness(0.2)',
                              opacity: 0.6,
                            }}
                          />
                        ) : (
                          <div 
                            className="w-full h-full rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: '#1a1a1a',
                              opacity: 0.3,
                            }}
                          >
                            <span className="text-2xl" style={{ filter: 'grayscale(100%)' }}>🐦</span>
                          </div>
                        )}
                      </div>
                    )}
                    <span
                      className={`text-xs text-center font-special-elite mt-1 leading-tight ${
                        species.is_seen ? 'text-gray-800' : 'text-gray-400'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {species.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
