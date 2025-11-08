import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

/**
 * POST /api/agent/link/create
 * Create a unique referral link for an agent
 * Body: { agentId, productId (optional) }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { agentId, productId } = body;

    if (!agentId) {
      return NextResponse.json(
        { ok: false, error: "agentId required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    // Verify agent exists
    const agent = await users.findOne(
      { _id: new ObjectId(agentId), role: "agent" },
      { projection: { _id: 1, fullName: 1, email: 1 } }
    );

    if (!agent) {
      return NextResponse.json(
        { ok: false, error: "agent not found" },
        { status: 404 }
      );
    }

    // Generate referral link
    const baseUrl = process.env.PUBLIC_URL || "http://localhost:3001";
    let refLink = `${baseUrl}/?ref=${agentId}`;

    // If productId provided, add it to the link
    if (productId) {
      refLink = `${baseUrl}/products/${productId}?ref=${agentId}`;
    }

    return NextResponse.json({
      ok: true,
      agentId: String(agent._id),
      agentName: agent.fullName,
      refLink,
      shortCode: String(agent._id).substring(0, 8), // Short code for display
    });
  } catch (error) {
    console.error("AGENT_LINK_CREATE_ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
