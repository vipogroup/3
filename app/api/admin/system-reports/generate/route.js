import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';
import { ObjectId } from 'mongodb';
import { isPriorityConfigured, getPriorityClient } from '@/lib/priority/client.js';
import { getPayPlusConfig } from '@/lib/payplus/config.js';

/**
 * POST /api/admin/system-reports/generate
 * Generate and save system reports
 */
async function POSTHandler(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const { reportType } = body;

    const db = await getDb();
    const reportsCol = db.collection('systemreports');
    const now = new Date();

    let report = null;

    if (reportType === 'integration') {
      report = generateIntegrationReport(admin, now);
    } else if (reportType === 'security') {
      report = await generateSecurityReport(admin, now);
    } else if (reportType === 'performance') {
      report = await generatePerformanceReport(admin, now, db);
    } else if (reportType === 'audit') {
      report = await generateAuditReport(admin, now, db);
    } else if (reportType === 'backup') {
      report = await generateBackupReport(admin, now, db);
    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    const result = await reportsCol.insertOne(report);

    return NextResponse.json({
      ok: true,
      reportId: result.insertedId.toString(),
      message: 'דוח נוצר בהצלחה',
    });

  } catch (err) {
    console.error('GENERATE_REPORT_ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function generateIntegrationReport(admin, now) {
  // Check integrations status
  const priorityConfigured = isPriorityConfigured();
  const payplusConfig = getPayPlusConfig();
  const payplusConfigured = payplusConfig.isConfigured;

  const content = `
# [LIST] דוח טכני מלא - אינטגרציות VIPO
## Priority ERP + PayPlus

**תאריך יצירה:** ${now.toLocaleDateString('he-IL')} ${now.toLocaleTimeString('he-IL')}

---

## [STATS] סטטוס אינטגרציות

| מערכת | סטטוס |
|-------|-------|
| Priority ERP | ${priorityConfigured ? '[OK] מוגדר' : '[X] לא מוגדר'} |
| PayPlus | ${payplusConfigured ? '[OK] מוגדר' : '[X] לא מוגדר'} |

---

## [BUILD] מבנה הקבצים

\`\`\`
lib/
├── priority/
│   ├── config.js           # הגדרות Priority
│   ├── client.js           # לקוח API ל-Priority
│   ├── syncService.js      # סנכרון לקוחות/הזמנות
│   └── agentPayoutService.js  # תשלום עמלות לסוכנים
│
├── payplus/
│   ├── config.js           # הגדרות PayPlus
│   └── client.js           # לקוח API ל-PayPlus
│
app/api/
├── payplus/
│   └── webhook/route.js    # Webhook handler
│
└── admin/
    └── withdrawals/
        └── [id]/route.js   # API תשלום לסוכנים
\`\`\`

---

## 🔑 משתני סביבה נדרשים

### PayPlus
\`\`\`env
PAYPLUS_ENV=sandbox
PAYPLUS_API_KEY=
PAYPLUS_SECRET=
PAYPLUS_WEBHOOK_SECRET=
PAYPLUS_BASE_URL=https://restapiv2.payplus.co.il/api
PAYPLUS_CALLBACK_URL=
PAYPLUS_MOCK_ENABLED=false
PAYPLUS_TIMEOUT_MS=30000
PAYPLUS_RETRY_ATTEMPTS=3
\`\`\`

### Priority ERP
\`\`\`env
PRIORITY_ENV=sandbox
PRIORITY_BASE_URL=
PRIORITY_CLIENT_ID=
PRIORITY_CLIENT_SECRET=
PRIORITY_COMPANY_CODE=
PRIORITY_TIMEOUT_MS=45000
\`\`\`

---

## 📡 PayPlus - פונקציות

| פונקציה | תיאור |
|---------|--------|
| createPaymentSession() | יצירת סשן תשלום |
| getPaymentStatus() | בדיקת סטטוס תשלום |
| verifyWebhookSignature() | אימות webhook |

### Webhook Events
- **payment.success** → עדכון הזמנה כ-paid
- **payment.failed** → רישום כישלון
- **refund.success** → עדכון כ-refunded
- **chargeback** → התראה למנהל

---

## [BIZ] Priority ERP - פונקציות

### לקוחות (CUSTOMERS)
| פונקציה | Endpoint | תיאור |
|---------|----------|--------|
| findCustomer() | GET /CUSTOMERS | חיפוש לקוח |
| createCustomer() | POST /CUSTOMERS | יצירת לקוח |
| updateCustomer() | PATCH /CUSTOMERS | עדכון לקוח |

### הזמנות (ORDERS)
| פונקציה | Endpoint | תיאור |
|---------|----------|--------|
| createSalesOrder() | POST /ORDERS | יצירת הזמנה |
| getSalesOrder() | GET /ORDERS | קבלת הזמנה |

### חשבוניות (AINVOICES)
| פונקציה | Endpoint | תיאור |
|---------|----------|--------|
| createInvoice() | POST /AINVOICES | יצירת חשבונית |

### זיכויים (CINVOICES)
| פונקציה | Endpoint | תיאור |
|---------|----------|--------|
| createCreditNote() | POST /CINVOICES | יצירת זיכוי |

### ספקים - תשלום עמלות (SUPPLIERS)
| פונקציה | Endpoint | תיאור |
|---------|----------|--------|
| findSupplier() | GET /SUPPLIERS | חיפוש ספק |
| createSupplier() | POST /SUPPLIERS | יצירת ספק (סוכן) |
| createSupplierPayment() | POST /FNCTRANS | תשלום לספק |

---

## [SYNC] תהליכי עבודה

### תשלום לקוח (PayPlus → Priority)
1. לקוח משלם ב-PayPlus
2. Webhook מתקבל + אימות
3. עדכון Order ל-paid
4. סנכרון לקוח ל-Priority
5. יצירת הזמנה + חשבונית

### תשלום עמלות לסוכנים
1. סוכן מבקש משיכה
2. מנהל מאשר
3. לחיצה "[CARD] Priority"
4. יצירת ספק + מסמך FNCTRANS
5. מחלקת כספים מאשרת
6. סימון כהושלם

---

## [PIN] קודי תשלום

| קוד | תיאור |
|-----|-------|
| CC | כרטיס אשראי |
| BIT | ביט |
| PP | PayPal |
| BT | העברה בנקאית |

---

## [NOTE] הערות למטמיע

1. **Priority OData** - כל הקריאות OData v4
2. **OAuth** - טוקן נשמר ב-cache עם רענון אוטומטי
3. **Retry** - מנגנון retry עם backoff
4. **Timeout** - 45 שניות ל-Priority
5. **Idempotency** - webhooks נבדקים לכפילויות
`;

  return {
    title: 'דוח אינטגרציות Priority ERP + PayPlus',
    type: 'integration',
    category: 'priority_payplus',
    summary: `סטטוס: Priority ${priorityConfigured ? '[OK]' : '[X]'} | PayPlus ${payplusConfigured ? '[OK]' : '[X]'}`,
    content,
    contentHtml: '',
    tags: ['priority', 'payplus', 'integration', 'technical'],
    version: '1.0',
    status: 'published',
    stats: {
      totalChecks: 2,
      passed: (priorityConfigured ? 1 : 0) + (payplusConfigured ? 1 : 0),
      failed: (!priorityConfigured ? 1 : 0) + (!payplusConfigured ? 1 : 0),
      warnings: 0,
      score: ((priorityConfigured ? 1 : 0) + (payplusConfigured ? 1 : 0)) * 50,
    },
    createdBy: new ObjectId(admin.id),
    createdByName: admin.fullName || admin.email || 'Admin',
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
}

async function generateSecurityReport(admin, now) {
  // Run security checks
  let score = 0;
  let passed = 0;
  let failed = 0;
  const checks = [];

  // Check JWT_SECRET
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32) {
    checks.push('[OK] JWT_SECRET מוגדר ומאובטח');
    passed++;
    score += 20;
  } else {
    checks.push('[X] JWT_SECRET חסר או קצר מדי');
    failed++;
  }

  // Check MONGODB_URI
  if (process.env.MONGODB_URI) {
    checks.push('[OK] MONGODB_URI מוגדר');
    passed++;
    score += 20;
  } else {
    checks.push('[X] MONGODB_URI חסר');
    failed++;
  }

  // Check NEXTAUTH_SECRET
  if (process.env.NEXTAUTH_SECRET) {
    checks.push('[OK] NEXTAUTH_SECRET מוגדר');
    passed++;
    score += 20;
  } else {
    checks.push('[X] NEXTAUTH_SECRET חסר');
    failed++;
  }

  // Check PayPlus webhook secret
  if (process.env.PAYPLUS_WEBHOOK_SECRET) {
    checks.push('[OK] PAYPLUS_WEBHOOK_SECRET מוגדר');
    passed++;
    score += 20;
  } else {
    checks.push('[WARN] PAYPLUS_WEBHOOK_SECRET חסר');
    failed++;
  }

  // Check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    checks.push('[OK] NODE_ENV מוגדר ל-production');
    passed++;
    score += 20;
  } else {
    checks.push('[WARN] NODE_ENV לא מוגדר ל-production');
  }

  const content = `
# [LOCK] דוח אבטחה - מערכת VIPO

**תאריך בדיקה:** ${now.toLocaleDateString('he-IL')} ${now.toLocaleTimeString('he-IL')}

---

## [STATS] סיכום

| מדד | ערך |
|-----|-----|
| ציון כללי | **${score}%** |
| בדיקות שעברו | ${passed} |
| בדיקות שנכשלו | ${failed} |

---

## [SEARCH] תוצאות בדיקות

${checks.join('\n')}

---

## [LIST] המלצות

${score < 100 ? `
### פעולות נדרשות:
${!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 ? '- הגדר JWT_SECRET באורך 32 תווים לפחות\n' : ''}
${!process.env.MONGODB_URI ? '- הגדר MONGODB_URI\n' : ''}
${!process.env.NEXTAUTH_SECRET ? '- הגדר NEXTAUTH_SECRET\n' : ''}
${!process.env.PAYPLUS_WEBHOOK_SECRET ? '- הגדר PAYPLUS_WEBHOOK_SECRET\n' : ''}
` : '[OK] כל בדיקות האבטחה עברו בהצלחה!'}

---

## [SHIELD] טיפים לאבטחה

1. **סיסמאות** - השתמש בסיסמאות חזקות (32+ תווים)
2. **HTTPS** - ודא שהאתר פועל ב-HTTPS
3. **Rate Limiting** - מוגדר אוטומטית במערכת
4. **Webhooks** - אימות חתימות מופעל
`;

  return {
    title: 'דוח אבטחה - בדיקת משתני סביבה',
    type: 'security',
    category: 'environment',
    summary: `ציון: ${score}% | ${passed} עברו, ${failed} נכשלו`,
    content,
    contentHtml: '',
    tags: ['security', 'environment', 'audit'],
    version: '1.0',
    status: 'published',
    stats: {
      totalChecks: passed + failed,
      passed,
      failed,
      warnings: 0,
      score,
    },
    createdBy: new ObjectId(admin.id),
    createdByName: admin.fullName || admin.email || 'Admin',
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
}

async function generatePerformanceReport(admin, now, db) {
  const startTime = Date.now();
  const checks = [];
  let score = 0, passed = 0, failed = 0;

  const dbStart = Date.now();
  try {
    await db.collection('users').findOne({});
    const dbTime = Date.now() - dbStart;
    if (dbTime < 100) { checks.push(`[OK] זמן תגובת DB: ${dbTime}ms`); passed++; score += 25; }
    else if (dbTime < 500) { checks.push(`[WARN] זמן תגובת DB: ${dbTime}ms`); passed++; score += 15; }
    else { checks.push(`[X] זמן תגובת DB: ${dbTime}ms`); failed++; }
  } catch (e) { checks.push('[X] שגיאת DB'); failed++; }

  const usersCount = await db.collection('users').countDocuments();
  const ordersCount = await db.collection('orders').countDocuments();
  const productsCount = await db.collection('products').countDocuments();
  checks.push(`[STATS] משתמשים: ${usersCount} | הזמנות: ${ordersCount} | מוצרים: ${productsCount}`);

  const mem = process.memoryUsage();
  const heapMB = Math.round(mem.heapUsed / 1024 / 1024);
  const heapPct = Math.round((mem.heapUsed / mem.heapTotal) * 100);
  checks.push(`[SAVE] זיכרון: ${heapMB}MB (${heapPct}%)`);
  if (heapPct < 80) { passed++; score += 25; } else { failed++; }

  const uptimeH = Math.floor(process.uptime() / 3600);
  checks.push(`⏱️ Uptime: ${uptimeH}h`);
  passed++; score += 25;

  const content = `# ⚡ דוח ביצועים\n\n**תאריך:** ${now.toLocaleDateString('he-IL')}\n\n## סיכום\nציון: **${score}%** | עברו: ${passed} | נכשלו: ${failed}\n\n## בדיקות\n${checks.join('\n')}\n\n## סטטיסטיקות\n- משתמשים: ${usersCount}\n- הזמנות: ${ordersCount}\n- מוצרים: ${productsCount}`;

  return { title: 'דוח ביצועים', type: 'performance', category: 'system', summary: `ציון: ${score}%`, content, contentHtml: '', tags: ['performance'], version: '1.0', status: 'published', stats: { totalChecks: passed + failed, passed, failed, warnings: 0, score }, createdBy: new ObjectId(admin.id), createdByName: admin.fullName || 'Admin', attachments: [], createdAt: now, updatedAt: now };
}

async function generateAuditReport(admin, now, db) {
  const pending = await db.collection('withdrawalrequests').countDocuments({ status: 'pending' });
  const completed = await db.collection('withdrawalrequests').countDocuments({ status: 'completed' });
  const admins = await db.collection('users').find({ role: 'admin' }).project({ fullName: 1, email: 1 }).toArray();
  const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(5).project({ status: 1, totalAmount: 1, createdAt: 1 }).toArray();

  const adminList = admins.map(a => `- ${a.fullName || a.email}`).join('\n');
  const orderList = orders.map(o => `| ${o.status} | ₪${o.totalAmount || 0} | ${new Date(o.createdAt).toLocaleDateString('he-IL')} |`).join('\n');

  const content = `# [LIST] דוח ביקורת\n\n**תאריך:** ${now.toLocaleDateString('he-IL')}\n\n## מנהלים (${admins.length})\n${adminList || 'אין'}\n\n## משיכות\n| סטטוס | כמות |\n|-------|------|\n| ממתינות | ${pending} |\n| הושלמו | ${completed} |\n\n## הזמנות אחרונות\n| סטטוס | סכום | תאריך |\n|-------|------|-------|\n${orderList || '| - | - | - |'}`;

  return { title: 'דוח ביקורת', type: 'audit', category: 'activity', summary: `${pending} ממתינות | ${admins.length} מנהלים`, content, contentHtml: '', tags: ['audit'], version: '1.0', status: 'published', stats: { totalChecks: 0, passed: 0, failed: 0, warnings: pending, score: 0 }, createdBy: new ObjectId(admin.id), createdByName: admin.fullName || 'Admin', attachments: [], createdAt: now, updatedAt: now };
}

async function generateBackupReport(admin, now, db) {
  const cols = ['users', 'orders', 'products', 'withdrawalrequests', 'transactions'];
  const stats = [];
  let total = 0;

  for (const c of cols) {
    try { const n = await db.collection(c).countDocuments(); stats.push({ n: c, c: n }); total += n; }
    catch (e) { stats.push({ n: c, c: 0, e: true }); }
  }

  const tbl = stats.map(s => `| ${s.n} | ${s.c} | ${s.e ? '[X]' : '[OK]'} |`).join('\n');
  const content = `# [SAVE] דוח גיבוי\n\n**תאריך:** ${now.toLocaleDateString('he-IL')}\n\n## סטטיסטיקות\n| קולקציה | מסמכים | סטטוס |\n|---------|--------|-------|\n${tbl}\n\n**סה"כ:** ${total} מסמכים\n\n## פקודות גיבוי\n\`\`\`bash\nmongodump --uri="$MONGODB_URI" --out=./backup\n\`\`\``;

  const ok = stats.filter(s => !s.e).length;
  return { title: 'דוח גיבוי', type: 'backup', category: 'database', summary: `${total} מסמכים`, content, contentHtml: '', tags: ['backup'], version: '1.0', status: 'published', stats: { totalChecks: cols.length, passed: ok, failed: cols.length - ok, warnings: 0, score: Math.round((ok / cols.length) * 100) }, createdBy: new ObjectId(admin.id), createdByName: admin.fullName || 'Admin', attachments: [], createdAt: now, updatedAt: now };
}

export const POST = withErrorLogging(POSTHandler);
