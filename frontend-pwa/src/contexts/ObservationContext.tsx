'use client';

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface IdentificationResult {
  species: {
    id: number;
    commonNames: string[];
    scientificNameWithoutAuthor: string;
  };
  confidence: number;
}

interface ObservationData {
  id: number;
  type: string;
  species: number | null;
  xp?: {
    xp_gained: number;
    total_xp: number;
    level: number;
  };
  identification_response?: {
    results: IdentificationResult[];
  };
}

interface ObservationState {
  image: string | null;
  datetime: string | null;
  location: Location | null;
  type: 'bird' | 'plant';
  organ: 'whole' | 'leaf' | 'flower';
  data: ObservationData | null;
}

interface ObservationMethods {
  setObservationImage: (image: string) => void;
  setObservationDatetime: (datetime: string) => void;
  setObservationLocation: (location: Location) => void;
  setObservationTypeOrOrgan: (typeOrOrgan: string) => void;
  setObservationData: (data: ObservationData) => void;
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
  | { type: 'SET_TYPE_OR_ORGAN'; typeOrOrgan: string }
  | { type: 'SET_DATA'; data: ObservationData }
  | { type: 'CLEAR' };

const observationReducer = (prevState: ObservationState, action: ObservationAction): ObservationState => {
  switch (action.type) {
    case 'SET_IMAGE':
      return { ...prevState, image: action.image };
    case 'SET_DATETIME':
      return { ...prevState, datetime: action.datetime };
    case 'SET_LOCATION':
      return { ...prevState, location: action.location };
    case 'SET_TYPE_OR_ORGAN': {
      const obsType = action.typeOrOrgan === 'bird' ? 'bird' : 'plant';
      const organ = action.typeOrOrgan === 'bird' ? 'whole' : action.typeOrOrgan;
      return { 
        ...prevState, 
        type: obsType as 'bird' | 'plant',
        organ: organ as 'whole' | 'leaf' | 'flower'
      };
    }
    case 'SET_DATA':
      return { ...prevState, data: action.data };
    case 'CLEAR':
      return { 
        image: null, 
        datetime: null, 
        location: null, 
        type: 'bird', 
        organ: 'whole',
        data: null
      };
    default:
      return prevState;
  }
};

const initialState: ObservationState = {
  image: null,
  datetime: null,
  location: null,
  type: 'bird',
  organ: 'whole',
  data: null,
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
      setObservationTypeOrOrgan: (typeOrOrgan: string) => {
        dispatch({ type: 'SET_TYPE_OR_ORGAN', typeOrOrgan });
      },
      setObservationData: (data: ObservationData) => {
        dispatch({ type: 'SET_DATA', data });
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
