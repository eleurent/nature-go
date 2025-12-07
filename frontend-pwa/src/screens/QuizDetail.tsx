import React from 'react';
import { Container, Typography, IconButton, Box, Paper, List, ListItem, ListItemText, Button, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';
const QUIZ_GET_URL = API_URL + 'api/university/quiz/get_or_create/';

interface Question {
    id: number;
    species: number;
    species_name: string;
    text: string;
    choices: string[]; // JSON string? Or array? Need to check structure.
}

interface Quiz {
    id: number;
    multiple_choice_questions: Question[];
    // Add other fields if necessary
}

// Roman numeral helper
const toRomanNumeral = (num: number) => {
    const lookup: [string, number][] = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
        ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
        ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
    ];
    return lookup.reduce((acc, [k, v]) => {
        while (num >= v) {
            acc += k;
            num -= v;
        }
        return acc;
    }, '');
};

export default function QuizDetail() {
  const navigate = useNavigate();

  const { data: quiz, isLoading, error } = useQuery<Quiz>({
    queryKey: ['quiz'],
    queryFn: async () => {
      const response = await axios.get(QUIZ_GET_URL);
      return response.data;
    }
  });

  const uniqueSpecies = React.useMemo(() => {
    if (!quiz?.multiple_choice_questions) return [];
    // Deduplicate based on species ID
    const speciesMap = new Map();
    quiz.multiple_choice_questions.forEach(q => {
        if (!speciesMap.has(q.species)) {
            speciesMap.set(q.species, { species: q.species, species_name: q.species_name });
        }
    });
    return Array.from(speciesMap.values());
  }, [quiz]);

  const hasQuiz = uniqueSpecies.length > 0;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4, minHeight: '90vh' }}>
       <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16 }}>
          <ArrowBackIcon />
        </IconButton>

      <Paper
        elevation={0}
        sx={{
            p: 4,
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2px solid #5a4a42', // Double border simulated with outline if needed
            backgroundImage: 'url(/assets/images/page-background-2.png)',
            backgroundSize: 'cover',
            minHeight: '80vh',
            position: 'relative'
        }}
      >
           {/* Border box inside */}
           <Box sx={{
               border: '1.5px solid #5a4a42',
               width: '100%',
               height: '100%',
               p: 2,
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center'
           }}>
                <Typography variant="h5" align="center" sx={{ fontFamily: '"Old Standard TT", serif', letterSpacing: 2, fontWeight: 700, mt: 4 }}>
                    UNIVERSITY OF OXFORD
                </Typography>

                <Box component="img" src="/assets/images/separator.png" sx={{ width: 200, my: 2 }} />

                <Typography variant="h6" align="center" sx={{ fontFamily: '"Old Standard TT", serif', letterSpacing: 2 }}>
                    EXAMINATION PAPERS
                </Typography>
                <Typography variant="caption" align="center" sx={{ fontFamily: '"Old Standard TT", serif', fontSize: '1.1rem' }}>
                    FOR THE YEAR {new Date().getFullYear() - 200},
                </Typography>

                <Box component="img" src="/assets/images/separator.png" sx={{ width: 200, my: 2 }} />

                <Typography variant="h4" align="center" sx={{ fontFamily: '"Old Standard TT", serif', my: 2 }}>
                    Syllabus
                </Typography>

                {isLoading && <CircularProgress sx={{ mt: 4 }} />}

                {!isLoading && hasQuiz && (
                    <List sx={{ width: '100%', mt: 2 }}>
                        {uniqueSpecies.map((s, index) => (
                             <ListItem key={s.species} disablePadding sx={{ mb: 2 }}>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            align="center"
                                            sx={{
                                                fontFamily: '"Old Standard TT", serif',
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => navigate(`/species/${s.species}`)} // Assuming detail view exists
                                        >
                                            {toRomanNumeral(index + 1)}. {s.species_name}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                {!isLoading && !hasQuiz && (
                    <Typography variant="body1" align="center" sx={{ mt: 10, fontFamily: '"Tinos", serif', fontStyle: 'italic', px: 4 }}>
                         Before exam season starts, I should take a field trip and gather observations.
                    </Typography>
                )}

                <Box sx={{ mt: 'auto', mb: 4, width: '100%' }}>
                     <Button
                        variant="contained"
                        fullWidth
                        disabled={!hasQuiz}
                        onClick={() => navigate('/quiz/0')} // Start at question index 0
                        sx={{
                            bgcolor: '#5a4a42',
                            color: '#fff',
                            borderRadius: 0,
                            fontFamily: '"Special Elite", cursive',
                            fontSize: '1.2rem',
                            '&:hover': { bgcolor: '#3e332e' }
                        }}
                     >
                         Take the exam
                     </Button>
                </Box>
           </Box>
      </Paper>
    </Container>
  );
}
