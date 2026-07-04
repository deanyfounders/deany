// Profile tab - greeting, level badge, streak, and sign out.
import React, { useMemo } from 'react';
import { Flame, LogOut } from 'lucide-react';
import { DeanyMark, TOKENS } from '../shared/AppScreen.jsx';
import { buildPath } from './pathData.js';

const serif = 'Georgia, serif';

export default function ProfileTab({ appState, dailyStreak, mainTopics, modules, completedLessons }) {
  const { state, signOut } = appState;
  const name = state.user?.username || 'friend';
  const level = state.level || 'Foundations';
  const { doneCount, total } = useMemo(
    () => buildPath(mainTopics, modules, completedLessons),
    [mainTopics, modules, completedLessons]
  );

  const stat = (value, label) => (
    <div style={{ flex: 1, textAlign: 'center', padding: '14px 8px', background: '#fff', border: `1px solid ${TOKENS.border}`, borderRadius: 14 }}>
      <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, color: TOKENS.tealDeep }}>{value}</div>
      <div style={{ fontSize: 12, color: TOKENS.muted, marginTop: 2 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 24px) 20px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <DeanyMark size={64} />
      <h1 style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, color: TOKENS.tealDeep, margin: '16px 0 8px' }}>{name}</h1>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(240,180,41,0.15)', borderRadius: 20, marginBottom: 26 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#8A6200' }}>{level}</span>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 360, marginBottom: 26 }}>
        {stat(<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Flame size={18} color={TOKENS.gold} />{dailyStreak}</span>, 'Day streak')}
        {stat(doneCount, 'Lessons done')}
        {stat(total, 'On your path')}
      </div>

      <button onClick={signOut} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'none',
        border: `1px solid ${TOKENS.border}`, borderRadius: 24, color: TOKENS.muted, fontSize: 15, fontWeight: 500,
        cursor: 'pointer', minHeight: 48, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}>
        <LogOut size={17} /> Sign out
      </button>
    </div>
  );
}
