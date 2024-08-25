import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import './Cart.css';

interface CartProps {
  cart: string[];
  removeFromCart: (ingredient: string) => void;
  clearCart: () => void;
  handleCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart, clearCart, handleCheckout }) => {
  return (
    <Box mt={3}>
      <Typography variant="h6">Shopping Cart</Typography>
      {cart.length > 0 ? (
        <List>
          {cart.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText primary={ingredient} />
              <Button variant="contained" color="secondary" onClick={() => removeFromCart(ingredient)}>
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No items in the cart.</Typography>
      )}
      {cart.length > 0 && (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Checkout
          </Button>
          <Button variant="contained" color="secondary" onClick={clearCart} style={{ marginLeft: '10px' }}>
            Clear Cart
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
