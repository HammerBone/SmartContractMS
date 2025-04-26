# Smart Contract Management System - Local Setup Guide

This guide will help you set up and run the Smart Contract Management System on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v14+)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

If you haven't already cloned the repository:

```bash
git clone <repository-url>
cd SmartContractMS
```

### 2. Set Up MongoDB

You have two options:

#### Option 1: Use Local MongoDB

- Install MongoDB locally following the [official documentation](https://docs.mongodb.com/manual/installation/)
- Start MongoDB service
- The application is configured to connect to `mongodb://localhost:27017/smartContractMS`

#### Option 2: Use MongoDB Atlas

- Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string and update it in the server's `.env` file

### 3. Set Up the Server

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file if it doesn't exist
# The file should contain:
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartContractMS
JWT_SECRET=your_jwt_secret_key
WEB3_PROVIDER=https://mainnet.infura.io/v3/your_infura_key

# Start the server in development mode
npm run dev
```

The server should now be running on http://localhost:5000

### 4. Set Up the Client

```bash
# Navigate to the client directory
cd ../client

# Install dependencies
npm install

# Start the client in development mode
npm run dev
```

The client should now be running on http://localhost:3000

## Accessing the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing the API

You can test the API endpoints using tools like Postman or curl:

```bash
# Example: Test the base API endpoint
curl http://localhost:5000
```

## Common Issues and Solutions

### CORS Issues

If you encounter CORS issues, make sure the server's CORS configuration is correctly set up in `server.js`. The current configuration allows all origins in development mode.

### MongoDB Connection Issues

If you can't connect to MongoDB:
- Check if MongoDB is running
- Verify your connection string in the `.env` file
- Make sure network access is allowed (if using MongoDB Atlas)

### Port Already in Use

If the port is already in use:
- Change the port in the `.env` file
- Update the client's API URL in the client's `.env` file

## Additional Configuration

### Blockchain Integration

To fully utilize the blockchain features:
1. Create an account on [Infura](https://infura.io/)
2. Get your API key
3. Update the `WEB3_PROVIDER` in the server's `.env` file

### Email Notifications

To enable email notifications:
1. Add the following to your server's `.env` file:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```
2. If using Gmail, you'll need to create an app password

## Development Tips

- The server uses nodemon for automatic restarts during development
- The client uses Vite's hot module replacement for fast updates
- Check the console for any errors during startup
