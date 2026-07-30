// Topic illustrations for the carousel (spec section 4). Flat vector, THICK dark
// outlines, solid fills - no gradients, no soft shadows, no photographic texture.
// Three objects maximum. HARD CONSTRAINTS, written into the brief on purpose:
// no text or letterforms (they won't survive Arabic localisation), no currency
// symbols, no percent signs, and no people, animals, prophets or companions.
// Palette per piece is the topic accent + navy outlines + cream only - never
// another topic's accent. These are engineering placeholders in that exact brief;
// a commissioned PNG/SVG per topic drops in behind the same <TopicArt> contract.
import React from 'react';

const INK = '#1B2A4A';   // navy outline
const CREAM = '#FBFAF6';
const SW = 4;            // thick outline

const g = { fill: 'none', stroke: INK, strokeWidth: SW, strokeLinejoin: 'round', strokeLinecap: 'round' };

// Balance scale + coin stack + certificate - Islamic finance.
function Finance({ base, deep }) {
  return (
    <g>
      {/* certificate */}
      <rect x="24" y="30" width="78" height="104" rx="8" fill={CREAM} {...g} />
      <rect x="34" y="40" width="58" height="84" rx="4" fill="none" stroke={deep} strokeWidth="2" />
      <line x1="42" y1="66" x2="84" y2="66" stroke={deep} strokeWidth="3" />
      <line x1="42" y1="80" x2="84" y2="80" stroke={deep} strokeWidth="3" />
      <path d="M63 96 l6 4 -2 7 -4 0 -4 0 -2 -7 z" fill={base} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* coin stack */}
      <g>
        <ellipse cx="86" cy="150" rx="30" ry="10" fill={base} {...g} />
        <path d="M56 132 v18 a30 10 0 0 0 60 0 v-18" fill={base} {...g} />
        <ellipse cx="86" cy="132" rx="30" ry="10" fill={base} {...g} />
        <ellipse cx="86" cy="132" rx="16" ry="5" fill="none" stroke={deep} strokeWidth="2.5" />
      </g>
      {/* balance scale */}
      <ellipse cx="210" cy="158" rx="46" ry="9" fill={base} {...g} />
      <rect x="204" y="70" width="12" height="80" rx="5" fill={deep} {...g} />
      <rect x="150" y="66" width="120" height="9" rx="4.5" fill={base} {...g} />
      <circle cx="210" cy="64" r="11" fill={base} {...g} />
      <line x1="160" y1="72" x2="160" y2="98" {...g} />
      <path d="M138 98 h44 l-8 20 h-28 z" fill={base} {...g} />
      <line x1="260" y1="72" x2="260" y2="98" {...g} />
      <path d="M238 98 h44 l-8 20 h-28 z" fill={CREAM} {...g} />
    </g>
  );
}

// Astrolabe + manuscript spread + city gate - Islamic history.
function History({ base, deep }) {
  return (
    <g>
      {/* city gate */}
      <rect x="30" y="70" width="26" height="88" rx="4" fill={base} {...g} />
      <rect x="118" y="70" width="26" height="88" rx="4" fill={base} {...g} />
      <path d="M56 158 V104 a31 31 0 0 1 62 0 v54" fill={CREAM} {...g} />
      <rect x="74" y="126" width="26" height="32" rx="3" fill={deep} {...g} />
      {/* manuscript spread */}
      <path d="M166 150 q30 -14 58 0 v-56 q-28 -12 -58 0 z" fill={CREAM} {...g} />
      <line x1="195" y1="96" x2="195" y2="146" stroke={deep} strokeWidth="3" />
      <line x1="176" y1="112" x2="190" y2="110" stroke={deep} strokeWidth="2.5" />
      <line x1="200" y1="110" x2="214" y2="112" stroke={deep} strokeWidth="2.5" />
      {/* astrolabe */}
      <circle cx="256" cy="86" r="34" fill={base} {...g} />
      <circle cx="256" cy="86" r="22" fill={CREAM} {...g} />
      <line x1="222" y1="86" x2="290" y2="86" stroke={INK} strokeWidth="3" />
      <line x1="256" y1="52" x2="256" y2="120" stroke={INK} strokeWidth="3" />
      <circle cx="256" cy="86" r="5" fill={deep} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

// Illuminated frame + mihrab arch + rihal book stand - Quran and Arabic.
function Quran({ base, deep }) {
  return (
    <g>
      {/* rihal (X book stand) with a book */}
      <line x1="196" y1="100" x2="244" y2="152" {...g} stroke={deep} />
      <line x1="244" y1="100" x2="196" y2="152" {...g} stroke={deep} />
      <path d="M188 96 q32 -16 64 0 l-6 10 q-26 -12 -52 0 z" fill={base} {...g} />
      {/* illuminated frame + mihrab */}
      <rect x="60" y="26" width="118" height="126" rx="10" fill={CREAM} {...g} />
      <rect x="70" y="36" width="98" height="106" rx="6" fill="none" stroke={deep} strokeWidth="2.5" />
      <path d="M86 142 V92 q0 -33 33 -33 q33 0 33 33 v50" fill={base} {...g} />
      <path d="M119 59 l7 12 -7 12 -7 -12 z" fill={CREAM} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="119" cy="120" r="6" fill={CREAM} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

// Dashed plus placeholder - the add-topic slide (the only slide with no art).
function Add({ base }) {
  return (
    <g fill="none">
      <rect x="96" y="46" width="148" height="96" rx="16" stroke={base} strokeWidth="4" strokeDasharray="10 10" />
      <line x1="170" y1="72" x2="170" y2="116" stroke={base} strokeWidth="7" strokeLinecap="round" />
      <line x1="148" y1="94" x2="192" y2="94" stroke={base} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

const ART = { 'islamic-finance': Finance, 'islamic-history': History, 'quran-arabic': Quran, 'add-topic': Add };

export default function TopicArt({ topic, accent, style }) {
  const Piece = ART[topic] || Add;
  return (
    <svg viewBox="0 0 300 184" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={style}>
      <Piece base={accent.base} deep={accent.deep} />
    </svg>
  );
}
