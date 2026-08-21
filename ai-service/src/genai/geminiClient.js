function getGeminiConfig() {
  return {
    primaryKeyPresent: Boolean(process.env.GEMINI_API_KEY_PRIMARY),
    backupKeyPresent: Boolean(process.env.GEMINI_API_KEY_BACKUP),
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  };
}

module.exports = { getGeminiConfig };
