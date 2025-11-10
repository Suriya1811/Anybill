const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Invoice = require("../models/Invoice");
const Business = require("../models/Business");
const axios = require("axios");
const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY || "747ae4d3-bdff-11f0-bdde-0200cd936042";

// Initialize Twilio client if available
let twilioClient = null;

// ========== CUSTOMER ROUTES ==========

// Get all customers
router.get("/customers", verifyToken, async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customers: " + err.message });
  }
});

// Get single customer
router.get("/customers/:id", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer: " + err.message });
  }
});

// Create customer
router.post("/customers", verifyToken, async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      userId: req.user.id
    };
    const customer = await Customer.create(customerData);
    res.json({ success: true, customer });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Customer with this phone already exists" });
    }
    res.status(500).json({ message: "Failed to create customer: " + err.message });
  }
});

// Update customer
router.put("/customers/:id", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ message: "Failed to update customer: " + err.message });
  }
});

// Delete customer
router.delete("/customers/:id", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete customer: " + err.message });
  }
});

// ========== PRODUCT ROUTES ==========

// Get all products
router.get("/products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products: " + err.message });
  }
});

// Get single product
router.get("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product: " + err.message });
  }
});

// Create product
router.post("/products", verifyToken, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      userId: req.user.id
    };
    const product = await Product.create(productData);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Failed to create product: " + err.message });
  }
});

// Update product
router.put("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product: " + err.message });
  }
});

// Delete product
router.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product: " + err.message });
  }
});

// ========== INVOICE ROUTES ==========

// Get all invoices/documents
router.get("/invoices", verifyToken, async (req, res) => {
  try {
    const { status, startDate, endDate, documentType } = req.query;
    const query = { userId: req.user.id, isDeleted: false };
    
    if (status) query.status = status;
    if (documentType) query.documentType = documentType;
    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query)
      .populate("customerId", "name phone email")
      .sort({ invoiceDate: -1 });
    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices: " + err.message });
  }
});

// Get single invoice
router.get("/invoices/:id", verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate("customerId");
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoice: " + err.message });
  }
});

// Create invoice/document
router.post("/invoices", verifyToken, async (req, res) => {
  try {
    const { 
      customerId, 
      invoiceDate, 
      dueDate, 
      items, 
      discount, 
      discountType, 
      notes, 
      terms,
      documentType = "invoice",
      validUntil,
      challanNumber,
      vehicleNumber,
      transporterName,
      templateId = "default"
    } = req.body;

    // Get customer details
    const customer = await Customer.findOne({ _id: customerId, userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get business settings for document number
    const business = await Business.findOne({ userId: req.user.id });
    if (!business) {
      return res.status(404).json({ message: "Business profile not found" });
    }

    // Generate document number based on type
    const prefixes = {
      invoice: business.invoiceSettings.prefix || "INV",
      delivery_challan: "DC",
      proforma_invoice: "PI",
      quotation: "QT",
      estimate: "EST"
    };
    
    const prefix = prefixes[documentType] || "INV";
    const invoiceNumber = `${prefix}-${String(business.invoiceSettings.nextNumber).padStart(6, "0")}`;

    // Calculate totals
    let subtotal = 0;
    let totalTax = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const invoiceItems = items.map(item => {
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

    // Get currency from business or request
    const invoiceCurrency = req.body.currency || business?.currency || "INR";
    const exchangeRate = req.body.exchangeRate || 1;

    // Create invoice/document
    const invoiceData = {
      userId: req.user.id,
      documentType,
      invoiceNumber,
      customerId,
      customerDetails: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        gstin: customer.gstin,
      },
      invoiceDate: invoiceDate || new Date(),
      dueDate: dueDate || new Date(),
      items: invoiceItems,
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
      templateId,
      currency: invoiceCurrency,
      exchangeRate,
      baseCurrency: "INR"
    };

    // Add document type specific fields
    if (documentType === "quotation" || documentType === "estimate") {
      invoiceData.validUntil = validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default
    }

    if (documentType === "delivery_challan") {
      invoiceData.challanNumber = challanNumber || invoiceNumber;
      invoiceData.vehicleNumber = vehicleNumber || "";
      invoiceData.transporterName = transporterName || "";
    }

    // For quotations/estimates, don't update customer balance
    const shouldUpdateBalance = documentType === "invoice" || documentType === "proforma_invoice";
    
    const invoice = await Invoice.create(invoiceData);

    // Update document number in business settings
    await Business.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { "invoiceSettings.nextNumber": 1 } }
    );

    // Update customer balance only for invoices/proforma invoices
    if (shouldUpdateBalance) {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { balance: total }
      });
    }

    res.json({ success: true, invoice });
  } catch (err) {
    console.error("Invoice Creation Error:", err);
    res.status(500).json({ message: "Failed to create invoice: " + err.message });
  }
});

// Update invoice
router.put("/invoices/:id", verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Update invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, invoice: updatedInvoice });
  } catch (err) {
    res.status(500).json({ message: "Failed to update invoice: " + err.message });
  }
});

// Update invoice payment
router.post("/invoices/:id/payment", verifyToken, async (req, res) => {
  try {
    const { paidAmount } = req.body;
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const newPaidAmount = (invoice.paidAmount || 0) + paidAmount;
    const balance = invoice.total - newPaidAmount;
    let status = invoice.status;

    if (balance <= 0) {
      status = "paid";
    } else if (newPaidAmount > 0) {
      status = "partial";
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        paidAmount: newPaidAmount,
        balance,
        status,
      },
      { new: true }
    );

    // Update customer balance
    await Customer.findByIdAndUpdate(invoice.customerId, {
      $inc: { balance: -paidAmount }
    });

    res.json({ success: true, invoice: updatedInvoice });
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment: " + err.message });
  }
});

// Delete invoice (soft delete for recovery)
router.delete("/invoices/:id", verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Update customer balance only for invoices/proforma invoices
    if (invoice.documentType === "invoice" || invoice.documentType === "proforma_invoice") {
      await Customer.findByIdAndUpdate(invoice.customerId, {
        $inc: { balance: -invoice.total }
      });
    }

    // Soft delete
    await Invoice.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });
    
    res.json({ success: true, message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete invoice: " + err.message });
  }
});

// Recover deleted invoice
router.post("/invoices/:id/recover", verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: true
    });

    if (!invoice) {
      return res.status(404).json({ message: "Deleted invoice not found" });
    }

    // Restore customer balance
    if (invoice.documentType === "invoice" || invoice.documentType === "proforma_invoice") {
      await Customer.findByIdAndUpdate(invoice.customerId, {
        $inc: { balance: invoice.total }
      });
    }

    await Invoice.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
      deletedAt: null
    });
    
    res.json({ success: true, message: "Invoice recovered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to recover invoice: " + err.message });
  }
});

// Share invoice via WhatsApp/SMS/Email
router.post("/invoices/:id/share", verifyToken, async (req, res) => {
  try {
    const { method, phone, email } = req.body; // method: 'whatsapp', 'sms', 'email'
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false
    }).populate("customerId");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const business = await Business.findOne({ userId: req.user.id });
    const sharePhone = phone || invoice.customerDetails.phone;
    const shareEmail = email || invoice.customerDetails.email;

    // Generate share message
    const invoiceUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/invoice/${invoice._id}`;
    const message = `Your ${business?.businessName || "Invoice"} - ${invoice.invoiceNumber}\nAmount: ₹${invoice.total}\nView: ${invoiceUrl}`;

    if (method === "sms") {
      if (!TWO_FACTOR_API_KEY) {
        return res.status(400).json({ message: "SMS not configured" });
      }

      try {
        const twoFactorPhone = String(sharePhone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
        if (!twoFactorPhone || twoFactorPhone.length < 10) {
          return res.status(400).json({ message: "Invalid phone number format" });
        }
        const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${encodeURIComponent(twoFactorPhone)}/${encodeURIComponent(message)}`;
        const { data } = await axios.get(url, { timeout: 10000 });
        if (data && (data.Status === 'Success' || data.status === 'success')) {
          return res.json({ success: true, message: `Invoice shared via SMS` });
        } else {
          return res.status(500).json({ message: `Failed to send SMS` });
        }
      } catch (err) {
        return res.status(500).json({ message: `Failed to send SMS: ${err.message}` });
      }
    } else if (method === "whatsapp") {
      return res.status(400).json({ message: "WhatsApp sharing not configured" });
    } else if (method === "email") {
      // Email sharing - you can integrate with nodemailer or similar
      // For now, return success with email details
      res.json({ 
        success: true, 
        message: "Email sharing configured",
        email: shareEmail,
        subject: `Invoice ${invoice.invoiceNumber}`,
        body: message
      });
    } else {
      res.status(400).json({ message: "Invalid sharing method" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to share invoice: " + err.message });
  }
});

// Convert quotation/estimate to invoice
router.post("/invoices/:id/convert", verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id,
      documentType: { $in: ["quotation", "estimate", "proforma_invoice"] }
    });

    if (!invoice) {
      return res.status(404).json({ message: "Document not found or cannot be converted" });
    }

    // Get business settings for new invoice number
    const business = await Business.findOne({ userId: req.user.id });
    const prefix = business.invoiceSettings.prefix || "INV";
    const newInvoiceNumber = `${prefix}-${String(business.invoiceSettings.nextNumber).padStart(6, "0")}`;

    // Create new invoice from quotation
    const newInvoice = await Invoice.create({
      ...invoice.toObject(),
      _id: undefined,
      documentType: "invoice",
      invoiceNumber: newInvoiceNumber,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update quotation status
    await Invoice.findByIdAndUpdate(req.params.id, {
      status: "converted"
    });

    // Update invoice number
    await Business.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { "invoiceSettings.nextNumber": 1 } }
    );

    // Update customer balance
    await Customer.findByIdAndUpdate(invoice.customerId, {
      $inc: { balance: invoice.total }
    });

    res.json({ success: true, invoice: newInvoice, message: "Document converted to invoice successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to convert document: " + err.message });
  }
});

// ========== DASHBOARD STATS ==========

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user.id, isDeleted: false };
    
    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    const [
      totalInvoices,
      totalCustomers,
      totalProducts,
      invoices,
      paidInvoices,
      pendingInvoices,
    ] = await Promise.all([
      Invoice.countDocuments({ ...query, documentType: "invoice" }),
      Customer.countDocuments({ userId: req.user.id, isActive: true }),
      Product.countDocuments({ userId: req.user.id, isActive: true }),
      Invoice.find({ ...query, documentType: "invoice" }),
      Invoice.find({ ...query, documentType: "invoice", status: "paid" }),
      Invoice.find({ ...query, documentType: "invoice", status: { $in: ["draft", "sent", "partial"] } }),
    ]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const totalPending = invoices.reduce((sum, inv) => sum + inv.balance, 0);
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);

    res.json({
      success: true,
      stats: {
        totalInvoices,
        totalCustomers,
        totalProducts,
        totalRevenue,
        totalPending,
        totalSales,
        paidInvoices: paidInvoices.length,
        pendingInvoices: pendingInvoices.length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats: " + err.message });
  }
});

module.exports = router;

