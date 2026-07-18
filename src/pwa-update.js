// Runtime auto-update for the installed PWA.
//
// iOS standalone PWAs update their service worker unreliably, so we do NOT rely
// on it for freshness. Instead the app polls a tiny, uncached version.json that
// is stamped with the build id at deploy time. When the deployed build differs
// from the one currently running, we purge every cache + service worker and
// reload straight to the latest build. Cache-busted fetch means even a stale
// service worker cannot hand back an old version marker.

const BUILD_ID = typeof __DEANY_BUILD_ID__ !== 'undefined' ? __DEANY_BUILD_ID__ : 'dev'

let checking = false
let reloading = false

async function purgeAndReload() {
  if (reloading) return
  reloading = true
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))
    }
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
  } catch (_) {
    /* best effort */
  }
  window.location.reload()
}

async function checkForUpdate() {
  if (checking || reloading) return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return
  checking = true
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (res && res.ok) {
      const data = await res.json()
      if (data && data.build && BUILD_ID !== 'dev' && data.build !== BUILD_ID) {
        await purgeAndReload()
      }
    }
  } catch (_) {
    /* offline or transient - ignore, try again next foreground */
  } finally {
    checking = false
  }
}

export function startAutoUpdate() {
  if (typeof window === 'undefined') return
  // On load, whenever the app is brought back to the foreground, and hourly.
  window.addEventListener('load', checkForUpdate)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate()
  })
  window.addEventListener('focus', checkForUpdate)
  setInterval(checkForUpdate, 60 * 60 * 1000)
  // Also run immediately in case 'load' already fired.
  checkForUpdate()
}
