const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");

// ========== BULK PRODUCT UPLOAD ==========

router.post("/bulk/products/upload", verifyToken, async (req, res) => {
  try {
    const { products } = req.body; // Array of product objects

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }

    const results = {
      success: [],
      failed: [],
      total: products.length,
      successCount: 0,
      failedCount: 0
    };

    for (const productData of products) {
      try {
        // Validate required fields
        if (!productData.name || !productData.price) {
          results.failed.push({
            data: productData,
            error: "Name and price are required"
          });
          results.failedCount++;
          continue;
        }

        // Check if product already exists (by SKU or name)
        let existingProduct = null;
        if (productData.sku) {
          existingProduct = await Product.findOne({
            userId: req.user.id,
            sku: productData.sku,
            isActive: true
          });
        }

        if (!existingProduct) {
          existingProduct = await Product.findOne({
            userId: req.user.id,
            name: productData.name,
            isActive: true
          });
        }

        const productPayload = {
          userId: req.user.id,
          name: productData.name,
          sku: productData.sku || "",
          description: productData.description || "",
          category: productData.category || "Uncategorized",
          hsn: productData.hsn || "",
          sac: productData.sac || "",
          price: parseFloat(productData.price) || 0,
          cost: parseFloat(productData.cost) || 0,
          taxRate: parseFloat(productData.taxRate) || 0,
          taxType: productData.taxType || "GST",
          unit: productData.unit || "Piece",
          barcode: productData.barcode || "",
          barcodeType: productData.barcodeType || "EAN13",
          stock: {
            quantity: parseFloat(productData.stock?.quantity || productData.quantity || 0) || 0,
            lowStockAlert: parseFloat(productData.stock?.lowStockAlert || productData.lowStockAlert || 10) || 10,
            trackInventory: productData.stock?.trackInventory || productData.trackInventory || false
          },
          isActive: true
        };

        if (existingProduct) {
          // Update existing product
          const updated = await Product.findByIdAndUpdate(
            existingProduct._id,
            productPayload,
            { new: true }
          );
          results.success.push({
            action: "updated",
            product: updated,
            id: updated._id
          });
        } else {
          // Create new product
          const created = await Product.create(productPayload);
          results.success.push({
            action: "created",
            product: created,
            id: created._id
          });
        }
        results.successCount++;
      } catch (err) {
        results.failed.push({
          data: productData,
          error: err.message
        });
        results.failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Bulk upload completed: ${results.successCount} succeeded, ${results.failedCount} failed`,
      results
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload products: " + err.message });
  }
});

// ========== BULK CUSTOMER UPLOAD ==========

router.post("/bulk/customers/upload", verifyToken, async (req, res) => {
  try {
    const { customers } = req.body; // Array of customer objects

    if (!Array.isArray(customers) || customers.length === 0) {
      return res.status(400).json({ message: "Customers array is required" });
    }

    const results = {
      success: [],
      failed: [],
      total: customers.length,
      successCount: 0,
      failedCount: 0
    };

    for (const customerData of customers) {
      try {
        // Validate required fields
        if (!customerData.name || !customerData.phone) {
          results.failed.push({
            data: customerData,
            error: "Name and phone are required"
          });
          results.failedCount++;
          continue;
        }

        // Check if customer already exists (by phone)
        const existingCustomer = await Customer.findOne({
          userId: req.user.id,
          phone: customerData.phone,
          isActive: true
        });

        const customerPayload = {
          userId: req.user.id,
          name: customerData.name,
          email: customerData.email || "",
          phone: customerData.phone,
          gstin: customerData.gstin || "",
          address: {
            street: customerData.address?.street || customerData.street || "",
            city: customerData.address?.city || customerData.city || "",
            state: customerData.address?.state || customerData.state || "",
            pincode: customerData.address?.pincode || customerData.pincode || "",
            country: customerData.address?.country || customerData.country || "India"
          },
          billingAddress: customerData.billingAddress || {},
          creditLimit: parseFloat(customerData.creditLimit) || 0,
          balance: parseFloat(customerData.balance) || 0,
          notes: customerData.notes || "",
          isActive: true
        };

        if (existingCustomer) {
          // Update existing customer
          const updated = await Customer.findByIdAndUpdate(
            existingCustomer._id,
            customerPayload,
            { new: true }
          );
          results.success.push({
            action: "updated",
            customer: updated,
            id: updated._id
          });
        } else {
          // Create new customer
          const created = await Customer.create(customerPayload);
          results.success.push({
            action: "created",
            customer: created,
            id: created._id
          });
        }
        results.successCount++;
      } catch (err) {
        results.failed.push({
          data: customerData,
          error: err.message
        });
        results.failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Bulk upload completed: ${results.successCount} succeeded, ${results.failedCount} failed`,
      results
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload customers: " + err.message });
  }
});

// ========== BULK PRODUCT UPDATE ==========

router.put("/bulk/products/update", verifyToken, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, updates } objects

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Updates array is required" });
    }

    const results = {
      success: [],
      failed: [],
      total: updates.length,
      successCount: 0,
      failedCount: 0
    };

    for (const updateData of updates) {
      try {
        if (!updateData.id) {
          results.failed.push({
            data: updateData,
            error: "Product ID is required"
          });
          results.failedCount++;
          continue;
        }

        const product = await Product.findOne({
          _id: updateData.id,
          userId: req.user.id
        });

        if (!product) {
          results.failed.push({
            data: updateData,
            error: "Product not found"
          });
          results.failedCount++;
          continue;
        }

        // Remove id from updates
        const { id, ...updateFields } = updateData;
        const updated = await Product.findByIdAndUpdate(
          updateData.id,
          updateFields,
          { new: true }
        );

        results.success.push({
          id: updated._id,
          product: updated
        });
        results.successCount++;
      } catch (err) {
        results.failed.push({
          data: updateData,
          error: err.message
        });
        results.failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Bulk update completed: ${results.successCount} succeeded, ${results.failedCount} failed`,
      results
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update products: " + err.message });
  }
});

// ========== BULK CUSTOMER UPDATE ==========

router.put("/bulk/customers/update", verifyToken, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, updates } objects

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Updates array is required" });
    }

    const results = {
      success: [],
      failed: [],
      total: updates.length,
      successCount: 0,
      failedCount: 0
    };

    for (const updateData of updates) {
      try {
        if (!updateData.id) {
          results.failed.push({
            data: updateData,
            error: "Customer ID is required"
          });
          results.failedCount++;
          continue;
        }

        const customer = await Customer.findOne({
          _id: updateData.id,
          userId: req.user.id
        });

        if (!customer) {
          results.failed.push({
            data: updateData,
            error: "Customer not found"
          });
          results.failedCount++;
          continue;
        }

        // Remove id from updates
        const { id, ...updateFields } = updateData;
        const updated = await Customer.findByIdAndUpdate(
          updateData.id,
          updateFields,
          { new: true }
        );

        results.success.push({
          id: updated._id,
          customer: updated
        });
        results.successCount++;
      } catch (err) {
        results.failed.push({
          data: updateData,
          error: err.message
        });
        results.failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Bulk update completed: ${results.successCount} succeeded, ${results.failedCount} failed`,
      results
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update customers: " + err.message });
  }
});

// ========== BULK DELETE ==========

router.post("/bulk/products/delete", verifyToken, async (req, res) => {
  try {
    const { ids } = req.body; // Array of product IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Product IDs array is required" });
    }

    const result = await Product.updateMany(
      { _id: { $in: ids }, userId: req.user.id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} products deleted successfully`,
      deletedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete products: " + err.message });
  }
});

router.post("/bulk/customers/delete", verifyToken, async (req, res) => {
  try {
    const { ids } = req.body; // Array of customer IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Customer IDs array is required" });
    }

    const result = await Customer.updateMany(
      { _id: { $in: ids }, userId: req.user.id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} customers deleted successfully`,
      deletedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete customers: " + err.message });
  }
});

// ========== EXPORT TO CSV/JSON ==========

router.get("/bulk/products/export", verifyToken, async (req, res) => {
  try {
    const { format = "json" } = req.query;

    const products = await Product.find({
      userId: req.user.id,
      isActive: true
    }).sort({ createdAt: -1 });

    if (format === "csv") {
      // Convert to CSV
      const headers = ["Name", "SKU", "Description", "Category", "HSN", "SAC", "Price", "Cost", "Tax Rate", "Tax Type", "Unit", "Barcode", "Stock Quantity", "Low Stock Alert"];
      const rows = products.map(p => [
        p.name,
        p.sku || "",
        p.description || "",
        p.category || "",
        p.hsn || "",
        p.sac || "",
        p.price || 0,
        p.cost || 0,
        p.taxRate || 0,
        p.taxType || "GST",
        p.unit || "Piece",
        p.barcode || "",
        p.stock?.quantity || 0,
        p.stock?.lowStockAlert || 10
      ]);

      const csv = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=products-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=products-${Date.now()}.json`);
      res.json({ success: true, products });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to export products: " + err.message });
  }
});

router.get("/bulk/customers/export", verifyToken, async (req, res) => {
  try {
    const { format = "json" } = req.query;

    const customers = await Customer.find({
      userId: req.user.id,
      isActive: true
    }).sort({ createdAt: -1 });

    if (format === "csv") {
      // Convert to CSV
      const headers = ["Name", "Phone", "Email", "GSTIN", "Street", "City", "State", "Pincode", "Country", "Credit Limit", "Balance"];
      const rows = customers.map(c => [
        c.name,
        c.phone,
        c.email || "",
        c.gstin || "",
        c.address?.street || "",
        c.address?.city || "",
        c.address?.state || "",
        c.address?.pincode || "",
        c.address?.country || "India",
        c.creditLimit || 0,
        c.balance || 0
      ]);

      const csv = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=customers-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=customers-${Date.now()}.json`);
      res.json({ success: true, customers });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to export customers: " + err.message });
  }
});

// ========== BULK INVENTORY UPDATE ==========

router.post("/bulk/inventory/update", verifyToken, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, warehouseId, quantity } objects

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Updates array is required" });
    }

    const results = {
      success: [],
      failed: [],
      total: updates.length,
      successCount: 0,
      failedCount: 0
    };

    for (const updateData of updates) {
      try {
        const { productId, warehouseId, quantity, type = "set" } = updateData;

        if (!productId || !warehouseId || quantity === undefined) {
          results.failed.push({
            data: updateData,
            error: "Product ID, Warehouse ID, and quantity are required"
          });
          results.failedCount++;
          continue;
        }

        // Verify product and warehouse belong to user
        const [product, warehouse] = await Promise.all([
          Product.findOne({ _id: productId, userId: req.user.id }),
          Warehouse.findOne({ _id: warehouseId, userId: req.user.id })
        ]);

        if (!product) {
          results.failed.push({
            data: updateData,
            error: "Product not found"
          });
          results.failedCount++;
          continue;
        }

        if (!warehouse) {
          results.failed.push({
            data: updateData,
            error: "Warehouse not found"
          });
          results.failedCount++;
          continue;
        }

        // Get or create inventory
        let inventory = await Inventory.findOne({
          userId: req.user.id,
          productId,
          warehouseId
        });

        if (!inventory) {
          inventory = await Inventory.create({
            userId: req.user.id,
            productId,
            warehouseId,
            quantity: 0
          });
        }

        // Update quantity based on type
        if (type === "set") {
          inventory.quantity = parseFloat(quantity);
        } else if (type === "add") {
          inventory.quantity += parseFloat(quantity);
        } else if (type === "remove") {
          inventory.quantity = Math.max(0, inventory.quantity - parseFloat(quantity));
        }

        await inventory.save();

        results.success.push({
          productId,
          warehouseId,
          quantity: inventory.quantity,
          inventory: inventory
        });
        results.successCount++;
      } catch (err) {
        results.failed.push({
          data: updateData,
          error: err.message
        });
        results.failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Bulk inventory update completed: ${results.successCount} succeeded, ${results.failedCount} failed`,
      results
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update inventory: " + err.message });
  }
});

module.exports = router;

