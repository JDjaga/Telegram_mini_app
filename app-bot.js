require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const Community = require('./models/Community');
const User = require('./models/User');
const Event = require('./models/Event');
const hathorService = require('./services/hathor');

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Track users waiting for input
const waitingForDetails = new Map();

// Additional language support
const languages = {
    'EN': {
        commands: {
            create_community: 'Create a new community',
            join_community: 'Join an existing community',
            search_community: 'Search for communities',
            create_event: 'Create a new event',
            events: 'Browse upcoming events',
            tickets: 'View your tickets',
            buy: 'Purchase tickets',
            my_profile: 'View your profile',
            set_language: 'Change language',
            help: 'Show this help message',
            admin_panel: 'Admin panel',
            view_users: 'View users',
            view_communities: 'View communities',
            set_admin: 'Set admin',
            remove_admin: 'Remove admin',
            back: 'Back'
        },
        messages: {
            welcome: 'Welcome to NFT Ticketing Hub!',
            invalid_format: 'Invalid format. Please check your input and try again.',
            item_exists: 'This item already exists. Please try a different name/token.',
            not_found: 'The requested item was not found. Please check your input and try again.',
            unexpected_error: 'An unexpected error occurred. Please try again later.',
            success: 'Successfully completed the operation.',
            admin_only: 'Sorry, only admins can perform this action.',
            unknown_command: 'Unknown command. Use /help to see available commands.'
        }
    },
    'ES': {
        commands: {
            create_community: 'Crear una nueva comunidad',
            join_community: 'Unirse a una comunidad',
            search_community: 'Buscar comunidades',
            create_event: 'Crear un nuevo evento',
            events: 'Ver eventos próximos',
            tickets: 'Ver tus tickets',
            buy: 'Comprar tickets',
            my_profile: 'Ver tu perfil',
            set_language: 'Cambiar idioma',
            help: 'Mostrar este mensaje',
            admin_panel: 'Panel de administración',
            view_users: 'Ver usuarios',
            view_communities: 'Ver comunidades',
            set_admin: 'Asignar administrador',
            remove_admin: 'Remover administrador',
            back: 'Volver'
        },
        messages: {
            welcome: '¡Bienvenido a NFT Ticketing Hub!',
            invalid_format: 'Formato inválido. Por favor, verifica tu entrada e inténtalo nuevamente.',
            item_exists: 'Este elemento ya existe. Por favor, intenta con un nombre/token diferente.',
            not_found: 'El elemento solicitado no se encontró. Por favor, verifica tu entrada e inténtalo nuevamente.',
            unexpected_error: 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente más tarde.',
            success: 'Operación completada exitosamente.',
            admin_only: 'Lo siento, solo los administradores pueden realizar esta acción.',
            unknown_command: 'Comando desconocido. Usa /help para ver los comandos disponibles.'
        }
    },
    'FR': {
        commands: {
            create_community: 'Créer une nouvelle communauté',
            join_community: 'Rejoindre une communauté',
            search_community: 'Rechercher des communautés',
            create_event: 'Créer un nouvel événement',
            events: 'Voir les événements à venir',
            tickets: 'Voir vos billets',
            buy: 'Acheter des billets',
            my_profile: 'Voir votre profil',
            set_language: 'Changer de langue',
            help: 'Afficher cette aide',
            admin_panel: 'Panneau d\'administration',
            view_users: 'Voir les utilisateurs',
            view_communities: 'Voir les communautés',
            set_admin: 'Définir comme administrateur',
            remove_admin: 'Supprimer l\'administrateur',
            back: 'Retour'
        },
        messages: {
            welcome: 'Bienvenue sur NFT Ticketing Hub !',
            invalid_format: 'Format invalide. Veuillez vérifier votre saisie et réessayer.',
            item_exists: 'Cet élément existe déjà. Veuillez utiliser un nom/token différent.',
            not_found: 'L\'élément demandé n\'a pas été trouvé. Veuillez vérifier votre saisie et réessayer.',
            unexpected_error: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
            success: 'Opération effectuée avec succès.',
            admin_only: 'Désolé, seul les administrateurs peuvent effectuer cette action.',
            unknown_command: 'Commande inconnue. Utilisez /help pour voir les commandes disponibles.'
        }
    },
    'DE': {
        commands: {
            create_community: 'Eine neue Community erstellen',
            join_community: 'Einer Community beitreten',
            search_community: 'Communities suchen',
            create_event: 'Ein neues Event erstellen',
            events: 'Kommende Events anzeigen',
            tickets: 'Ihre Tickets anzeigen',
            buy: 'Tickets kaufen',
            my_profile: 'Ihr Profil anzeigen',
            set_language: 'Sprache ändern',
            help: 'Diese Hilfe anzeigen',
            admin_panel: 'Admin-Panel',
            view_users: 'Benutzer anzeigen',
            view_communities: 'Communities anzeigen',
            set_admin: 'Als Administrator einstellen',
            remove_admin: 'Administrator entfernen',
            back: 'Zurück'
        },
        messages: {
            welcome: 'Willkommen bei NFT Ticketing Hub!',
            invalid_format: 'Ungültiges Format. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.',
            item_exists: 'Dieses Element existiert bereits. Bitte verwenden Sie einen anderen Namen/Token.',
            not_found: 'Das angeforderte Element wurde nicht gefunden. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.',
            unexpected_error: 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
            success: 'Die Operation wurde erfolgreich abgeschlossen.',
            admin_only: 'Entschuldigung, nur Administratoren können diese Aktion ausführen.',
            unknown_command: 'Unbekannter Befehl. Verwenden Sie /help für verfügbare Befehle.'
        }
    },
    'IT': {
        commands: {
            create_community: 'Crea una nuova comunità',
            join_community: 'Unisciti a una comunità',
            search_community: 'Cerca comunità',
            create_event: 'Crea un nuovo evento',
            events: 'Visualizza eventi futuri',
            tickets: 'Visualizza i tuoi biglietti',
            buy: 'Acquista biglietti',
            my_profile: 'Visualizza il tuo profilo',
            set_language: 'Cambia lingua',
            help: 'Mostra questo messaggio',
            admin_panel: 'Pannello amministrativo',
            view_users: 'Visualizza utenti',
            view_communities: 'Visualizza comunità',
            set_admin: 'Imposta amministratore',
            remove_admin: 'Rimuovi amministratore',
            back: 'Indietro'
        },
        messages: {
            welcome: 'Benvenuto su NFT Ticketing Hub!',
            invalid_format: 'Formato non valido. Per favore, verifica il tuo input e riprova.',
            item_exists: 'Questo elemento esiste già. Per favore, usa un nome/token diverso.',
            not_found: 'L\'elemento richiesto non è stato trovato. Per favore, verifica il tuo input e riprova.',
            unexpected_error: 'Si è verificato un errore inaspettato. Per favore, riprova più tardi.',
            success: 'Operazione completata con successo.',
            admin_only: 'Mi dispiace, solo gli amministratori possono eseguire questa azione.',
            unknown_command: 'Comando sconosciuto. Usa /help per vedere i comandi disponibili.'
        }
    }
};

// Enhanced validation functions
const validateCommunityDetails = (details) => {
    const [name, description, tokenSymbol, tokenSupply] = details;
    
    if (!name || !description || !tokenSymbol || !tokenSupply) {
        return 'All fields are required: Name, Description, TokenSymbol, TokenSupply';
    }
    
    // Name validation
    if (name.length > 50) {
        return 'Community name must be less than 50 characters';
    }
    if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
        return 'Community name can only contain letters, numbers, spaces, and hyphens';
    }
    
    // Description validation
    if (description.length > 200) {
        return 'Description must be less than 200 characters';
    }
    if (!/^[a-zA-Z0-9\s.,!?-]+$/.test(description)) {
        return 'Description can only contain letters, numbers, spaces, and basic punctuation';
    }
    
    // Token symbol validation
    if (tokenSymbol.length > 5) {
        return 'Token symbol must be less than 5 characters';
    }
    if (!/^[A-Z]+$/.test(tokenSymbol)) {
        return 'Token symbol must be uppercase letters only';
    }
    
    // Token supply validation
    if (isNaN(tokenSupply)) {
        return 'Token supply must be a number';
    }
    const supply = parseInt(tokenSupply);
    if (supply <= 0) {
        return 'Token supply must be a positive number';
    }
    if (supply > 1000000) {
        return 'Token supply cannot exceed 1,000,000';
    }
    if (supply % 1 !== 0) {
        return 'Token supply must be a whole number';
    }
    
    return null;
};

const validateEventDetails = (details) => {
    const [name, date, location, price, token, tickets] = details;
    
    if (!name || !date || !location || !price || !token || !tickets) {
        return 'All fields are required: Name, Date, Location, Price, Token, Tickets';
    }
    
    // Name validation
    if (name.length > 100) {
        return 'Event name must be less than 100 characters';
    }
    if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
        return 'Event name can only contain letters, numbers, spaces, and hyphens';
    }
    
    // Date validation
    if (isNaN(new Date(date))) {
        return 'Invalid date format. Please use YYYY-MM-DD';
    }
    const eventDate = new Date(date);
    if (eventDate < new Date()) {
        return 'Event date cannot be in the past';
    }
    
    // Location validation
    if (location.length > 150) {
        return 'Location must be less than 150 characters';
    }
    
    // Price validation
    if (isNaN(price)) {
        return 'Price must be a number';
    }
    const ticketPrice = parseFloat(price);
    if (ticketPrice <= 0) {
        return 'Price must be a positive number';
    }
    if (ticketPrice > 10000) {
        return 'Price cannot exceed 10,000';
    }
    
    // Token validation
    if (!/^[A-Z]+$/.test(token)) {
        return 'Token symbol must be uppercase letters only';
    }
    
    // Tickets validation
    if (isNaN(tickets)) {
        return 'Number of tickets must be a number';
    }
    const ticketCount = parseInt(tickets);
    if (ticketCount <= 0) {
        return 'Number of tickets must be a positive number';
    }
    if (ticketCount > 1000) {
        return 'Cannot create more than 1,000 tickets for a single event';
    }
    
    return null;
};

// Helper function to check if user is admin
const isAdmin = async (chatId) => {
    try {
        const user = await User.findOne({ telegramId: chatId.toString() });
        return user && user.isAdmin;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

// Enhanced user management
const getUser = async (telegramId) => {
    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            const newUser = await User.create({ 
                telegramId,
                createdAt: new Date(),
                language: 'en',
                timezone: 'UTC'
            });
            return newUser;
        }
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

// Handle /start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Create user if they don't exist
        await getUser(chatId.toString());
        
        // Send welcome message with keyboard options
        const keyboard = {
            reply_markup: JSON.stringify({
                keyboard: [
                    ['/create_community', '/join_community'],
                    ['/create_event', '/events'],
                    ['/tickets', '/help']
                ],
                resize_keyboard: true
            })
        };

        const user = await getUser(chatId.toString());
        const language = user.language || 'EN';
        const message = languages[language].messages.welcome + '\n\n' +
            'Please select an option from the keyboard below:';

        bot.sendMessage(chatId, message, keyboard);
    } catch (error) {
        console.error('Error in /start command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle /create_community command
bot.onText(/\/create_community/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        if (!(await isAdmin(chatId))) {
            bot.sendMessage(chatId, languages['EN'].messages.admin_only);
            return;
        }

        const user = await getUser(chatId.toString());
        const language = user.language || 'EN';
        const message = languages[language].commands.create_community + '\n\n' +
            'Please provide community details:\n' +
            'Name,Description,TokenSymbol,TokenSupply\n\n' +
            'Example:\n' +
            'Web3 Developers,Community for Web3 developers,HTR,10000\n\n' +
            'Rules:\n' +
            '- Name must be less than 50 characters\n' +
            '- Token symbol must be less than 5 characters\n' +
            '- Token supply must be a positive number';

        bot.sendMessage(chatId, message);
        waitingForDetails.set(chatId, 'community');
    } catch (error) {
        console.error('Error in /create_community command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle /join_community command
bot.onText(/\/join_community/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const user = await getUser(chatId.toString());
        const language = user.language || 'EN';
        const message = languages[language].commands.join_community + '\n\n' +
            'Please provide the community token or name to join:\n\n' +
            'You can also search for communities using:\n' +
            '/search_community [keyword]';

        bot.sendMessage(chatId, message);
        waitingForDetails.set(chatId, 'join_community');
    } catch (error) {
        console.error('Error in /join_community command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle /search_community command
bot.onText(/\/search_community ([\w\s]+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const keyword = match[1];
    
    try {
        const communities = await Community.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).limit(5);

        if (communities.length === 0) {
            bot.sendMessage(chatId, 'No communities found. Try a different keyword.');
            return;
        }

        let message = 'Search results:\n\n';
        communities.forEach((community, index) => {
            message += `${index + 1}. ${community.name}\n`;
            message += `Token: ${community.tokenSymbol}\n`;
            message += `Members: ${community.members.length}\n\n`;
            message += `Join using: /join ${community.tokenSymbol}\n\n`;
        });

        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error in /search_community command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle /create_event command
bot.onText(/\/create_event/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        if (!(await isAdmin(chatId))) {
            bot.sendMessage(chatId, languages['EN'].messages.admin_only);
            return;
        }

        const user = await getUser(chatId.toString());
        const language = user.language || 'EN';
        const message = languages[language].commands.create_event + '\n\n' +
            'Please provide event details:\n' +
            'Name,Date,Location,Price,Token,Tickets\n\n' +
            'Example:\n' +
            'Web3 Conference,2025-04-15,Online,100,HTR,50\n\n' +
            'Rules:\n' +
            '- Name must be less than 100 characters\n' +
            '- Date format: YYYY-MM-DD\n' +
            '- Price must be a positive number\n' +
            '- Number of tickets must be a positive number';

        bot.sendMessage(chatId, message);
        waitingForDetails.set(chatId, 'event');
    } catch (error) {
        console.error('Error in /create_event command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle /events command
bot.onText(/\/events/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const events = await Event.find({});
        
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
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle /tickets command
bot.onText(/\/tickets/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const user = await getUser(chatId.toString());
        if (!user.tickets.length) {
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
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle /buy command
bot.onText(/\/buy ([\w-]+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const eventId = match[1];
    
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            bot.sendMessage(chatId, 'Invalid event ID. Use /events to see available events.');
            return;
        }

        const message = `How many tickets would you like to purchase for ${event.name}?\n` +
            `Price per ticket: ${event.ticketPrice} ${event.ticketToken}\n` +
            `Available Tickets: ${event.availableTickets}\n\n` +
            'Please enter a number between 1 and ' + event.availableTickets;

        bot.sendMessage(chatId, message);
        waitingForDetails.set(chatId, `buy_${eventId}`);
    } catch (error) {
        console.error('Error in /buy command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Handle all messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const waitingType = waitingForDetails.get(chatId);

    if (!waitingType) return;

    try {
        switch (waitingType) {
            case 'community':
                const communityDetails = text.split(',').map(d => d.trim());
                const communityValidationError = validateCommunityDetails(communityDetails);
                
                if (communityValidationError) {
                    bot.sendMessage(chatId, `Invalid format: ${communityValidationError}\n\n` +
                        'Please try again with correct format:\n' +
                        'Name,Description,TokenSymbol,TokenSupply');
                    return;
                }

                const [communityName, communityDescription, communityTokenSymbol, communityTokenSupply] = communityDetails;
                
                // Check if community already exists
                if (await Community.findOne({ tokenSymbol: communityTokenSymbol })) {
                    bot.sendMessage(chatId, 'A community with this token symbol already exists.\n\n' +
                        'Please try a different token symbol.');
                    return;
                }

                const newCommunity = await Community.create({
                    name: communityName,
                    description: communityDescription,
                    tokenSymbol: communityTokenSymbol,
                    tokenSupply: parseInt(communityTokenSupply)
                });
                
                bot.sendMessage(chatId, `Community created successfully!\n\n` +
                    `Name: ${newCommunity.name}\n` +
                    `Token: ${newCommunity.tokenSymbol}\n` +
                    `Total Supply: ${newCommunity.tokenSupply}`);
                break;

            case 'event':
                const eventDetails = text.split(',').map(d => d.trim());
                const eventValidationError = validateEventDetails(eventDetails);
                
                if (eventValidationError) {
                    bot.sendMessage(chatId, `Invalid format: ${eventValidationError}\n\n` +
                        'Please try again with correct format:\n' +
                        'Name,Date,Location,Price,Token,Tickets');
                    return;
                }

                const [eventName, eventDate, eventLocation, eventPrice, eventToken, eventTickets] = eventDetails;
                
                // Check if token exists
                const tokenCommunity = await Community.findOne({ tokenSymbol: eventToken });
                if (!tokenCommunity) {
                    bot.sendMessage(chatId, 'Invalid token symbol. Please use an existing community token.');
                    return;
                }

                const newEvent = await Event.create({
                    name: eventName,
                    date: new Date(eventDate),
                    location: eventLocation,
                    ticketPrice: parseFloat(eventPrice),
                    ticketToken: eventToken,
                    availableTickets: parseInt(eventTickets)
                });
                
                bot.sendMessage(chatId, `Event created successfully!\n\n` +
                    `Event ID: ${newEvent._id}\n` +
                    `Name: ${newEvent.name}\n` +
                    `Date: ${newEvent.date}\n` +
                    `Location: ${newEvent.location}\n` +
                    `Price: ${newEvent.ticketPrice} ${newEvent.ticketToken}\n` +
                    `Tickets: ${newEvent.availableTickets}`);
                break;

            case 'buy_event':
                const quantity = parseInt(text);
                if (isNaN(quantity) || quantity <= 0) {
                    bot.sendMessage(chatId, 'Please enter a valid number of tickets.');
                    return;
                }

                const eventId = waitingType.split('_')[1];
                const event = await Event.findById(eventId);
                if (!event) {
                    bot.sendMessage(chatId, 'Event not found. Please try again.');
                    return;
                }

                if (quantity > event.availableTickets) {
                    bot.sendMessage(chatId, `Not enough tickets available.\n` +
                        `Maximum available: ${event.availableTickets}`);
                    return;
                }

                try {
                    // Update event tickets
                    event.availableTickets -= quantity;
                    await event.save();

                    // Add to user's tickets
                    const user = await getUser(chatId.toString());
                    user.tickets.push({
                        eventId: event._id,
                        quantity,
                        purchaseDate: new Date(),
                        ticketToken: event.ticketToken
                    });
                    await user.save();

                    bot.sendMessage(chatId, `Successfully purchased ${quantity} ticket(s) for ${event.name}!\n\n` +
                        `Total amount: ${event.ticketPrice * quantity} ${event.ticketToken}\n` +
                        `Remaining tickets: ${event.availableTickets}`);
                } catch (error) {
                    console.error('Error processing purchase:', error);
                    bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
                }
                break;
        }
    } catch (error) {
        console.error('Error handling message:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    } finally {
        waitingForDetails.delete(chatId);
    }
});

// Enhanced admin panel features
bot.onText(/\/admin_panel/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        if (!(await isAdmin(chatId))) {
            bot.sendMessage(chatId, languages['EN'].messages.admin_only);
            return;
        }

        const keyboard = {
            reply_markup: JSON.stringify({
                keyboard: [
                    ['/create_community', '/create_event'],
                    ['/view_stats', '/manage_events'],
                    ['/view_users', '/view_communities'],
                    ['/set_admin', '/remove_admin'],
                    ['/back']
                ],
                resize_keyboard: true
            })
        };

        const user = await getUser(chatId.toString());
        const language = user.language || 'EN';
        const message = languages[language].messages.welcome + '\n\n' +
            languages[language].commands.admin_panel;

        bot.sendMessage(chatId, message, keyboard);
    } catch (error) {
        console.error('Error in /admin_panel command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// New admin features
bot.onText(/\/view_communities/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        if (!(await isAdmin(chatId))) {
            bot.sendMessage(chatId, languages['EN'].messages.admin_only);
            return;
        }

        const communities = await Community.find({}).sort({ createdAt: -1 });
        
        if (communities.length === 0) {
            bot.sendMessage(chatId, 'No communities found.');
            return;
        }

        let message = 'Communities:\n\n';
        communities.forEach((community, index) => {
            message += `${index + 1}. ${community.name}\n`;
            message += `Token: ${community.tokenSymbol}\n`;
            message += `Members: ${community.members.length}\n`;
            message += `Total Supply: ${community.tokenSupply}\n`;
            message += `Remaining Supply: ${community.tokenSupply - community.members.length}\n\n`;
            message += `/edit_community ${community._id} - Edit community\n`;
            message += `/delete_community ${community._id} - Delete community\n\n`;
        });

        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error in /view_communities command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// User-friendly features
bot.onText(/\/my_profile/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await getUser(chatId.toString());
    
    try {
        const language = user.language || 'EN';
        let message = languages[language].messages.welcome + '\n\n';
        
        message += languages[language].commands.my_profile + '\n\n';
        message += `Telegram ID: ${user.telegramId}\n`;
        message += `Joined: ${new Date(user.createdAt).toLocaleDateString()}\n`;
        message += `Language: ${language}\n`;
        message += `Admin: ${user.isAdmin ? 'Yes' : 'No'}\n\n`;
        
        if (user.communities.length > 0) {
            message += languages[language].commands.join_community + '\n';
            const communities = await Community.find({ _id: { $in: user.communities } });
            communities.forEach((community, index) => {
                message += `${index + 1}. ${community.name}\n`;
                message += `Token: ${community.tokenSymbol}\n`;
                message += `Members: ${community.members.length}\n`;
            });
            message += '\n';
        }

        if (user.tickets.length > 0) {
            message += languages[language].commands.tickets + '\n';
            user.tickets.forEach((ticket, index) => {
                message += `${index + 1}. Event ID: ${ticket.eventId}\n`;
                message += `Quantity: ${ticket.quantity}\n`;
                message += `Purchase Date: ${new Date(ticket.purchaseDate).toLocaleDateString()}\n`;
                message += `Token: ${ticket.ticketToken}\n`;
            });
        }

        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error in /my_profile command:', error);
        bot.sendMessage(chatId, languages['EN'].messages.unexpected_error);
    }
});

// Enhanced error handling
const handleError = (chatId, error, context = 'An error occurred') => {
    console.error(`${context} error:`, error);
    
    const user = getUser(chatId.toString());
    const language = user.language || 'EN';
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
        bot.sendMessage(chatId, languages[language].messages.invalid_format);
    } else if (error.name === 'MongoError' && error.code === 11000) {
        bot.sendMessage(chatId, languages[language].messages.item_exists);
    } else if (error.message.includes('not found')) {
        bot.sendMessage(chatId, languages[language].messages.not_found);
    } else {
        bot.sendMessage(chatId, languages[language].messages.unexpected_error);
    }
};

// Help command with enhanced formatting
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await getUser(chatId.toString());
    const language = user.language || 'EN';
    const isAdminUser = await isAdmin(chatId);
    
    let helpMessage = languages[language].messages.welcome + '\n\n';
    
    helpMessage += languages[language].commands.create_community + '\n' +
        '  Format: Name,Description,TokenSymbol,TokenSupply\n\n' +
        languages[language].commands.join_community + '\n' +
        '  Format: [community token or name]\n\n' +
        languages[language].commands.search_community + ' [keyword] - ' +
        languages[language].commands.search_community + '\n\n' +
        languages[language].commands.create_event + '\n' +
        '  Format: Name,Date,Location,Price,Token,Tickets\n\n' +
        languages[language].commands.events + '\n\n' +
        languages[language].commands.tickets + '\n\n' +
        languages[language].commands.buy + ' [event_id] - ' +
        languages[language].commands.buy + '\n\n' +
        languages[language].commands.my_profile + '\n\n' +
        languages[language].commands.set_language + ' [language] - ' +
        languages[language].commands.set_language + '\n\n' +
        languages[language].commands.help + '\n\n';

    if (isAdminUser) {
        helpMessage += languages[language].commands.admin_panel + '\n' +
            languages[language].commands.view_users + '\n' +
            languages[language].commands.view_communities + '\n' +
            languages[language].commands.set_admin + '\n' +
            languages[language].commands.remove_admin + '\n\n';
    }

    const keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
                [languages[language].commands.create_community, languages[language].commands.join_community],
                [languages[language].commands.create_event, languages[language].commands.events],
                [languages[language].commands.tickets, languages[language].commands.help]
            ],
            resize_keyboard: true
        })
    };

    bot.sendMessage(chatId, helpMessage, keyboard);
});

// Enhanced polling error handling
bot.on('polling_error', (error) => {
    console.error('Telegram Bot polling error:', error);
    
    // Enhanced retry logic with backoff and max retries
    let retryCount = 0;
    const maxRetries = 5;
    const retryPolling = () => {
        if (retryCount >= maxRetries) {
            console.error('Maximum retry attempts reached. Stopping polling.');
            return;
        }

        retryCount++;
        const delay = Math.min(60000, 1000 * Math.pow(2, retryCount)); // Max 60 seconds
        console.log(`Retrying polling in ${delay/1000} seconds...`);
        setTimeout(() => {
            try {
                bot.startPolling();
            } catch (pollError) {
                console.error('Failed to restart polling:', pollError);
                retryPolling();
            }
        }, delay);
    };

    retryPolling();
});

// Handle unknown commands with language support
bot.onText(/\//, async (msg) => {
    const chatId = msg.chat.id;
    const user = await getUser(chatId.toString());
    const language = user.language || 'EN';
    
    let message;
    switch (language) {
        case 'ES':
            message = 'Comando desconocido. Usa /help para ver los comandos disponibles.';
            break;
        case 'FR':
            message = 'Commande inconnue. Utilisez /help pour voir les commandes disponibles.';
            break;
        case 'DE':
            message = 'Unbekannter Befehl. Verwenden Sie /help für verfügbare Befehle.';
            break;
        default:
            message = 'Unknown command. Use /help to see available commands.';
    }

    bot.sendMessage(chatId, message);
});

console.log('Enhanced Application bot is running...');
