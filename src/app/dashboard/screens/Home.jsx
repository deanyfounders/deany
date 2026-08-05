// Home - editorial dashboard (deany_dashboard_spec.md; the HTML is the pixel
// reference). One card vocabulary, chunky 4px bottom borders, spring entrance.
// The mock's CSS is ported into a scoped stylesheet (.ed) driven by the shared E
// tokens; every visible value is wired to real state or a live service. No Qur'anic
// Arabic is authored here - the verse comes from the ayah source and the bismillah
// from the verified /quran source; this decorates only.
import React, { useState, useEffect, useMemo } from 'react';
import { E, FONT_LATIN, FONT_SERIF, FONT_AR, subjectOf } from '../tokens.js';
import { getActiveTopics, topicProgress, getContinueTarget, getDueReviews } from '../selectors.js';
import { catalogById } from '../catalog.js';
import { getAyahOfTheDay } from '../../../content/ayahOfTheDay.js';
import { useNisab } from '../services/nisab.js';
import { usePrayerTimes } from '../services/prayerTimes.js';
import jumuah from '../../../../content/dashboard/jumuah.json';
import zakatMethodology from '../../../../content/dashboard/zakat-methodology.json';
import pillarsArt from '../../../assets/topics/5-pillars.png';
import financeArt from '../../../assets/topics/islamic-finance.png';
import quranArt from '../../../assets/topics/quran-arabic.png';
import historyArt from '../../../assets/topics/islamic-history.png';

const SALAM = 'السلام عليكم'; // greeting, not Qur'anic verse text
const minsOf = (d) => { const n = parseInt(String(d || '').replace(/[^0-9]/g, ''), 10); return Number.isFinite(n) && n > 0 ? n : 5; };

// Path identity (spec section 4): tile tint, badge fill, bar + percent colour, art.
const PATHS = [
  { id: '5-pillars', tile: E.tealTint, badge: E.teal, badgeInk: '#fff', bar: E.teal, pct: E.tealDark, art: pillarsArt },
  { id: 'islamic-finance', tile: E.goldTint, badge: E.gold, badgeInk: E.ink, bar: E.gold, pct: E.goldDark, art: financeArt },
  { id: 'quran-arabic', tile: E.quranTint, badge: E.navy, badgeInk: '#fff', bar: E.navy, pct: E.navy, art: quranArt },
  { id: 'islamic-history', tile: E.historyTint, badge: E.history, badgeInk: '#fff', bar: E.history, pct: E.history, art: historyArt },
];
const DIFF = (tier) => (tier >= 3 ? 'Advanced' : tier === 2 ? 'Intermediate' : 'Beginner');

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
.ed .card{ background:var(--white); border:2px solid var(--line); border-bottom-width:4px; border-radius:16px; padding:16px; margin-bottom:14px; transition:transform 0.12s ease; }
.ed .card:active{ transform:scale(0.982); }
.ed .lbl{ font-size:9.5px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:var(--soft); }
.ed .lbl.gold{ color:var(--gold-dark); } .ed .lbl.teal{ color:var(--teal-dark); }
.ed .head{ text-align:center; padding:52px 0 20px; }
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
.ed .bar{ height:7px; background:#F1EFE9; border-radius:2px; margin-top:11px; overflow:hidden; }
.ed .bar i{ display:block; height:100%; background:var(--gold); border-radius:4px; position:relative; overflow:hidden; }
.ed .bar i::after{ content:''; position:absolute; top:1.5px; left:3px; right:3px; height:2px; border-radius:2px; background:rgba(255,255,255,0.45); }
.ed .pct{ font-size:9.5px; color:var(--faint); text-align:right; margin-top:4px; }
.ed .xp-row{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.ed .ring-card{ text-align:center; padding:16px 12px; margin-bottom:0; }
.ed .ring{ position:relative; width:84px; height:84px; margin:6px auto 8px; }
.ed .ring svg{ transform:rotate(-90deg); }
.ed .ring svg circle:last-child{ filter:drop-shadow(0 0 5px rgba(240,180,41,0.55)); }
.ed .ring .n{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.ed .ring .n b{ font-size:18px; font-weight:800; }
.ed .ring .n small{ font-size:8.5px; color:var(--faint); text-transform:uppercase; letter-spacing:0.08em; }
.ed .ring-card p{ font-size:10.5px; color:var(--faint); line-height:1.45; }
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
.ed .zk p.help{ font-size:11.5px; color:var(--soft); line-height:1.55; margin:8px 0 12px; }
.ed .zk .field{ display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:10px; padding:11px 12px; background:var(--inset); }
.ed .zk .field span{ color:var(--faint); font-weight:700; }
.ed .zk input{ border:none; background:none; outline:none; font-family:inherit; font-size:14px; flex:1; color:var(--ink); min-width:0; }
.ed .zk .grid3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:12px; }
.ed .zk .cell{ background:var(--inset); border:1px solid var(--line); border-radius:10px; padding:10px; text-align:center; }
.ed .zk .cell small{ font-size:8.5px; color:var(--faint); text-transform:uppercase; letter-spacing:0.08em; display:block; }
.ed .zk .cell b{ font-size:14px; font-weight:800; display:block; margin-top:3px; }
.ed .zk .cell i{ font-style:normal; font-size:8.5px; color:var(--faint); }
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
.ed .head, .ed .card, .ed .sect, .ed .paths, .ed .xp-row, .ed .trio, .ed .bismillah{ animation:edRise 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
.ed .card.cont{ animation-delay:0.05s; } .ed .sect{ animation-delay:0.1s; } .ed .paths{ animation-delay:0.12s; }
.ed .xp-row{ animation-delay:0.18s; } .ed .trio{ animation-delay:0.24s; }
@media (prefers-reduced-motion: reduce){ .ed .head,.ed .card,.ed .sect,.ed .paths,.ed .xp-row,.ed .trio,.ed .bismillah,.ed .btn,.ed .chip{ animation:none !important; transition:none !important; } }
`;

export default function Home({ name, state, deps, coins, streak, onGoTab, onOpenTopic, onOpenAyah, onSelectLesson }) {
  const [ayah] = useState(getAyahOfTheDay);
  const [dateLine] = useState(() => { const h = hijriParts(new Date()); return `${weekday()} · ${h.day} ${h.month} ${h.year}`; });
  const [bismillah, setBismillah] = useState('');
  const [portfolio, setPortfolio] = useState('');

  // Bismillah from the verified /quran source (surah 1, ayah 1) - never typed here.
  useEffect(() => {
    let alive = true;
    fetch('/quran/surah/1.json').then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => {
      const ayat = Array.isArray(d) ? d : (d.ayat || []); const a = ayat[0];
      if (alive && a) setBismillah(a.arabic_uthmani || a.arabic || '');
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const nisab = useNisab();
  const prayer = usePrayerTimes();

  // Continue-learning target (real current lesson, else first lesson of a path).
  const ct = useMemo(() => getContinueTarget(state, deps, Date.now()), [state, deps]);
  const contId = ct.type === 'lesson' ? ct.topicId : (getActiveTopics(state)[0] || PATHS[0].id);
  const cprog = contId ? topicProgress(contId, deps) : null;
  const cnext = cprog && cprog.next;
  const cStarted = cprog && cprog.done > 0;

  const hp = hijriParts(new Date());
  const monthLen = useMemo(() => hijriMonthLen(new Date()), []);
  const due = getDueReviews(state, Date.now());

  // XP ring from the real daily-study goal (minutes the user set / did today).
  const earned = state.goal?.minutesToday || 0;
  const goal = state.goal?.dailyMinutes || 5;
  const CIRC = 207; // 2*pi*33
  const ringOffset = CIRC * (1 - Math.min(1, goal ? earned / goal : 0));

  // Challenge from a real signal: any study today keeps the streak alive.
  const challDone = earned > 0 ? 1 : 0;

  const zPortfolio = parseFloat(portfolio) || 0;
  const zDue = nisab.nisab && zPortfolio >= nisab.nisab ? zPortfolio * 0.025 : 0;
  const fmt$ = (n) => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });

  const nextLesson = () => { if (cnext) onSelectLesson && onSelectLesson(cnext.lesson, cnext.idx, cnext.mod); else if (contId) onOpenTopic && onOpenTopic(contId); };
  const openReader = () => { const [s, a] = String(ayah.ref).split(':'); onOpenAyah && onOpenAyah(parseInt(s, 10), parseInt(a, 10)); };

  const zakatApproved = zakatMethodology.status === 'approved' && (zakatMethodology.help || '').trim();
  const comingApproved = jumuah.status === 'approved' && (jumuah.body || '').trim();

  return (
    <div className="ed">
      <style>{ED_CSS}</style>

      {/* 1. Header */}
      <div className="head">
        <div className="salam" dir="rtl">{SALAM}</div>
        <h1>Hello {name || 'friend'}</h1>
        <div className="date">{dateLine}</div>
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
          <div className="chip" onClick={openReader} style={{ background: E.teal, borderColor: E.teal, color: '#fff' }}>
            <svg width="10" height="11" viewBox="0 0 11 12" fill="none" aria-hidden="true"><path d="M1.5 1.5 L10 6 L1.5 10.5 Z" fill="#fff" /></svg>
            Recite
          </div>
          <div className="chip" onClick={openReader} style={{ background: E.goldTint, borderColor: '#F0D089', color: E.goldDark }}>Tafseer</div>
        </div>
      </div>

      {/* 4. Learning paths */}
      <div className="sect"><h3>Learning paths</h3></div>
      <div className="paths">
        {PATHS.map((p) => {
          const s = subjectOf(p.id);
          const prog = topicProgress(p.id, deps);
          const tier = (state.topics?.[p.id]?.tier) || 1;
          const started = prog.done > 0;
          return (
            <div className="card path" key={p.id} onClick={() => onOpenTopic && onOpenTopic(p.id)}>
              <div className="top">
                <span className="ptile" style={{ background: p.tile }}><img src={p.art} alt="" aria-hidden="true" /></span>
                <span className="badge" style={{ background: p.badge, color: p.badgeInk }}>{DIFF(tier)}</span>
              </div>
              <h4>{s.name}</h4>
              <p>{(catalogById(p.id) || {}).desc || `${prog.total} lesson${prog.total === 1 ? '' : 's'}`}</p>
              <div className="bar"><i style={{ width: `${prog.pct}%`, background: p.bar }} /></div>
              {started
                ? <div className="pct" style={{ color: p.pct }}>{prog.pct}%</div>
                : <div className="pct" style={{ color: p.pct }}>{prog.next ? `Start with ${prog.next.lesson.title}` : 'Not started'}</div>}
            </div>
          );
        })}
      </div>

      <div style={{ height: 14 }} />

      {/* 5. XP row */}
      <div className="xp-row">
        <div className="card ring-card">
          <div className="ring">
            <svg width="84" height="84" viewBox="0 0 76 76">
              <circle cx="38" cy="38" r="33" fill="none" stroke="#F1EFE9" strokeWidth="9" />
              <circle cx="38" cy="38" r="33" fill="none" stroke={E.gold} strokeWidth="9" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={ringOffset} />
            </svg>
            <div className="n"><b>{earned}</b><small>of {goal} min</small></div>
          </div>
          <p>Your first lesson today fills this ring</p>
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

      {/* 7. Zakat calculator */}
      <div className="card zk">
        <div className="lbl gold">Zakat calculator · Stocks</div>
        <p className="help">{zakatApproved ? zakatMethodology.help : 'Methodology under scholar review.'}</p>
        <div className="field">
          <span>$</span>
          <input type="number" inputMode="decimal" placeholder="0.00" aria-label="Portfolio value" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
        </div>
        <div className="grid3">
          <div className="cell"><small>Portfolio</small><b>{fmt$(zPortfolio)}</b></div>
          <div className="cell" style={{ background: E.tealTint }}><small style={{ color: E.tealDark }}>Zakat due</small><b style={{ color: E.tealDark }}>{fmt$(zDue)}</b></div>
          <div className="cell" style={{ background: E.goldTint }}><small style={{ color: E.goldDark }}>Nisab</small><b style={{ color: E.goldDark }}>{nisab.nisab ? fmt$(nisab.nisab) : (nisab.loading ? '…' : '—')}</b><i>live gold rate</i></div>
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
