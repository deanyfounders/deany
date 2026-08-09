// Qur'an index (Part C1): search, Surah / Juz / Saved segmented control, a
// continue-reading banner, and the surah list. Built from the bundled index.
import React, { useMemo, useState } from 'react';
import { Search, BookOpen, ArrowRight, X } from 'lucide-react';
import { D, FONT, RADIUS, TYPE } from '../dashboard/tokens.js';
import indexData from '../../data/quran-index.json';
import { getLastRead, getSaved } from './store.js';
import { JUZ_LIST, surahCompositionOfJuz, juzOfAyah, rangeOfJuz, pageStart } from './juz.js';

const SURAHS = indexData.surahs || [];
const FULL_INDEX = indexData._generated === true && SURAHS.length === 114;
const surahOf = (n) => SURAHS.find((x) => x.surah === n);
// Which juz an ayah belongs to - the single derivation layer (juz.js), never a
// duplicated boundary list.
const juzOfKey = (surah, ayah) => juzOfAyah(surah, ayah);
const juzLabel = (s) => (s.juz_from && s.juz_to && s.juz_to !== s.juz_from) ? `Juz ${s.juz_from}-${s.juz_to}` : `Juz ${s.juz_from || s.juz_start || ''}`;

export default function QuranIndex({ onOpenSurah, seg = 'surah', onSeg }) {
  const [q, setQ] = useState('');
  const setSeg = onSeg || (() => {});
  const last = getLastRead();
  const saved = getSaved();
  const query = q.trim().toLowerCase();

  // Tab list (surah/saved), independent of the search box.
  const tabList = useMemo(() => (seg === 'saved' ? SURAHS.filter((x) => saved.includes(x.surah)) : SURAHS), [seg, saved]);

  // Live search across ALL surahs (name, meaning, number, or a key like 2:255) -
  // shown as a dropdown of matches the moment you start typing, on any tab.
  // Go-to accepts surah, surah:ayah, "juz N" and "page N" (spec UI 5); otherwise a
  // fuzzy surah search. Every result opens the reader at an exact ref.
  const matches = useMemo(() => {
    if (!query) return [];
    const jm = query.match(/^juz\s*(\d+)$/);
    if (jm) { const n = +jm[1]; const r = rangeOfJuz(n); if (!r) return []; const s = surahOf(r.start[0]); return [{ kind: 'goto', key: `juz${n}`, badge: 'J' + n, surah: r.start[0], ayah: r.start[1], title: `Juz ${n} · ${r.name}`, sub: `Starts ${s ? s.name_tr : ''} ${r.start[0]}:${r.start[1]}` }]; }
    const pm = query.match(/^page\s*(\d+)$/);
    if (pm) { const n = +pm[1]; const ref = pageStart(n); if (!ref) return []; const s = surahOf(ref[0]); return [{ kind: 'goto', key: `page${n}`, badge: 'P', surah: ref[0], ayah: ref[1], title: `Page ${n}`, sub: `${s ? s.name_tr : ''} ${ref[0]}:${ref[1]}` }]; }
    const rm = query.match(/^(\d{1,3}):(\d{1,3})$/);
    if (rm) { const s = +rm[1], a = +rm[2]; const su = surahOf(s); if (su && a >= 1 && a <= su.ayah_count) return [{ kind: 'goto', key: `${s}:${a}`, badge: '' + s, surah: s, ayah: a, title: `${su.name_tr} ${s}:${a}`, sub: `Juz ${juzOfAyah(s, a)}` }]; }
    return SURAHS.filter((x) =>
      x.name_tr.toLowerCase().includes(query) || x.name_en.toLowerCase().includes(query) ||
      String(x.surah) === query || x.key === query || `${x.surah}:`.startsWith(query)
    ).slice(0, 8).map((x) => ({ kind: 'surah', key: 's' + x.surah, surah: x.surah, title: x.name_tr, sub: `${x.name_en} · ${juzLabel(x)}`, ar: x.name_ar, badge: '' + x.surah }));
  }, [query]);

  const lastSurah = last && SURAHS.find((x) => x.surah === last.surah);

  return (
    <div style={{ fontFamily: FONT, padding: '14px 16px 8px' }}>
      <h1 style={{ margin: '4px 0 12px', fontSize: TYPE.screenTitle, fontWeight: 600, color: D.ink }}>Qur'an</h1>

      {!FULL_INDEX && (
        <div style={{ background: '#FBF3DF', border: '1px solid #F0DFAE', borderRadius: RADIUS.card, padding: '11px 13px', marginBottom: 12, fontSize: TYPE.meta, lineHeight: 1.55, color: '#8A6410' }}>
          Preview. These surahs show the full verbatim Arabic and translation. All 114, with surah names, sajdah markers and juz boundaries, appear once the Tanzil metadata file (quran-data.xml) is added and the build is run.
        </div>
      )}

      {/* search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: D.card, border: `1px solid ${query ? D.tealDeep : D.border}`, borderRadius: query && matches.length ? '22px 22px 0 0' : RADIUS.pill, padding: '9px 14px', transition: 'border-color .15s ease' }}>
          <Search size={16} color={D.inkHint} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search surah, 2:255, juz 30, page 22"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontFamily: FONT, fontSize: TYPE.body, color: D.ink }} />
          {q && <button onClick={() => setQ('')} aria-label="Clear search" style={{ border: 'none', background: 'none', color: D.inkHint, cursor: 'pointer', display: 'inline-flex', padding: 2 }}><X size={16} /></button>}
        </div>
        {/* live autocomplete dropdown */}
        {query && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, background: D.card, border: `1px solid ${D.tealDeep}`, borderTop: 'none', borderRadius: '0 0 16px 16px', boxShadow: '0 12px 28px rgba(27,42,74,0.12)', overflow: 'hidden', maxHeight: 360, overflowY: 'auto' }}>
            {matches.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: D.inkHint, fontSize: TYPE.meta }}>Nothing matches “{q.trim()}”.</div>
            ) : matches.map((m) => (
              <button key={m.key} onClick={() => { setQ(''); onOpenSurah(m.surah, m.ayah); }} className="dash-press"
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', borderBottom: `1px solid ${D.border}`, padding: '11px 14px', cursor: 'pointer' }}>
                <span style={{ minWidth: 28, height: 28, padding: '0 6px', borderRadius: 8, background: D.canvas, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: FONT, fontSize: TYPE.hint, fontWeight: 700, color: D.tealDeep }}>{m.badge}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 600, color: D.ink, lineHeight: 1.2 }}>{m.title}</span>
                  <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1 }}>{m.sub}</span>
                </span>
                {m.ar && <span className="quran-ar" style={{ fontSize: 18, color: D.quran, flexShrink: 0 }}>{m.ar}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* segmented */}
      <div role="tablist" style={{ display: 'flex', gap: 0, background: D.card, border: `1px solid ${D.border}`, borderRadius: 12, padding: 4, marginBottom: 14 }}>
        {[['surah', 'Surah'], ['juz', 'Juz'], ['saved', 'Saved']].map(([k, label]) => {
          const on = seg === k;
          return (
            <button key={k} role="tab" aria-selected={on} onClick={() => setSeg(k)}
              style={{ flex: 1, minHeight: 40, border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: FONT, fontSize: TYPE.body, fontWeight: 600, background: on ? '#E9F6F4' : 'transparent', color: on ? D.tealDeep : D.inkHint }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* continue banner */}
      {lastSurah && seg !== 'saved' && (
        <button onClick={() => onOpenSurah(last.surah, last.ayah)} className="dash-press"
          style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: '#E9F6F4', border: `1px solid #C9E8E2`, borderRadius: RADIUS.card, padding: '13px 15px', marginBottom: 14, cursor: 'pointer' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: D.card, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={18} color={D.tealDeep} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: TYPE.hint, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: D.tealDeep }}>Continue where you stopped</span>
            <span style={{ display: 'block', fontSize: TYPE.body, color: D.ink, marginTop: 1 }}>{lastSurah.name_tr}, ayah {last.ayah || 1} · Juz {juzOfKey(last.surah, last.ayah || 1)}</span>
          </span>
          <ArrowRight size={18} color={D.tealDeep} />
        </button>
      )}

      {seg === 'juz' ? (
        <JuzList onOpenSurah={onOpenSurah} />
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {tabList.length === 0 && (
            <div style={{ textAlign: 'center', color: D.inkHint, fontSize: TYPE.body, padding: '24px 0' }}>
              {seg === 'saved' ? 'No saved surahs yet.' : 'No surahs.'}
            </div>
          )}
          {tabList.map((s) => <SurahRow key={s.surah} s={s} onOpen={() => onOpenSurah(s.surah)} />)}
        </div>
      )}
    </div>
  );
}

function SurahRow({ s, onOpen }) {
  return (
    <button onClick={onOpen} className="dash-press"
      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.card, padding: '12px 14px', cursor: 'pointer' }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, background: D.canvas, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: FONT, fontSize: TYPE.meta, fontWeight: 700, color: D.tealDeep }}>{s.surah}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink, lineHeight: 1.2 }}>{s.name_tr}</span>
        <span style={{ display: 'block', fontSize: TYPE.meta, color: D.inkHint, marginTop: 2 }}>{s.name_en} · {s.ayah_count} ayat · {juzLabel(s)}</span>
      </span>
      {s.name_ar
        ? <span className="quran-ar" style={{ fontSize: 20, color: D.quran, flexShrink: 0 }}>{s.name_ar}</span>
        : <span style={{ fontSize: TYPE.hint, color: D.inkFaint, flexShrink: 0 }}>{s.name_tr}</span>}
    </button>
  );
}

// The Juz tab lists the 30 juz (not a regrouped surah list). Each row shows the
// juz number, its name, and where it starts (surah name + ayah); the end is the
// ayah just before the next juz starts (juz 30 ends at 114:6). Tapping opens the
// reader at that surah, at the juz's start ayah.
// Juz browse (spec UI 1-2). Rows read the single juz mapping (juz.js); opening a juz
// discloses its surah composition with partial ranges labelled explicitly, and each
// entry opens the reader at its exact start ayah. Progress is per-ayah once that
// state exists; today it reads 0 rather than a fabricated number.
function JuzList({ onOpenSurah }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {JUZ_LIST.map((j) => {
        const expanded = open === j.juz;
        return (
          <div key={j.juz} style={{ background: D.card, border: `1px solid ${expanded ? D.tealDeep : D.border}`, borderRadius: RADIUS.card, overflow: 'hidden' }}>
            <button onClick={() => setOpen(expanded ? null : j.juz)} aria-expanded={expanded} className="dash-press"
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', padding: '12px 14px', cursor: 'pointer' }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: '#F7EFD6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: FONT, fontSize: TYPE.meta, fontWeight: 700, color: '#8A6410' }}>{j.juz}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink, lineHeight: 1.2 }}>Juz {j.juz} · {j.name}</span>
                <span style={{ display: 'block', fontSize: TYPE.meta, color: D.inkHint, marginTop: 2 }}>{j.rangeText}</span>
                <span style={{ display: 'block', height: 5, background: '#F1EFE9', borderRadius: 3, marginTop: 7, overflow: 'hidden' }} aria-hidden="true"><span style={{ display: 'block', height: '100%', width: '0%', background: D.tealDeep }} /></span>
              </span>
            </button>
            {expanded && (
              <div style={{ borderTop: `1px solid ${D.border}`, padding: '4px 10px 8px' }}>
                {surahCompositionOfJuz(j.juz).map((c, i, arr) => (
                  <button key={c.surah} onClick={() => onOpenSurah(c.surah, c.first)} className="dash-press"
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'none', border: 'none', padding: '9px 4px', cursor: 'pointer', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${D.border}` }}>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ fontSize: TYPE.body, color: D.ink, fontWeight: 500 }}>{c.name}</span>
                      {!c.complete && <span style={{ fontSize: TYPE.meta, color: D.inkHint, marginLeft: 6 }}>ayat {c.first} to {c.last}</span>}
                    </span>
                    <span style={{ flexShrink: 0, fontSize: TYPE.hint, fontWeight: 700, borderRadius: 8, padding: '2px 8px', color: c.complete ? D.tealDeep : '#8A6410', background: c.complete ? '#E9F6F4' : '#FCEBC9' }}>{c.complete ? 'Complete' : 'Partial'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
