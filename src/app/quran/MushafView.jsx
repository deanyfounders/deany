// The mushaf renderer (v3): a paginated BOOK. Continuous, justified, flowing
// Arabic laid out into fixed pages you swipe through - not a vertical scroll.
// The three modes (read / learn / assist) toggle classes on the SAME tree; the
// DOM does not remount on mode change. Word spans exist in every mode and only
// become interactive in learn.
//
// PAGINATION: the text flows into CSS multi-columns. The .book box is sized to
// exactly ONE column (colWidth) with column-fill:auto and a fixed height, so the
// browser fragments the surah into full pages that overflow to the right; we
// translateX the .book to show one page at a time (the epub.js technique). The
// .book is dir=ltr so column order + scrollWidth are reliable; the inner .mushaf
// is dir=rtl so the Arabic composes correctly.
//
// BASMALAH: every surah except Al-Fatiha (surah 1, where it is the counted ayah
// 1) and At-Tawbah (surah 9, which has none) stores its opening basmalah as the
// first four tokens of ayah 1. We lift those four tokens onto a standalone
// centred line and render ayah 1 from the remainder - this is verbatim source
// text, only regrouped for display, never generated here.
//
// ACCURACY: this file decorates, never mutates. Word tokens are arabic_uthmani
// split on U+0020; the end-of-ayah marker is added from the verse key and never
// stored. The round-trip test proves join(tokens,' ') is byte-exact.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { D, FONT, TYPE } from '../dashboard/tokens.js';

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabicDigits = (n) => String(n).split('').map((d) => AR_DIGITS[+d] ?? d).join('');
const MARGIN = 18; // side margin per page (px)
const BASMALAH_TOKENS = 4; // the opening basmalah is always four words

export default function MushafView({ ayat, mode, arSize, highlightKey, selectedKeys, onTapAyah, onSajdah, onWord, srsWords, surahName }) {
  const viewportRef = useRef(null);
  const bookRef = useRef(null);
  const swipeRef = useRef({ x: 0, y: 0, swiped: false });
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.clientWidth, h: el.clientHeight });
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(measure); ro.observe(el); }
    return () => ro && ro.disconnect();
  }, []);

  useLayoutEffect(() => { setAnimate(false); setPage(0); }, [ayat, arSize, mode]);

  useEffect(() => {
    const el = bookRef.current;
    if (!el || !dims.w) return;
    const recount = () => {
      if (!bookRef.current) return;
      const n = Math.max(1, Math.round((bookRef.current.scrollWidth + 2 * MARGIN) / dims.w));
      setPageCount(n);
      setPage((p) => Math.min(p, n - 1));
    };
    recount();
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recount).catch(() => {});
    }
  }, [ayat, arSize, mode, dims.w, dims.h]);

  const go = (p) => { setAnimate(true); setPage(Math.max(0, Math.min(pageCount - 1, p))); };
  const next = () => go(page + 1);
  const prev = () => go(page - 1);

  const onTouchStart = (e) => { const t = e.touches[0]; swipeRef.current = { x: t.clientX, y: t.clientY, swiped: false }; };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0], s = swipeRef.current;
    const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      s.swiped = true;
      if (dx < 0) next(); else prev();
      window.setTimeout(() => { swipeRef.current.swiped = false; }, 350);
    }
  };

  const shown = ayat || [];
  const srs = srsWords || null;
  const colWidth = Math.max(1, dims.w - 2 * MARGIN);

  // lift the opening basmalah off ayah 1 onto its own line (all surahs but 1 & 9)
  const first = shown[0];
  const splitBasmalah = !!first && first.ayah === 1 && first.surah !== 1 && first.surah !== 9
    && first.arabic_uthmani.split(' ').length > BASMALAH_TOKENS;
  const basmalah = splitBasmalah ? first.arabic_uthmani.split(' ').slice(0, BASMALAH_TOKENS).join(' ') : null;

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: D.canvas }}>
      <div ref={viewportRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        <div ref={bookRef} dir="ltr"
          style={{
            position: 'absolute', top: 0, left: MARGIN, height: '100%',
            width: dims.w ? colWidth : '100%', boxSizing: 'border-box', padding: '10px 0',
            columnWidth: dims.w ? `${colWidth}px` : undefined,
            columnGap: `${2 * MARGIN}px`, columnFill: 'auto',
            transform: `translateX(${-page * dims.w}px)`,
            transition: animate ? 'transform .34s cubic-bezier(.4,0,.2,1)' : 'none',
            willChange: 'transform',
          }}>
          <div className={`mushaf mushaf-${mode}`} dir="rtl"
            style={{
              fontFamily: "'Scheherazade New','Amiri',serif",
              fontSize: arSize, lineHeight: 2.05, color: D.navy,
              textAlign: 'justify', textAlignLast: 'right', WebkitHyphens: 'none',
            }}>
            {(surahName || basmalah) && (
              <div style={{ breakInside: 'avoid', textAlign: 'center', margin: '2px 0 14px' }}>
                {surahName && (
                  <div className="quran-ar" style={{ display: 'inline-block', padding: '5px 26px', borderRadius: 9, border: '1.5px solid rgba(214,166,54,0.55)', background: 'linear-gradient(180deg, rgba(240,180,41,0.12), rgba(240,180,41,0.04))', color: D.quran, fontSize: '0.78em', lineHeight: 1.5 }}>
                    {surahName}
                  </div>
                )}
                {basmalah && (
                  <div className="quran-ar" dir="rtl" style={{ marginTop: 12, color: D.navy, fontSize: '0.9em', textAlign: 'center', textAlignLast: 'center', lineHeight: 1.9 }}>
                    {basmalah}
                  </div>
                )}
              </div>
            )}
            {shown.map((a, idx) => {
              let tokens = a.arabic_uthmani.split(' ');
              if (idx === 0 && splitBasmalah) tokens = tokens.slice(BASMALAH_TOKENS);
              const isHi = highlightKey === a.key;
              const isSel = selectedKeys && selectedKeys.includes(a.key);
              const bg = isSel ? 'rgba(240,180,41,0.22)' : isHi ? 'rgba(34,163,154,0.10)' : 'transparent';
              const tapAyah = (mode === 'read' || mode === 'assist') && onTapAyah
                ? () => { if (!swipeRef.current.swiped) onTapAyah(a); } : undefined;
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
        </div>
      </div>

      {/* page turner */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '7px 12px calc(env(safe-area-inset-bottom) + 7px)', background: D.canvas, borderTop: `1px solid ${D.border}` }}>
        <PageBtn label="Previous page" onClick={prev} disabled={page <= 0}><ChevronLeft size={20} /></PageBtn>
        <span style={{ fontSize: TYPE.hint, color: D.inkHint, minWidth: 84, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>Page {page + 1} of {pageCount}</span>
        <PageBtn label="Next page" onClick={next} disabled={page >= pageCount - 1}><ChevronRight size={20} /></PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, label, onClick, disabled }) {
  return (
    <button onClick={disabled ? undefined : onClick} aria-label={label} disabled={disabled} className={disabled ? '' : 'dash-press'}
      style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${disabled ? 'transparent' : D.border}`, background: disabled ? 'transparent' : D.card, color: disabled ? D.disabled : D.tealDeep, cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </button>
  );
}
