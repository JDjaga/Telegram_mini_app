const axios = require('axios');

const hathor = {
  async getNFTs(address) {
    try {
      const response = await axios.get(`${process.env.HATHOR_API_URL}/nfts/${address}`, {
        headers: {
          'Authorization': `Bearer ${process.env.HATHOR_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      throw error;
    }
  },

  async createNFT(owner, metadata) {
    try {
      const response = await axios.post(`${process.env.HATHOR_API_URL}/nfts`, {
        owner,
        metadata
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.HATHOR_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating NFT:', error);
      throw error;
    }
  },

  async createTicket(data) {
    try {
      const response = await axios.post(`${process.env.HATHOR_API_URL}/tickets`, data, {
        headers: {
          'Authorization': `Bearer ${process.env.HATHOR_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async getEventTickets(eventId) {
    try {
      const response = await axios.get(`${process.env.HATHOR_API_URL}/tickets/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.HATHOR_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event tickets:', error);
      throw error;
    }
  },
  
  // Additional methods needed by bot-handler.js
  async getEvents() {
    try {
      // For now, return a placeholder implementation
      return [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  
  async createEvent(eventData) {
    try {
      // For now, return a placeholder implementation
      return {
        id: 'event-' + Date.now(),
        ...eventData
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  
  async purchaseTicket(eventId, walletAddress, quantity) {
    try {
      // For now, return a placeholder implementation
      return {
        purchaseDate: new Date(),
        ticketToken: 'HTR'
      };
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      throw error;
    }
  }
};

module.exports = hathor;
