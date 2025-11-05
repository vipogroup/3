// app/api/gamification/levels/[id]/route.js
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import LevelRule from "@/models/LevelRule";
import { verify } from "@/lib/auth/createToken";

export const dynamic = "force-dynamic";

// Helper function to get user from request
async function getUserFromRequest(req) {
  const token = req.cookies.get("token")?.value || "";
  const payload = verify(token);
  if (!payload || !payload.userId || !payload.role) {
    return null;
  }
  return {
    userId: payload.userId,
    role: payload.role
  };
}

// Check if user is admin
async function isAdmin(req) {
  const user = await getUserFromRequest(req);
  return user && user.role === "admin";
}

export async function PUT(req, { params }) {
  try {
    // Check if user is admin
    if (!await isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    
    // Build update object with only provided fields
    const update = {};
    
    if (typeof body.name === "string") update.name = body.name.trim();
    if (typeof body.minSalesAmount === "number" && body.minSalesAmount >= 0) update.minSalesAmount = body.minSalesAmount;
    if (typeof body.minDeals === "number" && body.minDeals >= 0) update.minDeals = body.minDeals;
    if (typeof body.commissionBoostPct === "number" && body.commissionBoostPct >= 0) update.commissionBoostPct = body.commissionBoostPct;
    if (body.badgeColor && ["bronze", "silver", "gold", "platinum"].includes(body.badgeColor)) update.badgeColor = body.badgeColor;
    if (typeof body.sortOrder === "number") update.sortOrder = body.sortOrder;
    if (typeof body.isActive === "boolean") update.isActive = body.isActive;
    
    await connectMongo();
    
    // Update level rule
    const levelRule = await LevelRule.findByIdAndUpdate(id, update, { new: true });
    
    if (!levelRule) {
      return NextResponse.json({ error: "Level rule not found" }, { status: 404 });
    }
    
    return NextResponse.json(levelRule);
  } catch (error) {
    console.error("Error updating level rule:", error);
    return NextResponse.json({ error: "Failed to update level rule" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // Check if user is admin
    if (!await isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = params;
    
    await connectMongo();
    
    // Soft delete by setting isActive to false
    const levelRule = await LevelRule.findByIdAndUpdate(id, { isActive: false }, { new: true });
    
    if (!levelRule) {
      return NextResponse.json({ error: "Level rule not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Level rule deactivated" });
  } catch (error) {
    console.error("Error deleting level rule:", error);
    return NextResponse.json({ error: "Failed to delete level rule" }, { status: 500 });
  }
}
