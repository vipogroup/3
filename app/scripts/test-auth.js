// scripts/test-auth.js
import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI missing in .env.local");
  process.exit(1);
}

(async () => {
  const out = { dbOk: false, usersCount: 0 };
  const client = new MongoClient(uri, { maxPoolSize: 1 });

  try {
    await client.connect();
    const db = client.db();
    const users = db.collection("users");

    out.usersCount = await users.countDocuments({});
    out.dbOk = true;

    console.log("AUTH TEST ✅", out);
  } catch (err) {
    console.error("AUTH TEST ❌", err.message);
    process.exitCode = 1;
  } finally {
    try { await client.close(); } catch {}
  }
})();
