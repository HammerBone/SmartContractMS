import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFileContract, FaPlus } from 'react-icons/fa';
import ContractContext from '../context/ContractContext';
import Loader from '../components/common/Loader';

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

const ContractCard = styled(Link)`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
  color: var(--text-color);
  text-decoration: none;
  display: block;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
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

const ContractsPage = () => {
  const { contracts, loading, fetchContracts } = useContext(ContractContext);

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
            <ContractCard key={contract._id} to={`/contracts/${contract._id}`}>
              <ContractTitle>{contract.title}</ContractTitle>
              <ContractDescription>{contract.description}</ContractDescription>
              <ContractMeta>
                <span>Created: {formatDate(contract.createdAt)}</span>
                <ContractStatus
                  className={
                    contract.status === 'pending_signatures'
                      ? 'pending'
                      : contract.status === 'completed'
                      ? 'completed'
                      : contract.status === 'expired'
                      ? 'expired'
                      : 'draft'
                  }
                >
                  {contract.status === 'pending_signatures'
                    ? 'Pending'
                    : contract.status === 'completed'
                    ? 'Completed'
                    : contract.status === 'expired'
                    ? 'Expired'
                    : 'Draft'}
                </ContractStatus>
                {contract.verificationCode && (
                  <VerificationCode>
                    Verification Code: {contract.verificationCode}
                  </VerificationCode>
                )}
              </ContractMeta>
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
