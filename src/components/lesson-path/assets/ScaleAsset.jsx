import React from 'react';

const ScaleAsset = ({ size = 48 }) => (
  <svg width={size} height={size * 1.17} viewBox="0 0 56 66" fill="none">
    <defs>
      <linearGradient id="sc-metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4B86A" />
        <stop offset="50%" stopColor="#C5A55A" />
        <stop offset="100%" stopColor="#9E7E3A" />
      </linearGradient>
      <linearGradient id="sc-dark" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#B89A4A" />
        <stop offset="100%" stopColor="#7A5F28" />
      </linearGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="28" cy="63" rx="16" ry="2.5" fill="rgba(0,0,0,0.12)" />

    {/* Base pedestal */}
    <path d="M17,58 L39,58 Q41,58 41,56 L41,53 Q41,51 39,51 L17,51 Q15,51 15,53 L15,56 Q15,58 17,58Z" fill="url(#sc-dark)" />
    <rect x="15" y="51" width="26" height="3.5" rx="1.5" fill="url(#sc-metal)" />
    <rect x="17" y="51" width="11" height="2" rx="1" fill="rgba(255,255,255,0.15)" />

    {/* Central pillar */}
    <rect x="24" y="18" width="8" height="33" rx="3" fill="url(#sc-metal)" />
    <rect x="28" y="19" width="4.5" height="31" rx="2" fill="rgba(0,0,0,0.1)" />
    <rect x="24" y="19" width="3.5" height="31" rx="1.5" fill="rgba(255,255,255,0.12)" />

    {/* Horizontal beam */}
    <rect x="2" y="12" width="52" height="7" rx="3.5" fill="url(#sc-metal)" />
    <rect x="4" y="12" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
    <rect x="4" y="16" width="48" height="3" rx="1.5" fill="rgba(0,0,0,0.06)" />

    {/* Left chains */}
    <line x1="8" y1="19" x2="8" y2="35" stroke="#9E7E3A" strokeWidth="1" />
    <line x1="13" y1="19" x2="13" y2="35" stroke="#9E7E3A" strokeWidth="1" />

    {/* Right chains */}
    <line x1="43" y1="19" x2="43" y2="35" stroke="#9E7E3A" strokeWidth="1" />
    <line x1="48" y1="19" x2="48" y2="35" stroke="#9E7E3A" strokeWidth="1" />

    {/* Left pan — side (depth) */}
    <ellipse cx="10.5" cy="38" rx="10.5" ry="3" fill="url(#sc-dark)" />
    {/* Left pan — top face */}
    <ellipse cx="10.5" cy="36.5" rx="10.5" ry="3" fill="url(#sc-metal)" />
    <ellipse cx="9" cy="36" rx="4.5" ry="1.5" fill="rgba(255,255,255,0.18)" />

    {/* Right pan — side */}
    <ellipse cx="45.5" cy="38" rx="10.5" ry="3" fill="url(#sc-dark)" />
    {/* Right pan — top face */}
    <ellipse cx="45.5" cy="36.5" rx="10.5" ry="3" fill="url(#sc-metal)" />
    <ellipse cx="44" cy="36" rx="4.5" ry="1.5" fill="rgba(255,255,255,0.18)" />

    {/* Top finial sphere */}
    <circle cx="28" cy="10" r="4.5" fill="url(#sc-metal)" />
    <circle cx="26.5" cy="8.5" r="1.8" fill="rgba(255,255,255,0.25)" />
  </svg>
);

export default ScaleAsset;
