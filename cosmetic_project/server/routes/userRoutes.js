import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

export default router;
