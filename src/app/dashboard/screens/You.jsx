// You - identity, streak, stats, and settings. Premium/leaderboards/social
// land here in future (never on Home). Reserved anchor below, no visible UI.
import React, { useState } from 'react';
import { ChevronRight, Lock, Flame } from 'lucide-react';
import { D, TYPE } from '../tokens.js';
import { Card, StatBlock, StreakCalendar } from '../components.jsx';
import { getReviewStats } from '../selectors.js';

function currentWeek() {
  const now = new Date();
  const sunday = new Date(now); sunday.setDate(now.getDate() - now.getDay());
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(sunday); d.setDate(sunday.getDate() + i); return d.toISOString().slice(0, 10); });
}

export default function You({ name, guest, state, completedLessons = {}, xp = 0, onSignOut, onCreateAccount, setDailyMinutes }) {
  const [picker, setPicker] = useState(false);
  const stats = getReviewStats(state, Date.now());
  const lessonsDone = Object.values(completedLessons).filter(Boolean).length;
  const initials = (name || 'G').trim().slice(0, 2).toUpperCase();
  const addedDates = Object.values(state.topics || {}).map(t => t.addedAt).filter(Boolean).sort();
  const since = addedDates[0] ? new Date(addedDates[0]) : new Date();
  const sinceLabel = since.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const week = currentWeek();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 20px 24px' }}>
      {/* Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#E9F6F4', color: D.tealDeep, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, flexShrink: 0 }}>{guest ? 'G' : initials}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: TYPE.screenTitle, fontWeight: 500, color: D.ink }}>{guest ? 'Guest' : (name || 'Learner')}</div>
          {guest ? (
            <button onClick={onCreateAccount} style={{ marginTop: 4, background: D.teal, color: '#fff', border: 'none', borderRadius: 12, padding: '7px 14px', fontSize: TYPE.meta, fontWeight: 500, cursor: 'pointer' }}>Create account</button>
          ) : (
            <div style={{ fontSize: TYPE.meta, color: D.inkHint, marginTop: 3 }}>Learning since {sinceLabel}</div>
          )}
        </div>
      </div>

      {/* This week */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink }}>This week</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: TYPE.body, fontWeight: 500, color: D.goldInk }}><Flame size={15} color={D.goldInk} /> {state.streak?.count || 0}</span>
        </div>
        <StreakCalendar weekMap={state.streak?.weekMap || {}} weekDates={week} todayDate={today} />
      </Card>

      {/* Stats 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <Card><StatBlock label="Total XP" value={xp} /></Card>
        <Card><StatBlock label="Lessons completed" value={lessonsDone} /></Card>
        <Card><StatBlock label="Items mastered" value={stats.mastered} /></Card>
        <Card><StatBlock label="Best streak" value={state.streak?.count || 0} /></Card>
      </div>

      {/* Badges */}
      <div style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink, margin: '0 2px 10px' }}>Badges</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 48, height: 48, borderRadius: '50%', border: `1px solid ${D.border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={18} color={D.inkFaint} /></span>
        ))}
      </div>

      {/* Settings */}
      <div>
        <SettingRow label="Daily goal" value={`${state.goal?.dailyMinutes || 5} min`} onClick={() => setPicker(true)} />
        <SettingRow label="Notifications" value="Off" onClick={() => {}} />
        <SettingRow label="About DEANY" onClick={() => {}} />
        <button onClick={onSignOut} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: `1px solid ${D.border}`, padding: '15px 2px', fontSize: TYPE.body, color: '#B04A2C', cursor: 'pointer', minHeight: 44, WebkitTapHighlightColor: 'transparent' }}>Sign out</button>
      </div>

      {/* Reserved: premium, leaderboards, social land here in future. No UI yet. */}

      {picker && (
        <div>
          <div onClick={() => setPicker(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,52,0.28)', zIndex: 60 }} />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 61, background: D.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '18px 20px calc(env(safe-area-inset-bottom) + 18px)', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink, marginBottom: 12 }}>Daily goal</div>
            {[5, 10, 15].map(m => (
              <button key={m} onClick={() => { setDailyMinutes(m); setPicker(false); }} style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', borderBottom: `1px solid ${D.border}`, padding: '14px 2px', fontSize: TYPE.body, color: D.ink, cursor: 'pointer', minHeight: 44 }}>
                {m} minutes {(state.goal?.dailyMinutes || 5) === m && <span style={{ color: D.tealDeep, fontWeight: 500 }}>Selected</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, value, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', borderBottom: `1px solid ${D.border}`, padding: '15px 2px', cursor: 'pointer', minHeight: 44, WebkitTapHighlightColor: 'transparent' }}>
      <span style={{ fontSize: TYPE.body, color: D.ink }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: TYPE.body, color: D.inkHint }}>{value}<ChevronRight size={17} color={D.disabled} /></span>
    </button>
  );
}
