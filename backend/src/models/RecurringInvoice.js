const mongoose = require("mongoose");

const recurringInvoiceSchema = new mongoose.Schema(
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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    template: {
      // Invoice template data
      items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        taxRate: { type: Number, default: 0 },
        taxType: { type: String, enum: ["GST", "IGST", "None"], default: "GST" },
        hsn: { type: String, default: "" },
        sac: { type: String, default: "" }
      }],
      discount: { type: Number, default: 0 },
      discountType: { type: String, enum: ["percentage", "fixed"], default: "fixed" },
      notes: { type: String, default: "" },
      terms: { type: String, default: "" }
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
      required: true,
      default: "monthly"
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    nextRunDate: {
      type: Date,
      required: true
    },
    lastRunDate: {
      type: Date,
      default: null
    },
    autoSend: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active"
    },
    generatedInvoices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice"
    }],
    totalGenerated: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

recurringInvoiceSchema.index({ userId: 1, status: 1 });
recurringInvoiceSchema.index({ userId: 1, nextRunDate: 1 });
recurringInvoiceSchema.index({ customerId: 1 });

module.exports = mongoose.model("RecurringInvoice", recurringInvoiceSchema);

