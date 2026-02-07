'use client';

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { api, endpoints } from '@/lib/api';
import { AVATAR_PATHS } from '@/lib/avatars';

interface Profile {
  level: number;
  xp: number;
  current_level_xp: number;
  next_level_xp: number;
  observations_count: number;
  species_count: number;
  quiz_count: number;
  quiz_mean_score: number;
  avatar: string | null;
}

interface Badge {
  badge: {
    name: string;
    description: string;
  };
  progress: Record<string, { unlocked: boolean; progress: number }>;
  unlocked_level: string | null;
}

interface ProfileState {
  profile: Profile | null;
  avatar: { full?: string; bubble?: string };
  badges: Badge[];
}

interface ProfileMethods {
  fetchProfile: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  updateAvatarAsync: (avatarName: string) => Promise<void>;
  maybeSelectCharacter: (router: any) => void;
}

interface ProfileContextType {
  profileState: ProfileState;
  profileMethods: ProfileMethods;
}

const UserProfileContext = createContext<ProfileContextType | undefined>(undefined);

type ProfileAction =
  | { type: 'SET_PROFILE'; profile: Profile | null }
  | { type: 'SET_BADGES'; badges: Badge[] };

const profileReducer = (prevState: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...prevState,
        profile: action.profile,
        avatar: action.profile?.avatar ? AVATAR_PATHS[action.profile.avatar] || {} : {},
      };
    case 'SET_BADGES':
      return { ...prevState, badges: action.badges };
    default:
      return prevState;
  }
};

const initialState: ProfileState = {
  profile: null,
  avatar: {},
  badges: [],
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profileState, dispatch] = useReducer(profileReducer, initialState);

  const profileMethods = useMemo<ProfileMethods>(
    () => ({
      fetchProfile: async () => {
        try {
          const response = await api.get(endpoints.profile.get);
          dispatch({ type: 'SET_PROFILE', profile: response.data });
        } catch (error) {
          console.error(error);
          dispatch({ type: 'SET_PROFILE', profile: null });
        }
      },
      fetchBadges: async () => {
        try {
          const response = await api.get(endpoints.badges);
          dispatch({ type: 'SET_BADGES', badges: response.data });
        } catch (error) {
          console.error(error);
        }
      },
      updateAvatarAsync: async (avatarName: string) => {
        const formData = new FormData();
        formData.append('avatar', avatarName);
        const response = await api.patch(endpoints.profile.update, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch({ type: 'SET_PROFILE', profile: response.data });
      },
      maybeSelectCharacter: (router: any) => {
        if (profileState.profile !== null && !profileState.profile.avatar) {
          router.replace('/character');
        }
      },
    }),
    [profileState.profile]
  );

  return (
    <UserProfileContext.Provider value={{ profileState, profileMethods }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
