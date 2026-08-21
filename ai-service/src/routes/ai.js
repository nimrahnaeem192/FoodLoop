const express = require("express");
const { generateAIResponse, getGeminiConfig } = require("../genai/geminiClient");

const router = express.Router();

router.get("/status", (_req, res) => {
  res.json({
    service: "ai-service",
    features: ["waste-advisor", "food-safety-rag", "matching-agent"],
    gemini: getGeminiConfig(),
  });
});

router.post("/advice", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    const prompt = `
You are FoodLoop AI, an assistant focused on food redistribution,
food waste reduction, food safety, and community impact.

Answer the user's question clearly and practically.
Do not invent food-safety regulations or medical advice.

User question:
${question}
`;

    const answer = await generateAIResponse(prompt);

    res.json({
      answer,
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });
  } catch (error) {
    console.error("[ai-service] Gemini error:", error.message);

    res.status(500).json({
      error: "AI service failed",
      message: error.message,
    });
  }
});

module.exports = router;
