import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication token missing or invalid'));
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'canpouch_super_secret_jwt_key_2026_enterprise_sec!';
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      logger.warn(`Unauthorized access attempt: User associated with token (${decoded.id}) no longer exists`);
      return next(new ApiError(401, 'User associated with token no longer exists'));
    }

    req.user = user;
    next();
  } catch (err) {
    logger.warn(`Token verification failed: ${err.message} - Path: ${req.originalUrl}`);
    return next(new ApiError(401, 'Invalid or expired authentication token'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `RBAC Violation: User '${req.user?._id}' with role '${req.user?.role}' attempted to access restricted endpoint '${req.originalUrl}'`
      );
      return next(
        new ApiError(403, `Forbidden: Role '${req.user?.role || 'guest'}' is not authorized for this resource`)
      );
    }
    next();
  };
};
