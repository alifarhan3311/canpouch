import { BANNED_HEALTH_CLAIMS } from '../constants/index.js';
import { ApiError } from '../utils/apiError.js';

export const sanitizeHealthClaims = (req, res, next) => {
  const checkText = (text) => {
    if (!text || typeof text !== 'string') return null;
    const lowerText = text.toLowerCase();
    for (const claim of BANNED_HEALTH_CLAIMS) {
      if (lowerText.includes(claim)) {
        return claim;
      }
    }
    return null;
  };

  const fieldsToCheck = [req.body.comment, req.body.title, req.body.content, req.body.description, req.query.search];

  for (const field of fieldsToCheck) {
    const foundClaim = checkText(field);
    if (foundClaim) {
      return next(
        new ApiError(
          400,
          `Canadian Compliance Violation: Content contains prohibited health/medical claim term ('${foundClaim}'). Under Health Canada rules, medical or health statements regarding nicotine pouches are strictly prohibited.`
        )
      );
    }
  }

  next();
};
