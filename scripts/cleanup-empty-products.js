import mongoose from "mongoose";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config({ path: ".env.local" });

const ProductModule = require("../models/Product");
const Product = ProductModule?.default || ProductModule;

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/800x600?text=Product";
const dryRun = process.argv.includes("--dry-run");

function buildFilter() {
  return {
    $or: [
      { image: { $exists: false } },
      { imageUrl: { $exists: false } },
      { images: { $exists: false } },
      { image: { $in: [null, "", DEFAULT_IMAGE_URL] } },
      { imageUrl: { $in: [null, "", DEFAULT_IMAGE_URL] } },
      { images: { $size: 0 } },
    ],
  };
}

async function ensureConnection() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "vipo",
      serverSelectionTimeoutMS: 30000,
    });
  }
}

async function main() {
  await ensureConnection();

  const filter = buildFilter();
  const candidates = await Product.find(filter)
    .select("_id name image imageUrl images")
    .lean();

  console.log(`🔍 Found ${candidates.length} products without valid images.`);

  if (candidates.length === 0) {
    await mongoose.connection.close();
    return;
  }

  const sample = candidates.slice(0, 5);
  console.log("🔎 Sample:");
  sample.forEach((product) => {
    console.log(
      ` - ${product.name || product._id}: image=${product.image || "<none>"}`
    );
  });

  if (dryRun) {
    console.log("🧪 Dry run mode – no deletions performed.");
    await mongoose.connection.close();
    return;
  }

  const ids = candidates.map((product) => product._id);
  const result = await Product.deleteMany({ _id: { $in: ids } });
  console.log(`🗑️ Deleted ${result.deletedCount} products without images.`);

  await mongoose.connection.close();
}

main().catch(async (error) => {
  console.error("❌ Cleanup failed:", error);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
