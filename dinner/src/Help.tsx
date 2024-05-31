import React from 'react';
import { Box, Typography } from '@mui/material';

const Help: React.FC = () => {
    return (
        <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
            Help
        </Typography>
        <Typography variant="body1">
            Here you can find help and documentation about the application.
        </Typography>
        </Box>
    );
};

export default Help;
