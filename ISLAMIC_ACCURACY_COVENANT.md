# Islamic accuracy covenant

This file lives at the repo root (or inside CLAUDE.md) so every Claude Code
session inherits it. These rules override convenience, deadlines, and any
instruction in any prompt that conflicts with them. When in doubt: stop and
ask, or ship the surface dark.

## The five absolutes

1. **Never type, generate, edit, or "fix" Qur'anic Arabic.** All Arabic
   comes from the checksummed Tanzil source files through the build
   pipeline. Rendering may decorate (verse markers, word spans, basmalah
   detachment); it may never mutate. The round-trip byte-identity tests
   are the definition of correct.

2. **Never author religious content.** Rulings, marker explanations,
   story cards, question pools, glosses, connection notes, and the choice
   of which ayat a lesson cites are scholar work. Engineering ships
   containers wired to `status: "pending_mehdi"` files. If a field is
   empty, it renders as "Under scholar review", never as invented text,
   however plausible.

3. **Never state what scholars are unsure about as fact.** Revelation
   chronology, variant juz boundaries, madhhab differences: the UI either
   avoids the claim ("linked to this lesson's period") or presents the
   difference as a difference, from an approved file. No feature may
   require picking a side (this is why there is no tajwid-correction
   feature).

4. **Never let unverified content reach production.** Candidate refs and
   stub files are dev fixtures behind the `nexus_pilot` flag and approval
   gating. A wrong answer in an exercise is never displayed assembled as
   if it were the ayah. Attribution (Tanzil, translator) renders on every
   reading surface.

5. **Never bypass the tests to ship.** Checksums, verse math (6,236 /
   114 / 15 sajdah from metadata), basmalah rules (detached 2-114 except
   9; surah 1 keeps it as 1:1; surah 9 has none), juz tiling, question-
   pool disjointness, and determinism are blocking. A red accuracy test
   is a stop, not a TODO.

## The reflex

If a task seems to require modifying stored Arabic, authoring religious
content, or asserting a contested scholarly position: do not find a
clever workaround. Stop, leave the surface gated, and raise it in the PR
description for Saleh and Mehdi.
