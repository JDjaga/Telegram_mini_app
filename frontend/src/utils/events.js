import axios from 'axios';
import { showAlert } from './telegram';

// API endpoints
const API_BASE_URL = 'https://api.nft-ticketing-hub.com';

export const getEvents = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const getTickets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tickets`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
};

export const buyTicket = async (eventId) => {
    try {
        // Get user data from Telegram
        const userData = getUserData();
        if (!userData) {
            throw new Error('User data not available');
        }

        // Prepare ticket purchase data
        const ticketData = {
            eventId,
            userId: userData.id,
            walletAddress: userData.wallet_address // This should be set after wallet connection
        };

        // Send ticket purchase request
        const response = await axios.post(`${API_BASE_URL}/tickets/buy`, ticketData);
        
        if (response.data.success) {
            showAlert('Ticket purchased successfully!');
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to purchase ticket');
        }
    } catch (error) {
        console.error('Error buying ticket:', error);
        showAlert('Error purchasing ticket. Please try again.');
        throw error;
    }
};
