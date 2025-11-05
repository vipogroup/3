// scripts/migrate-images-to-cloudinary.cjs
// One-off migration: upload local images to Cloudinary and backfill imageUrl

require("dotenv").config({ path: "./app/.env.local" });
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  console.log("\n🔄 Starting image migration to Cloudinary...\n");
  console.log("=".repeat(60));

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not found");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const products = db.collection("products");

    // Find products without imageUrl or with empty imageUrl
    const productsToMigrate = await products
      .find({
        $or: [{ imageUrl: { $exists: false } }, { imageUrl: "" }],
        imagePath: { $exists: true, $ne: "" },
      })
      .toArray();

    console.log(`\n📦 Found ${productsToMigrate.length} products to migrate\n`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const product of productsToMigrate) {
      const localPath = product.imagePath;
      console.log(`\n📸 Processing: ${product.name}`);
      console.log(`   Local path: ${localPath}`);

      // Resolve absolute path
      const absolutePath = path.resolve(process.cwd(), localPath);

      // Check if file exists
      if (!fs.existsSync(absolutePath)) {
        console.log(`   ⚠️  File not found, skipping`);
        skipped++;
        continue;
      }

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(absolutePath, {
          folder: "vipo-products",
          resource_type: "image",
          overwrite: true,
          public_id: `product-${product._id}`,
        });

        // Update product with imageUrl
        await products.updateOne(
          { _id: product._id },
          {
            $set: {
              imageUrl: result.secure_url,
              updatedAt: new Date(),
            },
          }
        );

        console.log(`   ✅ Migrated: ${result.secure_url}`);
        migrated++;
      } catch (err) {
        console.log(`   ❌ Failed: ${err.message}`);
        failed++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("\n📊 Migration Summary:\n");
    console.log(`✅ Migrated: ${migrated}`);
    console.log(`⚠️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📝 Total: ${productsToMigrate.length}`);
    console.log("\n" + "=".repeat(60));
    console.log("\n✅ Migration complete!\n");
  } catch (err) {
    console.error("\n❌ Migration failed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
