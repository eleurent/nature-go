import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

interface BadgeListProps {
    badgeData: any; // Type accurately if possible
}

const BadgeList: React.FC<BadgeListProps> = ({ badgeData }) => {
    if (!badgeData) return null;

    // Assuming badgeData is an object or array of badges.
    // From contexts/UserProfileContext.js, it seems to be fetched from /api/badge/badges/
    // Let's assume it's a list of badge objects or categories.
    // If it's a dict like { category: [badges] }, we need to handle that.
    // For now, let's assume flat list or simple structure.

    // NOTE: The original component uses a FlatList, suggesting an array.

    return (
        <Box sx={{ width: '100%', px: 2 }}>
             <Typography variant="h6" align="center" sx={{ fontFamily: '"Old Standard TT", serif', mb: 2 }}>
                Badges
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {Array.isArray(badgeData) && badgeData.map((badge: any, index: number) => (
                    <Grid item key={index}>
                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                component="img"
                                src={badge.image_url} // Adjust key based on API
                                sx={{ width: 64, height: 64 }}
                            />
                            <Typography variant="caption">{badge.name}</Typography>
                         </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default BadgeList;
