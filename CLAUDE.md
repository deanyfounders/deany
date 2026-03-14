# CLAUDE.md — Deany Operating System

Deany is a premium Islamic learning platform. React + Vite + Tailwind CSS, deployed on Vercel via GitHub. The brand is intelligent, calm, trustworthy, minimal, and polished. Every pixel, word, and interaction must reflect that.

---

## The Loop

Every task follows this sequence. No exceptions.

```
1. INSPECT  → Read files involved. Understand existing patterns.
2. PLAN     → ≤5 bullets. What will change, what won't, and why.
3. BUILD    → Smallest complete change. Reuse before creating.
4. VERIFY   → npm run build. Zero errors, zero warnings. Run guard scripts.
5. REPORT   → Fill out PR template. No report = not done.
```

If you cannot complete step 1 in under 2 minutes, the task scope is too large. Ask to split it.

---

## Current Repo Structure

```
/
  src/
    App.jsx              ← Router + top-level screen state (SINGLE SOURCE OF TRUTH for routing)
    main.jsx             ← Vite entry point
    components/          ← Reusable UI (QuizQuestion, RevealCard, etc.)
    data/                ← Static data, curriculum content
    DEANY-M1L1.jsx       ← Lesson 1 (note: inside src/)
  DEANY_M1L2.jsx         ← Lessons 2-5 (note: in project root, underscore separator)
  DEANY_M1L3.jsx
  DEANY_M1L4.jsx
  DEANY_M1L5.jsx
  DEANY-MODULE2-FULL-V3.jsx ← Module 2 content
  .claude/skills/        ← Claude Code skill files
  scripts/               ← Guard scripts
  tailwind.config.js     ← Design tokens (source of truth for colours)
  vite.config.js
  index.html
  package.json
```

**IMPORTANT — Lesson file locations are inconsistent.** M1L1 is in `src/`, M1L2-M1L5 are in root. Some use `-` separator, some use `_`. When creating new lessons, place them in `src/` and use the `DEANY-` prefix with hyphen: `src/DEANY-M2L1.jsx`. When inspecting, always search both locations:

```bash
find . -maxdepth 2 -name "DEANY*" -name "*.jsx" | sort
```

---

## Design System

### Colour Tokens

Every colour in the codebase comes from `tailwind.config.js`. Zero hardcoded hex values in JSX.

| Token            | Hex       | Tailwind Class       | Use                                    |
|------------------|-----------|----------------------|----------------------------------------|
| `deany-white`    | `#FFFFFF` | `bg-white`           | Primary background                     |
| `deany-cream`    | `#FAF8F5` | `bg-deany-cream`     | Alternate sections, card fills         |
| `deany-ivory`    | `#F5F1EC` | `bg-deany-ivory`     | Pressed/active states on cream         |
| `deany-navy`     | `#1A2332` | `text-deany-navy`    | Headings, primary text                 |
| `deany-steel`    | `#4A5568` | `text-deany-steel`   | Body text, labels, secondary info      |
| `deany-muted`    | `#94a0b0` | `text-deany-muted`   | Placeholders, disabled text, captions  |
| `deany-gold`     | `#C9A84C` | `bg-deany-gold`      | CTA buttons, progress bars, highlights |
| `deany-gold-light` | `#F5EDD4` | `bg-deany-gold-light` | Gold tint backgrounds (badges, tags) |
| `deany-sage`     | `#7C9A82` | `text-deany-sage`    | Islamic accent — use *sparingly*       |
| `deany-sage-light` | `#EEF3EF` | `bg-deany-sage-light` | Sage tint (success feedback bg)      |
| `deany-border`   | `#E8E4DF` | `border-deany-border`| Dividers, card outlines                |
| `deany-error`    | `#C53030` | `text-deany-error`   | Validation, destructive actions        |
| `deany-error-light` | `#FEF2F2` | `bg-deany-error-light` | Error feedback background          |

**Rules:**
- `deany-sage` is seasoning, not a main dish. Max 1-2 elements per screen.
- `deany-gold` for interactive accents only. Never fill large surfaces with it.
- Never use raw Tailwind colours (`bg-blue-500`, `text-gray-700`). Only Deany tokens.
- If you see `text-gray-900`, `text-gray-700`, etc. in existing code, those are legacy. Replace with `text-deany-navy` or `text-deany-steel` when touching those files.

### Typography Scale

| Element                 | Classes                                                        |
|-------------------------|----------------------------------------------------------------|
| Page title (h1)         | `text-2xl md:text-3xl font-semibold text-deany-navy`          |
| Section heading (h2)    | `text-xl font-semibold text-deany-navy`                        |
| Sub-heading (h3)        | `text-lg font-medium text-deany-navy`                          |
| Body                    | `text-base leading-relaxed text-deany-steel`                   |
| Small body / caption    | `text-sm leading-relaxed text-deany-muted`                     |
| Label                   | `text-xs font-medium uppercase tracking-wide text-deany-muted` |
| Stat value              | `text-3xl font-semibold text-deany-navy`                       |
| Stat label              | `text-sm text-deany-muted`                                     |
| Arabic text             | `font-arabic text-right dir-rtl text-xl leading-loose`         |
| Interactive button text | `text-base font-medium`                                        |

**Rules:**
- One `<h1>` per page. Always.
- Never bold entire paragraphs. Bold individual terms for emphasis, max 2-3 per paragraph.
- Arabic script gets `font-arabic` (defined in Tailwind config), `text-right`, and generous `leading-loose`.
- Never render Arabic text smaller than `text-lg`. It becomes illegible.

### Elevation & Shadows

| Level    | Class                          | Use                           |
|----------|--------------------------------|-------------------------------|
| Flat     | (none)                         | Default state                 |
| Raised   | `shadow-sm`                    | Cards at rest                 |
| Lifted   | `shadow-md`                    | Hovered cards, dropdowns      |
| Floating | `shadow-lg`                    | Modals, tooltips              |

Cards: `bg-deany-cream rounded-2xl p-6 border border-deany-border shadow-sm`
Cards on hover: add `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`

### Spacing & Layout

- **Mobile-first.** Start at `max-w-md mx-auto px-5`. Expand with `md:` and `lg:` prefixes.
- **Vertical rhythm:** `space-y-6` between sections, `space-y-3` within groups, `space-y-1` for label+value pairs.
- **Page padding:** `py-8` for lesson screens, `py-12` for marketing pages, `py-16 md:py-24` for landing sections.
- **Content max-width:** `max-w-md` (448px) for lessons, `max-w-2xl` (672px) for articles, `max-w-5xl` (1024px) for landing pages on desktop.
- **When in doubt, add more whitespace, not less.**

### Component Patterns

Use these exact patterns. Do not reinvent.

**Primary CTA button:**
```jsx
<button className="w-full bg-deany-gold text-white px-6 py-3.5 rounded-xl font-medium
  hover:brightness-105 active:brightness-95 transition-all duration-200
  focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2
  disabled:bg-deany-border disabled:text-deany-muted disabled:cursor-not-allowed">
  Continue
</button>
```

**Secondary / ghost button:**
```jsx
<button className="px-6 py-3 rounded-xl font-medium text-deany-navy
  border border-deany-border hover:bg-deany-cream transition-all duration-200
  focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2">
  Go Back
</button>
```

**Text link button (e.g. "Back"):**
```jsx
<button className="text-sm text-deany-steel hover:text-deany-navy transition-colors duration-200">
  Back
</button>
```

**Standard card:**
```jsx
<div className="bg-deany-cream rounded-2xl p-6 border border-deany-border shadow-sm">
  {children}
</div>
```

**Feedback — correct:**
```jsx
<div className="bg-deany-sage-light border border-deany-sage/20 rounded-xl p-4">
  <p className="text-deany-navy font-medium">That's right.</p>
  <p className="text-deany-steel text-sm mt-1">{explanation}</p>
</div>
```

**Feedback — incorrect:**
```jsx
<div className="bg-deany-error-light border border-deany-error/20 rounded-xl p-4">
  <p className="text-deany-navy font-medium">Not quite.</p>
  <p className="text-deany-steel text-sm mt-1">{explanation}</p>
</div>
```

**Progress bar (lessons):**
```jsx
<div className="w-full h-1.5 bg-deany-border rounded-full">
  <div
    className="h-full bg-deany-gold rounded-full transition-all duration-300 ease-out"
    style={{ width: `${percent}%` }}
  />
</div>
```

**Empty state:**
```jsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-12 h-12 rounded-full bg-deany-cream flex items-center justify-center mb-4">
    {/* icon */}
  </div>
  <p className="text-deany-navy font-medium">No lessons yet</p>
  <p className="text-deany-muted text-sm mt-1">Check back soon.</p>
</div>
```

**Loading state:**
```jsx
<div className="flex items-center justify-center py-16">
  <div className="w-6 h-6 border-2 border-deany-border border-t-deany-gold rounded-full animate-spin" />
</div>
```

### Interaction Patterns

All tappable targets: `min-h-[48px]` minimum. Non-negotiable on mobile.

| Timing          | Use                           | Classes                             |
|-----------------|-------------------------------|-------------------------------------|
| Micro (instant) | Button press, toggle          | `duration-150 ease-out`             |
| Standard        | Card hover, state change      | `duration-200 ease-out`             |
| Smooth          | Screen transition, progress   | `duration-300 ease-out`             |
| Deliberate      | Modal open, celebration       | `duration-500 ease-in-out`          |

Never use `duration-700+` unless building a deliberate delight moment (lesson completion, milestone).

Focus states: every interactive element gets `focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2`.

### What Deany Never Looks Like

- Dark green everything. Sage is a garnish.
- Childish gamification (bouncy cartoons, star explosions, confetti, XP counters).
- Tacky gradients, neon accents, glowing borders, pulsing animations.
- Cluttered screens. If it feels busy, split it.
- Generic Bootstrap/Material UI aesthetic.
- Walls of text. If a screen has more than 3 sentences, it needs splitting or a visual.
- Modal dialogs for routine actions. Use inline UI instead.

---

## Voice & Copy

### Tone

Warm, clear, respectful. Like a thoughtful teacher who respects the learner's intelligence.

| Attribute     | Yes                                              | No                                            |
|---------------|--------------------------------------------------|-----------------------------------------------|
| Warm          | "You'll start to see…"                           | "The user shall proceed to…"                  |
| Clear         | "Riba means interest"                            | "Riba, often translated as usury or interest…" |
| Concise       | "Three things make a contract valid."             | "There are essentially three fundamental things that are generally considered to make…" |
| Respectful    | "Not quite — here's why."                         | "Wrong!"                                      |
| Grounded      | "Think about your last phone purchase."           | "Consider a hypothetical financial instrument." |
| Non-preachy   | "Islam asks us to think carefully about debt."    | "You must never take on debt because…"        |

### Rules

- Second person: "You'll learn…", "Think about…", "Try this."
- Short paragraphs. One idea per paragraph. Max 3 sentences per lesson screen.
- Define jargon on first use: "This is called *gharar* — excessive uncertainty."
- Never assume prior knowledge in Module 1. By Module 3+, you can build on established terms.
- Questions before answers. "What do you think makes a contract valid?" → then reveal.
- Celebrate with warmth, not noise: "Well done — you've just understood the foundation of Islamic contracts." Not "🎉 AMAZING! YOU DID IT! 🎉"

### Arabic Text

- Always render in `font-arabic` with `text-right` and `leading-loose`.
- Minimum size: `text-lg`. Preferably `text-xl` or larger.
- When pairing Arabic + English, put Arabic above or on the left (in a side-by-side), never inline mid-sentence.
- Include transliteration in parentheses on first use: عقد *(aqd)*
- Quranic text: always cite surah and ayah number. Never paraphrase — use an established translation and attribute it: `(Al-Baqarah 2:275, Sahih International)`.

### Hadith Policy

- **Sahih only.** Cite source and grading inline: `(Bukhari 2079)` or `(Muslim 1513)`.
- If using a hadith from Abu Dawud, Tirmidhi, etc., include the grading scholar: `(Abu Dawud 3594, graded sahih by al-Albani)`.
- Never introduce a hadith without grading.
- If you are unsure of the grading, do not include the hadith. Add `// REVIEW:HADITH — Could not verify grading for: "..."` and move on.
- Never fabricate or approximate a hadith. If you cannot recall the exact text, describe the concept instead and flag for review.

### Review Flag System

```jsx
{/* REVIEW:HADITH — Verify grading and source for this narration */}
{/* REVIEW:FIQH — This claim may vary by madhab. Needs scholarly check. */}
{/* REVIEW:QURAN — Verify translation accuracy for ayah reference */}
{/* REVIEW:COPY — Tone/wording needs human polish */}
{/* REVIEW:FINANCE — Verify this financial claim is accurate */}
```

Sweep command: `grep -rn "REVIEW:" src/ . --include="*.jsx"`

---

## Engineering Rules

### Naming

| Kind         | Convention              | Example                      |
|--------------|-------------------------|------------------------------|
| Lesson file  | `DEANY-M{n}L{n}.jsx`   | `DEANY-M2L1.jsx`            |
| Component    | PascalCase.jsx          | `QuizQuestion.jsx`           |
| Hook         | use + camelCase.js      | `useProgress.js`             |
| Utility      | camelCase.js            | `formatCurrency.js`          |
| Script       | kebab-case.sh           | `check-routes.sh`            |

**New lesson files go in `src/`.** Existing M1L2-M1L5 are in root for legacy reasons — do not move them unless asked.

### Component Rules

- One component per file. Tiny internal helpers (e.g., a `<OptionItem>` inside `QuizQuestion`) are fine.
- Props over global state. Pass down, lift only when 2+ siblings need the same data.
- Default exports for pages/lessons. Named exports for utilities and hooks.
- **Reuse `src/components/` before creating anything new.** Run `ls src/components/` first.
- Every component accepts an optional `className` prop merged onto the outermost element for overrides.
- Max file length: 250 lines. If longer, decompose.

### State Management

- `useState` for simple local UI state (screen index, toggle, input value).
- `useReducer` for complex multi-field state (quiz engine with score + answers + feedback).
- Prop drilling is fine for ≤3 levels. Beyond that, use React context.
- No Redux, Zustand, or Jotai unless explicitly approved.

### Lesson Architecture (The Screen Pattern)

Every lesson follows this exact structure. Do not deviate.

```jsx
import React, { useState } from 'react';

const DEANYM1L1 = () => {
  const [screen, setScreen] = useState(0);
  const [gates, setGates] = useState({});

  // Gating array: true = Continue is locked until interaction completes
  const gated = [false, false, true, false, true, false];
  const totalScreens = gated.length;
  const canProceed = !gated[screen] || gates[screen];

  const unlock = () => setGates(g => ({ ...g, [screen]: true }));
  const goNext = () => canProceed && setScreen(s => Math.min(s + 1, totalScreens - 1));
  const goBack = () => setScreen(s => Math.max(s - 1, 0));

  const screens = [
    () => ( /* Screen 0 */ ),
    () => ( /* Screen 1 */ ),
    // ...
  ];

  return (
    <div className="max-w-md mx-auto px-5 py-8 min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-deany-border rounded-full mb-8 flex-shrink-0">
        <div
          className="h-full bg-deany-gold rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((screen + 1) / totalScreens) * 100}%` }}
        />
      </div>

      {/* Content — fills available space */}
      <div className="flex-1 flex flex-col justify-center">
        {screens[screen]()}
      </div>

      {/* Navigation — pinned to bottom */}
      <div className="flex justify-between items-center mt-10 flex-shrink-0">
        {screen > 0 ? (
          <button onClick={goBack}
            className="text-sm text-deany-steel hover:text-deany-navy transition-colors duration-200">
            Back
          </button>
        ) : <div />}
        <button onClick={goNext} disabled={!canProceed}
          className={`ml-auto px-6 py-3.5 rounded-xl font-medium transition-all duration-200
            ${canProceed
              ? 'bg-deany-gold text-white hover:brightness-105 active:brightness-95'
              : 'bg-deany-border text-deany-muted cursor-not-allowed'}`}>
          {screen === totalScreens - 1 ? 'Complete Lesson' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default DEANYM1L1;
```

### Interaction Components (reuse these)

| Type                 | Component              | Props (key ones)                                 | Callback         |
|----------------------|------------------------|--------------------------------------------------|------------------|
| Multiple choice      | `QuizQuestion`         | `question, options, correctIndex, feedback*`     | `onAnswer(bool)` |
| Drag-to-rank         | `DragRankInteraction`  | `items, correctOrder`                            | `onComplete()`   |
| Pie chart builder    | `PieChartBuilder`      | `categories, targetAllocations`                  | `onComplete()`   |
| Bank statement flag  | `BankStatementFlag`    | `transactions, flaggableIndices`                 | `onComplete()`   |
| Reveal/flip card     | `RevealCard`           | `front, back`                                    | `onReveal()`     |
| Inline fill          | `InlineFill`           | `template, blanks, correctAnswers`               | `onComplete()`   |
| Reflection prompt    | `ReflectionPrompt`     | `question, placeholder`                          | `onSubmit(text)` |

Before building a new interaction type, check this table. If an existing component can be adapted with props, adapt it.

### Dependency Policy

- **No new npm packages without explicit human approval.**
- If you think a dependency is needed, state what it does, why a hand-built solution won't work, and the package size. Then wait for approval.

---

## Workflow Rules

### Commit Messages

```
feat(M2L1): build "What Is a Contract?" lesson (11 screens)
fix(router): prevent nested screen regression on back navigation
refactor(QuizQuestion): extract feedback into FeedbackBanner component
style(M1L3): align card spacing to design system
docs(CLAUDE): add Arabic text rendering rules
chore(deps): update vite to 5.4.2
```

### Build Check

Run after **every** change, not just at the end:
```bash
npm run build
```
If it fails, fix it before doing anything else. Never stack changes on top of a broken build.

### Guard Scripts

Run the relevant scripts after every task. These live in `scripts/`:

```bash
# Check all lesson files are referenced in App.jsx
bash scripts/check-routes.sh

# Check for hardcoded hex colours in JSX
bash scripts/lint-tokens.sh

# Find oversized component files
bash scripts/check-file-sizes.sh

# Sweep for pending content review flags
grep -rn "REVIEW:" src/ . --include="*.jsx"
```

### Regression Prevention

| After changing...         | Do this                                                       |
|---------------------------|---------------------------------------------------------------|
| `src/App.jsx` / routing   | Run `check-routes.sh`. Mentally trace all lesson navigation.  |
| A shared component        | `grep -r "import.*ComponentName" src/ .` → verify every usage.|
| `tailwind.config.js`      | `npm run build` + spot-check 2 existing pages visually.       |
| Any lesson file            | Verify the lesson loads, all screens advance, gating works.   |

---

## Known Pitfalls (from project history)

These are real bugs that have occurred in Deany. Watch for them.

| Pitfall                              | What happens                                             | Prevention                                                    |
|--------------------------------------|----------------------------------------------------------|---------------------------------------------------------------|
| Nested screen checks in App.jsx      | Adding a new route breaks existing routes silently        | Always check routing logic structure, not just the new route  |
| Bash `!` history expansion           | `!` in bash strings triggers shell history substitution   | Use Python or single-quoted strings for inline scripts        |
| Tailwind JIT dynamic class           | `bg-${color}-500` doesn't work at build time              | Always use complete static class strings                      |
| Screen index off-by-one              | `totalScreens` doesn't match `screens.length`            | Derive `totalScreens` from `gated.length` or `screens.length`|
| Missing `key` prop in `.map()`       | React warning + potential render bugs                     | Always add `key` to mapped elements                           |
| Gold on cream = low contrast         | `text-deany-gold` on `bg-deany-cream` fails WCAG         | Use gold only on white or navy backgrounds                    |
| Drag interactions vs mobile scroll   | Drag-to-rank components fight with page scrolling         | Test drag interactions in mobile viewport                     |
| Legacy `text-gray-*` classes         | Inconsistent text colours across pages                    | Replace with `text-deany-navy` / `text-deany-steel` on contact|
| Lesson files in two locations        | `find` misses files in root or src/                       | Always search both: `find . -maxdepth 2 -name "DEANY*"`      |

---

## Skills

Read the relevant skill file before starting any matching task:

| Skill                  | Location                                          | Trigger                                   |
|------------------------|---------------------------------------------------|-------------------------------------------|
| `landing-page-builder` | `.claude/skills/landing-page-builder/SKILL.md`    | Marketing page, homepage, module overview  |
| `ui-audit`             | `.claude/skills/ui-audit/SKILL.md`                | Quality review, polish, "check this page"  |
| `lesson-page-builder`  | `.claude/skills/lesson-page-builder/SKILL.md`     | New lesson creation                        |
| `component-refactor`   | `.claude/skills/component-refactor/SKILL.md`      | Extracting, splitting, deduplicating       |
| `bug-fix-investigator` | `.claude/skills/bug-fix-investigator/SKILL.md`    | Anything broken                            |

---

## Quality Bar

A task is **not done** until every applicable box is checked:

- [ ] `npm run build` passes — zero errors, zero warnings
- [ ] `bash scripts/check-routes.sh` — all lessons referenced (if routes touched)
- [ ] `bash scripts/lint-tokens.sh` — zero hardcoded hex in JSX
- [ ] Mobile layout correct at 375px viewport
- [ ] No new npm dependencies without explicit approval
- [ ] Existing pages and routes still work
- [ ] Reuses existing components from `src/components/`
- [ ] All tappable targets ≥ 48px
- [ ] All interactive elements have `focus-visible` ring
- [ ] Arabic text uses `font-arabic`, `text-right`, minimum `text-lg`
- [ ] Any religious content has `// REVIEW:` comments
- [ ] PR report template is filled out completely
