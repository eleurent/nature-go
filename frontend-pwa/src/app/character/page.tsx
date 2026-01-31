'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { AVATAR_PATHS, AVATAR_NAMES } from '@/lib/avatars';

export default function CharacterSelectionPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { profileMethods } = useUserProfile();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authState.userToken) {
      router.replace('/');
    }
  }, [authState.userToken, router]);

  const handleSelectAvatar = async () => {
    if (!selectedAvatar) return;
    
    setIsLoading(true);
    try {
      await profileMethods.updateAvatarAsync(selectedAvatar);
      router.replace('/home');
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !authState.userToken) {
    return null;
  }

  return (
    <div className="page-background min-h-screen flex flex-col items-center py-12 px-6">
      <h1 className="text-3xl font-old-standard tracking-wider mb-2">
        Choose Your Character
      </h1>
      <p className="font-old-standard text-nature-brown/70 mb-8">
        Select the naturalist you wish to become
      </p>

      <div className="grid grid-cols-3 gap-4 max-w-md mb-8">
        {AVATAR_NAMES.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedAvatar(name)}
            className={`relative p-2 rounded-lg transition-all ${
              selectedAvatar === name
                ? 'bg-nature-dark/20 ring-2 ring-nature-dark'
                : 'hover:bg-nature-brown/10'
            }`}
          >
            <Image
              src={AVATAR_PATHS[name].full}
              alt={name}
              width={100}
              height={120}
              className="object-contain"
            />
            {selectedAvatar === name && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-nature-dark rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleSelectAvatar}
        disabled={!selectedAvatar || isLoading}
        className={`btn-primary text-xl py-3 px-12 ${
          !selectedAvatar ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
}
