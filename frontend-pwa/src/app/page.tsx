'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { authState } = useAuth();

  useEffect(() => {
    if (authState.userToken) {
      router.replace('/home');
    }
  }, [authState.userToken, router]);

  if (authState.isLoading) {
    return (
      <div className="page-background flex items-center justify-center">
        <div className="animate-pulse text-2xl font-old-standard">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-background flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-old-standard tracking-wider mb-4">
          NATURE GO
        </h1>
        <p className="text-lg font-old-standard text-nature-brown/70 max-w-md mx-auto">
          A wildlife identification game — become a 19th century naturalist
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/signin"
          className="btn-primary text-center text-xl py-3"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="border-2 border-nature-dark text-nature-dark px-6 py-3 rounded font-old-standard hover:bg-nature-dark hover:text-white transition-colors text-center text-xl"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
