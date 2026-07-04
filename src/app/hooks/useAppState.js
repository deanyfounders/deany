// useAppState - the installed app's persistent state, stored under one
// localStorage key. Sign out clears the user only, so returning users skip
// straight back to /auth (onboarded + calibrated are preserved).
import { useState, useCallback } from 'react';

const KEY = 'deany_app_state';
const DEFAULT = { onboarded: false, calibrated: false, level: null, user: null };

function read() {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch (_) {
    return DEFAULT;
  }
}

function write(next) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch (_) {}
}

export function useAppState() {
  const [state, setState] = useState(read);

  const update = useCallback((patch) => {
    setState(prev => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      write(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(() => update({ onboarded: true }), [update]);
  const setCalibration = useCallback((level) => update({ calibrated: true, level }), [update]);
  const signIn = useCallback((username) => update({ user: { username } }), [update]);
  const signOut = useCallback(() => update({ user: null }), [update]);
  const resetAll = useCallback(() => { write(DEFAULT); setState(DEFAULT); }, []);

  return { state, update, completeOnboarding, setCalibration, signIn, signOut, resetAll };
}
