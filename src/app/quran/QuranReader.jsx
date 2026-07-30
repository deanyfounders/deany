// Qur'an reader (v2). One surface, three modes (Read / Learn / Assist) toggling
// classes on the same mushaf tree, plus a user choice of layout: the continuous
// mushaf (recommended) or the per-ayah cards (kept from v1). Arabic is shown
// verbatim from the fetched surah JSON; this file decorates, never mutates.
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, Bookmark, MoreHorizontal, Type, Settings, ChevronsDown, X, BookOpen } from 'lucide-react';
import { D, FONT, RADIUS, TYPE } from '../dashboard/tokens.js';
import indexData from '../../data/quran-index.json';
import Attribution from './Attribution.jsx';
import MarkerSheet from './MarkerSheet.jsx';
import MushafView from './MushafView.jsx';
import { getShowTranslation, setShowTranslation, getTextSize, setTextSize, setLastRead, isSaved, toggleSaved, getMode, setMode, getLayout, setLayout } from './store.js';
import fatihaWords from '../../../content/quran-words/fatiha.json';
import { nexusPilotEnabled, IS_PROD } from '../../lib/flags.js';
import { loadRefmap, entriesForAyah, paintableKeys, getRouteProgress } from '../../lib/nexus/refmap.js';
import ConnectionsSheet from './nexus/ConnectionsSheet.jsx';
import StoryCard from './nexus/StoryCard.jsx';

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

export default function QuranReader({ surah, initialAyah, onBack, onOpenLesson }) {
  const meta = SURAHS.find((s) => s.surah === surah) || { surah, name_tr: `Surah ${surah}`, name_en: '', ayah_count: 0 };
  const nexusOn = nexusPilotEnabled(); // hard-off in prod; dev/opt-in shows pending marked
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
  const [currentJuz, setCurrentJuz] = useState(meta.juz_from || meta.juz_start || 1);
  const [refmapDoc, setRefmapDoc] = useState(null);      // nexus connections for this surah
  const [nexusAyah, setNexusAyah] = useState(null);      // ayah whose Connections sheet is open
  const [storyEntity, setStoryEntity] = useState(null);  // {lessonId, route, position} whose card is open
  const [storyAyahRef, setStoryAyahRef] = useState('');
  const sentinelRef = useRef(null);

  useEffect(() => {
    let alive = true; setAyat(null); setVisible(CHUNK); setTapAyah(null); setCurrentJuz(meta.juz_from || meta.juz_start || 1);
    setNexusAyah(null); setStoryEntity(null);
    fetch(`/quran/surah/${surah}.json`).then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => { if (alive) setAyat(Array.isArray(d) ? d : (d.ayat || [])); }).catch(() => { if (alive) setAyat([]); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah]);
  // Load the nexus refmap for this surah (only when the pilot flag is on).
  useEffect(() => {
    if (!nexusOn) { setRefmapDoc(null); return; }
    let alive = true;
    loadRefmap(surah).then((doc) => { if (alive) setRefmapDoc(doc); });
    return () => { alive = false; };
  }, [surah, nexusOn]);
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

  // Nexus: which ayat paint a dot (approved always; pending only in dev builds),
  // and the entries visible for a given ayah. Prod + pending => nothing paints.
  const visibleEntries = (es) => (es || []).filter((e) => e.status === 'approved' || !IS_PROD);
  const connectedKeys = (nexusOn && refmapDoc) ? paintableKeys(refmapDoc, !IS_PROD) : null;
  const openConnections = (a) => { setTapAyah(null); setNexusAyah(a); };
  const tapConnCount = (nexusOn && refmapDoc && tapAyah) ? visibleEntries(entriesForAyah(refmapDoc, tapAyah.key)).length : 0;

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', height: '100%', background: D.canvas }}>
      {/* one compact header row: back | ornate band (live juz + surah) | size | settings */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: D.canvas, borderBottom: `1px solid ${D.border}` }}>
        <IconBtn label="Back" onClick={onBack}><ArrowLeft size={19} /></IconBtn>
        <div style={{ flex: 1, minWidth: 0, padding: 2, borderRadius: 10, background: 'linear-gradient(180deg, #CDAE5A, #9E7830)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: '5px 13px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.45)',
            backgroundColor: '#FAF1D6', backgroundImage: ORNAMENT,
          }}>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, color: '#7A5B1E', whiteSpace: 'nowrap' }}>Juz {(layout === 'mushaf' ? currentJuz : (meta.juz_from || meta.juz_start)) || '-'}</span>
            <span className="quran-ar" style={{ fontSize: 21, color: D.quran, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.name_ar || meta.name_tr}</span>
          </div>
        </div>
        <IconBtn label="Text size" onClick={bumpSize}><Type size={18} /></IconBtn>
        <IconBtn label="Settings" onClick={() => setSettingsOpen(true)}><Settings size={18} /></IconBtn>
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
          initialKey={initialAyah ? `${surah}:${initialAyah}` : null}
          highlightKey={tapAyah?.key}
          onTapAyah={(a) => setTapAyah(a)}
          onVisibleAyah={(a) => a && a.juz && setCurrentJuz(a.juz)}
          onSajdah={() => setMarker('sajdah')}
          connectedKeys={mode === 'learn' ? connectedKeys : null}
          onConnectionTap={(a) => openConnections(a)}
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

      {/* tap-ayah translation panel (mushaf, read/assist). Read mode also shows a
          quiet Connections row; assist never shows any nexus surface. */}
      {tapAyah && (
        <TranslationPanel a={tapAyah} onClose={() => setTapAyah(null)} onSave={onSave} saved={saved} onSajdah={() => { setMarker('sajdah'); }}
          connectionCount={mode === 'read' ? tapConnCount : 0}
          onOpenConnections={() => openConnections(tapAyah)} />
      )}

      {/* Connections sheet + story card (Learn dot tap or Read panel row) */}
      {nexusAyah && (
        <ConnectionsSheet ayahRef={`${meta.name_tr} ${nexusAyah.key}`}
          entries={visibleEntries(entriesForAyah(refmapDoc, nexusAyah.key))}
          routeProgress={getRouteProgress()}
          onOpenLesson={(lessonId) => { setNexusAyah(null); onOpenLesson && onOpenLesson(lessonId); }}
          onOpenStory={(entity) => { setStoryAyahRef(nexusAyah ? `${meta.name_tr} ${nexusAyah.key}` : ''); setNexusAyah(null); setStoryEntity(entity); }}
          onClose={() => setNexusAyah(null)} />
      )}
      {storyEntity && (
        <StoryCard entity={storyEntity} ayahRef={storyAyahRef} routeProgress={getRouteProgress()}
          onRemind={() => {}} onXp={() => {}} onClose={() => setStoryEntity(null)} />
      )}

      {settingsOpen && (
        <SettingsSheet showT={showT} onToggleT={toggleT}
          mode={mode} onMode={chooseMode} layout={layout} onLayout={chooseLayout}
          onOpenWaqf={() => { setSettingsOpen(false); setMarker('waqf'); }} onClose={() => setSettingsOpen(false)} />
      )}
      {marker && <MarkerSheet kind={marker} onClose={() => setMarker(null)} />}
    </div>
  );
}

function TranslationPanel({ a, onClose, onSave, saved, onSajdah, connectionCount = 0, onOpenConnections }) {
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
        {connectionCount > 0 && (
          <button onClick={onOpenConnections} className="dash-press"
            style={{ marginTop: 12, width: '100%', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', background: '#E9F6F4', border: '1px solid #C9E8E2', borderRadius: RADIUS.card, padding: '11px 14px', cursor: 'pointer' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={16} color={D.tealDeep} /></span>
            <span style={{ flex: 1, fontSize: TYPE.body, fontWeight: 600, color: D.ink }}>Connections</span>
            <span style={{ minWidth: 22, height: 22, padding: '0 7px', borderRadius: 999, background: D.tealDeep, color: '#fff', fontSize: TYPE.hint, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{connectionCount}</span>
          </button>
        )}
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

function SettingsSheet({ showT, onToggleT, mode, onMode, layout, onLayout, onOpenWaqf, onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Reader settings" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(27,42,74,0.32)', fontFamily: FONT }}>
      <div className="deany-sheet-in" onClick={(e) => e.stopPropagation()} style={{ background: D.card, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxWidth: 520, width: '100%', margin: '0 auto', padding: '10px 20px calc(env(safe-area-inset-bottom) + 20px)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: D.border, margin: '6px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink }}>Reader settings</h2>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: 'none', color: D.inkHint, cursor: 'pointer' }}><X size={19} /></button>
        </div>
        <SegRow label="Layout" options={[['mushaf', 'Mushaf'], ['cards', 'Cards']]} value={layout} onChange={onLayout} />
        <SegRow label="Mode" options={MODES} value={mode} onChange={onMode} />
        <Row label="Show translation" hint="Pickthall, English · shown under each ayah in Cards"><Toggle on={showT} onClick={onToggleT} /></Row>
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
const SegRow = ({ label, options, value, onChange }) => (
  <div style={{ padding: '10px 0' }}>
    <div style={{ fontSize: TYPE.body, color: D.ink, marginBottom: 8 }}>{label}</div>
    <div role="tablist" style={{ display: 'flex', gap: 0, background: D.canvas, border: `1px solid ${D.border}`, borderRadius: 12, padding: 4 }}>
      {options.map(([k, lbl]) => {
        const on = value === k;
        return (
          <button key={k} role="tab" aria-selected={on} onClick={() => onChange(k)}
            style={{ flex: 1, minHeight: 40, border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: FONT, fontSize: TYPE.body, fontWeight: 600, background: on ? '#E9F6F4' : 'transparent', color: on ? D.tealDeep : D.inkHint }}>
            {lbl}
          </button>
        );
      })}
    </div>
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
