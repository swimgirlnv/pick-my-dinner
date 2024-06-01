import React from 'react';
import { Box, Typography } from '@mui/material';

const About: React.FC = () => {
    return (
        <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
            About
        </Typography>
        <Box textAlign="left" maxWidth="600px" margin="auto">
            <Typography variant='body1'>
                This application was created by <a href="https://www.linkedin.com/in/rebecca-waterson-b3b95b21a/" target='_blank'>Becca Waterson</a>.
                After being plagued by indecisiveness about what to have for dinner, Becca decided to let the computer decide for her.
                She created this application to help others who struggle with the same problem.
            </Typography>
            <br />
            <Typography variant="body1">
                This application helps you decide what to have for dinner. 
                You can get suggestions, add your own, and save your favorites.
            </Typography>
        </Box>
        <br />
        <Typography variant="h4" gutterBottom> Disclaimer </Typography>
        <Box textAlign="left" maxWidth="600px" margin="auto">
            <Typography variant='body1'>
                This application is for entertainment purposes only. 
                The creator of this application is not responsible for any decisions made based on the suggestions provided.
            </Typography>
            <br />
            <Typography variant='body1'>
                Please note that the recipes and suggestions provided on this website are generated by an artificial 
                intelligence and have not been tested or verified by human experts. As such, the accuracy, quality, 
                and safety of these recipes cannot be guaranteed. We encourage you to use your own judgment and 
                discretion when preparing and consuming any suggested meals. If you have any dietary restrictions, 
                allergies, or health concerns, please consult with a qualified health professional before trying new 
                recipes. Enjoy cooking and bon appétit, but remember to take these suggestions with a grain of salt!
            </Typography>
        </Box>
        </Box>
    );
};

export default About;
