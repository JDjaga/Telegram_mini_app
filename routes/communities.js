const express = require('express');
const router = express.Router();

// Create community
router.post('/', async (req, res) => {
  try {
    const { name, description, tokenSymbol, tokenSupply } = req.body;
    res.json({ message: 'Community created successfully' });
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ error: 'Failed to create community' });
  }
});

// Join community
router.post('/join/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    res.json({ message: 'Joined community successfully' });
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ error: 'Failed to join community' });
  }
});

// Get community info
router.get('/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    res.json({ message: 'Community info fetched successfully' });
  } catch (error) {
    console.error('Error fetching community info:', error);
    res.status(500).json({ error: 'Failed to fetch community info' });
  }
});

module.exports = router;
