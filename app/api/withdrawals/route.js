import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth/server";

/**
 * POST /api/withdrawals
 * Create a new withdrawal request
 */
export async function POST(req) {
  try {
    // Get current user
    const user = await getUserFromCookies();
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, notes } = body;

    // Validation
    if (!amount || typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const withdrawals = db.collection("withdrawalRequests");

    // Get user's current balance
    const userData = await users.findOne(
      { _id: user.id },
      { projection: { commissionBalance: 1 } }
    );

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const balance = userData.commissionBalance || 0;

    // Check if user has enough balance
    if (amount > balance) {
      return NextResponse.json({ 
        error: "Insufficient balance",
        balance,
        requested: amount
      }, { status: 400 });
    }

    // Create withdrawal request
    const doc = {
      userId: user.id,
      amount,
      notes: notes || '',
      status: 'pending',
      adminNotes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await withdrawals.insertOne(doc);

    console.log("WITHDRAWAL_REQUESTED", {
      userId: String(user.id),
      amount,
      requestId: String(result.insertedId)
    });

    return NextResponse.json({
      ok: true,
      requestId: String(result.insertedId),
      amount,
      status: 'pending'
    }, { status: 201 });

  } catch (err) {
    console.error("WITHDRAWAL_REQUEST_ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * GET /api/withdrawals
 * Get user's withdrawal requests
 */
export async function GET() {
  try {
    const user = await getUserFromCookies();
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const withdrawals = db.collection("withdrawalRequests");

    const requests = await withdrawals
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      ok: true,
      requests: requests.map(r => ({
        _id: String(r._id),
        amount: r.amount,
        status: r.status,
        notes: r.notes,
        adminNotes: r.adminNotes,
        createdAt: r.createdAt,
        processedAt: r.processedAt
      }))
    });

  } catch (err) {
    console.error("WITHDRAWAL_LIST_ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
