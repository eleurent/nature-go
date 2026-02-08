'use client';

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { api, endpoints } from '@/lib/api';

interface Question {
  id: number;
  question: string;
  choices: string[];
  correct_answer: number;
}

interface Quiz {
  id: number;
  multiple_choice_questions: Question[];
}

interface QuizState {
  quiz: Quiz | null;
  answers: (number | null)[];
  correctAnswers: (boolean | null)[];
}

interface QuizMethods {
  fetchQuiz: () => Promise<void>;
  selectQuestion: (questionId: number, answerId: number) => void;
  answerQuiz: (state: QuizState) => Promise<boolean[] | null>;
  isQuestionSelected: (state: QuizState, questionId: number, answerId: number) => boolean;
  isQuestionAnswered: (state: QuizState, questionId: number) => boolean;
  isAnswerCorrect: (state: QuizState, questionId: number) => boolean;
  clearQuiz: () => void;
}

interface QuizContextType {
  quizState: QuizState;
  quizMethods: QuizMethods;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

type QuizAction =
  | { type: 'SET_QUIZ'; quiz: Quiz }
  | { type: 'SELECT_ANSWER'; questionId: number; answerId: number }
  | { type: 'SET_CORRECT_ANSWERS'; correctAnswers: boolean[] }
  | { type: 'CLEAR' };

const quizReducer = (prevState: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_QUIZ':
      return {
        quiz: action.quiz,
        answers: new Array(action.quiz.multiple_choice_questions.length).fill(null),
        correctAnswers: new Array(action.quiz.multiple_choice_questions.length).fill(null),
      };
    case 'SELECT_ANSWER':
      const newAnswers = [...prevState.answers];
      newAnswers[action.questionId] = action.answerId;
      return { ...prevState, answers: newAnswers };
    case 'SET_CORRECT_ANSWERS':
      return { ...prevState, correctAnswers: action.correctAnswers };
    case 'CLEAR':
      return { quiz: null, answers: [], correctAnswers: [] };
    default:
      return prevState;
  }
};

const initialState: QuizState = {
  quiz: null,
  answers: [],
  correctAnswers: [],
};

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizState, dispatch] = useReducer(quizReducer, initialState);

  const quizMethods = useMemo<QuizMethods>(
    () => ({
      fetchQuiz: async () => {
        try {
          const response = await api.get(endpoints.quiz.random);
          dispatch({ type: 'SET_QUIZ', quiz: response.data });
        } catch (error) {
          console.error('Failed to fetch quiz', error);
        }
      },
      selectQuestion: (questionId: number, answerId: number) => {
        dispatch({ type: 'SELECT_ANSWER', questionId, answerId });
      },
      answerQuiz: async (state: QuizState): Promise<boolean[] | null> => {
        if (!state.quiz) return null;
        try {
          const multiplechoiceuseranswer_set = state.quiz.multiple_choice_questions.map((q, i) => ({
            quiz: state.quiz!.id,
            question: q.id,
            user_answer: state.answers[i],
          })).filter(a => a.user_answer !== null);
          
          const response = await api.patch(endpoints.quiz.update(state.quiz.id), {
            multiplechoiceuseranswer_set,
          });
          
          const correctAnswers = response.data.multiplechoiceuseranswer_set?.map(
            (a: { is_correct: boolean }) => a.is_correct
          ) || [];
          dispatch({ type: 'SET_CORRECT_ANSWERS', correctAnswers });
          return correctAnswers;
        } catch (error) {
          console.error('Failed to submit quiz', error);
          return null;
        }
      },
      isQuestionSelected: (state: QuizState, questionId: number, answerId: number) => {
        return state.answers[questionId] === answerId;
      },
      isQuestionAnswered: (state: QuizState, questionId: number) => {
        return state.correctAnswers?.[questionId] !== undefined && state.correctAnswers[questionId] !== null;
      },
      isAnswerCorrect: (state: QuizState, questionId: number) => {
        return state.correctAnswers?.[questionId] === true;
      },
      clearQuiz: () => {
        dispatch({ type: 'CLEAR' });
      },
    }),
    []
  );

  return (
    <QuizContext.Provider value={{ quizState, quizMethods }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
