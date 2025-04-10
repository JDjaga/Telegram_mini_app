# NFT Telegram Mini App Backend

Backend server for the NFT Telegram Mini App built with Node.js and MongoDB, integrated with the Hathor Network.

## Features

- NFT Management
- Event Ticketing System
- Community Management
- Wallet Integration
- Secure Authentication
- Rate Limiting
- Logging and Monitoring

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Hathor Network API Access

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   HATHOR_API_URL=https://api.hathor.network/v1a
   HATHOR_API_KEY=your_hathor_api_key
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   RATE_LIMIT_WINDOW_MS=15000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## Running the Server

1. For development:
   ```bash
   npm run dev
   ```

2. For production:
   ```bash
   npm start
   ```

## API Endpoints

### NFTs
- `GET /api/nfts/wallet/:address` - Get NFTs for a wallet
- `POST /api/nfts` - Create a new NFT

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event

### Tickets
- `GET /api/tickets/event/:eventId` - Get tickets for an event
- `POST /api/tickets` - Create a new ticket

### Communities
- `GET /api/communities` - Get all communities
- `POST /api/communities` - Create a new community
- `POST /api/communities/join/:communityId` - Join a community

### Wallet
- `GET /api/wallet/balance/:address` - Get wallet balance
- `POST /api/wallet/transfer` - Transfer tokens

## Security Features

- JWT-based authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Error handling middleware

## Monitoring

- Winston logging
- Health check endpoint
- Request/response logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
#   T e l e g r a m _ m i n i _ a p p  
 