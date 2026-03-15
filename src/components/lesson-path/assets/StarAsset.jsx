import React from 'react';

const StarAsset = ({ size = 56 }) => (
  <svg width={size} height={size * 1.12} viewBox="0 0 56 63" fill="none">
    <defs>
      <linearGradient id="st-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4B86A" />
        <stop offset="100%" stopColor="#9E7E3A" />
      </linearGradient>
      <linearGradient id="st-l" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#E8D48A" />
        <stop offset="100%" stopColor="#C5A55A" />
      </linearGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="28" cy="60" rx="16" ry="3" fill="rgba(0,0,0,0.1)" />

    {/* Pedestal — side */}
    <rect x="17" y="49" width="22" height="6" rx="3" fill="#7A5F28" />
    {/* Pedestal — top */}
    <rect x="17" y="47" width="22" height="5" rx="2.5" fill="#9E7E3A" />
    <rect x="18" y="47" width="10" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />

    {/* 8-pointed star — two overlapping rotated squares */}
    <g transform="translate(28,26)">
      <rect x="-15" y="-15" width="30" height="30" rx="3" fill="url(#st-g)" transform="rotate(45)" />
      <rect x="-15" y="-15" width="30" height="30" rx="3" fill="url(#st-l)" />

      {/* Shadow quadrant */}
      <path d="M0,-15 L15,-15 L15,15 L0,15Z" fill="rgba(0,0,0,0.08)" />

      {/* Highlight corner */}
      <path d="M-15,-15 L-5,-15 L-15,-5Z" fill="rgba(255,255,255,0.12)" />

      {/* Inner ring */}
      <circle cx="0" cy="0" r="8" fill="none" stroke="#9E7E3A" strokeWidth="1" opacity="0.25" />

      {/* Center jewel */}
      <circle cx="0" cy="0" r="5" fill="#C5A55A" />
      <circle cx="-1.2" cy="-1.5" r="2.2" fill="rgba(255,255,255,0.25)" />
    </g>
  </svg>
);

export default StarAsset;
