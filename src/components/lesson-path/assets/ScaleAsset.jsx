import React from 'react';

const ScaleAsset = ({ size = 56 }) => (
  <svg width={size} height={size * 1.14} viewBox="0 0 64 73" fill="none">
    <defs>
      <linearGradient id="sc-m" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4B86A" />
        <stop offset="50%" stopColor="#C5A55A" />
        <stop offset="100%" stopColor="#9E7E3A" />
      </linearGradient>
      <linearGradient id="sc-d" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#B89A4A" />
        <stop offset="100%" stopColor="#7A5F28" />
      </linearGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="32" cy="70" rx="18" ry="3" fill="rgba(0,0,0,0.12)" />

    {/* Base */}
    <path d="M20,64 L44,64 Q46,64 46,62 L46,59 Q46,57 44,57 L20,57 Q18,57 18,59 L18,62 Q18,64 20,64Z" fill="url(#sc-d)" />
    <rect x="18" y="57" width="28" height="3.5" rx="1.5" fill="url(#sc-m)" />
    <rect x="20" y="57" width="12" height="2" rx="1" fill="rgba(255,255,255,0.14)" />

    {/* Pillar */}
    <rect x="28" y="20" width="8" height="37" rx="3.5" fill="url(#sc-m)" />
    <rect x="32" y="21" width="4.5" height="35" rx="2" fill="rgba(0,0,0,0.1)" />
    <rect x="28" y="21" width="3.5" height="35" rx="1.5" fill="rgba(255,255,255,0.13)" />

    {/* Beam */}
    <rect x="3" y="14" width="58" height="7.5" rx="3.5" fill="url(#sc-m)" />
    <rect x="5" y="14" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.13)" />
    <rect x="5" y="18" width="54" height="3.5" rx="1.5" fill="rgba(0,0,0,0.06)" />

    {/* Left chains */}
    <line x1="10" y1="21.5" x2="10" y2="39" stroke="#9E7E3A" strokeWidth="1" />
    <line x1="15" y1="21.5" x2="15" y2="39" stroke="#9E7E3A" strokeWidth="1" />

    {/* Right chains */}
    <line x1="49" y1="21.5" x2="49" y2="39" stroke="#9E7E3A" strokeWidth="1" />
    <line x1="54" y1="21.5" x2="54" y2="39" stroke="#9E7E3A" strokeWidth="1" />

    {/* Left pan */}
    <ellipse cx="12.5" cy="42" rx="12" ry="3.5" fill="url(#sc-d)" />
    <ellipse cx="12.5" cy="40.5" rx="12" ry="3.5" fill="url(#sc-m)" />
    <ellipse cx="10" cy="40" rx="5" ry="1.8" fill="rgba(255,255,255,0.16)" />

    {/* Right pan */}
    <ellipse cx="51.5" cy="42" rx="12" ry="3.5" fill="url(#sc-d)" />
    <ellipse cx="51.5" cy="40.5" rx="12" ry="3.5" fill="url(#sc-m)" />
    <ellipse cx="49" cy="40" rx="5" ry="1.8" fill="rgba(255,255,255,0.16)" />

    {/* Finial */}
    <circle cx="32" cy="11.5" r="5" fill="url(#sc-m)" />
    <circle cx="30.5" cy="10" r="2" fill="rgba(255,255,255,0.22)" />
  </svg>
);

export default ScaleAsset;
