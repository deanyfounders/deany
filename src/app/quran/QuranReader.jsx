// Qur'an reader (v2). One surface, three modes (Read / Learn / Assist) toggling
// classes on the same mushaf tree, plus a user choice of layout: the continuous
// mushaf (recommended) or the per-ayah cards (kept from v1). Arabic is shown
// verbatim from the fetched surah JSON; this file decorates, never mutates.
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, Bookmark, MoreHorizontal, Type, Settings, ChevronsDown, X, BookOpen, Languages, AlignJustify, LayoutList } from 'lucide-react';
import { D, FONT, RADIUS, TYPE } from '../dashboard/tokens.js';
import indexData from '../../data/quran-index.json';
import Attribution from './Attribution.jsx';
import MarkerSheet from './MarkerSheet.jsx';
import MushafView from './MushafView.jsx';
import { getShowTranslation, setShowTranslation, getTextSize, setTextSize, setLastRead, isSaved, toggleSaved, getMode, setMode, getLayout, setLayout } from './store.js';
import fatihaWords from '../../../content/quran-words/fatiha.json';

const SURAHS = indexData.surahs || [];
const AR_SIZES = [24, 27, 30];
// A small gold arabesque lattice tiled behind the header band. Inline SVG data-uri
// so it is self-contained under the app CSP (no external fetch).
const ORNAMENT = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Cg fill='none' stroke='%23B0872F' stroke-width='0.7' opacity='0.5'%3E%3Cpath d='M11 1 L21 11 L11 21 L1 11 Z'/%3E%3Cpath d='M11 6 L16 11 L11 16 L6 11 Z'/%3E%3C/g%3E%3C/svg%3E\")";
const CHUNK = 20;
const MODES = [['read', 'Read'], ['learn', 'Learn'], ['assist', 'Assist']];
// Only surahs with an approved word-data file get word interaction (pilot: Fatiha).
const WORD_DATA = { 1: fatihaWords };
const hasApprovedWords = (s) => WORD_DATA[s] && WORD_DATA[s].status === 'approved';

export default function QuranReader({ surah, initialAyah, onBack }) {
  const meta = SURAHS.find((s) => s.surah === surah) || { surah, name_tr: `Surah ${surah}`, name_en: '', ayah_count: 0 };
  const [ayat, setAyat] = useState(null);
  const [showT, setShowT] = useState(getShowTranslation());
  const [size, setSize] = useState(Math.min(getTextSize(), AR_SIZES.length - 1));
  const [layout, setLayoutState] = useState(getLayout());
  const [mode, setModeState] = useState(getMode());
  const [marker, setMarker] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saved, setSaved] = useState(isSaved(surah));
  const [tapAyah, setTapAyah] = useState(null);
  const [visible, setVisible] = useState(CHUNK);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let alive = true; setAyat(null); setVisible(CHUNK); setTapAyah(null);
    fetch(`/quran/surah/${surah}.json`).then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => { if (alive) setAyat(Array.isArray(d) ? d : (d.ayat || [])); }).catch(() => { if (alive) setAyat([]); });
    return () => { alive = false; };
  }, [surah]);
  useEffect(() => { setLastRead({ surah, ayah: initialAyah || 1 }); }, [surah, initialAyah]);
  // cards-mode incremental mount
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || layout !== 'cards' || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) setVisible((v) => Math.min(v + CHUNK, ayat ? ayat.length : v)); }, { rootMargin: '500px 0px' });
    io.observe(el); return () => io.disconnect();
  }, [ayat, layout]);

  const chooseMode = (m) => { setModeState(m); setMode(m); setTapAyah(null); };
  const chooseLayout = (l) => { setLayoutState(l); setLayout(l); };
  const toggleT = () => { const n = !showT; setShowT(n); setShowTranslation(n); if (!n) setTapAyah(null); };
  const bumpSize = () => { const n = (size + 1) % AR_SIZES.length; setSize(n); setTextSize(n); };
  const onSave = () => { toggleSaved(surah); setSaved(isSaved(surah)); };
  const arSize = AR_SIZES[size];

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', height: '100%', background: D.canvas }}>
      {/* header band: surah name (right), juz (left) */}
      <div style={{ flexShrink: 0, background: D.canvas, borderBottom: `1px solid ${D.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 10px 6px' }}>
          <IconBtn label="Back" onClick={onBack}><ArrowLeft size={19} /></IconBtn>
          <div style={{ flex: 1 }} />
          <IconBtn label={showT ? 'Hide translation' : 'Show translation'} active={showT} onClick={toggleT}><Languages size={18} /></IconBtn>
          <IconBtn label={layout === 'mushaf' ? 'Switch to cards' : 'Switch to mushaf'} onClick={() => chooseLayout(layout === 'mushaf' ? 'cards' : 'mushaf')}>{layout === 'mushaf' ? <LayoutList size={18} /> : <AlignJustify size={18} />}</IconBtn>
          <IconBtn label="Text size" onClick={bumpSize}><Type size={18} /></IconBtn>
          <IconBtn label="Settings" onClick={() => setSettingsOpen(true)}><Settings size={18} /></IconBtn>
        </div>
        <div style={{ margin: '2px 12px 10px', padding: 2, borderRadius: 11, background: 'linear-gradient(180deg, #CDAE5A, #9E7830)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            padding: '8px 15px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.45)',
            backgroundColor: '#FAF1D6', backgroundImage: ORNAMENT,
          }}>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12.5, color: '#7A5B1E', whiteSpace: 'nowrap' }}>Juz {meta.juz_start || '-'}</span>
            <span className="quran-ar" style={{ fontSize: 24, color: D.quran, fontWeight: 500, whiteSpace: 'nowrap' }}>{meta.name_ar || meta.name_tr}</span>
          </div>
        </div>
        {/* segmented control */}
        <div role="tablist" style={{ display: 'flex', gap: 0, margin: '0 16px 10px', background: D.card, border: `1px solid ${D.border}`, borderRadius: 12, padding: 4 }}>
          {MODES.map(([k, label]) => {
            const on = mode === k;
            return (
              <button key={k} role="tab" aria-selected={on} onClick={() => chooseMode(k)}
                style={{ flex: 1, minHeight: 38, border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: FONT, fontSize: TYPE.body, fontWeight: 600, background: on ? '#E9F6F4' : 'transparent', color: on ? D.tealDeep : D.inkHint }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* learn-mode honesty notice (no approved word data yet) */}
      {mode === 'learn' && !hasApprovedWords(surah) && (
        <div style={{ flexShrink: 0, margin: '10px 16px 0', padding: '9px 12px', borderRadius: 10, background: '#FBF3DF', border: '1px solid #F0DFAE', fontSize: TYPE.meta, color: '#8A6410', textAlign: 'center' }}>
          Word-by-word learning is coming to this surah.
        </div>
      )}

      {/* body */}
      {ayat === null && <Centered>Loading surah.</Centered>}
      {ayat && ayat.length === 0 && <Centered>This surah is not vendored yet.</Centered>}

      {ayat && ayat.length > 0 && layout === 'mushaf' && (
        <MushafView ayat={ayat} mode={mode} arSize={arSize}
          surahName={meta.name_ar || meta.name_tr}
          highlightKey={tapAyah?.key}
          onTapAyah={showT ? (a) => setTapAyah(a) : undefined}
          onSajdah={() => setMarker('sajdah')}
          onWord={hasApprovedWords(surah) ? () => {} : undefined} />
      )}

      {ayat && ayat.length > 0 && layout === 'cards' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 16px' }}>
          {ayat.slice(0, visible).map((a) => (
            <CardBlock key={a.key} a={a} arSize={arSize} showT={showT} onSave={onSave} saved={saved} onSajdah={() => setMarker('sajdah')} onMore={() => setMarker('audio-repeat')} />
          ))}
          {visible < ayat.length && <div ref={sentinelRef} style={{ height: 1 }} />}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${D.border}` }}><Attribution showTranslation={showT} /></div>
        </div>
      )}

      {/* tap-ayah translation panel (mushaf, read/assist) */}
      {tapAyah && (
        <TranslationPanel a={tapAyah} onClose={() => setTapAyah(null)} onSave={onSave} saved={saved} onSajdah={() => { setMarker('sajdah'); }} />
      )}

      {settingsOpen && (
        <SettingsSheet showT={showT} onToggleT={toggleT}
          onOpenWaqf={() => { setSettingsOpen(false); setMarker('waqf'); }} onClose={() => setSettingsOpen(false)} />
      )}
      {marker && <MarkerSheet kind={marker} onClose={() => setMarker(null)} />}
    </div>
  );
}

function TranslationPanel({ a, onClose, onSave, saved, onSajdah }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 55, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(27,42,74,0.28)' }}>
      <div className="deany-sheet-in" onClick={(e) => e.stopPropagation()} style={{ background: D.card, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxWidth: 520, width: '100%', margin: '0 auto', padding: '10px 20px calc(env(safe-area-inset-bottom) + 20px)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: D.border, margin: '6px auto 12px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ padding: '2px 9px', borderRadius: 999, background: '#E9F6F4', color: D.tealDeep, fontSize: TYPE.hint, fontWeight: 700 }}>{a.key}</span>
          {a.sajdah && <button onClick={onSajdah} style={{ padding: '2px 9px', borderRadius: 999, border: '1px solid #F0DFAE', background: '#FBF3DF', color: '#8A6410', fontFamily: FONT, fontSize: TYPE.hint, fontWeight: 700, cursor: 'pointer' }}>Sajdah</button>}
          <span style={{ flex: 1 }} />
          <span title="Recitation coming soon"><IconBtn label="Play" disabled><Play size={16} /></IconBtn></span>
          <IconBtn label={saved ? 'Saved' : 'Bookmark'} onClick={onSave}><Bookmark size={16} fill={saved ? D.gold : 'none'} color={saved ? D.gold : undefined} /></IconBtn>
        </div>
        <p dir="rtl" className="quran-ar" style={{ fontSize: 24, lineHeight: 2, color: D.navy, margin: '0 0 10px', textAlign: 'right' }}>{a.arabic_uthmani}</p>
        <p style={{ fontSize: TYPE.body, lineHeight: 1.6, color: D.inkSecondary, margin: 0 }}>{a.english}</p>
        <div style={{ fontSize: TYPE.hint, color: D.inkFaint, marginTop: 4 }}>Pickthall</div>
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${D.border}` }}><Attribution showTranslation compact /></div>
      </div>
    </div>
  );
}

// v1 per-ayah card, kept as the alternate layout.
function CardBlock({ a, arSize, showT, onSave, saved, onSajdah, onMore }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${D.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ minWidth: 30, height: 24, padding: '0 8px', borderRadius: 999, background: '#E9F6F4', color: D.tealDeep, fontSize: TYPE.hint, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{a.surah}:{a.ayah}</span>
        {a.sajdah && <button onClick={onSajdah} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, border: '1px solid #F0DFAE', background: '#FBF3DF', color: '#8A6410', fontFamily: FONT, fontSize: TYPE.hint, fontWeight: 700, cursor: 'pointer' }}><ChevronsDown size={13} /> Sajdah</button>}
        <span style={{ flex: 1 }} />
        <span title="Recitation coming soon"><IconBtn label="Play" disabled><Play size={16} /></IconBtn></span>
        <IconBtn label={saved ? 'Saved' : 'Bookmark'} onClick={onSave}><Bookmark size={16} fill={saved ? D.gold : 'none'} color={saved ? D.gold : undefined} /></IconBtn>
        <IconBtn label="More" onClick={onMore}><MoreHorizontal size={16} /></IconBtn>
      </div>
      <p dir="rtl" className="quran-ar" style={{ fontSize: arSize, lineHeight: 2.1, color: D.navy, textAlign: 'right', margin: 0 }}>{a.arabic_uthmani}</p>
      {showT && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: TYPE.body, lineHeight: 1.6, color: D.inkSecondary, margin: 0 }}>{a.english}</p>
          <div style={{ fontSize: TYPE.hint, color: D.inkFaint, marginTop: 3 }}>Pickthall</div>
        </div>
      )}
    </div>
  );
}

function SettingsSheet({ showT, onToggleT, onOpenWaqf, onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Reader settings" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(27,42,74,0.32)', fontFamily: FONT }}>
      <div className="deany-sheet-in" onClick={(e) => e.stopPropagation()} style={{ background: D.card, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxWidth: 520, width: '100%', margin: '0 auto', padding: '10px 20px calc(env(safe-area-inset-bottom) + 20px)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: D.border, margin: '6px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink }}>Reader settings</h2>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: 'none', color: D.inkHint, cursor: 'pointer' }}><X size={19} /></button>
        </div>
        <Row label="Show translation" hint="Pickthall, English"><Toggle on={showT} onClick={onToggleT} /></Row>
        <button onClick={onOpenWaqf} className="dash-press" style={{ width: '100%', textAlign: 'left', background: D.canvas, border: `1px solid ${D.border}`, borderRadius: 12, padding: '13px 14px', marginTop: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={16} color={D.tealDeep} /><span style={{ flex: 1, fontSize: TYPE.body, color: D.ink }}>About the symbols in this text</span>
        </button>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${D.border}` }}>
          <div style={{ fontSize: TYPE.hint, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: D.inkHint, marginBottom: 6 }}>Sources</div>
          <Attribution showTranslation compact />
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, hint, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
    <div style={{ flex: 1 }}><div style={{ fontSize: TYPE.body, color: D.ink }}>{label}</div>{hint && <div style={{ fontSize: TYPE.hint, color: D.inkHint }}>{hint}</div>}</div>
    {children}
  </div>
);
const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} aria-pressed={on} style={{ width: 46, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? D.teal : D.border, position: 'relative', transition: 'background .2s ease' }}>
    <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .2s ease' }} />
  </button>
);
function IconBtn({ children, label, onClick, disabled, active }) {
  return (
    <button onClick={disabled ? undefined : onClick} aria-label={label} aria-pressed={active} disabled={disabled} className={disabled ? '' : 'dash-press'}
      style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: active ? '#E9F6F4' : 'none', color: disabled ? D.disabled : active ? D.tealDeep : D.inkSecondary, cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</button>
  );
}
const Centered = ({ children }) => <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: D.inkHint, fontSize: TYPE.body, padding: '40px 20px' }}>{children}</div>;
