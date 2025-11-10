const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Invoice = require("../models/Invoice");
const Business = require("../models/Business");

// ========== E-INVOICE GENERATION ==========

router.post("/einvoice/generate", verifyToken, async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      userId: req.user.id,
      documentType: "invoice",
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const business = await Business.findOne({ userId: req.user.id });

    // Prepare e-Invoice data (IRN generation structure)
    const eInvoiceData = {
      Version: "1.1",
      TranDtls: {
        TaxSch: "GST",
        SupTyp: "B2B",
        RegRev: "Y",
        EcmGstin: business?.gstin || "",
        IgstOnIntra: "N"
      },
      DocDtls: {
        Typ: "INV",
        No: invoice.invoiceNumber,
        Dt: invoice.invoiceDate.toISOString().split("T")[0]
      },
      SellerDtls: {
        Gstin: business?.gstin || "",
        LglNm: business?.businessName || "",
        TrdNm: business?.businessName || "",
        Addr1: business?.address?.street || "",
        Addr2: "",
        Loc: business?.address?.city || "",
        Pin: business?.address?.pincode || "",
        Stcd: business?.address?.state || "",
        Ph: business?.contact?.phone || "",
        Em: business?.contact?.email || ""
      },
      BuyerDtls: {
        Gstin: invoice.customerDetails.gstin || "",
        LglNm: invoice.customerDetails.name || "",
        TrdNm: invoice.customerDetails.name || "",
        Pos: invoice.customerDetails.address?.state || business?.address?.state || "",
        Addr1: invoice.customerDetails.address?.street || "",
        Addr2: "",
        Loc: invoice.customerDetails.address?.city || "",
        Pin: invoice.customerDetails.address?.pincode || "",
        Stcd: invoice.customerDetails.address?.state || "",
        Ph: invoice.customerDetails.phone || "",
        Em: invoice.customerDetails.email || ""
      },
      ItemList: invoice.items.map(item => ({
        SlNo: invoice.items.indexOf(item) + 1,
        PrdDesc: item.name,
        IsServc: item.sac ? "Y" : "N",
        HsnCd: item.hsn || "",
        Qty: item.quantity,
        Unit: item.unit || "PCS",
        UnitPrice: item.price,
        TotAmt: item.subtotal,
        Discount: 0,
        AssAmt: item.subtotal,
        GstRt: item.taxRate,
        IgstAmt: item.taxType === "IGST" ? item.taxAmount : 0,
        CgstAmt: item.taxType === "GST" ? item.taxAmount / 2 : 0,
        SgstAmt: item.taxType === "GST" ? item.taxAmount / 2 : 0,
        TotItemVal: item.total
      })),
      ValDtls: {
        AssVal: invoice.subtotal,
        CgstVal: invoice.taxDetails.cgst,
        SgstVal: invoice.taxDetails.sgst,
        IgstVal: invoice.taxDetails.igst,
        TotInvVal: invoice.total,
        TotInvValFc: invoice.total
      }
    };

    // Note: Actual IRN generation requires integration with GST portal API
    // This is the structure for e-Invoice generation
    // In production, you would call the GST portal API here

    // For now, generate a mock IRN (in production, this comes from GST portal)
    const mockIRN = `IRN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const mockAckNo = `ACK${Date.now()}`;
    const mockQRCode = `QRCODE_${mockIRN}`;

    // Update invoice with e-Invoice details
    await Invoice.findByIdAndUpdate(invoiceId, {
      eInvoiceNumber: mockIRN,
      eInvoiceAckNumber: mockAckNo,
      eInvoiceQRCode: mockQRCode
    });

    res.json({
      success: true,
      message: "E-Invoice generated successfully (mock - requires GST portal integration)",
      eInvoice: {
        irn: mockIRN,
        ackNo: mockAckNo,
        qrCode: mockQRCode,
        data: eInvoiceData
      },
      note: "In production, integrate with GST portal API for actual IRN generation"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate e-Invoice: " + err.message });
  }
});

// ========== E-WAY BILL GENERATION ==========

router.post("/ewaybill/generate", verifyToken, async (req, res) => {
  try {
    const { invoiceId, vehicleNumber, transporterName, distance, transportMode } = req.body;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      userId: req.user.id,
      documentType: { $in: ["invoice", "delivery_challan"] },
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const business = await Business.findOne({ userId: req.user.id });

    // Prepare e-Way Bill data
    const eWayBillData = {
      userGstin: business?.gstin || "",
      supplyType: invoice.customerDetails.address?.state === business?.address?.state ? "INTRA" : "INTER",
      subSupplyType: "1",
      docType: invoice.documentType === "delivery_challan" ? "CHL" : "INV",
      docNo: invoice.invoiceNumber,
      docDate: invoice.invoiceDate.toISOString().split("T")[0],
      fromGstin: business?.gstin || "",
      fromTrdName: business?.businessName || "",
      fromAddr1: business?.address?.street || "",
      fromAddr2: "",
      fromPlace: business?.address?.city || "",
      fromPincode: business?.address?.pincode || "",
      fromStateCode: business?.address?.state || "",
      toGstin: invoice.customerDetails.gstin || "",
      toTrdName: invoice.customerDetails.name || "",
      toAddr1: invoice.customerDetails.address?.street || "",
      toAddr2: "",
      toPlace: invoice.customerDetails.address?.city || "",
      toPincode: invoice.customerDetails.address?.pincode || "",
      toStateCode: invoice.customerDetails.address?.state || "",
      itemList: invoice.items.map(item => ({
        productName: item.name,
        productDesc: item.description || "",
        hsnCode: item.hsn || "",
        quantity: item.quantity,
        qtyUnit: item.unit || "PCS",
        cgstRate: item.taxType === "GST" ? item.taxRate / 2 : 0,
        sgstRate: item.taxType === "GST" ? item.taxRate / 2 : 0,
        igstRate: item.taxType === "IGST" ? item.taxRate : 0,
        cessRate: 0,
        taxableAmount: item.subtotal,
        cgstAmount: item.taxType === "GST" ? item.taxAmount / 2 : 0,
        sgstAmount: item.taxType === "GST" ? item.taxAmount / 2 : 0,
        igstAmount: item.taxType === "IGST" ? item.taxAmount : 0,
        cessAmount: 0,
        totalAmount: item.total
      })),
      totalValue: invoice.total,
      totalInvValue: invoice.total,
      cgstValue: invoice.taxDetails.cgst,
      sgstValue: invoice.taxDetails.sgst,
      igstValue: invoice.taxDetails.igst,
      cessValue: 0,
      transMode: transportMode || "1", // 1=Road, 2=Rail, 3=Air, 4=Ship
      transDistance: distance || 0,
      transporterName: transporterName || "",
      transporterId: "",
      vehicleNo: vehicleNumber || "",
      vehicleType: "R"
    };

    // Note: Actual e-Way Bill generation requires integration with GST portal API
    // This is the structure for e-Way Bill generation

    // For now, generate a mock e-Way Bill number
    const mockEWayBillNo = `EWB${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Update invoice with e-Way Bill details
    await Invoice.findByIdAndUpdate(invoiceId, {
      eWayBillNumber: mockEWayBillNo,
      vehicleNumber: vehicleNumber || "",
      transporterName: transporterName || ""
    });

    res.json({
      success: true,
      message: "E-Way Bill generated successfully (mock - requires GST portal integration)",
      eWayBill: {
        ewbNo: mockEWayBillNo,
        data: eWayBillData
      },
      note: "In production, integrate with GST portal API for actual e-Way Bill generation"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate e-Way Bill: " + err.message });
  }
});

// Cancel e-Way Bill
router.post("/ewaybill/cancel", verifyToken, async (req, res) => {
  try {
    const { invoiceId, reason } = req.body;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      userId: req.user.id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (!invoice.eWayBillNumber) {
      return res.status(400).json({ message: "E-Way Bill not found for this invoice" });
    }

    // Note: Actual cancellation requires GST portal API integration
    // For now, just clear the e-Way Bill number
    await Invoice.findByIdAndUpdate(invoiceId, {
      eWayBillNumber: ""
    });

    res.json({
      success: true,
      message: "E-Way Bill cancelled successfully (mock - requires GST portal integration)",
      note: "In production, integrate with GST portal API for actual e-Way Bill cancellation"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel e-Way Bill: " + err.message });
  }
});

module.exports = router;

