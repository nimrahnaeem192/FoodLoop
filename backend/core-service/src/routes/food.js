const express = require("express");
const { getDB } = require("../db");
const { authenticate } = require("../middleware");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const foods = await getDB().collection("food_listings").find().toArray();
    res.json(foods);
  } catch (error) {
    console.error("[food] GET error:", error);
    res.status(500).json({ error: "Failed to fetch food listings" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, quantity, organizationId } = req.body;

    if (!title || quantity === undefined || !organizationId) {
      return res.status(400).json({
        error: "title, quantity and organizationId are required"
      });
    }

    const now = new Date();

    const food = {
      title,
      description: description || "",
      quantity: Number(quantity),
      organizationId,
      status: "available",
      createdAt: now,
      updatedAt: now
    };

    const result = await getDB().collection("food_listings").insertOne(food);

    res.status(201).json({
      ...food,
      _id: result.insertedId
    });
  } catch (error) {
    console.error("[food] POST error:", error);
    res.status(500).json({ error: "Failed to create food listing" });
  }
});

module.exports = router;
