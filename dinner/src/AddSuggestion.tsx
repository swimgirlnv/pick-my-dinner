/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, ThemeProvider, createTheme, Tabs, Tab } from '@mui/material';

const theme = createTheme();

interface AddSuggestionProps {
    restaurantSuggestions: string[];
    setRestaurantSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    ingredientSuggestions: string[];
    setIngredientSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddSuggestion: React.FC<AddSuggestionProps> = ({ 
    restaurantSuggestions, 
    setRestaurantSuggestions, 
    ingredientSuggestions, 
    setIngredientSuggestions 
}) => {
    const [newSuggestion, setNewSuggestion] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);

    const handleAddSuggestion = () => {
        if (newSuggestion) {
            if (selectedTab === 0) {
                setRestaurantSuggestions([...restaurantSuggestions, newSuggestion]);
            } else {
                setIngredientSuggestions([...ingredientSuggestions, newSuggestion]);
            }
            setNewSuggestion('');
        }
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    const renderSuggestions = (suggestions: string[]) => (
        suggestions.length > 0 && (
            <Box mt={5}>
                <Typography variant="h6">Your Suggestions:</Typography>
                {suggestions.map((suggestion, index) => (
                    <Paper key={index} elevation={3} style={{ padding: '10px', marginTop: '10px' }}>
                        {suggestion}
                    </Paper>
                ))}
            </Box>
        )
    );

    return (
        <ThemeProvider theme={theme}>
            <Box textAlign="center" mt={5}>
                <Typography variant="h4" gutterBottom>
                    Add Your Own
                </Typography>
                <Tabs value={selectedTab} onChange={handleTabChange} centered>
                    <Tab label="Restaurants" />
                    <Tab label="Ingredients" />
                </Tabs>
                <Box mt={3}>
                    <TextField
                        label="Enter suggestion"
                        variant="outlined"
                        value={newSuggestion}
                        onChange={(e) => setNewSuggestion(e.target.value)}
                    />
                    <Button 
                        className="animated-button" 
                        variant="contained" 
                        color="primary" 
                        onClick={handleAddSuggestion} 
                        style={{ marginLeft: '10px' }}
                    >
                        Add To List
                    </Button>
                </Box>
                {selectedTab === 0 ? renderSuggestions(restaurantSuggestions) : renderSuggestions(ingredientSuggestions)}
            </Box>
        </ThemeProvider>
    );
};

export default AddSuggestion;
