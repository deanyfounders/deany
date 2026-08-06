// Tool screens launched from the dashboard Tools card (spec section 8). Each is a
// full-screen takeover with a back button, sharing the E design tokens. Zakat nisab
// is live-fetched (never hardcoded); its methodology copy is pending_mehdi.
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { E, FONT_LATIN, FONT_SERIF } from '../tokens.js';
import { useNisab } from '../services/nisab.js';
import zakatMethodology from '../../../../content/dashboard/zakat-methodology.json';

const TL_CSS = `
.tl{ font-family:${FONT_LATIN}; background:${E.bg}; color:${E.ink}; min-height:100%; padding:0 18px calc(env(safe-area-inset-bottom) + 24px); }
.tl .top{ display:flex; align-items:center; gap:10px; padding:calc(env(safe-area-inset-top) + 12px) 0 6px; }
.tl .back{ display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; margin-left:-6px; border-radius:999px; border:none; background:${E.inset}; color:${E.ink}; cursor:pointer; }
.tl h1{ font-family:${FONT_SERIF}; font-size:22px; font-weight:600; }
.tl .lead{ font-size:12.5px; color:${E.soft}; margin:2px 0 16px; line-height:1.5; }
.tl .card{ background:#fff; border:2px solid ${E.line}; border-bottom-width:4px; border-radius:16px; padding:16px; margin-bottom:14px; }
.tl .lbl{ font-size:9.5px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:${E.goldDark}; }
.tl .field{ display:flex; align-items:center; gap:8px; border:1px solid ${E.line}; border-radius:10px; padding:12px 13px; background:${E.inset}; margin-top:10px; }
.tl .field span{ color:${E.faint}; font-weight:700; }
.tl .field input{ border:none; background:none; outline:none; font-family:inherit; font-size:16px; flex:1; color:${E.ink}; min-width:0; }
.tl .grid3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:12px; }
.tl .cell{ background:${E.inset}; border:1px solid ${E.line}; border-radius:10px; padding:12px 8px; text-align:center; }
.tl .cell small{ font-size:8.5px; color:${E.faint}; text-transform:uppercase; letter-spacing:0.08em; display:block; }
.tl .cell b{ font-size:15px; font-weight:800; display:block; margin-top:4px; }
.tl .cell i{ font-style:normal; font-size:8.5px; color:${E.faint}; }
.tl .seg{ display:flex; gap:8px; margin-top:12px; }
.tl .seg button{ flex:1; border:1px solid ${E.line}; background:#fff; border-radius:10px; padding:9px 0; font-family:inherit; font-size:12px; font-weight:700; color:${E.soft}; cursor:pointer; }
.tl .seg button.on{ background:${E.tealTint}; border-color:${E.teal}; color:${E.tealDark}; }
.tl .big{ text-align:center; }
.tl .big .count{ font-size:64px; font-weight:800; color:${E.tealDark}; line-height:1; margin:10px 0 4px; font-variant-numeric:tabular-nums; }
.tl .tap{ width:100%; margin-top:16px; border:none; border-radius:16px; padding:22px; background:${E.teal}; color:#fff; font-family:inherit; font-size:16px; font-weight:800; cursor:pointer; box-shadow:0 4px 0 ${E.tealDark}; }
.tl .tap:active{ transform:translateY(3px); box-shadow:0 1px 0 ${E.tealDark}; }
.tl .row{ display:flex; align-items:center; justify-content:space-between; font-size:13px; padding:10px 2px; border-bottom:1px solid ${E.line}; }
.tl .row:last-child{ border-bottom:none; }
.tl .row b{ font-weight:700; }
.tl .compass{ width:220px; height:220px; margin:8px auto 4px; border-radius:50%; border:2px solid ${E.line}; position:relative; background:${E.inset}; }
.tl .needle{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; transition:transform 0.2s ease; }
.tl .note{ font-size:11.5px; color:${E.soft}; line-height:1.5; }
`;

const fmt$ = (n) => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });

function Shell({ title, lead, onBack, children }) {
  return (
    <div className="tl">
      <style>{TL_CSS}</style>
      <div className="top">
        <button className="back" aria-label="Back" onClick={onBack}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg></button>
        <h1>{title}</h1>
      </div>
      {lead && <div className="lead">{lead}</div>}
      {children}
    </div>
  );
}

/* ---------- zakat ---------- */
function Zakat({ onBack }) {
  const [assetsCash, setCash] = useState('');
  const [assetsGold, setGold] = useState('');
  const [assetsStocks, setStocks] = useState('');
  const nisab = useNisab();
  const total = (parseFloat(assetsCash) || 0) + (parseFloat(assetsGold) || 0) + (parseFloat(assetsStocks) || 0);
  const due = nisab.nisab && total >= nisab.nisab ? total * 0.025 : 0;
  const approved = zakatMethodology.status === 'approved' && (zakatMethodology.help || '').trim();
  return (
    <Shell title="Zakat calculator" lead={approved ? zakatMethodology.help : 'Methodology under scholar review.'} onBack={onBack}>
      <div className="card">
        <div className="lbl">Your wealth</div>
        {[['Cash and savings', assetsCash, setCash], ['Gold and silver value', assetsGold, setGold], ['Stocks and investments', assetsStocks, setStocks]].map(([label, val, set]) => (
          <div className="field" key={label}><span>$</span><input type="number" inputMode="decimal" placeholder={label} aria-label={label} value={val} onChange={(e) => set(e.target.value)} /></div>
        ))}
        <div className="grid3">
          <div className="cell"><small>Total</small><b>{fmt$(total)}</b></div>
          <div className="cell" style={{ background: E.tealTint }}><small style={{ color: E.tealDark }}>Zakat due</small><b style={{ color: E.tealDark }}>{fmt$(due)}</b></div>
          <div className="cell" style={{ background: E.goldTint }}><small style={{ color: E.goldDark }}>Nisab</small><b style={{ color: E.goldDark }}>{nisab.nisab ? fmt$(nisab.nisab) : (nisab.loading ? '…' : '—')}</b><i>live gold rate</i></div>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- tasbih ---------- */
function Tasbih({ onBack }) {
  const [target, setTarget] = useState(33);
  const [count, setCount] = useState(0);
  const tick = () => {
    setCount((c) => {
      const n = c + 1;
      try { if (typeof navigator !== 'undefined' && navigator.vibrate && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) navigator.vibrate(n % target === 0 ? [20, 40, 20] : 12); } catch (_) {}
      return n;
    });
  };
  return (
    <Shell title="Tasbih counter" lead="Tap to count your dhikr. A short haptic marks each tap, a longer one each set." onBack={onBack}>
      <div className="card big">
        <div className="lbl" style={{ color: E.tealDark }}>Count</div>
        <div className="count">{count}</div>
        <div style={{ fontSize: 12, color: E.soft }}>{Math.floor(count / target)} set{Math.floor(count / target) === 1 ? '' : 's'} of {target}</div>
        <div className="seg">
          {[33, 99, 100].map((t) => <button key={t} className={target === t ? 'on' : ''} onClick={() => setTarget(t)}>{t}</button>)}
        </div>
        <button className="tap" onClick={tick}>Tap</button>
        <button onClick={() => setCount(0)} style={{ marginTop: 12, background: 'none', border: 'none', color: E.faint, fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Reset</button>
      </div>
    </Shell>
  );
}

/* ---------- hijri converter ---------- */
const hij = (date) => { try { const p = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).formatToParts(date); const g = (t) => (p.find((x) => x.type === t) || {}).value || ''; return `${g('weekday')}, ${g('day')} ${g('month')} ${g('year')} AH`; } catch (_) { return ''; } };
const greg = (date) => new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
function Hijri({ onBack }) {
  const [g, setG] = useState(() => new Date().toISOString().slice(0, 10));
  const d = useMemo(() => { const dt = new Date(g + 'T00:00:00'); return isNaN(dt) ? new Date() : dt; }, [g]);
  return (
    <Shell title="Hijri converter" lead="Pick a Gregorian date to see its Hijri equivalent." onBack={onBack}>
      <div className="card">
        <div className="lbl" style={{ color: E.tealDark }}>Today</div>
        <div className="row"><span>Gregorian</span><b>{greg(new Date())}</b></div>
        <div className="row"><span>Hijri</span><b>{hij(new Date())}</b></div>
      </div>
      <div className="card">
        <div className="lbl">Convert a date</div>
        <div className="field"><input type="date" value={g} onChange={(e) => setG(e.target.value)} aria-label="Gregorian date" /></div>
        <div className="row" style={{ marginTop: 8 }}><span>Hijri</span><b>{hij(d)}</b></div>
      </div>
    </Shell>
  );
}

/* ---------- qibla ---------- */
const KAABA = { lat: 21.4225, lng: 39.8262 };
const toRad = (x) => (x * Math.PI) / 180, toDeg = (x) => (x * 180) / Math.PI;
function qiblaBearing(lat, lng) {
  const dL = toRad(KAABA.lng - lng);
  const y = Math.sin(dL) * Math.cos(toRad(KAABA.lat));
  const x = Math.cos(toRad(lat)) * Math.sin(toRad(KAABA.lat)) - Math.sin(toRad(lat)) * Math.cos(toRad(KAABA.lat)) * Math.cos(dL);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
function Qibla({ onBack }) {
  const [state, setState] = useState({ status: 'loading', bearing: null });
  const [heading, setHeading] = useState(null);
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { setState({ status: 'no-location', bearing: null }); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: 'ok', bearing: qiblaBearing(pos.coords.latitude, pos.coords.longitude) }),
      () => setState({ status: 'no-location', bearing: null }), { timeout: 8000, maximumAge: 3600000 }
    );
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const on = (e) => { const h = (e.webkitCompassHeading != null) ? e.webkitCompassHeading : (e.alpha != null ? 360 - e.alpha : null); if (h != null) setHeading(h); };
    window.addEventListener('deviceorientation', on, true);
    return () => window.removeEventListener('deviceorientation', on, true);
  }, []);
  const rot = state.bearing == null ? 0 : (state.bearing - (heading || 0));
  return (
    <Shell title="Qibla finder" lead="The direction of prayer from where you are, towards the Kaaba in Makkah." onBack={onBack}>
      <div className="card">
        {state.status === 'ok' ? (
          <>
            <div className="compass">
              <div className="needle" style={{ transform: `rotate(${rot}deg)` }}>
                <svg width="60" height="120" viewBox="0 0 60 120" aria-hidden="true"><path d="M30 6 L46 60 L30 48 L14 60 Z" fill={E.teal} /><path d="M30 48 L46 60 L30 114 L14 60 Z" fill={E.line} /></svg>
              </div>
            </div>
            <div className="row"><span>Qibla bearing</span><b>{Math.round(state.bearing)}° from north</b></div>
            <div className="note">{heading == null ? 'Point the top of your phone north, or enable compass access to align the arrow live.' : 'The arrow points to the Qibla. Turn until it points straight up.'}</div>
          </>
        ) : state.status === 'loading' ? (
          <div className="note">Finding your location…</div>
        ) : (
          <div className="note">Enable location access to compute the Qibla direction from where you are.</div>
        )}
      </div>
    </Shell>
  );
}

export default function ToolScreen({ tool, onBack }) {
  if (tool === 'zakat') return <Zakat onBack={onBack} />;
  if (tool === 'qibla') return <Qibla onBack={onBack} />;
  if (tool === 'tasbih') return <Tasbih onBack={onBack} />;
  if (tool === 'hijri') return <Hijri onBack={onBack} />;
  return null;
}
