import axios from 'axios';
import { storage } from './storage';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' && process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return window.location.origin + '/';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
};

export const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      storage.remove('userToken');
      delete api.defaults.headers.common.Authorization;
      const path = window.location.pathname;
      if (path !== '/' && path !== '/signin' && path !== '/signup') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

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
    list: 'api/poster/',
    regions: 'api/poster/regions/',
    data: (posterId: string) => `api/poster/${posterId}/`,
  },
};
