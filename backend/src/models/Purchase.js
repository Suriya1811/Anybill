const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({
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

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },
    purchaseNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    supplierDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: Object, default: {} },
      gstin: { type: String, default: "" }
    },
    purchaseDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    items: [purchaseItemSchema],
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
      enum: ["draft", "received", "paid", "partial", "overdue", "cancelled"],
      default: "draft"
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
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

purchaseSchema.index({ userId: 1, purchaseDate: -1 });
purchaseSchema.index({ userId: 1, status: 1 });
purchaseSchema.index({ supplierId: 1 });
purchaseSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("Purchase", purchaseSchema);

