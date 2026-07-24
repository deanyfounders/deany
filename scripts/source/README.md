# Qur'an source files (vendored, checksummed, never edited)

The Arabic Qur'an text is **immutable** and must never be typed, generated, or
"fixed" by code or by an AI model. It flows verbatim from the verified Tanzil
download only. A human (Saleh) downloads these four files, commits them here, and
records their SHA-256 in `CHECKSUMS.sha256`. The build refuses to run without them.

## Files to place in this folder

1. `quran-uthmani.txt` - Tanzil **Uthmani** text v1.1, format **"Text with aya numbers"**, **pause marks ON**, **sajdah signs ON**. From https://tanzil.net/download
2. `quran-simple-clean.txt` - Tanzil **Simple Clean** text, same "aya numbers" format (used for search / matching only, never displayed).
3. `quran-data.xml` - Tanzil metadata (surah names, ayah counts, revelation, juz / hizb / ruku / page / sajda boundaries). From https://tanzil.net/docs/quran_data
4. `pickthall.json` - Marmaduke Pickthall (1930), the **Project Gutenberg public-domain edition** (NOT Tanzil's translation page, NOT the fawazahmed0 CDN). Convert once to a verse-keyed object `{ "1:1": "..." }` (or `{ verses: [{ key, text }] }`), count must be 6,236.

## Record checksums

```
cd scripts/source
shasum -a 256 quran-uthmani.txt quran-simple-clean.txt quran-data.xml pickthall.json > CHECKSUMS.sha256
```

## Build + verify

```
node scripts/build-quran.mjs     # writes src/data/quran-index.json + public/quran/surah/*.json
node scripts/verify-quran.mjs    # 6236 ayat, unique keys, byte-identity, 15 sajdah, surah 9 no basmalah, english present
```

Until these files exist, the app ships the Qur'an tab in a **preview** state: the
index and reader render, but no verse text is shown. Nothing is fabricated.
