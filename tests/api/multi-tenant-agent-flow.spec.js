/**
 * בדיקת זרימה מלאה: Multi-Tenant + Agent + Orders
 * 
 * תרחיש:
 * - 3 עסקים שונים (Tenant A, B, C)
 * - סוכן 1 מחובר לכל 3 העסקים
 * - לכל עסק יש מוצר אחד
 * - לקוח אחד מזמין מכל עסק דרך לינקי הסוכן
 * 
 * בדיקות:
 * 1. סוכן מקבל קוד קופון נפרד לכל עסק
 * 2. הזמנות נרשמות עם tenantId נכון
 * 3. עמלות נזקפות לסוכן הנכון
 * 4. אין זליגת נתונים בין עסקים
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

// Helper: Make API request
async function apiRequest(method, endpoint, body = null, cookies = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add cookies
  if (Object.keys(cookies).length > 0) {
    headers['Cookie'] = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  const options = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  return { status: response.status, data, headers: response.headers };
}

// Test Data
const testData = {
  // 3 עסקים
  tenants: [
    { name: 'עסק אלפא', slug: 'test-alpha', email: 'alpha@test.com' },
    { name: 'עסק בטא', slug: 'test-beta', email: 'beta@test.com' },
    { name: 'עסק גמא', slug: 'test-gamma', email: 'gamma@test.com' },
  ],
  
  // סוכן אחד
  agent: {
    fullName: 'סוכן בדיקה',
    email: 'test-agent-multi@test.com',
    phone: '0501234567',
    password: 'Test123456!',
  },
  
  // לקוח אחד
  customer: {
    fullName: 'לקוח בדיקה',
    email: 'test-customer-multi@test.com',
    phone: '0509876543',
    password: 'Test123456!',
  },
  
  // מוצרים - אחד לכל עסק
  products: [
    { name: 'מוצר אלפא', price: 100, description: 'מוצר לעסק אלפא' },
    { name: 'מוצר בטא', price: 200, description: 'מוצר לעסק בטא' },
    { name: 'מוצר גמא', price: 300, description: 'מוצר לעסק גמא' },
  ],
};

// Test Results Storage
const results = {
  tenantIds: [],
  tenantOwnerTokens: [],
  agentId: null,
  agentToken: null,
  agentCoupons: [], // קוד קופון לכל עסק
  productIds: [],
  customerId: null,
  customerToken: null,
  orderIds: [],
  commissions: [],
};

// ========== TEST FUNCTIONS ==========

/**
 * שלב 1: יצירת 3 עסקים
 */
async function createTenants() {
  console.log('\n=== שלב 1: יצירת 3 עסקים ===\n');
  
  for (let i = 0; i < testData.tenants.length; i++) {
    const tenant = testData.tenants[i];
    
    // יצירת בעלים לעסק
    const ownerData = {
      fullName: `מנהל ${tenant.name}`,
      email: tenant.email,
      phone: `050000000${i}`,
      password: 'Test123456!',
      role: 'business_admin',
    };
    
    // רישום בעלים
    const registerRes = await apiRequest('POST', '/api/auth/register', ownerData);
    
    if (registerRes.status !== 201 && registerRes.status !== 409) {
      throw new Error(`נכשל ברישום בעלים לעסק ${tenant.name}: ${JSON.stringify(registerRes.data)}`);
    }
    
    // התחברות
    const loginRes = await apiRequest('POST', '/api/auth/login', {
      email: tenant.email,
      password: 'Test123456!',
    });
    
    if (loginRes.status !== 200) {
      throw new Error(`נכשל בהתחברות לעסק ${tenant.name}`);
    }
    
    const ownerToken = loginRes.data.token;
    results.tenantOwnerTokens.push(ownerToken);
    
    // יצירת Tenant
    const tenantRes = await apiRequest('POST', '/api/tenants', {
      name: tenant.name,
      slug: tenant.slug,
      status: 'active',
    }, { auth_token: ownerToken });
    
    if (tenantRes.status === 201) {
      results.tenantIds.push(tenantRes.data.tenant._id || tenantRes.data.tenant.id);
      console.log(`[v] עסק נוצר: ${tenant.name} (ID: ${results.tenantIds[i]})`);
    } else if (tenantRes.data.error === 'slug exists') {
      // עסק כבר קיים - ננסה למצוא אותו
      const existingRes = await apiRequest('GET', `/api/tenants?slug=${tenant.slug}`);
      if (existingRes.data.tenants?.length > 0) {
        results.tenantIds.push(existingRes.data.tenants[0]._id);
        console.log(`[v] עסק קיים: ${tenant.name} (ID: ${results.tenantIds[i]})`);
      }
    } else {
      console.log(`[WARN] בעיה ביצירת עסק ${tenant.name}: ${JSON.stringify(tenantRes.data)}`);
    }
  }
  
  console.log(`\nסה"כ עסקים: ${results.tenantIds.length}`);
  return results.tenantIds.length === 3;
}

/**
 * שלב 2: יצירת סוכן והצטרפות ל-3 העסקים
 */
async function createAgentAndJoinBusinesses() {
  console.log('\n=== שלב 2: יצירת סוכן וחיבור ל-3 עסקים ===\n');
  
  // רישום סוכן
  const registerRes = await apiRequest('POST', '/api/auth/register', {
    ...testData.agent,
    role: 'agent',
  });
  
  if (registerRes.status !== 201 && registerRes.status !== 409) {
    throw new Error(`נכשל ברישום סוכן: ${JSON.stringify(registerRes.data)}`);
  }
  
  results.agentId = registerRes.data.userId;
  
  // התחברות סוכן
  const loginRes = await apiRequest('POST', '/api/auth/login', {
    email: testData.agent.email,
    password: testData.agent.password,
  });
  
  if (loginRes.status !== 200) {
    throw new Error('נכשל בהתחברות סוכן');
  }
  
  results.agentToken = loginRes.data.token;
  results.agentId = loginRes.data.user?.id || loginRes.data.userId;
  console.log(`[v] סוכן נוצר: ${testData.agent.fullName} (ID: ${results.agentId})`);
  
  // הצטרפות לכל עסק
  for (let i = 0; i < results.tenantIds.length; i++) {
    const tenantId = results.tenantIds[i];
    
    const joinRes = await apiRequest('POST', '/api/agent/businesses', {
      tenantId,
    }, { auth_token: results.agentToken });
    
    if (joinRes.status === 201 || joinRes.status === 200) {
      const couponCode = joinRes.data.couponCode;
      results.agentCoupons.push({
        tenantId,
        tenantName: testData.tenants[i].name,
        couponCode,
      });
      console.log(`[v] סוכן הצטרף לעסק ${testData.tenants[i].name} - קוד קופון: ${couponCode}`);
    } else if (joinRes.data.error === 'Already connected to this business') {
      // כבר מחובר - נמצא את הקופון
      const bizRes = await apiRequest('GET', '/api/agent/businesses', null, { auth_token: results.agentToken });
      const biz = bizRes.data.businesses?.find(b => b.tenantId === tenantId);
      if (biz) {
        results.agentCoupons.push({
          tenantId,
          tenantName: testData.tenants[i].name,
          couponCode: biz.couponCode,
        });
        console.log(`[v] סוכן כבר מחובר לעסק ${testData.tenants[i].name} - קוד קופון: ${biz.couponCode}`);
      }
    } else {
      console.log(`[WARN] בעיה בהצטרפות לעסק: ${JSON.stringify(joinRes.data)}`);
    }
  }
  
  console.log(`\nסה"כ עסקים שהסוכן מחובר אליהם: ${results.agentCoupons.length}`);
  
  // בדיקה: לכל עסק קוד קופון שונה
  const uniqueCoupons = new Set(results.agentCoupons.map(c => c.couponCode));
  if (uniqueCoupons.size === results.agentCoupons.length) {
    console.log('[v] קודי הקופון ייחודיים לכל עסק');
  } else {
    console.log('[x] שגיאה: יש קודי קופון כפולים!');
  }
  
  return results.agentCoupons.length === 3;
}

/**
 * שלב 3: יצירת מוצר לכל עסק
 */
async function createProducts() {
  console.log('\n=== שלב 3: יצירת מוצר לכל עסק ===\n');
  
  for (let i = 0; i < results.tenantIds.length; i++) {
    const tenantId = results.tenantIds[i];
    const product = testData.products[i];
    const ownerToken = results.tenantOwnerTokens[i];
    
    const productRes = await apiRequest('POST', '/api/products', {
      ...product,
      tenantId,
      active: true,
      stockCount: 100,
    }, { auth_token: ownerToken });
    
    if (productRes.status === 201) {
      const productId = productRes.data.product._id || productRes.data.product.id;
      results.productIds.push({
        productId,
        tenantId,
        name: product.name,
        price: product.price,
      });
      console.log(`[v] מוצר נוצר: ${product.name} (מחיר: ₪${product.price}) לעסק ${testData.tenants[i].name}`);
    } else {
      console.log(`[WARN] בעיה ביצירת מוצר: ${JSON.stringify(productRes.data)}`);
    }
  }
  
  console.log(`\nסה"כ מוצרים: ${results.productIds.length}`);
  return results.productIds.length === 3;
}

/**
 * שלב 4: יצירת לקוח
 */
async function createCustomer() {
  console.log('\n=== שלב 4: יצירת לקוח ===\n');
  
  const registerRes = await apiRequest('POST', '/api/auth/register', testData.customer);
  
  if (registerRes.status !== 201 && registerRes.status !== 409) {
    throw new Error(`נכשל ברישום לקוח: ${JSON.stringify(registerRes.data)}`);
  }
  
  // התחברות
  const loginRes = await apiRequest('POST', '/api/auth/login', {
    email: testData.customer.email,
    password: testData.customer.password,
  });
  
  if (loginRes.status !== 200) {
    throw new Error('נכשל בהתחברות לקוח');
  }
  
  results.customerToken = loginRes.data.token;
  results.customerId = loginRes.data.user?.id || loginRes.data.userId;
  console.log(`[v] לקוח נוצר: ${testData.customer.fullName} (ID: ${results.customerId})`);
  
  return true;
}

/**
 * שלב 5: לקוח מזמין מכל עסק דרך קוד קופון של הסוכן
 */
async function createOrders() {
  console.log('\n=== שלב 5: לקוח מזמין 3 מוצרים דרך לינקי הסוכן ===\n');
  
  for (let i = 0; i < results.productIds.length; i++) {
    const product = results.productIds[i];
    const couponInfo = results.agentCoupons[i];
    
    console.log(`\n--- הזמנה ${i + 1}: ${product.name} מעסק ${couponInfo.tenantName} ---`);
    console.log(`קוד קופון: ${couponInfo.couponCode}`);
    
    const orderRes = await apiRequest('POST', '/api/orders', {
      items: [{
        productId: product.productId,
        quantity: 1,
      }],
      coupon: {
        code: couponInfo.couponCode,
      },
      customer: {
        name: testData.customer.fullName,
        email: testData.customer.email,
        phone: testData.customer.phone,
      },
    }, { 
      auth_token: results.customerToken,
      refSource: couponInfo.couponCode,
    });
    
    if (orderRes.status === 201) {
      results.orderIds.push({
        orderId: orderRes.data.orderId,
        tenantId: product.tenantId,
        productName: product.name,
        totalAmount: orderRes.data.totals?.totalAmount || product.price,
        commissionAmount: orderRes.data.commissionAmount,
        refAgentId: orderRes.data.refAgentId,
        couponCode: orderRes.data.couponCode,
      });
      
      results.commissions.push({
        tenantId: product.tenantId,
        tenantName: couponInfo.tenantName,
        amount: orderRes.data.commissionAmount,
        orderId: orderRes.data.orderId,
      });
      
      console.log(`[v] הזמנה נוצרה: ${orderRes.data.orderId}`);
      console.log(`  סכום: ₪${orderRes.data.totals?.totalAmount || product.price}`);
      console.log(`  עמלה לסוכן: ₪${orderRes.data.commissionAmount}`);
      console.log(`  סוכן מפנה: ${orderRes.data.refAgentId}`);
    } else {
      console.log(`[x] נכשל ביצירת הזמנה: ${JSON.stringify(orderRes.data)}`);
    }
  }
  
  console.log(`\nסה"כ הזמנות: ${results.orderIds.length}`);
  return results.orderIds.length === 3;
}

/**
 * שלב 6: בדיקת עמלות ואי-זליגה
 */
async function verifyCommissionsAndNoLeakage() {
  console.log('\n=== שלב 6: בדיקת עמלות וזליגות ===\n');
  
  let allPassed = true;
  
  // בדיקה 1: כל ההזמנות קושרו לסוכן הנכון
  console.log('--- בדיקה 1: קישור הזמנות לסוכן ---');
  for (const order of results.orderIds) {
    if (order.refAgentId === results.agentId) {
      console.log(`[v] הזמנה ${order.orderId} - מקושרת לסוכן הנכון`);
    } else {
      console.log(`[x] הזמנה ${order.orderId} - סוכן שגוי! צפוי: ${results.agentId}, קיבלנו: ${order.refAgentId}`);
      allPassed = false;
    }
  }
  
  // בדיקה 2: עמלות חושבו נכון (12% ברירת מחדל)
  console.log('\n--- בדיקה 2: חישוב עמלות ---');
  const expectedCommissionRate = 0.12;
  for (const order of results.orderIds) {
    const expectedCommission = order.totalAmount * expectedCommissionRate;
    const actualCommission = order.commissionAmount || 0;
    const diff = Math.abs(expectedCommission - actualCommission);
    
    if (diff < 1) { // מרווח סטייה של ₪1
      console.log(`[v] הזמנה ${order.orderId} - עמלה נכונה: ₪${actualCommission}`);
    } else {
      console.log(`[WARN] הזמנה ${order.orderId} - עמלה: ₪${actualCommission} (צפוי: ~₪${expectedCommission.toFixed(2)})`);
    }
  }
  
  // בדיקה 3: סה"כ עמלות שהסוכן אמור לקבל
  console.log('\n--- בדיקה 3: סיכום עמלות לסוכן ---');
  const totalCommission = results.commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  console.log(`סה"כ עמלות מכל העסקים: ₪${totalCommission}`);
  
  for (const commission of results.commissions) {
    console.log(`  • ${commission.tenantName}: ₪${commission.amount || 0}`);
  }
  
  // בדיקה 4: בדיקת זליגה - מנהל עסק A לא רואה הזמנות עסק B
  console.log('\n--- בדיקה 4: בדיקת זליגה בין עסקים ---');
  
  for (let i = 0; i < results.tenantOwnerTokens.length; i++) {
    const ownerToken = results.tenantOwnerTokens[i];
    const tenantId = results.tenantIds[i];
    const tenantName = testData.tenants[i].name;
    
    const ordersRes = await apiRequest('GET', '/api/orders', null, { auth_token: ownerToken });
    
    if (ordersRes.status === 200) {
      const orders = ordersRes.data.items || [];
      const ownOrders = orders.filter(o => String(o.tenantId) === String(tenantId));
      const otherOrders = orders.filter(o => String(o.tenantId) !== String(tenantId));
      
      if (otherOrders.length === 0) {
        console.log(`[v] ${tenantName} - רואה רק את ההזמנות שלו (${ownOrders.length} הזמנות)`);
      } else {
        console.log(`[x] ${tenantName} - זליגה! רואה ${otherOrders.length} הזמנות מעסקים אחרים`);
        allPassed = false;
      }
    }
  }
  
  // בדיקה 5: בדיקת יתרת עמלות של הסוכן
  console.log('\n--- בדיקה 5: יתרת עמלות סוכן ---');
  const agentRes = await apiRequest('GET', '/api/users/me', null, { auth_token: results.agentToken });
  
  if (agentRes.status === 200) {
    const agent = agentRes.data.user || agentRes.data;
    console.log(`יתרת עמלות סוכן: ₪${agent.commissionBalance || 0}`);
    console.log(`סה"כ מכירות: ${agent.totalSales || 0}`);
  }
  
  return allPassed;
}

/**
 * הרצת כל הבדיקות
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║     בדיקת זרימה מלאה: Multi-Tenant + Agent + Orders            ║');
  console.log('║     3 עסקים • סוכן אחד • לקוח אחד • 3 הזמנות                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  const testResults = {
    createTenants: false,
    createAgent: false,
    createProducts: false,
    createCustomer: false,
    createOrders: false,
    verifyResults: false,
  };
  
  try {
    testResults.createTenants = await createTenants();
    testResults.createAgent = await createAgentAndJoinBusinesses();
    testResults.createProducts = await createProducts();
    testResults.createCustomer = await createCustomer();
    testResults.createOrders = await createOrders();
    testResults.verifyResults = await verifyCommissionsAndNoLeakage();
  } catch (error) {
    console.error('\n[X] שגיאה:', error.message);
  }
  
  // סיכום
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                          סיכום בדיקות                          ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  
  const tests = [
    ['יצירת 3 עסקים', testResults.createTenants],
    ['יצירת סוכן + חיבור ל-3 עסקים', testResults.createAgent],
    ['יצירת מוצר לכל עסק', testResults.createProducts],
    ['יצירת לקוח', testResults.createCustomer],
    ['3 הזמנות דרך לינקי סוכן', testResults.createOrders],
    ['בדיקת עמלות וזליגות', testResults.verifyResults],
  ];
  
  for (const [name, passed] of tests) {
    const status = passed ? '[v]' : '[x]';
    console.log(`║  ${status} ${name.padEnd(50)}║`);
  }
  
  const allPassed = Object.values(testResults).every(v => v);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║  ${allPassed ? '[v] כל הבדיקות עברו בהצלחה!' : '[x] יש בדיקות שנכשלו'}`.padEnd(65) + '║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  return allPassed;
}

// Export for Jest/Mocha or run directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testData, results };
}

// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}
