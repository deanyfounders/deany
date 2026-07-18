import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// PWA is hand-rolled (static public/manifest.webmanifest + public/sw.js)
// instead of vite-plugin-pwa, so the build has no workbox/native-binary
// dependency and runs on any Node version / OS.

// One id per build: the Vercel commit SHA in CI, else a local timestamp.
const BUILD_ID = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 8) || String(Date.now())

// Stamp BUILD_ID into index.html (the service-worker registration query) and
// the built sw.js (its cache name). Because the registered SW url changes every
// deploy, the browser installs a fresh worker, activates it, and the
// controllerchange handler reloads the open PWA to the latest build - no
// delete / re-add of the home-screen icon.
function deanyBuildId() {
  return {
    name: 'deany-build-id',
    transformIndexHtml(html) {
      return html.replace(/__BUILD_ID__/g, BUILD_ID)
    },
    writeBundle(options) {
      const dir = options.dir || 'dist'
      const sw = path.join(dir, 'sw.js')
      try {
        const src = fs.readFileSync(sw, 'utf8')
        fs.writeFileSync(sw, src.replace(/__BUILD_ID__/g, BUILD_ID))
      } catch (_) {}
    },
  }
}

export default defineConfig({
  plugins: [react(), deanyBuildId()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
