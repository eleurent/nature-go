import React, { useReducer } from 'react';
import axios from 'axios';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/'


export const QuizContext = React.createContext();


const quizReducer = (prevState, action) => {
    let answers = prevState.answers
    switch (action.type) {
        case 'SET_QUIZ':
            answers = [...Array(action.quiz.multiple_choice_questions.length).fill(null)];
            return {
                ...prevState,
                quiz: action.quiz,
                answers: answers,
            };
        case 'SELECT_QUESTION':
            answers[action.question_id] = action.answer_id;
            return {
                ...prevState,
                answers: answers,
            };
    }
};
const initialState = {
    quiz: null,
    answers: {}
};

export const useQuiz = () => {

    const [quizState, dispatch] = useReducer(quizReducer, initialState);

    const quizMethods = React.useMemo(
        () => ({
            getOrCreateQuiz: async (data) => {
                axios.get(QUIZ_GET_URL).then(response => {
                    dispatch({ type: 'SET_QUIZ', quiz: response.data });
                })
            },
            isQuestionSelected: (quizState, question_id, answer_id) => {
                return (quizState.answers[question_id] === answer_id)
            },
            selectQuestion: (question_id, answer_id) => {
                dispatch({ type: 'SELECT_QUESTION', question_id, answer_id });
            },
        }),
        []
    );

    return { quizState, quizMethods };
};
