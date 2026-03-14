# SKILL: component-refactor

## When to Use

Extracting reusable components from existing code, splitting files that have grown too large, deduplicating repeated patterns across lesson files, or improving a component's props interface.

## Workflow

### 1. Map the blast radius

Before touching anything:

```bash
# What imports the target?
grep -rn "import.*ComponentName" src/ --include="*.jsx"

# Where does the repeated pattern appear?
grep -rn "pattern-to-extract" src/ . --include="*.jsx" | head -20

# How many files will change?
grep -rc "ComponentName" src/ --include="*.jsx" | grep -v ":0"

# How big is the target file?
wc -l [target-file]
```

Write down every file that will be affected. If more than 8 files, consider phasing the refactor.

### 2. State the goal in one sentence

Good:
- "Extract the quiz feedback UI from 6 lesson files into a `FeedbackBanner` component"
- "Split `M1L5.jsx` (380 lines) into a shell + `CapstoneQuiz` + `BankStatementExercise`"
- "Standardise the card pattern used in 4 lesson files into `ContentCard`"

If you cannot state it in one sentence, the refactor is too broad. Break it down.

### 3. Design the props interface

Write this out before any code:

```
Component: FeedbackBanner
Location:  src/components/FeedbackBanner.jsx

Props:
  type       'success' | 'error'     required     Determines colour scheme
  message    string                  required     Main feedback text
  detail     string                  optional     Explanatory sub-text
  className  string                  optional     Tailwind overrides on wrapper

Defaults:
  type = 'success'
  detail = null (hidden)
  className = '' (no override)

Renders:
  Success: bg-deany-sage-light border-deany-sage/20, "That's right." heading
  Error:   bg-deany-error-light border-deany-error/20, "Not quite." heading
```

**Props API rules:**
- Max 3 required props. If you need more, the component does too much.
- Every optional prop has a sensible default.
- Accept `className` for outer wrapper overrides. Merge with `${baseClasses} ${className}`.
- Never accept a `style` prop. Tailwind only.
- Boolean props use positive names: `isOpen` not `isNotClosed`, `showDetail` not `hideDetail`.
- Callback props: `on` + event name: `onAnswer`, `onReveal`, `onComplete`, `onDismiss`.

### 4. Common Deany extraction candidates

These patterns recur across lesson files and are prime refactor targets:

| Pattern                          | Extract to             | Found in            |
|----------------------------------|------------------------|---------------------|
| Quiz feedback (correct/incorrect)| `FeedbackBanner`       | Lesson practice screens |
| Numbered step list               | `StepList`             | Explain screens     |
| Arabic term with transliteration | `ArabicTerm`           | Concept screens     |
| Info card (cream bg, border)     | `ContentCard`          | Everywhere          |
| Lesson completion celebration    | `LessonComplete`       | Final screens       |
| Section heading + body text      | `ScreenText`           | All screen types    |
| Gated Continue navigation        | `LessonNav`            | Every lesson shell  |

Before creating a new component, check if the extraction target is already on this list and whether someone already built it in `src/components/`.

### 5. Implementation sequence

Follow this exact order:

```
a) Create the new component file in src/components/
b) npm run build                     ← component compiles on its own
c) Update ONE consuming file to use the new component
d) npm run build                     ← verify it works in context
e) Visually confirm: page looks identical before and after
f) Update remaining consuming files one at a time
g) npm run build after each file     ← catch breakage immediately
h) Delete old inline code
i) grep to confirm zero old-pattern remnants
j) Final npm run build
```

**Never batch all migrations and build once at the end.** Build after every file change.

### 6. Verify zero regressions

```bash
npm run build

# Confirm old pattern is gone
grep -rn "old-pattern" src/ --include="*.jsx"

# Confirm new component is imported everywhere it should be
grep -rn "import.*NewComponent" src/ --include="*.jsx"

# Run guard scripts
bash scripts/lint-tokens.sh
bash scripts/check-file-sizes.sh
```

## Output

- New component file(s) in `src/components/`
- Updated imports in all consuming files
- PR report listing every file touched and the before/after line counts

## Guardrails

- **Never refactor and add features simultaneously.** Refactor → commit → then add features.
- **Page must look identical before and after.** If any visual change occurs, you introduced a regression. Revert.
- **Max 3 required props on any new component.** More = split further.
- **Never extract a single-use pattern** unless it's an obvious reuse candidate (it appears on the extraction candidates list above, or you can name 2+ future places it will be used).
- **Component files ≤ 150 lines.** If still large after extraction, decompose further.
- **Build after every file, not just at the end.**
- **Include before/after line counts in the PR report:**
  ```
  M1L5.jsx: 380 → 220 lines (-160)
  M1L3.jsx: 190 → 140 lines (-50)
  New: FeedbackBanner.jsx (45 lines)
  Net: -165 lines, +1 reusable component
  ```
