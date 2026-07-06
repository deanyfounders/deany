// AppShell - canvas background, scrollable content, fixed bottom NavBar with
// safe-area handling. All four tabs render inside it.
import React from 'react';
import { Home, Compass, RefreshCw, User } from 'lucide-react';
import { D, RADIUS, FONT, TYPE } from './tokens.js';
import { DashMotion } from './motion.jsx';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'topics', label: 'Topics', icon: Compass },
  { id: 'review', label: 'Review', icon: RefreshCw },
  { id: 'you', label: 'You', icon: User },
];

export function NavBar({ tab, onTab, reviewDot }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: D.card,
      borderTop: `1px solid ${D.border}`, display: 'flex',
      padding: `6px 0 calc(env(safe-area-inset-bottom) + 6px)`, maxWidth: 520, margin: '0 auto',
    }}>
      {TABS.map(t => {
        const active = tab === t.id;
        const showDot = t.id === 'review' && reviewDot;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} aria-label={t.label} aria-current={active} className="dash-press" style={{
            flex: 1, display: 'flex', justifyContent: 'center', padding: '5px 0', background: 'none', border: 'none', cursor: 'pointer', minHeight: 48,
            transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}>
            <span style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: active ? '6px 14px' : '6px 8px',
              background: active ? '#E9F6F4' : 'transparent', borderRadius: 14, color: active ? D.tealDeep : D.inkFaint, transition: 'background .15s ease',
            }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                {React.createElement(t.icon, { size: 21, strokeWidth: active ? 2.3 : 2 })}
                {showDot && <span className="dash-dot" style={{ position: 'absolute', top: -2, right: -3, width: 8, height: 8, borderRadius: '50%', background: D.history, border: `1.5px solid ${D.card}` }} />}
              </span>
              <span style={{ fontSize: TYPE.hint, fontWeight: active ? 500 : 400 }}>{t.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default function AppShell({ tab, onTab, reviewDot, children }) {
  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: D.canvas, color: D.ink, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <DashMotion />
      <div key={tab} className="deany-fade" style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', paddingBottom: 'calc(env(safe-area-inset-bottom) + 78px)', maxWidth: 520, margin: '0 auto', width: '100%' }}>
        {children}
      </div>
      <NavBar tab={tab} onTab={onTab} reviewDot={reviewDot} />
    </div>
  );
}
