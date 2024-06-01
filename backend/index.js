const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

let favorites = [];
let manualSuggestions = [];


// Define a route for getting suggestions
app.post('/api/get-suggestion', async (req, res) => {
    const { option, dietaryPreference, foodTypePreference } = req.body;
    try {
      let suggestion;
      if (option === 'stay-in') {
        suggestion = await getRecipeSuggestion(manualSuggestions, dietaryPreference, foodTypePreference);
      } else if (option === 'go-out') {
        suggestion = await getRestaurantSuggestion(manualSuggestions, dietaryPreference, foodTypePreference);
      }
      res.json({ suggestion });
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      res.status(500).json({ error: 'Backend Error: Error fetching suggestion' });
    }
  });
  

// Route to add a favorite
app.post('/api/add-favorite', (req, res) => {
    const { suggestion, type } = req.body;
    if (suggestion && !favorites.some(fav => fav.suggestion === suggestion)) {
        favorites.push({ suggestion, type });
    }
    res.json({ favorites });
});

// Route to get favorites
app.get('/api/favorites', (req, res) => {
    res.json({ favorites });
});

app.get('/api/suggestions', (req, res) => {
    res.json({ manualSuggestions });
});

const getRecipeSuggestion = async (manualSuggestions, dietaryPreference, foodTypePreference) => {
    if (manualSuggestions.length) {
      return manualSuggestions[Math.floor(Math.random() * manualSuggestions.length)];
    }
  
    const apiKey = process.env.API_KEY;
    let prompt = 'Suggest a dinner recipe for tonight';
    if (dietaryPreference !== 'none') {
      prompt += ` with a ${dietaryPreference} preference`;
    }
    if (foodTypePreference !== 'any') {
      prompt += ` focusing on ${foodTypePreference} cuisine`;
    }
    prompt += '.';
  
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  
    const data = {
      prompt: prompt,
      max_tokens: 500,
    };
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
        data,
        { headers }
      );
  
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error fetching recipe suggestion:', error.response ? error.response.data : error.message);
      return 'Error fetching recipe suggestion';
    }
  };
  
  const getRestaurantSuggestion = async (manualSuggestions, dietaryPreference, foodTypePreference) => {
    if (manualSuggestions.length) {
      return manualSuggestions[Math.floor(Math.random() * manualSuggestions.length)];
    }
  
    const apiKey = process.env.API_KEY;
    let prompt = 'Suggest a restaurant for dinner tonight';
    if (dietaryPreference !== 'none') {
      prompt += ` with a ${dietaryPreference} preference`;
    }
    if (foodTypePreference !== 'any') {
      prompt += ` focusing on ${foodTypePreference} cuisine`;
    }
    prompt += '.';
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
        {
          prompt: prompt,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error fetching restaurant suggestion:', error.response ? error.response.data : error.message);
      return 'Error fetching restaurant suggestion';
    }
  };
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});