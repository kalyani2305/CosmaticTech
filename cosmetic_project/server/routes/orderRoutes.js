import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/admin', authMiddleware, adminMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
