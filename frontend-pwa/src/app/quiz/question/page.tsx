'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useHtmlBackground } from '@/lib/useHtmlBackground';

const POSITIVE_FEEDBACK = [
  "Splendid! You've displayed remarkable knowledge!",
  "Capital! You're quite the scholar, I must say.",
  "Bravo! A most commendable response.",
  "Excellent, my dear. You are most astute.",
  "Astonishing! Your erudition shines brightly.",
];

const NEGATIVE_FEEDBACK = [
  "I regret to inform you, that is not quite correct.",
  "Alas, your answer is wide of the mark, I'm afraid.",
  "Oh, dear. That answer does not meet the mark.",
  "I must correct you, my dear. That is erroneous.",
  "I'm afraid your response falls short of our expectations.",
];

function getRandomFeedback(positive: boolean): string {
  const arr = positive ? POSITIVE_FEEDBACK : NEGATIVE_FEEDBACK;
  return arr[Math.floor(Math.random() * arr.length)];
}

function QuizQuestionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authState } = useAuth();
  const { quizState, quizMethods } = useQuiz();
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  useHtmlBackground('2');

  const questionId = Number(searchParams.get('id') || 0);

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    if (!quizState.quiz) {
      router.replace('/quiz');
      return;
    }
  }, [authState.userToken, quizState.quiz, router]);

  if (!authState.userToken || !quizState.quiz) return null;

  const question = quizState.quiz.multiple_choice_questions[questionId];
  if (!question) return null;
  
  const hasSelected = quizState.answers[questionId] !== null;
  const hasAnswered = quizMethods.isQuestionAnswered(quizState, questionId);
  const isCorrect = quizMethods.isAnswerCorrect(quizState, questionId);

  const handleSelectAnswer = (answerId: number) => {
    if (hasAnswered) return;
    quizMethods.selectQuestion(questionId, answerId);
  };

  const handleCheck = async () => {
    if (!hasSelected) return;

    // If feedback is already shown, navigate to next question
    if (feedback) {
      if (questionId < quizState.quiz!.multiple_choice_questions.length - 1) {
        setFeedback(null);
        router.push(`/quiz/question?id=${questionId + 1}`);
      } else {
        router.replace('/quiz/result');
      }
      return;
    }

    // Otherwise, submit the answer
    if (!hasAnswered) {
      const correctAnswers = await quizMethods.answerQuiz(quizState);
      if (correctAnswers) {
        const isRight = correctAnswers[questionId] === true;
        setFeedback({ text: getRandomFeedback(isRight), correct: isRight });
      }
    }
  };

  const buttonLabel = hasSelected
    ? hasAnswered
      ? isCorrect
        ? 'Continue'
        : 'Got it'
      : 'Check'
    : 'Continue';

  return (
    <div className="page-background-2 min-h-screen flex flex-col">
      <button
        onClick={() => router.replace('/quiz')}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ✕
      </button>

      <div className="flex-1 flex flex-col px-6 py-16">
        <div className="text-center mb-8">
          <span className="text-sm font-old-standard text-nature-brown/50">
            Question {questionId + 1} of {quizState.quiz.multiple_choice_questions.length}
          </span>
        </div>

        <h2 className="text-2xl font-old-standard text-center mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3 max-w-md mx-auto w-full">
          {question.choices.map((choice, index) => {
            const isSelected = quizMethods.isQuestionSelected(quizState, questionId, index);
            const correctChoice = quizState.correctChoices?.[questionId];
            const showCorrect = feedback && correctChoice === index;
            const showWrong = feedback && isSelected && !feedback.correct;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-full text-center transition-all font-old-standard border ${
                  showCorrect
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : showWrong
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : isSelected
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white/80 border-gray-300 hover:bg-white'
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {!feedback && (
          <div className="mt-auto pt-8">
            <button
              onClick={handleCheck}
              disabled={!hasSelected}
              className={`w-full max-w-md mx-auto block btn-primary text-xl py-4 rounded-full ${
                !hasSelected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              CHECK
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`fixed bottom-0 left-0 right-0 p-6 pb-10 ${
            feedback.correct ? 'bg-green-100' : 'bg-red-100'
          }`}
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)' }}
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-start gap-3 mb-4">
              <span className={`text-2xl ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                {feedback.correct ? '✓' : '✗'}
              </span>
              <p className={`font-old-standard text-lg font-bold ${
                feedback.correct ? 'text-green-700' : 'text-red-700'
              }`}>
                {feedback.text}
              </p>
            </div>
            <button
              onClick={handleCheck}
              className={`w-full py-4 rounded-full text-white text-xl font-bold ${
                feedback.correct ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isCorrect ? 'CONTINUE' : 'GOT IT'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizQuestionPage() {
  return (
    <Suspense fallback={<div className="page-background-2 min-h-screen flex items-center justify-center">Loading...</div>}>
      <QuizQuestionContent />
    </Suspense>
  );
}
