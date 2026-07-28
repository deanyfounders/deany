# DEANY Nexus — engineering reference model

The Nexus connects the mushaf and the route: reading an ayah surfaces the DEANY
lessons that reference it, and lessons deep-link back to the mushaf. This file is
the binding **engineering** reference (schemas, contracts, artifacts, gating) that
the pilot spec (`DEANY_Nexus_Pilot_Spec_v3_2`) builds on. It authors no religious
content — all narrative, rulings, glosses and question pools are Mehdi's, gated by
`status`. It is subordinate to [`ISLAMIC_ACCURACY_COVENANT.md`](../ISLAMIC_ACCURACY_COVENANT.md);
where they meet, the covenant wins.

Governing principle: **context is free, pedagogy is sequenced.** A reader asking
what an ayah connects to always receives the story; the *teaching* of that material
happens only inside the route, in order.

---

## 1. The connection graph

**Refs are the graph.** A ref links one lesson to a Qur'an range. Nothing paints
without refs — a story card with no approved ref shows nowhere.

Per-lesson ref file — `content/nexus/refs/<lesson_id>.json`:

```jsonc
{
  "lesson_id": "hist_b1_l2",
  "route": "history",      // route id, drives the "{route} route" chrome + graph node
  "position": 2,           // 1-based lesson position in that route (route structure, not scholarship)
  "refs": [
    { "source": "quran", "from": "106:1", "to": "106:4",   // a range (from+to), OR
      "rel": "discussed", "status": "pending_mehdi",
      "note": "CANDIDATE - Quraysh trade journeys; Mehdi to confirm" },
    { "source": "quran", "key": "3:130",                    // a single ayah (key)
      "rel": "proof_text", "status": "pending_mehdi", "note": "..." }
  ]
}
```

- `source`: `"quran"` for now (the graph is Qur'an ranges; hadith citations a lesson
  makes are lesson content, not nexus refs).
- exactly one of `key`, or `from`+`to` (same surah, `from` ≤ `to`).
- `rel` ∈ `discussed | proof_text | revealed_in_this_event | mentions | context`.
  Choosing rel is scholar work; engineering ships a candidate rel + `pending_mehdi`.
- `status` ∈ `pending_mehdi | approved | candidate`, **per ref**.
- Candidate refs are engineering placeholders, clearly marked in `note`. **Claude
  Code must never add, remove, or "improve" which ayat a lesson cites** — that is
  scholarly work. For a lesson that already cites ayat in its copy, transcribe
  those mechanically (the lesson wins over any expected list).

## 2. The refmap (compiled artifact)

The compiler expands refs by surah into `public/nexus/refmap/<surah>.json`, which
the reader fetches to paint dots. Every ref is emitted with its `status`; the
**reader** decides what paints (see gating). Deterministic: sorted, no timestamps.

```jsonc
// public/nexus/refmap/106.json
{ "surah": 106, "entries": [
  { "lesson_id": "hist_b1_l2", "route": "history", "position": 2,
    "rel": "discussed", "status": "pending_mehdi",
    "span": "106:1-106:4", "ayat": ["106:1","106:2","106:3","106:4"] } ] }
```

`public/nexus/refmap/index.json` lists the surahs/lessons present and a content
hash. Missing or failed refmap fetch = dots simply do not paint; connections are
enhancement, never load-bearing (retry on next surah load).

## 3. Story cards

`content/story-cards/<lesson_id>.json` — the standalone narrative of a linked
lesson's story, plus an end-of-card check and an SRS pool. Scholar container:
empty + `pending_mehdi` until authored; renders "Under scholar review" while empty,
never invented text.

```jsonc
{ "id": "story_hist_b1_l2", "lesson_id": "hist_b1_l2", "status": "pending_mehdi",
  "title": "", "sections": [ { "heading": "", "body": "" } ],
  "connection_note": "",                                  // why the tapped ayah relates
  "card_check": [ { "q": "", "options": [""], "answer_i": 0, "explain": "" } ],
  "srs_pool":   [ { "q": "", "options": [""], "answer_i": 0, "explain": "" } ] }
```

**Pool disjointness (compiler-enforced):** `card_check`, `srs_pool`, and the linked
lesson's own exercise bank must be disjoint. Questions are normalised (trim,
collapse whitespace, casefold); any duplicate fails the build. Spoiling a lesson's
productive-failure moments via its story card is impossible by construction. (Pilot
lesson banks live in JSX today; once a bank is a `content/quran-lessons/<id>.json`
with `exercises[].q`, the compiler folds it into the disjointness set automatically.)

## 4. connectionState (pure)

`src/lib/nexus/connectionState.js` — `connectionState(entity, routeProgress)` →
`"completed" | "up_next" | "ahead"`, recomputed at render, never cached.

- `entity`: `{ lessonId, route, position }` (1-based position).
- `routeProgress`: `{ [route]: completedCount }` (0 = zero progress).
- past the lesson → `completed`; the lesson at `completedCount+1` → `up_next`;
  beyond → `ahead`. Zero progress → lesson 1 is `up_next`, the rest `ahead`.

Boundary tests: `src/lib/nexus/connectionState.test.mjs` (blocking, run by the
compiler and the accuracy gate).

## 5. The nexus compiler

`scripts/nexus-compile.mjs` — `node scripts/nexus-compile.mjs` writes the refmap;
`--check` verifies the on-disk refmap is byte-identical to a fresh deterministic
run (used by the accuracy gate). It:

- rejects refs without `source`/`status`, malformed keys, or ranges outside the
  Tanzil dataset; validates both pilot ranges;
- validates story-card schema and (for `approved`) content completeness;
- enforces question-pool disjointness;
- runs the connectionState boundary tests;
- emits a deterministic refmap; two runs are byte-identical.

Wired into `scripts/accuracy-gate.mjs` (Absolute 5), so `npm run verify` / the
`prebuild` hook block on any nexus failure.

## 6. Mode placement (reader)

- **Learn** owns ambient discovery: connection dots paint on linked ayat; tapping
  a dot opens the Connections sheet. Word-tap, selection lessons, dots and story
  cards are one studying surface.
- **Assist** never shows dots or story content. Assist is help while reciting
  (sajdah, pause marks, repetition); interrupting recitation with narrative is a
  design failure. No exceptions.
- **Read** shows nothing ambient, but the tap-ayah translation panel gains a quiet
  **Connections** row (with a count) whenever the ayah has any. On-demand discovery
  is everywhere; only *ambient* discovery is Learn's.

## 7. Connection states → UI (Connections sheet)

Each lesson-linked row renders by `connectionState`:

- `completed` — tick + open the full lesson; secondary "Just the story" → card.
- `up_next` — "Up next in your route" + open the full lesson; secondary → card.
- `ahead` — "Lesson {n} in your {route} route. You are on lesson {m}." Tap opens
  the **story card only** (never the lesson; the route is not jumpable). If the
  card is still `pending_mehdi`, the row is non-tappable with an "Under scholar
  review" tag (the card is the destination and does not exist yet).

Verbatim chrome strings + analytics event names: `src/lib/nexus/copy.js`.

## 8. SRS resurfacing, reminders, provenance

- The card check's completion screen offers "Test me on this later" (off by
  default). Accepting pushes `srs_pool` items into the **existing** Practice SRS
  queue (`src/app/dashboard/srs.js` / `deany.state.v1`), typed `kind:
  "story_context"`, upserted by item id (opting in twice never duplicates).
  Declining leaves zero trace. No pop-ups; story items surface only inside the
  normal Practice review flow.
- **Reminders**: accepting "Remind me when I arrive" stores
  `{ lesson_id, ayah_key, accepted_at }` in `deany.nexus.reminders`. On route
  unlock, the lesson's opening screen shows a one-line provenance banner ("You
  found {surah} {ayah} while reading the mushaf", + review-history variant). A
  reminder whose lesson no longer exists is dropped silently on read. Local-only,
  no notifications; the banner is the reminder.
- Lessons may soft-skip their own duplicate warm-up items flagged
  `skippable_if_story_known: true` when story review history exists, but never skip
  teaching content.

## 9. XP

Card-check completion pays the standard micro-activity XP once ever per
`lesson_id` (persisted with the existing XP ledger; keyed to avoid double-award).
Reading, skipping, dots, sheets and reminders pay nothing. A re-take from the card
is a "Practice run, no XP."

## 10. Gating and rollout

One flag: `nexus_pilot` (`src/lib/flags.js`, hard-off in prod). It gates dots,
panel rows, sheet, cards, and completion-screen chips as one unit.

- **Dev builds** force it on with `pending_mehdi` content visible but marked.
- **Prod** shows nothing until the flag flips **and** content is `approved`.
- Kill switch is the same flag: off = the reader exactly as v2.1 shipped, zero dead
  UI. Refs are the graph, so `pending` refs → nothing paints even if a card is
  approved; approved refs + pending card → dots + sheet, with `ahead` rows gated.

## 11. Build status

- **Built (this stage):** ref + story-card schemas and the two pilot data files
  (all `pending_mehdi`); the refmap compiler + deterministic artifacts;
  `connectionState` + tests; chrome copy + event names; the `nexus_pilot` flag;
  `seededPick` determinism util; accuracy-gate wiring.
- **Pending (later stages, per spec section 12 ship order):** Connections sheet UI,
  story card + check component, Learn-mode dot painting, Read-mode panel row, the
  SRS `story_context` extension, reminders store + provenance banner, and the two
  lessons' completion-screen chips. All ship dark behind `nexus_pilot`.
- **Pending (Mehdi, the critical path):** confirm/replace candidate refs; author the
  two story cards, connection notes, and question pools; flip each file to
  `approved`. Until then everything is dark behind the flag and the pilot waits on
  content, not code.
