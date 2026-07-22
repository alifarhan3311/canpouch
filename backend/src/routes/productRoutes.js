import express from 'express';
import { getProducts, getProductBySlug, getCategories, getBrands } from '../controllers/ProductController.js';
import { sanitizeHealthClaims } from '../middlewares/contentSanitizer.js';

const router = express.Router();

router.get('/', sanitizeHealthClaims, getProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/:slug', getProductBySlug);

export default router;
