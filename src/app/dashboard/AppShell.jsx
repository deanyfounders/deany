// AppShell - white canvas, scrollable main, and a flush bottom NavBar in normal
// flex flow (spec section 10: never floating; safe-area padded). The nav is a
// flex sibling below the scroll area, so page content always ends above it.
import React from 'react';
import { E } from './tokens.js';
import { DashMotion } from './motion.jsx';

const TABS = ['home', 'topics', 'quran', 'review', 'you'];
const LABELS = { home: 'Home', topics: 'Topics', quran: "Qur'an", review: 'Review', you: 'You' };

// Icon paths lifted from the pixel reference (24x24, stroke 1.9, round joins).
function NavIcon({ id }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (id === 'home') return <svg {...common}><path d="M3 10.5 L12 3 L21 10.5 V20 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 Z" /></svg>;
  if (id === 'topics') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5 L13.5 13.5 L8.5 15.5 L10.5 10.5 Z" /></svg>;
  if (id === 'quran') return <svg {...common}><path d="M12 6 Q8 3.5 4 5 V19 Q8 17.5 12 20 Q16 17.5 20 19 V5 Q16 3.5 12 6 Z" /><path d="M12 6 V20" /></svg>;
  if (id === 'review') return <svg {...common}><path d="M21 12 a9 9 0 1 1-2.6-6.4" /><path d="M21 3 v6 h-6" /></svg>;
  return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21 Q4 15 12 15 Q20 15 20 21" /></svg>;
}

export function NavBar({ tab, onTab, reviewDot }) {
  return (
    <nav aria-label="Primary" style={{ display: 'flex', background: '#fff', borderTop: `1px solid ${E.line}`, paddingBottom: 'env(safe-area-inset-bottom)', flexShrink: 0, maxWidth: 520, margin: '0 auto', width: '100%' }}>
      {TABS.map((id) => {
        const active = tab === id;
        const showDot = id === 'review' && reviewDot;
        return (
          <button key={id} onClick={() => onTab(id)} aria-label={LABELS[id]} aria-current={active} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0 8px', border: 'none', background: 'none',
            cursor: 'pointer', color: active ? E.tealDark : '#A6A9B4', fontSize: 11, fontWeight: active ? 800 : 600, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}>
            <span style={{ position: 'relative', display: 'flex', borderRadius: 16, padding: '4px 14px', background: active ? E.teal : 'transparent', boxShadow: active ? `0 2px 0 ${E.tealDark}` : 'none', color: active ? '#fff' : 'currentColor' }}>
              <NavIcon id={id} />
              {showDot && <span style={{ position: 'absolute', top: 1, right: 8, width: 7, height: 7, borderRadius: '50%', background: E.gold, border: '1.5px solid #fff' }} />}
            </span>
            {LABELS[id]}
          </button>
        );
      })}
    </nav>
  );
}

// `overlay` renders on top of the active tab's scroll area (nav stays visible), and
// the tab stays mounted underneath so its scroll/state survive a back (nav spec rule
// 7). `scrollKey` keys the scroll area so a tab switch re-triggers the fade, but an
// overlay opening does not remount the tab beneath it.
export default function AppShell({ tab, onTab, reviewDot, children, overlay, scrollKey }) {
  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: '#fff', color: E.ink, display: 'flex', flexDirection: 'column' }}>
      <DashMotion />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div key={scrollKey || tab} className="deany-fade" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, maxWidth: 520, margin: '0 auto', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
          {children}
        </div>
        {overlay && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, maxWidth: 520, margin: '0 auto', background: '#fff' }}>
            {overlay}
          </div>
        )}
      </div>
      <NavBar tab={tab} onTab={onTab} reviewDot={reviewDot} />
    </div>
  );
}
