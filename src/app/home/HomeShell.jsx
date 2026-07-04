// App home shell (Phase 5). Bottom tab bar + the three tabs. Real lessons open
// through the onSelectLesson callback passed down from App, so finishing a
// lesson returns here with progress updated. The website's landing page, web
// nav, and footer never render in app mode (App renders this instead).
import React, { useState } from 'react';
import { GraduationCap, RotateCcw, User } from 'lucide-react';
import { TOKENS } from '../shared/AppScreen.jsx';
import LearnTab from './LearnTab.jsx';
import ReviewTab from './ReviewTab.jsx';
import ProfileTab from './ProfileTab.jsx';

const TABS = [
  { id: 'learn', label: 'Learn', icon: GraduationCap },
  { id: 'review', label: 'Review', icon: RotateCcw },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function HomeShell(props) {
  const { appState, dailyStreak = 0, mainTopics = [], modules = {}, completedLessons = {}, onSelectLesson } = props;
  const [tab, setTab] = useState('learn');
  const level = appState?.state?.level || 'Foundations';

  return (
    <div style={{ minHeight: '100vh', background: TOKENS.canvas, color: TOKENS.navy, fontFamily: '"Source Sans 3", system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style>{KEYFRAMES}</style>

      {/* Scrollable content, padded so the fixed tab bar never covers it.
          key={tab} + deany-fade gives a subtle transition on tab switch. */}
      <div key={tab} className="deany-fade" style={{ flex: 1, overflowY: 'auto', paddingBottom: 'calc(env(safe-area-inset-bottom) + 76px)', maxWidth: 520, margin: '0 auto', width: '100%' }}>
        {tab === 'learn' && (
          <LearnTab
            dailyStreak={dailyStreak} level={level}
            mainTopics={mainTopics} modules={modules} completedLessons={completedLessons}
            onSelectLesson={onSelectLesson} onGoReview={() => setTab('review')}
          />
        )}
        {tab === 'review' && (
          <ReviewTab mainTopics={mainTopics} modules={modules} completedLessons={completedLessons} onSelectLesson={onSelectLesson} />
        )}
        {tab === 'profile' && (
          <ProfileTab appState={appState} dailyStreak={dailyStreak} mainTopics={mainTopics} modules={modules} completedLessons={completedLessons} />
        )}
      </div>

      {/* Bottom tab bar */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: TOKENS.canvas,
        borderTop: `1px solid ${TOKENS.border}`, display: 'flex',
        padding: `6px 0 calc(env(safe-area-inset-bottom) + 6px)`,
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} aria-label={t.label} aria-current={active}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0',
                background: 'none', border: 'none', cursor: 'pointer', minHeight: 52,
                color: active ? TOKENS.teal : 'rgba(27,42,74,0.4)', position: 'relative',
                WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
              }}>
              {React.createElement(t.icon, { size: 22, strokeWidth: active ? 2.4 : 2 })}
              <span style={{ fontSize: 11, fontWeight: active ? 600 : 500 }}>{t.label}</span>
              {active && <span style={{ position: 'absolute', top: 2, width: 5, height: 5, borderRadius: '50%', background: TOKENS.gold }} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const KEYFRAMES = `
@keyframes deanyFlame { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
@keyframes deanyNodePulse { 0%,100% { box-shadow: 0 0 0 4px ${TOKENS.gold}; } 50% { box-shadow: 0 0 0 7px rgba(240,180,41,0.35); } }
@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }
`;
