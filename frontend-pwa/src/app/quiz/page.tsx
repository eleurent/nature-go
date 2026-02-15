'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';

const toRomanNumeral = (num: number): string => {
  const lookup: [string, number][] = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
  ];
  return lookup.reduce((acc, [k, v]) => {
    acc += k.repeat(Math.floor(num / v));
    num = num % v;
    return acc;
  }, '');
};

interface SyllabusSpecies {
  species: number;
  species_name: string;
}

export default function QuizPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { quizState, quizMethods } = useQuiz();

  useEffect(() => {
    if (authState.isLoading) return;
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    quizMethods.fetchQuiz();
  }, [authState.isLoading, authState.userToken]);

  const handleStartQuiz = () => {
    router.push('/quiz/question?id=0');
  };

  if (authState.isLoading || !authState.userToken) return null;

  const syllabusSpecies: SyllabusSpecies[] = quizState.quiz?.multiple_choice_questions
    ?.map(q => ({ species: q.species, species_name: q.species_name }))
    ?.filter((item, index, self) => 
      index === self.findIndex(t => t.species === item.species)
    ) || [];

  const hasQuiz = syllabusSpecies.length > 0;

  return (
    <div className="page-background min-h-screen flex flex-col">
      <button
        onClick={() => router.push('/home')}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="border border-nature-brown p-6 max-w-md w-full">
          <h1 className="text-xl font-old-standard tracking-wider text-center mb-2">
            UNIVERSITY OF OXFORD
          </h1>
          <div className="border-t border-nature-brown/30 my-4" />
          <h2 className="text-lg font-old-standard tracking-widest text-center mb-1">
            EXAMINATION PAPERS
          </h2>
          <p className="text-sm font-old-standard text-center mb-4">
            FOR THE YEAR {new Date().getFullYear() - 200},
          </p>
          <div className="border-t border-nature-brown/30 my-4" />
          <h3 className="text-xl font-old-standard text-center mb-6">
            Syllabus
          </h3>

          {hasQuiz ? (
            <div className="mb-8 space-y-3">
              {syllabusSpecies.map((item, index) => (
                <Link 
                  key={item.species}
                  href={`/species/detail?id=${item.species}`}
                  className="block font-old-standard text-lg underline hover:text-nature-dark"
                >
                  {toRomanNumeral(index + 1)}. {item.species_name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="font-old-standard text-center text-nature-brown/70 mb-8 py-8">
              Before exam season starts, I should take a field trip and gather observations.
            </p>
          )}

          <button
            onClick={handleStartQuiz}
            disabled={!hasQuiz}
            className={`w-full btn-primary text-xl py-3 ${!hasQuiz ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Take the Exam
          </button>
        </div>
      </div>
    </div>
  );
}
