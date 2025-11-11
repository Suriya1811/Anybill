const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    availableQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    // Batch/Serial tracking
    batches: [{
      batchNumber: { type: String, default: "" },
      expiryDate: { type: Date, default: null },
      quantity: { type: Number, default: 0 },
      manufacturingDate: { type: Date, default: null }
    }],
    serialNumbers: [{
      serialNumber: { type: String, required: true },
      status: {
        type: String,
        enum: ["available", "reserved", "sold", "damaged"],
        default: "available"
      }
    }],
    // Low stock alert
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    isLowStock: {
      type: Boolean,
      default: false
    },
    // Last updated
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Compound index for unique product-warehouse combination
inventorySchema.index({ userId: 1, productId: 1, warehouseId: 1 }, { unique: true });
inventorySchema.index({ userId: 1, isLowStock: 1 });
inventorySchema.index({ warehouseId: 1 });

// Virtual for available quantity calculation
inventorySchema.virtual("calculatedAvailable").get(function() {
  return Math.max(0, this.quantity - this.reservedQuantity);
});

// Pre-save hook to update available quantity and low stock status
inventorySchema.pre("save", function(next) {
  this.availableQuantity = Math.max(0, this.quantity - this.reservedQuantity);
  this.isLowStock = this.availableQuantity <= this.lowStockThreshold;
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);

