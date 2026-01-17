export function buildQuoteMessageB(order) {
  if (!order) return '';
  const customerName = order?.customer?.fullName || 'חבר';
  const subtotal = Number(order?.subtotal || 0);
  const discount = Number(order?.discount || 0);
  const total = Number(order?.total || Math.max(0, subtotal - discount));

  const first = Array.isArray(order?.items) && order.items.length ? order.items[0] : null;
  const prodTitle = first?.title || order?.items?.[0]?.title || 'מוצר';
  const prodPrice = first?.price != null ? Number(first.price) : null;

  const priceStr = prodPrice != null ? `${prodPrice} ₪` : `${total} ₪`;
  const totalStr = `${total} ₪`;

  return `היי ${customerName}![FIRE]
מצאתי לך את הדיל הכי משתלם בשוק:
${prodTitle} במחיר ${priceStr} בלבד!!

זה מחיר יבוא ישיר - בלי חנויות ובלי מתווכים [TROPHY]
סה״כ להזמנה: ${totalStr}

רוצה שאשריין לך יחידה?`;
}

export function buildQuoteLinkMessage(order, url) {
  if (!order) return '';
  const name = order?.customer?.fullName || 'חבר';
  const subtotal = Number(order?.subtotal || 0);
  const discount = Number(order?.discount || 0);
  const total = Number(order?.total || Math.max(0, subtotal - discount));
  const totalStr = `${total} ₪`;
  const safeUrl = url || '';
  return `היי ${name}!
מצורפת הצעת מחיר.
סה״כ לתשלום: ${totalStr}
PDF: ${safeUrl}`;
}
