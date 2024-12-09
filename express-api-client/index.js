require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENHANDS_API_KEY;

if (!API_KEY) {
  console.error('Missing OPENHANDS_API_KEY in environment variables');
  process.exit(1);
}

const http = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 1000 });

app.get('/api/v1/search', [
  body('query').isString().isLength({ min: 1, max: 100 }).trim().escape(),
  body('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { query, limit = 10 } = req.query;

  if (!query) {
    return res.status(400).json({
      code: 400,
      message: 'Missing required parameter: query',
    });
  }

  try {
    let attempts = 0;
    const maxAttempts = 3;

    const fetchData = async () => {
      try {
        const response = await http.get('https://api.example.com/search', {
          params: { query, limit },
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
          timeout: 5000,
        });

        const results = response.data.map(item => ({
          id: item.id,
          title: item.title,
        }));

        res.status(200).json(results);
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          return res.status(408).json({
            code: 408,
            message: 'Request timeout',
          });
        }

        if (attempts < maxAttempts && (error.response && error.response.status >= 500 || error.request)) {
          attempts++;
          const delay = Math.pow(2, attempts) * 1000;
          console.log(`Retrying request... Attempt ${attempts} after ${delay}ms`);
          setTimeout(fetchData, delay);
        } else {
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
      }
    };

    fetchData();
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