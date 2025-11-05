require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("❌ MONGODB_URI not set"); process.exit(1); }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ Connected:", conn.connection.name, "@", conn.connection.host);
    const db = conn.connection.db;

    const cols = (await db.listCollections().toArray()).map(c => c.name);
    console.log("📦 Collections:", cols);

    const users = await db.collection("users").find().limit(3).project({ email:1, role:1 }).toArray();
    console.log("👤 Example users:", users);

    const orders = await db.collection("orders").find().limit(3).project({ total:1, createdAt:1, refAgentId:1, commissionReferral:1 }).toArray();
    console.log("🛒 Example orders:", orders);

    await mongoose.disconnect();
    console.log("✅ DB Test Done");
    process.exit(0);
  } catch (e) {
    console.error("❌ Mongo Error:", e.message);
    if (e.reason) console.error("reason:", e.reason.message || e.reason);
    process.exit(1);
  }
})();
