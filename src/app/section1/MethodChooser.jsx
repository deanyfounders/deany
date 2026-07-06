// Method chooser - "How do you want to learn?" Two cards: the DEANY way (lively,
// tilted sparkles tile, try-a-taste) and the boring way (deliberately flat).
import React, { useState } from 'react';
import { Sparkles, FileText } from 'lucide-react';
import { S1Header, S1Screen } from './ui.jsx';
import { T, SERIF } from '../../onboarding/kit/tokens.js';

function Card({ children, onClick, style }) {
  const [p, setP] = useState(false);
  return (
    <button onClick={onClick} onPointerDown={() => setP(true)} onPointerUp={() => setP(false)} onPointerLeave={() => setP(false)}
      style={{ width: '100%', textAlign: 'left', cursor: 'pointer', transform: p ? 'scale(0.98)' : 'scale(1)', transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', ...style }}>
      {children}
    </button>
  );
}

export default function MethodChooser({ onDeanyWay, onBoringWay, onBack }) {
  return (
    <S1Screen>
      <S1Header onBack={onBack} dot={1} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 22px calc(env(safe-area-inset-bottom) + 20px)' }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: T.ink, margin: '6px 0 6px' }}>How do you want to learn?</h1>
        <p style={{ fontSize: 13, color: T.inkSecondary, margin: '0 0 22px' }}>Be honest.</p>

        {/* The DEANY way */}
        <Card onClick={onDeanyWay} style={{ background: '#E9F6F4', border: `2px solid ${T.teal}`, borderRadius: 18, padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: T.teal, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)' }}><Sparkles size={20} color="#fff" /></span>
            <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: T.tealDeep }}>The DEANY way</span>
            <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 500, color: '#fff', background: T.teal, borderRadius: 999, padding: '3px 10px' }}>Try a taste</span>
          </div>
          <p style={{ fontSize: 13, color: T.ink, lineHeight: 1.55, margin: 0 }}>Answer, get it wrong, get it right, remember it forever. Takes 2 minutes.</p>
        </Card>

        {/* The boring way - deliberately flat */}
        <Card onClick={onBoringWay} style={{ background: '#F3F1EA', border: '1px solid #E0DCCE', borderRadius: 18, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: '#E6E2D6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} color="#8A8676" /></span>
            <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: '#6B6656' }}>The boring way</span>
          </div>
          <p style={{ fontSize: 13, color: '#8A8676', lineHeight: 1.55, margin: 0 }}>A very long wall of text. Very thorough. Very sleepy.</p>
        </Card>
      </div>
    </S1Screen>
  );
}
