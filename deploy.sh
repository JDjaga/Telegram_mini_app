#!/bin/bash

# Build the frontend
echo "Building frontend..."
cd frontend
npm install
npm run build

# Start the server
echo "Starting server..."
npm run serve 