import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth/requireAuth';
import { getTenantId } from '@/lib/tenantContext';

// GET /api/crm/conversations/[id] - Get single conversation
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tenantId = getTenantId(user);
    const { id } = await params;

    const conversation = await Conversation.findOne({ _id: id, tenantId })
      .populate('assignedTo', 'fullName email phone')
      .populate('leadId', 'name phone email status')
      .populate('customerId', 'fullName phone email')
      .populate('interactions.createdBy', 'fullName')
      .lean();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

// PATCH /api/crm/conversations/[id] - Update conversation
export async function PATCH(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tenantId = getTenantId(user);
    const { id } = await params;
    const body = await request.json();

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: body },
      { new: true }
    ).populate('assignedTo', 'fullName email');

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}
