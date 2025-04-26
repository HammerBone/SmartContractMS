# Smart Contract Management System - Getting Started Guide

This guide will help you start and understand the Smart Contract Management System client application.

## Project Overview

The Smart Contract Management System is a React-based web application that allows users to create, deploy, and manage blockchain smart contracts through a user-friendly interface. The application connects to blockchain networks and provides comprehensive functionality for smart contract management.

## Starting the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev -- --port 3001
   ```
   
   The application will be available at: http://localhost:3001/proxy/3000/

## Key Features

- **Authentication System**: User registration, login, and verification
- **Dashboard**: Overview of contracts and activities
- **Contract Management**: Create, deploy, and monitor smart contracts
- **Template System**: Create and use templates for faster contract creation
- **Profile Management**: User profile and settings

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/context` - React context providers for state management
  - `/pages` - Application pages/routes
  - `/services` - API and blockchain service integrations
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point

## Technologies Used

- **Frontend**: React 18, Vite
- **Routing**: React Router
- **Blockchain Integration**: Ethers.js and Web3.js
- **Styling**: Styled Components and TailwindCSS
- **Form Handling**: Formik and Yup
- **Notifications**: React Toastify

## Development Notes

- The application uses context API for state management
- Protected routes require authentication
- The base path for the application is set to `/proxy/3000/`
- CloudFront domain is allowed in CORS configuration

## Troubleshooting

If you encounter CORS issues, ensure the domain is added to `allowedHosts` in `vite.config.js`:

```javascript
allowedHosts: ['your-domain.cloudfront.net', 'localhost']
```

## Next Steps

1. Explore the UI to understand the user flow
2. Review components and context providers
3. Test contract creation and management features
4. Verify blockchain connections
