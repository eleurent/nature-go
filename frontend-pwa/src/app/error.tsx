'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled page error:', error);
  }, [error]);

  return (
    <div className="page-background min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-old-standard mb-4">An Expedition Mishap</h1>
      <p className="font-old-standard text-nature-brown/70 mb-6 max-w-sm">
        Something unexpected occurred while consulting your field journal.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="btn-primary px-6 py-2">
          Try Again
        </button>
        <Link href="/home" className="btn-secondary px-6 py-2">
          Return Home
        </Link>
      </div>
    </div>
  );
}
