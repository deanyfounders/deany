// Home - a horizontal snap carousel, one topic per screen (dashboard carousel
// spec, 30 Jul 2026). Header, page dots, ayah strip and nav sit OUTSIDE the track
// so they do not translate on swipe. The full topic list lives only in the Topics
// tab; Home never duplicates it. Only the track scrolls sideways (the shell is
// overflow-x hidden), so the two gestures never fight.
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { D, TYPE, RADIUS, subjectOf, carouselAccent } from '../tokens.js';
import { StatPill } from '../components.jsx';
import { buildTopicSlide, getActiveTopics, getContinueTarget } from '../selectors.js';
import TopicArt from '../topicArt.jsx';
import { getAyahOfTheDay } from '../../../content/ayahOfTheDay.js';

const ALL_TOPICS = ['quran-arabic', 'islamic-history', 'islamic-finance', '5-pillars'];
const PAIRING = {
  'quran-arabic': 'The foundation for every topic',
  'islamic-history': 'Pairs with your Qur’an reading',
  'islamic-finance': 'Grounds everyday money decisions',
  '5-pillars': 'Where most learners begin',
};
const ART_BAND = 150; // fixed, so the Start button lands at the same y on every slide

const hijri = () => {
  try { return new Intl.DateTimeFormat('en-US-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric', era: 'short' }).format(new Date()); }
  catch (_) { return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(new Date()); }
};

export default function Home({ name, state, deps, coins, streak, onOpenTopic, onGoTab, onSelectLesson }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [ayah] = useState(getAyahOfTheDay);
  const [today] = useState(hijri);

  const topicIds = getActiveTopics(state);
  const slides = useMemo(() => topicIds.map((id) => ({ ...buildTopicSlide(id, state, deps), name: subjectOf(id).name })), [topicIds.join(','), deps]);
  const activeTopicId = useMemo(() => { const t = getContinueTarget(state, deps, Date.now()); return t.type === 'lesson' ? t.topicId : (topicIds[0] || null); }, [topicIds.join(','), deps]);
  const addIndex = slides.length; // the add-topic slide sits after the topics
  const zero = slides.length === 0;

  // Resume position before paint - no visible slide-in on cold open.
  useLayoutEffect(() => {
    const el = trackRef.current; if (!el) return;
    const i = slides.findIndex((s) => s.id === activeTopicId);
    if (i > 0) { el.scrollLeft = el.clientWidth * i; setActive(i); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopicId, slides.length]);

  // Active index via IntersectionObserver (a scroll listener flickers the dots).
  useLayoutEffect(() => {
    const root = trackRef.current; if (!root) return;
    const io = new IntersectionObserver((entries) => { const hit = entries.find((e) => e.isIntersecting); if (hit) setActive(Number(hit.target.dataset.index)); }, { root, threshold: 0.6 });
    root.querySelectorAll('[data-index]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slides.length]);

  const goSlide = (i) => { const el = trackRef.current; if (!el) return; const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; el.scrollTo({ left: el.clientWidth * i, behavior: smooth ? 'smooth' : 'auto' }); };
  const available = ALL_TOPICS.filter((id) => !topicIds.includes(id));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      <style>{`.deany-carousel::-webkit-scrollbar{display:none}@media (prefers-reduced-motion: reduce){.deany-carousel{scroll-behavior:auto}}`}</style>

      {/* Header - static */}
      <div style={{ flexShrink: 0, padding: 'calc(env(safe-area-inset-top) + 12px) 20px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 500, color: D.ink }}>{name ? `Salam, ${name}` : 'Salam'} <span style={{ fontSize: 17 }}>{'\u{1F44B}'}</span></div>
            <div style={{ fontSize: TYPE.meta, color: D.inkHint, marginTop: 2 }}>{today}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <StatPill kind="streak" value={streak} />
            <StatPill kind="coins" value={coins} />
          </div>
        </div>
      </div>

      {/* Carousel track - the only horizontal scroller */}
      <div ref={trackRef} className="deany-carousel" role="region" aria-roledescription="carousel" aria-label="Your topics. Swipe, or open the Topics tab for the full list."
        style={{ flex: 1, minHeight: 0, display: 'flex', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain', touchAction: 'pan-x', scrollbarWidth: 'none' }}>
        {slides.map((s, i) => (
          <section key={s.id} data-index={i} aria-label={`${s.name}, level ${s.level}`}
            style={{ scrollSnapAlign: 'center', flexShrink: 0, flexBasis: '100%', minWidth: 0 }}>
            <TopicSlide slide={s} onOpenTopic={onOpenTopic} onSelectLesson={onSelectLesson} />
          </section>
        ))}
        <section data-index={addIndex} aria-label="Add a topic"
          style={{ scrollSnapAlign: 'center', flexShrink: 0, flexBasis: '100%', minWidth: 0 }}>
          <AddTopicSlide available={available} activeCount={slides.length} onGoTab={onGoTab} />
        </section>
      </div>

      {/* Page dots + trailing plus - static, real buttons */}
      {!zero && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 0 4px' }}>
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => goSlide(i)} aria-label={`Go to ${s.name}`} aria-current={active === i}
              style={{ width: active === i ? 20 : 8, height: 8, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: active === i ? carouselAccent(s.id).base : D.border, transition: 'width .2s ease, background .2s ease' }} />
          ))}
          <button onClick={() => goSlide(addIndex)} aria-label="Add a topic"
            style={{ width: 16, height: 16, marginLeft: 2, borderRadius: 999, border: `1.5px solid ${active === addIndex ? carouselAccent('add-topic').base : D.inkFaint}`, background: active === addIndex ? carouselAccent('add-topic').base : 'transparent', color: active === addIndex ? '#fff' : D.inkFaint, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <Plus size={11} strokeWidth={2.6} />
          </button>
        </div>
      )}

      {/* Ayah strip - static, taps into the Qur'an tab */}
      <button onClick={() => onGoTab('quran')} className="dash-press" aria-label={`Ayah of the day, ${ayah.surahName} ${ayah.ref}. Open in the Qur'an tab.`}
        style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: D.card, borderTop: `1px solid ${D.border}`, borderBottom: 'none', borderLeft: 'none', borderRight: 'none', padding: '10px 20px', cursor: 'pointer', minHeight: 48 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: D.quran, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={15} color="#FBFAF6" /></span>
        <span dir="rtl" className="quran-ar" style={{ flex: 1, minWidth: 0, fontSize: 17, color: D.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ayah.arabic}</span>
        <span style={{ fontSize: TYPE.hint, color: D.inkHint, flexShrink: 0 }}>{ayah.ref}</span>
      </button>
    </div>
  );
}

const STATE_LABEL = { in_progress: 'WHERE YOU LEFT OFF', untouched: 'STARTS WITH', level_complete: 'LEVEL COMPLETE', complete: 'COMPLETED' };

function TopicSlide({ slide, onOpenTopic, onSelectLesson }) {
  const s = subjectOf(slide.id);
  const ac = carouselAccent(slide.id);
  const label = STATE_LABEL[slide.slideState];
  const complete = slide.slideState === 'complete';
  const primary = complete ? 'Review this topic' : slide.slideState === 'untouched' ? 'Start' : slide.slideState === 'level_complete' ? `Begin level ${slide.level}` : 'Continue';
  const onPrimary = () => {
    if (complete) return onOpenTopic(slide.id);
    const l = slide.current; if (l && onSelectLesson) onSelectLesson(l.lesson, l.idx, l.mod);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '4px 20px 0' }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: ac.tint, color: ac.base, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{s.name}</span>
      </div>
      <button onClick={() => onOpenTopic(slide.id)} style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: 60, display: 'flex', alignItems: 'flex-start' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: D.ink, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{slide.moduleTitle || s.name}</h1>
      </button>
      <div style={{ marginTop: 2 }}>
        <span style={{ fontSize: TYPE.meta, fontWeight: 700, color: ac.base, letterSpacing: 0.3 }}>Level {slide.level}</span>
        <LevelSegments count={slide.lessonCount} filled={slide.lessonsComplete} ac={ac} />
      </div>
      <button onClick={() => onOpenTopic(slide.id)} aria-label={`Open ${s.name}`} style={{ height: ART_BAND, flexShrink: 0, marginTop: 6, background: ac.tint, borderRadius: RADIUS.hero, border: 'none', cursor: 'pointer', overflow: 'hidden', padding: '8px 0' }}>
        <TopicArt topic={slide.id} accent={ac} />
      </button>
      <div style={{ flex: 1, minHeight: 8 }} />
      <div style={{ flexShrink: 0, background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.card, padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: D.inkHint, marginBottom: complete ? 0 : 8 }}>{label}</div>
        <div style={{ minHeight: complete ? 40 : 60, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: complete ? 'center' : 'flex-start' }}>
          {complete
            ? <div style={{ fontSize: TYPE.body, color: D.inkSecondary }}>You have finished every lesson here. Revisit any time.</div>
            : slide.rows.map((r, i) => <LessonRow key={r.id} lesson={r} muted={i > 0} ac={ac} />)}
        </div>
        <PressButton ac={ac} onClick={onPrimary} style={{ marginTop: 12 }}>{primary}</PressButton>
      </div>
    </div>
  );
}

function LevelSegments({ count, filled, ac }) {
  if (count > 8) {
    const pct = count ? Math.round((filled / count) * 100) : 0;
    return (
      <div style={{ marginTop: 6, height: 5, borderRadius: 999, background: ac.tint, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: ac.deep, borderRadius: 999 }} />
      </div>
    );
  }
  return (
    <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
      {Array.from({ length: Math.max(count, 1) }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: i < filled ? ac.deep : ac.tint }} />
      ))}
    </div>
  );
}

function LessonRow({ lesson, muted, ac }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: muted ? 0.5 : 1 }}>
      <span style={{ width: 9, height: 9, borderRadius: 999, flexShrink: 0, background: muted ? D.border : ac.base }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: TYPE.body, fontWeight: muted ? 400 : 600, color: D.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
      <span style={{ fontSize: TYPE.hint, color: D.inkHint, flexShrink: 0 }}>Lesson {lesson.index} · {lesson.minutes} min</span>
    </div>
  );
}

function PressButton({ ac, onClick, children, style }) {
  const reset = (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 3px 0 ${ac.deep}`; };
  return (
    <button onClick={onClick} className="dash-press"
      style={{ width: '100%', minHeight: 48, border: 'none', borderRadius: 999, background: ac.base, color: ac.onBase, fontFamily: 'inherit', fontSize: TYPE.cardTitle, fontWeight: 700, cursor: 'pointer', boxShadow: `0 3px 0 ${ac.deep}`, transition: 'transform .075s ease, box-shadow .075s ease', ...style }}
      onPointerDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = 'none'; }}
      onPointerUp={reset} onPointerLeave={reset}>
      {children}
    </button>
  );
}

function AddTopicSlide({ available, activeCount, onGoTab }) {
  const ac = carouselAccent('add-topic');
  const capped = activeCount >= 3;
  const suggestions = available.slice(0, 3);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '4px 20px 0' }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: ac.tint, color: ac.base, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{available.length} topic{available.length === 1 ? '' : 's'} available</span>
      </div>
      <div style={{ height: 60, display: 'flex', alignItems: 'flex-start' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: D.ink, lineHeight: 1.2 }}>Add a topic</h1>
      </div>
      <div style={{ marginTop: 2, height: 17 }} />
      <div style={{ height: ART_BAND, flexShrink: 0, marginTop: 6, background: ac.tint, borderRadius: RADIUS.hero, overflow: 'hidden', padding: '8px 0' }}>
        <TopicArt topic="add-topic" accent={ac} />
      </div>
      <div style={{ flex: 1, minHeight: 8 }} />
      <div style={{ flexShrink: 0, background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.card, padding: '12px 14px 14px' }}>
        {capped
          ? <div style={{ fontSize: TYPE.body, color: D.inkSecondary, lineHeight: 1.5, marginBottom: 12 }}>You have three topics going. Finish one before adding a fourth - it keeps you moving.</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
              {suggestions.map((id) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: subjectOf(id).accent, flexShrink: 0 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 600, color: D.ink }}>{subjectOf(id).name}</span>
                    <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint }}>{PAIRING[id]}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        <PressButton ac={ac} onClick={() => onGoTab('topics')}>Browse all topics</PressButton>
      </div>
    </div>
  );
}
