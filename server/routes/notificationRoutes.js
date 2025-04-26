import express from 'express';
import { getNotifications } from '../controllers/notificationController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
// router.get('/history', protect, getVerificationHistory);

export default router;
