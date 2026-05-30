import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Flame, Star, Clock, ArrowRight, Trophy, BookOpen, Play } from 'lucide-react';
import { PillarsIcon, FinanceIcon, QuranIcon, HistoryIcon } from './components/PathIcons.jsx';
import { getTodayContent } from './data/dailyContent.js';
import TafseerPanel from './components/TafseerPanel.jsx';
import DeanyButton from './components/DeanyButton.jsx';
import { playClick } from './utils/clickSound.js';

// ── Palette ────────────────────────────────────────────────────
const C = {
  canvas: '#FBFAF6', surface: '#FFFFFF', heroWash: '#EAF7F5',
  gold: '#F0B429', goldDk: '#C8901A', goldSoft: '#FCEFCF', goldText: '#5A3E00',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C',
  tealSoft: '#DCF3EF', tealPale: '#7FD8CE',
  coral: '#EF6F53', coralSoft: '#FBE5DE',
  blue: '#2E6E8E', blueSoft: '#E0EDF7',
  text: '#173A4A', textDeep: '#0F4C5C', textMuted: '#5E7480', textFaint: '#94A3AA',
  border: 'rgba(15,76,92,0.15)',
};
const S = {
  card: '0 1px 2px rgba(26,35,50,.05), 0 8px 24px rgba(26,35,50,.08)',
  cardRaised: '0 4px 8px rgba(26,35,50,.08), 0 18px 44px rgba(26,35,50,.14)',
};
const serif = 'Georgia, serif';
const arabic = "'Amiri', 'Noto Naskh Arabic', serif";
const Eyebrow = ({ children, style: s }) => (
  <div style={{ fontSize: 10, letterSpacing: '1.5px', color: C.teal, fontWeight: 500, textTransform: 'uppercase', ...s }}>{children}</div>
);

// ── Avatar stack ───────────────────────────────────────────────
const AvatarStack = ({ size = 24 }) => (
  <div style={{ display: 'flex' }}>
    {[{ bg: C.teal, l: 'S' }, { bg: C.gold, l: 'F' }, { bg: C.coral, l: 'M' }].map((a, i) => (
      <div key={i} style={{ width: size, height: size, borderRadius: '50%', background: a.bg, color: '#fff', fontSize: size * 0.42,
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${C.surface}`, marginLeft: i ? -7 : 0, fontWeight: 500 }}>{a.l}</div>
    ))}
  </div>
);

// ═════════════════════════════════════════════════════════════════
const Dashboard = ({
  // User stats
  dailyStreak = 3, coins = 100, xp = 0, level = 1, totalPoints = 0,
  // Learning data
  mainTopics = [], modules = {}, completedLessons = {},
  lastSelectedTopicId = null,
  // Actions
  onSelectTopic, onSelectLesson, onCalibration, onLogout,
}) => {
  const [showTafseer, setShowTafseer] = useState(false);
  const [reflected, setReflected] = useState(false);

  const xpNext = level * 100;
  const xpPct = Math.round((xp / xpNext) * 100);
  const xpGoal = 50;
  const xpToday = xp % xpGoal;
  const xpNeeded = xpGoal - xpToday;

  // Daily verse from existing data
  const dailyItem = useMemo(getTodayContent, []);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good evening';

  // Find next lesson to continue
  const findContinueLesson = () => {
    for (const topic of mainTopics) {
      const mods = modules[topic.id] || [];
      for (const mod of mods) {
        if (!mod.lessons?.length) continue;
        for (let i = 0; i < mod.lessons.length; i++) {
          if (!completedLessons[`${mod.id}-lesson-${i}`]) {
            return { topic, mod, lesson: mod.lessons[i], index: i, total: mod.lessons.length };
          }
        }
      }
    }
    return null;
  };
  const continueData = findContinueLesson();

  // Per-topic stats
  const getTopicStats = (topicId) => {
    const mods = modules[topicId] || [];
    let totalLessons = 0, completedCount = 0;
    mods.forEach(mod => {
      const lessons = mod.lessons || [];
      totalLessons += lessons.length;
      lessons.forEach((_, i) => { if (completedLessons[`${mod.id}-lesson-${i}`]) completedCount++; });
    });
    return { modCount: mods.length, totalLessons, completedCount, pct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0 };
  };

  const pathColors = { '5-pillars': C.teal, 'islamic-finance': C.gold, 'quran-arabic': C.blue, 'islamic-history': C.coral };
  const pathIcons = { '5-pillars': PillarsIcon, 'islamic-finance': FinanceIcon, 'quran-arabic': QuranIcon, 'islamic-history': HistoryIcon };
  const pathDifficulty = { '5-pillars': 'Beginner', 'islamic-finance': 'Intermediate', 'quran-arabic': 'Beginner', 'islamic-history': 'Advanced' };

  // XP ring SVG (mount-animated)
  const ringR = 46, ringStroke = 10, ringCirc = 2 * Math.PI * ringR;
  const ringFill = Math.min(xpToday / xpGoal, 1);
  const ringTargetOffset = ringCirc * (1 - ringFill);
  const [ringAnimOffset, setRingAnimOffset] = useState(ringCirc); // start empty
  useEffect(() => {
    const t = setTimeout(() => setRingAnimOffset(ringTargetOffset), 100);
    return () => clearTimeout(t);
  }, [ringTargetOffset]);

  return (
    <div style={{ background: C.canvas, color: C.text, minHeight: '100vh', paddingBottom: 28 }}>

      {/* ── B1. HEADER ──────────────────────────────────────── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px',
        borderBottom: `1px solid rgba(15,76,92,0.1)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontFamily: serif, fontSize: 16, fontWeight: 500 }}>د</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: C.tealDeep, lineHeight: 1 }}>Deany</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Learn Islam, beautifully</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(239,111,83,0.10)', borderRadius: 20 }}>
            <span style={{ display: 'inline-flex', animation: 'flameFlicker 2s ease-in-out infinite' }}>
              <Flame size={14} color={C.coral} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.coral }}>{dailyStreak}</span>
          </div>
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(240,180,41,0.12)', borderRadius: 20 }}>
            <Star size={14} color={C.gold} /><span style={{ fontSize: 13, fontWeight: 500, color: C.goldDk }}>{totalPoints || xp}</span>
          </div>
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(34,163,154,0.12)', borderRadius: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.tealDk }}>{coins}</span>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
            onClick={onLogout} title="Sign out">A</div>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 22px' }}>

        {/* ── B2. GREETING ────────────────────────────────────── */}
        <section style={{ textAlign: 'center', padding: '24px 0 20px', animation: 'slideUp 0.6s ease-out both' }}>
          <div style={{ fontSize: 18, color: C.teal, marginBottom: 6, direction: 'rtl', fontFamily: arabic }}>السلام عليكم</div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 500, margin: '0 0 6px', color: C.tealDeep, lineHeight: 1.2 }}>
            {greeting}
          </h1>
          {/* TODO: Compute Hijri date — placeholder for now */}
          <div style={{ fontSize: 12, color: C.textMuted }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </section>

        {/* ── B3. CONTINUE LEARNING ───────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.1s both' }}>
          {continueData ? (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: S.cardRaised }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.gold})` }} />
              <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <Eyebrow>CONTINUE LEARNING · {continueData.topic.title.toUpperCase()}</Eyebrow>
                  <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: C.tealDeep, lineHeight: 1.3, marginTop: 6, marginBottom: 4 }}>
                    Lesson {continueData.index + 1}: {continueData.lesson.title}
                  </div>
                  {continueData.lesson.description && (
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, marginBottom: 14 }}>{continueData.lesson.description}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(34,163,154,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((continueData.index / continueData.total) * 100)}%`, height: '100%', background: C.gold, borderRadius: 3,
                        transition: 'width 1s ease-out', animation: 'progressGrow 1s ease-out both' }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, whiteSpace: 'nowrap' }}>{continueData.index} of {continueData.total} lessons</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  {continueData.lesson.duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textMuted }}><Clock size={13} />{continueData.lesson.duration}</div>
                  )}
                  <DeanyButton variant="primary" onClick={() => onSelectLesson(continueData.lesson, continueData.index, continueData.mod)}
                    style={{ padding: '10px 18px' }}>
                    Resume <ArrowRight size={14} />
                  </DeanyButton>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 22px', textAlign: 'center', boxShadow: S.cardRaised }}>
              <Eyebrow style={{ marginBottom: 10 }}>BEGIN YOUR JOURNEY</Eyebrow>
              <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: C.tealDeep, marginBottom: 6 }}>Your path starts here</div>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>Take the Calibration Quiz to find your starting point.</p>
              <DeanyButton variant="primary" onClick={onCalibration} style={{ padding: '10px 22px' }}>
                Take the Calibration Quiz
              </DeanyButton>
            </div>
          )}
        </section>

        {/* ── B4. DAILY VERSE ─────────────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.15s both' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, textAlign: 'center', boxShadow: S.card }}>
            <Eyebrow style={{ marginBottom: 14 }}>
              {dailyItem.type === 'ayah' ? "TODAY'S VERSE" : "HADITH OF THE DAY"}
            </Eyebrow>
            {dailyItem.arabic && (
              <div style={{ fontSize: 24, lineHeight: 1.8, color: C.tealDeep, direction: 'rtl', marginBottom: 14, fontFamily: arabic }}>
                {dailyItem.arabic}
              </div>
            )}
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: C.text, lineHeight: 1.5, marginBottom: 6 }}>
              "{dailyItem.translation}"
            </div>
            <div style={{ fontSize: 11, color: C.teal, letterSpacing: '0.5px', marginBottom: showTafseer ? 0 : 18 }}>
              {dailyItem.ref ? dailyItem.ref.toUpperCase() : dailyItem.source?.toUpperCase()}
            </div>
            {showTafseer && dailyItem.tafseer && (
              <div style={{ marginTop: 14, textAlign: 'left' }}>
                <TafseerPanel tafseer={dailyItem.tafseer} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: `1px solid rgba(34,163,154,0.15)`, marginTop: 14 }}>
              <button disabled
                style={{ background: 'rgba(34,163,154,0.06)', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12,
                  color: C.textMuted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'not-allowed', opacity: 0.5,
                  transition: 'background .2s ease, color .2s ease' }}>
                <Play size={14} /> Recite
              </button>
              {dailyItem.tafseer && (
                <button onClick={() => { playClick(); setShowTafseer(!showTafseer); }}
                  style={{ background: showTafseer ? 'rgba(15,76,92,0.1)' : 'rgba(34,163,154,0.08)', border: 'none', borderRadius: 10,
                    padding: '8px 14px', fontSize: 12, color: C.tealDeep, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                    transition: 'background .2s ease' }}>
                  <BookOpen size={14} /> Tafseer
                </button>
              )}
              <button onClick={() => { playClick(); setReflected(!reflected); }}
                style={{ background: reflected ? 'rgba(34,163,154,0.18)' : 'rgba(34,163,154,0.08)', border: 'none', borderRadius: 10,
                  padding: '8px 14px', fontSize: 12, color: C.tealDeep, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                  transition: 'background .2s ease' }}>
                <Star size={14} /> {reflected ? 'Saved' : 'Reflect'}
              </button>
            </div>
          </div>
        </section>

        {/* ── B5. TODAY'S GOAL + QUICK SESSIONS ───────────────── */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.2s both' }}>
          {/* XP Ring */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: S.card }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom: 10 }}>
              <circle cx="60" cy="60" r={ringR} fill="none" stroke="rgba(34,163,154,0.15)" strokeWidth={ringStroke} />
              <circle cx="60" cy="60" r={ringR} fill="none" stroke={C.teal} strokeWidth={ringStroke}
                strokeDasharray={ringCirc} strokeDashoffset={ringAnimOffset} strokeLinecap="round"
                transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              <text x="60" y="57" textAnchor="middle" fontFamily={serif} fontSize="24" fontWeight="500" fill={C.tealDeep}>{xpToday}</text>
              <text x="60" y="73" textAnchor="middle" fontSize="10" fill={C.textMuted}>of {xpGoal} XP</text>
            </svg>
            {xpToday === 0 ? (
              <div style={{ fontSize: 12, color: C.textMuted, textAlign: 'center', lineHeight: 1.4 }}>
                Your first lesson today fills this ring
              </div>
            ) : (
              <div style={{ fontSize: 12, color: C.text, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Flame size={13} color={C.coral} /> {xpNeeded} XP to keep your {dailyStreak}-day streak
              </div>
            )}
          </div>
          {/* Quick session */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', height: '100%' }}>
            {continueData ? (
              <button onClick={() => { playClick(); onSelectLesson(continueData.lesson, continueData.index, continueData.mod); }}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 14px', textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', minHeight: 48, boxShadow: S.card,
                  transition: 'box-shadow .28s cubic-bezier(.2,.7,.3,1), transform .28s cubic-bezier(.2,.7,.3,1)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = S.cardRaised; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = S.card; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.tealDeep }}>One lesson</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>5 min · next up</div>
                </div>
                <div style={{ fontSize: 11, color: C.teal, fontWeight: 500 }}>+25 XP</div>
              </button>
            ) : (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 14px',
                textAlign: 'center', color: C.textMuted, fontSize: 12 }}>
                Complete a lesson to unlock quick sessions
              </div>
            )}
            <div style={{ fontSize: 11, color: C.textMuted, textAlign: 'center', lineHeight: 1.4, fontStyle: 'italic' }}>
              Review modes arriving soon
            </div>
          </div>
        </section>

        {/* ── B6. LEARNING PATHS ──────────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.25s both' }}>
          <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: C.tealDeep, margin: '8px 0 12px', textAlign: 'center' }}>Learning paths</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {mainTopics.map(t => {
              const stats = getTopicStats(t.id);
              const stripe = pathColors[t.id] || C.teal;
              const diff = pathDifficulty[t.id] || 'Beginner';
              const diffBg = { '5-pillars': 'rgba(34,163,154,0.12)', 'islamic-finance': 'rgba(34,163,154,0.15)',
                'quran-arabic': 'rgba(46,110,142,0.10)', 'islamic-history': 'rgba(239,111,83,0.10)' }[t.id] || 'rgba(34,163,154,0.12)';
              const diffColor = { '5-pillars': C.tealDk, 'islamic-finance': C.goldDk, 'quran-arabic': C.blue, 'islamic-history': C.coral }[t.id] || C.tealDk;
              return (
                <button key={t.id} onClick={() => { playClick(); onSelectTopic(t.id); }}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', textAlign: 'left',
                    cursor: 'pointer', boxShadow: S.card,
                    transition: 'box-shadow .28s cubic-bezier(.2,.7,.3,1), transform .28s cubic-bezier(.2,.7,.3,1)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = S.cardRaised; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = S.card; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ height: 4, background: stripe }} />
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      {React.createElement(pathIcons[t.id] || BookOpen, { size: 22, color: stripe })}
                      <span style={{ fontSize: 10, padding: '2px 8px', background: diffBg, color: diffColor, borderRadius: 10 }}>{diff}</span>
                    </div>
                    <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 500, color: C.tealDeep, marginBottom: 2 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: C.text, marginBottom: 10, lineHeight: 1.4 }}>{t.subtitle}</div>
                    {stats.pct > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'rgba(34,163,154,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${stats.pct}%`, height: '100%', background: C.gold, borderRadius: 3,
                            animation: 'progressGrow 1s ease-out both' }} />
                        </div>
                        <span style={{ fontSize: 10, color: C.teal, fontWeight: 500 }}>{stats.pct}%</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: C.textMuted }}>{stats.modCount} modules · {stats.totalLessons} lessons</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── B7. TODAY'S CHALLENGE ────────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.3s both' }}>
          <div style={{ background: C.tealDeep, borderRadius: 14, padding: '18px 20px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 6 }}><Trophy size={13} /> TODAY'S CHALLENGE</div>
              <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>
                Complete 3 lessons to keep your streak alive
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>1 of 3 done · 247 learners completed today</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 12, fontWeight: 500 }}>+50 XP</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>Auto-tracked</div>
            </div>
          </div>
        </section>

        {/* ── B8. COMMUNITY ───────────────────────────────────── */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.35s both' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', boxShadow: S.card }}>
            <Eyebrow style={{ marginBottom: 8 }}>LEARNING TOGETHER</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <AvatarStack />
              <span style={{ fontSize: 13, fontWeight: 500, color: C.tealDeep }}>1,247 learners</span>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>studying Islamic Finance this week</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', boxShadow: S.card }}>
            <Eyebrow style={{ marginBottom: 10 }}>WEEKLY LEADERBOARD</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[{ n: 'Yusuf K.', xp: '820 XP', c: C.gold }, { n: 'Fatima A.', xp: '740 XP', c: C.teal }, { n: 'Bilal R.', xp: '685 XP', c: C.textMuted }].map((u, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: u.c, fontWeight: 500, width: 14 }}>{i + 1}</span>
                    <span style={{ fontSize: 12, color: C.tealDeep }}>{u.n}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.teal, fontWeight: 500 }}>{u.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── B9. FOOTER ──────────────────────────────────────── */}
        <section style={{ animation: 'slideUp 0.6s ease-out 0.4s both' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', marginBottom: 14, boxShadow: S.card }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 18, alignItems: 'start' }}>
              {/* Prayer times — static placeholder */}
              <div>
                {/* TODO: integrate Aladhan API for live prayer times */}
                <Eyebrow style={{ marginBottom: 10 }}>PRAYER TIMES · DUBAI</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[['Fajr', '04:08'], ['Dhuhr', '12:18'], ['Asr', '15:42'], ['Maghrib', '19:08', true], ['Isha', '20:32']].map(([name, time, next]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12,
                      ...(next ? { background: 'rgba(34,163,154,0.10)', padding: '3px 8px', borderRadius: 6, margin: '1px -8px',
                        color: C.teal, fontWeight: 500 } : {}) }}>
                      <span style={{ color: next ? C.teal : C.textMuted }}>{next ? `${name} · next` : name}</span>
                      <span style={{ color: next ? C.teal : C.tealDeep }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Explore */}
              <div>
                <Eyebrow style={{ marginBottom: 10 }}>EXPLORE</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: C.textMuted }}>
                  {['About Deany', 'How it works', 'Sources & scholars', 'Reflections journal', 'Privacy'].map(l => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
              </div>
              {/* This month */}
              <div>
                {/* TODO: Compute Hijri date */}
                <Eyebrow style={{ marginBottom: 10 }}>THIS MONTH</Eyebrow>
                <div style={{ fontFamily: serif, fontSize: 15, color: C.tealDeep, fontWeight: 500, marginBottom: 4 }}>Jumada al-Akhirah</div>
                <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>1447 AH<br />Day 15 of 30</div>
                <div style={{ marginTop: 8, height: 6, background: 'rgba(34,163,154,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', background: C.gold, borderRadius: 3,
                    animation: 'progressGrow 1s ease-out both' }} />
                </div>
              </div>
            </div>
          </div>
          {/* Bismillah */}
          <div style={{ textAlign: 'center', padding: '10px 0 4px', fontFamily: arabic, fontSize: 14, color: C.teal, direction: 'rtl' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
