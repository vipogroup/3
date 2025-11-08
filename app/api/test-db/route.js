import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    console.log("🔄 Testing database connection...");
    
    const db = await getDb();
    
    // Check if we're using Mock DB
    const isMockDb = !db.listCollections;
    
    let result;
    
    if (isMockDb) {
      // Using Mock DB
      const users = db.collection("users");
      const userCount = await users.countDocuments();
      
      result = {
        success: true,
        message: "⚠️ Using Mock DB (MongoDB unavailable)",
        database: "Mock DB (In-Memory)",
        dbType: "mock",
        userCount,
        note: "MongoDB Atlas connection failed. Using temporary in-memory database.",
        timestamp: new Date().toISOString(),
      };
    } else {
      // Using Real MongoDB
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      let userCount = 0;
      if (collectionNames.includes("users")) {
        userCount = await db.collection("users").countDocuments();
      }
      
      result = {
        success: true,
        message: "✅ MongoDB connected successfully!",
        database: db.databaseName,
        dbType: "mongodb",
        collections: collectionNames,
        userCount,
        timestamp: new Date().toISOString(),
      };
    }
    
    console.log("✅ Database test successful:", result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Database test failed:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "❌ Database connection failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
