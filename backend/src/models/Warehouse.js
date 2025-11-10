const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
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
    code: {
      type: String,
      trim: true,
      default: ""
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" }
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      managerName: { type: String, default: "" }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

warehouseSchema.index({ userId: 1, name: 1 });
warehouseSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("Warehouse", warehouseSchema);

