// Learn tab - a premium, mobile-native adaptation of the website dashboard:
// greeting + gamification, a prominent continue card, a daily-goal ring, your
// paths (with calibrated levels), and the daily verse. Tapping a path opens the
// website-style lesson timeline (PathLessons), not a zigzag road.
import React, { useMemo, useState } from 'react';
import { Flame, ArrowRight, Star, BookOpen, Play } from 'lucide-react';
import { TOKENS } from '../shared/AppScreen.jsx';
import { SUBJECT } from '../../onboarding/kit/tokens.js';
import { getTodayContent } from '../../data/dailyContent.js';
import { buildPath } from './pathData.js';
import PathLessons from './PathLessons.jsx';

const serif = 'Georgia, serif';
const arabic = "'Amiri', 'Noto Naskh Arabic', serif";
const XP_GOAL = 50;

const subjOf = (id) => SUBJECT[id] || { accent: TOKENS.teal, tint: 'rgba(34,163,154,0.1)', emoji: '\u{1F4D6}' };

export default function LearnTab({ dailyStreak = 0, xp = 0, mainTopics = [], modules = {}, completedLessons = {}, onSelectLesson, onGoReview, appState }) {
  const [openTopic, setOpenTopic] = useState(null);
  const state = appState?.state || {};
  const cal = state.calibration || {};
  const name = state.user?.username || 'friend';

  const { continueNode, doneCount } = useMemo(() => buildPath(mainTopics, modules, completedLessons), [mainTopics, modules, completedLessons]);
  const verse = useMemo(getTodayContent, []);
  const xpToday = xp % XP_GOAL;
  const xpPct = Math.round((xpToday / XP_GOAL) * 100);

  const topicStats = (id) => {
    let total = 0, done = 0;
    (modules[id] || []).forEach(m => (m.lessons || []).forEach((_, i) => { total++; if (completedLessons[`${m.id}-lesson-${i}`]) done++; }));
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  };
  const pathTopics = mainTopics.filter(t => (modules[t.id] || []).some(m => (m.lessons || []).length));

  // Path lessons sub-view
  if (openTopic) {
    const s = subjOf(openTopic.id);
    return (
      <PathLessons
        topic={openTopic} modules={modules} completedLessons={completedLessons}
        accent={s.accent} level={cal[openTopic.id]?.level}
        onSelectLesson={onSelectLesson} onBack={() => setOpenTopic(null)}
      />
    );
  }

  return (
    <div>
      {/* Greeting + gamification */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 18px) 20px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: TOKENS.teal, fontWeight: 600, marginBottom: 4 }}>Assalamu alaikum</div>
            <h1 style={{ fontFamily: serif, fontSize: 25, fontWeight: 500, color: TOKENS.tealDeep, margin: 0, lineHeight: 1.15 }}>Hello {name}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'rgba(240,180,41,0.15)', borderRadius: 20, flexShrink: 0 }}>
            <span style={{ display: 'inline-flex', animation: 'deanyFlame 2s ease-in-out infinite' }}><Flame size={16} color={TOKENS.gold} /></span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#B07D08' }}>{dailyStreak}</span>
          </div>
        </div>
      </div>

      {/* Continue hero */}
      {continueNode && (
        <div style={{ padding: '12px 18px 6px' }}>
          <button onClick={() => onSelectLesson?.(continueNode.lesson, continueNode.idx, continueNode.mod)} style={{
            width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', padding: 0, borderRadius: 18, overflow: 'hidden',
            background: TOKENS.tealDeep, boxShadow: '0 8px 26px rgba(15,76,92,0.22)', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: TOKENS.gold, fontWeight: 600, marginBottom: 6 }}>Continue · {continueNode.moduleTitle}</div>
              <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>{continueNode.lesson.title}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: TOKENS.gold, color: '#3A2A00', borderRadius: 22, fontSize: 14.5, fontWeight: 600 }}>
                <Play size={14} fill="#3A2A00" /> Resume lesson
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Daily goal */}
      <div style={{ padding: '8px 18px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${TOKENS.border}`, borderRadius: 16, padding: '14px 16px' }}>
          <Ring pct={xpPct} value={xpToday} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TOKENS.tealDeep }}>Today's goal</div>
            <div style={{ fontSize: 12.5, color: TOKENS.muted, marginTop: 2, lineHeight: 1.4 }}>
              {xpToday >= XP_GOAL ? 'Goal complete. Well done.' : `${XP_GOAL - xpToday} XP to keep your ${dailyStreak}-day streak`}
            </div>
          </div>
          <button onClick={onGoReview} style={{ fontSize: 12.5, fontWeight: 600, color: TOKENS.teal, background: 'rgba(34,163,154,0.1)', border: 'none', borderRadius: 20, padding: '8px 12px', cursor: 'pointer', flexShrink: 0, WebkitTapHighlightColor: 'transparent' }}>{doneCount} to review</button>
        </div>
      </div>

      {/* Your paths */}
      <div style={{ padding: '14px 18px 4px' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: TOKENS.tealDeep, margin: '4px 2px 12px' }}>Your paths</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {pathTopics.map(t => {
            const s = subjOf(t.id);
            const st = topicStats(t.id);
            const lvl = cal[t.id]?.level;
            return (
              <button key={t.id} onClick={() => setOpenTopic(t)} style={{
                textAlign: 'left', background: '#fff', border: `1px solid ${TOKENS.border}`, borderRadius: 16, padding: 15, cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(26,35,50,.04)', display: 'flex', flexDirection: 'column', gap: 9, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, background: s.tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.emoji}</span>
                  {lvl && <span style={{ fontSize: 10.5, fontWeight: 600, color: s.accent, background: `${s.accent}1A`, borderRadius: 16, padding: '3px 9px' }}>{lvl}</span>}
                </div>
                <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 500, color: TOKENS.tealDeep, lineHeight: 1.2 }}>{t.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: 'rgba(15,76,92,0.10)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${st.pct}%`, height: '100%', background: s.accent, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: TOKENS.muted, flexShrink: 0 }}>{st.done}/{st.total}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily verse */}
      <div style={{ padding: '14px 18px 8px' }}>
        <div style={{ background: '#fff', border: `1px solid ${TOKENS.border}`, borderRadius: 16, padding: '18px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: TOKENS.teal, fontWeight: 600, marginBottom: 12 }}>{verse.type === 'ayah' ? "Today's verse" : 'Hadith of the day'}</div>
          {verse.arabic && <div style={{ fontFamily: arabic, direction: 'rtl', fontSize: 22, lineHeight: 1.9, color: TOKENS.tealDeep, marginBottom: 12 }}>{verse.arabic}</div>}
          <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 14.5, color: TOKENS.navy, lineHeight: 1.55, marginBottom: 8 }}>"{verse.translation}"</div>
          <div style={{ fontSize: 11, letterSpacing: '0.5px', color: TOKENS.teal }}>{(verse.ref || verse.source || '').toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

// Small XP ring
function Ring({ pct, value }) {
  const r = 22, c = 2 * Math.PI * r, off = c * (1 - Math.min(pct, 100) / 100);
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" style={{ flexShrink: 0 }}>
      <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(34,163,154,0.15)" strokeWidth="5" />
      <circle cx="27" cy="27" r={r} fill="none" stroke={TOKENS.gold} strokeWidth="5" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 27 27)" style={{ transition: 'stroke-dashoffset .6s ease' }} />
      <text x="27" y="31" textAnchor="middle" fontFamily={serif} fontSize="15" fontWeight="600" fill={TOKENS.tealDeep}>{value}</text>
    </svg>
  );
}
