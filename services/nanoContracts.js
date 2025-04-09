const axios = require('axios');

const nanoContracts = {
  async createMembershipContract(address, communityId) {
    try {
      const response = await axios.post(`${process.env.HATHOR_API_URL}/contracts/membership`, {
        address,
        communityId
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.HATHOR_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating membership contract:', error);
      throw error;
    }
  },

  async createTippingContract(from, to, amount, token) {
    try {
      const response = await axios.post(`${process.env.HATHOR_API_URL}/contracts/tipping`, {
        from,
        to,
        amount,
        token
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.HATHOR_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tipping contract:', error);
      throw error;
    }
  },

  async createVotingContract(proposal, options, duration) {
    try {
      const response = await axios.post(`${process.env.HATHOR_API_URL}/contracts/voting`, {
        proposal,
        options,
        duration
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.HATHOR_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating voting contract:', error);
      throw error;
    }
  }
};

module.exports = nanoContracts;
