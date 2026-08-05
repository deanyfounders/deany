// Prayer times from the device's location via the Aladhan API, with a saved
// calculation-method setting, cached per day. No times are shown until a real
// location + response exist (never fabricated).
import { useEffect, useState } from 'react';

const KEY = 'deany.prayer.v1';
const METHOD_KEY = 'deany.prayer.method';
const NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function getMethod() { try { return parseInt(window.localStorage.getItem(METHOD_KEY) || '', 10) || 2; } catch (_) { return 2; } }
export function setMethod(m) { try { window.localStorage.setItem(METHOD_KEY, String(m)); } catch (_) {} }

const cityFromTz = (tz) => (tz ? String(tz).split('/').pop().replace(/_/g, ' ') : '');
const toMin = (s) => { const [h, m] = String(s).split(':').map(Number); return h * 60 + m; };

function withNext(rec) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  let next = NAMES.find((n) => toMin(rec.times[n]) >= mins) || 'Fajr'; // after Isha -> tomorrow's Fajr
  return { times: rec.times, next, city: rec.city };
}

export function usePrayerTimes() {
  const [state, setState] = useState({ status: 'loading', times: null, next: null, city: '' });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) { const c = JSON.parse(raw); if (c.date === today && c.times) { setState({ status: 'ok', ...withNext(c) }); return; } }
    } catch (_) {}
    if (typeof navigator === 'undefined' || !navigator.geolocation) { setState({ status: 'no-location', times: null, next: null, city: '' }); return; }
    let alive = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${getMethod()}`)
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((d) => {
            const t = d && d.data && d.data.timings; if (!t) throw new Error('no timings');
            const rec = { date: today, city: cityFromTz(d.data.meta && d.data.meta.timezone), times: { Fajr: t.Fajr, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha } };
            try { window.localStorage.setItem(KEY, JSON.stringify(rec)); } catch (_) {}
            if (alive) setState({ status: 'ok', ...withNext(rec) });
          })
          .catch(() => { if (alive) setState({ status: 'error', times: null, next: null, city: '' }); });
      },
      () => { if (alive) setState({ status: 'no-location', times: null, next: null, city: '' }); },
      { timeout: 8000, maximumAge: 3600000 }
    );
    return () => { alive = false; };
  }, []);
  return state;
}
