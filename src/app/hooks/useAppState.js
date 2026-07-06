// useAppState - the installed app's persistent state, stored under one
// localStorage key. Sign out clears the user only, so returning users skip
// straight back to /auth (onboarded + calibrated are preserved).
import { useState, useCallback } from 'react';

const KEY = 'deany_app_state';
const DEFAULT = {
  onboarded: false,
  topics: [],            // selected topic ids (Phase 4)
  calibration: {},       // { [topicId]: { level, tier, answered, unsureCount, completedAt } }
  calibrated: false,
  level: null,
  user: null,
};

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
  const setTopics = useCallback((topics) => update({ topics }), [update]);
  const saveTopicResult = useCallback((topicId, result) =>
    update(prev => ({ calibration: { ...prev.calibration, [topicId]: result } })), [update]);
  const finishCalibration = useCallback((level) => update({ calibrated: true, level }), [update]);
  const setCalibration = useCallback((level) => update({ calibrated: true, level }), [update]); // legacy
  const signIn = useCallback((username) => update({ user: { username } }), [update]);
  const signOut = useCallback(() => update({ user: null }), [update]);
  const resetAll = useCallback(() => {
    write(DEFAULT); setState(DEFAULT);
    if (typeof window !== 'undefined') { try { window.localStorage.removeItem('deany.state.v1'); } catch (_) {} }
  }, []);

  return { state, update, completeOnboarding, setTopics, saveTopicResult, finishCalibration, setCalibration, signIn, signOut, resetAll };
}
