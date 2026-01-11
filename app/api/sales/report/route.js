// app/api/sales/report/route.js
import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectMongo } from '@/lib/mongoose';
import Sale from '@/models/Sale';
import { verify } from '@/lib/auth/createToken';

export const dynamic = 'force-dynamic';

// Helper function to get user from request
async function getUserFromRequest(req) {
  let token = null;

  try {
    token = req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value || null;
  } catch (err) {
    token = null;
  }

  if (!token && typeof req.headers?.get === 'function') {
    const cookieHeader = req.headers.get('cookie') || '';
    const m = cookieHeader.match(/(?:^|;\s*)(auth_token|token)=([^;]+)/i);
    if (m) {
      token = decodeURIComponent(m[2]);
    }
  }

  if (!token && typeof req.headers?.get === 'function') {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  const payload = verify(token);
  if (!payload || !payload.userId || !payload.role) {
    return null;
  }

  return {
    userId: payload.userId,
    role: payload.role,
  };
}

async function GETHandler(req) {
  try {
    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    if (user.role !== 'admin' && user.role !== 'business_admin') {
      return NextResponse.json(
        {
          ok: false,
          message: 'Forbidden: Admin access required',
        },
        { status: 403 },
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const status = url.searchParams.get('status');
    const agentId = url.searchParams.get('agentId');

    // Build filter object
    const filter = {};

    // Add date range filter if provided
    if (from || to) {
      filter.createdAt = {};

      if (from) {
        filter.createdAt.$gte = new Date(`${from}T00:00:00.000Z`);
      }

      if (to) {
        filter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
      }
    }

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Add agentId filter if provided
    if (agentId) {
      filter.agentId = new ObjectId(agentId);
    }

    await connectMongo();

    // Query sales with filter
    const sales = await Sale.find(filter)
      .populate('productId', 'name sku price')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate aggregates
    const totalSales = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const totalCommission = sales.reduce((sum, sale) => sum + sale.commission, 0);
    const count = sales.length;

    // Return response
    return NextResponse.json({
      ok: true,
      range: { from, to },
      filters: { status, agentId },
      totals: {
        totalSales,
        totalCommission,
        count,
      },
      list: sales,
    });
  } catch (error) {
    console.error('Error generating sales report:', error);
    return NextResponse.json(
      {
        ok: false,
        message: 'Failed to generate report',
      },
      { status: 500 },
    );
  }
}

export const GET = withErrorLogging(GETHandler);
