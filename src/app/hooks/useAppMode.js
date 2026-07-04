// useAppMode - true when DEANY runs as an installed app (standalone display),
// or when ?app=1 is present (for desktop/browser testing of the app flow).
// Browser visitors get false and see the normal website.
import { useState, useEffect } from 'react';

export function isAppMode() {
  if (typeof window === 'undefined') return false;
  try {
    const standalone = typeof window.matchMedia === 'function'
      && window.matchMedia('(display-mode: standalone)').matches;
    const iosStandalone = window.navigator && window.navigator.standalone === true;
    const forced = new URLSearchParams(window.location.search).get('app') === '1';
    return Boolean(standalone || iosStandalone || forced);
  } catch (_) {
    return false;
  }
}

export function useAppMode() {
  const [appMode, setAppMode] = useState(isAppMode);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia('(display-mode: standalone)');
    const handler = () => setAppMode(isAppMode());
    // addEventListener is the modern API; addListener is the Safari fallback.
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else if (mql.addListener) mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else if (mql.removeListener) mql.removeListener(handler);
    };
  }, []);

  return appMode;
}
