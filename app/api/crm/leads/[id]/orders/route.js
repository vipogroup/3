import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { getLeadOrders, calculateLeadValue } from '@/lib/crm/orderLeadConnection';

export async function GET(request, { params }) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const [orders, valueStats] = await Promise.all([
      getLeadOrders(id),
      calculateLeadValue(id),
    ]);

    return NextResponse.json({
      orders,
      stats: valueStats,
    });
  } catch (error) {
    console.error('Error fetching lead orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
