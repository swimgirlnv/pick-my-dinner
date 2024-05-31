import React from 'react';
import { Box, Typography } from '@mui/material';

const Settings: React.FC = () => {
    return (
        
        <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
            Settings
        </Typography>
        <Typography variant="body1">
            Here you can configure your application settings.
        </Typography>
        </Box>
    );
};

export default Settings;
