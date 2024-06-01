/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import './App.css'
import Home from './Home'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const defaultTheme = createTheme();

const App = () => {

  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Home />
    </ThemeProvider>
  )
}

export default App;
