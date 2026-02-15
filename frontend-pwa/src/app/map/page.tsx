'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
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

// This component lives *inside* MapContainer and uses the useMap() hook
// to imperatively re-center the map when the target position changes.
// MapContainer only reads its `center` prop on first render, so this is required.
const ChangeView = dynamic(
  () =>
    import('react-leaflet').then((mod) => {
      const { useMap } = mod;
      function ChangeViewInner({ center, zoom }: { center: [number, number]; zoom: number }) {
        const map = useMap();
        useEffect(() => {
          map.setView(center, zoom);
        }, [center, zoom, map]);
        return null;
      }
      ChangeViewInner.displayName = 'ChangeView';
      return ChangeViewInner;
    }),
  { ssr: false }
);

interface Observation {
  id: number;
  type: 'bird' | 'plant';
  species: number;
  species_display_name: string;
  datetime: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

const SPECIES_TYPE_TO_COLOR: Record<string, string> = {
  bird: '#3b82f6',
  plant: '#ef4444',
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
  const { locationState } = useLocation();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [leafletModule, setLeafletModule] = useState<typeof import('leaflet') | null>(null);

  const createColoredIcon = useMemo(() => {
    if (!leafletModule) return () => undefined;
    return (color: string) => {
      return leafletModule.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24] as [number, number],
        iconAnchor: [12, 24] as [number, number],
        popupAnchor: [0, -24] as [number, number],
      });
    };
  }, [leafletModule]);

  useEffect(() => {
    if (authState.isLoading) return;
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

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload = () => setLeafletLoaded(true);
    document.head.appendChild(link);

    import('leaflet').then((L) => {
      setLeafletModule(L);
    });

    return () => {
      document.head.removeChild(link);
    };
  }, [authState.isLoading, authState.userToken]);

  if (authState.isLoading || !authState.userToken) return null;

  const validObservations = observations.filter(
    (obs) => obs.location?.latitude && obs.location?.longitude
  );

  // Use device location if available, otherwise first observation, otherwise Paris fallback
  const userLocation: [number, number] | null = locationState.location
    ? [locationState.location.latitude, locationState.location.longitude]
    : null;

  const defaultCenter: [number, number] = userLocation
    ? userLocation
    : validObservations.length > 0
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
          <div className="absolute top-4 right-4 z-[1000] bg-white/90 px-3 py-2 rounded shadow flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-nature-dark border-t-transparent" />
            <span className="text-sm">Loading observations...</span>
          </div>
        )}

        {leafletLoaded && leafletModule && (
          <MapContainer
            center={defaultCenter}
            zoom={10}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            {userLocation && (
              <ChangeView
                center={userLocation}
                zoom={10}
              />
            )}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validObservations.map((obs) => (
              <Marker
                key={obs.id}
                position={[obs.location!.latitude, obs.location!.longitude]}
                icon={createColoredIcon(SPECIES_TYPE_TO_COLOR[obs.type] || '#666666')}
              >
                <Popup>
                  <div className="flex flex-col items-center" style={{ minWidth: '120px' }}>
                    {obs.image && (
                      <div className="w-20 h-20 mb-2 rounded overflow-hidden">
                        <img
                          src={obs.image.replace('http://localhost/', process.env.NEXT_PUBLIC_API_URL || '/')}
                          alt={obs.species_display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Link
                      href={`/species/detail?id=${obs.species}`}
                      className="font-bold text-nature-dark hover:underline text-center"
                    >
                      {obs.species_display_name}
                    </Link>
                    <span className="text-xs text-gray-600 mt-1">{formatDate(obs.datetime)}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
