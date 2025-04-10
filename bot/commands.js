const { Bot } = require('grammy');
const config = require('./config');

const bot = new Bot(config.BOT_TOKEN);

// Command to start the bot
bot.command('start', async (ctx) => {
  await ctx.reply(
    'Welcome to NFT Ticketing Hub!\n\n' +
    'Available commands:\n' +
    '/connect - Connect your wallet\n' +
    '/portfolio - View your NFT collection\n' +
    '/events - Browse upcoming events\n' +
    '/tickets - View your tickets\n' +
    '/help - Show this help message\n' +
    '/create_event - Create a new event\n' +
    '/get_chat_id - Get your chat ID\n' +
    '/webapp - Open the web application'
  );
});

// Command to show help
bot.command('help', async (ctx) => {
  await ctx.reply(
    'Available commands:\n\n' +
    '/connect - Connect your wallet\n' +
    '/portfolio - View your NFT collection\n' +
    '/events - Browse upcoming events\n' +
    '/tickets - View your tickets\n' +
    '/help - Show this help message\n' +
    '/create_event - Create a new event\n' +
    '/get_chat_id - Get your chat ID\n' +
    '/webapp - Open the web application'
  );
});

// Command to open webapp
bot.command('webapp', async (ctx) => {
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

// Command to connect wallet
bot.command('connect', async (ctx) => {
  await ctx.reply('Please enter your wallet address:');
  // Store the state that user is waiting for wallet address
  ctx.session = { waitingFor: 'wallet_address' };
});

// Command to view portfolio
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

// Command to browse events
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

// Command to view tickets
bot.command('tickets', async (ctx) => {
  await ctx.reply('View your tickets...', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'View Tickets',
          web_app: { url: `${config.WEBAPP_URL}/tickets` }
        }
      ]]
    }
  });
});

// Command to create event
bot.command('create_event', async (ctx) => {
  await ctx.reply('Please provide event details:\nName,Date,Location,TicketPrice,TicketToken,AvailableTickets\n\nExample:\nWeb3 Conference,2025-04-15,Online,100,HTR,50');
  ctx.session = { waitingFor: 'event_details' };
});

// Command to get chat ID
bot.command('get_chat_id', async (ctx) => {
  await ctx.reply(`Your chat ID is: ${ctx.from.id}`);
});

// Handle text messages for wallet address and event details
bot.on('message:text', async (ctx) => {
  if (ctx.session?.waitingFor === 'wallet_address') {
    // Handle wallet address
    const walletAddress = ctx.message.text;
    // Store wallet address in database or session
    await ctx.reply(`Wallet address ${walletAddress} connected successfully!`);
    ctx.session = null;
  } else if (ctx.session?.waitingFor === 'event_details') {
    // Handle event details
    const eventDetails = ctx.message.text.split(',');
    if (eventDetails.length === 6) {
      const [name, date, location, price, token, tickets] = eventDetails;
      // Store event details in database
      await ctx.reply(`Event "${name}" created successfully!`);
    } else {
      await ctx.reply('Invalid format. Please use the format: Name,Date,Location,TicketPrice,TicketToken,AvailableTickets');
    }
    ctx.session = null;
  }
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