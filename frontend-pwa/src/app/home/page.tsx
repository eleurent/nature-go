'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface CategoryButtonProps {
  href: string;
  imageSrc: string;
  label: string;
  disabled?: boolean;
}

function CategoryButton({ href, imageSrc, label, disabled }: CategoryButtonProps) {
  const content = (
    <div className={`category-button ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}>
      <Image
        src={imageSrc}
        alt={label}
        width={100}
        height={100}
        className="category-image"
      />
      <span className="category-label">{label}</span>
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

export default function HomePage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { profileState, profileMethods } = useUserProfile();

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    profileMethods.fetchProfile();
    profileMethods.fetchBadges();
  }, [authState.userToken]);

  useEffect(() => {
    if (profileState.profile) {
      profileMethods.maybeSelectCharacter(router);
    }
  }, [profileState.profile]);

  if (!authState.userToken) {
    return null;
  }

  return (
    <div className="page-background flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center pt-8 px-4">
        <h1 className="text-3xl font-old-standard tracking-widest mb-2">
          CONTENTS.
        </h1>
        <Image
          src="/images/separator.png"
          alt=""
          width={200}
          height={5}
          className="mb-6"
        />

        <div className="flex flex-col gap-4 items-center">
          <div className="flex justify-center gap-4">
            <div className="w-28" />
            <CategoryButton
              href="/species?type=plant"
              imageSrc="/images/botany.png"
              label="BOTANY"
            />
            <div className="w-28" />
          </div>

          <div className="flex justify-center gap-4">
            <CategoryButton
              href="/species?type=bird"
              imageSrc="/images/ornithology.png"
              label="ORNITHOLOGY"
            />
            <div className="w-28" />
            <CategoryButton
              href="#"
              imageSrc="/images/entomology.png"
              label="ENTOMOLOGY"
              disabled
            />
          </div>

          <div className="flex justify-center gap-4">
            <div className="w-28" />
            <CategoryButton
              href="/quiz"
              imageSrc="/images/university.png"
              label="UNIVERSITY"
            />
            <div className="w-28" />
            <CategoryButton
              href="/map"
              imageSrc="/images/map.png"
              label="MAP"
            />
            <div className="w-28" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/profile">
          {profileState.avatar?.bubble && (
            <Image
              src={profileState.avatar.bubble}
              alt="Profile"
              width={85}
              height={85}
              className="object-contain"
            />
          )}
        </Link>
      </div>

      <div className="flex justify-center pb-8">
        <Link href="/camera" className="category-button">
          <Image
            src="/images/binoculars.png"
            alt="Camera"
            width={80}
            height={80}
            className="rounded-full border-2 border-black"
          />
        </Link>
      </div>
    </div>
  );
}
