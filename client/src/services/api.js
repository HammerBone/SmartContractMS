import axios from 'axios';
import { toast } from 'react-toastify';

// Create base URL with the correct path
const baseURL = '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increase timeout to 30 seconds
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Resource not found:', {
            url: error.config?.url,
            method: error.config?.method,
            status: status
          });
          toast.error('The requested resource was not found.');
          break;
        case 500:
          console.error('Server error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: status,
            message: errorData?.message || 'Internal server error'
          });
          toast.error('An unexpected error occurred. Please try again later.');
          break;
        default:
          console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: status,
            message: errorData?.message || 'An error occurred'
          });
          toast.error(errorData?.message || 'An error occurred while processing your request.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', {
        url: error.config?.url,
        method: error.config?.method
      });
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      toast.error('An error occurred while processing your request.');
    }
    return Promise.reject(error);
  }
);

export default api;
