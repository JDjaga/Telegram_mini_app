const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  txId: {
    type: String,
    required: true
  },
  tokenUtxo: {
    type: String,
    required: true
  },
  tokenIndex: {
    type: Number,
    required: true
  },
  tokenType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NFT', nftSchema);
