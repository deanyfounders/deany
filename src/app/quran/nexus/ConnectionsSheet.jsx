// The Connections sheet (spec sections 2, 7). "This ayah in DEANY" - lists the
// lesson-linked entries for a tapped ayah, each row rendered in one of three states
// from the reader's route progress via connectionState:
//   completed -> tick, opens the full lesson (secondary: just the story)
//   up_next   -> "up next in your route", opens the full lesson (secondary: story)
//   ahead     -> "Lesson n in your route. You are on lesson m." opens the STORY
//                CARD only; if the card is still pending, the row is non-tappable
//                with an "Under scholar review" tag. The route is never jumpable.
import React from 'react';
import { X, Check, ChevronRight } from 'lucide-react';
import { D, FONT, TYPE, RADIUS } from '../../dashboard/tokens.js';
import { connectionState } from '../../../lib/nexus/connectionState.js';
import { NEXUS_COPY } from '../../../lib/nexus/copy.js';
import { lessonTitle, routeName, lessonAccent, lessonTint } from '../../../lib/nexus/lessons.js';
import { storyApproved } from '../../../lib/nexus/stories.js';

export default function ConnectionsSheet({ ayahRef, entries = [], routeProgress = {}, onOpenLesson, onOpenStory, onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={NEXUS_COPY.sheetHeader} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(27,42,74,0.32)', fontFamily: FONT }}>
      <div className="deany-sheet-in" onClick={(e) => e.stopPropagation()}
        style={{ background: D.card, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxWidth: 520, width: '100%', margin: '0 auto', maxHeight: '82vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 18px calc(env(safe-area-inset-bottom) + 20px)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: D.border, margin: '6px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink }}>{NEXUS_COPY.sheetHeader}</h2>
          {ayahRef && <span style={{ fontSize: TYPE.meta, color: D.inkHint }}>{ayahRef}</span>}
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 999, border: 'none', background: 'none', color: D.inkHint, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
        </div>

        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {entries.length === 0 && (
            <div style={{ textAlign: 'center', color: D.inkHint, fontSize: TYPE.body, padding: '18px 0' }}>No lesson connections yet.</div>
          )}
          {entries.map((e, i) => (
            <ConnRow key={`${e.lesson_id}:${i}`} entry={e} routeProgress={routeProgress} onOpenLesson={onOpenLesson} onOpenStory={onOpenStory} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConnRow({ entry, routeProgress, onOpenLesson, onOpenStory }) {
  const entity = { lessonId: entry.lesson_id, route: entry.route, position: entry.position };
  const state = connectionState(entity, routeProgress);
  const title = lessonTitle(entry.lesson_id);
  const accent = lessonAccent(entry.lesson_id);
  const tint = lessonTint(entry.lesson_id);
  const m = (Number(routeProgress[entry.route]) || 0) + 1;
  const route = routeName(entry.lesson_id);
  const openLesson = () => onOpenLesson && onOpenLesson(entry.lesson_id, entity);
  const openStory = () => onOpenStory && onOpenStory(entity);

  const base = { width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, borderRadius: RADIUS.card, padding: '12px 14px', background: tint, border: `1px solid ${accent}33` };
  const badge = (
    <span style={{ width: 34, height: 34, borderRadius: 9, background: '#fff', border: `1px solid ${accent}44`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accent }}>
      {state === 'completed' ? <Check size={17} /> : <span style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />}
    </span>
  );

  if (state === 'ahead') {
    const ready = storyApproved(entry.lesson_id);
    const tag = ready ? NEXUS_COPY.aheadTag({ n: entry.position, route, m }) : NEXUS_COPY.gatedTag;
    return (
      <button onClick={ready ? openStory : undefined} disabled={!ready} className={ready ? 'dash-press' : ''}
        style={{ ...base, cursor: ready ? 'pointer' : 'default', opacity: ready ? 1 : 0.72 }}>
        {badge}
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 600, color: D.ink, lineHeight: 1.2 }}>{title}</span>
          <span style={{ display: 'block', fontSize: TYPE.meta, color: ready ? D.inkHint : '#8A6410', marginTop: 2 }}>{tag}</span>
        </span>
        {ready && <ChevronRight size={17} color={D.inkHint} />}
      </button>
    );
  }

  // completed / up_next: the full lesson opens; the story is a lighter secondary.
  const tag = state === 'up_next' ? NEXUS_COPY.upNextTag : NEXUS_COPY.completedTag;
  return (
    <div style={{ ...base, alignItems: 'stretch', flexDirection: 'column', gap: 10 }}>
      <button onClick={openLesson} className="dash-press" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
        {badge}
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 600, color: D.ink, lineHeight: 1.2 }}>{title}</span>
          <span style={{ display: 'block', fontSize: TYPE.meta, fontWeight: 700, color: state === 'up_next' ? D.tealDeep : accent, marginTop: 2 }}>{tag}</span>
        </span>
        <ChevronRight size={17} color={D.inkHint} />
      </button>
      <button onClick={openStory} className="dash-press" style={{ alignSelf: 'flex-start', border: 'none', background: 'none', color: D.inkSecondary, fontSize: TYPE.meta, fontWeight: 600, cursor: 'pointer', padding: '2px 0' }}>{NEXUS_COPY.justTheStory}</button>
    </div>
  );
}
