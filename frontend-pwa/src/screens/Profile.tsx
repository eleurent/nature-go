import React from 'react';
import { Container, Typography, IconButton, Box, Button, Paper, Avatar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16 }}>
          <ArrowBackIcon />
        </IconButton>

      <Paper
        elevation={6}
        sx={{
            p: 4,
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '4px double #5a4a42',
            position: 'relative',
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 4, mb: 2 }}>Naturalist Society</Typography>

        <Box sx={{ position: 'relative', mb: 3 }}>
             <Avatar
                sx={{ width: 120, height: 120, border: '2px solid #5a4a42' }}
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            />
            {/* Stamp effect */}
            <Box sx={{
                position: 'absolute',
                bottom: -10,
                right: -20,
                border: '2px solid #c00',
                borderRadius: '50%',
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(-20deg)',
                opacity: 0.7
            }}>
                <Typography variant="caption" sx={{ color: '#c00', fontWeight: 'bold', fontSize: '0.7rem', textAlign: 'center' }}>
                    OFFICIAL<br/>MEMBER
                </Typography>
            </Box>
        </Box>

        <Typography variant="h4" sx={{ fontFamily: '"Dancing Script", cursive', mb: 1 }}>{user}</Typography>
        <Typography variant="body1" sx={{ fontFamily: '"Special Elite", cursive', mb: 3 }}>Rank: Junior Explorer</Typography>

        <Divider sx={{ width: '100%', mb: 3, borderColor: '#5a4a42' }} />

        <Box sx={{ width: '100%', mb: 3 }}>
            <Typography variant="h6" align="center" gutterBottom>Statistics</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">12</Typography>
                    <Typography variant="caption">Species</Typography>
                </Box>
                 <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">5</Typography>
                    <Typography variant="caption">Badges</Typography>
                </Box>
                 <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">3</Typography>
                    <Typography variant="caption">Papers</Typography>
                </Box>
            </Box>
        </Box>

        <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
                logout();
                navigate('/login');
            }}
            sx={{ mt: 2 }}
        >
            Resign Membership (Sign Out)
        </Button>
      </Paper>
    </Container>
  );
}
