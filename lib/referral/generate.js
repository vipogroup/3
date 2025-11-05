import crypto from 'crypto';

/**
 * יוצר קוד קצר קריא, באורך 10 תווים, בסיס-36 (ספרות+אותיות).
 * לדוגמה: "q3k9f2m8z1"
 */
export function generateReferralId() {
  // 8 bytes -> 64 bits -> base36 ~ 10 chars
  const buf = crypto.randomBytes(8);
  // המרה ל-base36 והסרה של אפסים מובילים
  return BigInt('0x' + buf.toString('hex')).toString(36);
}

/**
 * ריטריי על שגיאת דופליקייט (E11000) עד 3 פעמים.
 * createFn: פונקציה אסינכרונית שיוצרת משתמש עם referralId מסוים.
 */
export async function withReferralRetry(createFn, maxRetries = 3) {
  let attempt = 0;
  while (true) {
    try {
      return await createFn(generateReferralId());
    } catch (err) {
      // בדיקת דופליקייט על שדה referralId
      const msg = String((err && err.message) || '');
      const dup = msg.includes('E11000') && msg.includes('referralId');
      attempt++;
      if (!dup || attempt >= maxRetries) throw err; // לא דופליקייט או מיצינו ריטריי
      // ממשיכים ניסיון נוסף עם referralId חדש
    }
  }
}
