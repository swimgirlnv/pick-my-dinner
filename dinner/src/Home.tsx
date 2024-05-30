/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Result from './Result';
import axios from 'axios';
import { Box, Button, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';


const Home = () => {

  const [option, setOption] = useState('');
  const [manualSuggestions, setManualSuggestions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [newSuggestion, setNewSuggestion] = useState('');


  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption(e.target.value);
  };

  const handleNewSuggestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSuggestion(event.target.value);
  };

  const handleAddSuggestion = () => {
    if (newSuggestion) {
      setManualSuggestions([...manualSuggestions, newSuggestion]);
      setNewSuggestion('');
    }
  };

  const handleGetSuggestion = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/get-suggestion', {
        option,
        manualSuggestions,
      });
      setSuggestion(response.data.suggestion);
    } catch (error) {
      console.error('Frontend Error: Error fetching suggestion:', error);
      setSuggestion('Frontend: Error fetching suggestion');
    }
  };

  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          Where Should I Eat Dinner?
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup row aria-label="dinner-option" name="dinner-option" value={option} onChange={handleOptionChange}>
            <FormControlLabel value="stay-in" control={<Radio />} label="Stay In" />
            <FormControlLabel value="go-out" control={<Radio />} label="Go Out" />
          </RadioGroup>
        </FormControl>
        <Box mt={3}>
          <TextField
            label="Enter suggestion"
            variant="outlined"
            value={newSuggestion}
            onChange={handleNewSuggestionChange}
          />
          <Button variant="contained" color="primary" onClick={handleAddSuggestion} style={{ marginLeft: '10px' }}>
            Add Suggestion
          </Button>
        </Box>
        <Box mt={3}>
          <Button variant="contained" color="secondary" onClick={handleGetSuggestion}>
            Where Should I Eat?
          </Button>
        </Box>
        {suggestion && <Result suggestion={suggestion} />}
      </Box>
    </Container>
  );
};

export default Home;
