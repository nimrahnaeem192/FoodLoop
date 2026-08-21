const express = require("express");
const { getDB } = require("../db");
const { authenticate } = require("../middleware");

const router = express.Router();

const COLLECTION = "organizations";

// GET all organizations
router.get("/", async (_req, res) => {
  try {
    const organizations = await getDB()
      .collection(COLLECTION)
      .find({})
      .toArray();

    res.json(organizations);
  } catch (error) {
    console.error("[organizations] GET error:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
});

// POST organization - authenticated
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, type, address, contactEmail } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: "name and type are required"
      });
    }

    const now = new Date();

    const organization = {
      name,
      type,
      address: address || "",
      contactEmail: contactEmail || "",
      createdAt: now,
      updatedAt: now
    };

    const result = await getDB()
      .collection(COLLECTION)
      .insertOne(organization);

    res.status(201).json({
      ...organization,
      _id: result.insertedId
    });
  } catch (error) {
    console.error("[organizations] POST error:", error);
    res.status(500).json({ error: "Failed to create organization" });
  }
});

// GET organization by ID
router.get("/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid organization ID" });
    }

    const organization = await getDB()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    console.error("[organizations] GET by ID error:", error);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
});

module.exports = router;
