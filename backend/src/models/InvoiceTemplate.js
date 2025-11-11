const mongoose = require("mongoose");

const invoiceTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Template design settings
    design: {
      // Layout
      layout: {
        type: String,
        enum: ["modern", "classic", "minimal", "professional"],
        default: "modern"
      },
      // Colors
      primaryColor: {
        type: String,
        default: "#2563eb" // Blue
      },
      secondaryColor: {
        type: String,
        default: "#64748b" // Gray
      },
      // Fonts
      fontFamily: {
        type: String,
        default: "Arial, sans-serif"
      },
      fontSize: {
        type: String,
        default: "12px"
      },
      // Header
      showLogo: {
        type: Boolean,
        default: true
      },
      logoPosition: {
        type: String,
        enum: ["left", "center", "right"],
        default: "left"
      },
      showBusinessName: {
        type: Boolean,
        default: true
      },
      showBusinessDetails: {
        type: Boolean,
        default: true
      },
      // Invoice details
      showInvoiceNumber: {
        type: Boolean,
        default: true
      },
      showInvoiceDate: {
        type: Boolean,
        default: true
      },
      showDueDate: {
        type: Boolean,
        default: true
      },
      showPaymentTerms: {
        type: Boolean,
        default: true
      },
      // Customer details
      showCustomerDetails: {
        type: Boolean,
        default: true
      },
      showShippingAddress: {
        type: Boolean,
        default: false
      },
      // Items table
      showItemDescription: {
        type: Boolean,
        default: true
      },
      showHSN: {
        type: Boolean,
        default: true
      },
      showSAC: {
        type: Boolean,
        default: true
      },
      showUnit: {
        type: Boolean,
        default: true
      },
      showTaxBreakdown: {
        type: Boolean,
        default: true
      },
      // Totals
      showSubtotal: {
        type: Boolean,
        default: true
      },
      showDiscount: {
        type: Boolean,
        default: true
      },
      showTax: {
        type: Boolean,
        default: true
      },
      showTotal: {
        type: Boolean,
        default: true
      },
      // Footer
      showFooter: {
        type: Boolean,
        default: true
      },
      footerText: {
        type: String,
        default: "Thank you for your business!"
      },
      showTerms: {
        type: Boolean,
        default: true
      },
      showNotes: {
        type: Boolean,
        default: true
      },
      // Additional
      showQRCode: {
        type: Boolean,
        default: false
      },
      showBarcode: {
        type: Boolean,
        default: false
      },
      showSignature: {
        type: Boolean,
        default: false
      },
      signatureLabel: {
        type: String,
        default: "Authorized Signature"
      }
    },
    // Custom fields
    customFields: [{
      label: { type: String, required: true },
      value: { type: String, default: "" },
      position: { type: String, enum: ["header", "body", "footer"], default: "body" }
    }],
    // Template preview
    previewUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

invoiceTemplateSchema.index({ userId: 1, isDefault: 1 });
invoiceTemplateSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("InvoiceTemplate", invoiceTemplateSchema);

