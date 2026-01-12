'use server';

import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

import dbConnect from '@/lib/dbConnect';
import { requireAdminApi } from '@/lib/auth/server';
import { assertTestHarnessAccess } from '@/lib/testHarness/gate';
import { createAuditLog, AUDIT_EVENTS } from '@/lib/security/auditLog';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/orders/status';

import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Transaction from '@/models/Transaction';

const SEED_TAG = 'test_harness';

function normalizeTenantId(rawTenantId) {
  if (!rawTenantId) return null;
  if (rawTenantId instanceof ObjectId) return rawTenantId;
  if (typeof rawTenantId === 'string' && ObjectId.isValid(rawTenantId)) {
    return new ObjectId(rawTenantId);
  }
  return null;
}

function buildTenantFilter(tenantId) {
  const normalized = normalizeTenantId(tenantId);
  if (normalized) {
    return { tenantId: normalized };
  }
  return { tenantId: null };
}

async function ensureSeedUsers({ tenantId }) {
  const baseFilter = buildTenantFilter(tenantId);
  const normalizedTenant = normalizeTenantId(tenantId);
  const tenantSuffix = normalizedTenant ? `-${normalizedTenant.toString()}` : '';
  const customerEmail = `test-harness-customer@demo${tenantSuffix}.local`;
  const agentEmail = `test-harness-agent@demo${tenantSuffix}.local`;

  const [customer, agent] = await Promise.all([
    User.findOne({ ...baseFilter, email: customerEmail }),
    User.findOne({ ...baseFilter, email: agentEmail }),
  ]);

  if (customer && agent) {
    return { customer, agent };
  }

  const now = new Date();

  const passwordHash = crypto.createHash('sha256').update('test-harness').digest('hex');

  const newCustomer =
    customer ||
    (await User.create({
      ...baseFilter,
      fullName: 'Test Harness Customer',
      email: customerEmail,
      phone: `050${Math.floor(1000000 + Math.random() * 8999999)}`,
      role: 'customer',
      passwordHash,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }));

  const newAgent =
    agent ||
    (await User.create({
      ...baseFilter,
      fullName: 'Test Harness Agent',
      email: agentEmail,
      phone: `051${Math.floor(1000000 + Math.random() * 8999999)}`,
      role: 'agent',
      passwordHash,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }));

  return { customer: newCustomer, agent: newAgent };
}

async function ensureSeedProduct({ tenantId }) {
  const baseFilter = buildTenantFilter(tenantId);
  const productName = 'Test Harness Product';

  let product = await Product.findOne({ ...baseFilter, name: productName });
  if (product) {
    return product;
  }

  product = await Product.create({
    ...baseFilter,
    name: productName,
    description: 'Synthetic product for test harness flows',
    category: 'Test Harness',
    price: 199,
    commission: 20,
    currency: 'ILS',
    type: 'online',
    purchaseType: 'regular',
    active: true,
    stockCount: 999,
    metadata: { seedTag: SEED_TAG },
  });

  return product;
}

async function createSeedOrder({ tenantId, customer, product, agent }) {
  const baseFilter = buildTenantFilter(tenantId);

  const existingOrder = await Order.findOne({
    ...baseFilter,
    refSource: SEED_TAG,
    customerName: customer.fullName,
  });

  if (existingOrder) {
    return existingOrder;
  }

  const now = new Date();
  const order = await Order.create({
    ...baseFilter,
    status: ORDER_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.PENDING,
    items: [
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        currency: product.currency,
      },
    ],
    totalAmount: product.price,
    customerName: customer.fullName,
    customerPhone: customer.phone,
    agentId: agent._id,
    commissionAmount: product.commission,
    refSource: SEED_TAG,
    createdAt: now,
    updatedAt: now,
  });

  return order;
}

async function ensureSeedTransaction({ tenantId, order, customer }) {
  const baseFilter = buildTenantFilter(tenantId);
  const transaction = await Transaction.findOne({
    ...baseFilter,
    'metadata.seedTag': SEED_TAG,
    'metadata.orderId': order._id.toString(),
  });

  if (transaction) {
    return transaction;
  }

  return Transaction.create({
    ...baseFilter,
    userId: customer._id,
    productId: order.items?.[0]?.productId || null,
    amount: order.totalAmount,
    currency: 'ILS',
    status: 'pending',
    type: 'sale',
    metadata: {
      seedTag: SEED_TAG,
      orderId: order._id.toString(),
    },
  });
}

async function POSTHandler(request, _context, { requestId }) {
  const user = await requireAdminApi(request);
  assertTestHarnessAccess({ user, requestId, source: 'api/admin/test-harness' });

  await dbConnect();

  const tenantId = normalizeTenantId(user?.tenantId) || null;

  const { customer, agent } = await ensureSeedUsers({ tenantId });
  const product = await ensureSeedProduct({ tenantId });
  const order = await createSeedOrder({ tenantId, customer, product, agent });
  const transaction = await ensureSeedTransaction({ tenantId, order, customer });

  await createAuditLog({
    type: AUDIT_EVENTS.TEST_SEED_CREATED,
    severity: 'info',
    actor: { type: 'admin', id: user.id, email: user.email },
    target: { type: 'order', id: order._id.toString() },
    details: {
      source: 'api/admin/test-harness',
      requestId,
      tenantId: tenantId ? tenantId.toString() : null,
      seedTag: SEED_TAG,
      orderId: order._id.toString(),
      customerId: customer._id.toString(),
      agentId: agent._id.toString(),
      productId: product._id.toString(),
      transactionId: transaction?._id ? transaction._id.toString() : null,
    },
  });

  return NextResponse.json({
    seedId: `seed_${order._id.toString()}`,
    userIds: {
      customer: customer._id.toString(),
      agent: agent._id.toString(),
    },
    productId: product._id.toString(),
    orderId: order._id.toString(),
    transactionId: transaction?._id ? transaction._id.toString() : null,
  });
}

export const POST = withErrorLogging(POSTHandler);
