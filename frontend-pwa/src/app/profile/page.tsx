'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { api, endpoints } from '@/lib/api';

interface Poster {
  id: string;
  name: string;
  icon: string;
  type: string;
  seen_count: number;
  total_count: number;
  level: string | null;
}

const TITLES: Record<number, string> = {
  1: 'Scout',
  2: 'Field Assistant',
  3: 'Apprentice Naturalist',
  4: 'Undergraduate',
  5: 'PhD Candidate',
  6: 'Postdoctoral Fellow',
  7: 'Assistant Professor',
  8: 'Associate Professor',
  9: 'Professor',
  10: 'Distinguished Professor',
};

const LEVEL_COLORS: Record<string, string> = {
  'Gold': 'bg-yellow-400 ring-2 ring-yellow-600',
  'Silver': 'bg-gray-300 ring-2 ring-gray-500',
  'Bronze': 'bg-amber-600 ring-2 ring-amber-800',
};

function getTitle(level: number): string {
  return TITLES[level] || TITLES[10];
}

export default function ProfilePage() {
  const router = useRouter();
  const { authState, authMethods } = useAuth();
  const { profileState, profileMethods } = useUserProfile();
  const [posters, setPosters] = useState<Poster[]>([]);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    profileMethods.fetchProfile();

    const fetchPosters = async () => {
      try {
        const response = await api.get(endpoints.poster.list);
        setPosters(response.data);
      } catch (error) {
        console.error('Failed to fetch posters:', error);
      }
    };
    fetchPosters();
  }, [authState.userToken]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!authState.userToken) return null;

  const profile = profileState.profile;
  const xpProgress = profile
    ? ((profile.xp - profile.current_level_xp) / (profile.next_level_xp - profile.current_level_xp)) * 100
    : 0;

  return (
    <div className="page-background min-h-screen pb-8">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="pt-20 px-6">
        <div className="flex gap-6">
          <div className="w-40 flex-shrink-0">
            {profileState.avatar?.full && (
              <Image
                src={profileState.avatar.full}
                alt="Avatar"
                width={160}
                height={200}
                className="object-contain"
              />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-old-standard mb-2">
              {profile ? getTitle(profile.level) : 'Loading...'}
            </h2>

            <div className="mb-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-nature-dark transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-sm font-old-standard mt-1">
                {profile ? `${profile.xp - profile.current_level_xp} / ${profile.next_level_xp - profile.current_level_xp} XP` : '0 / 0 XP'}
              </p>
            </div>

            <div className="text-center mb-4">
              <span className="text-5xl font-old-standard">{profile?.level || 0}</span>
              <p className="text-sm font-old-standard text-nature-brown/60">LEVEL</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-bold">Observations made</span>
                <span>{profile?.observations_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Species discovered</span>
                <span>{profile?.species_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Exams taken</span>
                <span>{profile?.quiz_count || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-8">
          <Image
            src="/images/separator.png"
            alt=""
            width={200}
            height={10}
          />
        </div>

        {posters.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-old-standard text-center mb-4">Posters</h3>
            <div className="grid grid-cols-4 gap-3">
              {posters.map((poster) => {
                const bgColor = poster.level ? LEVEL_COLORS[poster.level] : 'bg-gray-200';
                return (
                  <Link
                    key={poster.id}
                    href={`/poster/detail?id=${poster.id}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-lg flex items-center justify-center bg-nature-tan/50 ${
                        poster.level === 'Gold' ? 'ring-2 ring-yellow-500' :
                        poster.level === 'Silver' ? 'ring-2 ring-gray-400' :
                        poster.level === 'Bronze' ? 'ring-2 ring-amber-600' :
                        'ring-1 ring-gray-300'
                      } ${!poster.level ? 'opacity-60' : ''}`}
                      title={`${poster.name} (${poster.seen_count}/${poster.total_count})`}
                    >
                      <span className="text-2xl">{poster.icon}</span>
                    </div>
                    <span className="text-xs font-old-standard text-center mt-1 line-clamp-2">
                      {poster.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => authMethods.signOut()}
            className="font-tinos text-xl text-nature-brown hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
