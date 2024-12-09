require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENHANDS_API_KEY;

if (!API_KEY) {
  console.error('Missing OPENHANDS_API_KEY in environment variables');
  process.exit(1);
}

app.get('/api/v1/search', async (req, res) => {
  const { query, limit = 10 } = req.query;

  if (!query) {
    return res.status(400).json({
      code: 400,
      message: 'Missing required parameter: query',
    });
  }

  try {
    const response = await axios.get('https://api.example.com/search', {
      params: { query, limit },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const results = response.data.map(item => ({
      id: item.id,
      title: item.title,
    }));

    res.status(200).json(results);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        code: error.response.status,
        message: error.response.data.message || 'Server error',
      });
    } else if (error.request) {
      res.status(503).json({
        code: 503,
        message: 'Network error or no response from server',
      });
    } else {
      res.status(500).json({
        code: 500,
        message: 'Internal server error',
      });
    }
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: 'Something went wrong!',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});