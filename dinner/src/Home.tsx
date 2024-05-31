/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

import Result from './Result';
import AddSuggestion from './AddSuggestion';

import axios from 'axios';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';
import Settings from './Settings';
import Help from './Help';
import About from './About';

const theme = createTheme({
  palette: {
    mode: 'light', // Ensure the theme mode is set
  },
});


const Home = () => {

  const [option, setOption] = useState('');
  const [manualSuggestions, setManualSuggestions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [newSuggestion, setNewSuggestion] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tab, setTab] = useState(0);


  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption(e.target.value);
  };

  const handleNewSuggestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSuggestion(event.target.value);
  };

  const handleAddSuggestion = () => {
    if (newSuggestion) {
      setManualSuggestions([...manualSuggestions, newSuggestion]);
      setNewSuggestion('');
    }
  };

  const handleGetSuggestion = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/get-suggestion', {
        option,
        manualSuggestions,
      });
      setSuggestion(response.data.suggestion);
    } catch (error) {
      console.error('Frontend Error: Error fetching suggestion:', error);
      setSuggestion('Frontend: Error fetching suggestion');
    }
  };

  const handleFavorite = async () => {
    if (suggestion && !favorites.includes(suggestion)) {
      try {
        const response = await axios.post('http://localhost:5001/api/add-favorite', { suggestion });
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };
  
  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/favorites');
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };
  
  // Fetch favorites when the component mounts
  React.useEffect(() => {
    fetchFavorites();
  }, []);


  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };


  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return (
          <Box textAlign="center" mt={5}>
            <Typography variant="h3" gutterBottom>
              Where Should I Eat Dinner?
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="dinner-option" name="dinner-option" value={option} onChange={handleOptionChange}>
                <FormControlLabel value="stay-in" control={<Radio />} label="Stay In" />
                <FormControlLabel value="go-out" control={<Radio />} label="Go Out" />
              </RadioGroup>
            </FormControl>
            <Box mt={3}>
              <Button variant="contained" color="secondary" onClick={handleGetSuggestion}>
                Where Should I Eat?
              </Button>
            </Box>
            {suggestion && (
              <Box mt={3}>
                <Result suggestion={suggestion} />
                <Button variant="contained" onClick={handleFavorite} style={{ marginTop: '10px' }}>
                  Favorite
                </Button>
              </Box>
            )}
          </Box>
        );
      case 1:
        return <AddSuggestion manualSuggestions={manualSuggestions} setManualSuggestions={setManualSuggestions} />;
      case 2:
        return (
          <Box textAlign="center" mt={5}>
            <Typography variant="h4" gutterBottom>
              Your Favorites
            </Typography>
            {favorites.length > 0 ? (
              <Box>
                {favorites.map((fav, index) => (
                  <Paper key={index} elevation={3} style={{ padding: '10px', marginTop: '10px' }}>
                    {fav}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="h6">No favorites yet.</Typography>
            )}
          </Box>
        );
      case 3:
        return <Settings />;
      case 4:
        return <Help />;
      case 5:
        return <About />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <AppBar position="fixed">
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Suggest Dinner" />
            <Tab label="Add Your Own Suggestion" />
            <Tab label="Favorites" />
            <Tab label="Settings" />
            <Tab label="Help" />
            <Tab label="About" />
          </Tabs>
        </AppBar>
        {renderTabContent()}
      </Container>
    </ThemeProvider>
  );
};

export default Home;