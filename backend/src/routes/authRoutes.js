import express from 'express';
import { register, login, refreshToken, logout, getProfile } from '../controllers/AuthController.js';
import { protect } from '../middlewares/auth.js';
import { validate, authSchemas } from '../middlewares/validateRequest.js';
import { authLimiter } from '../middlewares/rateLimiters.js';

const router = express.Router();

router.post('/register', authLimiter, validate(authSchemas.register), register);
router.post('/login', authLimiter, validate(authSchemas.login), login);
router.post('/refresh', authLimiter, validate(authSchemas.refreshToken), refreshToken);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

export default router;
