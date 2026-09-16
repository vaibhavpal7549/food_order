const mongoose = require("mongoose");
const dns = require("dns");

// Configure DNS servers to prevent Windows ISP querySrv ECONNREFUSED issue with Atlas mongodb+srv URIs
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  // Ignore if custom DNS fails to set
}

const connectDB = async () => {
  const mongoURI = process.env.MONGO_ATLAS_URI || process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("CRITICAL: MONGO_ATLAS_URI or MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    const connection = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    const host = connection.connection.host || "unknown-host";
    const databaseName = connection.connection.name || "unknown-db";
    console.log(`MongoDB Connected (Atlas): ${host}/${databaseName}`);
  } catch (error) {
    console.error(`MongoDB Atlas Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
