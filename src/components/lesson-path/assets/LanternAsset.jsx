import React from 'react';

const LanternAsset = ({ size = 56 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 56 84" fill="none">
    <defs>
      <linearGradient id="la-body" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#D4B86A" />
        <stop offset="100%" stopColor="#9E7E3A" />
      </linearGradient>
      <linearGradient id="la-cap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C5A55A" />
        <stop offset="100%" stopColor="#7A5F28" />
      </linearGradient>
      <radialGradient id="la-glow" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#F5EDD6" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#F5EDD6" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="28" cy="80" rx="16" ry="3.5" fill="rgba(0,0,0,0.12)" />

    {/* Hook + chain */}
    <path d="M24,5 Q28,1 32,5" stroke="#9E7E3A" strokeWidth="2" fill="none" strokeLinecap="round" />
    <line x1="28" y1="6" x2="28" y2="14" stroke="#9E7E3A" strokeWidth="1.5" />

    {/* Top cap dome */}
    <path d="M18,14 Q28,7 38,14 L35,20 L21,20Z" fill="url(#la-cap)" />
    <path d="M18,14 Q28,7 28,14 L25,20 L21,20Z" fill="rgba(255,255,255,0.12)" />

    {/* Body onion dome */}
    <path d="M21,20 Q13,35 16,56 Q18,64 28,67 Q38,64 40,56 Q43,35 35,20Z" fill="url(#la-body)" />

    {/* Right shadow */}
    <path d="M31,22 Q40,35 40,56 Q38,64 28,67" fill="rgba(0,0,0,0.16)" />

    {/* Left highlight */}
    <path d="M24,24 Q16,36 17,50" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

    {/* Inner glow */}
    <ellipse cx="28" cy="42" rx="7" ry="14" fill="url(#la-glow)" />

    {/* Lattice */}
    <line x1="24" y1="28" x2="24" y2="56" stroke="#7A5F28" strokeWidth="0.6" opacity="0.22" />
    <line x1="32" y1="28" x2="32" y2="56" stroke="#7A5F28" strokeWidth="0.6" opacity="0.22" />
    <line x1="18" y1="38" x2="38" y2="38" stroke="#7A5F28" strokeWidth="0.6" opacity="0.18" />
    <line x1="17" y1="48" x2="39" y2="48" stroke="#7A5F28" strokeWidth="0.6" opacity="0.18" />

    {/* Base plate */}
    <rect x="22" y="67" width="12" height="4" rx="2" fill="#7A5F28" />
    <rect x="22" y="67" width="6" height="2.5" rx="1" fill="#C5A55A" opacity="0.3" />
  </svg>
);

export default LanternAsset;
