const { GoogleGenerativeAI } = require("@google/generative-ai");

function getGeminiModel() {
  const apiKey =
    process.env.GEMINI_API_KEY_PRIMARY ||
    process.env.GEMINI_API_KEY_BACKUP;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  });
}

async function generateAIResponse(prompt) {
  const model = getGeminiModel();

  const result = await model.generateContent(prompt);

  return result.response.text();
}

function getGeminiConfig() {
  return {
    primaryKeyPresent: Boolean(process.env.GEMINI_API_KEY_PRIMARY),
    backupKeyPresent: Boolean(process.env.GEMINI_API_KEY_BACKUP),
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  };
}

module.exports = {
  getGeminiModel,
  generateAIResponse,
  getGeminiConfig,
};


