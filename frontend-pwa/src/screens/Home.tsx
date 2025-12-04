import React from 'react';
import { Container, Typography, Grid, Paper, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Nature GO
      </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper
                        elevation={3}
                        sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/camera')}
                    >
                        <CameraAltIcon fontSize="large" color="primary" />
                        <Typography variant="subtitle1">Capture</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                     <Paper
                        elevation={3}
                        sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/species')}
                    >
                        <ListAltIcon fontSize="large" color="primary" />
                         <Typography variant="subtitle1">Collection</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={6}>
                     <Paper
                        elevation={3}
                        sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/profile')}
                    >
                        <PersonIcon fontSize="large" color="primary" />
                         <Typography variant="subtitle1">Profile</Typography>
                    </Paper>
                </Grid>
                  <Grid item xs={6}>
                     <Paper
                        elevation={3}
                        sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                         onClick={() => alert("Map feature coming soon!")}
                    >
                        <MapIcon fontSize="large" color="primary" />
                         <Typography variant="subtitle1">Map</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </Container>
  );
}
