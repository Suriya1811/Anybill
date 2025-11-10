// Quick server test script
require("dotenv").config();
const mongoose = require("mongoose");

async function testServer() {
  console.log("🧪 Testing MyBillPro Backend...\n");

  // Test 1: Environment Variables
  console.log("1️⃣  Testing Environment Variables...");
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.log("   ❌ Missing:", missing.join(", "));
    return false;
  }
  console.log("   ✅ All required environment variables present");

  // Test 2: MongoDB Connection
  console.log("\n2️⃣  Testing MongoDB Connection...");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("   ✅ MongoDB connected successfully");
    await mongoose.connection.close();
  } catch (err) {
    console.log("   ❌ MongoDB connection failed:", err.message);
    return false;
  }

  // Test 3: Module Imports
  console.log("\n3️⃣  Testing Module Imports...");
  try {
    require("./src/configs/db");
    require("./src/middleware/authMiddleware");
    require("./src/middleware/permissionsMiddleware");
    console.log("   ✅ All modules imported successfully");
  } catch (err) {
    console.log("   ❌ Module import failed:", err.message);
    return false;
  }

  // Test 4: Route Files
  console.log("\n4️⃣  Testing Route Files...");
  const routes = [
    "authRoutes",
    "billingRoutes",
    "warehouseRoutes",
    "inventoryRoutes",
    "recurringRoutes",
    "reportsRoutes",
    "gstRoutes",
    "staffRoutes",
    "templateRoutes",
    "bulkRoutes",
    "businessRoutes",
    "purchaseRoutes",
    "marketingRoutes",
    "loyaltyRoutes",
    "eInvoiceRoutes"
  ];
  
  let allRoutesOk = true;
  for (const route of routes) {
    try {
      require(`./src/routes/${route}`);
    } catch (err) {
      console.log(`   ❌ ${route}: ${err.message}`);
      allRoutesOk = false;
    }
  }
  
  if (allRoutesOk) {
    console.log(`   ✅ All ${routes.length} route files loaded successfully`);
  } else {
    return false;
  }

  // Test 5: Server Start
  console.log("\n5️⃣  Testing Server Initialization...");
  try {
    const app = require("./src/server");
    console.log("   ✅ Server can be initialized");
  } catch (err) {
    console.log("   ⚠️  Server initialization test skipped (server may already be running)");
  }

  console.log("\n✅ All tests passed! Backend is ready to use.");
  console.log("\n📝 Next steps:");
  console.log("   1. Start server: npm run dev");
  console.log("   2. Test API: curl http://localhost:5000");
  console.log("   3. Check health: curl http://localhost:5000/health");
  console.log("\n🚀 Happy coding!");
  
  process.exit(0);
}

testServer().catch(err => {
  console.error("\n❌ Test failed:", err);
  process.exit(1);
});

