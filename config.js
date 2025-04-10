module.exports = {
    botToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
    webhookSecret: process.env.WEBHOOK_SECRET || 'your-secret-webhook-token',
    adminChatId: process.env.ADMIN_CHAT_ID,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nft-ticketing',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
    maxAttempts: 3,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
};
