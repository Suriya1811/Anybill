const mongoose = require("mongoose");

const loyaltySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true
    },
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    totalRedeemed: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze"
    },
    transactions: [{
      type: {
        type: String,
        enum: ["earned", "redeemed", "expired", "adjusted"],
        required: true
      },
      points: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        default: ""
      },
      invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        default: null
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    settings: {
      pointsPerRupee: {
        type: Number,
        default: 1
      },
      rupeePerPoint: {
        type: Number,
        default: 1
      },
      expiryDays: {
        type: Number,
        default: 365
      }
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

loyaltySchema.index({ userId: 1, customerId: 1 }, { unique: true });
loyaltySchema.index({ userId: 1, points: -1 });

module.exports = mongoose.model("Loyalty", loyaltySchema);

