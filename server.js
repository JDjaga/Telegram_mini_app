require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const open = require('open');
const { TelegramBot } = require('node-telegram-bot-api');
const { botToken, webhookSecret } = require('./config');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;
const isDev = process.env.NODE_ENV !== 'production';

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Initialize Telegram Bot
let bot;
try {
    bot = new TelegramBot(botToken, { polling: false });
    console.log('Telegram bot initialized successfully');
} catch (error) {
    console.error('Error initializing Telegram bot:', error);
}

// Webhook middleware with security
app.post('/webhook', (req, res) => {
    if (!bot) {
        return res.status(500).send('Bot not initialized');
    }

    // In development, skip webhook signature verification
    if (!isDev) {
        const signature = req.headers['x-telegram-bot-api-secret-token'];
        if (signature !== webhookSecret) {
            console.error('Invalid webhook signature');
            return res.status(403).send('Invalid signature');
        }
    }

    try {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Error processing update');
    }
});

// API routes go here
// ...

// For any request that doesn't match an API route, send the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nft-ticketing', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    authSource: 'admin'
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Start the server and open the application
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    try {
        if (isDev) {
            // In development, use polling instead of webhook
            bot.startPolling();
            console.log('Bot started in polling mode');
        } else {
            // Set webhook with secret
            const webhookUrl = process.env.WEBHOOK_URL || `https://your-domain.com/webhook`;
            await bot.setWebhook(webhookUrl, {
                secret_token: webhookSecret
            });
            console.log('Webhook set successfully');
        }
    } catch (err) {
        console.error('Bot initialization error:', err);
    }
    
    // Open the application in the default browser
    await open(`http://localhost:${PORT}`);
    console.log('Application opened in browser');
});
