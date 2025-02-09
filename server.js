require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Spoonacular API Proxy Endpoint
app.post('/generate-recipes', async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients) {
        return res.status(400).json({ error: 'Ingredients are required' });
    }

    try {
        const params = new URLSearchParams({
            ingredients: ingredients,
            number: 5,
            apiKey: process.env.SPOONACULAR_API_KEY,
            ignorePantry: true,
            ranking: 1
        });

        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?${params}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
