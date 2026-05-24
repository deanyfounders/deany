import React, { useState, useMemo } from 'react';
import { Flame, Star, Clock, ArrowRight, Trophy, BookOpen, Play } from 'lucide-react';
import { getTodayContent } from './data/dailyContent.js';
import TafseerPanel from './components/TafseerPanel.jsx';

// ── Palette ────────────────────────────────────────────────────
const C = {
  cream: '#F8F4ED', white: '#FFFFFF',
  gold: '#C9A961', goldDk: '#8A6F2F',
  sage: '#6B8E7F', sageDk: '#4A6358',
  forest: '#1B4332', dark: '#0F2E22',
  body: '#2A2520', muted: '#6B6356',
  terra: '#B8694D', flame: '#D85A30',
  border: 'rgba(201,169,97,0.25)',
};
const serif = 'Georgia, serif';
const arabic = "'Amiri', 'Noto Naskh Arabic', serif";
const Eyebrow = ({ children, style: s }) => (
  <div style={{ fontSize: 10, letterSpacing: '1.5px', color: C.gold, fontWeight: 500, textTransform: 'uppercase', ...s }}>{children}</div>
);

// ── Avatar stack ───────────────────────────────────────────────
const AvatarStack = ({ size = 24 }) => (
  <div style={{ display: 'flex' }}>
    {[{ bg: C.sage, l: 'S' }, { bg: C.gold, l: 'F' }, { bg: C.forest, l: 'M' }, { bg: C.terra, l: 'A' }].map((a, i) => (
      <div key={i} style={{ width: size, height: size, borderRadius: '50%', background: a.bg, color: '#fff', fontSize: size * 0.42,
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff', marginLeft: i ? -7 : 0, fontWeight: 500 }}>{a.l}</div>
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

  const pathColors = { '5-pillars': C.sage, 'islamic-finance': C.gold, 'quran-arabic': C.forest, 'islamic-history': C.terra };
  const pathDifficulty = { '5-pillars': 'Beginner', 'islamic-finance': 'Intermediate', 'quran-arabic': 'Beginner', 'islamic-history': 'Advanced' };

  // XP ring SVG
  const ringR = 46, ringCirc = 2 * Math.PI * ringR;
  const ringFill = Math.min(xpToday / xpGoal, 1);
  const ringOffset = ringCirc * (1 - ringFill);

  return (
    <div style={{ background: C.cream, color: C.body, minHeight: '100vh', paddingBottom: 28 }}>

      {/* ── B1. HEADER ──────────────────────────────────────── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px',
        borderBottom: `1px solid rgba(201,169,97,0.2)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontFamily: serif, fontSize: 16, fontWeight: 500 }}>د</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: C.forest, lineHeight: 1 }}>Deany</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Learn Islam, beautifully</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(216,90,48,0.08)', borderRadius: 20 }}>
            <Flame size={14} color={C.flame} /><span style={{ fontSize: 13, fontWeight: 500, color: C.flame }}>{dailyStreak}</span>
          </div>
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(201,169,97,0.12)', borderRadius: 20 }}>
            <Star size={14} color={C.gold} /><span style={{ fontSize: 13, fontWeight: 500, color: C.goldDk }}>{totalPoints || xp}</span>
          </div>
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(107,142,127,0.12)', borderRadius: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.sageDk }}>{coins}</span>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.forest, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: C.cream, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
            onClick={onLogout} title="Sign out">A</div>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 22px' }}>

        {/* ── B2. GREETING ────────────────────────────────────── */}
        <section style={{ textAlign: 'center', padding: '24px 0 20px', animation: 'slideUp 0.6s ease-out both' }}>
          <div style={{ fontSize: 18, color: C.goldDk, marginBottom: 6, direction: 'rtl', fontFamily: arabic }}>السلام عليكم</div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 500, margin: '0 0 6px', color: C.forest, lineHeight: 1.2 }}>
            {greeting}
          </h1>
          {/* TODO: Compute Hijri date — placeholder for now */}
          <div style={{ fontSize: 12, color: C.muted }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </section>

        {/* ── B3. CONTINUE LEARNING ───────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.1s both' }}>
          {continueData ? (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <Eyebrow>CONTINUE LEARNING · {continueData.topic.title.toUpperCase()}</Eyebrow>
                  <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: C.forest, lineHeight: 1.3, marginTop: 6, marginBottom: 4 }}>
                    Lesson {continueData.index + 1}: {continueData.lesson.title}
                  </div>
                  {continueData.lesson.description && (
                    <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 14 }}>{continueData.lesson.description}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 5, background: 'rgba(201,169,97,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((continueData.index / continueData.total) * 100)}%`, height: '100%', background: C.gold }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{continueData.index} of {continueData.total} lessons</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  {continueData.lesson.duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.muted }}><Clock size={13} />{continueData.lesson.duration}</div>
                  )}
                  <button onClick={() => onSelectLesson(continueData.lesson, continueData.index, continueData.mod)}
                    style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13,
                      fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, minHeight: 48 }}>
                    Resume <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 22px', textAlign: 'center' }}>
              <Eyebrow style={{ marginBottom: 10 }}>BEGIN YOUR JOURNEY</Eyebrow>
              <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: C.forest, marginBottom: 6 }}>Your path starts here</div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>Take the Calibration Quiz to find your starting point.</p>
              <button onClick={onCalibration}
                style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 13,
                  fontWeight: 500, cursor: 'pointer', minHeight: 48 }}>Take the Calibration Quiz</button>
            </div>
          )}
        </section>

        {/* ── B4. DAILY VERSE ─────────────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.15s both' }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, textAlign: 'center' }}>
            <Eyebrow style={{ marginBottom: 14 }}>
              {dailyItem.type === 'ayah' ? "TODAY'S VERSE" : "HADITH OF THE DAY"}
            </Eyebrow>
            {dailyItem.arabic && (
              <div style={{ fontSize: 24, lineHeight: 1.8, color: C.forest, direction: 'rtl', marginBottom: 14, fontFamily: arabic }}>
                {dailyItem.arabic}
              </div>
            )}
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: C.body, lineHeight: 1.5, marginBottom: 6 }}>
              "{dailyItem.translation}"
            </div>
            <div style={{ fontSize: 11, color: C.goldDk, letterSpacing: '0.5px', marginBottom: showTafseer ? 0 : 18 }}>
              {dailyItem.ref ? dailyItem.ref.toUpperCase() : dailyItem.source?.toUpperCase()}
            </div>
            {showTafseer && dailyItem.tafseer && (
              <div style={{ marginTop: 14, textAlign: 'left' }}>
                <TafseerPanel tafseer={dailyItem.tafseer} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: `1px solid rgba(201,169,97,0.15)`, marginTop: 14 }}>
              <button disabled
                style={{ background: 'rgba(201,169,97,0.06)', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12,
                  color: C.muted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'not-allowed', opacity: 0.5 }}>
                <Play size={14} /> Recite <span style={{ fontSize: 9, opacity: 0.7 }}>(soon)</span>
              </button>
              {dailyItem.tafseer && (
                <button onClick={() => setShowTafseer(!showTafseer)}
                  style={{ background: showTafseer ? 'rgba(201,169,97,0.2)' : 'rgba(201,169,97,0.1)', border: 'none', borderRadius: 10,
                    padding: '8px 14px', fontSize: 12, color: C.goldDk, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <BookOpen size={14} /> Tafseer
                </button>
              )}
              <button onClick={() => setReflected(!reflected)}
                style={{ background: reflected ? 'rgba(201,169,97,0.25)' : 'rgba(201,169,97,0.1)', border: 'none', borderRadius: 10,
                  padding: '8px 14px', fontSize: 12, color: C.goldDk, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <Star size={14} /> {reflected ? 'Saved' : 'Reflect'}
              </button>
            </div>
          </div>
        </section>

        {/* ── B5. TODAY'S GOAL + QUICK SESSIONS ───────────────── */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.2s both' }}>
          {/* XP Ring */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{ marginBottom: 10 }}>
              <circle cx="55" cy="55" r={ringR} fill="none" stroke="rgba(201,169,97,0.15)" strokeWidth="8" />
              <circle cx="55" cy="55" r={ringR} fill="none" stroke={C.gold} strokeWidth="8"
                strokeDasharray={ringCirc} strokeDashoffset={ringOffset} strokeLinecap="round"
                transform="rotate(-90 55 55)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              <text x="55" y="52" textAnchor="middle" fontFamily={serif} fontSize="22" fontWeight="500" fill={C.forest}>{xpToday}</text>
              <text x="55" y="68" textAnchor="middle" fontSize="10" fill={C.muted}>of {xpGoal} XP</text>
            </svg>
            <div style={{ fontSize: 12, color: C.body, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Flame size={13} color={C.flame} /> {xpNeeded} XP to keep your {dailyStreak}-day streak
            </div>
          </div>
          {/* Quick session */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', height: '100%' }}>
            {continueData ? (
              <button onClick={() => onSelectLesson(continueData.lesson, continueData.index, continueData.mod)}
                style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 14px', textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', minHeight: 48 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.forest }}>One lesson</div>
                  <div style={{ fontSize: 11, color: C.muted }}>5 min · next up</div>
                </div>
                <div style={{ fontSize: 11, color: C.goldDk, fontWeight: 500 }}>+25 XP</div>
              </button>
            ) : (
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 14px',
                textAlign: 'center', color: C.muted, fontSize: 12 }}>
                Complete a lesson to unlock quick sessions
              </div>
            )}
            <div style={{ fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 1.4 }}>
              More session types coming soon
            </div>
          </div>
        </section>

        {/* ── B6. LEARNING PATHS ──────────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.25s both' }}>
          <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: C.forest, margin: '8px 0 12px', textAlign: 'center' }}>Learning paths</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {mainTopics.map(t => {
              const stats = getTopicStats(t.id);
              const stripe = pathColors[t.id] || C.sage;
              const diff = pathDifficulty[t.id] || 'Beginner';
              const diffBg = { '5-pillars': 'rgba(107,142,127,0.12)', 'islamic-finance': 'rgba(201,169,97,0.15)',
                'quran-arabic': 'rgba(27,67,50,0.1)', 'islamic-history': 'rgba(184,105,77,0.12)' }[t.id] || 'rgba(107,142,127,0.12)';
              const diffColor = { '5-pillars': C.sageDk, 'islamic-finance': C.goldDk, 'quran-arabic': C.forest, 'islamic-history': '#8A4A36' }[t.id] || C.sageDk;
              return (
                <button key={t.id} onClick={() => onSelectTopic(t.id)}
                  style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', textAlign: 'left',
                    cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ height: 4, background: stripe }} />
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <BookOpen size={20} color={stripe} />
                      <span style={{ fontSize: 10, padding: '2px 8px', background: diffBg, color: diffColor, borderRadius: 10 }}>{diff}</span>
                    </div>
                    <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 500, color: C.forest, marginBottom: 2 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.4 }}>{t.subtitle}</div>
                    {stats.pct > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(201,169,97,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${stats.pct}%`, height: '100%', background: C.gold }} />
                        </div>
                        <span style={{ fontSize: 10, color: C.goldDk, fontWeight: 500 }}>{stats.pct}%</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: C.muted }}>{stats.modCount} modules · {stats.totalLessons} lessons</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── B7. TODAY'S CHALLENGE ────────────────────────────── */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.3s both' }}>
          <div style={{ background: C.sage, borderRadius: 14, padding: '18px 20px', display: 'flex', justifyContent: 'space-between',
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
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px' }}>
            <Eyebrow style={{ marginBottom: 8 }}>LEARNING TOGETHER</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <AvatarStack />
              <span style={{ fontSize: 13, fontWeight: 500, color: C.forest }}>1,247 learners</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>studying Islamic Finance this week</div>
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px' }}>
            <Eyebrow style={{ marginBottom: 10 }}>WEEKLY LEADERBOARD</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[{ n: 'Yusuf K.', xp: '820 XP', c: C.gold }, { n: 'Fatima A.', xp: '740 XP', c: C.sage }, { n: 'Bilal R.', xp: '685 XP', c: C.muted }].map((u, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: u.c, fontWeight: 500, width: 14 }}>{i + 1}</span>
                    <span style={{ fontSize: 12, color: C.forest }}>{u.n}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.goldDk, fontWeight: 500 }}>{u.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── B9. FOOTER ──────────────────────────────────────── */}
        <section style={{ animation: 'slideUp 0.6s ease-out 0.4s both' }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 18, alignItems: 'start' }}>
              {/* Prayer times — static placeholder */}
              <div>
                {/* TODO: integrate Aladhan API for live prayer times */}
                <Eyebrow style={{ marginBottom: 10 }}>PRAYER TIMES · DUBAI</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[['Fajr', '04:08'], ['Dhuhr', '12:18'], ['Asr', '15:42'], ['Maghrib', '19:08', true], ['Isha', '20:32']].map(([name, time, next]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12,
                      ...(next ? { background: 'rgba(201,169,97,0.12)', padding: '3px 8px', borderRadius: 6, margin: '1px -8px',
                        color: C.goldDk, fontWeight: 500 } : {}) }}>
                      <span style={{ color: next ? C.goldDk : C.muted }}>{next ? `${name} · next` : name}</span>
                      <span style={{ color: next ? C.goldDk : C.forest }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Explore */}
              <div>
                <Eyebrow style={{ marginBottom: 10 }}>EXPLORE</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: C.muted }}>
                  {['About Deany', 'How it works', 'Sources & scholars', 'Reflections journal', 'Privacy'].map(l => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
              </div>
              {/* This month */}
              <div>
                {/* TODO: Compute Hijri date */}
                <Eyebrow style={{ marginBottom: 10 }}>THIS MONTH</Eyebrow>
                <div style={{ fontFamily: serif, fontSize: 15, color: C.forest, fontWeight: 500, marginBottom: 4 }}>Jumada al-Akhirah</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>1447 AH<br />Day 15 of 30</div>
                <div style={{ marginTop: 8, height: 4, background: 'rgba(201,169,97,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', background: C.gold }} />
                </div>
              </div>
            </div>
          </div>
          {/* Bismillah */}
          <div style={{ textAlign: 'center', padding: '10px 0 4px', fontFamily: arabic, fontSize: 14, color: C.goldDk, direction: 'rtl' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
