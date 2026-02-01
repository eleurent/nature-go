'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { api, endpoints, API_URL } from '@/lib/api';

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

interface Observation {
  id: number;
  image: string;
  datetime: string;
  location: { latitude: number; longitude: number } | null;
}

interface SpeciesDetails {
  id: number;
  type: string;
  display_name: string;
  scientificNameWithoutAuthor: string;
  illustration_url: string;
  illustration_transparent: string | null;
  rarity: string;
  descriptions: string[];
  audio_description: string | null;
}

const RARITY_STYLES: Record<string, string> = {
  'Very Common': 'bg-gray-600',
  'Common': 'bg-gray-600',
  'Uncommon': 'bg-green-600',
  'Rare': 'bg-blue-500',
  'Legendary': 'bg-orange-500',
};

function SpeciesDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authState } = useAuth();
  const [speciesDetails, setSpeciesDetails] = useState<SpeciesDetails | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTriedGenerating, setHasTriedGenerating] = useState(false);
  const [isGeneratingTransparent, setIsGeneratingTransparent] = useState(false);
  const [hasTriedGeneratingTransparent, setHasTriedGeneratingTransparent] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mapModal, setMapModal] = useState<{ lat: number; lng: number } | null>(null);

  const speciesId = Number(searchParams.get('id') || 0);
  const fromObservation = searchParams.get('fromObservation') === 'true';

  const handleBack = () => {
    if (fromObservation && speciesDetails?.type) {
      router.replace(`/species?type=${speciesDetails.type}`);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }

    if (!speciesId) return;

    const fetchData = async () => {
      try {
        const [detailsRes, obsRes] = await Promise.all([
          api.get(endpoints.species.detail(speciesId)),
          api.get(endpoints.species.observations(speciesId)),
        ]);
        setSpeciesDetails(detailsRes.data);
        setObservations(obsRes.data);
      } catch (error) {
        console.error('Failed to fetch species details:', error);
      }
    };

    fetchData();

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
  }, [authState.userToken, speciesId, router]);

  useEffect(() => {
    if (!speciesDetails || hasTriedGenerating) return;

    const shouldGenerateDescriptions = speciesDetails.descriptions && speciesDetails.descriptions.length === 0;
    const shouldGenerateIllustration = !speciesDetails.illustration_url;

    if ((shouldGenerateDescriptions || shouldGenerateIllustration) && !isGenerating) {
      setHasTriedGenerating(true);
      generateContent(shouldGenerateDescriptions, shouldGenerateIllustration);
    }
  }, [speciesDetails, isGenerating, hasTriedGenerating]);

  useEffect(() => {
    if (!speciesDetails || hasTriedGeneratingTransparent) return;
    if (!speciesDetails.illustration_url) return;
    if (speciesDetails.illustration_transparent) return;
    if (isGenerating || isGeneratingTransparent) return;

    setHasTriedGeneratingTransparent(true);
    generateTransparentIllustration();
  }, [speciesDetails, isGenerating, isGeneratingTransparent, hasTriedGeneratingTransparent]);

  const generateTransparentIllustration = async () => {
    setIsGeneratingTransparent(true);
    try {
      await api.post(endpoints.species.generateTransparentIllustration(speciesId));
      const response = await api.get(endpoints.species.detail(speciesId));
      setSpeciesDetails(response.data);
    } catch (error) {
      console.error('Failed to generate transparent illustration:', error);
    } finally {
      setIsGeneratingTransparent(false);
    }
  };

  const generateContent = async (generateDescriptions: boolean, generateIllustration: boolean) => {
    setIsGenerating(true);
    try {
      const promises: Promise<unknown>[] = [];
      if (generateDescriptions) {
        promises.push(api.post(endpoints.species.generateDescriptions(speciesId)));
      }
      if (generateIllustration) {
        promises.push(api.post(endpoints.species.generateIllustration(speciesId)));
      }

      await Promise.all(promises);

      const response = await api.get(endpoints.species.detail(speciesId));
      setSpeciesDetails(response.data);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://localhost:8000/')) {
      return url.replace('http://localhost:8000/', API_URL);
    }
    if (url.startsWith('http://localhost/')) {
      return url.replace('http://localhost/', API_URL);
    }
    if (url.startsWith('/media/')) {
      return API_URL + url.slice(1);
    }
    return url;
  };

  const formatObservationDate = (datetime: string) => {
    const dateObj = new Date(datetime);
    dateObj.setFullYear(dateObj.getFullYear() - 200);
    return dateObj.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!authState.userToken) return null;

  const unlockedDescriptions = speciesDetails?.descriptions?.slice(0, observations.length) || [];

  return (
    <div className="page-background min-h-screen pb-8">
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      {speciesDetails ? (
        <div className="pt-16">
          <div className="flex justify-center mb-4">
            {speciesDetails.illustration_url ? (
              <div className="w-80 h-80 relative">
                <Image
                  src={getImageUrl(speciesDetails.illustration_url)}
                  alt={speciesDetails.display_name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : isGenerating ? (
              <div className="w-80 h-80 flex flex-col items-center justify-center bg-white/30 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" />
                <p className="mt-4 font-old-standard">Sketching the specimen...</p>
              </div>
            ) : null}
          </div>

          <div className="px-6 text-center">
            <h1 className="text-2xl font-special-elite text-nature-brown/90">
              {speciesDetails.display_name}
            </h1>
            <p className="text-sm text-nature-brown/70 mb-2">
              {speciesDetails.scientificNameWithoutAuthor}
            </p>
            {speciesDetails.rarity && (
              <span className={`inline-block px-3 py-1 text-white text-sm rounded ${RARITY_STYLES[speciesDetails.rarity]}`}>
                {speciesDetails.rarity}
              </span>
            )}
          </div>

          <div className="px-6 mt-6 relative">
            {speciesDetails.audio_description && (
              <>
                <button
                  onClick={handlePlayPause}
                  className="absolute top-0 right-6 p-2"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? '⏸' : '▶️'}
                </button>
                <audio
                  ref={audioRef}
                  src={getImageUrl(speciesDetails.audio_description)}
                  onEnded={() => setIsPlaying(false)}
                />
              </>
            )}

            {unlockedDescriptions.map((desc, index) => (
              <p key={index} className="font-special-elite text-sm text-nature-brown/70 mb-4 text-justify">
                {desc.replace('[DATE]', observations[0] ? `On ${formatObservationDate(observations[0].datetime)}` : '')}
              </p>
            ))}

            {isGenerating && unlockedDescriptions.length === 0 && (
              <p className="font-old-standard text-center text-nature-brown/60 py-4">
                I need more time to study this specimen...
              </p>
            )}

            {speciesDetails.descriptions && speciesDetails.descriptions.length > observations.length && (
              <p className="font-old-standard text-center text-nature-brown/60 py-4">
                <strong>1</strong> more observation needed.
              </p>
            )}
          </div>

          {observations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-old-standard text-center mb-4">Observations</h2>
              <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x snap-mandatory">
                {observations.map((obs) => (
                  <div key={obs.id} className="flex-shrink-0 w-40 snap-start">
                    <div
                      className="w-40 h-40 relative rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setPreviewImage(getImageUrl(obs.image))}
                    >
                      <Image
                        src={getImageUrl(obs.image)}
                        alt="Observation"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {obs.location && leafletLoaded && (
                      <div
                        className="w-40 h-24 mt-2 rounded-lg overflow-hidden cursor-pointer relative z-0"
                        onClick={() => setMapModal({ lat: obs.location!.latitude, lng: obs.location!.longitude })}
                      >
                        <MapContainer
                          center={[obs.location.latitude, obs.location.longitude]}
                          zoom={13}
                          scrollWheelZoom={false}
                          dragging={false}
                          zoomControl={false}
                          attributionControl={false}
                          className="h-full w-full pointer-events-none"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[obs.location.latitude, obs.location.longitude]} />
                        </MapContainer>
                      </div>
                    )}
                    <p className="text-xs font-old-standard text-center mt-2 text-nature-brown/60">
                      {formatObservationDate(obs.datetime)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-dark border-t-transparent" />
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
            onClick={() => setPreviewImage(null)}
          >
            ×
          </button>
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] m-4">
            <Image
              src={previewImage}
              alt="Full size observation"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {mapModal && leafletLoaded && (
        <div
          className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center"
          onClick={() => setMapModal(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
            onClick={(e) => { e.stopPropagation(); setMapModal(null); }}
          >
            ×
          </button>
          <div
            className="w-[90vw] h-[80vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <MapContainer
              center={[mapModal.lat, mapModal.lng]}
              zoom={15}
              scrollWheelZoom={true}
              dragging={true}
              zoomControl={true}
              attributionControl={true}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[mapModal.lat, mapModal.lng]} />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SpeciesDetailPage() {
  return (
    <Suspense fallback={<div className="page-background min-h-screen flex items-center justify-center">Loading...</div>}>
      <SpeciesDetailContent />
    </Suspense>
  );
}
