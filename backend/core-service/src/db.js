const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();

  db = client.db("foodloop");

  console.log("[core-service] MongoDB connected");
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected");
  }

  return db;
}

module.exports = {
  connectDB,
  getDB,
};