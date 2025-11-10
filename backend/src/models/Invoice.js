const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.01
  },
  unit: {
    type: String,
    default: "Piece"
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxType: {
    type: String,
    enum: ["GST", "IGST", "None"],
    default: "GST"
  },
  hsn: {
    type: String,
    default: ""
  },
  sac: {
    type: String,
    default: ""
  },
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    documentType: {
      type: String,
      enum: ["invoice", "delivery_challan", "proforma_invoice", "quotation", "estimate"],
      default: "invoice",
      index: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: Object, default: {} },
      gstin: { type: String, default: "" }
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "fixed"
    },
    taxDetails: {
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 }
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    balance: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "partial", "overdue", "cancelled", "accepted", "rejected", "converted"],
      default: "draft"
    },
    // For quotations/estimates
    validUntil: {
      type: Date,
      default: null
    },
    // For delivery challan
    challanNumber: {
      type: String,
      default: ""
    },
    vehicleNumber: {
      type: String,
      default: ""
    },
    transporterName: {
      type: String,
      default: ""
    },
    // For e-Invoicing
    eInvoiceNumber: {
      type: String,
      default: ""
    },
    eInvoiceAckNumber: {
      type: String,
      default: ""
    },
    eInvoiceQRCode: {
      type: String,
      default: ""
    },
    // For e-Way Bill
    eWayBillNumber: {
      type: String,
      default: ""
    },
    // For recurring invoices
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringSettings: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
        default: "monthly"
      },
      interval: {
        type: Number,
        default: 1
      },
      nextRunDate: {
        type: Date,
        default: null
      },
      endDate: {
        type: Date,
        default: null
      },
      autoSend: {
        type: Boolean,
        default: false
      }
    },
    // Template customization
    templateId: {
      type: String,
      default: "default"
    },
    // Soft delete for recovery
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    },
    paymentTerms: {
      type: String,
      default: "Due on Receipt"
    },
    notes: {
      type: String,
      default: ""
    },
    terms: {
      type: String,
      default: ""
    },
    pdfUrl: {
      type: String,
      default: ""
    },
    // Foreign currency support
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "SGD", "AED", "SAR", "QAR", "KWD", "BHD", "OMR"]
    },
    exchangeRate: {
      type: Number,
      default: 1
    },
    baseCurrency: {
      type: String,
      default: "INR"
    }
  },
  { timestamps: true }
);

// Indexes for faster queries
invoiceSchema.index({ userId: 1, invoiceDate: -1 });
invoiceSchema.index({ userId: 1, status: 1 });
invoiceSchema.index({ userId: 1, documentType: 1 });
invoiceSchema.index({ customerId: 1 });
invoiceSchema.index({ isDeleted: 1 });
invoiceSchema.index({ "recurringSettings.nextRunDate": 1 });

module.exports = mongoose.model("Invoice", invoiceSchema);

