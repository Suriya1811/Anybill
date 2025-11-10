const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Business = require("../models/Business");

// ========== PROFIT & LOSS STATEMENT ==========

router.get("/reports/profit-loss", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const query = {
      userId: req.user.id,
      documentType: "invoice",
      isDeleted: false,
      invoiceDate: { $gte: start, $lte: end }
    };

    const invoices = await Invoice.find(query);

    // Calculate revenue
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const totalPending = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    // Calculate tax collected
    const totalTax = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.totalTax || 0), 0);
    const cgst = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.cgst || 0), 0);
    const sgst = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.sgst || 0), 0);
    const igst = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.igst || 0), 0);

    // Calculate discounts
    const totalDiscounts = invoices.reduce((sum, inv) => sum + (inv.discount || 0), 0);

    // Net revenue (sales - discounts)
    const netRevenue = totalSales - totalDiscounts;

    // Calculate cost of goods sold (if products have cost)
    const products = await Product.find({ userId: req.user.id, isActive: true });
    const productCosts = {};
    products.forEach(p => {
      productCosts[p._id.toString()] = p.cost || 0;
    });

    let totalCOGS = 0;
    invoices.forEach(inv => {
      inv.items.forEach(item => {
        const productId = item.productId?.toString();
        if (productId && productCosts[productId]) {
          totalCOGS += (item.quantity * productCosts[productId]);
        }
      });
    });

    // Gross profit
    const grossProfit = netRevenue - totalCOGS;

    // Operating expenses (placeholder - can be extended)
    const operatingExpenses = 0; // Can add expense tracking later

    // Net profit
    const netProfit = grossProfit - operatingExpenses;

    res.json({
      success: true,
      report: {
        period: { start, end },
        revenue: {
          totalSales,
          totalDiscounts,
          netRevenue,
          totalPaid,
          totalPending
        },
        tax: {
          totalTax,
          cgst,
          sgst,
          igst
        },
        costOfGoodsSold: totalCOGS,
        grossProfit,
        operatingExpenses,
        netProfit
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate P&L report: " + err.message });
  }
});

// ========== BALANCE SHEET ==========

router.get("/reports/balance-sheet", verifyToken, async (req, res) => {
  try {
    const { asOnDate } = req.query;
    const asOn = asOnDate ? new Date(asOnDate) : new Date();

    // Assets
    const invoices = await Invoice.find({
      userId: req.user.id,
      documentType: "invoice",
      isDeleted: false,
      invoiceDate: { $lte: asOn }
    });

    // Accounts Receivable (outstanding invoices)
    const accountsReceivable = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    // Cash (paid invoices - can be extended with bank accounts)
    const cash = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

    // Inventory value
    const products = await Product.find({ userId: req.user.id, isActive: true });
    const inventoryValue = products.reduce((sum, p) => {
      return sum + ((p.stock?.quantity || 0) * (p.cost || 0));
    }, 0);

    const totalAssets = accountsReceivable + cash + inventoryValue;

    // Liabilities
    // Accounts Payable (placeholder - can be extended with purchase tracking)
    const accountsPayable = 0;

    // Equity
    const equity = totalAssets - accountsPayable;

    res.json({
      success: true,
      report: {
        asOnDate: asOn,
        assets: {
          current: {
            accountsReceivable,
            cash,
            inventory: inventoryValue,
            total: totalAssets
          }
        },
        liabilities: {
          current: {
            accountsPayable,
            total: accountsPayable
          }
        },
        equity: {
          total: equity
        },
        total: {
          assets: totalAssets,
          liabilitiesAndEquity: accountsPayable + equity
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate balance sheet: " + err.message });
  }
});

// ========== LEDGER REPORTS ==========

router.get("/reports/ledger", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, customerId, type } = req.query; // type: 'customer', 'product', 'general'
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const query = {
      userId: req.user.id,
      documentType: "invoice",
      isDeleted: false,
      invoiceDate: { $gte: start, $lte: end }
    };

    if (customerId) query.customerId = customerId;

    const invoices = await Invoice.find(query)
      .populate("customerId", "name phone email")
      .sort({ invoiceDate: 1 });

    if (type === "customer") {
      // Customer-wise ledger
      const customerLedger = {};
      invoices.forEach(inv => {
        const customerId = inv.customerId._id.toString();
        if (!customerLedger[customerId]) {
          customerLedger[customerId] = {
            customer: inv.customerId,
            openingBalance: 0,
            transactions: [],
            closingBalance: 0
          };
        }
        customerLedger[customerId].transactions.push({
          date: inv.invoiceDate,
          invoiceNumber: inv.invoiceNumber,
          debit: inv.total,
          credit: inv.paidAmount || 0,
          balance: inv.balance
        });
      });

      // Calculate balances
      Object.keys(customerLedger).forEach(customerId => {
        const ledger = customerLedger[customerId];
        let balance = ledger.openingBalance;
        ledger.transactions.forEach(txn => {
          balance = balance + txn.debit - txn.credit;
          txn.balance = balance;
        });
        ledger.closingBalance = balance;
      });

      return res.json({
        success: true,
        report: {
          type: "customer",
          period: { start, end },
          ledgers: Object.values(customerLedger)
        }
      });
    } else if (type === "product") {
      // Product-wise ledger
      const productLedger = {};
      invoices.forEach(inv => {
        inv.items.forEach(item => {
          const productId = item.productId?.toString() || item.name;
          if (!productLedger[productId]) {
            productLedger[productId] = {
              productId: item.productId,
              productName: item.name,
              quantity: 0,
              sales: 0,
              tax: 0
            };
          }
          productLedger[productId].quantity += item.quantity;
          productLedger[productId].sales += item.subtotal;
          productLedger[productId].tax += item.taxAmount;
        });
      });

      return res.json({
        success: true,
        report: {
          type: "product",
          period: { start, end },
          ledgers: Object.values(productLedger)
        }
      });
    } else {
      // General ledger
      const ledger = invoices.map(inv => ({
        date: inv.invoiceDate,
        invoiceNumber: inv.invoiceNumber,
        customer: inv.customerDetails.name,
        debit: inv.total,
        credit: inv.paidAmount || 0,
        balance: inv.balance,
        status: inv.status
      }));

      return res.json({
        success: true,
        report: {
          type: "general",
          period: { start, end },
          transactions: ledger
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to generate ledger report: " + err.message });
  }
});

// ========== SALES REPORT ==========

router.get("/reports/sales", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query; // groupBy: 'day', 'week', 'month', 'year', 'customer', 'product'
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const query = {
      userId: req.user.id,
      documentType: "invoice",
      isDeleted: false,
      invoiceDate: { $gte: start, $lte: end }
    };

    const invoices = await Invoice.find(query)
      .populate("customerId", "name")
      .sort({ invoiceDate: 1 });

    if (groupBy === "day" || groupBy === "week" || groupBy === "month" || groupBy === "year") {
      const grouped = {};
      invoices.forEach(inv => {
        const date = new Date(inv.invoiceDate);
        let key;
        if (groupBy === "day") {
          key = date.toISOString().split("T")[0];
        } else if (groupBy === "week") {
          const week = getWeek(date);
          key = `${date.getFullYear()}-W${week}`;
        } else if (groupBy === "month") {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        } else {
          key = date.getFullYear().toString();
        }

        if (!grouped[key]) {
          grouped[key] = { period: key, count: 0, sales: 0, tax: 0, paid: 0 };
        }
        grouped[key].count += 1;
        grouped[key].sales += inv.total;
        grouped[key].tax += inv.taxDetails?.totalTax || 0;
        grouped[key].paid += inv.paidAmount || 0;
      });

      return res.json({
        success: true,
        report: {
          type: "sales",
          groupBy,
          period: { start, end },
          data: Object.values(grouped)
        }
      });
    } else if (groupBy === "customer") {
      const grouped = {};
      invoices.forEach(inv => {
        const customerId = inv.customerId._id.toString();
        if (!grouped[customerId]) {
          grouped[customerId] = {
            customer: inv.customerId.name,
            count: 0,
            sales: 0,
            paid: 0,
            pending: 0
          };
        }
        grouped[customerId].count += 1;
        grouped[customerId].sales += inv.total;
        grouped[customerId].paid += inv.paidAmount || 0;
        grouped[customerId].pending += inv.balance;
      });

      return res.json({
        success: true,
        report: {
          type: "sales",
          groupBy: "customer",
          period: { start, end },
          data: Object.values(grouped)
        }
      });
    } else if (groupBy === "product") {
      const grouped = {};
      invoices.forEach(inv => {
        inv.items.forEach(item => {
          const productId = item.productId?.toString() || item.name;
          if (!grouped[productId]) {
            grouped[productId] = {
              productName: item.name,
              quantity: 0,
              sales: 0,
              tax: 0
            };
          }
          grouped[productId].quantity += item.quantity;
          grouped[productId].sales += item.subtotal;
          grouped[productId].tax += item.taxAmount;
        });
      });

      return res.json({
        success: true,
        report: {
          type: "sales",
          groupBy: "product",
          period: { start, end },
          data: Object.values(grouped)
        }
      });
    }

    // Default: summary
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const totalPending = invoices.reduce((sum, inv) => sum + inv.balance, 0);
    const totalTax = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.totalTax || 0), 0);

    res.json({
      success: true,
      report: {
        type: "sales",
        period: { start, end },
        summary: {
          totalInvoices: invoices.length,
          totalSales,
          totalPaid,
          totalPending,
          totalTax
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate sales report: " + err.message });
  }
});

// ========== OUTSTANDING REPORTS ==========

router.get("/reports/outstanding", verifyToken, async (req, res) => {
  try {
    const { type } = req.query; // type: 'receivables', 'payables'

    if (type === "receivables") {
      const invoices = await Invoice.find({
        userId: req.user.id,
        documentType: "invoice",
        isDeleted: false,
        balance: { $gt: 0 }
      })
        .populate("customerId", "name phone email")
        .sort({ dueDate: 1 });

      const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);

      // Group by customer
      const customerWise = {};
      invoices.forEach(inv => {
        const customerId = inv.customerId._id.toString();
        if (!customerWise[customerId]) {
          customerWise[customerId] = {
            customer: inv.customerId,
            invoices: [],
            totalOutstanding: 0
          };
        }
        customerWise[customerId].invoices.push({
          invoiceNumber: inv.invoiceNumber,
          invoiceDate: inv.invoiceDate,
          dueDate: inv.dueDate,
          amount: inv.total,
          paid: inv.paidAmount || 0,
          outstanding: inv.balance,
          daysOverdue: Math.max(0, Math.floor((new Date() - inv.dueDate) / (1000 * 60 * 60 * 24)))
        });
        customerWise[customerId].totalOutstanding += inv.balance;
      });

      res.json({
        success: true,
        report: {
          type: "receivables",
          totalOutstanding,
          customerWise: Object.values(customerWise),
          invoices: invoices.map(inv => ({
            invoiceNumber: inv.invoiceNumber,
            customer: inv.customerDetails.name,
            invoiceDate: inv.invoiceDate,
            dueDate: inv.dueDate,
            amount: inv.total,
            paid: inv.paidAmount || 0,
            outstanding: inv.balance,
            daysOverdue: Math.max(0, Math.floor((new Date() - inv.dueDate) / (1000 * 60 * 60 * 24)))
          }))
        }
      });
    } else {
      // Payables (placeholder - can be extended with purchase tracking)
      res.json({
        success: true,
        report: {
          type: "payables",
          totalOutstanding: 0,
          message: "Purchase tracking not implemented yet"
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to generate outstanding report: " + err.message });
  }
});

// Helper function to get week number
function getWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = router;

