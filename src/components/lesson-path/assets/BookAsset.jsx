import React from 'react';

const BookAsset = ({ size = 56 }) => (
  <svg width={size} height={size * 0.82} viewBox="0 0 64 52" fill="none">
    <defs>
      <linearGradient id="bk-l" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0%" stopColor="#F5EDD6" />
        <stop offset="100%" stopColor="#E2D8C0" />
      </linearGradient>
      <linearGradient id="bk-r" x1="1" y1="0" x2="0" y2="0.3">
        <stop offset="0%" stopColor="#EDE5CE" />
        <stop offset="100%" stopColor="#D8D0B8" />
      </linearGradient>
      <linearGradient id="bk-cv" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C5A55A" />
        <stop offset="100%" stopColor="#7A5F28" />
      </linearGradient>
    </defs>

    {/* Contact shadow */}
    <ellipse cx="32" cy="49" rx="22" ry="3" fill="rgba(0,0,0,0.1)" />

    {/* Cover edges */}
    <path d="M5,10 L32,5 L59,10 L59,12 L32,7 L5,12Z" fill="url(#bk-cv)" />

    {/* Left page */}
    <path d="M7,13 L32,8 L32,38 L7,42Z" fill="url(#bk-l)" />

    {/* Right page */}
    <path d="M57,13 L32,8 L32,38 L57,42Z" fill="url(#bk-r)" />

    {/* Right page shadow */}
    <path d="M57,13 L32,8 L32,17 L57,22Z" fill="rgba(0,0,0,0.035)" />

    {/* Text lines left */}
    <line x1="11" y1="17" x2="29" y2="13" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="11" y1="22" x2="29" y2="18" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="11" y1="27" x2="29" y2="23" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="11" y1="32" x2="22" y2="29.5" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />

    {/* Text lines right */}
    <line x1="34" y1="13" x2="53" y2="17" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="34" y1="18" x2="53" y2="22" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="34" y1="23" x2="53" y2="27" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />
    <line x1="34" y1="28" x2="44" y2="31" stroke="#C5B898" strokeWidth="0.6" opacity="0.4" />

    {/* Spine */}
    <line x1="32" y1="8" x2="32" y2="38" stroke="rgba(0,0,0,0.13)" strokeWidth="2.5" />

    {/* Page thickness */}
    <path d="M7,42 L7,44.5 L32,39.5 L57,44.5 L57,42 L32,38Z" fill="#D8D0B8" />
    <path d="M7,42 L7,43.5 L32,39" fill="#C5B898" opacity="0.4" />

    {/* Binding */}
    <line x1="30" y1="8" x2="30" y2="38" stroke="#C5A55A" strokeWidth="0.7" opacity="0.2" />
    <line x1="34" y1="8" x2="34" y2="38" stroke="#C5A55A" strokeWidth="0.7" opacity="0.2" />
  </svg>
);

export default BookAsset;
