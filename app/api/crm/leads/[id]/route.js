import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth/requireAuth';
import { getTenantId } from '@/lib/tenantContext';

// GET /api/crm/leads/[id] - Get single lead
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tenantId = getTenantId(user);
    const { id } = await params;

    const lead = await Lead.findOne({ _id: id, tenantId })
      .populate('assignedTo', 'fullName email phone')
      .populate('agentId', 'fullName')
      .populate('customerId', 'fullName email phone')
      .lean();

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

// PATCH /api/crm/leads/[id] - Update lead
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

    const lead = await Lead.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: body },
      { new: true }
    ).populate('assignedTo', 'fullName email');

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/crm/leads/[id] - Delete lead
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tenantId = getTenantId(user);
    const { id } = await params;

    const lead = await Lead.findOneAndDelete({ _id: id, tenantId });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
