const mongoose = require("mongoose");

/**
 * InvoiceAudit Model
 * Tracks all changes made to invoices for audit trail and compliance
 */
const invoiceAuditSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    actionType: {
      type: String,
      enum: [
        "CREATED",
        "UPDATED",
        "PAYMENT_ADDED",
        "PAYMENT_UPDATED",
        "STATUS_CHANGED",
        "DELETED",
        "RECOVERED",
        "CONVERTED",
        "SHARED",
        "PRINTED"
      ],
      required: true,
      index: true
    },
    changedFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },
    previousValues: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },
    newValues: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },
    paymentDetails: {
      paidAmount: { type: Number, default: 0 },
      previousPaidAmount: { type: Number, default: 0 },
      previousBalance: { type: Number, default: 0 },
      newBalance: { type: Number, default: 0 },
      previousStatus: { type: String, default: "" },
      newStatus: { type: String, default: "" }
    },
    note: {
      type: String,
      default: ""
    },
    ipAddress: {
      type: String,
      default: ""
    },
    userAgent: {
      type: String,
      default: ""
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

// Indexes for efficient querying
invoiceAuditSchema.index({ invoiceId: 1, timestamp: -1 });
invoiceAuditSchema.index({ userId: 1, actionType: 1 });
invoiceAuditSchema.index({ timestamp: -1 });

// Static method to log audit
invoiceAuditSchema.statics.logAction = async function(data) {
  try {
    return await this.create(data);
  } catch (error) {
    console.error("Failed to log audit action:", error);
    // Don't throw error to prevent breaking main operations
    return null;
  }
};

module.exports = mongoose.model("InvoiceAudit", invoiceAuditSchema);
