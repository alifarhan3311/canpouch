export const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  error: (msg, meta = {}) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  audit: (action, target, userId, ip) => {
    console.log(`[AUDIT] [${new Date().toISOString()}] Action: ${action} | Target: ${target} | User: ${userId} | IP: ${ip}`);
  }
};
