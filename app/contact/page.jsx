'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

const gradientStyle = {
  background:
    'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
};

const infoTileClasses =
  'bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col gap-3 text-gray-700';

export default function ContactPage() {
  const { settings } = useTheme();

  const contactDetails = useMemo(
    () => ({
      email: settings?.email || 'info@vipo.com',
      phone: settings?.phone || '050-1234567',
      address: settings?.address || 'תל אביב, ישראל',
      whatsapp: settings?.whatsapp || '972501234567',
    }),
    [settings],
  );

  return (
    <div className="min-h-screen" style={gradientStyle}>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-10 md:p-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-2">צרו קשר</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                אנחנו כאן לכל שאלה
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                צוות VIPO זמין בשבילכם – שאלות לגבי מוצרים, בקשות תמיכה או שיתופי פעולה. מלאו את
                הפרטים ונחזור אליכם בהקדם.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg transition-all"
            >
              חזרה לעמוד הבית
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className={infoTileClasses}>
              <span className="text-sm font-semibold text-purple-600">אימייל</span>
              <a
                href={`mailto:${contactDetails.email}`}
                className="text-xl font-bold text-gray-900"
              >
                {contactDetails.email}
              </a>
              <p className="text-sm text-gray-500">נענה תוך 24 שעות בממוצע</p>
            </div>

            <div className={infoTileClasses}>
              <span className="text-sm font-semibold text-purple-600">טלפון</span>
              <a href={`tel:${contactDetails.phone}`} className="text-xl font-bold text-gray-900">
                {contactDetails.phone}
              </a>
              <p className="text-sm text-gray-500">ימים א׳-ה׳, 09:00-18:00</p>
            </div>

            <div className={infoTileClasses}>
              <span className="text-sm font-semibold text-purple-600">וואטסאפ</span>
              <a
                href={`https://wa.me/${contactDetails.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-gray-900"
              >
                שלחו הודעה בוואטסאפ
              </a>
              <p className="text-sm text-gray-500">זמין 7 ימים בשבוע</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-inner p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">טופס יצירת קשר</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">שם מלא</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                      placeholder="הזינו את שמכם"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">אימייל</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">נושא</label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                    placeholder="כיצד נוכל לעזור?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">הודעה</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                    placeholder="ספרו לנו על הבקשה שלכם..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
                >
                  שליחה
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">פרטים נוספים</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <span className="text-sm font-semibold text-purple-600">כתובת משרד</span>
                  <p className="text-lg">{contactDetails.address}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-600">שעות פעילות</span>
                  <ul className="text-lg space-y-1">
                    <li>א׳-ה׳: 09:00-18:00</li>
                    <li>ו׳: 09:00-13:00</li>
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-600">שירותים נפוצים</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>שאלות על רכישות ומוצרים</li>
                    <li>סיוע טכני למערכת הסוכנים</li>
                    <li>מידע על הרשמה והצטרפות כסוכן</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
