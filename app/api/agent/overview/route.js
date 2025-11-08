import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { requireAgent } from "@/app/api/_lib/auth";
import Order from "@/models/Order";
import ReferralClick from "@/models/ReferralClick";
import User from "@/models/User";

export async function GET() {
  const auth = await requireAgent();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await dbConnect();
  const agentId = auth.user.agentId;

  const [clicks, leads, summary] = await Promise.all([
    ReferralClick.countDocuments({ agentId }),
    User.countDocuments({ referredBy: agentId }),
    Order.aggregate([
      { $match: { agentId } },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
            },
          },
          commission: {
            $sum: {
              $cond: [
                { $eq: ["$status", "paid"] },
                { $multiply: ["$amount", 0.1] },
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const totals = summary[0] || { orders: 0, revenue: 0, commission: 0 };

  return NextResponse.json({
    success: true,
    data: {
      clicks,
      leads,
      orders: totals.orders || 0,
      revenue: Number(((totals.revenue || 0)).toFixed(2)),
      commission: Number(((totals.commission || 0)).toFixed(2)),
    },
  });
}
