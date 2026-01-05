import { getDb } from '@/lib/db';

const COLLECTION = 'notificationTemplates';

const DEFAULT_TEMPLATES = [
  {
    type: 'welcome_user',
    audience: ['customer', 'agent'],
    title: 'ברוכים הבאים ל-vipogroup',
    body:
      'ברוך הבא ל-vipogroup! ההרשמה שלך הושלמה בהצלחה. כאן תוכל ליהנות מרכישות קבוצתיות, מחירים חכמים והזדמנויות ייחודיות.',
    variables: [],
    description: 'הודעת פתיחה לאחר הרשמה של לקוח או סוכן.',
  },
  {
    type: 'admin_new_registration',
    audience: ['admin'],
    title: 'הצטרפות חדשה למערכת',
    body: 'נרשמה הצטרפות חדשה ל-vipogroup. סוג משתמש: {{user_type}}. תאריך ושעה: {{datetime}}.',
    variables: ['user_type', 'datetime'],
    description: 'התראה למנהל על משתמש חדש.',
  },
  {
    type: 'order_confirmation',
    audience: ['customer'],
    title: 'הרכישה שלך ב-vipogroup הושלמה',
    body: 'תודה רבה על הרכישה! התשלום התקבל בהצלחה וההזמנה נקלטה במערכת. ניתן לצפות בפרטי ההזמנה באזור האישי.',
    variables: ['order_id'],
    description: 'אישור רכישה ללקוח.',
  },
  {
    type: 'agent_commission_awarded',
    audience: ['agent'],
    title: 'הרווחת עמלה חדשה 🎉',
    body: 'בוצעה רכישה דרך הלינק או קוד הקופון שלך ב-vipogroup. עמלה לזכותך: {{commission_percent}}% (הוספה לחשבון הסוכן שלך).',
    variables: ['commission_percent'],
    description: 'התראה לסוכן על עמלה חדשה.',
  },
  {
    type: 'admin_agent_sale',
    audience: ['admin'],
    title: 'רכישה דרך קוד סוכן',
    body: 'בוצעה רכישה דרך קוד קופון של סוכן. הסוכן זכאי לעמלה בהתאם למדיניות vipogroup.',
    variables: ['agent_name', 'order_id'],
    description: 'התראה למנהל על רכישה שנעשתה דרך קוד סוכן.',
  },
  {
    type: 'admin_payment_completed',
    audience: ['admin'],
    title: 'מכירה חדשה שולמה',
    body: 'תשלום הושלם בהצלחה ב-vipogroup והעסקה נקלטה במערכת.',
    variables: ['order_id', 'amount'],
    description: 'התראה למנהל על השלמת תשלום.',
  },
  {
    type: 'order_new',
    audience: ['admin'],
    title: 'התקבלה הזמנה חדשה',
    body:
      'התקבלה הזמנה חדשה במערכת. לקוח: {{customer_name}} · סכום: {{total_amount}} ₪ · מזהה: {{order_id}}.',
    variables: ['order_id', 'customer_name', 'total_amount'],
    description: 'התראת PUSH למנהלים על הזמנה חדשה שנוצרה.',
  },
  {
    type: 'agent_daily_digest',
    audience: ['agent'],
    title: 'דוח יומי – פעילות ועמלות ב-vipogroup',
    body:
      'שלום {{agent_name}}, זהו סיכום הפעילות שלך להיום: כניסות דרך הלינק שלך: {{visits}} · רכישות שבוצעו: {{orders}} · סך עמלות שנצברו היום: {{commission}} ₪. המשך לשתף ולהרוויח!',
    variables: ['agent_name', 'visits', 'orders', 'commission'],
    description: 'דוח יומי לסוכן.',
  },
  {
    type: 'product_new_release',
    audience: ['customer', 'agent'],
    title: 'מוצר חדש עלה ל-vipogroup 🔥',
    body: 'מוצר חדש נוסף ל-vipogroup ועכשיו זמין לרכישה. זה הזמן להיכנס ולבדוק!',
    variables: ['product_name', 'product_url'],
    description: 'התראה על מוצר חדש במערכת.',
  },
  {
    type: 'group_buy_weekly_reminder',
    audience: ['customer'],
    title: 'תזכורת – הרכישה הקבוצתית עדיין פתוחה ⏳',
    body: 'הרכישה הקבוצתית בה נרשמת עדיין פתוחה. זמן שנותר עד הסגירה: {{time_left}}. הצטרף עכשיו ואל תפספס את המחיר הקבוצתי.',
    variables: ['time_left', 'group_name'],
    description: 'תזכורת חוזרת עבור רכישה קבוצתית פתוחה.',
  },
  {
    type: 'group_buy_last_call',
    audience: ['customer'],
    title: '⏰ 24 שעות אחרונות לרכישה הקבוצתית',
    body: 'בעוד 24 שעות הרכישה הקבוצתית ב-vipogroup נסגרת. אם עוד לא רכשת, זו ההזדמנות האחרונה ליהנות מהמחיר הקבוצתי.',
    variables: ['group_name'],
    description: 'תזכורת 24 שעות לפני סגירה.',
  },
  {
    type: 'group_buy_closed',
    audience: ['customer'],
    title: 'הרכישה הקבוצתית נסגרה',
    body: 'הרכישה הקבוצתית ב-vipogroup נסגרה בהצלחה. תודה לכל המשתתפים! מכירות חדשות והזדמנויות נוספות יעלו בקרוב.',
    variables: ['group_name'],
    description: 'התראה על סגירת רכישה קבוצתית.',
  },
  {
    type: 'withdrawal_approved',
    audience: ['agent'],
    title: 'בקשת המשיכה שלך אושרה ✅',
    body: 'בקשת המשיכה שלך על סך {{amount}} ₪ אושרה ונמצאת בטיפול. ההעברה תבוצע בהקדם.',
    variables: ['amount'],
    description: 'התראה לסוכן כאשר בקשת המשיכה שלו אושרה.',
  },
  {
    type: 'withdrawal_completed',
    audience: ['agent'],
    title: 'ההעברה בוצעה בהצלחה! 💰',
    body: 'העברת הכספים על סך {{amount}} ₪ בוצעה בהצלחה לפי פרטי התשלום שסיפקת. תודה שאתה חלק מ-vipogroup!',
    variables: ['amount'],
    description: 'התראה לסוכן כאשר העברת הכספים הושלמה.',
  },
  {
    type: 'withdrawal_rejected',
    audience: ['agent'],
    title: 'בקשת המשיכה נדחתה ❌',
    body: 'בקשת המשיכה שלך על סך {{amount}} ₪ נדחתה. סיבה: {{reason}}. ניתן להגיש בקשה חדשה עם פרטים מעודכנים.',
    variables: ['amount', 'reason'],
    description: 'התראה לסוכן כאשר בקשת המשיכה שלו נדחתה.',
  },
];

async function getCollection() {
  const db = await getDb();
  const col = db.collection(COLLECTION);
  await col.createIndex({ type: 1 }, { unique: true }).catch(() => {});
  await col.createIndex({ audience: 1 }).catch(() => {});
  return col;
}

export async function ensureDefaultTemplates() {
  const col = await getCollection();
  const existing = await col
    .find({}, { projection: { type: 1 } })
    .map((doc) => doc.type)
    .toArray();
  const missing = DEFAULT_TEMPLATES.filter((tpl) => !existing.includes(tpl.type));
  if (missing.length) {
    const now = new Date();
    await col.insertMany(
      missing.map((tpl) => ({
        ...tpl,
        enabled: true,
        createdAt: now,
        updatedAt: now,
        version: 1,
      })),
      { ordered: false },
    ).catch(() => {});
  }
}

function sanitizeAudience(input) {
  if (!Array.isArray(input)) return [];
  const allowed = ['customer', 'agent', 'admin', 'all'];
  const unique = [...new Set(input.map((item) => String(item).toLowerCase().trim()))];
  return unique.filter((item) => allowed.includes(item));
}

function sanitizeVariables(input) {
  if (!Array.isArray(input)) return [];
  const unique = [...new Set(input.map((item) => String(item).trim()).filter(Boolean))];
  return unique.slice(0, 20);
}

export async function listNotificationTemplates() {
  const col = await getCollection();
  await ensureDefaultTemplates();
  return col.find({}).sort({ type: 1 }).toArray();
}

export async function getNotificationTemplate(type) {
  if (!type) return null;
  const col = await getCollection();
  const doc = await col.findOne({ type });
  if (doc) return doc;
  await ensureDefaultTemplates();
  return col.findOne({ type });
}

export async function upsertNotificationTemplate(type, payload) {
  if (!type) {
    throw new Error('template_type_required');
  }
  const col = await getCollection();
  const update = {
    ...(payload.title ? { title: String(payload.title).trim() } : {}),
    ...(payload.body ? { body: String(payload.body).trim() } : {}),
    ...(payload.description ? { description: String(payload.description).trim() } : {}),
  };

  if (payload.audience) {
    update.audience = sanitizeAudience(payload.audience);
  }
  if (payload.variables) {
    update.variables = sanitizeVariables(payload.variables);
  }
  if (typeof payload.enabled === 'boolean') {
    update.enabled = payload.enabled;
  }

  update.updatedAt = new Date();

  // Build $setOnInsert without fields that are already in $set (to avoid MongoDB conflict)
  const setOnInsert = {
    type,
    createdAt: new Date(),
    version: 1,
  };
  
  // Only add to $setOnInsert if not already in $set
  if (!update.audience) {
    setOnInsert.audience = ['all'];
  }
  if (!update.variables) {
    setOnInsert.variables = [];
  }
  if (typeof update.enabled !== 'boolean') {
    setOnInsert.enabled = true;
  }

  const result = await col.findOneAndUpdate(
    { type },
    {
      $set: update,
      $setOnInsert: setOnInsert,
    },
    { upsert: true, returnDocument: 'after' },
  );

  return result.value;
}

export async function removeNotificationTemplate(type) {
  if (!type) return { deletedCount: 0 };
  const col = await getCollection();
  return col.deleteOne({ type });
}
