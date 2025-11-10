const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    console.error("Connection String:", process.env.MONGO_URI?.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"));
    console.error("\n⚠️  Make sure MongoDB is running:");
    console.error("   - For local: mongod service should be active");
    console.error("   - For Atlas: check network access and credentials\n");
    process.exit(1);
  }
};

module.exports = connectDB;
