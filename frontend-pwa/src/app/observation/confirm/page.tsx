'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useObservation } from '@/contexts/ObservationContext';
import { useLocation } from '@/contexts/LocationContext';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const MapClickHandler = dynamic(
  () => import('@/components/MapClickHandler'),
  { ssr: false }
);

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
  const { locationState } = useLocation();
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    if (!observationState.image) {
      router.replace('/camera');
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload = () => setLeafletLoaded(true);
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [authState.userToken, observationState.image, router]);

  if (!authState.userToken || !observationState.image) return null;

  const handleConfirm = () => {
    router.push('/observation/select');
  };

  const handleMapClick = (lat: number, lng: number) => {
    observationMethods.setObservationLocation({ latitude: lat, longitude: lng });
    setEditingLocation(false);
  };

  const hasLocation = observationState.location != null;
  const showPicker = leafletLoaded && (!hasLocation || editingLocation);

  // Center for the map picker: use existing observation location, then device location, then Paris
  const defaultCenter: [number, number] = observationState.location
    ? [observationState.location.latitude, observationState.location.longitude]
    : locationState.location
      ? [locationState.location.latitude, locationState.location.longitude]
      : [48.85, 2.35];

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

        <div className="mb-6">
          <h3 className="text-lg font-old-standard text-center mb-2">Location</h3>

          {showPicker ? (
            <div>
              <p className="text-center text-sm text-nature-brown/60 mb-2">
                Tap the map to pin where you saw this specimen.
              </p>
              <div className="flex justify-center">
                <div className="w-full max-w-md h-56 rounded-lg overflow-hidden shadow-lg">
                  <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    scrollWheelZoom={true}
                    dragging={true}
                    zoomControl={true}
                    attributionControl={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onClick={handleMapClick} />
                    {observationState.location && (
                      <Marker position={[observationState.location.latitude, observationState.location.longitude]} />
                    )}
                  </MapContainer>
                </div>
              </div>
              {editingLocation && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setEditingLocation(false)}
                    className="text-sm text-nature-brown/60 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : hasLocation ? (
            <div>
              <div className="flex justify-center">
                <div className="w-64 h-40 rounded-lg overflow-hidden shadow-lg bg-gray-200">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${observationState.location!.longitude - 0.01},${observationState.location!.latitude - 0.01},${observationState.location!.longitude + 0.01},${observationState.location!.latitude + 0.01}&layer=mapnik&marker=${observationState.location!.latitude},${observationState.location!.longitude}`}
                    width="256"
                    height="160"
                    className="border-0"
                    title="Location map"
                  />
                </div>
              </div>
              <p className="text-center text-sm text-nature-brown/60 mt-2">
                {observationState.location!.latitude.toFixed(4)}, {observationState.location!.longitude.toFixed(4)}
              </p>
              {leafletLoaded && (
                <div className="flex justify-center mt-1">
                  <button
                    onClick={() => setEditingLocation(true)}
                    className="text-sm text-nature-brown/60 underline"
                  >
                    Edit location
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-nature-brown/60">
              Loading map...
            </p>
          )}
        </div>

        <div className="flex justify-center mt-8 pb-8">
          <button
            onClick={handleConfirm}
            disabled={!hasLocation}
            className="btn-primary text-xl py-3 px-12 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
