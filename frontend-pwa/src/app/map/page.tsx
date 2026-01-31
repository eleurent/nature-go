'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { api, endpoints } from '@/lib/api';

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
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Observation {
  id: number;
  type: 'bird' | 'plant';
  species_display_name: string;
  datetime: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

const SPECIES_TYPE_TO_COLOR: Record<string, string> = {
  bird: '#ef4444',
  plant: '#22c55e',
};

function formatDate(datetime: string): string {
  const dateObj = new Date(datetime);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();

  const nthNumber = (number: number): string => {
    if (number > 3 && number < 21) return 'th';
    switch (number % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${nthNumber(day)} of ${month} ${year - 200}.`;
}

export default function MapPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    const fetchObservations = async () => {
      try {
        const response = await api.get(endpoints.observations.all);
        setObservations(response.data);
      } catch (error) {
        console.error('Failed to fetch observations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObservations();

    import('leaflet/dist/leaflet.css').then(() => {
      setLeafletLoaded(true);
    });
  }, [authState.userToken]);

  if (!authState.userToken) return null;

  const validObservations = observations.filter(
    (obs) => obs.location?.latitude && obs.location?.longitude
  );

  const defaultCenter: [number, number] = validObservations.length > 0
    ? [validObservations[0].location!.latitude, validObservations[0].location!.longitude]
    : [48.8566, 2.3522];

  return (
    <div className="page-background min-h-screen">
      <div className="relative h-screen">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-[1000] bg-white/90 px-3 py-1 rounded shadow"
        >
          ← Back
        </button>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-[999] bg-white/50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" />
          </div>
        )}

        {leafletLoaded && (
          <MapContainer
            center={defaultCenter}
            zoom={10}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validObservations.map((obs) => (
              <Marker
                key={obs.id}
                position={[obs.location!.latitude, obs.location!.longitude]}
              >
                <Popup>
                  <strong>{obs.species_display_name}</strong>
                  <br />
                  <span className="text-sm text-gray-600">{formatDate(obs.datetime)}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
