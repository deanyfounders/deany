import React, { useState, useRef, useCallback, useEffect } from 'react';
import { playClick } from '../utils/clickSound.js';

// ── Palette ──────────────────────────────────────────
const C = {
  canvas: '#FBFAF6', surface: '#FFFFFF',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C',
  tealSoft: '#DCF3EF', tealPale: '#7FD8CE',
  gold: '#F0B429', goldDk: '#C8901A',
  coral: '#E8523A', coralSoft: '#FCDDD5',
  text: '#173A4A', textDeep: '#0F4C5C', textMuted: '#5E7480', textFaint: '#94A3AA',
  border: 'rgba(15,76,92,0.15)',
};
const serif = 'Georgia, serif';

// ── Audio ────────────────────────────────────────────
let audioCtx;
const ensureAudio = () => { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); };
const playTone = (freqs, gap = 0.1, dur = 0.15, vol = 0.06) => {
  try { ensureAudio(); freqs.forEach((f, i) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.setValueAtTime(f, audioCtx.currentTime + i * gap);
    g.gain.setValueAtTime(vol, audioCtx.currentTime + i * gap);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * gap + dur);
    o.start(audioCtx.currentTime + i * gap); o.stop(audioCtx.currentTime + i * gap + dur);
  }); } catch (_) {}
};
const playCorrect = () => playTone([660, 880]);
const playWrong = () => { try { ensureAudio(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.frequency.setValueAtTime(300, audioCtx.currentTime); o.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.15); g.gain.setValueAtTime(0.05, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15); o.start(); o.stop(audioCtx.currentTime + 0.15); } catch (_) {} };
const playSuccess = () => playTone([523, 659, 784], 0.12, 0.2);

// ── Confetti ─────────────────────────────────────────
const launchConfetti = () => {
  const c = document.createElement('div');
  Object.assign(c.style, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' });
  document.body.appendChild(c);
  const cols = ['#22A39A', '#F0B429', '#E8523A', '#4968A6', '#7FD8CE', '#C8901A'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    const s = 6 + Math.random() * 8, strip = Math.random() > 0.6;
    Object.assign(p.style, { position: 'absolute', top: '-20px', left: Math.random() * 100 + '%',
      width: (strip ? s * 0.35 : s) + 'px', height: (strip ? s * 1.6 : s) + 'px',
      background: cols[Math.floor(Math.random() * cols.length)],
      borderRadius: strip ? '2px' : (Math.random() > 0.5 ? '50%' : '2px'),
      animation: `confettiFall ${2.2 + Math.random() * 2}s linear ${Math.random() * 0.6}s forwards`, opacity: 0 });
    c.appendChild(p);
  }
  setTimeout(() => c.remove(), 5500);
};

// ── Data ─────────────────────────────────────────────
const LABELS = [
  { bold: 'STARTER', sub: 'TAP TO ANSWER' },
  { bold: 'MAIN COURSE', sub: 'BUILD A LESSON' },
  { bold: 'DESSERT', sub: 'FILL THE BLANK' },
];
const Q1_OPTS = [
  { letter: 'A', text: '2 hours', correct: false },
  { letter: 'B', text: 'About 10 minutes', correct: true },
  { letter: 'C', text: '45 minutes', correct: false },
];
const Q2_TILES = [
  { icon: '\u{1F4D6}', label: 'short read', correct: true },
  { icon: '\u2728', label: 'interactive Qs', correct: true },
  { icon: '\u26A1', label: 'instant feedback', correct: true },
  { icon: '\u{1F3A5}', label: 'video lecture', correct: false },
  { icon: '\u{1F4DD}', label: 'final exam', correct: false },
];
const Q3_PILLS = [
  { emoji: '\u{1F53D}', text: 'Only Muslims', correct: false },
  { emoji: '\u{1F393}', text: 'Scholars', correct: false },
  { emoji: '\u{1F30D}', text: 'Everyone', correct: true },
  { emoji: '\u{1F914}', text: 'Just curious (non-Muslim)', correct: false },
  { emoji: '\u{1F331}', text: 'New Muslims only', correct: false },
];

// ── Stable sub-components ────────────────────────────
const Feedback = ({ text }) => text ? (
  <div style={{ marginTop: 14, padding: '11px 14px', borderRadius: 12, fontSize: 12.5, lineHeight: 1.5,
    background: C.tealSoft, border: '1px solid rgba(34,163,154,0.15)', color: C.tealDeep,
    display: 'flex', alignItems: 'flex-start', gap: 7, animation: 'quizPopIn 0.25s cubic-bezier(.2,.7,.3,1) both' }}>
    <svg style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1 }} viewBox="0 0 24 24" fill="none"
      stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 20, animation: 'quizCheckDraw 0.35s ease forwards' }} />
    </svg>
    <span>{text}</span>
  </div>
) : null;

const BackArrow = ({ onClick, label }) => (
  <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none',
    border: 'none', cursor: 'pointer', fontSize: 12, color: C.textMuted, padding: 0, transition: 'color 0.15s' }}
    onMouseEnter={e => e.currentTarget.style.color = C.tealDeep}
    onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
    {label}
  </button>
);

// ═══════════════════════════════════════════════════════
const QuizSection = () => {
  const [view, setView] = useState('teaser');
  const [step, setStep] = useState(0);
  const [showBtn, setShowBtn] = useState(false);
  const [leaving, setLeaving] = useState(false); // fade-out phase for view transitions

  // Q1
  const [q1Chosen, setQ1Chosen] = useState(-1);
  const [q1Reveal, setQ1Reveal] = useState(false);
  const [q1Fb, setQ1Fb] = useState(null);
  // Q2
  const [q2Placed, setQ2Placed] = useState([]);
  const [q2Rej, setQ2Rej] = useState(-1);
  const [q2Fb, setQ2Fb] = useState(null);
  // Q3
  const [q3Blank, setQ3Blank] = useState('?');
  const [q3Filled, setQ3Filled] = useState(false);
  const [q3Wrong, setQ3Wrong] = useState(false);
  const [q3Used, setQ3Used] = useState(-1);
  const [q3Dimmed, setQ3Dimmed] = useState(false);
  const [q3Fb, setQ3Fb] = useState(null);

  const cardRef = useRef(null);
  const stepRefs = useRef([null, null, null]);
  const busy = useRef(false);

  // ── Force animation restart on step via ref ────
  useEffect(() => {
    if (leaving) return;
    const el = stepRefs.current[step];
    if (el && view === 'quiz') {
      el.style.animation = 'none';
      void el.offsetHeight; // force reflow
      el.style.animation = '';
    }
  }, [step, view, leaving]);

  // ── Reset ──────────────────────────────────────
  const resetAll = useCallback(() => {
    setStep(0); setShowBtn(false); setLeaving(false);
    setQ1Chosen(-1); setQ1Reveal(false); setQ1Fb(null);
    setQ2Placed([]); setQ2Rej(-1); setQ2Fb(null);
    setQ3Blank('?'); setQ3Filled(false); setQ3Wrong(false); setQ3Used(-1); setQ3Dimmed(false); setQ3Fb(null);
  }, []);

  // ── View transitions (fade out → swap → fade in) ──
  const goTo = useCallback((newView, delay = 200) => {
    if (busy.current) return;
    busy.current = true;
    setLeaving(true);
    setTimeout(() => {
      setView(newView);
      setLeaving(false);
      busy.current = false;
    }, delay);
  }, []);

  const startQuiz = () => { playClick(); goTo('quiz'); };
  const showRead = () => { playClick(); goTo('read'); };
  const backToTeaser = () => {
    if (busy.current) return;
    busy.current = true;
    playClick();
    setLeaving(true);
    setTimeout(() => {
      resetAll();
      setView('teaser');
      setLeaving(false);
      busy.current = false;
    }, 200);
  };

  // ── Advance (Continue) ─────────────────────────
  const advance = () => {
    if (busy.current) return;
    busy.current = true;
    playClick();
    setShowBtn(false);

    // Phase 1: fade out current step
    const el = stepRefs.current[step];
    if (el) {
      el.style.transition = 'opacity 0.2s ease';
      el.style.opacity = '0';
    }

    setTimeout(() => {
      // Clear the ref-based fade
      if (el) { el.style.transition = ''; el.style.opacity = ''; }

      const next = step + 1;
      if (next >= 3) {
        // ── Result transition ──
        // Phase 2: fade header via ref
        const card = cardRef.current;
        const hdr = card?.querySelector('[data-quiz-header]');
        const body = card?.querySelector('[data-quiz-body]');
        if (hdr) { hdr.style.transition = 'opacity 0.2s ease'; hdr.style.opacity = '0'; }
        if (body) { body.style.transition = 'opacity 0.2s ease'; body.style.opacity = '0'; }

        setTimeout(() => {
          // Phase 3: lock height, swap to result
          if (card) { card.style.height = card.offsetHeight + 'px'; card.style.overflow = 'hidden'; }
          if (hdr) { hdr.style.transition = ''; hdr.style.opacity = ''; }
          if (body) { body.style.transition = ''; body.style.opacity = ''; }
          setView('result');

          setTimeout(() => {
            playSuccess(); launchConfetti();
            if (card) {
              requestAnimationFrame(() => {
                card.style.transition = 'height 0.35s ease';
                card.style.height = card.scrollHeight + 'px';
                setTimeout(() => {
                  if (card) { card.style.height = ''; card.style.overflow = ''; card.style.transition = ''; }
                }, 380);
              });
            }
            busy.current = false;
          }, 50);
        }, 200);
      } else {
        // ── Next step ──
        setStep(next);
        busy.current = false;
      }
    }, 220);
  };

  // ── Q1 ─────────────────────────────────────────
  const doQ1 = (idx, correct) => {
    if (q1Chosen >= 0) return;
    playClick(); setQ1Chosen(idx);
    if (correct) { playCorrect(); setQ1Fb('Bite-sized by design. Short enough for a commute, deep enough to stick.'); }
    else { playWrong(); setQ1Fb('Bite-sized by design. Most lessons take about ten minutes. Short enough for a commute, deep enough to stick.'); setTimeout(() => setQ1Reveal(true), 300); }
    setTimeout(() => setShowBtn(true), 400);
  };

  // ── Q2 ─────────────────────────────────────────
  const doQ2 = (idx, correct) => {
    if (q2Placed.includes(idx)) return;
    playClick();
    if (correct) {
      const np = [...q2Placed, idx]; setQ2Placed(np); playCorrect();
      if (np.length === 3) { setQ2Fb("Instead of passively watching or reading, every Deany lesson has you do things: read a little, answer, get feedback, move on. That's how it sticks. You just did it to answer this."); setTimeout(() => setShowBtn(true), 400); }
    } else { playWrong(); setQ2Rej(idx); setTimeout(() => setQ2Rej(-1), 400); }
  };

  // ── Q3 ─────────────────────────────────────────
  const doQ3 = (idx, correct) => {
    if (q3Filled) return;
    playClick();
    const label = Q3_PILLS[idx].text;
    if (correct) {
      setQ3Blank(label); setQ3Filled(true); setQ3Used(idx); setQ3Dimmed(true); playCorrect();
      setQ3Fb('Practising Muslims, curious non-Muslims, new converts, born Muslims who never studied. Deany is built for every starting point.');
      setTimeout(() => setShowBtn(true), 400);
    } else { playWrong(); setQ3Blank(label); setQ3Wrong(true); setTimeout(() => { setQ3Blank('?'); setQ3Wrong(false); }, 500); }
  };

  // ── Leaving style for current view ─────────────
  const leaveStyle = leaving ? { opacity: 0, transform: 'scale(0.97)', transition: 'opacity 0.2s ease, transform 0.2s ease' } : {};

  // ── Step display ───────────────────────────────
  const stepStyle = (i) => i !== step ? { display: 'none' } : { animation: 'quizStepIn 0.3s ease both' };

  // ── Render Q1 ──────────────────────────────────
  const renderQ1 = () => (
    <div ref={el => stepRefs.current[0] = el} style={stepStyle(0)}>
      <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 500, color: C.tealDeep, lineHeight: 1.35, marginBottom: 18 }}>
        How long is a typical Deany lesson?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {Q1_OPTS.map((o, i) => {
          const chosen = q1Chosen === i;
          const green = (chosen && o.correct) || (q1Reveal && o.correct);
          const red = chosen && !o.correct;
          const dim = q1Chosen >= 0 && !chosen && !(q1Reveal && o.correct);
          const bg = green ? C.tealSoft : red ? C.coralSoft : C.canvas;
          const bc = green ? C.teal : red ? C.coral : C.border;
          const lBg = green ? C.teal : red ? C.coral : C.surface;
          const lC = green || red ? '#fff' : C.textMuted;
          return (
            <button key={i} onClick={() => doQ1(i, o.correct)} style={{
              background: bg, border: `1.5px solid ${bc}`, borderRadius: 12,
              padding: '12px 14px', fontSize: 13.5, color: C.text,
              cursor: q1Chosen >= 0 ? 'default' : 'pointer',
              transition: 'all 0.18s ease', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10,
              minHeight: 46, opacity: dim ? 0.35 : 1,
              pointerEvents: q1Chosen >= 0 ? 'none' : 'auto' }}>
              <span style={{ width: 24, height: 24, borderRadius: 7, background: lBg, color: lC,
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: `1px solid ${bc}`, transition: 'all 0.18s ease' }}>{o.letter}</span>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>
      <Feedback text={q1Fb} />
      {showBtn && renderContinueBtn()}
    </div>
  );

  // ── Render Q2 ──────────────────────────────────
  const renderQ2 = () => {
    const done = q2Placed.length === 3;
    return (
      <div ref={el => stepRefs.current[1] = el} style={stepStyle(1)}>
        <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 500, color: C.tealDeep, lineHeight: 1.35, marginBottom: 18 }}>
          How do you actually learn on Deany?
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, position: 'relative' }}>
          {Q2_TILES.map((t, i) => {
            const placed = q2Placed.includes(i);
            const rej = q2Rej === i;
            const gone = placed || (done && !t.correct);
            return (
              <button key={i} onClick={() => doQ2(i, t.correct)} style={{
                background: rej ? C.coralSoft : C.canvas,
                border: `1.5px solid ${rej ? C.coral : C.border}`,
                borderRadius: 20, padding: '8px 14px', fontSize: 12.5, fontWeight: 500, color: C.text,
                cursor: gone ? 'default' : 'pointer', transition: 'all 0.18s ease',
                display: 'inline-flex', alignItems: 'center', gap: 5,
                opacity: gone ? 0 : 1, position: gone ? 'absolute' : 'relative',
                pointerEvents: gone ? 'none' : 'auto',
                animation: rej ? 'quizShake 0.35s ease' : 'none' }}>
                <span style={{ fontSize: 13 }}>{t.icon}</span>{t.label}
              </button>
            );
          })}
        </div>
        <div style={{
          background: q2Placed.length > 0 ? C.tealSoft : C.canvas,
          border: `1.5px ${done ? 'solid' : 'dashed'} ${done ? C.teal : q2Placed.length > 0 ? C.tealPale : 'rgba(15,76,92,0.15)'}`,
          borderRadius: 14, padding: 14, minHeight: 48, display: 'flex', flexWrap: 'wrap', gap: 6,
          alignItems: 'center', justifyContent: q2Placed.length > 0 ? 'flex-start' : 'center',
          transition: 'all 0.3s ease' }}>
          {q2Placed.length === 0 && <span style={{ fontSize: 11.5, color: C.textFaint }}>drop the pieces of a lesson here</span>}
          {q2Placed.map((idx, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.teal}`, borderRadius: 16,
              padding: '6px 12px', fontSize: 11.5, fontWeight: 500, color: C.tealDeep,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              animation: 'quizDropIn 0.25s cubic-bezier(.2,.7,.3,1) both' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {Q2_TILES[idx].label}
            </div>
          ))}
        </div>
        <Feedback text={q2Fb} />
        {showBtn && renderContinueBtn()}
      </div>
    );
  };

  // ── Render Q3 ──────────────────────────────────
  const renderQ3 = () => (
    <div ref={el => stepRefs.current[2] = el} style={stepStyle(2)}>
      <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 500, color: C.tealDeep, lineHeight: 1.35, marginBottom: 18 }}>
        Complete the sentence
      </div>
      <div style={{ background: C.canvas, borderRadius: 16, padding: '22px 20px', textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: serif, fontSize: 18, color: C.text, lineHeight: 1.7 }}>
          Deany is built for{' '}
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 110, height: 34, borderRadius: 10, padding: '0 14px',
            border: `2px ${q3Filled ? 'solid' : 'dashed'} ${q3Wrong ? C.coral : q3Filled ? C.teal : C.tealPale}`,
            background: q3Wrong ? C.coralSoft : q3Filled ? C.tealSoft : 'rgba(220,243,239,0.35)',
            fontWeight: 600, fontSize: 14,
            color: q3Wrong ? C.coral : q3Filled ? C.tealDeep : C.textFaint,
            transition: 'all 0.3s ease', verticalAlign: 'middle', margin: '0 2px',
            animation: q3Wrong ? 'quizShake 0.35s ease' : q3Filled ? 'quizPopIn 0.25s cubic-bezier(.2,.7,.3,1) both' : 'none' }}>
            {q3Blank}
          </span>.
        </div>
        {!q3Filled && <div style={{ fontSize: 11, color: C.textFaint, marginTop: 10, opacity: q3Wrong ? 0 : 1, transition: 'opacity 0.3s' }}>tap a pill below</div>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center', position: 'relative' }}>
        {Q3_PILLS.map((p, i) => {
          const used = q3Used === i;
          return (
            <button key={i} onClick={() => doQ3(i, p.correct)} style={{
              background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 22,
              padding: '10px 18px', fontSize: 13, fontWeight: 500, color: C.text, minHeight: 44,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 1px 3px rgba(15,76,92,0.05)',
              cursor: used || q3Dimmed ? 'default' : 'pointer',
              transition: 'all 0.2s cubic-bezier(.2,.7,.3,1)',
              opacity: used ? 0 : q3Dimmed ? 0.25 : 1,
              position: used ? 'absolute' : 'relative',
              pointerEvents: used || q3Dimmed ? 'none' : 'auto' }}>
              <span style={{ fontSize: 15 }}>{p.emoji}</span> {p.text}
            </button>
          );
        })}
      </div>
      <Feedback text={q3Fb} />
      {showBtn && renderContinueBtn()}
    </div>
  );

  // ── Continue button (plain function, not component) ──
  const renderContinueBtn = () => (
    <button onClick={advance} style={{ width: '100%', marginTop: 16, padding: 12, border: 'none', borderRadius: 12,
      background: C.teal, color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
      boxShadow: `0 2px 0 ${C.tealDk}`, transition: 'transform 0.15s',
      animation: 'quizPopIn 0.25s cubic-bezier(.2,.7,.3,1) both' }}
      onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = 'none'; }}
      onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 2px 0 ${C.tealDk}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 2px 0 ${C.tealDk}`; }}>
      Continue
    </button>
  );

  // ═══════════════════════════════════════════════
  return (
    <section id="how-it-works" style={{ padding: '56px 22px 48px', background: C.canvas }}>
      <style>{`
        @keyframes quizStepIn { 0% { opacity:0; transform:translateY(8px); } 100% { opacity:1; transform:translateY(0); } }
        @keyframes quizPopIn { 0% { opacity:0; transform:scale(0.92) translateY(6px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes quizShake { 0%,100% { transform:translateX(0); } 20% { transform:translateX(-5px); } 40% { transform:translateX(5px); } 60% { transform:translateX(-3px); } 80% { transform:translateX(3px); } }
        @keyframes quizDropIn { 0% { opacity:0; transform:translateY(-10px) scale(0.9); } 100% { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes quizCheckDraw { 0% { stroke-dashoffset:20; } 100% { stroke-dashoffset:0; } }
        @keyframes confettiFall { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(calc(100vh + 40px)) rotate(720deg); opacity:0; } }
        @keyframes quizBob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(3px); } }
        @keyframes methodPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.12); } }
        .method-cards { display:flex; gap:12px; align-items:stretch; }
        .method-card { outline:none; }
        .method-card:focus-visible { outline:2px solid #F0B429; outline-offset:2px; }
        @media (max-width:560px) { .method-cards { flex-direction:column; } .method-hero { order:-1; } }
        @media (prefers-reduced-motion:reduce) { *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; } }
      `}</style>

      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: '1.5px', color: C.teal, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase' }}>
            HOW IT WORKS
          </div>
          <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: C.tealDeep, lineHeight: 1.3 }}>
            The Deany Method
          </div>
          <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5, margin: '8px auto 0', maxWidth: 320 }}>
            Two ways to find out. Your call.
          </p>
        </div>

        {/* ── Card ── */}
        <div ref={cardRef} style={{
          background: C.surface, borderRadius: 22, position: 'relative',
          boxShadow: '0 1px 3px rgba(15,76,92,0.06), 0 16px 48px rgba(15,76,92,0.10)',
          border: '1px solid rgba(15,76,92,0.07)', overflow: 'hidden', cursor: 'default' }}>

          {/* ── TEASER ── */}
          <div style={{
            display: view === 'teaser' ? 'block' : 'none',
            padding: '28px 24px',
            ...(leaving && view === 'teaser' ? leaveStyle : {}),
            ...(!leaving && view === 'teaser' ? { animation: 'quizPopIn 0.3s cubic-bezier(.2,.7,.3,1) both' } : {}) }}>
            <div className="method-cards">
              {/* Calm secondary: Just tell me */}
              <button className="method-card" onClick={showRead} aria-label="Just tell me, read a 20 second summary" style={{
                flex: 1, borderRadius: 16, padding: '22px 18px 20px', textAlign: 'center', cursor: 'pointer',
                border: '1px solid rgba(15,76,92,0.12)', background: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(20,43,54,.04), 0 8px 18px rgba(20,43,54,.05)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, minHeight: 44,
                transition: 'transform .24s cubic-bezier(.2,.7,.3,1), box-shadow .24s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,43,54,.04), 0 14px 26px rgba(20,43,54,.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,43,54,.04), 0 8px 18px rgba(20,43,54,.05)'; }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: '#F1F6F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9DAAB1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" />
                  </svg>
                </div>
                <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.tealDeep }}>Just tell me</div>
                <div style={{ fontSize: 11.5, color: '#9DAAB1', lineHeight: 1.4 }}>A 20-second summary of how it works</div>
                <span style={{ marginTop: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 36,
                  border: '1px solid rgba(15,76,92,0.18)', color: C.textMuted, fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 10, background: 'transparent' }}>
                  Read summary
                </span>
              </button>

              {/* Recommended hero: Show me */}
              <button className="method-card method-hero" onClick={startQuiz} aria-label="Show me, try a real lesson the Deany way (recommended)" style={{
                flex: 1, position: 'relative', borderRadius: 16, padding: '22px 18px 20px', textAlign: 'center', cursor: 'pointer',
                border: '2px solid #5DCAA5', background: 'linear-gradient(160deg,#E4F6F1,#D2EFE8)',
                boxShadow: '0 1px 2px rgba(20,43,54,.04), 0 12px 26px rgba(34,163,154,.18)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, minHeight: 44,
                transition: 'transform .24s cubic-bezier(.2,.7,.3,1), box-shadow .24s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,43,54,.04), 0 18px 34px rgba(34,163,154,.24)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,43,54,.04), 0 12px 26px rgba(34,163,154,.18)'; }}>
                <span style={{ position: 'absolute', top: 10, right: 10, background: '#0F6E56', color: '#fff', fontSize: 8.5, fontWeight: 700,
                  letterSpacing: '0.6px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20 }}>Recommended</span>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(15,76,92,0.12)' }}>
                  <span style={{ display: 'inline-flex', animation: 'methodPulse 2.4s ease-in-out infinite' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#F0B429" stroke="#F0B429" strokeWidth="1.5" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </span>
                </div>
                <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.tealDeep }}>Show me</div>
                <div style={{ fontSize: 11.5, color: '#0F6E56', lineHeight: 1.4 }}>Try a real lesson, the Deany way</div>
                <span style={{ marginTop: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 36,
                  background: '#F0B429', color: '#5A3E00', fontSize: 12.5, fontWeight: 700, padding: '9px 18px', borderRadius: 10, boxShadow: '0 3px 0 #C8901A' }}>
                  Try a lesson
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                </span>
              </button>
            </div>
          </div>

          {/* ── READ ── */}
          <div style={{
            display: view === 'read' ? 'block' : 'none',
            padding: 24,
            ...(leaving && view === 'read' ? leaveStyle : {}),
            ...(!leaving && view === 'read' ? { animation: 'quizPopIn 0.3s cubic-bezier(.2,.7,.3,1) both' } : {}) }}>
            {[
              { n: '1', text: 'Bite-sized lessons. Each one takes about 10 minutes. A short read, then hands-on questions with instant feedback.' },
              { n: '2', text: 'Four paths to choose from. The Pillars, Islamic Finance, Quran & Arabic, and History. Pick one or mix them.' },
              { n: '3', text: "Built for everyone. Whether you're Muslim, curious, or just getting started. No prerequisites, no judgement." },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.tealSoft, color: C.tealDeep,
                  fontFamily: serif, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>
                  <strong style={{ color: C.tealDeep }}>{s.text.split('.')[0]}.</strong>
                  {s.text.substring(s.text.indexOf('.') + 1)}
                </div>
              </div>
            ))}
            <BackArrow onClick={backToTeaser} label="Or try it instead" />
          </div>

          {/* ── QUIZ + RESULT container ── */}
          <div style={{
            display: view === 'quiz' || view === 'result' ? 'block' : 'none',
            ...(leaving && view === 'quiz' ? leaveStyle : {}),
            ...(!leaving && view === 'quiz' ? { animation: 'quizPopIn 0.3s cubic-bezier(.2,.7,.3,1) both' } : {}) }}>

            {/* Header */}
            <div data-quiz-header style={{
              display: view === 'result' ? 'none' : 'flex',
              justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <BackArrow onClick={backToTeaser} />
                <div style={{ fontSize: 9, letterSpacing: '1px', fontWeight: 700, textTransform: 'uppercase', color: C.textFaint }}>
                  <b style={{ color: C.textMuted, fontWeight: 700 }}>{LABELS[step]?.bold}</b> &middot; {LABELS[step]?.sub}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', transition: 'all 0.35s ease',
                    background: view === 'result' || i < step ? C.teal : i === step ? C.tealPale : C.border }} />
                ))}
              </div>
            </div>

            {/* Body */}
            <div data-quiz-body style={{
              display: view === 'result' ? 'none' : 'block',
              padding: '18px 24px 24px' }}>
              {renderQ1()}
              {renderQ2()}
              {renderQ3()}
            </div>

            {/* Result */}
            <div style={{
              display: view === 'result' ? 'block' : 'none',
              textAlign: 'center', padding: '28px 24px 20px',
              animation: view === 'result' ? 'quizPopIn 0.4s cubic-bezier(.2,.7,.3,1) both' : 'none' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{'\u{1F389}'}</div>
              <div style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, color: C.tealDeep, lineHeight: 1.3, marginBottom: 8 }}>
                That's how Deany teaches
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55, marginBottom: 20 }}>
                Short reads, real questions, instant feedback. Have a look at what we cover and see what catches your eye.
              </div>
              <button
                onClick={() => document.getElementById('paths')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 42, height: 42, borderRadius: '50%',
                  background: C.gold, cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: `0 2px 0 ${C.goldDk}`, border: 'none' }}
                onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = 'none'; }}
                onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 2px 0 ${C.goldDk}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 2px 0 ${C.goldDk}`; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
