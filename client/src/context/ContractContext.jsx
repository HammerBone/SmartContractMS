import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import AuthContext from './AuthContext';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all contracts for the authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      fetchContracts();
    }
  }, [isAuthenticated]);

  // Fetch all contracts
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/contracts');
      setContracts(data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching contracts');
      setLoading(false);
      toast.error('Failed to load contracts');
    }
  };

  // Fetch contract by ID
  const fetchContractById = async (id) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/contracts/${id}`);
      setContract(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching contract');
      setLoading(false);
      toast.error('Failed to load contract details');
      return null;
    }
  };

  // Create new contract
  const createContract = async (contractData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/contracts', contractData);
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
      const { data } = await api.put(`/api/contracts/${id}/sign`, { signatureHash });
      
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
      const { data } = await api.get(`/api/contracts/verify/${code}`);
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
