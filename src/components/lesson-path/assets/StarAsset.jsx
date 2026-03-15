import React from 'react';

const StarAsset = ({ size = 48 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 48 55" fill="none">
    <defs>
      <linearGradient id="st-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4B86A" />
        <stop offset="100%" stopColor="#9E7E3A" />
      </linearGradient>
      <linearGradient id="st-light" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#E8D48A" />
        <stop offset="100%" stopColor="#C5A55A" />
      </linearGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="24" cy="52" rx="14" ry="2.5" fill="rgba(0,0,0,0.1)" />

    {/* Pedestal base — side */}
    <rect x="14" y="43" width="20" height="5" rx="2.5" fill="#7A5F28" />
    {/* Pedestal base — top face */}
    <rect x="14" y="41" width="20" height="4" rx="2" fill="#9E7E3A" />
    <rect x="15" y="41" width="9" height="2.5" rx="1.2" fill="rgba(255,255,255,0.12)" />

    {/* 8-pointed star — two overlapping rotated squares */}
    <g transform="translate(24,23)">
      {/* Back square (45deg) */}
      <rect x="-13" y="-13" width="26" height="26" rx="2.5" fill="url(#st-gold)" transform="rotate(45)" />
      {/* Front square (0deg) */}
      <rect x="-13" y="-13" width="26" height="26" rx="2.5" fill="url(#st-light)" />

      {/* Shadow — bottom-right quadrant */}
      <path d="M0,-13 L13,-13 L13,13 L0,13Z" fill="rgba(0,0,0,0.08)" />

      {/* Highlight — top-left corner */}
      <path d="M-13,-13 L-4,-13 L-13,-4Z" fill="rgba(255,255,255,0.14)" />

      {/* Inner circle ring */}
      <circle cx="0" cy="0" r="7" fill="none" stroke="#9E7E3A" strokeWidth="1" opacity="0.25" />

      {/* Center jewel */}
      <circle cx="0" cy="0" r="4.5" fill="#C5A55A" />
      <circle cx="-1" cy="-1.5" r="2" fill="rgba(255,255,255,0.25)" />
    </g>
  </svg>
);

export default StarAsset;
