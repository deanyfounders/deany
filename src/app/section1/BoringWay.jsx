// The boring way detour - a deliberately dry textbook page. After 1.5s a
// "Still awake?" sheet offers the DEANY way. The joke is the format, never the
// material. Filler is neutral finance definitions, tagged pending_mehdi.
import React, { useEffect, useRef, useState } from 'react';
import { S1Screen } from './ui.jsx';
import { ChunkyButton, GhostButton } from '../../onboarding/kit/buttons.jsx';
import { ChevronLeft } from 'lucide-react';
import { T, SERIF } from '../../onboarding/kit/tokens.js';

// pending_mehdi - neutral educational filler, not doctrine.
const FILLER = [
  'A financial obligation, in the broadest classical framing, denotes a duty arising from a contractual or quasi-contractual relationship whereby one party is bound to render a determinate performance to another. The performance may consist of the transfer of a corpus, the rendering of a service, or the forbearance from an act otherwise permissible. The obligation is said to mature upon the concurrence of its constitutive elements, namely offer, acceptance, subject matter, and a lawful cause, each of which has been the object of extensive and, at times, exhaustive commentary.',
  'The subject matter of an exchange must be ascertainable at the moment of contracting, for indeterminacy of a material degree vitiates the mutual consent upon which the transaction is predicated. Ascertainability is conventionally analysed along the axes of existence, deliverability, and specification. Where any axis is deficient beyond a tolerated threshold, the arrangement is reclassified and its enforceability reassessed according to the prevailing doctrinal apparatus, a process that occupies no small portion of the standard treatises.',
  'A guaranteed increment stipulated upon a sum advanced, irrespective of the fortunes of the underlying venture, is distinguished in the literature from a return contingent upon shared exposure to gain and loss. The distinction rests upon the allocation of risk, which is treated as the operative criterion. The elaboration of this criterion, together with its application to instruments of varying structure, has generated a body of secondary discussion of considerable length and, it must be conceded, of uneven readability.',
];

export default function BoringWay({ onDeanyWay, onBack }) {
  const [sheet, setSheet] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => { const t = setTimeout(() => { setSheet(true); shownRef.current = true; }, 1500); return () => clearTimeout(t); }, []);

  const onScroll = (e) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setSheet(true);
  };

  return (
    <S1Screen style={{ background: '#F7F5EF' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: 'calc(env(safe-area-inset-top) + 12px) 18px 6px' }}>
        <button onClick={onBack} aria-label="Back" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#8A8676' }}><ChevronLeft size={22} /></button>
        <span style={{ fontSize: 13, color: '#8A8676' }}>Chapter 1 - Foundations</span>
      </div>

      <div onScroll={onScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '10px 24px 40px' }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500, color: '#5C5848', margin: '4px 0 16px' }}>On the nature of financial obligation</h1>
        {FILLER.map((p, i) => (
          <p key={i} style={{ fontSize: 12, color: '#7A7666', lineHeight: 1.45, margin: '0 0 14px', textAlign: 'justify' }}>{p}</p>
        ))}
        <div style={{ textAlign: 'center', fontSize: 11, color: '#A8A492', marginTop: 20 }}>Page 1 of 47</div>
      </div>

      {sheet && (
        <>
          <div onClick={() => setSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(30,28,20,0.28)', zIndex: 60 }} />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 61, background: T.canvas, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: '22px 22px calc(env(safe-area-inset-bottom) + 18px)', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500, color: T.ink, marginBottom: 6 }}>Still awake?</div>
            <p style={{ fontSize: 13, color: T.inkSecondary, lineHeight: 1.5, margin: '0 0 18px' }}>There is a faster way to actually remember this.</p>
            <ChunkyButton onClick={onDeanyWay}>Try the DEANY way instead</ChunkyButton>
            <div style={{ marginTop: 6 }}><GhostButton onClick={() => setSheet(false)} style={{ color: T.inkHint }}>Keep reading</GhostButton></div>
          </div>
        </>
      )}
    </S1Screen>
  );
}
