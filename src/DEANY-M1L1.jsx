import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, ChevronLeft, Home, ArrowRight, ArrowLeft, Flame, Star, BookOpen, Sparkles, ChevronRight, Award, Clock, Target, RotateCcw, GripVertical, Volume2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// DEANY — MODULE 1, LESSON 1: The Trader Prophet ﷺ
// Blueprint: DEANY_M1L1_Blueprint.docx
// 5 Questions • 4 Types • 3 Modes • L1→L2 • 12 Minutes
// Question Engine v2.0 Compliant • Sahih-Only
// ═══════════════════════════════════════════════════════════════

// ── Design Tokens ─────────────────────────────────────────────
const T = {
  navy: '#1B2A4A', gold: '#C5A55A', goldLight: '#F5EDD6',
  teal: '#2A7B88', tealLight: '#E0F2F4',
  coral: '#D4654A', coralLight: '#FDEAE5',
  green: '#3A8B5C', greenLight: '#E5F5EC',
  purple: '#6B4C9A', blue: '#3B82F6',
  magenta: '#A855A0', orange: '#E8872B',
  grayDark: '#3D3D3D', grayMed: '#6B6B6B', grayLight: '#F2F2F2',
};

// ── Islamic Pattern Background ────────────────────────────────
const IslamicPattern = ({ opacity = 0.03, color = T.teal }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="islamicGeo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}/>
        <circle cx="30" cy="30" r="12" fill="none" stroke={color} strokeWidth="0.3" opacity={opacity}/>
        <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity}/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamicGeo)"/>
  </svg>
);

// ── Confetti ──────────────────────────────────────────────────
const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none" style={{zIndex:200}}>
    {[...Array(40)].map((_,i) => (
      <div key={i} className="absolute" style={{
        left:`${Math.random()*100}%`, top:'-20px',
        fontSize:`${14+Math.random()*12}px`,
        animation:`confettiFall ${2+Math.random()*2.5}s ease-out forwards`,
        animationDelay:`${Math.random()*1}s`
      }}>
        {['✦','✧','☆','🌟','✨','⭐','💫'][Math.floor(Math.random()*7)]}
      </div>
    ))}
  </div>
);

// ── Mascot ────────────────────────────────────────────────────
const Mascot = ({ size = 'md', className = '' }) => {
  const s = { sm:'w-9 h-9 text-lg', md:'w-12 h-12 text-2xl', lg:'w-16 h-16 text-4xl' };
  return (
    <div className={`${s[size]} rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${className}`}
      style={{ background:`linear-gradient(135deg, ${T.gold}, ${T.orange})`, boxShadow:`0 4px 16px ${T.gold}40` }}>
      <span>🪙</span>
    </div>
  );
};

// ── Progress Bar ──────────────────────────────────────────────
const ProgressBar = ({ current, total, score }) => {
  const pct = ((current) / total) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold" style={{color:T.grayMed}}>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" style={{color:T.gold}} fill={T.gold}/>
          <span className="text-xs font-bold" style={{color:T.navy}}>{score} pts</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{background:T.grayLight}}>
        <div className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width:`${pct}%`, background:`linear-gradient(90deg, ${T.teal}, ${T.green})` }}/>
      </div>
    </div>
  );
};

// ── Mode Badge ────────────────────────────────────────────────
const ModeBadge = ({ mode, type }) => {
  const modeConfig = {
    THINK: { bg: `${T.purple}15`, color: T.purple, icon: '🧠' },
    PLAY:  { bg: `${T.magenta}15`, color: T.magenta, icon: '🎮' },
    SORT:  { bg: `${T.teal}15`, color: T.teal, icon: '📦' },
  };
  const c = modeConfig[mode] || modeConfig.THINK;
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:c.bg, color:c.color}}>
        {c.icon} {mode}
      </span>
      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:`${T.navy}08`, color:T.grayMed}}>
        {type}
      </span>
    </div>
  );
};

// ── Feedback Panel ────────────────────────────────────────────
const FeedbackPanel = ({ correct, text, bridgeForward }) => (
  <div className="mt-4 rounded-xl p-5 border-2 animate-slideUp" style={{
    background: correct ? T.greenLight : T.coralLight,
    borderColor: correct ? T.green : T.coral,
  }}>
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        {correct
          ? <CheckCircle className="w-5 h-5" style={{color:T.green}}/>
          : <XCircle className="w-5 h-5" style={{color:T.coral}}/>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold mb-1" style={{color: correct ? T.green : T.coral}}>
          {correct ? 'Correct!' : 'Not quite!'}
        </div>
        <div className="text-sm leading-relaxed" style={{color:T.grayDark}}>{text}</div>
        {bridgeForward && correct && (
          <div className="mt-3 pt-3 border-t flex items-start gap-2" style={{borderColor: correct ? `${T.green}30` : `${T.coral}30`}}>
            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:T.teal}}/>
            <span className="text-xs italic" style={{color:T.teal}}>{bridgeForward}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// LESSON DATA
// ═══════════════════════════════════════════════════════════════
const SECTIONS = [
  {
    id: 'section-a',
    title: "Islam Isn't Anti-Money",
    content: [
      "Many people begin their Islamic finance journey carrying guilt. They've absorbed the idea that money is somehow spiritually dirty — that the more pious path is to care less about wealth. This is one of the most common and most damaging misconceptions in Islamic finance.",
      "The truth is the opposite. Islam has always been pro-commerce, pro-trade, and pro-wealth — provided that wealth is earned, managed, and spent within boundaries. The Prophet Muhammad ﷺ was himself a trader. He managed goods, negotiated deals, and built a reputation for honesty so strong that the people of Makkah called him **al-Amīn — the Trustworthy**.",
      "Khadija bint Khuwaylid رضي الله عنها, the Prophet's first wife, was one of the most successful merchants in Makkah. She hired the Prophet ﷺ specifically because of his integrity. Their partnership was commercial before it was marital.",
      "This isn't trivia. It's the foundation. If you believe Islam is anti-money, you will resist every lesson that follows. So let's make sure that's cleared up right now.",
    ],
    quran: {
      text: '"And Allah has made trade permissible and has forbidden ribā."',
      ref: "Quran 2:275",
      note: "This verse doesn't merely tolerate trade. It actively permits it. The prohibition is on ribā specifically — not on commerce, not on profit, not on wealth."
    }
  },
  {
    id: 'section-b',
    title: "A Commercial Prophet ﷺ",
    content: [
      "Let's put some detail on this. The Prophet's ﷺ career wasn't a footnote — it was a major part of his life before revelation.",
      "As a young man, he managed trade caravans between Makkah and Shām (Greater Syria). These were serious commercial expeditions — weeks of travel, significant capital at risk, negotiations with foreign merchants. He was trusted with other people's goods and money.",
      "Khadija رضي الله عنها was so impressed by his honesty and results that she proposed a business arrangement, then marriage. She was already one of the wealthiest traders in Makkah. This was a commercially literate household.",
      "After prophethood, the Prophet ﷺ didn't abandon commerce. He regulated it. He set rules for fair dealing, prohibited exploitation, and created a market in Madinah with specific ethical standards. The message was never 'stop trading.' It was **'trade honestly.'**"
    ],
    didYouKnow: "The Prophet ﷺ established a dedicated marketplace in Madinah and refused to let anyone charge rent for stall space. Commerce was a public good, not a private monopoly. (Bukhari 2118)"
  },
  {
    id: 'section-c',
    title: "The Amānah Mindset (Preview)",
    content: [
      "So Islam is pro-wealth. But it's not a free-for-all. There's a concept that changes everything about how a Muslim relates to money. It's called **amānah** (أمانة) — which means 'trust' or 'something entrusted to you.'",
      "The idea: you don't truly own your wealth. You're managing it on behalf of its real Owner. You're a custodian, not a proprietor. This single reframe — from 'my money' to 'money I'm responsible for' — is the foundation of everything in Islamic finance.",
      "We'll explore amānah fully in the next lesson. For now, just hold this idea: **wealth is a tool you've been entrusted with.** How you earn it, grow it, and spend it — that's where the rules come in."
    ]
  },
  {
    id: 'section-d',
    title: "Why This Matters For You",
    content: [
      "Here's why this lesson isn't just history. The reason many Muslims struggle with financial decisions — savings, mortgages, investments, insurance — is that they don't have a framework. They feel vaguely guilty about money but can't articulate why or what to do about it.",
      "This course gives you that framework. And it starts here: Islam is pro-wealth. The Prophet ﷺ was a merchant. Khadija رضي الله عنها was a businesswoman. Wealth managed responsibly is an act of worship, not a source of shame.",
      "Everything in the next 6 modules builds on this. If you take one thing from today: **your money is not the problem. How it's handled might be.** And you're about to learn how to handle it."
    ]
  }
];

const QUESTIONS = [
  // ── Q1: MC — L1 RECOGNITION — THINK ────────────────────────
  {
    id: 'q1', type: 'mcq', mode: 'THINK', level: '1/5', typeLabel: 'Multiple Choice',
    afterSection: 0,
    question: "According to the passage you just read, what was the Prophet Muhammad ﷺ known as in Makkah?",
    options: [
      { id: 'a', text: "Al-Amīn (The Trustworthy)", correct: true },
      { id: 'b', text: "Al-Ḥakīm (The Wise)", correct: false },
      { id: 'c', text: "Al-Karīm (The Generous)", correct: false },
      { id: 'd', text: "Al-Qā'id (The Leader)", correct: false },
    ],
    feedback: {
      a: "Exactly right! Al-Amīn — the Trustworthy. This wasn't just a nickname. It was his commercial reputation. People trusted him with their goods and their money. That's the foundation Islamic finance is built on.",
      b: "Not quite. Al-Ḥakīm means 'The Wise' — that's one of Allah's names, not the Prophet's commercial title. He was known as al-Amīn because traders trusted him with their goods.",
      c: "Close instinct — the Prophet ﷺ was generous, but his business reputation was specifically al-Amīn (The Trustworthy). In commerce, trustworthiness is the foundation.",
      d: "He did become a leader, but his commercial reputation in Makkah was al-Amīn — The Trustworthy. This title came from his trading days, before prophethood."
    }
  },
  // ── Q2: SWIPE T/F — L1 RECOGNITION — PLAY ─────────────────
  {
    id: 'q2', type: 'swipe', mode: 'PLAY', level: '1/5', typeLabel: 'Swipe True / False',
    afterSection: 1,
    question: "Swipe each statement: TRUE (right) or FALSE (left).",
    cards: [
      { text: "The Prophet ﷺ was a merchant before prophethood.", answer: true,
        right: "✅ Yes! Trading was his profession.", wrong: "❌ Actually, he managed caravans for years before revelation." },
      { text: "Islam teaches that wealth is spiritually dirty.", answer: false,
        right: "✅ Correct — that's the misconception we're clearing up.", wrong: "❌ This is exactly the myth. Islam is pro-wealth, not anti-money." },
      { text: "Khadija رضي الله عنها was one of Makkah's most successful merchants.", answer: true,
        right: "✅ One of Makkah's leading entrepreneurs.", wrong: "❌ She was! She hired the Prophet ﷺ because of his honesty." },
      { text: "The Prophet ﷺ stopped all trading after receiving revelation.", answer: false,
        right: "✅ He regulated trade, he didn't stop it.", wrong: "❌ He created an ethical marketplace in Madinah — more trade, not less." },
      { text: "The Quran says 'Allah has made trade permissible.'", answer: true,
        right: "✅ Quran 2:275 — trade is explicitly permitted.", wrong: "❌ It's directly in the Quran (2:275). Trade is halal." },
      { text: "Piety requires giving up all your money.", answer: false,
        right: "✅ Wealth managed as a trust (amānah) IS piety.", wrong: "❌ Piety = managing wealth responsibly, not rejecting it." },
    ],
    summaryFeedback: {
      perfect: "Perfect! You've got the core message: Islam is pro-commerce, pro-wealth, and always has been. The Prophet ﷺ lived it.",
      good: "Almost there! The key idea: Islam doesn't reject wealth — it sets rules for how wealth is earned and used.",
      low: "That's okay! Many people carry these misconceptions. The point is: Islam has always been pro-trade. Wealth managed well is worship."
    }
  },
  // ── Q3: DRAG-DROP WORD ORDER — L2 RECALL — SORT ────────────
  {
    id: 'q3', type: 'word-order', mode: 'SORT', level: '2/5', typeLabel: 'Drag & Drop',
    afterSection: 2,
    question: "Drag the words into the correct order to complete the sentence:",
    sentence: ["Wealth is a ", " you have been ", " with, not something you truly ", "."],
    correctWords: ["trust", "entrusted", "own"],
    wordBank: ["trust", "entrusted", "own", "earn", "deserve"],
    feedback: {
      perfect: "Perfectly assembled! 'Wealth is a trust you have been entrusted with, not something you truly own.' This is the amānah principle — and it's the foundation of everything you'll learn next.",
      partial: "Close! The key idea: wealth is a TRUST, you're ENTRUSTED with it, and you don't truly OWN it. That shift from owner to custodian changes every financial decision.",
      wrong: "Good instinct — you do earn money, and you may feel you deserve it. But the Islamic framing is different: it's a trust (amānah) placed in your care. You manage it, you don't own it."
    }
  },
  // ── Q4: BUCKET SORT — L2 RECALL — SORT ─────────────────────
  {
    id: 'q4', type: 'bucket-sort', mode: 'SORT', level: '2/5', typeLabel: 'Sort into Buckets',
    afterSection: 3,
    question: "Sort these statements into 'Islamic View' or 'Common Misconception.'",
    buckets: [
      { id: 'islamic', label: 'Islamic View', color: T.green, bg: T.greenLight, icon: '✓' },
      { id: 'misconception', label: 'Common Misconception', color: T.coral, bg: T.coralLight, icon: '✗' },
    ],
    items: [
      { text: "Wealth is a tool entrusted to you.", correct: 'islamic' },
      { text: "Money is a distraction from faith.", correct: 'misconception' },
      { text: "Trade and commerce are encouraged.", correct: 'islamic' },
      { text: "The less money you have, the more pious you are.", correct: 'misconception' },
      { text: "Honest profit is halal.", correct: 'islamic' },
      { text: "Caring about finances is materialistic.", correct: 'misconception' },
    ],
    summaryFeedback: {
      perfect: "You've nailed it. You can already distinguish the Islamic view of wealth from the misconceptions most people carry. That's exactly the foundation we need.",
      good: "Nearly there! The pattern: anything that says wealth is BAD is the misconception. Islam says wealth is GOOD when managed responsibly.",
      low: "No worries — these misconceptions are extremely common. That's exactly why this lesson exists. The Islamic view: wealth is a trust, trade is encouraged, honest profit is halal."
    }
  },
  // ── Q5: MC SCENARIO (CAPSTONE) — L2 RECALL — THINK ─────────
  {
    id: 'q5', type: 'mcq-scenario', mode: 'THINK', level: '2/5', typeLabel: 'Scenario',
    afterSection: 3,
    scenario: "Your friend says: 'I don't think Muslims should worry about money. Isn't it better to focus on prayer and leave the finances to sort themselves out?'",
    question: "Based on what you've learned, which response best reflects the Islamic view?",
    options: [
      { id: 'a', text: "'You're right — money is a worldly distraction. Focus on worship.'", correct: false },
      { id: 'b', text: "'Actually, the Prophet ﷺ was a merchant. Islam encourages earning and managing wealth responsibly — that's part of worship too.'", correct: true },
      { id: 'c', text: "'Making money is the most important thing. Islam wants you to be wealthy.'", correct: false },
      { id: 'd', text: "'I'm not sure. It's complicated.'", correct: false },
    ],
    feedback: {
      a: "That's the misconception we just debunked! The Prophet ﷺ didn't ignore money — he traded, he regulated markets, and he taught us how to handle wealth. Dismissing finances isn't piety. It's neglecting a responsibility.",
      b: "Exactly. The Prophet ﷺ was a trader. Khadija رضي الله عنها was a businesswoman. Managing wealth responsibly IS worship. You're not choosing between faith and finances — they're connected.",
      c: "Close, but too far the other way. Islam doesn't say wealth is the MOST important thing. It says wealth is a trust (amānah) — a tool to be managed responsibly. The goal isn't maximum money. It's honest, ethical stewardship.",
      d: "We understand the hesitation, but it's actually not that complicated at this level. Islam's view is clear: wealth is permitted, trade is encouraged, and managing money well is part of responsible living. Trust yourself!"
    },
    bridgeForward: "Next lesson: we'll explore amānah in depth. If wealth is a trust, what does that mean for how you save, spend, and invest?"
  }
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function DEANY_M1L1({ onBack, onHome }) {
  // ── State ────────────────────────────────────────────────────
  const [phase, setPhase] = useState('intro'); // intro | content | question | complete
  const [contentIdx, setContentIdx] = useState(0); // which section
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [results, setResults] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [confidence, setConfidence] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);

  // Content flow: sections interleaved with questions
  const flow = [];
  let qIdx = 0;
  SECTIONS.forEach((sec, sIdx) => {
    flow.push({ type: 'section', data: sec, sIdx });
    // Insert questions that come after this section
    while (qIdx < QUESTIONS.length && QUESTIONS[qIdx].afterSection === sIdx) {
      flow.push({ type: 'question', data: QUESTIONS[qIdx], qIdx });
      qIdx++;
    }
  });
  // Any remaining questions
  while (qIdx < QUESTIONS.length) {
    flow.push({ type: 'question', data: QUESTIONS[qIdx], qIdx });
    qIdx++;
  }

  const [flowIdx, setFlowIdx] = useState(0);
  const currentFlow = flow[flowIdx];

  const advanceFlow = () => {
    if (flowIdx < flow.length - 1) {
      setFlowIdx(flowIdx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPhase('complete');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const recordAnswer = (correct, pts) => {
    if (correct) {
      setScore(s => s + pts);
      setStreak(s => {
        const n = s + 1;
        if (n >= 3) { setShowStreak(true); setTimeout(() => setShowStreak(false), 2000); }
        return n;
      });
    } else {
      setStreak(0);
    }
    setResults(r => [...r, { qIdx: questionIdx, correct }]);
    setQuestionIdx(i => i + 1);
  };

  // ── Nav Header ─────────────────────────────────────────────
  const LessonNav = () => (
    <div className="flex justify-between items-center mb-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /><span>Lessons</span>
      </button>
      <button onClick={onHome} className="flex items-center gap-1.5 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm">
        <Home className="w-3.5 h-3.5" /><span>Home</span>
      </button>
    </div>
  );

  // ── Intro Screen ────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{background:'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)'}}>
        <IslamicPattern />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <LessonNav />
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{background:`${T.gold}18`, color:T.gold}}>
              MODULE 1 • LESSON 1
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{color:T.navy, fontFamily:'Georgia, serif'}}>
              The Trader Prophet ﷺ
            </h1>
            <p className="text-sm max-w-md mx-auto" style={{color:T.grayMed}}>
              Islam is pro-wealth, pro-commerce — and the Prophet ﷺ lived it.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-5">
              <Mascot size="md"/>
              <div className="bg-white/80 rounded-xl rounded-tl-sm p-3.5 border border-gray-100 flex-1">
                <p className="text-sm" style={{color:T.grayDark}}>
                  <b style={{color:T.teal}}>Fulus:</b> Welcome! Before we learn any rules or contracts, let's answer the most fundamental question: what does Islam actually think about money? You might be surprised! 🌟
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: <Clock className="w-4 h-4"/>, label: '12 min', sub: 'Duration' },
                { icon: <Target className="w-4 h-4"/>, label: '5 Qs', sub: 'Questions' },
                { icon: <BookOpen className="w-4 h-4"/>, label: 'L1→L2', sub: 'Difficulty' },
              ].map((s,i) => (
                <div key={i} className="text-center p-3 rounded-xl border" style={{background:`${T.tealLight}50`, borderColor:`${T.teal}15`}}>
                  <div className="flex justify-center mb-1" style={{color:T.teal}}>{s.icon}</div>
                  <div className="text-sm font-bold" style={{color:T.navy}}>{s.label}</div>
                  <div className="text-[10px]" style={{color:T.grayMed}}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg mb-5" style={{background:T.goldLight, border:`1px solid ${T.gold}30`}}>
              <div className="text-xs font-bold mb-1" style={{color:T.gold}}>🎯 Learning Objective</div>
              <div className="text-xs leading-relaxed" style={{color:T.grayDark}}>
                Explain that Islam is pro-wealth and pro-commerce, using the Prophet ﷺ's merchant career and Khadija رضي الله عنها's business as evidence.
              </div>
            </div>

            <button onClick={() => { setPhase('content'); }} className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg active:scale-[0.98]" style={{background:`linear-gradient(135deg, ${T.navy}, ${T.teal})`, color:'white'}}>
              Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Complete Screen ─────────────────────────────────────────
  if (phase === 'complete') {
    const total = QUESTIONS.length;
    const correct = results.filter(r => r.correct).length;
    const pct = Math.round((correct / total) * 100);
    const ringColor = pct >= 80 ? T.green : pct >= 60 ? T.gold : T.teal;
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="min-h-screen relative overflow-hidden" style={{background:'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)'}}>
        <IslamicPattern />
        {showConfetti && <Confetti />}
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <LessonNav />
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:T.navy, fontFamily:'Georgia, serif'}}>Lesson Complete!</h1>
            <p className="text-sm mb-6" style={{color:T.grayMed}}>The Trader Prophet ﷺ</p>

            {/* Score Ring */}
            <div className="relative inline-block mb-6">
              <svg width="96" height="96" className="transform -rotate-90">
                <circle cx="48" cy="48" r="36" fill="none" stroke={T.grayLight} strokeWidth="6"/>
                <circle cx="48" cy="48" r="36" fill="none" stroke={ringColor} strokeWidth="6"
                  strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                  style={{transition:'stroke-dashoffset 1.5s ease-out'}}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{color:T.navy, fontFamily:'Georgia, serif'}}>{correct}/{total}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label:'Score', value:`${score} pts`, color:T.green, bg:T.greenLight },
                { label:'Accuracy', value:`${pct}%`, color:T.teal, bg:T.tealLight },
                { label:'Level', value:'L1→L2', color:T.purple, bg:`${T.purple}12` },
              ].map((s,i) => (
                <div key={i} className="p-3 rounded-xl border" style={{background:s.bg, borderColor:`${s.color}20`}}>
                  <div className="text-lg font-bold" style={{color:s.color}}>{s.value}</div>
                  <div className="text-[10px]" style={{color:T.grayMed}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Concepts Mastered */}
            <div className="text-left p-4 rounded-xl mb-6" style={{background:`${T.greenLight}60`, border:`1px solid ${T.green}20`}}>
              <div className="text-xs font-bold mb-2" style={{color:T.green}}>✅ Concepts Mastered</div>
              {['Islam is pro-wealth and pro-commerce','The Prophet ﷺ was a merchant','Khadija رضي الله عنها was a businesswoman','Amānah concept introduced'].map((c,i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:T.green}}/>
                  <span className="text-xs" style={{color:T.grayDark}}>{c}</span>
                </div>
              ))}
            </div>

            {/* Confidence Pulse */}
            <div className="p-4 rounded-xl mb-6" style={{background:T.goldLight, border:`1px solid ${T.gold}25`}}>
              <div className="text-xs font-bold mb-3" style={{color:T.gold}}>How confident do you feel about this topic?</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] w-16 text-right" style={{color:T.grayMed}}>Still unsure</span>
                <div className="flex-1 relative">
                  <input type="range" min="1" max="5" value={confidence} onChange={e => setConfidence(+e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{background:`linear-gradient(to right, ${T.teal} 0%, ${T.gold} ${(confidence-1)*25}%, ${T.grayLight} ${(confidence-1)*25}%)`,
                      accentColor:T.gold}}/>
                </div>
                <span className="text-[10px] w-20" style={{color:T.grayMed}}>Could explain it</span>
              </div>
              <div className="text-xs text-center" style={{color:T.grayDark}}>
                {confidence <= 2 ? "That's completely normal. The next lesson will reinforce this." :
                 confidence === 3 ? "Good foundation! It'll click more as we build on it." :
                 "Great! You're ready for the next step."}
              </div>
            </div>

            {/* Next Preview */}
            <div className="p-4 rounded-xl mb-5" style={{background:`${T.teal}08`, border:`1px solid ${T.teal}18`}}>
              <div className="text-xs font-bold mb-1" style={{color:T.teal}}>Up Next</div>
              <div className="text-sm font-semibold mb-1" style={{color:T.navy}}>Lesson 1.2: Money as Amānah</div>
              <div className="text-xs" style={{color:T.grayMed}}>You'll explore why this single idea changes everything about how you relate to wealth.</div>
            </div>

            <button className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg" style={{background:`linear-gradient(135deg, ${T.gold}, ${T.orange})`, color:T.navy}}>
              Next Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
            </button>
          </div>
        </div>
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }`}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // CONTENT FLOW (sections + questions)
  // ═══════════════════════════════════════════════════════════════
  const qNumber = flow.slice(0, flowIdx + 1).filter(f => f.type === 'question').length;
  const totalQ = QUESTIONS.length;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{background:'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)'}}>
      <IslamicPattern />
      {showStreak && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg animate-bounce"
          style={{background:`linear-gradient(135deg, ${T.orange}, ${T.coral})`, color:'white'}}>
          <Flame className="w-4 h-4"/> <span className="text-sm font-bold">{streak} Streak! 🔥</span>
        </div>
      )}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        <LessonNav />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{background:`${T.gold}15`, color:T.gold}}>📖</div>
            <div>
              <div className="text-xs font-bold" style={{color:T.navy}}>Lesson 1.1</div>
              <div className="text-[10px]" style={{color:T.grayMed}}>The Trader Prophet ﷺ</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{background:T.goldLight, color:T.gold}}>
              <Star className="w-3 h-3" fill={T.gold}/> {score}
            </div>
          </div>
        </div>

        <ProgressBar current={qNumber} total={totalQ} score={score}/>

        {/* ── Section Content ───────────────────────────────────── */}
        {currentFlow?.type === 'section' && (
          <SectionCard key={`s-${flowIdx}`} section={currentFlow.data} onContinue={advanceFlow}/>
        )}

        {/* ── Question ──────────────────────────────────────────── */}
        {currentFlow?.type === 'question' && (
          <QuestionCard
            key={`q-${flowIdx}`}
            q={currentFlow.data}
            qNum={qNumber}
            totalQ={totalQ}
            attempts={attempts}
            setAttempts={setAttempts}
            onComplete={(correct, pts) => { recordAnswer(correct, pts); }}
            onNext={advanceFlow}
          />
        )}
      </div>

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes springIn { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .animate-slideUp { animation: slideUp 0.35s ease-out forwards; }
        .animate-shake { animation: shake 0.2s ease 3; }
        .animate-springIn { animation: springIn 0.4s ease-out forwards; }
        .animate-pulse-gentle { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION CARD
// ═══════════════════════════════════════════════════════════════
function SectionCard({ section, onContinue }) {
  const renderMarkdown = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{color:T.navy}}>{part.slice(2,-2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="animate-slideUp">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4" style={{background:`linear-gradient(135deg, ${T.navy}, ${T.teal})`}}>
          <h2 className="text-lg font-bold text-white" style={{fontFamily:'Georgia, serif'}}>
            {section.title}
          </h2>
        </div>

        <div className="p-6">
          {section.content.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed mb-4" style={{color:T.grayDark}}>
              {renderMarkdown(para)}
            </p>
          ))}

          {/* Quranic Reference */}
          {section.quran && (
            <div className="rounded-xl p-4 mb-4 border-l-4" style={{background:T.goldLight, borderColor:T.gold}}>
              <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{color:T.gold}}>
                📖 Qur'anic Reference
              </div>
              <p className="text-sm italic mb-1" style={{color:T.navy, fontFamily:'Georgia, serif'}}>
                {section.quran.text}
              </p>
              <p className="text-xs font-semibold mb-2" style={{color:T.gold}}>— {section.quran.ref}</p>
              {section.quran.note && (
                <p className="text-xs leading-relaxed" style={{color:T.grayDark}}>{section.quran.note}</p>
              )}
            </div>
          )}

          {/* Did You Know */}
          {section.didYouKnow && (
            <div className="rounded-xl p-4 mb-4 border-l-4" style={{background:T.tealLight, borderColor:T.teal}}>
              <div className="text-xs font-bold mb-1 flex items-center gap-1.5" style={{color:T.teal}}>
                💡 Did You Know?
              </div>
              <p className="text-xs leading-relaxed" style={{color:T.grayDark}}>{section.didYouKnow}</p>
            </div>
          )}

          <button onClick={onContinue} className="w-full py-3 rounded-xl font-bold text-sm mt-2 transition-all hover:shadow-md active:scale-[0.98]" style={{background:`linear-gradient(135deg, ${T.teal}, ${T.green})`, color:'white'}}>
            Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUESTION CARD (router)
// ═══════════════════════════════════════════════════════════════
function QuestionCard({ q, qNum, totalQ, attempts, setAttempts, onComplete, onNext }) {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [canProceed, setCanProceed] = useState(false);

  const markDone = (isCorrect, fb, pts = 0) => {
    setAnswered(true);
    setCorrect(isCorrect);
    setFeedbackText(fb);
    setCanProceed(true);
    onComplete(isCorrect, pts);
  };

  return (
    <div className="animate-slideUp">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl overflow-hidden">
        <div className="p-6">
          <ModeBadge mode={q.mode} type={q.typeLabel}/>

          {/* Scenario bubble for Q5 */}
          {q.scenario && (
            <div className="rounded-xl p-4 mb-4 relative" style={{background:T.grayLight, border:`1px solid ${T.grayMed}20`}}>
              <div className="text-xs font-semibold mb-1" style={{color:T.grayMed}}>Your friend says:</div>
              <p className="text-sm italic leading-relaxed" style={{color:T.grayDark, fontFamily:'Georgia, serif'}}>
                {q.scenario}
              </p>
              <div className="absolute -bottom-2 left-6 w-4 h-4 rotate-45" style={{background:T.grayLight, borderRight:`1px solid ${T.grayMed}20`, borderBottom:`1px solid ${T.grayMed}20`}}/>
            </div>
          )}

          <h3 className="text-sm font-bold leading-relaxed mb-5" style={{color:T.navy}}>
            {q.question}
          </h3>

          {/* Render by type */}
          {(q.type === 'mcq' || q.type === 'mcq-scenario') && (
            <MCQRenderer q={q} answered={answered} onDone={markDone}/>
          )}
          {q.type === 'swipe' && (
            <SwipeRenderer q={q} answered={answered} onDone={markDone}/>
          )}
          {q.type === 'word-order' && (
            <WordOrderRenderer q={q} answered={answered} onDone={markDone}/>
          )}
          {q.type === 'bucket-sort' && (
            <BucketSortRenderer q={q} answered={answered} onDone={markDone}/>
          )}

          {answered && feedbackText && (
            <FeedbackPanel correct={correct} text={feedbackText} bridgeForward={q.bridgeForward}/>
          )}

          {canProceed && (
            <button onClick={onNext} className="w-full py-3 rounded-xl font-bold text-sm mt-4 transition-all hover:shadow-md active:scale-[0.98]" style={{background:`linear-gradient(135deg, ${T.navy}, ${T.teal})`, color:'white'}}>
              {qNum >= totalQ ? 'Finish Lesson' : 'Next'} <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MCQ RENDERER
// ═══════════════════════════════════════════════════════════════
function MCQRenderer({ q, answered, onDone }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [shakeId, setShakeId] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const submit = () => {
    if (selected === null || submitted) return;
    const opt = q.options[selected];
    setSubmitted(true);
    if (!opt.correct) {
      setShakeId(selected);
      setTimeout(() => setShakeId(null), 600);
    }
    const pts = opt.correct ? (attempt === 0 ? 10 : 5) : 0;
    onDone(opt.correct, q.feedback[opt.id], pts);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {q.options.map((opt, i) => {
          const isSel = selected === i;
          const isCorrect = submitted && opt.correct;
          const isWrong = submitted && isSel && !opt.correct;
          return (
            <button key={opt.id}
              onClick={() => { if (!submitted) setSelected(i); }}
              disabled={submitted}
              className={`relative p-4 rounded-xl text-left text-sm font-medium border-2 transition-all duration-200 ${shakeId === i ? 'animate-shake' : ''}`}
              style={{
                background: isCorrect ? T.greenLight : isWrong ? T.coralLight : isSel && !submitted ? `${T.navy}` : 'white',
                borderColor: isCorrect ? T.green : isWrong ? T.coral : isSel && !submitted ? T.navy : '#ddd',
                color: isSel && !submitted && !isCorrect ? 'white' : T.grayDark,
                opacity: submitted && !isSel && !opt.correct ? 0.5 : 1,
              }}>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: isCorrect ? T.green : isWrong ? T.coral : isSel && !submitted ? 'rgba(255,255,255,0.3)' : T.grayLight,
                    color: isCorrect || isWrong || (isSel && !submitted) ? 'white' : T.grayMed
                  }}>
                  {isCorrect ? '✓' : isWrong ? '✗' : opt.id.toUpperCase()}
                </span>
                <span className="flex-1">{opt.text}</span>
              </div>
              {isCorrect && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center animate-springIn" style={{background:T.green}}>
                  <CheckCircle className="w-4 h-4 text-white"/>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <button onClick={submit} disabled={selected === null}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${selected !== null ? 'hover:shadow-md' : 'cursor-not-allowed'}`}
          style={{
            background: selected !== null ? `linear-gradient(135deg, ${T.gold}, ${T.orange})` : T.grayLight,
            color: selected !== null ? T.navy : '#bbb'
          }}>
          Check Answer
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SWIPE TRUE/FALSE RENDERER
// ═══════════════════════════════════════════════════════════════
function SwipeRenderer({ q, answered, onDone }) {
  const [cardIdx, setCardIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [cardFeedback, setCardFeedback] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const startX = useRef(0);
  const cardRef = useRef(null);

  const cards = q.cards;
  const done = cardIdx >= cards.length;

  const handleSwipe = (isTrue) => {
    const card = cards[cardIdx];
    const isCorrect = card.answer === isTrue;
    const fb = isCorrect ? card.right : card.wrong;
    setCardFeedback({ correct: isCorrect, text: fb });
    setResults(r => [...r, { correct: isCorrect, card, chose: isTrue }]);

    setTimeout(() => {
      setCardFeedback(null);
      setDragX(0);
      if (cardIdx + 1 >= cards.length) {
        // Summary
        const allResults = [...results, { correct: isCorrect }];
        const correctCount = allResults.filter(r => r.correct).length;
        const total = cards.length;
        const fb = correctCount === total ? q.summaryFeedback.perfect :
                   correctCount >= 4 ? q.summaryFeedback.good : q.summaryFeedback.low;
        const pts = Math.round((correctCount / total) * 10);
        setShowSummary(true);
        onDone(correctCount >= 4, fb, pts);
      }
      setCardIdx(cardIdx + 1);
    }, 1200);
  };

  // Touch / mouse drag
  const onDragStart = (e) => {
    if (done || cardFeedback) return;
    setIsDragging(true);
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onDragMove = (e) => {
    if (!isDragging || done || cardFeedback) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - startX.current;
    setDragX(x);
  };
  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragX) > 80) {
      handleSwipe(dragX > 0);
    } else {
      setDragX(0);
    }
  };

  if (showSummary) {
    const correctCount = results.filter(r => r.correct).length;
    return (
      <div>
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{correctCount === cards.length ? '🎉' : correctCount >= 4 ? '👍' : '💪'}</div>
          <div className="text-lg font-bold" style={{color:T.navy}}>{correctCount}/{cards.length}</div>
          <div className="text-xs" style={{color:T.grayMed}}>Correct</div>
        </div>
        <div className="space-y-1.5 max-h-52 overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg text-xs" style={{
              background: r.correct ? T.greenLight : T.coralLight,
              border: `1px solid ${r.correct ? T.green : T.coral}25`
            }}>
              {r.correct ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:T.green}}/> : <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:T.coral}}/>}
              <div>
                <div className="font-medium" style={{color:T.grayDark}}>{r.card.text}</div>
                <div className="mt-0.5" style={{color:T.grayMed}}>
                  {r.card.answer ? 'TRUE' : 'FALSE'} {r.correct ? r.card.right : r.card.wrong}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const card = cards[cardIdx];
  const tilt = Math.min(Math.max(dragX / 10, -15), 15);
  const leftOpacity = dragX < -30 ? Math.min((-dragX - 30) / 60, 1) : 0;
  const rightOpacity = dragX > 30 ? Math.min((dragX - 30) / 60, 1) : 0;

  return (
    <div>
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-4">
        {cards.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all" style={{
            background: i < cardIdx ? (results[i]?.correct ? T.green : T.coral) :
                        i === cardIdx ? T.navy : T.grayLight
          }}/>
        ))}
      </div>

      {/* Zone labels */}
      <div className="flex justify-between mb-3 px-2">
        <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all" style={{
          background: T.coralLight, color: T.coral, opacity: 0.4 + leftOpacity * 0.6,
          transform: `scale(${1 + leftOpacity * 0.1})`
        }}>
          <ArrowLeft className="w-3 h-3"/> FALSE
        </div>
        <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all" style={{
          background: T.greenLight, color: T.green, opacity: 0.4 + rightOpacity * 0.6,
          transform: `scale(${1 + rightOpacity * 0.1})`
        }}>
          TRUE <ArrowRight className="w-3 h-3"/>
        </div>
      </div>

      {/* Card stack */}
      <div className="relative flex justify-center" style={{minHeight:'120px', touchAction:'none'}}>
        {/* Ghost cards behind */}
        {cardIdx + 2 < cards.length && (
          <div className="absolute rounded-2xl border" style={{width:'min(320px,85vw)', height:'100px', top:'8px', background:'white', borderColor:'#eee', opacity:0.4}}/>
        )}
        {cardIdx + 1 < cards.length && (
          <div className="absolute rounded-2xl border" style={{width:'min(330px,88vw)', height:'104px', top:'4px', background:'white', borderColor:'#ddd', opacity:0.6}}/>
        )}

        {/* Active card */}
        {!done && !cardFeedback && card && (
          <div ref={cardRef}
            onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
            onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}
            className="relative rounded-2xl shadow-lg border-2 p-5 cursor-grab active:cursor-grabbing select-none"
            style={{
              width:'min(340px, 90vw)', background: dragX > 30 ? `${T.greenLight}` : dragX < -30 ? `${T.coralLight}` : 'white',
              borderColor: dragX > 30 ? T.green : dragX < -30 ? T.coral : '#ddd',
              transform: `translateX(${dragX}px) rotate(${tilt}deg)`,
              transition: isDragging ? 'none' : 'all 0.2s ease',
            }}>
            <div className="text-xs font-medium mb-1" style={{color:T.grayMed}}>
              {cardIdx + 1} of {cards.length}
            </div>
            <p className="text-sm font-semibold leading-relaxed" style={{color:T.navy}}>
              {card.text}
            </p>
          </div>
        )}

        {/* Feedback flash */}
        {cardFeedback && (
          <div className="rounded-2xl shadow-lg border-2 p-5 animate-slideUp" style={{
            width:'min(340px, 90vw)',
            background: cardFeedback.correct ? T.greenLight : T.coralLight,
            borderColor: cardFeedback.correct ? T.green : T.coral,
          }}>
            <div className="flex items-center gap-2 mb-1">
              {cardFeedback.correct ? <CheckCircle className="w-4 h-4" style={{color:T.green}}/> : <XCircle className="w-4 h-4" style={{color:T.coral}}/>}
              <span className="text-xs font-bold" style={{color: cardFeedback.correct ? T.green : T.coral}}>
                {cardFeedback.correct ? 'Correct!' : 'Not quite'}
              </span>
            </div>
            <p className="text-xs" style={{color:T.grayDark}}>{cardFeedback.text}</p>
          </div>
        )}
      </div>

      {/* Button fallback */}
      {!done && !cardFeedback && (
        <div className="flex gap-3 mt-4 justify-center">
          <button onClick={() => handleSwipe(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md active:scale-95 border-2"
            style={{borderColor:T.coral, color:T.coral, background:T.coralLight}}>
            <ArrowLeft className="w-4 h-4"/> FALSE
          </button>
          <button onClick={() => handleSwipe(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md active:scale-95 border-2"
            style={{borderColor:T.green, color:T.green, background:T.greenLight}}>
            TRUE <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORD ORDER DRAG & DROP RENDERER
// ═══════════════════════════════════════════════════════════════
function WordOrderRenderer({ q, answered, onDone }) {
  const [slots, setSlots] = useState(new Array(q.correctWords.length).fill(null));
  const [bank, setBank] = useState([...q.wordBank].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);
  const [slotResults, setSlotResults] = useState(null);
  const [dragWord, setDragWord] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const allFilled = slots.every(s => s !== null);

  const placeInSlot = (word, slotIdx) => {
    if (submitted) return;
    const newSlots = [...slots];
    const newBank = [...bank];

    // If slot has a word, return it
    if (newSlots[slotIdx] !== null) {
      newBank.push(newSlots[slotIdx]);
    }
    newSlots[slotIdx] = word;

    // Remove from bank
    const bIdx = newBank.indexOf(word);
    if (bIdx > -1) newBank.splice(bIdx, 1);

    setSlots(newSlots);
    setBank(newBank);
    setDragWord(null);
    setDragOverSlot(null);
  };

  const removeFromSlot = (slotIdx) => {
    if (submitted) return;
    if (slots[slotIdx] === null) return;
    setBank([...bank, slots[slotIdx]]);
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
  };

  const tapWord = (word) => {
    if (submitted) return;
    const emptyIdx = slots.indexOf(null);
    if (emptyIdx > -1) placeInSlot(word, emptyIdx);
  };

  const submit = () => {
    if (!allFilled || submitted) return;
    setSubmitted(true);
    const res = slots.map((s, i) => s === q.correctWords[i]);
    setSlotResults(res);
    const correctCount = res.filter(Boolean).length;
    const total = q.correctWords.length;
    const fb = correctCount === total ? q.feedback.perfect :
               correctCount > 0 ? q.feedback.partial : q.feedback.wrong;
    const pts = correctCount === total ? 10 : correctCount > 0 ? 5 : 0;
    onDone(correctCount === total, fb, pts);
  };

  // Drag handlers
  const onBankDragStart = (e, word) => {
    setDragWord(word);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', word);
  };
  const onSlotDragOver = (e, idx) => {
    e.preventDefault();
    setDragOverSlot(idx);
  };
  const onSlotDrop = (e, idx) => {
    e.preventDefault();
    const word = dragWord || e.dataTransfer.getData('text/plain');
    if (word) placeInSlot(word, idx);
    setDragOverSlot(null);
  };
  const onSlotDragStart = (e, idx) => {
    if (slots[idx] === null) return;
    setDragWord(slots[idx]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', slots[idx]);
    // Remove from slot after drag starts
    setTimeout(() => removeFromSlot(idx), 0);
  };

  return (
    <div>
      {/* Sentence with slots */}
      <div className="rounded-xl p-5 mb-5 border" style={{background:`linear-gradient(135deg, ${T.tealLight}40, ${T.goldLight}30)`, borderColor:`${T.teal}20`}}>
        <div className="text-sm leading-loose flex flex-wrap items-center gap-x-1 gap-y-2" style={{color:T.grayDark}}>
          {q.sentence.map((part, i) => (
            <React.Fragment key={i}>
              <span>{part}</span>
              {i < q.sentence.length - 1 && (
                <span
                  onDragOver={(e) => onSlotDragOver(e, i)}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => onSlotDrop(e, i)}
                  draggable={slots[i] !== null && !submitted}
                  onDragStart={(e) => onSlotDragStart(e, i)}
                  onClick={() => !submitted && removeFromSlot(i)}
                  className={`inline-flex items-center justify-center min-w-[80px] h-9 px-3 rounded-lg text-sm font-bold transition-all cursor-pointer mx-0.5
                    ${submitted && slotResults?.[i] ? '' : submitted && !slotResults?.[i] && slots[i] !== null ? 'animate-shake' : ''}
                    ${!submitted && slots[i] === null ? 'animate-pulse-gentle' : ''}`}
                  style={{
                    background: submitted && slotResults?.[i] ? T.greenLight :
                                submitted && !slotResults?.[i] ? T.coralLight :
                                dragOverSlot === i ? T.goldLight :
                                slots[i] !== null ? `${T.teal}15` : `${T.tealLight}`,
                    border: `2px ${slots[i] !== null || dragOverSlot === i ? 'solid' : 'dashed'} ${
                      submitted && slotResults?.[i] ? T.green :
                      submitted && !slotResults?.[i] ? T.coral :
                      dragOverSlot === i ? T.gold :
                      slots[i] !== null ? T.teal : `${T.teal}60`
                    }`,
                    color: submitted && slotResults?.[i] ? T.green :
                           submitted && !slotResults?.[i] ? T.coral : T.navy,
                  }}>
                  {slots[i] !== null ? (
                    <span className="flex items-center gap-1">
                      {slots[i]}
                      {submitted && slotResults?.[i] && <CheckCircle className="w-3.5 h-3.5 animate-springIn" style={{color:T.green}}/>}
                      {submitted && !slotResults?.[i] && <XCircle className="w-3.5 h-3.5" style={{color:T.coral}}/>}
                      {!submitted && <span className="text-[9px] ml-1 opacity-50">✕</span>}
                    </span>
                  ) : (
                    <span className="text-xs opacity-50">{i + 1}</span>
                  )}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Show correct answers on failure */}
        {submitted && slotResults && !slotResults.every(Boolean) && (
          <div className="mt-3 pt-3 border-t" style={{borderColor:`${T.teal}20`}}>
            <div className="text-[10px] font-bold mb-1" style={{color:T.teal}}>Correct answer:</div>
            <div className="flex flex-wrap gap-1.5">
              {q.correctWords.map((w, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{background:T.greenLight, color:T.green}}>
                  {i+1}. {w}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Word Bank */}
      <div className="mb-4">
        <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{color:T.grayMed}}>
          <GripVertical className="w-3 h-3"/> Word Bank — drag or tap to place
        </div>
        <div className="flex flex-wrap gap-2">
          {bank.map((word, i) => (
            <div key={`${word}-${i}`}
              draggable={!submitted}
              onDragStart={(e) => onBankDragStart(e, word)}
              onClick={() => tapWord(word)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold border-2 select-none transition-all ${!submitted ? 'cursor-grab active:cursor-grabbing hover:shadow-md active:scale-105' : 'opacity-50'}`}
              style={{
                background: 'white',
                borderColor: '#ddd',
                color: T.navy,
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}>
              {word}
            </div>
          ))}
          {bank.length === 0 && !submitted && (
            <div className="text-xs italic px-3 py-2" style={{color:T.grayMed}}>All words placed!</div>
          )}
        </div>
      </div>

      {!submitted && (
        <button onClick={submit} disabled={!allFilled}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${allFilled ? 'hover:shadow-md' : 'cursor-not-allowed'}`}
          style={{
            background: allFilled ? `linear-gradient(135deg, ${T.gold}, ${T.orange})` : T.grayLight,
            color: allFilled ? T.navy : '#bbb'
          }}>
          Check Answer
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BUCKET SORT RENDERER
// ═══════════════════════════════════════════════════════════════
function BucketSortRenderer({ q, answered, onDone }) {
  const [pool, setPool] = useState(() => [...q.items].sort(() => Math.random() - 0.5));
  const [bucketItems, setBucketItems] = useState(() => {
    const b = {};
    q.buckets.forEach(bk => { b[bk.id] = []; });
    return b;
  });
  const [submitted, setSubmitted] = useState(false);
  const [itemResults, setItemResults] = useState({});
  const [heldItem, setHeldItem] = useState(null);
  const [dragOverBucket, setDragOverBucket] = useState(null);

  const totalItems = q.items.length;
  const placedCount = Object.values(bucketItems).reduce((s, arr) => s + arr.length, 0);
  const allPlaced = placedCount >= totalItems;

  const dropIntoBucket = (item, bucketId) => {
    if (submitted) return;
    const itm = item || heldItem;
    if (!itm) return;

    // Remove from pool or other bucket
    setPool(p => p.filter(x => x.text !== itm.text));
    const newBuckets = { ...bucketItems };
    q.buckets.forEach(bk => {
      newBuckets[bk.id] = newBuckets[bk.id].filter(x => x.text !== itm.text);
    });
    newBuckets[bucketId] = [...(newBuckets[bucketId] || []), itm];
    setBucketItems(newBuckets);
    setHeldItem(null);
    setDragOverBucket(null);
  };

  const returnToPool = (item, bucketId) => {
    if (submitted) return;
    const newBuckets = { ...bucketItems };
    newBuckets[bucketId] = newBuckets[bucketId].filter(x => x.text !== item.text);
    setBucketItems(newBuckets);
    setPool(p => [...p, item]);
  };

  const submit = () => {
    if (!allPlaced || submitted) return;
    setSubmitted(true);
    const results = {};
    let correctCount = 0;
    q.buckets.forEach(bk => {
      bucketItems[bk.id].forEach(item => {
        const isCorrect = item.correct === bk.id;
        results[item.text] = isCorrect;
        if (isCorrect) correctCount++;
      });
    });
    setItemResults(results);

    const fb = correctCount === totalItems ? q.summaryFeedback.perfect :
               correctCount >= 4 ? q.summaryFeedback.good : q.summaryFeedback.low;
    const pts = correctCount === totalItems ? 10 : correctCount >= 4 ? 5 : 0;
    onDone(correctCount >= 4, fb, pts);
  };

  // Drag handlers
  const onItemDragStart = (e, item) => {
    setHeldItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.text);
  };

  return (
    <div>
      {/* Buckets */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.buckets.map(bk => (
          <div key={bk.id}
            onDragOver={(e) => { e.preventDefault(); setDragOverBucket(bk.id); }}
            onDragLeave={() => setDragOverBucket(null)}
            onDrop={(e) => { e.preventDefault(); if (heldItem) dropIntoBucket(heldItem, bk.id); setDragOverBucket(null); }}
            onClick={() => { if (heldItem) dropIntoBucket(heldItem, bk.id); }}
            className="rounded-xl p-3 min-h-[160px] transition-all border-2"
            style={{
              background: bk.bg,
              borderColor: dragOverBucket === bk.id ? T.gold : bk.color,
              borderStyle: dragOverBucket === bk.id ? 'solid' : (bucketItems[bk.id].length ? 'solid' : 'dashed'),
              transform: dragOverBucket === bk.id ? 'scale(1.02)' : 'scale(1)',
            }}>
            <div className="text-xs font-bold text-center mb-2 flex items-center justify-center gap-1" style={{color:bk.color, fontFamily:'Georgia, serif'}}>
              <span>{bk.icon}</span> {bk.label}
            </div>
            <div className="space-y-1.5">
              {bucketItems[bk.id].map((item, i) => (
                <div key={item.text}
                  onClick={() => !submitted && returnToPool(item, bk.id)}
                  className={`p-2.5 rounded-lg text-xs font-medium border transition-all ${!submitted ? 'cursor-pointer hover:opacity-70' : ''} ${
                    submitted && itemResults[item.text] === false ? 'animate-shake' : ''
                  }`}
                  style={{
                    background: submitted ? (itemResults[item.text] ? T.greenLight : T.coralLight) : 'white',
                    borderColor: submitted ? (itemResults[item.text] ? T.green : T.coral) : '#ddd',
                    color: T.grayDark,
                  }}>
                  <div className="flex items-center gap-1.5">
                    {submitted && itemResults[item.text] && <CheckCircle className="w-3 h-3 flex-shrink-0" style={{color:T.green}}/>}
                    {submitted && !itemResults[item.text] && <XCircle className="w-3 h-3 flex-shrink-0" style={{color:T.coral}}/>}
                    <span className="flex-1">{item.text}</span>
                    {!submitted && <span className="text-[9px] opacity-40">✕</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pool */}
      {pool.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{color:T.grayMed}}>
            <GripVertical className="w-3 h-3"/> Drag or tap to select, then tap a bucket
          </div>
          <div className="space-y-2">
            {pool.map((item, i) => (
              <div key={item.text}
                draggable
                onDragStart={(e) => onItemDragStart(e, item)}
                onClick={() => {
                  if (heldItem?.text === item.text) setHeldItem(null);
                  else setHeldItem(item);
                }}
                className={`p-3 rounded-xl border-2 text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-md ${
                  heldItem?.text === item.text ? 'ring-2 shadow-md' : ''
                }`}
                style={{
                  background: 'white',
                  borderColor: heldItem?.text === item.text ? T.gold : '#ddd',
                  color: T.navy,
                  ringColor: T.gold,
                  boxShadow: heldItem?.text === item.text ? `0 0 0 2px ${T.gold}40` : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 flex-shrink-0" style={{color:T.grayMed}}/>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!submitted && (
        <button onClick={submit} disabled={!allPlaced}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${allPlaced ? 'hover:shadow-md' : 'cursor-not-allowed'}`}
          style={{
            background: allPlaced ? `linear-gradient(135deg, ${T.gold}, ${T.orange})` : T.grayLight,
            color: allPlaced ? T.navy : '#bbb'
          }}>
          Check Answer ({placedCount}/{totalItems} placed)
        </button>
      )}

      {/* Show correct placement on wrong answers */}
      {submitted && Object.values(itemResults).some(v => !v) && (
        <div className="mt-3 p-3 rounded-xl" style={{background:`${T.tealLight}50`, border:`1px solid ${T.teal}20`}}>
          <div className="text-[10px] font-bold mb-1.5" style={{color:T.teal}}>Correct placement:</div>
          {q.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 py-0.5 text-xs" style={{color:T.grayDark}}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background: q.buckets.find(b => b.id === item.correct)?.color}}/>
              <span className="font-medium">{item.text}</span>
              <span style={{color:T.grayMed}}>→ {q.buckets.find(b => b.id === item.correct)?.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
