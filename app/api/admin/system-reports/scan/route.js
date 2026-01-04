export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';
import { ObjectId } from 'mongodb';

// Safe imports with fallbacks
let isPriorityConfigured = () => false;
let getPayPlusConfig = () => ({ isConfigured: false });

try {
  const priorityModule = require('@/lib/priority/client.js');
  if (priorityModule.isPriorityConfigured) isPriorityConfigured = priorityModule.isPriorityConfigured;
} catch (e) { console.log('Priority module not available'); }

try {
  const payplusModule = require('@/lib/payplus/config.js');
  if (payplusModule.getPayPlusConfig) getPayPlusConfig = payplusModule.getPayPlusConfig;
} catch (e) { console.log('PayPlus module not available'); }

// All scannable areas
const SCAN_AREAS = [
  'database', 'users', 'orders', 'products', 'transactions',
  'permissions', 'integrations', 'security', 'payment_data', 'system_keys'
];

// Report types that can be generated
const REPORT_TYPES = [
  'financial_payments',      // Financial & Payments Report
  'orders_transactions',     // Orders & Transactions Report
  'users_permissions',       // Users & Permissions Report
  'admin_audit_trail',       // Admin Actions / Audit Trail
  'integrations_webhooks',   // Integrations & Webhooks Report
  'data_integrity',          // Data Integrity & Consistency Report
  'security_access',         // Security & Access Report
  'system_health',           // System Health & Stability Report
];

/**
 * POST /api/admin/system-reports/scan
 * Run a full system scan
 */
export async function POST(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { scope = 'full', areas = SCAN_AREAS, generateReports = true } = body;

    const db = await getDb();
    const scansCol = db.collection('systemscans');
    const reportsCol = db.collection('systemreports');
    const auditCol = db.collection('auditlogs');

    const now = new Date();
    const scanId = generateScanId();

    // Create scan record
    const scan = {
      scanId,
      initiatedBy: new ObjectId(admin.id),
      initiatedByName: admin.fullName || admin.email || 'Admin',
      scope,
      scannedAreas: areas,
      status: 'running',
      progress: { current: 0, total: areas.length + REPORT_TYPES.length, percentage: 0 },
      startedAt: now,
      results: { totalChecks: 0, passed: 0, failed: 0, warnings: 0, score: 0 },
      findings: {},
      generatedReports: [],
      version: '2.0',
      environment: process.env.NODE_ENV || 'development',
      createdAt: now,
      updatedAt: now,
    };

    await scansCol.insertOne(scan);

    // Log audit event
    await logAudit(auditCol, 'scan_started', admin, { scanId, scope, areas });

    // Run the scan with error handling for each area
    const findings = {};
    let totalChecks = 0, passed = 0, failed = 0, warnings = 0;
    let progressCurrent = 0;

    const safeRun = async (name, fn) => {
      try {
        const result = await fn();
        findings[name] = result;
        totalChecks += result.checks || 0;
        passed += result.passed || 0;
        failed += result.failed || 0;
        warnings += result.warnings || 0;
        progressCurrent++;
        return result;
      } catch (e) {
        console.error(`Scan ${name} failed:`, e.message);
        findings[name] = { checks: 1, passed: 0, failed: 1, warnings: 0, error: e.message };
        totalChecks++; failed++;
        return null;
      }
    };

    // Run all scans with error handling
    if (areas.includes('database')) await safeRun('database', () => scanDatabase(db));
    if (areas.includes('users')) await safeRun('users', () => scanUsers(db));
    if (areas.includes('orders')) await safeRun('orders', () => scanOrders(db));
    if (areas.includes('products')) await safeRun('products', () => scanProducts(db));
    if (areas.includes('transactions')) await safeRun('transactions', () => scanTransactions(db));
    if (areas.includes('permissions')) await safeRun('permissions', () => scanPermissions(db));
    if (areas.includes('integrations')) await safeRun('integrations', () => scanIntegrations());
    if (areas.includes('security')) await safeRun('security', () => scanSecurity());
    if (areas.includes('payment_data')) await safeRun('payment_data', () => scanPaymentData(db));

    // 10. System keys scan (sanitized)
    if (areas.includes('system_keys')) await safeRun('system_keys', () => scanSystemKeys());

    // Calculate score
    const score = totalChecks > 0 ? Math.round((passed / totalChecks) * 100) : 0;

    // Generate reports if requested
    const generatedReports = [];
    if (generateReports) {
      for (const reportType of REPORT_TYPES) {
        try {
          const report = await generateReport(reportType, findings, admin, scanId, db);
          const result = await reportsCol.insertOne(report);
          generatedReports.push({
            reportId: result.insertedId,
            reportType,
            generatedAt: new Date(),
          });
          progressCurrent++;
        } catch (err) {
          console.error(`Failed to generate ${reportType}:`, err);
        }
      }
    }

    // Update scan record
    const completedAt = new Date();
    await scansCol.updateOne(
      { scanId },
      {
        $set: {
          status: 'completed',
          completedAt,
          duration: completedAt - now,
          progress: { current: progressCurrent, total: scan.progress.total, percentage: 100 },
          results: { totalChecks, passed, failed, warnings, score },
          findings,
          generatedReports,
          updatedAt: completedAt,
        },
      }
    );

    // Log completion
    await logAudit(auditCol, 'scan_completed', admin, { scanId, score, reportsGenerated: generatedReports.length });

    // Get env vars analysis for response
    const envAnalysis = findings.system_keys?.missingVars || [];
    const scoreBreakdown = findings.system_keys?.scoreBreakdown || {};

    return NextResponse.json({
      ok: true,
      scanId,
      status: 'completed',
      results: { totalChecks, passed, failed, warnings, score },
      reportsGenerated: generatedReports.length,
      duration: completedAt - now,
      envAnalysis: {
        missingVars: envAnalysis,
        scoreBreakdown,
        configured: findings.system_keys?.details?.filter(d => d.status === 'configured') || [],
      },
    });

  } catch (err) {
    console.error('SYSTEM_SCAN_ERROR:', err);
    return NextResponse.json({ error: 'Scan failed', details: err.message }, { status: 500 });
  }
}

/**
 * GET /api/admin/system-reports/scan
 * Get scan history
 */
export async function GET(req) {
  try {
    const admin = await requireAdminApi(req);
    const { searchParams } = new URL(req.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const status = searchParams.get('status');

    const db = await getDb();
    const scansCol = db.collection('systemscans');

    const query = {};
    if (status) query.status = status;

    const [scans, total] = await Promise.all([
      scansCol.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .project({ findings: 0 }) // Exclude large findings object
        .toArray(),
      scansCol.countDocuments(query),
    ]);

    return NextResponse.json({
      ok: true,
      scans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });

  } catch (err) {
    console.error('GET_SCANS_ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Helper functions

function generateScanId() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `SCAN-${ts}-${rand}`.toUpperCase();
}

async function logAudit(col, action, admin, details) {
  try {
    await col.insertOne({
      action,
      category: 'system_reports',
      actorId: new ObjectId(admin.id),
      actorName: admin.fullName || admin.email,
      details,
      ip: '',
      createdAt: new Date(),
    });
  } catch (e) {
    console.error('Audit log failed:', e);
  }
}

// Scan functions (read-only)

async function scanDatabase(db) {
  const checks = 5;
  let passed = 0, failed = 0, warnings = 0;
  const details = [];

  // Check collections exist
  const collections = await db.listCollections().toArray();
  const colNames = collections.map(c => c.name);
  const required = ['users', 'orders', 'products'];
  
  for (const col of required) {
    if (colNames.includes(col)) {
      passed++;
      details.push({ check: `Collection ${col}`, status: 'ok' });
    } else {
      failed++;
      details.push({ check: `Collection ${col}`, status: 'missing' });
    }
  }

  // Check DB stats
  try {
    const stats = await db.stats();
    details.push({ check: 'DB Stats', status: 'ok', data: { collections: stats.collections, objects: stats.objects } });
    passed++;
  } catch (e) {
    failed++;
  }

  // Check indexes
  try {
    const userIndexes = await db.collection('users').indexes();
    if (userIndexes.length > 1) passed++; else warnings++;
    details.push({ check: 'User indexes', count: userIndexes.length });
  } catch (e) {
    warnings++;
  }

  return { checks, passed, failed, warnings, details };
}

async function scanUsers(db) {
  const usersCol = db.collection('users');
  const totalUsers = await usersCol.countDocuments();
  const admins = await usersCol.countDocuments({ role: 'admin' });
  const agents = await usersCol.countDocuments({ role: 'agent' });
  const customers = await usersCol.countDocuments({ role: { $in: ['customer', null] } });
  const noRole = await usersCol.countDocuments({ role: { $exists: false } });

  let passed = 3, failed = 0, warnings = 0;
  if (admins === 0) { failed++; passed--; }
  if (noRole > 0) { warnings++; }

  return {
    checks: 4,
    passed,
    failed,
    warnings,
    details: { totalUsers, admins, agents, customers, noRole },
  };
}

async function scanOrders(db) {
  const ordersCol = db.collection('orders');
  const total = await ordersCol.countDocuments();
  const paid = await ordersCol.countDocuments({ status: 'paid' });
  const pending = await ordersCol.countDocuments({ status: 'pending' });
  const completed = await ordersCol.countDocuments({ status: 'completed' });
  const cancelled = await ordersCol.countDocuments({ status: 'cancelled' });

  // Check for orphaned orders (no user)
  const orphaned = await ordersCol.countDocuments({ userId: { $exists: false } });

  let passed = 3, failed = 0, warnings = 0;
  if (orphaned > 0) { warnings++; }

  return {
    checks: 4,
    passed,
    failed,
    warnings,
    details: { total, paid, pending, completed, cancelled, orphaned },
  };
}

async function scanProducts(db) {
  const productsCol = db.collection('products');
  const total = await productsCol.countDocuments();
  const active = await productsCol.countDocuments({ status: 'active' });
  const outOfStock = await productsCol.countDocuments({ stock: { $lte: 0 } });
  const noPrice = await productsCol.countDocuments({ price: { $exists: false } });

  let passed = 2, failed = 0, warnings = 0;
  if (noPrice > 0) { warnings++; }
  if (outOfStock > 10) { warnings++; }

  return {
    checks: 3,
    passed,
    failed,
    warnings,
    details: { total, active, outOfStock, noPrice },
  };
}

async function scanTransactions(db) {
  const txCol = db.collection('transactions');
  const total = await txCol.countDocuments();
  const completed = await txCol.countDocuments({ status: 'completed' });
  const pending = await txCol.countDocuments({ status: 'pending' });
  const failed = await txCol.countDocuments({ status: 'failed' });

  return {
    checks: 2,
    passed: 2,
    failed: 0,
    warnings: failed > 10 ? 1 : 0,
    details: { total, completed, pending, failed },
  };
}

async function scanPermissions(db) {
  const usersCol = db.collection('users');
  const admins = await usersCol.find({ role: 'admin' }).project({ email: 1, permissions: 1, fullName: 1 }).toArray();
  
  let passed = 1, failed = 0, warnings = 0;
  if (admins.length === 0) { failed++; passed--; }
  if (admins.length > 10) { warnings++; }

  return {
    checks: 2,
    passed,
    failed,
    warnings,
    details: { adminCount: admins.length, admins: admins.map(a => ({ name: a.fullName || a.email, hasPermissions: !!a.permissions })) },
  };
}

async function scanIntegrations() {
  let priorityConfigured = false;
  let payplusConfigured = false;
  
  try {
    priorityConfigured = isPriorityConfigured();
  } catch (e) { console.log('Priority check failed:', e.message); }
  
  try {
    const payplusConfig = getPayPlusConfig();
    payplusConfigured = payplusConfig?.isConfigured || false;
  } catch (e) { console.log('PayPlus check failed:', e.message); }

  let passed = 0, failed = 0, warnings = 0;
  if (priorityConfigured) passed++; else warnings++;
  if (payplusConfigured) passed++; else warnings++;

  return {
    checks: 2,
    passed,
    failed,
    warnings,
    details: {
      priority: { configured: priorityConfigured, status: priorityConfigured ? 'active' : 'not_configured' },
      payplus: { configured: payplusConfigured, status: payplusConfigured ? 'active' : 'not_configured' },
    },
  };
}

async function scanSecurity() {
  const checks = [];
  let passed = 0, failed = 0, warnings = 0;

  // Check critical env vars (without exposing values)
  const criticalVars = ['JWT_SECRET', 'MONGODB_URI', 'NEXTAUTH_SECRET'];
  for (const v of criticalVars) {
    if (process.env[v] && process.env[v].length >= 10) {
      passed++;
      checks.push({ var: v, status: 'set', strength: process.env[v].length >= 32 ? 'strong' : 'weak' });
    } else {
      failed++;
      checks.push({ var: v, status: 'missing_or_weak' });
    }
  }

  // Check production mode
  if (process.env.NODE_ENV === 'production') {
    passed++;
    checks.push({ var: 'NODE_ENV', status: 'production' });
  } else {
    warnings++;
    checks.push({ var: 'NODE_ENV', status: process.env.NODE_ENV || 'not_set' });
  }

  return {
    checks: criticalVars.length + 1,
    passed,
    failed,
    warnings,
    details: checks,
  };
}

async function scanPaymentData(db) {
  const ordersCol = db.collection('orders');
  const eventsCol = db.collection('paymentevents');

  const ordersWithPayment = await ordersCol.countDocuments({ paymentMethod: { $exists: true } });
  const paymentEvents = await eventsCol.countDocuments();
  const failedPayments = await eventsCol.countDocuments({ status: 'failed' });

  let passed = 2, failed = 0, warnings = 0;
  if (failedPayments > 10) warnings++;

  return {
    checks: 3,
    passed,
    failed,
    warnings,
    details: { ordersWithPayment, paymentEvents, failedPayments },
  };
}

async function scanSystemKeys() {
  // Define all env vars with weights (percentage contribution to score)
  const envVarsConfig = [
    { key: 'JWT_SECRET', weight: 10, category: 'security', priority: 'critical', description: 'מפתח הצפנת JWT לאימות משתמשים' },
    { key: 'NEXTAUTH_SECRET', weight: 8, category: 'security', priority: 'critical', description: 'מפתח NextAuth לאבטחת סשנים' },
    { key: 'MONGODB_URI', weight: 10, category: 'database', priority: 'critical', description: 'כתובת חיבור למסד הנתונים' },
    { key: 'PAYPLUS_API_KEY', weight: 6, category: 'payments', priority: 'high', description: 'מפתח API של PayPlus לתשלומים' },
    { key: 'PAYPLUS_SECRET', weight: 6, category: 'payments', priority: 'high', description: 'סוד PayPlus לאימות בקשות' },
    { key: 'PAYPLUS_WEBHOOK_SECRET', weight: 4, category: 'payments', priority: 'medium', description: 'מפתח וובהוק PayPlus' },
    { key: 'PRIORITY_CLIENT_ID', weight: 5, category: 'integrations', priority: 'high', description: 'מזהה לקוח Priority ERP' },
    { key: 'PRIORITY_CLIENT_SECRET', weight: 5, category: 'integrations', priority: 'high', description: 'סוד Priority ERP' },
    { key: 'TWILIO_ACCOUNT_SID', weight: 3, category: 'communications', priority: 'medium', description: 'מזהה חשבון Twilio ל-SMS' },
    { key: 'TWILIO_AUTH_TOKEN', weight: 3, category: 'communications', priority: 'medium', description: 'טוקן Twilio לאימות' },
    { key: 'NEXT_PUBLIC_SITE_URL', weight: 2, category: 'config', priority: 'low', description: 'כתובת URL של האתר' },
    { key: 'NODE_ENV', weight: 3, category: 'config', priority: 'medium', description: 'סביבת ריצה (production/development)' },
  ];

  const results = [];
  const missingVars = [];
  let passed = 0, failed = 0, warnings = 0;
  let totalWeight = envVarsConfig.reduce((sum, v) => sum + v.weight, 0);
  let earnedWeight = 0;

  for (const varConfig of envVarsConfig) {
    const exists = !!process.env[varConfig.key];
    const value = process.env[varConfig.key];
    const length = value?.length || 0;
    
    const varResult = {
      key: varConfig.key,
      status: exists ? 'configured' : 'missing',
      weight: varConfig.weight,
      category: varConfig.category,
      priority: varConfig.priority,
      description: varConfig.description,
      potentialGain: exists ? 0 : varConfig.weight,
    };

    if (exists) {
      passed++;
      earnedWeight += varConfig.weight;
      varResult.strength = length >= 32 ? 'strong' : length >= 16 ? 'medium' : 'weak';
    } else {
      missingVars.push({
        key: varConfig.key,
        weight: varConfig.weight,
        percentageGain: Math.round((varConfig.weight / totalWeight) * 100),
        category: varConfig.category,
        priority: varConfig.priority,
        description: varConfig.description,
      });
      
      if (varConfig.priority === 'critical') {
        failed++;
      } else {
        warnings++;
      }
    }

    results.push(varResult);
  }

  const currentScore = Math.round((earnedWeight / totalWeight) * 100);
  const potentialScore = 100;

  return {
    checks: envVarsConfig.length,
    passed,
    failed,
    warnings,
    details: results,
    missingVars,
    scoreBreakdown: {
      current: currentScore,
      potential: potentialScore,
      earnedWeight,
      totalWeight,
      missingWeight: totalWeight - earnedWeight,
    },
  };
}

// Report generation

async function generateReport(reportType, findings, admin, scanId, db) {
  const now = new Date();
  const reportId = `RPT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();

  const reportGenerators = {
    financial_payments: () => generateFinancialReport(findings, db),
    orders_transactions: () => generateOrdersReport(findings, db),
    users_permissions: () => generateUsersReport(findings, db),
    admin_audit_trail: () => generateAuditTrailReport(db),
    integrations_webhooks: () => generateIntegrationsReport(findings),
    data_integrity: () => generateDataIntegrityReport(findings),
    security_access: () => generateSecurityReport(findings),
    system_health: () => generateHealthReport(findings),
  };

  const generator = reportGenerators[reportType];
  if (!generator) throw new Error(`Unknown report type: ${reportType}`);

  const { title, content, summary, tags, stats } = await generator();

  return {
    reportId,
    scanId,
    title,
    type: mapReportType(reportType),
    category: reportType,
    summary,
    content,
    contentHtml: '',
    tags,
    version: '2.0',
    status: 'published',
    stats: stats || { totalChecks: 0, passed: 0, failed: 0, warnings: 0, score: 0 },
    dataSource: 'system_scan',
    createdBy: new ObjectId(admin.id),
    createdByName: admin.fullName || admin.email || 'Admin',
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
}

function mapReportType(reportType) {
  const map = {
    financial_payments: 'audit',
    orders_transactions: 'audit',
    users_permissions: 'security',
    admin_audit_trail: 'audit',
    integrations_webhooks: 'integration',
    data_integrity: 'performance',
    security_access: 'security',
    system_health: 'performance',
  };
  return map[reportType] || 'custom';
}

async function generateFinancialReport(findings, db) {
  const ordersCol = db.collection('orders');
  const txCol = db.collection('transactions');
  const withdrawalsCol = db.collection('withdrawalrequests');

  const totalRevenue = await ordersCol.aggregate([
    { $match: { status: { $in: ['paid', 'completed'] } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]).toArray();

  const pendingWithdrawals = await withdrawalsCol.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).toArray();

  const content = `# 💰 Financial & Payments Report

**Generated:** ${new Date().toISOString()}

## Revenue Summary
- Total Revenue: ₪${(totalRevenue[0]?.total || 0).toLocaleString()}
- Payment Events: ${findings.payment_data?.details?.paymentEvents || 0}
- Failed Payments: ${findings.payment_data?.details?.failedPayments || 0}

## Withdrawals
- Pending Amount: ₪${(pendingWithdrawals[0]?.total || 0).toLocaleString()}

## Payment Methods
- Orders with payment: ${findings.payment_data?.details?.ordersWithPayment || 0}
`;

  return {
    title: 'Financial & Payments Report',
    content,
    summary: `Revenue: ₪${(totalRevenue[0]?.total || 0).toLocaleString()}`,
    tags: ['financial', 'payments', 'revenue'],
    stats: findings.payment_data,
  };
}

async function generateOrdersReport(findings, db) {
  const o = findings.orders?.details || {};
  const content = `# 🛒 Orders & Transactions Report

**Generated:** ${new Date().toISOString()}

## Orders Summary
| Status | Count |
|--------|-------|
| Total | ${o.total || 0} |
| Paid | ${o.paid || 0} |
| Pending | ${o.pending || 0} |
| Completed | ${o.completed || 0} |
| Cancelled | ${o.cancelled || 0} |

## Data Quality
- Orphaned Orders: ${o.orphaned || 0}

## Transactions
- Total: ${findings.transactions?.details?.total || 0}
- Completed: ${findings.transactions?.details?.completed || 0}
- Failed: ${findings.transactions?.details?.failed || 0}
`;

  return {
    title: 'Orders & Transactions Report',
    content,
    summary: `${o.total || 0} orders, ${o.paid || 0} paid`,
    tags: ['orders', 'transactions'],
    stats: findings.orders,
  };
}

async function generateUsersReport(findings, db) {
  const u = findings.users?.details || {};
  const p = findings.permissions?.details || {};
  
  const content = `# 👥 Users & Permissions Report

**Generated:** ${new Date().toISOString()}

## User Statistics
| Role | Count |
|------|-------|
| Total | ${u.totalUsers || 0} |
| Admins | ${u.admins || 0} |
| Agents | ${u.agents || 0} |
| Customers | ${u.customers || 0} |

## Data Quality
- Users without role: ${u.noRole || 0}

## Admin Permissions
${(p.admins || []).map(a => `- ${a.name}: ${a.hasPermissions ? '✅' : '⚠️'}`).join('\n') || 'No admins found'}
`;

  return {
    title: 'Users & Permissions Report',
    content,
    summary: `${u.totalUsers || 0} users, ${u.admins || 0} admins`,
    tags: ['users', 'permissions', 'roles'],
    stats: findings.users,
  };
}

async function generateAuditTrailReport(db) {
  const auditCol = db.collection('auditlogs');
  const recentLogs = await auditCol.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  const content = `# 📋 Admin Actions & Audit Trail

**Generated:** ${new Date().toISOString()}

## Recent Actions
${recentLogs.map(l => `| ${new Date(l.createdAt).toLocaleString('he-IL')} | ${l.actorName || 'System'} | ${l.action} |`).join('\n') || 'No audit logs found'}

## Summary
- Total logged actions: ${recentLogs.length}
`;

  return {
    title: 'Admin Actions & Audit Trail',
    content,
    summary: `${recentLogs.length} recent actions`,
    tags: ['audit', 'admin', 'trail'],
  };
}

async function generateIntegrationsReport(findings) {
  const i = findings.integrations?.details || {};
  
  const content = `# 🔗 Integrations & Webhooks Report

**Generated:** ${new Date().toISOString()}

## Integration Status
| Integration | Status | Configured |
|-------------|--------|------------|
| Priority ERP | ${i.priority?.status || 'unknown'} | ${i.priority?.configured ? '✅' : '❌'} |
| PayPlus | ${i.payplus?.status || 'unknown'} | ${i.payplus?.configured ? '✅' : '❌'} |

## Recommendations
${!i.priority?.configured ? '- Configure Priority ERP for full ERP sync\n' : ''}
${!i.payplus?.configured ? '- Configure PayPlus for payment processing\n' : ''}
${i.priority?.configured && i.payplus?.configured ? '✅ All integrations configured' : ''}
`;

  return {
    title: 'Integrations & Webhooks Report',
    content,
    summary: `Priority: ${i.priority?.configured ? '✅' : '❌'} | PayPlus: ${i.payplus?.configured ? '✅' : '❌'}`,
    tags: ['integrations', 'webhooks', 'priority', 'payplus'],
    stats: findings.integrations,
  };
}

async function generateDataIntegrityReport(findings) {
  const orphanedOrders = findings.orders?.details?.orphaned || 0;
  const noRoleUsers = findings.users?.details?.noRole || 0;
  const noPriceProducts = findings.products?.details?.noPrice || 0;

  const issues = [];
  if (orphanedOrders > 0) issues.push(`${orphanedOrders} orphaned orders`);
  if (noRoleUsers > 0) issues.push(`${noRoleUsers} users without role`);
  if (noPriceProducts > 0) issues.push(`${noPriceProducts} products without price`);

  const content = `# 🔍 Data Integrity & Consistency Report

**Generated:** ${new Date().toISOString()}

## Integrity Checks
| Check | Status | Issues |
|-------|--------|--------|
| Orphaned Orders | ${orphanedOrders === 0 ? '✅' : '⚠️'} | ${orphanedOrders} |
| Users without Role | ${noRoleUsers === 0 ? '✅' : '⚠️'} | ${noRoleUsers} |
| Products without Price | ${noPriceProducts === 0 ? '✅' : '⚠️'} | ${noPriceProducts} |

## Summary
${issues.length === 0 ? '✅ No data integrity issues found' : `⚠️ Found ${issues.length} issues:\n${issues.map(i => `- ${i}`).join('\n')}`}
`;

  return {
    title: 'Data Integrity & Consistency Report',
    content,
    summary: issues.length === 0 ? 'No issues' : `${issues.length} issues found`,
    tags: ['integrity', 'consistency', 'data'],
  };
}

async function generateSecurityReport(findings) {
  const s = findings.security?.details || [];
  const k = findings.system_keys?.details || [];

  const content = `# 🔒 Security & Access Report

**Generated:** ${new Date().toISOString()}

## Environment Security
${s.map(c => `| ${c.var} | ${c.status === 'set' || c.status === 'production' ? '✅' : '❌'} | ${c.strength || c.status} |`).join('\n')}

## System Keys Status
| Key | Status |
|-----|--------|
${k.map(key => `| ${key.key} | ${key.status === 'configured' ? '✅' : '⚠️'} |`).join('\n')}

## Score
- Security checks passed: ${findings.security?.passed || 0}/${findings.security?.checks || 0}
`;

  return {
    title: 'Security & Access Report',
    content,
    summary: `${findings.security?.passed || 0}/${findings.security?.checks || 0} checks passed`,
    tags: ['security', 'access', 'environment'],
    stats: findings.security,
  };
}

async function generateHealthReport(findings) {
  const db = findings.database || {};
  const mem = process.memoryUsage();
  const heapMB = Math.round(mem.heapUsed / 1024 / 1024);
  const uptimeH = Math.floor(process.uptime() / 3600);

  const totalChecks = Object.values(findings).reduce((sum, f) => sum + (f.checks || 0), 0);
  const totalPassed = Object.values(findings).reduce((sum, f) => sum + (f.passed || 0), 0);
  const score = totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;

  const content = `# ⚡ System Health & Stability Report

**Generated:** ${new Date().toISOString()}

## System Metrics
| Metric | Value |
|--------|-------|
| Memory Usage | ${heapMB}MB |
| Uptime | ${uptimeH} hours |
| Environment | ${process.env.NODE_ENV || 'development'} |

## Database Health
- Collections checked: ${db.passed || 0}/${db.checks || 0}

## Overall Health Score
**${score}%** (${totalPassed}/${totalChecks} checks passed)

## Status
${score >= 80 ? '✅ System is healthy' : score >= 50 ? '⚠️ System needs attention' : '❌ Critical issues detected'}
`;

  return {
    title: 'System Health & Stability Report',
    content,
    summary: `Health Score: ${score}%`,
    tags: ['health', 'stability', 'performance'],
    stats: { totalChecks, passed: totalPassed, failed: totalChecks - totalPassed, warnings: 0, score },
  };
}
