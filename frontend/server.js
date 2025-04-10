const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3002;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the index.html file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Frontend server running at http://localhost:${port}`);
});
