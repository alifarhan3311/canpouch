import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export class AuthService {
  static getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!');
    }
    return secret || 'canpouch_super_secret_jwt_key_2026_enterprise_sec!';
  }

  static getRefreshTokenSecret() {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: REFRESH_TOKEN_SECRET environment variable is missing in production!');
    }
    return secret || 'canpouch_refresh_token_super_secret_key_2026!';
  }

  static generateTokens(userId) {
    const accessToken = jwt.sign(
      { id: userId },
      this.getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      this.getRefreshTokenSecret(),
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  static async registerUser(userData) {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase().trim() });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    // Verify age (must be at least 18)
    const dob = new Date(userData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      throw new ApiError(400, 'You must be at least 18 years old to register on CanPouch.');
    }

    const user = await User.create({
      ...userData,
      email: userData.email.toLowerCase().trim(),
      isAgeVerified: true,
      ageVerifiedAt: new Date()
    });

    const tokens = this.generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    logger.info(`User registered successfully: ${user.email} (${user._id})`);

    // Remove password from user object
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return { user: userObject, tokens };
  }

  static async loginUser(email, password, ipAddress = 'unknown') {
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshToken');

    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Failed login attempt for email: ${normalizedEmail} from IP: ${ipAddress}`);
      throw new ApiError(401, 'Invalid email or password');
    }

    const tokens = this.generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    logger.info(`Successful login for user: ${user.email} (${user._id}) from IP: ${ipAddress}`);

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return { user: userObject, tokens };
  }

  static async refreshTokens(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token required');
    }

    try {
      const decoded = jwt.verify(incomingRefreshToken, this.getRefreshTokenSecret());
      const user = await User.findById(decoded.id).select('+refreshToken');

      if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, 'Invalid or revoked refresh token');
      }

      // Rotate tokens
      const tokens = this.generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return { user, tokens };
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  static async logoutUser(userId) {
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
      logger.info(`User logged out and token revoked: ${userId}`);
    }
    return true;
  }
}
