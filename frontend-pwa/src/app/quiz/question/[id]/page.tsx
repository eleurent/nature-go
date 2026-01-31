'use client';

export function generateStaticParams() {
  return [];
}

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';

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

export default function QuizQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const { authState } = useAuth();
  const { quizState, quizMethods } = useQuiz();
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);

  const questionId = Number(params.id);

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

  const question = quizState.quiz.multiple_choice_questions[questionId];
  const hasSelected = quizState.answers[questionId] !== null;
  const hasAnswered = quizMethods.isQuestionAnswered(quizState, questionId);
  const isCorrect = quizMethods.isAnswerCorrect(quizState, questionId);

  const handleSelectAnswer = (answerId: number) => {
    if (hasAnswered) return;
    quizMethods.selectQuestion(questionId, answerId);
  };

  const handleCheck = async () => {
    if (!hasSelected) return;

    if (!hasAnswered) {
      await quizMethods.answerQuiz(quizState);
      const correct = quizState.quiz!.multiple_choice_questions[questionId].correct_answer === quizState.answers[questionId];
      setFeedback({ text: getRandomFeedback(correct), correct });
    } else if (questionId < quizState.quiz!.multiple_choice_questions.length - 1) {
      setFeedback(null);
      router.push(`/quiz/question/${questionId + 1}`);
    } else {
      router.replace('/quiz/result');
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
            const showCorrect = hasAnswered && question.correct_answer === index;
            const showWrong = hasAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-lg text-left transition-all font-old-standard ${
                  showCorrect
                    ? 'bg-green-100 ring-2 ring-green-500'
                    : showWrong
                    ? 'bg-red-100 ring-2 ring-red-500'
                    : isSelected
                    ? 'bg-nature-dark/20 ring-2 ring-nature-dark'
                    : 'bg-white/70 hover:bg-white'
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8">
          <button
            onClick={handleCheck}
            disabled={!hasSelected}
            className={`w-full max-w-md mx-auto block btn-primary text-xl py-4 ${
              !hasSelected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {buttonLabel.toUpperCase()}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`fixed bottom-0 left-0 right-0 p-6 ${
            feedback.correct ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <div className="flex items-start gap-3 max-w-md mx-auto">
            <span className="text-2xl">{feedback.correct ? '✓' : '✗'}</span>
            <p className={`font-old-standard text-lg ${
              feedback.correct ? 'text-green-700' : 'text-red-700'
            }`}>
              {feedback.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
