# SKILL: landing-page-builder

## When to Use

Building or redesigning any marketing-facing page: homepage, module overview, pricing, about, or any page whose purpose is to communicate value and convert visitors.

## Workflow

### 1. Inspect (≤2 min)

```bash
cat src/App.jsx
ls src/components/
find src/ -name "*.jsx" | grep -iE "land|home|page"
cat tailwind.config.js
```

Note what exists, what can be reused, what route pattern to follow.

### 2. Plan the section map

Every landing page draws from this section library. Pick 4-6 sections. Write them out before coding.

```
HERO         → One headline + one subline + one CTA. Nothing else.
TRUST        → One ayah or sahih hadith (with citation) OR a credential/number.
VALUE_PROPS  → 3 cards. Icon + heading + one sentence each.
HOW_IT_WORKS → 3 numbered steps showing the learning path.
PREVIEW      → A visual showing what a lesson looks like inside Deany.
SOCIAL_PROOF → Testimonials or user count. Only if real data exists.
CTA_BAND     → Repeated CTA with urgency or clarity.
FOOTER       → Links, copyright, minimal.
```

### 3. Build each section using these templates

**HERO**
```jsx
<section className="bg-white px-5 py-20 md:py-32">
  <div className="max-w-2xl mx-auto text-center">
    <h1 className="text-3xl md:text-5xl font-semibold text-deany-navy leading-tight">
      Understand your money through{' '}
      <span className="text-deany-gold">an Islamic lens</span>
    </h1>
    <p className="mt-4 text-lg text-deany-steel leading-relaxed max-w-xl mx-auto">
      Interactive lessons on Islamic finance — built for beginners
      who want clarity, not confusion.
    </p>
    <button className="mt-8 bg-deany-gold text-white px-8 py-4 rounded-xl font-medium
      text-lg hover:brightness-105 active:brightness-95 transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2">
      Start Learning — Free
    </button>
  </div>
</section>
```

**TRUST**
```jsx
<section className="bg-deany-cream px-5 py-12">
  <div className="max-w-xl mx-auto text-center">
    <p className="font-arabic text-xl text-deany-navy leading-loose dir-rtl">
      وَأَحَلَّ ٱللَّهُ ٱلۡبَيۡعَ وَحَرَّمَ ٱلرِّبَوٰا۟
    </p>
    <p className="mt-3 text-sm text-deany-muted">
      "Allah has permitted trade and forbidden interest."
      — Al-Baqarah 2:275
    </p>
    {/* REVIEW:QURAN — Verify translation accuracy */}
  </div>
</section>
```

**VALUE_PROPS**
```jsx
<section className="bg-white px-5 py-16 md:py-24">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-2xl font-semibold text-deany-navy text-center mb-12">
      Why learners choose Deany
    </h2>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { icon: '📖', title: 'Built for beginners', desc: 'No jargon. No assumptions. Start from zero.' },
        { icon: '🎯', title: 'Learn by doing', desc: 'Interactive exercises, not passive reading.' },
        { icon: '✅', title: 'Rooted in scholarship', desc: 'Every claim sourced. Sahih hadith only.' },
      ].map((item, i) => (
        <div key={i} className="bg-deany-cream rounded-2xl p-6 border border-deany-border
          text-center shadow-sm">
          <span className="text-3xl">{item.icon}</span>
          <h3 className="mt-4 text-lg font-medium text-deany-navy">{item.title}</h3>
          <p className="mt-2 text-sm text-deany-steel leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**CTA_BAND**
```jsx
<section className="bg-deany-navy px-5 py-16">
  <div className="max-w-xl mx-auto text-center">
    <h2 className="text-2xl font-semibold text-white">
      Ready to start?
    </h2>
    <p className="mt-3 text-deany-muted">
      Module 1 is free. No account needed.
    </p>
    <button className="mt-6 bg-deany-gold text-white px-8 py-4 rounded-xl font-medium
      hover:brightness-105 transition-all duration-200">
      Begin Module 1
    </button>
  </div>
</section>
```

### 4. Copy quality check

Before finishing, verify every heading passes the "so what?" test:

| Weak                       | Strong                                             |
|----------------------------|----------------------------------------------------|
| "Learn Islamic Finance"    | "Understand your money through an Islamic lens"    |
| "Our Features"             | "Why learners choose Deany"                        |
| "Get Started"              | "Begin Module 1 — it's free"                       |
| "About Us"                 | "Built by learners, for learners"                  |

### 5. Responsive check

Verify these breakpoints mentally:
- **375px** (iPhone SE): single column, no overflow, readable text
- **768px** (iPad): 2-col grids where applicable, more breathing room
- **1280px** (desktop): max-width caps content, generous whitespace

### 6. Verify

```bash
npm run build
bash scripts/lint-tokens.sh
bash scripts/check-routes.sh  # if new route added
```

## Output Format

Single `.jsx` file in `src/`. Default export. Fully responsive. All copy is real or marked `{/* TODO: final copy */}`.

## Guardrails

- **No hero carousels or sliders.** One strong message > five rotating weak ones.
- **No stock photography of mosques, prayer mats, or generic Islamic imagery.** Use typography, geometric patterns, or whitespace.
- **No "Sign up for our newsletter"** unless explicitly requested.
- **Max 2 CTAs visible per scroll viewport.**
- **No auto-play video or audio.**
- **Section backgrounds strictly alternate** between `bg-white` and `bg-deany-cream` (with one optional `bg-deany-navy` section for a CTA band).
- **No third-party tracking scripts, analytics, or chat widgets** unless explicitly requested.
- **Performance: no images over 200KB. Prefer SVG or CSS for decorative elements.**
