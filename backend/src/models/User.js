const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    phone: { 
      type: String, 
      required: true, 
      unique: true,
      index: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      required: true,
      enum: [
        "Retail",
        "Wholesale",
        "Manufacturing",
        "Services",
        "E-commerce",
        "Restaurant",
        "Healthcare",
        "Construction",
        "Real Estate",
        "Other"
      ]
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
        },
        message: "Invalid GSTIN format"
      }
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" }
    },
    role: {
      type: String,
      enum: ["owner", "admin", "user", "manager"],
      default: "owner", // First user is owner
    },
    // For multi-business support
    businesses: [{
      businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
      role: { type: String, enum: ["owner", "admin", "manager", "staff"], default: "owner" },
      isActive: { type: Boolean, default: true }
    }],
    // Current active business (for multi-business support)
    activeBusinessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free"
      },
      expiresAt: {
        type: Date,
        default: null
      }
    }
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
