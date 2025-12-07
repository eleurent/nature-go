import React, { useState } from 'react';
import { Container, Typography, IconButton, Box, Paper, Button, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/';
const QUIZ_UPDATE = (id: number) => API_URL + `api/university/quiz/${id}/`;

interface Question {
    id: number;
    species: number;
    species_name: string;
    text: string;
    image: string; // URL
    choices: string[]; // This might need parsing if it comes as a string from backend
}

interface Quiz {
    id: number;
    multiple_choice_questions: Question[];
    multiplechoiceuseranswer_set: { question: number; user_answer: number; is_correct: boolean }[];
}

export default function QuizQuestion() {
  const navigate = useNavigate();
  const { index } = useParams(); // Index of the question (0, 1, 2...)
  const questionIndex = parseInt(index || '0');
  const queryClient = useQueryClient();

  // Local state for answers before submitting
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ['quiz'],
    queryFn: async () => {
      const response = await axios.get(QUIZ_GET_URL);
       // Ensure image URLs are correct
       const data = response.data;
       if(data.multiple_choice_questions) {
           data.multiple_choice_questions = data.multiple_choice_questions.map((q: any) => ({
               ...q,
               image: q.image ? q.image.replace('http://localhost/', API_URL) : null
           }));
       }
      return data;
    }
  });

  const submitQuizMutation = useMutation({
      mutationFn: async (updatedQuiz: any) => {
          return await axios.put(QUIZ_UPDATE(updatedQuiz.id), updatedQuiz);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['quiz'] });
          navigate('/quiz/result');
      }
  });

  // Handle caching user answers locally in React state or context is tricky without a dedicated context provider.
  // For simplicity, we can use a small local storage or just modify the cached query data if we were using a proper store.
  // But wait, the original app's QuizContext keeps `answers` in state until submission.
  // We can replicate that by reading/writing to a temporary localStorage key 'quiz_answers'.

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
      const saved = localStorage.getItem('quiz_answers');
      return saved ? JSON.parse(saved) : {};
  });

  const handleSelect = (choiceIndex: number) => {
      setSelectedAnswer(choiceIndex);
      const newAnswers = { ...answers, [questionIndex]: choiceIndex };
      setAnswers(newAnswers);
      localStorage.setItem('quiz_answers', JSON.stringify(newAnswers));
  };

  // Initialize selected answer from storage if revisiting
  React.useEffect(() => {
      if (answers[questionIndex] !== undefined) {
          setSelectedAnswer(answers[questionIndex]);
      } else {
          setSelectedAnswer(null);
      }
  }, [questionIndex, answers]);


  if (isLoading || !quiz) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress color="primary" />
          </Box>
      );
  }

  const questions = quiz.multiple_choice_questions;
  const currentQuestion = questions[questionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const handleNext = () => {
      if (isLastQuestion) {
          // Submit
          // Format payload
           const payload = {
               ...quiz,
               multiplechoiceuseranswer_set: questions.map((q, idx) => ({
                   quiz: quiz.id,
                   question: q.id,
                   user_answer: answers[idx]
               })).filter(a => a.user_answer !== undefined)
           };
           submitQuizMutation.mutate(payload);
           localStorage.removeItem('quiz_answers'); // Clear temp storage
      } else {
          navigate(`/quiz/${questionIndex + 1}`);
      }
  };

  const handlePrev = () => {
      if (questionIndex > 0) {
          navigate(`/quiz/${questionIndex - 1}`);
      }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2, mb: 4, display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigate('/university')} sx={{ mr: 1 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontFamily: '"Special Elite", cursive' }}>
                Question {questionIndex + 1} / {totalQuestions}
            </Typography>
       </Box>

       <Paper elevation={3} sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontFamily: '"Old Standard TT", serif', fontWeight: 'bold' }}>
                {currentQuestion.species_name}
            </Typography>

            {currentQuestion.image && (
                <Box
                    component="img"
                    src={currentQuestion.image}
                    sx={{ width: '100%', maxHeight: 250, objectFit: 'contain', mb: 3, border: '1px solid #ccc' }}
                />
            )}

            <Typography variant="body1" align="center" sx={{ fontFamily: '"Old Standard TT", serif', fontSize: '1.2rem', mb: 4 }}>
                {currentQuestion.text}
            </Typography>

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {currentQuestion.choices.map((choice, idx) => (
                    <Button
                        key={idx}
                        variant={selectedAnswer === idx ? "contained" : "outlined"}
                        onClick={() => handleSelect(idx)}
                        sx={{
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            fontFamily: '"Old Standard TT", serif',
                            color: selectedAnswer === idx ? '#fff' : '#333',
                            borderColor: '#5a4a42',
                            bgcolor: selectedAnswer === idx ? '#5a4a42' : 'transparent',
                            '&:hover': {
                                bgcolor: selectedAnswer === idx ? '#3e332e' : 'rgba(90, 74, 66, 0.1)',
                                borderColor: '#5a4a42',
                            }
                        }}
                    >
                        {String.fromCharCode(65 + idx)}. {choice}
                    </Button>
                ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 'auto', pt: 4 }}>
                <Button
                    variant="text"
                    onClick={handlePrev}
                    disabled={questionIndex === 0}
                    sx={{ color: '#5a4a42' }}
                >
                    Previous
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={selectedAnswer === null} // Require answer? Original app allows skipping? Let's require.
                    sx={{ bgcolor: '#2E7D32', color: '#fff' }}
                >
                    {isLastQuestion ? "Submit Exam" : "Next Question"}
                </Button>
            </Box>
       </Paper>
    </Container>
  );
}
