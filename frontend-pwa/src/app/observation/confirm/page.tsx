'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useObservation } from '@/contexts/ObservationContext';

interface TypeButtonProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function TypeButton({ icon, label, selected, onClick }: TypeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        selected
          ? 'bg-green-600 text-white'
          : 'bg-white/50 text-nature-brown/60 hover:bg-white/70'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-old-standard text-lg">{label}</span>
    </button>
  );
}

export default function ObservationConfirmPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { observationState, observationMethods } = useObservation();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    if (!observationState.image) {
      router.replace('/camera');
      return;
    }
  }, [authState.userToken, observationState.image, router]);

  if (!authState.userToken || !observationState.image) return null;

  const handleConfirm = () => {
    router.push('/observation/select');
  };

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
            <div className="w-full max-w-md h-80 relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`data:image/jpeg;base64,${observationState.image}`}
                alt="Captured photo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <h2 className="text-xl font-old-standard text-center mb-4">
          What did you photograph?
        </h2>

        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <TypeButton
            icon="🐦"
            label="Bird"
            selected={observationState.type === 'bird'}
            onClick={() => observationMethods.setObservationTypeOrOrgan('bird')}
          />
          <TypeButton
            icon="🍃"
            label="Leaf"
            selected={observationState.organ === 'leaf'}
            onClick={() => observationMethods.setObservationTypeOrOrgan('leaf')}
          />
          <TypeButton
            icon="🌸"
            label="Flower"
            selected={observationState.organ === 'flower'}
            onClick={() => observationMethods.setObservationTypeOrOrgan('flower')}
          />
        </div>

        {observationState.location && (
          <div className="mb-6">
            <h3 className="text-lg font-old-standard text-center mb-2">Location</h3>
            <div className="flex justify-center">
              <div className="w-64 h-40 rounded-lg overflow-hidden shadow-lg bg-gray-200">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${observationState.location.longitude - 0.01},${observationState.location.latitude - 0.01},${observationState.location.longitude + 0.01},${observationState.location.latitude + 0.01}&layer=mapnik&marker=${observationState.location.latitude},${observationState.location.longitude}`}
                  width="256"
                  height="160"
                  className="border-0"
                  onLoad={() => setMapLoaded(true)}
                  title="Location map"
                />
              </div>
            </div>
            <p className="text-center text-sm text-nature-brown/60 mt-2">
              {observationState.location.latitude.toFixed(4)}, {observationState.location.longitude.toFixed(4)}
            </p>
          </div>
        )}

        <div className="flex justify-center mt-8 pb-8">
          <button
            onClick={handleConfirm}
            className="btn-primary text-xl py-3 px-12"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
