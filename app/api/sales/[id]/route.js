// app/api/sales/[id]/route.js
import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectMongo } from '@/lib/mongoose';
import Sale from '@/models/Sale';
import { verify } from '@/lib/auth/createToken';
import { connectToDB } from '@/lib/mongoose';
import { sendWhatsAppMessage } from '@/lib/notifications/sendWhatsApp';

export const dynamic = 'force-dynamic';

// Phone helpers
function normPhone(p) {
  if (!p || typeof p !== 'string') return '';
  return p.replace(/[^\d]/g, '').replace(/^0+/, '');
}

function sameStatus(prev, next) {
  return String(prev || '').trim() === String(next || '').trim();
}

// Helper function to get user from request
async function getUserFromRequest(req) {
  const token = req.cookies.get('token')?.value || '';
  const payload = verify(token);
  if (!payload || !payload.userId || !payload.role) {
    return null;
  }
  return {
    userId: payload.userId,
    role: payload.role,
  };
}

async function GETHandler(req, { params }) {
  try {
    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();

    // Find the sale by ID
    const sale = await Sale.findById(params.id).populate('productId', 'name price').lean();

    if (!sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    // Check if user has permission to view this sale
    if (user.role === 'agent' && sale.agentId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
  }
}

async function PUTHandler(req, { params }) {
  const { id } = params;

  // Basic id validation
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid sale id' }, { status: 400 });
  }

  try {
    await connectToDB();

    const body = await req.json().catch(() => ({}));
    const nextStatus = (body?.status || '').trim();
    if (!nextStatus) {
      return NextResponse.json({ error: "Missing 'status' in body" }, { status: 400 });
    }

    // Load current sale to compare status
    const sale = await Sale.findById(id).lean();
    if (!sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    const prevStatus = (sale.status || '').trim();

    // Anti-spam: no change, no notifications
    if (sameStatus(prevStatus, nextStatus)) {
      return NextResponse.json({ ok: true, unchanged: true, status: nextStatus }, { status: 200 });
    }

    // Apply the status update
    await Sale.findByIdAndUpdate(id, { $set: { status: nextStatus } }, { new: false });

    // Prepare phones and names
    const agentPhone = normPhone(sale?.agentPhone) || normPhone(sale?.agent?.phone);
    const customerPhone = normPhone(sale?.customerPhone) || normPhone(sale?.customer?.phone);
    const customerName = sale?.customerName || sale?.customer?.name || 'לקוח';

    // Notify agent on any status change
    if (agentPhone) {
      try {
        await sendWhatsAppMessage(
          agentPhone,
          `מנהל עדכן סטטוס מכירה של ${customerName} ל: ${nextStatus}`,
        );
      } catch {}
    }

    // Notify customer on completed
    if (nextStatus === 'completed' && customerPhone) {
      try {
        await sendWhatsAppMessage(
          customerPhone,
          `שלום ${customerName}, ההזמנה שלך הושלמה. תודה שבחרת VIPO.`,
        );
      } catch {}
    }

    return NextResponse.json({ ok: true, from: prevStatus, to: nextStatus }, { status: 200 });
  } catch (err) {
    console.error('PUT /api/sales/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 });
  }
}

async function DELETEHandler(req, { params }) {
  try {
    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete sales
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectMongo();

    // Delete the sale
    const result = await Sale.findByIdAndDelete(params.id);

    if (!result) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
export const PUT = withErrorLogging(PUTHandler);
export const DELETE = withErrorLogging(DELETEHandler);
