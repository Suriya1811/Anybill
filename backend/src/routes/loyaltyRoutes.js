const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Loyalty = require("../models/Loyalty");
const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");

// Get all loyalty programs
router.get("/loyalty", verifyToken, async (req, res) => {
  try {
    const { customerId } = req.query;
    const query = { userId: req.user.id };
    if (customerId) query.customerId = customerId;

    const loyalty = await Loyalty.find(query)
      .populate("customerId", "name phone email")
      .sort({ points: -1 });

    res.json({ success: true, loyalty });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loyalty programs: " + err.message });
  }
});

// Get single loyalty program
router.get("/loyalty/:id", verifyToken, async (req, res) => {
  try {
    const loyalty = await Loyalty.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate("customerId");

    if (!loyalty) {
      return res.status(404).json({ message: "Loyalty program not found" });
    }

    res.json({ success: true, loyalty });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loyalty program: " + err.message });
  }
});

// Get customer loyalty
router.get("/loyalty/customer/:customerId", verifyToken, async (req, res) => {
  try {
    let loyalty = await Loyalty.findOne({
      userId: req.user.id,
      customerId: req.params.customerId
    }).populate("customerId");

    // Create if doesn't exist
    if (!loyalty) {
      loyalty = await Loyalty.create({
        userId: req.user.id,
        customerId: req.params.customerId,
        points: 0,
        settings: {
          pointsPerRupee: 1,
          rupeePerPoint: 1,
          expiryDays: 365
        }
      });
      await loyalty.populate("customerId");
    }

    res.json({ success: true, loyalty });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer loyalty: " + err.message });
  }
});

// Earn points (usually called after invoice payment)
router.post("/loyalty/earn", verifyToken, async (req, res) => {
  try {
    const { customerId, invoiceId, amount, points } = req.body;

    let loyalty = await Loyalty.findOne({
      userId: req.user.id,
      customerId
    });

    if (!loyalty) {
      loyalty = await Loyalty.create({
        userId: req.user.id,
        customerId,
        points: 0,
        settings: {
          pointsPerRupee: 1,
          rupeePerPoint: 1,
          expiryDays: 365
        }
      });
    }

    // Calculate points if not provided
    const earnedPoints = points || Math.floor(amount * loyalty.settings.pointsPerRupee);

    // Update loyalty
    loyalty.points += earnedPoints;
    loyalty.totalEarned += earnedPoints;
    loyalty.transactions.push({
      type: "earned",
      points: earnedPoints,
      description: `Earned ${earnedPoints} points for purchase`,
      invoiceId: invoiceId || null
    });

    // Update tier based on points
    if (loyalty.points >= 10000) {
      loyalty.tier = "platinum";
    } else if (loyalty.points >= 5000) {
      loyalty.tier = "gold";
    } else if (loyalty.points >= 2000) {
      loyalty.tier = "silver";
    } else {
      loyalty.tier = "bronze";
    }

    loyalty.lastUpdated = new Date();
    await loyalty.save();

    res.json({ success: true, loyalty, message: `${earnedPoints} points earned` });
  } catch (err) {
    res.status(500).json({ message: "Failed to earn points: " + err.message });
  }
});

// Redeem points
router.post("/loyalty/redeem", verifyToken, async (req, res) => {
  try {
    const { customerId, points, description } = req.body;

    const loyalty = await Loyalty.findOne({
      userId: req.user.id,
      customerId
    });

    if (!loyalty) {
      return res.status(404).json({ message: "Loyalty program not found" });
    }

    if (loyalty.points < points) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    // Calculate discount amount
    const discountAmount = points * loyalty.settings.rupeePerPoint;

    // Update loyalty
    loyalty.points -= points;
    loyalty.totalRedeemed += points;
    loyalty.transactions.push({
      type: "redeemed",
      points: -points,
      description: description || `Redeemed ${points} points for ₹${discountAmount} discount`
    });

    loyalty.lastUpdated = new Date();
    await loyalty.save();

    res.json({
      success: true,
      loyalty,
      discountAmount,
      message: `${points} points redeemed for ₹${discountAmount} discount`
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to redeem points: " + err.message });
  }
});

// Adjust points (manual adjustment)
router.post("/loyalty/adjust", verifyToken, async (req, res) => {
  try {
    const { customerId, points, description } = req.body;

    let loyalty = await Loyalty.findOne({
      userId: req.user.id,
      customerId
    });

    if (!loyalty) {
      loyalty = await Loyalty.create({
        userId: req.user.id,
        customerId,
        points: 0,
        settings: {
          pointsPerRupee: 1,
          rupeePerPoint: 1,
          expiryDays: 365
        }
      });
    }

    const oldPoints = loyalty.points;
    loyalty.points += points;
    loyalty.transactions.push({
      type: "adjusted",
      points,
      description: description || `Points adjusted: ${oldPoints} → ${loyalty.points}`
    });

    loyalty.lastUpdated = new Date();
    await loyalty.save();

    res.json({ success: true, loyalty, message: "Points adjusted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to adjust points: " + err.message });
  }
});

// Update loyalty settings
router.put("/loyalty/:id/settings", verifyToken, async (req, res) => {
  try {
    const { settings } = req.body;

    const loyalty = await Loyalty.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { settings },
      { new: true }
    );

    if (!loyalty) {
      return res.status(404).json({ message: "Loyalty program not found" });
    }

    res.json({ success: true, loyalty, message: "Settings updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings: " + err.message });
  }
});

module.exports = router;

