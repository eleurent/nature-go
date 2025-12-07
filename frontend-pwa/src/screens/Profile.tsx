import React from 'react';
import { Container, Typography, IconButton, Box, Button, Paper, Grid, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import XPBar from '../components/XPBar';
import BadgeList from '../components/BadgeList';

// API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';
const USER_PROFILE_URL = API_URL + 'api/profile/';
const BADGES_URL = API_URL + 'api/badge/badges/';

const TITLES: Record<number, string> = {
    1: 'Scout',
    2: 'Field Assistant',
    3: 'Apprentice Naturalist',
    4: 'Undergraduate',
    5: 'PhD Candidate',
    6: 'Postdoctoral Fellow',
    7: 'Assistant Professor',
    8: 'Associate Professor',
    9: 'Professor',
    10: 'Distinguished Professor',
};

const getTitle = (level: number) => {
    return TITLES[level] || TITLES[10];
};

interface ProfileData {
    level: number;
    xp: number;
    current_level_xp: number;
    next_level_xp: number;
    observations_count: number;
    species_count: number;
    quiz_count: number;
    quiz_mean_score: number;
    avatar?: string; // e.g. "avatar_1"
}

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: profile, isLoading: isProfileLoading } = useQuery<ProfileData>({
      queryKey: ['profile'],
      queryFn: async () => {
          const res = await axios.get(USER_PROFILE_URL);
          return res.data;
      }
  });

   const { data: badges, isLoading: isBadgesLoading } = useQuery({
      queryKey: ['badges'],
      queryFn: async () => {
          const res = await axios.get(BADGES_URL);
          return res.data;
      }
  });

  const isLoading = isProfileLoading || isBadgesLoading;

  if (isLoading) {
      return (
           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress color="primary" />
          </Box>
      );
  }

  // Construct avatar URL. The backend returns an ID/key like "avatar_1",
  // we need to map it to a static asset path if we have them, or use a default.
  // The original app imports them via require(). We copied assets to public/assets/images/avatars?
  // Let's assume we have them or use a placeholder if not found.
  // NOTE: In the previous steps, we copied `frontend/assets/images/*.png` but NOT subdirectories like `avatars`.
  // I should probably fix that or use a placeholder.
  const avatarUrl = profile?.avatar ? `/assets/images/avatars/${profile.avatar}.png` : '/assets/images/university.png'; // Fallback

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4, minHeight: '90vh' }}>
       <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16 }}>
          <ArrowBackIcon />
        </IconButton>

      <Paper
        elevation={4}
        sx={{
            p: 4,
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundImage: 'url(/assets/images/page-background.png)',
            backgroundSize: 'cover',
            minHeight: '80vh'
        }}
      >
        <Box sx={{ width: '100%', mt: 4, display: 'flex', flexDirection: 'row' }}>
            {/* Avatar Column */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                 <Box
                    component="img"
                    src={avatarUrl}
                    onError={(e: any) => { e.target.src = '/assets/images/university.png'; }} // Fallback
                    sx={{ width: '100%', maxWidth: 150, objectFit: 'contain' }}
                />
            </Box>

            {/* Stats Column */}
            <Box sx={{ flex: 1.2, ml: 2 }}>
                <Typography variant="h5" align="center" sx={{ fontFamily: '"Old Standard TT", serif', fontWeight: 'bold' }}>
                    {getTitle(profile?.level || 1)}
                </Typography>

                <XPBar data={profile || null} />

                <Typography variant="caption" display="block" align="center" sx={{ fontFamily: '"Old Standard TT", serif' }}>
                    {profile ? (profile.xp - profile.current_level_xp) : 0} / {profile ? (profile.next_level_xp - profile.current_level_xp) : 0} XP
                </Typography>

                <Typography variant="h2" align="center" sx={{ fontFamily: '"Old Standard TT", serif', mt: 1 }}>
                    {profile?.level || 0}
                </Typography>
                <Typography variant="caption" display="block" align="center" sx={{ fontFamily: '"Old Standard TT", serif', mt: -1 }}>
                    LEVEL
                </Typography>

                <Box sx={{ mt: 3 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif', fontWeight: 'bold' }}>Major</Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif' }}>Botany</Typography>
                     </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif', fontWeight: 'bold' }}>Observations</Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif' }}>{profile?.observations_count || 0}</Typography>
                     </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif', fontWeight: 'bold' }}>Discovered</Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif' }}>{profile?.species_count || 0}</Typography>
                     </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif', fontWeight: 'bold' }}>Exams</Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif' }}>{profile?.quiz_count || 0}</Typography>
                     </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif', fontWeight: 'bold' }}>Mean Score</Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Old Standard TT", serif' }}>{profile ? (profile.quiz_mean_score * 100).toFixed(0) : 0}%</Typography>
                     </Box>
                </Box>
            </Box>
        </Box>

        <Box component="img" src="/assets/images/separator.png" sx={{ width: 200, my: 3 }} />

        <BadgeList badgeData={badges} />

        <Button
            variant="text"
            onClick={() => {
                logout();
                navigate('/login');
            }}
            sx={{ mt: 'auto', fontFamily: '"Tinos", serif', fontSize: '1.2rem', color: '#333', textTransform: 'none' }}
        >
            Sign out
        </Button>

      </Paper>
    </Container>
  );
}
