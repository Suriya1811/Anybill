const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const InvoiceTemplate = require("../models/InvoiceTemplate");
const Business = require("../models/Business");

// Get all templates
router.get("/templates", verifyToken, async (req, res) => {
  try {
    const templates = await InvoiceTemplate.find({
      userId: req.user.id,
      isActive: true
    }).sort({ isDefault: -1, createdAt: -1 });

    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch templates: " + err.message });
  }
});

// Get single template
router.get("/templates/:id", verifyToken, async (req, res) => {
  try {
    const template = await InvoiceTemplate.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch template: " + err.message });
  }
});

// Get default template
router.get("/templates/default", verifyToken, async (req, res) => {
  try {
    let template = await InvoiceTemplate.findOne({
      userId: req.user.id,
      isDefault: true,
      isActive: true
    });

    // If no default template, create one
    if (!template) {
      const business = await Business.findOne({ userId: req.user.id });
      template = await InvoiceTemplate.create({
        userId: req.user.id,
        name: "Default Template",
        description: "Default invoice template",
        isDefault: true,
        design: {
          footerText: business?.invoiceSettings?.footerText || "Thank you for your business!"
        }
      });
    }

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch default template: " + err.message });
  }
});

// Create template
router.post("/templates", verifyToken, async (req, res) => {
  try {
    const { name, description, design, customFields, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await InvoiceTemplate.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }

    const template = await InvoiceTemplate.create({
      userId: req.user.id,
      name,
      description: description || "",
      design: design || {},
      customFields: customFields || [],
      isDefault: isDefault || false
    });

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ message: "Failed to create template: " + err.message });
  }
});

// Update template
router.put("/templates/:id", verifyToken, async (req, res) => {
  try {
    const { name, description, design, customFields, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await InvoiceTemplate.updateMany(
        { userId: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    const template = await InvoiceTemplate.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description, design, customFields, isDefault },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ message: "Failed to update template: " + err.message });
  }
});

// Duplicate template
router.post("/templates/:id/duplicate", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const originalTemplate = await InvoiceTemplate.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!originalTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    const newTemplate = await InvoiceTemplate.create({
      userId: req.user.id,
      name: name || `${originalTemplate.name} (Copy)`,
      description: originalTemplate.description,
      design: originalTemplate.design,
      customFields: originalTemplate.customFields,
      isDefault: false
    });

    res.json({ success: true, template: newTemplate });
  } catch (err) {
    res.status(500).json({ message: "Failed to duplicate template: " + err.message });
  }
});

// Set as default
router.post("/templates/:id/set-default", verifyToken, async (req, res) => {
  try {
    // Unset all defaults
    await InvoiceTemplate.updateMany(
      { userId: req.user.id },
      { isDefault: false }
    );

    // Set this as default
    const template = await InvoiceTemplate.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json({ success: true, template, message: "Template set as default" });
  } catch (err) {
    res.status(500).json({ message: "Failed to set default template: " + err.message });
  }
});

// Delete template (soft delete)
router.delete("/templates/:id", verifyToken, async (req, res) => {
  try {
    const template = await InvoiceTemplate.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Cannot delete default template
    if (template.isDefault) {
      return res.status(400).json({ message: "Cannot delete default template" });
    }

    await InvoiceTemplate.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({ success: true, message: "Template deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete template: " + err.message });
  }
});

// Preview template (returns template with sample data)
router.get("/templates/:id/preview", verifyToken, async (req, res) => {
  try {
    const template = await InvoiceTemplate.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const business = await Business.findOne({ userId: req.user.id });

    // Sample data for preview
    const previewData = {
      template,
      sample: {
        invoiceNumber: "INV-000001",
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        customer: {
          name: "Sample Customer",
          phone: "+91 9876543210",
          email: "customer@example.com",
          address: {
            street: "123 Main Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            country: "India"
          },
          gstin: "27ABCDE1234F1Z5"
        },
        items: [
          {
            name: "Sample Product 1",
            description: "Product description",
            quantity: 2,
            unit: "Piece",
            price: 1000,
            taxRate: 18,
            taxType: "GST",
            hsn: "12345678",
            subtotal: 2000,
            taxAmount: 360,
            total: 2360
          },
          {
            name: "Sample Product 2",
            description: "Another product",
            quantity: 1,
            unit: "Piece",
            price: 500,
            taxRate: 18,
            taxType: "GST",
            hsn: "87654321",
            subtotal: 500,
            taxAmount: 90,
            total: 590
          }
        ],
        subtotal: 2500,
        discount: 0,
        taxDetails: {
          cgst: 225,
          sgst: 225,
          igst: 0,
          totalTax: 450
        },
        total: 2950,
        business: business || {}
      }
    };

    res.json({ success: true, preview: previewData });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate preview: " + err.message });
  }
});

module.exports = router;

