// scripts/seed-users.js
import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

const users = [
  { email: "admin@vipo.local", phone: "0501234567", role: "admin",  password: "12345678A?" },
  { email: "agent@vipo.local", phone: "0501111111", role: "agent",  password: "12345678A?" },
  { email: "user@vipo.local",  phone: "0502222222", role: "customer",password: "12345678A?" },
];

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(); // ברירת מחדל
  const col = db.collection("users");

  for (const u of users) {
    const exists = await col.findOne({ $or: [{ email: u.email }, { phone: u.phone }] });
    if (exists) {
      console.log("Exists:", u.email || u.phone);
      continue;
    }
    const doc = { ...u, password: await bcrypt.hash(u.password, 10), createdAt: new Date() };
    await col.insertOne(doc);
    console.log("Inserted:", u.email);
  }

  await client.close();
  process.exit(0);
})();
