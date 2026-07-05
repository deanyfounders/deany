// Onboarding (Phase 2, redesigned). A swipeable deck of the real homepage
// sections - hero, three steps, the Deany method, the paths on offer, and the
// scholarly-review emphasis - ending on the calibration-quiz CTA. Each panel
// swipes horizontally and scrolls vertically when it is taller than the screen.
import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import QuizSection from '../../components/QuizSection.jsx';
import { HeroSection, StepsSection, PathsSection, SourcesSection } from '../../components/marketing/HomeSections.jsx';
import { C } from '../../components/marketing/tokens.js';

const PAGES = [
  { key: 'hero', bg: C.canvas, render: () => <HeroSection /> },
  { key: 'steps', bg: C.surface, render: () => <StepsSection /> },
  { key: 'method', bg: C.canvas, render: () => <QuizSection /> },
  { key: 'paths', bg: C.surface, render: () => <PathsSection /> },
  { key: 'sources', bg: C.canvas, render: () => <SourcesSection /> },
];

export default function Welcome({ appState }) {
  const { completeOnboarding } = appState;
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const last = PAGES.length - 1;

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };

  const goNext = () => {
    if (active >= last) { completeOnboarding(); return; }
    const el = scrollerRef.current;
    el?.scrollTo({ left: (active + 1) * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', background: C.canvas, overflow: 'hidden', fontFamily: '"Source Sans 3", system-ui, sans-serif' }}>
      {/* Skip - not on the last panel */}
      {active < last && (
        <button onClick={completeOnboarding} style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', right: 16, zIndex: 5,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          border: `1px solid ${C.border}`, borderRadius: 16, color: C.textMuted, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', padding: '6px 12px', WebkitTapHighlightColor: 'transparent',
        }}>Skip</button>
      )}

      {/* Horizontal paged deck; each panel scrolls vertically on its own */}
      <div ref={scrollerRef} onScroll={onScroll} className="ob-deck" style={{
        display: 'flex', height: '100%', width: '100%', overflowX: 'auto', overflowY: 'hidden',
        scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain',
      }}>
        {PAGES.map(p => (
          <div key={p.key} style={{
            flex: '0 0 100%', width: '100%', height: '100%', scrollSnapAlign: 'start',
            overflowY: 'auto', overflowX: 'hidden', background: p.bg,
            paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 104px)',
          }}>
            {p.render()}
          </div>
        ))}
      </div>

      {/* Fixed bottom bar: dots + Continue / final CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
        padding: '14px 20px calc(env(safe-area-inset-bottom) + 14px)',
        background: 'linear-gradient(180deg, rgba(251,250,246,0) 0%, rgba(251,250,246,0.92) 34%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {PAGES.map((_, i) => (
            <span key={i} style={{ width: i === active ? 22 : 8, height: 8, borderRadius: 4, background: i === active ? C.teal : 'rgba(15,76,92,0.2)', transition: 'width .25s ease, background .25s ease' }} />
          ))}
        </div>
        <button onClick={goNext} style={{
          width: '100%', maxWidth: 360, minHeight: 52, padding: '14px 22px',
          background: C.teal, color: '#fff', border: 'none', borderRadius: 26, fontSize: 16, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 6px 18px rgba(34,163,154,0.3)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
        }}>
          {active === last ? 'Take the calibration quiz' : 'Continue'}
          <ArrowRight size={17} />
        </button>
      </div>

      <style>{`.ob-deck::-webkit-scrollbar{display:none}.ob-deck{scrollbar-width:none}`}</style>
    </div>
  );
}
