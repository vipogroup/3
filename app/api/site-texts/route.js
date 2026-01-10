import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import SiteText from '@/models/SiteText';

// Default texts configuration for Home page
const HOME_PAGE_DEFAULTS = {
  HERO_SECTION: [
    { textId: 'HOME_HERO_TITLE', label: 'כותרת ראשית', defaultValue: '🇮🇱 ביחד ננצח 🇮🇱\nנלחמים ביוקר המחייה', previewLocation: 'כותרת ה-Hero בראש העמוד', fieldType: 'textarea', order: 1 },
    { textId: 'HOME_HERO_SUBTITLE', label: 'תת-כותרת', defaultValue: 'רכישה קבוצתית במחיר מפעל - ככה ננצח!', previewLocation: 'מתחת לכותרת הראשית', fieldType: 'text', order: 2 },
    { textId: 'HOME_HERO_CTA_PRIMARY', label: 'כפתור ראשי', defaultValue: 'צפו במוצרים', previewLocation: 'כפתור כחול ראשי', fieldType: 'text', order: 3 },
    { textId: 'HOME_HERO_CTA_SECONDARY', label: 'כפתור משני', defaultValue: 'איך זה עובד?', previewLocation: 'כפתור שקוף משני', fieldType: 'text', order: 4 },
  ],
  VIDEO_SECTION: [
    { textId: 'HOME_VIDEO_CAPTION', label: 'כיתוב לסרטון', defaultValue: 'מעבירים את השליטה בחזרה לעם ונלחמים ביוקר המחייה', previewLocation: 'מתחת לסרטון ההסבר', fieldType: 'text', order: 1 },
  ],
  HOW_IT_WORKS_SECTION: [
    { textId: 'HOME_HOW_TITLE', label: 'כותרת המקטע', defaultValue: 'איך זה עובד?', previewLocation: 'כותרת מקטע איך זה עובד', fieldType: 'text', order: 1 },
    { textId: 'HOME_HOW_STEP_1_TITLE', label: 'שלב 1 - כותרת', defaultValue: 'בחירת מוצר', previewLocation: 'כותרת שלב 1', fieldType: 'text', order: 2 },
    { textId: 'HOME_HOW_STEP_1_TEXT', label: 'שלב 1 - תיאור', defaultValue: 'בוחרים מוצרים במחיר מפעל מהמערכת שלנו עד 50% יותר זול ממחיר השוק', previewLocation: 'תיאור שלב 1', fieldType: 'textarea', order: 3 },
    { textId: 'HOME_HOW_STEP_2_TITLE', label: 'שלב 2 - כותרת', defaultValue: 'הצטרפות לקבוצה', previewLocation: 'כותרת שלב 2', fieldType: 'text', order: 4 },
    { textId: 'HOME_HOW_STEP_2_TEXT', label: 'שלב 2 - תיאור', defaultValue: 'מצטרפים לקבוצת הרכישה בתום ה-30 יום ההזמנה עוברת למפעל לייצור', previewLocation: 'תיאור שלב 2', fieldType: 'textarea', order: 5 },
    { textId: 'HOME_HOW_STEP_3_TITLE', label: 'שלב 3 - כותרת', defaultValue: 'שיתוף', previewLocation: 'כותרת שלב 3', fieldType: 'text', order: 6 },
    { textId: 'HOME_HOW_STEP_3_TEXT', label: 'שלב 3 - תיאור', defaultValue: 'משתפים את החברים ומשפחה כדי להגדיל את הקבוצה וגם מקבלים 10% עמלה על כל רכישה שהגיעה מהשיתוף שלכם', previewLocation: 'תיאור שלב 3', fieldType: 'textarea', order: 7 },
    { textId: 'HOME_HOW_STEP_4_TITLE', label: 'שלב 4 - כותרת', defaultValue: 'המחיר יורד', previewLocation: 'כותרת שלב 4', fieldType: 'text', order: 8 },
    { textId: 'HOME_HOW_STEP_4_TEXT', label: 'שלב 4 - תיאור', defaultValue: 'ככל שיותר חברים מצטרפים, המחיר יורד לכולם', previewLocation: 'תיאור שלב 4', fieldType: 'textarea', order: 9 },
    { textId: 'HOME_HOW_STEP_5_TITLE', label: 'שלב 5 - כותרת', defaultValue: 'סגירת קבוצה', previewLocation: 'כותרת שלב 5', fieldType: 'text', order: 10 },
    { textId: 'HOME_HOW_STEP_5_TEXT', label: 'שלב 5 - תיאור', defaultValue: 'בסיום ההרשמה מקבלים הודעה שמתחילים בייצור ועדכון על זמני הגעה', previewLocation: 'תיאור שלב 5', fieldType: 'textarea', order: 11 },
    { textId: 'HOME_HOW_STEP_6_TITLE', label: 'שלב 6 - כותרת', defaultValue: 'תשלום ומשלוח', previewLocation: 'כותרת שלב 6', fieldType: 'text', order: 12 },
    { textId: 'HOME_HOW_STEP_6_TEXT', label: 'שלב 6 - תיאור', defaultValue: 'עד 24 תשלומים ומשלוח עד הבית (יש איסוף עצמי)', previewLocation: 'תיאור שלב 6', fieldType: 'textarea', order: 13 },
  ],
  TRUST_SECTION: [
    { textId: 'HOME_TRUST_TITLE', label: 'כותרת אמון', defaultValue: 'שאנחנו מאוחדים אנחנו חזקים', previewLocation: 'כותרת מקטע האמון', fieldType: 'text', order: 1 },
    { textId: 'HOME_TRUST_TEXT', label: 'טקסט אמון', defaultValue: 'מצטרפים ורוכשים ב-50% יותר זול ממחיר השוק בישראל ואם הצלחנו להיות מאוחדים וצרפנו חברים ומשפחה אז נקבל עוד הנחה רק ככה ננצח ביחד את יוקר המחייה', previewLocation: 'תיאור במקטע האמון', fieldType: 'textarea', order: 2 },
  ],
  REFERRAL_SECTION: [
    { textId: 'HOME_REFERRAL_TITLE', label: 'כותרת הפניות', defaultValue: 'חבר מביא חבר', previewLocation: 'כותרת מקטע ההפניות', fieldType: 'text', order: 1 },
    { textId: 'HOME_REFERRAL_SUBTITLE', label: 'תת-כותרת הפניות', defaultValue: 'שיתפת – הרווחת', previewLocation: 'תת-כותרת במקטע ההפניות', fieldType: 'text', order: 2 },
    { textId: 'HOME_REFERRAL_TEXT', label: 'תיאור הפניות', defaultValue: 'קבלו תגמול כספי על כל רכישה שמתבצעת באמצעות קוד הקופון או שיתוף מוצר מהאזור האישי שלכם – ללא צורך לקנות בעצמכם 10% על כל רכישה', previewLocation: 'טקסט במקטע ההפניות', fieldType: 'textarea', order: 3 },
    { textId: 'HOME_REFERRAL_BUTTON', label: 'כפתור הפניות', defaultValue: 'משתפים חברים – ומרוויחים בלי לקנות', previewLocation: 'כפתור פתיחת פאנל ההפניות', fieldType: 'text', order: 4 },
    { textId: 'HOME_REFERRAL_CTA', label: 'כפתור CTA', defaultValue: 'פתחו קוד קופון אישי', previewLocation: 'כפתור קריאה לפעולה בפאנל', fieldType: 'text', order: 5 },
  ],
  TARGET_AUDIENCE_SECTION: [
    { textId: 'HOME_TARGET_TITLE', label: 'כותרת קהל יעד', defaultValue: 'למי זה מתאים', previewLocation: 'כותרת מקטע קהל יעד', fieldType: 'text', order: 1 },
    { textId: 'HOME_TARGET_1_TITLE', label: 'קהל 1 - כותרת', defaultValue: 'משפחות', previewLocation: 'כותרת כרטיס משפחות', fieldType: 'text', order: 2 },
    { textId: 'HOME_TARGET_1_TEXT', label: 'קהל 1 - תיאור', defaultValue: 'חיסכון משמעותי במוצרים לבית ולמשפחה', previewLocation: 'תיאור כרטיס משפחות', fieldType: 'text', order: 3 },
    { textId: 'HOME_TARGET_2_TITLE', label: 'קהל 2 - כותרת', defaultValue: 'עסקים קטנים', previewLocation: 'כותרת כרטיס עסקים', fieldType: 'text', order: 4 },
    { textId: 'HOME_TARGET_2_TEXT', label: 'קהל 2 - תיאור', defaultValue: 'ציוד משרדי ומוצרים לעסק במחירים מוזלים', previewLocation: 'תיאור כרטיס עסקים', fieldType: 'text', order: 5 },
    { textId: 'HOME_TARGET_3_TITLE', label: 'קהל 3 - כותרת', defaultValue: 'יזמים', previewLocation: 'כותרת כרטיס יזמים', fieldType: 'text', order: 6 },
    { textId: 'HOME_TARGET_3_TEXT', label: 'קהל 3 - תיאור', defaultValue: 'הזדמנות לרכישת מוצרים איכותיים בעלות נמוכה', previewLocation: 'תיאור כרטיס יזמים', fieldType: 'text', order: 7 },
    { textId: 'HOME_TARGET_4_TITLE', label: 'קהל 4 - כותרת', defaultValue: 'מוסדות', previewLocation: 'כותרת כרטיס מוסדות', fieldType: 'text', order: 8 },
    { textId: 'HOME_TARGET_4_TEXT', label: 'קהל 4 - תיאור', defaultValue: 'פתרונות רכש מרוכז למוסדות וארגונים', previewLocation: 'תיאור כרטיס מוסדות', fieldType: 'text', order: 9 },
  ],
  FAQ_SECTION: [
    { textId: 'HOME_FAQ_TITLE', label: 'כותרת שאלות נפוצות', defaultValue: 'שאלות נפוצות', previewLocation: 'כותרת מקטע FAQ', fieldType: 'text', order: 1 },
    { textId: 'HOME_FAQ_1_Q', label: 'שאלה 1', defaultValue: 'האם יש התחייבות כספית?', previewLocation: 'שאלה נפוצה 1', fieldType: 'text', order: 2 },
    { textId: 'HOME_FAQ_1_A', label: 'תשובה 1', defaultValue: 'לא, אין שום התחייבות כספית. התשלום רק לאחר סגירת הקבוצה ורק אם אתם מעוניינים.', previewLocation: 'תשובה לשאלה 1', fieldType: 'textarea', order: 3 },
    { textId: 'HOME_FAQ_2_Q', label: 'שאלה 2', defaultValue: 'איך עובד "חבר מביא חבר"?', previewLocation: 'שאלה נפוצה 2', fieldType: 'text', order: 4 },
    { textId: 'HOME_FAQ_2_A', label: 'תשובה 2', defaultValue: 'כל משתמש מקבל קישור אישי. כאשר חבר מזמין דרך הקישור שלכם, אתם מקבלים תגמול כספי בהתאם לעסקה – ללא צורך לרכוש בעצמכם.', previewLocation: 'תשובה לשאלה 2', fieldType: 'textarea', order: 5 },
    { textId: 'HOME_FAQ_3_Q', label: 'שאלה 3', defaultValue: 'מה אם לא מצטרפים מספיק אנשים?', previewLocation: 'שאלה נפוצה 3', fieldType: 'text', order: 6 },
    { textId: 'HOME_FAQ_3_A', label: 'תשובה 3', defaultValue: 'נמשיך לחכות או נציע לכם לרכוש במחיר הנוכחי. אתם לא מחויבים לרכוש.', previewLocation: 'תשובה לשאלה 3', fieldType: 'textarea', order: 7 },
    { textId: 'HOME_FAQ_4_Q', label: 'שאלה 4', defaultValue: 'כיצד מתבצע המשלוח?', previewLocation: 'שאלה נפוצה 4', fieldType: 'text', order: 8 },
    { textId: 'HOME_FAQ_4_A', label: 'תשובה 4', defaultValue: 'משלוח ישירות לכתובת שלכם. זמן אספקה: 7-14 ימי עסקים. עלות כלולה במחיר.', previewLocation: 'תשובה לשאלה 4', fieldType: 'textarea', order: 9 },
    { textId: 'HOME_FAQ_5_Q', label: 'שאלה 5', defaultValue: 'האם יש אחריות על המוצרים?', previewLocation: 'שאלה נפוצה 5', fieldType: 'text', order: 10 },
    { textId: 'HOME_FAQ_5_A', label: 'תשובה 5', defaultValue: 'כן, כל המוצרים עם אחריות מלאה של היבואן הרשמי בישראל.', previewLocation: 'תשובה לשאלה 5', fieldType: 'textarea', order: 11 },
  ],
  TESTIMONIALS_SECTION: [
    { textId: 'HOME_TESTIMONIALS_TITLE', label: 'כותרת המלצות', defaultValue: 'לקוחות מספרים', previewLocation: 'כותרת מקטע ההמלצות', fieldType: 'text', order: 1 },
    { textId: 'HOME_TESTIMONIAL_1_TEXT', label: 'המלצה 1 - טקסט', defaultValue: 'חסכתי 700 ₪ על מכונת כביסה!', previewLocation: 'טקסט המלצה 1', fieldType: 'text', order: 2 },
    { textId: 'HOME_TESTIMONIAL_1_AUTHOR', label: 'המלצה 1 - שם', defaultValue: 'מיכל כהן', previewLocation: 'שם לקוח 1', fieldType: 'text', order: 3 },
    { textId: 'HOME_TESTIMONIAL_1_LOCATION', label: 'המלצה 1 - מיקום', defaultValue: 'תל אביב', previewLocation: 'מיקום לקוח 1', fieldType: 'text', order: 4 },
    { textId: 'HOME_TESTIMONIAL_2_TEXT', label: 'המלצה 2 - טקסט', defaultValue: 'קיבלתי 300 ₪ מהפניות. מדהים!', previewLocation: 'טקסט המלצה 2', fieldType: 'text', order: 5 },
    { textId: 'HOME_TESTIMONIAL_2_AUTHOR', label: 'המלצה 2 - שם', defaultValue: 'יוסי לוי', previewLocation: 'שם לקוח 2', fieldType: 'text', order: 6 },
    { textId: 'HOME_TESTIMONIAL_2_LOCATION', label: 'המלצה 2 - מיקום', defaultValue: 'חיפה', previewLocation: 'מיקום לקוח 2', fieldType: 'text', order: 7 },
    { textId: 'HOME_TESTIMONIAL_3_TEXT', label: 'המלצה 3 - טקסט', defaultValue: 'חסכתי אלפי שקלים. שירות מעולה!', previewLocation: 'טקסט המלצה 3', fieldType: 'text', order: 8 },
    { textId: 'HOME_TESTIMONIAL_3_AUTHOR', label: 'המלצה 3 - שם', defaultValue: 'דני אברהם', previewLocation: 'שם לקוח 3', fieldType: 'text', order: 9 },
    { textId: 'HOME_TESTIMONIAL_3_LOCATION', label: 'המלצה 3 - מיקום', defaultValue: 'ירושלים', previewLocation: 'מיקום לקוח 3', fieldType: 'text', order: 10 },
  ],
  ABOUT_SECTION: [
    { textId: 'HOME_ABOUT_TITLE', label: 'כותרת אודות', defaultValue: 'מי אנחנו', previewLocation: 'כותרת מקטע מי אנחנו', fieldType: 'text', order: 1 },
    { textId: 'HOME_ABOUT_TEXT', label: 'טקסט אודות', defaultValue: 'VIPO Group מובילה את תחום הרכישה הקבוצתית בישראל מאז 2018. אנו מחברים בין אלפי לקוחות פרטיים ועסקיים לספקים איכותיים בארץ ובעולם, מקצרים תהליכים ומוזילים עלויות בצורה חכמה, שקופה ומהירה – עד שהמוצר מגיע אליכם הביתה.', previewLocation: 'תיאור במקטע מי אנחנו', fieldType: 'textarea', order: 2 },
    { textId: 'HOME_ABOUT_STAT_1', label: 'סטטיסטיקה 1', defaultValue: '+9,500', previewLocation: 'מספר לקוחות מרוצים', fieldType: 'text', order: 3 },
    { textId: 'HOME_ABOUT_STAT_1_LABEL', label: 'תווית סטט 1', defaultValue: 'לקוחות מרוצים', previewLocation: 'תווית לקוחות', fieldType: 'text', order: 4 },
    { textId: 'HOME_ABOUT_STAT_2', label: 'סטטיסטיקה 2', defaultValue: '2018', previewLocation: 'שנת הקמה', fieldType: 'text', order: 5 },
    { textId: 'HOME_ABOUT_STAT_2_LABEL', label: 'תווית סטט 2', defaultValue: 'שנת הקמה', previewLocation: 'תווית שנה', fieldType: 'text', order: 6 },
    { textId: 'HOME_ABOUT_STAT_3', label: 'סטטיסטיקה 3', defaultValue: 'ישראל + סין', previewLocation: 'נוכחות בינלאומית', fieldType: 'text', order: 7 },
    { textId: 'HOME_ABOUT_STAT_3_LABEL', label: 'תווית סטט 3', defaultValue: 'נוכחות בינלאומית', previewLocation: 'תווית נוכחות', fieldType: 'text', order: 8 },
  ],
  FOOTER_SECTION: [
    { textId: 'FOOTER_COMPANY_NAME', label: 'שם החברה', defaultValue: 'VIPO GROUP', previewLocation: 'שם החברה בפוטר', fieldType: 'text', order: 1 },
    { textId: 'FOOTER_TAGLINE', label: 'סלוגן', defaultValue: 'רכישה קבוצתית חכמה וחסכונית', previewLocation: 'סלוגן מתחת לשם החברה', fieldType: 'text', order: 2 },
    { textId: 'FOOTER_PHONE', label: 'טלפון', defaultValue: '058-700-9938', previewLocation: 'מספר טלפון ליצירת קשר', fieldType: 'text', order: 3 },
    { textId: 'FOOTER_EMAIL', label: 'אימייל', defaultValue: 'vipo.m1985@gmail.com', previewLocation: 'כתובת אימייל', fieldType: 'text', order: 4 },
    { textId: 'FOOTER_ADDRESS', label: 'כתובת', defaultValue: 'ז\'בוטינסקי 5, באר יעקב', previewLocation: 'כתובת פיזית', fieldType: 'text', order: 5 },
    { textId: 'FOOTER_HOURS', label: 'שעות פעילות', defaultValue: 'א׳-ה׳ 09:00-18:00', previewLocation: 'שעות פעילות', fieldType: 'text', order: 6 },
    { textId: 'FOOTER_COPYRIGHT', label: 'זכויות יוצרים', defaultValue: '© 2025 VIPO GROUP | ע.מ. 036517548', previewLocation: 'שורת זכויות יוצרים', fieldType: 'text', order: 7 },
  ],
};

// Section labels for display
const SECTION_LABELS = {
  HERO_SECTION: 'Hero - אזור הכותרת הראשי',
  VIDEO_SECTION: 'סרטון הסבר',
  HOW_IT_WORKS_SECTION: 'איך זה עובד',
  TRUST_SECTION: 'אזור האמון',
  REFERRAL_SECTION: 'חבר מביא חבר',
  TARGET_AUDIENCE_SECTION: 'קהל יעד',
  FAQ_SECTION: 'שאלות נפוצות',
  TESTIMONIALS_SECTION: 'המלצות לקוחות',
  ABOUT_SECTION: 'מי אנחנו',
  FOOTER_SECTION: 'פוטר',
};

// GET - Fetch all texts for a page or specific text
export async function GET(request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const textId = searchParams.get('textId');
    const section = searchParams.get('section');
    const initDefaults = searchParams.get('initDefaults') === 'true';
    const businessId = searchParams.get('businessId');
    
    // Convert businessId to ObjectId if provided
    const tenantId = businessId ? businessId : null;
    
    // Initialize defaults if requested
    if (initDefaults && page === 'home') {
      for (const [sectionKey, fields] of Object.entries(HOME_PAGE_DEFAULTS)) {
        for (const field of fields) {
          const existing = await SiteText.findOne({ 
            textId: field.textId,
            tenantId: tenantId
          });
          if (!existing) {
            await SiteText.create({
              textId: field.textId,
              tenantId: tenantId,
              page: 'home',
              section: sectionKey,
              label: field.label,
              value: field.defaultValue,
              defaultValue: field.defaultValue,
              previewLocation: field.previewLocation,
              fieldType: field.fieldType,
              order: field.order,
            });
          }
        }
      }
    }
    
    // Build query
    const query = { tenantId };
    if (page) query.page = page;
    if (section) query.section = section;
    if (textId) query.textId = textId;
    
    const texts = await SiteText.find(query).sort({ section: 1, order: 1 });
    
    // If fetching for home page, group by section
    if (page === 'home' && !textId) {
      const grouped = {};
      for (const text of texts) {
        if (!grouped[text.section]) {
          grouped[text.section] = {
            sectionId: text.section,
            sectionLabel: SECTION_LABELS[text.section] || text.section,
            fields: [],
          };
        }
        grouped[text.section].fields.push(text);
      }
      
      // Sort sections by predefined order
      const sectionOrder = Object.keys(HOME_PAGE_DEFAULTS);
      const sortedSections = sectionOrder
        .filter(s => grouped[s])
        .map(s => grouped[s]);
      
      return NextResponse.json({ 
        success: true, 
        sections: sortedSections,
        sectionLabels: SECTION_LABELS,
      });
    }
    
    return NextResponse.json({ success: true, texts });
  } catch (error) {
    console.error('Error fetching site texts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a text value (creates if not exists)
export async function PUT(request) {
  try {
    await connectMongo();
    
    const body = await request.json();
    const { textId, value, businessId } = body;
    
    if (!textId) {
      return NextResponse.json({ error: 'textId is required' }, { status: 400 });
    }
    
    // Convert businessId to ObjectId if provided
    const tenantId = businessId ? businessId : null;
    
    // Determine page and section from textId prefix
    let page = 'home';
    let section = 'CUSTOM';
    
    if (textId.startsWith('SHOP_')) {
      page = 'shop';
      section = 'SHOP_SECTION';
    } else if (textId.startsWith('HOME_')) {
      page = 'home';
      if (textId.includes('HERO')) section = 'HERO_SECTION';
      else if (textId.includes('HOW')) section = 'HOW_IT_WORKS_SECTION';
      else if (textId.includes('TRUST')) section = 'TRUST_SECTION';
      else if (textId.includes('REFERRAL')) section = 'REFERRAL_SECTION';
      else if (textId.includes('TARGET')) section = 'TARGET_AUDIENCE_SECTION';
      else if (textId.includes('FAQ')) section = 'FAQ_SECTION';
      else if (textId.includes('TESTIMONIAL')) section = 'TESTIMONIALS_SECTION';
      else if (textId.includes('ABOUT')) section = 'ABOUT_SECTION';
    } else if (textId.startsWith('FOOTER_')) {
      page = 'global';
      section = 'FOOTER_SECTION';
    }
    
    // Use upsert to create if not exists
    const text = await SiteText.findOneAndUpdate(
      { textId, tenantId },
      { 
        value, 
        updatedAt: new Date(),
        // Set these only on insert (not on update)
        $setOnInsert: {
          tenantId,
          page,
          section,
          label: textId,
          defaultValue: value,
          createdAt: new Date()
        }
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error('Error updating site text:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Bulk update texts
export async function POST(request) {
  try {
    await connectMongo();
    
    const body = await request.json();
    const { texts } = body;
    
    if (!Array.isArray(texts)) {
      return NextResponse.json({ error: 'texts array is required' }, { status: 400 });
    }
    
    const results = [];
    for (const { textId, value } of texts) {
      const text = await SiteText.findOneAndUpdate(
        { textId },
        { value, updatedAt: new Date() },
        { new: true }
      );
      if (text) results.push(text);
    }
    
    return NextResponse.json({ success: true, updated: results.length, texts: results });
  } catch (error) {
    console.error('Error bulk updating site texts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
