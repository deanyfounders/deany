// Home - editorial dashboard (deany_dashboard_spec.md; the HTML is the pixel
// reference). One card vocabulary, chunky 4px bottom borders, spring entrance.
// The mock's CSS is ported into a scoped stylesheet (.ed) driven by the shared E
// tokens; every visible value is wired to real state or a live service. No Qur'anic
// Arabic is authored here - the verse comes from the ayah source and the bismillah
// from the verified /quran source; this decorates only.
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Trash2, Plus } from 'lucide-react';
import { E, FONT_LATIN, FONT_SERIF, FONT_AR, subjectOf } from '../tokens.js';
import { getActiveTopics, topicProgress, getContinueTarget, getDueReviews } from '../selectors.js';
import { catalogById, CATALOG } from '../catalog.js';
import { getAyahOfTheDay } from '../../../content/ayahOfTheDay.js';
import { levelFor } from '../../../lib/levels.js';
import { usePrayerTimes } from '../services/prayerTimes.js';
import jumuah from '../../../../content/dashboard/jumuah.json';
import pillarsArt from '../../../assets/topics/5-pillars.png';
import financeArt from '../../../assets/topics/islamic-finance.png';
import quranArt from '../../../assets/topics/quran-arabic.png';
import historyArt from '../../../assets/topics/islamic-history.png';

const SALAM = 'السلام عليكم'; // greeting, not Qur'anic verse text
const minsOf = (d) => { const n = parseInt(String(d || '').replace(/[^0-9]/g, ''), 10); return Number.isFinite(n) && n > 0 ? n : 5; };

// Recite audio resolves from the DISPLAYED ayah key so it can never mismatch the
// verse on screen (deany_recite_audio_spec). Local override first, then the
// Al-Dosari CDN (reciter 4, same source as the hifz component).
const RECITE_OVERRIDE = { '65:3': '/audio/ayah/065002_003.mp3' };
const reciteSources = (ref) => {
  const [s, aRaw] = String(ref || '').split(':');
  const a = String(aRaw || '').split('-')[0]; // first ayah of a range
  const cdn = `https://the-quran-project.github.io/Quran-Audio/Data/4/${s}_${a}.mp3`;
  const local = RECITE_OVERRIDE[`${s}:${a}`];
  return local ? [local, cdn] : [cdn];
};

// Path identity (spec section 4): tile tint, badge fill, bar + percent colour, art.
const PATHS = [
  { id: '5-pillars', tile: E.tealTint, badge: E.teal, badgeInk: '#fff', bar: E.teal, pct: E.tealDark, art: pillarsArt },
  { id: 'islamic-finance', tile: E.goldTint, badge: E.gold, badgeInk: E.ink, bar: E.gold, pct: E.goldDark, art: financeArt },
  { id: 'quran-arabic', tile: E.quranTint, badge: E.navy, badgeInk: '#fff', bar: E.navy, pct: E.navy, art: quranArt },
  { id: 'islamic-history', tile: E.historyTint, badge: E.history, badgeInk: '#fff', bar: E.history, pct: E.history, art: historyArt },
];
const PATH_BY_ID = Object.fromEntries(PATHS.map((p) => [p.id, p]));
const DIFF = (tier) => (tier >= 3 ? 'Advanced' : tier === 2 ? 'Intermediate' : 'Beginner');

// Tools launcher (spec section 8). Each opens its own screen; none render inline.
// Tools use real Apple emoji glyphs (rendered by the OS), not custom SVGs.
const TOOLS = [
  { id: 'zakat', name: 'Zakat calculator', sub: 'Cash, gold, stocks', tile: E.goldTint, emoji: '🔢' },
  { id: 'qibla', name: 'Qibla finder', sub: 'Direction from here', tile: E.tealTint, emoji: '🧭' },
  { id: 'tasbih', name: 'Tasbih counter', sub: 'Dhikr with haptics', tile: E.historyTint, emoji: '📿' },
  { id: 'hijri', name: 'Hijri converter', sub: 'Dates both ways', tile: E.quranTint, emoji: '📅' },
];

const hijriParts = (date) => {
  const p = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(date);
  const g = (t) => (p.find((x) => x.type === t) || {}).value || '';
  return { day: parseInt(g('day'), 10) || 1, month: g('month'), year: g('year') };
};
const hijriMonthLen = (date) => { // advance to month rollover; last day seen = length
  const cur = hijriParts(date).month; let d = new Date(date), last = hijriParts(d).day;
  for (let i = 0; i < 32; i++) { const n = new Date(d); n.setDate(n.getDate() + 1); const hp = hijriParts(n); if (hp.month !== cur) break; last = hp.day; d = n; }
  return last;
};
const weekday = () => { try { return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()); } catch (_) { return ''; } };
const daysToFriday = () => (5 - new Date().getDay() + 7) % 7;

const ED_CSS = `
.ed{
  --bg:${E.bg}; --inset:${E.inset}; --white:${E.card}; --line:${E.line};
  --ink:${E.ink}; --soft:${E.soft}; --faint:${E.faint};
  --gold:${E.gold}; --gold-dark:${E.goldDark}; --gold-tint:${E.goldTint};
  --teal:${E.teal}; --teal-dark:${E.tealDark}; --teal-tint:${E.tealTint};
  --navy:${E.navy}; --history:${E.history};
  font-family:${FONT_LATIN}; background:${E.bg}; color:var(--ink); padding:0 18px; min-height:100%;
}
.ed .card{ background:var(--white); border:2px solid var(--line); border-bottom-width:4px; border-radius:16px; padding:16px; margin-bottom:14px; transition:transform 0.12s ease; -webkit-tap-highlight-color:transparent; }
.ed .card:active{ transform:scale(0.982); }
.ed .lbl{ font-size:9.5px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:var(--soft); }
.ed .lbl.gold{ color:var(--gold-dark); } .ed .lbl.teal{ color:var(--teal-dark); }
.ed .wash{ margin:0 -18px; padding:calc(env(safe-area-inset-top) + 14px) 18px 0; background:radial-gradient(120% 90% at 85% -10%, rgba(240,180,41,0.16), rgba(240,180,41,0) 55%), linear-gradient(180deg, #E2F3EE 0%, rgba(226,243,238,0.55) 55%, rgba(255,255,255,0) 100%); }
.ed .topbar{ display:flex; align-items:center; justify-content:space-between; }
.ed .avatar{ width:36px; height:36px; border-radius:50%; background:#fff; border:1px solid rgba(27,42,74,0.08); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:var(--teal-dark); cursor:pointer; padding:0; overflow:hidden; }
.ed .avatar img{ width:100%; height:100%; object-fit:cover; }
.ed .schips{ display:flex; gap:8px; }
.ed .schip{ display:flex; align-items:center; gap:6px; border-radius:16px; padding:6px 11px; font-size:12px; font-weight:800; box-shadow:0 2px 0 rgba(27,42,74,0.10); border:1px solid transparent; cursor:pointer; font-family:inherit; }
.ed .schip.streak{ background:var(--gold-tint); border-color:#F0D089; color:var(--gold-dark); }
.ed .schip.coin{ background:#fff; border-color:rgba(27,42,74,0.08); color:var(--ink); }
.ed .head{ text-align:center; padding:18px 0 20px; }
.ed .head .salam{ font-family:${FONT_AR}; font-size:18px; color:var(--gold-dark); }
.ed .head h1{ font-family:${FONT_SERIF}; font-size:28px; font-weight:600; margin:2px 0 3px; }
.ed .head .date{ font-size:12px; color:var(--faint); }
.ed .cont{ display:flex; align-items:center; gap:12px; }
.ed .cont .mid{ flex:1; min-width:0; }
.ed .cont h2{ font-family:${FONT_SERIF}; font-size:17px; font-weight:600; margin-top:5px; }
.ed .cont .meta{ font-size:11px; margin-top:3px; }
.ed .btn{ background:var(--gold); color:var(--ink); border:none; border-radius:14px; padding:12px 20px; font-family:inherit; font-size:13.5px; font-weight:800; cursor:pointer; box-shadow:0 4px 0 ${E.goldEdge}; transition:transform 0.1s; white-space:nowrap; }
.ed .btn:active{ transform:translateY(3px); box-shadow:0 1px 0 ${E.goldEdge}; }
.ed .verse{ text-align:center; }
.ed .verse .ar{ font-family:${FONT_AR}; font-size:26px; line-height:1.9; direction:rtl; margin:12px 0 10px; color:var(--ink); }
.ed .verse .plbl{ display:inline-block; background:var(--teal-tint); color:var(--teal-dark); padding:5px 13px; border-radius:14px; font-size:9.5px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; }
.ed .verse .tr{ font-size:13px; line-height:1.6; color:var(--soft); font-style:italic; }
.ed .verse .ref{ font-size:10.5px; color:var(--faint); margin-top:8px; letter-spacing:0.06em; }
.ed .verse .chips{ display:flex; gap:8px; justify-content:center; margin-top:14px; padding-top:14px; border-top:1px solid var(--line); }
.ed .chip{ display:flex; align-items:center; gap:6px; border:1px solid rgba(27,42,74,0.08); background:var(--white); border-radius:18px; padding:9px 15px; font-size:12px; font-weight:800; cursor:pointer; color:var(--ink); box-shadow:0 3px 0 rgba(27,42,74,0.15); transition:transform 0.1s; }
.ed .chip:active{ transform:translateY(2px); box-shadow:0 1px 0 rgba(27,42,74,0.15); }
.ed .sect{ text-align:center; margin:22px 0 12px; }
.ed .sect h3{ font-family:${FONT_SERIF}; font-size:17px; font-weight:600; }
.ed .paths{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.ed .path{ padding:14px; margin-bottom:0; }
.ed .path .top{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
.ed .badge{ font-size:9px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; border:none; border-radius:12px; padding:4px 10px; box-shadow:0 2px 0 rgba(27,42,74,0.18); }
.ed .ptile{ width:48px; height:48px; border-radius:15px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(27,42,74,0.08); box-shadow:0 3px 0 rgba(27,42,74,0.12); overflow:hidden; }
.ed .ptile img{ width:40px; height:40px; object-fit:contain; }
.ed .path h4{ font-size:13.5px; font-weight:800; }
.ed .path p{ font-size:10.5px; color:var(--faint); margin-top:2px; line-height:1.4; }
.ed .add-path{ padding:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; border:2px dashed var(--line); border-radius:16px; background:var(--white); cursor:pointer; min-height:118px; font-family:inherit; -webkit-tap-highlight-color:transparent; }
.ed .add-path:active{ transform:scale(0.982); }
.ed .add-plus{ width:44px; height:44px; border-radius:13px; background:var(--teal-tint); display:inline-flex; align-items:center; justify-content:center; }
.ed .add-lbl{ font-size:13px; font-weight:800; color:var(--teal-dark); }
.ed .bar{ height:7px; background:#F1EFE9; border-radius:2px; margin-top:11px; overflow:hidden; }
.ed .bar i{ display:block; height:100%; background:var(--gold); border-radius:4px; position:relative; overflow:hidden; }
.ed .bar i::after{ content:''; position:absolute; top:1.5px; left:3px; right:3px; height:2px; border-radius:2px; background:rgba(255,255,255,0.45); }
.ed .pct{ font-size:9.5px; color:var(--faint); text-align:right; margin-top:4px; }
.ed .xp-row{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
/* Level progress card (deany_level_card_spec) - replaces the old XP ring. */
.ed .level-card{ margin-bottom:0; padding:16px; display:flex; flex-direction:column; justify-content:center; cursor:pointer; -webkit-tap-highlight-color:transparent; }
.ed .level-head{ display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.ed .level-badge{ width:38px; height:38px; border-radius:12px; background:var(--gold-tint); border:1px solid #F0D089; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; font-family:${FONT_SERIF}; font-weight:700; font-size:15px; color:var(--gold-dark); }
.ed .level-lbl{ font-size:9px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:var(--soft); }
.ed .level-hl{ font-size:13.5px; font-weight:800; color:var(--ink); line-height:1.2; margin-top:2px; }
.ed .level-track{ height:10px; background:var(--inset); border-radius:6px; overflow:hidden; }
.ed .level-fill{ height:100%; background:var(--gold); border-radius:6px; position:relative; overflow:hidden; transition:width .5s ease-out; }
.ed .level-fill::after{ content:''; position:absolute; top:2px; left:3px; right:3px; height:2px; border-radius:2px; background:rgba(255,255,255,0.5); }
.ed .nudge{ padding:14px; margin-bottom:0; display:flex; flex-direction:column; justify-content:center; }
.ed .nudge b{ font-size:13px; font-weight:800; }
.ed .nudge small{ font-size:10.5px; color:var(--faint); margin-top:3px; }
.ed .nudge .xp{ background:var(--gold); color:var(--ink); border-radius:10px; padding:5px 10px; display:inline-block; width:fit-content; font-size:12px; font-weight:800; margin-top:8px; border:1px solid rgba(138,94,16,0.35); }
.ed .chall{ color:#fff; display:flex; align-items:center; gap:12px; }
.ed .chall .mid{ flex:1; min-width:0; }
.ed .chall .lbl{ color:#9FB0D6; display:flex; align-items:center; gap:6px; }
.ed .chall b{ font-size:13.5px; font-weight:700; display:block; margin-top:4px; line-height:1.4; }
.ed .chall small{ font-size:10.5px; color:#9FB0D6; display:block; margin-top:3px; }
.ed .chall .xp{ background:var(--gold); color:var(--ink); font-size:11px; font-weight:800; border-radius:10px; padding:6px 10px; white-space:nowrap; }
.ed .tools-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:12px; }
.ed .tool{ display:flex; align-items:center; gap:10px; padding:11px 12px; background:var(--white); border:1px solid var(--line); border-radius:13px; box-shadow:0 3px 0 rgba(27,42,74,0.08); cursor:pointer; transition:transform 0.1s; font-family:inherit; text-align:left; }
.ed .tool:active{ transform:translateY(2px); box-shadow:0 1px 0 rgba(27,42,74,0.08); }
.ed .tool .ttile{ width:38px; height:38px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1px solid rgba(27,42,74,0.08); }
.ed .tool b{ font-size:12px; font-weight:800; display:block; line-height:1.25; color:var(--ink); }
.ed .tool small{ font-size:9.5px; color:var(--faint); }
.ed .trio{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.ed .pt{ padding:14px; margin-bottom:0; }
.ed .pt .row{ display:flex; justify-content:space-between; font-size:11.5px; padding:5px 6px; border-radius:7px; }
.ed .pt .row span:last-child{ font-weight:700; }
.ed .pt .row.next{ background:var(--gold); color:var(--ink); font-weight:800; }
.ed .month{ padding:14px; margin-bottom:0; }
.ed .month b{ font-family:${FONT_SERIF}; font-size:15px; font-weight:600; display:block; margin-top:6px; }
.ed .month small{ font-size:10.5px; color:var(--faint); }
.ed .bismillah{ text-align:center; font-family:${FONT_AR}; font-size:19px; color:var(--gold-dark); padding:22px 0 26px; opacity:0.85; }
@keyframes edRise{ from{ opacity:0; transform:translateY(14px) scale(0.97);} to{ opacity:1; transform:none;} }
.ed .wash, .ed .card, .ed .sect, .ed .paths, .ed .xp-row, .ed .trio, .ed .bismillah{ animation:edRise 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
.ed .card.cont{ animation-delay:0.05s; } .ed .sect{ animation-delay:0.1s; } .ed .paths{ animation-delay:0.12s; }
.ed .xp-row{ animation-delay:0.18s; } .ed .trio{ animation-delay:0.24s; }
@media (prefers-reduced-motion: reduce){ .ed .wash,.ed .card,.ed .sect,.ed .paths,.ed .xp-row,.ed .trio,.ed .bismillah,.ed .btn,.ed .chip{ animation:none !important; transition:none !important; } }
`;

export default function Home({ name, state, deps, coins, streak, xp, onGoTab, onOpenTopic, onOpenAyah, onSelectLesson, onOpenTool, addTopic, removeTopic }) {
  const [menuTopic, setMenuTopic] = useState(null); // open remove-menu for a subject
  const [showAdd, setShowAdd] = useState(false);     // add-subject bottom sheet
  const [ayah] = useState(getAyahOfTheDay);
  const [dateLine] = useState(() => { const h = hijriParts(new Date()); return `${weekday()} · ${h.day} ${h.month} ${h.year}`; });
  const [bismillah, setBismillah] = useState('');

  // Bismillah from the verified /quran source (surah 1, ayah 1) - never typed here.
  useEffect(() => {
    let alive = true;
    fetch('/quran/surah/1.json').then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => {
      const ayat = Array.isArray(d) ? d : (d.ayat || []); const a = ayat[0];
      if (alive && a) setBismillah(a.arabic_uthmani || a.arabic || '');
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const prayer = usePrayerTimes();

  // Continue-learning target (real current lesson, else first lesson of a path).
  // Top CTA pinned to Islamic finance lesson 3 (Riba, Gharar, Maysir) for now.
  const contId = 'islamic-finance';
  const cprog = topicProgress(contId, deps);
  const _finMod = (deps.modules?.[contId] || []).find((m) => m.id === 'module-1');
  const cnext = _finMod?.lessons?.[2]
    ? { lesson: _finMod.lessons[2], idx: 2, mod: _finMod }
    : (cprog && cprog.next);
  const cStarted = false;

  const hp = hijriParts(new Date());
  const monthLen = useMemo(() => hijriMonthLen(new Date()), []);
  const due = getDueReviews(state, Date.now());

  const earned = state.goal?.minutesToday || 0; // drives the streak/challenge signal below

  // Level card: derived from lifetime XP (same source the profile uses).
  const xpKnown = Number.isFinite(Number(xp));
  const lvl = levelFor(xp);

  // Challenge from a real signal: any study today keeps the streak alive.
  const challDone = earned > 0 ? 1 : 0;

  const nextLesson = () => { if (cnext) onSelectLesson && onSelectLesson(cnext.lesson, cnext.idx, cnext.mod); else if (contId) onOpenTopic && onOpenTopic(contId); };
  const openReader = () => { const [s, a] = String(ayah.ref).split(':'); onOpenAyah && onOpenAyah(parseInt(s, 10), parseInt(a, 10)); };

  // Recite chip = play/stop toggle for the displayed ayah, local file -> CDN.
  const reciteRef = useRef(null);
  const reciteIdx = useRef(0);
  const [reciting, setReciting] = useState(false);
  const [reciteErr, setReciteErr] = useState('');
  const [showTafsir, setShowTafsir] = useState(false); // Tafsir chip expands inline
  const reciteList = useMemo(() => reciteSources(ayah.ref), [ayah.ref]);
  const playReciteFrom = (i) => {
    const el = reciteRef.current; if (!el || !reciteList[i]) return;
    reciteIdx.current = i;
    el.src = reciteList[i];
    el.currentTime = 0;
    el.play().then(() => { setReciting(true); setReciteErr(''); }).catch(() => {/* onError handles fallback */});
  };
  const toggleRecite = () => {
    const el = reciteRef.current; if (!el) return;
    if (reciting) { el.pause(); setReciting(false); return; }
    try { document.querySelectorAll('audio').forEach((a) => { if (a !== el) a.pause(); }); } catch (e) {} // one voice at a time
    playReciteFrom(0);
  };
  const onReciteError = () => {
    if (reciteIdx.current < reciteList.length - 1) playReciteFrom(reciteIdx.current + 1);
    else { setReciting(false); setReciteErr('Audio is unavailable right now'); }
  };
  // Stop and release when the verse changes or on unmount.
  useEffect(() => { setReciting(false); setReciteErr(''); return () => { const el = reciteRef.current; if (el) el.pause(); }; }, [ayah.ref]);

  const comingApproved = jumuah.status === 'approved' && (jumuah.body || '').trim();

  // Learning paths are the user's active subjects; they can add and remove them.
  const activeTopics = getActiveTopics(state);
  const activeTopicSet = new Set(activeTopics);
  const addableTopics = CATALOG.filter((c) => !activeTopicSet.has(c.id) && c.status !== 'coming_soon');

  return (
    <div className="ed">
      <style>{ED_CSS}</style>

      {/* 1. Top area - the wash: full-bleed gradient with the top bar + greeting */}
      <div className="wash">
        <div className="topbar">
          <button className="avatar" aria-label="Your profile" onClick={() => onGoTab && onGoTab('you')}>{(name || '?').trim().charAt(0).toUpperCase() || '?'}</button>
          <div className="schips">
            <button className="schip streak" aria-label={`${streak} day streak`} onClick={() => onGoTab && onGoTab('you')}>
              <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true"><path d="M6.5 1C7.5 3.2 10.8 4.6 10.8 8.4c0 2.9-1.9 5.1-4.3 5.1S2.2 11.3 2.2 8.4C2.2 6.7 3 5.5 3.9 4.5c0 1.1.5 1.9 1.3 2.2C4.7 4.5 5.6 2.4 6.5 1Z" fill={E.gold} /></svg>
              {streak}
            </button>
            <button className="schip coin" aria-label={`${coins} coins`} onClick={() => onGoTab && onGoTab('you')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.6" stroke={E.gold} strokeWidth="1.6" /><circle cx="7" cy="7" r="2.4" fill={E.gold} /></svg>
              {coins}
            </button>
          </div>
        </div>
        {/* 2. Header (centered, inside the wash) */}
        <div className="head">
          <div className="salam" dir="rtl">{SALAM}</div>
          <h1>{name || 'friend'}</h1>
          <div className="date">{dateLine}</div>
        </div>
      </div>

      {/* 2. Continue learning */}
      <div className="card cont" style={{ background: E.contGrad, borderColor: E.contBorder, borderBottomColor: E.contBottom, color: '#fff' }}>
        <div className="mid">
          <div className="lbl" style={{ color: '#BFF0E8' }}>{cStarted ? 'Continue learning' : 'Start learning'} · {subjectOf(contId).name}</div>
          <h2 style={{ color: '#fff' }}>{cnext ? `Lesson ${cnext.idx + 1}: ${cnext.lesson.title}` : 'All lessons complete'}</h2>
          {cprog && <div className="meta" style={{ color: '#BFF0E8' }}>{cprog.done} of {cprog.total} lessons · {minsOf(cnext && cnext.lesson.duration)} min</div>}
        </div>
        <button className="btn" onClick={nextLesson}>{cStarted ? 'Resume' : 'Start'}</button>
      </div>

      {/* 3. Today's verse */}
      <div className="card verse">
        <div className="plbl">Today's verse</div>
        <div className="ar">{ayah.arabic}</div>
        <div className="tr">"{ayah.translation}"</div>
        <div className="ref">{ayah.surahName} {ayah.ref}</div>
        <div className="chips">
          <div className="chip" role="button" tabIndex={0} aria-pressed={reciting}
            aria-label={reciting ? 'Stop recitation' : 'Recite, recited by Yasser Al-Dosari'}
            onClick={toggleRecite}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRecite(); } }}
            style={{ background: E.teal, borderColor: E.teal, color: '#fff' }}>
            {reciting
              ? <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><rect x="1" y="1" width="10" height="10" rx="2" fill="#fff" /></svg>
              : <svg width="10" height="11" viewBox="0 0 11 12" fill="none" aria-hidden="true"><path d="M1.5 1.5 L10 6 L1.5 10.5 Z" fill="#fff" /></svg>}
            {reciting ? 'Stop' : 'Recite'}
          </div>
          <div className="chip" role="button" tabIndex={0} aria-expanded={showTafsir} aria-label="Tafsir"
            onClick={() => setShowTafsir((v) => !v)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowTafsir((v) => !v); } }}
            style={{ background: E.goldTint, borderColor: '#F0D089', color: E.goldDark }}>Tafsir</div>
        </div>
        <audio ref={reciteRef} preload="none" onEnded={() => setReciting(false)} onError={onReciteError} />
        <div style={{ fontSize: 10.5, color: E.faint, marginTop: 10 }}>{reciteErr || 'Recited by Yasser Al-Dosari'}</div>
        {showTafsir && ayah.tafsirFull && (
          <div style={{ marginTop: 12, textAlign: 'left', background: E.inset, border: `1px solid ${E.line}`, borderRadius: 12, padding: '13px 15px' }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: E.soft, marginBottom: 6 }}>Tafsir · {ayah.source || 'Tafsir Ibn Kathir'}</div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: E.ink, margin: 0 }}>{ayah.tafsirFull}</p>
          </div>
        )}
      </div>

      {/* 4. Learning paths - the user's active subjects (add / remove) */}
      <div className="sect"><h3>Learning paths</h3></div>
      <div className="paths">
        {activeTopics.map((id) => {
          const p = PATH_BY_ID[id] || { id, tile: E.inset, badge: E.soft, badgeInk: '#fff', bar: E.teal, pct: E.tealDark, art: null };
          const s = subjectOf(id);
          const prog = topicProgress(id, deps);
          const tier = (state.topics?.[id]?.tier) || 1;
          const started = prog.done > 0;
          return (
            <div className="card path" key={id} onClick={() => onOpenTopic && onOpenTopic(id)} style={{ position: 'relative' }}>
              <div className="top">
                <span className="ptile" style={{ background: p.tile }}>{p.art && <img src={p.art} alt="" aria-hidden="true" />}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="badge" style={{ background: p.badge, color: p.badgeInk }}>{DIFF(tier)}</span>
                  <button aria-label={`${s.name} options`} onClick={(e) => { e.stopPropagation(); setMenuTopic(menuTopic === id ? null : id); }}
                    style={{ background: 'none', border: 'none', padding: 4, margin: '-4px -4px -4px 0', cursor: 'pointer', color: E.faint, display: 'inline-flex', WebkitTapHighlightColor: 'transparent' }}>
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>
              <h4>{s.name}</h4>
              <p>{(catalogById(id) || {}).desc || `${prog.total} lesson${prog.total === 1 ? '' : 's'}`}</p>
              <div className="bar"><i style={{ width: `${prog.pct}%`, background: p.bar }} /></div>
              {started
                ? <div className="pct" style={{ color: p.pct }}>{prog.pct}%</div>
                : <div className="pct" style={{ color: p.pct }}>{prog.next ? `Start with ${prog.next.lesson.title}` : 'Not started'}</div>}
              {menuTopic === id && (
                <>
                  <div onClick={(e) => { e.stopPropagation(); setMenuTopic(null); }} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                  <div style={{ position: 'absolute', top: 40, right: 10, zIndex: 41, background: '#fff', border: `1px solid ${E.line}`, borderRadius: 12, overflow: 'hidden', minWidth: 160, boxShadow: '0 8px 24px rgba(15,42,52,0.16)' }}>
                    <button onClick={(e) => { e.stopPropagation(); removeTopic && removeTopic(id); setMenuTopic(null); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '12px 13px', fontSize: 13, fontWeight: 600, color: '#B04A2C', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                      <Trash2 size={15} color="#B04A2C" /> Remove subject
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {addableTopics.length > 0 && (
          <button className="add-path" onClick={() => setShowAdd(true)} aria-label="Add a subject">
            <span className="add-plus"><Plus size={22} color={E.tealDark} /></span>
            <span className="add-lbl">Add subject</span>
          </button>
        )}
      </div>

      {/* Add-subject bottom sheet - portaled to body so the nav bar can't cover it */}
      {showAdd && typeof document !== 'undefined' && createPortal(
        <div>
          <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,52,0.30)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1001, background: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '18px 18px calc(env(safe-area-inset-bottom) + 20px)', maxWidth: 520, margin: '0 auto', maxHeight: '80vh', overflowY: 'auto', fontFamily: FONT_LATIN }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 600, color: E.ink, marginBottom: 4 }}>Add a subject</div>
            <div style={{ fontSize: 12.5, color: E.soft, marginBottom: 14 }}>Pick what you want to learn. You can remove it any time.</div>
            {addableTopics.map((c) => {
              const p = PATH_BY_ID[c.id];
              return (
                <button key={c.id} onClick={() => { addTopic && addTopic(c.id); if (addableTopics.length <= 1) setShowAdd(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: `1px solid ${E.line}`, padding: '13px 2px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                  <span style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: p ? p.tile : E.inset, border: '1px solid rgba(27,42,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{p && p.art && <img src={p.art} alt="" aria-hidden="true" style={{ width: 36, height: 36, objectFit: 'contain' }} />}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: E.ink }}>{c.name}</span>
                    <span style={{ display: 'block', fontSize: 11.5, color: E.soft, marginTop: 1 }}>{c.desc}</span>
                  </span>
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, color: E.tealDark, fontSize: 12.5, fontWeight: 700, border: `1px solid ${E.line}`, borderRadius: 999, padding: '7px 14px' }}><Plus size={14} /> Add</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )}

      <div style={{ height: 14 }} />

      {/* 5. XP row */}
      <div className="xp-row">
        <div className="card level-card" role="button" tabIndex={0}
          aria-label={xpKnown ? `Level ${lvl.level}, ${lvl.xpToNext} XP to level ${lvl.nextLevel}. Open profile.` : 'Level. Open profile.'}
          onClick={() => onGoTab && onGoTab('you')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onGoTab && onGoTab('you'); } }}>
          <div className="level-head">
            <span className="level-badge">{xpKnown ? lvl.level : '–'}</span>
            <div style={{ minWidth: 0 }}>
              <div className="level-lbl">Level {xpKnown ? lvl.level : ''}</div>
              <div className="level-hl">{xpKnown ? `${lvl.xpToNext} XP to Level ${lvl.nextLevel}` : '— XP to next level'}</div>
            </div>
          </div>
          <div className="level-track">
            <div className="level-fill" style={{ width: `${Math.round((xpKnown ? lvl.progress : 0) * 100)}%` }} />
          </div>
        </div>
        <div className="card nudge">
          <b>One lesson</b>
          <small>{minsOf(cnext && cnext.lesson.duration)} min · next up in {subjectOf(contId).short || subjectOf(contId).name}</small>
          <span className="xp">+{(cnext && cnext.lesson.coins) || 10} XP</span>
          {due.length > 0 && <small style={{ marginTop: 6, color: '#C9B98A' }}>Review deck adds {due.length} more</small>}
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* 6. Today's challenge */}
      <div className="card chall" style={{ background: E.challGrad, borderColor: E.challBorder, borderBottomColor: E.challBottom }}>
        <div className="mid">
          <div className="lbl">
            <svg width="12" height="12" viewBox="0 0 24 24" fill={E.gold} aria-hidden="true"><path d="M12 2 L14.8 8.6 L22 9.3 L16.5 14 L18.2 21 L12 17.2 L5.8 21 L7.5 14 L2 9.3 L9.2 8.6 Z" /></svg>
            Today's challenge
          </div>
          <b>Complete a lesson today to keep your streak alive</b>
          <div style={{ height: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 4, marginTop: 9, overflow: 'hidden' }}>
            <div style={{ width: `${challDone * 100}%`, height: '100%', background: E.gold, borderRadius: 4 }} />
          </div>
          <small>{challDone} of 1 done{streak ? ` · ${streak} day streak` : ''}</small>
        </div>
        <span className="xp">+15 XP</span>
      </div>

      {/* 8. Tools - a 2x2 launcher; each opens its own tool screen, none inline */}
      <div className="card">
        <div className="lbl gold">Tools</div>
        <div className="tools-grid">
          {TOOLS.map((t) => (
            <button key={t.id} className="tool" onClick={() => onOpenTool && onOpenTool(t.id)}>
              <span className="ttile" style={{ background: t.tile, fontSize: 20, lineHeight: 1 }} aria-hidden="true">{t.emoji}</span>
              <div><b>{t.name}</b><small>{t.sub}</small></div>
            </button>
          ))}
        </div>
      </div>

      {/* 8. Footer trio */}
      <div className="trio">
        <div className="card pt">
          <div className="lbl teal" style={{ marginBottom: 8 }}>Prayer times{prayer.city ? ` · ${prayer.city}` : ''}</div>
          {prayer.status === 'ok' && prayer.times
            ? ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((nm) => (
                <div className={`row${prayer.next === nm ? ' next' : ''}`} key={nm}><span>{nm}{prayer.next === nm ? ' · next' : ''}</span><span>{prayer.times[nm]}</span></div>
              ))
            : <div className="row"><span style={{ color: E.faint }}>{prayer.status === 'loading' ? 'Finding your times…' : 'Enable location for prayer times'}</span></div>}
        </div>
        <div>
          <div className="card month" style={{ marginBottom: 12 }}>
            <div className="lbl gold">This month</div>
            <b>{hp.month} {hp.year}</b>
            <small>Day {hp.day} of {monthLen}</small>
            <div className="bar" style={{ marginTop: 9 }}><i style={{ width: `${Math.round((hp.day / monthLen) * 100)}%` }} /></div>
          </div>
          <div className="card month">
            <div className="lbl">Coming up</div>
            <b style={{ fontSize: 13 }}>Jumu'ah in {daysToFriday()} day{daysToFriday() === 1 ? '' : 's'}</b>
            <small>{comingApproved ? jumuah.body : 'Friday reminder under scholar review'}</small>
          </div>
        </div>
      </div>

      {/* 9. Bismillah */}
      {bismillah && <div className="bismillah" dir="rtl">{bismillah}</div>}
      <div style={{ height: 20 }} />
    </div>
  );
}
