import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware);
router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
