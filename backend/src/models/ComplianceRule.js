import mongoose from 'mongoose';

const complianceRuleSchema = new mongoose.Schema(
  {
    provinceCode: { type: String, required: true, unique: true, uppercase: true },
    provinceName: { type: String, required: true },
    minAge: { type: Number, required: true, default: 19 },
    taxRate: { type: Number, required: true, default: 0.13 }, // decimal e.g. 0.13 for 13%
    taxName: { type: String, required: true, default: 'HST' },
    isRestricted: { type: Boolean, default: false }, // If true, shipping to this province is blocked
    restrictionReason: { type: String, default: '' },
    warningNotice: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ComplianceRule = mongoose.model('ComplianceRule', complianceRuleSchema);
