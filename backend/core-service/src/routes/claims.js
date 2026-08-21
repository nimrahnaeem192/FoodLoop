const express = require("express");
const { getDB } = require("../db");
const { authenticate } = require("../middleware");

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

    if (!foodListingId || !organizationId || quantity === undefined) {
      return res.status(400).json({
        error: "foodListingId, organizationId and quantity are required"
      });
    }

    const claim = {
      foodListingId,
      organizationId,
      quantity: Number(quantity),
      status: "pending",
      claimedBy: req.user.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await getDB()
      .collection(COLLECTION)
      .insertOne(claim);

    res.status(201).json({
      ...claim,
      _id: result.insertedId
    });
  } catch (error) {
    console.error("[claims] POST error:", error);
    res.status(500).json({ error: "Failed to create claim" });
  }
});

// GET claim by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid claim ID" });
    }

    const claim = await getDB()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    res.json(claim);
  } catch (error) {
    console.error("[claims] GET by ID error:", error);
    res.status(500).json({ error: "Failed to fetch claim" });
  }
});

module.exports = router;
