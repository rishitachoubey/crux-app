const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.options('*', cors(corsOptions));

const CRUX_API_KEY = 'AIzaSyDiLeV6Dw1Jc-n7fDUP3w8-rp-tURo1ky0';

app.post('/api/search', async (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: 'urls must be an array' });
  }
  try {
    const results = await Promise.all(urls.map(async (url) => {
      try {
        const response = await axios.post(
          `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${CRUX_API_KEY}`,
          { url }
        );
        return { url, metrics: response.data.record?.metrics || {} };
      } catch (err) {
        return { url, error: err.response?.data || err.message };
      }
    }));
    res.json(results);
  } catch (error) {
    console.error('CrUX API error:', error.response?.data || error.message);
    res.status(500).json({ error: error.toString(), details: error.response?.data });
  }
});

app.listen(5050, () => console.log('Backend running on port 5050'));