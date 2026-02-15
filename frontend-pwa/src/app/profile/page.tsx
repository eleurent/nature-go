'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { api, endpoints } from '@/lib/api';
import PosterIcon from '@/components/PosterIcon';

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

function getTitle(level: number): string {
  return TITLES[level] || TITLES[10];
}

export default function ProfilePage() {
  const router = useRouter();
  const { authState, authMethods } = useAuth();
  const { profileState, profileMethods } = useUserProfile();
  const [posters, setPosters] = useState<Poster[]>([]);

  useEffect(() => {
    if (authState.isLoading) return;
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
  }, [authState.isLoading, authState.userToken]); // eslint-disable-line react-hooks/exhaustive-deps

  if (authState.isLoading || !authState.userToken) return null;

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

        {posters.length > 0 && (() => {
          const birdPosters = posters.filter(p => p.type === 'bird');
          const plantPosters = posters.filter(p => p.type === 'plant');

          const renderPoster = (poster: Poster) => (
            <Link
              key={poster.id}
              href={`/poster/detail?id=${poster.id}`}
              className="flex flex-col items-center"
              title={`${poster.name} (${poster.seen_count}/${poster.total_count})`}
            >
              <PosterIcon
                posterId={poster.id}
                posterName={poster.name}
                level={poster.level}
                seenCount={poster.seen_count}
                totalCount={poster.total_count}
                size={48}
              />
            </Link>
          );

          return (
            <div className="mb-8">
              <h3 className="text-xl font-old-standard text-center mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                ❧ Field Guides ❧
              </h3>
              
              {/* Birds Section */}
              <div className="mb-6">
                <h4 className="text-sm font-old-standard text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-stone-300"></span>
                  <span>Birds</span>
                  <span className="flex-1 h-px bg-stone-300"></span>
                </h4>
                <div className="grid grid-cols-5 gap-x-1 gap-y-3 justify-items-center">
                  {birdPosters.map(renderPoster)}
                </div>
              </div>

              {/* Plants Section */}
              <div>
                <h4 className="text-sm font-old-standard text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-stone-300"></span>
                  <span>Plants</span>
                  <span className="flex-1 h-px bg-stone-300"></span>
                </h4>
                <div className="grid grid-cols-5 gap-x-1 gap-y-3 justify-items-center">
                  {plantPosters.map(renderPoster)}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/settings')}
            className="font-tinos text-xl text-nature-brown hover:underline flex items-center justify-center gap-2 mx-auto"
          >
            ⚙ Settings
          </button>
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
