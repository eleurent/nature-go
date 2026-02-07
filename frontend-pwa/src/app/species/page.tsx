'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, endpoints, API_URL } from '@/lib/api';

interface Species {
  id: number;
  display_name: string;
  illustration_url: string;
  rarity: string;
}

const RARITY_COLORS: Record<string, string> = {
  'Very Common': 'text-gray-700',
  'Common': 'text-gray-700',
  'Uncommon': 'text-green-700',
  'Rare': 'text-blue-500',
  'Legendary': 'text-orange-500',
};

function SpeciesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authState } = useAuth();
  const [speciesList, setSpeciesList] = useState<Species[] | null>(null);
  const [mounted, setMounted] = useState(false);

  const type = searchParams.get('type') || 'plant';

  useEffect(() => {
    setMounted(true);
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    const fetchSpeciesList = async () => {
      try {
        const response = await api.get(endpoints.species.list(type));
        setSpeciesList(response.data);
      } catch (error) {
        console.error('Failed to fetch species list:', error);
        setSpeciesList([]);
      }
    };

    fetchSpeciesList();
  }, [authState.userToken, type]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || !authState.userToken) return null;

  const getImageUrl = (url: string) => {
    if (!url) return '/images/placeholder.png';
    return url.replace('http://localhost/', API_URL);
  };

  return (
    <div className="page-background min-h-screen">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="pt-16 px-4 pb-8">
        {speciesList === null ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" />
          </div>
        ) : speciesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-8">
            <p className="text-2xl font-old-standard text-center text-gray-700">
              I haven&apos;t found anything yet.
            </p>
            <p className="text-xl font-old-standard text-center text-gray-500 mt-4">
              Time to do some fieldwork!
            </p>
          </div>
        ) : (
          <>
            <p className="text-2xl font-old-standard text-center mb-6">
              {speciesList.length} species discovered.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {speciesList.map((species) => (
                <Link
                  key={species.id}
                  href={`/species/detail?id=${species.id}`}
                  className="flex flex-col items-center p-3 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <div className="w-28 h-28 relative">
                    <Image
                      src={getImageUrl(species.illustration_url)}
                      alt={species.display_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className={`font-special-elite text-lg text-center mt-2 ${RARITY_COLORS[species.rarity] || ''}`}>
                    {species.display_name}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SpeciesListPage() {
  return (
    <Suspense fallback={<div className="page-background min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" /></div>}>
      <SpeciesListContent />
    </Suspense>
  );
}
