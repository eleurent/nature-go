'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

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

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    profileMethods.fetchProfile();
    profileMethods.fetchBadges();
  }, [authState.userToken]);

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
                <span className="font-bold">Major</span>
                <span>Botany</span>
              </div>
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
              <div className="flex justify-between">
                <span className="font-bold">Mean exam score</span>
                <span>{profile ? `${Math.round((profile.quiz_mean_score || 0) * 100)}%` : '0%'}</span>
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

        {profileState.badges && profileState.badges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-old-standard text-center mb-4">Badges</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {profileState.badges.map((badge: any) => (
                <div
                  key={badge.id}
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    badge.earned ? 'bg-yellow-100' : 'bg-gray-200 opacity-50'
                  }`}
                  title={badge.name}
                >
                  {badge.icon_url ? (
                    <Image
                      src={badge.icon_url}
                      alt={badge.name}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className="text-2xl">🏅</span>
                  )}
                </div>
              ))}
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
