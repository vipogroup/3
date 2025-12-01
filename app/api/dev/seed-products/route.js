import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

import { connectMongo } from "@/lib/mongoose";
import Product from "@/models/Product";

export const runtime = "nodejs";

export async function POST() {
  try {
    await connectMongo();

    const jsonPath = path.join(
      process.cwd(),
      "export_vipo_products_ui",
      "data",
      "products.json"
    );

    const raw = await fs.readFile(jsonPath, "utf-8");
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed?.items) ? parsed.items : [];

    if (!items.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "No items found in products.json",
        },
        { status: 400 }
      );
    }

    const docs = items.map((item, index) => {
      const name = item.name || `Product ${index + 1}`;
      const dimensions = item.dimensions || "";
      const priceRaw = item.price;

      let price = 0;
      if (typeof priceRaw === "number") {
        price = priceRaw;
      } else if (typeof priceRaw === "string") {
        const numericMatch = priceRaw.match(/([0-9]+(?:\.[0-9]+)?)/);
        if (numericMatch) {
          price = Number(numericMatch[1]);
        }
      }

      return {
        name,
        description: dimensions || String(priceRaw || ""),
        fullDescription: dimensions || String(priceRaw || ""),
        category: "Exported",
        price: price,
        originalPrice: null,
        commission: price ? price * 0.1 : 0,
        type: "online",
        purchaseType: "regular",
        inStock: true,
        stockCount: 0,
        image: "",
        imageUrl: "",
        images: [],
        videoUrl: "",
        imagePath: "",
        rating: 0,
        reviews: 0,
        features: [],
        specs: {},
        active: true,
      };
    });

    let created = 0;
    let updated = 0;

    for (const doc of docs) {
      const existing = await Product.findOne({ name: doc.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: doc });
        updated += 1;
      } else {
        await Product.create(doc);
        created += 1;
      }
    }

    const total = await Product.countDocuments();

    return NextResponse.json(
      {
        ok: true,
        message: `Seed completed. Created ${created} products, updated ${updated}. Total in collection: ${total}.`,
        created,
        updated,
        total,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SEED_PRODUCTS_ERROR", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to seed products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
