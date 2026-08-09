// AppShell - white canvas, scrollable main, and a flush bottom NavBar in normal
// flex flow (spec section 10: never floating; safe-area padded). The nav is a
// flex sibling below the scroll area, so page content always ends above it.
import React from 'react';
import { E } from './tokens.js';
import { DashMotion } from './motion.jsx';

const TABS = ['home', 'topics', 'quran', 'review', 'you'];
const LABELS = { home: 'Home', topics: 'Topics', quran: "Qur'an", review: 'Review', you: 'You' };

// deany_bottom_nav_spec: Duolingo anatomy. Every icon is a FILLED, multi-tone
// 32px SVG (no outlines, no gradients). Two fill sets per icon toggled by state:
// full brand colour when active, controlled greyscale filled-silhouette when
// inactive. Palettes below are the ONLY source of each icon's colours.
const G = { main: '#B9BCC6', shade: '#D4D6DC' }; // §3 inactive greys
const PAL = {
  home:   { on: { body: '#F0B429', dark: '#C98F17', accent: '#22A39A' }, off: { body: G.main, dark: G.shade, accent: G.shade } },
  topics: { on: { disc: '#22A39A', rim: '#0F6E56', nN: '#F0B429', nS: '#1B2A4A' }, off: { disc: G.main, rim: G.shade, nN: G.shade, nS: G.main } },
  quran:  { on: { cover: '#1B2A4A', spine: '#101A31', gold: '#F0B429' }, off: { cover: G.main, spine: G.shade, gold: G.shade } },
  review: { on: { arm: '#22A39A', shade: '#0F6E56', spark: '#F0B429' }, off: { arm: G.main, shade: G.shade, spark: G.shade } },
  you:    { on: { bust: '#1B2A4A', collar: '#22A39A', plate: '#FCEBC9' }, off: { bust: G.main, collar: G.shade, plate: G.shade } },
};

// Filled annular sector (thick arc ribbon) for the refresh arrows - built from
// two fill paths, never a stroke. Angles in radians, screen space (y down).
const _pt = (cx, cy, r, a) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
function sector(cx, cy, r0, r1, a0, a1) {
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${_pt(cx, cy, r1, a0)} A${r1} ${r1} 0 ${large} 1 ${_pt(cx, cy, r1, a1)} L${_pt(cx, cy, r0, a1)} A${r0} ${r0} 0 ${large} 0 ${_pt(cx, cy, r0, a0)} Z`;
}
function arrowhead(cx, cy, rm, a, len = 5) {
  const tx = cx + rm * Math.cos(a) - len * Math.sin(a);
  const ty = cy + rm * Math.sin(a) + len * Math.cos(a);
  return `M${_pt(cx, cy, rm + 3.6, a)} L${_pt(cx, cy, rm - 3.6, a)} L${tx.toFixed(2)} ${ty.toFixed(2)} Z`;
}

// Each icon: 32x32 box, filled shapes only. `p` is the on/off palette slice.
function NavIcon({ id, active }) {
  const p = PAL[id][active ? 'on' : 'off'];
  const svg = (children) => (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" style={{ display: 'block' }}>{children}</svg>
  );
  if (id === 'home') return svg(<>
    <path d="M16 4 L29 16 L3 16 Z" fill={p.dark} />
    <rect x="6.5" y="15" width="19" height="12.5" rx="1.6" fill={p.body} />
    <rect x="13.4" y="19.4" width="5.2" height="8.1" rx="1" fill={p.dark} />
    <rect x="9" y="18" width="4" height="4" rx="0.8" fill={p.accent} />
  </>);
  if (id === 'topics') return svg(<>
    <circle cx="16" cy="16" r="12.5" fill={p.rim} />
    <circle cx="16" cy="16" r="10.4" fill={p.disc} />
    <path d="M16 7 L19 16 L13 16 Z" fill={p.nN} />
    <path d="M16 25 L13 16 L19 16 Z" fill={p.nS} />
    <circle cx="16" cy="16" r="1.7" fill={p.rim} />
  </>);
  if (id === 'quran') return svg(<>
    <rect x="7" y="5" width="18" height="22" rx="2.6" fill={p.cover} />
    <rect x="7" y="5" width="3.6" height="22" rx="1.4" fill={p.spine} />
    <rect x="22.6" y="7" width="2.4" height="18" rx="1" fill={p.spine} />
    <path d="M16 10.5 l2.6 4.5 -2.6 4.5 -2.6 -4.5 Z" fill={p.gold} />
    <rect x="23.4" y="14.4" width="3.4" height="3.2" rx="0.8" fill={p.gold} />
  </>);
  if (id === 'review') {
    const cx = 16, cy = 16, r0 = 6.6, r1 = 10.6, rm = (r0 + r1) / 2;
    return svg(<>
      <path d={sector(cx, cy, r0, r1, -2.97, -0.52)} fill={p.arm} />
      <path d={sector(cx, cy, r0, r1, 0.17, 2.62)} fill={p.arm} />
      <path d={arrowhead(cx, cy, rm, -0.52)} fill={p.shade} />
      <path d={arrowhead(cx, cy, rm, 2.62)} fill={p.shade} />
      <path d="M25 6 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill={p.spark} />
    </>);
  }
  return svg(<>
    <circle cx="16" cy="16" r="12.5" fill={p.plate} />
    <path d="M6.5 27.6 Q7 19.4 16 19.4 Q25 19.4 25.5 27.6 Z" fill={p.bust} />
    <path d="M12.4 20 L16 24.2 L19.6 20 Z" fill={p.collar} />
    <circle cx="16" cy="12.4" r="5" fill={p.bust} />
  </>);
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
      // Flush to the screen edge (white fills the safe area), but the icon row is
      // lifted: small space above, generous space below so the icons never hug the
      // bottom edge. In normal flow, so content always ends above the bar - it can
      // never cover anything on scroll.
      padding: '8px 0 calc(env(safe-area-inset-bottom) + 16px)',
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
              background: active ? E.tealTint : 'transparent', border: active ? `2px solid ${E.navActiveBorder}` : '2px solid transparent',
              transform: pressed === id ? 'scale(0.9)' : 'scale(1)', transition: 'transform 180ms cubic-bezier(.2,.8,.3,1.5)',
            }}>
              <NavIcon id={id} active={active} />
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
