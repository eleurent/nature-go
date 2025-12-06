import React, { useEffect } from 'react';
import { Container, Typography, IconButton, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Get API URL from environment variable or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

interface Species {
    id: number;
    display_name: string;
    illustration_url: string;
    rarity: string;
}

const rarityColors: Record<string, string> = {
    'Very Common': '#333',
    'Common': '#333',
    'Uncommon': '#070',
    'Rare': '#05f',
    'Legendary': '#e60',
};

export default function SpeciesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  // If no type is provided, we should probably redirect or show an error
  // For now, let's just assume it's provided or handle it gracefully

  const { data: speciesList, isLoading, error } = useQuery<Species[]>({
      queryKey: ['species', type],
      queryFn: async () => {
          if (!type) return [];
          const response = await axios.get(`${API_URL}api/species/${type}/`);
          // Fix image URLs if they are relative or pointing to localhost incorrectly
          // The backend might return http://localhost/media/... which works if proxied,
          // but if we are on a device we might need to swap the host.
          // For PWA dev, it should likely work or we rely on the proxy.
          // The original app did: image_url.replace('http://localhost/', API_URL)

          return response.data.map((s: any) => ({
              ...s,
              illustration_url: s.illustration_url ? s.illustration_url.replace('http://localhost/', API_URL) : null
          }));
      },
      enabled: !!type
  });


  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3" color="primary.dark" sx={{ fontFamily: '"Old Standard TT", serif' }}>
            {type === 'plant' ? 'Botany' : type === 'bird' ? 'Ornithology' : 'Collection'}
        </Typography>
      </Box>

      {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress color="primary" />
          </Box>
      )}

      {error && (
          <Typography color="error" align="center">Failed to load species. Please try again.</Typography>
      )}

      {!isLoading && !error && speciesList && speciesList.length === 0 && (
          <Box sx={{ mt: 10, textAlign: 'center' }}>
               <Typography variant="h4" sx={{ fontFamily: '"Old Standard TT", serif' }}>
                   I haven't found anything yet.
               </Typography>
               <Typography variant="h5" sx={{ fontFamily: '"Old Standard TT", serif', mt: 2 }}>
                   Time to do some fieldwork!
               </Typography>
          </Box>
      )}

      {!isLoading && !error && speciesList && speciesList.length > 0 && (
          <>
            <Typography align="center" variant="h5" sx={{ fontFamily: '"Old Standard TT", serif', mb: 4 }}>
                {speciesList.length} species discovered.
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {speciesList.map((s) => (
                    <Grid item key={s.id}>
                        <Paper
                            elevation={0}
                            sx={{
                                width: 165,
                                height: 180,
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: 'transparent',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.2s'
                                }
                            }}
                            onClick={() => navigate(`/species/${s.id}`)} // Route not implemented yet, but good for future
                        >
                            <Box
                                component="img"
                                src={s.illustration_url}
                                sx={{ width: 120, height: 120, objectFit: 'contain' }}
                                loading="lazy"
                            />
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    fontFamily: '"Special Elite", cursive',
                                    mt: 1,
                                    color: rarityColors[s.rarity] || '#333'
                                }}
                            >
                                {s.display_name}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
          </>
      )}
    </Container>
  );
}
