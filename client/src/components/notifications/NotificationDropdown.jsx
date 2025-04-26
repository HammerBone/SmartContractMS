import { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBell, FaCheck, FaTrash, FaSync } from 'react-icons/fa';
import NotificationContext from '../../context/NotificationContext';
import Loader from '../common/Loader';

const DropdownContainer = styled(motion.div)`
  position: absolute;
  top: 40px;
  right: 0;
  width: 320px;
  max-height: 400px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--light-gray);
`;

const DropdownTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MarkAllRead = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  max-height: 320px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: var(--dark-gray);
`;

const NotificationItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid var(--light-gray);
  background-color: ${props => props.unread ? 'rgba(58, 134, 255, 0.05)' : 'white'};
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

const NotificationContent = styled(Link)`
  display: block;
  color: var(--text-color);
  text-decoration: none;
`;

const NotificationTitle = styled.h4`
  font-size: 0.9rem;
  margin: 0 0 5px 0;
  color: ${props => props.unread ? 'var(--primary-color)' : 'var(--text-color)'};
`;

const NotificationMessage = styled.p`
  font-size: 0.8rem;
  margin: 0;
  color: var(--dark-gray);
`;

const NotificationTime = styled.span`
  font-size: 0.7rem;
  color: var(--medium-gray);
  display: block;
  margin-top: 5px;
`;

const NotificationActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 0.8rem;
  color: var(--dark-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    color: ${props => props.delete ? 'var(--danger-color)' : 'var(--primary-color)'};
  }
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    font-size: 0.9rem;
  }
  
  &.loading {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useContext(NotificationContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

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

  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    await markAsRead(id);
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleRefresh = async () => {
    await fetchNotifications();
  };

  return (
    <DropdownContainer
      ref={dropdownRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <DropdownHeader>
        <DropdownTitle>
          <FaBell /> Notifications
          {unreadCount > 0 && <span>({unreadCount})</span>}
        </DropdownTitle>
        <div style={{ display: 'flex', gap: '10px' }}>
          <RefreshButton onClick={handleRefresh} className={loading ? 'loading' : ''}>
            <FaSync /> Refresh
          </RefreshButton>
          {unreadCount > 0 && (
            <MarkAllRead onClick={handleMarkAllAsRead}>Mark all as read</MarkAllRead>
          )}
        </div>
      </DropdownHeader>

      <NotificationList>
        {loading ? (
          <Loader size="30px" text="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <EmptyState>No notifications yet</EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification._id} unread={!notification.read}>
              <NotificationContent to={notification.actionLink || '#'}>
                <NotificationTitle unread={!notification.read}>
                  {notification.title}
                </NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationTime>{formatTime(notification.createdAt)}</NotificationTime>
                
                <NotificationActions>
                  {!notification.read && (
                    <ActionButton onClick={(e) => handleMarkAsRead(notification._id, e)}>
                      <FaCheck size={12} /> Mark as read
                    </ActionButton>
                  )}
                  <ActionButton delete onClick={(e) => handleDelete(notification._id, e)}>
                    <FaTrash size={12} /> Delete
                  </ActionButton>
                </NotificationActions>
              </NotificationContent>
            </NotificationItem>
          ))
        )}
      </NotificationList>
    </DropdownContainer>
  );
};

export default NotificationDropdown;
