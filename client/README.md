# Smart Contract Management System - Client

This is the client application for the Smart Contract Management System, built with React and Vite.

## Project Overview

The Smart Contract Management System provides a user-friendly interface for interacting with blockchain smart contracts. This client application connects to blockchain networks and provides functionality for:

- Creating and deploying smart contracts
- Managing existing contracts
- Monitoring contract events and transactions
- Secure authentication and authorization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/pages` - Application pages/routes
  - `/services` - API and blockchain service integrations
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point

## Technologies Used

- React 18
- Vite
- React Router
- Ethers.js and Web3.js for blockchain interactions
- Styled Components and TailwindCSS for styling
- Formik and Yup for form handling and validation
- React Toastify for notifications

## Contributing

Please follow the project's coding standards and submit pull requests for any new features or bug fixes.
