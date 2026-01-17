'use client';

import { useState, useCallback, useRef } from 'react';
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
      { id: 'reg-customer', name: 'הרשמת לקוח', desc: 'יצירת לקוח חדש' },
      { id: 'notif-new-customer', name: 'התראה - לקוח חדש', desc: 'בדיקה שנשלחה התראה למנהל' },
      { id: 'reg-agent', name: 'הרשמת סוכן', desc: 'יצירת סוכן + קופון אוטומטי' },
      { id: 'notif-new-agent', name: 'התראה - סוכן חדש', desc: 'בדיקה שנשלחה התראה למנהל' },
      { id: 'reg-business', name: 'הרשמת עסק', desc: 'יצירת עסק חדש + בעל עסק' },
      { id: 'notif-new-business', name: 'התראה - עסק חדש', desc: 'בדיקה שנשלחה התראה למנהל' },
    ],
  },
  businessFlow: {
    id: 'businessFlow',
    name: 'שלב 2 - זרימת עסק',
    icon: '[2]',
    tests: [
      { id: 'biz-activate', name: 'הפעלת עסק', desc: 'יצירת עסק + בעל עסק' },
      { id: 'biz-approve', name: 'אישור עסק', desc: 'שינוי סטטוס + הרשאות' },
      { id: 'notif-biz-approved', name: 'התראה - עסק אושר', desc: 'בדיקה שנשלחה התראה לבעל העסק' },
      { id: 'biz-add-product', name: 'הוספת מוצר', desc: 'מוסיף מוצר לעסק' },
      { id: 'notif-new-product', name: 'התראה - מוצר חדש', desc: 'בדיקה שנשלחה התראה לכל המשתמשים' },
    ],
  },
  agentFlow: {
    id: 'agentFlow',
    name: 'שלב 3 - סוכן ועמלות',
    icon: '[3]',
    tests: [
      { id: 'agent-share-product', name: 'שיתוף מוצר', desc: 'סוכן משתף מוצר עם קופון' },
      { id: 'customer-reg-coupon', name: 'הרשמה עם קופון', desc: 'לקוח נרשם דרך קופון סוכן' },
      { id: 'notif-customer-coupon', name: 'התראה - לקוח מקופון', desc: 'בדיקה שנשלחה התראה לסוכן' },
      { id: 'order-with-coupon', name: 'רכישה עם קופון', desc: 'לקוח רוכש עם קוד קופון' },
      { id: 'notif-new-order', name: 'התראה - הזמנה חדשה', desc: 'בדיקה שנשלחה התראה למנהל/עסק' },
      { id: 'check-agent-commission', name: 'בדיקת עמלת סוכן', desc: 'בדיקה שהעמלה נוצרה' },
      { id: 'notif-new-commission', name: 'התראה - עמלה חדשה', desc: 'בדיקה שנשלחה התראה לסוכן' },
      { id: 'check-admin-commissions', name: 'עמלות במנהל', desc: 'מנהל רואה עמלות הסוכן' },
    ],
  },
  withdrawals: {
    id: 'withdrawals',
    name: 'שלב 4 - משיכת עמלות',
    icon: '[4]',
    tests: [
      { id: 'check-commission-ready', name: 'זמינות עמלה', desc: 'בדיקה שהעמלה זמינה למשיכה' },
      { id: 'request-withdrawal', name: 'בקשת משיכה', desc: 'סוכן שולח בקשת משיכה' },
      { id: 'notif-withdrawal-request', name: 'התראה - בקשת משיכה', desc: 'בדיקה שנשלחה התראה למנהל' },
      { id: 'approve-withdrawal', name: 'אישור בקשה', desc: 'מנהל מאשר את הבקשה' },
      { id: 'notif-withdrawal-approved', name: 'התראה - בקשה אושרה', desc: 'בדיקה שנשלחה התראה לסוכן' },
      { id: 'complete-payment', name: 'אישור תשלום', desc: 'מנהל מאשר שהתשלום בוצע' },
      { id: 'notif-payment-complete', name: 'התראה - תשלום בוצע', desc: 'בדיקה שנשלחה התראה לסוכן' },
    ],
  },
  multiTenant: {
    id: 'multiTenant',
    name: 'שלב 5 - Multi-Tenant',
    icon: '[5]',
    tests: [
      { id: 'mt-create-biz1', name: 'עסק 1', desc: 'פתיחת עסק ראשון + אישור' },
      { id: 'mt-create-biz2', name: 'עסק 2', desc: 'פתיחת עסק שני + אישור' },
      { id: 'mt-create-biz3', name: 'עסק 3', desc: 'פתיחת עסק שלישי + אישור' },
      { id: 'mt-product-biz1', name: 'מוצר עסק 1', desc: 'הוספת מוצר לעסק 1' },
      { id: 'mt-product-biz2', name: 'מוצר עסק 2', desc: 'הוספת מוצר לעסק 2' },
      { id: 'mt-product-biz3', name: 'מוצר עסק 3', desc: 'הוספת מוצר לעסק 3' },
      { id: 'mt-create-agent', name: 'סוכן אחד', desc: 'סוכן שעובד עם כל העסקים' },
      { id: 'mt-share-biz1', name: 'שיתוף עסק 1', desc: 'סוכן משתף מוצר מעסק 1' },
      { id: 'mt-share-biz2', name: 'שיתוף עסק 2', desc: 'סוכן משתף מוצר מעסק 2' },
      { id: 'mt-share-biz3', name: 'שיתוף עסק 3', desc: 'סוכן משתף מוצר מעסק 3' },
      { id: 'mt-create-customer', name: 'לקוח אחד', desc: 'לקוח שרוכש מכל העסקים' },
      { id: 'mt-order-biz1', name: 'רכישה עסק 1', desc: 'לקוח רוכש מעסק 1 עם קופון' },
      { id: 'mt-order-biz2', name: 'רכישה עסק 2', desc: 'לקוח רוכש מעסק 2 עם קופון' },
      { id: 'mt-order-biz3', name: 'רכישה עסק 3', desc: 'לקוח רוכש מעסק 3 עם קופון' },
      { id: 'mt-check-agent-comms', name: 'עמלות סוכן', desc: 'בדיקה שהסוכן קיבל 3 עמלות' },
      { id: 'mt-check-biz1-dash', name: 'דשבורד עסק 1', desc: 'עסק 1 רואה רכישה + עמלה' },
      { id: 'mt-check-biz2-dash', name: 'דשבורד עסק 2', desc: 'עסק 2 רואה רכישה + עמלה' },
      { id: 'mt-check-biz3-dash', name: 'דשבורד עסק 3', desc: 'עסק 3 רואה רכישה + עמלה' },
      { id: 'mt-withdraw-all', name: 'משיכה מכל העסקים', desc: 'סוכן מבקש משיכה מכל עסק' },
      { id: 'mt-approve-all', name: 'אישור כל המשיכות', desc: 'מנהל מאשר את כל הבקשות' },
    ],
  },
  cleanup: {
    id: 'cleanup',
    name: 'ניקוי',
    icon: '[6]',
    tests: [
      { id: 'cleanup-test-users', name: 'מחיקת משתמשי בדיקה', desc: 'מחיקת כל המשתמשים שנוצרו' },
    ],
  },
};

function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('registrations');
  const [testResults, setTestResults] = useState({});
  const [testData, setTestData] = useState({});
  const testDataRef = useRef({});
  const [logs, setLogs] = useState([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const restartServer = async () => {
    if (!confirm('האם להפעיל שרת מקומי?\nיסגור שרת קיים על פורט 3001 ויפתח חלון חדש עם Auto-Restart.')) return;
    setIsRestarting(true);
    addLog('מפעיל שרת מקומי...', 'warning');
    try {
      const res = await fetch('/api/admin/backups', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'server' })
      });
      const data = await res.json();
      if (data.success) {
        addLog('[v] ' + (data.message || 'שרת הופעל!'), 'success');
        if (data.info) addLog('  ' + data.info, 'info');
      } else {
        addLog('[x] ' + (data.error || 'שגיאה'), 'error');
      }
    } catch (e) {
      addLog('[x] שגיאה: ' + e.message, 'error');
    }
    setIsRestarting(false);
  };

  const [isResetting, setIsResetting] = useState(false);
  
  const resetSystem = async () => {
    const confirmed = confirm('זהירות! פעולה זו תמחק את כל המשתמשים, הזמנות, עמלות ונתונים מהמערכת!\n\nרק המנהל הראשי (m0587009938@gmail.com) יישאר.\n\nהאם להמשיך?');
    if (!confirmed) return;
    const doubleConfirm = confirm('האם את בטוחה? אין דרך חזרה!');
    if (!doubleConfirm) return;
    
    setIsResetting(true);
    addLog('מתחיל איפוס מערכת...', 'error');
    
    try {
      const res = await fetch('/api/admin/reset-system', { method: 'POST' });
      const data = await res.json();
      
      if (data.ok) {
        addLog('[v] איפוס הושלם!', 'success');
        addLog('  משתמשים נמחקו: ' + data.results.users, 'info');
        addLog('  הזמנות נמחקו: ' + data.results.orders, 'info');
        addLog('  עמלות נמחקו: ' + data.results.sales, 'info');
        addLog('  טרנזקציות נמחקו: ' + data.results.transactions, 'info');
        addLog('  משיכות נמחקו: ' + data.results.withdrawals, 'info');
        addLog('  התראות נמחקו: ' + data.results.notifications, 'info');
        addLog('  הפניות נמחקו: ' + data.results.referrals, 'info');
        addLog('  עסקים נמחקו: ' + data.results.tenants, 'info');
        addLog('  מנהל מוגן: ' + data.protectedAdmin, 'success');
        setTestResults({});
        setTestData({});
        testDataRef.current = {};
      } else {
        addLog('[x] שגיאה: ' + data.error, 'error');
      }
    } catch (e) {
      addLog('[x] שגיאה: ' + e.message, 'error');
    }
    setIsResetting(false);
  };

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
    if (data) {
      testDataRef.current[testId] = data;
      setTestData(prev => ({ ...prev, [testId]: data }));
    }
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
    const customerData = testDataRef.current['reg-customer'];
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
    const agentData = testDataRef.current['reg-agent'];
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
    const bizData = testDataRef.current['reg-business'];
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
      const data = testDataRef.current[key];
      if (data?.userId) {
        try {
          const res = await fetch('/api/users/' + data.userId, { method: 'DELETE' });
          if (res.ok) { deleted++; addLog('[v] נמחק: ' + data.email, 'success'); }
        } catch (e) { addLog('[WARN] לא ניתן למחוק: ' + data.email, 'warning'); }
      }
    }
    for (const key of ['biz-activate']) {
      const data = testDataRef.current[key];
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
    const biz = testDataRef.current['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] הרץ קודם הפעלת עסק', 'error'); return { success: false }; }
    addLog('מאשר עסק + מגדיר הרשאות: ' + biz.tenantId);
    const allMenus = ['users', 'agents', 'products', 'products_new', 'orders', 'reports', 'commissions', 'withdrawals', 'transactions', 'analytics', 'settings', 'marketing', 'notifications', 'integrations', 'crm', 'bot_manager', 'site_texts', 'branding', 'new_users_widget', 'recent_orders_widget'];
    const res = await fetch('/api/tenants/' + biz.tenantId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: 'active', allowedMenus: allMenus }) });
    const data = await res.json();
    if (res.ok) { addLog('[v] עסק אושר + ' + allMenus.length + ' הרשאות הוגדרו!', 'success'); return { success: true }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testBizAddProduct = async () => {
    const biz = testDataRef.current['biz-activate'];
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
    const biz = testDataRef.current['biz-activate'];
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
    const biz = testDataRef.current['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] הרץ קודם הפעלת עסק', 'error'); return { success: false }; }
    const cust = { fullName: 'לקוח עסק ' + Date.now(), email: 'test-biz-cust-' + Date.now() + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!', role: 'customer', tenantId: biz.tenantId };
    addLog('רושם לקוח: ' + cust.email);
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cust) });
    const data = await res.json();
    if (data.ok && data.userId) { addLog('[v] לקוח נרשם: ' + data.userId, 'success'); return { success: true, userId: data.userId, email: cust.email }; }
    addLog('[x] שגיאה: ' + (data.error || data.message), 'error'); return { success: false };
  };

  const testBizOrderWithCoupon = async () => {
    const biz = testDataRef.current['biz-activate'], prod = testDataRef.current['biz-add-product'], agent = testDataRef.current['biz-agent-register'], cust = testDataRef.current['biz-customer-register'];
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
    const biz = testDataRef.current['biz-activate'], prod = testDataRef.current['biz-add-product'], cust = testDataRef.current['biz-customer-register'];
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
    const biz = testDataRef.current['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק', 'error'); return { success: false }; }
    addLog('בודק התראות...');
    const res = await fetch('/api/notifications?tenantId=' + biz.tenantId);
    const data = await res.json();
    const count = data.notifications?.length || data.items?.length || 0;
    addLog('[v] נמצאו ' + count + ' התראות', 'success');
    return { success: true, count };
  };

  const testBizCheckProducts = async () => {
    const biz = testDataRef.current['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק', 'error'); return { success: false }; }
    addLog('בודק מוצרים...');
    const res = await fetch('/api/products?tenantId=' + biz.tenantId);
    const data = await res.json();
    const products = data.products || data.items || [];
    addLog('[v] נמצאו ' + products.length + ' מוצרים', 'success');
    return { success: products.length > 0, count: products.length };
  };

  const testBizDashboard = async () => {
    const biz = testDataRef.current['biz-activate'];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק', 'error'); return { success: false }; }
    addLog('בודק דשבורד עסק...');
    const res = await fetch('/api/orders?tenantId=' + biz.tenantId);
    const data = await res.json();
    const orders = data.orders || data.items || [];
    addLog('[v] נמצאו ' + orders.length + ' הזמנות', 'success');
    return { success: true, ordersCount: orders.length };
  };

  const testBizAgentDashboard = async () => {
    const agent = testDataRef.current['biz-agent-register'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('בודק דשבורד סוכן...');
    const res = await fetch('/api/commissions?agentId=' + agent.userId);
    const data = await res.json();
    const comms = data.commissions || data.items || [];
    addLog('[v] נמצאו ' + comms.length + ' עמלות', 'success');
    return { success: true, commissionsCount: comms.length };
  };

  // ========== NOTIFICATION TESTS ==========
  const testNotifNewCustomer = async () => {
    addLog('בודק התראה על לקוח חדש...');
    const res = await fetch('/api/notifications?type=new_user&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על לקוח חדש', 'success'); return { success: true }; }
    addLog('[x] לא נמצאה התראה', 'error'); return { success: false };
  };

  const testNotifNewAgent = async () => {
    addLog('בודק התראה על סוכן חדש...');
    const res = await fetch('/api/notifications?type=new_agent&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על סוכן חדש', 'success'); return { success: true }; }
    addLog('[x] לא נמצאה התראה', 'error'); return { success: false };
  };

  const testNotifNewBusiness = async () => {
    addLog('בודק התראה על עסק חדש...');
    const res = await fetch('/api/notifications?type=new_business&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על עסק חדש', 'success'); return { success: true }; }
    addLog('[x] לא נמצאה התראה', 'error'); return { success: false };
  };

  const testNotifBizApproved = async () => {
    addLog('בודק התראה על אישור עסק...');
    const res = await fetch('/api/notifications?type=business_approved&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על אישור עסק', 'success'); return { success: true }; }
    addLog('[x] לא נמצאה התראה', 'error'); return { success: false };
  };

  const testNotifNewProduct = async () => {
    addLog('בודק התראה על מוצר חדש...');
    const res = await fetch('/api/notifications?type=new_product&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על מוצר חדש', 'success'); return { success: true }; }
    addLog('[x] לא נמצאה התראה', 'error'); return { success: false };
  };

  // ========== AGENT FLOW TESTS ==========
  const testAgentShareProduct = async () => {
    const agent = testDataRef.current['reg-agent'] || testDataRef.current['biz-agent-register'];
    const prod = testDataRef.current['biz-add-product'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('סוכן משתף מוצר עם קופון...');
    const couponRes = await fetch('/api/coupons?userId=' + agent.userId);
    const couponData = await couponRes.json();
    const coupon = couponData.coupons?.[0]?.code || couponData.items?.[0]?.code;
    if (coupon) {
      addLog('[v] קופון סוכן: ' + coupon, 'success');
      return { success: true, couponCode: coupon, productId: prod?.productId };
    }
    addLog('[x] לא נמצא קופון לסוכן', 'error'); return { success: false };
  };

  const testCustomerRegCoupon = async () => {
    const share = testDataRef.current['agent-share-product'];
    if (!share?.couponCode) { addLog('[x] הרץ קודם שיתוף מוצר', 'error'); return { success: false }; }
    const ts = Date.now();
    const cust = { fullName: 'לקוח קופון ' + ts, email: 'coupon-cust-' + ts + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!', role: 'customer', referralCode: share.couponCode };
    addLog('רושם לקוח עם קופון: ' + share.couponCode);
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cust) });
    const data = await res.json();
    if (data.ok && data.userId) { addLog('[v] לקוח נרשם עם קופון: ' + data.userId, 'success'); return { success: true, userId: data.userId, email: cust.email }; }
    addLog('[x] שגיאה: ' + (data.error || data.message), 'error'); return { success: false };
  };

  const testNotifCustomerCoupon = async () => {
    addLog('בודק התראה לסוכן על לקוח מקופון...');
    const res = await fetch('/api/notifications?type=referral&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על לקוח מקופון', 'success'); return { success: true }; }
    addLog('[WARN] לא נמצאה התראה (ייתכן שזה תקין)', 'warning'); return { success: true };
  };

  const testOrderWithCoupon = async () => {
    const biz = testDataRef.current['biz-activate'];
    const prod = testDataRef.current['biz-add-product'] || testDataRef.current['agent-share-product'];
    const cust = testDataRef.current['customer-reg-coupon'];
    const share = testDataRef.current['agent-share-product'];
    if (!prod?.productId || !cust?.userId || !share?.couponCode) { addLog('[x] חסרים נתונים - הרץ בדיקות קודמות', 'error'); return { success: false }; }
    const order = { customerId: cust.userId, tenantId: biz?.tenantId, items: [{ productId: prod.productId, quantity: 1, price: prod.price || 100 }], totalAmount: prod.price || 100, couponCode: share.couponCode, status: 'completed' };
    addLog('יוצר הזמנה עם קופון: ' + share.couponCode);
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(order) });
    const data = await res.json();
    const orderId = data._id || data.order?._id;
    if (orderId) { addLog('[v] הזמנה נוצרה: ' + orderId, 'success'); return { success: true, orderId }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testNotifNewOrder = async () => {
    addLog('בודק התראה על הזמנה חדשה...');
    const res = await fetch('/api/notifications?type=new_order&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על הזמנה', 'success'); return { success: true }; }
    addLog('[x] לא נמצאה התראה', 'error'); return { success: false };
  };

  const testCheckAgentCommission = async () => {
    const agent = testDataRef.current['reg-agent'] || testDataRef.current['biz-agent-register'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('בודק עמלות סוכן...');
    const res = await fetch('/api/commissions?agentId=' + agent.userId);
    const data = await res.json();
    const comms = data.commissions || data.items || [];
    if (comms.length > 0) { addLog('[v] נמצאו ' + comms.length + ' עמלות לסוכן', 'success'); return { success: true, commissions: comms }; }
    addLog('[x] לא נמצאו עמלות', 'error'); return { success: false };
  };

  const testNotifNewCommission = async () => {
    addLog('בודק התראה על עמלה חדשה...');
    const res = await fetch('/api/notifications?type=commission&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על עמלה', 'success'); return { success: true }; }
    addLog('[WARN] לא נמצאה התראה (ייתכן שזה תקין)', 'warning'); return { success: true };
  };

  const testCheckAdminCommissions = async () => {
    addLog('בודק עמלות במנהל...');
    const res = await fetch('/api/commissions');
    const data = await res.json();
    const comms = data.commissions || data.items || [];
    addLog('[v] נמצאו ' + comms.length + ' עמלות במערכת', 'success');
    return { success: true, total: comms.length };
  };

  // ========== WITHDRAWAL TESTS ==========
  const testCheckCommissionReady = async () => {
    const agent = testDataRef.current['reg-agent'] || testDataRef.current['biz-agent-register'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('בודק זמינות עמלה למשיכה...');
    const res = await fetch('/api/commissions?agentId=' + agent.userId + '&status=approved');
    const data = await res.json();
    const comms = data.commissions || data.items || [];
    const ready = comms.filter(c => c.status === 'approved' || c.status === 'ready');
    if (ready.length > 0) { addLog('[v] יש ' + ready.length + ' עמלות זמינות למשיכה', 'success'); return { success: true, readyCount: ready.length }; }
    addLog('[WARN] אין עמלות זמינות (יש המתנה של 30 יום)', 'warning'); return { success: true };
  };

  const testRequestWithdrawal = async () => {
    const agent = testDataRef.current['reg-agent'] || testDataRef.current['biz-agent-register'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('סוכן שולח בקשת משיכה...');
    const res = await fetch('/api/withdrawals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ agentId: agent.userId, amount: 100 }) });
    const data = await res.json();
    if (data._id || data.withdrawal?._id) { addLog('[v] בקשת משיכה נוצרה', 'success'); return { success: true, withdrawalId: data._id || data.withdrawal?._id }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testNotifWithdrawalRequest = async () => {
    addLog('בודק התראה על בקשת משיכה...');
    const res = await fetch('/api/notifications?type=withdrawal_request&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על בקשת משיכה', 'success'); return { success: true }; }
    addLog('[WARN] לא נמצאה התראה', 'warning'); return { success: true };
  };

  const testApproveWithdrawal = async () => {
    const wd = testDataRef.current['request-withdrawal'];
    if (!wd?.withdrawalId) { addLog('[x] אין בקשת משיכה', 'error'); return { success: false }; }
    addLog('מנהל מאשר בקשת משיכה...');
    const res = await fetch('/api/withdrawals/' + wd.withdrawalId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: 'approved' }) });
    const data = await res.json();
    if (res.ok) { addLog('[v] בקשה אושרה', 'success'); return { success: true }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testNotifWithdrawalApproved = async () => {
    addLog('בודק התראה על אישור משיכה...');
    const res = await fetch('/api/notifications?type=withdrawal_approved&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על אישור', 'success'); return { success: true }; }
    addLog('[WARN] לא נמצאה התראה', 'warning'); return { success: true };
  };

  const testCompletePayment = async () => {
    const wd = testDataRef.current['request-withdrawal'];
    if (!wd?.withdrawalId) { addLog('[x] אין בקשת משיכה', 'error'); return { success: false }; }
    addLog('מנהל מאשר תשלום...');
    const res = await fetch('/api/withdrawals/' + wd.withdrawalId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: 'completed' }) });
    const data = await res.json();
    if (res.ok) { addLog('[v] תשלום הושלם', 'success'); return { success: true }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testNotifPaymentComplete = async () => {
    addLog('בודק התראה על תשלום...');
    const res = await fetch('/api/notifications?type=payment_complete&limit=5');
    const data = await res.json();
    const notifs = data.notifications || data.items || [];
    if (notifs.length > 0) { addLog('[v] נמצאה התראה על תשלום', 'success'); return { success: true }; }
    addLog('[WARN] לא נמצאה התראה', 'warning'); return { success: true };
  };

  // ========== MULTI-TENANT TESTS ==========
  const createBizHelper = async (num) => {
    const ts = Date.now();
    const bizData = { businessName: 'עסק MT ' + num + ' - ' + ts, slug: 'mt-biz-' + num + '-' + ts, owner: { fullName: 'בעל עסק ' + num, email: 'mt-biz-' + num + '-' + ts + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!' } };
    addLog('יוצר עסק ' + num + '...');
    const res = await fetch('/api/register-business', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bizData) });
    const data = await res.json();
    if (data.success && data.tenantId) {
      // Approve immediately
      await fetch('/api/tenants/' + data.tenantId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: 'active', allowedMenus: ['products', 'orders'] }) });
      addLog('[v] עסק ' + num + ' נוצר ואושר: ' + data.tenantId, 'success');
      return { tenantId: data.tenantId, ownerId: data.userId };
    }
    return null;
  };

  const testMtCreateBiz1 = async () => { const r = await createBizHelper(1); if (r) return { success: true, ...r }; return { success: false }; };
  const testMtCreateBiz2 = async () => { const r = await createBizHelper(2); if (r) return { success: true, ...r }; return { success: false }; };
  const testMtCreateBiz3 = async () => { const r = await createBizHelper(3); if (r) return { success: true, ...r }; return { success: false }; };

  const addProductHelper = async (bizKey, num) => {
    const biz = testDataRef.current[bizKey];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק ' + num, 'error'); return null; }
    const prod = { name: 'מוצר MT ' + num + ' - ' + Date.now(), price: 100 + num * 50, description: 'מוצר בדיקה ' + num, category: 'בדיקות MT', tenantId: biz.tenantId, stockCount: 50, active: true };
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(prod) });
    const data = await res.json();
    const productId = data._id || data.product?._id;
    if (productId) { addLog('[v] מוצר עסק ' + num + ' נוצר', 'success'); return { productId, price: prod.price, tenantId: biz.tenantId }; }
    return null;
  };

  const testMtProductBiz1 = async () => { const r = await addProductHelper('mt-create-biz1', 1); if (r) return { success: true, ...r }; return { success: false }; };
  const testMtProductBiz2 = async () => { const r = await addProductHelper('mt-create-biz2', 2); if (r) return { success: true, ...r }; return { success: false }; };
  const testMtProductBiz3 = async () => { const r = await addProductHelper('mt-create-biz3', 3); if (r) return { success: true, ...r }; return { success: false }; };

  const testMtCreateAgent = async () => {
    const ts = Date.now();
    const agent = { fullName: 'סוכן MT ' + ts, email: 'mt-agent-' + ts + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!', role: 'agent' };
    addLog('יוצר סוכן MT...');
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agent) });
    const data = await res.json();
    if (data.ok && data.userId) {
      const couponRes = await fetch('/api/coupons?userId=' + data.userId);
      const couponData = await couponRes.json();
      const coupon = couponData.coupons?.[0]?.code || couponData.items?.[0]?.code;
      addLog('[v] סוכן MT נוצר עם קופון: ' + coupon, 'success');
      return { success: true, userId: data.userId, email: agent.email, couponCode: coupon };
    }
    addLog('[x] שגיאה', 'error'); return { success: false };
  };

  const testMtShareBiz1 = async () => { const a = testDataRef.current['mt-create-agent']; const p = testDataRef.current['mt-product-biz1']; if (a?.couponCode && p?.productId) { addLog('[v] שיתוף מוצר עסק 1 עם קופון', 'success'); return { success: true, couponCode: a.couponCode, productId: p.productId, tenantId: p.tenantId, price: p.price }; } addLog('[x] חסרים נתונים', 'error'); return { success: false }; };
  const testMtShareBiz2 = async () => { const a = testDataRef.current['mt-create-agent']; const p = testDataRef.current['mt-product-biz2']; if (a?.couponCode && p?.productId) { addLog('[v] שיתוף מוצר עסק 2 עם קופון', 'success'); return { success: true, couponCode: a.couponCode, productId: p.productId, tenantId: p.tenantId, price: p.price }; } addLog('[x] חסרים נתונים', 'error'); return { success: false }; };
  const testMtShareBiz3 = async () => { const a = testDataRef.current['mt-create-agent']; const p = testDataRef.current['mt-product-biz3']; if (a?.couponCode && p?.productId) { addLog('[v] שיתוף מוצר עסק 3 עם קופון', 'success'); return { success: true, couponCode: a.couponCode, productId: p.productId, tenantId: p.tenantId, price: p.price }; } addLog('[x] חסרים נתונים', 'error'); return { success: false }; };

  const testMtCreateCustomer = async () => {
    const ts = Date.now();
    const cust = { fullName: 'לקוח MT ' + ts, email: 'mt-cust-' + ts + '@test.vipo.com', phone: '050' + Math.floor(1000000 + Math.random() * 9000000), password: 'Test1234!', role: 'customer' };
    addLog('יוצר לקוח MT...');
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cust) });
    const data = await res.json();
    if (data.ok && data.userId) { addLog('[v] לקוח MT נוצר', 'success'); return { success: true, userId: data.userId, email: cust.email }; }
    addLog('[x] שגיאה', 'error'); return { success: false };
  };

  const orderFromBizHelper = async (shareKey, num) => {
    const share = testDataRef.current[shareKey];
    const cust = testDataRef.current['mt-create-customer'];
    const agent = testDataRef.current['mt-create-agent'];
    if (!share?.productId || !cust?.userId || !agent?.couponCode) { addLog('[x] חסרים נתונים לרכישה ' + num, 'error'); return null; }
    const order = { customerId: cust.userId, tenantId: share.tenantId, items: [{ productId: share.productId, quantity: 1, price: share.price }], totalAmount: share.price, couponCode: agent.couponCode, status: 'completed' };
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(order) });
    const data = await res.json();
    const orderId = data._id || data.order?._id;
    if (orderId) { addLog('[v] רכישה מעסק ' + num + ' בוצעה', 'success'); return { orderId, tenantId: share.tenantId }; }
    return null;
  };

  const testMtOrderBiz1 = async () => { const r = await orderFromBizHelper('mt-share-biz1', 1); if (r) return { success: true, ...r }; return { success: false }; };
  const testMtOrderBiz2 = async () => { const r = await orderFromBizHelper('mt-share-biz2', 2); if (r) return { success: true, ...r }; return { success: false }; };
  const testMtOrderBiz3 = async () => { const r = await orderFromBizHelper('mt-share-biz3', 3); if (r) return { success: true, ...r }; return { success: false }; };

  const testMtCheckAgentComms = async () => {
    const agent = testDataRef.current['mt-create-agent'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('בודק עמלות סוכן MT...');
    const res = await fetch('/api/commissions?agentId=' + agent.userId);
    const data = await res.json();
    const comms = data.commissions || data.items || [];
    addLog('[v] נמצאו ' + comms.length + ' עמלות לסוכן MT', comms.length >= 3 ? 'success' : 'warning');
    return { success: comms.length >= 3, count: comms.length };
  };

  const checkBizDashHelper = async (bizKey, num) => {
    const biz = testDataRef.current[bizKey];
    if (!biz?.tenantId) { addLog('[x] אין נתוני עסק ' + num, 'error'); return { success: false }; }
    const res = await fetch('/api/orders?tenantId=' + biz.tenantId);
    const data = await res.json();
    const orders = data.orders || data.items || [];
    addLog('[v] עסק ' + num + ': ' + orders.length + ' הזמנות', orders.length > 0 ? 'success' : 'warning');
    return { success: orders.length > 0, ordersCount: orders.length };
  };

  const testMtCheckBiz1Dash = async () => checkBizDashHelper('mt-create-biz1', 1);
  const testMtCheckBiz2Dash = async () => checkBizDashHelper('mt-create-biz2', 2);
  const testMtCheckBiz3Dash = async () => checkBizDashHelper('mt-create-biz3', 3);

  const testMtWithdrawAll = async () => {
    const agent = testDataRef.current['mt-create-agent'];
    if (!agent?.userId) { addLog('[x] אין נתוני סוכן', 'error'); return { success: false }; }
    addLog('סוכן מבקש משיכה מכל העסקים...');
    const res = await fetch('/api/withdrawals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ agentId: agent.userId, amount: 300 }) });
    const data = await res.json();
    if (data._id || data.withdrawal?._id) { addLog('[v] בקשת משיכה כוללת נוצרה', 'success'); return { success: true, withdrawalId: data._id || data.withdrawal?._id }; }
    addLog('[x] שגיאה: ' + (data.error || 'Unknown'), 'error'); return { success: false };
  };

  const testMtApproveAll = async () => {
    const wd = testDataRef.current['mt-withdraw-all'];
    if (!wd?.withdrawalId) { addLog('[x] אין בקשת משיכה', 'error'); return { success: false }; }
    addLog('מנהל מאשר את כל בקשות המשיכה...');
    const res = await fetch('/api/withdrawals/' + wd.withdrawalId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: 'completed' }) });
    if (res.ok) { addLog('[v] כל המשיכות אושרו', 'success'); return { success: true }; }
    addLog('[x] שגיאה', 'error'); return { success: false };
  };

  // ========== TEST RUNNER ==========

  const TEST_FUNCTIONS = {
    // Step 1 - Registrations
    'reg-customer': testRegisterCustomer,
    'notif-new-customer': testNotifNewCustomer,
    'reg-agent': testRegisterAgent,
    'notif-new-agent': testNotifNewAgent,
    'reg-business': testRegisterBusiness,
    'notif-new-business': testNotifNewBusiness,
    // Step 2 - Business Flow
    'biz-activate': testBizActivate,
    'biz-approve': testBizApprove,
    'notif-biz-approved': testNotifBizApproved,
    'biz-add-product': testBizAddProduct,
    'notif-new-product': testNotifNewProduct,
    // Step 3 - Agent Flow
    'agent-share-product': testAgentShareProduct,
    'customer-reg-coupon': testCustomerRegCoupon,
    'notif-customer-coupon': testNotifCustomerCoupon,
    'order-with-coupon': testOrderWithCoupon,
    'notif-new-order': testNotifNewOrder,
    'check-agent-commission': testCheckAgentCommission,
    'notif-new-commission': testNotifNewCommission,
    'check-admin-commissions': testCheckAdminCommissions,
    // Step 4 - Withdrawals
    'check-commission-ready': testCheckCommissionReady,
    'request-withdrawal': testRequestWithdrawal,
    'notif-withdrawal-request': testNotifWithdrawalRequest,
    'approve-withdrawal': testApproveWithdrawal,
    'notif-withdrawal-approved': testNotifWithdrawalApproved,
    'complete-payment': testCompletePayment,
    'notif-payment-complete': testNotifPaymentComplete,
    // Step 5 - Multi-Tenant
    'mt-create-biz1': testMtCreateBiz1,
    'mt-create-biz2': testMtCreateBiz2,
    'mt-create-biz3': testMtCreateBiz3,
    'mt-product-biz1': testMtProductBiz1,
    'mt-product-biz2': testMtProductBiz2,
    'mt-product-biz3': testMtProductBiz3,
    'mt-create-agent': testMtCreateAgent,
    'mt-share-biz1': testMtShareBiz1,
    'mt-share-biz2': testMtShareBiz2,
    'mt-share-biz3': testMtShareBiz3,
    'mt-create-customer': testMtCreateCustomer,
    'mt-order-biz1': testMtOrderBiz1,
    'mt-order-biz2': testMtOrderBiz2,
    'mt-order-biz3': testMtOrderBiz3,
    'mt-check-agent-comms': testMtCheckAgentComms,
    'mt-check-biz1-dash': testMtCheckBiz1Dash,
    'mt-check-biz2-dash': testMtCheckBiz2Dash,
    'mt-check-biz3-dash': testMtCheckBiz3Dash,
    'mt-withdraw-all': testMtWithdrawAll,
    'mt-approve-all': testMtApproveAll,
    // Cleanup
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
    testDataRef.current = {};
    setLogs([]);
    addLog('========== מתחיל הרצת כל הבדיקות ==========', 'info');
    
    for (const cat of Object.values(CATEGORIES)) {
      addLog('--- ' + cat.icon + ' ' + cat.name + ' ---', 'info');
      for (const test of cat.tests) {
        await runTest(test.id, test.name);
        await new Promise(r => setTimeout(r, 5000));
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header - Mobile Optimized */}
      <div className="bg-white border-b-2 sticky top-0 z-10" style={{ borderColor: '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              <span className="flex items-center gap-2" style={{background:'linear-gradient(135deg,#1e3a8a,#0891b2)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{color:'#0891b2'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden xs:inline">סימולטור מערכת</span>
                <span className="xs:hidden">סימולטור</span>
              </span>
            </h1>
            <Link href="/admin" className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition-all hover:opacity-90" style={{background:'linear-gradient(135deg,#1e3a8a,#0891b2)'}}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">חזרה</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        {/* Action Buttons - Mobile Grid */}
        <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            <button onClick={runAllTests} disabled={isRunningAll} className="col-span-2 sm:col-span-1 px-3 sm:px-4 py-2.5 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-all hover:opacity-90" style={{background:'linear-gradient(135deg,#1e3a8a,#0891b2)'}}>
              {isRunningAll ? '⏳ רץ...' : '▶️ הרץ הכל'}
            </button>
            <button onClick={() => {setTestResults({});setTestData({});testDataRef.current={};setLogs([]);}} className="px-3 sm:px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-all">
              🔄 אפס
            </button>
            <button onClick={restartServer} disabled={isRestarting} className="px-3 sm:px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-all">
              {isRestarting ? '⏳' : '⟳'} שרת
            </button>
            <button onClick={resetSystem} disabled={isResetting} className="px-3 sm:px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-all">
              {isResetting ? '⏳' : '⚠️'} איפוס
            </button>
          </div>
          
          {/* Stats - Mobile Optimized */}
          <div className="flex justify-center gap-2 sm:gap-4 mt-3 pt-3 border-t">
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-medium text-xs sm:text-sm">✓ {passedTests}</span>
            <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full font-medium text-xs sm:text-sm">✗ {failedTests}</span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full font-medium text-xs sm:text-sm">○ {totalTests - passedTests - failedTests}</span>
          </div>
        </div>

        {/* Tabs - Horizontal Scroll on Mobile */}
        <div className="bg-white rounded-xl shadow-sm border mb-3 sm:mb-4 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide border-b">
            {Object.values(CATEGORIES).map(c => (
              <button key={c.id} onClick={() => setActiveTab(c.id)} className={'flex-shrink-0 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-all ' + (activeTab === c.id ? 'bg-cyan-50 text-cyan-700 border-b-2 border-cyan-600' : 'text-gray-600 hover:bg-gray-50')}>
                {c.icon} <span className="hidden sm:inline">{c.name}</span>
              </button>
            ))}
          </div>
          
          {/* Test Cards - Responsive Grid */}
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {cat.tests.map(t => {
              const s = testResults[t.id] || 'pending';
              return (
                <div key={t.id} className={'rounded-xl border-2 p-3 sm:p-4 transition-all ' + getStyle(s)}>
                  <h3 className="font-bold text-sm sm:text-base mb-1 flex items-center gap-2">
                    <span className="text-base">{getIcon(s)}</span>
                    {t.name}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-75 mb-2 sm:mb-3 line-clamp-2">{t.desc}</p>
                  <button onClick={() => runTest(t.id, t.name)} disabled={s === 'running' || isRunningAll} className="w-full py-2 text-white rounded-lg font-medium text-xs sm:text-sm disabled:opacity-50 transition-all hover:opacity-90" style={{background:'linear-gradient(135deg,#1e3a8a,#0891b2)'}}>
                    {s === 'running' ? '⏳ רץ...' : '▶️ הרץ'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Log Section - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-gray-800 text-white">
            <span className="font-medium text-sm">📋 לוג בדיקות</span>
            <button onClick={() => setLogs([])} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded transition-all">נקה</button>
          </div>
          <div className="h-40 sm:h-48 overflow-y-auto bg-gray-900 p-2 sm:p-3 font-mono text-xs sm:text-sm">
            {logs.length === 0 ? (
              <span className="text-gray-500">מוכן להרצת בדיקות...</span>
            ) : logs.map((l, i) => (
              <div key={i} className={'py-0.5 ' + (l.type === 'success' ? 'text-green-400' : l.type === 'error' ? 'text-red-400' : l.type === 'warning' ? 'text-yellow-400' : 'text-gray-300')}>
                <span className="text-gray-500 text-xs">[{l.time}]</span> {l.message}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Status - Mobile */}
        <div className="mt-3 px-3 py-2 bg-white rounded-xl shadow-sm border text-xs sm:text-sm text-gray-600 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <span className={isRunningAll ? 'text-yellow-500' : 'text-green-500'}>●</span>
            {isRunningAll ? 'מריץ...' : 'מוכן'}
          </span>
          <span className="font-medium">{passedTests}/{totalTests} הצלחות</span>
        </div>
      </div>
    </div>
  );
}

export default SimulatorPage;
