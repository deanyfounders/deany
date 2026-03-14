# SKILL: ui-audit

## When to Use

Reviewing any existing page or component for visual quality, UX gaps, design system compliance, or code quality. Trigger on "review", "audit", "check quality", "polish", or "make this look better".

## Workflow

### 1. Read the target + design system

```bash
cat [target-file]
cat tailwind.config.js
ls src/components/
wc -l [target-file]  # Check size
```

### 2. Run automated checks first

These catch the easy stuff instantly:

```bash
# Hardcoded colours
grep -n '#[0-9A-Fa-f]\{3,8\}' [target-file]

# Inline styles (should be zero)
grep -n 'style=' [target-file]

# Missing key props in maps
grep -n '\.map(' [target-file]  # then check each for key=

# Raw Tailwind colours (not Deany tokens)
grep -n 'text-gray\|bg-gray\|text-blue\|bg-blue\|text-green\|bg-green\|text-red\|bg-red' [target-file]

# Unused imports
# Read the imports, then search for each name in the rest of the file

# File size
wc -l [target-file]  # Flag if > 250

# Religious content needing review
grep -n 'hadith\|Quran\|ayah\|sahih\|haram\|halal\|riba\|gharar' [target-file]
```

### 3. Manual checklist (score each P0 / P1 / P2 / PASS)

**P0 = must fix before shipping. P1 = fix soon. P2 = nice-to-have.**

#### Brand Alignment
- Colours from Deany tokens only — no hardcoded hex
- Typography follows the scale from CLAUDE.md
- One `<h1>` per page
- White/cream backgrounds dominate
- Gold used for accents only, not large surfaces
- Sage green used as seasoning (≤2 elements per screen)
- No childish gamification, tacky gradients, or neon

#### Layout & Spacing
- Mobile-first: no horizontal scroll at 375px
- Content width: `max-w-md` for lessons, `max-w-2xl` for articles
- Vertical rhythm: `space-y-6` between sections, `space-y-3` within
- Cards: `rounded-2xl p-6 border border-deany-border`
- No orphaned/floating elements outside content area
- Generous whitespace — nothing cramped

#### Interaction & Accessibility
- All tappable targets ≥ 48px height (`min-h-[48px]`)
- `focus-visible` ring on every button, link, and input
- No hover-only functionality (mobile has no hover)
- Transitions use standard durations from CLAUDE.md
- `deany-navy` on `white` or `cream` (high contrast)
- Gold text never on cream background (low contrast — P0)
- Disabled states use `bg-deany-border text-deany-muted cursor-not-allowed`

#### Code Quality
- File ≤ 250 lines
- Reuses existing components from `src/components/`
- No inline styles
- No unused imports or dead code
- Props have sensible defaults
- `key` prop on every `.map()` element
- No `console.log` left in

#### Content (if applicable)
- Copy is concise — max 3 sentences per lesson screen
- Arabic text: `font-arabic`, `text-right`, minimum `text-lg`
- Hadith includes source + grading
- Uncertain claims flagged with `// REVIEW:`
- No placeholder Lorem ipsum

### 4. Write the audit report

```markdown
## UI Audit: [filename]
**Score: [X]/10** — [one-line summary]

### P0 — Must Fix Now
| # | Category    | Issue                              | Line | Fix                                      |
|---|-------------|------------------------------------|------|------------------------------------------|
| 1 | Brand       | Hardcoded #333 in heading          | 47   | Replace with `text-deany-navy`           |
| 2 | A11y        | Gold text on cream background      | 82   | Move to white bg or use navy text        |

### P1 — Fix Soon
| # | Category    | Issue                              | Line | Fix                                      |
|---|-------------|------------------------------------|------|------------------------------------------|
| 3 | Spacing     | Cards lack consistent padding      | 55   | Standardise to `p-6`                     |
| 4 | Code        | Unused import: useState            | 3    | Remove                                   |

### P2 — Nice-to-Have
| # | Category    | Issue                              | Line | Fix                                      |
|---|-------------|------------------------------------|------|------------------------------------------|
| 5 | Interaction | Back button lacks focus ring       | 112  | Add `focus-visible:ring-2`               |

### Automated Check Results
- Hardcoded colours: [N found / clean]
- Inline styles: [N found / clean]
- File size: [N lines]
- Review flags: [N pending / none]

### What's Good
[1-2 sentences on what the component does well — always include this.]
```

### 5. Offer to fix

After presenting the audit: "Want me to implement the P0 fixes now?"

If yes:
1. Fix only the P0 items (and P1 if explicitly approved).
2. Run `npm run build`.
3. Run `bash scripts/lint-tokens.sh`.
4. Fill out the PR report.

## Scoring Guide

| Score | Meaning                                                  |
|-------|----------------------------------------------------------|
| 9-10  | Ship-ready. Follows design system precisely. Clean code. |
| 7-8   | Good shape. A few P1/P2 issues. No blockers.            |
| 5-6   | Needs work. Multiple P1 issues or 1-2 P0 issues.        |
| 3-4   | Significant problems. Multiple P0 issues.                |
| 1-2   | Fundamentally broken. Rebuild recommended.               |

## Guardrails

- **Never rewrite the entire component during an audit.** Audits produce reports + targeted fixes.
- **Never add dependencies to fix audit findings.**
- **Never change functionality.** Visual/structural fixes only, unless a bug is discovered (note it separately).
- **Religious/scholarly content issues: flag, don't fix.** Add `// REVIEW:` comment and note in report.
- **Always include "What's Good."** Audits that are 100% negative are demoralising and often miss context.
