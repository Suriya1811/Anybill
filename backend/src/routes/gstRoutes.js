const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Invoice = require("../models/Invoice");
const Business = require("../models/Business");

// ========== GSTR-1 EXPORT ==========

router.get("/gst/gstr1", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    const invoices = await Invoice.find({
      userId: req.user.id,
      documentType: "invoice",
      isDeleted: false,
      invoiceDate: { $gte: start, $lte: end },
      status: { $ne: "cancelled" }
    }).populate("customerId");

    const business = await Business.findOne({ userId: req.user.id });

    // Group by HSN/SAC
    const hsnWise = {};
    const sacWise = {};

    invoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.hsn) {
          if (!hsnWise[item.hsn]) {
            hsnWise[item.hsn] = {
              hsn: item.hsn,
              description: item.name,
              uqc: item.unit || "PCS",
              qty: 0,
              rt: item.taxRate || 0,
              txval: 0,
              iamt: 0,
              camt: 0,
              samt: 0,
              csamt: 0
            };
          }
          hsnWise[item.hsn].qty += item.quantity;
          hsnWise[item.hsn].txval += item.subtotal;
          hsnWise[item.hsn].iamt += item.taxType === "IGST" ? item.taxAmount : 0;
          hsnWise[item.hsn].camt += item.taxType === "GST" ? (item.taxAmount / 2) : 0;
          hsnWise[item.hsn].samt += item.taxType === "GST" ? (item.taxAmount / 2) : 0;
        } else if (item.sac) {
          if (!sacWise[item.sac]) {
            sacWise[item.sac] = {
              sac: item.sac,
              description: item.name,
              rt: item.taxRate || 0,
              txval: 0,
              iamt: 0,
              camt: 0,
              samt: 0,
              csamt: 0
            };
          }
          sacWise[item.sac].txval += item.subtotal;
          sacWise[item.sac].iamt += item.taxType === "IGST" ? item.taxAmount : 0;
          sacWise[item.sac].camt += item.taxType === "GST" ? (item.taxAmount / 2) : 0;
          sacWise[item.sac].samt += item.taxType === "GST" ? (item.taxAmount / 2) : 0;
        }
      });
    });

    // B2B Invoices (with GSTIN)
    const b2bInvoices = invoices.filter(inv => inv.customerDetails.gstin);

    // B2C Invoices (without GSTIN)
    const b2cInvoices = invoices.filter(inv => !inv.customerDetails.gstin);

    // Group B2B by state
    const b2bByState = {};
    b2bInvoices.forEach(inv => {
      const state = inv.customerDetails.address?.state || "";
      if (!b2bByState[state]) {
        b2bByState[state] = {
          state,
          invoices: [],
          totalTaxable: 0,
          totalTax: 0
        };
      }
      b2bByState[state].invoices.push({
        ctin: inv.customerDetails.gstin,
        pos: state,
        typ: inv.customerDetails.address?.state === business?.address?.state ? "B2B" : "B2B-Inter",
        etin: "",
        rt: inv.taxDetails?.totalTax / inv.subtotal * 100 || 0,
        txval: inv.subtotal,
        iamt: inv.taxDetails?.igst || 0,
        camt: inv.taxDetails?.cgst || 0,
        samt: inv.taxDetails?.sgst || 0,
        csamt: 0
      });
      b2bByState[state].totalTaxable += inv.subtotal;
      b2bByState[state].totalTax += inv.taxDetails?.totalTax || 0;
    });

    // Group B2C by tax rate
    const b2cByRate = {};
    b2cInvoices.forEach(inv => {
      const rate = inv.taxDetails?.totalTax / inv.subtotal * 100 || 0;
      if (!b2cByRate[rate]) {
        b2cByRate[rate] = {
          rate,
          invoices: [],
          totalTaxable: 0,
          totalTax: 0
        };
      }
      b2cByRate[rate].invoices.push({
        pos: business?.address?.state || "",
        typ: "B2C",
        etin: "",
        rt: rate,
        txval: inv.subtotal,
        iamt: inv.taxDetails?.igst || 0,
        camt: inv.taxDetails?.cgst || 0,
        samt: inv.taxDetails?.sgst || 0,
        csamt: 0
      });
      b2cByRate[rate].totalTaxable += inv.subtotal;
      b2cByRate[rate].totalTax += inv.taxDetails?.totalTax || 0;
    });

    res.json({
      success: true,
      gstr1: {
        period: { start, end },
        business: {
          gstin: business?.gstin || "",
          name: business?.businessName || "",
          state: business?.address?.state || ""
        },
        b2b: {
          count: b2bInvoices.length,
          byState: Object.values(b2bByState)
        },
        b2c: {
          count: b2cInvoices.length,
          byRate: Object.values(b2cByRate)
        },
        hsn: Object.values(hsnWise),
        sac: Object.values(sacWise),
        summary: {
          totalInvoices: invoices.length,
          totalTaxable: invoices.reduce((sum, inv) => sum + inv.subtotal, 0),
          totalTax: invoices.reduce((sum, inv) => sum + (inv.taxDetails?.totalTax || 0), 0),
          totalCGST: invoices.reduce((sum, inv) => sum + (inv.taxDetails?.cgst || 0), 0),
          totalSGST: invoices.reduce((sum, inv) => sum + (inv.taxDetails?.sgst || 0), 0),
          totalIGST: invoices.reduce((sum, inv) => sum + (inv.taxDetails?.igst || 0), 0)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate GSTR-1: " + err.message });
  }
});

// ========== GSTR-3B EXPORT ==========

router.get("/gst/gstr3b", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    const invoices = await Invoice.find({
      userId: req.user.id,
      documentType: "invoice",
      isDeleted: false,
      invoiceDate: { $gte: start, $lte: end },
      status: { $ne: "cancelled" }
    });

    const business = await Business.findOne({ userId: req.user.id });

    // Calculate totals
    const totalTaxable = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
    const totalCGST = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.cgst || 0), 0);
    const totalSGST = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.sgst || 0), 0);
    const totalIGST = invoices.reduce((sum, inv) => sum + (inv.taxDetails?.igst || 0), 0);
    const totalCess = 0; // Can be extended

    // Group by tax rate
    const byRate = {};
    invoices.forEach(inv => {
      inv.items.forEach(item => {
        const rate = item.taxRate || 0;
        if (!byRate[rate]) {
          byRate[rate] = {
            rate,
            taxable: 0,
            cgst: 0,
            sgst: 0,
            igst: 0
          };
        }
        byRate[rate].taxable += item.subtotal;
        if (item.taxType === "GST") {
          byRate[rate].cgst += item.taxAmount / 2;
          byRate[rate].sgst += item.taxAmount / 2;
        } else if (item.taxType === "IGST") {
          byRate[rate].igst += item.taxAmount;
        }
      });
    });

    res.json({
      success: true,
      gstr3b: {
        period: { start, end },
        business: {
          gstin: business?.gstin || "",
          name: business?.businessName || "",
          state: business?.address?.state || ""
        },
        summary: {
          totalTaxable,
          totalCGST,
          totalSGST,
          totalIGST,
          totalCess
        },
        byRate: Object.values(byRate),
        // Placeholder for other sections
        inputTaxCredit: {
          eligible: 0,
          ineligible: 0
        },
        interestAndLateFee: {
          interest: 0,
          lateFee: 0
        },
        payment: {
          cash: 0,
          itc: 0
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate GSTR-3B: " + err.message });
  }
});

// ========== EXPORT TO JSON/CSV ==========

router.get("/gst/export", verifyToken, async (req, res) => {
  try {
    const { type, format } = req.query; // type: 'gstr1', 'gstr3b', format: 'json', 'csv'

    let data;
    if (type === "gstr1") {
      // Generate GSTR-1 data (simplified - you can call the actual endpoint logic)
      const invoices = await Invoice.find({
        userId: req.user.id,
        documentType: "invoice",
        isDeleted: false
      });
      data = { type: "GSTR-1", invoices: invoices.length };
    } else if (type === "gstr3b") {
      const invoices = await Invoice.find({
        userId: req.user.id,
        documentType: "invoice",
        isDeleted: false
      });
      data = { type: "GSTR-3B", invoices: invoices.length };
    } else {
      return res.status(400).json({ message: "Invalid export type" });
    }

    if (format === "csv") {
      // Convert to CSV (simplified)
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${type}-${Date.now()}.csv"`);
      res.send("Type,Count\n" + `${data.type},${data.invoices}`);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${type}-${Date.now()}.json"`);
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to export GST data: " + err.message });
  }
});

module.exports = router;

