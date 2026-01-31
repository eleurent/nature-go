'use client';

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface ObservationState {
  image: string | null;
  datetime: string | null;
  location: Location | null;
}

interface ObservationMethods {
  setObservationImage: (image: string) => void;
  setObservationDatetime: (datetime: string) => void;
  setObservationLocation: (location: Location) => void;
  clearObservation: () => void;
}

interface ObservationContextType {
  observationState: ObservationState;
  observationMethods: ObservationMethods;
}

const ObservationContext = createContext<ObservationContextType | undefined>(undefined);

type ObservationAction =
  | { type: 'SET_IMAGE'; image: string }
  | { type: 'SET_DATETIME'; datetime: string }
  | { type: 'SET_LOCATION'; location: Location }
  | { type: 'CLEAR' };

const observationReducer = (prevState: ObservationState, action: ObservationAction): ObservationState => {
  switch (action.type) {
    case 'SET_IMAGE':
      return { ...prevState, image: action.image };
    case 'SET_DATETIME':
      return { ...prevState, datetime: action.datetime };
    case 'SET_LOCATION':
      return { ...prevState, location: action.location };
    case 'CLEAR':
      return { image: null, datetime: null, location: null };
    default:
      return prevState;
  }
};

const initialState: ObservationState = {
  image: null,
  datetime: null,
  location: null,
};

export function ObservationProvider({ children }: { children: ReactNode }) {
  const [observationState, dispatch] = useReducer(observationReducer, initialState);

  const observationMethods = useMemo<ObservationMethods>(
    () => ({
      setObservationImage: (image: string) => {
        dispatch({ type: 'SET_IMAGE', image });
      },
      setObservationDatetime: (datetime: string) => {
        dispatch({ type: 'SET_DATETIME', datetime });
      },
      setObservationLocation: (location: Location) => {
        dispatch({ type: 'SET_LOCATION', location });
      },
      clearObservation: () => {
        dispatch({ type: 'CLEAR' });
      },
    }),
    []
  );

  return (
    <ObservationContext.Provider value={{ observationState, observationMethods }}>
      {children}
    </ObservationContext.Provider>
  );
}

export function useObservation() {
  const context = useContext(ObservationContext);
  if (!context) {
    throw new Error('useObservation must be used within an ObservationProvider');
  }
  return context;
}
