require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/generate-recipes', async (req, res) => {
    try {
        const { ingredients } = req.body;
        const prompt = `
            Create a detailed recipe using these ingredients: ${ingredients}.
            Include title, description, ingredients list, and step-by-step instructions.
            Format as JSON with keys: title, description, ingredients, instructions.
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
        });

        const recipe = JSON.parse(completion.choices[0].message.content);
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
