const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/permissionsMiddleware");
const Business = require("../models/Business");
const User = require("../models/User");

// Get all businesses/branches
router.get("/businesses", verifyToken, async (req, res) => {
  try {
    const businesses = await Business.find({
      ownerId: req.user.id,
      isActive: true
    }).sort({ isDefault: -1, createdAt: -1 });

    res.json({ success: true, businesses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch businesses: " + err.message });
  }
});

// Get single business
router.get("/businesses/:id", verifyToken, async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({ success: true, business });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch business: " + err.message });
  }
});

// Get default business
router.get("/businesses/default", verifyToken, async (req, res) => {
  try {
    let business = await Business.findOne({
      ownerId: req.user.id,
      isDefault: true,
      isActive: true
    });

    // If no default, get first business or create one
    if (!business) {
      business = await Business.findOne({
        ownerId: req.user.id,
        isActive: true
      });

      if (!business) {
        // Create default business from user profile
        business = await Business.create({
          userId: req.user.id,
          ownerId: req.user.id,
          businessName: req.user.businessName,
          businessType: req.user.businessType,
          gstin: req.user.gstin || "",
          address: req.user.address || {},
          contact: {
            phone: req.user.phone,
            email: req.user.email || ""
          },
          isDefault: true
        });
      } else {
        // Set as default
        await Business.findByIdAndUpdate(business._id, { isDefault: true });
        business.isDefault = true;
      }
    }

    res.json({ success: true, business });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch default business: " + err.message });
  }
});

// Create new business/branch
router.post("/businesses", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const { businessName, businessType, gstin, address, contact, currency, branchCode, isBranch, parentBusinessId } = req.body;

    // If setting as default, unset other defaults
    const isDefault = !isBranch; // Branches are not default
    if (isDefault) {
      await Business.updateMany(
        { ownerId: req.user.id },
        { isDefault: false }
      );
    }

    const business = await Business.create({
      userId: req.user.id,
      ownerId: req.user.id,
      businessName,
      businessType: businessType || req.user.businessType,
      gstin: gstin || "",
      address: address || {},
      contact: contact || {
        phone: req.user.phone,
        email: req.user.email || ""
      },
      currency: currency || "INR",
      branchCode: branchCode || "",
      isBranch: isBranch || false,
      parentBusinessId: parentBusinessId || null,
      isDefault
    });

    res.json({ success: true, business });
  } catch (err) {
    res.status(500).json({ message: "Failed to create business: " + err.message });
  }
});

// Update business
router.put("/businesses/:id", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const { isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Business.updateMany(
        { ownerId: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({ success: true, business });
  } catch (err) {
    res.status(500).json({ message: "Failed to update business: " + err.message });
  }
});

// Set as default business
router.post("/businesses/:id/set-default", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    // Unset all defaults
    await Business.updateMany(
      { ownerId: req.user.id },
      { isDefault: false }
    );

    // Set this as default
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Update user's active business
    await User.findByIdAndUpdate(req.user.id, {
      activeBusinessId: business._id
    });

    res.json({ success: true, business, message: "Business set as default" });
  } catch (err) {
    res.status(500).json({ message: "Failed to set default business: " + err.message });
  }
});

// Switch business context
router.post("/businesses/:id/switch", verifyToken, async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Update user's active business
    await User.findByIdAndUpdate(req.user.id, {
      activeBusinessId: business._id
    });

    res.json({ success: true, business, message: "Business context switched" });
  } catch (err) {
    res.status(500).json({ message: "Failed to switch business: " + err.message });
  }
});

// Delete business (soft delete)
router.delete("/businesses/:id", verifyToken, requireRole("owner", "admin"), async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Cannot delete default business
    if (business.isDefault) {
      return res.status(400).json({ message: "Cannot delete default business" });
    }

    await Business.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({ success: true, message: "Business deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete business: " + err.message });
  }
});

module.exports = router;

