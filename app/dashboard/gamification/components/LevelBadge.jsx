'use client';

/**
 * Component to display level badge with appropriate color
 * bronze=#cd7f32, silver=#C0C0C0, gold=#FFD700, platinum=#E5E4E2
 */
export default function LevelBadge({ color, name, size = 'md' }) {
  const getBadgeColor = () => {
    switch (color) {
      case 'bronze':
        return {
          bg: '#cd7f32',
          text: '#ffffff',
          border: '#b36a2b',
        };
      case 'silver':
        return {
          bg: '#C0C0C0',
          text: '#333333',
          border: '#a3a3a3',
        };
      case 'gold':
        return {
          bg: '#FFD700',
          text: '#333333',
          border: '#d4b106',
        };
      case 'platinum':
        return {
          bg: '#E5E4E2',
          text: '#333333',
          border: '#c5c4c2',
        };
      default:
        return {
          bg: '#f3f4f6',
          text: '#374151',
          border: '#d1d5db',
        };
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-base px-4 py-2';
      case 'md':
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  const colors = getBadgeColor();
  const sizeClass = getSizeClass();

  return (
    <span
      className={`font-medium rounded-full ${sizeClass} inline-flex items-center justify-center`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {name || color}
    </span>
  );
}
