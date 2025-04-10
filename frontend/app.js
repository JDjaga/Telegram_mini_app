// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

tg.expand();

document.addEventListener('DOMContentLoaded', initializeApp);

// Language handling
function initializeLanguage() {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage) {
        languageSelector.value = savedLanguage;
        updateLanguage(savedLanguage);
    }
    
    languageSelector.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);
        updateLanguage(selectedLanguage);
    });
}

function updateLanguage(language) {
    // Update UI elements with translated text
    document.documentElement.lang = language;
    
    // Update all text elements with translated content
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = getTranslation(key, language);
    });
}

function getTranslation(key, language) {
    // This would typically fetch translations from a JSON file
    // For now, we'll return a placeholder
    return `${key} (${language})`;
}

// Dark Mode Toggle
function initializeDarkMode() {
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `<i class="fas fa-moon"></i>`;
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        updateThemeIcon(themeToggle);
    });

    document.body.appendChild(themeToggle);
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeToggle);
}

function updateThemeIcon(toggle) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Enhanced Notifications
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons['info'];
}

// Enhanced Loading States
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    element.appendChild(spinner);
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) spinner.remove();
}

// Event handling
function initializeEvents() {
    // Create Community Form
    const createCommunityForm = document.getElementById('createCommunityForm');
    if (createCommunityForm) {
        createCommunityForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('communityName').value,
                description: document.getElementById('communityDescription').value,
                tokenSymbol: document.getElementById('communityTokenSymbol').value.toUpperCase(),
                tokenSupply: parseInt(document.getElementById('communityTokenSupply').value)
            };
            
            try {
                showLoading(createCommunityForm);
                const response = await createCommunity(formData);
                if (response.success) {
                    showNotification('Community created successfully!', 'success');
                    updateCommunityList();
                    createCommunityForm.reset();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('createCommunityModal'));
                    modal.hide();
                } else {
                    showNotification(response.message, 'error');
                }
            } catch (error) {
                showNotification('Error creating community', 'error');
            } finally {
                hideLoading(createCommunityForm);
            }
        });
    }

    // Create Event Form
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('eventName').value,
                date: document.getElementById('eventDate').value,
                location: document.getElementById('eventLocation').value,
                price: parseFloat(document.getElementById('eventPrice').value),
                token: document.getElementById('eventToken').value,
                tickets: parseInt(document.getElementById('eventTickets').value)
            };
            
            try {
                showLoading(createEventForm);
                const response = await createEvent(formData);
                if (response.success) {
                    showNotification('Event created successfully!', 'success');
                    updateEventList();
                    createEventForm.reset();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
                    modal.hide();
                } else {
                    showNotification(response.message, 'error');
                }
            } catch (error) {
                showNotification('Error creating event', 'error');
            } finally {
                hideLoading(createEventForm);
            }
        });
    }

    // Load initial data
    loadInitialData();
}

// Enhanced Event Handling
function initializeEnhancedEvents() {
    const eventActions = {
        'buyTicket': {
            icon: 'fa-shopping-cart',
            label: 'Buy Ticket',
            color: 'primary'
        },
        'shareEvent': {
            icon: 'fa-share-alt',
            label: 'Share',
            color: 'secondary'
        },
        'viewTicket': {
            icon: 'fa-eye',
            label: 'View Details',
            color: 'info'
        },
        'transferTicket': {
            icon: 'fa-exchange-alt',
            label: 'Transfer',
            color: 'warning'
        }
    };

    // Add event listeners
    Object.entries(eventActions).forEach(([action, config]) => {
        const elements = document.querySelectorAll(`[onclick*="${action}"]`);
        elements.forEach(element => {
            element.innerHTML = `<i class="fas ${config.icon}"></i> ${config.label}`;
            element.classList.add(`btn-${config.color}`);
            
            element.addEventListener('click', async (e) => {
                e.preventDefault();
                const id = element.getAttribute('onclick').match(/'([^']+)'/)[1];
                showLoading(element);
                
                try {
                    await window[action](id);
                    showNotification(`${config.label} successful!`, 'success');
                } catch (error) {
                    showNotification(`Failed to ${config.label.toLowerCase()}`, 'error');
                } finally {
                    hideLoading(element);
                }
            });
        });
    });
}

// Filter and Search functionality
function initializeFilters() {
    // Add filter buttons for events
    const eventFilters = [
        { id: 'upcoming', label: 'Upcoming Events', filter: 'upcoming' },
        { id: 'past', label: 'Past Events', filter: 'past' },
        { id: 'my-events', label: 'My Events', filter: 'my' }
    ];

    const filterContainer = document.createElement('div');
    filterContainer.className = 'event-filters';
    eventFilters.forEach(filter => {
        const button = document.createElement('button');
        button.className = 'btn btn-filter';
        button.textContent = filter.label;
        button.addEventListener('click', () => applyEventFilter(filter.filter));
        filterContainer.appendChild(button);
    });

    const eventListContainer = document.querySelector('.event-list');
    if (eventListContainer) {
        eventListContainer.before(filterContainer);
    }
}

function initializeSearch() {
    // Add search functionality
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search communities, events, or tickets...';
    searchInput.className = 'search-input';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(searchContainer, mainContent.firstChild);
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        searchItems(searchTerm);
    });
}

function searchItems(query) {
    // Search through communities, events, and tickets
    const communities = document.querySelectorAll('.community-card');
    const events = document.querySelectorAll('.event-card');
    const tickets = document.querySelectorAll('.ticket-card');

    const items = [...communities, ...events, ...tickets];
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// API Functions
async function createCommunity(data) {
    try {
        const response = await axios.post('/api/communities', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function createEvent(data) {
    try {
        const response = await axios.post('/api/events', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function loadUserData() {
    try {
        const response = await axios.get('/api/user');
        updateUserData(response.data);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// UI Updates
function updateCommunityList() {
    axios.get('/api/communities')
        .then(response => {
            const communityList = document.getElementById('community-list');
            communityList.innerHTML = renderCommunityList(response.data);
        })
        .catch(error => {
            console.error('Error loading communities:', error);
            showNotification('Error loading communities', 'error');
        });
}

function updateEventList() {
    axios.get('/api/events')
        .then(response => {
            const eventList = document.getElementById('event-list');
            eventList.innerHTML = renderEventList(response.data);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            showNotification('Error loading events', 'error');
        });
}

function updateTicketList() {
    axios.get('/api/tickets')
        .then(response => {
            const ticketList = document.getElementById('ticket-list');
            ticketList.innerHTML = renderTicketList(response.data);
        })
        .catch(error => {
            console.error('Error loading tickets:', error);
            showNotification('Error loading tickets', 'error');
        });
}

// Helper Functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Template Functions
function renderCommunityList(communities) {
    if (!communities || communities.length === 0) {
        return '<p class="text-muted">No communities found</p>';
    }

    return communities.map(community => `
        <div class="community-card">
            <div class="community-header">
                <h4>${community.name}</h4>
                <div class="community-stats">
                    <span>Token: ${community.tokenSymbol}</span>
                    <span>Members: ${community.members.length}</span>
                    <span>Supply: ${community.tokenSupply}</span>
                </div>
            </div>
            <div class="community-description">
                <p>${community.description}</p>
            </div>
            <div class="community-actions">
                <button onclick="joinCommunity('${community._id}')" class="btn btn-sm btn-primary">
                    <i class="fas fa-user-plus"></i> Join Community
                </button>
                <button onclick="viewCommunity('${community._id}')" class="btn btn-sm btn-secondary">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

function renderEventList(events) {
    if (!events || events.length === 0) {
        return '<p class="text-muted">No events found</p>';
    }

    return events.map(event => `
        <div class="event-card">
            <div class="event-header">
                <h4>${event.name}</h4>
                <div class="event-date">
                    <i class="fas fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}
                </div>
            </div>
            <div class="event-details">
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-ticket-alt"></i> ${event.availableTickets} tickets left</p>
                <p><i class="fas fa-tag"></i> ${event.price} ${event.token}</p>
            </div>
            <div class="event-actions">
                <button onclick="buyTicket('${event._id}')" class="btn btn-sm btn-primary">
                    <i class="fas fa-shopping-cart"></i> Buy Ticket
                </button>
                <button onclick="shareEvent('${event._id}')" class="btn btn-sm btn-secondary">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
        </div>
    `).join('');
}

function renderTicketList(tickets) {
    if (!tickets || tickets.length === 0) {
        return '<p class="text-muted">No tickets found</p>';
    }

    return tickets.map(ticket => `
        <div class="ticket-card">
            <div class="ticket-header">
                <h4>${ticket.eventName}</h4>
                <div class="ticket-date">
                    <i class="fas fa-calendar"></i> ${new Date(ticket.eventDate).toLocaleDateString()}
                </div>
            </div>
            <div class="ticket-details">
                <p><i class="fas fa-map-marker-alt"></i> ${ticket.eventLocation}</p>
                <p><i class="fas fa-ticket-alt"></i> ${ticket.quantity} ticket(s)</p>
                <p><i class="fas fa-tag"></i> ${ticket.price} ${ticket.token}</p>
            </div>
            <div class="ticket-actions">
                <button onclick="viewTicket('${ticket._id}')" class="btn btn-sm btn-primary">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button onclick="transferTicket('${ticket._id}')" class="btn btn-sm btn-secondary">
                    <i class="fas fa-exchange-alt"></i> Transfer
                </button>
            </div>
        </div>
    `).join('');
}

// Event Actions
function showCreateCommunityForm() {
    const modal = new bootstrap.Modal(document.getElementById('createCommunityModal'));
    modal.show();
}

function showCreateEventForm() {
    const modal = new bootstrap.Modal(document.getElementById('createEventModal'));
    modal.show();
}

function showEventSearch() {
    // Implement event search functionality
}

function joinCommunity(communityId) {
    // Implement join community functionality
}

function buyTicket(eventId) {
    // Implement buy ticket functionality
}

function shareEvent(eventId) {
    // Implement share event functionality
}

function viewTicket(ticketId) {
    // Implement view ticket details
}

function transferTicket(ticketId) {
    // Implement ticket transfer functionality
}

function applyEventFilter(filterType) {
    // Implement event filtering
}

// Load initial data
async function loadInitialData() {
    try {
        await Promise.all([
            updateCommunityList(),
            updateEventList(),
            updateTicketList()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// Enhanced Initialization
function initializeApp() {
    initializeLanguage();
    initializeDarkMode();
    initializeEvents();
    initializeEnhancedEvents();
    initializeFilters();
    initializeSearch();
    loadUserData();
}

// Enhanced Community Management
async function joinCommunity(communityId) {
    try {
        const response = await axios.post(`/api/communities/${communityId}/join`);
        if (response.data.success) {
            updateCommunityList();
            showNotification('Successfully joined community!', 'success');
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        showNotification(error.message || 'Failed to join community', 'error');
    }
}

// Enhanced Event Management
async function createEvent(formData) {
    try {
        const response = await axios.post('/api/events', formData);
        if (response.data.success) {
            showNotification('Event created successfully!', 'success');
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        showNotification(error.message || 'Failed to create event', 'error');
        throw error;
    }
}

// Enhanced Ticket Management
async function buyTicket(eventId) {
    try {
        const response = await axios.post(`/api/events/${eventId}/tickets/buy`);
        if (response.data.success) {
            showNotification('Ticket purchased successfully!', 'success');
            updateTicketList();
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        showNotification(error.message || 'Failed to purchase ticket', 'error');
    }
}

// Enhanced User Interface
function initializeUI() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.card').forEach((card) => {
        observer.observe(card);
    });
}

// Initialize Particle Effects
function initializeParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Randomize position
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // Randomize size
        const size = Math.random() * 2 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Randomize animation duration
        const duration = Math.random() * 5 + 5;
        particle.style.animationDuration = duration + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Enhanced Animations
function initializeEnhancedAnimations() {
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1
    });

    // Add animations to all cards
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.add('animate');
        observer.observe(card);
    });

    // Add animations to list items
    document.querySelectorAll('.list-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Add animations to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('hover-effect');
        });
        button.addEventListener('mouseleave', () => {
            button.classList.remove('hover-effect');
        });
    });
}

// Enhanced Notifications
function showEnhancedNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <div class="notification-progress"></div>
        </div>
    `;

    document.body.appendChild(notification);
    
    // Create progress bar
    const progressBar = notification.querySelector('.notification-progress');
    progressBar.style.width = '100%';
    progressBar.style.animationDuration = `${duration}ms`;
    
    // Add fade out animation
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

// Enhanced Loading States
function showEnhancedLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    element.appendChild(spinner);
    
    // Add loading animation
    const animation = element.style.animation;
    element.style.animation = 'pulse 1s infinite';
    
    // Restore original animation when done
    return () => {
        element.style.animation = animation;
    };
}

// Enhanced Form Handling
function initializeEnhancedForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Add loading state to submit button
            const submitButton = form.querySelector('button[type="submit"]');
            const restoreAnimation = showEnhancedLoading(submitButton);
            
            // Process form data
            processFormData(data)
                .then(response => {
                    showEnhancedNotification('Form submitted successfully!', 'success');
                    form.reset();
                })
                .catch(error => {
                    showEnhancedNotification(error.message || 'Error submitting form', 'error');
                })
                .finally(() => {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    restoreAnimation();
                });
        });
    });
}

// Enhanced Event Management
async function processFormData(data) {
    try {
        const response = await axios.post('/api/submit', data);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Enhanced Initialization
function initializeApp() {
    initializeLanguage();
    initializeDarkMode();
    initializeEvents();
    initializeEnhancedEvents();
    initializeFilters();
    initializeSearch();
    initializeParticles();
    initializeEnhancedAnimations();
    initializeEnhancedForms();
    loadUserData();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Security configuration
const securityConfig = {
    maxAttempts: 3,
    lockoutDuration: 5 * 60 * 1000, // 5 minutes
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100
    }
};

// Request rate limiter
let requestCount = 0;
let lastRequestTime = Date.now();

function checkRateLimit() {
    const now = Date.now();
    const timeDiff = now - lastRequestTime;
    
    if (timeDiff > securityConfig.rateLimit.windowMs) {
        requestCount = 0;
        lastRequestTime = now;
    }
    
    if (requestCount >= securityConfig.rateLimit.max) {
        throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }
    
    requestCount++;
}

// Login attempt tracking
let failedAttempts = 0;
let lastFailedTime = null;

function checkLoginAttempts() {
    const now = Date.now();
    
    // Reset attempts if enough time has passed
    if (lastFailedTime && now - lastFailedTime > securityConfig.lockoutDuration) {
        failedAttempts = 0;
    }
    
    if (failedAttempts >= securityConfig.maxAttempts) {
        throw new Error(`Too many failed attempts. Please wait ${Math.round((securityConfig.lockoutDuration - (now - lastFailedTime)) / 1000)} seconds before trying again.`);
    }
}

// Enhanced API calls with security
async function secureApiCall(url, options = {}) {
    try {
        checkRateLimit();
        
        // Add security headers
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Security-Token': localStorage.getItem('securityToken') || generateSecurityToken()
        };
        
        // Add CSRF protection
        headers['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]')?.content || generateCSRFToken();
        
        const response = await axios({
            ...options,
            url,
            headers: { ...options.headers, ...headers }
        });
        
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function generateSecurityToken() {
    return crypto.randomUUID();
}

function generateCSRFToken() {
    return crypto.randomUUID();
}

// Enhanced error handling
function handleError(error) {
    if (error.response) {
        // Server responded with error
        const errorData = error.response.data;
        if (errorData.code === 'RATE_LIMIT') {
            showNotification('Rate limit exceeded. Please wait before trying again.', 'error', 5000);
        } else if (errorData.code === 'LOGIN_LOCKED') {
            showNotification('Account locked due to too many failed attempts. Please wait.', 'error', 5000);
        } else {
            showNotification(errorData.message || 'An error occurred', 'error', 5000);
        }
    } else if (error.request) {
        // Request made but no response
        showNotification('No response from server. Please try again later.', 'error', 5000);
    } else {
        // Error in request setup
        showNotification('Error in request. Please try again.', 'error', 5000);
    }
}

// Enhanced form validation
function validateForm(formData, rules) {
    const errors = {};
    
    Object.entries(rules).forEach(([field, rule]) => {
        const value = formData[field];
        
        if (rule.required && !value) {
            errors[field] = 'This field is required';
        }
        
        if (rule.type === 'email' && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors[field] = 'Please enter a valid email address';
        }
        
        if (rule.min && value.length < rule.min) {
            errors[field] = `Minimum ${rule.min} characters required`;
        }
        
        if (rule.max && value.length > rule.max) {
            errors[field] = `Maximum ${rule.max} characters allowed`;
        }
    });
    
    return errors;
}

// Enhanced session management
function startSession(userId, token) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('sessionStart', Date.now());
    
    // Set session timeout
    setTimeout(() => {
        showNotification('Session expired. Please log in again.', 'warning');
        endSession();
    }, 24 * 60 * 60 * 1000); // 24 hours
}

function endSession() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionStart');
    window.location.href = '/login';
}

// Enhanced user authentication
async function authenticateUser(credentials) {
    try {
        checkLoginAttempts();
        
        const response = await secureApiCall('/api/auth/login', {
            method: 'POST',
            data: credentials
        });
        
        if (response.success) {
            startSession(response.userId, response.token);
            return true;
        }
        
        failedAttempts++;
        lastFailedTime = Date.now();
        throw new Error(response.message || 'Authentication failed');
    } catch (error) {
        handleError(error);
        return false;
    }
}

// Enhanced initialization
function initializeApp() {
    initializeLanguage();
    initializeDarkMode();
    initializeEvents();
    initializeEnhancedEvents();
    initializeFilters();
    initializeSearch();
    initializeParticles();
    initializeEnhancedAnimations();
    initializeEnhancedForms();
    
    // Check for existing session
    const sessionStart = localStorage.getItem('sessionStart');
    if (sessionStart) {
        const now = Date.now();
        if (now - sessionStart > 24 * 60 * 60 * 1000) { // 24 hours
            endSession();
        }
    }
    
    loadUserData();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
