// Phase 6 - native-feel polish, applied ONLY in app mode so the website is
// untouched. Toggles a `deany-app-mode` class on <html>/<body> and injects the
// scoped global rules: no tap flash, no rubber-band overscroll, no text
// selection on controls (lesson text/Quranic Arabic stay selectable),
// tap-delay removed, and hover affordances behind (hover: hover).
import { useEffect } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Scheherazade+New:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
html.deany-app-mode, body.deany-app-mode {
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}
.deany-app-mode * { -webkit-tap-highlight-color: transparent; }
/* selection off on interactive controls only - never on lesson text */
.deany-app-mode button,
.deany-app-mode [role="button"],
.deany-app-mode nav,
.deany-app-mode a {
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}
/* subtle 180ms transition into tabs and screens - opacity only, so it never
   becomes a containing block for position:fixed descendants (an iOS trap). */
.deany-fade { animation: deanyFade 180ms ease-out both; }
@keyframes deanyFade { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .deany-fade { animation: none; }
}
`;

export default function AppModeStyles() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const body = document.body;
    html.classList.add('deany-app-mode');
    body && body.classList.add('deany-app-mode');
    return () => {
      html.classList.remove('deany-app-mode');
      body && body.classList.remove('deany-app-mode');
    };
  }, []);

  return <style>{CSS}</style>;
}
