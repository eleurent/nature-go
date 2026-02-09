'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useObservation } from '@/contexts/ObservationContext';
import { api, endpoints } from '@/lib/api';

const PROBABILITY_THRESHOLD = 0.00005;
const NUM_CANDIDATES = 10;

interface IdentificationResult {
  species: {
    id: number;
    commonNames: string[];
    scientificNameWithoutAuthor: string;
  };
  confidence: number;
}

export default function ObservationSelectPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { observationState, observationMethods } = useObservation();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpModalVisible, setXpModalVisible] = useState(false);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    if (!observationState.image) {
      router.replace('/camera');
      return;
    }

    if (!observationState.data) {
      sendObservation();
    } else {
      setIsLoading(false);
    }
  }, [authState.userToken, observationState.image]);

  const sendObservation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', observationState.image!);
      formData.append('type', observationState.type);
      formData.append('organ', observationState.organ);
      if (observationState.location) {
        formData.append('location', JSON.stringify(observationState.location));
      }
      if (observationState.datetime) {
        formData.append('datetime', observationState.datetime);
      }

      const response = await api.post(endpoints.observations.create, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      observationMethods.setObservationData(response.data);
    } catch (err) {
      console.error('Failed to identify species:', err);
      setError('Failed to identify species. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSpecies = async (speciesIndex: number) => {
    if (!observationState.data) return;

    try {
      setIsConfirming(true);
      const formData = new FormData();
      formData.append('species', speciesIndex.toString());

      const response = await api.patch(
        endpoints.observations.update(observationState.data.id),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      observationMethods.setObservationData(response.data);
      setXpModalVisible(true);
    } catch (err) {
      console.error('Failed to confirm species:', err);
      setError('Failed to save observation. Please try again.');
      setIsConfirming(false);
    }
  };

  const parseReason = (reason: Record<string, string>) => {
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
  };

  const onXPModalClose = () => {
    setXpModalVisible(false);
    const speciesId = observationState.data?.species;
    const speciesType = observationState.data?.type;
    observationMethods.clearObservation();
    if (speciesId) {
      window.history.replaceState(null, '', '/home');
      window.history.pushState(null, '', `/species?type=${speciesType || 'bird'}`);
      router.replace(`/species/detail?id=${speciesId}&fromObservation=true`);
    } else {
      router.replace('/home');
    }
  };

  if (!authState.userToken) return null;

  const hasResults = observationState.data?.identification_response?.results;
  const candidates = hasResults
    ? observationState.data!.identification_response!.results
        .filter((r: IdentificationResult) => r.confidence >= PROBABILITY_THRESHOLD)
        .slice(0, NUM_CANDIDATES)
    : [];
  const emptyResults = hasResults && candidates.length === 0;

  return (
    <div className="page-background min-h-screen">
      <button
        onClick={() => {
          observationMethods.clearObservation();
          router.replace('/camera');
        }}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="pt-4">
        {observationState.image && (
          <div className="w-full h-48 relative">
            <Image
              src={`data:image/jpeg;base64,${observationState.image}`}
              alt="Captured photo"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="px-4 pt-4">
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent" />
              <p className="mt-4 font-old-standard text-lg">Identifying the specimen...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="font-old-standard text-lg text-red-600">{error}</p>
              <button
                onClick={sendObservation}
                className="btn-primary mt-6"
              >
                Try Again
              </button>
            </div>
          ) : emptyResults ? (
            <div className="text-center py-8">
              <p className="font-old-standard text-lg">
                I don&apos;t recognize this specimen. Maybe get a closer look?
              </p>
              <button
                onClick={() => {
                  observationMethods.clearObservation();
                  router.replace('/camera');
                }}
                className="btn-primary mt-6"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-w-md mx-auto pb-8">
              <h2 className="text-xl font-old-standard text-center mb-4">
                Select the species
              </h2>
              {candidates.map((candidate: IdentificationResult, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-special-elite text-lg block">
                      {candidate.species.commonNames?.length > 0
                        ? candidate.species.commonNames[0]
                        : candidate.species.scientificNameWithoutAuthor}
                    </span>
                    <span className="text-sm text-nature-brown/60 italic">
                      {candidate.species.scientificNameWithoutAuthor}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-old-standard text-lg block">
                      {Math.round(candidate.confidence * 100)}%
                    </span>
                    <button
                      onClick={() => confirmSpecies(index)}
                      disabled={isConfirming}
                      className="mt-1 px-4 py-1 rounded bg-green-500 text-white text-sm hover:bg-green-600 disabled:opacity-50"
                    >
                      {isConfirming ? '...' : 'Validate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {xpModalVisible && observationState.data?.xp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#fdf4e3] rounded-xl p-6 w-[80%] max-w-sm shadow-lg">
            {observationState.data.xp.breakdown?.map((item: { value: number; reason: Record<string, string> }, index: number) => (
              <div key={index} className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">{parseReason(item.reason).toUpperCase()}</span>
                <span className="text-sm text-rose-500">{item.value} XP</span>
              </div>
            ))}
            <hr className="my-3 border-gray-300" />
            <div className="flex justify-between mb-4">
              <span className="text-2xl text-gray-700">TOTAL</span>
              <span className="text-2xl text-rose-500">{observationState.data.xp.total} XP</span>
            </div>
            <button
              onClick={onXPModalClose}
              className="w-full btn-primary text-lg py-3 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
