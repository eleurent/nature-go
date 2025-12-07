import React from 'react';
import { Container, Typography, IconButton, Box, Paper, Button, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/';

export default function QuizResult() {
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz'],
    queryFn: async () => {
      const response = await axios.get(QUIZ_GET_URL);
      return response.data;
    }
  });

  if (isLoading || !quiz) {
       return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress color="primary" />
          </Box>
      );
  }

  const questions = quiz.multiple_choice_questions;
  const answers = quiz.multiplechoiceuseranswer_set;

  // Calculate score
  const correctCount = answers.filter((a: any) => a.is_correct).length;
  const totalCount = questions.length;
  const score = Math.round((correctCount / totalCount) * 100);

  return (
     <Container maxWidth="sm" sx={{ mt: 4, mb: 4, minHeight: '90vh' }}>
        <Paper
            elevation={4}
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '4px double #5a4a42',
                backgroundImage: 'url(/assets/images/page-background.png)',
                backgroundSize: 'cover',
            }}
        >
            <Typography variant="h4" sx={{ fontFamily: '"Old Standard TT", serif', mb: 2 }}>
                Examination Results
            </Typography>

            <Box sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '4px solid',
                borderColor: score >= 50 ? '#2E7D32' : '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
            }}>
                <Typography variant="h3" sx={{ fontFamily: '"Special Elite", cursive', color: score >= 50 ? '#2E7D32' : '#d32f2f' }}>
                    {score}%
                </Typography>
            </Box>

            <Typography variant="h6" align="center" sx={{ fontFamily: '"Tinos", serif', fontStyle: 'italic', mb: 4 }}>
                {score === 100 ? "Outstanding! A true naturalist." :
                 score >= 50 ? "Satisfactory. Continue your studies." :
                 "More fieldwork is required."}
            </Typography>

            <Divider sx={{ width: '100%', mb: 2 }} />

            <List sx={{ width: '100%' }}>
                {questions.map((q: any, index: number) => {
                    const answer = answers.find((a: any) => a.question === q.id);
                    const isCorrect = answer?.is_correct;

                    return (
                        <ListItem key={q.id} divider>
                            <Box sx={{ mr: 2 }}>
                                {isCorrect ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                            </Box>
                            <ListItemText
                                primary={`${index + 1}. ${q.species_name}`}
                                secondary={q.text.substring(0, 50) + "..."}
                                primaryTypographyProps={{ fontFamily: '"Old Standard TT", serif' }}
                            />
                        </ListItem>
                    );
                })}
            </List>

            <Button
                variant="contained"
                onClick={() => navigate('/university')}
                sx={{ mt: 4, bgcolor: '#5a4a42', fontFamily: '"Special Elite", cursive' }}
            >
                Return to University
            </Button>
        </Paper>
     </Container>
  );
}
