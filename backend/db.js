const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryURI = process.env.MONGO_ATLAS_URI || process.env.MONGO_URI;
  const fallbackURI = process.env.MONGO_LOCAL_URI || "mongodb://127.0.0.1:27017/food_ordering_db";

  if (primaryURI) {
    try {
      console.log("Connecting to MongoDB Atlas...");
      const connection = await mongoose.connect(primaryURI, {
        serverSelectionTimeoutMS: 10000, // 10s timeout for Atlas cold-start tolerance
      });
      const host = connection.connection.host || "unknown-host";
      const databaseName = connection.connection.name || "unknown-db";
      console.log(`MongoDB Connected (Atlas): ${host}/${databaseName}`);
      return;
    } catch (error) {
      console.warn(
        `MongoDB Atlas Connection Failed (${error.message}). Attempting fallback to Local MongoDB...`
      );
    }
  }

  if (fallbackURI) {
    try {
      console.log("Connecting to Local MongoDB...");
      const connection = await mongoose.connect(fallbackURI, {
        serverSelectionTimeoutMS: 10000,
      });
      const host = connection.connection.host || "127.0.0.1";
      const databaseName = connection.connection.name || "food_ordering_db";
      console.log(`MongoDB Connected (Local Fallback): ${host}/${databaseName}`);
      return;
    } catch (fallbackError) {
      console.error("Local MongoDB Connection Error:", fallbackError.message);
    }
  }

  console.error("CRITICAL: Failed to connect to both Primary and Fallback MongoDB instances.");
  process.exit(1);
};

module.exports = connectDB;
