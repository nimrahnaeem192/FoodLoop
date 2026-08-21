const express = require("express");
const { getDB } = require("../db");
const { authenticate } = require("../middleware");

const router = express.Router();

const COLLECTION = "matches";

// GET all matches
router.get("/", authenticate, async (_req, res) => {
  try {
    const matches = await getDB()
      .collection(COLLECTION)
      .find({})
      .toArray();

    res.json(matches);
  } catch (error) {
    console.error("[matches] GET error:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// POST match
router.post("/", authenticate, async (req, res) => {
  try {
    const { foodListingId, organizationId, score } = req.body;

    if (!foodListingId || !organizationId) {
      return res.status(400).json({
        error: "foodListingId and organizationId are required"
      });
    }

    const match = {
      foodListingId,
      organizationId,
      score: score !== undefined ? Number(score) : 0,
      status: "suggested",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await getDB()
      .collection(COLLECTION)
      .insertOne(match);

    res.status(201).json({
      ...match,
      _id: result.insertedId
    });
  } catch (error) {
    console.error("[matches] POST error:", error);
    res.status(500).json({ error: "Failed to create match" });
  }
});

// GET match by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid match ID" });
    }

    const match = await getDB()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.json(match);
  } catch (error) {
    console.error("[matches] GET by ID error:", error);
    res.status(500).json({ error: "Failed to fetch match" });
  }
});

module.exports = router;
