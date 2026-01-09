import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth/requireAuth';
import { getTenantId } from '@/lib/tenantContext';

// GET /api/crm/conversations - List conversations (Inbox)
export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tenantId = getTenantId(user);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const channel = searchParams.get('channel');
    const assignedTo = searchParams.get('assignedTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query = { tenantId };
    if (status) query.status = status;
    if (channel) query.channel = channel;
    if (assignedTo) query.assignedTo = assignedTo;

    const [conversations, total] = await Promise.all([
      Conversation.find(query)
        .populate('assignedTo', 'fullName email')
        .populate('leadId', 'name phone')
        .populate('customerId', 'fullName phone')
        .sort({ lastMessageAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Conversation.countDocuments(query),
    ]);

    // Get status counts
    const statusCounts = await Conversation.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: statusCounts.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST /api/crm/conversations - Create conversation
export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tenantId = getTenantId(user);
    const body = await request.json();

    const conversation = await Conversation.create({
      ...body,
      tenantId,
      assignedTo: body.assignedTo || user._id,
      lastMessageAt: new Date(),
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
