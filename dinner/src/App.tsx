import './App.css';
import React from 'react';
import Home from '../components/Home/Home';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const defaultTheme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
};

export default App;
