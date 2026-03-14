# SKILL: lesson-page-builder

## When to Use

Creating a new lesson JSX file for any Deany module. A "lesson" is an interactive, screen-based learning experience following Deany's pedagogy: discovery-first, visual-first, productive failure, progressive disclosure.

## Workflow

### 1. Inspect existing lessons

```bash
find . -maxdepth 2 -name "DEANY*M*L*.jsx" | sort
cat DEANY_M1L5.jsx            # Most complete reference
ls src/components/                   # Available interactions
cat tailwind.config.js               # Design tokens
cat docs/curriculum/* module2-instructions.md 2>/dev/null    # Curriculum docs if they exist
```

Understand the screen-array pattern, the gating system, and which interaction components exist.

### 2. Confirm the lesson spec

Before writing code, have clear answers for:

- Module + lesson number (e.g., M2L1)
- Title and 2-3 learning objectives
- Screen count target (standard: 8-12, capstone: 12-18)
- Which interaction components to use (from CLAUDE.md table)
- Key concepts and any Arabic terms to introduce
- Is this a capstone (L5)? If yes, use more varied interactions.

### 3. Design the screen flow using the pedagogy phases

Every lesson moves through five phases. Map screens to phases before coding.

```
PHASE 1 — HOOK (1-2 screens)
Purpose: Create curiosity. Make the learner care.
Screen types: Scenario, Question, Surprising Fact

PHASE 2 — DISCOVER (1-3 screens)
Purpose: Let the learner think before being told.
Screen types: Open Question, Exploration, Prediction
Rule: Never explain in this phase. Only ask.

PHASE 3 — EXPLAIN (2-4 screens)
Purpose: Introduce the concept with clarity and visuals.
Screen types: Concept Card, Comparison, Term Introduction, Numbered Steps
Rule: Max 3 sentences per screen. One concept per screen.

PHASE 4 — PRACTICE (2-4 screens)
Purpose: Test understanding through interaction. All gated.
Screen types: Quiz, Reveal Card, Drag-to-Rank, Fill-in, Flag Exercise
Rule: Every practice screen gates Continue. Use existing components.

PHASE 5 — SYNTHESISE (1-2 screens)
Purpose: Connect to real life. Celebrate. Close the loop.
Screen types: Real-World Connection, Summary, Completion
Rule: Reference the hook scenario. Show how the learner can apply this.
```

### 4. Screen type templates

Use these exact patterns for each screen type:

**Scenario (Hook)**
```jsx
() => (
  <div className="space-y-6">
    <h1 className="text-2xl font-semibold text-deany-navy leading-tight">
      You walk into a shop and buy a phone.
    </h1>
    <p className="text-deany-steel leading-relaxed">
      You hand over money. They hand over the phone.
      But what actually just happened?
    </p>
  </div>
),
```

**Open Question (Discover)**
```jsx
() => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-deany-navy">
      What do you think both sides need for a deal to count?
    </h2>
    <div className="bg-deany-cream rounded-2xl p-6 border border-deany-border">
      <p className="text-sm text-deany-muted italic">
        Take a moment. There's no wrong answer here.
      </p>
    </div>
  </div>
),
```

**Term Introduction (Explain)**
```jsx
() => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-deany-navy">
      In Islamic law, this is called{' '}
      <span className="text-deany-gold">aqd</span> (عقد).
    </h2>
    <p className="text-deany-steel leading-relaxed">
      The word literally means "to tie" — binding two
      people's commitments together.
    </p>
  </div>
),
```

**Numbered Steps (Explain)**
```jsx
() => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-deany-navy">
      Three things make a contract valid.
    </h2>
    <div className="space-y-3">
      {['An offer from one side', 'Acceptance from the other', 'Something of value exchanged'].map(
        (item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-deany-gold text-white
              flex items-center justify-center text-sm font-medium">
              {i + 1}
            </span>
            <p className="text-deany-steel leading-relaxed pt-0.5">{item}</p>
          </div>
        )
      )}
    </div>
  </div>
),
```

**Quiz (Practice — GATED)**
```jsx
() => (
  <div className="space-y-6">
    <QuizQuestion
      question="Which of these would make an Islamic contract invalid?"
      options={[
        'The buyer and seller shake hands',
        'The price includes a hidden interest charge',
        'The contract is written in English',
        'The item is paid for in instalments',
      ]}
      correctIndex={1}
      onAnswer={(correct) => { if (correct) unlock(); }}
      feedbackCorrect="That's right — riba (interest) invalidates an Islamic contract."
      feedbackIncorrect="Not quite. Hidden interest (riba) is what makes this contract impermissible in Islam."
    />
  </div>
),
```

**Reveal Card (Practice — GATED)**
```jsx
() => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-deany-navy">
      Tap to reveal the meaning.
    </h2>
    <RevealCard
      front="What does aqd (عقد) literally mean?"
      back="To tie — binding two parties' commitments together."
      onReveal={unlock}
    />
  </div>
),
```

**Real-World Connection (Synthesise)**
```jsx
() => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-deany-navy">
      Try this next time you sign something.
    </h2>
    <div className="bg-deany-cream rounded-2xl p-6 border border-deany-border space-y-3">
      <p className="text-deany-navy font-medium">Is there hidden interest?</p>
      <p className="text-deany-navy font-medium">Do I know exactly what I'm getting?</p>
      <p className="text-deany-navy font-medium">Is the subject matter permissible?</p>
    </div>
    <p className="text-deany-steel leading-relaxed">
      If all three pass, the contract aligns with the basics of aqd.
    </p>
  </div>
),
```

**Completion (Synthesise — final screen)**
```jsx
() => (
  <div className="space-y-6 text-center">
    <div className="w-16 h-16 rounded-full bg-deany-gold-light flex items-center justify-center mx-auto">
      <span className="text-2xl">✓</span>
    </div>
    <h2 className="text-xl font-semibold text-deany-navy">
      Lesson complete.
    </h2>
    <p className="text-deany-steel leading-relaxed">
      You now understand the foundation of Islamic contracts —
      offer, acceptance, value, and the three Shariah conditions.
    </p>
  </div>
),
```

### 5. Build the lesson

Use the canonical lesson shell from CLAUDE.md. Critical details:

- `gated` array must have exactly one entry per screen (`true` for interaction screens, `false` otherwise).
- `totalScreens` is derived from `gated.length` — never hardcode a number.
- `unlock` function sets `gates[screen] = true` for the current screen.
- Pass `unlock` (or a callback that calls `unlock`) to interaction components' completion callbacks.
- `canProceed` checks: `!gated[screen] || gates[screen]`.
- Continue button: disabled + grey (`bg-deany-border text-deany-muted`) when locked.
- Final screen: "Complete Lesson" instead of "Continue".

### 6. Content rules

- **Max 3 sentences per screen.** If you need more, split.
- **One concept per screen.** Never introduce two ideas at once.
- **Questions before answers.** Ask the learner to think, then reveal.
- **Real-world grounding.** Every concept connects to: salary, rent, phone, savings, food, or a contract the learner has actually encountered.
- **Arabic terms:** Introduce with transliteration on first use: عقد *(aqd)*. Always `font-arabic text-right` for Arabic text blocks.
- **Feedback language:** "That's right" / "Not quite — here's why". Never "Correct!" / "Wrong!" / "Oops!"
- **Hadith:** Sahih only. Include source + grading inline. Flag uncertain ones with `// REVIEW:HADITH`.

### 7. Register the route + verify

```bash
# Add import + route to App.jsx matching existing pattern
# Then:
npm run build
bash scripts/check-routes.sh
bash scripts/lint-tokens.sh
```

Mentally trace: can a user reach this lesson from the module overview? Does back-navigation work?

## Output

- `src/DEANY-M[X]L[Y].jsx` — complete lesson file
- Updated `src/App.jsx` — new route
- PR report

## Guardrails

- **Max 18 screens per lesson.** If content needs more, split into two lessons.
- **Derive `totalScreens` from array length.** Never hardcode `const totalScreens = 11`.
- **Never build a new interaction component** if an existing one fits.
- **Never use `alert()`, `confirm()`, or `prompt()`.** All feedback is inline UI.
- **Every practice screen gates Continue.** Learners cannot skip interactions.
- **Every screen completable with one thumb on mobile.** Min tap target 48px. No drag that fights scroll.
- **No screen with only a heading and nothing else.** Every screen has heading + at least one body element (text, card, interaction, or visual).
- **Lesson file ≤ 250 lines.** If longer, extract interaction screens into sub-components in `src/components/`.
