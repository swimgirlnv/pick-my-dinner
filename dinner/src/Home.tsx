import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import Result from './Result';
import AddSuggestion from './AddSuggestion';
import Settings from './Settings';
import Help from './Help';
import About from './About';
import theme from './theme';
import { API_BASE_URL } from '../config';
import Footer from './Footer';

const Home: React.FC = () => {
  const [option, setOption] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [foodTypePreference, setFoodTypePreference] = useState('');
  const [healthiness, setHealthiness] = useState('');
  const [numServings, setNumServings] = useState('');
  const [customPreferences, setCustomPreferences] = useState('');
  const [searchRadius, setSearchRadius] = useState(5000); // Default radius in meters
  const [restaurantSuggestions, setRestaurantSuggestions] = useState<string[]>([]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [favorites, setFavorites] = useState<{ suggestion: string; type: string; tags: string[] }[]>([]);
  const [filterTag, setFilterTag] = useState<string>('');
  const [tab, setTab] = useState(0);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [includeIngredients, setIncludeIngredients] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSuggestions();
    fetchFavorites();
    getLocation();
  }, []);

  useEffect(() => {
    if (suggestion && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [suggestion]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Error getting location. Please ensure location services are enabled. Without location services, the "go-out" feature will not work.');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOption(event.target.value as string);
  };

  const handleDietaryPreferenceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDietaryPreference(event.target.value as string);
  };

  const handleFoodTypePreferenceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFoodTypePreference(event.target.value as string);
  };

  const handleHealthinessChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setHealthiness(event.target.value as string);
  };

  const handleNumServingsChange = (event: React.ChangeEvent<{ value: string }>) => {
    setNumServings(event.target.value);
  };

  const handleCustomPreferencesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCustomPreferences(event.target.value as string);
  };

  const handleSearchRadiusChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchRadius(parseInt(event.target.value, 10));
  };

  const handleFilterTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterTag(event.target.value as string);
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/suggestions`);
      setRestaurantSuggestions(response.data.restaurantSuggestions || []);
      setIngredientSuggestions(response.data.ingredientSuggestions || []);
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
    if (!location && option === 'go-out') {
      alert('Location data is required for "go-out" suggestions. Please enable location services.');
      return;
    }
    setIsLoading(true);
    try {
      const requestData = includeIngredients && option === 'stay-in' ? 
        {
          option,
          ingredients: ingredientSuggestions,
          numServings,
        } : 
        {
          option,
          dietaryPreference,
          foodTypePreference,
          healthiness,
          numServings,
          customPreferences,
          searchRadius,
          location,
          restaurantSuggestions,
          ingredientSuggestions: includeIngredients ? ingredientSuggestions : [],
        };

      const response = await axios.post(`${API_BASE_URL}/api/get-suggestion`, requestData);
      setSuggestion(response.data.suggestion);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setSuggestion('Error fetching suggestion: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (suggestion && !favorites.some(fav => fav.suggestion === suggestion)) {
      try {
        const type = option === 'stay-in' ? 'recipe' : 'restaurant';
        const response = await axios.post(`${API_BASE_URL}/api/add-favorite`, {
          suggestion,
          type,
          tags: [dietaryPreference, foodTypePreference, healthiness, numServings, customPreferences].filter(tag => tag !== '' && tag !== 'any' && tag !== 'none'),
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

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return (
          <Box textAlign="center" mt={5}>
            <Typography variant="h4" gutterBottom>
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
                <MenuItem value="surprise">Surprise Me!</MenuItem>
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
                <MenuItem value="american">American</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="healthiness-label">Healthiness</InputLabel>
              <Select
                labelId="healthiness-label"
                id="healthiness"
                value={healthiness}
                onChange={handleHealthinessChange}
                label="Healthiness"
              >
                <MenuItem value="healthier">Healthier</MenuItem>
                <MenuItem value="comfort">Comfort Food</MenuItem>
              </Select>
            </FormControl>
            {option === 'stay-in' && (
              <>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <TextField
                    id="num-servings"
                    label="Number of Servings"
                    type="number"
                    value={numServings}
                    onChange={handleNumServingsChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeIngredients}
                      onChange={(e) => setIncludeIngredients(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Use only my ingredients"
                />
              </>
            )}
            {option === 'go-out' && (
              <FormControl variant="outlined" fullWidth margin="normal">
                <TextField
                  id="search-radius"
                  label="Search Radius (meters)"
                  type="number"
                  value={searchRadius}
                  onChange={handleSearchRadiusChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            )}
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="Custom Preferences"
              value={customPreferences}
              onChange={handleCustomPreferencesChange}
            />
            <Box mt={3}>
              <Button className="animated-button" variant="contained" color="secondary" onClick={handleGetSuggestion} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Get Suggestion'}
              </Button>
            </Box>
            {suggestion && (
              <Box mt={3} ref={resultRef}>
                <Result suggestion={suggestion} />
                <Button className="animated-button" variant="contained" onClick={handleFavorite} style={{ marginTop: '10px' }}>
                  Favorite
                </Button>
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <AddSuggestion 
            restaurantSuggestions={restaurantSuggestions} 
            setRestaurantSuggestions={setRestaurantSuggestions} 
            ingredientSuggestions={ingredientSuggestions} 
            setIngredientSuggestions={setIngredientSuggestions} 
          />
        );
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
                <MenuItem value="american">American</MenuItem>
                <MenuItem value="healthier">Healthier</MenuItem>
                <MenuItem value="comfort">Comfort Food</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h5">Restaurants</Typography>
            {filteredFavorites.filter(fav => fav.type === 'restaurant').length > 0 ? (
              <Box textAlign={'left'}>
                {filteredFavorites.filter(fav => fav.type === 'restaurant').map((fav, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    sx={{
                      padding: '10px',
                      marginTop: '10px',
                      backgroundColor: theme.palette.customColors.color2,
                      whiteSpace: 'pre-wrap',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                    }}
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
                    sx={{
                      padding: '10px',
                      marginTop: '10px',
                      backgroundColor: theme.palette.secondary.main,
                      whiteSpace: 'pre-wrap',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                    }}
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
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Tabs
                value={tab}
                onChange={(event, newValue) => setTab(newValue)}
                sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
              >
                <Tab label="Suggest Dinner" />
                <Tab label="Add Your Own" />
                <Tab label="Favorites" />
                <Tab label="Settings" />
                <Tab label="Help" />
                <Tab label="About" />
              </Tabs>
            </Toolbar>
          </AppBar>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{ display: { md: 'none' } }}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                <ListItem button onClick={() => setTab(0)}>
                  <ListItemText primary="Suggest Dinner" />
                </ListItem>
                <ListItem button onClick={() => setTab(1)}>
                  <ListItemText primary="Add Your Own" />
                </ListItem>
                <ListItem button onClick={() => setTab(2)}>
                  <ListItemText primary="Favorites" />
                </ListItem>
                <ListItem button onClick={() => setTab(3)}>
                  <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button onClick={() => setTab(4)}>
                  <ListItemText primary="Help" />
                </ListItem>
                <ListItem button onClick={() => setTab(5)}>
                  <ListItemText primary="About" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          {renderTabContent()}
        </Container>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};

export default Home;
