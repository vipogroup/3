'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              מדיניות פרטיות
            </h1>
            <p className="text-gray-600">
              עודכן לאחרונה: דצמבר 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. מבוא</h2>
              <p className="text-gray-700 leading-relaxed">
                ב-VIPO אנו מחויבים להגן על פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, 
                משתמשים, שומרים ומגנים על המידע האישי שלך בעת השימוש באתר ובשירותים שלנו.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. מידע שאנו אוספים</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו עשויים לאסוף את סוגי המידע הבאים:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">מידע שאתה מספק לנו:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>שם מלא וכתובת דוא&quot;ל</li>
                <li>מספר טלפון</li>
                <li>כתובת למשלוח</li>
                <li>פרטי תשלום (מעובדים באופן מאובטח)</li>
                <li>תכתובות ופניות לשירות לקוחות</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">מידע שנאסף אוטומטית:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>כתובת IP ומידע על המכשיר</li>
                <li>סוג הדפדפן ומערכת ההפעלה</li>
                <li>דפים שנצפו וזמן שהייה</li>
                <li>קישורים שנלחצו</li>
                <li>מידע על עגלת קניות והזמנות</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. כיצד אנו משתמשים במידע</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו משתמשים במידע שנאסף למטרות הבאות:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>עיבוד הזמנות ומשלוחים</li>
                <li>ניהול חשבון המשתמש שלך</li>
                <li>תקשורת בנוגע להזמנות ושירותים</li>
                <li>שיפור חווית המשתמש באתר</li>
                <li>שליחת עדכונים ומבצעים (בהסכמתך)</li>
                <li>חישוב ותשלום עמלות לסוכנים</li>
                <li>מניעת הונאות והגנה על האתר</li>
                <li>עמידה בדרישות חוקיות</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. שיתוף מידע</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו לא מוכרים את המידע האישי שלך. אנו עשויים לשתף מידע עם:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>ספקי שירותים:</strong> חברות משלוחים, מעבדי תשלומים, ספקי אחסון ענן.</li>
                <li><strong>שותפים עסקיים:</strong> במידה הנדרשת לאספקת השירותים.</li>
                <li><strong>רשויות חוק:</strong> כאשר נדרש על פי חוק או צו בית משפט.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. אבטחת מידע</h2>
              <p className="text-gray-700 leading-relaxed">
                אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלך, כולל:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>הצפנת SSL לכל התקשורת באתר</li>
                <li>אחסון מאובטח של נתונים</li>
                <li>הגבלת גישה לעובדים מורשים בלבד</li>
                <li>ניטור שוטף לאיתור פעילות חשודה</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. עוגיות (Cookies)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                האתר משתמש בעוגיות לצורך:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>שמירת העדפות המשתמש</li>
                <li>זיהוי משתמשים מחוברים</li>
                <li>ניתוח תנועה ושיפור האתר</li>
                <li>התאמה אישית של תוכן</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                ניתן לשלוט בהגדרות העוגיות דרך הדפדפן שלך.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. הזכויות שלך</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                על פי חוק הגנת הפרטיות, יש לך את הזכויות הבאות:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>לעיין במידע שאנו שומרים עליך</li>
                <li>לבקש תיקון מידע שגוי</li>
                <li>לבקש מחיקת המידע שלך</li>
                <li>להתנגד לשימוש במידע לצרכי שיווק</li>
                <li>לבקש העברת המידע לשירות אחר</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                לממש את זכויותיך, פנה אלינו דרך עמוד יצירת הקשר.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. שמירת מידע</h2>
              <p className="text-gray-700 leading-relaxed">
                אנו שומרים את המידע שלך כל עוד חשבונך פעיל או כנדרש לספק לך שירותים. 
                לאחר מכן, המידע יישמר לתקופה סבירה לצרכים משפטיים, חשבונאיים או עסקיים לגיטימיים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. ילדים</h2>
              <p className="text-gray-700 leading-relaxed">
                האתר לא מיועד לילדים מתחת לגיל 18. אנו לא אוספים ביודעין מידע אישי מילדים. 
                אם נודע לנו שאספנו מידע מילד, נמחק אותו באופן מיידי.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. שינויים במדיניות</h2>
              <p className="text-gray-700 leading-relaxed">
                אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר, 
                ותאריך העדכון האחרון יצוין בראש המסמך. המשך השימוש באתר מהווה הסכמה למדיניות המעודכנת.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">11. יצירת קשר</h2>
              <p className="text-gray-700 leading-relaxed">
                לשאלות או בקשות בנוגע לפרטיות, ניתן לפנות אלינו באמצעות עמוד יצירת הקשר באתר. 
                נשתדל להשיב לכל פנייה תוך זמן סביר.
              </p>
            </section>
          </div>

          {/* Back Link */}
          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
