import React from 'react';
import { Container, Typography, IconButton, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Profile</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          {/* Avatar placeholder */}
          <Box sx={{ width: 100, height: 100, borderRadius: '50%', bgcolor: 'grey.300', mb: 2 }} />
          <Typography variant="h6">Naturalist</Typography>
          <Typography variant="body2" color="text.secondary">{user}</Typography>
      </Box>

      <Button variant="outlined" color="error" fullWidth onClick={() => {
          logout();
          navigate('/login');
      }}>
          Sign Out
      </Button>
    </Container>
  );
}
