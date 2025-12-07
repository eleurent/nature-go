import React from 'react';
import { Box, Typography } from '@mui/material';

interface XPBarProps {
    data: {
        xp: number;
        current_level_xp: number;
        next_level_xp: number;
    } | null;
}

const XPBar: React.FC<XPBarProps> = ({ data }) => {
    if (!data) return null;

    const { xp, current_level_xp, next_level_xp } = data;
    const progress = Math.min(100, Math.max(0, ((xp - current_level_xp) / (next_level_xp - current_level_xp)) * 100));

    return (
        <Box sx={{ width: '100%', height: 10, bgcolor: '#e0e0e0', borderRadius: 5, mt: 1, overflow: 'hidden', border: '1px solid #999' }}>
            <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: '#2E7D32' }} />
        </Box>
    );
};

export default XPBar;
