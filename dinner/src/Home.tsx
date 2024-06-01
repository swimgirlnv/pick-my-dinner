import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import axios from 'axios';
import Result from './Result';
import AddSuggestion from './AddSuggestion';
import Settings from './Settings';
import Help from './Help';
import About from './About';
import theme from './theme'; // Import the custom theme

const Home: React.FC = () => {
  const [option, setOption] = useState('');
  const [manualSuggestions, setManualSuggestions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [favorites, setFavorites] = useState<{ suggestion: string; type: string }[]>([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    fetchSuggestions();
    fetchFavorites();
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOption(event.target.value);
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/suggestions');
      setManualSuggestions(response.data.manualSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
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

  const handleGetSuggestion = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/get-suggestion', {
        option,
      });
      setSuggestion(response.data.suggestion);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setSuggestion('Error fetching suggestion');
    }
  };

  const handleFavorite = async () => {
    if (suggestion && !favorites.some(fav => fav.suggestion === suggestion)) {
      try {
        const type = option === 'stay-in' ? 'recipe' : 'restaurant';
        const response = await axios.post('http://localhost:5001/api/add-favorite', { suggestion, type });
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

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
            <Typography variant="h5">Restaurants</Typography>
            {favorites.filter(fav => fav.type === 'restaurant').length > 0 ? (
              <Box>
                {favorites.filter(fav => fav.type === 'restaurant').map((fav, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    sx={{ padding: '10px', marginTop: '10px', backgroundColor: theme.palette.customColors.color2 }} // Tea Green background for restaurants
                  >
                    {fav.suggestion}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="h6">No favorite restaurants yet.</Typography>
            )}
            <Typography variant="h5" style={{ marginTop: '20px' }}>Recipes</Typography>
            {favorites.filter(fav => fav.type === 'recipe').length > 0 ? (
              <Box>
                {favorites.filter(fav => fav.type === 'recipe').map((fav, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    sx={{ padding: '10px', marginTop: '10px', backgroundColor: theme.palette.secondary.main }} // Fawn background for recipes
                  >
                    {fav.suggestion}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="h6">No favorite recipes yet.</Typography>
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
      <CssBaseline />
      <Box sx={{ backgroundColor: theme.palette.customColors.color3, minHeight: '100vh' }}> {/* Set site background color */}
        <Container>
          <AppBar position="fixed" sx={{ backgroundColor: theme.palette.customColors.color1 }}> {/* Set top bar color */}
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
      </Box>
    </ThemeProvider>
  );
};

export default Home;
