import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Card, CardMedia } from '@mui/material';
import './Result.css';

interface RestaurantDetails {
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  website?: string;
  opening_hours?: string[]; // Adjusted to match the logged response
  googleMapsUri?: string;
  reviews?: {
    name: string;
    relativePublishTimeDescription: string;
    rating: number;
    text: {
      text: string;
    };
    authorAttribution: {
      displayName: string;
      uri: string;
      photoUri: string;
    };
  }[];
}

interface ResultProps {
  suggestion: string | RestaurantDetails;
  imageUrl: string;
  addToCart: (ingredient: string) => void;
  addedToCart: string[];
  addedToFavorites: string[];
  handleFavorite: () => void;
}

const Result: React.FC<ResultProps> = ({ suggestion, imageUrl, addToCart, addedToCart, addedToFavorites, handleFavorite }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null);
  console.log(imageUrl);
  useEffect(() => {
    if (typeof suggestion === 'string') {
      const parsedIngredients = suggestion
        .split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.slice(2));
      setIngredients(parsedIngredients);
    } else {
      setIngredients([]);

      // Determine if the restaurant is currently open
      if (suggestion.opening_hours) {
        const now = new Date();
        const currentDay = now.getDay(); // Sunday - Saturday: 0 - 6
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes

        const todayHours = suggestion.opening_hours[currentDay];
        const [openTime, closeTime] = todayHours.split('–').map(timeStr => {
          const [hours, minutes] = timeStr.match(/\d{1,2}:\d{2}/g)![0].split(':').map(Number);
          const isPM = /PM/.test(timeStr);
          return (hours % 12) * 60 + minutes + (isPM ? 12 * 60 : 0);
        });

        setIsOpenNow(currentTime >= openTime && currentTime <= closeTime);
      } else {
        setIsOpenNow(null);
      }
    }
  }, [suggestion]);

  return (
    <Box
      sx={{
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        marginTop: '10px',
        textAlign: 'left',
      }}
    >
      {typeof suggestion === 'string' ? (
        <>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: suggestion }} />
          {imageUrl && (
            <Card sx={{ marginTop: 2 }}>
              <CardMedia component="img" height="140" image={imageUrl} alt="Recipe image" />
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
                      color={addedToCart.includes(ingredient) ? 'success' : 'primary'}
                      onClick={() => addToCart(ingredient)}
                    >
                      {addedToCart.includes(ingredient) ? 'Added' : 'Add to Cart'}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </>
      ) : (
        // Render restaurant details if suggestion is an object
        <>
          <Typography variant="h4">{suggestion.name}</Typography>
          <Typography variant="body1">{suggestion.address}</Typography>
          {suggestion.phone && <Typography variant="body1">Phone: {suggestion.phone}</Typography>}
          {suggestion.rating && <Typography variant="body1">Rating: {suggestion.rating} stars</Typography>}
          {suggestion.website && (
            <Typography variant="body1">
              <a href={suggestion.website} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </Typography>
          )}
          {suggestion.googleMapsUri && (
            <Typography variant="body1">
              <a href={suggestion.googleMapsUri} target="_blank" rel="noopener noreferrer">
                View on Google Maps
              </a>
            </Typography>
          )}
          {suggestion.opening_hours && (
            <Box mt={2}>
              <Typography variant="h6">
                Opening Hours: {isOpenNow !== null && (isOpenNow ? 'Open Now' : 'Closed Now')}
              </Typography>
              <List>
                {suggestion.opening_hours.map((description, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={description} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {suggestion.reviews && suggestion.reviews.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6">Reviews:</Typography>
              {suggestion.reviews.map((review, index) => (
                <Box key={index} mt={2} p={2} border={1} borderColor="#ddd" borderRadius={2}>
                  <Typography variant="body2">
                    <strong>{review.authorAttribution.displayName}</strong> ({review.relativePublishTimeDescription}):
                  </Typography>
                  <Typography variant="body2">Rating: {review.rating} stars</Typography>
                  <Typography variant="body2">{review.text.text}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      <Button
        variant="contained"
        color={addedToFavorites.includes(typeof suggestion === 'string' ? suggestion : suggestion.name) ? 'success' : 'primary'}
        onClick={handleFavorite}
        style={{ marginTop: '10px' }}
      >
        {addedToFavorites.includes(typeof suggestion === 'string' ? suggestion : suggestion.name) ? 'Favorited' : 'Favorite'}
      </Button>
    </Box>
  );
};

export default Result;