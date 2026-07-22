import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/OrderController.js';
import { protect } from '../middlewares/auth.js';
import { validate, validateObjectId, orderSchemas } from '../middlewares/validateRequest.js';
import { sensitiveActionLimiter } from '../middlewares/rateLimiters.js';

const router = express.Router();

router.use(protect);

router.post('/', sensitiveActionLimiter, validate(orderSchemas.createOrder), createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', validateObjectId('id'), getOrderById);

export default router;
