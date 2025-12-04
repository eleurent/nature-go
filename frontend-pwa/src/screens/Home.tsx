import React from 'react';
import { Container, Typography, Grid, Paper, IconButton, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <Paper elevation={4} sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

        {/* Decorative header */}
        <Box sx={{ borderBottom: '2px solid #5a4a42', width: '100%', mb: 4, pb: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h2" component="h1" align="center" color="primary.dark">
                Table of Contents
            </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                        onClick={() => navigate('/camera')}
                    >
                        <Box sx={{ border: '2px solid #5a4a42', borderRadius: '50%', p: 2, mb: 1, bgcolor: '#f5f1e8' }}>
                            <CameraAltIcon sx={{ fontSize: 40, color: '#5a4a42' }} />
                        </Box>
                        <Typography variant="h5" align="center">Field Work</Typography>
                        <Typography variant="caption" align="center" sx={{ fontFamily: '"Parisienne", cursive', fontSize: '1.2rem' }}>Capture observations</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                        onClick={() => navigate('/species')}
                    >
                        <Box sx={{ border: '2px solid #5a4a42', borderRadius: '50%', p: 2, mb: 1, bgcolor: '#f5f1e8' }}>
                            <LocalFloristIcon sx={{ fontSize: 40, color: '#2E7D32' }} />
                        </Box>
                         <Typography variant="h5" align="center">Herbarium</Typography>
                         <Typography variant="caption" align="center" sx={{ fontFamily: '"Parisienne", cursive', fontSize: '1.2rem' }}>Your collection</Typography>
                    </Box>
                </Grid>
                 <Grid item xs={6}>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                        onClick={() => navigate('/profile')}
                    >
                        <Box sx={{ border: '2px solid #5a4a42', borderRadius: '50%', p: 2, mb: 1, bgcolor: '#f5f1e8' }}>
                            <AccountCircleIcon sx={{ fontSize: 40, color: '#8b5a2b' }} />
                        </Box>
                         <Typography variant="h5" align="center">Identity</Typography>
                         <Typography variant="caption" align="center" sx={{ fontFamily: '"Parisienne", cursive', fontSize: '1.2rem' }}>Naturalist profile</Typography>
                    </Box>
                </Grid>
                  <Grid item xs={6}>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                         onClick={() => alert("Map feature coming soon!")}
                    >
                         <Box sx={{ border: '2px solid #5a4a42', borderRadius: '50%', p: 2, mb: 1, bgcolor: '#f5f1e8' }}>
                            <MapIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                        </Box>
                         <Typography variant="h5" align="center">Expedition</Typography>
                         <Typography variant="caption" align="center" sx={{ fontFamily: '"Parisienne", cursive', fontSize: '1.2rem' }}>World map</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>

        <Box sx={{ mt: 'auto', width: '100%', borderTop: '1px solid #ccc', pt: 2 }}>
            <Typography align="center" variant="caption" sx={{ fontStyle: 'italic' }}>
                Nature GO - Vol. I
            </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
