// Intro design system - one visual language for the whole first-open sequence
// (splash -> welcome -> three steps -> learn the Deany way -> find your level).
// Values are derived from the website's own palette (QuizSection + landing) so
// the untouched quiz component sits natively and nothing reads as a different
// app. Warm canvas, Georgia serif headings in deep teal, soft cards. No em-dashes.
export const IX = {
  canvas: '#FBFAF6',            // warm off-white page
  surface: '#FFFFFF',           // cards
  teal: '#22A39A',
  tealDk: '#1A8C82',
  tealDeep: '#0F4C5C',          // serif headings + deep accents (the website value)
  tealSoft: '#DCF3EF',
  tealPale: '#7FD8CE',
  gold: '#F0B429',
  goldDk: '#C8901A',
  green: '#22D86A',
  ink: '#173A4A',               // primary text
  muted: '#5E7480',             // secondary text
  faint: '#94A3AA',             // hints / captions
  border: 'rgba(15,76,92,0.12)',
  borderSoft: 'rgba(15,76,92,0.07)',
  hairline: 'rgba(15,76,92,0.10)',
};

export const SERIF = 'Georgia, serif';
export const SANS = '"Source Sans 3", system-ui, -apple-system, sans-serif';

// One card elevation and one easing curve used everywhere in the intro.
export const CARD_SHADOW = '0 1px 3px rgba(15,76,92,0.06), 0 14px 40px rgba(15,76,92,0.08)';
export const EASE = 'cubic-bezier(.2,.7,.3,1)';

// Shared entrance keyframes - injected once per screen via <style>.
export const IX_MOTION = `
@keyframes ixRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes ixPop { from { opacity: 0; transform: scale(0.94) translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes ixFade { from { opacity: 0; } to { opacity: 1; } }
.ix-rise { animation: ixRise .5s ${EASE} both; }
.ix-pop { animation: ixPop .45s ${EASE} both; }
.ix-fade { animation: ixFade .4s ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .ix-rise, .ix-pop { animation: ixFade .35s ease-out both !important; }
}`;

// Small uppercase teal eyebrow used above serif titles across the intro.
export function eyebrowStyle() {
  return { fontSize: 11, letterSpacing: '1.4px', textTransform: 'uppercase', color: IX.teal, fontWeight: 600 };
}
