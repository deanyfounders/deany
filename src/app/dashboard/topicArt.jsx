// Topic illustrations for the carousel (spec section 7). Flat vector, solid fills,
// no gradients or shadows. HARD CONSTRAINT: no figurative depiction of people or
// animals, and none of prophets or companions - objects, geometry, architecture
// only. Palette per piece: the topic accent (base + deep), one neutral, the cream
// canvas. These are engineering placeholders in the DEANY brief's direction; a
// commissioned set can drop in behind the same <TopicArt topic art> contract.
import React from 'react';

const CREAM = '#FBFAF6';
const NEUTRAL = '#D9CFC0';

// Balance scales - Islamic finance (fairness of exchange).
function Finance({ base, deep }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="170" cy="150" rx="52" ry="8" fill={base} opacity="0.18" />
      <rect x="150" y="140" width="40" height="9" rx="4" fill={deep} />
      <rect x="166" y="50" width="8" height="92" rx="4" fill={deep} />
      <rect x="94" y="54" width="152" height="7" rx="3.5" fill={deep} />
      <circle cx="170" cy="50" r="10" fill={base} stroke={deep} strokeWidth="3" />
      <line x1="101" y1="58" x2="101" y2="88" stroke={deep} strokeWidth="2.5" />
      <path d="M79 88 h44 l-9 22 h-26 z" fill={base} stroke={deep} strokeWidth="2.5" />
      <line x1="239" y1="58" x2="239" y2="88" stroke={deep} strokeWidth="2.5" />
      <path d="M217 88 h44 l-9 22 h-26 z" fill={CREAM} stroke={deep} strokeWidth="2.5" />
      <circle cx="239" cy="78" r="6.5" fill={base} stroke={deep} strokeWidth="2" />
    </g>
  );
}

// City gate + astrolabe - Islamic history (places and instruments).
function History({ base, deep }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round" fill="none">
      <rect x="96" y="60" width="30" height="82" rx="4" fill={NEUTRAL} />
      <rect x="214" y="60" width="30" height="82" rx="4" fill={NEUTRAL} />
      <path d="M126 142 V96 a44 44 0 0 1 88 0 v46" fill={base} stroke={deep} strokeWidth="3" />
      <path d="M126 142 V96 a44 44 0 0 1 88 0 v46" stroke={CREAM} strokeWidth="0" />
      <rect x="150" y="118" width="40" height="24" rx="3" fill={deep} />
      <circle cx="170" cy="94" r="22" fill={CREAM} stroke={deep} strokeWidth="3" />
      <line x1="148" y1="94" x2="192" y2="94" stroke={deep} strokeWidth="2.5" />
      <line x1="170" y1="72" x2="170" y2="116" stroke={deep} strokeWidth="2.5" />
      <circle cx="170" cy="94" r="4" fill={base} />
      <rect x="88" y="142" width="164" height="8" rx="4" fill={deep} />
    </g>
  );
}

// Mihrab arch in an illuminated frame - Quran and Arabic.
function Quran({ base, deep }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round" fill="none">
      <rect x="110" y="30" width="120" height="118" rx="10" fill={CREAM} stroke={base} strokeWidth="3" />
      <rect x="118" y="38" width="104" height="102" rx="7" stroke={deep} strokeWidth="1.6" />
      <path d="M134 140 V86 q0 -36 36 -36 q36 0 36 36 v54" fill={base} opacity="0.16" />
      <path d="M134 140 V86 q0 -36 36 -36 q36 0 36 36 v54" stroke={deep} strokeWidth="3" />
      <path d="M170 50 l7 12 -7 12 -7 -12 z" fill={base} stroke={deep} strokeWidth="2" />
      <circle cx="170" cy="118" r="5" fill={base} />
    </g>
  );
}

// Dashed frame + plus - the add-topic slide (the one slide with no commissioned art).
function Add({ base }) {
  return (
    <g fill="none">
      <rect x="96" y="44" width="148" height="96" rx="14" stroke={base} strokeWidth="3" strokeDasharray="8 8" />
      <line x1="170" y1="72" x2="170" y2="112" stroke={base} strokeWidth="5" strokeLinecap="round" />
      <line x1="150" y1="92" x2="190" y2="92" stroke={base} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

const ART = { 'islamic-finance': Finance, 'islamic-history': History, 'quran-arabic': Quran, 'add-topic': Add };

export default function TopicArt({ topic, accent, style }) {
  const Piece = ART[topic] || Add;
  return (
    <svg viewBox="0 0 340 168" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={style}>
      <Piece base={accent.base} deep={accent.deep} tint={accent.tint} />
    </svg>
  );
}
