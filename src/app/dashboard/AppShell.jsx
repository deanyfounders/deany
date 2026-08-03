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

// Height of the bar's content (excluding the safe-area inset), in px. The scroll
// area reserves this much + inset so nothing hides behind the fixed bar.
export const NAV_HEIGHT = 66;

// Solid bottom nav bar: position:fixed to the viewport bottom, so it NEVER moves
// while the dashboard scrolls. Full width, flush, squared corners, a 1px top border
// and a soft upward shadow that separates it as its own solid layer above the page.
// Safe-area inset is padded INSIDE the bar so tap targets clear the home indicator.
export function NavBar({ tab, onTab, reviewDot }) {
  return (
    <nav aria-label="Primary" style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
      background: '#fff', borderTop: '1px solid rgba(27,42,74,0.08)',
      boxShadow: '0 -4px 16px rgba(27,42,74,0.07)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', maxWidth: 520, margin: '0 auto', padding: '9px 6px 7px' }}>
        {TABS.map(t => {
          const active = tab === t.id;
          const showDot = t.id === 'review' && reviewDot;
          return (
            <button key={t.id} onClick={() => onTab(t.id)} aria-label={t.label} aria-current={active} className="dash-press" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: 50, padding: active ? '6px 16px' : '6px 12px',
              borderRadius: 16, border: 'none', cursor: 'pointer', background: active ? '#E4F3ED' : 'transparent', color: active ? '#0B5E48' : '#9AA0AE',
              transition: 'background .15s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
            }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                {React.createElement(t.icon, { size: 23, strokeWidth: active ? 2.4 : 2 })}
                {showDot && <span className="dash-dot" style={{ position: 'absolute', top: -2, right: -3, width: 8, height: 8, borderRadius: '50%', background: D.teal, border: '1.5px solid #fff' }} />}
              </span>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function AppShell({ tab, onTab, reviewDot, children }) {
  // The bar is position:fixed (below), so only this scroll area moves; the bar stays
  // solid. The scroll area reserves NAV_HEIGHT + safe-area inset at the bottom so the
  // last content always clears the fixed bar - nothing is ever hidden behind it.
  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: '#fff', color: D.ink, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <DashMotion />
      {/* overflowX hidden is the prerequisite fix: the page never scrolls sideways. */}
      <div key={tab} className="deany-fade" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y', paddingBottom: `calc(env(safe-area-inset-bottom) + ${NAV_HEIGHT + 12}px)`, maxWidth: 520, margin: '0 auto', width: '100%' }}>
        {children}
      </div>
      <NavBar tab={tab} onTab={onTab} reviewDot={reviewDot} />
    </div>
  );
}
