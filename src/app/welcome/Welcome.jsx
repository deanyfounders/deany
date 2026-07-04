// Onboarding walkthrough (Phase 2). Four full-height, scroll-snap screens.
// Copy is reused from the approved landing page - no new claims are made here.
import React, { useRef, useState } from 'react';
import { ShieldCheck, Flame } from 'lucide-react';
import { DeanyMark, PillButton, TOKENS } from '../shared/AppScreen.jsx';
import stepBites from '../../assets/step-bites.jpg';

const serif = 'Georgia, serif';

// Each screen: one idea, reusing approved landing copy.
const SCREENS = [
  {
    key: 'what',
    render: () => (
      <>
        <DeanyMark size={68} />
        <h1 style={h1Style}>Start where you are.</h1>
        <p style={pStyle}>
          Ten minute lessons on the Pillars, the Quran, Islamic finance, and history. No prerequisites.
        </p>
      </>
    ),
  },
  {
    key: 'learn',
    render: () => (
      <>
        <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <img src={stepBites} alt="" style={{ maxWidth: '78%', maxHeight: 220, objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>
        <h1 style={h1Style}>Learn in small bites</h1>
        <p style={pStyle}>Small lessons make steady progress easy.</p>
      </>
    ),
  },
  {
    key: 'source',
    render: () => (
      <>
        <div style={iconWrap('rgba(34,163,154,0.12)')}><ShieldCheck size={34} color={TOKENS.tealDeep} /></div>
        <h1 style={h1Style}>Reviewed by scholars</h1>
        <p style={pStyle}>
          Every lesson is reviewed by qualified scholars and cites primary sources you can verify.
        </p>
      </>
    ),
  },
  {
    key: 'habit',
    render: (onStart, onSkip) => (
      <>
        <div style={iconWrap('rgba(240,180,41,0.15)')}><Flame size={34} color={TOKENS.gold} /></div>
        <h1 style={h1Style}>Build a daily habit</h1>
        <p style={{ ...pStyle, marginBottom: 30 }}>Show up daily and watch your knowledge grow.</p>
        <PillButton onClick={onStart}>Take the calibration quiz</PillButton>
      </>
    ),
  },
];

export default function Welcome({ appState }) {
  const { completeOnboarding } = appState;
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const last = SCREENS.length - 1;

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', background: TOKENS.canvas, overflow: 'hidden' }}>
      {/* Skip - screens 1 to 3 only */}
      {active < last && (
        <button onClick={completeOnboarding} style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top) + 14px)', right: 18, zIndex: 3,
          background: 'none', border: 'none', color: TOKENS.muted, fontSize: 14, fontWeight: 500,
          cursor: 'pointer', padding: 8, WebkitTapHighlightColor: 'transparent',
        }}>Skip</button>
      )}

      {/* Horizontal scroll-snap track */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="deany-onboard-scroller"
        style={{
          display: 'flex', height: '100%', width: '100%', overflowX: 'auto', overflowY: 'hidden',
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain',
        }}
      >
        {SCREENS.map((s) => (
          <section key={s.key} style={{
            flex: '0 0 100%', width: '100%', height: '100%', scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', fontFamily: '"Source Sans 3", system-ui, sans-serif',
            padding: 'calc(env(safe-area-inset-top) + 56px) 28px calc(env(safe-area-inset-bottom) + 96px)',
          }}>
            {s.render(completeOnboarding, completeOnboarding)}
          </section>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom) + 34px)', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 8, zIndex: 3,
      }}>
        {SCREENS.map((_, i) => (
          <span key={i} style={{
            width: i === active ? 22 : 8, height: 8, borderRadius: 4,
            background: i === active ? TOKENS.teal : 'rgba(27,42,74,0.2)',
            transition: 'width .25s ease, background .25s ease',
          }} />
        ))}
      </div>

      <style>{`.deany-onboard-scroller::-webkit-scrollbar{display:none}.deany-onboard-scroller{scrollbar-width:none}`}</style>
    </div>
  );
}

// ── shared inline styles ──────────────────────────────────────────
const h1Style = { fontFamily: serif, fontSize: 30, fontWeight: 500, color: TOKENS.tealDeep, margin: '22px 0 12px', lineHeight: 1.15 };
const pStyle = { fontSize: 15.5, color: TOKENS.muted, lineHeight: 1.65, maxWidth: 330, margin: 0 };
const iconWrap = (bg) => ({ width: 76, height: 76, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' });
