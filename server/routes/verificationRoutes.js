import express from 'express';
import { verifyContract } from '../controllers/contractController.js';

const router = express.Router();

router.route('/:code').get(verifyContract);

export default router;
