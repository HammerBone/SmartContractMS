import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch all contracts
  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have a valid token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in to continue.');
        toast.error('You are not logged in. Please log in to continue.');
        navigate('/login');
        return;
      }
      
      const { data } = await api.get('/contracts');
      setContracts(data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Error fetching contracts');
        toast.error('Failed to load contracts');
      }
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
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have a valid token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in to continue.');
        toast.error('You are not logged in. Please log in to continue.');
        navigate('/login');
        return null;
      }
      
      const { data } = await api.get(`/contracts/${id}`);
      if (!data) {
        setError('Contract not found');
        setLoading(false);
        return null;
      }
      setContract(data);
      setLoading(false);
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Error fetching contract';
        setError(errorMessage);
        toast.error(errorMessage);
      }
      setLoading(false);
      return null;
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
