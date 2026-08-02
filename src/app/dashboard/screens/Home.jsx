// Home (deany-home-v1, 31 Jul 2026 - supersedes the carousel). A vertical page:
// header, ayah strip, a centred "Subjects" heading, a 2x2 boxless subject grid
// (THE HERO), and a single Personal review guide nudge. No continue/"where you
// left off" element - resume happens through the in-progress tile and the guide.
// Nothing scrolls horizontally; the page keeps touch-action: pan-y.
import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Volume2 } from 'lucide-react';
import { D, TYPE, subjectOf, carouselAccent } from '../tokens.js';
import { buildTopicSlide, getActiveTopics, guideSuggestion, resolveGuideRoute } from '../selectors.js';
import { getAyahOfTheDay } from '../../../content/ayahOfTheDay.js';
import PersonalReviewGuide from '../PersonalReviewGuide.jsx';
import financeArt from '../../../assets/topics/islamic-finance.png';

const ALL_TOPICS = ['quran-arabic', 'islamic-history', 'islamic-finance', '5-pillars'];
const TILE_IMAGES = { 'islamic-finance': financeArt };
const ART_ZONE = 106;

// v1 mock (claude-code-task-review-guide.md): shipped so the card is visible before
// the real SRS tables exist. The real selector (guideSuggestion) wins whenever the
// user has a genuinely due item; this is only the fallback so Home isn't empty.
const MOCK_GUIDE = {
  kind: 'ayah_memorisation',
  message: 'Time to revisit <b>Ayat al-Kursi</b>. You memorised it 3 days ago and it is due today.',
  ctaLabel: 'Review now · 2 min',
  route: 'review:mock',
  queueCount: 2,
};

const hijri = () => {
  try {
    const p = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(new Date());
    const get = (t) => (p.find((x) => x.type === t) || {}).value || '';
    return `${get('day')} ${get('month')} ${get('year')}`;
  } catch (_) { return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(new Date()); }
};

export default function Home({ name, state, deps, coins, streak, onOpenTopic, onGoTab, onSelectLesson }) {
  const [ayah] = useState(getAyahOfTheDay);
  const [today] = useState(hijri);
  const topicIds = getActiveTopics(state);
  const slides = useMemo(() => topicIds.map((id) => buildTopicSlide(id, state, deps)), [topicIds.join(','), deps]);
  // The card reads only from this async thunk; a real selector swaps in here.
  const getSuggestion = useMemo(() => () => Promise.resolve(guideSuggestion(state, deps, Date.now()) || MOCK_GUIDE), [state, deps]);
  const onGuideNavigate = (route) => { const r = resolveGuideRoute(state, deps, route); if (r) onSelectLesson(r.lesson, r.idx, r.mod); else onGoTab('review'); };
  const available = ALL_TOPICS.filter((id) => !topicIds.includes(id));
  const empty = topicIds.length === 0;

  const openTile = (slide) => {
    const inProgress = slide.slideState === 'in_progress' || slide.slideState === 'level_complete';
    if (inProgress && slide.current) onSelectLesson(slide.current.lesson, slide.current.idx, slide.current.mod);
    else onOpenTopic(slide.id);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 16px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: D.ink }}>{name ? `Salam, ${name}` : 'Salam'}</div>
          <div style={{ fontSize: 12, color: '#8A90A0', marginTop: 2 }}>{today}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F0B429', color: '#3A2704', borderRadius: 999, padding: '5px 11px', fontSize: 13, fontWeight: 700 }}>{'\u{1F525}'} {streak}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#22A39A', color: '#fff', borderRadius: 999, padding: '5px 11px', fontSize: 13, fontWeight: 700 }}>{'\u{1FA99}'} {coins}</span>
        </div>
      </div>

      {/* Ayah strip - collapsible, expands in place */}
      <AyahStrip ayah={ayah} onOpenReader={() => onGoTab('quran')} />

      {/* Subjects heading */}
      <h2 style={{ margin: '20px 18px 6px', fontSize: 19, fontWeight: 700, color: D.ink, textAlign: 'center' }}>{empty ? 'Choose your first subject' : 'Subjects'}</h2>

      {/* Subject grid - the hero */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: '0 16px' }}>
        {empty
          ? available.map((id) => <PickerTile key={id} id={id} onPick={() => onGoTab('topics')} />)
          : (<>
            {slides.map((s) => <SubjectTile key={s.id} slide={s} onTap={() => openTile(s)} />)}
            {topicIds.length < 4 && <AddTile count={available.length} onPress={() => onGoTab('topics')} />}
          </>)}
      </div>

      {/* Personal review guide - renders nothing when no suggestion is due */}
      <PersonalReviewGuide getSuggestion={getSuggestion} onNavigate={onGuideNavigate} onMore={() => onGoTab('review')} />
    </div>
  );
}

function tilePress(e, down) { e.currentTarget.style.transform = down ? 'scale(0.96)' : ''; }

// Ayah strip - collapsed one-line by default; taps expand it in place to the full
// block (large Arabic, translation, reference, actions). Per-session only, always
// loads collapsed. Height animates via grid-template-rows; reduced-motion snaps.
function AyahStrip({ ayah, onOpenReader }) {
  const [expanded, setExpanded] = useState(false);
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div style={{ margin: '14px 16px 0', background: '#E4F3ED', borderRadius: 14, padding: '11px 14px' }}>
      <button onClick={() => setExpanded((e) => !e)} aria-expanded={expanded} aria-label="Ayah of the day"
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: '#0B5E48', flexShrink: 0, whiteSpace: 'nowrap' }}>{expanded ? 'AYAH OF THE DAY' : 'AYAH'}</span>
        {expanded
          ? <span style={{ flex: 1 }} />
          : <span dir="rtl" lang="ar" className="quran-ar" style={{ flex: 1, minWidth: 0, fontSize: 15, color: D.navy, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ayah.arabic}</span>}
        {expanded ? <ChevronUp size={16} color="#0B5E48" style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color="#0B5E48" style={{ flexShrink: 0 }} />}
      </button>
      <div style={{ display: 'grid', gridTemplateRows: expanded ? '1fr' : '0fr', transition: reduce ? 'none' : 'grid-template-rows 180ms ease-out' }}>
        <div style={{ overflow: 'hidden' }}>
          <div dir="rtl" lang="ar" className="quran-ar" style={{ fontSize: 20, lineHeight: 1.9, color: D.navy, textAlign: 'right', marginTop: 8 }}>{ayah.arabic}</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: D.inkSecondary, marginTop: 6 }}>{ayah.translation}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 12, color: '#5F8F82' }}>{ayah.surahName} {ayah.ref}</span>
            <button onClick={onOpenReader} aria-label="Listen" style={{ border: 'none', background: 'none', color: '#0B5E48', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0 }}><Volume2 size={14} /> Listen</button>
            <span style={{ color: '#0B5E48', fontSize: 12 }}>·</span>
            <button onClick={onOpenReader} style={{ border: 'none', background: 'none', color: '#0B5E48', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Read in context</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubjectTile({ slide, onTap }) {
  const s = subjectOf(slide.id);
  const ac = carouselAccent(slide.id);
  const inProgress = slide.slideState === 'in_progress' || slide.slideState === 'level_complete';
  const untouched = slide.slideState === 'untouched';
  const label = `${s.name}, ${slide.lessonsComplete} of ${slide.lessonCount} lessons${inProgress ? ', in progress' : untouched ? ', not started' : ', completed'}`;
  return (
    <button onClick={onTap} aria-label={label} className="dash-press"
      style={{ minWidth: 0, background: 'none', border: 'none', padding: '8px 6px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 80ms ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
      onPointerDown={(e) => tilePress(e, true)} onPointerUp={(e) => tilePress(e, false)} onPointerLeave={(e) => tilePress(e, false)}>
      <div style={{ position: 'relative', height: ART_ZONE, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {inProgress && <span style={{ position: 'absolute', top: 0, background: '#F0B429', color: '#3A2704', borderRadius: 999, padding: '3px 10px', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.02em' }}>IN PROGRESS</span>}
        <TileArt id={slide.id} ac={ac} initial={(s.short || s.name)[0]} />
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: D.ink, marginTop: 6, textAlign: 'center' }}>{s.name}</div>
      <Segments count={slide.lessonCount} filled={slide.lessonsComplete} ac={ac} />
      <div style={{ fontSize: 11, color: '#8A90A0', marginTop: 5 }}>{untouched ? 'Not started' : `${slide.lessonsComplete} of ${slide.lessonCount} lessons`}</div>
    </button>
  );
}

function TileArt({ id, ac, initial }) {
  const img = TILE_IMAGES[id];
  if (img) return <img src={img} alt="" aria-hidden="true" style={{ maxHeight: ART_ZONE, maxWidth: 148, objectFit: 'contain' }} />;
  return (
    <div style={{ width: 100, height: 100, borderRadius: '50%', background: ac.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 40, fontWeight: 800, color: ac.deep }}>{initial}</span>
    </div>
  );
}

function Segments({ count, filled, ac }) {
  if (count > 8) {
    const pct = count ? Math.round((filled / count) * 100) : 0;
    return <div style={{ marginTop: 8, width: 84, height: 3.5, borderRadius: 2, background: '#EDEBE4', overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: ac.base, borderRadius: 2 }} /></div>;
  }
  return (
    <div style={{ marginTop: 8, display: 'flex', gap: 3 }}>
      {Array.from({ length: Math.max(count, 1) }).map((_, i) => (
        <div key={i} style={{ width: 15, height: 3.5, borderRadius: 2, background: i < filled ? ac.base : '#EDEBE4' }} />
      ))}
    </div>
  );
}

function AddTile({ count, onPress }) {
  return (
    <button onClick={onPress} aria-label={`Add subject, ${count} available`} className="dash-press"
      style={{ minWidth: 0, background: 'none', border: 'none', padding: '8px 6px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 80ms ease', touchAction: 'manipulation' }}
      onPointerDown={(e) => tilePress(e, true)} onPointerUp={(e) => tilePress(e, false)} onPointerLeave={(e) => tilePress(e, false)}>
      <div style={{ height: ART_ZONE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', border: '1.5px dashed #D3D6CE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={30} color="#B7BBB0" strokeWidth={2} /></div>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: D.ink, marginTop: 6 }}>Add subject</div>
      <div style={{ fontSize: 11, color: '#8A90A0', marginTop: 5 }}>{count} available</div>
    </button>
  );
}

function PickerTile({ id, onPick }) {
  const s = subjectOf(id); const ac = carouselAccent(id);
  return (
    <button onClick={onPick} aria-label={`Start ${s.name}`} className="dash-press"
      style={{ minWidth: 0, background: 'none', border: 'none', padding: '8px 6px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 80ms ease', touchAction: 'manipulation' }}
      onPointerDown={(e) => tilePress(e, true)} onPointerUp={(e) => tilePress(e, false)} onPointerLeave={(e) => tilePress(e, false)}>
      <div style={{ height: ART_ZONE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TileArt id={id} ac={ac} initial={(s.short || s.name)[0]} /></div>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: D.ink, marginTop: 6, textAlign: 'center' }}>{s.name}</div>
      <div style={{ fontSize: 11, color: '#8A90A0', marginTop: 5 }}>Tap to start</div>
    </button>
  );
}

