// Qur'an index (Part C1): search, Surah / Juz / Saved segmented control, a
// continue-reading banner, and the surah list. Built from the bundled index.
import React, { useMemo, useState } from 'react';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { D, FONT, RADIUS, TYPE } from '../dashboard/tokens.js';
import indexData from '../../data/quran-index.json';
import { getLastRead, getSaved } from './store.js';

const SURAHS = indexData.surahs || [];
const FULL_INDEX = indexData._generated === true && SURAHS.length === 114;

export default function QuranIndex({ onOpenSurah }) {
  const [q, setQ] = useState('');
  const [seg, setSeg] = useState('surah'); // surah | juz | saved
  const last = getLastRead();
  const saved = getSaved();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = SURAHS;
    if (seg === 'saved') list = SURAHS.filter((x) => saved.includes(x.surah));
    if (!s) return list;
    return list.filter((x) =>
      x.name_tr.toLowerCase().includes(s) ||
      x.name_en.toLowerCase().includes(s) ||
      String(x.surah) === s ||
      x.key === s || `${x.surah}:`.startsWith(s)
    );
  }, [q, seg, saved]);

  const lastSurah = last && SURAHS.find((x) => x.surah === last.surah);

  return (
    <div style={{ fontFamily: FONT, padding: '14px 16px 8px' }}>
      <h1 style={{ margin: '4px 0 12px', fontSize: TYPE.screenTitle, fontWeight: 600, color: D.ink }}>Qur'an</h1>

      {!FULL_INDEX && (
        <div style={{ background: '#FBF3DF', border: '1px solid #F0DFAE', borderRadius: RADIUS.card, padding: '11px 13px', marginBottom: 12, fontSize: TYPE.meta, lineHeight: 1.55, color: '#8A6410' }}>
          Preview. The full 114-surah text appears after the verified Tanzil sources are vendored and the build is run. No verse text is shown until then.
        </div>
      )}

      {/* search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.pill, padding: '9px 14px', marginBottom: 12 }}>
        <Search size={16} color={D.inkHint} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search surah, meaning, or 2:255"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontFamily: FONT, fontSize: TYPE.body, color: D.ink }} />
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
            <span style={{ display: 'block', fontSize: TYPE.body, color: D.ink, marginTop: 1 }}>{lastSurah.name_tr}, ayah {last.ayah || 1}</span>
          </span>
          <ArrowRight size={18} color={D.tealDeep} />
        </button>
      )}

      {seg === 'juz' ? (
        <JuzList onOpenSurah={onOpenSurah} />
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: D.inkHint, fontSize: TYPE.body, padding: '24px 0' }}>
              {seg === 'saved' ? 'No saved surahs yet.' : 'No matches.'}
            </div>
          )}
          {filtered.map((s) => <SurahRow key={s.surah} s={s} onOpen={() => onOpenSurah(s.surah)} />)}
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
        <span style={{ display: 'block', fontSize: TYPE.meta, color: D.inkHint, marginTop: 2 }}>{s.name_en} · {s.ayah_count} ayat · {s.revelation}</span>
      </span>
      {s.name_ar
        ? <span className="quran-ar" style={{ fontSize: 20, color: D.quran, flexShrink: 0 }}>{s.name_ar}</span>
        : <span style={{ fontSize: TYPE.hint, color: D.inkFaint, flexShrink: 0 }}>{s.name_tr}</span>}
    </button>
  );
}

function JuzList({ onOpenSurah }) {
  const juz = Array.from({ length: 30 }, (_, i) => i + 1);
  const firstSurahOfJuz = (n) => SURAHS.find((s) => s.juz_start === n);
  return (
    <div>
      <div style={{ fontSize: TYPE.meta, color: D.inkHint, marginBottom: 10 }}>
        Full juz boundaries appear with the vendored metadata. Preview jumps to a sample surah where one exists.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {juz.map((n) => {
          const s = firstSurahOfJuz(n);
          return (
            <button key={n} disabled={!s} onClick={() => s && onOpenSurah(s.surah)} className="dash-press"
              style={{ minHeight: 48, borderRadius: 12, border: `1px solid ${D.border}`, background: D.card, color: s ? D.ink : D.inkFaint, fontFamily: FONT, fontSize: TYPE.body, fontWeight: 700, cursor: s ? 'pointer' : 'default', opacity: s ? 1 : 0.5 }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
