import { Router } from 'express';
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/:productId', getReviewsByProduct);
router.post('/:productId', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
