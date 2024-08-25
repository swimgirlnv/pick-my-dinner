import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Modal,
  Fab,
  Badge,
  Button
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import TopBar from '../TopBar/TopBar';
import Result from '../Result/Result';
import AddSuggestion from '../AddSuggestion/AddSuggestion';
import Favorites from '../Favorites/Favorites';
import Settings from '../Settings/Settings';
import Help from '../Help/Help';
import About from '../About/About';
import Footer from '../Footer/Footer';
import Cart from '../Cart/Cart';
import './Home.css';

const Home: React.FC = () => {
  const [option, setOption] = useState<string>('');
  const [dietaryPreference, setDietaryPreference] = useState<string>('');
  const [foodTypePreference, setFoodTypePreference] = useState<string>('');
  const [healthiness, setHealthiness] = useState<string>('');
  const [numServings, setNumServings] = useState<string>('');
  const [customPreferences, setCustomPreferences] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number>(5000); // Default radius in meters
  const [restaurantSuggestions, setRestaurantSuggestions] = useState<string[]>([]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string>('');
  const [favorites, setFavorites] = useState<{ suggestion: string; type: string; tags: string[] }[]>([]);
  const [filterTag, setFilterTag] = useState<string>('');
  const [tab, setTab] = useState<number>(0);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [includeIngredients, setIncludeIngredients] = useState<boolean>(false);
  const [cart, setCart] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState<string[]>([]);
  const [addedToFavorites, setAddedToFavorites] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
      setImageUrl(response.data.imageUrl); // Ensure imageUrl is being set
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
        setAddedToFavorites((prev) => [...prev, suggestion]);
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  const addToCart = (ingredient: string) => {
    setCart((prevCart) => [...prevCart, ingredient]);
    setAddedToCart((prev) => [...prev, ingredient]);
  };

  const removeFromCart = (ingredient: string) => {
    setCart((prevCart) => prevCart.filter(item => item !== ingredient));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = () => {
    const ingredientsList = cart.join(', ');
    console.log('Checking out with ingredients:', ingredientsList);
    // Add your integration logic with Uber Eats, Instacart, or any other service here
  };

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

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return (
          <Box textAlign="center" mt={5}>
            <Typography variant="h4">
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
            <Box mt={3} sx={{border: 'none'}}>
              <Button variant="contained" color="secondary" onClick={handleGetSuggestion} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} color="primary" /> : 'Get Suggestion'}
              </Button>
            </Box>
            {suggestion && (
              <Box mt={3} ref={resultRef}>
                <Result
                  suggestion={suggestion}
                  imageUrl={imageUrl} // Pass the imageUrl prop to the Result component
                  addToCart={addToCart}
                  addedToCart={addedToCart}
                  addedToFavorites={addedToFavorites}
                  handleFavorite={handleFavorite}
                />
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
          <Favorites 
            favorites={favorites} 
            filterTag={filterTag} 
            handleFilterTagChange={handleFilterTagChange} 
          />
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
    <Box>
      <TopBar tab={tab} setTab={setTab} toggleDrawer={toggleDrawer} />
      <Container className="home-container">
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          className="drawer"
        >
          <Box
            className="drawer-box"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem onClick={() => setTab(0)}>
                <ListItemText primary="Suggest Dinner" />
              </ListItem>
              <ListItem onClick={() => setTab(1)}>
                <ListItemText primary="Add Your Own" />
              </ListItem>
              <ListItem onClick={() => setTab(2)}>
                <ListItemText primary="Favorites" />
              </ListItem>
              <ListItem onClick={() => setTab(3)}>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem onClick={() => setTab(4)}>
                <ListItemText primary="Help" />
              </ListItem>
              <ListItem onClick={() => setTab(5)}>
                <ListItemText primary="About" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        {renderTabContent()}
      </Container>
      <Container className='cartContainer'>
        <Fab
            color="primary"
            aria-label="cart"
            className="cart-fab"
            onClick={handleCartOpen}
            sx={{position: 'fixed', bottom: '20px', right: '20px'}}
          >
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </Fab>
          <Modal
            open={cartOpen}
            onClose={handleCartClose}
            aria-labelledby="cart-modal-title"
            aria-describedby="cart-modal-description"
          >
            <Box className="cart-modal">
              <Typography id="cart-modal-title" variant="h6" component="h2">
                Shopping Cart
              </Typography>
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                handleCheckout={handleCheckout}
              />
            </Box>
          </Modal>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
