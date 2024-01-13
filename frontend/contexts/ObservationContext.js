import React, { useReducer } from 'react';
import axios from 'axios';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;

export const ObservationContext = React.createContext();


const initialState = {
    image: null,
    type: 'bird',
    organ: 'whole',
    location: null,
    datetime: null,
    data: null,
};

const observationReducer = (prevState, action) => {
    switch (action.type) {
        case 'SET_IMAGE':
            return {
                ...prevState,
                image: action.image,
            };
        case 'SET_TYPE_OR_ORGAN':
            const obs_type = action.type_or_organ == 'bird' ? 'bird': 'plant';
            const organ = action.type_or_organ == 'bird' ? 'whole' : action.type_or_organ;
            return {
                ...prevState,
                type: obs_type,
                organ: organ,
            };
        case 'SET_LOCATION':
            return {
                ...prevState,
                location: action.location,
            };
        case 'SET_DATETIME':
            return {
                ...prevState,
                datetime: action.datetime,
            };
        case 'SET_DATA':
            return {
                ...prevState,
                data: action.data,
            };
        case 'CLEAR_OBSERVATION':
            return initialState;
    }
};


export const useObservation = () => {
    const [observationState, dispatch] = useReducer(observationReducer, initialState);

    const observationMethods = React.useMemo(
        () => ({
            setObservationImage: (imageBase64) => {
                dispatch({ type: 'SET_IMAGE', image: imageBase64 });
            },
            setObservationTypeOrOrgan: (type_or_organ) => {
                dispatch({ type: 'SET_TYPE_OR_ORGAN', type_or_organ: type_or_organ });
            },
            setObservationLocation: (location) => {
                dispatch({ type: 'SET_LOCATION', location: location });
            },
            setObservationDatetime: (datetime) => {
                dispatch({ type: 'SET_DATETIME', datetime: datetime });
            },
            setObservationData: (data) => {
                dispatch({ type: 'SET_DATA', data: data });
            },
            clearObservation: () => {
                dispatch({ type: 'CLEAR_OBSERVATION' });
            },
        }),
        []
    );

    return { observationState, observationMethods };
};
