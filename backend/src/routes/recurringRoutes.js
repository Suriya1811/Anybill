const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const RecurringInvoice = require("../models/RecurringInvoice");
const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const Business = require("../models/Business");

// Helper function to calculate next run date
const calculateNextRunDate = (frequency, interval, lastRunDate) => {
  const date = lastRunDate ? new Date(lastRunDate) : new Date();
  const intervals = {
    daily: interval * 24 * 60 * 60 * 1000,
    weekly: interval * 7 * 24 * 60 * 60 * 1000,
    monthly: interval * 30 * 24 * 60 * 60 * 1000,
    quarterly: interval * 90 * 24 * 60 * 60 * 1000,
    yearly: interval * 365 * 24 * 60 * 60 * 1000
  };
  return new Date(date.getTime() + intervals[frequency]);
};

// Get all recurring invoices
router.get("/recurring", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const recurring = await RecurringInvoice.find(query)
      .populate("customerId", "name phone email")
      .sort({ createdAt: -1 });

    res.json({ success: true, recurring });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recurring invoices: " + err.message });
  }
});

// Get single recurring invoice
router.get("/recurring/:id", verifyToken, async (req, res) => {
  try {
    const recurring = await RecurringInvoice.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate("customerId");

    if (!recurring) {
      return res.status(404).json({ message: "Recurring invoice not found" });
    }
    res.json({ success: true, recurring });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recurring invoice: " + err.message });
  }
});

// Create recurring invoice
router.post("/recurring", verifyToken, async (req, res) => {
  try {
    const { name, customerId, template, frequency, interval, startDate, endDate, autoSend } = req.body;

    // Verify customer
    const customer = await Customer.findOne({ _id: customerId, userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const nextRunDate = startDate ? new Date(startDate) : new Date();

    const recurring = await RecurringInvoice.create({
      userId: req.user.id,
      name,
      customerId,
      template: template || {},
      frequency: frequency || "monthly",
      interval: interval || 1,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      nextRunDate,
      autoSend: autoSend || false,
      status: "active"
    });

    res.json({ success: true, recurring });
  } catch (err) {
    res.status(500).json({ message: "Failed to create recurring invoice: " + err.message });
  }
});

// Update recurring invoice
router.put("/recurring/:id", verifyToken, async (req, res) => {
  try {
    const recurring = await RecurringInvoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    ).populate("customerId");

    if (!recurring) {
      return res.status(404).json({ message: "Recurring invoice not found" });
    }

    res.json({ success: true, recurring });
  } catch (err) {
    res.status(500).json({ message: "Failed to update recurring invoice: " + err.message });
  }
});

// Pause recurring invoice
router.post("/recurring/:id/pause", verifyToken, async (req, res) => {
  try {
    const recurring = await RecurringInvoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "paused" },
      { new: true }
    );

    if (!recurring) {
      return res.status(404).json({ message: "Recurring invoice not found" });
    }

    res.json({ success: true, recurring, message: "Recurring invoice paused" });
  } catch (err) {
    res.status(500).json({ message: "Failed to pause recurring invoice: " + err.message });
  }
});

// Resume recurring invoice
router.post("/recurring/:id/resume", verifyToken, async (req, res) => {
  try {
    const recurring = await RecurringInvoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "active" },
      { new: true }
    );

    if (!recurring) {
      return res.status(404).json({ message: "Recurring invoice not found" });
    }

    res.json({ success: true, recurring, message: "Recurring invoice resumed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to resume recurring invoice: " + err.message });
  }
});

// Cancel recurring invoice
router.post("/recurring/:id/cancel", verifyToken, async (req, res) => {
  try {
    const recurring = await RecurringInvoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "cancelled" },
      { new: true }
    );

    if (!recurring) {
      return res.status(404).json({ message: "Recurring invoice not found" });
    }

    res.json({ success: true, recurring, message: "Recurring invoice cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel recurring invoice: " + err.message });
  }
});

// Generate invoice from recurring template
router.post("/recurring/:id/generate", verifyToken, async (req, res) => {
  try {
    const recurring = await RecurringInvoice.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: "active"
    }).populate("customerId");

    if (!recurring) {
      return res.status(404).json({ message: "Recurring invoice not found or inactive" });
    }

    // Check if it's time to generate
    if (new Date() < recurring.nextRunDate) {
      return res.status(400).json({ 
        message: `Next invoice will be generated on ${recurring.nextRunDate.toISOString()}` 
      });
    }

    // Check end date
    if (recurring.endDate && new Date() > recurring.endDate) {
      await RecurringInvoice.findByIdAndUpdate(req.params.id, { status: "completed" });
      return res.status(400).json({ message: "Recurring invoice has ended" });
    }

    const business = await Business.findOne({ userId: req.user.id });
    const prefix = business.invoiceSettings.prefix || "INV";
    const invoiceNumber = `${prefix}-${String(business.invoiceSettings.nextNumber).padStart(6, "0")}`;

    // Calculate totals from template
    let subtotal = 0;
    let totalTax = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const invoiceItems = recurring.template.items.map(item => {
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
    if (recurring.template.discount > 0) {
      if (recurring.template.discountType === "percentage") {
        discountAmount = (subtotal * recurring.template.discount) / 100;
      } else {
        discountAmount = recurring.template.discount;
      }
    }

    const finalSubtotal = subtotal - discountAmount;
    const total = finalSubtotal + totalTax;

    // Create invoice
    const invoice = await Invoice.create({
      userId: req.user.id,
      documentType: "invoice",
      invoiceNumber,
      customerId: recurring.customerId._id,
      customerDetails: {
        name: recurring.customerId.name,
        phone: recurring.customerId.phone,
        email: recurring.customerId.email,
        address: recurring.customerId.address,
        gstin: recurring.customerId.gstin,
      },
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      items: invoiceItems,
      subtotal: finalSubtotal,
      discount: discountAmount,
      discountType: recurring.template.discountType || "fixed",
      taxDetails: { cgst, sgst, igst, totalTax },
      total,
      balance: total,
      status: recurring.autoSend ? "sent" : "draft",
      notes: recurring.template.notes || "",
      terms: recurring.template.terms || "",
      isRecurring: true,
      recurringSettings: {
        frequency: recurring.frequency,
        interval: recurring.interval,
        nextRunDate: calculateNextRunDate(recurring.frequency, recurring.interval, recurring.nextRunDate),
        endDate: recurring.endDate,
        autoSend: recurring.autoSend
      }
    });

    // Update recurring invoice
    const nextRunDate = calculateNextRunDate(recurring.frequency, recurring.interval, recurring.nextRunDate);
    await RecurringInvoice.findByIdAndUpdate(req.params.id, {
      lastRunDate: new Date(),
      nextRunDate,
      $push: { generatedInvoices: invoice._id },
      $inc: { totalGenerated: 1 }
    });

    // Update invoice number
    await Business.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { "invoiceSettings.nextNumber": 1 } }
    );

    // Update customer balance
    await Customer.findByIdAndUpdate(recurring.customerId._id, {
      $inc: { balance: total }
    });

    res.json({ success: true, invoice, message: "Invoice generated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate invoice: " + err.message });
  }
});

// Delete recurring invoice
router.delete("/recurring/:id", verifyToken, async (req, res) => {
  try {
    const recurring = await RecurringInvoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!recurring) {
      return res.status(404).json({ message: "Recurring invoice not found" });
    }

    res.json({ success: true, message: "Recurring invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recurring invoice: " + err.message });
  }
});

module.exports = router;

