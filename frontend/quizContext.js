import React, { useReducer } from 'react';
import axios from 'axios';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/'


export const QuizContext = React.createContext();


const quizReducer = (prevState, action) => {
    switch (action.type) {
        case 'SET_QUIZ':
            return {
                ...prevState,
                quiz: action.quiz,
            };
    }
};
const initialState = {
    quiz: null,
    answers: null
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
        }),
        []
    );

    return { quizState, quizMethods };
};

