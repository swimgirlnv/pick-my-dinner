import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

// Define a route for getting suggestions
app.post('/api/get-suggestion', async (req, res) => {
    const { option, manualSuggestions } = req.body;
    try {
        let suggestion;
        if (option === 'stay-in') {
        // Fetch a recipe suggestion (mock implementation)
        suggestion = await getRecipeSuggestion(manualSuggestions);
        } else if (option === 'go-out') {
        // Fetch a restaurant suggestion (mock implementation)
        suggestion = await getRestaurantSuggestion(manualSuggestions);
        }
        res.json({ suggestion });
    } catch (error) {
        console.error('Error fetching suggestion:', error);
        res.status(500).json({ error: 'Backend Error: Error fetching suggestion' });
    }
});

const getRecipeSuggestion = async (manualSuggestions) => {
    if (manualSuggestions.length) {
      return manualSuggestions[Math.floor(Math.random() * manualSuggestions.length)];
    }

    const apiKey = dotenv.API_KEY;
    const prompt = 'Suggest a dinner recipe for tonight.';

    try {
        console.log('here we go! (suggesting dinner recipe)')
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
            prompt: prompt,
            max_tokens: 50,
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
        console.log(error);
        console.error('Error fetching recipe suggestion:', error);
        return 'Error fetching recipe suggestion';
    }
};

const getRestaurantSuggestion = async (manualSuggestions) => {
    if (manualSuggestions.length) {
        return manualSuggestions[Math.floor(Math.random() * manualSuggestions.length)];
    }

const apiKey = dotenv.API_KEY;
const prompt = 'Suggest a restaurant for dinner tonight.';

try {
    const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
        prompt: prompt,
        max_tokens: 50,
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
    console.error('Error fetching restaurant suggestion:', error);
    return 'Error fetching restaurant suggestion';
    }
};

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
