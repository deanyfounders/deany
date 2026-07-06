// Ayah of the day - two-stage collapse. Card language: white, hairline border,
// 16px radius. Mushaf green appears only on the icon tile, the Tafsir label,
// and the full-tafsir link. Arabic ink is navy. Collapsed by default every
// open (no persisted state). Quran typography matches the lesson screens.
import React, { useState } from 'react';
import { BookOpen, ChevronDown, Share2, Lightbulb } from 'lucide-react';
import { D, RADIUS, TYPE } from './tokens.js';
import { getAyahOfTheDay } from '../../content/ayahOfTheDay.js';

const MUSHAF = '#155E52';
const ARABIC = "'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif";

export default function AyahCard() {
  const [ayah] = useState(getAyahOfTheDay);
  const [expanded, setExpanded] = useState(false);
  const [tafsir, setTafsir] = useState(false);
  const [sheet, setSheet] = useState(false);

  const toggle = () => { const next = !expanded; setExpanded(next); if (!next) setTafsir(false); };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.card }}>
      {expanded && (
        <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true" style={{ position: 'absolute', bottom: -10, right: -8, opacity: 0.06, pointerEvents: 'none' }}>
          <g transform="translate(45 45) rotate(45)" fill="none" stroke={MUSHAF} strokeWidth="1.5">
            <rect x="-26" y="-26" width="52" height="52" />
            <rect x="-16" y="-16" width="32" height="32" transform="rotate(45)" />
          </g>
        </svg>
      )}

      {/* Collapsed header row - whole row is the hit area */}
      <button onClick={toggle} className="dash-press" style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'none', border: 'none',
        padding: '13px 14px', cursor: 'pointer', minHeight: 56, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}>
        <span style={{ width: 32, height: 32, borderRadius: RADIUS.tile, background: MUSHAF, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BookOpen size={17} color="#FBFAF6" strokeWidth={1.9} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>Ayah of the day</span>
          <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1 }}>{ayah.surahName} · {ayah.ref}</span>
        </span>
        {expanded && <span onClick={(e) => { e.stopPropagation(); }} style={{ padding: 6, color: D.inkFaint }} aria-label="Share"><Share2 size={17} /></span>}
        <ChevronDown size={19} color={D.inkFaint} style={{ flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }} />
      </button>

      {/* Stage 1: ayah + translation */}
      <div style={{ maxHeight: expanded ? 460 : 0, overflow: 'hidden', transition: 'max-height .22s ease-out' }}>
        <div style={{ position: 'relative', padding: '2px 16px 14px' }}>
          <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 24, lineHeight: 1.85, color: D.navy, textAlign: 'right', margin: '4px 0 12px' }}>{ayah.arabic}</div>
          <div style={{ fontSize: TYPE.meta, color: D.inkSecondary, lineHeight: 1.55, fontStyle: 'italic' }}>"{ayah.translation}"</div>

          {/* Tafsir toggle */}
          <div style={{ borderTop: `1px solid ${D.border}`, marginTop: 14 }}>
            <button onClick={() => setTafsir(t => !t)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: 'none', padding: '12px 0 0', cursor: 'pointer', minHeight: 40, WebkitTapHighlightColor: 'transparent' }}>
              <Lightbulb size={16} color={MUSHAF} />
              <span style={{ flex: 1, textAlign: 'left', fontSize: TYPE.body, fontWeight: 500, color: MUSHAF }}>Tafsir</span>
              <ChevronDown size={17} color={MUSHAF} style={{ transform: tafsir ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }} />
            </button>
            <div style={{ maxHeight: tafsir ? 260 : 0, overflow: 'hidden', transition: 'max-height .22s ease-out' }}>
              <div style={{ padding: '10px 0 2px' }}>
                <div style={{ fontSize: 11.5, color: '#4A5568', lineHeight: 1.55 }}>{ayah.tafsirLine}</div>
                <button onClick={() => setSheet(true)} style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, color: MUSHAF, fontSize: TYPE.meta, fontWeight: 500, cursor: 'pointer' }}>Read the full tafsir</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full tafsir sheet */}
      {sheet && (
        <>
          <div onClick={() => setSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,52,0.28)', zIndex: 60 }} />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 61, background: D.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '20px 20px calc(env(safe-area-inset-bottom) + 20px)', maxWidth: 520, margin: '0 auto', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontSize: TYPE.hint, color: MUSHAF, fontWeight: 500, marginBottom: 4 }}>{ayah.surahName} · {ayah.ref}</div>
            <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: 22, lineHeight: 1.85, color: D.navy, textAlign: 'right', margin: '6px 0 12px' }}>{ayah.arabic}</div>
            <div style={{ fontSize: TYPE.body, color: D.inkSecondary, lineHeight: 1.6, marginBottom: 14 }}>{ayah.tafsirFull}</div>
            <div style={{ fontSize: TYPE.hint, color: D.inkFaint }}>{ayah.source}</div>
          </div>
        </>
      )}
    </div>
  );
}
