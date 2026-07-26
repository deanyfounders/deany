// Feature flags - single source of truth. The accuracy covenant (Absolute 4)
// requires that unverified / candidate content never reaches production, so the
// nexus_pilot flag that exposes dev-only candidate refs and stub fixtures is
// HARD OFF in production. Only an explicit dev opt-in can turn it on, and never
// when the build is a production build.
//
// Under Vite, import.meta.env.PROD is true in prod builds. Under plain Node (the
// accuracy gate), import.meta.env is undefined, so IS_PROD resolves true and the
// flag is off - which is exactly what the gate asserts.
const ENV = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : null;
export const IS_PROD = ENV ? !!ENV.PROD : true;

// The value the accuracy gate pins: in a production context the flag defaults off.
export const NEXUS_PILOT_PROD_DEFAULT = false;

// True only in a non-production context that has explicitly opted in via
// ?nexus=1 or localStorage['deany.flags.nexus_pilot'] === '1'.
export function nexusPilotEnabled() {
  if (IS_PROD) return false; // never in production, no exceptions
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('nexus') === '1') return true;
      if (window.localStorage && window.localStorage.getItem('deany.flags.nexus_pilot') === '1') return true;
    }
  } catch (_) { /* SSR / sandboxed */ }
  return false;
}
