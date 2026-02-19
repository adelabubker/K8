// middleware/auth.js — JWT + role-based access control middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect routes: verify JWT token ───────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and verify token matches stored token (allows logout invalidation)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (user.token !== token) {
      return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// ─── Role-based access: restrict to specific roles ──────────────────────────
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
};

// ─── Convenience middleware exports ─────────────────────────────────────────
const adminOnly = [protect, authorize('admin', 'fullAdmin')];
const fullAdminOnly = [protect, authorize('fullAdmin')];

module.exports = { protect, authorize, adminOnly, fullAdminOnly };
