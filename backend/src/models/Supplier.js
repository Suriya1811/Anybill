const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
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
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: ""
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" }
    },
    billingAddress: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" }
    },
    balance: {
      type: Number,
      default: 0
    },
    creditLimit: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Compound index for user and supplier uniqueness
supplierSchema.index({ userId: 1, phone: 1 });

module.exports = mongoose.model("Supplier", supplierSchema);

