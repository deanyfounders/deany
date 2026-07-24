// Bottom sheet for the interactive markers (Part C4). One component, fed by the
// Mehdi-authored content JSON. Claude Code does not author the rulings: until a
// file's status is 'approved', the sheet shows the marker name and an
// under-review line instead of body text.
import React, { useEffect } from 'react';
import { X, ChevronsDown, BookOpen, Repeat } from 'lucide-react';
import { D, FONT, RADIUS, TYPE } from '../dashboard/tokens.js';
import sajdahContent from '../../../content/quran-markers/sajdah.json';
import waqfContent from '../../../content/quran-markers/waqf-marks.json';
import repeatContent from '../../../content/quran-markers/audio-repeat.json';

const SOURCES = { sajdah: sajdahContent, waqf: waqfContent, 'audio-repeat': repeatContent };
const META = {
  sajdah: { Icon: ChevronsDown, fallbackTitle: 'Sajdah', accent: D.gold },
  waqf: { Icon: BookOpen, fallbackTitle: 'About the symbols in this text', accent: D.tealDeep },
  'audio-repeat': { Icon: Repeat, fallbackTitle: 'Repeat', accent: D.inkSecondary },
};

export default function MarkerSheet({ kind, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (typeof window !== 'undefined') window.addEventListener('keydown', onKey);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  if (!kind) return null;
  const content = SOURCES[kind] || {};
  const meta = META[kind] || META.sajdah;
  const approved = content.status === 'approved';
  const title = (approved && content.title) || meta.fallbackTitle;

  return (
    <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(27,42,74,0.32)', fontFamily: FONT }}>
      <div className="deany-sheet-in" onClick={(e) => e.stopPropagation()}
        style={{ background: D.card, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxWidth: 520, width: '100%', margin: '0 auto', maxHeight: '82vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 20px calc(env(safe-area-inset-bottom) + 22px)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: D.border, margin: '6px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: `${meta.accent}1F`, color: meta.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {React.createElement(meta.Icon, { size: 18 })}
          </span>
          <h2 style={{ flex: 1, margin: 0, fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink }}>{title}</h2>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: 'none', color: D.inkHint, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={19} /></button>
        </div>

        {!approved ? (
          <div style={{ background: '#FBF3DF', border: `1px solid #F0DFAE`, borderRadius: RADIUS.card, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontSize: TYPE.body, lineHeight: 1.6, color: '#8A6410' }}>
              Explanation coming soon, under scholar review.
            </p>
          </div>
        ) : (
          <ApprovedBody kind={kind} content={content} />
        )}
      </div>
    </div>
  );
}

// Rendered only once Mehdi's content is approved. Reads the schema fields.
function ApprovedBody({ kind, content }) {
  const Section = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: TYPE.hint, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: D.inkHint, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
  const p = { fontSize: TYPE.body, lineHeight: 1.65, color: D.ink, margin: 0 };
  return (
    <div>
      {content.what_it_means && <Section label="What this marker means"><p style={p}>{content.what_it_means}</p></Section>}
      {Array.isArray(content.what_to_do) && content.what_to_do.filter(Boolean).length > 0 && (
        <Section label="What to do">
          <ol style={{ ...p, paddingLeft: 18, display: 'grid', gap: 4 }}>{content.what_to_do.filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}</ol>
        </Section>
      )}
      {content.why && <Section label="Why"><p style={p}>{content.why}</p></Section>}
      {Array.isArray(content.rulings) && content.rulings.filter((r) => r.school).length > 0 && (
        <Section label="Do I have to?">
          <div style={{ display: 'grid', gap: 8 }}>
            {content.rulings.filter((r) => r.school).map((r, i) => (
              <div key={i} style={{ background: D.canvas, border: `1px solid ${D.border}`, borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: TYPE.meta, fontWeight: 700, color: D.tealDeep }}>{r.school}</div>
                <div style={{ fontSize: TYPE.body, color: D.inkSecondary, marginTop: 2 }}>{r.position}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {Array.isArray(content.sources) && content.sources.filter((s) => s.ref).length > 0 && (
        <Section label="Sources">
          <div style={{ display: 'grid', gap: 4 }}>
            {content.sources.filter((s) => s.ref).map((s, i) => (
              <div key={i} style={{ fontSize: TYPE.meta, color: D.inkSecondary }}><strong style={{ color: D.ink }}>{s.ref}</strong>{s.note ? ` ${s.note}` : ''}</div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
