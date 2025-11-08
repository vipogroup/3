import { NextResponse } from "next/server";
import dayjs from "dayjs";
import dbConnect from "@/lib/mongoose";
import { requireAgent } from "@/app/api/_lib/auth";
import ReferralClick from "@/models/ReferralClick";
import Order from "@/models/Order";

function parseRange(searchParams) {
  const range = (searchParams.get("range") || "30d").toLowerCase();
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");

  let start;
  let end;

  if (startStr && endStr) {
    start = dayjs(startStr).startOf("day");
    end = dayjs(endStr).endOf("day");
  } else {
    const now = dayjs();
    if (range === "7d") {
      start = now.subtract(6, "day").startOf("day");
      end = now.endOf("day");
    } else if (range === "90d") {
      start = now.subtract(89, "day").startOf("day");
      end = now.endOf("day");
    } else {
      start = now.subtract(29, "day").startOf("day");
      end = now.endOf("day");
    }
  }

  return { start: start.toDate(), end: end.toDate() };
}

export async function GET(req) {
  const auth = await requireAgent();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const { start, end } = parseRange(searchParams);
  const agentId = auth.user.agentId;

  const [clicks, orders] = await Promise.all([
    ReferralClick.aggregate([
      { $match: { agentId, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { agentId, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "paid"] },
                { $ifNull: ["$totalAmount", "$amount"] },
                0,
              ],
            },
          },
          commission: {
            $sum: {
              $cond: [
                { $eq: ["$status", "paid"] },
                {
                  $multiply: [{ $ifNull: ["$totalAmount", "$amount"] }, 0.1],
                },
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return NextResponse.json({ success: true, data: { clicks, orders } });
}
