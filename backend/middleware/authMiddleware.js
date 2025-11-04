const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/db');

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database to ensure user still exists and is active
    const [users] = await promisePool.query(
      'SELECT id, email, role, name, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    if (!users[0].is_active) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

// Check if user is the owner of the resource
const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Admin can access everything
      if (userRole === 'admin') {
        return next();
      }

      let query;
      let params;

      switch (resourceType) {
        case 'job':
          query = 'SELECT employer_id FROM jobs WHERE id = ?';
          params = [resourceId];
          break;
        case 'application':
          query = 'SELECT seeker_id FROM applications WHERE id = ?';
          params = [resourceId];
          break;
        case 'company':
          query = 'SELECT employer_id FROM companies WHERE id = ?';
          params = [resourceId];
          break;
        default:
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid resource type' 
          });
      }

      const [results] = await promisePool.query(query, params);

      if (!results || results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Resource not found' 
        });
      }

      const ownerId = results[0].employer_id || results[0].seeker_id;

      if (ownerId !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You do not own this resource.' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error checking ownership', 
        error: error.message 
      });
    }
  };
};

module.exports = { verifyToken, authorize, checkOwnership };
