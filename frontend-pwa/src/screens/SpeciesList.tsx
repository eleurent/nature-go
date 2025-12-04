import React from 'react';
import { Container, Typography, IconButton, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock data
const species = [
    { id: 1, name: 'Daisy', latin: 'Bellis perennis', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Bellis_perennis_white_%28aka%29.jpg/640px-Bellis_perennis_white_%28aka%29.jpg' },
    { id: 2, name: 'Dandelion', latin: 'Taraxacum officinale', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg/640px-Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg' },
];

export default function SpeciesList() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Collection</Typography>
      </Box>

      <List>
          {species.map((s) => (
              <ListItem key={s.id} button divider>
                  <ListItemAvatar>
                      <Avatar src={s.image} alt={s.name} variant="rounded"/>
                  </ListItemAvatar>
                  <ListItemText primary={s.name} secondary={s.latin} />
              </ListItem>
          ))}
      </List>
    </Container>
  );
}
