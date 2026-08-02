// Personal review guide card (claude-code-task-review-guide.md). Reads ONLY from
// the async getSuggestion() interface, so the real deterministic selector drops in
// without any change here. Renders NOTHING when the suggestion is null, errors, or
// is still loading - no empty card, no spinner, no fallback filler string exists in
// this file. Exactly one suggestion, never a list.
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

// The suggestion's message is app-generated chrome with <b> already applied to the
// subject; render it as HTML. (It is never user input.)
export default function PersonalReviewGuide({ getSuggestion, onNavigate, onMore }) {
  const [sug, setSug] = useState(undefined); // undefined = loading, null = none, obj = show

  useEffect(() => {
    let alive = true;
    Promise.resolve().then(getSuggestion).then((s) => { if (alive) setSug(s || null); }).catch((e) => { if (alive) { setSug(null); if (typeof console !== 'undefined') console.warn('review guide unavailable', e); } });
    return () => { alive = false; };
  }, [getSuggestion]);

  if (!sug) return null; // loading or nothing due -> the card does not exist

  return (
    <div style={{ background: '#E9F6F1', borderRadius: 16, padding: '14px 16px', margin: '22px 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#22A39A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sparkles size={14} color="#fff" /></span>
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.09em', color: '#0B5E48' }}>PERSONAL REVIEW GUIDE</span>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.5, color: '#1B2A4A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: sug.message }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
        <button onClick={() => onNavigate && onNavigate(sug.route)}
          style={{ border: 'none', borderRadius: 999, background: '#22A39A', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '9px 16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 3px 0 #17827B', transition: 'transform 75ms ease, box-shadow 75ms ease' }}
          onPointerDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.35)'; }}
          onPointerUp={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.35), 0 3px 0 #17827B'; }}
          onPointerLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.35), 0 3px 0 #17827B'; }}>
          {sug.ctaLabel}
        </button>
        {sug.queueCount > 0 && (
          <button onClick={() => onMore && onMore()} style={{ border: 'none', background: 'none', color: '#5F8F82', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            +{sug.queueCount} more suggestion{sug.queueCount === 1 ? '' : 's'}
          </button>
        )}
      </div>
    </div>
  );
}
