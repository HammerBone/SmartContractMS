import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaFileContract, 
  FaFileSignature, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaRegClock
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import ContractContext from '../context/ContractContext';
import NotificationContext from '../context/NotificationContext';
import Loader from '../components/common/Loader';

const DashboardContainer = styled.div`
  padding: 2rem 0;
`;

const WelcomeSection = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--box-shadow);
`;

const WelcomeTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
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
  
  &.secondary {
    background-color: white;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    
    &:hover {
      background-color: #f8f9fa;
      color: var(--primary-color);
    }
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => {
    switch (props.type) {
      case 'pending':
        return 'var(--warning-color)';
      case 'completed':
        return 'var(--success-color)';
      case 'expired':
        return 'var(--danger-color)';
      default:
        return 'var(--primary-color)';
    }
  }};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--dark-gray);
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContractsSection = styled.div`
  margin-bottom: 2rem;
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
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--medium-gray);
`;

const ContractStatus = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  
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

const NotificationsSection = styled.div`
  margin-bottom: 2rem;
`;

const NotificationsList = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;

const NotificationItem = styled(Link)`
  display: block;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--light-gray);
  transition: background-color 0.3s ease;
  color: var(--text-color);
  text-decoration: none;
  background-color: ${props => props.unread ? 'rgba(58, 134, 255, 0.05)' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

const NotificationTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: ${props => props.unread ? 'var(--primary-color)' : 'var(--text-color)'};
`;

const NotificationMessage = styled.p`
  font-size: 0.9rem;
  color: var(--dark-gray);
  margin-bottom: 0.5rem;
`;

const NotificationTime = styled.span`
  font-size: 0.8rem;
  color: var(--medium-gray);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
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

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { contracts, loading: contractsLoading, fetchContracts } = useContext(ContractContext);
  const { notifications, loading: notificationsLoading } = useContext(NotificationContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    expired: 0,
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (contracts.length > 0) {
      const newStats = {
        total: contracts.length,
        pending: contracts.filter(c => c.status === 'pending_signatures').length,
        completed: contracts.filter(c => c.status === 'completed').length,
        expired: contracts.filter(c => c.status === 'expired').length,
      };
      setStats(newStats);
    }
  }, [contracts]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const recentContracts = contracts.slice(0, 6);
  const recentNotifications = notifications.slice(0, 5);

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome, {user?.name}!</WelcomeTitle>
        <WelcomeText>
          Manage your smart contracts, create new agreements, and track your document status all in one place.
        </WelcomeText>
        <ActionButtons>
          <ActionButton to="/contracts/create">
            <FaPlus /> Create Contract
          </ActionButton>
          <ActionButton to="/contracts" className="secondary">
            <FaFileContract /> View All Contracts
          </ActionButton>
          <ActionButton to="/templates" className="secondary">
            <FaFileSignature /> Browse Templates
          </ActionButton>
        </ActionButtons>
      </WelcomeSection>

      <StatsSection>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatIcon>
            <FaFileContract />
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Contracts</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatIcon type="pending">
            <FaRegClock />
          </StatIcon>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pending Signatures</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatIcon type="completed">
            <FaCheckCircle />
          </StatIcon>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed Contracts</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatIcon type="expired">
            <FaExclamationTriangle />
          </StatIcon>
          <StatValue>{stats.expired}</StatValue>
          <StatLabel>Expired Contracts</StatLabel>
        </StatCard>
      </StatsSection>

      <ContractsSection>
        <SectionTitle>
          <FaFileContract /> Recent Contracts
        </SectionTitle>
        
        {contractsLoading ? (
          <Loader />
        ) : recentContracts.length > 0 ? (
          <ContractsList>
            {recentContracts.map((contract) => (
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
            <ActionButton to="/contracts/create">
              <FaPlus /> Create Your First Contract
            </ActionButton>
          </EmptyState>
        )}
      </ContractsSection>

      <NotificationsSection>
        <SectionTitle>
          <FaSearch /> Recent Notifications
        </SectionTitle>
        
        {notificationsLoading ? (
          <Loader />
        ) : recentNotifications.length > 0 ? (
          <NotificationsList>
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                to={notification.actionLink || '#'}
                unread={!notification.read}
              >
                <NotificationTitle unread={!notification.read}>
                  {notification.title}
                </NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationTime>{formatTime(notification.createdAt)}</NotificationTime>
              </NotificationItem>
            ))}
          </NotificationsList>
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              <FaSearch />
            </EmptyStateIcon>
            <EmptyStateText>No notifications yet.</EmptyStateText>
          </EmptyState>
        )}
      </NotificationsSection>
    </DashboardContainer>
  );
};

export default DashboardPage;
