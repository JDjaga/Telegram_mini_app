const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');
const hathor = require('./services/hathor');

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Helper function to check if user is admin
const isAdmin = (chatId) => {
  const adminIds = process.env.ADMIN_CHAT_IDS.split(',');
  return adminIds.includes(chatId.toString());
};

// Helper function to get user from database
const getUser = async (telegramId) => {
  try {
    return await User.findOne({ telegramId });
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.chat.id.toString();
  
  try {
    // Create user if they don't exist
    const user = await getUser(telegramId);
    if (!user) {
      await User.create({ telegramId });
    }
    
    // Create a keyboard with a button to open the web app
    const keyboard = {
      inline_keyboard: [
        [{ text: 'Open NFT Ticketing Hub', web_app: { url: process.env.WEBAPP_URL || 'http://localhost:3000' } }]
      ]
    };
    
    bot.sendMessage(chatId, 'Welcome to NFT Ticketing Hub!\n\n' +
      'Available commands:\n' +
      '/connect - Connect your wallet\n' +
      '/portfolio - View your NFT collection\n' +
      '/events - Browse upcoming events\n' +
      '/tickets - View your tickets\n' +
      '/help - Show this help message\n' +
      (isAdmin(chatId) ? '/create_event - Create a new event\n' : '') +
      '/get_chat_id - Get your chat ID\n' +
      '/webapp - Open the web application', { reply_markup: keyboard });
  } catch (error) {
    console.error('Error in /start command:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again.');
  }
});

// Handle /connect command
bot.onText(/\/connect/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const telegramId = msg.chat.id.toString();
    
    const user = await getUser(telegramId);
    if (user && user.walletAddress) {
      bot.sendMessage(chatId, 'You already have a connected wallet:\n' +
        `${user.walletAddress}\n\n` +
        'To connect a new wallet, please use the /disconnect command first.');
      return;
    }
    
    bot.sendMessage(chatId, 'Please enter your wallet address:');
    
    // Create a one-time message listener for the wallet address
    const messageListener = async (message) => {
      if (message.chat.id === chatId && message.text && !message.text.startsWith('/')) {
        const walletAddress = message.text.trim();
        
        // Update user with new wallet address
        await User.updateOne({ telegramId }, { walletAddress });
        
        bot.sendMessage(chatId, 'Wallet connected successfully!\n\n' +
          `Your wallet address: ${walletAddress}\n\n` +
          'You can now use the bot to view your NFTs and purchase tickets.');
        
        // Remove the message listener after processing
        bot.removeListener('message', messageListener);
      }
    };

    // Add the message listener
    bot.on('message', messageListener);
  } catch (error) {
    console.error('Error in /connect command:', error);
    bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
});

// Handle /portfolio command
bot.onText(/\/portfolio/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const telegramId = msg.chat.id.toString();
    
    const user = await getUser(telegramId);
    if (!user || !user.walletAddress) {
      bot.sendMessage(chatId, 'Please connect your wallet first using /connect');
      return;
    }

    const nfts = await hathor.getNFTs(user.walletAddress);
    
    if (nfts.length === 0) {
      bot.sendMessage(chatId, 'No NFTs found in your portfolio.\n\n' +
        'You can purchase NFTs from our marketplace!');
      return;
    }

    let message = 'Your NFT Collection:\n\n';
    nfts.forEach((nft, index) => {
      message += `${index + 1}. ${nft.name}\n`;
      message += `Token ID: ${nft.tokenIndex}\n`;
      message += `Description: ${nft.description}\n`;
      message += `Balance: ${nft.balance}\n`;
      message += `Metadata: ${JSON.stringify(nft.metadata)}\n\n`;
    });

    bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Error in /portfolio command:', error);
    bot.sendMessage(msg.chat.id, 'Error fetching NFTs. Please try again later.');
  }
});

// Handle /events command
bot.onText(/\/events/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const events = await hathor.getEvents();
    
    if (events.length === 0) {
      bot.sendMessage(chatId, 'No upcoming events found.\n\n' +
        'Admins can create events using /create_event');
      return;
    }

    let message = 'Upcoming Events:\n\n';
    events.forEach((event, index) => {
      message += `${index + 1}. ${event.name}\n`;
      message += `Date: ${new Date(event.date).toLocaleDateString()}\n`;
      message += `Location: ${event.location}\n`;
      message += `Price: ${event.ticketPrice} ${event.ticketToken}\n`;
      message += `Available Tickets: ${event.availableTickets}\n\n`;
      message += `To purchase tickets, use: /buy ${event.id}\n\n`;
    });

    bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Error in /events command:', error);
    bot.sendMessage(msg.chat.id, 'Error fetching events. Please try again later.');
  }
});

// Handle /tickets command
bot.onText(/\/tickets/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const telegramId = msg.chat.id.toString();
    
    const user = await getUser(telegramId);
    if (!user || !user.walletAddress) {
      bot.sendMessage(chatId, 'Please connect your wallet first using /connect');
      return;
    }

    if (user.tickets.length === 0) {
      bot.sendMessage(chatId, 'No tickets found.\n\n' +
        'Browse upcoming events using /events');
      return;
    }

    let message = 'Your Tickets:\n\n';
    user.tickets.forEach((ticket, index) => {
      message += `${index + 1}. Event ID: ${ticket.eventId}\n`;
      message += `Quantity: ${ticket.quantity}\n`;
      message += `Purchase Date: ${new Date(ticket.purchaseDate).toLocaleDateString()}\n`;
      message += `Token: ${ticket.ticketToken}\n\n`;
    });

    bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Error in /tickets command:', error);
    bot.sendMessage(msg.chat.id, 'Error fetching your tickets. Please try again later.');
  }
});

// Handle /buy command
bot.onText(/\/buy ([\w-]+)/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const telegramId = msg.chat.id.toString();
    const eventId = match[1];
    
    const user = await getUser(telegramId);
    if (!user || !user.walletAddress) {
      bot.sendMessage(chatId, 'Please connect your wallet first using /connect');
      return;
    }

    const events = await hathor.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) {
      bot.sendMessage(chatId, 'Invalid event ID. Use /events to see available events.');
      return;
    }

    bot.sendMessage(chatId, `How many tickets would you like to purchase for ${event.name}?\n` +
      `Price per ticket: ${event.ticketPrice} ${event.ticketToken}\n` +
      `Available Tickets: ${event.availableTickets}`);

    // Create a one-time message listener for the ticket quantity
    const messageListener = async (message) => {
      if (message.chat.id === chatId && message.text && !message.text.startsWith('/')) {
        const quantity = parseInt(message.text);
        
        if (isNaN(quantity) || quantity <= 0) {
          bot.sendMessage(chatId, 'Please enter a valid number of tickets.');
          return;
        }

        const purchaseResult = await hathor.purchaseTicket(eventId, user.walletAddress, quantity);
        
        // Update user's tickets
        user.tickets.push({
          eventId,
          quantity,
          purchaseDate: purchaseResult.purchaseDate,
          ticketToken: purchaseResult.ticketToken
        });
        await user.save();

        bot.sendMessage(chatId, `Successfully purchased ${quantity} ticket(s) for ${event.name}!\n\n` +
          `Total amount: ${event.ticketPrice * quantity} ${event.ticketToken}\n\n` +
          'Your tickets are now in your account.');

        // Remove the message listener after processing
        bot.removeListener('message', messageListener);
      }
    };

    // Add the message listener
    bot.on('message', messageListener);
  } catch (error) {
    console.error('Error in /buy command:', error);
    bot.sendMessage(msg.chat.id, 'Error purchasing tickets. Please try again later.');
  }
});

// Handle /create_event command (admin only)
bot.onText(/\/create_event/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    
    if (!isAdmin(chatId)) {
      bot.sendMessage(chatId, 'Sorry, only admins can create events.');
      return;
    }

    bot.sendMessage(chatId, 'Please provide event details:\n' +
        'Name,Date,Location,TicketPrice,TicketToken,AvailableTickets\n\n' +
        'Example:\n' +
        'Web3 Conference,2025-04-15,Online,100,HTR,50');

    // Create a one-time message listener for the event details
    const messageListener = async (message) => {
      if (message.chat.id === chatId && message.text && !message.text.startsWith('/')) {
        const details = message.text.split(',').map(d => d.trim());
        
        if (details.length !== 6) {
          bot.sendMessage(chatId, 'Invalid format. Please try again:\n' +
              'Name,Date,Location,TicketPrice,TicketToken,AvailableTickets');
          return;
        }

        const [name, date, location, price, token, tickets] = details;
        
        // Create event using your service
        const event = await hathor.createEvent({
          name,
          date,
          location,
          ticketPrice: price,
          ticketToken: token,
          availableTickets: tickets
        });

        bot.sendMessage(chatId, `Event created successfully!\n\n` +
            `Event ID: ${event.id}\n` +
            `Name: ${name}\n` +
            `Date: ${date}\n` +
            `Location: ${location}\n` +
            `Ticket Price: ${price} ${token}\n` +
            `Available Tickets: ${tickets}`);

        // Remove the message listener after processing
        bot.removeListener('message', messageListener);
      }
    };

    // Add the message listener
    bot.on('message', messageListener);
  } catch (error) {
    console.error('Error in /create_event command:', error);
    bot.sendMessage(msg.chat.id, 'Error creating event. Please try again.');
  }
});

// Handle /help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Available commands:\n' +
    '/connect - Connect your wallet\n' +
    '/portfolio - View your NFT collection\n' +
    '/events - Browse upcoming events\n' +
    '/tickets - View your tickets\n' +
    '/help - Show this help message\n' +
    (isAdmin(chatId) ? '/create_event - Create a new event\n' : '') +
    '/get_chat_id - Get your chat ID');
});

// Handle /get_chat_id command
bot.onText(/\/get_chat_id/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Your chat ID is: ${chatId}`);
});

// Handle /webapp command
bot.onText(/\/webapp/, (msg) => {
  const chatId = msg.chat.id;
  
  // Create a keyboard with a button to open the web app
  const keyboard = {
    inline_keyboard: [
      [{ text: 'Open NFT Ticketing Hub', web_app: { url: process.env.WEBAPP_URL || 'http://localhost:3000' } }]
    ]
  };
  
  bot.sendMessage(chatId, 'Click the button below to open the NFT Ticketing Hub:', { reply_markup: keyboard });
});

// Error handling for bot
bot.on('polling_error', (error) => {
  console.error('Telegram Bot polling error:', error);
});

console.log('Bot is running...');

module.exports = bot;
