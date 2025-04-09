const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Store user sessions
const userSessions = new Map();

// Handle Telegram commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to Hather Blockchain Ticket Book!\n\n' +
    'You can:\n' +
    '• View your NFT portfolio\n' +
    '• Browse upcoming events\n' +
    '• Purchase event tickets\n' +
    '• Join communities\n' +
    '• Manage your wallet\n\n' +
    'To get started, please connect your wallet.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Connect Wallet', callback_data: 'connect_wallet' }]
        ]
      }
    });
});

// Handle inline keyboard callbacks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  switch (data) {
    case 'connect_wallet':
      await bot.sendMessage(chatId, 'Please enter your wallet address:');
      userSessions.set(chatId, { step: 'waiting_for_wallet' });
      break;

    case 'view_nfts':
      const walletAddress = userSessions.get(chatId)?.walletAddress;
      if (!walletAddress) {
        await bot.sendMessage(chatId, 'Please connect your wallet first!');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/nfts/wallet/${walletAddress}`);
        const nfts = response.data;
        
        if (nfts.length === 0) {
          await bot.sendMessage(chatId, 'No NFTs found in your portfolio.');
          return;
        }

        const nftList = nfts.map(nft => `
          • ${nft.name}\n` +
          `  Token ID: ${nft.tokenIndex}\n` +
          `  Description: ${nft.description}\n`);

        await bot.sendMessage(chatId, `Your NFT Portfolio:\n\n${nftList.join('\n')}`);
      } catch (error) {
        await bot.sendMessage(chatId, 'Error fetching NFTs. Please try again later.');
      }
      break;

    case 'view_events':
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        const events = response.data;
        
        if (events.length === 0) {
          await bot.sendMessage(chatId, 'No upcoming events found.');
          return;
        }

        const eventList = events.map(event => `
          • ${event.name}\n` +
          `  Date: ${new Date(event.date).toLocaleDateString()}\n` +
          `  Location: ${event.location}\n` +
          `  Price: ${event.ticketPrice} ${event.ticketToken}\n`);

        await bot.sendMessage(chatId, `Upcoming Events:\n\n${eventList.join('\n')}`);
      } catch (error) {
        await bot.sendMessage(chatId, 'Error fetching events. Please try again later.');
      }
      break;
  }
});

// Handle text messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const session = userSessions.get(chatId);

  if (session?.step === 'waiting_for_wallet') {
    const walletAddress = msg.text;
    userSessions.set(chatId, { walletAddress });
    await bot.sendMessage(chatId, 'Wallet connected successfully!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'View NFTs', callback_data: 'view_nfts' }],
          [{ text: 'View Events', callback_data: 'view_events' }]
        ]
      }
    });
  }
});

// Export the bot instance and session management
module.exports = {
  bot,
  userSessions
};
