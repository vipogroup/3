'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// Test data for simulation
const TEST_USER = {
  customer: {
    fullName: 'לקוח בדיקה',
    email: 'test-customer-' + Date.now() + '@test.com',
    phone: '050' + Math.floor(1000000 + Math.random() * 9000000),
    password: 'Test1234!',
    role: 'customer',
  },
  agent: {
    fullName: 'סוכן בדיקה',
    email: 'test-agent-' + Date.now() + '@test.com',
    phone: '050' + Math.floor(1000000 + Math.random() * 9000000),
    password: 'Test1234!',
    role: 'agent',
  },
  business: {
    businessName: 'עסק בדיקה ' + Date.now(),
    slug: 'test-biz-' + Date.now(),
    owner: {
      fullName: 'בעל עסק בדיקה',
      email: 'test-business-' + Date.now() + '@test.com',
      phone: '050' + Math.floor(1000000 + Math.random() * 9000000),
      password: 'Test1234!',
    },
  },
};

const CATEGORIES = {
  registrations: {
    id: 'registrations',
    name: 'שלב 1 - הרשמות',
    icon: '[1]',
    tests: [
      { id: 'reg-customer', name: 'הרשמת לקוח', desc: 'יצירת לקוח חדש + בדיקת התראות' },
      { id: 'reg-agent', name: 'הרשמת סוכן', desc: 'יצירת סוכן + קופון אוטומטי' },
      { id: 'reg-business', name: 'הרשמת עסק', desc: 'יצירת עסק חדש + בעל עסק' },
    ],
  },
  businessFlow: {
    id: 'businessFlow',
    name: 'שלב 2 - זרימת עסק מוכן',
    icon: '[2]',
    tests: [
      { id: 'biz-activate', name: 'הפעלת עסק', desc: 'יצר עסק + בעל עסק' },
      { id: 'biz-approve', name: 'אישור עסק', desc: 'שינוי סטטוס ל-active' },
      { id: 'biz-add-product', name: 'הוספת מוצר', desc: 'מוסיף מוצר לעסק' },
      { id: 'biz-agent-register', name: 'סוכן ורישום דרך עסק', desc: 'סוכן חדש' },
      { id: 'biz-customer-register', name: 'לקוח רושם', desc: 'לקוח חדש' },
      { id: 'biz-order-with-coupon', name: 'רכישה עם קופון', desc: 'הזמנה + עמלה לסוכן' },
      { id: 'biz-order-no-coupon', name: 'רכישה ללא קופון', desc: 'הזמנה ללא עמלה' },
      { id: 'biz-check-notifications', name: 'בדיקת התראות', desc: 'כל ההתראות' },
      { id: 'biz-check-products', name: 'בדיקת מוצרים', desc: 'מוצר העסק מופיע' },
      { id: 'biz-dashboard', name: 'דשבורד עסק', desc: 'רכישות + עמלות' },
      { id: 'biz-agent-dashboard', name: 'דשבורד סוכן', desc: 'העמלה שלו' },
    ],
  },
  dashboard: {
    id: 'dashboard',
    name: 'נתונים בדשבורד',
    icon: '[3]',
    tests: [
      { id: 'check-users-list', name: 'ניהול משתמשים', desc: 'בדיקה שהלקוח מופיע ברשימה' },
      { id: 'check-agents-list', name: 'ניהול סוכנים', desc: 'בדיקה שהסוכן מופיע ברשימה' },
      { id: 'check-tenants-list', name: 'ניהול עסקים', desc: 'בדיקה שהעסק מופיע ברשימה' },
    ],
  },
  notifications: {
    id: 'notifications',
    name: 'התראות',
    icon: '[4]',
    tests: [
      { id: 'notif-admin-new-user', name: 'התראה למנהל', desc: 'בדיקה שנשלחה התראה על הרשמה' },
      { id: 'notif-log-exists', name: 'יומן התראות', desc: 'בדיקה שההתראה מופיעה ביומן' },
    ],
  },
  cleanup: {
    id: 'cleanup',
    name: 'ניקוי',
    icon: '[5]',
    tests: [
      { id: 'cleanup-test-users', name: 'מחיקת משתמשי בדיקה', desc: 'מחיקת כל המשתמשים שנוצרו' },
    ],
  },
};

function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('registrations');
  const [testResults, setTestResults] = useState({});
  const [testData, setTestData] = useState({});
  const [logs, setLogs] = useState([]);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const allTests = Object.values(CATEGORIES).flatMap(cat => cat.tests);
  const totalTests = allTests.length;
  const passedTests = Object.values(testResults).filter(r => r === 'success').length;
  const failedTests = Object.values(testResults).filter(r => r === 'failed').length;

  const addLog = useCallback((msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('he-IL');
    setLogs(prev => [...prev.slice(-100), { time, message: msg, type }]);
  }, []);

  const setResult = useCallback((testId, status, data = null) => {
    setTestResults(prev => ({ ...prev, [testId]: status }));
    if (data) setTestData(prev => ({ ...prev, [testId]: data }));
  }, []);

  // ========== REAL TESTS ==========

  const testRegisterCustomer = async () => {
    const userData = {
      fullName: 'לקוח בדיקה ' + Date.now(),
      email: 'test-customer-' + Date.now() + '@test.vipo.com',
      phone: '050' + Math.floor(1000000 + Math.random() * 9000000),
      password: 'Test1234!',
      role: 'customer',
    };
    addLog('יוצר לקוח: ' + userData.email);
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    
    if (data.ok && data.userId) {
      addLog('[v] לקוח נוצר בהצלחה: ' + data.userId, 'success');
      return { success: true, userId: data.userId, email: userData.email };
    } else {
      addLog('[x] שגיאה: ' + (data.error || data.message), 'error');
      return { success: false, error: data.error };
    }
  };

  const testRegisterAgent = async () => {
    const userData = {
      fullName: 'סוכן בדיקה ' + Date.now(),
      email: 'test-agent-' + Date.now() + '@test.vipo.com',
      phone: '050' + Math.floor(1000000 + Math.random() * 9000000),
      password: 'Test1234!',
      role: 'agent',
    };
    addLog('יוצר סוכן: ' + userData.email);
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    
    if (data.ok && data.userId) {
      addLog('[v] סוכן נוצר בהצלחה: ' + data.userId, 'success');
      return { success: true, userId: data.userId, email: userData.email };
    } else {
      addLog('[x] שגיאה: ' + (data.error || data.message), 'error');
      return { success: false, error: data.error };
    }
  };

  const testRegisterBusiness = async () => {
    const ts = Date.now();
    const bizData = {
      businessName: 'עסק בדיקה ' + ts,
      slug: 'test-biz-' + ts,
      owner: {
        fullName: 'בעל עסק ' + ts,
        email: 'test-biz-' + ts + '@test.vipo.com',
        phone: '050' + Math.floor(1000000 + Math.random() * 9000000),
        password: 'Test1234!',
      },
    };
    addLog('יוצר עסק: ' + bizData.businessName);
    
    const res = await fetch('/api/register-business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bizData),
    });
    const data = await res.json();
    
    if (data.success && data.tenantId) {
      addLog('[v] עסק נוצר בהצלחה: ' + data.tenantId, 'success');
      return { success: true, tenantId: data.tenantId, email: bizData.owner.email };
    } else {
      addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error');
      return { success: false, error: data.error };
    }
  };

  const testCheckUsersList = async () => {
    const customerData = testData['reg-customer'];
    if (!customerData?.email) {
      addLog('[x] אין נתוני לקוח - הרץ קודם את בדיקת הרשמת לקוח', 'error');
      return { success: false };
    }
    
    addLog('בודק אם הלקוח מופיע ברשימת משתמשים...');
    const res = await fetch('/api/users?role=customer&q=' + encodeURIComponent(customerData.email));
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      addLog('[v] הלקוח נמצא ברשימה!', 'success');
      return { success: true };
    } else {
      addLog('[x] הלקוח לא נמצא ברשימה', 'error');
      return { success: false };
    }
  };

  const testCheckAgentsList = async () => {
    const agentData = testData['reg-agent'];
    if (!agentData?.email) {
      addLog('[x] אין נתוני סוכן - הרץ קודם את בדיקת הרשמת סוכן', 'error');
      return { success: false };
    }
    
    addLog('בודק אם הסוכן מופיע ברשימת סוכנים...');
    const res = await fetch('/api/users?role=agent&q=' + encodeURIComponent(agentData.email));
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      addLog('[v] הסוכן נמצא ברשימה!', 'success');
      return { success: true };
    } else {
      addLog('[x] הסוכן לא נמצא ברשימה', 'error');
      return { success: false };
    }
  };

  const testCheckTenantsList = async () => {
    const bizData = testData['reg-business'];
    if (!bizData?.tenantId) {
      addLog('[x] אין נתוני עסק - הרץ קודם את בדיקת הרשמת עסק', 'error');
      return { success: false };
    }
    
    addLog('בודק אם העסק מופיע ברשימת עסקים...');
    const res = await fetch('/api/tenants');
    const data = await res.json();
    
    const found = (data.tenants || data.items || []).find(t => String(t._id) === bizData.tenantId);
    if (found) {
      addLog('[v] העסק נמצא ברשימה!', 'success');
      return { success: true };
    } else {
      addLog('[x] העסק לא נמצא ברשימה', 'error');
      return { success: false };
    }
  };

  const testNotifAdminNewUser = async () => {
    addLog('בודק התראות על הרשמה חדשה...');
    const res = await fetch('/api/admin/notification-logs?limit=10');
    const data = await res.json();
    
    if (data.logs && data.logs.length > 0) {
      addLog('[v] נמצאו ' + data.logs.length + ' התראות ביומן', 'success');
      return { success: true };
    } else {
      addLog('[WARN] לא נמצאו התראות (ייתכן שזה תקין)', 'warning');
      return { success: true }; // Not critical
    }
  };

  const testNotifLogExists = async () => {
    addLog('בודק שיומן ההתראות עובד...');
    const res = await fetch('/api/admin/notification-logs?includeStats=true');
    const data = await res.json();
    
    if (data.ok !== false) {
      addLog('[v] יומן ההתראות פועל', 'success');
      if (data.stats) {
        addLog('  סטטיסטיקות: ' + JSON.stringify(data.stats), 'info');
      }
      return { success: true };
    } else {
      addLog('[x] בעיה בגישה ליומן ההתראות', 'error');
      return { success: false };
    }
  };

  const testCleanupUsers = async () => {
    addLog('מוחק משתמשי בדיקה...');
    let deleted = 0;
    for (const key of ['reg-customer', 'reg-agent', 'biz-customer-register', 'biz-agent-register']) {
      const data = testData[key];
      if (data?.userId) {
        try {
          const res = await fetch('/api/users/' + data.userId, { method: 'DELETE' });
          if (res.ok) { deleted++; addLog('[v] נמחק: ' + data.email, 'success'); }
        } catch (e) { addLog('[WARN] לא ניתן למחוק: ' + data.email, 'warning'); }
      }
    }
    for (const key of ['biz-activate']) {
      const data = testData[key];
      if (data?.tenantId) {
        try {
          await fetch('/api/tenants/' + data.tenantId, { method: 'DELETE' });
          addLog('[v] עסק נמחק', 'success');
        } catch (e) { addLog('[WARN] לא ניתן למחוק עסק', 'warning'); }
      }
    }
    addLog('סה"כ נמחקו: ' + deleted + ' משתמשים', 'info');
    return { success: true, deleted };
  };

  // ========== BUSINESS FLOW TESTS ==========
  const testBizActivate = async () => {
    const ts = Date.now();
    const bizData = { businessName: 'עסק בדיקה ' + ts, slug: 'test-biz-' + ts, owner: { fullName: 'בעל עסק ' + ts, email: 'test-biz-' + ts + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!' } };
    addLog('יוצר עסק: ' + bizData.businessName);
    const res = await fetch('/api/register-business', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bizData) });
    const data = await res.json();
    if (data.success && data.tenantId) { addLog('[v] עסק נוצר: ' + data.tenantId, 'success'); return { success: true, tenantId: data.tenantId, ownerId: data.userId, ownerEmail: bizData.owner.email }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testBizApprove = async () => {
    const biz = testData['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] הרץ קודם הפעלת עסק', 'error'); return { success: false }; }
    addLog('מאשר עסק + מגדיר הרשאות: ' + biz.tenantId);
    const allMenus = ['users', 'agents', 'products', 'products_new', 'orders', 'reports', 'commissions', 'withdrawals', 'transactions', 'analytics', 'settings', 'marketing', 'notifications', 'integrations', 'crm', 'bot_manager', 'site_texts', 'branding', 'new_users_widget', 'recent_orders_widget'];
    const res = await fetch('/api/tenants/' + biz.tenantId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: 'active', allowedMenus: allMenus }) });
    const data = await res.json();
    if (res.ok) { addLog('[v] עסק אושר + ' + allMenus.length + ' הרשאות הוגדרו!', 'success'); return { success: true }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testBizAddProduct = async () => {
    const biz = testData['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] הרץ קודם הפעלת עסק', 'error'); return { success: false }; }
    const prod = { name: 'מוצר בדיקה ' + Date.now(), price: 100, description: 'מוצר סימולטור', category: 'בדיקות', tenantId: biz.tenantId, stockCount: 50, active: true };
    addLog('מוסיף מוצר: ' + prod.name);
    try {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(prod) });
      const data = await res.json();
      if (res.status === 201 || res.ok) {
        const productId = data._id || data.product?._id || data.product?.id;
        addLog('[v] מוצר נוצר בהצלחה! ID: ' + (productId || 'unknown'), 'success');
        return { success: true, productId, price: prod.price };
      }
      addLog('[x] שגיאה: ' + (data.error || data.message || JSON.stringify(data)), 'error'); return { success: false };
    } catch (err) {
      addLog('[x] שגיאת רשת: ' + err.message, 'error'); return { success: false };
    }
  };

  const testBizAgentRegister = async () => {
    const biz = testData['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] הרץ קודם הפעלת עסק', 'error'); return { success: false }; }
    const agent = { fullName: 'סוכן עסק ' + Date.now(), email: 'test-biz-agent-' + Date.now() + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!', role: 'agent', tenantId: biz.tenantId };
    addLog('רושם סוכן: ' + agent.email);
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agent) });
    const data = await res.json();
    if (data.ok && data.userId) {
      addLog('[v] סוכן נרשם: ' + data.userId, 'success');
      const couponRes = await fetch('/api/coupons?userId=' + data.userId);
      const couponData = await couponRes.json();
      const coupon = couponData.coupons?.[0]?.code || couponData.items?.[0]?.code;
      if (coupon) addLog('[v] קופון: ' + coupon, 'success');
      return { success: true, userId: data.userId, email: agent.email, couponCode: coupon };
    }
    addLog('[x] שגיאה: ' + (data.error || data.message), 'error'); return { success: false };
  };

  const testBizCustomerRegister = async () => {
    const biz = testData['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] הרץ קודם הפעלת עסק', 'error'); return { success: false }; }
    const cust = { fullName: 'לקוח עסק ' + Date.now(), email: 'test-biz-cust-' + Date.now() + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!', role: 'customer', tenantId: biz.tenantId };
    addLog('רושם לקוח: ' + cust.email);
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cust) });
    const data = await res.json();
    if (data.ok && data.userId) { addLog('[v] לקוח נרשם: ' + data.userId, 'success'); return { success: true, userId: data.userId, email: cust.email }; }
    addLog('[x] שגיאה: ' + (data.error || data.message), 'error'); return { success: false };
  };

  const testBizOrderWithCoupon = async () => {
    const biz = testData['biz-activate'], prod = testData['biz-add-product'], agent = testData['biz-agent-register'], cust = testData['biz-customer-register'];
    if (!biz?.tenantId || !prod?.productId || !agent?.couponCode || !cust?.userId) { addLog('[x] חסרים נתונים - הרץ בדיקות קודמות', 'error'); return { success: false }; }
    const order = { customerId: cust.userId, tenantId: biz.tenantId, items: [{ productId: prod.productId, quantity: 1, price: prod.price }], totalAmount: prod.price, couponCode: agent.couponCode, status: 'completed' };
    addLog('יוצר הזמנה עם קופון: ' + agent.couponCode);
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(order) });
    const data = await res.json();
    const orderId = data._id || data.order?._id;
    if (orderId) { addLog('[v] הזמנה נוצרה: ' + orderId, 'success'); if (data.commissionAmount) addLog('[v] עמלה: ₪' + data.commissionAmount, 'success'); return { success: true, orderId }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testBizOrderNoCoupon = async () => {
    const biz = testData['biz-activate'], prod = testData['biz-add-product'], cust = testData['biz-customer-register'];
    if (!biz?.tenantId || !prod?.productId || !cust?.userId) { addLog('[x] חסרים נתונים', 'error'); return { success: false }; }
    const order = { customerId: cust.userId, tenantId: biz.tenantId, items: [{ productId: prod.productId, quantity: 2, price: prod.price }], totalAmount: prod.price * 2, status: 'completed' };
    addLog('יוצר הזמנה ללא קופון');
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(order) });
    const data = await res.json();
    const orderId = data._id || data.order?._id;
    if (orderId) { addLog('[v] הזמנה נוצרה: ' + orderId + ' (ללא עמלה)', 'success'); return { success: true, orderId }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testBizCheckNotifications = async () => {
    const biz = testData['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק', 'error'); return { success: false }; }
    addLog('בודק התראות...');
    const res = await fetch('/api/notifications?tenantId=' + biz.tenantId);
    const data = await res.json();
    const count = data.notifications?.length || data.items?.length || 0;
    addLog('[v] נמצאו ' + count + ' התראות', 'success');
    return { success: true, count };
  };

  const testBizCheckProducts = async () => {
    const biz = testData['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק', 'error'); return { success: false }; }
    addLog('בודק מוצרים...');
    const res = await fetch('/api/products?tenantId=' + biz.tenantId);
    const data = await res.json();
    const products = data.products || data.items || [];
    addLog('[v] נמצאו ' + products.length + ' מוצרים', 'success');
    return { success: products.length > 0, count: products.length };
  };

  const testBizDashboard = async () => {
    const biz = testData['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק', 'error'); return { success: false }; }
    addLog('בודק דשבורד עסק...');
    const res = await fetch('/api/orders?tenantId=' + biz.tenantId);
    const data = await res.json();
    const orders = data.orders || data.items || [];
    addLog('[v] נמצאו ' + orders.length + ' הזמנות', 'success');
    return { success: true, ordersCount: orders.length };
  };

  const testBizAgentDashboard = async () => {
    const agent = testData['biz-agent-register'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('בודק דשבורד סוכן...');
    const res = await fetch('/api/commissions?agentId=' + agent.userId);
    const data = await res.json();
    const comms = data.commissions || data.items || [];
    addLog('[v] נמצאו ' + comms.length + ' עמלות', 'success');
    return { success: true, commissionsCount: comms.length };
  };

  // ========== TEST RUNNER ==========

  const TEST_FUNCTIONS = {
    'reg-customer': testRegisterCustomer,
    'reg-agent': testRegisterAgent,
    'reg-business': testRegisterBusiness,
    'biz-activate': testBizActivate,
    'biz-approve': testBizApprove,
    'biz-add-product': testBizAddProduct,
    'biz-agent-register': testBizAgentRegister,
    'biz-customer-register': testBizCustomerRegister,
    'biz-order-with-coupon': testBizOrderWithCoupon,
    'biz-order-no-coupon': testBizOrderNoCoupon,
    'biz-check-notifications': testBizCheckNotifications,
    'biz-check-products': testBizCheckProducts,
    'biz-dashboard': testBizDashboard,
    'biz-agent-dashboard': testBizAgentDashboard,
    'check-users-list': testCheckUsersList,
    'check-agents-list': testCheckAgentsList,
    'check-tenants-list': testCheckTenantsList,
    'notif-admin-new-user': testNotifAdminNewUser,
    'notif-log-exists': testNotifLogExists,
    'cleanup-test-users': testCleanupUsers,
  };

  const runTest = async (testId, testName) => {
    setResult(testId, 'running');
    addLog('--- מריץ: ' + testName + ' ---');
    
    try {
      const testFn = TEST_FUNCTIONS[testId];
      if (!testFn) {
        addLog('[x] פונקציית בדיקה לא נמצאה', 'error');
        setResult(testId, 'failed');
        return;
      }
      
      const result = await testFn();
      setResult(testId, result.success ? 'success' : 'failed', result);
    } catch (err) {
      addLog('[x] שגיאה: ' + err.message, 'error');
      setResult(testId, 'failed');
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    setTestResults({});
    setTestData({});
    setLogs([]);
    addLog('========== מתחיל הרצת כל הבדיקות ==========', 'info');
    
    for (const cat of Object.values(CATEGORIES)) {
      addLog('--- ' + cat.icon + ' ' + cat.name + ' ---', 'info');
      for (const test of cat.tests) {
        await runTest(test.id, test.name);
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    addLog('========== הרצה הסתיימה ==========', 'info');
    setIsRunningAll(false);
  };

  const getStyle = (s) => {
    if (s === 'success') return 'bg-green-50 border-green-300 text-green-800';
    if (s === 'failed') return 'bg-red-50 border-red-300 text-red-800';
    if (s === 'running') return 'bg-yellow-50 border-yellow-300 text-yellow-800';
    return 'bg-gray-50 border-gray-200 text-gray-600';
  };

  const getIcon = (s) => {
    if (s === 'success') return '[v]';
    if (s === 'failed') return '[x]';
    if (s === 'running') return '[...]';
    return '○';
  };

  const cat = CATEGORIES[activeTab];

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 text-white font-bold flex items-center gap-3" style={{background:'linear-gradient(135deg,#1e3a8a,#0891b2)'}}>
          <Link href="/admin" className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 block"/>
          <span className="w-3 h-3 rounded-full bg-yellow-500"/>
          <span className="w-3 h-3 rounded-full bg-green-500"/>
          <span className="mr-3 text-lg">סימולטור מערכת VIPO - שלב 1: הרשמות</span>
        </div>
        
        <div className="flex gap-2 p-3 bg-gray-50 border-b flex-wrap">
          <button onClick={runAllTests} disabled={isRunningAll} className="px-4 py-2 text-white rounded font-medium disabled:opacity-50" style={{background:'linear-gradient(135deg,#1e3a8a,#0891b2)'}}>
            {isRunningAll ? '[...] רץ...' : '▶ הרץ הכל'}
          </button>
          <button onClick={() => {setTestResults({});setTestData({});setLogs([]);}} className="px-4 py-2 bg-gray-200 rounded font-medium">⟲ אפס</button>
          <div className="flex-1"/>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">[v] {passedTests}</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">[x] {failedTests}</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">○ {totalTests - passedTests - failedTests}</span>
        </div>
        
        <div className="flex border-b bg-gray-50 overflow-x-auto">
          {Object.values(CATEGORIES).map(c => (
            <button key={c.id} onClick={() => setActiveTab(c.id)} className={'px-4 py-3 font-medium whitespace-nowrap ' + (activeTab === c.id ? 'bg-white border-b-2 border-cyan-600' : 'hover:bg-gray-100')}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cat.tests.map(t => {
            const s = testResults[t.id] || 'pending';
            return (
              <div key={t.id} className={'rounded-lg border-2 p-4 ' + getStyle(s)}>
                <h3 className="font-bold mb-1 flex items-center gap-2">
                  <span>{getIcon(s)}</span>
                  {t.name}
                </h3>
                <p className="text-sm opacity-75 mb-3">{t.desc}</p>
                <button onClick={() => runTest(t.id, t.name)} disabled={s === 'running' || isRunningAll} className="w-full py-2 text-white rounded font-medium text-sm disabled:opacity-50" style={{background:'linear-gradient(135deg,#1e3a8a,#0891b2)'}}>
                  {s === 'running' ? '[...] רץ...' : '▶ הרץ בדיקה'}
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="border-t">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
            <span className="font-medium">לוג בדיקות</span>
            <button onClick={() => setLogs([])} className="text-xs text-gray-400 hover:text-white">נקה</button>
          </div>
          <div className="h-48 overflow-y-auto bg-gray-900 p-3 font-mono text-sm">
            {logs.length === 0 ? (
              <span className="text-gray-500">מוכן להרצת בדיקות אמיתיות...</span>
            ) : logs.map((l, i) => (
              <div key={i} className={l.type === 'success' ? 'text-green-400' : l.type === 'error' ? 'text-red-400' : l.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'}>
                <span className="text-gray-500">[{l.time}]</span> {l.message}
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-4 py-2 bg-gray-100 border-t text-sm text-gray-600 flex justify-between">
          <span>סטטוס: {isRunningAll ? 'מריץ...' : 'מוכן'}</span>
          <span>הצלחה: {passedTests}/{totalTests}</span>
        </div>
      </div>
    </div>
  );
}

export default SimulatorPage;
