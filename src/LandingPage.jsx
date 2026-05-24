import React, { useState } from 'react';
import {
  ShieldCheck, BookOpen, Heart, Users, Clock, ArrowRight,
  Check, Plus, Minus, Menu, X
} from 'lucide-react';

// ── Palette constants ──────────────────────────────────────────
const C = {
  cream: '#F8F4ED', white: '#FFFFFF',
  gold: '#C9A961', goldDk: '#8A6F2F',
  sage: '#6B8E7F', sageDk: '#4A6358',
  forest: '#1B4332', dark: '#0F2E22',
  body: '#2A2520', muted: '#6B6356',
  terra: '#B8694D',
  border: 'rgba(201,169,97,0.25)',
};
const serif = 'Georgia, serif';
const arabic = "'Amiri', 'Noto Naskh Arabic', serif";

// ── Eyebrow ────────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: '1.5px', color: C.gold, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase' }}>
    {children}
  </div>
);

// ── Section heading ────────────────────────────────────────────
const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: 24 }}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: C.forest, margin: 0, lineHeight: 1.3 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, maxWidth: 440, margin: '10px auto 0' }}>{sub}</p>}
  </div>
);

// ── Avatar stack ───────────────────────────────────────────────
const AvatarStack = ({ size = 20 }) => (
  <div style={{ display: 'flex' }}>
    {[{ bg: C.sage, l: 'S' }, { bg: C.gold, l: 'F' }, { bg: C.forest, l: 'M' }, { bg: C.terra, l: 'A' }].map((a, i) => (
      <div key={i} style={{ width: size, height: size, borderRadius: '50%', background: a.bg, color: '#fff', fontSize: size * 0.45,
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${C.cream}`, marginLeft: i ? -6 : 0 }}>{a.l}</div>
    ))}
  </div>
);

// ── Path card ──────────────────────────────────────────────────
const PathCard = ({ stripe, title, desc, icon: Icon, iconColor, onClick }) => (
  <button onClick={onClick} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden',
    textAlign: 'left', cursor: 'pointer', width: '100%', transition: 'box-shadow 0.2s, transform 0.2s' }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
    <div style={{ height: 3, background: stripe }} />
    <div style={{ padding: '14px 16px' }}>
      <Icon size={18} color={iconColor} style={{ marginBottom: 6, display: 'block' }} />
      <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 500, color: C.forest }}>{title}</div>
      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, marginTop: 2 }}>{desc}</div>
    </div>
  </button>
);

// ── FAQ item ───────────────────────────────────────────────────
const FAQItem = ({ q, a, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <span style={{ fontSize: 13, color: C.forest, fontWeight: 500, textAlign: 'left' }}>{q}</span>
        {open ? <Minus size={14} color={C.goldDk} /> : <Plus size={14} color={C.goldDk} />}
      </button>
      {open && <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginTop: 8 }}>{a}</div>}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
const LandingPage = ({ onGetStarted, onPreviewLesson, onCalibration }) => {
  const [mobileNav, setMobileNav] = useState(false);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileNav(false); };

  const paths = [
    { stripe: C.sage, title: '5 Pillars', desc: 'Shahada, Salah, Zakat, Sawm, Hajj. The foundation, taught in plain language.', icon: BookOpen, iconColor: C.sage, topicId: '5-pillars' },
    { stripe: C.gold, title: 'Islamic Finance', desc: 'Riba, gharar, halal deal structure. Practical filters for modern money.', icon: BookOpen, iconColor: C.gold, topicId: 'islamic-finance' },
    { stripe: C.forest, title: 'Quran & Arabic', desc: 'Letters, words, ayat. Learn to read what you have only heard.', icon: BookOpen, iconColor: C.forest, topicId: 'quran-arabic' },
    { stripe: C.terra, title: 'Islamic History', desc: 'Prophets, caliphates, the golden age. Context for everything else.', icon: BookOpen, iconColor: C.terra, topicId: 'islamic-history' },
  ];

  return (
    <div style={{ background: C.cream, color: C.body, minHeight: '100vh' }}>

      {/* ── A1. NAV ─────────────────────────────────────────── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px',
        borderBottom: `1px solid rgba(201,169,97,0.2)`, background: 'rgba(248,244,237,0.8)', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontFamily: serif, fontSize: 14, fontWeight: 500 }}>د</div>
          <span style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, color: C.forest }}>Deany</span>
        </div>
        {/* Center links - desktop */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 18 }}>
          {['How it works', 'Paths', 'Sources', 'FAQ'].map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g, '-'))}
              style={{ fontSize: 12, color: C.muted, background: 'none', border: 'none', cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onGetStarted} className="hidden sm:inline"
            style={{ fontSize: 12, color: C.forest, background: 'none', border: 'none', cursor: 'pointer' }}>Sign in</button>
          <button onClick={onGetStarted}
            style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            Get started
          </button>
          {/* Mobile hamburger */}
          <button className="sm:hidden" onClick={() => setMobileNav(!mobileNav)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            {mobileNav ? <X size={20} color={C.forest} /> : <Menu size={20} color={C.forest} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileNav && (
        <div className="sm:hidden" style={{ background: C.cream, borderBottom: `1px solid ${C.border}`, padding: '12px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['How it works', 'Paths', 'Sources', 'FAQ'].map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g, '-'))}
              style={{ fontSize: 13, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>{l}</button>
          ))}
        </div>
      )}

      {/* ── A2. HERO ────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '54px 22px 40px', maxWidth: 1100, margin: '0 auto',
        animation: 'slideUp 0.6s ease-out both' }}>
        <div style={{ fontFamily: arabic, fontSize: 14, color: C.goldDk, marginBottom: 18, direction: 'rtl' }}>
          بِسْمِ اللَّهِ
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 500, margin: '0 0 16px', color: C.forest,
          lineHeight: 1.1, letterSpacing: '-0.5px' }}>
          Start where you are.
        </h1>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, maxWidth: 460, margin: '0 auto 26px' }}>
          Ten-minute lessons on the Pillars, the Quran, Islamic finance, and history. Reviewed by scholars. No prerequisites.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <button onClick={onCalibration || onGetStarted}
            style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', minHeight: 48 }}>
            Take the Calibration Quiz
          </button>
          <button onClick={() => scrollTo('how-it-works')}
            style={{ background: 'transparent', color: C.forest, border: `1px solid rgba(27,67,50,0.25)`, borderRadius: 10,
              padding: '12px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', minHeight: 48 }}>
            How it works
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', fontSize: 11, color: C.muted }}>
          <AvatarStack />
          <span>Trusted by 1,247 learners across 38 countries</span>
        </div>
      </section>

      {/* ── A3. TRUST STRIP ─────────────────────────────────── */}
      <section style={{ background: C.white, borderTop: `1px solid rgba(201,169,97,0.2)`, borderBottom: `1px solid rgba(201,169,97,0.2)`,
        padding: '14px 22px', animation: 'slideUp 0.6s ease-out 0.1s both' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          flexWrap: 'wrap', gap: '8px 16px', fontSize: 11, color: C.muted, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={14} color={C.forest} /> Scholar reviewed</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} color={C.gold} /> Cited sources</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} color={C.terra} /> Free forever core</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} color={C.sage} /> Open to all faiths</div>
        </div>
      </section>

      {/* ── A4. HOW IT WORKS ────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '48px 22px 40px', maxWidth: 800, margin: '0 auto',
        animation: 'slideUp 0.6s ease-out 0.15s both' }}>
        <SectionHead eyebrow="HOW IT WORKS" title="Three steps to start your journey" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { n: '1', t: 'Find your path', d: 'Take a 2-minute Calibration Quiz to match you with the right starting point.' },
            { n: '2', t: 'Learn in bites', d: 'Lessons of 5 to 15 minutes on the Pillars, Quran, Finance, and History.' },
            { n: '3', t: 'Reflect daily', d: 'Save verses, journal reflections, and build a quiet daily habit.' },
          ].map(s => (
            <div key={s.n} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 16px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,169,97,0.15)', color: C.goldDk,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 15, fontWeight: 500, marginBottom: 12 }}>{s.n}</div>
              <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 500, color: C.forest, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── A5. FOUR PATHS ──────────────────────────────────── */}
      <section id="paths" style={{ padding: '24px 22px 40px', maxWidth: 700, margin: '0 auto',
        animation: 'slideUp 0.6s ease-out 0.2s both' }}>
        <SectionHead eyebrow="FOUR PATHS" title="Pick one, or weave them together" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {paths.map(p => <PathCard key={p.title} {...p} onClick={onGetStarted} />)}
        </div>
      </section>

      {/* ── A6. SAMPLE LESSON ───────────────────────────────── */}
      <section style={{ padding: '32px 22px 40px', background: 'rgba(201,169,97,0.05)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <SectionHead eyebrow="WHAT A LESSON LOOKS LIKE" title="Try one before you sign up" />
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 10, padding: '3px 9px', background: 'rgba(107,142,127,0.15)', color: C.sageDk, borderRadius: 10 }}>Concept</span>
              <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> 12 min · Free preview</span>
            </div>
            <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: C.forest, marginBottom: 4 }}>Lesson 1: Islam and Wealth</div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 14 }}>
              Why Islam is pro-trade and how the Prophet was a merchant before he was a Prophet.
            </p>
            {/* REVIEW:QURAN - Verify translation accuracy for ayah reference */}
            <div style={{ background: 'rgba(248,244,237,0.7)', borderRadius: 8, padding: '11px 14px', marginBottom: 14, fontSize: 12,
              color: C.body, lineHeight: 1.5, fontFamily: serif, fontStyle: 'italic' }}>
              "And Allah has permitted trade and forbidden interest."{' '}
              <span style={{ fontStyle: 'normal', fontSize: 10, color: C.goldDk, letterSpacing: '0.5px' }}>AL-BAQARAH 2:275</span>
            </div>
            <button onClick={onPreviewLesson || onGetStarted}
              style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 12,
                fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, minHeight: 48 }}>
              Preview this lesson <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── A7. SOURCES & SCHOLARS ──────────────────────────── */}
      <section id="sources" style={{ padding: '40px 22px', maxWidth: 700, margin: '0 auto' }}>
        <SectionHead eyebrow="SOURCES & SCHOLARS" title="Built on trusted ground"
          sub="Every lesson is reviewed by qualified scholars before publication and cites primary sources you can verify." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: C.goldDk, fontWeight: 500, marginBottom: 10 }}>PRIMARY SOURCES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: C.body, lineHeight: 1.4 }}>
              {['Quran with Saheeh International translation', 'Sahih al-Bukhari and Sahih Muslim', 'Tafsir Ibn Kathir and al-Tabari', 'AAOIFI standards for finance'].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}><Check size={12} color={C.sage} style={{ marginTop: 2, flexShrink: 0 }} />{s}</div>
              ))}
            </div>
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: C.goldDk, fontWeight: 500, marginBottom: 10 }}>REVIEW PROCESS</div>
            <p style={{ fontSize: 12, color: C.body, lineHeight: 1.6, margin: 0 }}>
              Each lesson passes three checks before it goes live: a scholar review for doctrine, a teacher review for clarity,
              and a citation audit. Disagreements between schools are flagged, not flattened.
            </p>
          </div>
        </div>
      </section>

      {/* ── A8. TESTIMONIALS ────────────────────────────────── */}
      <section style={{ padding: '32px 22px 40px', background: 'rgba(107,142,127,0.06)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <SectionHead eyebrow="FROM OUR LEARNERS" title="Built for every starting point" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {[
              { q: 'I converted last year. Deany helped me actually understand the Pillars, not just memorize them.', n: 'Sarah, new Muslim', c: 'Manchester' },
              { q: 'Not Muslim, just curious. The Finance path opened my eyes to a different way of thinking about money.', n: 'Marcus, finance grad', c: 'Toronto' },
              { q: 'Born Muslim, never studied properly. Deany makes it feel approachable, not intimidating.', n: 'Ahmed, learner', c: 'Dubai' },
            ].map((t, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px' }}>
                <p style={{ fontSize: 12, color: C.body, lineHeight: 1.55, fontFamily: serif, fontStyle: 'italic', marginBottom: 10, marginTop: 0 }}>
                  "{t.q}"
                </p>
                <div style={{ fontSize: 11, color: C.muted }}>{t.n} · {t.c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A9. FAQ ─────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '40px 22px', maxWidth: 600, margin: '0 auto' }}>
        <SectionHead eyebrow="QUESTIONS" title="Things people ask first" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 520, margin: '0 auto' }}>
          <FAQItem q="Is Deany free?" a="Yes. All core content is free and always will be. No credit card, no trial limits. We may offer optional premium features later, but the learning paths remain open." />
          <FAQItem q="Do I need to be Muslim to use it?" defaultOpen
            a="No. Deany is built for anyone who wants to learn, whether you are Muslim, curious, returning to faith, or studying for context. Lessons explain assumptions instead of assuming them." />
          <FAQItem q="Who reviews the content?" a="Every lesson passes a scholar review for doctrine, a teacher review for clarity, and a citation audit. All hadith are graded. Disagreements between schools are flagged, not flattened." />
          <FAQItem q="How long does a lesson take?" a="Most lessons take 5 to 15 minutes. You can pause and resume anytime. Your progress is saved automatically." />
          <FAQItem q="Can I use it offline?" a="Not yet, but offline mode is on the roadmap. For now, lessons load quickly on any connection." />
        </div>
      </section>

      {/* ── A10. FINAL CTA ──────────────────────────────────── */}
      <section style={{ padding: '48px 22px', background: C.forest, textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ fontFamily: arabic, fontSize: 14, color: C.gold, marginBottom: 14, direction: 'rtl' }}>
            ابدأ من حيث أنت
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(24px, 4vw, 30px)', fontWeight: 500, color: C.cream, lineHeight: 1.2, margin: '0 0 10px' }}>
            Your first lesson is two minutes away
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(248,244,237,0.7)', marginBottom: 22, lineHeight: 1.6 }}>
            Take the Calibration Quiz, find your path, and start today.
          </p>
          <button onClick={onCalibration || onGetStarted}
            style={{ background: C.gold, color: C.forest, border: 'none', borderRadius: 10, padding: '12px 26px', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', minHeight: 48 }}>
            Take the Calibration Quiz
          </button>
          <div style={{ fontSize: 11, color: 'rgba(248,244,237,0.5)', marginTop: 14 }}>Free core content · No card required</div>
        </div>
      </section>

      {/* ── A11. FOOTER ─────────────────────────────────────── */}
      <footer style={{ padding: '18px 22px', background: C.dark, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontFamily: serif, fontSize: 11 }}>د</div>
          <span style={{ fontFamily: serif, fontSize: 13, color: C.cream }}>Deany</span>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'rgba(248,244,237,0.6)' }}>
          <span>About</span><span>Sources</span><span>Privacy</span><span>Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
