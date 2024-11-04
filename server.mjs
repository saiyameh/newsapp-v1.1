import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.NEWS_API_TOKEN;

if (!API_TOKEN) {
  console.error("API Token not found! Please check your .env file.");
  process.exit(1); // Exit if no API token found
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Main route to fetch news with category, search, and other parameters
app.get('/api/news', async (req, res) => {
  const { category = 'top', language = 'en', country = 'in' } = req.query;

  const url = `https://newsdata.io/api/1/latest?apikey=${API_TOKEN}&category=${category}&language=${language}&country=${country}`;
  console.log('Fetching URL:', url);  // Debugging

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error') {
      console.error('API Error:', data.message);
      res.status(500).json({ error: 'Failed to fetch news', details: data.message });
      return;
    }

    res.json(data.results || []);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
