const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const NFT = require('../models/NFT');
const { authenticateToken } = require('../middleware/auth');
const hathor = require('../services/hathor');
const { check, validationResult } = require('express-validator');

// Get all NFTs for a wallet
router.get('/wallet/:address', authenticateToken, async (req, res) => {
  try {
    const nfts = await hathor.getNFTs(req.params.address);
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Create a new NFT
router.post('/', [authenticateToken, 
  check('name').notEmpty().withMessage('Name is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('imageUrl').isURL().withMessage('Valid image URL is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, imageUrl, owner } = req.body;
    const metadata = {
      name,
      description,
      image: imageUrl
    };

    const nftData = await hathor.createNFT(owner, metadata);
    const nft = new NFT({
      ...metadata,
      owner,
      txId: nftData.txId,
      tokenUtxo: nftData.tokenUtxo,
      tokenIndex: nftData.tokenIndex,
      tokenType: nftData.tokenType
    });

    await nft.save();
    res.status(201).json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create NFT' });
  }
});

module.exports = router;
