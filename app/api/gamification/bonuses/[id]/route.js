// app/api/gamification/bonuses/[id]/route.js
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
    if (body.type && ["sale", "monthly"].includes(body.type)) update.type = body.type;
    
    // Handle condition updates
    if (body.condition) {
      update.condition = {};
      
      if (body.type === "sale" || body.condition.minSaleAmount !== undefined) {
        if (body.condition.minSaleAmount >= 0) {
          update.condition.minSaleAmount = body.condition.minSaleAmount;
        }
      }
      
      if (body.type === "monthly" || body.condition.everyNthDeal !== undefined) {
        if (body.condition.everyNthDeal >= 1) {
          update.condition.everyNthDeal = body.condition.everyNthDeal;
        }
      }
    }
    
    // Handle reward updates
    if (body.reward) {
      update.reward = {};
      
      if (body.reward.fixedAmount !== undefined && body.reward.fixedAmount >= 0) {
        update.reward.fixedAmount = body.reward.fixedAmount;
      }
      
      if (body.reward.percentBoostPct !== undefined && body.reward.percentBoostPct >= 0) {
        update.reward.percentBoostPct = body.reward.percentBoostPct;
      }
    }
    
    if (typeof body.isActive === "boolean") update.isActive = body.isActive;
    
    await connectMongo();
    
    // Update bonus rule
    const bonusRule = await BonusRule.findByIdAndUpdate(id, update, { new: true });
    
    if (!bonusRule) {
      return NextResponse.json({ error: "Bonus rule not found" }, { status: 404 });
    }
    
    return NextResponse.json(bonusRule);
  } catch (error) {
    console.error("Error updating bonus rule:", error);
    return NextResponse.json({ error: "Failed to update bonus rule" }, { status: 500 });
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
    const bonusRule = await BonusRule.findByIdAndUpdate(id, { isActive: false }, { new: true });
    
    if (!bonusRule) {
      return NextResponse.json({ error: "Bonus rule not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Bonus rule deactivated" });
  } catch (error) {
    console.error("Error deleting bonus rule:", error);
    return NextResponse.json({ error: "Failed to delete bonus rule" }, { status: 500 });
  }
}
