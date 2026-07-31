// Home - a horizontal carousel of topics (carousel spec, 30 Jul 2026, supersedes
// the earlier notes). The top half SWIPES; the bottom half does not. Only the
// TopicBand is inside the scroll track - the lesson card and CTA are STATIC and
// swap contents on slide change, so Continue never moves. The full topic list
// lives only in the Topics tab. Only the track scrolls sideways (the shell is
// overflow-x hidden), so the two gestures never fight.
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Plus, Flame, RefreshCw, Lock } from 'lucide-react';
import { D, TYPE, subjectOf, carouselAccent } from '../tokens.js';
import { buildTopicSlide, getActiveTopics, getContinueTarget, getDueReviews } from '../selectors.js';
import TopicArt from '../topicArt.jsx';
import { getAyahOfTheDay } from '../../../content/ayahOfTheDay.js';

const ALL_TOPICS = ['quran-arabic', 'islamic-history', 'islamic-finance', '5-pillars'];
const PAIRING = {
  'quran-arabic': 'The foundation for every topic',
  'islamic-history': 'Pairs with your Qur’an reading',
  'islamic-finance': 'Grounds everyday money decisions',
  '5-pillars': 'Where most learners begin',
};
const BAND = 208; // fixed illustration band height - load-bearing (spec section 2)

export default function Home({ name, state, deps, coins, streak, onOpenTopic, onGoTab, onSelectLesson }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [ayah] = useState(getAyahOfTheDay);

  const topicIds = getActiveTopics(state);
  const slides = useMemo(() => topicIds.map((id) => ({ ...buildTopicSlide(id, state, deps), name: subjectOf(id).name })), [topicIds.join(','), deps]);
  const activeTopicId = useMemo(() => { const t = getContinueTarget(state, deps, Date.now()); return t.type === 'lesson' ? t.topicId : (topicIds[0] || null); }, [topicIds.join(','), deps]);
  const addIndex = slides.length;
  const zero = slides.length === 0;
  const due = getDueReviews(state, Date.now()).length;
  const available = ALL_TOPICS.filter((id) => !topicIds.includes(id));

  useLayoutEffect(() => {
    const el = trackRef.current; if (!el) return;
    const i = slides.findIndex((s) => s.id === activeTopicId);
    if (i > 0) { el.scrollLeft = el.clientWidth * i; setActive(i); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopicId, slides.length]);

  useLayoutEffect(() => {
    const root = trackRef.current; if (!root) return;
    const io = new IntersectionObserver((entries) => { const hit = entries.find((e) => e.isIntersecting); if (hit) setActive(Number(hit.target.dataset.index)); }, { root, threshold: 0.6 });
    root.querySelectorAll('[data-index]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slides.length]);

  const goSlide = (i) => { const el = trackRef.current; if (!el) return; const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; el.scrollTo({ left: el.clientWidth * i, behavior: smooth ? 'smooth' : 'auto' }); };
  const activeSlide = active < slides.length ? slides[active] : null; // null = add-topic

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', background: '#fff' }}>
      <style>{`.deany-carousel::-webkit-scrollbar{display:none}@media (prefers-reduced-motion: reduce){.deany-carousel{scroll-behavior:auto}}@keyframes deanyCardIn{from{opacity:0}to{opacity:1}}`}</style>

      {/* TopRow - static: greeting + streak + practice chips */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(env(safe-area-inset-top) + 16px) 16px 0' }}>
        <div style={{ flex: 1, minWidth: 0, fontSize: 18, fontWeight: 600, color: D.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name ? `Salam, ${name}` : 'Salam'} <span style={{ fontSize: 16 }}>{'\u{1F44B}'}</span></div>
        <Chip icon={Flame} value={streak} bg={D.streakPill.bg} border={D.streakPill.border} ink={D.streakPill.ink} />
        <button onClick={() => onGoTab('review')} className="dash-press" aria-label={`Practice, ${due} due`} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
          <Chip icon={RefreshCw} value={due} bg={D.coinsPill.bg} border={D.coinsPill.border} ink={D.coinsPill.ink} />
        </button>
      </div>

      {/* CarouselTrack - the only horizontal scroller */}
      <div ref={trackRef} className="deany-carousel" role="region" aria-roledescription="carousel" aria-label="Your topics. Swipe, or open the Topics tab for the full list."
        style={{ flexShrink: 0, display: 'flex', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain', touchAction: 'pan-x', scrollbarWidth: 'none', marginTop: 8 }}>
        {slides.map((s, i) => (
          <section key={s.id} data-index={i} aria-label={`${s.name}, level ${s.level}`} style={{ scrollSnapAlign: 'center', flexShrink: 0, flexBasis: '100%', minWidth: 0 }}>
            <TopicBand slide={s} prev={topicIds[i - 1] || null} next={topicIds[i + 1] || 'add-topic'} onOpenTopic={onOpenTopic} />
          </section>
        ))}
        <section data-index={addIndex} aria-label="Add a topic" style={{ scrollSnapAlign: 'center', flexShrink: 0, flexBasis: '100%', minWidth: 0 }}>
          <AddBand available={available} prev={topicIds[topicIds.length - 1] || null} />
        </section>
      </div>

      {/* PageDots - static, real buttons */}
      {!zero && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0 6px' }}>
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => goSlide(i)} aria-label={`Go to ${s.name}`} aria-current={active === i}
              style={{ width: active === i ? 22 : 8, height: 8, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer', background: active === i ? carouselAccent(s.id).base : D.border, transition: 'width .2s ease, background .2s ease' }} />
          ))}
          <button onClick={() => goSlide(addIndex)} aria-label="Add a topic"
            style={{ width: 16, height: 16, marginLeft: 2, borderRadius: 999, border: `1.5px solid ${active === addIndex ? carouselAccent('add-topic').base : D.inkFaint}`, background: active === addIndex ? carouselAccent('add-topic').base : 'transparent', color: active === addIndex ? '#fff' : D.inkFaint, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <Plus size={11} strokeWidth={2.6} />
          </button>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 6 }} />

      {/* LessonCard - STATIC, content fades on slide change (spec section 1) */}
      <div style={{ flexShrink: 0, padding: '0 16px' }}>
        <div key={active} style={{ animation: 'deanyCardIn 120ms ease both' }}>
          {activeSlide
            ? <LessonCard slide={activeSlide} onSelectLesson={onSelectLesson} onOpenTopic={onOpenTopic} />
            : <AddCard available={available} onGoTab={onGoTab} />}
        </div>
      </div>

      {/* AyahStrip - static, taps into the Qur'an tab */}
      <button onClick={() => onGoTab('quran')} className="dash-press" aria-label={`Ayah of the day, ${ayah.surahName} ${ayah.ref}. Open in the Qur'an tab.`}
        style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 16px 6px', cursor: 'pointer', minHeight: 44, marginTop: 8 }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, background: D.quran, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={14} color="#FBFAF6" /></span>
        <span dir="rtl" className="quran-ar" style={{ flex: 1, minWidth: 0, fontSize: 17, color: D.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ayah.arabic}</span>
        <span style={{ fontSize: TYPE.hint, color: D.inkHint, flexShrink: 0 }}>{ayah.ref}</span>
      </button>
    </div>
  );
}

function Chip({ icon: Icon, value, bg, border, ink }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: bg, border: `1px solid ${border}`, color: ink, borderRadius: 999, padding: '4px 10px', fontSize: TYPE.meta, fontWeight: 700, flexShrink: 0 }}>
      <Icon size={13} strokeWidth={2.4} /> {value}
    </span>
  );
}

// ---- swiping band (pill, title, level, segments, art + peek) --------------
function TopicBand({ slide, prev, next, onOpenTopic }) {
  const s = subjectOf(slide.id);
  const ac = carouselAccent(slide.id);
  return (
    <div style={{ padding: '2px 16px 0' }}>
      <button onClick={() => onOpenTopic(slide.id)} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: ac.tint, color: ac.base, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.name}</span>
        <h1 style={{ margin: '10px 0 0', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: D.ink, lineHeight: 1.16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: `${Math.round(28 * 1.16 * 2)}px` }}>{slide.moduleTitle || s.name}</h1>
        <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 800, letterSpacing: '0.1em', color: ac.base }}>LEVEL {slide.level}</div>
        <Segments count={slide.lessonCount} filled={slide.lessonsComplete} ac={ac} />
      </button>
      <ArtBand topic={slide.id} accent={ac} prev={prev} next={next} />
    </div>
  );
}

function AddBand({ available, prev }) {
  const ac = carouselAccent('add-topic');
  return (
    <div style={{ padding: '2px 16px 0' }}>
      <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: ac.tint, color: ac.base, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{available.length} topic{available.length === 1 ? '' : 's'} available</span>
      <h1 style={{ margin: '10px 0 0', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: D.ink, lineHeight: 1.16, height: `${Math.round(28 * 1.16 * 2)}px`, display: 'flex', alignItems: 'flex-start' }}>Add a topic</h1>
      <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 800, letterSpacing: '0.1em', color: ac.base }}>{' '}</div>
      <div style={{ marginTop: 6, height: 4 }} />
      <ArtBand topic="add-topic" accent={ac} prev={prev} next={null} />
    </div>
  );
}

function Segments({ count, filled, ac }) {
  if (count > 8) {
    const pct = count ? Math.round((filled / count) * 100) : 0;
    return <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: ac.tint, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: ac.deep, borderRadius: 2 }} /></div>;
  }
  return (
    <div style={{ marginTop: 8, display: 'flex', gap: 5 }}>
      {Array.from({ length: Math.max(count, 1) }).map((_, i) => (
        <div key={i} style={{ flex: 1, maxWidth: 24, height: 4, borderRadius: 2, background: i < filled ? ac.deep : ac.tint }} />
      ))}
    </div>
  );
}

// Illustration - the artwork sits FLUSH on the white page (no card, no box), the
// way Brilliant does it; it pops because it is colourful art on clean white. Fixed
// band height keeps the CTA at a constant y. Adjacent-art peeks (26% opacity, 30px
// outside each edge) make the carousel discoverable without a tutorial.
function ArtBand({ topic, accent, prev, next }) {
  const peekAccent = (id) => (id ? carouselAccent(id) : accent);
  return (
    <div style={{ position: 'relative', height: BAND, marginTop: 12, overflow: 'hidden' }}>
      {prev && <div aria-hidden="true" style={{ position: 'absolute', left: -30, top: 0, bottom: 0, width: 74, opacity: 0.26 }}><TopicArt topic={prev} accent={peekAccent(prev)} /></div>}
      {next && <div aria-hidden="true" style={{ position: 'absolute', right: -30, top: 0, bottom: 0, width: 74, opacity: 0.26 }}><TopicArt topic={next} accent={peekAccent(next)} /></div>}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TopicArt topic={topic} accent={accent} style={{ maxWidth: '96%' }} />
      </div>
    </div>
  );
}

// ---- static lesson card (content swaps per active slide) ------------------
function LessonCard({ slide, onSelectLesson, onOpenTopic }) {
  const ac = carouselAccent(slide.id);
  const st = slide.slideState;
  const kicker = st === 'in_progress' ? `LESSON ${slide.current?.index || 1} OF ${slide.lessonCount}`
    : st === 'untouched' ? 'STARTS WITH'
      : st === 'level_complete' ? `LEVEL ${Math.max(slide.level - 1, 1)} COMPLETE`
        : 'COMPLETED';
  const cta = st === 'complete' ? 'Review this topic' : st === 'untouched' ? 'Start' : st === 'level_complete' ? `Begin level ${slide.level}` : 'Continue';
  const complete = st === 'complete';
  const onCta = () => { if (complete) return onOpenTopic(slide.id); const l = slide.current; if (l && onSelectLesson) onSelectLesson(l.lesson, l.idx, l.mod); };

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: D.inkHint }}>{kicker}</div>
      <div style={{ minHeight: 96, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: complete ? 'center' : 'flex-start' }}>
        {complete
          ? <div style={{ fontSize: TYPE.body, color: D.inkSecondary, lineHeight: 1.5 }}>You have finished every lesson here. Revisit any lesson any time.</div>
          : (slide.rows || []).map((r, i) => <LessonRow key={r.id} lesson={r} locked={i > 0} ac={ac} />)}
      </div>
      <PressCTA ac={ac} onClick={onCta}>{cta}</PressCTA>
    </div>
  );
}

function AddCard({ available, onGoTab }) {
  const ac = carouselAccent('add-topic');
  const capped = available.length <= 1; // three active topics -> only one slot-ish left
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: D.inkHint }}>{capped ? 'ONE AT A TIME' : 'SUGGESTED FOR YOU'}</div>
      <div style={{ minHeight: 96, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
        {capped
          ? <div style={{ fontSize: TYPE.body, color: D.inkSecondary, lineHeight: 1.5 }}>You have three topics going. Finish one before adding a fourth - it keeps you moving.</div>
          : available.slice(0, 3).map((id) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: subjectOf(id).accent, flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 700, color: D.ink }}>{subjectOf(id).name}</span>
                <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint }}>{PAIRING[id]}</span>
              </span>
            </div>
          ))}
      </div>
      <PressCTA ac={ac} onClick={() => onGoTab('topics')}>Browse all topics</PressCTA>
    </div>
  );
}

const cardStyle = { background: D.card, border: '1px solid rgba(27,42,74,0.11)', borderRadius: 22, boxShadow: '0 2px 12px rgba(27,42,74,0.06)', padding: '16px 16px 18px' };

function LessonRow({ lesson, locked, ac }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Node locked={locked} ac={ac} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 16, fontWeight: locked ? 400 : 800, color: locked ? D.inkHint : D.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
        <span style={{ display: 'block', fontSize: 12, color: D.inkHint, marginTop: 1 }}>{lesson.minutes} min</span>
      </span>
      {locked
        ? <Lock size={16} color={D.inkFaint} style={{ flexShrink: 0 }} />
        : <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: ac.base, background: ac.tint, borderRadius: 999, padding: '3px 9px' }}>+{lesson.coins}</span>}
    </div>
  );
}

// Current node: amber ellipse + white inner + green teardrop pin. Locked: greys, no pin.
function Node({ locked, ac }) {
  const outer = locked ? '#D7D3CA' : ac.base;
  const inner = locked ? '#EFECE4' : '#FFFFFF';
  const edge = locked ? '#C4BFB4' : ac.deep;
  return (
    <svg width="48" height="34" viewBox="0 0 48 34" style={{ flexShrink: 0 }} aria-hidden="true">
      <ellipse cx="24" cy="21" rx="24" ry="13" fill={outer} />
      <ellipse cx="24" cy="21" rx="18" ry="10" fill={inner} stroke={edge} strokeWidth="1.5" />
      {!locked && <path d="M24 2 c-6 0 -10 4 -10 9 c0 5 10 12 10 12 c0 0 10 -7 10 -12 c0 -5 -4 -9 -10 -9 z" fill="#1D9E75" stroke="#14785A" strokeWidth="1.5" />}
      {!locked && <circle cx="24" cy="11" r="3.4" fill="#fff" />}
    </svg>
  );
}

// CTA with the glossy pressable treatment (spec section 5).
function PressCTA({ ac, onClick, children }) {
  const rest = `inset 0 2px 0 rgba(255,255,255,0.60), inset 0 -3px 0 rgba(0,0,0,0.08), 0 5px 0 ${ac.deep}, 0 8px 14px ${ac.deep}38`;
  const down = 'inset 0 2px 0 rgba(255,255,255,0.6)';
  const reset = (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = rest; };
  return (
    <button onClick={onClick}
      style={{ width: '100%', marginTop: 14, border: 'none', borderRadius: 999, background: ac.base, color: ac.onBase, fontFamily: 'inherit', fontSize: 18, fontWeight: 800, cursor: 'pointer', padding: '15px 0', boxShadow: rest, transition: 'transform 75ms ease, box-shadow 75ms ease' }}
      onPointerDown={(e) => { e.currentTarget.style.transform = 'translateY(5px)'; e.currentTarget.style.boxShadow = down; }}
      onPointerUp={reset} onPointerLeave={reset}>
      {children}
    </button>
  );
}
