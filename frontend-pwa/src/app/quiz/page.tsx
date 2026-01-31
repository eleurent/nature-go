'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';

export default function QuizPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { quizState, quizMethods } = useQuiz();

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
  }, [authState.userToken]);

  const handleStartQuiz = async () => {
    await quizMethods.fetchQuiz();
    router.push('/quiz/question?id=0');
  };

  if (!authState.userToken) return null;

  return (
    <div className="page-background min-h-screen flex flex-col">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-old-standard tracking-wider text-center mb-6">
          UNIVERSITY
        </h1>

        <p className="font-old-standard text-lg text-center text-nature-brown/70 max-w-md mb-12">
          Test your knowledge of the species you have observed. Answer questions
          correctly to earn experience points and level up!
        </p>

        <button
          onClick={handleStartQuiz}
          className="btn-primary text-2xl py-4 px-12"
        >
          Start Examination
        </button>

        <div className="mt-12 text-center">
          <p className="font-old-standard text-sm text-nature-brown/50">
            Questions are generated from species you have discovered.
          </p>
          <p className="font-old-standard text-sm text-nature-brown/50">
            Discover more species to unlock more questions!
          </p>
        </div>
      </div>
    </div>
  );
}
