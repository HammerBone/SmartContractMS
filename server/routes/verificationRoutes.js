import express from 'express';
import { verifyContract, getVerificationHistory } from '../controllers/verificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:code', verifyContract);
router.get('/history', protect, getVerificationHistory);

export default router;
