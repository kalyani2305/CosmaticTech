import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:id', updateCartItem);
router.delete('/remove/:id', removeFromCart);

export default router;
