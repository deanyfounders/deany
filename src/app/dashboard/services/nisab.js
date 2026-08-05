// Live nisab (85g of gold) from a keyless gold-price fetch, cached once per day.
// The spec forbids a hardcoded nisab; when the fetch is unavailable the card shows
// a loading/unavailable state rather than a fabricated number.
import { useEffect, useState } from 'react';

const KEY = 'deany.nisab.v1';
const GRAMS = 85;               // nisab basis: 85g of gold
const OZ_TO_G = 31.1034768;     // troy ounce -> grams

export function useNisab() {
  const [state, setState] = useState({ nisab: null, loading: true, error: false });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) { const c = JSON.parse(raw); if (c.date === today && c.nisab) { setState({ nisab: c.nisab, loading: false, error: false }); return; } }
    } catch (_) { /* ignore */ }
    let alive = true;
    fetch('https://api.gold-api.com/price/XAU')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const perOz = d && (d.price || d.rate);
        if (!perOz) throw new Error('no price');
        const nisab = Math.round((perOz / OZ_TO_G) * GRAMS);
        if (!alive) return;
        setState({ nisab, loading: false, error: false });
        try { window.localStorage.setItem(KEY, JSON.stringify({ date: today, nisab })); } catch (_) {}
      })
      .catch(() => { if (alive) setState((s) => ({ nisab: s.nisab, loading: false, error: true })); });
    return () => { alive = false; };
  }, []);
  return state;
}
