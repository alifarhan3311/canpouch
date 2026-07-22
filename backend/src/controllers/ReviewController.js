import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: `${req.user.firstName} ${req.user.lastName[0]}.`,
      rating,
      comment,
      status: 'pending' // Requires admin/compliance moderation
    });

    logger.info(`Review submitted for moderation by user ${req.user._id} on product ${productId}`);
    res.status(201).json(new ApiResponse(201, review, 'Review submitted for compliance moderation'));
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, reviews, 'Approved product reviews'));
  } catch (error) {
    next(error);
  }
};

export const getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'pending' }).populate('product', 'name');
    res.status(200).json(new ApiResponse(200, reviews, 'Pending reviews queue'));
  } catch (error) {
    next(error);
  }
};

export const moderateReview = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // approved | rejected
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason, moderatedBy: req.user._id },
      { new: true }
    );

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    // Update product average rating if approved
    if (status === 'approved' && review) {
      const approvedReviews = await Review.find({ product: review.product, status: 'approved' });
      const avg = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / (approvedReviews.length || 1);
      await Product.findByIdAndUpdate(review.product, {
        averageRating: Number(avg.toFixed(1)),
        numReviews: approvedReviews.length
      });
    }

    logger.info(`Review ${review._id} moderated: status=${status} by user ${req.user._id}`);
    res.status(200).json(new ApiResponse(200, review, `Review ${status}`));
  } catch (error) {
    next(error);
  }
};
