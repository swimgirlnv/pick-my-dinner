import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Tabs, Tab, ThemeProvider, createTheme } from '@mui/material';
import './Favorites.css';

const theme = createTheme();

interface Favorite {
  suggestion: string;
  type: string;
  tags: string[];
}

interface FavoritesProps {
  favorites: Favorite[];
  filterTag: string;
  handleFilterTagChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, filterTag, handleFilterTagChange }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const filteredFavorites = favorites.filter(fav => {
    if (filterTag === '') return true;
    return fav.tags.includes(filterTag);
  });

  const renderFavorites = (type: string) => (
    filteredFavorites.filter(fav => fav.type === type).length > 0 ? (
      <Box textAlign={'left'}>
        {filteredFavorites.filter(fav => fav.type === type).map((fav, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              padding: '10px',
              marginTop: '10px',
              backgroundColor: theme.palette.customColors?.color2,
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
      <Typography variant="h6">No favorite {type}s yet.</Typography>
    )
  );

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
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
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Restaurants" />
          <Tab label="Recipes" />
        </Tabs>
        {selectedTab === 0 ? renderFavorites('restaurant') : renderFavorites('recipe')}
      </Box>
    </ThemeProvider>
  );
};

export default Favorites;
