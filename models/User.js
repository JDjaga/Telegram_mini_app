const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    default: null
  },
  tickets: [{
    eventId: String,
    quantity: Number,
    purchaseDate: Date,
    ticketToken: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 