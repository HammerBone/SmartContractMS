import express from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTemplate)
  .get(protect, getTemplates);

router.route('/:id')
  .get(protect, getTemplateById)
  .put(protect, updateTemplate)
  .delete(protect, deleteTemplate);

export default router;
