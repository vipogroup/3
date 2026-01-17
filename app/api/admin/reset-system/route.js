import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Order from '@/models/Order';
import Sale from '@/models/Sale';
import Transaction from '@/models/Transaction';
import WithdrawalRequest from '@/models/WithdrawalRequest';
import Notification from '@/models/Notification';
import ReferralLog from '@/models/ReferralLog';
import Tenant from '@/models/Tenant';

export const dynamic = 'force-dynamic';

const PROTECTED_EMAIL = 'm0587009938@gmail.com';

export async function POST(request) {
  try {
    await dbConnect();
    
    const results = {
      users: 0,
      orders: 0,
      sales: 0,
      transactions: 0,
      withdrawals: 0,
      notifications: 0,
      referrals: 0,
      tenants: 0,
    };

    // Delete all orders
    const ordersResult = await Order.deleteMany({});
    results.orders = ordersResult.deletedCount || 0;

    // Delete all sales (commissions)
    const salesResult = await Sale.deleteMany({});
    results.sales = salesResult.deletedCount || 0;

    // Delete all transactions
    const transactionsResult = await Transaction.deleteMany({});
    results.transactions = transactionsResult.deletedCount || 0;

    // Delete all withdrawals
    const withdrawalsResult = await WithdrawalRequest.deleteMany({});
    results.withdrawals = withdrawalsResult.deletedCount || 0;

    // Delete all notifications
    const notificationsResult = await Notification.deleteMany({});
    results.notifications = notificationsResult.deletedCount || 0;

    // Delete all referral logs
    const referralsResult = await ReferralLog.deleteMany({});
    results.referrals = referralsResult.deletedCount || 0;

    // Delete all tenants
    const tenantsResult = await Tenant.deleteMany({});
    results.tenants = tenantsResult.deletedCount || 0;

    // Delete all users EXCEPT the main admin
    const usersResult = await User.deleteMany({ 
      email: { $ne: PROTECTED_EMAIL } 
    });
    results.users = usersResult.deletedCount || 0;

    return NextResponse.json({ 
      ok: true, 
      message: 'System reset complete',
      results,
      protectedAdmin: PROTECTED_EMAIL
    });
  } catch (error) {
    console.error('Reset system error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
