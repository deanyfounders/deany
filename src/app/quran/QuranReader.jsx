// Qur'an reader (Part C2-C5). Fetches one surah on demand, renders ayah blocks
// in chunks (mount-on-scroll, never the whole surah at once), a translation
// layer rendered BESIDE the Arabic (keyed, so a second translation is a zero
// migration selector later), scriptural sajdah badges from metadata, an audio
// bar with controls shipped dark, and the required attribution footer.
//
// Arabic is displayed verbatim from the fetched surah JSON. This file never
// constructs or edits an Arabic string. When the text is still pending (scaffold
// build), arabic_uthmani is empty and a neutral placeholder shows instead.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Play, Bookmark, MoreHorizontal, Type, Settings, ChevronsDown, Repeat, X } from 'lucide-react';
import { D, FONT, RADIUS, TYPE } from '../dashboard/tokens.js';
import indexData from '../../data/quran-index.json';
import Attribution from './Attribution.jsx';
import MarkerSheet from './MarkerSheet.jsx';
import { getShowTranslation, setShowTranslation, getTextSize, setTextSize, setLastRead, isSaved, toggleSaved } from './store.js';

const SURAHS = indexData.surahs || [];
const AR_SIZES = [21, 24, 27, 31, 35]; // text-size steps
const CHUNK = 20;

export default function QuranReader({ surah, initialAyah, onBack }) {
  const meta = SURAHS.find((s) => s.surah === surah) || { surah, name_tr: `Surah ${surah}`, name_en: '', ayah_count: 0 };
  const [ayat, setAyat] = useState(null);      // null = loading, [] = error/empty
  const [pending, setPending] = useState(true);
  const [showT, setShowT] = useState(getShowTranslation());
  const [size, setSize] = useState(getTextSize());
  const [visible, setVisible] = useState(CHUNK);
  const [marker, setMarker] = useState(null);  // 'sajdah' | 'waqf' | 'audio-repeat'
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saved, setSaved] = useState(isSaved(surah));
  const [progress, setProgress] = useState(0);
  const sentinelRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setAyat(null);
    fetch(`/quran/surah/${surah}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('missing'))))
      .then((d) => { if (!alive) return; const list = Array.isArray(d) ? d : (d.ayat || []); setAyat(list); setPending(!!(d._pending) || (list[0] && !list[0].arabic_uthmani)); })
      .catch(() => { if (alive) setAyat([]); });
    return () => { alive = false; };
  }, [surah]);

  // last-read persistence
  useEffect(() => { setLastRead({ surah, ayah: initialAyah || 1 }); }, [surah, initialAyah]);

  // mount next chunk when the sentinel enters view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setVisible((v) => Math.min(v + CHUNK, (ayat ? ayat.length : v)));
    }, { rootMargin: '400px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ayat]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const p = el.scrollHeight > el.clientHeight ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0;
    setProgress(Math.max(0, Math.min(1, p)));
  };

  const toggleT = () => { const n = !showT; setShowT(n); setShowTranslation(n); };
  const bumpSize = () => { const n = (size + 1) % AR_SIZES.length; setSize(n); setTextSize(n); };
  const onSave = () => { toggleSaved(surah); setSaved(isSaved(surah)); };

  const arSize = AR_SIZES[Math.min(AR_SIZES.length - 1, size + (showT ? 0 : 1))]; // Arabic steps up when translation off
  const shown = ayat ? ayat.slice(0, visible) : [];

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: D.canvas }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 8px' }}>
          <IconBtn label="Back" onClick={onBack}><ArrowLeft size={19} /></IconBtn>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
            <div style={{ fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.name_tr}</div>
            <div style={{ fontSize: TYPE.hint, color: D.inkHint }}>Juz {meta.juz_start || '-'}{shown[0]?.hizb ? `, hizb ${shown[0].hizb}` : ''}</div>
          </div>
          <IconBtn label="Text size" onClick={bumpSize}><Type size={18} /></IconBtn>
          <IconBtn label="Settings" onClick={() => setSettingsOpen(true)}><Settings size={18} /></IconBtn>
        </div>
        <div style={{ height: 2.5, background: D.trackOnCanvas }}>
          <div style={{ height: '100%', width: `${Math.round(progress * 100)}%`, background: D.teal, transition: 'width .15s ease' }} />
        </div>
      </div>

      {/* body */}
      <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 16px' }}>
        {ayat === null && <Centered>Loading surah.</Centered>}
        {ayat && ayat.length === 0 && <Centered>This surah is not vendored yet. Add the Tanzil sources and run the build.</Centered>}

        {shown.map((a) => (
          <AyahBlock key={a.key} a={a} arSize={arSize} showT={showT} pending={pending} onSave={onSave} saved={saved}
            onSajdah={() => setMarker('sajdah')} onMore={() => setMarker('audio-repeat')} />
        ))}

        {ayat && visible < ayat.length && <div ref={sentinelRef} style={{ height: 1 }} />}

        {ayat && shown.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${D.border}` }}>
            <Attribution showTranslation={showT} />
          </div>
        )}
      </div>

      {settingsOpen && (
        <SettingsSheet showT={showT} onToggleT={toggleT} onOpenWaqf={() => { setSettingsOpen(false); setMarker('waqf'); }} onClose={() => setSettingsOpen(false)} />
      )}
      {marker && <MarkerSheet kind={marker} onClose={() => setMarker(null)} />}
    </div>
  );
}

function AyahBlock({ a, arSize, showT, pending, onSave, saved, onSajdah, onMore }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${D.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ minWidth: 30, height: 24, padding: '0 8px', borderRadius: 999, background: '#E9F6F4', color: D.tealDeep, fontSize: TYPE.hint, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{a.surah}:{a.ayah}</span>
        {a.sajdah && (
          <button onClick={onSajdah} className="dash-press" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, border: '1px solid #F0DFAE', background: '#FBF3DF', color: '#8A6410', fontFamily: FONT, fontSize: TYPE.hint, fontWeight: 700, cursor: 'pointer' }}>
            <ChevronsDown size={13} /> Sajdah
          </button>
        )}
        <span style={{ flex: 1 }} />
        {/* audio (dark), bookmark, more - app features, neutral styling */}
        <span title="Recitation coming soon" style={{ display: 'inline-flex' }}>
          <IconBtn label="Play" disabled><Play size={16} /></IconBtn>
        </span>
        <IconBtn label={saved ? 'Saved' : 'Bookmark'} onClick={onSave}><Bookmark size={16} fill={saved ? D.gold : 'none'} color={saved ? D.gold : undefined} /></IconBtn>
        <IconBtn label="More" onClick={onMore}><MoreHorizontal size={16} /></IconBtn>
      </div>

      {pending || !a.arabic_uthmani ? (
        <div dir="rtl" className="quran-ar" style={{ fontSize: arSize, lineHeight: 2, color: D.inkFaint, textAlign: 'right' }}>﴿ … ﴾ <span style={{ fontFamily: FONT, fontSize: TYPE.meta, direction: 'ltr', display: 'inline-block' }}> text pending</span></div>
      ) : (
        <p dir="rtl" className="quran-ar" style={{ fontSize: arSize, lineHeight: 2.1, color: D.ink, textAlign: 'right', margin: 0 }}>{a.arabic_uthmani}</p>
      )}

      {showT && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: TYPE.body, lineHeight: 1.6, color: D.inkSecondary, margin: 0 }}>{a.english || <span style={{ color: D.inkFaint }}>Translation pending.</span>}</p>
          <div style={{ fontSize: TYPE.hint, color: D.inkFaint, marginTop: 3 }}>Pickthall</div>
        </div>
      )}
    </div>
  );
}

function SettingsSheet({ showT, onToggleT, onOpenWaqf, onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Reader settings" onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 55, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(27,42,74,0.32)', fontFamily: FONT }}>
      <div className="deany-sheet-in" onClick={(e) => e.stopPropagation()}
        style={{ background: D.card, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxWidth: 520, width: '100%', margin: '0 auto', padding: '10px 20px calc(env(safe-area-inset-bottom) + 20px)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: D.border, margin: '6px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink }}>Reader settings</h2>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: 'none', color: D.inkHint, cursor: 'pointer' }}><X size={19} /></button>
        </div>
        <Row label="Show translation" hint="Pickthall, English">
          <Toggle on={showT} onClick={onToggleT} />
        </Row>
        <button onClick={onOpenWaqf} className="dash-press" style={{ width: '100%', textAlign: 'left', background: D.canvas, border: `1px solid ${D.border}`, borderRadius: 12, padding: '13px 14px', marginTop: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookIcon /> <span style={{ flex: 1, fontSize: TYPE.body, color: D.ink }}>About the symbols in this text</span>
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
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: TYPE.body, color: D.ink }}>{label}</div>
      {hint && <div style={{ fontSize: TYPE.hint, color: D.inkHint }}>{hint}</div>}
    </div>
    {children}
  </div>
);
const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} aria-pressed={on} style={{ width: 46, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? D.teal : D.border, position: 'relative', transition: 'background .2s ease' }}>
    <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .2s ease' }} />
  </button>
);
const BookIcon = () => <span style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: D.tealDeep }}><Repeat size={16} style={{ display: 'none' }} /><ChevronsDown size={16} style={{ display: 'none' }} /><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg></span>;

function IconBtn({ children, label, onClick, disabled }) {
  return (
    <button onClick={disabled ? undefined : onClick} aria-label={label} disabled={disabled} className={disabled ? '' : 'dash-press'}
      style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'none', color: disabled ? D.disabled : D.inkSecondary, cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </button>
  );
}
const Centered = ({ children }) => <div style={{ textAlign: 'center', color: D.inkHint, fontSize: TYPE.body, padding: '40px 20px', lineHeight: 1.6 }}>{children}</div>;
