import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import theme from './theme';
import { API_BASE_URL } from '../config';


const Home: React.FC = () => {
  const [option, setOption] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [foodTypePreference, setFoodTypePreference] = useState('');
  const [manualSuggestions, setManualSuggestions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [favorites, setFavorites] = useState<{ suggestion: string; type: string; tags: string[] }[]>([]);
  const [filterTag, setFilterTag] = useState<string>('');
  const [tab, setTab] = useState(0);

  useEffect(() => {
    fetchSuggestions();
    fetchFavorites();
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOption(event.target.value as string);
  };

  const handleDietaryPreferenceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDietaryPreference(event.target.value as string);
  };

  const handleFoodTypePreferenceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFoodTypePreference(event.target.value as string);
  };

  const handleFilterTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterTag(event.target.value as string);
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/suggestions`);
      setManualSuggestions(response.data.manualSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/favorites`);
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleGetSuggestion = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/get-suggestion`, {
        option,
        dietaryPreference,
        foodTypePreference
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
        const response = await axios.post(`${API_BASE_URL}/api/add-favorite`, {
          suggestion,
          type,
          tags: [dietaryPreference, foodTypePreference].filter(tag => tag !== '' && tag !== 'any' && tag !== 'none')
        });
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    if (filterTag === '') return true;
    return fav.tags.includes(filterTag);
  });

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return (
          <Box textAlign="center" mt={5}>
            <Typography variant="h3" gutterBottom>
              Where Should I Eat Dinner?
            </Typography>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="option-label">Option</InputLabel>
              <Select
                labelId="option-label"
                id="option"
                value={option}
                onChange={handleOptionChange}
                label="Option"
              >
                <MenuItem value="stay-in">Stay In</MenuItem>
                <MenuItem value="go-out">Go Out</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="dietary-preference-label">Dietary Preference</InputLabel>
              <Select
                labelId="dietary-preference-label"
                id="dietary-preference"
                value={dietaryPreference}
                onChange={handleDietaryPreferenceChange}
                label="Dietary Preference"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                <MenuItem value="halal">Halal</MenuItem>
                <MenuItem value="kosher">Kosher</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="food-type-preference-label">Food Type Preference</InputLabel>
              <Select
                labelId="food-type-preference-label"
                id="food-type-preference"
                value={foodTypePreference}
                onChange={handleFoodTypePreferenceChange}
                label="Food Type Preference"
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="italian">Italian</MenuItem>
                <MenuItem value="chinese">Chinese</MenuItem>
                <MenuItem value="indian">Indian</MenuItem>
                <MenuItem value="mexican">Mexican</MenuItem>
                <MenuItem value="japanese">Japanese</MenuItem>
              </Select>
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
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="filter-tag-label">Filter by Tag</InputLabel>
              <Select
                labelId="filter-tag-label"
                id="filter-tag"
                value={filterTag}
                onChange={handleFilterTagChange}
                label="Filter by Tag"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                <MenuItem value="halal">Halal</MenuItem>
                <MenuItem value="kosher">Kosher</MenuItem>
                <MenuItem value="italian">Italian</MenuItem>
                <MenuItem value="chinese">Chinese</MenuItem>
                <MenuItem value="indian">Indian</MenuItem>
                <MenuItem value="mexican">Mexican</MenuItem>
                <MenuItem value="japanese">Japanese</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h5">Restaurants</Typography>
            {filteredFavorites.filter(fav => fav.type === 'restaurant').length > 0 ? (
              <Box textAlign={'left'}>
                {filteredFavorites.filter(fav => fav.type === 'restaurant').map((fav, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    sx={{ padding: '10px', 
                    marginTop: '10px', 
                    backgroundColor: theme.palette.customColors.color2,
                    whiteSpace: 'pre-wrap',
                    borderRadius: '5px',
                    border: '1px solid #ddd', }}
                  >
                    {fav.suggestion} - Tags: {fav.tags ? fav.tags.join(', ') : 'No Tags'}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="h6">No favorite restaurants yet.</Typography>
            )}
            <Typography variant="h5" style={{ marginTop: '20px' }}>Recipes</Typography>
            {filteredFavorites.filter(fav => fav.type === 'recipe').length > 0 ? (
              <Box textAlign={'left'}>
                {filteredFavorites.filter(fav => fav.type === 'recipe').map((fav, index) => (
                  <Paper
                  key={index}
                  elevation={3}
                  sx={{ padding: '10px', 
                  marginTop: '10px', 
                  backgroundColor: theme.palette.secondary.main,
                  whiteSpace: 'pre-wrap',
                  borderRadius: '5px',
                  border: '1px solid #ddd', }}
                  >
                    {fav.suggestion} - Tags: {fav.tags ? fav.tags.join(', ') : 'No Tags'}
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
      <Box sx={{ backgroundColor: theme.palette.customColors.color3, minHeight: '100vh' }}>
        <Container>
          <AppBar position="fixed" sx={{ backgroundColor: theme.palette.customColors.color1 }}>
            <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
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
