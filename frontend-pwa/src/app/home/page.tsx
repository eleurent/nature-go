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

  const categories = [
    { href: '/species?type=bird', imageSrc: '/images/ornithology.png', label: 'ORNITHOLOGY' },
    { href: '#', imageSrc: '/images/entomology.png', label: 'ENTOMOLOGY', disabled: true },
    { href: '/map', imageSrc: '/images/map.png', label: 'MAP' },
    { href: '/quiz', imageSrc: '/images/university.png', label: 'UNIVERSITY' },
    { href: '/species?type=plant', imageSrc: '/images/botany.png', label: 'BOTANY' },
  ];

  const radius = 110;

  return (
    <>
      {/* Background layer - edge to edge */}
      <div className="page-background fixed inset-0" />
      
      {/* Content layer - respects safe areas */}
      <div 
        className="fixed inset-0 overflow-hidden flex flex-col"
        style={{ 
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
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

          <div className="relative w-72 h-72 mt-4">
            {categories.map((cat, index) => {
              const angle = (2 * Math.PI * index) / categories.length - Math.PI / 2;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              return (
                <div
                  key={cat.label}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <CategoryButton {...cat} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 items-end px-4 pb-4">
          <Link href="/profile" className="justify-self-start">
            {profileState.avatar?.bubble ? (
              <Image
                src={profileState.avatar.bubble}
                alt="Profile"
                width={85}
                height={85}
                className="object-contain"
              />
            ) : (
              <div className="w-[85px] h-[85px] rounded-full bg-nature-brown/20 border-2 border-nature-brown/30" />
            )}
          </Link>

          <Link href="/camera" className="category-button justify-self-center">
            <Image
              src="/images/binoculars.png"
              alt="Camera"
              width={80}
              height={80}
              className="rounded-full border-2 border-black"
            />
          </Link>

          <div />
        </div>
      </div>
    </>
  );
}
