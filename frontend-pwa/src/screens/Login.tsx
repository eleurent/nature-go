import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

// Get API URL from environment variable or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

     // Mock login for development/demo
    if (username === 'testuser' && password === 'password') {
         login(username, 'mock-token-for-dev');
         navigate('/');
         return;
    }

    try {
        const response = await axios.post(`${API_URL}api/auth/login/`, {
            username,
            password
        });

        login(username, response.data.token);
        navigate('/');

    } catch (err: any) {
        console.error("Login failed", err);
        setError('Invalid username or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
            padding: 4,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'rotate(-1deg)', // Slight tilt for hand-placed feel
        }}
      >
        <img src="/assets/logo/logo.png" alt="Logo" style={{ height: 64, marginBottom: 16 }} />
        <Typography component="h1" variant="h3" gutterBottom>
          Nature GO
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: 'italic', mb: 3 }}>
             "A Naturalist's Journal"
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Name"
            name="username"
            autoComplete="username"
            autoFocus
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{ style: { fontFamily: '"Special Elite", cursive' } }}
            InputLabelProps={{ style: { fontFamily: '"Old Standard TT", serif' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Secret"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { fontFamily: '"Special Elite", cursive' } }}
            InputLabelProps={{ style: { fontFamily: '"Old Standard TT", serif' } }}
          />
           {error && <Typography color="error" variant="body2" sx={{mt: 1}}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, fontSize: '1.2rem' }}
          >
            Open Journal
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
