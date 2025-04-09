const { Bot } = require('grammy');
const config = require('./config');

const bot = new Bot(config.BOT_TOKEN);

// Command to start the bot
bot.command('start', async (ctx) => {
  await ctx.reply(
    'Welcome to Hathor Event Bot! 🎉\n\n' +
    'I can help you manage your NFT portfolio and event tickets.\n\n' +
    'Use /portfolio to view your NFT portfolio\n' +
    'Use /events to browse upcoming events\n' +
    'Use /help to see all available commands'
  );
});

// Command to show help
bot.command('help', async (ctx) => {
  await ctx.reply(
    'Available commands:\n\n' +
    '/start - Start the bot\n' +
    '/portfolio - View your NFT portfolio\n' +
    '/events - Browse upcoming events\n' +
    '/help - Show this help message'
  );
});

// Command to open portfolio
bot.command('portfolio', async (ctx) => {
  await ctx.reply('Opening your NFT portfolio...', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Open NFT Portfolio',
          web_app: { url: `${config.WEBAPP_URL}/portfolio` }
        }
      ]]
    }
  });
});

// Command to open events
bot.command('events', async (ctx) => {
  await ctx.reply('Browse upcoming events...', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Open Event Hub',
          web_app: { url: `${config.WEBAPP_URL}/events` }
        }
      ]]
    }
  });
});

// Command to open the main hub
bot.command('hub', async (ctx) => {
  await ctx.reply('Opening NFT Ticketing Hub...', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Open NFT Ticketing Hub',
          web_app: { url: config.WEBAPP_URL }
        }
      ]]
    }
  });
});

// Handle WebApp data
bot.on('web_app_data', async (ctx) => {
  const data = ctx.webAppData.data;
  console.log('Received WebApp data:', data);
  
  // Handle different types of data from the WebApp
  try {
    const parsedData = JSON.parse(data);
    
    switch (parsedData.type) {
      case 'connect_wallet':
        await ctx.reply('Wallet connection request received. Processing...');
        break;
      case 'purchase_ticket':
        await ctx.reply('Ticket purchase request received. Processing...');
        break;
      default:
        await ctx.reply('Received data from WebApp');
    }
  } catch (error) {
    console.error('Error processing WebApp data:', error);
    await ctx.reply('Error processing request');
  }
});

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err);
});

module.exports = bot; 