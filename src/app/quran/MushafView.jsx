// The mushaf renderer (v2 Part C). Continuous, justified, flowing Arabic with
// inline verse markers - not one card per ayah. The three modes (read / learn /
// assist) toggle classes on the SAME tree; the DOM does not remount on mode
// change. Word spans exist in every mode and only become interactive in learn.
//
// ACCURACY: this file decorates, never mutates. Word tokens are arabic_uthmani
// split on U+0020; the end-of-ayah marker is added from the verse key and never
// stored. The round-trip test (scripts/test-mushaf-roundtrip.mjs) proves that
// joining the rendered tokens with single spaces is byte-identical to the source.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { D, FONT, TYPE } from '../dashboard/tokens.js';

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabicDigits = (n) => String(n).split('').map((d) => AR_DIGITS[+d] ?? d).join('');
const CHUNK = 12;

export default function MushafView({ ayat, mode, arSize, highlightKey, selectedKeys, onTapAyah, onSajdah, onWord, srsWords }) {
  const [visible, setVisible] = useState(CHUNK);
  const sentinelRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => { setVisible(CHUNK); }, [ayat]);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) setVisible((v) => Math.min(v + CHUNK, ayat ? ayat.length : v)); }, { root: scrollRef.current, rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ayat]);

  const shown = ayat ? ayat.slice(0, visible) : [];
  const srs = srsWords || null;

  return (
    <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 12px 24px' }}>
      <div
        className={`mushaf mushaf-${mode}`}
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: "'Scheherazade New','Amiri',serif",
          fontSize: arSize,
          lineHeight: 2.15,
          color: D.navy,
          textAlign: 'justify',
          textAlignLast: 'right',
          WebkitHyphens: 'none',
        }}
      >
        {shown.map((a) => {
          const tokens = a.arabic_uthmani.split(' ');
          const isHi = highlightKey === a.key;
          const isSel = selectedKeys && selectedKeys.includes(a.key);
          const bg = isSel ? 'rgba(240,180,41,0.22)' : isHi ? 'rgba(34,163,154,0.10)' : 'transparent';
          const tapAyah = (mode === 'read' || mode === 'assist') && onTapAyah ? () => onTapAyah(a) : undefined;
          return (
            <span key={a.key} className="ayah" data-key={a.key}
              onClick={tapAyah}
              style={{ background: bg, borderRadius: 6, cursor: tapAyah ? 'pointer' : 'default', transition: 'background .2s ease' }}>
              {tokens.map((w, i) => {
                const learnable = mode === 'learn' && onWord;
                const inSrs = srs && srs.has(`${a.key}:${i}`);
                return (
                  <React.Fragment key={i}>
                    <span className="w" data-i={i}
                      onClick={learnable ? (e) => { e.stopPropagation(); onWord(a, i, w); } : undefined}
                      style={{ cursor: learnable ? 'pointer' : 'inherit', borderBottom: inSrs ? `2px dotted ${D.teal}` : 'none' }}>{w}</span>
                    {i < tokens.length - 1 ? ' ' : ''}
                  </React.Fragment>
                );
              })}
              {' '}
              <span className="marker" aria-label={`Ayah ${a.ayah}`}
                style={{ position: 'relative', display: 'inline-block', width: '1.5em', height: '1.5em', verticalAlign: 'middle', margin: '0 2px', lineHeight: 1 }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5em', color: D.gold, lineHeight: 1 }}>{'۝'}</span>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58em', fontWeight: 700, color: D.navy, fontFamily: FONT }}>{toArabicDigits(a.ayah)}</span>
              </span>
              {a.sajdah && (
                <span onClick={(e) => { e.stopPropagation(); onSajdah && onSajdah(a); }}
                  role="button" aria-label="Sajdah"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 3, margin: '0 4px', padding: '1px 8px', borderRadius: 999, border: '1px solid #F0DFAE', background: '#FBF3DF', color: '#8A6410', fontFamily: FONT, fontSize: TYPE.hint, fontWeight: 700, cursor: 'pointer', verticalAlign: 'middle' }}>
                  Sajdah
                </span>
              )}
              {' '}
            </span>
          );
        })}
      </div>
      {ayat && visible < ayat.length && <div ref={sentinelRef} style={{ height: 1 }} />}
    </div>
  );
}
