import express from 'express';
import { createReview, getProductReviews, getPendingReviews, moderateReview } from '../controllers/ReviewController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { sanitizeHealthClaims } from '../middlewares/contentSanitizer.js';
import { validate, validateObjectId, reviewSchemas } from '../middlewares/validateRequest.js';

const router = express.Router();

router.get('/product/:productId', validateObjectId('productId'), getProductReviews);
router.post('/', protect, sanitizeHealthClaims, validate(reviewSchemas.createReview), createReview);
router.get('/pending', protect, authorize('admin', 'compliance_officer'), getPendingReviews);
router.put('/:id/moderate', protect, authorize('admin', 'compliance_officer'), validateObjectId('id'), validate(reviewSchemas.moderateReview), moderateReview);

export default router;
