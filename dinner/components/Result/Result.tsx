import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Card, CardMedia } from '@mui/material';
import './Result.css';

interface ResultProps {
  suggestion: string;
  imageUrl: string;
  addToCart: (ingredient: string) => void;
  addedToCart: string[];
  addedToFavorites: string[];
  handleFavorite: () => void;
}

const Result: React.FC<ResultProps> = ({ suggestion, imageUrl, addToCart, addedToCart, addedToFavorites, handleFavorite }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    // Parse the ingredients from the suggestion text
    // This is a placeholder logic, you might need to adjust it based on the actual format of the suggestion
    const parsedIngredients = suggestion.split('\n').filter(line => line.startsWith('- ')).map(line => line.slice(2));
    setIngredients(parsedIngredients);
  }, [suggestion]);

  return (
    <Box
      sx={{
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        // borderRadius: '5px',
        marginTop: '10px',
        // border: '1px solid #ddd',
      }}
      textAlign={'left'}
    >
      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: suggestion }} />
      {imageUrl && (
        <Card sx={{ marginTop: 2 }}>
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt="Recipe image"
          />
        </Card>
      )}
      {ingredients.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">Ingredients:</Typography>
          <List>
            {ingredients.map((ingredient, index) => (
              <ListItem key={index}>
                <ListItemText primary={ingredient} />
                <Button
                  variant="contained"
                  color={addedToCart.includes(ingredient) ? "success" : "primary"}
                  onClick={() => addToCart(ingredient)}
                >
                  {addedToCart.includes(ingredient) ? "Added" : "Add to Cart"}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <Button
        variant="contained"
        color={addedToFavorites.includes(suggestion) ? "success" : "primary"}
        onClick={handleFavorite}
        style={{ marginTop: '10px' }}
      >
        {addedToFavorites.includes(suggestion) ? "Favorited" : "Favorite"}
      </Button>
    </Box>
  );
};

export default Result;
