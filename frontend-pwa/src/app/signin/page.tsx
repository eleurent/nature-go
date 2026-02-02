'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInPage() {
  const router = useRouter();
  const { authState, authMethods } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await authMethods.signIn({ username, password });
    setIsLoading(false);
  };

  if (authState.userToken) {
    router.replace('/home');
    return null;
  }

  return (
    <div className="page-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-old-standard tracking-wider text-center mb-8">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block font-old-standard mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-old-standard mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {authState.signInErrorMessage && (
            <p className="text-red-600 font-old-standard text-sm">
              {authState.signInErrorMessage}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary text-xl py-3 mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 font-old-standard">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-nature-dark underline">
            Sign up
          </Link>
        </p>

        <Link
          href="/"
          className="block text-center mt-4 font-old-standard text-nature-brown/60 hover:text-nature-brown"
        >
          ← Back
        </Link>
      </div>
    </div>
  );
}
