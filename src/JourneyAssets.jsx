import React from 'react';

/* ────────────────────────────────────────────────────────────────────
   Decorative 2.5D assets for the lesson journey scene.
   "Painted light" technique: base → blurred shadow → blurred light → specular.
   All reference filter id="sf" defined in PagePattern (ModuleOverview.jsx).
   Consistent top-left lighting, gold palette.
   ──────────────────────────────────────────────────────────────────── */
const F = 'url(#sf)';

export const Lantern = ({ size = 40 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 40 60" fill="none">
    {/* Ground shadow */}
    <ellipse cx="20" cy="57" rx="11" ry="2.5" fill="#000" opacity="0.1" />
    {/* Hook */}
    <path d="M17,3 Q20,0 23,3" stroke="#92400e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <line x1="20" y1="4" x2="20" y2="10" stroke="#92400e" strokeWidth="1.5" />
    {/* Top cap */}
    <path d="M14,10 L26,10 L24,15 L16,15Z" fill="#d97706" />
    <path d="M21,10 L26,10 L24,15" fill="#451a03" opacity="0.2" filter={F} />
    <path d="M14,10 L20,10 L18,14" fill="#fef3c7" opacity="0.35" filter={F} />
    {/* Body — onion-dome shape */}
    <path d="M16,15 Q11,25 13,38 Q14,44 20,46 Q26,44 27,38 Q29,25 24,15Z" fill="#d97706" />
    <path d="M22,16 Q28,26 27,38 Q26,44 20,46" fill="#451a03" opacity="0.25" filter={F} />
    <path d="M18,17 Q13,26 14,34" fill="#fef3c7" opacity="0.4" filter={F} />
    <path d="M16,20 Q15,24 15,28" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
    {/* Inner glow */}
    <ellipse cx="20" cy="30" rx="4" ry="8" fill="#fef3c7" opacity="0.25" />
    <ellipse cx="20" cy="28" rx="2" ry="4" fill="#fff" opacity="0.15" />
    {/* Lattice pattern hints */}
    <line x1="17" y1="22" x2="17" y2="36" stroke="#92400e" strokeWidth="0.5" opacity="0.2" />
    <line x1="23" y1="22" x2="23" y2="36" stroke="#92400e" strokeWidth="0.5" opacity="0.2" />
    <line x1="14" y1="28" x2="26" y2="28" stroke="#92400e" strokeWidth="0.5" opacity="0.2" />
    {/* Base */}
    <rect x="16" y="46" width="8" height="3" rx="1" fill="#92400e" />
    <rect x="16" y="46" width="4" height="2" rx="0.5" fill="#d97706" opacity="0.5" />
  </svg>
);

export const GeometricStar = ({ size = 40 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none">
    {/* Ground shadow */}
    <ellipse cx="20" cy="49" rx="12" ry="2.5" fill="#000" opacity="0.1" />
    {/* Small pedestal */}
    <rect x="14" y="40" width="12" height="5" rx="2" fill="#92400e" />
    <rect x="14" y="40" width="6" height="4" rx="1" fill="#d97706" opacity="0.4" />
    {/* 8-pointed star: two overlapping rotated squares */}
    <g transform="translate(20,22)">
      {/* Square 1 */}
      <rect x="-12" y="-12" width="24" height="24" rx="2" fill="#d97706" transform="rotate(0)" />
      {/* Square 2 (rotated 45deg) */}
      <rect x="-12" y="-12" width="24" height="24" rx="2" fill="#d97706" transform="rotate(45)" />
      {/* Shadow overlay */}
      <rect x="-10" y="-2" width="20" height="16" rx="2" fill="#451a03" opacity="0.22" filter={F} transform="rotate(22)" />
      {/* Light overlay */}
      <rect x="-12" y="-14" width="16" height="16" rx="2" fill="#fef3c7" opacity="0.4" filter={F} />
      {/* Inner geometric detail — smaller star cutout illusion */}
      <circle cx="0" cy="0" r="6" fill="#92400e" opacity="0.15" />
      <circle cx="0" cy="0" r="4" fill="#d97706" />
      <circle cx="-1" cy="-1" r="3" fill="#fef3c7" opacity="0.3" filter={F} />
      <circle cx="-1" cy="-2" r="1.2" fill="#fff" opacity="0.4" />
    </g>
  </svg>
);

export const Qalam = ({ size = 40 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 44 57" fill="none">
    {/* Ground shadow */}
    <ellipse cx="22" cy="54" rx="14" ry="2.5" fill="#000" opacity="0.1" />
    {/* Ink pot */}
    <path d="M14,48 Q12,40 16,38 L28,38 Q32,40 30,48Z" fill="#4a3728" />
    <ellipse cx="22" cy="38" rx="8" ry="3" fill="#5c4433" />
    <ellipse cx="20" cy="37.5" rx="4" ry="1.5" fill="#7c6453" opacity="0.5" />
    <ellipse cx="19" cy="37" rx="2" ry="0.8" fill="#a08470" opacity="0.4" />
    {/* Ink surface */}
    <ellipse cx="22" cy="39" rx="5" ry="1.5" fill="#1a1a2e" opacity="0.4" />
    {/* Pen shaft — angled */}
    <g transform="rotate(-35, 22, 30)">
      <rect x="8" y="8" width="6" height="34" rx="3" fill="#d97706" />
      <rect x="11" y="9" width="3.5" height="32" rx="1.5" fill="#451a03" opacity="0.25" filter={F} />
      <rect x="7.5" y="9" width="3.5" height="32" rx="1.5" fill="#fef3c7" opacity="0.35" filter={F} />
      <rect x="9" y="12" width="1.5" height="26" rx="0.75" fill="#fff" opacity="0.3" />
      {/* Pen nib */}
      <path d="M9,8 L11,2 L13,8" fill="#451a03" />
      <path d="M9.5,8 L11,3.5" stroke="#92400e" strokeWidth="0.8" opacity="0.4" />
      {/* Nib detail */}
      <line x1="11" y1="2" x2="11" y2="6" stroke="#d97706" strokeWidth="0.5" opacity="0.3" />
    </g>
  </svg>
);

export const OpenBook = ({ size = 40 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 48 53" fill="none">
    {/* Ground shadow */}
    <ellipse cx="24" cy="50" rx="16" ry="2.5" fill="#000" opacity="0.1" />
    {/* Left page */}
    <path d="M4,14 L24,10 L24,42 L4,44Z" fill="#fef3c7" />
    <path d="M4,14 L24,10 L24,18 L4,20Z" fill="#451a03" opacity="0.06" filter={F} />
    <path d="M6,16 L22,12" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    <path d="M6,20 L22,16" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    <path d="M6,24 L22,20" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    <path d="M6,28 L18,24.5" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    {/* Right page */}
    <path d="M44,14 L24,10 L24,42 L44,44Z" fill="#fefce8" />
    <path d="M44,14 L24,10 L24,18 L44,20Z" fill="#fff" opacity="0.3" filter={F} />
    <path d="M26,12 L42,16" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    <path d="M26,16 L42,20" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    <path d="M26,20 L42,24" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    <path d="M26,24 L36,27" stroke="#d4c5a9" strokeWidth="0.5" opacity="0.5" />
    {/* Spine shadow */}
    <line x1="24" y1="10" x2="24" y2="42" stroke="#92400e" strokeWidth="1.5" opacity="0.2" />
    {/* Page edges — thickness */}
    <path d="M4,44 L4,46 L24,44 L44,46 L44,44" fill="#e8dcc6" />
    <path d="M4,44 L4,45.5 L24,43.5" fill="#d4c5a9" opacity="0.5" />
    {/* Binding */}
    <path d="M22,10 L22,42" stroke="#d97706" strokeWidth="1" opacity="0.3" />
    <path d="M26,10 L26,42" stroke="#d97706" strokeWidth="1" opacity="0.3" />
    {/* Cover peeks */}
    <path d="M3,13.5 L24,9.5 L24,10 L4,14Z" fill="#d97706" />
    <path d="M45,13.5 L24,9.5 L24,10 L44,14Z" fill="#b45309" />
  </svg>
);

export const DECO_COMPONENTS = [Lantern, GeometricStar, Qalam, OpenBook];
