'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';

export default function QuizResultPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { quizState, quizMethods } = useQuiz();

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    if (!quizState.quiz) {
      router.replace('/quiz');
      return;
    }
  }, [authState.userToken, quizState.quiz]);

  if (!authState.userToken || !quizState.quiz) return null;

  const totalQuestions = quizState.correctAnswers.length;
  const correctCount = quizState.correctAnswers.filter(Boolean).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage === 100) return "Perfect score! You are a true scholar!";
    if (percentage >= 80) return "Excellent work! You've proven your expertise.";
    if (percentage >= 60) return "Good effort! Keep studying and you'll improve.";
    if (percentage >= 40) return "More practice is needed. Return to your studies!";
    return "I'm afraid more research is required. Back to the field!";
  };

  const handleFinish = () => {
    quizMethods.clearQuiz();
    router.replace('/home');
  };

  return (
    <div className="page-background min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-old-standard tracking-wider text-center mb-4">
        EXAMINATION RESULTS
      </h1>

      <div className="my-12 text-center">
        <div className="text-8xl font-old-standard text-nature-dark mb-4">
          {percentage}%
        </div>
        <p className="text-xl font-old-standard">
          {correctCount} out of {totalQuestions} correct
        </p>
      </div>

      <p className="text-xl font-old-standard text-center max-w-md mb-12 text-nature-brown/70">
        {getMessage()}
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handleFinish}
          className="btn-primary text-xl py-3"
        >
          Return Home
        </button>
        <button
          onClick={() => {
            quizMethods.clearQuiz();
            router.replace('/quiz');
          }}
          className="border-2 border-nature-dark text-nature-dark px-6 py-3 rounded font-old-standard text-xl hover:bg-nature-dark hover:text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
