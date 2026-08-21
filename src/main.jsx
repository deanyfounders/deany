import React from 'react'
import ReactDOM from 'react-dom/client'
import AppGate from './app/AppGate.jsx'
import IntroLanding from './IntroLanding.jsx'
import { startAutoUpdate } from './pwa-update.js'

startAutoUpdate()

// Local preview shortcut: /?intro renders ONLY the new landing page, no gating.
const introPreview = new URLSearchParams(window.location.search).has('intro')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {introPreview ? <IntroLanding /> : <AppGate />}
  </React.StrictMode>,
)
