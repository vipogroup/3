// lib/mongoose.js
import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export async function connectMongo() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("❌ Missing MONGODB_URI");

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || "vipo",
        maxPoolSize: 10,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Alias to maintain compatibility with code expecting connectToDB
export async function connectToDB() {
  return connectMongo();
}

const dbConnect = connectMongo;
export default dbConnect;
