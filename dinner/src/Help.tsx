import React from 'react';
import { Box, Typography } from '@mui/material';

const Help: React.FC = () => {
    return (
        <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
            Help
        </Typography>
        <Typography variant="body1" textAlign={'left'} maxWidth="600px" margin={'auto'}>
        Welcome to Pick My Dinner! This help section is designed to guide you through using 
        the app and provide some documentation on its features and functionality. Whether 
        you're a new user or a returning one, this guide will help you make the most out of the application.
        </Typography>
        <br />
        <Typography variant="h5" gutterBottom>
            Using the App
        </Typography>
        <Typography variant="body1" textAlign={'left'} maxWidth="600px" margin={'auto'}>
            <ol>
                <li>Get a Suggestion:</li>
                <ul>
                    <li>Go to the main screen and select whether you want to "stay-in" or "go-out".</li>
                    <li>Fill in any specific dietary preferences and food type preferences if 
                        you haven’t already set them in your profile.</li>
                    <li>Click the "Get Suggestion" button to receive a meal suggestion based on your preferences.</li>
                </ul>
                <li>Viewing your Favorites:</li>
                <ul>
                    <li>You can view your saved favorites by navigating to the Favorites section.</li>
                    <li>Here you can see all the meals or restaurants you have liked and saved for future reference.</li>
                    <li>You are able to sort both meals and restaurants by the tags you've indicated in either getting or
                        writing a suggestion.
                    </li>
                </ul>
                <li>Adding to Favorites:</li>
                <ul>
                    <li>If you receive a suggestion that you particularly enjoy, you can save it to your favorites.</li>
                    <li>Click the "Favorite" button on the suggestion screen, it will automatically appear in the "Favorites" tab!</li>
                </ul>
            </ol>
        </Typography>
        <br />
        <Typography variant="body1" textAlign={'left'} maxWidth="600px" margin={'auto'}>
        We hope you enjoy using Pick My Dinner! If you have any feedback or suggestions, please let us know. 
        Happy cooking and dining!
        </Typography>

        </Box>
    );
};

export default Help;
