import React from 'react';

const LanternAsset = ({ size = 48 }) => (
  <svg width={size} height={size * 1.45} viewBox="0 0 44 64" fill="none">
    <defs>
      <linearGradient id="lan-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4B86A" />
        <stop offset="100%" stopColor="#9E7E3A" />
      </linearGradient>
      <linearGradient id="lan-cap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C5A55A" />
        <stop offset="100%" stopColor="#7A5F28" />
      </linearGradient>
      <radialGradient id="lan-glow" cx="50%" cy="45%">
        <stop offset="0%" stopColor="#F5EDD6" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#F5EDD6" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="22" cy="61" rx="13" ry="2.5" fill="rgba(0,0,0,0.12)" />

    {/* Hook + chain */}
    <path d="M19.5,3 Q22,0.5 24.5,3" stroke="#9E7E3A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <line x1="22" y1="4" x2="22" y2="11" stroke="#9E7E3A" strokeWidth="1.2" />

    {/* Top cap — dome */}
    <path d="M15,11 Q22,5.5 29,11 L27,16 L17,16Z" fill="url(#lan-cap)" />
    <path d="M15,11 Q22,5.5 22,11 L20,16 L17,16Z" fill="rgba(255,255,255,0.12)" />

    {/* Body — onion-dome shape */}
    <path d="M17,16 Q11.5,27 13.5,41 Q15,48 22,50 Q29,48 30.5,41 Q32.5,27 27,16Z" fill="url(#lan-body)" />

    {/* Shadow (right side) */}
    <path d="M24,18 Q30,28 30,41 Q29,48 22,50" fill="rgba(0,0,0,0.15)" />

    {/* Highlight (left edge) */}
    <path d="M19,19 Q14,28 14.5,37" stroke="rgba(255,255,255,0.28)" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Inner glow */}
    <ellipse cx="22" cy="32" rx="5" ry="10" fill="url(#lan-glow)" />

    {/* Lattice hints */}
    <line x1="19" y1="22" x2="19" y2="42" stroke="#7A5F28" strokeWidth="0.5" opacity="0.25" />
    <line x1="25" y1="22" x2="25" y2="42" stroke="#7A5F28" strokeWidth="0.5" opacity="0.25" />
    <line x1="15" y1="30" x2="29" y2="30" stroke="#7A5F28" strokeWidth="0.5" opacity="0.2" />
    <line x1="14" y1="36" x2="30" y2="36" stroke="#7A5F28" strokeWidth="0.5" opacity="0.2" />

    {/* Base plate */}
    <rect x="17" y="50" width="10" height="3.5" rx="1.5" fill="#7A5F28" />
    <rect x="17" y="50" width="5" height="2" rx="1" fill="#C5A55A" opacity="0.35" />
  </svg>
);

export default LanternAsset;
