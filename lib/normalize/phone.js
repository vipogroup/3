export function normalizeIL(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D+/g, '');
  if (digits.startsWith('972')) return '0' + digits.slice(3);
  if (digits.startsWith('0')) return digits;
  return digits.length === 9 ? '0' + digits : digits;
}
