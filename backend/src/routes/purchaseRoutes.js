const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Purchase = require("../models/Purchase");
const Supplier = require("../models/Supplier");
const Business = require("../models/Business");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

// ========== SUPPLIER ROUTES ==========

// Get all suppliers
router.get("/suppliers", verifyToken, async (req, res) => {
  try {
    const suppliers = await Supplier.find({ 
      userId: req.user.id, 
      isActive: true 
    }).sort({ createdAt: -1 });
    res.json({ success: true, suppliers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch suppliers: " + err.message });
  }
});

// Get single supplier
router.get("/suppliers/:id", verifyToken, async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ success: true, supplier });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch supplier: " + err.message });
  }
});

// Create supplier
router.post("/suppliers", verifyToken, async (req, res) => {
  try {
    const supplierData = {
      ...req.body,
      userId: req.user.id
    };
    const supplier = await Supplier.create(supplierData);
    res.json({ success: true, supplier });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Supplier with this phone already exists" });
    }
    res.status(500).json({ message: "Failed to create supplier: " + err.message });
  }
});

// Update supplier
router.put("/suppliers/:id", verifyToken, async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ success: true, supplier });
  } catch (err) {
    res.status(500).json({ message: "Failed to update supplier: " + err.message });
  }
});

// Delete supplier
router.delete("/suppliers/:id", verifyToken, async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ success: true, message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete supplier: " + err.message });
  }
});

// ========== PURCHASE ROUTES ==========

// Get all purchases
router.get("/purchases", verifyToken, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = { userId: req.user.id, isDeleted: false };
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.purchaseDate = {};
      if (startDate) query.purchaseDate.$gte = new Date(startDate);
      if (endDate) query.purchaseDate.$lte = new Date(endDate);
    }

    const purchases = await Purchase.find(query)
      .populate("supplierId", "name phone email")
      .sort({ purchaseDate: -1 });
    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchases: " + err.message });
  }
});

// Get single purchase
router.get("/purchases/:id", verifyToken, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate("supplierId");
    
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.json({ success: true, purchase });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchase: " + err.message });
  }
});

// Create purchase
router.post("/purchases", verifyToken, async (req, res) => {
  try {
    const { supplierId, purchaseDate, dueDate, items, discount, discountType, notes, terms, warehouseId } = req.body;

    // Get supplier details
    const supplier = await Supplier.findOne({ _id: supplierId, userId: req.user.id });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Get business settings for purchase number
    const business = await Business.findOne({ userId: req.user.id });
    if (!business) {
      return res.status(404).json({ message: "Business profile not found" });
    }

    // Generate purchase number
    const purchaseNumber = `PUR-${String(business.invoiceSettings.nextNumber).padStart(6, "0")}`;

    // Calculate totals
    let subtotal = 0;
    let totalTax = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const purchaseItems = items.map(item => {
      const itemSubtotal = item.quantity * item.price;
      let itemTax = 0;
      let itemCgst = 0;
      let itemSgst = 0;
      let itemIgst = 0;

      if (item.taxRate > 0) {
        if (item.taxType === "GST") {
          itemCgst = (itemSubtotal * item.taxRate) / (2 * 100);
          itemSgst = (itemSubtotal * item.taxRate) / (2 * 100);
          itemTax = itemCgst + itemSgst;
        } else if (item.taxType === "IGST") {
          itemIgst = (itemSubtotal * item.taxRate) / 100;
          itemTax = itemIgst;
        }
      }

      subtotal += itemSubtotal;
      totalTax += itemTax;
      cgst += itemCgst;
      sgst += itemSgst;
      igst += itemIgst;

      return {
        ...item,
        subtotal: itemSubtotal,
        taxAmount: itemTax,
        total: itemSubtotal + itemTax,
      };
    });

    // Apply discount
    let discountAmount = 0;
    if (discount > 0) {
      if (discountType === "percentage") {
        discountAmount = (subtotal * discount) / 100;
      } else {
        discountAmount = discount;
      }
    }

    const finalSubtotal = subtotal - discountAmount;
    const total = finalSubtotal + totalTax;

    // Create purchase
    const purchase = await Purchase.create({
      userId: req.user.id,
      purchaseNumber,
      supplierId,
      supplierDetails: {
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        gstin: supplier.gstin,
      },
      purchaseDate: purchaseDate || new Date(),
      dueDate: dueDate || new Date(),
      items: purchaseItems,
      subtotal: finalSubtotal,
      discount: discountAmount,
      discountType: discountType || "fixed",
      taxDetails: {
        cgst,
        sgst,
        igst,
        totalTax,
      },
      total,
      balance: total,
      status: "draft",
      notes: notes || "",
      terms: terms || "",
    });

    // Update purchase number in business settings
    await Business.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { "invoiceSettings.nextNumber": 1 } }
    );

    // Update supplier balance
    await Supplier.findByIdAndUpdate(supplierId, {
      $inc: { balance: total }
    });

    // Update inventory if warehouse is provided
    if (warehouseId) {
      for (const item of purchaseItems) {
        if (item.productId) {
          let inventory = await Inventory.findOne({
            userId: req.user.id,
            productId: item.productId,
            warehouseId
          });

          if (!inventory) {
            inventory = await Inventory.create({
              userId: req.user.id,
              productId: item.productId,
              warehouseId,
              quantity: 0
            });
          }

          inventory.quantity += item.quantity;
          await inventory.save();
        }
      }
    }

    res.json({ success: true, purchase });
  } catch (err) {
    console.error("Purchase Creation Error:", err);
    res.status(500).json({ message: "Failed to create purchase: " + err.message });
  }
});

// Update purchase payment
router.post("/purchases/:id/payment", verifyToken, async (req, res) => {
  try {
    const { paidAmount } = req.body;
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const newPaidAmount = (purchase.paidAmount || 0) + paidAmount;
    const balance = purchase.total - newPaidAmount;
    let status = purchase.status;

    if (balance <= 0) {
      status = "paid";
    } else if (newPaidAmount > 0) {
      status = "partial";
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        paidAmount: newPaidAmount,
        balance,
        status,
      },
      { new: true }
    );

    // Update supplier balance
    await Supplier.findByIdAndUpdate(purchase.supplierId, {
      $inc: { balance: -paidAmount }
    });

    res.json({ success: true, purchase: updatedPurchase });
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment: " + err.message });
  }
});

// Delete purchase (soft delete)
router.delete("/purchases/:id", verifyToken, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Update supplier balance
    await Supplier.findByIdAndUpdate(purchase.supplierId, {
      $inc: { balance: -purchase.total }
    });

    // Soft delete
    await Purchase.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });
    
    res.json({ success: true, message: "Purchase deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete purchase: " + err.message });
  }
});

module.exports = router;

