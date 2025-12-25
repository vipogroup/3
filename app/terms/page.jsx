'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              תנאי שימוש
            </h1>
            <p className="text-gray-600">
              עודכן לאחרונה: דצמבר 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. הקדמה</h2>
              <p className="text-gray-700 leading-relaxed">
                ברוכים הבאים ל-VIPO. תנאי שימוש אלה (&quot;התנאים&quot;) מסדירים את השימוש שלך באתר ובשירותים שלנו. 
                בשימוש באתר, אתה מסכים לתנאים אלה במלואם. אם אינך מסכים לתנאים אלה, אנא הימנע משימוש באתר.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. הגדרות</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>&quot;האתר&quot;</strong> - אתר האינטרנט של VIPO וכל השירותים הדיגיטליים הקשורים אליו.</li>
                <li><strong>&quot;משתמש&quot;</strong> - כל אדם הגולש או משתמש באתר, כולל לקוחות וסוכנים.</li>
                <li><strong>&quot;סוכן&quot;</strong> - משתמש שנרשם כשותף שיווקי ומקבל עמלות על הפניות.</li>
                <li><strong>&quot;מוצרים&quot;</strong> - כל המוצרים והשירותים המוצעים למכירה באתר.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. רישום וחשבון משתמש</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                כדי לבצע רכישות או להשתמש בשירותים מסוימים, ייתכן שתידרש ליצור חשבון. אתה מתחייב:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>לספק מידע מדויק ועדכני בעת הרישום.</li>
                <li>לשמור על סודיות פרטי ההתחברות שלך.</li>
                <li>להודיע לנו מיידית על כל שימוש לא מורשה בחשבונך.</li>
                <li>לא להעביר את חשבונך לצד שלישי ללא אישורנו.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. רכישות ותשלומים</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                בעת ביצוע רכישה באתר:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>המחירים המוצגים כוללים מע&quot;מ אלא אם צוין אחרת.</li>
                <li>התשלום מתבצע באמצעות אמצעי התשלום המאושרים באתר.</li>
                <li>ההזמנה תאושר רק לאחר קבלת אישור תשלום.</li>
                <li>אנו שומרים לעצמנו את הזכות לבטל הזמנות במקרים חריגים.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. משלוחים והחזרות</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                מדיניות המשלוחים וההחזרות שלנו:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>זמני אספקה משוערים יצוינו בעת ההזמנה.</li>
                <li>ניתן לבטל הזמנה תוך 14 ימים מיום קבלת המוצר.</li>
                <li>המוצר חייב להיות באריזתו המקורית ובמצב תקין.</li>
                <li>החזר כספי יינתן באותו אמצעי התשלום בו בוצעה הרכישה.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. תוכנית הסוכנים</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                סוכנים הנרשמים לתוכנית השותפים מסכימים לתנאים הבאים:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>העמלות יחושבו לפי המדיניות העדכנית המפורסמת באתר.</li>
                <li>תשלום עמלות יתבצע בהתאם ללוח הזמנים שנקבע.</li>
                <li>אין לעשות שימוש בשיטות שיווק פוגעניות או מטעות.</li>
                <li>אנו שומרים לעצמנו את הזכות לסיים שותפות בכל עת.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. קניין רוחני</h2>
              <p className="text-gray-700 leading-relaxed">
                כל התכנים באתר, כולל טקסטים, תמונות, לוגואים ועיצובים, הם רכושה הבלעדי של VIPO או של בעלי הרישיון שלה. 
                אין להעתיק, להפיץ או לעשות שימוש מסחרי בתכנים ללא אישור מראש ובכתב.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. הגבלת אחריות</h2>
              <p className="text-gray-700 leading-relaxed">
                האתר והשירותים מסופקים &quot;כמות שהם&quot; (AS IS). אנו לא נישא באחריות לנזקים עקיפים, 
                מיוחדים או תוצאתיים הנובעים משימוש באתר, במידה המרבית המותרת על פי חוק.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. שינויים בתנאים</h2>
              <p className="text-gray-700 leading-relaxed">
                אנו שומרים לעצמנו את הזכות לעדכן תנאים אלה מעת לעת. שינויים מהותיים יפורסמו באתר, 
                והמשך השימוש באתר לאחר פרסום השינויים מהווה הסכמה לתנאים המעודכנים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. יצירת קשר</h2>
              <p className="text-gray-700 leading-relaxed">
                לשאלות או הבהרות בנוגע לתנאי השימוש, ניתן לפנות אלינו באמצעות עמוד יצירת הקשר באתר.
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
