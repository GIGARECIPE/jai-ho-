const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// 1. Load environment variables
dotenv.config();

// 2. Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Recipe Endpoint (Simplified)
app.post('/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    // Simple response for testing
    const mockResponse = {
      recipes: `## Test Recipe\n⏱ 20 mins\n### Ingredients\n- ${ingredients}\n### Instructions\n1. Test step`
    };

    res.json(mockResponse);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});