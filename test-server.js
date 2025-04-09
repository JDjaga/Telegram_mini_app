const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(3000, () => {
  console.log('Test server is running on port 3000');
});
