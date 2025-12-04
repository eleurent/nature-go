import React from 'react';
import { Container, Typography, IconButton, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock data
const species = [
    { id: 1, name: 'Daisy', latin: 'Bellis perennis', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Bellis_perennis_white_%28aka%29.jpg/640px-Bellis_perennis_white_%28aka%29.jpg', date: '12th May 1893' },
    { id: 2, name: 'Dandelion', latin: 'Taraxacum officinale', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg/640px-Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg', date: '14th May 1893' },
    { id: 3, name: 'Rose', latin: 'Rosa rubiginosa', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Rosa_rubiginosa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-123.jpg/419px-Rosa_rubiginosa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-123.jpg', date: '15th May 1893'}
];

export default function SpeciesList() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3" color="primary.dark">My Herbarium</Typography>
      </Box>

      <Grid container spacing={3}>
          {species.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                  <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: '#fff',
                        transform: `rotate(${Math.random() * 4 - 2}deg)`, // Random tilt
                        transition: 'transform 0.2s',
                        '&:hover': {
                             transform: 'scale(1.02) rotate(0deg)',
                             zIndex: 10
                        }
                    }}
                  >
                        {/* Tape effect */}
                        <Box sx={{
                            width: '30%',
                            height: 25,
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                            border: '1px solid #ccc',
                            position: 'absolute',
                            top: -10,
                            left: '35%',
                            transform: 'rotate(-2deg)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }} />

                      <Box
                        sx={{
                            width: '100%',
                            height: 200,
                            mb: 2,
                            backgroundImage: `url(${s.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '1px solid #eee'
                        }}
                      />
                      <Typography variant="h5" sx={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.8rem' }}>{s.name}</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 1 }}>{s.latin}</Typography>
                      <Typography variant="caption" sx={{ fontFamily: '"Special Elite", cursive' }}>Collected: {s.date}</Typography>
                  </Paper>
              </Grid>
          ))}
      </Grid>
    </Container>
  );
}
