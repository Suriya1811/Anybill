const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      required: true
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: ""
    },
    pan: {
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
    bankDetails: {
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      bankName: { type: String, default: "" },
      branchName: { type: String, default: "" }
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      website: { type: String, default: "" }
    },
    logo: {
      type: String,
      default: ""
    },
    invoiceSettings: {
      prefix: { type: String, default: "INV" },
      nextNumber: { type: Number, default: 1 },
      footerText: { type: String, default: "Thank you for your business!" },
      taxIncluded: { type: Boolean, default: false }
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "SGD", "AED", "SAR", "QAR", "KWD", "BHD", "OMR"]
    },
    // Multi-business settings
    branchCode: {
      type: String,
      default: ""
    },
    parentBusinessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null
    },
    isBranch: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

businessSchema.index({ userId: 1, isDefault: 1 });
businessSchema.index({ ownerId: 1, isActive: 1 });
businessSchema.index({ parentBusinessId: 1 });

module.exports = mongoose.model("Business", businessSchema);

