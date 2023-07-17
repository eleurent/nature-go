import React, { useReducer } from 'react';
import axios from 'axios';
import Constants from 'expo-constants'


const API_URL = Constants.expoConfig.extra.API_URL;
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/';
const QUIZ_UPDATE = (id) => API_URL + `api/university/quiz/${id}/`;


export const QuizContext = React.createContext();


const quizReducer = (prevState, action) => {
    let answers = prevState.answers
    switch (action.type) {
        case 'SET_QUIZ':
            return {
                ...prevState,
                quiz: action.quiz,
            };
        case 'RESET_ANSWERS':
            answers = [...Array(prevState.quiz.multiple_choice_questions.length).fill(null)];
            return {
                ...prevState,
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
            getOrCreateQuiz: async () => {
                axios.get(QUIZ_GET_URL).then(response => {
                    dispatch({ type: 'SET_QUIZ', quiz: response.data });
                    dispatch({ type: 'RESET_ANSWERS' });
                })
            },
            isQuestionSelected: (quizState, question_id, answer_id) => {
                return (quizState.answers[question_id] === answer_id)
            },
            selectQuestion: (question_id, answer_id) => {
                dispatch({ type: 'SELECT_QUESTION', question_id, answer_id });
            },
            answerQuiz: async (quizState) => {
                let quiz = quizState.quiz;
                quiz['multiplechoiceuseranswer_set'] = quiz.multiple_choice_questions.map((question, index) => ({
                    quiz: quiz.id,
                    question: question.id,
                    user_answer: quizState.answers[index]
                }));
                await axios.put(QUIZ_UPDATE(quiz.id), quiz).then(response => {
                    dispatch({ type: 'SET_QUIZ', quiz: response.data });
                })            
            },
        }),
        []
    );

    return { quizState, quizMethods };
};
