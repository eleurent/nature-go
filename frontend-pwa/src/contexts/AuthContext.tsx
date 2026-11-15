'use client';

import axios from 'axios';
import React, { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from 'react';
import { api, endpoints, setAuthToken } from '@/lib/api';
import { storage } from '@/lib/storage';

interface AuthState {
  isLoading: boolean;
  userToken: string | null;
  signInErrorMessage: string | null;
}

interface AuthMethods {
  signIn: (data: { username: string; password: string }) => Promise<void>;
  signOut: () => void;
  signUp: (data: { username: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  clearError: () => void;
}

interface AuthContextType {
  authState: AuthState;
  authMethods: AuthMethods;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_IN_ERROR'; message: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SIGN_OUT' };

const authReducer = (prevState: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return { ...prevState, userToken: action.token, isLoading: false };
    case 'SIGN_IN':
      return { ...prevState, isLoading: false, userToken: action.token, signInErrorMessage: null };
    case 'SIGN_IN_ERROR':
      return { ...prevState, signInErrorMessage: action.message };
    case 'CLEAR_ERROR':
      return { ...prevState, signInErrorMessage: null };
    case 'SIGN_OUT':
      return { ...prevState, isLoading: false, userToken: null, signInErrorMessage: null };
    default:
      return prevState;
  }
};

const initialState: AuthState = {
  isLoading: true,
  userToken: null,
  signInErrorMessage: null,
};

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const messages = Object.entries(data as Record<string, unknown>)
        .flatMap(([, val]) => (Array.isArray(val) ? val : [val]))
        .filter((v): v is string => typeof v === 'string');
      if (messages.length > 0) return messages.join(' ');
    }
    if (error.response?.status === 400) return fallback;
    return error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const authMethods = useMemo<AuthMethods>(
    () => ({
      signIn: async (data) => {
        try {
          const response = await api.post(endpoints.auth.login, {
            username: data.username,
            password: data.password,
          });
          const userToken = response.data.token;
          setAuthToken(userToken);
          storage.set('userToken', userToken);
          dispatch({ type: 'SIGN_IN', token: userToken });
        } catch (error: unknown) {
          console.error('Login error', error);
          const message =
            axios.isAxiosError(error) && error.response?.status === 400
              ? 'Invalid username or password.'
              : extractErrorMessage(error, 'Unable to sign in.');
          dispatch({ type: 'SIGN_IN_ERROR', message });
        }
      },
      signOut: () => {
        api.post(endpoints.auth.logout).catch(() => {});
        setAuthToken(null);
        storage.remove('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        try {
          const response = await api.post(endpoints.auth.register, {
            username: data.username,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
          });
          const userToken = response.data.token;
          setAuthToken(userToken);
          storage.set('userToken', userToken);
          dispatch({ type: 'SIGN_IN', token: userToken });
        } catch (error: unknown) {
          console.error('Registration error', error);
          const message = extractErrorMessage(error, 'Unable to create account.');
          dispatch({ type: 'SIGN_IN_ERROR', message });
        }
      },
      clearError: () => {
        dispatch({ type: 'CLEAR_ERROR' });
      },
    }),
    []
  );

  useEffect(() => {
    const restoreToken = async () => {
      const userToken = storage.get('userToken');
      if (userToken) {
        try {
          await api.get(endpoints.profile.get, {
            headers: { Authorization: `Token ${userToken}` },
          });
          setAuthToken(userToken);
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        } catch {
          storage.remove('userToken');
          dispatch({ type: 'RESTORE_TOKEN', token: null });
        }
      } else {
        dispatch({ type: 'RESTORE_TOKEN', token: null });
      }
    };
    restoreToken();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, authMethods }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
