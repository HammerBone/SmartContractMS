import express from 'express';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead, 
  deleteNotification 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.route('/:id/read')
  .put(protect, markNotificationRead);

router.route('/read-all')
  .put(protect, markAllNotificationsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

export default router; 