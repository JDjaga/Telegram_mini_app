const express = require('express');
const axios = require('axios');
const TelegramWebApp = require('@telegram-mini-apps/sdk');

const router = express.Router();

// Initialize Telegram Web App
router.get('/', (req, res) => {
  const tg = new TelegramWebApp(req.query.hash);
  
  if (!tg.initData) {
    return res.status(400).json({ error: 'Invalid Telegram Web App request' });
  }

  res.json({
    success: true,
    initData: tg.initData,
    authData: tg.authData
  });
});

// Handle NFT portfolio requests
router.get('/portfolio', async (req, res) => {
  const tg = new TelegramWebApp(req.query.hash);
  const walletAddress = tg.initData.user.walletAddress;

  try {
    const response = await axios.get(`http://localhost:5000/api/nfts/wallet/${walletAddress}`);
    res.json({
      success: true,
      nfts: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch NFTs'
    });
  }
});

// Handle event requests
router.get('/events', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/events');
    res.json({
      success: true,
      events: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// Handle ticket purchase
router.post('/tickets', async (req, res) => {
  const tg = new TelegramWebApp(req.query.hash);
  const { eventId, quantity } = req.body;

  try {
    const response = await axios.post(`http://localhost:5000/api/tickets`, {
      eventId,
      buyer: tg.initData.user.walletAddress,
      quantity
    });
    
    res.json({
      success: true,
      ticket: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to purchase ticket'
    });
  }
});

module.exports = router;
