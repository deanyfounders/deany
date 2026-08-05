// Home (dashboard redesign, benchmark-driven). Layers, top to bottom:
//   hero band (salam + hijri + streak/coins) -> ayah-of-the-day ritual card that
//   overlaps the band -> the Today deck (a horizontal scroll-snap carousel: the
//   personalised plan leads, then vocab-sharpen and just-unlocked-ayah suggestions
//   peek from the right) -> a compact subjects library row -> the weekly streak
//   strip -> the time-aware Jumu'ah card. Every card is wired to real state; every
//   colour is a brand token from tokens.js. No Qur'anic Arabic is authored here -
//   the ayah bank and the verified /quran verse source provide it; this decorates.
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { D, FONT, subjectOf } from '../tokens.js';
import { getActiveTopics, topicProgress, buildTodayPlan } from '../selectors.js';
import { getAyahOfTheDay } from '../../../content/ayahOfTheDay.js';
import { readVocab, missedWords, nextUnderstoodAyah, markAyahShown } from '../vocab.js';
import jumuah from '../../../../content/dashboard/jumuah.json';

const ARABIC = "'Scheherazade New','Amiri',serif";
const SALAM = 'السلام عليكم'; // greeting, not Qur'anic verse text
const SUBJECT_EMOJI = { 'islamic-finance': '\u{1F4B0}', '5-pillars': '\u{1F54C}', 'quran-arabic': '\u{1F4D6}', 'islamic-history': '\u{1F4DC}' };

const hijri = () => {
  try {
    const p = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(new Date());
    const get = (t) => (p.find((x) => x.type === t) || {}).value || '';
    return `${get('day')} ${get('month')} ${get('year')}`;
  } catch (_) { return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(new Date()); }
};
const weekday = () => { try { return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()); } catch (_) { return ''; } };

export default function Home({ name, state, deps, coins, streak, onGoTab, onOpenTopic, onOpenCoreWords, onOpenAyah }) {
  const [ayah] = useState(getAyahOfTheDay);
  const [today] = useState(hijri);
  const [dow] = useState(() => weekday());
  const [tafsir, setTafsir] = useState(false);
  const vocab = useMemo(() => readVocab(), []);

  const plan = useMemo(() => buildTodayPlan(state, deps, vocab, Date.now()), [state, deps, vocab]);
  const missed = useMemo(() => missedWords(vocab, 3), [vocab]);

  // "You can now understand this": pick a fully-covered, not-yet-shown ayah, then
  // load its verse text from the VERIFIED /quran source (never assembled from words).
  const [understood, setUnderstood] = useState(null);
  useEffect(() => {
    const cand = nextUnderstoodAyah(vocab);
    if (!cand) { setUnderstood(null); return; }
    let alive = true;
    fetch(`/quran/surah/${cand.surah}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const ayat = Array.isArray(d) ? d : (d.ayat || []);
        const a = ayat[cand.ayah - 1];
        const text = a && (a.arabic_uthmani || a.arabic);
        if (alive && text) { setUnderstood({ ...cand, arabic: text }); markAyahShown(cand.ref); }
      })
      .catch(() => { /* no verified text -> card stays hidden */ });
    return () => { alive = false; };
  }, [vocab]);

  const startPlan = () => { const first = plan.steps[0]; if (!first) { onGoTab && onGoTab('review'); return; } route(first.route); };
  const route = (r) => {
    if (r === 'corewords') onOpenCoreWords && onOpenCoreWords();
    else if (r === 'review') onGoTab && onGoTab('review');
    else onGoTab && onGoTab('review');
  };

  // Deck slides: the plan always leads; the others appear only when real.
  const slides = [<PlanCard key="plan" plan={plan} onStart={startPlan} onChange={() => onGoTab && onGoTab('review')} />];
  if (missed.length) slides.push(<SharpenCard key="sharpen" words={missed} onRetry={() => onOpenCoreWords && onOpenCoreWords()} />);
  if (understood) slides.push(<UnderstandCard key="understand" data={understood} onRead={() => onOpenAyah && onOpenAyah(understood.surah, understood.ayah)} />);

  const topicIds = getActiveTopics(state);

  return (
    <div style={{ fontFamily: FONT, background: D.canvas, minHeight: '100%' }}>
      <style>{'.deck-scroll::-webkit-scrollbar{display:none}'}</style>

      <Hero streak={streak} coins={coins} date={`${today} · ${dow}`} />

      {/* Ayah ritual card, overlapping the band */}
      <div style={{ padding: '0 20px', marginTop: -30, position: 'relative' }}>
        <div style={{ background: D.card, borderRadius: 18, padding: '16px 18px 14px', boxShadow: '0 8px 20px rgba(15,110,86,0.10)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.tealDeep, marginBottom: 8 }}>Ayah of the day</div>
          <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 24, lineHeight: 1.75, textAlign: 'right', color: D.navy }}>{ayah.arabic}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12, color: D.inkSecondary }}>
            <span>{ayah.surahName} · {ayah.ref}</span>
            <button onClick={() => setTafsir(true)} style={{ ...linkBtn, color: D.tealDeep }}>Read tafsir</button>
          </div>
        </div>
      </div>

      <SectionLabel>Today</SectionLabel>
      <TodayDeck slides={slides} />

      <SectionLabel>Subjects</SectionLabel>
      <div style={{ display: 'flex', gap: 10, padding: '0 20px 8px' }}>
        {topicIds.slice(0, 3).map((id) => <SubjectTile key={id} id={id} prog={topicProgress(id, deps)} onTap={() => onOpenTopic && onOpenTopic(id)} />)}
        {topicIds.length < 4 && <AddTile available={4 - topicIds.length} onTap={() => onGoTab && onGoTab('topics')} />}
      </div>

      <WeekStrip streak={streak} />

      <JumuahCard onOpen={() => onOpenAyah && onOpenAyah(jumuah.surah, 1)} />

      {tafsir && <TafsirSheet ayah={ayah} onClose={() => setTafsir(false)} />}
    </div>
  );
}

/* ---------- hero ---------- */
function Hero({ streak, coins, date }) {
  return (
    <div style={{ position: 'relative', background: `linear-gradient(170deg, ${D.tealDeep}, ${D.teal})`, color: '#fff', padding: 'calc(env(safe-area-inset-top) + 30px) 20px 46px', overflow: 'hidden' }}>
      <svg width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none' }}>
        <defs>
          <pattern id="girih" width="56" height="56" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#FFFFFF" strokeWidth="1">
              <path d="M28 2 L54 28 L28 54 L2 28 Z" />
              <path d="M28 12 L44 28 L28 44 L12 28 Z" />
              <circle cx="28" cy="28" r="4" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih)" />
      </svg>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 34, lineHeight: 1.25 }}>{SALAM}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>{date}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={heroChip}>{'\u{1F525}'} {streak}</span>
          <span style={heroChip}>{'\u{1FA99}'} {coins}</span>
        </div>
      </div>
    </div>
  );
}
const heroChip = { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: '#fff' };

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', margin: '26px 0 12px' }}>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: D.inkSecondary }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: D.border }} />
    </div>
  );
}

/* ---------- the Today deck: scroll-snap carousel + synced dots ---------- */
function TodayDeck({ slides }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const i = Math.round(el.scrollLeft / (el.scrollWidth / slides.length));
    setActive(Math.max(0, Math.min(slides.length - 1, i)));
  };
  return (
    <>
      {/* Each slide is a full viewport wide with the gutter INSIDE it, so the next
          card sits a whole screen away - no peek, one card at a time. */}
      <div ref={ref} onScroll={onScroll} className="deck-scroll"
        style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '4px 0 18px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {slides.map((s, i) => <div key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'center', padding: '0 20px', boxSizing: 'border-box' }}>{s}</div>)}
      </div>
      {slides.length > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '-6px 0 4px' }}>
          {slides.map((_, i) => (
            <i key={i} style={{ width: i === active ? 18 : 6, height: 6, borderRadius: i === active ? 4 : '50%', background: i === active ? D.gold : D.border, transition: 'all 0.2s' }} />
          ))}
        </div>
      )}
    </>
  );
}

// Every deck card fills the slide so all cards are the same height; actions pin to
// the bottom (marginTop:auto) so the buttons line up across cards.
const cardBase = { background: D.card, borderRadius: 20, padding: 18, boxShadow: '0 16px 36px rgba(15,110,86,0.16)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' };
const cardHead = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 };
const goldBtn = { background: D.gold, color: D.navy, border: 'none', borderRadius: 24, padding: '12px 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, boxShadow: `0 2px 0 ${D.streakPill.ink}`, cursor: 'pointer' };
const tealBtn = { background: D.teal, color: '#fff', border: 'none', borderRadius: 24, padding: '12px 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, boxShadow: `0 2px 0 ${D.tealDeep}`, cursor: 'pointer' };
const linkBtn = { background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700 };

/* ---------- plan card (real SRS plan) ---------- */
function PlanCard({ plan, onStart, onChange }) {
  const steps = plan.steps;
  return (
    <div style={{ ...cardBase, borderTop: `3px solid ${D.gold}` }}>
      <div style={cardHead}>
        <b style={{ fontSize: 16, fontWeight: 800 }}>Your plan for today</b>
        <span style={{ fontSize: 12, color: D.inkSecondary, fontWeight: 600 }}>{steps.length ? `${plan.totalMin} min total` : 'all clear'}</span>
      </div>
      {steps.length === 0 ? (
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: D.inkSecondary, margin: '2px 0 6px' }}>Nothing is due and every word is on schedule. Come back later, or explore a subject below.</p>
      ) : steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: i === steps.length - 1 ? 4 : 16 }}>
          {i < steps.length - 1 && <div style={{ position: 'absolute', left: 12, top: 26, bottom: -2, width: 2, background: D.border }} />}
          <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: i === 0 ? D.navy : '#fff', background: i === 0 ? D.gold : D.teal }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 14, display: 'block' }}>{s.title}</b>
            <small style={{ fontSize: 12, color: D.inkSecondary }}>{s.sub}</small>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: D.tealDeep, background: D.coinsPill.bg, borderRadius: 14, padding: '3px 9px', alignSelf: 'flex-start' }}>{s.minutes} min</div>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14 }}>
        <button onClick={onStart} style={goldBtn}>{steps.length ? "Start today's plan" : 'Go to review'}</button>
        {steps.length > 0 && <button onClick={onChange} style={{ ...linkBtn, fontSize: 12, fontWeight: 600, color: D.inkSecondary }}>Change plan</button>}
      </div>
    </div>
  );
}

/* ---------- sharpen these words (real most-missed vocab) ---------- */
function missLabel(n) { return n === 1 ? 'missed once' : n === 2 ? 'missed twice' : `missed ${n} times`; }
function SharpenCard({ words, onRetry }) {
  return (
    <div style={{ ...cardBase, borderTop: `3px solid ${D.history}` }}>
      <div style={cardHead}>
        <b style={{ fontSize: 16, fontWeight: 800 }}>Sharpen these words</b>
        <span style={{ fontSize: 12, color: D.inkSecondary, fontWeight: 600 }}>{words.length} min</span>
      </div>
      <div>
        {words.map((w) => (
          <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${D.border}` }}>
            <span dir="rtl" style={{ fontFamily: ARABIC, fontSize: 22, color: D.navy }}>{w.ar}</span>
            <small style={{ fontSize: 11, color: D.inkSecondary }}>{missLabel(w.miss)}</small>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
        <button onClick={onRetry} style={tealBtn}>Retry these {words.length}</button>
      </div>
    </div>
  );
}

/* ---------- you can now understand this (real coverage + verified verse) ---------- */
function UnderstandCard({ data, onRead }) {
  return (
    <div style={{ ...cardBase, borderTop: `3px solid ${D.teal}` }}>
      <div style={cardHead}>
        <b style={{ fontSize: 16, fontWeight: 800 }}>You can now understand this</b>
        <span style={{ fontSize: 12, color: D.inkSecondary, fontWeight: 600 }}>unlocked</span>
      </div>
      <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 21, lineHeight: 1.75, textAlign: 'right', color: D.navy, marginBottom: 8 }}>{data.arabic}</div>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: D.inkSecondary, margin: 0 }}>Every word in this ayah is now in your deck. {data.surahName || 'Al-Baqarah'} {data.surah}:{data.ayah}, read it cold.</p>
      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
        <button onClick={onRead} style={tealBtn}>Read it in the mushaf</button>
      </div>
    </div>
  );
}

/* ---------- compact subjects row ---------- */
function SubjectTile({ id, prog, onTap }) {
  const s = subjectOf(id);
  const started = prog.done > 0;
  return (
    <button onClick={onTap} className="dash-press" style={{ flex: 1, minWidth: 0, background: D.card, border: `1px solid ${D.border}`, borderRadius: 16, padding: '12px 6px 10px', textAlign: 'center', boxShadow: '0 3px 10px rgba(15,110,86,0.05)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
      <span style={{ width: 44, height: 44, margin: '0 auto 8px', borderRadius: 14, background: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{SUBJECT_EMOJI[id] || (s.short || s.name)[0]}</span>
      <b style={{ fontSize: 11.5, fontWeight: 700, display: 'block', lineHeight: 1.3, color: D.ink }}>{s.short || s.name}</b>
      <small style={{ fontSize: 10, color: D.inkSecondary }}>
        {started ? <><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: D.gold, marginRight: 3 }} />In progress</> : `${prog.total} lesson${prog.total === 1 ? '' : 's'}`}
      </small>
    </button>
  );
}
function AddTile({ available, onTap }) {
  return (
    <button onClick={onTap} className="dash-press" aria-label="Add subject" style={{ flex: 1, minWidth: 0, background: D.card, border: `1px solid ${D.border}`, borderRadius: 16, padding: '12px 6px 10px', textAlign: 'center', boxShadow: '0 3px 10px rgba(15,110,86,0.05)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
      <span style={{ width: 44, height: 44, margin: '0 auto 8px', borderRadius: 14, border: `1.5px dashed ${D.disabled}`, color: D.inkHint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>+</span>
      <b style={{ fontSize: 11.5, fontWeight: 600, display: 'block', lineHeight: 1.3, color: D.inkSecondary }}>Add</b>
      <small style={{ fontSize: 10, color: D.inkSecondary }}>{available} available</small>
    </button>
  );
}

/* ---------- weekly streak strip (derived from streak count + today) ---------- */
const WK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
function WeekStrip({ streak }) {
  const todayDow = new Date().getDay();
  const on = new Set();
  for (let k = 0; k < Math.min(streak, 7); k++) on.add((todayDow - k + 7) % 7);
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ background: D.coinsPill.bg, borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <small style={{ fontSize: 12, color: D.tealDeep, fontWeight: 600 }}>{streak} day streak · keep it going</small>
        <div style={{ display: 'flex', gap: 6 }}>
          {WK.map((d, i) => (
            <span key={i} style={{ width: 22, height: 22, borderRadius: '50%', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: on.has(i) ? '#fff' : D.inkSecondary, background: on.has(i) ? D.teal : '#fff' }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Jumu'ah card ----------
   The religious claim lives in content/dashboard/jumuah.json, tagged
   status:'pending_mehdi'. Per the accuracy covenant a pending container carries no
   authored text, so until Mehdi approves it the card renders "Under scholar review"
   in place of the body. When he sets status:'approved' with a verified `body`, that
   text renders. Only non-religious UI chrome (eyebrow, icon, CTA) is in the code. */
const daysToFriday = () => { const d = (5 - new Date().getDay() + 7) % 7; return d; };
function JumuahCard({ onOpen }) {
  const approved = jumuah.status === 'approved' && (jumuah.body || '').trim();
  const dLeft = daysToFriday();
  const when = dLeft === 0 ? 'today' : dLeft === 1 ? 'tomorrow' : `in ${dLeft} days`;
  return (
    <div style={{ padding: '14px 20px 28px' }}>
      <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 3px 10px rgba(15,110,86,0.05)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: D.streakPill.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>{'\u{1F54C}'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: D.streakPill.ink, marginBottom: 3 }}>Jumu'ah · {when}</div>
          {approved
            ? <div style={{ fontSize: 13.5, lineHeight: 1.45, color: D.ink }}>{jumuah.body}</div>
            : <div style={{ fontSize: 12.5, lineHeight: 1.45, color: D.inkHint, fontStyle: 'italic' }}>Friday reminder · under scholar review</div>}
        </div>
        <button onClick={onOpen} style={{ ...linkBtn, fontSize: 12, fontWeight: 700, color: D.tealDeep, whiteSpace: 'nowrap' }}>Open →</button>
      </div>
    </div>
  );
}

/* ---------- tafsir sheet (portaled over the nav) ---------- */
function TafsirSheet({ ayah, onClose }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Tafsir" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,42,52,0.28)' }} />
      <div style={{ position: 'relative', background: D.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '18px 20px calc(env(safe-area-inset-bottom) + 24px)', maxWidth: 520, margin: '0 auto', width: '100%', maxHeight: '82vh', overflowY: 'auto', boxShadow: '0 -10px 40px rgba(15,26,42,0.18)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: D.border, margin: '0 auto 14px' }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: D.tealDeep, marginBottom: 6 }}>{ayah.surahName} · {ayah.ref}</div>
        <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 23, lineHeight: 1.85, textAlign: 'right', color: D.navy, marginBottom: 12 }}>{ayah.arabic}</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: D.inkSecondary, margin: '0 0 14px' }}>{ayah.tafsirFull || ayah.tafsirLine}</p>
        <div style={{ fontSize: 12, color: D.inkHint }}>{ayah.source}</div>
      </div>
    </div>,
    document.body
  );
}
