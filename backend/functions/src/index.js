/* eslint-disable max-len */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const functions = require("firebase-functions");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const favorites = [];
const manualSuggestions = [];

app.post("/api/get-suggestion", async (req, res) => {
  const {option, dietaryPreference, foodTypePreference, healthiness, numServings, customPreferences, location} = req.body;
  try {
    let suggestion;
    if (option === "stay-in") {
      suggestion = await getRecipeSuggestion(manualSuggestions, dietaryPreference, foodTypePreference, healthiness, numServings, customPreferences);
    } else if (option === "go-out") {
      suggestion = await getRestaurantSuggestion(manualSuggestions, dietaryPreference, foodTypePreference, customPreferences, location);
    }
    res.json({suggestion});
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    res.status(500).json({error: "Backend Error: Error fetching suggestion"});
  }
});

app.post("/api/add-favorite", (req, res) => {
  const {suggestion, type, tags} = req.body;
  if (suggestion && !favorites.some((fav) => fav.suggestion === suggestion)) {
    favorites.push({suggestion, type, tags});
  }
  res.json({favorites});
});

app.get("/api/favorites", (req, res) => {
  res.json({favorites});
});

app.get("/api/suggestions", (req, res) => {
  res.json({manualSuggestions});
});

const getRecipeSuggestion = async (manualSuggestions, dietaryPreference, foodTypePreference, healthiness, numServings, customPreferences) => {
  if (manualSuggestions.length) {
    return manualSuggestions[Math.floor(Math.random() * manualSuggestions.length)];
  }

  const apiKey = functions.config().openai.api_key;
  let prompt = `Suggest a dinner recipe for tonight`;
  if (dietaryPreference !== "none") {
    prompt += ` with a ${dietaryPreference} preference`;
  }
  if (foodTypePreference !== "any") {
    prompt += ` focusing on ${foodTypePreference} cuisine`;
  }
  if (healthiness) {
    prompt += ` that is ${healthiness}`;
  }
  if (numServings) {
    prompt += ` for ${numServings} servings`;
  }
  if (customPreferences) {
    prompt += ` with the following preferences: ${customPreferences}`;
  }
  prompt += ".";

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const data = {
    prompt: prompt,
    max_tokens: 500,
  };

  try {
    const response = await axios.post(
        "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions",
        data,
        {headers},
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching recipe suggestion:", error.response ? error.response.data : error.message);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    return "Error fetching recipe suggestion";
  }
};

const getRestaurantSuggestion = async (manualSuggestions, dietaryPreference, foodTypePreference, customPreferences, location) => {
  if (manualSuggestions.length) {
    return manualSuggestions[Math.floor(Math.random() * manualSuggestions.length)];
  }

  const apiKey = functions.config().google_places.api_key;
  const radius = 1700; // Radius in meters
  let query = `restaurants near me`;
  if (dietaryPreference !== "none") {
    query += ` with a ${dietaryPreference} preference`;
  }
  if (foodTypePreference !== "any") {
    query += ` focusing on ${foodTypePreference} cuisine`;
  }
  if (customPreferences) {
    query += ` with the following preferences: ${customPreferences}`;
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=restaurant&keyword=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    console.log(`Requesting Google Places API with URL: ${url}`);
    const response = await axios.get(url);
    console.log("Google Places API response:", response.data);

    if (response.data.results.length) {
      const randomIndex = Math.floor(Math.random() * response.data.results.length);
      return response.data.results[randomIndex].name;
    } else {
      return "No restaurants found.";
    }
  } catch (error) {
    console.error("Error fetching restaurant suggestion:", error.response ? error.response.data : error.message);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    return "Error fetching restaurant suggestion:", error.response ? error.response.data : error.message;
  }
};

module.exports = app;
