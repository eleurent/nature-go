'use client';

import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
}

export default function MapClickHandler({ onClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
