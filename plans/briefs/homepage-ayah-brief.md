# Homepage Enhancement: Ayah of the Day — Top-Right with Collapsible Tafseer

## Layout

### Desktop (md+)
- Hero section uses `md:flex md:items-start md:gap-8`
- Left: existing hero content (`flex-1`) — heading, XP bar, CTA, mascot
- Right: `QuranicQuote variant="sidebar"` in a `md:w-[340px] md:flex-shrink-0` wrapper
- The mobile instance is hidden via `hidden md:block`

### Mobile (<md)
- Full-width `QuranicQuote variant="sidebar"` placed above the hero content via `md:hidden mb-6`
- The desktop instance is hidden via `hidden md:block`

## Sidebar Card Design
- Glass card: `bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm`
- Left sage accent: `border-l-4 border-deany-sage`
- Left-aligned text (not centered like hero variant)
- Label: `text-deany-sage` uppercase tracking
- Reference: `text-deany-gold`
- Toggle button: `text-deany-sage` with hover to `text-deany-navy`

## Collapsible Tafseer
- Uses `max-h` + `opacity` transition: `transition-all duration-300 ease-out`
- Collapsed: `max-h-0 opacity-0 overflow-hidden`
- Expanded: `max-h-[300px] opacity-100 mt-4`
- Inner scroll: `overflow-y-auto max-h-[280px]` prevents unbounded growth
- Inner panel: `bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-deany-border/40`

## Token Replacements
| File | Before | After |
|------|--------|-------|
| QuranicQuote.jsx | `style={{ color: '#0d9488' }}` | `text-deany-sage` |
| QuranicQuote.jsx | `style={{ color: '#b45309' }}` | `text-deany-gold` |
| QuranicQuote.jsx | `style={{ color: '#059669' }}` | `text-deany-sage` |
| QuranicQuote.jsx | `text-gray-800` | `text-deany-navy` |
| QuranicQuote.jsx | `text-gray-600` | `text-deany-steel` |
| QuranicQuote.jsx | `text-gray-400` | `text-deany-muted` |
| QuranicQuote.jsx | `text-gray-300` | `text-deany-muted` |
| QuranicQuote.jsx | `focus-visible:ring-amber-400` | `focus-visible:ring-deany-gold` |
| TafseerPanel.jsx | `border-teal-500` | `border-deany-sage` |
| TafseerPanel.jsx | `bg-teal-50/80` | `bg-deany-sage-light` |
| TafseerPanel.jsx | `text-teal-600` | `text-deany-sage` |
| TafseerPanel.jsx | `text-teal-900` | `text-deany-navy` |
| TafseerPanel.jsx | `text-gray-600` | `text-deany-steel` |
| TafseerPanel.jsx | `text-gray-400` | `text-deany-muted` |
| TafseerPanel.jsx | `border-gray-200/50` | `border-deany-border/50` |
