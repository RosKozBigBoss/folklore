const express = require('express');
const path = require('path');
const { generateMusic } = require('./ai-service');

const app = express();
const PORT = process.env.PORT || 3001;

const musicHistory = [];

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// API endpoint for music generation
app.post('/api/generate', async (req, res) => {
    console.log('Received generation request:', req.body);
    const result = await generateMusic(req.body);
    musicHistory.unshift({ ...result, id: Date.now(), ...req.body });
    res.json(result);
});

// API endpoint for retrieving music history
app.get('/api/history', (req, res) => {
    res.json(musicHistory);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
