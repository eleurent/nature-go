'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useObservation } from '@/contexts/ObservationContext';
import { api, endpoints } from '@/lib/api';

interface SpeciesCandidate {
  id: number;
  display_name: string;
  scientificNameWithoutAuthor: string;
  score: number;
}

export default function ObservationConfirmPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { observationState, observationMethods } = useObservation();
  const [candidates, setCandidates] = useState<SpeciesCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    if (!observationState.image) {
      router.replace('/camera');
      return;
    }

    identifySpecies();
  }, [authState.userToken, observationState.image]);

  const identifySpecies = async () => {
    try {
      const response = await api.post(endpoints.observations.identify, {
        image: observationState.image,
        location: observationState.location,
      });
      setCandidates(response.data.candidates || []);
      if (response.data.candidates?.length > 0) {
        setSelectedId(response.data.candidates[0].id);
      }
    } catch (error) {
      console.error('Failed to identify species:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedId) return;

    setIsSaving(true);
    try {
      await api.post(endpoints.observations.save, {
        species_id: selectedId,
        image: observationState.image,
        datetime: observationState.datetime,
        location: observationState.location,
      });
      observationMethods.clearObservation();
      router.replace(`/species/${selectedId}`);
    } catch (error) {
      console.error('Failed to save observation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!authState.userToken) return null;

  return (
    <div className="page-background min-h-screen">
      <button
        onClick={() => {
          observationMethods.clearObservation();
          router.back();
        }}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="pt-16 px-6">
        {observationState.image && (
          <div className="flex justify-center mb-6">
            <div className="w-64 h-64 relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`data:image/jpeg;base64,${observationState.image}`}
                alt="Captured photo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <h1 className="text-2xl font-old-standard text-center mb-6">
          What did you observe?
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" />
            <p className="mt-4 font-old-standard">Identifying species...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-old-standard text-lg">
              Could not identify the species in this image.
            </p>
            <button
              onClick={() => router.replace('/camera')}
              className="btn-primary mt-6"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-w-md mx-auto">
              {candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedId(candidate.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedId === candidate.id
                      ? 'bg-nature-dark/20 ring-2 ring-nature-dark'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <span className="font-special-elite text-lg block">
                    {candidate.display_name}
                  </span>
                  <span className="text-sm text-nature-brown/60">
                    {candidate.scientificNameWithoutAuthor}
                  </span>
                  <span className="text-sm text-nature-brown/40 float-right">
                    {Math.round(candidate.score * 100)}%
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleSave}
                disabled={!selectedId || isSaving}
                className="btn-primary text-xl py-3 px-12"
              >
                {isSaving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
