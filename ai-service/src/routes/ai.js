const express = require("express");

const router = express.Router();

router.get("/status", (_req, res) => {
  res.json({
    service: "ai-service",
    features: ["waste-advisor", "food-safety-rag", "matching-agent"],
  });
});

module.exports = router;
