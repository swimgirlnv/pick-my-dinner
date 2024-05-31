import React from 'react';
import { Box, Typography } from '@mui/material';

const About: React.FC = () => {
    return (
        <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
            About
        </Typography>
        <Typography variant='body1'>
            This application was created by <a href="https://www.linkedin.com/in/rebecca-waterson-b3b95b21a/" target='_blank'>Becca Waterson</a>.
            After being plagued by indecisiveness about what to have for dinner, Becca decided to let the computer decide for her.
            She created this application to help others who struggle with the same problem.
        </Typography>
        <Typography variant="body1">
            This application helps you decide what to have for dinner. 
            You can get suggestions, add your own, and save your favorites.
        </Typography>
        </Box>
    );
};

export default About;
