# Smart Contract Management System

A fullstack application for creating, signing, and managing digital contracts and certificates on the blockchain.

## Features

- **Smart Contract Creation**: Create legally binding agreements using predefined templates
- **Digital Signatures**: Securely sign documents using cryptographic keys
- **Blockchain Storage**: Store documents on the blockchain for immutability
- **Verification**: Verify document authenticity without intermediaries
- **Notary Replacement**: Automate the role of a notary with blockchain technology
- **Decentralized Identity**: Link verified digital identities to the system
- **Notifications**: Automated reminders for important milestones
- **Interoperability**: Integration with existing systems and multiple blockchains

## Tech Stack

- **Frontend**: React.js, Vite, Styled Components, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Blockchain Integration**: Web3.js, Ethers.js

## Project Structure

```
SmartContractMS/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/
│       ├── assets/         # Static assets
│       ├── components/     # Reusable components
│       ├── context/        # React context providers
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API and service functions
│       └── utils/          # Utility functions
│
└── server/                 # Express backend
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middleware/         # Express middleware
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    └── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/HammerBone/SmartContractMS.git
   cd SmartContractMS
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory (copy from `.env.example`):
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smartContractMS
   JWT_SECRET=your_jwt_secret
   WEB3_PROVIDER=https://mainnet.infura.io/v3/your_infura_key
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client:
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
