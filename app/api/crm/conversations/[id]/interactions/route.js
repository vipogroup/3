import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth/requireAuth';
import { getTenantId } from '@/lib/tenantContext';

// POST /api/crm/conversations/[id]/interactions - Add interaction
export async function POST(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tenantId = getTenantId(user);
    const { id } = await params;
    const body = await request.json();

    const conversation = await Conversation.findOne({ _id: id, tenantId });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Add interaction
    const interaction = {
      type: body.type || 'message',
      direction: body.direction || 'outbound',
      content: body.content,
      createdBy: user._id,
      metadata: body.metadata,
      createdAt: new Date(),
    };

    conversation.interactions.push(interaction);
    conversation.lastMessageAt = new Date();
    
    // Update status if needed
    if (conversation.status === 'new') {
      conversation.status = 'open';
    }

    await conversation.save();

    return NextResponse.json({
      success: true,
      interaction: conversation.interactions[conversation.interactions.length - 1],
    });
  } catch (error) {
    console.error('Error adding interaction:', error);
    return NextResponse.json({ error: 'Failed to add interaction' }, { status: 500 });
  }
}
