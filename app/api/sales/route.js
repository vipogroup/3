// app/api/sales/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectMongo } from "@/lib/mongoose";
import Sale from "@/models/Sale";
import LevelRule from "@/models/LevelRule";
import BonusRule from "@/models/BonusRule";
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

export async function GET(req) {
  try {
    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Filter sales based on user role
    let query = {};
    if (user.role === "agent") {
      // Agents can only see their own sales
      query.agentId = new ObjectId(user.userId);
    }
    // Admins can see all sales (no filter)

    const sales = await Sale.find(query)
      .sort({ createdAt: -1 })
      .populate("productId", "name price")
      .lean();

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only agents and admins can create sales
    if (!["agent", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { productId, customerName, customerPhone, salePrice } = body;

    // Validate required fields
    if (!productId || !customerName?.trim() || !customerPhone?.trim() || 
        typeof salePrice !== "number" || Number.isNaN(salePrice) || salePrice <= 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await connectMongo();

    // Base commission rate
    const BASE_COMMISSION_RATE = 0.05;
    
    // Initialize commission metadata
    const commissionMeta = {
      basePct: BASE_COMMISSION_RATE,
      levelBoostPct: 0,
      bonusPercentBoostPct: 0,
      fixedBonus: 0,
      levelName: null,
      appliedBonuses: [],
      goalHitApplied: false
    };
    
    // Get current date and determine month/year for calculations
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();
    
    // Get first and last day of current month for date range
    const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1);
    const lastDayOfMonth = new Date(currentYear, now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Compute agent's month-to-date stats
    const agentSales = await Sale.find({
      agentId: user.userId,
      createdAt: { $gte: firstDayOfMonth, $lte: now }
    }).lean();
    
    // Calculate month-to-date metrics
    const mtdSalesAmount = agentSales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const mtdSalesCount = agentSales.length;
    
    // After this sale metrics
    const newMtdSalesAmount = mtdSalesAmount + salePrice;
    const newMtdSalesCount = mtdSalesCount + 1;
    
    // 1. Determine current level rule
    const levelRules = await LevelRule.find({ isActive: true }).sort({ sortOrder: -1 }).lean();
    
    let appliedLevelRule = null;
    for (const rule of levelRules) {
      // Check if agent qualifies for this level (OR logic)
      if (newMtdSalesAmount >= rule.minSalesAmount || newMtdSalesCount >= rule.minDeals) {
        appliedLevelRule = rule;
        break; // Found highest eligible level
      }
    }
    
    // Apply level boost if eligible
    if (appliedLevelRule) {
      commissionMeta.levelBoostPct = appliedLevelRule.commissionBoostPct;
      commissionMeta.levelName = appliedLevelRule.name;
    }
    
    // 2. Apply sale-based bonus rules
    const saleBonusRules = await BonusRule.find({ 
      type: "sale", 
      isActive: true,
      "condition.minSaleAmount": { $lte: salePrice }
    }).lean();
    
    // Apply all matching sale bonus rules
    for (const rule of saleBonusRules) {
      // Add percentage boost if specified
      if (rule.reward.percentBoostPct) {
        commissionMeta.bonusPercentBoostPct += rule.reward.percentBoostPct;
      }
      
      // Add fixed bonus if specified
      if (rule.reward.fixedAmount) {
        commissionMeta.fixedBonus += rule.reward.fixedAmount;
      }
      
      // Track applied bonus
      commissionMeta.appliedBonuses.push(rule.name);
    }
    
    // 3. Apply monthly streak bonus rules
    const monthlyBonusRules = await BonusRule.find({ 
      type: "monthly", 
      isActive: true 
    }).lean();
    
    // Check for streak bonuses (everyNthDeal)
    for (const rule of monthlyBonusRules) {
      if (rule.condition.everyNthDeal && 
          newMtdSalesCount > 0 && 
          newMtdSalesCount % rule.condition.everyNthDeal === 0) {
        
        // Add percentage boost if specified
        if (rule.reward.percentBoostPct) {
          commissionMeta.bonusPercentBoostPct += rule.reward.percentBoostPct;
        }
        
        // Add fixed bonus if specified
        if (rule.reward.fixedAmount) {
          commissionMeta.fixedBonus += rule.reward.fixedAmount;
        }
        
        // Track applied bonus
        commissionMeta.appliedBonuses.push(rule.name);
      }
    }
    
    // 4. Check if agent goal is hit with this sale
    const agentGoal = await AgentGoal.findOne({ 
      agentId: user.userId,
      month: currentMonth,
      year: currentYear,
      isActive: true
    }).lean();
    
    if (agentGoal) {
      // Check if goal is hit with this sale (both conditions must be met)
      const goalHit = 
        newMtdSalesAmount >= agentGoal.targetSalesAmount && 
        newMtdSalesCount >= agentGoal.targetDeals;
      
      // Check if goal wasn't already hit before this sale
      const goalWasNotHitBefore = 
        mtdSalesAmount < agentGoal.targetSalesAmount || 
        mtdSalesCount < agentGoal.targetDeals;
      
      // Apply goal bonus if goal is hit with this specific sale
      if (goalHit && goalWasNotHitBefore) {
        commissionMeta.goalHitApplied = true;
        
        // Add percentage boost if specified
        if (agentGoal.bonusOnHit.percentBoostPct) {
          commissionMeta.bonusPercentBoostPct += agentGoal.bonusOnHit.percentBoostPct;
        }
        
        // Add fixed bonus if specified
        if (agentGoal.bonusOnHit.fixedAmount) {
          commissionMeta.fixedBonus += agentGoal.bonusOnHit.fixedAmount;
        }
      }
    }
    
    // Calculate final commission
    const effectiveRate = BASE_COMMISSION_RATE + commissionMeta.levelBoostPct + commissionMeta.bonusPercentBoostPct;
    const commission = (salePrice * effectiveRate) + commissionMeta.fixedBonus;
    
    // Create the sale record with commission metadata
    const sale = await Sale.create({
      agentId: user.userId,
      productId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      salePrice,
      commission,
      status: "pending",
      commissionMeta // Store metadata for transparency
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  }
}
