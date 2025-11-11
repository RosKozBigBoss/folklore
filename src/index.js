const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Welcome to the HitShop Folklore API v1'
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4()
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
