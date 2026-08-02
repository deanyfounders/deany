// AppShell - canvas background, scrollable content, flush bottom NavBar in normal
// flex flow (never floating) with safe-area handling. All tabs render inside it.
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

// Flush bottom nav: a full-width bar in normal flex flow (NOT floating) - squared
// corners, a 1px top hairline, no shadow, no side margins. It sits below the scroll
// area as a flex sibling, so page content ends above it and can never hide behind
// it. The safe-area inset is padded INSIDE the bar so the tap targets clear the
// iPhone home indicator. Icons, labels, active state and behaviour are unchanged.
export function NavBar({ tab, onTab, reviewDot }) {
  return (
    <nav aria-label="Primary" style={{ flexShrink: 0, background: '#fff', borderTop: '1px solid rgba(27,42,74,0.10)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'stretch', gap: 2, maxWidth: 520, margin: '0 auto', padding: '6px 6px' }}>
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
  // Flex column: scroll area (flex:1) + nav (flex-shrink:0) below it. The nav takes
  // real flow space, so the scroll area ends at the nav's top edge - content can
  // never slide under the bar, on any device height. No root reserve needed.
  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: '#fff', color: D.ink, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <DashMotion />
      {/* overflowX hidden is the prerequisite fix: the page never scrolls sideways. */}
      <div key={tab} className="deany-fade" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y', paddingBottom: 8, maxWidth: 520, margin: '0 auto', width: '100%' }}>
        {children}
      </div>
      <NavBar tab={tab} onTab={onTab} reviewDot={reviewDot} />
    </div>
  );
}
