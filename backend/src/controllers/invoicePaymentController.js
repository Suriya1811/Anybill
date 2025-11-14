const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const InvoiceAudit = require("../models/InvoiceAudit");

/**
 * Update invoice payment and auto-recalculate all related fields
 * - Updates balance, status, profit
 * - Maintains payment history
 * - Updates customer outstanding balance
 * - Logs audit trail
 */
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod = "Cash", note = "" } = req.body;

    // Validate payment amount
    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment amount must be greater than 0" 
      });
    }

    // Find invoice
    const invoice = await Invoice.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: "Invoice not found" 
      });
    }

    // Store previous values for audit
    const previousPaidAmount = invoice.paidAmount || 0;
    const previousBalance = invoice.balance || invoice.total;
    const previousStatus = invoice.status;

    // Update paid amount
    invoice.paidAmount = previousPaidAmount + paidAmount;

    // Add to payment history
    invoice.paymentHistory.push({
      paidAmount,
      paymentDate: new Date(),
      paymentMethod,
      note,
      recordedBy: req.user.id
    });

    // Save invoice (pre-save middleware will auto-calculate balance, status, profit)
    await invoice.save();

    // Update customer outstanding balance
    const customer = await Customer.findById(invoice.customerId);
    if (customer) {
      customer.balance = (customer.balance || 0) - paidAmount;
      await customer.save();
    }

    // Log audit
    await InvoiceAudit.logAction({
      invoiceId: id,
      userId: req.user.id,
      actionType: "PAYMENT_ADDED",
      paymentDetails: {
        paidAmount,
        previousPaidAmount,
        previousBalance,
        newBalance: invoice.balance,
        previousStatus,
        newStatus: invoice.status
      },
      note: `Payment of ${paidAmount} added via ${paymentMethod}. ${note}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Get updated customer balance
    const updatedCustomer = await Customer.findById(invoice.customerId);

    res.json({
      success: true,
      message: "Payment updated successfully",
      invoice: {
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        paidAmount: invoice.paidAmount,
        balance: invoice.balance,
        status: invoice.status,
        profit: invoice.profit,
        paymentHistory: invoice.paymentHistory
      },
      customer: {
        _id: updatedCustomer._id,
        name: updatedCustomer.name,
        outstandingBalance: updatedCustomer.balance
      },
      summary: {
        paymentAdded: paidAmount,
        previousBalance,
        newBalance: invoice.balance,
        statusChanged: previousStatus !== invoice.status,
        previousStatus,
        newStatus: invoice.status
      }
    });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update payment: " + error.message 
    });
  }
};

/**
 * Set exact paid amount (replace instead of add)
 */
const setPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod = "Cash", note = "" } = req.body;

    // Validate payment amount
    if (paidAmount < 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment amount cannot be negative" 
      });
    }

    // Find invoice
    const invoice = await Invoice.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: "Invoice not found" 
      });
    }

    // Store previous values
    const previousPaidAmount = invoice.paidAmount || 0;
    const previousBalance = invoice.balance || invoice.total;
    const previousStatus = invoice.status;
    const paymentDifference = paidAmount - previousPaidAmount;

    // Set paid amount
    invoice.paidAmount = paidAmount;

    // Add to payment history
    invoice.paymentHistory.push({
      paidAmount: paymentDifference,
      paymentDate: new Date(),
      paymentMethod,
      note: note || `Payment set to ${paidAmount}`,
      recordedBy: req.user.id
    });

    // Save invoice
    await invoice.save();

    // Update customer balance
    const customer = await Customer.findById(invoice.customerId);
    if (customer) {
      customer.balance = (customer.balance || 0) - paymentDifference;
      await customer.save();
    }

    // Log audit
    await InvoiceAudit.logAction({
      invoiceId: id,
      userId: req.user.id,
      actionType: "PAYMENT_UPDATED",
      paymentDetails: {
        paidAmount,
        previousPaidAmount,
        previousBalance,
        newBalance: invoice.balance,
        previousStatus,
        newStatus: invoice.status
      },
      note: `Payment set to ${paidAmount}. ${note}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    const updatedCustomer = await Customer.findById(invoice.customerId);

    res.json({
      success: true,
      message: "Payment set successfully",
      invoice: {
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        paidAmount: invoice.paidAmount,
        balance: invoice.balance,
        status: invoice.status,
        profit: invoice.profit,
        paymentHistory: invoice.paymentHistory
      },
      customer: {
        _id: updatedCustomer._id,
        name: updatedCustomer.name,
        outstandingBalance: updatedCustomer.balance
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to set payment: " + error.message 
    });
  }
};

/**
 * Get payment history for an invoice
 */
const getPaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false
    }).select('invoiceNumber total paidAmount balance status paymentHistory');

    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: "Invoice not found" 
      });
    }

    res.json({
      success: true,
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total,
      paidAmount: invoice.paidAmount,
      balance: invoice.balance,
      status: invoice.status,
      paymentHistory: invoice.paymentHistory.sort((a, b) => b.paymentDate - a.paymentDate)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payment history: " + error.message 
    });
  }
};

/**
 * Get outstanding summary (all unpaid/partial invoices)
 */
const getOutstandingSummary = async (req, res) => {
  try {
    const { customerId } = req.query;

    const query = {
      userId: req.user.id,
      isDeleted: false,
      documentType: "invoice",
      status: { $in: ["partial", "sent", "draft", "overdue"] }
    };

    if (customerId) {
      query.customerId = customerId;
    }

    const outstandingInvoices = await Invoice.find(query)
      .populate("customerId", "name phone email")
      .select("invoiceNumber customerId total paidAmount balance status invoiceDate dueDate")
      .sort({ invoiceDate: -1 });

    const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const totalInvoices = outstandingInvoices.length;

    res.json({
      success: true,
      summary: {
        totalOutstanding,
        totalInvoices,
        invoices: outstandingInvoices
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch outstanding summary: " + error.message 
    });
  }
};

/**
 * Get profit summary
 */
const getProfitSummary = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const query = {
      userId: req.user.id,
      isDeleted: false,
      documentType: "invoice"
    };

    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    if (status) {
      query.status = status;
    }

    const invoices = await Invoice.find(query).select("invoiceNumber total paidAmount balance profit status invoiceDate");

    const totalProfit = invoices.reduce((sum, inv) => sum + (inv.profit || 0), 0);
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    res.json({
      success: true,
      summary: {
        totalProfit,
        totalRevenue,
        totalPaid,
        profitMargin: profitMargin.toFixed(2),
        invoiceCount: invoices.length,
        invoices
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch profit summary: " + error.message 
    });
  }
};

module.exports = {
  updatePayment,
  setPayment,
  getPaymentHistory,
  getOutstandingSummary,
  getProfitSummary
};

