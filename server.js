require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Recipe Generation Endpoint
app.post('/generate', async (req, res) => {
    try {
        const { ingredients, diet, difficulty, country } = req.body;
        
        const prompt = `
            Create a detailed recipe with these parameters:
            - Ingredients: ${ingredients}
            - Diet: ${diet}
            - Difficulty: ${difficulty}
            - Cuisine: ${country}
            
            Include in JSON format:
            {
                "title": "Recipe Title",
                "description": "Recipe description",
                "ingredients": [],
                "instructions": [],
                "cooking_time": "",
                "nutrition_info": ""
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-mini", // Use your preferred model
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000
        });

        const recipe = JSON.parse(response.choices[0].message.content);
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Category Recipes Endpoint
app.get('/recipes/:cuisine', async (req, res) => {
    try {
        const { cuisine } = req.params;
        const prompt = `
            Generate 5 ${cuisine} recipes in JSON format:
            [{
                "title": "Recipe Title",
                "description": "Recipe description",
                "ingredients": [],
                "instructions": []
            }]
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000
        });

        const recipes = JSON.parse(response.choices[0].message.content);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
