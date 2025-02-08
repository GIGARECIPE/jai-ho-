const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'frontend.html'));
});

// DeepSeek API Integration
app.post('/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Create 3 recipes using: ${ingredients}. Format each with:
          1. Name (##)
          2. Time (⏱)
          3. Difficulty (⚡)
          4. Ingredients (###)
          5. Instructions (numbered)
          6. Tips (💡)
          Use markdown.`
        }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    res.json({ recipes: data.choices[0].message.content });
    
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on https://giga-recipe-ai.onrender.com/`);
});
