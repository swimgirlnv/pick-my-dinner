/* eslint-disable @typescript-eslint/no-unused-vars */

import './App.css'
import Home from './Home'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
// import theme from './theme';

const defaultTheme = createTheme();

const App = () => {

  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Home />
    </ThemeProvider>
  )
}

export default App
