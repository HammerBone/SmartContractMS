import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFileContract, FaPlus, FaSignature, FaCheckCircle, FaSearch } from 'react-icons/fa';
import ContractContext from '../context/ContractContext';
import AuthContext from '../context/AuthContext';
import { blockchainService } from '../services/blockchainService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const ContractsContainer = styled.div`
  padding: 2rem 0;
`;

const ContractsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a75e8;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    color: white;
  }
`;

const ContractsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ContractCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ContractLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  flex: 1;
`;

const ContractTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ContractDescription = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContractMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--medium-gray);
`;

const ContractStatus = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  align-self: flex-start;
  
  &.pending {
    background-color: rgba(255, 190, 11, 0.1);
    color: var(--warning-color);
  }
  
  &.completed {
    background-color: rgba(56, 176, 0, 0.1);
    color: var(--success-color);
  }
  
  &.expired {
    background-color: rgba(217, 4, 41, 0.1);
    color: var(--danger-color);
  }
  
  &.draft {
    background-color: rgba(173, 181, 189, 0.1);
    color: var(--dark-gray);
  }
`;

const VerificationCode = styled.div`
  font-size: 0.8rem;
  color: var(--dark-gray);
  word-break: break-all;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: var(--medium-gray);
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
`;

const SignButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #2a75e8;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const VerifyButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--success-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #2ecc71;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    color: white;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--light-gray);
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.signed ? 'var(--success-color)' : 'var(--warning-color)'};
`;

const ContractsPage = () => {
  const { contracts, loading, fetchContracts, signContract } = useContext(ContractContext);
  const { user } = useContext(AuthContext);
  const [signing, setSigning] = useState({});

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const canSign = (contract) => {
    if (!contract || !user) return false;
    
    // Check if the contract is already signed
    if (contract.status === 'signed') return false;
    
    // Check if the user is a party to the contract
    const userParty = contract.parties.find(
      party => (party?.user && party.user._id === user._id) || party?.email === user.email
    );
    
    // If the user is a party and hasn't signed yet, they can sign
    if (userParty && !userParty.signed) return true;
    
    // If the user is the creator and the contract is in draft or pending status, they can sign
    if (contract.creator && contract.creator._id === user._id && 
        (contract.status === 'draft' || contract.status === 'pending')) {
      return true;
    }
    
    return false;
  };

  const isSigned = (contract) => {
    return contract.status === 'signed';
  };

  const handleSignContract = async (contract) => {
    try {
      setSigning(prev => ({ ...prev, [contract._id]: true }));
      
      // Generate a signature using the blockchain service
      const { signature } = await blockchainService.signData(
        contract.content,
        'demo_private_key'
      );
      
      // Call the API to sign the contract
      await signContract(contract._id, signature);
      
      toast.success('Contract signed successfully');
      
      // Refresh the contracts list to update the UI
      fetchContracts();
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Failed to sign contract: ' + (error.message || 'Unknown error'));
    } finally {
      setSigning(prev => ({ ...prev, [contract._id]: false }));
    }
  };

  return (
    <ContractsContainer>
      <ContractsHeader>
        <PageTitle>My Contracts</PageTitle>
        <CreateButton to="/contracts/create">
          <FaPlus /> Create Contract
        </CreateButton>
      </ContractsHeader>

      {loading ? (
        <Loader />
      ) : contracts.length > 0 ? (
        <ContractsList>
          {contracts.map((contract) => (
            <ContractCard key={contract._id}>
              <ContractLink to={`/contracts/${contract._id}`}>
                <ContractTitle>{contract.title}</ContractTitle>
                <ContractDescription>{contract.description}</ContractDescription>
                <ContractMeta>
                  <span>Created: {formatDate(contract.createdAt)}</span>
                  <ContractStatus
                    className={
                      contract.status === 'pending'
                        ? 'pending'
                        : contract.status === 'signed'
                        ? 'completed'
                        : contract.status === 'expired'
                        ? 'expired'
                        : 'draft'
                    }
                  >
                    {contract.status === 'pending'
                      ? 'Pending'
                      : contract.status === 'signed'
                      ? 'Completed'
                      : contract.status === 'expired'
                      ? 'Expired'
                      : 'Draft'}
                  </ContractStatus>
                  <VerificationCode>
                    Document ID: {contract._id}
                  </VerificationCode>
                </ContractMeta>
              </ContractLink>
              <ActionButtons>
                {canSign(contract) && (
                  <>
                    <StatusIndicator signed={false}>
                      <FaCheckCircle /> This contract needs your signature
                    </StatusIndicator>
                    <SignButton 
                      onClick={() => handleSignContract(contract)}
                      disabled={signing[contract._id]}
                    >
                      <FaSignature /> {signing[contract._id] ? 'Signing...' : 'Sign Contract'}
                    </SignButton>
                  </>
                )}
                {isSigned(contract) && (
                  <>
                    <StatusIndicator signed={true}>
                      <FaCheckCircle /> This contract has been signed
                    </StatusIndicator>
                    <VerifyButton to={`/verify/${contract._id}`}>
                      <FaSearch /> Verify Contract
                    </VerifyButton>
                  </>
                )}
              </ActionButtons>
            </ContractCard>
          ))}
        </ContractsList>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FaFileContract />
          </EmptyStateIcon>
          <EmptyStateText>You don't have any contracts yet.</EmptyStateText>
          <CreateButton to="/contracts/create">
            <FaPlus /> Create Your First Contract
          </CreateButton>
        </EmptyState>
      )}
    </ContractsContainer>
  );
};

export default ContractsPage;
