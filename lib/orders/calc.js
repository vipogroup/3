export function calcTotals(items = [], discount = 0) {
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce((sum, it) => {
    const qty = Number(it?.qty || 0);
    const price = Number(it?.price || 0);
    return sum + (isFinite(qty * price) ? qty * price : 0);
  }, 0);
  const total = Math.max(0, subtotal - Number(discount || 0));
  return { subtotal, total };
}
