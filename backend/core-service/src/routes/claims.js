const express = require("express");
const { getDB } = require("../db");
const { authenticate } = require("../middleware");
const { ObjectId } = require("mongodb");

const router = express.Router();

const COLLECTION = "claims";

// GET all claims
router.get("/", authenticate, async (_req, res) => {
  try {
    const claims = await getDB()
      .collection(COLLECTION)
      .find({})
      .toArray();

    res.json(claims);
  } catch (error) {
    console.error("[claims] GET error:", error);
    res.status(500).json({ error: "Failed to fetch claims" });
  }
});

// POST claim
router.post("/", authenticate, async (req, res) => {
  try {
    const { foodListingId, organizationId, quantity } = req.body;
    const requestedQuantity = Number(quantity);

    if (
      !foodListingId ||
      !organizationId ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        error: "foodListingId, organizationId and a valid positive quantity are required"
      });
    }

    const db = getDB();
    const foodCollection = db.collection("food_listings");

    if (!ObjectId.isValid(foodListingId)) {
      return res.status(400).json({
        error: "Invalid food listing ID"
      });
    }

    const food = await foodCollection.findOne({
      _id: new ObjectId(foodListingId)
    });

    if (!food) {
      return res.status(404).json({
        error: "Food listing not found"
      });
    }

    if (food.status !== "available") {
      return res.status(400).json({
        error: "Food listing is no longer available"
      });
    }

    if (requestedQuantity > food.quantity) {
      return res.status(400).json({
        error: `Only ${food.quantity} units are available`
      });
    }

    const now = new Date();

    const claim = {
      foodListingId,
      organizationId,
      quantity: requestedQuantity,
      status: "pending",
      claimedBy: req.user.userId,
      createdAt: now,
      updatedAt: now
    };

    const result = await db
      .collection(COLLECTION)
      .insertOne(claim);

    const remainingQuantity = food.quantity - requestedQuantity;

    await foodCollection.updateOne(
      { _id: new ObjectId(foodListingId) },
      {
        $set: {
          quantity: remainingQuantity,
          status: remainingQuantity === 0 ? "claimed" : "available",
          updatedAt: now
        }
      }
    );

    // Automatically create a suggested match
    await db.collection("matches").insertOne({
      foodListingId,
      organizationId,
      score: 1,
      status: "suggested",
      claimId: result.insertedId,
      createdAt: now,
      updatedAt: now
    });

    res.status(201).json({
      ...claim,
      _id: result.insertedId,
      remainingQuantity
    });

  } catch (error) {
    console.error("[claims] POST error:", error);
    res.status(500).json({ error: "Failed to create claim" });
  }
});

// GET claim by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "Invalid claim ID"
      });
    }

    const claim = await getDB()
      .collection(COLLECTION)
      .findOne({
        _id: new ObjectId(req.params.id)
      });

    if (!claim) {
      return res.status(404).json({
        error: "Claim not found"
      });
    }

    res.json(claim);

  } catch (error) {
    console.error("[claims] GET by ID error:", error);
    res.status(500).json({
      error: "Failed to fetch claim"
    });
  }
});

module.exports = router;
