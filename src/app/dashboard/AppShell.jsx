// AppShell - white canvas, scrollable main, and a flush bottom NavBar in normal
// flex flow (spec section 10: never floating; safe-area padded). The nav is a
// flex sibling below the scroll area, so page content always ends above it.
import React from 'react';
import { E } from './tokens.js';
import { DashMotion } from './motion.jsx';

const TABS = ['home', 'topics', 'quran', 'review', 'you'];
const LABELS = { home: 'Home', topics: 'Topics', quran: "Qur'an", review: 'Review', you: 'You' };

// Original thin stroke-outline icons (24x24, stroke 1.9, round joins). Colour
// comes from the button's `color` (currentColor): teal when active, grey when not.
function NavIcon({ id }) {
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block' } };
  if (id === 'home') return <svg {...common}><path d="M3 10.5 L12 3 L21 10.5 V20 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 Z" /></svg>;
  if (id === 'topics') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5 L13.5 13.5 L8.5 15.5 L10.5 10.5 Z" /></svg>;
  if (id === 'quran') return <svg {...common}><path d="M12 6 Q8 3.5 4 5 V19 Q8 17.5 12 20 Q16 17.5 20 19 V5 Q16 3.5 12 6 Z" /><path d="M12 6 V20" /></svg>;
  if (id === 'review') return <svg {...common}><path d="M21 12 a9 9 0 1 1-2.6-6.4" /><path d="M21 3 v6 h-6" /></svg>;
  return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21 Q4 15 12 15 Q20 15 20 21" /></svg>;
}

// One bar, every screen (spec §2, §5). No text: names live only on aria-label.
// Active icon sits in a 48x40 rounded frame (tealTint fill + 2px navActiveBorder);
// inactive icons have no container. Tap pulses the icon to 0.9 then springs back.
export function NavBar({ tab, onTab }) {
  const [pressed, setPressed] = React.useState(null);
  const pulse = (id) => { setPressed(id); setTimeout(() => setPressed((p) => (p === id ? null : p)), 100); };
  return (
    <nav aria-label="Primary" style={{
      display: 'flex', background: '#fff', borderTop: '2px solid #E8E6E0', flexShrink: 0, maxWidth: 520, margin: '0 auto', width: '100%',
      // Flush to the screen edge (white fills the safe area). The icon row sits low:
      // a small, balanced margin above and below, plus the home-indicator safe-area
      // inset so icons clear it without floating high above the bottom edge. In
      // normal flow, so content always ends above the bar - it never covers content.
      padding: '6px 0 calc(env(safe-area-inset-bottom) + 6px)',
    }}>
      {TABS.map((id) => {
        const active = tab === id;
        return (
          <button key={id} onPointerDown={() => pulse(id)} onClick={() => onTab(id)} aria-label={LABELS[id]} aria-current={active} style={{
            flex: 1, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none',
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', padding: 0,
          }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 40, borderRadius: 14,
              color: active ? E.tealDark : '#9CA0AE',
              background: active ? E.tealTint : 'transparent', border: active ? `2px solid ${E.navActiveBorder}` : '2px solid transparent',
              transform: pressed === id ? 'scale(0.9)' : 'scale(1)', transition: 'transform 180ms cubic-bezier(.2,.8,.3,1.5)',
            }}>
              <NavIcon id={id} />
            </span>
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
      <NavBar tab={tab} onTab={onTab} />
    </div>
  );
}
