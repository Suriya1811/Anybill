const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["sms", "whatsapp", "email"],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    template: {
      type: String,
      default: ""
    },
    recipients: {
      type: {
        type: String,
        enum: ["all", "selected", "filtered"],
        default: "all"
      },
      customerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
      }],
      filters: {
        minPurchase: { type: Number, default: 0 },
        maxPurchase: { type: Number, default: null },
        lastPurchaseDays: { type: Number, default: null },
        state: { type: String, default: "" },
        city: { type: String, default: "" }
      }
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "completed", "cancelled"],
      default: "draft"
    },
    scheduledAt: {
      type: Date,
      default: null
    },
    sentAt: {
      type: Date,
      default: null
    },
    stats: {
      total: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      failed: { type: Number, default: 0 }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ userId: 1, scheduledAt: 1 });

module.exports = mongoose.model("Campaign", campaignSchema);

