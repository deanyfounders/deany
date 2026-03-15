import React from 'react';

const BookAsset = ({ size = 48 }) => (
  <svg width={size} height={size * 0.88} viewBox="0 0 52 46" fill="none">
    <defs>
      <linearGradient id="bk-left" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0%" stopColor="#F5EDD6" />
        <stop offset="100%" stopColor="#E8DCC0" />
      </linearGradient>
      <linearGradient id="bk-right" x1="1" y1="0" x2="0" y2="0.3">
        <stop offset="0%" stopColor="#EDE5CE" />
        <stop offset="100%" stopColor="#DDD5BE" />
      </linearGradient>
      <linearGradient id="bk-cover" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C5A55A" />
        <stop offset="100%" stopColor="#7A5F28" />
      </linearGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="26" cy="43" rx="18" ry="2.5" fill="rgba(0,0,0,0.1)" />

    {/* Cover edges peek */}
    <path d="M4,9 L26,5 L48,9 L48,10.5 L26,6.5 L4,10.5Z" fill="url(#bk-cover)" />

    {/* Left page */}
    <path d="M6,11 L26,7 L26,35 L6,38Z" fill="url(#bk-left)" />

    {/* Right page */}
    <path d="M46,11 L26,7 L26,35 L46,38Z" fill="url(#bk-right)" />

    {/* Right page subtle shadow */}
    <path d="M46,11 L26,7 L26,15 L46,19Z" fill="rgba(0,0,0,0.03)" />

    {/* Text lines — left */}
    <line x1="9" y1="15" x2="24" y2="11.5" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="9" y1="19" x2="24" y2="15.5" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="9" y1="23" x2="24" y2="19.5" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="9" y1="27" x2="18" y2="24.5" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />

    {/* Text lines — right */}
    <line x1="28" y1="11.5" x2="43" y2="15" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="28" y1="15.5" x2="43" y2="19" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="28" y1="19.5" x2="43" y2="23" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="28" y1="23.5" x2="36" y2="26" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />

    {/* Spine shadow */}
    <line x1="26" y1="7" x2="26" y2="35" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />

    {/* Page thickness */}
    <path d="M6,38 L6,40 L26,36.5 L46,40 L46,38 L26,35Z" fill="#DDD5BE" />
    <path d="M6,38 L6,39.5 L26,36" fill="#C5B898" opacity="0.4" />

    {/* Binding detail */}
    <line x1="24.5" y1="7" x2="24.5" y2="35" stroke="#C5A55A" strokeWidth="0.7" opacity="0.2" />
    <line x1="27.5" y1="7" x2="27.5" y2="35" stroke="#C5A55A" strokeWidth="0.7" opacity="0.2" />
  </svg>
);

export default BookAsset;
