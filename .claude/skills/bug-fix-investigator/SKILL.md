# SKILL: bug-fix-investigator

## When to Use

Diagnosing and fixing any bug: broken layout, routing failure, interaction not responding, build error, blank screen, content rendering wrong, or any "it used to work" situation.

## Workflow

### 1. Classify the bug type

Before touching any file, identify which category:

| Category          | Symptoms                                          | Start here            |
|-------------------|---------------------------------------------------|-----------------------|
| **Build failure** | `npm run build` fails with error                  | Read the error message|
| **Blank screen**  | Page loads but nothing renders                    | Browser console + App.jsx |
| **Routing**       | Wrong page loads, or navigation breaks            | `src/App.jsx`         |
| **Interaction**   | Button/quiz/drag doesn't respond                  | Lesson file + component |
| **Layout**        | Overflow, misalignment, broken on mobile          | Target JSX + Tailwind classes |
| **Content**       | Wrong text, missing Arabic, broken hadith citation| Target JSX content    |
| **State**         | Screen doesn't advance, progress stuck            | useState/gating logic |

### 2. Reproduce — read the error, not just the symptom

```bash
# Always start with build status
npm run build 2>&1 | tail -30

# For routing bugs
cat src/App.jsx
grep -n "screen.*===\|setScreen" src/App.jsx

# For interaction bugs — find the exact component + callback chain
grep -n "onAnswer\|onComplete\|onReveal\|unlock\|gates\|gated" [lesson-file]
grep -n "onAnswer\|onComplete\|onReveal" src/components/[interaction-component]

# For layout bugs
grep -n "className" [target-file] | head -30

# For blank screen — check imports
grep -n "^import" [target-file]
# Check if the component exists at the imported path
ls -la [imported-path]
```

State the bug in one sentence:
> "The Continue button on M1L3 screen 4 stays grey after answering the quiz correctly."

### 3. Hypothesise before changing anything

Write your hypothesis:

```
Hypothesis: QuizQuestion calls onAnswer(true) on correct answer,
but M1L3 doesn't pass an onAnswer prop — it passes onComplete,
which QuizQuestion doesn't recognise. The gate never unlocks.
```

### 4. Verify the hypothesis with evidence

Read the specific code. Confirm or reject with line numbers.

```bash
# Check what prop the lesson passes
grep -n "QuizQuestion" src/lessons/M1L3.jsx

# Check what prop the component expects
grep -n "props\.\|onAnswer\|onComplete" src/components/QuizQuestion.jsx | head -10
```

If hypothesis is wrong → form a new one. **Never shotgun-debug by changing random things.**

### 5. Apply the minimal fix

Change the fewest lines possible. Follow this hierarchy:

1. **Fix the root cause** (wrong prop name, missing callback, bad condition)
2. **Add a safeguard** only if the bug was an edge case likely to recur
3. **Never refactor** surrounding code inside a bug fix

### 6. Check for sibling bugs

The same pattern likely exists elsewhere:

```bash
# Find all files with the same broken pattern
grep -rn "same-broken-pattern" src/ . --include="*.jsx"
```

Fix siblings in the same change. Note them in the report.

### 7. Verify

```bash
npm run build
bash scripts/check-routes.sh    # if routing was involved
bash scripts/lint-tokens.sh     # if visual changes were made
```

Mentally trace the full user flow. Confirm the fix works end-to-end.

---

## Known Deany Bug Catalog

These are real bugs from project history. When diagnosing, check if the current bug matches a known pattern.

### BUG-001: Nested screen check regression
**Cause:** Adding a new `screen === 'X'` check in App.jsx inside the wrong conditional branch causes other screens to stop rendering.
**Symptoms:** New route works, but an existing lesson/page goes blank.
**Fix:** Verify the routing logic structure. Each screen check should be at the same nesting level.
**Prevention:** Always read the full routing block in App.jsx before adding a route, not just the spot where you insert.

### BUG-002: Bash history expansion in inline scripts
**Cause:** Using `!` in bash commands triggers shell history expansion.
**Symptoms:** `bash: !: event not found` errors.
**Fix:** Use single-quoted strings, or write the logic in Python/Node instead of inline bash.

### BUG-003: Tailwind JIT dynamic class not generating
**Cause:** Constructing class names dynamically: `bg-${color}-500` — Tailwind can't detect these at build time.
**Symptoms:** Element has the correct class in DOM but no styling applied.
**Fix:** Always use complete, static class strings. Use a lookup object if needed:
```jsx
const colors = { success: 'bg-deany-sage-light', error: 'bg-deany-error-light' };
<div className={colors[type]} />
```

### BUG-004: Screen count off-by-one
**Cause:** `totalScreens` is hardcoded to a number that doesn't match `screens.length` or `gated.length`.
**Symptoms:** Last screen unreachable, or Continue button does nothing on penultimate screen, or extra blank screen.
**Fix:** Derive from array: `const totalScreens = screens.length`. Or better: `const totalScreens = gated.length` and ensure `gated.length === screens.length`.

### BUG-005: Gate array / screen array length mismatch
**Cause:** `gated` has fewer entries than `screens` (or vice versa) after adding/removing a screen.
**Symptoms:** `gated[screen]` returns `undefined`, which is falsy → gating silently disabled on that screen.
**Fix:** Count both arrays and ensure they match. Add a dev-only check:
```jsx
if (gated.length !== screens.length) console.error('Gate/screen mismatch:', gated.length, screens.length);
```
Remove the check before committing.

### BUG-006: Missing key prop in .map()
**Cause:** Rendering a list with `.map()` without a `key` prop.
**Symptoms:** React warning in console. Potentially broken re-renders when list order changes.
**Fix:** Add `key={i}` (for static lists) or `key={item.id}` (for dynamic lists).

### BUG-007: Gold text on cream — invisible
**Cause:** `text-deany-gold` on `bg-deany-cream` has very low contrast.
**Symptoms:** Text looks washed out, nearly invisible on some screens.
**Fix:** Use gold text only on white or navy backgrounds. On cream, use `text-deany-navy`.

### BUG-008: Arabic text too small to read
**Cause:** Arabic rendered at `text-base` or `text-sm`.
**Symptoms:** Arabic script is cramped and illegible, especially on mobile.
**Fix:** Minimum `text-lg`, preferably `text-xl`. Always pair with `leading-loose` and `font-arabic`.

---

## Output Format

```markdown
## Bug Fix Report

### Symptom
[What the user saw / what was broken]

### Root Cause
[One sentence. Reference a BUG-XXX pattern if applicable.]

### Hypothesis → Evidence
Hypothesis: [what you guessed]
Evidence: [what you found at file:line that confirmed/rejected it]

### Fix Applied
[What changed, file:line, and why this fixes the root cause]

### Sibling Bugs
- [Same pattern found in M1L4.jsx — fixed]
- [None found]

### Files Changed
| File                    | Lines changed | What                                   |
|-------------------------|---------------|----------------------------------------|
| src/lessons/M1L3.jsx    | 2             | Changed onComplete → onAnswer prop     |

### Build & Guard Scripts
- npm run build: ✅
- check-routes.sh: ✅ (or N/A)
- lint-tokens.sh: ✅ (or N/A)

### How to Test
1. [Step-by-step user flow]
2. [Expected behaviour at each step]

### Risks
[Side effects to watch, or "None — isolated change"]
```

## Guardrails

- **Max 5 files changed in a bug fix.** More means it's a refactor. Flag and plan.
- **Never fix a bug you can't explain.** If you can't state the root cause, keep investigating.
- **Never suppress errors.** No empty `catch`, no `|| null` to hide undefined, no `?.` chains to silence symptoms.
- **Remove all `console.log` before reporting.**
- **If routing is involved, test ALL routes, not just the broken one.** (See BUG-001.)
- **If the bug is religious content (wrong hadith, wrong grading, incorrect fiqh), do not fix it.** Flag with `// REVIEW:` and note in report.
- **If you cannot identify the root cause after 10 minutes of investigation, say so.** Report what you've ruled out and suggest next steps. Do not guess-and-patch.
