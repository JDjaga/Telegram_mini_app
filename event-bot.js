require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Track users waiting for event details
const waitingForEventDetails = new Set();

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Event Bot!\n\n' +
        'Available commands:\n' +
        '/create_event - Create a new event\n' +
        '/help - Show this help message');
});

// Handle /create_event command
bot.onText(/\/create_event/, (msg) => {
    const chatId = msg.chat.id;
    
    // Clear any previous waiting state
    waitingForEventDetails.delete(chatId);
    
    bot.sendMessage(chatId, 'Please provide event details:\n' +
        'Name,Date,Location,TicketPrice,TicketToken,AvailableTickets\n\n' +
        'Example:\n' +
        'Web3 Conference,2025-04-15,Online,100,HTR,50');

    // Add user to waiting list
    waitingForEventDetails.add(chatId);

    // Handle next message
    bot.on('message', async (message) => {
        if (message.chat.id === chatId && waitingForEventDetails.has(chatId)) {
            const details = message.text.split(',').map(d => d.trim());
            
            if (details.length === 6) {
                const [name, date, location, price, token, tickets] = details;
                
                bot.sendMessage(chatId, `Event created successfully!\n\n` +
                    `Name: ${name}\n` +
                    `Date: ${date}\n` +
                    `Location: ${location}\n` +
                    `Ticket Price: ${price} ${token}\n` +
                    `Available Tickets: ${tickets}`);
            } else {
                bot.sendMessage(chatId, 'Invalid format. Please try again:\n' +
                    'Name,Date,Location,TicketPrice,TicketToken,AvailableTickets');
            }

            // Remove from waiting list
            waitingForEventDetails.delete(chatId);
        }
    });
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Available commands:\n' +
        '/create_event - Create a new event\n' +
        '/help - Show this help message');
});

console.log('Event bot is running...');
