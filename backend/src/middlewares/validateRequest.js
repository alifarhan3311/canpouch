import Joi from 'joi';
import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';

/**
 * Higher-order middleware to validate request body, params, or query against a Joi schema
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    if (!schema) return next();

    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true, // Strip unexpected fields for security
      allowUnknown: false
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new ApiError(400, `Validation Error: ${errorMessage}`, error.details));
    }

    req[property] = value;
    next();
  };
};

/**
 * Validate MongoDB ObjectId in req.params
 */
export const validateObjectId = (paramNames = ['id']) => {
  return (req, res, next) => {
    const paramsToCheck = Array.isArray(paramNames) ? paramNames : [paramNames];
    
    for (const paramName of paramsToCheck) {
      const id = req.params[paramName];
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, `Invalid resource identifier format for '${paramName}': ${id}`));
      }
    }
    
    next();
  };
};

// Common Joi Schemas
export const authSchemas = {
  register: Joi.object({
    firstName: Joi.string().trim().min(1).max(50).required(),
    lastName: Joi.string().trim().min(1).max(50).required(),
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().min(8).max(100).required().messages({
      'string.min': 'Password must be at least 8 characters long'
    }),
    dateOfBirth: Joi.date().iso().required(),
    province: Joi.string().length(2).uppercase().required()
  }),

  login: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().required()
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().optional()
  })
};

export const orderSchemas = {
  createOrder: Joi.object({
    orderItems: Joi.array().items(
      Joi.object({
        product: Joi.string().custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        }, 'ObjectId validation').required(),
        quantity: Joi.number().integer().min(1).max(100).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      street: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      province: Joi.string().length(2).uppercase().required(),
      postalCode: Joi.string().trim().required(),
      country: Joi.string().trim().default('Canada')
    }).required(),
    dateOfBirth: Joi.date().iso().required(),
    paymentMethodToken: Joi.string().trim().allow('', null)
  })
};

export const reviewSchemas = {
  createReview: Joi.object({
    productId: Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
      return value;
    }).required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().min(3).max(1000).required()
  }),
  moderateReview: Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
    rejectionReason: Joi.string().trim().allow('', null)
  })
};

export const productSchemas = {
  createProduct: Joi.object({
    name: Joi.string().trim().required(),
    sku: Joi.string().trim().required(),
    slug: Joi.string().trim().allow('', null).optional(),
    description: Joi.string().trim().allow('').optional(),
    price: Joi.number().positive().required(),
    compareAtPrice: Joi.number().positive().allow(null).optional(),
    strengthMg: Joi.number().min(0).max(20).required(),
    pouchesPerCan: Joi.number().integer().min(1).default(20),
    flavor: Joi.string().trim().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().allow('')).optional(),
    imageUrl: Joi.string().allow('').optional(),
    nhpNumber: Joi.string().allow('').optional(),
    isFeatured: Joi.boolean().default(false),
    isNewArrival: Joi.boolean().default(false),
    isBestSeller: Joi.boolean().default(false),
    warnings: Joi.array().items(Joi.string()).optional()
  }),
  updateProduct: Joi.object({
    name: Joi.string().trim().optional(),
    sku: Joi.string().trim().optional(),
    slug: Joi.string().trim().allow('', null).optional(),
    description: Joi.string().trim().allow('').optional(),
    price: Joi.number().positive().optional(),
    compareAtPrice: Joi.number().positive().allow(null).optional(),
    strengthMg: Joi.number().min(0).max(20).optional(),
    pouchesPerCan: Joi.number().integer().min(1).optional(),
    flavor: Joi.string().trim().optional(),
    brand: Joi.string().optional(),
    category: Joi.string().optional(),
    stock: Joi.number().integer().min(0).optional(),
    images: Joi.array().items(Joi.string().allow('')).optional(),
    imageUrl: Joi.string().allow('').optional(),
    nhpNumber: Joi.string().allow('').optional(),
    isFeatured: Joi.boolean().optional(),
    isNewArrival: Joi.boolean().optional(),
    isBestSeller: Joi.boolean().optional(),
    warnings: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional()
  })
};

export const complianceSchemas = {
  verifyAgeProvince: Joi.object({
    province: Joi.string().length(2).uppercase().required(),
    dateOfBirth: Joi.date().iso().required()
  })
};
