const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
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
    sku: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "Uncategorized"
    },
    hsn: {
      type: String,
      trim: true,
      default: ""
    },
    sac: {
      type: String,
      trim: true,
      default: ""
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    cost: {
      type: Number,
      default: 0,
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
    unit: {
      type: String,
      default: "Piece",
      enum: ["Piece", "Kg", "Liter", "Meter", "Box", "Pack", "Other"]
    },
    stock: {
      quantity: { type: Number, default: 0 },
      lowStockAlert: { type: Number, default: 10 },
      trackInventory: { type: Boolean, default: false }
    },
    // Barcode support
    barcode: {
      type: String,
      trim: true,
      default: "",
      index: true
    },
    barcodeType: {
      type: String,
      enum: ["EAN13", "CODE128", "CODE39", "UPC", "QR"],
      default: "EAN13"
    },
    // Warehouse assignment
    defaultWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    image: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

productSchema.index({ userId: 1, name: 1 });
productSchema.index({ userId: 1, sku: 1 });
productSchema.index({ userId: 1, barcode: 1 });

module.exports = mongoose.model("Product", productSchema);

