import React from 'react';
import { Container, Typography, Grid, Paper, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';

// Custom icons based on original assets
// Ideally we would use the actual PNGs, but for now we map them to layout
const MenuIcon = ({ src, alt, size = 100 }: { src: string, alt: string, size?: number }) => (
    <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ width: size, height: size, objectFit: 'contain', mb: 1 }}
    />
);

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <Paper elevation={4} sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', bgcolor: 'transparent', backgroundImage: 'none', boxShadow: 'none' }}>

        {/* Title */}
        <Typography variant="h3" component="h1" align="center" sx={{ fontFamily: '"Old Standard TT", serif', letterSpacing: '0.2em', mt: 4, mb: 2 }}>
            CONTENTS.
        </Typography>

        <Box component="img" src="/assets/images/separator.png" sx={{ width: 200, mb: 4 }} />

        {/* Menu Grid */}
        <Box sx={{ width: '100%', px: 2 }}>

            {/* Row 1: Botany */}
            <Grid container justifyContent="center" sx={{ mb: 4 }}>
                <Grid item>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.9, '&:hover': { opacity: 1 } }}
                        onClick={() => navigate('/species?type=plant')}
                    >
                        <MenuIcon src="/assets/images/botany.png" alt="Botany" />
                        <Typography variant="body1" align="center" sx={{ fontFamily: '"Old Standard TT", serif' }}>BOTANY</Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Row 2: Ornithology & Entomology */}
            <Grid container justifyContent="space-around" sx={{ mb: 4 }}>
                <Grid item>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.9, '&:hover': { opacity: 1 } }}
                        onClick={() => navigate('/species?type=bird')}
                    >
                        <MenuIcon src="/assets/images/ornithology.png" alt="Ornithology" />
                        <Typography variant="body1" align="center" sx={{ fontFamily: '"Old Standard TT", serif' }}>ORNITHOLOGY</Typography>
                    </Box>
                </Grid>
                <Grid item>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default', opacity: 0.4 }}
                    >
                        <MenuIcon src="/assets/images/entomology.png" alt="Entomology" />
                        <Typography variant="body1" align="center" sx={{ fontFamily: '"Old Standard TT", serif' }}>ENTOMOLOGY</Typography>
                    </Box>
                </Grid>
            </Grid>

             {/* Row 3: University & Map */}
            <Grid container justifyContent="space-around" sx={{ mb: 4 }}>
                <Grid item>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.9, '&:hover': { opacity: 1 } }}
                        onClick={() => alert("University feature coming soon!")}
                    >
                         <MenuIcon src="/assets/images/university.png" alt="University" />
                        <Typography variant="body1" align="center" sx={{ fontFamily: '"Old Standard TT", serif' }}>UNIVERSITY</Typography>
                    </Box>
                </Grid>
                <Grid item>
                     <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.9, '&:hover': { opacity: 1 } }}
                        onClick={() => alert("Map feature coming soon!")}
                    >
                        <MenuIcon src="/assets/images/map.png" alt="Map" />
                        <Typography variant="body1" align="center" sx={{ fontFamily: '"Old Standard TT", serif' }}>MAP</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>

        {/* Footer: Profile & Camera */}
        <Box sx={{ mt: 'auto', width: '100%', position: 'relative', height: 100 }}>
             <Box
                sx={{ position: 'absolute', bottom: 10, left: 10, cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
            >
                {/* Placeholder for avatar bubble, ideally fetched from profile */}
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#ddd', border: '2px solid black' }} />
            </Box>

            <Box
                sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', cursor: 'pointer' }}
                onClick={() => navigate('/camera')}
            >
                 <Box
                    component="img"
                    src="/assets/images/binoculars.png"
                    sx={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid black', bgcolor: '#fff' }}
                 />
            </Box>
        </Box>
      </Paper>
    </Container>
  );
}
