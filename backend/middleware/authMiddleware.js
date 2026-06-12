/**
 * Auth Middleware
 * Provides reusable Express middleware for JWT authentication and role-based access control.
 */
const jwt = require('jsonwebtoken');

/**
 * requireAuth
 * Verifies a Bearer JWT from the Authorization header.
 * Attaches the decoded payload to req.user on success.
 * Returns 401 on missing or invalid tokens.
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    console.error('[AuthMiddleware] requireAuth failed:', error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
  }
};

/**
 * requireAdmin
 * Must be used AFTER requireAuth.
 * Blocks non-admin roles with a 403 Forbidden response.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
