/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

interface AddSuggestionProps {
    manualSuggestions: string[];
    setManualSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddSuggestion: React.FC<AddSuggestionProps> = ({ manualSuggestions, setManualSuggestions }) => {
    const [newSuggestion, setNewSuggestion] = useState('');

    const handleAddSuggestion = () => {
        if (newSuggestion) {
        setManualSuggestions([...manualSuggestions, newSuggestion]);
        setNewSuggestion('');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box textAlign="center" mt={5}>
                <Typography variant="h4" gutterBottom>
                    Add Your Own Suggestion
                </Typography>
                <Box mt={3}>
                    <TextField
                    label="Enter suggestion"
                    variant="outlined"
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddSuggestion} style={{ marginLeft: '10px' }}>
                    Add Suggestion
                    </Button>
                </Box>
                {manualSuggestions.length > 0 && (
                    <Box mt={5}>
                    <Typography variant="h6">Your Suggestions:</Typography>
                    {manualSuggestions.map((suggestion, index) => (
                        <Paper key={index} elevation={3} style={{ padding: '10px', marginTop: '10px' }}>
                        {suggestion}
                        </Paper>
                    ))}
                </Box>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default AddSuggestion;
