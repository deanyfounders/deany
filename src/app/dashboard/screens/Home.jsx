// Home (deany-home-v1, 31 Jul 2026 - supersedes the carousel). A vertical page:
// header, ayah strip, a centred "Subjects" heading, a 2x2 boxless subject grid
// (THE HERO), and a single Personal review guide nudge. No continue/"where you
// left off" element - resume happens through the in-progress tile and the guide.
// Nothing scrolls horizontally; the page keeps touch-action: pan-y.
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, Plus, Volume2, MoreVertical, Trash2, X } from 'lucide-react';
import { D, TYPE, subjectOf, carouselAccent } from '../tokens.js';
import { buildTopicSlide, getActiveTopics, guideSuggestion, resolveGuideRoute } from '../selectors.js';
import { catalogById } from '../catalog.js';
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

export default function Home({ name, state, deps, coins, streak, onOpenTopic, onGoTab, onSelectLesson, addTopic, removeTopic }) {
  const [ayah] = useState(getAyahOfTheDay);
  const [today] = useState(hijri);
  const [showAdd, setShowAdd] = useState(false);
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
          ? available.map((id) => <PickerTile key={id} id={id} onPick={() => addTopic && addTopic(id)} />)
          : (<>
            {slides.map((s) => <SubjectTile key={s.id} slide={s} onTap={() => openTile(s)} onRemove={() => removeTopic && removeTopic(s.id)} />)}
            {topicIds.length < 4 && available.length > 0 && <AddTile count={available.length} onPress={() => setShowAdd(true)} />}
          </>)}
      </div>

      {/* Personal review guide - renders nothing when no suggestion is due */}
      <PersonalReviewGuide getSuggestion={getSuggestion} onNavigate={onGuideNavigate} onMore={() => onGoTab('review')} />

      {/* Add-a-subject picker - adds directly to the grid, no tab hop */}
      {showAdd && (
        <AddSheet
          available={available}
          onAdd={(id) => { addTopic && addTopic(id); if (available.length <= 1) setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}
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

function SubjectTile({ slide, onTap, onRemove }) {
  const s = subjectOf(slide.id);
  const ac = carouselAccent(slide.id);
  const [menu, setMenu] = useState(false);
  const inProgress = slide.slideState === 'in_progress' || slide.slideState === 'level_complete';
  const untouched = slide.slideState === 'untouched';
  const label = `${s.name}, ${slide.lessonsComplete} of ${slide.lessonCount} lessons${inProgress ? ', in progress' : untouched ? ', not started' : ', completed'}`;
  return (
    <div style={{ position: 'relative', minWidth: 0 }}>
      <button onClick={onTap} aria-label={label} className="dash-press"
        style={{ width: '100%', minWidth: 0, background: 'none', border: 'none', padding: '8px 6px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 80ms ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
        onPointerDown={(e) => tilePress(e, true)} onPointerUp={(e) => tilePress(e, false)} onPointerLeave={(e) => tilePress(e, false)}>
        <div style={{ position: 'relative', height: ART_ZONE, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {inProgress && <span style={{ position: 'absolute', top: 0, background: '#F0B429', color: '#3A2704', borderRadius: 999, padding: '3px 10px', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.02em' }}>IN PROGRESS</span>}
          <TileArt id={slide.id} ac={ac} initial={(s.short || s.name)[0]} />
        </div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: D.ink, marginTop: 6, textAlign: 'center' }}>{s.name}</div>
        <Segments count={slide.lessonCount} filled={slide.lessonsComplete} ac={ac} />
        <div style={{ fontSize: 11, color: '#8A90A0', marginTop: 5 }}>{untouched ? 'Not started' : `${slide.lessonsComplete} of ${slide.lessonCount} lessons`}</div>
      </button>

      {/* Overflow menu - remove subject (progress is kept, it can be re-added) */}
      <button onClick={(e) => { e.stopPropagation(); setMenu((m) => !m); }} aria-label={`${s.name} options`} aria-haspopup="menu" aria-expanded={menu}
        style={{ position: 'absolute', top: 2, right: 0, background: 'none', border: 'none', padding: 6, lineHeight: 0, cursor: 'pointer', color: '#B7BBB0', borderRadius: 999, WebkitTapHighlightColor: 'transparent' }}>
        <MoreVertical size={17} />
      </button>
      {menu && (
        <>
          <div onClick={() => setMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div role="menu" style={{ position: 'absolute', top: 28, right: 0, zIndex: 41, background: '#fff', border: '1px solid #ECE9E3', borderRadius: 12, minWidth: 162, overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,26,42,0.16)' }}>
            <button role="menuitem" onClick={() => { setMenu(false); onRemove && onRemove(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '12px 13px', fontSize: 14, fontWeight: 600, color: '#B04A2C', cursor: 'pointer', minHeight: 44, WebkitTapHighlightColor: 'transparent' }}>
              <Trash2 size={15} color="#B04A2C" /> Remove subject
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Bottom-sheet picker: adds a subject straight into the grid. Lists only the
// subjects the user hasn't added yet; empties out (and closes) as they're added.
// PORTALED to document.body so it renders above the floating nav pill and the
// home indicator - never trapped in the scroll wrapper's stacking context.
function AddSheet({ available, onAdd, onClose }) {
  if (typeof document === 'undefined') return null;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sheet = (
    <div role="dialog" aria-modal="true" aria-label="Add a subject" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,26,42,0.34)', animation: reduce ? 'none' : 'deanyFade 160ms ease-out' }} />
      <div style={{ position: 'relative', background: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: '10px 16px calc(env(safe-area-inset-bottom) + 28px)', maxWidth: 520, margin: '0 auto', width: '100%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 -10px 40px rgba(15,26,42,0.18)', animation: reduce ? 'none' : 'deanySheetUp 240ms cubic-bezier(0.22,1,0.36,1)' }}>
        <style>{'@keyframes deanySheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes deanyFade{from{opacity:0}to{opacity:1}}'}</style>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: '#E2E0DA', margin: '2px auto 12px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: D.ink }}>Add a subject</span>
          <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: '#F2F1EC', borderRadius: '50%', width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} color="#7A8090" /></button>
        </div>
        {available.map((id) => {
          const s = subjectOf(id); const ac = carouselAccent(id); const cat = catalogById(id) || {};
          return (
            <button key={id} onClick={() => onAdd(id)} className="dash-press"
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', borderTop: '1px solid #F0EEE9', padding: '12px 2px', cursor: 'pointer', textAlign: 'left', minHeight: 56, WebkitTapHighlightColor: 'transparent' }}>
              <span style={{ width: 42, height: 42, borderRadius: '50%', background: ac.tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: ac.deep }}>{(s.short || s.name)[0]}</span>
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: D.ink }}>{s.name}</span>
                <span style={{ display: 'block', fontSize: 12, color: '#8A90A0', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.desc}</span>
              </span>
              <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0B5E48', fontSize: 13, fontWeight: 700 }}><Plus size={16} /> Add</span>
            </button>
          );
        })}
      </div>
    </div>
  );
  return createPortal(sheet, document.body);
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

