import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const { data } = await api.get('/users/profile');
          
          setUser(data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = '';
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users', userData);
      
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
      
      toast.success('Registration successful!');
      navigate('/dashboard');
      
      return true;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users/login', { email, password });
      
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
      
      toast.success('Login successful!');
      navigate('/dashboard');
      
      return true;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Invalid credentials');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
    navigate('/');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', userData);
      
      setUser(data);
      setLoading(false);
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    }
  };

  // Update digital identity
  const updateDigitalIdentity = async (identityData) => {
    try {
      setLoading(true);
      const { data } = await api.put('/users/digital-identity', identityData);
      
      setUser({
        ...user,
        digitalIdentity: data.digitalIdentity
      });
      
      setLoading(false);
      
      toast.success('Digital identity updated successfully');
      return true;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to update digital identity');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateProfile,
        updateDigitalIdentity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
