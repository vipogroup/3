import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE() {
  try {
    console.log("🗑️ Deleting all users from MongoDB...");
    
    const db = await getDb();
    const users = db.collection("users");
    
    // Count before deletion
    const countBefore = await users.countDocuments();
    
    // Delete all users
    const result = await users.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} users`);
    
    return NextResponse.json({
      success: true,
      message: `✅ Successfully deleted all users`,
      deletedCount: result.deletedCount,
      countBefore,
    });
  } catch (error) {
    console.error("❌ Delete users error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "❌ Failed to delete users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
