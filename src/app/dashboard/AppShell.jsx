// AppShell - canvas background, scrollable content, fixed bottom NavBar with
// safe-area handling. All four tabs render inside it.
import React from 'react';
import { Home, Compass, RefreshCw, User, BookOpen } from 'lucide-react';
import { D, RADIUS, FONT, TYPE } from './tokens.js';
import { DashMotion } from './motion.jsx';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'topics', label: 'Topics', icon: Compass },
  { id: 'quran', label: "Qur'an", icon: BookOpen },
  { id: 'review', label: 'Review', icon: RefreshCw },
  { id: 'you', label: 'You', icon: User },
];

// Floating pill nav (deany-home-v1 section 6): white, full radius, hairline border,
// soft shadow, above the safe-area inset. It floats (position:fixed), but the shell
// root reserves NAV_RESERVE at the bottom so the scroll area ends above the pill and
// content can never slide under it - no overlap on any device height.
export function NavBar({ tab, onTab, reviewDot }) {
  return (
    <nav aria-label="Primary" style={{ position: 'fixed', left: 0, right: 0, bottom: 'calc(env(safe-area-inset-bottom) + 14px)', zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto', display: 'flex', gap: 2, background: '#fff', borderRadius: 999, border: '0.5px solid rgba(27,42,74,0.10)', boxShadow: '0 4px 14px rgba(27,42,74,0.08)', padding: '6px 8px', maxWidth: 'calc(100vw - 32px)' }}>
        {TABS.map(t => {
          const active = tab === t.id;
          const showDot = t.id === 'review' && reviewDot;
          return (
            <button key={t.id} onClick={() => onTab(t.id)} aria-label={t.label} aria-current={active} className="dash-press" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: 44, padding: active ? '6px 13px' : '6px 11px',
              borderRadius: 999, border: 'none', cursor: 'pointer', background: active ? '#E4F3ED' : 'transparent', color: active ? '#0B5E48' : '#9AA0AE',
              transition: 'background .15s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
            }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                {React.createElement(t.icon, { size: 20, strokeWidth: active ? 2.4 : 2 })}
                {showDot && <span className="dash-dot" style={{ position: 'absolute', top: -2, right: -3, width: 8, height: 8, borderRadius: '50%', background: D.teal, border: '1.5px solid #fff' }} />}
              </span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function AppShell({ tab, onTab, reviewDot, children }) {
  // Reserve the floating nav's footprint (bottom offset 14 + pill ~60 + gap) plus the
  // safe-area inset on the ROOT. The scroll area (flex:1) fills the remaining box and
  // therefore ENDS above the nav on every device, so content is clipped at the nav's
  // top edge and can never slide under it - the iPhone 12 overlap, fixed structurally,
  // while the nav keeps floating exactly as before on taller iPhones.
  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: '#fff', color: D.ink, fontFamily: FONT, display: 'flex', flexDirection: 'column', paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)' }}>
      <DashMotion />
      {/* overflowX hidden is the prerequisite fix: the page never scrolls sideways. */}
      <div key={tab} className="deany-fade" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y', paddingBottom: 4, maxWidth: 520, margin: '0 auto', width: '100%' }}>
        {children}
      </div>
      <NavBar tab={tab} onTab={onTab} reviewDot={reviewDot} />
    </div>
  );
}
