const express = require("express");
const { getDB } = require("../db");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const db = getDB();

    const [
      foodListings,
      organizations,
      claims,
      matches
    ] = await Promise.all([
      db.collection("food_listings").countDocuments(),
      db.collection("organizations").countDocuments(),
      db.collection("claims").countDocuments(),
      db.collection("matches").countDocuments()
    ]);

    const availableFood = await db.collection("food_listings").countDocuments({
      status: "available"
    });

    const pendingClaims = await db.collection("claims").countDocuments({
      status: "pending"
    });

    res.json({
      foodListings,
      availableFood,
      organizations,
      claims,
      pendingClaims,
      matches
    });
  } catch (error) {
    console.error("[dashboard] GET error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
