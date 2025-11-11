const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "staff", "accountant", "sales"],
      default: "staff",
      required: true
    },
    permissions: {
      // Invoice permissions
      invoices: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: false },
        share: { type: Boolean, default: true }
      },
      // Customer permissions
      customers: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: false }
      },
      // Product permissions
      products: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: false }
      },
      // Inventory permissions
      inventory: {
        view: { type: Boolean, default: true },
        adjust: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
      },
      // Reports permissions
      reports: {
        view: { type: Boolean, default: true },
        export: { type: Boolean, default: false }
      },
      // Settings permissions
      settings: {
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false }
      },
      // Staff management permissions
      staff: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    invitedAt: {
      type: Date,
      default: Date.now
    },
    joinedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Compound index for unique staff per business
staffSchema.index({ businessId: 1, userId: 1 }, { unique: true });
staffSchema.index({ businessId: 1, role: 1 });
staffSchema.index({ businessId: 1, isActive: 1 });

module.exports = mongoose.model("Staff", staffSchema);

