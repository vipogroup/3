import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongoose";
import Product from "@/models/Product";

function normalizeIds(ids) {
  if (!Array.isArray(ids)) {
    return { objectIds: [], legacyIds: [] };
  }

  const objectIds = [];
  const legacyIds = [];

  ids.forEach((rawId) => {
    const id = typeof rawId === "string" ? rawId.trim() : String(rawId ?? "");
    if (!id) {
      return;
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      objectIds.push(new mongoose.Types.ObjectId(id));
    } else {
      legacyIds.push(id);
    }
  });

  return { objectIds, legacyIds };
}

export async function POST(request) {
  try {
    await connectMongo();
    const body = await request.json();
    const { ids } = body || {};

    const { objectIds, legacyIds } = normalizeIds(ids);

    if (!objectIds.length && !legacyIds.length) {
      return NextResponse.json(
        { error: "חובה לספק מזהים תקינים למחיקה" },
        { status: 400 }
      );
    }

    const filters = [];
    if (objectIds.length) {
      filters.push({ _id: { $in: objectIds } });
    }
    if (legacyIds.length) {
      filters.push({ legacyId: { $in: legacyIds } });
    }

    const result = await Product.deleteMany(
      filters.length === 1 ? filters[0] : { $or: filters }
    );

    return NextResponse.json({ deletedCount: result.deletedCount ?? 0 });
  } catch (err) {
    console.error("bulk delete products error", err);
    return NextResponse.json(
      { error: "Bulk delete failed", details: err.message },
      { status: 500 }
    );
  }
}
