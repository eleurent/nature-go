'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationState {
  location: LocationCoords | null;
  isLoading: boolean;
  error: string | null;
}

interface LocationContextValue {
  locationState: LocationState;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: true,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ location: null, isLoading: false, error: 'Geolocation not supported' });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          isLoading: false,
          error: null,
        });
      },
      (err) => {
        console.error('Geolocation error:', err.message);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <LocationContext.Provider value={{ locationState: state, refreshLocation: requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
