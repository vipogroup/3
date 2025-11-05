// app/api/gamification/bonuses/route.js
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import BonusRule from "@/models/BonusRule";
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
    
    // Fetch bonus rules
    const bonusRules = await BonusRule.find(query).sort({ name: 1 }).lean();
    
    return NextResponse.json(bonusRules);
  } catch (error) {
    console.error("Error fetching bonus rules:", error);
    return NextResponse.json({ error: "Failed to fetch bonus rules" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Check if user is admin
    if (!await isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, type, condition, reward, isActive = true } = body;
    
    // Validate required fields
    if (!name?.trim() || !type || !["sale", "monthly"].includes(type)) {
      return NextResponse.json({ error: "Invalid payload: name and type are required" }, { status: 400 });
    }
    
    // Validate condition based on type
    if (type === "sale" && (!condition?.minSaleAmount || condition.minSaleAmount < 0)) {
      return NextResponse.json({ error: "Sale bonus requires valid minSaleAmount" }, { status: 400 });
    }
    
    if (type === "monthly" && (!condition?.everyNthDeal || condition.everyNthDeal < 1)) {
      return NextResponse.json({ error: "Monthly bonus requires valid everyNthDeal" }, { status: 400 });
    }
    
    // Validate reward
    if ((!reward?.fixedAmount && !reward?.percentBoostPct) || 
        (reward.fixedAmount && reward.fixedAmount < 0) || 
        (reward.percentBoostPct && reward.percentBoostPct < 0)) {
      return NextResponse.json({ error: "Invalid reward configuration" }, { status: 400 });
    }
    
    await connectMongo();
    
    // Create new bonus rule
    const bonusRule = await BonusRule.create({
      name: name.trim(),
      type,
      condition,
      reward,
      isActive
    });
    
    return NextResponse.json(bonusRule, { status: 201 });
  } catch (error) {
    console.error("Error creating bonus rule:", error);
    return NextResponse.json({ error: "Failed to create bonus rule" }, { status: 500 });
  }
}
