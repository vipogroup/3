export default function StatusBadge({ status }) {
  const map = {
    new: { bg: '#e6f0ff', color: '#0b62ff', text: 'חדש' },
    qualified: { bg: '#fff7e6', color: '#ff8a00', text: 'Qualified' },
    paid: { bg: '#e6ffed', color: '#0ca44a', text: 'שולם' },
    shipped: { bg: '#eaf6ff', color: '#177ddc', text: 'נשלח' },
    delivered: { bg: '#edfdf3', color: '#237804', text: 'נמסר' },
    canceled: { bg: '#fff1f0', color: '#a8071a', text: 'בוטל' },
  };
  const s = map[status] || { bg: '#f0f0f0', color: '#333', text: status || 'לא ידוע' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      {s.text}
    </span>
  );
}
