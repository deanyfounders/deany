import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Flame, Star, Clock, ArrowRight, Trophy, BookOpen, Play, Home, Bookmark, Users, Search, Music, PanelRightOpen, PanelRightClose, ChevronDown, ChevronUp } from 'lucide-react';
import { PillarsIcon, FinanceIcon, QuranIcon, HistoryIcon } from './components/PathIcons.jsx';
import { getTodayContent } from './data/dailyContent.js';
import TafseerPanel from './components/TafseerPanel.jsx';
import DeanyButton from './components/DeanyButton.jsx';
import { playClick } from './utils/clickSound.js';
import { concepts, computeStates, trackAccents, positions, edges } from './data/conceptGraph.js';

const KnowledgeMapModal = lazy(() => import('./components/KnowledgeMapModal.jsx'));

// ── Demo seed ──────────────────────────────────────────────────
const DEMO = true;
const DEMO_COMPLETED = {
  'shahada-lesson-0': true, 'shahada-lesson-1': true, 'shahada-lesson-2': true,
  'salah-lesson-0': true, 'salah-lesson-1': true, 'salah-lesson-2': true,
  'quran-memorisation-lesson-0': true,
  'module-1-lesson-0': true, 'module-1-lesson-1': true,
};

// ── Palette (original) ─────────────────────────────────────────
const C = {
  canvas: '#FBFAF6', surface: '#FFFFFF',
  gold: '#F0B429', goldDk: '#C8901A', goldSoft: '#FCEFCF', goldText: '#5A3E00',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C',
  tealSoft: '#DCF3EF', tealPale: '#7FD8CE',
  coral: '#EF6F53', coralSoft: '#FBE5DE',
  blue: '#2E6E8E', blueSoft: '#E0EDF7',
  text: '#173A4A', textDeep: '#0F4C5C', textMuted: '#5E7480', textFaint: '#94A3AA',
  border: 'rgba(15,76,92,0.10)',
};
const S = {
  card: '0 1px 2px rgba(26,35,50,.05), 0 8px 24px rgba(26,35,50,.08)',
  cardRaised: '0 4px 8px rgba(26,35,50,.08), 0 18px 44px rgba(26,35,50,.14)',
};
const serif = 'Georgia, serif';
const arabic = "'Amiri', 'Noto Naskh Arabic', serif";

const STYLE = `
@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes progressGrow{from{width:0%}}
@keyframes flameFlicker{0%,100%{transform:scale(1);opacity:0.85}50%{transform:scale(1.15);opacity:1}}
@keyframes shimmerSweep{0%{transform:translateX(-200%)}50%,100%{transform:translateX(200%)}}
@media(prefers-reduced-motion:reduce){*{animation-duration:0s!important;transition-duration:0s!important}}
.el-nav-item{transition:background .15s ease,color .15s ease;border-radius:8px}
.el-nav-item:hover{background:rgba(220,243,239,0.5)}
.el-rail-inner{transition:transform .35s cubic-bezier(.4,0,.2,1),opacity .25s cubic-bezier(.4,0,.2,1)}
.el-left-rail{overflow:hidden}
.el-left-rail-inner{transition:transform .35s cubic-bezier(.4,0,.2,1),opacity .25s cubic-bezier(.4,0,.2,1)}
.el-right-rail-wrap{transition:width .35s cubic-bezier(.4,0,.2,1)}
@media(max-width:1060px){.el-left-nav,.el-right-rail-wrap{display:none!important}.el-center-col{padding:0 22px 28px!important}}
`;

const Eyebrow = ({ children, style: s, color }) => (
  <div style={{ fontSize: 10, letterSpacing: '1.5px', color: color || C.teal, fontWeight: 500, textTransform: 'uppercase', ...s }}>{children}</div>
);

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
  dailyStreak = 3, coins = 100, xp = 0, level = 1, totalPoints = 0,
  userName = 'Mehdi',
  mainTopics = [], modules = {}, completedLessons = {},
  lastSelectedTopicId = null,
  onSelectTopic, onSelectLesson, onCalibration, onLogout,
}) => {
  const [showTafseer, setShowTafseer] = useState(false);
  const [reflected, setReflected] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [leftRailOpen, setLeftRailOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notes, setNotes] = useState([
    { id: 1, text: 'Shahada is not just words — it reshapes how you see everything.', source: 'Lesson 1', time: '2h ago', accent: C.teal },
    { id: 2, text: 'Riba literally means "increase" — any guaranteed surplus on a loan.', source: 'Finance L3', time: '1d ago', accent: C.gold },
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const pathsSectionRef = React.useRef(null);
  const verseSectionRef = React.useRef(null);

  const lessons = DEMO ? { ...DEMO_COMPLETED, ...completedLessons } : completedLessons;

  const xpGoal = 50;
  const xpToday = xp % xpGoal;
  const xpNeeded = xpGoal - xpToday;
  const dailyItem = useMemo(getTodayContent, []);
  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const findContinueLesson = () => {
    for (const topic of mainTopics) {
      const mods = modules[topic.id] || [];
      for (const mod of mods) {
        if (!mod.lessons?.length) continue;
        for (let i = 0; i < mod.lessons.length; i++) {
          if (!lessons[`${mod.id}-lesson-${i}`]) return { topic, mod, lesson: mod.lessons[i], index: i, total: mod.lessons.length };
        }
      }
    }
    return null;
  };
  const continueData = findContinueLesson();

  const getTopicStats = (topicId) => {
    const mods = modules[topicId] || [];
    let totalLessons = 0, completedCount = 0;
    mods.forEach(mod => {
      const ls = mod.lessons || [];
      totalLessons += ls.length;
      ls.forEach((_, i) => { if (lessons[`${mod.id}-lesson-${i}`]) completedCount++; });
    });
    return { modCount: mods.length, totalLessons, completedCount, pct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0 };
  };

  const pathColors = { '5-pillars': C.teal, 'islamic-finance': C.gold, 'quran-arabic': C.blue, 'islamic-history': C.coral };

  // Search
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results = [];
    for (const topic of mainTopics) {
      if (topic.title?.toLowerCase().includes(q) || topic.subtitle?.toLowerCase().includes(q)) {
        results.push({ type: 'path', label: topic.title, sub: topic.subtitle, color: pathColors[topic.id] || C.teal, action: () => onSelectTopic(topic.id) });
      }
      const mods = modules[topic.id] || [];
      for (const mod of mods) {
        if (mod.title?.toLowerCase().includes(q)) {
          results.push({ type: 'module', label: mod.title, sub: topic.title, color: pathColors[topic.id] || C.teal, action: () => onSelectTopic(topic.id) });
        }
        if (mod.lessons) {
          mod.lessons.forEach((les, i) => {
            if (les.title?.toLowerCase().includes(q) || les.description?.toLowerCase().includes(q)) {
              results.push({ type: 'lesson', label: les.title, sub: `${topic.title} · ${mod.title}`, color: pathColors[topic.id] || C.teal, action: () => onSelectLesson(les, i, mod) });
            }
          });
        }
      }
    }
    for (const n of notes) {
      if (n.text.toLowerCase().includes(q)) {
        results.push({ type: 'note', label: n.text.slice(0, 60) + (n.text.length > 60 ? '…' : ''), sub: n.source, color: n.accent });
      }
    }
    return results.slice(0, 8);
  }, [searchQuery, mainTopics, modules, notes]);

  const searchRef = React.useRef(null);
  useEffect(() => {
    const handler = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const pathIcons = { '5-pillars': PillarsIcon, 'islamic-finance': FinanceIcon, 'quran-arabic': QuranIcon, 'islamic-history': HistoryIcon };
  const pathDifficulty = { '5-pillars': 'Beginner', 'islamic-finance': 'Intermediate', 'quran-arabic': 'Beginner', 'islamic-history': 'Advanced' };

  // XP ring
  const ringR = 46, ringStroke = 10, ringCirc = 2 * Math.PI * ringR;
  const ringFill = Math.min(xpToday / xpGoal, 1);
  const [ringAnimOffset, setRingAnimOffset] = useState(ringCirc);
  useEffect(() => { const t = setTimeout(() => setRingAnimOffset(ringCirc * (1 - ringFill)), 100); return () => clearTimeout(t); }, [ringFill]);

  // Objectives
  const lessonDoneToday = xpToday > 0;
  const [checkedObj, setCheckedObj] = useState({ 0: false, 1: false, 2: false });
  const toggleObj = (i) => setCheckedObj(prev => ({ ...prev, [i]: !prev[i] }));
  const objectives = [
    { label: 'Read today\'s verse', done: reflected || checkedObj[0] },
    { label: 'Complete a lesson', done: lessonDoneToday || checkedObj[1] },
    { label: 'Maintain your streak', done: (lessonDoneToday && dailyStreak > 0) || checkedObj[2] },
  ];
  const objDone = objectives.filter(o => o.done).length;

  // Knowledge map
  const mapStates = useMemo(() => computeStates(lessons), [lessons]);
  const mapUnlocked = Object.values(mapStates).filter(s => s === 'unlocked').length;
  const mapTotal = concepts.length;

  const handleNav = (id) => {
    playClick();
    setActiveNav(id);
    switch (id) {
      case 'home': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'paths': pathsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'memorisation': onSelectTopic('quran-arabic'); break;
      default: break;
    }
  };

  const addNote = () => {
    if (!newNoteText.trim()) return;
    setNotes(prev => [{ id: Date.now(), text: newNoteText.trim(), source: 'Quick note', time: 'Just now', accent: C.teal }, ...prev]);
    setNewNoteText('');
    setShowNoteInput(false);
  };

  const deleteNote = (id) => { setNotes(prev => prev.filter(n => n.id !== id)); };

  const navGroups = [
    { label: 'Learn', items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'paths', label: 'Paths', icon: BookOpen },
      { id: 'saved', label: 'Saved', icon: Bookmark, soon: true },
      { id: 'memorisation', label: 'Memorisation', icon: Music },
    ]},
    { label: 'Progress', items: [
      { id: 'challenges', label: 'Challenges', icon: Trophy, badge: 3, soon: true },
      { id: 'community', label: 'Community', icon: Users, soon: true },
    ]},
  ];

  return (
    <div style={{ background: C.canvas, color: C.text, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{STYLE}</style>

      {/* Top accent border */}
      {/* Top accent border */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.tealDk}, ${C.gold}, ${C.coral})`, flexShrink: 0 }} />

      {/* ── FULL-WIDTH HEADER ──────────────────────────────── */}
      <header style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {/* Logo zone — same width as left rail so they align */}
        <div style={{ width: leftRailOpen ? 225 : 'auto', flexShrink: 0, padding: '14px 17px', display: 'flex', alignItems: 'center', gap: 10, background: leftRailOpen ? C.surface : 'transparent', borderRight: leftRailOpen ? `1px solid ${C.border}` : '1px solid transparent', transition: 'all .35s cubic-bezier(.4,0,.2,1)' }}>
          <div style={{ width: 31, height: 31, borderRadius: 7, background: 'linear-gradient(145deg,#22A39A,#0F6E56)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: serif, fontSize: 15, flexShrink: 0 }}>{'\u062F'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: 16.5, fontWeight: 500, color: C.tealDeep, lineHeight: 1 }}>Deany</div>
            <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>Learn Islam, beautifully</div>
          </div>
          <button onClick={() => setLeftRailOpen(r => !r)} aria-label={leftRailOpen ? 'Collapse navigation' : 'Expand navigation'}
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer', color: C.textFaint, flexShrink: 0, transition: 'color .2s, transform .35s cubic-bezier(.4,0,.2,1)', transform: leftRailOpen ? 'rotate(0deg)' : 'rotate(-180deg)' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.tealDeep; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.textFaint; }}>
            <ChevronUp size={15} />
          </button>
        </div>
        {/* Stats — pushed to the right */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14, padding: '14px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(239,111,83,0.10)', borderRadius: 20 }}>
            <span style={{ display: 'inline-flex', animation: 'flameFlicker 2s ease-in-out infinite' }}><Flame size={14} color={C.coral} /></span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.coral }}>{dailyStreak}</span>
          </div>
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(240,180,41,0.12)', borderRadius: 20 }}>
            <Star size={14} color={C.gold} /><span style={{ fontSize: 13, fontWeight: 500, color: C.goldDk }}>{totalPoints || xp}</span>
          </div>
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(34,163,154,0.12)', borderRadius: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.tealDk }}>{coins}</span>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
            onClick={onLogout} title="Sign out">{userName.charAt(0)}</div>
        </div>
      </header>

      {/* ── THREE-COLUMN LAYOUT (below header) ───────────── */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Right rail toggle — fixed to right edge */}
        <button onClick={() => setRailOpen(r => !r)} aria-label={railOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{ position: 'fixed', right: railOpen ? 232 : 10, top: 80, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '50%', cursor: 'pointer', color: C.textFaint, zIndex: 10, boxShadow: '0 1px 4px rgba(20,43,54,0.08)', transition: 'color .15s, right .35s cubic-bezier(.4,0,.2,1)' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.tealDeep; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textFaint; }}>
          {railOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </button>

      {/* ════ LEFT RAIL — 184px, white, flush left, full height ═══ */}
      <div className="el-left-nav" style={{
        width: leftRailOpen ? 225 : 0, flexShrink: 0,
        position: 'sticky', top: 0, height: 'calc(100vh - 68px)',
        overflow: 'hidden',
        transition: 'width .35s cubic-bezier(.4,0,.2,1)',
      }}>
      <nav className="el-left-rail-inner" style={{
        width: 225,
        height: '100%',
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        transform: leftRailOpen ? 'translateX(0)' : 'translateX(-100%)',
        opacity: leftRailOpen ? 1 : 0,
      }}>
        {/* Search */}
        <div style={{ padding: '14px 11px 16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', background: C.canvas, border: `1px solid ${searchFocused ? C.teal : C.border}`, borderRadius: 8, fontSize: 13, color: C.textFaint, transition: 'border-color .2s' }}>
            <Search size={13} style={{ flexShrink: 0, color: searchFocused ? C.teal : C.textFaint }} />
            <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              onKeyDown={e => { if (e.key === 'Escape') { setSearchQuery(''); searchRef.current?.blur(); } }}
              placeholder="Search..."
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: C.text, width: '100%' }} />
            {!searchQuery && <span style={{ marginLeft: 'auto', fontSize: 9.5, padding: '1px 5px', background: 'rgba(15,76,92,0.06)', borderRadius: 4, flexShrink: 0 }}>&#8984;K</span>}
            {searchQuery && <button onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textFaint, fontSize: 14, padding: 0, lineHeight: 1, flexShrink: 0 }}>&#10005;</button>}
          </div>
          {/* Search results dropdown */}
          {searchFocused && searchQuery && (
            <div style={{ position: 'absolute', top: '100%', left: 11, right: 11, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(20,43,54,0.12)', zIndex: 10, maxHeight: 280, overflowY: 'auto' }}>
              {searchResults.length === 0 ? (
                <div style={{ padding: '14px 12px', fontSize: 12, color: C.textMuted, textAlign: 'center' }}>No results for "{searchQuery}"</div>
              ) : (
                searchResults.map((r, i) => (
                  <button key={i} onMouseDown={e => e.preventDefault()} onClick={() => { r.action?.(); setSearchQuery(''); searchRef.current?.blur(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', border: 'none', background: 'transparent', cursor: r.action ? 'pointer' : 'default', textAlign: 'left', borderBottom: i < searchResults.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background .1s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.canvas; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: C.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</div>
                      <div style={{ fontSize: 10, color: C.textFaint, marginTop: 1 }}>{r.type === 'note' ? 'Note' : r.type === 'path' ? 'Path' : r.type === 'module' ? 'Module' : 'Lesson'} · {r.sub}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Nav groups */}
        {navGroups.map(g => (
          <div key={g.label} style={{ marginBottom: 14 }}>
            <div style={{ padding: '0 15px', fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.textFaint, fontWeight: 600, marginBottom: 4 }}>{g.label}</div>
            {g.items.map(it => {
              const isActive = activeNav === it.id;
              return (
                <button key={it.id} className="el-nav-item" onClick={() => handleNav(it.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: 'calc(100% - 8px)', margin: '0 4px', padding: '7px 11px', border: 'none',
                    cursor: it.soon ? 'default' : 'pointer',
                    fontSize: 14, fontWeight: isActive ? 500 : 400,
                    background: isActive ? C.tealSoft : 'transparent',
                    color: isActive ? '#0F6E56' : it.soon ? C.textFaint : C.textMuted,
                    borderLeft: isActive ? '3px solid #0F6E56' : '3px solid transparent',
                    minHeight: 39, opacity: it.soon ? 0.6 : 1,
                  }}>
                  {React.createElement(it.icon, { size: 15 })} {it.label}
                  {it.badge && <span style={{ marginLeft: 'auto', fontSize: 9.5, padding: '2px 6px', background: C.goldSoft, color: C.goldText, borderRadius: 8, fontWeight: 600 }}>{it.badge}</span>}
                  {it.soon && <span style={{ marginLeft: 'auto', fontSize: 8.5, padding: '1px 6px', background: 'rgba(15,76,92,0.06)', color: C.textFaint, borderRadius: 6 }}>Soon</span>}
                </button>
              );
            })}
          </div>
        ))}

        {/* Spacer — pushes Plus to the floor */}
        <div style={{ flex: 1 }} />

        {/* Deany Plus — pinned to bottom */}
        <div style={{ margin: '0 11px 14px', padding: '14px 13px', borderRadius: 12, background: 'linear-gradient(155deg,#0F4C5C,#1A8C82)', color: '#fff' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7, marginBottom: 3 }}>Deany Plus</div>
          <div style={{ fontSize: 11.5, opacity: 0.85, lineHeight: 1.4, marginBottom: 10 }}>Unlock advanced lessons &amp; features</div>
          <button style={{ width: '100%', padding: '7px 14px', fontSize: 11.5, fontWeight: 500, background: C.gold, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', minHeight: 35, transition: 'filter .2s' }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}>
            Upgrade &#8599;
          </button>
        </div>
      </nav>
      </div>{/* end left rail wrapper */}

      {/* ════ CENTER COLUMN — the original dashboard ═════════════ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', paddingLeft: 30 }}>
      <main className="el-center-col" style={{ width: '100%', maxWidth: 760, padding: '0 28px 28px' }}>

        {/* Greeting (centered) */}
        <section style={{ textAlign: 'center', padding: '24px 0 20px', animation: 'slideUp 0.6s ease-out both' }}>
          <div style={{ fontSize: 18, color: C.teal, marginBottom: 6, direction: 'rtl', fontFamily: arabic }}>{'\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645'}</div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 500, margin: '0 0 6px', color: C.tealDeep, lineHeight: 1.2 }}>{greeting}</h1>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </section>

        {/* Continue Learning */}
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
                      <div style={{ width: `${Math.round((continueData.index / continueData.total) * 100)}%`, height: '100%', background: C.gold, borderRadius: 3, transition: 'width 1s ease-out', animation: 'progressGrow 1s ease-out both' }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, whiteSpace: 'nowrap' }}>{continueData.index} of {continueData.total} lessons</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  {continueData.lesson.duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textMuted }}><Clock size={13} />{continueData.lesson.duration}</div>
                  )}
                  <DeanyButton variant="primary" onClick={() => onSelectLesson(continueData.lesson, continueData.index, continueData.mod)}
                    style={{ padding: '10px 18px', overflow: 'hidden', position: 'relative' }}>
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>Resume <ArrowRight size={14} /></span>
                    <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)', animation: 'shimmerSweep 4.5s ease-in-out infinite 1s', pointerEvents: 'none' }} />
                  </DeanyButton>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 22px', textAlign: 'center', boxShadow: S.cardRaised }}>
              <Eyebrow style={{ marginBottom: 10 }}>BEGIN YOUR JOURNEY</Eyebrow>
              <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: C.tealDeep, marginBottom: 6 }}>Your path starts here</div>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>Take the Calibration Quiz to find your starting point.</p>
              <DeanyButton variant="primary" onClick={onCalibration} style={{ padding: '10px 22px' }}>Take the Calibration Quiz</DeanyButton>
            </div>
          )}
        </section>

        {/* Daily Verse */}
        <section ref={verseSectionRef} style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.15s both' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, textAlign: 'center', boxShadow: S.card }}>
            <Eyebrow style={{ marginBottom: 14 }}>{dailyItem.type === 'ayah' ? "TODAY'S VERSE" : "HADITH OF THE DAY"}</Eyebrow>
            {dailyItem.arabic && (
              <div style={{ fontSize: 24, lineHeight: 1.8, color: C.tealDeep, direction: 'rtl', marginBottom: 14, fontFamily: arabic }}>{dailyItem.arabic}</div>
            )}
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: C.text, lineHeight: 1.5, marginBottom: 6 }}>"{dailyItem.translation}"</div>
            <div style={{ fontSize: 11, color: C.teal, letterSpacing: '0.5px', marginBottom: showTafseer ? 0 : 18 }}>
              {dailyItem.ref ? dailyItem.ref.toUpperCase() : dailyItem.source?.toUpperCase()}
            </div>
            {showTafseer && dailyItem.tafseer && <div style={{ marginTop: 14, textAlign: 'left' }}><TafseerPanel tafseer={dailyItem.tafseer} /></div>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: `1px solid rgba(34,163,154,0.15)`, marginTop: 14 }}>
              <button disabled style={{ background: 'rgba(34,163,154,0.06)', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'not-allowed', opacity: 0.5 }}>
                <Play size={14} /> Recite
              </button>
              {dailyItem.tafseer && (
                <button onClick={() => { playClick(); setShowTafseer(!showTafseer); }}
                  style={{ background: showTafseer ? 'rgba(15,76,92,0.1)' : 'rgba(34,163,154,0.08)', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: C.tealDeep, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'background .2s ease' }}>
                  <BookOpen size={14} /> Tafseer
                </button>
              )}
              <button onClick={() => { playClick(); setReflected(!reflected); }}
                style={{ background: reflected ? 'rgba(34,163,154,0.18)' : 'rgba(34,163,154,0.08)', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: C.tealDeep, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'background .2s ease' }}>
                <Star size={14} /> {reflected ? 'Saved' : 'Reflect'}
              </button>
            </div>
          </div>
        </section>

        {/* Your Paths */}
        <section ref={pathsSectionRef} style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.2s both' }}>
          <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: C.tealDeep, margin: '8px 0 12px', textAlign: 'center' }}>Learning paths</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {mainTopics.map(t => {
              const stats = getTopicStats(t.id);
              const stripe = pathColors[t.id] || C.teal;
              const diff = pathDifficulty[t.id] || 'Beginner';
              const diffBg = { '5-pillars': 'rgba(34,163,154,0.12)', 'islamic-finance': 'rgba(34,163,154,0.15)', 'quran-arabic': 'rgba(46,110,142,0.10)', 'islamic-history': 'rgba(239,111,83,0.10)' }[t.id] || 'rgba(34,163,154,0.12)';
              const diffColor = { '5-pillars': C.tealDk, 'islamic-finance': C.goldDk, 'quran-arabic': C.blue, 'islamic-history': C.coral }[t.id] || C.tealDk;
              return (
                <button key={t.id} onClick={() => { playClick(); onSelectTopic(t.id); }}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', textAlign: 'left', cursor: 'pointer', boxShadow: S.card,
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
                          <div style={{ width: `${stats.pct}%`, height: '100%', background: C.gold, borderRadius: 3, animation: 'progressGrow 1s ease-out both' }} />
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

        {/* XP Ring + Quick Session */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.25s both' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: S.card }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom: 10 }}>
              <circle cx="60" cy="60" r={ringR} fill="none" stroke="rgba(34,163,154,0.15)" strokeWidth={ringStroke} />
              <circle cx="60" cy="60" r={ringR} fill="none" stroke={C.teal} strokeWidth={ringStroke}
                strokeDasharray={ringCirc} strokeDashoffset={ringAnimOffset} strokeLinecap="round"
                transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              <text x="60" y="57" textAnchor="middle" fontFamily={serif} fontSize="24" fontWeight="500" fill={C.tealDeep}>{xpToday}</text>
              <text x="60" y="73" textAnchor="middle" fontSize="10" fill={C.textMuted}>of {xpGoal} XP</text>
            </svg>
            {xpToday === 0 ? (
              <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>Your first lesson today fills this ring</div>
            ) : (
              <div style={{ fontSize: 12, color: C.text, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Flame size={13} color={C.coral} /> {xpNeeded} XP to keep your {dailyStreak}-day streak
              </div>
            )}
          </div>
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
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 14px', textAlign: 'center', color: C.textMuted, fontSize: 12 }}>
                Complete a lesson to unlock quick sessions
              </div>
            )}
            <div style={{ fontSize: 11, color: C.textMuted, textAlign: 'center', lineHeight: 1.4, fontStyle: 'italic' }}>Review modes arriving soon</div>
          </div>
        </section>

        {/* Today's Challenge */}
        <section style={{ marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.3s both' }}>
          <div style={{ background: C.tealDeep, borderRadius: 14, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><Trophy size={13} /> TODAY'S CHALLENGE</div>
              <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>Complete 3 lessons to keep your streak alive</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>1 of 3 done · 247 learners completed today</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 12, fontWeight: 500 }}>+50 XP</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>Auto-tracked</div>
            </div>
          </div>
        </section>

        {/* Community */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18, animation: 'slideUp 0.6s ease-out 0.35s both' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', boxShadow: S.card }}>
            <Eyebrow style={{ marginBottom: 8 }}>LEARNING TOGETHER</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><AvatarStack /><span style={{ fontSize: 13, fontWeight: 500, color: C.tealDeep }}>1,247 learners</span></div>
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

        {/* Footer */}
        <section style={{ animation: 'slideUp 0.6s ease-out 0.4s both' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', marginBottom: 14, boxShadow: S.card }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 18, alignItems: 'start' }}>
              <div>
                <Eyebrow style={{ marginBottom: 10 }}>PRAYER TIMES · DUBAI</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[['Fajr', '04:08'], ['Dhuhr', '12:18'], ['Asr', '15:42'], ['Maghrib', '19:08', true], ['Isha', '20:32']].map(([name, time, next]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12,
                      ...(next ? { background: 'rgba(34,163,154,0.10)', padding: '3px 8px', borderRadius: 6, margin: '1px -8px', color: C.teal, fontWeight: 500 } : {}) }}>
                      <span style={{ color: next ? C.teal : C.textMuted }}>{next ? `${name} · next` : name}</span>
                      <span style={{ color: next ? C.teal : C.tealDeep }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Eyebrow style={{ marginBottom: 10 }}>EXPLORE</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: C.textFaint }}>
                  {['About Deany', 'How it works', 'Sources & scholars', 'Reflections journal', 'Privacy'].map(l => (
                    <span key={l} style={{ opacity: 0.7 }}>{l}</span>
                  ))}
                  <span style={{ fontSize: 10, color: C.textFaint, fontStyle: 'italic', marginTop: 4 }}>Coming soon</span>
                </div>
              </div>
              <div>
                <Eyebrow style={{ marginBottom: 10 }}>THIS MONTH</Eyebrow>
                <div style={{ fontFamily: serif, fontSize: 15, color: C.tealDeep, fontWeight: 500, marginBottom: 4 }}>Jumada al-Akhirah</div>
                <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>1447 AH<br />Day 15 of 30</div>
                <div style={{ marginTop: 8, height: 6, background: 'rgba(34,163,154,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', background: C.gold, borderRadius: 3, animation: 'progressGrow 1s ease-out both' }} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 0 4px', fontFamily: arabic, fontSize: 14, color: C.teal, direction: 'rtl' }}>
            {'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650'}
          </div>
        </section>
      </main>
      </div>{/* end center wrapper */}

      {/* ════ RIGHT RAIL — collapsible ══════════ */}
      <div className="el-right-rail-wrap" style={{ width: railOpen ? 230 : 0, flexShrink: 0, position: 'sticky', top: 0, height: 'calc(100vh - 68px)', overflow: 'hidden', transition: 'width .35s cubic-bezier(.4,0,.2,1)' }}>
        <aside className="el-rail-inner" style={{
          width: 196,
          height: '100%',
          overflow: 'hidden',
          overflowY: railOpen ? 'auto' : 'hidden',
          display: 'flex', flexDirection: 'column',
          padding: '14px 14px 14px 8px',
          gap: 14,
          transform: railOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: railOpen ? 1 : 0,
          pointerEvents: railOpen ? 'auto' : 'none',
        }}>

        {/* Today's Objectives — light card */}
        <div style={{ background: '#F1F6F4', borderRadius: 12, padding: 12, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(20,43,54,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Eyebrow>TODAY'S OBJECTIVES</Eyebrow>
            <span style={{ fontSize: 10, color: C.tealDk, fontWeight: 600 }}>{objDone}/{objectives.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {objectives.map((o, i) => (
              <button key={i} onClick={() => { playClick(); toggleObj(i); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', width: '100%', textAlign: 'left', borderRadius: 6, transition: 'background .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,163,154,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${o.done ? C.teal : C.textFaint}`, background: o.done ? C.teal : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                  {o.done && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>&#10003;</span>}
                </div>
                <span style={{ fontSize: 12, color: o.done ? '#0F6E56' : C.textMuted, fontWeight: o.done ? 500 : 400, textDecoration: o.done ? 'line-through' : 'none', transition: 'color .2s' }}>{o.label}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10, height: 4, background: 'rgba(34,163,154,0.12)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${(objDone / objectives.length) * 100}%`, height: '100%', background: `linear-gradient(90deg,${C.teal},${C.tealDk})`, borderRadius: 2, transition: 'width .5s ease-out' }} />
          </div>
        </div>

        {/* Notes — light card */}
        <div style={{ background: '#F1F6F4', borderRadius: 12, padding: 12, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(20,43,54,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Eyebrow color={C.goldDk}>NOTES</Eyebrow>
            <span style={{ fontSize: 10, color: C.goldDk, fontWeight: 600 }}>{notes.length} saved</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notes.slice(0, 3).map(n => (
              <div key={n.id} style={{ borderLeft: `2px solid ${n.accent}`, paddingLeft: 10, position: 'relative' }}>
                <div style={{ fontSize: 11.5, fontStyle: 'italic', color: C.text, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', paddingRight: 14 }}>{n.text}</div>
                <div style={{ fontSize: 10, color: C.textFaint, marginTop: 3 }}>{n.source} · {n.time}</div>
                <button onClick={() => deleteNote(n.id)} aria-label="Delete note"
                  style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: C.textFaint, fontSize: 12, lineHeight: 1, padding: 2, opacity: 0.5, transition: 'opacity .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}>
                  &#10005;
                </button>
              </div>
            ))}
          </div>
          {showNoteInput ? (
            <div style={{ marginTop: 10 }}>
              <textarea value={newNoteText} onChange={e => setNewNoteText(e.target.value)}
                placeholder="Write a quick note..."
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); } if (e.key === 'Escape') { setShowNoteInput(false); setNewNoteText(''); } }}
                style={{ width: '100%', padding: '7px 9px', fontSize: 11.5, border: `1px solid ${C.teal}`, borderRadius: 8, background: '#fff', color: C.text, resize: 'none', outline: 'none', minHeight: 48, fontFamily: 'inherit', lineHeight: 1.4, boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button onClick={addNote}
                  style={{ flex: 1, padding: '6px 0', background: C.teal, border: 'none', borderRadius: 6, fontSize: 11, color: '#fff', fontWeight: 500, cursor: 'pointer', minHeight: 30 }}>
                  Save
                </button>
                <button onClick={() => { setShowNoteInput(false); setNewNoteText(''); }}
                  style={{ flex: 1, padding: '6px 0', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.textMuted, cursor: 'pointer', minHeight: 30 }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNoteInput(true)}
              style={{ marginTop: 10, width: '100%', padding: '7px 0', background: C.goldSoft, border: 'none', borderRadius: 8, fontSize: 11, color: C.goldText, fontWeight: 500, cursor: 'pointer', minHeight: 34, transition: 'background .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0E2B0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.goldSoft; }}>
              + New note
            </button>
          )}
        </div>

        {/* Knowledge Map — dark card, flex:1 to fill remaining height */}
        <div onClick={() => setShowMap(true)} style={{
          flex: 1, minHeight: 140,
          background: C.tealDeep, borderRadius: 12, padding: 0, overflow: 'hidden', cursor: 'pointer',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(15,76,92,0.15)',
          transition: 'box-shadow .28s cubic-bezier(.2,.7,.3,1), transform .28s cubic-bezier(.2,.7,.3,1)',
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = S.cardRaised; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,76,92,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ padding: '12px 12px 0' }}>
            <Eyebrow color={C.tealPale} style={{ marginBottom: 4 }}>YOUR KNOWLEDGE MAP</Eyebrow>
            <div style={{ fontSize: 10, color: '#5A8A8A', marginBottom: 4 }}>{mapUnlocked} concepts unlocked · {mapTotal - mapUnlocked} to go</div>
          </div>
          <svg width="100%" style={{ flex: 1, minHeight: 80 }} viewBox="0 0 200 140" preserveAspectRatio="xMidYMid meet">
            {edges.map(([f, t], i) => {
              const pf = positions[f], pt = positions[t];
              if (!pf || !pt) return null;
              return <line key={i} x1={pf.x * 200} y1={pf.y * 140} x2={pt.x * 200} y2={pt.y * 140} stroke={mapStates[f] === 'unlocked' && mapStates[t] === 'unlocked' ? '#22A39A50' : '#1A304040'} strokeWidth={0.8} />;
            })}
            {concepts.map(c => {
              const p = positions[c.id];
              if (!p) return null;
              const s = mapStates[c.id];
              const color = s === 'unlocked' ? (trackAccents[c.track] || '#22A39A') : s === 'available' ? '#F0B429' : '#1A3040';
              return <circle key={c.id} cx={p.x * 200} cy={p.y * 140} r={s === 'available' ? 4 : s === 'unlocked' ? 3.5 : 2} fill={color} opacity={s === 'locked' ? 0.35 : 0.9} />;
            })}
          </svg>
          <div style={{ padding: '4px 12px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: C.tealPale, opacity: 0.6 }}>Explore galaxy</span>
            <span style={{ fontSize: 12, color: C.tealPale, opacity: 0.4 }}>&#10530;</span>
          </div>
        </div>
      </aside>
      </div>{/* end right rail wrap */}

      </div>{/* end three-column layout */}

      {/* Knowledge map modal */}
      {showMap && (
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(8,24,32,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 20, height: 20, border: '2px solid #1A3040', borderTop: '2px solid #22A39A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>}>
          <KnowledgeMapModal onClose={() => setShowMap(false)} completedLessons={lessons} />
        </Suspense>
      )}
    </div>
  );
};

export default Dashboard;
