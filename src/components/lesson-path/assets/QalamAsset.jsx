import React from 'react';

const QalamAsset = ({ size = 56 }) => (
  <svg width={size} height={size * 1.18} viewBox="0 0 56 66" fill="none">
    <defs>
      <linearGradient id="qa-shaft" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4B86A" />
        <stop offset="100%" stopColor="#9E7E3A" />
      </linearGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="28" cy="63" rx="16" ry="3" fill="rgba(0,0,0,0.1)" />

    {/* Ink pot */}
    <path d="M16,55 Q14,46 18,43 L36,43 Q40,46 38,55Z" fill="#3D2E1E" />
    <ellipse cx="27" cy="43" rx="10" ry="3.5" fill="#4D3E2E" />
    <ellipse cx="25" cy="42.5" rx="5" ry="1.8" fill="#5E4E3E" opacity="0.6" />
    <ellipse cx="27" cy="44" rx="6" ry="1.8" fill="#1B1520" opacity="0.35" />

    {/* Pen shaft — angled */}
    <g transform="rotate(-32, 28, 34)">
      <rect x="10" y="8" width="7" height="38" rx="3.5" fill="url(#qa-shaft)" />

      {/* Right shadow */}
      <rect x="14" y="9" width="3.5" height="36" rx="1.5" fill="rgba(0,0,0,0.12)" />

      {/* Left highlight */}
      <rect x="10" y="9" width="3" height="36" rx="1.5" fill="rgba(255,255,255,0.15)" />

      {/* Specular strip */}
      <rect x="11.5" y="14" width="1.2" height="28" rx="0.6" fill="rgba(255,255,255,0.22)" />

      {/* Nib */}
      <path d="M11.5,8 L13.5,1 L15.5,8" fill="#4D3E2E" />
      <path d="M12,8 L13.5,2.5" stroke="#7A5F28" strokeWidth="0.6" opacity="0.4" />

      {/* Ink on nib */}
      <ellipse cx="13.5" cy="3.5" rx="1" ry="1.5" fill="#1B1520" opacity="0.4" />

      {/* Ferrule ring */}
      <rect x="10" y="40" width="7" height="2.5" rx="1" fill="#9E7E3A" opacity="0.5" />
    </g>
  </svg>
);

export default QalamAsset;
