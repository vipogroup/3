'use client';

import Link from 'next/link';

export default function AboutPage() {
  const primaryColor = '#1e3a8a';
  const secondaryColor = '#0891b2';
  const gradientPrimary = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4"
        style={{ background: gradientPrimary }}
      >
        <div className="max-w-5xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">VIPO Group</h1>
          <p className="text-xl md:text-2xl font-light mb-6 opacity-90">
            מובילים את מהפכת הסחר החכם בישראל
          </p>
          <p className="text-lg max-w-3xl mx-auto opacity-80 leading-relaxed">
            אנחנו מחברים בין לקוחות למפעלים בעולם, מנהלים את כל התהליך - ומוודאים
            שהמוצר מגיע אליכם במחיר הטוב ביותר
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 px-8 py-3 bg-white text-blue-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            צרו קשר
          </Link>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{ color: primaryColor }}
          >
            מי אנחנו
          </h2>
          <div className="text-gray-700 text-lg leading-relaxed space-y-4">
            <p>
              <strong style={{ color: primaryColor }}>VIPO Group</strong> הוקמה
              בשנת 2018 מתוך הבנה פשוטה: הדרך לחיסכון אמיתי עוברת דרך קשר ישיר עם
              מקור הייצור.
            </p>
            <p>
              אנחנו חברה ישראלית המתמחה באיתור מפעלים גלובליים, ניהול שינוע
              וסגירת עסקאות - הכל תחת קורת גג אחת. אנו מלווים עסקים ואנשים פרטיים
              לאורך כל הדרך: מרגע האיתור, דרך המשא ומתן, ועד לרגע שהסחורה מגיעה
              לפתח הבית.
            </p>
            <p>
              החזון שלנו הוא להנגיש את עולם הייבוא לכל אחד - בשקיפות מלאה, במחירים
              הוגנים, ובליווי מקצועי.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: primaryColor }}
          >
            השירותים שלנו
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-900">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ background: gradientPrimary }}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                איתור מפעלים גלובליים
              </h3>
              <p className="text-gray-600">
                גישה למפעלי ייצור מובילים במגוון תחומים, עם הצעות מחיר מותאמות
                אישית לכל לקוח. אנחנו מוצאים עבורכם את הספקים האיכותיים ביותר.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-cyan-600">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ background: gradientPrimary }}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ניהול שינוע מתקדם
              </h3>
              <p className="text-gray-600">
                שירותי שינוע ועמילות מכס מהמובילים בעולם, המבטיחים תהליכים יעילים
                והפחתת עלויות. אנחנו מטפלים בכל הבירוקרטיה עבורכם.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-900">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ background: gradientPrimary }}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                הסכמים ישירים
              </h3>
              <p className="text-gray-600">
                סגירת עסקאות ישירות מול המפעלים להבטחת התנאים הטובים ביותר. משא
                ומתן מקצועי שחוסך לכם כסף ומבטיח איכות.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-cyan-600">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ background: gradientPrimary }}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                שיווק ומכירה
              </h3>
              <p className="text-gray-600">
                ניהול קמפיינים פרסומיים בכל הרשתות החברתיות, מכירה אפקטיבית
                ובניית מערכת דיגיטלית מתקדמת לניהול העסק שלכם.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: primaryColor }}
          >
            התהליך שלנו
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { num: '1', title: 'פגישת ייעוץ', desc: 'הבנת הצרכים' },
              { num: '2', title: 'איתור מפעל', desc: 'חיפוש גלובלי' },
              { num: '3', title: 'משא ומתן', desc: 'הבטחת המחיר הטוב' },
              { num: '4', title: 'שינוע ומכס', desc: 'ניהול הלוגיסטיקה' },
              { num: '5', title: 'קבלת סחורה', desc: 'המוצר מגיע!' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl"
                  style={{ background: gradientPrimary }}
                >
                  {step.num}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8">
            משך התהליך: 4-8 שבועות בממוצע (תלוי במוצר)
          </p>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: primaryColor }}
          >
            למי אנחנו מתאימים
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: '🏢',
                title: 'עסקים קטנים',
                desc: 'יבוא ישיר למוצרי המותג שלכם',
              },
              {
                icon: '🏠',
                title: 'אנשים פרטיים',
                desc: 'רכישה קבוצתית בהנחות משמעותיות',
              },
              {
                icon: '🛒',
                title: 'קמעונאים',
                desc: 'מלאי במחירי מקור',
              },
              {
                icon: '🏛️',
                title: 'מוסדות וארגונים',
                desc: 'רכישות מרוכזות בתנאים מיוחדים',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Purchase Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-6"
            style={{ color: primaryColor }}
          >
            הפלטפורמה שלנו - רכישה קבוצתית חכמה
          </h2>
          <p className="text-center text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            בנוסף לשירותי היבוא והשינוע, פיתחנו פלטפורמה ייחודית לרכישה קבוצתית -
            שמאפשרת לכל אחד ליהנות ממחירי סיטונאות.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['נצטרף לקבוצה', 'המחיר יורד', 'כולם מרוויחים'].map(
              (text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full"
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: secondaryColor }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium" style={{ color: primaryColor }}>
                    {text}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h4 className="font-bold text-gray-900 mb-4">יתרונות:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span style={{ color: secondaryColor }}>✓</span>
                אין התחייבות כספית עד סגירת הקבוצה
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: secondaryColor }}>✓</span>
                אחריות מלאה על כל המוצרים
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: secondaryColor }}>✓</span>
                משלוח עד הבית
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-block px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ background: gradientPrimary }}
            >
              לצפייה במוצרים
            </Link>
          </div>
        </div>
      </section>

      {/* Partners/Agents Section */}
      <section
        className="py-16 px-4"
        style={{
          background:
            'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.1) 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            הצטרפו כשותפים והרוויחו!
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            יש לך קהילה? רשת קשרים? הצטרף לתוכנית הסוכנים שלנו!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '💰', title: '10% עמלה', desc: 'על כל מכירה' },
              { icon: '🔗', title: 'קוד אישי', desc: 'ייחודי לך' },
              { icon: '📊', title: 'דשבורד מתקדם', desc: 'מעקב בזמן אמת' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-5 border-2 border-transparent hover:border-cyan-500 transition-colors"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register?role=agent"
              className="px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ background: gradientPrimary }}
            >
              הצטרף עכשיו
            </Link>
            <Link
              href="/join"
              className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-blue-900"
            >
              למידע נוסף
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4" style={{ background: primaryColor }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">בואו נדבר!</h2>
          <p className="text-lg opacity-90 mb-8">
            צוות VIPO כאן בשבילכם - לכל שאלה, בקשה או הצעה
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-5">
              <div className="text-2xl mb-2">📞</div>
              <a
                href="tel:058-700-9938"
                className="text-xl font-bold hover:underline"
              >
                058-700-9938
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-5">
              <div className="text-2xl mb-2">✉️</div>
              <a
                href="mailto:vipo.m1985@gmail.com"
                className="text-xl font-bold hover:underline"
              >
                vipo.m1985@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="https://wa.me/972587009938"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              וואטסאפ
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              טופס יצירת קשר
            </Link>
          </div>

          <p className="text-sm opacity-70">א׳-ה׳: 09:00-18:00 | ו׳: 09:00-13:00</p>

          <div className="mt-8 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-6 text-sm opacity-70">
            <Link href="/terms" className="hover:underline">
              תנאי שימוש
            </Link>
            <Link href="/privacy" className="hover:underline">
              מדיניות פרטיות
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
