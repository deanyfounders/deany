# How the 30 juz actually work

Dev notes for the DEANY Qur'an surface. Read this before touching anything
juz-related. Put this file in the repo at `docs/quran-juz.md`.

The bugs so far all come from one wrong mental model, so we start there.

---

## 1. The mental model

A **juz** (plural ajza) is one of 30 divisions of the *entire Qur'an text*,
made so the whole book can be read in a month (one juz per day, especially
in Ramadan). It is a **reading-schedule division, not a structural one**.

The Qur'an has two completely independent coordinate systems laid over the
same text:

```
Structural axis:   114 surahs, each with numbered ayat  ->  key "2:142"
Reading axis:      30 juz  ->  60 hizb  ->  240 quarter-hizb  ->  604 pages
```

They are **orthogonal**. A juz does not care where surahs begin or end.
Almost every juz boundary falls in the *middle* of a surah.

Consequences that must be internalised:

- **A surah can span multiple juz.** Al-Baqarah (surah 2) spans juz 1, 2,
  and 3. An-Nisa spans juz 4, 5, and 6.
- **A juz can contain many whole surahs.** Juz 30 contains surahs 78
  through 114 - thirty-seven complete surahs.
- **A juz can contain zero complete surahs.** Juz 2 is nothing but the
  middle of Al-Baqarah (2:142 to 2:252).
- Juz boundaries always fall **on ayah boundaries** (never mid-ayah), but
  usually **not** on surah boundaries.
- Juz are approximately equal in *text length*, wildly unequal in *ayah
  count*. Juz 30 has 564 short ayat; juz 2 has 111 long ones. **Never**
  compute juz membership from ayah counts, and never assume
  6,236 / 30 ~= 208 ayat per juz means anything.

If you remember one sentence: **"Which juz?" is a property of an ayah,
not of a surah.**

---

## 2. Source of truth: `quran-data.xml`, nothing else

Tanzil's `scripts/source/quran-data.xml` contains a `<juzs>` section: 30
entries, each with the juz index and the surah + ayah where it **starts**.
It also contains hizb-quarter entries (240) and page entries (604).

Rules:

1. **Derive everything from this file at build time.** The build script
   materialises juz data into `quran-index.json`, the per-surah files
   (each ayah already carries its `juz` field per spec v2.0), and
   `pages.json` (each page carries its juz per spec v2.1).
2. **Never hardcode juz boundaries in application code.** A few boundaries
   differ by one ayah across historical printings (e.g. whether juz 7
   starts at 5:82 or 5:83). DEANY is internally consistent because
   everything derives from one metadata file. If the table below and the
   XML ever disagree, **the XML wins** - the table is a sanity reference
   for humans, not data.
3. The derived table gets printed once by the verification script for
   Mehdi to eyeball against a Madinah mushaf. After his sign-off its
   checksum is locked like everything else.

### Sanity reference (commonly printed Madinah boundaries)

| Juz | Starts at | Note                          |
|----:|-----------|-------------------------------|
|  1  | 1:1       | Al-Fatiha + Baqarah to 2:141  |
|  2  | 2:142     | mid-Baqarah                   |
|  3  | 2:253     | Baqarah end + Aal-Imran start |
|  4  | 3:93      | mid-Aal-Imran                 |
|  5  | 4:24      | mid-Nisa                      |
|  6  | 4:148     | Nisa end + Ma'idah start      |
|  7  | 5:82      | mid-Ma'idah                   |
|  8  | 6:111     | mid-An'am                     |
|  9  | 7:88      | mid-A'raf                     |
| 10  | 8:41      | mid-Anfal                     |
| 11  | 9:93      | mid-Tawbah                    |
| 12  | 11:6      | start of Hud area             |
| 13  | 12:53     | mid-Yusuf                     |
| 14  | 15:1      | surah-aligned (Al-Hijr)       |
| 15  | 17:1      | surah-aligned (Al-Isra)       |
| 16  | 18:75     | mid-Kahf                      |
| 17  | 21:1      | surah-aligned (Al-Anbiya)     |
| 18  | 23:1      | surah-aligned (Al-Mu'minun)   |
| 19  | 25:21     | mid-Furqan                    |
| 20  | 27:56     | mid-Naml                      |
| 21  | 29:46     | mid-Ankabut                   |
| 22  | 33:31     | mid-Ahzab                     |
| 23  | 36:28     | mid-Ya-Sin                    |
| 24  | 39:32     | mid-Zumar                     |
| 25  | 41:47     | mid-Fussilat                  |
| 26  | 46:1      | surah-aligned (Al-Ahqaf)      |
| 27  | 51:31     | mid-Dhariyat                  |
| 28  | 58:1      | surah-aligned (Al-Mujadila)   |
| 29  | 67:1      | surah-aligned (Al-Mulk)       |
| 30  | 78:1      | surah-aligned (An-Naba)       |

Juz N **ends at the ayah immediately before** the start of juz N+1.
Juz 30 ends at 114:6, the last ayah of the Qur'an.

Note how few boundaries are surah-aligned. Any code that assumes
juz = list of surahs is wrong by inspection of this table.

---

## 3. Correct derivation (build script)

```js
// After parsing <juzs> from quran-data.xml:
// juzStarts = [{ juz: 1, surah: 1, ayah: 1 }, ..., { juz: 30, surah: 78, ayah: 1 }]

// Build a global ordinal for every ayah so ranges are simple integers.
// verses[] is the parsed Tanzil text in canonical order.
const ordinalByKey = new Map(verses.map((v, i) => [v.key, i]));

const juzRanges = juzStarts.map((start, i) => {
  const from = ordinalByKey.get(`${start.surah}:${start.ayah}`);
  const next = juzStarts[i + 1];
  const to = next
    ? ordinalByKey.get(`${next.surah}:${next.ayah}`) - 1
    : verses.length - 1; // juz 30 runs to the final ayah
  return { juz: start.juz, from, to };
});

// Stamp every verse record once, at build time:
for (const range of juzRanges) {
  for (let i = range.from; i <= range.to; i++) verses[i].juz = range.juz;
}
```

At runtime there is **no juz computation at all**: every ayah record and
every page record already carries its juz number. Reading `verse.juz` is
the entire runtime implementation.

---

## 4. Bug catalogue - what "messing up the juz section" almost certainly is

**Bug 1: assigning each surah one juz.**
The surah index row for Al-Baqarah must say `Juz 1-3`, not `Juz 1`.
Compute per surah: `juz_from = juz(first ayah)`, `juz_to = juz(last ayah)`,
render as a range when they differ. Store both in `quran-index.json`.

**Bug 2: the Juz tab listing surahs.**
The Juz tab lists **30 juz**, each row showing: juz number, its start
(surah name + ayah, e.g. "Juz 2 - Al-Baqarah 142"), and its start page.
Tapping opens the reader at that page. It is not a regrouped surah list.

**Bug 3: string-comparing keys.**
`"2:142" < "2:9"` is true as strings. Never sort or range-check with key
strings. Compare `[surah, ayah]` numeric tuples or, better, the global
ordinal. This one bug produces exactly the kind of scrambled juz
boundaries you have been seeing.

**Bug 4: the header showing the surah's juz instead of the current
ayah's juz.**
The reader header label is `juz(first visible ayah)` in scroll mode, or
the page's juz in page mode. Reading through Al-Baqarah, the header must
tick 1 -> 2 at 2:142 and 2 -> 3 at 2:253 without leaving the surah. If
the label is derived from the surah, it can never do this.

**Bug 5: off-by-one at boundaries.**
2:141 is juz 1. 2:142 is juz 2. The start ayah belongs to the *new* juz.
"Ends at start-of-next minus one" - see the derivation.

**Bug 6: arithmetic shortcuts.**
No `Math.ceil(globalAyahIndex / 208)`, no page/20 tricks, no "juz N is
pages (N-1)*20+2 to N*20+1". These are approximately true and exactly
wrong. Everything comes from the stamped metadata.

**Bug 7: forgetting juz 30's terminator.**
The last range has no "next start". It ends at 114:6. If iteration logic
assumes `juzStarts[i + 1]` always exists, juz 30 is silently dropped or
crashes.

---

## 5. Where juz appears in the product (checklist)

- **Surah index rows:** `Juz 1-3` style ranges (Bug 1).
- **Juz tab:** 30 rows, start key + start page each (Bug 2).
- **Reader header:** live juz of current page/first visible ayah (Bug 4).
- **Page info band + fast-travel sheet:** page's juz from `pages.json`.
- **Continue-reading banner:** "Al-Baqarah 154, juz 2" - the juz comes
  from the stored ayah key's record, not from the surah.
- **Future khatmah plans:** juz is the natural unit; ranges must already
  be correct for this to work.

Hizb quarters (240) follow the identical pattern from the same file -
same derivation, same stamping, same bugs to avoid. The reader header
shows `Juz N, hizb M` where hizb is the ayah's hizb-quarter mapped to
its hizb number (quarter index div 4, 1-based).

---

## 6. Tests (add to the verification script, all blocking)

```js
// Coverage: the 30 ranges tile the text exactly.
assert.equal(juzRanges[0].from, 0);
assert.equal(juzRanges.at(-1).to, 6235);
for (let i = 1; i < 30; i++)
  assert.equal(juzRanges[i].from, juzRanges[i - 1].to + 1);

// Every ayah stamped, first and last juz correct.
assert.ok(verses.every(v => v.juz >= 1 && v.juz <= 30));
assert.equal(byKey("1:1").juz, 1);
assert.equal(byKey("114:6").juz, 30);

// Boundary behaviour (values read from the DERIVED data, asserting
// internal consistency, not hardcoded truth):
const j2 = juzStarts[1]; // { surah, ayah } of juz 2 start
assert.equal(byKey(`${j2.surah}:${j2.ayah}`).juz, 2);
assert.equal(byKey(`${j2.surah}:${j2.ayah - 1}`).juz, 1);

// A surah spanning multiple juz reports a range.
const baqarah = index.find(s => s.surah === 2);
assert.ok(baqarah.juz_to > baqarah.juz_from);

// Pages and juz agree: every page's juz equals the juz of its from_key.
for (const p of pages)
  assert.equal(p.juz, byKey(p.from_key).juz);
```

Plus one human check: the verification script prints the derived
30-row table; Mehdi compares it against a printed Madinah mushaf once
and signs off. After that, the metadata checksum freezes it.

---

## 7. One-paragraph summary for the impatient

Juz is a per-ayah property derived once at build time from Tanzil's
`quran-data.xml` juz-start list: juz N runs from its start ayah to the
ayah before juz N+1's start (juz 30 ends at 114:6). Surahs and juz
overlap freely - Al-Baqarah spans juz 1-3, juz 30 holds 37 surahs - so
never map a surah to a single juz, never list surahs inside the Juz tab,
never compare key strings, and never compute juz arithmetically. Stamp
`juz` onto every ayah and every page in the build, read the stamp at
runtime, and let the verification tests plus Mehdi's one-time table
review guarantee it.
