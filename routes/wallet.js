const express = require('express');
const router = express.Router();

// Get wallet balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    res.json({ message: 'Wallet balance fetched successfully' });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
});

// Send transaction
router.post('/send', async (req, res) => {
  try {
    const { from, to, amount, token } = req.body;
    res.json({ message: 'Transaction sent successfully' });
  } catch (error) {
    console.error('Error sending transaction:', error);
    res.status(500).json({ error: 'Failed to send transaction' });
  }
});

module.exports = router;
