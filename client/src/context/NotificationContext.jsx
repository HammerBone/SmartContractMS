import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import AuthContext from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/notifications');
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.response?.data?.message || 'Error fetching notifications');
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch notifications for the authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      
      // Update notifications list
      setNotifications(
        notifications.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError(error.response?.data?.message || 'Error marking notification as read');
      toast.error('Failed to mark notification as read');
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      
      // Update all notifications to read
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError(error.response?.data?.message || 'Error marking all notifications as read');
      toast.error('Failed to mark all notifications as read');
      return false;
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      
      // Remove from notifications list
      setNotifications(notifications.filter((notification) => notification._id !== id));
      
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError(error.response?.data?.message || 'Error deleting notification');
      toast.error('Failed to delete notification');
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
