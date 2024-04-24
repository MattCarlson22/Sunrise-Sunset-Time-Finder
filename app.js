// app.js

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const LOCATIONIQ_KEY = process.env.LOCATIONIQ_KEY;
const GOOGLE_KEY = process.env.GOOGLE_KEY;

app.use(express.static('public')); // Serves static files from 'public' directory

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/location', (req, res) => {
  const cityName = req.query.cityName;
  const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(cityName)}&format=json`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ error: 'Failed to fetch location' }));
});

app.get('/api/timezone', (req, res) => {
  const { latitude, longitude } = req.query;
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${GOOGLE_KEY}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ error: 'Failed to fetch timezone' }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
