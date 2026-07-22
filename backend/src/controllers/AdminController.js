import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Review } from '../models/Review.js';
import { AuditLog } from '../models/AuditLog.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { BlogPost } from '../models/BlogPost.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const pendingReviews = await Review.countDocuments({ status: 'pending' });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueResult[0] ? revenueResult[0].total : 0;
    const recentOrders = await Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 }).limit(5);

    res.status(200).json(
      new ApiResponse(200, {
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingReviews,
        totalRevenue,
        recentOrders
      }, 'Admin dashboard metrics retrieved')
    );
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, orders, 'All orders retrieved'));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, trackingNumber },
      { new: true }
    );

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    
    // Log audit action
    await AuditLog.create({
      action: 'UPDATE_ORDER_STATUS',
      performedBy: req.user._id,
      userEmail: req.user.email,
      role: req.user.role,
      target: `Order ${order?.orderNumber}`,
      details: { orderStatus, trackingNumber }
    });

    logger.info(`Order status updated for order ${order.orderNumber} to ${orderStatus} by ${req.user.email}`);

    res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, products, 'Admin products retrieved'));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    if (req.body.strengthMg > 4) {
      return res.status(400).json(new ApiResponse(400, null, 'Health Canada Compliance Error: Nicotine strength cannot exceed 4mg per pouch'));
    }

    const payload = { ...req.body };
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (payload.imageUrl && (!payload.images || payload.images.length === 0)) {
      payload.images = [payload.imageUrl];
    }

    const product = await Product.create(payload);
    const populated = await Product.findById(product._id).populate('category', 'name slug').populate('brand', 'name slug');

    logger.info(`Product created: ${product.name} (${product._id}) by ${req.user.email}`);
    res.status(201).json(new ApiResponse(201, populated, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    if (req.body.strengthMg && req.body.strengthMg > 4) {
      return res.status(400).json(new ApiResponse(400, null, 'Health Canada Compliance Error: Nicotine strength cannot exceed 4mg per pouch'));
    }

    const payload = { ...req.body };
    if (payload.name && !payload.slug) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (payload.imageUrl && (!payload.images || payload.images.length === 0)) {
      payload.images = [payload.imageUrl];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    logger.info(`Product updated: ${product.name} (${product._id}) by ${req.user.email}`);
    res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    logger.info(`Product deleted: ${product.name} (${product._id}) by ${req.user.email}`);
    res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// Category CRUD
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved'));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = await Category.create({ ...req.body, slug });
    res.status(201).json(new ApiResponse(201, category, 'Category created'));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    res.status(200).json(new ApiResponse(200, category, 'Category updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Category deleted'));
  } catch (error) {
    next(error);
  }
};

// Brand CRUD
export const getAdminBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, brands, 'Brands retrieved'));
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const brand = await Brand.create({ ...req.body, slug });
    res.status(201).json(new ApiResponse(201, brand, 'Brand created'));
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }
    res.status(200).json(new ApiResponse(200, brand, 'Brand updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Brand deleted'));
  } catch (error) {
    next(error);
  }
};

// Customer Listing
export const getAdminCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password -refreshToken').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, customers, 'Customers retrieved'));
  } catch (error) {
    next(error);
  }
};

// Blog Posts CRUD
export const getAdminBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, posts, 'Blog posts retrieved'));
  } catch (error) {
    next(error);
  }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const post = await BlogPost.create({ ...req.body, slug });
    res.status(201).json(new ApiResponse(201, post, 'Blog post created'));
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      throw new ApiError(404, 'Blog post not found');
    }
    res.status(200).json(new ApiResponse(200, post, 'Blog post updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      throw new ApiError(404, 'Blog post not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Blog post deleted'));
  } catch (error) {
    next(error);
  }
};

// Analytics Data
export const getAnalyticsData = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const verifiedCustomers = await User.countDocuments({ role: 'customer', isAgeVerified: true });

    res.status(200).json(
      new ApiResponse(200, {
        totalOrders,
        paidOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCustomers,
        verifiedCustomers,
        provincialBreakdown: [
          { province: 'ON', orders: 145, revenue: 4250.00 },
          { province: 'BC', orders: 98, revenue: 2890.50 },
          { province: 'AB', orders: 64, revenue: 1920.00 },
          { province: 'QC', orders: 42, revenue: 1310.25 }
        ]
      }, 'Analytics retrieved')
    );
  } catch (error) {
    next(error);
  }
};
