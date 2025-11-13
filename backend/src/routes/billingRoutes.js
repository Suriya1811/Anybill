const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Invoice = require("../models/Invoice");
const Business = require("../models/Business");
const InvoiceAudit = require("../models/InvoiceAudit");
const axios = require("axios");
const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY || "747ae4d3-bdff-11f0-bdde-0200cd936042";

// Import controllers
const invoiceTemplateController = require("../controllers/invoiceTemplateController");
const invoicePaymentController = require("../controllers/invoicePaymentController");

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
      templateId = "A4_CLASSIC"
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

    // Ensure invoiceSettings exists
    if (!business.invoiceSettings) {
      business.invoiceSettings = {
        prefix: "INV",
        nextNumber: 1,
        footerText: "Thank you for your business!",
        taxIncluded: false
      };
      await business.save();
    }

    // Generate unique document number with retry logic
    const prefixes = {
      invoice: business.invoiceSettings.prefix || "INV",
      delivery_challan: "DC",
      proforma_invoice: "PI",
      quotation: "QT",
      estimate: "EST"
    };
    
    const prefix = prefixes[documentType] || "INV";
    let invoiceNumber;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Try to generate unique invoice number
    while (attempts < maxAttempts) {
      // Get the latest nextNumber and increment atomically
      const updatedBusiness = await Business.findOneAndUpdate(
        { userId: req.user.id },
        { $inc: { "invoiceSettings.nextNumber": 1 } },
        { new: true }
      );
      
      const currentNumber = updatedBusiness.invoiceSettings.nextNumber - 1; // Use the number before increment
      invoiceNumber = `${prefix}-${String(currentNumber).padStart(6, "0")}`;
      
      // Check if this invoice number already exists
      const existingInvoice = await Invoice.findOne({ invoiceNumber });
      if (!existingInvoice) {
        break; // Unique number found
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        return res.status(500).json({ 
          message: "Failed to generate unique invoice number. Please try again." 
        });
      }
    }

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
        costPrice: item.costPrice || 0, // Include cost price for profit calculation
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
router.post("/invoices/:id/payment", verifyToken, invoicePaymentController.updatePayment);

// Set exact payment amount
router.put("/invoices/:id/payment", verifyToken, invoicePaymentController.setPayment);

// Get payment history
router.get("/invoices/:id/payment-history", verifyToken, invoicePaymentController.getPaymentHistory);

// Get outstanding summary
router.get("/outstanding-summary", verifyToken, invoicePaymentController.getOutstandingSummary);

// Get profit summary
router.get("/profit-summary", verifyToken, invoicePaymentController.getProfitSummary);

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
    const { method, phone, email, template = 'A4_CLASSIC' } = req.body; // method: 'whatsapp', 'sms', 'email'
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

    // Generate share URLs
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const invoiceViewUrl = `${frontendUrl}/invoice/${invoice._id}`;
    const invoicePreviewUrl = `${frontendUrl}/invoice-preview/${invoice._id}?template=${template}`;

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
      // WhatsApp Web Share - Opens WhatsApp with pre-filled message
      if (!sharePhone) {
        return res.status(400).json({ message: "Phone number required for WhatsApp sharing" });
      }

      try {
        // Clean and format phone number for WhatsApp
        const whatsappPhone = String(sharePhone).replace(/[^\d+]/g, "");
        if (!whatsappPhone || whatsappPhone.length < 10) {
          return res.status(400).json({ message: "Invalid phone number format" });
        }

        // Remove leading + for WhatsApp API
        const cleanPhone = whatsappPhone.replace(/^\+/, "");
        
        // Create detailed invoice message with template preview link
        const templateName = template.replace(/_/g, ' ');
        
        // Build message line by line to ensure proper formatting
        const messageParts = [
          `🧾 *Invoice from ${business?.businessName || "MyBillPro"}*`,
          ``,
          `📋 Invoice No: *${invoice.invoiceNumber}*`,
          `👤 Customer: ${invoice.customerDetails.name}`,
          `📅 Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}`,
          `💰 Amount: *₹${invoice.total.toLocaleString('en-IN')}*`,
          `✅ Paid: ₹${(invoice.paidAmount || 0).toLocaleString('en-IN')}`,
          `⏳ Balance: ₹${(invoice.balance || 0).toLocaleString('en-IN')}`,
          ``,
          `📄 Template: ${templateName}`,
          `📱 View Invoice:`,
          invoicePreviewUrl,
          ``,
          `Thank you for your business! 🙏`
        ];
        
        const whatsappMessage = messageParts.join('\n');
        
        // Log the message for debugging
        console.log('\n' + '='.repeat(70));
        console.log('📱 WhatsApp Share Debug Info:');
        console.log('='.repeat(70));
        console.log('Phone:', cleanPhone);
        console.log('Frontend URL:', frontendUrl);
        console.log('Invoice Preview URL:', invoicePreviewUrl);
        console.log('\nMessage to be sent:');
        console.log(whatsappMessage);
        console.log('='.repeat(70) + '\n');

        // Generate WhatsApp Web URL
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
        
        console.log('Full WhatsApp URL (first 200 chars):', whatsappUrl.substring(0, 200));
        console.log('URL Length:', whatsappUrl.length);

        return res.json({ 
          success: true, 
          message: "WhatsApp share link generated",
          whatsappUrl,
          phone: sharePhone,
          template,
          previewUrl: invoicePreviewUrl
        });
      } catch (err) {
        console.error('WhatsApp share error:', err);
        return res.status(500).json({ message: `Failed to generate WhatsApp link: ${err.message}` });
      }
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

// ========== INVOICE TEMPLATE & PRINTING ROUTES ==========

// Get available templates
router.get("/templates", verifyToken, invoiceTemplateController.getAvailableTemplates);

// Print invoice with template
router.post("/invoices/:id/print", verifyToken, invoiceTemplateController.printInvoice);

// Preview invoice template - PUBLIC ACCESS for sharing
router.get("/invoices/:id/preview", invoiceTemplateController.previewTemplate);

// ========== DASHBOARD STATS WITH COMPREHENSIVE LOGIC ==========

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user.id, isDeleted: false };
    
    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    // Fetch all required data in parallel for performance
    const [
      totalInvoices,
      totalCustomers,
      totalProducts,
      invoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      products,
      customers
    ] = await Promise.all([
      Invoice.countDocuments({ ...query, documentType: "invoice" }),
      Customer.countDocuments({ userId: req.user.id, isActive: true }),
      Product.countDocuments({ userId: req.user.id, isActive: true }),
      Invoice.find({ ...query, documentType: "invoice" }),
      Invoice.find({ ...query, documentType: "invoice", status: "paid" }),
      Invoice.find({ ...query, documentType: "invoice", status: { $in: ["draft", "sent", "partial"] } }),
      Invoice.find({ 
        userId: req.user.id, 
        isDeleted: false,
        documentType: "invoice",
        status: { $in: ["sent", "partial"] },
        dueDate: { $lt: new Date() }
      }).populate("customerId", "name phone email"),
      Product.find({ userId: req.user.id, isActive: true }),
      Customer.find({ userId: req.user.id, isActive: true })
    ]);

    // === DASHBOARD CALCULATIONS ===
    
    // Total Revenue = sum of all PAID invoices
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    
    // Total Sales = sum of ALL invoice totals (paid + pending)
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // Pending Amount = sum of all PENDING invoice balances
    const totalPending = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    // === LOW STOCK ALERTS ===
    const lowStockProducts = products.filter(p => {
      const currentStock = p.stock?.quantity || 0;
      const lowStockAlert = p.stock?.lowStockAlert || 0;
      const trackInventory = p.stock?.trackInventory || false;
      return trackInventory && currentStock > 0 && currentStock <= lowStockAlert;
    }).map(p => ({
      productId: p._id,
      name: p.name,
      currentStock: p.stock?.quantity || 0,
      lowStockAlert: p.stock?.lowStockAlert || 0,
      unit: p.unit
    }));

    // === PAYMENT DUE REMINDERS (Overdue Invoices) ===
    const paymentReminders = overdueInvoices
      .filter(inv => inv.customerId && inv.balance > 0)
      .map(inv => ({
        invoiceId: inv._id,
        invoiceNumber: inv.invoiceNumber || 'N/A',
        customer: {
          id: inv.customerId._id,
          name: inv.customerId.name || 'Unknown Customer',
          phone: inv.customerId.phone || '',
          email: inv.customerId.email || ''
        },
        amount: inv.total || 0,
        balance: inv.balance || 0,
        dueDate: inv.dueDate,
        daysOverdue: Math.floor((new Date() - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24))
      }));

    // === SALES TREND GRAPH DATA (Last 7 days or selected range) ===
    const salesTrend = {};
    invoices.forEach(inv => {
      try {
        const date = inv.invoiceDate ? new Date(inv.invoiceDate).toISOString().split('T')[0] : null;
        if (!date) return;
        
        if (!salesTrend[date]) {
          salesTrend[date] = {
            date,
            revenue: 0,
            invoices: 0,
            totalAmount: 0
          };
        }
        salesTrend[date].revenue += (inv.paidAmount || 0);
        salesTrend[date].totalAmount += (inv.total || 0);
        salesTrend[date].invoices += 1;
      } catch (err) {
        console.error('Error processing sales trend for invoice:', inv._id, err);
      }
    });

    const salesTrendData = Object.values(salesTrend).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // === CUSTOMER INSIGHTS ===
    const customerInsights = customers.map(c => {
      const customerInvoices = invoices.filter(inv => 
        inv.customerId && inv.customerId.toString() === c._id.toString()
      );
      
      const totalPurchases = customerInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const totalPaid = customerInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
      const outstandingBalance = customerInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

      return {
        customerId: c._id,
        name: c.name || 'Unknown',
        totalPurchases,
        totalPaid,
        outstandingBalance,
        invoiceCount: customerInvoices.length,
        lastTransactionDate: customerInvoices.length > 0 
          ? customerInvoices[0].invoiceDate 
          : c.createdAt
      };
    }).sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 10);

    // === PRODUCT PERFORMANCE ===
    const productSales = {};
    invoices.forEach(inv => {
      if (inv.items && Array.isArray(inv.items)) {
        inv.items.forEach(item => {
          const productId = item.productId?.toString() || 'unknown';
          if (!productSales[productId]) {
            productSales[productId] = {
              productId,
              name: item.name || 'Unknown Product',
              quantitySold: 0,
              revenue: 0,
              count: 0
            };
          }
          productSales[productId].quantitySold += (item.quantity || 0);
          productSales[productId].revenue += (item.subtotal || 0);
          productSales[productId].count += 1;
        });
      }
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // === INVOICE STATUS BREAKDOWN ===
    const statusBreakdown = {
      paid: paidInvoices.length,
      pending: pendingInvoices.length,
      overdue: overdueInvoices.length,
      draft: invoices.filter(inv => inv.status === 'draft').length
    };

    res.json({
      success: true,
      stats: {
        // Core Metrics
        totalInvoices,
        totalCustomers,
        totalProducts,
        totalRevenue,      // Only PAID invoices
        totalSales,        // ALL invoices (paid + pending)
        totalPending,      // Outstanding receivables
        paidInvoices: paidInvoices.length,
        pendingInvoices: pendingInvoices.length,
        
        // Additional Insights
        statusBreakdown,
        
        // Sales Trend for Graph
        salesTrend: salesTrendData,
        
        // Notifications & Alerts
        lowStockAlerts: lowStockProducts,
        paymentReminders: paymentReminders,
        
        // Top Performers
        topCustomers: customerInsights,
        topProducts: topSellingProducts,
        
        // Summary
        summary: {
          avgInvoiceValue: invoices.length > 0 ? totalSales / invoices.length : 0,
          avgPaymentTime: calculateAvgPaymentTime(invoices),
          collectionRate: totalSales > 0 ? (totalRevenue / totalSales * 100).toFixed(2) : 0
        }
      },
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: "Failed to fetch stats: " + err.message });
  }
});

// Helper function to calculate average payment time
function calculateAvgPaymentTime(invoices) {
  const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidAmount > 0);
  if (paidInvoices.length === 0) return 0;
  
  const totalDays = paidInvoices.reduce((sum, inv) => {
    const invoiceDate = new Date(inv.invoiceDate);
    const paymentDate = inv.paymentHistory && inv.paymentHistory.length > 0
      ? new Date(inv.paymentHistory[inv.paymentHistory.length - 1].paymentDate)
      : new Date();
    const days = Math.floor((paymentDate - invoiceDate) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);
  
  return Math.round(totalDays / paidInvoices.length);
}

module.exports = router;

