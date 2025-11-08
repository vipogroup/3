import { NextResponse } from "next/server";
import { connectDB, getDb } from "@/lib/db";

export async function GET() {
  try {
    const uriSample = (process.env.MONGODB_URI || "").replace(/:\/\/.*@/,'://***@');
    console.log("DBG MONGODB_URI ->", uriSample, " DB:", process.env.MONGODB_DB);
    
    await connectDB();
    const db = await getDb();
    const databaseName = db.databaseName;

    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    let userCount = 0;
    try {
      userCount = await db.collection("users").countDocuments();
    } catch { userCount = 0; }

    console.log("✅ Database connection test successful");

    return NextResponse.json({
      success: true,
      database: databaseName,
      collections: names,
      userCount,
      note: "Debug OK",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
