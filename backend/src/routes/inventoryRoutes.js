const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");

// Get all inventory items
router.get("/inventory", verifyToken, async (req, res) => {
  try {
    const { warehouseId, productId, lowStock } = req.query;
    const query = { userId: req.user.id };

    if (warehouseId) query.warehouseId = warehouseId;
    if (productId) query.productId = productId;
    if (lowStock === "true") query.isLowStock = true;

    const inventory = await Inventory.find(query)
      .populate("productId", "name sku barcode price")
      .populate("warehouseId", "name code")
      .sort({ isLowStock: -1, updatedAt: -1 });

    res.json({ success: true, inventory });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory: " + err.message });
  }
});

// Get single inventory item
router.get("/inventory/:id", verifyToken, async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
      .populate("productId")
      .populate("warehouseId");

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json({ success: true, inventory });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory: " + err.message });
  }
});

// Get inventory by product and warehouse
router.get("/inventory/product/:productId/warehouse/:warehouseId", verifyToken, async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      userId: req.user.id,
      productId: req.params.productId,
      warehouseId: req.params.warehouseId
    })
      .populate("productId")
      .populate("warehouseId");

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json({ success: true, inventory });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory: " + err.message });
  }
});

// Create or update inventory
router.post("/inventory", verifyToken, async (req, res) => {
  try {
    const { productId, warehouseId, quantity, reservedQuantity, lowStockThreshold, batches, serialNumbers } = req.body;

    // Verify product and warehouse belong to user
    const [product, warehouse] = await Promise.all([
      Product.findOne({ _id: productId, userId: req.user.id }),
      Warehouse.findOne({ _id: warehouseId, userId: req.user.id })
    ]);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    const inventory = await Inventory.findOneAndUpdate(
      { userId: req.user.id, productId, warehouseId },
      {
        userId: req.user.id,
        productId,
        warehouseId,
        quantity: quantity || 0,
        reservedQuantity: reservedQuantity || 0,
        lowStockThreshold: lowStockThreshold || 10,
        batches: batches || [],
        serialNumbers: serialNumbers || []
      },
      { upsert: true, new: true }
    )
      .populate("productId")
      .populate("warehouseId");

    res.json({ success: true, inventory });
  } catch (err) {
    res.status(500).json({ message: "Failed to update inventory: " + err.message });
  }
});

// Adjust inventory (add/remove stock)
router.post("/inventory/:id/adjust", verifyToken, async (req, res) => {
  try {
    const { quantity, type, reason, notes } = req.body; // type: 'add', 'remove', 'set'
    const inventory = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    let newQuantity = inventory.quantity;
    if (type === "add") {
      newQuantity = inventory.quantity + quantity;
    } else if (type === "remove") {
      newQuantity = Math.max(0, inventory.quantity - quantity);
    } else if (type === "set") {
      newQuantity = Math.max(0, quantity);
    } else {
      return res.status(400).json({ message: "Invalid adjustment type" });
    }

    inventory.quantity = newQuantity;
    await inventory.save();

    res.json({ 
      success: true, 
      inventory,
      adjustment: {
        type,
        quantity,
        reason,
        notes,
        previousQuantity: inventory.quantity - (type === "add" ? quantity : type === "remove" ? -quantity : 0)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to adjust inventory: " + err.message });
  }
});

// Get low stock alerts
router.get("/inventory/alerts/low-stock", verifyToken, async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      userId: req.user.id,
      isLowStock: true
    })
      .populate("productId", "name sku barcode")
      .populate("warehouseId", "name code")
      .sort({ availableQuantity: 1 });

    res.json({ success: true, alerts: lowStockItems, count: lowStockItems.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch low stock alerts: " + err.message });
  }
});

// Search inventory by barcode
router.get("/inventory/search/barcode/:barcode", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({
      userId: req.user.id,
      barcode: req.params.barcode,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const inventory = await Inventory.find({
      userId: req.user.id,
      productId: product._id
    })
      .populate("warehouseId", "name code");

    res.json({ success: true, product, inventory });
  } catch (err) {
    res.status(500).json({ message: "Failed to search inventory: " + err.message });
  }
});

module.exports = router;

