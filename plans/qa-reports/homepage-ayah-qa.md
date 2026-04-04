# QA Report: Homepage Ayah of the Day Enhancement

**Date:** 2026-04-04
**Files modified:** `src/components/QuranicQuote.jsx`, `src/components/TafseerPanel.jsx`, `src/App.jsx`

## Checks

| Check | Status | Notes |
|-------|--------|-------|
| No hardcoded hex in QuranicQuote.jsx | PASS | grep confirms zero matches |
| No hardcoded hex in TafseerPanel.jsx | PASS | grep confirms zero matches |
| Interactive elements have focus-visible rings | PASS | Toggle button has `focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2` |
| Arabic text >= text-lg | PASS | Arabic uses `text-xl` in both variants |
| Touch targets >= 48px | PASS | Toggle button is inline text link (exempt per CLAUDE.md text link pattern); main CTAs unchanged |
| No horizontal overflow on mobile | PASS | Mobile card uses full-width `md:hidden` wrapper, no fixed widths |
| `npm run build` passes | PASS | Zero errors, zero warnings (chunk size info only) |
| Existing routes unaffected | PASS | Only hero section structure changed; routing logic untouched |
| Tafseer collapse animation | PASS | Uses `max-h` + `opacity` with `duration-300 ease-out`; capped at 300px with inner scroll |
| Desktop layout (md+) | PASS | `md:flex md:items-start md:gap-8` with `flex-1` hero + `md:w-[340px]` sidebar |
| Mobile layout (<md) | PASS | Ayah card full-width above hero; desktop card hidden |

## Component Variant Summary

`QuranicQuote` now accepts `variant` prop:
- `"hero"` (default): legacy centered layout, backward compatible
- `"sidebar"`: left-aligned glass card with sage border accent, collapsible tafseer

## Regression Notes
- Hero variant preserves all existing behavior (centered, inline expand)
- Both variants now use Deany tokens exclusively (no inline styles for color)
- TafseerPanel highlight segments now use `border-deany-sage` / `bg-deany-sage-light` / `text-deany-navy`
- TafseerPanel body segments now use `text-deany-steel`
- Scholar attribution now uses `text-deany-muted`
