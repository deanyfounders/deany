import React from 'react';

/**
 * Four distinct path icons in a consistent Islamic-geometric line style.
 * All share: 24x24 viewBox, 1.5px stroke, round caps/joins, no fill.
 */

const base = { strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

// 5 Pillars - Mosque dome with minarets
export const PillarsIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
    <path d="M12 3c-3 3-6 4-6 8v7h12v-7c0-4-3-5-6-8z" />
    <line x1="12" y1="3" x2="12" y2="6" />
    <line x1="6" y1="18" x2="18" y2="18" />
    <rect x="3" y="12" width="2" height="6" rx="0.5" />
    <rect x="19" y="12" width="2" height="6" rx="0.5" />
    <line x1="3" y1="18" x2="21" y2="18" />
    <circle cx="12" cy="13" r="1.5" />
  </svg>
);

// Islamic Finance - Balance scale with geometric diamond
export const FinanceIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
    <line x1="12" y1="3" x2="12" y2="19" />
    <line x1="4" y1="7" x2="20" y2="7" />
    <path d="M4 7l2 8h0a2 2 0 004 0h0l2-8" />
    <path d="M14 7l2 8h0a2 2 0 004 0h0l2-8" />
    <path d="M12 3l2 2-2 2-2-2z" />
    <line x1="8" y1="19" x2="16" y2="19" />
  </svg>
);

// Quran & Arabic - Open book with decorative calligraphy lines
export const QuranIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
    <path d="M2 4c2-1 5-1 10 1v15c-5-2-8-2-10-1V4z" />
    <path d="M22 4c-2-1-5-1-10 1v15c5-2 8-2 10-1V4z" />
    <path d="M7 9c1.5.5 2.5.5 4 0" />
    <path d="M7 12c1.5.5 2.5.5 4 0" />
    <path d="M13 9c1.5.5 2.5.5 4 0" />
    <path d="M13 12c1.5.5 2.5.5 4 0" />
    <circle cx="12" cy="2.5" r="1" />
  </svg>
);

// Islamic History - Astrolabe / compass rose
export const HistoryIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="3" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="21" />
    <line x1="3" y1="12" x2="8" y2="12" />
    <line x1="16" y1="12" x2="21" y2="12" />
    <path d="M12 8l1.5 4-1.5 4-1.5-4z" />
  </svg>
);
