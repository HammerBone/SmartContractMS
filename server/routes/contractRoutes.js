import express from 'express';
import { 
  createContract, 
  getContracts, 
  getContractById, 
  updateContract, 
  deleteContract, 
  signContract 
} from '../controllers/contractController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createContract)
  .get(protect, getContracts);

router.route('/:id')
  .get(protect, getContractById)
  .put(protect, updateContract)
  .delete(protect, deleteContract);

router.post('/:id/sign', protect, signContract);

export default router;
