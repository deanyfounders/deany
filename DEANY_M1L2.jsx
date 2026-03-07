import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, XCircle, ArrowRight, ArrowLeft, Flame, Star,
  BookOpen, Clock, Target, GripVertical, ChevronDown, Award,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// DEANY — MODULE 1, LESSON 2: Money as Amānah
// Blueprint: DEANY_M1L2_Blueprint.docx
// 6 Questions • 5 Types • 3 Modes • L2→L3 • 14 Minutes
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

// ── Shared UI Components ──────────────────────────────────────
const IslamicPattern = ({ opacity = 0.03, color = T.teal }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="islamicGeoL2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}/>
        <circle cx="30" cy="30" r="12" fill="none" stroke={color} strokeWidth="0.3" opacity={opacity}/>
        <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity}/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamicGeoL2)"/>
  </svg>
);

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 200 }}>
    {[...Array(40)].map((_, i) => (
      <div key={i} className="absolute" style={{
        left: `${Math.random() * 100}%`, top: '-20px',
        fontSize: `${14 + Math.random() * 12}px`,
        animation: `confettiFall ${2 + Math.random() * 2.5}s ease-out forwards`,
        animationDelay: `${Math.random() * 1}s`,
      }}>
        {['✦', '✧', '☆', '🌟', '✨', '⭐', '💫'][Math.floor(Math.random() * 7)]}
      </div>
    ))}
  </div>
);

const Mascot = ({ size = 'md', className = '' }) => {
  const s = { sm: 'w-9 h-9 text-lg', md: 'w-12 h-12 text-2xl', lg: 'w-16 h-16 text-4xl' };
  return (
    <div className={`${s[size]} rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${className}`}
      style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.orange})`, boxShadow: `0 4px 16px ${T.gold}40` }}>
      <span>🪙</span>
    </div>
  );
};

const ProgressBar = ({ current, total, score }) => {
  const pct = (current / total) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold" style={{ color: T.grayMed }}>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" style={{ color: T.gold }} fill={T.gold} />
          <span className="text-xs font-bold" style={{ color: T.navy }}>{score} pts</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: T.grayLight }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${T.teal}, ${T.green})` }} />
      </div>
    </div>
  );
};

const ModeBadge = ({ mode, type }) => {
  const cfg = {
    THINK: { bg: `${T.purple}15`, color: T.purple, icon: '🧠' },
    PLAY: { bg: `${T.magenta}15`, color: T.magenta, icon: '🎮' },
    SORT: { bg: `${T.teal}15`, color: T.teal, icon: '📦' },
  };
  const c = cfg[mode] || cfg.THINK;
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: c.bg, color: c.color }}>
        {c.icon} {mode}
      </span>
      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${T.navy}08`, color: T.grayMed }}>
        {type}
      </span>
    </div>
  );
};

const FeedbackPanel = ({ correct, text, bridgeForward }) => (
  <div className="mt-4 rounded-xl p-5 border-2 animate-slideUp" style={{
    background: correct ? T.greenLight : T.coralLight,
    borderColor: correct ? T.green : T.coral,
  }}>
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        {correct
          ? <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
          : <XCircle className="w-5 h-5" style={{ color: T.coral }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold mb-1" style={{ color: correct ? T.green : T.coral }}>
          {correct ? 'Correct!' : 'Not quite!'}
        </div>
        <div className="text-sm leading-relaxed" style={{ color: T.grayDark }}>{text}</div>
        {bridgeForward && correct && (
          <div className="mt-3 pt-3 border-t flex items-start gap-2" style={{ borderColor: `${T.green}30` }}>
            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: T.teal }} />
            <span className="text-xs italic" style={{ color: T.teal }}>{bridgeForward}</span>
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
    title: 'Two Ways to Think About Your Money',
    content: [
      "Imagine you receive AED 50,000. Maybe it's a bonus, an inheritance, or savings you've built up. You now have a choice — not about what to do with it, but about how to **think** about it.",
      'Both people have the same AED 50,000. But they\'ll make completely different decisions about saving, spending, investing, and giving. The difference isn\'t the amount — it\'s the mindset.',
      'Islam teaches Mindset B. Your wealth is **amānah (أمانة)** — a trust placed in your care by its true Owner. You\'re a custodian **(khalifah, خليفة)**, not a proprietor.',
    ],
    mindsets: [
      {
        label: 'Mindset A: The Owner', color: T.coral, bg: T.coralLight, icon: '💼',
        text: "'It's my money. I earned it. I can do whatever I want with it. Nobody has the right to tell me how to spend it. If I want to blow it on a car, that's my business.'",
      },
      {
        label: 'Mindset B: The Custodian', color: T.green, bg: T.greenLight, icon: '🔑',
        text: "'This money has been placed in my care. I didn't create it — Allah provided it. I'm responsible for how I use it. I'll be asked about it. So I need to manage it wisely, not just spend it freely.'",
      },
    ],
  },
  {
    id: 'section-b',
    title: 'The Accountability Hadith',
    content: [
      'This isn\'t just a nice idea. It comes with accountability. The Prophet ﷺ said that every person will be asked about their wealth on the Day of Judgement — two questions specifically.',
      'Two of those five questions are about money: how you **earned** it and how you **spent** it. Not one. Two. That\'s 40% of the Day of Judgement accountability focused on your financial behaviour.',
      'This is why amānah isn\'t just philosophy. It has consequences. A custodian who manages well is rewarded. A custodian who wastes, hoards, or earns through forbidden means will be asked why.',
    ],
    hadith: {
      text: '"The son of Adam will not be dismissed from before his Lord on the Day of Resurrection until he has been asked about five things: his life and how he spent it, his youth and how he used it, his wealth and how he earned it and how he disposed of it, and how he acted upon what he acquired of knowledge."',
      ref: 'Tirmidhi 2416 (graded sahih)',
    },
  },
  {
    id: 'section-c',
    title: 'Owner vs Custodian — The Decision Framework',
    content: [
      "Let's make this practical. The owner mindset and the custodian mindset produce different answers to the same financial questions. Here's how:",
      "Notice: the custodian doesn't ask **fewer** questions. They ask **better** questions. The owner asks 'can I?' The custodian asks 'should I — and is it right?'",
      "This is the amānah framework in action. Every financial decision passes through the filter: 'Is this how a responsible custodian would manage this trust?'",
    ],
    comparisonTable: [
      { decision: "'Should I take this loan?'", owner: "'Can I afford the repayments?'", custodian: "'Is the loan structure itself permissible?'" },
      { decision: "'Where should I invest?'", owner: "'Which gives the highest return?'", custodian: "'Is this investment earned through legitimate activity?'" },
      { decision: "'Should I buy this?'", owner: "'Do I want it? Can I afford it?'", custodian: "'Is this purchase responsible? Is the product lawful?'" },
      { decision: "'Should I give charity?'", owner: "'Do I feel like it?'", custodian: "'What is my obligation? Am I fulfilling the rights others have on this wealth?'" },
    ],
  },
  {
    id: 'section-d',
    title: 'Amānah Is Not Restriction',
    content: [
      "Here's what amānah does NOT mean: that you can't enjoy your wealth. Being a custodian doesn't mean living in anxiety about every purchase. It means being thoughtful, not reckless.",
      'The Prophet ﷺ enjoyed good food, wore clean clothes, and appreciated beauty. He didn\'t live in self-imposed poverty. He lived **responsibly.** There\'s a difference.',
      "Think of it like this: if a friend asked you to manage their savings while they were away, you'd be careful. You wouldn't gamble it. You wouldn't waste it. But you also wouldn't refuse to use it for its intended purpose. You'd manage it well.",
      "That's amānah. Your wealth is that friend's savings. Except the friend is your Creator. And the 'intended purpose' includes taking care of yourself, your family, your community, and your future.",
    ],
    misconception: {
      text: "'Amānah means I shouldn't spend money on things I enjoy.' Wrong. Amānah means you SHOULD enjoy your wealth — but within boundaries. The opposite of amānah isn't enjoyment. It's wastefulness **(isrāf, إسراف)** and recklessness.",
    },
    keyTakeaway: {
      text: "Amānah changes everything. You're not an owner spending freely — you're a custodian managing a trust. Every financial decision passes through three checks: What is my role? (Custodian.) Is this permissible? And: will I be comfortable being asked about how I earned and spent this?",
    },
  },
];

const QUESTIONS = [
  // ── Q1: MCQ — L2 RECALL — THINK ───────────────────────────
  {
    id: 'q1', type: 'mcq', mode: 'THINK', level: '2/5', typeLabel: 'Multiple Choice',
    afterSection: 0,
    question: "Based on the passage above, what does the word amānah mean in the context of Islamic finance?",
    options: [
      { id: 'a', text: 'Charity — giving away your wealth to others', correct: false },
      { id: 'b', text: 'Trust — something placed in your care by its true Owner', correct: true },
      { id: 'c', text: 'Ownership — your right to do anything with your wealth', correct: false },
      { id: 'd', text: 'Savings — keeping your wealth safe for the future', correct: false },
    ],
    feedback: {
      a: "Charity (sadaqah) is important in Islam, but that's not what amānah means. Amānah is about the entire relationship with wealth — it's a trust, not just a giving obligation.",
      b: "Exactly. Amānah = trust. Not charity, not ownership, not savings. It's the idea that wealth has been placed in your care and you're responsible for how you use it. This single reframe changes every financial decision.",
      c: "That's actually the OPPOSITE of amānah. Amānah means you DON'T have absolute ownership. You're a custodian managing someone else's property on trust.",
      d: "Saving is wise, but amānah isn't about saving specifically. It's the foundational concept: all your wealth — saved, spent, invested — is a trust you're managing.",
    },
  },
  // ── Q2: RAPID-FIRE T/F — L2 RECALL — PLAY ─────────────────
  {
    id: 'q2', type: 'rapid-tf', mode: 'PLAY', level: '2/5', typeLabel: 'Rapid-Fire True / False',
    afterSection: 1,
    question: "Quick-fire: TRUE or FALSE? Answer before the timer runs out.",
    cards: [
      { text: "Amānah means you're a custodian, not an owner.", answer: true },
      { text: "The hadith mentions ONE question about wealth.", answer: false },
      { text: "A custodian can spend money however they want.", answer: false },
      { text: "Amānah only applies to rich people.", answer: false },
      { text: "You'll be asked about how you earned AND spent your wealth.", answer: true },
    ],
    summaryFeedback: {
      perfect: "Perfect run! Two questions about wealth. Custodian, not owner. Applies to everyone. You've got the amānah framework locked in.",
      good: "Almost! Key corrections: it's TWO questions (earned + spent), and custodian means RESPONSIBLE spending, not free spending. Amānah applies to everyone with any wealth at all.",
      low: "No worries — these are new concepts. The core: amānah = trust. You'll be asked TWO things about money (how earned, how spent). A custodian spends RESPONSIBLY, not freely. And this applies whether you have AED 100 or AED 10 million.",
    },
  },
  // ── Q3: BUCKET SORT — L2 RECALL — SORT ────────────────────
  {
    id: 'q3', type: 'bucket-sort', mode: 'SORT', level: '2/5', typeLabel: 'Sort into Buckets',
    afterSection: 2,
    question: "Sort these questions into 'Owner Mindset' or 'Custodian Mindset.'",
    buckets: [
      { id: 'owner', label: 'Owner Mindset', color: T.coral, bg: T.coralLight, icon: '💼' },
      { id: 'custodian', label: 'Custodian Mindset', color: T.green, bg: T.greenLight, icon: '🔑' },
    ],
    items: [
      { text: "'Can I afford this?'", correct: 'owner' },
      { text: "'Is this investment earned through legitimate activity?'", correct: 'custodian' },
      { text: "'Do I want it?'", correct: 'owner' },
      { text: "'Am I wasting what's been entrusted to me?'", correct: 'custodian' },
      { text: "'Which gives the highest return?'", correct: 'owner' },
      { text: "'What is my obligation?'", correct: 'custodian' },
    ],
    summaryFeedback: {
      perfect: "You can already tell the difference. Owner asks 'can I?' Custodian asks 'should I?' That's the amānah filter in action.",
      good: "Nearly there! The pattern: owner questions focus on ABILITY and DESIRE. Custodian questions focus on RESPONSIBILITY and PERMISSIBILITY.",
      low: "The key distinction: owner questions = 'what do I want?' Custodian questions = 'what is right?' Both people might end up buying the same thing — but the custodian checks whether it's appropriate first.",
    },
  },
  // ── Q4: FILL IN THE BLANK (DROPDOWN) — L2 RECALL — THINK ──
  {
    id: 'q4', type: 'fill-blank', mode: 'THINK', level: '2/5', typeLabel: 'Fill in the Blanks',
    afterSection: 2,
    question: "Complete the sentences by selecting the correct word from each dropdown:",
    sentences: [
      { parts: ['The Islamic concept of amānah means wealth is a ', ' placed in your care.'], blankIds: [0] },
      { parts: ["A person with the owner mindset asks 'Can I afford this?' A person with the custodian mindset asks 'Is this ", "?'"], blankIds: [1] },
      { parts: ['On the Day of Judgement, you will be asked about how you ', ' your wealth and how you ', ' it.'], blankIds: [2, 3] },
    ],
    blanks: [
      { id: 0, correct: 'trust', options: ['trust', 'gift', 'reward', 'right'] },
      { id: 1, correct: 'permissible', options: ['permissible', 'expensive', 'profitable', 'popular'] },
      { id: 2, correct: 'earned', options: ['earned', 'found', 'received', 'created'] },
      { id: 3, correct: 'spent', options: ['spent', 'kept', 'grew', 'displayed'] },
    ],
    feedback: {
      perfect: "Perfectly filled! Trust, permissible, earned, spent. You've captured the amānah framework in four words.",
      good: "Almost there! Each word captures a different part of the amānah principle: wealth is a TRUST, decisions must be PERMISSIBLE, and you're accountable for how you EARNED and SPENT it.",
      low: "The key words: trust (not gift or reward), permissible (the custodian's question), earned and spent (the two accountability questions from the hadith). These four words summarise the entire lesson.",
    },
  },
  // ── Q5: FLOWCHART COMPLETION — L2 RECALL — THINK ──────────
  {
    id: 'q5', type: 'flowchart', mode: 'THINK', level: '2/5', typeLabel: 'Flowchart Completion',
    afterSection: 3,
    question: "Complete the amānah decision flowchart by selecting the correct option for each node:",
    nodes: [
      { id: 1, text: 'I have money to spend.', blank: false },
      { id: 2, label: 'What is my role?', blank: true, options: ['Owner', 'Custodian', 'Investor'], correct: 'Custodian', blankIdx: 0 },
      { id: 3, label: 'What must I check?', blank: true, options: ['Is it profitable?', 'Is it permissible?', 'Is it popular?'], correct: 'Is it permissible?', blankIdx: 1 },
      { id: 4, label: 'What am I accountable for?', blank: true, options: ['How much I kept', 'How I earned and spent', 'How much I gave away'], correct: 'How I earned and spent', blankIdx: 2 },
      { id: 5, text: 'Proceed responsibly.', blank: false },
    ],
    feedback: {
      perfect: "Beautifully built! This flowchart is the amānah framework in action: recognise your role (custodian) → check permissibility → remember accountability. Every financial decision can run through this.",
      good: "Almost complete! The flowchart captures the whole amānah mindset. Check the step you missed — each one builds on the last.",
      low: "Good effort on a new concept! The flow is: I'm a CUSTODIAN (not owner) → I check if it's PERMISSIBLE (not just profitable) → I'm accountable for how I EARNED AND SPENT (not just how much I gave away).",
    },
  },
  // ── Q6: MCQ SCENARIO (CAPSTONE) — L3 APPLICATION — THINK ──
  {
    id: 'q6', type: 'mcq-scenario', mode: 'THINK', level: '3/5', typeLabel: 'Scenario — Level 3',
    afterSection: 3,
    isCapstone: true,
    scenario: "Your colleague tells you about an investment opportunity. 'It's guaranteed 15% returns. Everyone at the office is doing it. You just give them the money and they pay you back more every month.'",
    question: "Using the amānah mindset, what is the FIRST question you should ask?",
    options: [
      { id: 'a', text: "'How much money do I need to invest?'", correct: false },
      { id: 'b', text: "'How long until I get my returns?'", correct: false },
      { id: 'c', text: "'Is this investment structure permissible — what is the money actually doing?'", correct: true },
      { id: 'd', text: "'Are other people at the office making money from it?'", correct: false },
    ],
    feedback: {
      a: "That's the owner's question: 'how much does it cost me?' The custodian asks first: 'what is the money actually doing? Is the structure permissible?' Amount is important, but it's the SECOND question, not the first.",
      b: "Timeline is a practical question, but it's an owner-mindset question. The custodian's first instinct is: 'what is this money doing? Is the structure itself permissible?' Returns mean nothing if the mechanism isn't right.",
      c: "That's the custodian's first instinct: not 'how much can I make?' but 'what is this money actually doing?' A guaranteed fixed return on money lent out sounds a lot like ribā — you'll learn exactly what that means in Lesson 3. But you already have the instinct to ask the right question. That's amānah in action.",
      d: "Popularity doesn't determine permissibility. 'Everyone is doing it' is irrelevant to a custodian. The first question is always: 'what is the money actually doing?' Crowd behaviour is not a Shariah standard.",
    },
    bridgeForward: "Next: The Three Prohibitions — ribā, gharar, maysir. That 'guaranteed return' your colleague mentioned? You're about to learn exactly why it's a red flag.",
  },
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function DEANY_M1L2() {
  const [phase, setPhase] = useState('intro');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [showL3Toast, setShowL3Toast] = useState(false);
  const [results, setResults] = useState([]);
  const [flowIdx, setFlowIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confidence, setConfidence] = useState(3);

  // Build interleaved flow
  const flow = [];
  let qIdx = 0;
  SECTIONS.forEach((sec, sIdx) => {
    flow.push({ type: 'section', data: sec });
    while (qIdx < QUESTIONS.length && QUESTIONS[qIdx].afterSection === sIdx) {
      flow.push({ type: 'question', data: QUESTIONS[qIdx] });
      qIdx++;
    }
  });
  while (qIdx < QUESTIONS.length) {
    flow.push({ type: 'question', data: QUESTIONS[qIdx] });
    qIdx++;
  }

  const currentFlow = flow[flowIdx];
  const qNumber = flow.slice(0, flowIdx + 1).filter(f => f.type === 'question').length;
  const totalQ = QUESTIONS.length;

  const advanceFlow = () => {
    if (flowIdx < flow.length - 1) {
      setFlowIdx(i => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPhase('complete');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const recordAnswer = (correct, pts, isCapstone) => {
    if (correct) {
      setScore(s => s + pts);
      setStreak(s => {
        const n = s + 1;
        if (n >= 3) { setShowStreak(true); setTimeout(() => setShowStreak(false), 2000); }
        return n;
      });
      if (isCapstone) {
        setShowL3Toast(true);
        setTimeout(() => setShowL3Toast(false), 3500);
      }
    } else {
      setStreak(0);
    }
    setResults(r => [...r, { correct }]);
  };

  // ── Intro ────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)' }}>
        <IslamicPattern />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: `${T.gold}18`, color: T.gold }}>
              MODULE 1 • LESSON 2
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: T.navy, fontFamily: 'Georgia, serif' }}>
              Money as Amānah
            </h1>
            <p className="text-sm max-w-md mx-auto" style={{ color: T.grayMed }}>
              The single idea that changes every financial decision you'll ever make.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-6 mb-6">
            {/* Bridge from L1 */}
            <div className="p-4 rounded-xl mb-5 border" style={{ background: `${T.tealLight}60`, borderColor: `${T.teal}20` }}>
              <div className="text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: T.teal }}>
                📎 Continuing from Lesson 1.1
              </div>
              <p className="text-xs leading-relaxed" style={{ color: T.grayDark }}>
                The Prophet ﷺ was a merchant and Khadija رضي الله عنها was a businesswoman. We previewed a word: <strong>amānah</strong>. Now let's explore what it actually means — because this single idea changes everything.
              </p>
            </div>

            <div className="flex items-start gap-3 mb-5">
              <Mascot size="md" />
              <div className="bg-white/80 rounded-xl rounded-tl-sm p-3.5 border border-gray-100 flex-1">
                <p className="text-sm" style={{ color: T.grayDark }}>
                  <b style={{ color: T.teal }}>Fulus:</b> Welcome back! Today we go deeper. The amānah principle reshapes how Muslims approach every financial decision — from choosing a bank account to evaluating an investment. Let's build your framework! 🔑
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: <Clock className="w-4 h-4" />, label: '14 min', sub: 'Duration' },
                { icon: <Target className="w-4 h-4" />, label: '6 Qs', sub: 'Questions' },
                { icon: <BookOpen className="w-4 h-4" />, label: 'L2→L3', sub: 'Difficulty' },
              ].map((s, i) => (
                <div key={i} className="text-center p-3 rounded-xl border"
                  style={{ background: `${T.tealLight}50`, borderColor: `${T.teal}15` }}>
                  <div className="flex justify-center mb-1" style={{ color: T.teal }}>{s.icon}</div>
                  <div className="text-sm font-bold" style={{ color: T.navy }}>{s.label}</div>
                  <div className="text-[10px]" style={{ color: T.grayMed }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg mb-5" style={{ background: T.goldLight, border: `1px solid ${T.gold}30` }}>
              <div className="text-xs font-bold mb-1" style={{ color: T.gold }}>🎯 Learning Objective</div>
              <div className="text-xs leading-relaxed" style={{ color: T.grayDark }}>
                Explain the difference between the owner mindset and the custodian mindset, and apply the amānah framework to a simple financial decision.
              </div>
            </div>

            <button onClick={() => setPhase('content')}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.teal})`, color: 'white' }}>
              Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Complete ─────────────────────────────────────────────────
  if (phase === 'complete') {
    const total = QUESTIONS.length;
    const correct = results.filter(r => r.correct).length;
    const pct = Math.round((correct / total) * 100);
    const ringColor = pct >= 80 ? T.green : pct >= 60 ? T.gold : T.teal;
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)' }}>
        <IslamicPattern />
        {showConfetti && <Confetti />}
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: T.navy, fontFamily: 'Georgia, serif' }}>Lesson Complete!</h1>
            <p className="text-sm mb-3" style={{ color: T.grayMed }}>Money as Amānah</p>

            {/* L3 achievement badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{ background: `${T.gold}20`, color: T.gold, border: `1px solid ${T.gold}40` }}>
              <Award className="w-3.5 h-3.5" /> First Level 3 Question Unlocked! ⭐
            </div>

            {/* Score Ring */}
            <div className="relative inline-block mb-6">
              <svg width="96" height="96" className="transform -rotate-90">
                <circle cx="48" cy="48" r="36" fill="none" stroke={T.grayLight} strokeWidth="6" />
                <circle cx="48" cy="48" r="36" fill="none" stroke={ringColor} strokeWidth="6"
                  strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: T.navy, fontFamily: 'Georgia, serif' }}>{correct}/{total}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Score', value: `${score} pts`, color: T.green, bg: T.greenLight },
                { label: 'Accuracy', value: `${pct}%`, color: T.teal, bg: T.tealLight },
                { label: 'Level', value: 'L2→L3', color: T.purple, bg: `${T.purple}12` },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-xl border" style={{ background: s.bg, borderColor: `${s.color}20` }}>
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px]" style={{ color: T.grayMed }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Concepts mastered */}
            <div className="text-left p-4 rounded-xl mb-6" style={{ background: `${T.greenLight}60`, border: `1px solid ${T.green}20` }}>
              <div className="text-xs font-bold mb-2" style={{ color: T.green }}>✅ Concepts Mastered</div>
              {[
                'Amānah = wealth as trust',
                'Owner mindset vs custodian mindset',
                'Two accountability questions (earned + spent)',
                'Amānah ≠ restriction (custodian enjoys responsibly)',
                'Applied the amānah framework to a new scenario',
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: T.green }} />
                  <span className="text-xs" style={{ color: T.grayDark }}>{c}</span>
                </div>
              ))}
            </div>

            {/* Confidence Pulse */}
            <div className="p-4 rounded-xl mb-6" style={{ background: T.goldLight, border: `1px solid ${T.gold}25` }}>
              <div className="text-xs font-bold mb-3" style={{ color: T.gold }}>How confident do you feel about this topic?</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] w-16 text-right" style={{ color: T.grayMed }}>Still unsure</span>
                <div className="flex-1">
                  <input type="range" min="1" max="5" value={confidence} onChange={e => setConfidence(+e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: T.gold }} />
                </div>
                <span className="text-[10px] w-20" style={{ color: T.grayMed }}>Could explain it</span>
              </div>
              <div className="text-xs text-center" style={{ color: T.grayDark }}>
                {confidence <= 2 ? "Totally normal — amānah is a big shift in thinking. It'll settle." :
                  confidence === 3 ? "Good! The owner vs custodian distinction will keep clicking." :
                    "You're building real foundations. Ready for the next step."}
              </div>
            </div>

            {/* Next preview */}
            <div className="p-4 rounded-xl mb-5" style={{ background: `${T.teal}08`, border: `1px solid ${T.teal}18` }}>
              <div className="text-xs font-bold mb-1" style={{ color: T.teal }}>Up Next</div>
              <div className="text-sm font-semibold mb-1" style={{ color: T.navy }}>Lesson 1.3: The Three Prohibitions</div>
              <div className="text-xs" style={{ color: T.grayMed }}>Now that you think like a custodian, you'll learn the three things custodians must never do — ribā, gharar, and maysir.</div>
            </div>

            <button className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.orange})`, color: T.navy }}>
              Next Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5" />
            </button>
          </div>
        </div>
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }`}</style>
      </div>
    );
  }

  // ── Content Flow ─────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)' }}>
      <IslamicPattern />

      {showStreak && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg animate-bounce"
          style={{ background: `linear-gradient(135deg, ${T.orange}, ${T.coral})`, color: 'white' }}>
          <Flame className="w-4 h-4" /><span className="text-sm font-bold">{streak} Streak! 🔥</span>
        </div>
      )}

      {showL3Toast && (
        <div className="fixed top-4 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl animate-slideUp"
          style={{ background: T.navy, color: T.gold, border: `2px solid ${T.gold}40`, transform: 'translateX(-50%)' }}>
          <Award className="w-4 h-4" />
          <span className="text-sm font-bold">Nice work! That's your first Level 3 question.</span>
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: `${T.gold}15`, color: T.gold }}>🔑</div>
            <div>
              <div className="text-xs font-bold" style={{ color: T.navy }}>Lesson 1.2</div>
              <div className="text-[10px]" style={{ color: T.grayMed }}>Money as Amānah</div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: T.goldLight, color: T.gold }}>
            <Star className="w-3 h-3" fill={T.gold} /> {score}
          </div>
        </div>

        <ProgressBar current={qNumber} total={totalQ} score={score} />

        {currentFlow?.type === 'section' && (
          <SectionCard key={`s-${flowIdx}`} section={currentFlow.data} onContinue={advanceFlow} />
        )}
        {currentFlow?.type === 'question' && (
          <QuestionCard
            key={`q-${flowIdx}`}
            q={currentFlow.data}
            qNum={qNumber}
            totalQ={totalQ}
            onComplete={(correct, pts) => recordAnswer(correct, pts, currentFlow.data.isCapstone)}
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
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} style={{ color: T.navy }}>{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    );
  };

  return (
    <div className="animate-slideUp">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl overflow-hidden">
        <div className="px-6 py-4" style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.teal})` }}>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {section.title}
          </h2>
        </div>

        <div className="p-6">
          {section.content.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: T.grayDark }}>
              {renderMarkdown(para)}
            </p>
          ))}

          {/* Mindset callout boxes */}
          {section.mindsets && (
            <div className="space-y-3 mb-4">
              {section.mindsets.map((m, i) => (
                <div key={i} className="rounded-xl p-4 border-l-4" style={{ background: m.bg, borderColor: m.color }}>
                  <div className="text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: m.color }}>
                    <span>{m.icon}</span> {m.label}
                  </div>
                  <p className="text-sm italic leading-relaxed" style={{ color: T.grayDark, fontFamily: 'Georgia, serif' }}>
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Hadith reference */}
          {section.hadith && (
            <div className="rounded-xl p-4 mb-4 border-l-4" style={{ background: T.goldLight, borderColor: T.gold }}>
              <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: T.gold }}>
                📖 Hadith
              </div>
              <p className="text-sm italic mb-2 leading-relaxed" style={{ color: T.navy, fontFamily: 'Georgia, serif' }}>
                {section.hadith.text}
              </p>
              <p className="text-xs font-semibold" style={{ color: T.gold }}>— {section.hadith.ref}</p>
            </div>
          )}

          {/* Comparison table */}
          {section.comparisonTable && (
            <div className="rounded-xl overflow-hidden mb-4 border" style={{ borderColor: `${T.navy}15` }}>
              <div className="grid grid-cols-3 text-xs font-bold" style={{ background: T.navy, color: 'white' }}>
                <div className="p-2.5">Decision</div>
                <div className="p-2.5 border-l" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>Owner 💼</div>
                <div className="p-2.5 border-l" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>Custodian 🔑</div>
              </div>
              {section.comparisonTable.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 text-xs border-t`}
                  style={{ borderColor: `${T.navy}10`, background: i % 2 === 0 ? 'white' : `${T.tealLight}30` }}>
                  <div className="p-2.5 font-medium" style={{ color: T.navy }}>{row.decision}</div>
                  <div className="p-2.5 border-l italic" style={{ borderColor: `${T.coral}20`, color: T.coral }}>{row.owner}</div>
                  <div className="p-2.5 border-l italic" style={{ borderColor: `${T.green}20`, color: T.green }}>{row.custodian}</div>
                </div>
              ))}
            </div>
          )}

          {/* Misconception callout */}
          {section.misconception && (
            <div className="rounded-xl p-4 mb-4 border-l-4" style={{ background: T.coralLight, borderColor: T.coral }}>
              <div className="text-xs font-bold mb-1.5" style={{ color: T.coral }}>⚠️ Common Misconception</div>
              <p className="text-sm leading-relaxed" style={{ color: T.grayDark }}>
                {renderMarkdown(section.misconception.text)}
              </p>
            </div>
          )}

          {/* Key takeaway */}
          {section.keyTakeaway && (
            <div className="rounded-xl p-4 mb-4" style={{ background: T.goldLight, border: `1px solid ${T.gold}30` }}>
              <div className="text-xs font-bold mb-1.5" style={{ color: T.gold }}>🔑 Key Takeaway</div>
              <p className="text-sm leading-relaxed" style={{ color: T.grayDark }}>
                {renderMarkdown(section.keyTakeaway.text)}
              </p>
            </div>
          )}

          <button onClick={onContinue}
            className="w-full py-3 rounded-xl font-bold text-sm mt-2 transition-all hover:shadow-md active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.green})`, color: 'white' }}>
            Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUESTION CARD (router)
// ═══════════════════════════════════════════════════════════════
function QuestionCard({ q, qNum, totalQ, onComplete, onNext }) {
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
          <ModeBadge mode={q.mode} type={q.typeLabel} />

          {/* Scenario bubble */}
          {q.scenario && (
            <div className="rounded-xl p-4 mb-4 relative" style={{ background: T.grayLight, border: `1px solid ${T.grayMed}20` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: T.grayMed }}>Your colleague says:</div>
              <p className="text-sm italic leading-relaxed" style={{ color: T.grayDark, fontFamily: 'Georgia, serif' }}>
                {q.scenario}
              </p>
              <div className="absolute -bottom-2 left-6 w-4 h-4 rotate-45"
                style={{ background: T.grayLight, borderRight: `1px solid ${T.grayMed}20`, borderBottom: `1px solid ${T.grayMed}20` }} />
            </div>
          )}

          <h3 className="text-sm font-bold leading-relaxed mb-5" style={{ color: T.navy }}>
            {q.question}
          </h3>

          {(q.type === 'mcq' || q.type === 'mcq-scenario') && (
            <MCQRenderer q={q} answered={answered} onDone={markDone} />
          )}
          {q.type === 'rapid-tf' && (
            <RapidFireTFRenderer q={q} answered={answered} onDone={markDone} />
          )}
          {q.type === 'bucket-sort' && (
            <BucketSortRenderer q={q} answered={answered} onDone={markDone} />
          )}
          {q.type === 'fill-blank' && (
            <DropdownFillBlankRenderer q={q} answered={answered} onDone={markDone} />
          )}
          {q.type === 'flowchart' && (
            <FlowchartCompletionRenderer q={q} answered={answered} onDone={markDone} />
          )}

          {answered && feedbackText && (
            <FeedbackPanel correct={correct} text={feedbackText} bridgeForward={q.bridgeForward} />
          )}

          {canProceed && (
            <button onClick={onNext}
              className="w-full py-3 rounded-xl font-bold text-sm mt-4 transition-all hover:shadow-md active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.teal})`, color: 'white' }}>
              {qNum >= totalQ ? 'Finish Lesson' : 'Next'} <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MCQ RENDERER (same as L1)
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
            <button key={opt.id} onClick={() => { if (!submitted) setSelected(i); }} disabled={submitted}
              className={`relative p-4 rounded-xl text-left text-sm font-medium border-2 transition-all duration-200 ${shakeId === i ? 'animate-shake' : ''}`}
              style={{
                background: isCorrect ? T.greenLight : isWrong ? T.coralLight : isSel && !submitted ? T.navy : 'white',
                borderColor: isCorrect ? T.green : isWrong ? T.coral : isSel && !submitted ? T.navy : '#ddd',
                color: isSel && !submitted && !isCorrect ? 'white' : T.grayDark,
                opacity: submitted && !isSel && !opt.correct ? 0.5 : 1,
              }}>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: isCorrect ? T.green : isWrong ? T.coral : isSel && !submitted ? 'rgba(255,255,255,0.3)' : T.grayLight,
                    color: isCorrect || isWrong || (isSel && !submitted) ? 'white' : T.grayMed,
                  }}>
                  {isCorrect ? '✓' : isWrong ? '✗' : opt.id.toUpperCase()}
                </span>
                <span className="flex-1">{opt.text}</span>
              </div>
              {isCorrect && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center animate-springIn" style={{ background: T.green }}>
                  <CheckCircle className="w-4 h-4 text-white" />
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
            color: selected !== null ? T.navy : '#bbb',
          }}>
          Check Answer
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RAPID-FIRE TRUE/FALSE RENDERER (NEW — Q2)
// ═══════════════════════════════════════════════════════════════
function RapidFireTFRenderer({ q, onDone }) {
  const cards = q.cards;
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('active'); // active | feedback | summary
  const [timerPct, setTimerPct] = useState(100);
  const [feedback, setFeedback] = useState(null); // { correct, timeout }
  const [showSummary, setShowSummary] = useState(false);
  const [summaryResults, setSummaryResults] = useState([]);

  // Refs to avoid stale closures
  const lockedRef = useRef(false);
  const resultsRef = useRef([]);
  const idxRef = useRef(0);
  const doAnswerRef = useRef(null);

  useEffect(() => { idxRef.current = idx; }, [idx]);

  const doAnswer = (isTrue) => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    const currentIdx = idxRef.current;
    const card = cards[currentIdx];
    const isTimeout = isTrue === null;
    const isCorrect = !isTimeout && card.answer === isTrue;

    resultsRef.current = [...resultsRef.current, { card, correct: isCorrect, timeout: isTimeout }];
    setFeedback({ correct: isCorrect, timeout: isTimeout, cardText: card.text, answerText: card.answer ? 'TRUE' : 'FALSE' });
    setPhase('feedback');

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx >= cards.length) {
        const all = resultsRef.current;
        const correctCount = all.filter(r => r.correct).length;
        const total = cards.length;
        const fbText = correctCount === total ? q.summaryFeedback.perfect :
          correctCount >= 3 ? q.summaryFeedback.good : q.summaryFeedback.low;
        const pts = Math.round((correctCount / total) * 10);
        setSummaryResults([...all]);
        setShowSummary(true);
        onDone(correctCount >= 3, fbText, pts);
      } else {
        lockedRef.current = false;
        setFeedback(null);
        setTimerPct(100);
        setIdx(nextIdx);
        setPhase('active');
      }
    }, 1100);
  };

  // Keep ref current
  useEffect(() => { doAnswerRef.current = doAnswer; });

  // Timer
  useEffect(() => {
    if (phase !== 'active') return;
    let pct = 100;
    const interval = setInterval(() => {
      pct = Math.max(0, pct - (100 / 80));
      setTimerPct(pct);
      if (pct <= 0) {
        clearInterval(interval);
        doAnswerRef.current(null);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [idx, phase]);

  // Summary screen
  if (showSummary) {
    const correctCount = summaryResults.filter(r => r.correct).length;
    return (
      <div>
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">
            {correctCount === cards.length ? '🎉' : correctCount >= 3 ? '👍' : '💪'}
          </div>
          <div className="text-xl font-bold" style={{ color: T.navy }}>{correctCount}/{cards.length}</div>
          <div className="text-xs mt-0.5" style={{ color: T.grayMed }}>Correct</div>
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {summaryResults.map((r, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl text-xs"
              style={{ background: r.correct ? T.greenLight : T.coralLight, border: `1px solid ${r.correct ? T.green : T.coral}25` }}>
              {r.correct
                ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: T.green }} />
                : <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: T.coral }} />}
              <div>
                <div className="font-medium" style={{ color: T.grayDark }}>{r.card.text}</div>
                <div className="mt-0.5 font-bold" style={{ color: r.correct ? T.green : T.coral }}>
                  {r.timeout ? '⏰ Timed out' : r.correct ? `✓ Correct — ${r.card.answer ? 'TRUE' : 'FALSE'}` : `✗ Answer: ${r.card.answer ? 'TRUE' : 'FALSE'}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const card = cards[idx];
  const timerColor = timerPct > 50 ? T.gold : timerPct > 25 ? T.orange : T.coral;

  return (
    <div>
      {/* Timer bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: T.grayLight }}>
        <div className="h-full rounded-full" style={{ width: `${timerPct}%`, background: timerColor, transition: 'width 0.1s linear, background 0.3s' }} />
      </div>
      <div className="text-right text-[10px] mb-4 font-medium" style={{ color: T.grayMed }}>
        {Math.ceil((timerPct / 100) * 8)}s
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-4">
        {cards.map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full transition-all" style={{
            background: i < idx ? (resultsRef.current[i]?.correct ? T.green : T.coral) :
              i === idx ? T.navy : T.grayLight,
          }} />
        ))}
      </div>

      {/* Card */}
      <div className="relative rounded-2xl border-2 p-6 text-center mb-5 min-h-[100px] flex items-center justify-center transition-all"
        style={{
          background: phase === 'feedback' ? (feedback?.correct ? T.greenLight : T.coralLight) : 'white',
          borderColor: phase === 'feedback' ? (feedback?.correct ? T.green : T.coral) : `${T.navy}20`,
        }}>
        {phase === 'active' && card && (
          <p className="text-base font-semibold leading-snug" style={{ color: T.navy }}>{card.text}</p>
        )}
        {phase === 'feedback' && feedback && (
          <div className="animate-slideUp">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              {feedback.correct
                ? <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
                : <XCircle className="w-5 h-5" style={{ color: T.coral }} />}
              <span className="text-sm font-bold" style={{ color: feedback.correct ? T.green : T.coral }}>
                {feedback.timeout ? "⏰ Time's up!" : feedback.correct ? 'Correct!' : 'Not quite!'}
              </span>
            </div>
            <p className="text-xs" style={{ color: T.grayMed }}>{feedback.cardText}</p>
            <p className="text-xs font-bold mt-1" style={{ color: feedback.correct ? T.green : T.coral }}>
              Answer: {feedback.answerText}
            </p>
          </div>
        )}
      </div>

      {/* TRUE / FALSE buttons */}
      {phase === 'active' && (
        <div className="flex gap-3">
          <button onClick={() => doAnswer(false)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base border-2 transition-all hover:shadow-md active:scale-95"
            style={{ borderColor: T.coral, color: T.coral, background: T.coralLight }}>
            <XCircle className="w-5 h-5" /> FALSE
          </button>
          <button onClick={() => doAnswer(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base border-2 transition-all hover:shadow-md active:scale-95"
            style={{ borderColor: T.green, color: T.green, background: T.greenLight }}>
            <CheckCircle className="w-5 h-5" /> TRUE
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BUCKET SORT RENDERER (same as L1, adapted)
// ═══════════════════════════════════════════════════════════════
function BucketSortRenderer({ q, onDone }) {
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
    setPool(p => p.filter(x => x.text !== itm.text));
    const nb = { ...bucketItems };
    q.buckets.forEach(bk => { nb[bk.id] = nb[bk.id].filter(x => x.text !== itm.text); });
    nb[bucketId] = [...(nb[bucketId] || []), itm];
    setBucketItems(nb);
    setHeldItem(null);
    setDragOverBucket(null);
  };

  const returnToPool = (item, bucketId) => {
    if (submitted) return;
    const nb = { ...bucketItems };
    nb[bucketId] = nb[bucketId].filter(x => x.text !== item.text);
    setBucketItems(nb);
    setPool(p => [...p, item]);
  };

  const submit = () => {
    if (!allPlaced || submitted) return;
    setSubmitted(true);
    const res = {};
    let correctCount = 0;
    q.buckets.forEach(bk => {
      bucketItems[bk.id].forEach(item => {
        const ok = item.correct === bk.id;
        res[item.text] = ok;
        if (ok) correctCount++;
      });
    });
    setItemResults(res);
    const fb = correctCount === totalItems ? q.summaryFeedback.perfect :
      correctCount >= 4 ? q.summaryFeedback.good : q.summaryFeedback.low;
    const pts = correctCount === totalItems ? 10 : correctCount >= 4 ? 5 : 0;
    onDone(correctCount >= 4, fb, pts);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.buckets.map(bk => (
          <div key={bk.id}
            onDragOver={e => { e.preventDefault(); setDragOverBucket(bk.id); }}
            onDragLeave={() => setDragOverBucket(null)}
            onDrop={e => { e.preventDefault(); if (heldItem) dropIntoBucket(heldItem, bk.id); setDragOverBucket(null); }}
            onClick={() => { if (heldItem) dropIntoBucket(heldItem, bk.id); }}
            className="rounded-xl p-3 min-h-[150px] transition-all border-2"
            style={{
              background: bk.bg, borderColor: dragOverBucket === bk.id ? T.gold : bk.color,
              borderStyle: dragOverBucket === bk.id ? 'solid' : (bucketItems[bk.id].length ? 'solid' : 'dashed'),
              transform: dragOverBucket === bk.id ? 'scale(1.02)' : 'scale(1)',
            }}>
            <div className="text-xs font-bold text-center mb-2 flex items-center justify-center gap-1" style={{ color: bk.color }}>
              <span>{bk.icon}</span> {bk.label}
            </div>
            <div className="space-y-1.5">
              {bucketItems[bk.id].map(item => (
                <div key={item.text} onClick={() => !submitted && returnToPool(item, bk.id)}
                  className={`p-2.5 rounded-lg text-xs font-medium border transition-all ${!submitted ? 'cursor-pointer hover:opacity-70' : ''} ${submitted && itemResults[item.text] === false ? 'animate-shake' : ''}`}
                  style={{
                    background: submitted ? (itemResults[item.text] ? T.greenLight : T.coralLight) : 'white',
                    borderColor: submitted ? (itemResults[item.text] ? T.green : T.coral) : '#ddd',
                    color: T.grayDark,
                  }}>
                  <div className="flex items-center gap-1.5">
                    {submitted && itemResults[item.text] && <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: T.green }} />}
                    {submitted && !itemResults[item.text] && <XCircle className="w-3 h-3 flex-shrink-0" style={{ color: T.coral }} />}
                    <span className="flex-1">{item.text}</span>
                    {!submitted && <span className="text-[9px] opacity-40">✕</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pool.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: T.grayMed }}>
            <GripVertical className="w-3 h-3" /> Drag or tap to select, then tap a bucket
          </div>
          <div className="space-y-2">
            {pool.map(item => (
              <div key={item.text} draggable
                onDragStart={e => { setHeldItem(item); e.dataTransfer.setData('text/plain', item.text); }}
                onClick={() => { if (heldItem?.text === item.text) setHeldItem(null); else setHeldItem(item); }}
                className="p-3 rounded-xl border-2 text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-md"
                style={{
                  background: 'white', color: T.navy,
                  borderColor: heldItem?.text === item.text ? T.gold : '#ddd',
                  boxShadow: heldItem?.text === item.text ? `0 0 0 3px ${T.gold}30` : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 flex-shrink-0" style={{ color: T.grayMed }} />
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
          style={{ background: allPlaced ? `linear-gradient(135deg, ${T.gold}, ${T.orange})` : T.grayLight, color: allPlaced ? T.navy : '#bbb' }}>
          Check Answer ({placedCount}/{totalItems} placed)
        </button>
      )}

      {submitted && Object.values(itemResults).some(v => !v) && (
        <div className="mt-3 p-3 rounded-xl" style={{ background: `${T.tealLight}50`, border: `1px solid ${T.teal}20` }}>
          <div className="text-[10px] font-bold mb-1.5" style={{ color: T.teal }}>Correct placement:</div>
          {q.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 py-0.5 text-xs" style={{ color: T.grayDark }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: q.buckets.find(b => b.id === item.correct)?.color }} />
              <span className="font-medium">{item.text}</span>
              <span style={{ color: T.grayMed }}>→ {q.buckets.find(b => b.id === item.correct)?.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DROPDOWN FILL-IN-THE-BLANK RENDERER (NEW — Q4)
// ═══════════════════════════════════════════════════════════════
function DropdownFillBlankRenderer({ q, onDone }) {
  const [selected, setSelected] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});

  const allFilled = q.blanks.every(b => selected[b.id] !== undefined);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const submit = () => {
    if (!allFilled || submitted) return;
    setSubmitted(true);
    const res = {};
    q.blanks.forEach(b => { res[b.id] = selected[b.id] === b.correct; });
    setResults(res);
    const correctCount = Object.values(res).filter(Boolean).length;
    const total = q.blanks.length;
    const fbText = correctCount === total ? q.feedback.perfect :
      correctCount >= 3 ? q.feedback.good : q.feedback.low;
    const pts = Math.round((correctCount / total) * 10);
    onDone(correctCount === total, fbText, pts);
  };

  const renderBlank = (blankId) => {
    const blank = q.blanks.find(b => b.id === blankId);
    const value = selected[blankId];
    const isCorrect = submitted ? results[blankId] : null;
    const isOpen = openDropdown === blankId;

    return (
      <span key={blankId} className="relative inline-block align-middle mx-0.5 my-0.5">
        <button
          onClick={e => { e.stopPropagation(); if (!submitted) setOpenDropdown(isOpen ? null : blankId); }}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold transition-all border-2 ${submitted && isCorrect === false ? 'animate-shake' : ''} ${!submitted && !value ? 'animate-pulse-gentle' : ''}`}
          style={{
            borderStyle: value ? 'solid' : 'dashed',
            borderColor: submitted && isCorrect ? T.green : submitted && isCorrect === false ? T.coral : value ? T.gold : `${T.teal}80`,
            background: submitted && isCorrect ? T.greenLight : submitted && isCorrect === false ? T.coralLight : value ? T.goldLight : 'white',
            color: submitted && isCorrect ? T.green : submitted && isCorrect === false ? T.coral : value ? T.navy : T.grayMed,
            minWidth: '88px',
          }}>
          {value
            ? <span className="flex items-center gap-1">
              {value}
              {submitted && isCorrect && <CheckCircle className="w-3 h-3 animate-springIn" style={{ color: T.green }} />}
              {submitted && isCorrect === false && <XCircle className="w-3 h-3" style={{ color: T.coral }} />}
            </span>
            : <span className="flex items-center gap-1 text-xs opacity-60">select <ChevronDown className="w-3 h-3" /></span>
          }
          {!submitted && value && <ChevronDown className="w-3 h-3 opacity-40" />}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 rounded-xl shadow-xl border overflow-hidden z-50"
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderColor: '#e5e7eb', minWidth: '140px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
            {blank.options.map((opt, i) => (
              <button key={opt}
                onClick={e => { e.stopPropagation(); setSelected(s => ({ ...s, [blankId]: opt })); setOpenDropdown(null); }}
                className="w-full text-left px-4 py-3 text-sm transition-colors border-b last:border-0"
                style={{
                  borderColor: '#f3f4f6', color: opt === value ? T.teal : T.grayDark,
                  fontWeight: opt === value ? '700' : '400',
                  background: opt === value ? `${T.tealLight}60` : 'white',
                }}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </span>
    );
  };

  return (
    <div>
      <div className="rounded-xl p-5 mb-5 border space-y-4"
        style={{ background: `linear-gradient(135deg, ${T.tealLight}30, ${T.goldLight}20)`, borderColor: `${T.teal}20` }}>
        {q.sentences.map((sentence, si) => (
          <p key={si} className="text-sm leading-loose" style={{ color: T.grayDark }}>
            {sentence.parts.map((part, pi) => (
              <React.Fragment key={pi}>
                <span>{part}</span>
                {pi < sentence.parts.length - 1 && renderBlank(sentence.blankIds[pi])}
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>

      {/* Correct answers on partial failure */}
      {submitted && Object.values(results).some(v => !v) && (
        <div className="p-3 rounded-xl mb-4" style={{ background: `${T.tealLight}50`, border: `1px solid ${T.teal}20` }}>
          <div className="text-[10px] font-bold mb-1.5" style={{ color: T.teal }}>Correct answers:</div>
          <div className="flex flex-wrap gap-2">
            {q.blanks.map(b => !results[b.id] && (
              <span key={b.id} className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: T.greenLight, color: T.green, border: `1px solid ${T.green}30` }}>
                {b.correct}
              </span>
            ))}
          </div>
        </div>
      )}

      {!submitted && (
        <button onClick={submit} disabled={!allFilled}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${allFilled ? 'hover:shadow-md' : 'cursor-not-allowed'}`}
          style={{ background: allFilled ? `linear-gradient(135deg, ${T.gold}, ${T.orange})` : T.grayLight, color: allFilled ? T.navy : '#bbb' }}>
          Check Answers
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FLOWCHART COMPLETION RENDERER (NEW — Q5)
// ═══════════════════════════════════════════════════════════════
function FlowchartCompletionRenderer({ q, onDone }) {
  const [selected, setSelected] = useState({}); // blankIdx -> value
  const [openDropdown, setOpenDropdown] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [nodeResults, setNodeResults] = useState({});

  const blankNodes = q.nodes.filter(n => n.blank);
  const allFilled = blankNodes.every(n => selected[n.blankIdx] !== undefined);

  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const submit = () => {
    if (!allFilled || submitted) return;
    setSubmitted(true);
    const res = {};
    blankNodes.forEach(n => { res[n.blankIdx] = selected[n.blankIdx] === n.correct; });
    setNodeResults(res);
    const correctCount = Object.values(res).filter(Boolean).length;
    const total = blankNodes.length;
    const fbText = correctCount === total ? q.feedback.perfect :
      correctCount >= 2 ? q.feedback.good : q.feedback.low;
    const pts = Math.round((correctCount / total) * 10);
    onDone(correctCount === total, fbText, pts);
  };

  return (
    <div>
      <div className="space-y-1 mb-5">
        {q.nodes.map((node, nodeIdx) => {
          const isBlank = node.blank;
          const value = isBlank ? selected[node.blankIdx] : null;
          const isFilled = value !== undefined && value !== null;
          const isCorrect = submitted && isBlank ? nodeResults[node.blankIdx] : null;
          const isOpen = openDropdown === node.blankIdx;

          return (
            <div key={node.id}>
              {/* Node */}
              <div className={`rounded-xl border-2 p-4 text-center transition-all ${submitted && isBlank && isCorrect === false ? 'animate-shake' : ''} ${!submitted && isBlank && !isFilled ? 'animate-pulse-gentle' : ''}`}
                style={{
                  borderStyle: isBlank && !isFilled && !submitted ? 'dashed' : 'solid',
                  borderColor: submitted && isCorrect ? T.green :
                    submitted && isCorrect === false ? T.coral :
                    isBlank && isFilled ? T.gold :
                    isBlank ? `${T.gold}60` : `${T.navy}25`,
                  background: submitted && isCorrect ? T.greenLight :
                    submitted && isCorrect === false ? T.coralLight :
                    isBlank && isFilled ? `${T.goldLight}80` :
                    isBlank ? 'white' : `${T.navy}05`,
                }}>

                {/* Fixed node */}
                {!isBlank && (
                  <p className="text-sm font-semibold" style={{ color: T.navy }}>{node.text}</p>
                )}

                {/* Blank node */}
                {isBlank && (
                  <div>
                    <div className="text-[10px] font-bold mb-2" style={{ color: T.grayMed }}>{node.label}</div>
                    <div className="relative inline-block">
                      <button
                        onClick={e => { e.stopPropagation(); if (!submitted) setOpenDropdown(isOpen ? null : node.blankIdx); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all border"
                        style={{
                          background: isFilled ? `${T.gold}15` : `${T.tealLight}50`,
                          borderColor: isFilled ? T.gold : `${T.teal}40`,
                          color: submitted && isCorrect ? T.green : submitted && isCorrect === false ? T.coral : isFilled ? T.navy : T.grayMed,
                        }}>
                        {isFilled ? value : <span className="flex items-center gap-1 text-xs">Tap to select <ChevronDown className="w-3 h-3" /></span>}
                        {!submitted && isFilled && <ChevronDown className="w-3.5 h-3.5 opacity-40" />}
                        {submitted && isCorrect && <CheckCircle className="w-4 h-4 animate-springIn" style={{ color: T.green }} />}
                        {submitted && isCorrect === false && <XCircle className="w-4 h-4" style={{ color: T.coral }} />}
                      </button>

                      {isOpen && (
                        <div className="absolute top-full left-1/2 mt-2 rounded-xl shadow-xl border overflow-hidden z-50"
                          onClick={e => e.stopPropagation()}
                          style={{ background: 'white', borderColor: '#e5e7eb', minWidth: '200px', transform: 'translateX(-50%)', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                          {node.options.map(opt => (
                            <button key={opt}
                              onClick={e => { e.stopPropagation(); setSelected(s => ({ ...s, [node.blankIdx]: opt })); setOpenDropdown(null); }}
                              className="w-full text-left px-4 py-3.5 text-sm transition-colors border-b last:border-0"
                              style={{
                                borderColor: '#f3f4f6', color: opt === value ? T.teal : T.grayDark,
                                fontWeight: opt === value ? '700' : '400',
                                background: opt === value ? `${T.tealLight}60` : 'white',
                              }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {submitted && isCorrect === false && (
                      <div className="mt-2 text-xs font-bold animate-slideUp" style={{ color: T.green }}>
                        ✓ {node.correct}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow between nodes */}
              {nodeIdx < q.nodes.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <line x1="14" y1="3" x2="14" y2="19" stroke={T.gold} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M7 14l7 9 7-9" fill="none" stroke={T.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button onClick={submit} disabled={!allFilled}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${allFilled ? 'hover:shadow-md' : 'cursor-not-allowed'}`}
          style={{ background: allFilled ? `linear-gradient(135deg, ${T.gold}, ${T.orange})` : T.grayLight, color: allFilled ? T.navy : '#bbb' }}>
          Check Flowchart ({Object.keys(selected).length}/{blankNodes.length} filled)
        </button>
      )}
    </div>
  );
}
