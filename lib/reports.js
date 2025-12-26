import { getDb } from '@/lib/db';
import mongoose from 'mongoose';

export async function getAdminOverview({ from, to }) {
  const db = await getDb();
  const Users = db.collection('users');
  const Orders = db.collection('orders');

  const timeFilter =
    from || to
      ? {
          createdAt: {
            ...(from ? { $gte: new Date(from) } : {}),
            ...(to ? { $lte: new Date(to) } : {}),
          },
        }
      : {};

  const [newCustomers, ordersAgg] = await Promise.all([
    Users.countDocuments({ role: 'customer', ...timeFilter }),
    Orders.aggregate([
      { $match: { status: { $in: ['paid', 'completed'] }, ...timeFilter } },
      {
        $group: {
          _id: null,
          ordersCount: { $sum: 1 },
          gmv: { $sum: '$totalAmount' },
          commissions: { $sum: { $multiply: ['$totalAmount', 0.1] } },
        },
      },
    ]).toArray(),
  ]);

  const o = ordersAgg[0] || { ordersCount: 0, gmv: 0, commissions: 0 };

  const activeAgents = await Users.countDocuments({ role: 'agent', isActive: true });

  return {
    newCustomers,
    activeAgents,
    ordersCount: o.ordersCount,
    gmv: o.gmv,
    commissions: o.commissions,
  };
}

export async function getByProduct({ from, to }) {
  const db = await getDb();
  const Orders = db.collection('orders');
  const timeFilter =
    from || to
      ? {
          createdAt: {
            ...(from ? { $gte: new Date(from) } : {}),
            ...(to ? { $lte: new Date(to) } : {}),
          },
        }
      : {};
  return Orders.aggregate([
    { $match: { status: { $in: ['paid', 'completed'] }, ...timeFilter } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        productName: { $last: '$items.name' },
        qty: { $sum: '$items.qty' },
        revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
      },
    },
    { $sort: { revenue: -1 } },
  ]).toArray();
}

export async function getByAgent({ from, to }) {
  const db = await getDb();
  const Orders = db.collection('orders');
  const timeFilter =
    from || to
      ? {
          createdAt: {
            ...(from ? { $gte: new Date(from) } : {}),
            ...(to ? { $lte: new Date(to) } : {}),
          },
        }
      : {};
  return Orders.aggregate([
    { $match: { status: { $in: ['paid', 'completed'] }, ...timeFilter } },
    {
      $group: {
        _id: '$agentId',
        orders: { $sum: 1 },
        gmv: { $sum: '$totalAmount' },
        commissions: { $sum: { $multiply: ['$totalAmount', 0.1] } },
      },
    },
    { $sort: { gmv: -1 } },
  ]).toArray();
}
