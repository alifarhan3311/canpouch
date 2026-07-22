import { OrderService } from '../services/OrderService.js';
import { Order } from '../models/Order.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await OrderService.createOrder({
      userId: req.user._id,
      ...req.body
    });
    logger.info(`Order created successfully: ${order.orderNumber} by user ${req.user._id}`);
    res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, orders, 'Customer orders retrieved'));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    
    // BOLA Check: Verify user owns the order unless admin/compliance_officer
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'compliance_officer'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      logger.warn(`BOLA Violation Attempt: User ${req.user._id} attempted to view order ${order._id} owned by ${order.user}`);
      throw new ApiError(403, 'Forbidden: You are not authorized to view this order');
    }

    res.status(200).json(new ApiResponse(200, order, 'Order details retrieved'));
  } catch (error) {
    next(error);
  }
};
