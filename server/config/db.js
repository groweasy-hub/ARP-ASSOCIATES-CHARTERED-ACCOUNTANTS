const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => console.warn("⚠️  MongoDB disconnected — retrying..."));
mongoose.connection.on("reconnected", () => console.log("✅ MongoDB reconnected"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err.message));

module.exports = connectDB;
