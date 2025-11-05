// app/api/gamification/goals/[id]/route.js
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import AgentGoal from "@/models/AgentGoal";
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
    
    if (typeof body.targetSalesAmount === "number" && body.targetSalesAmount >= 0) {
      update.targetSalesAmount = body.targetSalesAmount;
    }
    
    if (typeof body.targetDeals === "number" && body.targetDeals >= 0) {
      update.targetDeals = body.targetDeals;
    }
    
    // Handle bonusOnHit updates
    if (body.bonusOnHit) {
      update.bonusOnHit = {};
      
      if (body.bonusOnHit.fixedAmount !== undefined && body.bonusOnHit.fixedAmount >= 0) {
        update.bonusOnHit.fixedAmount = body.bonusOnHit.fixedAmount;
      }
      
      if (body.bonusOnHit.percentBoostPct !== undefined && body.bonusOnHit.percentBoostPct >= 0) {
        update.bonusOnHit.percentBoostPct = body.bonusOnHit.percentBoostPct;
      }
    }
    
    if (typeof body.isActive === "boolean") {
      update.isActive = body.isActive;
    }
    
    await connectMongo();
    
    // Update goal
    const goal = await AgentGoal.findByIdAndUpdate(id, update, { new: true });
    
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
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
    const goal = await AgentGoal.findByIdAndUpdate(id, { isActive: false }, { new: true });
    
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Goal deactivated" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
