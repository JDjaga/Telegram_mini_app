require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  // Telegram WebApp URLs must be HTTPS and match the domain you registered with @BotFather
  WEBAPP_URL: process.env.WEBAPP_URL || 'https://t.me/HathorEventBot/app',
  MONGODB_URI: process.env.MONGODB_URI,
  HATHOR_NETWORK: process.env.HATHOR_NETWORK || 'mainnet',
  PORT: process.env.PORT || 3000,
}; 