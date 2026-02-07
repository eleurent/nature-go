import axios from 'axios';

// Use same origin as the page to avoid CORS issues
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
};

export const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const endpoints = {
  auth: {
    login: 'api/auth/login/',
    logout: 'api/auth/logout/',
    register: 'api/auth/register/',
  },
  profile: {
    get: 'api/profile/',
    update: 'api/profile/',
  },
  badges: 'api/badge/badges/',
  species: {
    list: (type: string) => `api/species/${type}/`,
    detail: (id: number) => `api/species/${id}/`,
    observations: (id: number) => `api/species/${id}/observations/`,
    generateDescriptions: (id: number) =>
      `api/species/${id}/generate_descriptions/`,
    generateIllustration: (id: number) =>
      `api/species/${id}/generate_illustration/`,
    generateTransparentIllustration: (id: number) =>
      `api/species/${id}/generate_transparent_illustration/`,
    generateAudioDescription: (id: number) =>
      `api/species/${id}/generate_audio_description/`,
  },
  observations: {
    all: 'api/species/observation/',
    create: 'api/species/observation/',
    update: (id: number) => `api/species/observation/${id}/`,
    delete: (id: number) => `api/species/observation/${id}/delete/`,
  },
  quiz: {
    random: 'api/university/quiz/get_or_create/',
    update: (id: number) => `api/university/quiz/${id}/`,
    generateQuestions: (id: number) =>
      `api/university/quiz/questions/generate/${id}/`,
  },
  poster: {
    regions: 'api/poster/regions/',
    data: (regionId: string) => `api/poster/${regionId}/`,
  },
};
