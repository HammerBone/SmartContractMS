import express from 'express';
import {
  createContract,
  getContracts,
  getContractById,
  signContract,
  verifyContract,
} from '../controllers/contractController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createContract)
  .get(protect, getContracts);

router.route('/:id')
  .get(protect, getContractById);

router.route('/:id/sign')
  .put(protect, signContract);

router.route('/verify/:code')
  .get(verifyContract);

export default router;
