const express = require('express');
const router = express.Router();

// Create event
router.post('/', async (req, res) => {
  try {
    const { name, description, date, location, ticketPrice, ticketToken } = req.body;
    res.json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Events fetched successfully' });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
