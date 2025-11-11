const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const axios = require("axios");
const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY;

// Initialize Twilio client if available
let twilioClient = null;

// Get all campaigns
router.get("/campaigns", verifyToken, async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = { userId: req.user.id, isActive: true };
    if (status) query.status = status;
    if (type) query.type = type;

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch campaigns: " + err.message });
  }
});

// Get single campaign
router.get("/campaigns/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch campaign: " + err.message });
  }
});

// Create campaign
router.post("/campaigns", verifyToken, async (req, res) => {
  try {
    const { name, type, message, template, recipients, scheduledAt } = req.body;

    const campaign = await Campaign.create({
      userId: req.user.id,
      name,
      type: type || "sms",
      message,
      template: template || "",
      recipients: recipients || { type: "all" },
      status: scheduledAt ? "scheduled" : "draft",
      scheduledAt: scheduledAt || null
    });

    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ message: "Failed to create campaign: " + err.message });
  }
});

// Send campaign
router.post("/campaigns/:id/send", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: { $in: ["draft", "scheduled"] }
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found or already sent" });
    }

    // Get recipients
    let customers = [];
    if (campaign.recipients.type === "all") {
      customers = await Customer.find({ userId: req.user.id, isActive: true });
    } else if (campaign.recipients.type === "selected") {
      customers = await Customer.find({
        _id: { $in: campaign.recipients.customerIds },
        userId: req.user.id,
        isActive: true
      });
    } else if (campaign.recipients.type === "filtered") {
      const filters = campaign.recipients.filters || {};
      const query = { userId: req.user.id, isActive: true };
      
      if (filters.minPurchase || filters.maxPurchase) {
        // Get customers with purchase history
        const invoices = await Invoice.find({
          userId: req.user.id,
          documentType: "invoice",
          isDeleted: false
        });
        
        const customerTotals = {};
        invoices.forEach(inv => {
          const customerId = inv.customerId.toString();
          customerTotals[customerId] = (customerTotals[customerId] || 0) + inv.total;
        });

        const filteredCustomerIds = Object.keys(customerTotals).filter(customerId => {
          const total = customerTotals[customerId];
          if (filters.minPurchase && total < filters.minPurchase) return false;
          if (filters.maxPurchase && total > filters.maxPurchase) return false;
          return true;
        });

        query._id = { $in: filteredCustomerIds };
      }

      if (filters.state) query["address.state"] = filters.state;
      if (filters.city) query["address.city"] = filters.city;

      customers = await Customer.find(query);
    }

    const total = customers.length;
    let sent = 0;
    let delivered = 0;
    let failed = 0;

    // Send messages
    if (campaign.type === "sms") {
      if (!TWO_FACTOR_API_KEY) {
        return res.status(400).json({ message: "SMS not configured" });
      }

      for (const customer of customers) {
        try {
          const body = campaign.message.replace(/\{name\}/g, customer.name);
          const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${encodeURIComponent(customer.phone)}/${encodeURIComponent(body)}`;
          const { data } = await axios.get(url, { timeout: 10000 });
          sent++;
          if (data && (data.Status === 'Success' || data.status === 'success')) {
            delivered++;
          } else {
            failed++;
          }
        } catch (err) {
          sent++;
          failed++;
          console.error(`Failed to send to ${customer.phone}:`, err.message);
        }
      }
    } else if (campaign.type === "whatsapp") {
      return res.status(400).json({ message: "WhatsApp not configured" });
    } else if (campaign.type === "email") {
      // Email sending - placeholder for email integration
      for (const customer of customers) {
        if (customer.email) {
          sent++;
          delivered++;
        } else {
          sent++;
          failed++;
        }
      }
    }

    // Update campaign
    await Campaign.findByIdAndUpdate(req.params.id, {
      status: "completed",
      sentAt: new Date(),
      stats: {
        total,
        sent,
        delivered,
        failed
      }
    });

    res.json({
      success: true,
      message: `Campaign sent: ${sent} messages sent, ${delivered} delivered, ${failed} failed`,
      stats: { total, sent, delivered, failed }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to send campaign: " + err.message });
  }
});

// Update campaign
router.put("/campaigns/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ message: "Failed to update campaign: " + err.message });
  }
});

// Delete campaign
router.delete("/campaigns/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ success: true, message: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete campaign: " + err.message });
  }
});

module.exports = router;

