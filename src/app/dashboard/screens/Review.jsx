// Review - the analytics screen (deany_review_spec.md; the HTML is the pixel
// reference). Shares the dashboard design system (wash, top bar, base card, nav,
// entrance) via the E tokens. Every number comes from real SRS state or the review
// log; cards hide/degrade honestly when the data does not exist yet. No vocabulary
// word counts. Arabic (needs-attention words, bismillah) comes from real sources.
import React, { useState, useEffect, useMemo } from 'react';
import { E, FONT_LATIN, FONT_SERIF, FONT_AR } from '../tokens.js';
import { getDueReviews } from '../selectors.js';
import { dueSplit, forecast, weekStats, timeOfDay, capabilities, needsAttention } from '../review/analytics.js';

const RV_CSS = `
.rv{
  --bg:${E.bg}; --inset:${E.inset}; --white:${E.card}; --line:${E.line};
  --ink:${E.ink}; --soft:${E.soft}; --faint:${E.faint};
  --gold:${E.gold}; --gold-dark:${E.goldDark}; --gold-tint:${E.goldTint};
  --teal:${E.teal}; --teal-dark:${E.tealDark}; --teal-tint:${E.tealTint};
  --navy:${E.navy}; --history:${E.history}; --history-tint:${E.historyTint};
  font-family:${FONT_LATIN}; background:${E.bg}; color:var(--ink); padding:0 18px; min-height:100%;
}
.rv .hero-wash{ margin:0 -18px; padding:calc(env(safe-area-inset-top) + 14px) 18px 4px; background:radial-gradient(120% 90% at 85% -10%, rgba(240,180,41,0.16), rgba(240,180,41,0) 55%), linear-gradient(180deg, #E2F3EE 0%, rgba(226,243,238,0.55) 55%, rgba(255,255,255,0) 100%); }
.rv .topbar{ display:flex; justify-content:space-between; align-items:center; }
.rv .avatar{ width:36px; height:36px; border-radius:50%; background:#fff; border:1px solid rgba(27,42,74,0.08); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:var(--teal-dark); cursor:pointer; padding:0; }
.rv .stat-chips{ display:flex; gap:7px; }
.rv .schip{ display:flex; align-items:center; gap:5px; background:#fff; border:1px solid rgba(27,42,74,0.08); border-radius:16px; padding:6px 11px; font-size:12px; font-weight:800; box-shadow:0 2px 0 rgba(27,42,74,0.10); cursor:pointer; font-family:inherit; color:var(--ink); }
.rv .schip.streak{ background:var(--gold-tint); border-color:#F0D089; color:var(--gold-dark); }
.rv .head{ text-align:center; padding:16px 0 20px; }
.rv .head h1{ font-family:${FONT_SERIF}; font-size:26px; font-weight:600; }
.rv .head .sub{ font-size:12px; color:var(--faint); margin-top:3px; }
.rv .card{ background:#fff; border:2px solid var(--line); border-bottom-width:4px; border-radius:16px; padding:16px; margin-bottom:14px; transition:transform 0.12s ease; }
.rv .card:active{ transform:scale(0.982); }
.rv .lbl{ font-size:9.5px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:var(--soft); }
.rv .btn{ background:var(--gold); color:var(--ink); border:none; border-radius:14px; padding:12px 20px; font-family:inherit; font-size:13.5px; font-weight:800; cursor:pointer; box-shadow:0 4px 0 ${E.goldEdge}; transition:transform 0.1s; width:100%; }
.rv .btn:active{ transform:translateY(3px); box-shadow:0 1px 0 ${E.goldEdge}; }
.rv .btn.ghost{ background:none; color:#BFF0E8; box-shadow:none; border:1px solid rgba(255,255,255,0.35); }
.rv .btn.ghost:active{ transform:translateY(1px); box-shadow:none; }
.rv .due{ background:linear-gradient(135deg,#27B5A8,#189287); border-color:#178E85; border-bottom-color:#0F6E56; color:#fff; }
.rv .due .lbl{ color:#BFF0E8; }
.rv .due-head{ display:flex; justify-content:space-between; align-items:baseline; margin:4px 0 12px; }
.rv .due-head b{ font-family:${FONT_SERIF}; font-size:20px; font-weight:600; }
.rv .due-head span{ font-size:12px; color:#BFF0E8; font-weight:600; }
.rv .due-split{ display:flex; gap:8px; margin-bottom:14px; }
.rv .due-part{ flex:1; background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.18); border-radius:12px; padding:9px 10px; }
.rv .due-part b{ font-size:17px; font-weight:800; display:block; }
.rv .due-part small{ font-size:9.5px; color:#BFF0E8; }
.rv .stat-row{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:14px; }
.rv .stat{ background:#fff; border:2px solid var(--line); border-bottom-width:4px; border-radius:14px; padding:12px 8px; text-align:center; }
.rv .stat b{ font-size:19px; font-weight:800; color:var(--teal-dark); display:block; }
.rv .stat.gold b{ color:var(--gold-dark); }
.rv .stat small{ font-size:9.5px; color:var(--faint); line-height:1.3; display:block; margin-top:2px; }
.rv .card-head{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px; }
.rv .card-head b{ font-size:14px; font-weight:800; }
.rv .card-head span{ font-size:10.5px; color:var(--faint); font-weight:600; }
.rv .insight{ font-size:12px; line-height:1.55; color:var(--soft); margin-top:10px; }
.rv .insight b{ color:var(--ink); }
.rv .bars{ display:flex; align-items:flex-end; gap:8px; height:64px; }
.rv .bars > div{ flex:1; border-radius:6px 6px 0 0; background:var(--teal-tint); position:relative; }
.rv .bars > div.hi{ background:var(--teal); }
.rv .bars > div.hi::after{ content:''; position:absolute; top:2px; left:3px; right:3px; height:2.5px; border-radius:2px; background:rgba(255,255,255,0.45); }
.rv .bars > div i{ position:absolute; top:-16px; left:0; right:0; text-align:center; font-style:normal; font-size:9.5px; font-weight:800; color:var(--teal-dark); }
.rv .bar-labels{ display:flex; gap:8px; margin-top:6px; }
.rv .bar-labels span{ flex:1; text-align:center; font-size:9.5px; color:var(--faint); font-weight:600; }
.rv .fbars{ display:flex; align-items:flex-end; gap:6px; height:56px; }
.rv .fbars > div{ flex:1; border-radius:5px 5px 0 0; background:var(--gold-tint); position:relative; }
.rv .fbars > div.today{ background:var(--gold); }
.rv .fbars > div.today::after{ content:''; position:absolute; top:2px; left:3px; right:3px; height:2px; border-radius:2px; background:rgba(255,255,255,0.5); }
.rv .fbars > div i{ position:absolute; top:-15px; left:0; right:0; text-align:center; font-style:normal; font-size:9px; font-weight:800; color:var(--gold-dark); }
.rv .fbar-labels{ display:flex; gap:6px; margin-top:6px; }
.rv .fbar-labels span{ flex:1; text-align:center; font-size:9.5px; color:var(--faint); font-weight:600; }
.rv .cap{ display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--line); }
.rv .cap:last-of-type{ border-bottom:none; padding-bottom:2px; }
.rv .cap .ctile{ width:40px; height:40px; border-radius:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1px solid rgba(27,42,74,0.08); box-shadow:0 2px 0 rgba(27,42,74,0.08); }
.rv .cap p{ font-size:13px; font-weight:700; line-height:1.4; }
.rv .cap small{ font-size:10.5px; color:var(--faint); font-weight:600; display:block; margin-top:2px; }
.rv .cap-foot{ margin-top:12px; padding-top:11px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; }
.rv .cap-foot small{ font-size:11px; color:var(--soft); font-weight:600; }
.rv .cap-foot .grow{ font-size:10.5px; font-weight:800; color:var(--gold-dark); background:var(--gold-tint); border:1px solid #F0D089; border-radius:12px; padding:4px 10px; white-space:nowrap; }
.rv .miss{ display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px solid var(--line); cursor:pointer; }
.rv .miss:last-child{ border-bottom:none; padding-bottom:0; }
.rv .miss .l b{ font-size:12.5px; font-weight:800; display:block; }
.rv .miss .l .ar{ font-family:${FONT_AR}; font-size:20px; font-weight:700; }
.rv .miss .tag{ font-size:8.5px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; border-radius:8px; padding:2.5px 7px; display:inline-block; margin-top:2px; }
.rv .miss .n{ font-size:10.5px; font-weight:800; color:var(--history); background:var(--history-tint); border-radius:10px; padding:4px 9px; white-space:nowrap; }
.rv .bismillah{ text-align:center; font-family:${FONT_AR}; font-size:19px; color:var(--gold-dark); padding:14px 0 24px; opacity:0.85; }
@keyframes rvRise{ from{ opacity:0; transform:translateY(14px) scale(0.97);} to{ opacity:1; transform:none;} }
.rv .hero-wash, .rv .card, .rv .stat-row, .rv .bismillah{ animation:rvRise 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
.rv .card.due{ animation-delay:0.05s; } .rv .stat-row{ animation-delay:0.1s; }
@media (prefers-reduced-motion: reduce){ .rv .hero-wash,.rv .card,.rv .stat-row,.rv .bismillah{ animation:none !important; transition:none !important; } }
`;

const CAP_TILE = { 'quran-memorisation': E.tealTint, 'quran-arabic': E.quranTint, 'islamic-finance': E.goldTint, 'islamic-history': E.historyTint };
function CapIcon({ area }) {
  const c = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (area === 'quran-memorisation') return <svg {...c} stroke={E.tealDark}><path d="M12 3 a3 3 0 0 1 3 3 v5 a3 3 0 0 1-6 0 V6 a3 3 0 0 1 3-3 Z" /><path d="M6 11 a6 6 0 0 0 12 0 M12 17 V21" /></svg>;
  if (area === 'quran-arabic') return <svg {...c} stroke={E.navy}><path d="M12 6 Q8 3.5 4 5 V19 Q8 17.5 12 20 Q16 17.5 20 19 V5 Q16 3.5 12 6 Z" /><path d="M12 6 V20" /></svg>;
  if (area === 'islamic-finance') return <svg {...c} stroke={E.goldDark}><path d="M12 4 V20 M6 8 H18" /><path d="M4 14 Q6 17 8 14 L6 9 Z M16 14 Q18 17 20 14 L18 9 Z" /></svg>;
  if (area === 'islamic-history') return <svg {...c} stroke={E.history}><path d="M4 20 H20 M5 20 V10 M9.5 20 V10 M14.5 20 V10 M19 20 V10 M3 10 L12 4 L21 10 Z" /></svg>;
  return <svg {...c} stroke={E.soft}><path d="M4 5 h11 a2 2 0 0 1 2 2 v12 a2 2 0 0 0-2-2 H4 Z" /><path d="M17 7 h3 v14 h-3" /></svg>;
}

export default function Review({ name, streak = 0, coins = 0, state, deps, onGoTab, onSelectLesson, resolveLesson, onOpenCoreWords }) {
  const now = Date.now();
  const [bismillah, setBismillah] = useState('');
  useEffect(() => {
    let alive = true;
    fetch('/quran/surah/1.json').then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => { const a = (Array.isArray(d) ? d : (d.ayat || []))[0]; if (alive && a) setBismillah(a.arabic_uthmani || a.arabic || ''); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const split = useMemo(() => dueSplit(state, deps, now), [state, deps]);
  const wk = useMemo(() => weekStats(state, now), [state]);
  const tod = useMemo(() => timeOfDay(now), []);
  const fc = useMemo(() => forecast(state, now), [state]);
  const caps = useMemo(() => capabilities(now), []);
  const miss = useMemo(() => needsAttention(state, deps, now), [state, deps]);

  const start = () => {
    const d = getDueReviews(state, now);
    if (d[0] && resolveLesson) { const l = resolveLesson(d[0]); if (l && onSelectLesson) { onSelectLesson(l.lesson, l.idx, l.mod); return; } }
    onOpenCoreWords && onOpenCoreWords();
  };
  const openMiss = (m) => {
    if (m.ar) { onOpenCoreWords && onOpenCoreWords(); return; }
    if (m.item && resolveLesson && onSelectLesson) { const l = resolveLesson(m.item); if (l) onSelectLesson(l.lesson, l.idx, l.mod); }
  };

  const fcInsight = () => {
    if (fc.heavy.count === 0) return <>Your next 7 days are clear, nothing is scheduled to come due.</>;
    const heavy = fc.heavy.count > fc.mean * 1.5;
    return <>{fc.heavy.label} is your heaviest day, <b>{fc.heavy.count} review{fc.heavy.count === 1 ? '' : 's'}</b>. {heavy ? 'A short session the evening before will lighten it.' : 'The week looks even.'}</>;
  };

  return (
    <div className="rv">
      <style>{RV_CSS}</style>

      <div className="hero-wash">
        <div className="topbar">
          <button className="avatar" aria-label="Your profile" onClick={() => onGoTab && onGoTab('you')}>{(name || '?').trim().charAt(0).toUpperCase() || '?'}</button>
          <div className="stat-chips">
            <button className="schip streak" aria-label={`${streak} day streak`} onClick={() => onGoTab && onGoTab('you')}>
              <svg width="12" height="14" viewBox="0 0 13 15" fill="none" aria-hidden="true"><path d="M6.5 1C7.5 3.2 10.8 4.6 10.8 8.4c0 2.9-1.9 5.1-4.3 5.1S2.2 11.3 2.2 8.4C2.2 6.7 3 5.5 3.9 4.5c0 1.1.5 1.9 1.3 2.2C4.7 4.5 5.6 2.4 6.5 1Z" fill={E.gold} /></svg>{streak}
            </button>
            <button className="schip" aria-label={`${coins} coins`} onClick={() => onGoTab && onGoTab('you')}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.6" stroke={E.gold} strokeWidth="1.8" /><circle cx="7" cy="7" r="2.4" fill={E.gold} /></svg>{coins}
            </button>
          </div>
        </div>
        <div className="head">
          <h1>Review</h1>
          <div className="sub">Keep what you've learned, permanently</div>
        </div>
      </div>

      {/* 2. due now */}
      <div className="card due">
        <div className="lbl">Due now</div>
        {split.total > 0 ? (
          <>
            <div className="due-head"><b>{split.total} review{split.total === 1 ? '' : 's'} waiting</b><span>about {split.minutes} min</span></div>
            <div className="due-split">
              <div className="due-part"><b>{split.memorisation}</b><small>memorisation</small></div>
              <div className="due-part"><b>{split.rootWords}</b><small>root words</small></div>
              <div className="due-part"><b>{split.lessonPractice}</b><small>lesson practice</small></div>
            </div>
            <button className="btn" onClick={start}>Start reviews</button>
          </>
        ) : (
          <>
            <div className="due-head"><b>Nothing due right now</b></div>
            <div style={{ fontSize: 12, color: '#BFF0E8', margin: '-6px 0 14px' }}>Everything is ahead of schedule</div>
            <button className="btn ghost" onClick={start}>Practice anyway</button>
          </>
        )}
      </div>

      {/* 3. week stats */}
      <div className="stat-row">
        <div className="stat"><b>{wk.reviews}</b><small>reviews this week</small></div>
        <div className="stat"><b>{wk.accuracy}%</b><small>recall accuracy</small></div>
        <div className="stat gold"><b>{wk.mastered}</b><small>items mastered</small></div>
      </div>

      {/* 4. recall by time of day - hidden below the noise floor */}
      {tod && (
        <div className="card">
          <div className="card-head"><b>Recall by time of day</b><span>last 30 days</span></div>
          <div className="bars">
            {tod.bars.map((b) => <div key={b.key} className={b.key === tod.strongest.key ? 'hi' : ''} style={{ height: `${Math.max(6, b.pct)}%` }}><i>{b.pct}</i></div>)}
          </div>
          <div className="bar-labels">{tod.bars.map((b) => <span key={b.key}>{b.key}</span>)}</div>
          <div className="insight">Your recall is strongest at {tod.strongest.key}, <b>{tod.strongest.pct} percent</b> against {tod.weakest.pct} at {tod.weakest.key.toLowerCase()}.</div>
        </div>
      )}

      {/* 5. coming up */}
      <div className="card">
        <div className="card-head"><b>Coming up</b><span>next 7 days</span></div>
        <div className="fbars">
          {fc.days.map((d, i) => <div key={i} className={d.isToday ? 'today' : ''} style={{ height: `${Math.max(6, Math.round((d.count / fc.max) * 100))}%` }}><i>{d.count}</i></div>)}
        </div>
        <div className="fbar-labels">{fc.days.map((d, i) => <span key={i}>{d.label}</span>)}</div>
        <div className="insight">{fcInsight()}</div>
      </div>

      {/* 6. what you know now */}
      <div className="card">
        <div className="card-head"><b>What you know now</b><span>from your reviews</span></div>
        {caps.rows.length > 0 ? (
          <>
            {caps.rows.map((r) => (
              <div className="cap" key={r.id}>
                <span className="ctile" style={{ background: CAP_TILE[r.area] || E.inset }}><CapIcon area={r.area} /></span>
                <div><p>{r.text}</p><small>{r.source}</small></div>
              </div>
            ))}
            <div className="cap-foot">
              <small>Built from everything your reviews show you can recall</small>
              {caps.growth > 0 && <span className="grow">+{caps.growth} this week</span>}
            </div>
          </>
        ) : (
          <div className="cap">
            <span className="ctile" style={{ background: E.inset }}><CapIcon area="book" /></span>
            <div><p>Your first capability is close</p><small>Keep reviewing to unlock what you can recall from memory</small></div>
          </div>
        )}
      </div>

      {/* 7. needs attention - hidden with no recent misses */}
      {miss.length > 0 && (
        <div className="card">
          <div className="card-head"><b>Needs attention</b><span>most missed</span></div>
          {miss.map((m) => (
            <div className="miss" key={m.key} onClick={() => openMiss(m)}>
              <div className="l">
                {m.ar ? <span className="ar" dir="rtl">{m.ar}</span> : <b>{m.name}</b>}
                <span className="tag" style={{ background: m.tag.tint, color: m.tag.tone, marginTop: m.ar ? 4 : 2 }}>{m.tag.label}</span>
              </div>
              <span className="n">{m.note}</span>
            </div>
          ))}
        </div>
      )}

      {/* 8. bismillah */}
      {bismillah && <div className="bismillah" dir="rtl">{bismillah}</div>}
    </div>
  );
}
