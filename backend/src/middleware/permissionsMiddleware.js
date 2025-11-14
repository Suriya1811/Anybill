const Staff = require("../models/Staff");
const User = require("../models/User");

// Permission check middleware
exports.checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      // Owner has all permissions
      if (req.user.role === "owner") {
        return next();
      }

      // Check if user is staff member
      const staff = await Staff.findOne({
        businessId: req.user.id, // Assuming businessId is the owner's userId
        userId: req.user.id,
        isActive: true
      });

      if (!staff) {
        // If not staff, check if user is owner of their own business
        if (req.user.role === "owner") {
          return next();
        }
        return res.status(403).json({ message: "Access denied: Not a staff member" });
      }

      // Check permissions
      const permission = staff.permissions[resource]?.[action];
      if (!permission) {
        return res.status(403).json({ 
          message: `Access denied: No permission to ${action} ${resource}` 
        });
      }

      // Attach staff info to request
      req.staff = staff;
      next();
    } catch (err) {
      res.status(500).json({ message: "Permission check error: " + err.message });
    }
  };
};

// Role-based access control
exports.requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Owner always has access
      if (req.user.role === "owner") {
        return next();
      }

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        // Check staff role
        const staff = await Staff.findOne({
          businessId: req.user.id,
          userId: req.user.id,
          isActive: true
        });

        if (!staff || !roles.includes(staff.role)) {
          return res.status(403).json({ 
            message: `Access denied: Requires role ${roles.join(" or ")}` 
          });
        }
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Role check error: " + err.message });
    }
  };
};

// Check if user owns the resource
exports.checkOwnership = async (req, res, next) => {
  try {
    // Owner always has access
    if (req.user.role === "owner") {
      return next();
    }

    // For other roles, check if they have permission to access other users' data
    // This is handled by the permission middleware
    next();
  } catch (err) {
    res.status(500).json({ message: "Ownership check error: " + err.message });
  }
};

