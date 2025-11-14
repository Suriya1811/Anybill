const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Warehouse = require("../models/Warehouse");

// Get all warehouses
router.get("/warehouses", verifyToken, async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ 
      userId: req.user.id, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, warehouses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch warehouses: " + err.message });
  }
});

// Get single warehouse
router.get("/warehouses/:id", verifyToken, async (req, res) => {
  try {
    const warehouse = await Warehouse.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch warehouse: " + err.message });
  }
});

// Create warehouse
router.post("/warehouses", verifyToken, async (req, res) => {
  try {
    const { name, code, address, contact, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Warehouse.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }

    const warehouse = await Warehouse.create({
      userId: req.user.id,
      name,
      code: code || "",
      address: address || {},
      contact: contact || {},
      isDefault: isDefault || false
    });

    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ message: "Failed to create warehouse: " + err.message });
  }
});

// Update warehouse
router.put("/warehouses/:id", verifyToken, async (req, res) => {
  try {
    const { isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Warehouse.updateMany(
        { userId: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    const warehouse = await Warehouse.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ message: "Failed to update warehouse: " + err.message });
  }
});

// Delete warehouse (soft delete)
router.delete("/warehouses/:id", verifyToken, async (req, res) => {
  try {
    const warehouse = await Warehouse.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.json({ success: true, message: "Warehouse deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete warehouse: " + err.message });
  }
});

module.exports = router;

