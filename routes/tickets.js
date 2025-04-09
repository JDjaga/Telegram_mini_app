const express = require('express');
const router = express.Router();

// Create ticket
router.post('/', async (req, res) => {
  try {
    const { eventId, buyer, seller, price, tokenId } = req.body;
    res.json({ message: 'Ticket created successfully' });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get tickets for event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    res.json({ message: 'Event tickets fetched successfully' });
  } catch (error) {
    console.error('Error fetching event tickets:', error);
    res.status(500).json({ error: 'Failed to fetch event tickets' });
  }
});

module.exports = router;
