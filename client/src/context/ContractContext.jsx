import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

const ContractContext = createContext();

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to access this feature');
      navigate('/login');
      return false;
    }
    return true;
  };

  // Fetch all contracts
  const fetchContracts = useCallback(async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/contracts');
      setContracts(response.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Error fetching contracts');
        toast.error('Failed to load contracts');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch all contracts for the authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      fetchContracts();
    }
  }, [isAuthenticated, fetchContracts]);

  // Fetch contract by ID
  const fetchContractById = async (id) => {
    if (!checkAuth()) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        setError('Contract not found');
        toast.error('Contract not found');
      } else {
        setError(error.response?.data?.message || 'Error fetching contract');
        toast.error('Failed to load contract details');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new contract
  const createContract = async (contractData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/contracts', contractData);
      setContracts([data, ...contracts]);
      setLoading(false);
      toast.success('Contract created successfully');
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating contract');
      setLoading(false);
      toast.error('Failed to create contract');
      return null;
    }
  };

  // Sign contract
  const signContract = async (id, signatureHash) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/contracts/${id}/sign`, { signatureHash });
      
      // Update contracts list
      setContracts(
        contracts.map((c) => (c._id === id ? data : c))
      );
      
      // Update current contract if it's the one being viewed
      if (contract && contract._id === id) {
        setContract(data);
      }
      
      setLoading(false);
      toast.success('Contract signed successfully');
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error signing contract');
      setLoading(false);
      toast.error('Failed to sign contract');
      return null;
    }
  };

  // Verify contract
  const verifyContract = async (code) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/contracts/verify/${code}`);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error verifying contract');
      setLoading(false);
      toast.error('Failed to verify contract');
      return null;
    }
  };

  // Clear current contract
  const clearContract = () => {
    setContract(null);
  };

  return (
    <ContractContext.Provider
      value={{
        contracts,
        contract,
        loading,
        error,
        fetchContracts,
        fetchContractById,
        createContract,
        signContract,
        verifyContract,
        clearContract
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;
