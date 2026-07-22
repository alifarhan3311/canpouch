import { ComplianceService } from '../services/ComplianceService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { MANDATORY_PRODUCT_WARNINGS } from '../constants/index.js';

export const verifyAgeAndProvince = async (req, res, next) => {
  try {
    const { province, dateOfBirth } = req.body;
    const result = await ComplianceService.verifyAgeAndProvince(province, dateOfBirth);
    res.status(200).json(new ApiResponse(200, result, 'Compliance check result'));
  } catch (error) {
    next(error);
  }
};

export const getComplianceRules = async (req, res, next) => {
  try {
    const rules = await ComplianceService.getAllRules();
    res.status(200).json(new ApiResponse(200, { rules, warnings: MANDATORY_PRODUCT_WARNINGS }, 'Compliance rules retrieved'));
  } catch (error) {
    next(error);
  }
};

export const updateProvinceRule = async (req, res, next) => {
  try {
    const { provinceCode } = req.params;
    const rule = await ComplianceService.updateRule(provinceCode, req.body);
    res.status(200).json(new ApiResponse(200, rule, 'Province rule updated'));
  } catch (error) {
    next(error);
  }
};
