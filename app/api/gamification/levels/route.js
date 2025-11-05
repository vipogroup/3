// app/api/gamification/levels/route.js
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

export async function GET(req) {
  try {
    // Check if user is admin
    if (!await isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    await connectMongo();
    
    // Check if we should include inactive rules
    const url = new URL(req.url);
    const includeAll = url.searchParams.get("all") === "1";
    
    // Build query
    const query = includeAll ? {} : { isActive: true };
    
    // Fetch level rules
    const levelRules = await LevelRule.find(query).sort({ sortOrder: 1 }).lean();
    
    return NextResponse.json(levelRules);
  } catch (error) {
    console.error("Error fetching level rules:", error);
    return NextResponse.json({ error: "Failed to fetch level rules" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Check if user is admin
    if (!await isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, minSalesAmount, minDeals, commissionBoostPct, badgeColor, sortOrder, isActive = true } = body;
    
    // Validate required fields
    if (!name?.trim() || 
        typeof minSalesAmount !== "number" || minSalesAmount < 0 ||
        typeof minDeals !== "number" || minDeals < 0 ||
        typeof commissionBoostPct !== "number" || commissionBoostPct < 0 ||
        !badgeColor || !["bronze", "silver", "gold", "platinum"].includes(badgeColor) ||
        typeof sortOrder !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    
    await connectMongo();
    
    // Create new level rule
    const levelRule = await LevelRule.create({
      name: name.trim(),
      minSalesAmount,
      minDeals,
      commissionBoostPct,
      badgeColor,
      sortOrder,
      isActive
    });
    
    return NextResponse.json(levelRule, { status: 201 });
  } catch (error) {
    console.error("Error creating level rule:", error);
    return NextResponse.json({ error: "Failed to create level rule" }, { status: 500 });
  }
}
