import { ComplianceRule } from '../models/ComplianceRule.js';
import { ApiError } from '../utils/apiError.js';
import { CANADIAN_PROVINCES } from '../constants/index.js';

export class ComplianceService {
  static async verifyAgeAndProvince(provinceCode, dateOfBirth) {
    const rule = await ComplianceRule.findOne({ provinceCode: provinceCode.toUpperCase() });
    const provinceData = rule || CANADIAN_PROVINCES.find(p => p.code === provinceCode.toUpperCase());

    if (!provinceData) {
      throw new ApiError(400, `Invalid Canadian province code: ${provinceCode}`);
    }

    if (provinceData.isRestricted) {
      return {
        allowed: false,
        reason: provinceData.restrictionReason || `Shipping of nicotine products is currently restricted in ${provinceData.provinceName || provinceCode}.`
      };
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < provinceData.minAge) {
      return {
        allowed: false,
        reason: `Age verification failed: Minimum required legal age in ${provinceData.provinceName || provinceCode} is ${provinceData.minAge} years. You are ${age} years old.`
      };
    }

    return {
      allowed: true,
      minAge: provinceData.minAge,
      taxRate: provinceData.taxRate,
      taxName: provinceData.taxName
    };
  }

  static async getAllRules() {
    return await ComplianceRule.find().sort({ provinceName: 1 });
  }

  static async updateRule(provinceCode, updateData) {
    return await ComplianceRule.findOneAndUpdate(
      { provinceCode: provinceCode.toUpperCase() },
      updateData,
      { new: true, upsert: true }
    );
  }
}
