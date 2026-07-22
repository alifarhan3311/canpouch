export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  COMPLIANCE_OFFICER: 'compliance_officer'
};

export const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta', minAge: 18, taxRate: 0.05, taxName: 'GST', restricted: false },
  { code: 'BC', name: 'British Columbia', minAge: 19, taxRate: 0.12, taxName: 'PST+GST', restricted: false },
  { code: 'MB', name: 'Manitoba', minAge: 19, taxRate: 0.12, taxName: 'PST+GST', restricted: false },
  { code: 'NB', name: 'New Brunswick', minAge: 19, taxRate: 0.15, taxName: 'HST', restricted: false },
  { code: 'NL', name: 'Newfoundland and Labrador', minAge: 19, taxRate: 0.15, taxName: 'HST', restricted: false },
  { code: 'NS', name: 'Nova Scotia', minAge: 19, taxRate: 0.15, taxName: 'HST', restricted: false },
  { code: 'NT', name: 'Northwest Territories', minAge: 19, taxRate: 0.05, taxName: 'GST', restricted: false },
  { code: 'NU', name: 'Nunavut', minAge: 19, taxRate: 0.05, taxName: 'GST', restricted: false },
  { code: 'ON', name: 'Ontario', minAge: 19, taxRate: 0.13, taxName: 'HST', restricted: false },
  { code: 'PE', name: 'Prince Edward Island', minAge: 19, taxRate: 0.15, taxName: 'HST', restricted: false },
  { code: 'QC', name: 'Quebec', minAge: 21, taxRate: 0.14975, taxName: 'QST+GST', restricted: false },
  { code: 'SK', name: 'Saskatchewan', minAge: 19, taxRate: 0.11, taxName: 'PST+GST', restricted: false },
  { code: 'YT', name: 'Yukon', minAge: 19, taxRate: 0.05, taxName: 'GST', restricted: false }
];

export const BANNED_HEALTH_CLAIMS = [
  'healthy',
  'health',
  'safe',
  'doctor recommended',
  'medical',
  'medicine',
  'treatment',
  'treat',
  'cure',
  'healing',
  'risk free',
  'risk-free',
  'harmless',
  'better than smoking',
  'safer than cigarettes',
  'therapeutic',
  'remedy',
  'wellness',
  'detox',
  'vitamin'
];

export const MANDATORY_PRODUCT_WARNINGS = [
  "WARNING: This product contains nicotine. Nicotine is an addictive chemical.",
  "FOR ADULTS ONLY (18+/19+/21+ depending on province). Keep out of reach of children and pets.",
  "NOT RECOMMENDED for pregnant or breastfeeding women, or individuals with heart conditions."
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  AGE_VERIFIED: 'age_verified',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RESTRICTED_BLOCKED: 'restricted_blocked'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};
