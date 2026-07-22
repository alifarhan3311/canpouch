import express from 'express';
import { verifyAgeAndProvince, getComplianceRules, updateProvinceRule } from '../controllers/ComplianceController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate, complianceSchemas } from '../middlewares/validateRequest.js';
import { sensitiveActionLimiter } from '../middlewares/rateLimiters.js';

const router = express.Router();

router.post('/verify-age-province', sensitiveActionLimiter, validate(complianceSchemas.verifyAgeProvince), verifyAgeAndProvince);
router.get('/rules', getComplianceRules);
router.put('/rules/:provinceCode', protect, authorize('admin', 'compliance_officer'), updateProvinceRule);

export default router;
