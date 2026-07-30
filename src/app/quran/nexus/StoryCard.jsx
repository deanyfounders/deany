// The story card (spec section 3). A standalone, scrollable narrative of a linked
// lesson's story: sections, why this ayah connects, and nothing pedagogical - no
// drills, no XP header, no lesson chrome. Footer names the lesson's route position
// and offers "Remind me when I arrive". Ends with the card check. All narrative and
// question content is Mehdi-authored; until approved this renders "Under scholar
// review", never invented text.
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { D, FONT, TYPE, RADIUS } from '../../dashboard/tokens.js';
import { NEXUS_COPY } from '../../../lib/nexus/copy.js';
import { lessonTitle, routeName, lessonAccent, lessonTint } from '../../../lib/nexus/lessons.js';
import CardCheck from './CardCheck.jsx';
import { STORY_CARDS as CARDS } from '../../../lib/nexus/stories.js';

export default function StoryCard({ entity, ayahRef, routeProgress = {}, onRemind, onClose, onXp, card: cardOverride }) {
  const [reminded, setReminded] = useState(false);
  const [checkDone, setCheckDone] = useState(false);
  if (!entity) return null;

  // cardOverride is for preview/tests only; production reads the gated content file.
  const card = cardOverride || CARDS[entity.lessonId] || { status: 'pending_mehdi', sections: [], card_check: [] };
  const approved = card.status === 'approved';
  const title = lessonTitle(entity.lessonId);
  const accent = lessonAccent(entity.lessonId);
  const tint = lessonTint(entity.lessonId);
  const n = entity.position;
  const route = routeName(entity.lessonId);

  const remind = () => { if (reminded) return; setReminded(true); onRemind && onRemind(entity); };

  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      style={{ position: 'fixed', inset: 0, zIndex: 62, background: D.canvas, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      {/* top bar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${D.border}`, background: D.canvas }}>
        <button onClick={onClose} aria-label="Back" className="dash-press" style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'none', color: D.inkSecondary, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={19} /></button>
        <span style={{ fontSize: TYPE.hint, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: accent }}>The story</span>
      </div>

      <div className="deany-sheet-in" style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '18px 20px calc(env(safe-area-inset-bottom) + 24px)', maxWidth: 560, width: '100%', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: TYPE.screenTitle, fontWeight: 600, color: D.ink }}>{title}</h1>
        {ayahRef && <div style={{ display: 'inline-block', marginBottom: 16, padding: '3px 10px', borderRadius: 999, background: tint, border: `1px solid ${accent}55`, color: accent, fontSize: TYPE.hint, fontWeight: 700 }}>{ayahRef}</div>}

        {!approved ? (
          <div style={{ background: '#FBF3DF', border: '1px solid #F0DFAE', borderRadius: RADIUS.card, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontSize: TYPE.body, lineHeight: 1.6, color: '#8A6410' }}>{NEXUS_COPY.gatedTag}. The story for this lesson is being written and checked before it appears here.</p>
          </div>
        ) : (
          <>
            {(card.sections || []).map((s, i) => (
              <section key={i} style={{ marginBottom: 18 }}>
                {s.heading && <h2 style={{ margin: '0 0 6px', fontSize: TYPE.sectionHeading, fontWeight: 700, color: D.ink }}>{s.heading}</h2>}
                {s.body && <p style={{ margin: 0, fontSize: TYPE.body, lineHeight: 1.65, color: D.inkSecondary }}>{s.body}</p>}
              </section>
            ))}

            {card.connection_note && (
              <div style={{ marginTop: 6, marginBottom: 18, padding: '14px 16px', borderRadius: RADIUS.card, background: tint, border: `1px solid ${accent}33` }}>
                <div style={{ fontSize: TYPE.hint, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: accent, marginBottom: 5 }}>Why this ayah connects</div>
                <p style={{ margin: 0, fontSize: TYPE.body, lineHeight: 1.6, color: D.inkSecondary }}>{card.connection_note}</p>
              </div>
            )}

            {/* footer: route position + remind */}
            <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${D.border}` }}>
              <p style={{ margin: '0 0 12px', fontSize: TYPE.body, color: D.inkSecondary }}>{NEXUS_COPY.storyFooter({ n, route })}</p>
              {reminded
                ? <div style={{ fontSize: TYPE.body, color: D.tealDeep, fontWeight: 600 }}>{NEXUS_COPY.remindConfirm}</div>
                : <button onClick={remind} className="dash-press" style={{ minHeight: 46, padding: '0 18px', borderRadius: RADIUS.btnInCard, border: `1px solid ${D.tealDeep}`, background: '#E9F6F4', color: D.tealDeep, fontFamily: FONT, fontSize: TYPE.body, fontWeight: 700, cursor: 'pointer' }}>{NEXUS_COPY.remindAction}</button>}
            </div>

            {/* end-of-card check (tests the story just read) */}
            {!checkDone
              ? <CardCheck questions={card.card_check} onComplete={(correct) => { setCheckDone(true); onXp && onXp(entity.lessonId, correct); }} onSkip={() => setCheckDone(true)} />
              : <div style={{ marginTop: 18, borderTop: `1px solid ${D.border}`, paddingTop: 16, fontSize: TYPE.body, color: D.inkHint }}>Check complete.</div>}
          </>
        )}
      </div>
    </div>
  );
}
