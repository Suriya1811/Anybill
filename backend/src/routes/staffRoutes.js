const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { requireRole, checkPermission } = require("../middleware/permissionsMiddleware");
const Staff = require("../models/Staff");
const User = require("../models/User");

// Get all staff members
router.get("/staff", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const staff = await Staff.find({
      businessId: req.user.id,
      isActive: true
    })
      .populate("userId", "name email phone")
      .populate("invitedBy", "name")
      .sort({ role: 1, createdAt: -1 });

    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff: " + err.message });
  }
});

// Get single staff member
router.get("/staff/:id", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const staff = await Staff.findOne({
      _id: req.params.id,
      businessId: req.user.id
    })
      .populate("userId", "name email phone")
      .populate("invitedBy", "name");

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff: " + err.message });
  }
});

// Invite staff member
router.post("/staff/invite", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const { phone, email, name, role, permissions } = req.body;

    // Check if user already exists
    let user = await User.findOne({ phone });
    if (!user) {
      // Create new user account
      user = await User.create({
        name,
        phone,
        email: email || "",
        businessName: req.user.businessName,
        businessType: req.user.businessType,
        role: "user", // Staff users have role "user"
        isProfileComplete: false
      });
    }

    // Check if already a staff member
    const existingStaff = await Staff.findOne({
      businessId: req.user.id,
      userId: user._id
    });

    if (existingStaff) {
      return res.status(400).json({ message: "User is already a staff member" });
    }

    // Default permissions based on role
    const defaultPermissions = getDefaultPermissions(role);

    // Create staff record
    const staff = await Staff.create({
      businessId: req.user.id,
      userId: user._id,
      name: name || user.name,
      email: email || user.email,
      phone: user.phone,
      role: role || "staff",
      permissions: permissions || defaultPermissions,
      invitedBy: req.user.id,
      invitedAt: new Date()
    });

    res.json({ 
      success: true, 
      staff,
      message: "Staff member invited successfully. They will receive an OTP to join." 
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to invite staff: " + err.message });
  }
});

// Update staff member
router.put("/staff/:id", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const { role, permissions, isActive } = req.body;

    // Only owner can change roles
    if (role && req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can change roles" });
    }

    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.id },
      { role, permissions, isActive },
      { new: true }
    )
      .populate("userId", "name email phone");

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ success: true, staff, message: "Staff member updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update staff: " + err.message });
  }
});

// Update staff permissions
router.put("/staff/:id/permissions", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const { permissions } = req.body;

    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.id },
      { permissions },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ success: true, staff, message: "Permissions updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update permissions: " + err.message });
  }
});

// Remove staff member (soft delete)
router.delete("/staff/:id", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const staff = await Staff.findOne({
      _id: req.params.id,
      businessId: req.user.id
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Cannot remove owner
    if (staff.role === "owner") {
      return res.status(400).json({ message: "Cannot remove owner" });
    }

    await Staff.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({ success: true, message: "Staff member removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove staff: " + err.message });
  }
});

// Get my staff profile
router.get("/staff/me", verifyToken, async (req, res) => {
  try {
    const staff = await Staff.findOne({
      businessId: req.user.id,
      userId: req.user.id,
      isActive: true
    })
      .populate("businessId", "businessName businessType")
      .populate("userId", "name email phone");

    if (!staff) {
      // If not staff, return user info
      return res.json({
        success: true,
        staff: {
          role: req.user.role,
          userId: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          isOwner: req.user.role === "owner"
        }
      });
    }

    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff profile: " + err.message });
  }
});

// Helper function to get default permissions based on role
function getDefaultPermissions(role) {
  const permissions = {
    owner: {
      invoices: { view: true, create: true, edit: true, delete: true, share: true },
      customers: { view: true, create: true, edit: true, delete: true },
      products: { view: true, create: true, edit: true, delete: true },
      inventory: { view: true, adjust: true, delete: true },
      reports: { view: true, export: true },
      settings: { view: true, edit: true },
      staff: { view: true, create: true, edit: true, delete: true }
    },
    admin: {
      invoices: { view: true, create: true, edit: true, delete: true, share: true },
      customers: { view: true, create: true, edit: true, delete: true },
      products: { view: true, create: true, edit: true, delete: true },
      inventory: { view: true, adjust: true, delete: false },
      reports: { view: true, export: true },
      settings: { view: true, edit: false },
      staff: { view: true, create: false, edit: false, delete: false }
    },
    manager: {
      invoices: { view: true, create: true, edit: true, delete: false, share: true },
      customers: { view: true, create: true, edit: true, delete: false },
      products: { view: true, create: true, edit: true, delete: false },
      inventory: { view: true, adjust: true, delete: false },
      reports: { view: true, export: false },
      settings: { view: false, edit: false },
      staff: { view: false, create: false, edit: false, delete: false }
    },
    accountant: {
      invoices: { view: true, create: true, edit: true, delete: false, share: true },
      customers: { view: true, create: true, edit: true, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      inventory: { view: true, adjust: false, delete: false },
      reports: { view: true, export: true },
      settings: { view: false, edit: false },
      staff: { view: false, create: false, edit: false, delete: false }
    },
    sales: {
      invoices: { view: true, create: true, edit: true, delete: false, share: true },
      customers: { view: true, create: true, edit: true, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      inventory: { view: true, adjust: false, delete: false },
      reports: { view: true, export: false },
      settings: { view: false, edit: false },
      staff: { view: false, create: false, edit: false, delete: false }
    },
    staff: {
      invoices: { view: true, create: true, edit: false, delete: false, share: true },
      customers: { view: true, create: true, edit: false, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      inventory: { view: true, adjust: false, delete: false },
      reports: { view: false, export: false },
      settings: { view: false, edit: false },
      staff: { view: false, create: false, edit: false, delete: false }
    }
  };

  return permissions[role] || permissions.staff;
}

module.exports = router;

