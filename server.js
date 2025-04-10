require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const open = require('open');

// Import the bot handler
require('./bot-handler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

// API routes go here
// ...

// For any request that doesn't match an API route, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  authSource: 'admin'
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Start the server and open the application
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Open the application in the default browser
  await open(`http://localhost:${PORT}`);
  console.log('Application opened in browser');
});
