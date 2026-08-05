import React, { useState, useEffect, useMemo, useRef } from 'react';
import moduleData from './module1-data.json';

/*
  DEANY root word module - module 1 (Al-Fatihah through the opening of Al-Baqarah)
  Content sourced from: The Easy Dictionary of the Qur'an, Shaikh AbdulKarim Parekh, entries 1-50.

  App integration version. Mobile shell: indigo header with stage distribution, scrollable
  content, flush bottom tab bar (in the layout flow, never floating over content). Content
  lives in module1-data.json, content is data, not code.

  Integration notes:
  - Fonts: injects Plus Jakarta Sans and Scheherazade New from Google Fonts once, idempotent,
    no-op during SSR. If the app already loads these globally, the injection detects nothing
    to do only via its own id, so either remove useFonts() at merge time or keep it, both work.
  - SRS persistence: pass srsAdapter, { getProgress(): object, setProgress(next): void },
    wired to the existing Quran-memorization SRS engine. Without the prop it falls back to
    its own localStorage store (makeLocalStorageAdapter below). Do not ship two independent
    stores side by side.
  - Root and pattern are display metadata only, the word is the SRS unit.
*/

const C = {
  indigo: '#2A2264',
  indigoSoft: '#4A4285',
  gold: '#E0A83E',
  goldDark: '#A97A22',
  goldTint: '#FBF0DC',
  violet: '#5B4FA0',
  violetTint: '#EDEAFA',
  coral: '#DE5A2A',
  coralTint: '#FBE6DD',
  white: '#FFFFFF',
  bg: '#FFFFFF',
  inkSoft: '#6E6795',
  line: '#E7E3F2',
  lineSoft: '#F1EEF8',
};

const LATIN = "'Plus Jakarta Sans', 'Segoe UI', sans-serif";
const ARABIC = "'Scheherazade New', serif";

const STAGES = ['New', 'Learning 1', 'Learning 2', 'Learning 3', 'Learning 4', 'Familiar 1', 'Familiar 2', 'Strong', 'Mastered', 'Complete'];
const INTERVAL_HOURS = [0, 4, 8, 23, 47, 168, 336, 720, 2880, null]; // null = complete, no further reviews
const INTERVAL_LABELS = ['-', '4 hours', '8 hours', '23 hours', '2 days', '1 week', '2 weeks', '1 month', '4 months', 'complete'];
const BATCH_SIZE = 5;

// stage bands for pills and the distribution bar
function band(stage) {
  if (stage === 0) return 'new';
  if (stage < 5) return 'learning';
  if (stage < 7) return 'familiar';
  return 'strong';
}
const BAND_STYLE = {
  new: { bg: '#F1EEF8', fg: '#6E6795', bar: '#E7E3F2' },
  learning: { bg: '#FBF0DC', fg: '#A97A22', bar: '#E0A83E' },
  familiar: { bg: '#EDEAFA', fg: '#5B4FA0', bar: '#5B4FA0' },
  strong: { bg: '#E6E3F4', fg: '#2A2264', bar: '#2A2264' },
};

/* ---------- storage ---------- */
export function makeLocalStorageAdapter(key = 'deany_rootwords_module1_progress_v1') {
  return {
    getProgress: () => {
      try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : {}; }
      catch (e) { return {}; }
    },
    setProgress: (next) => {
      try { window.localStorage.setItem(key, JSON.stringify(next)); } catch (e) { /* unavailable */ }
    },
  };
}
const DEFAULT_ADAPTER = makeLocalStorageAdapter();

/* ---------- data shaping ---------- */
function buildRootsWithIds(roots) {
  return roots.map((r) => ({
    ...r,
    words: r.words.map((w, i) => ({ ...w, id: r.id + '-' + i, rootId: r.id })),
  }));
}
function flattenWords(rootsWithIds) {
  const flat = [];
  rootsWithIds.forEach((r) => { r.words.forEach((w) => flat.push(w)); });
  return flat;
}
function shuffledDifferentOrder(arr) {
  if (arr.length <= 1) return arr.slice();
  let out = arr.slice();
  let attempts = 0;
  do {
    out = out.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
    attempts++;
  } while (attempts < 8 && out.every((w, i) => w.id === arr[i].id));
  return out;
}
function hoursToMs(h) { return h * 3600 * 1000; }

/* ---------- fonts (idempotent, no-op during SSR) ---------- */
function useFonts() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = 'deany-rootwords-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Scheherazade+New:wght@400;700&display=swap';
    document.head.appendChild(link);
  }, []);
}

/* ---------- root component ---------- */
export default function RootWordsModule({ srsAdapter, onExit } = {}) {
  useFonts();
  const getProgress = (srsAdapter && srsAdapter.getProgress) || DEFAULT_ADAPTER.getProgress;
  const persistProgress = (srsAdapter && srsAdapter.setProgress) || DEFAULT_ADAPTER.setProgress;

  const rootsWithIds = useMemo(() => buildRootsWithIds(moduleData.roots), []);
  const flatWords = useMemo(() => flattenWords(rootsWithIds), [rootsWithIds]);
  const rootById = useMemo(() => {
    const m = {};
    rootsWithIds.forEach((r) => { m[r.id] = r; });
    return m;
  }, [rootsWithIds]);

  const [progress, setProgress] = useState(getProgress);
  const [tab, setTab] = useState('words');

  useEffect(() => { persistProgress(progress); }, [progress]);

  function entry(id) { return progress[id] || { stage: 0, dueAt: 0 }; }
  function stageOf(id) { return entry(id).stage; }
  function isLearned(id) { return stageOf(id) > 0; }
  function isDue(id) {
    const e = entry(id);
    return e.stage > 0 && e.stage < 9 && e.dueAt <= Date.now();
  }
  function setStage(id, newStage, missed) {
    const hrs = INTERVAL_HOURS[newStage];
    const dueAt = hrs === null ? Infinity : Date.now() + hoursToMs(hrs);
    // Track misses so the dashboard can surface the learner's weakest words.
    setProgress((prev) => {
      const prevEntry = prev[id] || {};
      return { ...prev, [id]: { stage: newStage, dueAt, miss: (prevEntry.miss || 0) + (missed ? 1 : 0) } };
    });
  }

  const dueCount = useMemo(() => flatWords.filter((w) => isDue(w.id)).length, [flatWords, progress]);
  const dist = useMemo(() => {
    const d = { new: 0, learning: 0, familiar: 0, strong: 0 };
    flatWords.forEach((w) => { d[band(stageOf(w.id))]++; });
    return d;
  }, [flatWords, progress]);

  return (
    <div style={{
      fontFamily: LATIN, background: '#F4F2FA', height: '100%', minHeight: '100vh',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: 430, background: C.bg, height: '100%', minHeight: 0,
        display: 'flex', flexDirection: 'column', color: C.indigo,
      }}>

        <Header dist={dist} total={flatWords.length} onExit={onExit} />

        {/* scrollable content, bottom nav sits below in flow so nothing is ever covered */}
        <TabBar tab={tab} setTab={setTab} dueCount={dueCount} />

        <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 18px calc(env(safe-area-inset-bottom) + 28px)' }}>
          {tab === 'words' && <WordsTab roots={rootsWithIds} stageOf={stageOf} />}
          {tab === 'learn' && (
            <LearnTab flatWords={flatWords} rootById={rootById} stageOf={stageOf} isLearned={isLearned} setStage={setStage} />
          )}
          {tab === 'review' && (
            <ReviewTab flatWords={flatWords} rootById={rootById} entry={entry} isDue={isDue} setStage={setStage} />
          )}
          {tab === 'particles' && <ParticlesTab particles={moduleData.particles} />}
        </main>
      </div>
    </div>
  );
}

/* ---------- header ---------- */
function Header({ dist, total, onExit }) {
  const started = total - dist.new;
  const segs = [
    { key: 'strong', n: dist.strong },
    { key: 'familiar', n: dist.familiar },
    { key: 'learning', n: dist.learning },
    { key: 'new', n: dist.new },
  ];
  return (
    <header style={{ background: C.indigo, color: C.white, padding: 'calc(env(safe-area-inset-top) + 14px) 18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {onExit && (
          <button onClick={onExit} aria-label="Back" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, marginLeft: -6, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.12)', color: C.white, cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        )}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B9B1E4' }}>
          Qur'an memorisation and tafsir
        </div>
      </div>
      <h1 style={{ margin: '2px 0 2px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>Quranic Core Words</h1>
      <div style={{ fontSize: 13, color: '#C9C2E8', marginBottom: 14 }}>
        Module 1 · Al-Fatihah and the opening of Al-Baqarah
      </div>

      {/* stage distribution bar */}
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: C.indigoSoft }}>
        {segs.map((s) => s.n > 0 && (
          <div key={s.key} style={{ flexGrow: s.n, background: s.key === 'new' ? C.indigoSoft : BAND_STYLE[s.key].bar }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#C9C2E8' }}>
        <span>{started} of {total} words started</span>
        <span>{dist.strong + dist.familiar} known</span>
      </div>
    </header>
  );
}

/* ---------- bottom nav, flush ---------- */
function NavIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'words') return (<svg {...common} aria-hidden="true"><path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2z" /><path d="M19 17H6a2 2 0 0 0-2 2" /></svg>);
  if (name === 'learn') return (<svg {...common} aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4v5l3-1.8L15 9V4" /></svg>);
  if (name === 'review') return (<svg {...common} aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 3v6h-6" /></svg>);
  if (name === 'particles') return (<svg {...common} aria-hidden="true"><circle cx="6" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="18" cy="12" r="1.6" /></svg>);
  return null;
}

/* ---------- top tab bar ---------- */
function TabBar({ tab, setTab, dueCount }) {
  const items = [
    { id: 'words', label: 'Words' },
    { id: 'learn', label: 'Learn' },
    { id: 'review', label: 'Review' },
    { id: 'particles', label: 'Particles' },
  ];
  return (
    <nav
      role="tablist"
      aria-label="Root word module sections"
      style={{
        display: 'flex', borderBottom: `1px solid ${C.line}`, background: C.white, flexShrink: 0,
      }}
    >
      {items.map((it) => {
        const active = tab === it.id;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={active}
            aria-label={it.label}
            onClick={() => setTab(it.id)}
            style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 0 9px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: active ? C.indigo : '#9B94BF', fontFamily: LATIN, position: 'relative',
              borderBottom: `2px solid ${active ? C.gold : 'transparent'}`, marginBottom: -1,
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <NavIcon name={it.id} />
              {it.id === 'review' && dueCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, borderRadius: 8,
                  background: C.coral, color: C.white, fontSize: 10, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>{dueCount}</span>
              )}
            </span>
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------- shared pieces ---------- */
function StagePill({ stage }) {
  const s = BAND_STYLE[band(stage)];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
      background: s.bg, color: s.fg, whiteSpace: 'nowrap',
    }}>
      {STAGES[stage]}
    </span>
  );
}

function RootLine({ root }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6,
      fontSize: 12, color: C.inkSoft,
    }}>
      <span dir="rtl" style={{ fontFamily: ARABIC, fontSize: 17 }}>{root.letters}</span>
      <span>{root.translit}, "{root.gloss}"</span>
    </div>
  );
}

/* the signature: a physical card stack for every flashcard moment */
function CardStack({ children }) {
  const ghost = {
    position: 'absolute', left: 10, right: 10, top: 0, bottom: 0,
    background: C.white, border: `1px solid ${C.line}`, borderRadius: 18,
  };
  return (
    <div style={{ position: 'relative', margin: '0 auto', maxWidth: 360 }}>
      <div style={{ ...ghost, transform: 'translateY(14px) rotate(-1.2deg)' }} aria-hidden="true" />
      <div style={{ ...ghost, transform: 'translateY(7px) rotate(0.8deg)' }} aria-hidden="true" />
      <div style={{
        position: 'relative', background: C.white, border: `1px solid ${C.line}`,
        borderRadius: 18, padding: '26px 22px', textAlign: 'center',
        boxShadow: '0 10px 24px rgba(42,34,100,0.08)',
      }}>
        {children}
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}

function GoldButton({ children, style, ...rest }) {
  return (
    <button {...rest} style={{
      background: C.gold, color: C.indigo, border: 'none', borderRadius: 12,
      padding: '12px 22px', fontSize: 14, fontWeight: 700, fontFamily: LATIN, cursor: 'pointer',
      boxShadow: `0 2px 0 ${C.goldDark}`, ...style,
    }}>
      {children}
    </button>
  );
}
function QuietButton({ children, style, ...rest }) {
  return (
    <button {...rest} style={{
      background: 'none', color: C.indigo, border: `1px solid ${C.line}`, borderRadius: 12,
      padding: '12px 22px', fontSize: 14, fontWeight: 600, fontFamily: LATIN, cursor: 'pointer', ...style,
    }}>
      {children}
    </button>
  );
}

function Note({ children }) {
  return (
    <div style={{
      background: C.violetTint, borderRadius: 12, padding: '12px 14px',
      fontSize: 13, lineHeight: 1.5, color: C.violet, marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

/* ---------- words tab ---------- */
function sectionOf(ref) {
  if (ref.indexOf('Isti') === 0) return 'istiadhah';
  if (ref.indexOf('1:') === 0) return 'fatihah';
  return 'baqarah';
}
const SECTIONS = [
  { id: 'istiadhah', name: "Isti'adhah", detail: 'Seeking refuge, before recitation' },
  { id: 'fatihah', name: 'Al-Fatihah', detail: 'Surah 1, the Opening' },
  { id: 'baqarah', name: 'Al-Baqarah 2:1 to 2:4', detail: 'Surah 2, opening ayat' },
];

function WordsTab({ roots, stageOf }) {
  const [openSection, setOpenSection] = useState(null);
  const [openId, setOpenId] = useState(null);

  const grouped = useMemo(() => {
    const g = { istiadhah: [], fatihah: [], baqarah: [] };
    roots.forEach((r) => { g[sectionOf(r.words[0].ref)].push(r); });
    return g;
  }, [roots]);

  return (
    <div>
      <Note>
        29 root families behind this module's 32 words, grouped by where they appear.
        Open a passage, then tap a family to see every word built from it.
      </Note>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SECTIONS.map((sec) => {
          const secRoots = grouped[sec.id];
          const wordCount = secRoots.reduce((n, r) => n + r.words.length, 0);
          const startedCount = secRoots.reduce((n, r) => n + r.words.filter((w) => stageOf(w.id) > 0).length, 0);
          const open = openSection === sec.id;
          return (
            <div key={sec.id} style={{ border: `1px solid ${open ? C.violet : C.line}`, borderRadius: 14, overflow: 'hidden' }}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={open}
                onClick={() => { setOpenSection(open ? null : sec.id); setOpenId(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setOpenSection(open ? null : sec.id); setOpenId(null); } }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                  cursor: 'pointer', background: open ? '#FBFAFE' : C.white,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{sec.name}</div>
                  <div style={{ fontSize: 12, color: C.inkSoft }}>{sec.detail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: startedCount > 0 ? C.goldDark : C.inkSoft }}>
                    {startedCount} of {wordCount}
                  </div>
                  <div style={{ fontSize: 11, color: C.inkSoft }}>started</div>
                </div>
                <Chevron open={open} />
              </div>
              {open && (
                <div style={{ borderTop: `1px solid ${C.lineSoft}`, padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {secRoots.map((r) => (
                    <FamilyRow
                      key={r.id}
                      root={r}
                      stageOf={stageOf}
                      open={openId === r.id}
                      onToggle={() => setOpenId(openId === r.id ? null : r.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, fontSize: 11, lineHeight: 1.5, color: C.inkSoft, textAlign: 'center' }}>
        Word meanings from <em>The Easy Dictionary of the Qur'an</em>, Shaikh AbdulKarim Parekh.
      </div>
    </div>
  );
}

function Chevron({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ color: C.inkSoft, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function FamilyRow({ root, stageOf, open, onToggle }) {
  const primary = root.words[0];
  const extra = root.words.length - 1;
  return (
    <div style={{ border: `1px solid ${open ? C.violet : C.lineSoft}`, borderRadius: 12, overflow: 'hidden', background: C.white }}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'pointer' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{primary.gloss}</div>
          <div style={{ fontSize: 12, color: C.inkSoft }}>
            {primary.translit}{extra > 0 ? ` · +${extra} more from this root` : ''}
          </div>
        </div>
        <StagePill stage={stageOf(primary.id)} />
        <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 26, fontWeight: 700, color: C.indigo, lineHeight: 1.1 }}>
          {primary.ar}
        </div>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.lineSoft}`, background: '#FBFAFE', padding: '4px 12px' }}>
          <div style={{ padding: '10px 0 6px' }}><RootLine root={root} /></div>
          {root.words.map((w) => (
            <div key={w.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderTop: `1px solid ${C.lineSoft}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{w.gloss} <span style={{ color: C.inkSoft, fontWeight: 400 }}>({w.ref})</span></div>
                <div style={{ fontSize: 11, color: C.inkSoft }}>{w.pattern}</div>
              </div>
              <StagePill stage={stageOf(w.id)} />
              <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 21, color: C.indigo }}>{w.ar}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- learn tab ---------- */
function LearnTab({ flatWords, rootById, stageOf, isLearned, setStage }) {
  const unlearned = useMemo(() => flatWords.filter((w) => stageOf(w.id) === 0), [flatWords, stageOf]);
  const [queue, setQueue] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | teach | transition | quiz
  const [idx, setIdx] = useState(0);
  const [quizOrder, setQuizOrder] = useState([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  // hooks run unconditionally, every render, in the same order
  const currentQuizWord = phase === 'quiz' && idx < quizOrder.length ? quizOrder[idx] : null;
  const options = useMemo(() => {
    if (!currentQuizWord) return [];
    const distractors = flatWords
      .filter((x) => x.id !== currentQuizWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => x.gloss);
    return [currentQuizWord.gloss, ...distractors].sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuizWord && currentQuizWord.id]);

  function startBatch() {
    setQueue(unlearned.slice(0, BATCH_SIZE));
    setPhase('teach');
    setIdx(0);
    setScore(0);
  }

  if (phase === 'idle') {
    if (unlearned.length === 0) {
      return <Empty title="All words started" body="Head to Review to keep them moving up the schedule." />;
    }
    return (
      <CardStack>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{unlearned.length} new words waiting</div>
        <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, margin: '0 0 16px' }}>
          You'll see all 5 words first, then get checked on all 5 in a shuffled order,
          never right after seeing the card. The real test comes later, in Review.
        </p>
        <GoldButton onClick={startBatch}>Start batch ({Math.min(BATCH_SIZE, unlearned.length)} words)</GoldButton>
      </CardStack>
    );
  }

  if (phase === 'teach') {
    const w = queue[idx];
    const root = rootById[w.rootId];
    const siblingsLearned = root.words.filter((x) => x.id !== w.id && isLearned(x.id));
    return (
      <div>
        <StepMeter label="Teaching" step={idx + 1} total={queue.length} half="first" />
        <CardStack>
          <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 46, fontWeight: 700, color: C.indigo, lineHeight: 1.2 }}>{w.ar}</div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10 }}>{w.translit}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{w.gloss}</div>
          <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 12 }}>{w.ref} · {w.pattern}</div>
          <div style={{ borderTop: `1px dashed ${C.line}`, paddingTop: 10, marginBottom: 4 }}>
            <RootLine root={root} />
          </div>
          {siblingsLearned.map((s) => (
            <div key={s.id} style={{ fontSize: 12, color: C.inkSoft, marginTop: 6 }}>
              <span dir="rtl" style={{ fontFamily: ARABIC, fontSize: 17, color: C.indigo }}>{s.ar}</span> {s.translit} is already in your reviews, same root
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <GoldButton onClick={() => (idx + 1 < queue.length ? setIdx(idx + 1) : setPhase('transition'))}>
              {idx + 1 < queue.length ? 'Next word' : 'All 5 seen'}
            </GoldButton>
          </div>
        </CardStack>
      </div>
    );
  }

  if (phase === 'transition') {
    return (
      <CardStack>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Now the check</div>
        <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, margin: '0 0 16px' }}>
          Same 5 words, shuffled, no definitions on screen. This shows what actually stuck.
        </p>
        <GoldButton onClick={() => { setQuizOrder(shuffledDifferentOrder(queue)); setIdx(0); setPhase('quiz'); }}>
          Start check
        </GoldButton>
      </CardStack>
    );
  }

  // quiz
  if (idx >= quizOrder.length) {
    return (
      <CardStack>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Batch complete, {score} of {quizOrder.length} correct</div>
        <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, margin: '0 0 16px' }}>
          These words enter Learning 1. The next real test is in a few hours, in Review.
        </p>
        <GoldButton onClick={() => setPhase('idle')}>Continue</GoldButton>
      </CardStack>
    );
  }
  const w = currentQuizWord;

  function pick(opt) {
    if (answered) return;
    setAnswered(opt);
    const correct = opt === w.gloss;
    setStage(w.id, 1);
    if (correct) setScore((s) => s + 1);
    timeoutRef.current = setTimeout(() => { setAnswered(null); setIdx((i) => i + 1); }, 700);
  }

  return (
    <div>
      <StepMeter label="Checking" step={idx + 1} total={quizOrder.length} half="second" />
      <CardStack>
        <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 46, fontWeight: 700, color: C.indigo, lineHeight: 1.2 }}>{w.ar}</div>
        <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 14 }}>{w.translit}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map((o) => {
            const isCorrect = o === w.gloss;
            const show = answered != null;
            let bg = C.white, border = C.line;
            if (show && isCorrect) { bg = C.goldTint; border = C.gold; }
            if (show && answered === o && !isCorrect) { bg = C.coralTint; border = C.coral; }
            return (
              <button
                key={o}
                disabled={show}
                onClick={() => pick(o)}
                className="text-left"
                style={{
                  background: bg, border: `1px solid ${border}`, borderRadius: 12,
                  padding: '12px 14px', fontSize: 14, fontWeight: 500, fontFamily: LATIN,
                  textAlign: 'left', cursor: show ? 'default' : 'pointer', color: C.indigo,
                }}
              >
                {o}
              </button>
            );
          })}
        </div>
      </CardStack>
    </div>
  );
}

function StepMeter({ label, step, total, half }) {
  const base = half === 'second' ? 50 : 0;
  const pct = base + Math.round(((step - 1) / total) * 50);
  return (
    <div style={{ maxWidth: 360, margin: '0 auto 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.inkSoft, marginBottom: 6 }}>
        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span>{step} of {total}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: C.lineSoft, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: C.gold, transition: 'width 0.2s' }} />
      </div>
    </div>
  );
}

/* ---------- review tab ---------- */
function ReviewTab({ flatWords, rootById, entry, isDue, setStage }) {
  const dueWords = useMemo(() => flatWords.filter((w) => isDue(w.id)), [flatWords, entry]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setIdx(0); setCorrect(0); setRevealed(false); }, [dueWords.length]);

  const anyLearned = flatWords.some((w) => entry(w.id).stage > 0);

  if (!anyLearned) {
    return <Empty title="Nothing started yet" body="Visit Learn to bring words into the review schedule." />;
  }
  if (dueWords.length === 0) {
    return (
      <div>
        <Note>
          Review only shows words whose wait time has passed. Each correct answer pushes a
          word further out, 4 hours, then 8, up to 4 months, a miss brings it back sooner.
        </Note>
        <Empty title="Nothing due right now" body="Everything you know is ahead of schedule. Come back when a word's wait has passed." />
      </div>
    );
  }
  if (idx >= dueWords.length) {
    return (
      <CardStack>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Session complete, {correct} of {dueWords.length} correct</div>
      </CardStack>
    );
  }

  const w = dueWords[idx];
  const root = rootById[w.rootId];
  const stage = entry(w.id).stage;
  const onCorrect = Math.min(stage + 1, 9);
  const onWrong = Math.max(stage - 2, 1);

  function grade(ok) {
    setStage(w.id, ok ? onCorrect : onWrong, !ok);
    if (ok) setCorrect((c) => c + 1);
    setIdx((i) => i + 1);
    setRevealed(false);
  }

  return (
    <div>
      <div style={{ maxWidth: 360, margin: '0 auto 14px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.inkSoft }}>
        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Review</span>
        <span>{idx + 1} of {dueWords.length} · {STAGES[stage]}</span>
      </div>
      <CardStack>
        <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 46, fontWeight: 700, color: C.indigo, lineHeight: 1.2 }}>{w.ar}</div>
        <div style={{ fontSize: 13, color: C.inkSoft }}>{w.translit}</div>
        {!revealed && (
          <div style={{ marginTop: 18 }}>
            <GoldButton onClick={() => setRevealed(true)}>Show answer</GoldButton>
          </div>
        )}
        {revealed && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.lineSoft}` }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{w.gloss}</div>
            <RootLine root={root} />
            <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 10, lineHeight: 1.6 }}>
              Right, {STAGES[onCorrect]}, next in {INTERVAL_LABELS[onCorrect]}<br />
              Missed, {STAGES[onWrong]}, next in {INTERVAL_LABELS[onWrong]}
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <GoldButton onClick={() => grade(true)}>Got it</GoldButton>
              <QuietButton onClick={() => grade(false)}>Missed it</QuietButton>
            </div>
          </div>
        )}
      </CardStack>
    </div>
  );
}

/* ---------- particles tab ---------- */
function ParticlesTab({ particles }) {
  return (
    <div>
      <Note>
        14 words with no root, prepositions, pronouns, demonstratives. A small closed set,
        kept as a reference list instead of running through the review schedule.
      </Note>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {particles.map((p, i) => (
          <div key={i} style={{
            border: `1px solid ${C.line}`, borderRadius: 12, padding: '10px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: C.white,
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{p.gloss}</div>
              <div style={{ fontSize: 11, color: C.inkSoft }}>{p.translit}</div>
            </div>
            <span dir="rtl" style={{ fontFamily: ARABIC, fontSize: 22, color: C.indigo }}>{p.ar}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- empty state ---------- */
function Empty({ title, body }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: C.inkSoft }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.indigo, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}
