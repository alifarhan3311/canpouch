import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getAdminCustomers,
  getAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAnalyticsData
} from '../controllers/AdminController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate, validateObjectId, productSchemas } from '../middlewares/validateRequest.js';

const router = express.Router();

router.use(protect, authorize('admin', 'compliance_officer'));

router.get('/dashboard-stats', getDashboardStats);

// Products
router.get('/products', getAdminProducts);
router.post('/products', validate(productSchemas.createProduct), createProduct);
router.put('/products/:id', validateObjectId('id'), validate(productSchemas.updateProduct), updateProduct);
router.delete('/products/:id', validateObjectId('id'), deleteProduct);

// Categories
router.get('/categories', getAdminCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', validateObjectId('id'), updateCategory);
router.delete('/categories/:id', validateObjectId('id'), deleteCategory);

// Brands
router.get('/brands', getAdminBrands);
router.post('/brands', createBrand);
router.put('/brands/:id', validateObjectId('id'), updateBrand);
router.delete('/brands/:id', deleteBrand);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', validateObjectId('id'), updateOrderStatus);

// Customers
router.get('/customers', getAdminCustomers);

// Blog
router.get('/blog', getAdminBlogPosts);
router.post('/blog', createBlogPost);
router.put('/blog/:id', validateObjectId('id'), updateBlogPost);
router.delete('/blog/:id', validateObjectId('id'), deleteBlogPost);

// Analytics
router.get('/analytics', getAnalyticsData);

export default router;
