// RibaLessonV5.jsx
// Deany - Islamic Finance - Core lesson on Riba.
// V5 is a single narrative arc. The cousin's "thank-you" is the thread pulled through the lesson:
//   1 Hook        - a cousin asks for a loan and offers £100 extra; answer first (halal / haram / not sure)
//   2 Sources     - Qur'an (incl. 3:130), hadith, definition, and the trade-versus-riba distinction
//   3 Models      - loan interest with a compounding curve, and the same-item exchange
//   4 Rapid fire  - one-card recognition, incl. the immediacy trap and the voluntary-vs-stipulated mirror
//   5 Calculate   - one escalating story: the increase compounds, year by year
//   6 Return      - close the cousin loop, then scale the same structure up to a credit card
//   7 In your life - sale vs loan discriminator, then real products (mortgage, BNPL, savings)
//   8 Alternatives -  halal structures, objectively framed
//   9 Review      - a results dashboard with concept breakdown and next review
//
// The opening devotional line is removed; the lesson leads with curiosity.
// Faith integrity preserved: no Qur'an/hadith text is generated; arabicText and audioUrl
// slots are empty for verified injection; scholarly humility and routing to a scholar remain.
//
// Usage:
//   <RibaLessonV5
//     onComplete={({ score, xpEarned, nextReviewDate, weakItems, schedule }) => ...}
//     onExit={() => ...}
//     initialState={{ beat, answers }}            // optional, to resume
//     onProgress={({ beat, answers }) => ...}     // optional, fires after each beat
//     streak={3}                                  // optional, days of consistent learning
//     pathContext={{ position: 4, total: 9, next: "Gharar" }} // optional
//     confidenceMode={false}                      // optional, default off
//   />
//   - Add "use client" at the top for the Next.js App Router.
//   - Needs React + lucide-react. Renders standalone.

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft, ArrowRight, Check, X, BookOpen, Sparkles, Scale, Moon, Star, ChevronDown,
  AlertTriangle, Landmark, HeartHandshake, RotateCcw, SlidersHorizontal, Zap,
  Play, Pause, Calculator, CreditCard, Wifi, Lock, Clock, TrendingUp, Home, PiggyBank,
} from "lucide-react";

/* ================================================================ tokens */
const C = {
  cream: "#F8F4ED", creamHi: "#FCF8F1", white: "#FFFFFF",
  gold: "#C9A961", goldDark: "#8A6F2F", goldSoft: "rgba(201,169,97,0.14)",
  sage: "#6B8E7F", sageDark: "#4A6358", sageSoft: "rgba(107,142,127,0.13)",
  emerald: "#1B4332", emeraldDark: "#0F2E22",
  terra: "#B8694D", terraDark: "#8A4A36", terraSoft: "rgba(184,105,77,0.12)",
  text: "#2A2520", muted: "#6B6356", border: "rgba(201,169,97,0.25)",
};
const SERIF = "'Cormorant Garamond','Fraunces',Georgia,'Times New Roman',serif";
const SANS = "'Inter',system-ui,-apple-system,Segoe UI,sans-serif";
const ARABIC = "'Amiri','Noto Naskh Arabic',serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace";
const SPRING = "cubic-bezier(.2,.8,.2,1.05)";

const STYLE = `
  @keyframes dUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes dPop { 0%{opacity:0;transform:scale(.92)} 70%{transform:scale(1.02)} 100%{opacity:1;transform:scale(1)} }
  @keyframes draw { to{ stroke-dashoffset:0 } }
  @keyframes swL { to{ transform:translateX(-130%) rotate(-11deg); opacity:0 } }
  @keyframes swR { to{ transform:translateX(130%) rotate(11deg); opacity:0 } }
  @keyframes glow { 0%{opacity:0;transform:scale(.5) rotate(-25deg)} 100%{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes ring { 0%{transform:scale(.6);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
  @keyframes softPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes cardIn { from{opacity:0;transform:translateY(18px) rotateX(9deg)} to{opacity:1;transform:translateY(0) rotateX(0)} }
  @keyframes flowDot { 0%{offset-distance:0%;opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{offset-distance:100%;opacity:0} }
  @keyframes grow { from{ transform:scaleY(0) } to{ transform:scaleY(1) } }
  @keyframes bubbleIn { from{opacity:0;transform:translateY(8px) scale(.96)} to{opacity:1;transform:none} }
  .reveal{ opacity:0; transform:translateY(14px) }
  .reveal.in{ opacity:1; transform:none; transition:opacity .6s ${SPRING}, transform .6s ${SPRING} }
  .reveal.in .flow{ animation:draw 1s ease .2s forwards }
  .flow{ stroke-dasharray:300; stroke-dashoffset:300 }
  .spring{ transition: all .55s ${SPRING} }
  .deany-btn{ -webkit-tap-highlight-color:transparent }
  .deany-btn:focus-visible{ outline:2px solid ${C.goldDark}; outline-offset:2px }
  .card-enter{ animation:dPop .36s ${SPRING} both }
  @keyframes dqShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(3px)} }
  .dq-shk{ animation:dqShake .34s ease-in-out }
  @keyframes dqStar { 0%{transform:scale(0) rotate(0deg);opacity:0} 35%{transform:scale(1.25) rotate(20deg);opacity:1} 100%{transform:scale(.6) rotate(45deg);opacity:0} }
  .deany-btn{ touch-action:manipulation; user-select:none; -webkit-user-select:none }
  .dq-press:active{ transform:scale(.97) translateY(1px) }
  .swl{ animation:swL .32s ease-in both } .swr{ animation:swR .32s ease-in both }
  .pulsing{ animation:softPulse 1.4s ease-in-out infinite }
  .ccard{ animation:cardIn .7s ${SPRING} both }
  .bargrow{ transform-origin:bottom; animation:grow .55s ${SPRING} both }
  .bubble{ animation:bubbleIn .45s ${SPRING} both }
  input[type=range]{ -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:999px;
    background:rgba(201,169,97,.28); accent-color:${C.gold}; outline:none; cursor:pointer }
  input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:24px; height:24px; border-radius:999px;
    background:${C.emerald}; border:3px solid #fff; box-shadow:0 2px 7px rgba(42,37,32,.22); cursor:pointer; transition:transform .15s ease }
  input[type=range]::-webkit-slider-thumb:active{ transform:scale(1.12) }
  input[type=range]::-moz-range-thumb{ width:24px; height:24px; border-radius:999px; background:${C.emerald}; border:3px solid #fff; cursor:pointer }
  input[type=range]:focus-visible{ outline:2px solid ${C.goldDark}; outline-offset:4px }
  .num-input{ font-family:${MONO}; }
  .num-input:focus{ outline:none; border-color:${C.gold} !important; box-shadow:0 0 0 3px ${C.goldSoft} }
  @media (prefers-reduced-motion: reduce){
    *{ animation:none !important; transition:none !important }
    .reveal{ opacity:1 !important; transform:none !important }
    .flow{ stroke-dashoffset:0 !important }
    .pulsing,.ccard{ animation:none !important }
    .bargrow,.bubble{ animation:none !important; transform:none !important }
  }
`;

const buzz = (ms = 9) => { try { if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };
function rgba(hex, a) { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgba(${r},${g},${b},${a})`; }
const gbp = (n) => `£${Math.abs(Math.round(n)).toLocaleString()}`;

/* ================================================== interaction engine
   Combined question UI spec, mapped onto this lesson's palette:
   selection = gold (finance identity), correct = sage ramp,
   wrong = terra ramp. buzz() is the haptic utility (Android only;
   iOS Safari/PWA has no web vibration API - Capacitor later). */
const MT = { press:120, selectColor:120, correctFlashHold:300, wrongShake:340,
  fadeToDone:250, sheetSlide:300, progressSpring:400, matchSeal:550,
  tileFlight:250, correctRevealDelay:380 };
const EDGE = "rgba(201,169,97,0.42)";
const EDGE_GOLD = C.goldDark, EDGE_SAGE = C.sageDark, EDGE_TERRA = C.terraDark, EDGE_EMERALD = C.emeraldDark;

let _sndCtx = null; let _lastTone = 0;
function _audio(){
  if (typeof window === "undefined") return null;
  if (!_sndCtx){ try { _sndCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ _sndCtx = null; } }
  if (_sndCtx && _sndCtx.state === "suspended") _sndCtx.resume();
  return _sndCtx;
}
function _tone(f, d, g, t){
  const c = _audio(); if (!c) return;
  const now = Date.now(); if (now - _lastTone < 30) return; _lastTone = now;
  const o = c.createOscillator(), gn = c.createGain();
  o.type = t || "sine"; o.frequency.value = f;
  gn.gain.setValueAtTime(g, c.currentTime);
  gn.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d);
  o.connect(gn); gn.connect(c.destination);
  o.start(); o.stop(c.currentTime + d + 0.02);
}
const snd = {
  tick: () => _tone(1800, 0.03, 0.05),
  pop:  () => _tone(1100, 0.05, 0.05),
  blip: () => { _tone(880, 0.07, 0.06); setTimeout(() => _tone(1320, 0.09, 0.06), 70); },
  buzz: () => _tone(150, 0.09, 0.05, "square"),
  fanfare: () => [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => _tone(f, 0.12, 0.05), i * 90)),
};
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function StarSeal({ x, y }){
  if (reducedMotion()) return null;
  return (
    <div style={{ position:"absolute", left:x-15, top:y-15, width:30, height:30, pointerEvents:"none", zIndex:6, animation:`dqStar ${MT.matchSeal}ms ease-out both` }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <path d="M15 2 L18 12 L28 15 L18 18 L15 28 L12 18 L2 15 L12 12 Z" fill={C.gold}/>
      </svg>
    </div>
  );
}
function useStars(){
  const [stars, setStars] = useState([]);
  const spawn = (x, y) => {
    const id = Math.random().toString(36).slice(2);
    setStars(s => [...s, { id, x, y }]);
    setTimeout(() => setStars(s => s.filter(st => st.id !== id)), MT.matchSeal + 80);
  };
  return [stars, spawn];
}

function chunky(state, extra){
  const base = {
    background: C.white, border: `2px solid ${C.border}`, borderBottomWidth: 4,
    borderBottomColor: EDGE, borderRadius: 14, color: C.text, cursor: "pointer",
    userSelect: "none", WebkitUserSelect: "none", touchAction: "manipulation",
    transition: `background ${MT.selectColor}ms, border-color ${MT.selectColor}ms, color ${MT.selectColor}ms, opacity ${MT.fadeToDone}ms, transform ${MT.press}ms`,
  };
  const states = {
    idle: {},
    sel:  { background: C.goldSoft, borderColor: C.gold, borderBottomColor: EDGE_GOLD, color: C.goldDark },
    good: { background: C.sageSoft, borderColor: C.sage, borderBottomColor: EDGE_SAGE, color: C.sageDark, transform: "scale(1.03)" },
    bad:  { background: C.terraSoft, borderColor: C.terra, borderBottomColor: EDGE_TERRA, color: C.terraDark },
    done: { opacity: 0.4, borderColor: "rgba(201,169,97,0.15)", borderBottomColor: "rgba(201,169,97,0.15)", color: C.muted, pointerEvents: "none" },
    dim:  { opacity: 0.45, pointerEvents: "none" },
  };
  return { ...base, ...(states[state] || {}), ...(extra || {}) };
}

/* ================================================================ content */
const lesson = {
  id: "riba", path: "Islamic Finance", title: "Riba", tier: "core", xp: 60, reviewIntervalDays: 3,
  hook: {
    thread: [
      { from: "cousin", text: "Assalamu alaikum. Can you lend me £1,000 to cover rent this month?" },
      { from: "you", text: "Of course. When can you pay it back?" },
      { from: "cousin", text: "Next month. And I will give you £1,100, a little extra to say thank you." },
    ],
    prompt: "You agree. Is this halal, haram, or not sure?",
    options: [{ k: "halal", t: "Halal" }, { k: "haram", t: "Haram" }, { k: "unsure", t: "Not sure" }],
    note: "Hold that answer. We will come back to it at the end.",
    learnTitle: "By the end you will know",
    learn: [
      "What riba means",
      "Where it appears in everyday life and modern finance",
      "How to spot it quickly",
      "What Islamic alternatives exist",
    ],
  },
  sources: [
    { ref: "Qur'an · al-Baqarah 2:275", arabicText: "", transliteration: "", audioUrl: "", meaning: "Allah has permitted trade and forbidden riba.", tafsir: "", tafsirSource: "", tag: "Consensus" },
    { ref: "Qur'an · al-Baqarah 2:279", arabicText: "", transliteration: "", audioUrl: "", meaning: "If they repent, they keep their principal, neither wronging nor being wronged.", tafsir: "", tafsirSource: "", tag: "Consensus" },
    { ref: "Qur'an · Aal Imran 3:130", arabicText: "", transliteration: "", audioUrl: "", meaning: "Do not consume riba, doubled and multiplied, and be mindful of Allah so that you may succeed.", tafsir: "", tafsirSource: "", tag: "Consensus" },
    { ref: "Hadith · Sahih Muslim", arabicText: "", transliteration: "", audioUrl: "", meaning: "The Prophet, peace be upon him, cursed the one who consumes riba, the one who pays it, the one who records it, and its two witnesses, and said they are equal in sin.", tafsir: "", tafsirSource: "", grading: "Sahih (Muslim)" },
  ],
  definition: "Riba is a prohibited increase in certain financial exchanges. In this lesson, focus on two beginner cases: a fixed increase required on a loan, and an exchange of the same item that is unequal or delayed.",
  glossary: [
    { term: "Riba al-nasi'ah", def: "A fixed increase required on a loan in exchange for time. Your cousin's £100, or a credit card's interest." },
    { term: "Riba al-fadl", def: "An unequal or delayed exchange of the same item. Ten grams of gold for eleven, or for ten delivered next month." },
  ],
  distinction: [
    { k: "trade", label: "Trade", body: "Ownership and risk. A real exchange of goods, where profit is earned and loss is possible.", tone: C.sage, toneDark: C.sageDark, soft: C.sageSoft },
    { k: "riba", label: "Riba", body: "A guaranteed increase attached to debt. No risk is shared. The increase is owed whatever happens.", tone: C.terra, toneDark: C.terraDark, soft: C.terraSoft },
  ],
  commodities: ["Gold", "Silver", "Wheat", "Barley", "Dates", "Salt"],
  rapidfire: [
    { id: "rf1", text: "Loan £1,000, repay £1,100", answer: "riba", concept: "loan", right: "Correct. A fixed increase on a loan.", wrong: "This is riba. The £100 is a fixed increase on the loan." },
    { id: "rf2", text: "Buy a phone for £500, sell it for £600", answer: "not", concept: "trade", right: "Correct. Trade, because ownership and risk exist.", wrong: "This is trade. You owned a real item and took its risk." },
    { id: "rf3", text: "Savings account pays a fixed 4%", answer: "riba", concept: "loan", right: "Correct. A fixed increase on money lent to the bank.", wrong: "This is riba. A fixed increase on a deposit is a stipulated increase." },
    { id: "rf4", text: "Business partnership shares profit and loss", answer: "not", concept: "trade", right: "Correct. Risk is shared, with no guaranteed increase.", wrong: "This is permitted. Profit and loss are shared." },
    { id: "rf5", text: "You agree to swap 10g of gold today for 10g of gold delivered next month.", answer: "riba", concept: "fadl", right: "Correct. Same item must be equal and hand to hand. Equal but delayed is still riba.", wrong: "This is riba. With the same commodity, equal is not enough. It must be exchanged on the spot." },
    { id: "rf6", text: "You lend a friend £1,000 with no conditions. When repaying, they freely add £20 as a thank-you.", answer: "not", concept: "loan", right: "Correct. A voluntary extra with no prior condition is permitted, and even encouraged.", wrong: "This is permitted. The extra was not stipulated. Freely given, with no condition, it is fine." },
  ],
  calc: {
    setup: "You borrow £1,000 at 20% a year. You cannot repay, so it rolls over.",
    principal: 1000, ratePct: 20,
    step1: { id: "calc1", prompt: "Year one adds 20% to £1,000. How much is added?", answer: 200, working: "20% of £1,000 is £200. Now you owe £1,200." },
    step2: { id: "calc2", prompt: "Year two adds 20% again. Will this year's increase be more or less than £200?", options: [{ k: "more", t: "More" }, { k: "less", t: "Less" }], answer: "more", reason: "More. Year two adds 20% of £1,200, which is £240. The increase grows because it is charged on the increase." },
    series: [
      { year: 1, add: 200, owe: 1200 },
      { year: 2, add: 240, owe: 1440 },
      { year: 3, add: 288, owe: 1728 },
      { year: 4, add: 346, owe: 2074 },
      { year: 5, add: 415, owe: 2488 },
    ],
    punchline: "You borrowed £1,000 once and never again. Five years later you owe about £2,488. More than half of that is pure increase.",
    keyLesson: "Riba is not just an extra fee. The increase is required by the contract, and it compounds. The longer you owe, the faster it grows.",
    verseTie: "This is what the Qur'an warns against when it describes riba as multiplied. (Aal Imran 3:130)",
  },
  creditcard: {
    promo: "0% for 6 months", after: "Then 22% APR", balance: 1000,
    cousinVerdict: "This is riba, al-nasi'ah. Not because it was a bank, or a stranger. Because the extra £100 was agreed as a condition of the loan.",
    rf6Callback: "If your cousin had simply chosen to add a little when repaying, with nothing agreed in advance, that would have been fine, even praiseworthy. The agreement is what crossed the line.",
    bridge2: "The same structure runs the modern economy. Here is your cousin's £100, wearing a suit.",
    compoundingCallback: "And unlike your cousin, the card compounds. Carry the balance and the increase grows on itself, the exact curve you saw earlier.",
    problematic: {
      id: "cc1", concept: "apply", prompt: "Where is the agreed extra hiding in this card?",
      options: [
        { k: "a", t: "The annual fee" },
        { k: "b", t: "The 22% charged on a balance you carry" },
        { k: "c", t: "The contactless chip" },
      ],
      answer: "b",
      reason: "A fixed charge added because the debt is deferred. The same structure as your cousin's £100, only bigger.",
    },
    todo: {
      id: "cc2", concept: "apply", prompt: "What should you do with your own credit-card case?",
      options: [
        { k: "a", t: "Decide on your own from a general rule" },
        { k: "b", t: "Check the contract and ask a qualified scholar if unsure" },
        { k: "c", t: "Assume every card is identical" },
      ],
      answer: "b",
      reason: "Check the contract and ask a qualified scholar if unsure. Deany teaches the principle. A scholar weighs your case.",
    },
    maturityNote: "Some scholars discuss whether a card you always pay in full, before any interest, avoids riba. That is a real debate. Deany teaches the structure. A scholar weighs your case.",
    rulingLabel: { halal: "Halal", haram: "Haram", unsure: "Not sure" },
  },
  alternatives: [
    { name: "Murabaha", body: "A seller buys the asset and resells it to you at a disclosed markup." },
    { name: "Ijarah", body: "A lease contract for the use of an asset." },
    { name: "Musharakah", body: "A partnership where profit and risk are shared." },
    { name: "Mudarabah", body: "One party provides capital, another provides work. Profit is shared by agreement." },
    { name: "Qard Hasan", body: "A benevolent loan with no stipulated increase." },
  ],
  alternativesNote: "Names are not enough. The contract structure is what matters.",
  scholarsDiffer: "Scholars differ on some modern cases. For example, whether a conventional mortgage for a first home is permissible where no Islamic option exists is a contested minority discussion. Deany does not rule on your personal situation.",
  scholarRouting: "Facing a specific decision, a mortgage, a pension, a business contract? Take it to a qualified scholar or your local imam. Deany teaches the principle. A scholar weighs your case.",
  apply: {
    principle: "One question unlocks most real cases: is something being sold, or is money being lent?",
    principleBody: "A sale can carry a higher price for paying later, because goods are changing hands. A loan cannot carry a higher payback for paying later, because only money is lent. Many scholars hold this distinction, and the details of any product are for a scholar to weigh.",
    pairTitle: "Same numbers, two different deals",
    pair: {
      d1: { id: "d1", concept: "trade", prompt: "A shop sells a phone for £1,000 today, or £1,150 if you pay over 12 months. You agree the £1,150 price before you take the phone.", options: [{ k: "riba", t: "Riba" }, { k: "not", t: "Not riba" }], answer: "not", reason: "Not riba, in the view of many scholars. The £150 is the agreed price of goods in a sale, fixed before the deal. It is trade, not an increase on a loan. A scholar weighs the specific contract." },
      d2: { id: "d2", concept: "loan", prompt: "You owe a friend £1,000. You cannot pay on time, so they agree you can pay £1,150 if you take two more months.", options: [{ k: "riba", t: "Riba" }, { k: "not", t: "Not riba" }], answer: "riba", reason: "Riba, al-nasi'ah. This is an increase on money already owed in exchange for more time. Same numbers as the sale, opposite ruling, because here money was lent, not goods sold." },
      contrast: "Same £1,000, same £150 extra. One is a sale, one is a loan. That single difference is the whole rule.",
    },
    productsTitle: "Now spot it in the wild",
    products: [
      { id: "ap1", concept: "apply", icon: "home", label: "Mortgage", prompt: "A conventional repayment mortgage. You borrow to buy a home and repay the loan plus interest over 25 years.", options: [{ k: "riba", t: "Riba" }, { k: "not", t: "Not riba" }, { k: "depends", t: "Depends" }], answer: "riba", reason: "Riba. Interest is an increase required on a loan, however long the term. Some scholars discuss necessity where no Islamic option exists, and alternatives like diminishing partnership exist. A scholar weighs your situation." },
      { id: "ap2", concept: "apply", icon: "card", label: "Buy now, pay later", prompt: "A checkout option splits a £300 purchase into three payments of £100, with no fees if you pay on time.", options: [{ k: "riba", t: "Riba" }, { k: "not", t: "Not riba" }, { k: "depends", t: "Depends on the terms" }], answer: "depends", reason: "It depends. Splitting the same price into instalments with no increase is deferred payment, not riba. But if the plan adds interest or charges for paying late, that increase is riba. Always read the terms." },
      { id: "ap3", concept: "apply", icon: "piggy", label: "Savings interest", prompt: "A bank pays you 4% a year on the money in your savings account.", options: [{ k: "riba", t: "Riba" }, { k: "not", t: "Not riba" }], answer: "riba", reason: "Riba. Here you are the lender and the bank pays you a fixed increase on money lent. The prohibition covers receiving it, not only paying it." },
    ],
    bridge: "You can now spot it in the wild. So what should you do instead?",
  },
  concepts: { loan: "Spotting loan interest", trade: "Trade versus riba", fadl: "Same-item exchange", calc: "Calculating the increase", apply: "Applying to real cases" },
  action: "This week, find one product you use and check whether it involves riba.",
};

/* ----- gated-item lookup (rapid fire + calculate + credit-card case) ----- */
const itemLookup = {};
lesson.rapidfire.forEach((q) => (itemLookup[q.id] = { kind: "binary", prompt: q.text, options: [{ k: "riba", t: "Riba" }, { k: "not", t: "Not riba" }], answer: q.answer, right: q.right, wrong: q.wrong, concept: q.concept }));
itemLookup[lesson.calc.step1.id] = { kind: "calc", prompt: lesson.calc.step1.prompt, answer: lesson.calc.step1.answer, working: lesson.calc.step1.working, concept: "calc" };
itemLookup[lesson.calc.step2.id] = { kind: "mcq", prompt: lesson.calc.step2.prompt, options: lesson.calc.step2.options, answer: lesson.calc.step2.answer, reason: lesson.calc.step2.reason, concept: "calc" };
[lesson.creditcard.problematic, lesson.creditcard.todo].forEach((q) => (itemLookup[q.id] = { kind: "mcq", prompt: q.prompt, options: q.options, answer: q.answer, reason: q.reason, concept: q.concept }));
[lesson.apply.pair.d1, lesson.apply.pair.d2, ...lesson.apply.products].forEach((q) => (itemLookup[q.id] = { kind: "mcq", prompt: q.prompt, options: q.options, answer: q.answer, reason: q.reason, concept: q.concept }));
const GATE_IDS = Object.keys(itemLookup);
const PASS = 0.9;

/* mastery ladder + spaced repetition */
const LEVELS = [
  { min: 0.9, key: "mastered", label: "Mastered", color: C.sageDark, bg: C.sageSoft },
  { min: 0.75, key: "proficient", label: "Proficient", color: C.goldDark, bg: C.goldSoft },
  { min: 0.5, key: "familiar", label: "Familiar", color: C.gold, bg: C.goldSoft },
  { min: 0, key: "learning", label: "Learning", color: C.terraDark, bg: C.terraSoft },
];
const levelFor = (score) => LEVELS.find((l) => score >= l.min) || LEVELS[LEVELS.length - 1];
const SR_SHORT = 1;
const SR_LONG = lesson.reviewIntervalDays;

const BEAT_META = {
  rapidfire: { count: lesson.rapidfire.length, mins: 2 },
  calculate: { count: 2, mins: 2 },
};

/* ================================================================== hooks */
function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.18 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, seen];
}
function Reveal({ children, delay = 0, style }) {
  const [ref, seen] = useInView();
  return <div ref={ref} className={`reveal${seen ? " in" : ""}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}
function useCountUp(target, dur = 480) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current, t0 = (typeof performance !== "undefined" ? performance.now() : Date.now());
    let raf;
    const tick = (t) => {
      const now = (typeof performance !== "undefined" ? t : Date.now());
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(start + (target - start) * e);
      if (p < 1) raf = requestAnimationFrame(tick); else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return val;
}

/* ============================================================ primitives */
function Ornament({ size = 24, color = C.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d="M12 1l2.6 7.4L22 12l-7.4 2.6L12 23l-2.6-7.4L2 12l7.4-2.6z" fill="none" stroke={color} strokeWidth="1.1" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}
function Tag({ kind }) {
  const c = kind === "Consensus";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, background: c ? C.sageSoft : C.terraSoft, color: c ? C.sageDark : C.terraDark, fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase" }}>
      {c ? <Check size={12} /> : <Scale size={12} />} {kind}
    </span>
  );
}
function Primary({ children, onClick, disabled, icon: Icon = ArrowRight }) {
  return (
    <button className="deany-btn dq-press" onClick={() => { if (!disabled) { buzz(); snd.pop(); onClick(); } }} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 22px 12px", border: "none", borderBottom: `4px solid ${disabled ? "rgba(27,67,50,0.14)" : EDGE_EMERALD}`, borderRadius: 14, background: disabled ? "rgba(27,67,50,0.26)" : C.emerald, color: "#F4EFE6", fontFamily: SANS, fontSize: 16, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: `background .25s ease, transform ${MT.press}ms` }}>
      {children} <Icon size={18} />
    </button>
  );
}
function Ghost({ children, onClick, icon: Icon }) {
  return (
    <button className="deany-btn dq-press" onClick={() => { buzz(); snd.tick(); onClick(); }}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px 20px 10px", borderRadius: 14, background: C.white, border: `2px solid ${C.border}`, borderBottom: `4px solid ${EDGE}`, color: C.goldDark, fontFamily: SANS, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: `transform ${MT.press}ms` }}>
      {Icon ? <Icon size={17} /> : null} {children}
    </button>
  );
}
function Card({ children, style }) {
  return <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, boxShadow: "0 1px 2px rgba(42,37,32,0.04)", ...style }}>{children}</div>;
}
function BeatHeading({ icon: Icon, kicker, title }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.goldDark, marginBottom: 6 }}>
        <Icon size={16} /><span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>{kicker}</span>
      </div>
      <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 500, color: C.text, margin: 0, lineHeight: 1.12 }}>{title}</h2>
    </div>
  );
}
function Bridge({ text }) {
  return (
    <div className="reveal in" style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: 16, padding: "12px 14px", borderRadius: 13, background: C.goldSoft, border: `1px solid ${C.border}` }}>
      <ArrowRight size={16} color={C.goldDark} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color: C.goldDark, fontWeight: 600 }}>{text}</span>
    </div>
  );
}
function Band({ ok, total }) {
  const r = ok / total;
  const label = r === 1 ? "Perfect" : r >= 0.67 ? "Almost there" : "Keep going";
  const color = r === 1 ? C.sageDark : r >= 0.67 ? C.goldDark : C.terraDark;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS }}>
      <span style={{ fontSize: 19, fontWeight: 800, color }}>{ok}/{total}</span>
      <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color }}>correct</span>
      <span style={{ fontSize: 11.5, fontWeight: 700, color }}>· {label}</span>
    </div>
  );
}
function VisualFrame({ kicker, hint, children }) {
  return (
    <Reveal>
      <figure style={{ margin: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 22px rgba(42,37,32,0.05)" }}>
        <figcaption style={{ padding: "11px 16px", background: C.goldSoft, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SlidersHorizontal size={14} color={C.goldDark} />
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, color: C.goldDark, textTransform: "uppercase" }}>{kicker}</span>
          </div>
          {hint && <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginTop: 4 }}>{hint}</div>}
        </figcaption>
        <div style={{ padding: 16 }}>{children}</div>
      </figure>
    </Reveal>
  );
}
function MasteryLevel({ score, size = "md" }) {
  const lv = levelFor(score);
  const big = size === "lg";
  return (
    <div className="spring" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: big ? "8px 16px" : "5px 12px", borderRadius: 999, background: lv.bg, color: lv.color }}>
      {lv.key === "mastered" ? <Check size={big ? 16 : 13} /> : <Star size={big ? 16 : 13} fill={lv.color} color={lv.color} />}
      <span style={{ fontFamily: SANS, fontSize: big ? 14 : 12, fontWeight: 800, letterSpacing: 0.3 }}>{lv.label}</span>
    </div>
  );
}
function RecitationButton({ id, url, label, playingId, setPlayingId }) {
  const ref = useRef(null);
  const playing = playingId === id;
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (playing) { a.play().catch(() => {}); } else { a.pause(); }
  }, [playing]);
  return (
    <>
      <button className="deany-btn" onClick={() => { buzz(); setPlayingId(playing ? null : id); }}
        aria-label={`${playing ? "Pause" : "Play"} recitation: ${label}`} aria-pressed={playing}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.border}`, background: playing ? C.goldSoft : C.white, color: C.goldDark, fontFamily: SANS, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
        <span className={playing ? "pulsing" : ""} style={{ display: "inline-flex" }}>{playing ? <Pause size={13} /> : <Play size={13} />}</span>
        {playing ? "Pause" : "Listen"}
      </button>
      <audio ref={ref} src={url} preload="none" onEnded={() => setPlayingId(null)} />
    </>
  );
}

/* ------------------------------------------------- the credit-card visual */
function TermPill({ label, value, tone }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "7px 13px", borderRadius: 12, background: rgba(tone, 0.12), border: `1px solid ${rgba(tone, 0.4)}` }}>
      <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 800, color: tone }}>{value}</span>
    </div>
  );
}
function CreditCardHook({ animate = true }) {
  return (
    <div style={{ perspective: 900 }}>
      <div className={animate ? "ccard" : ""} style={{
        position: "relative", width: "100%", maxWidth: 344, margin: "0 auto",
        aspectRatio: "1.586 / 1", borderRadius: 18, padding: 20, color: "#EFE7D2", overflow: "hidden",
        background: `linear-gradient(135deg, ${C.emerald} 0%, ${C.emeraldDark} 55%, #08180F 100%)`,
        boxShadow: "0 20px 44px rgba(15,46,34,0.42), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 42%)", pointerEvents: "none" }} />
        <svg aria-hidden="true" style={{ position: "absolute", right: -28, bottom: -30, opacity: 0.14, pointerEvents: "none" }} width="150" height="150" viewBox="0 0 64 64">
          <path d="M32 2 L62 32 L32 62 L2 32 Z" fill="none" stroke={C.gold} strokeWidth="1" />
          <circle cx="32" cy="32" r="14" fill="none" stroke={C.gold} strokeWidth="0.8" />
        </svg>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: rgba(C.gold, 0.95) }}>Credit</span>
          <Wifi size={18} color={rgba("#EFE7D2", 0.8)} style={{ transform: "rotate(90deg)" }} />
        </div>
        <div style={{ position: "relative", marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 33, borderRadius: 7, background: `linear-gradient(135deg, ${C.gold}, #E7D29A)`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)", position: "relative" }}>
            <div style={{ position: "absolute", left: 6, right: 6, top: "50%", height: 1, background: "rgba(0,0,0,0.22)" }} />
            <div style={{ position: "absolute", top: 6, bottom: 6, left: "50%", width: 1, background: "rgba(0,0,0,0.22)" }} />
          </div>
        </div>
        <div style={{ position: "relative", marginTop: 16, fontFamily: MONO, fontSize: 17, letterSpacing: 2.5, color: "#F2EBD8" }}>•••• •••• •••• 1000</div>
        <div style={{ position: "relative", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 7.5, letterSpacing: 1, opacity: 0.6, fontFamily: SANS }}>CARD HOLDER</div>
            <div style={{ fontSize: 12, fontFamily: SANS, letterSpacing: 1 }}>YOUR NAME</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7.5, letterSpacing: 1, opacity: 0.6, fontFamily: SANS }}>VALID THRU</div>
            <div style={{ fontSize: 12, fontFamily: SANS, letterSpacing: 1 }}>09 / 29</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
        <TermPill label="Intro" value={lesson.creditcard.promo} tone={C.sageDark} />
        <TermPill label="After" value={lesson.creditcard.after} tone={C.terraDark} />
        <TermPill label="Balance" value={gbp(lesson.creditcard.balance)} tone={C.goldDark} />
      </div>
    </div>
  );
}

/* ------------------------------------------------ the cousin message thread */
function MessageThreadHook({ animate = true }) {
  const thread = lesson.hook.thread;
  return (
    <div style={{ maxWidth: 360, margin: "0 auto", background: C.white, border: `1px solid ${C.border}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 14px 36px rgba(42,37,32,0.09)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: `linear-gradient(180deg, ${C.creamHi}, ${C.white})`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: `linear-gradient(135deg, ${C.sage}, ${C.emerald})`, color: "#F4EFE6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 17, fontWeight: 600 }}>C</div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text }}>Cousin</div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: C.sageDark }}>● online</div>
        </div>
      </div>
      <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10, background: rgba(C.gold, 0.04) }}>
        {thread.map((m, i) => {
          const me = m.from === "you";
          return (
            <div key={i} className={animate ? "bubble" : ""} style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "84%", animationDelay: animate ? `${i * 0.5 + 0.1}s` : undefined }}>
              <div style={{
                padding: "10px 13px", borderRadius: 16, fontFamily: SANS, fontSize: 14, lineHeight: 1.45,
                background: me ? C.emerald : C.white, color: me ? "#F4EFE6" : C.text,
                border: me ? "none" : `1px solid ${C.border}`,
                borderBottomRightRadius: me ? 5 : 16, borderBottomLeftRadius: me ? 16 : 5,
                boxShadow: "0 1px 2px rgba(42,37,32,0.05)",
              }}>{m.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ====================================================== interactive models */
function Slider({ label, value, min, max, step = 1, onChange, format }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }}>
        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text }}>{label}</span>
        <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 800, color: C.goldDark }}>{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
function DivergeRow({ label, tag, tagTone = C.terraDark, value, max }) {
  const shown = useCountUp(value);
  const pos = value >= 0;
  const w = Math.min((Math.abs(value) / max) * 50, 50);
  const bar = pos ? C.sage : C.terra;
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 700, color: C.text }}>{label}</span>
        {tag && <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: tagTone, background: rgba(tagTone, 0.12), borderRadius: 999, padding: "3px 9px" }}>{tag}</span>}
      </div>
      <div style={{ position: "relative", height: 30, background: C.creamHi, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: rgba(C.muted, 0.45) }} />
        <div className="spring" style={{ position: "absolute", top: 4, bottom: 4, [pos ? "left" : "right"]: "50%", width: `${w}%`, background: bar, borderRadius: 6, opacity: 0.88 }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, [pos ? "right" : "left"]: 9, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 13, fontWeight: 800, color: pos ? C.sageDark : C.terraDark }}>
          {pos ? "+" : "−"}{gbp(shown)}
        </div>
      </div>
    </div>
  );
}
/* ---- shared model pieces: principle line, segmented toggle, verdict, ledger ---- */
function SectionLabel({ children }) {
  return <div style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.goldDark, margin: "0 0 10px" }}>{children}</div>;
}
function Principle({ children }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
      <span aria-hidden="true" style={{ width: 3, alignSelf: "stretch", borderRadius: 999, background: `linear-gradient(${C.gold},${C.sage})`, flexShrink: 0 }} />
      <p style={{ fontFamily: SERIF, fontSize: 20, lineHeight: 1.4, color: C.emerald, margin: 0 }}>{children}</p>
    </div>
  );
}
function Segmented({ value, options, onChange, ariaLabel }) {
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: "flex", gap: 6, background: C.creamHi, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4 }}>
      {options.map((o) => {
        const on = value === o.k;
        return (
          <button key={o.k} className="deany-btn spring" aria-pressed={on} onClick={() => { buzz(7); snd.tick(); onChange(o.k); }}
            style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 8px", borderRadius: 9, border: "none", background: on ? C.white : "transparent", color: on ? C.emerald : C.muted, fontFamily: SANS, fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: on ? "0 1px 3px rgba(42,37,32,0.1)" : "none" }}>
            {o.icon ? <o.icon size={14} /> : null}{o.t}
          </button>
        );
      })}
    </div>
  );
}
function Verdict({ tone = "sage", icon: Icon = Check, children }) {
  const map = { sage: { bg: C.sageSoft, bd: C.sage, fg: C.sageDark }, terra: { bg: C.terraSoft, bd: C.terra, fg: C.terraDark }, gold: { bg: C.goldSoft, bd: C.gold, fg: C.goldDark } };
  const m = map[tone] || map.sage;
  return (
    <div className="spring" style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: m.bg, border: `1px solid ${m.bd}` }}>
      <Icon size={16} color={m.fg} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.5, color: m.fg, fontWeight: 500 }}>{children}</span>
    </div>
  );
}
function LedgerCard({ title, locked, amount, positive, sub }) {
  const tone = locked ? C.emerald : positive ? C.sageDark : C.terraDark;
  const bg = locked ? rgba(C.emerald, 0.05) : positive ? C.sageSoft : C.terraSoft;
  const bd = locked ? "rgba(27,67,50,0.22)" : positive ? rgba(C.sage, 0.45) : rgba(C.terra, 0.45);
  return (
    <div className="spring" style={{ flex: 1, minWidth: 142, position: "relative", background: bg, border: `1.5px solid ${bd}`, borderRadius: 15, padding: "14px 15px", overflow: "hidden" }}>
      {locked && (
        <span style={{ position: "absolute", top: 11, right: 11, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 999, background: rgba(C.emerald, 0.1), color: C.emerald, fontFamily: SANS, fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}><Lock size={11} /> Locked</span>
      )}
      <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>{title}</div>
      <div className="spring" style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1, color: tone, marginBottom: 7 }}>{(positive || locked) ? "+" : "−"}{amount}</div>
      <div style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.45, color: C.text }}>{sub}</div>
    </div>
  );
}

// Model A - loan interest: risk asymmetry first, then compounding over time
function RibaMachine() {
  const [rate, setRate] = useState(12);
  const [year, setYear] = useState("bad");
  const [showGrowth, setShowGrowth] = useState(false);
  const [years, setYears] = useState(3);
  const P = 1000;
  const interest = (P * rate) / 100;
  const repay = P + interest;
  const bad = year === "bad";
  const gross = bad ? P * 0.4 : P * 1.25;
  const net = gross - repay;
  const positive = net >= 0;
  const r = rate / 100;
  const owedAt = (t) => P * Math.pow(1 + r, t);
  const owedNow = owedAt(years);
  const ribaNow = owedNow - P;
  const owedShown = useCountUp(owedNow);
  const W = 300, H = 176, L = 14, RX = 286, T = 22, B = 132;
  const yMax = Math.max(owedAt(5), P * 1.05);
  const xFor = (t) => L + (t / 5) * (RX - L);
  const yFor = (v) => B - (v / yMax) * (B - T);
  const pts = [];
  for (let t = 0; t <= 5.0001; t += 0.2) pts.push([xFor(t), yFor(owedAt(t))]);
  const curve = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `M${xFor(0).toFixed(1)} ${yFor(P).toFixed(1)} ` + pts.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + ` L${xFor(5).toFixed(1)} ${yFor(P).toFixed(1)} Z`;
  const clipW = xFor(years);
  const labelX = Math.max(L + 34, Math.min(RX - 34, xFor(years)));
  const labelY = Math.max(T + 12, yFor(owedNow) - 12);
  return (
    <div>
      <Principle>Lend money, and any agreed increase is riba. The lender takes none of the risk.</Principle>
      <VisualFrame kicker="Model A · When you lend" hint="Set the interest, then see who carries the risk.">
        <Slider label="Interest on the loan" value={rate} min={0} max={25} step={1} onChange={setRate} format={(v) => `${v}%`} />
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>The borrower's venture had a</div>
          <Segmented value={year} ariaLabel="Outcome of the borrower's venture"
            options={[{ k: "good", t: "Good year" }, { k: "bad", t: "Bad year" }]} onChange={setYear} />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <LedgerCard title="Lender" locked amount={gbp(interest)} sub={`Collects ${gbp(interest)} on top of the £1,000, every time.`} />
          <LedgerCard title="Borrower" positive={positive} amount={gbp(Math.abs(net))}
            sub={bad ? `The venture fell to ${gbp(gross)}, yet still repays ${gbp(repay)}.` : `Keeps the upside after repaying ${gbp(repay)}.`} />
        </div>
        <Verdict tone={bad ? "terra" : "gold"} icon={bad ? AlertTriangle : Scale}>
          {bad ? "Only the borrower can lose. The lender's increase never moves." : "A good year for both. But the lender's increase was never once at risk."}
        </Verdict>

        {!showGrowth && (
          <div style={{ marginTop: 14 }}>
            <Ghost onClick={() => setShowGrowth(true)} icon={TrendingUp}>And it gets worse over time</Ghost>
          </div>
        )}

        {showGrowth && (
          <div className="reveal in" style={{ marginTop: 18 }}>
            <div style={{ height: 1, background: C.border, margin: "0 0 16px" }} />
            <Principle>If you cannot repay, the increase is charged on the increase.</Principle>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: C.goldDark }}>The debt rolls over</span>
              <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 800, color: C.terraDark }}>{gbp(ribaNow)} riba</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="172" role="img" aria-label={`After ${years} years you owe ${gbp(owedNow)}, of which ${gbp(ribaNow)} is riba`} style={{ display: "block" }}>
              <defs>
                <clipPath id="ribaClip"><rect x="0" y="0" width={clipW} height={H} /></clipPath>
                <linearGradient id="ribaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={rgba(C.terra, 0.3)} />
                  <stop offset="100%" stopColor={rgba(C.terra, 0.03)} />
                </linearGradient>
              </defs>
              <line x1={L} y1={yFor(P)} x2={RX} y2={yFor(P)} stroke={C.sageDark} strokeWidth="1.4" strokeDasharray="4 4" />
              <text x={L} y={yFor(P) + 14} fontFamily={SANS} fontSize="9.5" fontWeight="700" fill={C.sageDark}>£1,000 borrowed</text>
              <path d={area} fill="url(#ribaFill)" clipPath="url(#ribaClip)" />
              <path d={curve} fill="none" stroke={rgba(C.terra, 0.25)} strokeWidth="2" />
              <path className="spring" d={curve} fill="none" stroke={C.terra} strokeWidth="3" strokeLinecap="round" clipPath="url(#ribaClip)" />
              <circle className="spring" cx={xFor(years)} cy={yFor(owedNow)} r="5" fill={C.terra} stroke="#fff" strokeWidth="2.5" />
              <text className="spring" x={labelX} y={labelY} textAnchor="middle" fontFamily={SERIF} fontSize="15" fontWeight="600" fill={C.terraDark}>Yr {years} · {gbp(owedShown)}</text>
              <text x={L} y={H - 4} fontFamily={SANS} fontSize="9" fill={C.muted}>now</text>
              <text x={RX} y={H - 4} textAnchor="end" fontFamily={SANS} fontSize="9" fill={C.muted}>5 years</text>
            </svg>
            <Slider label="Years the debt rolls over" value={years} min={0} max={5} step={1} onChange={setYears} format={(v) => `${v}`} />
            <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.55, color: C.muted, margin: "4px 0 0" }}>You borrowed once and never again. Wait longer and you do not owe a little more, you owe a lot more.</p>
          </div>
        )}
      </VisualFrame>
    </div>
  );
}
// Model B - the same-item exchange: weight and timing
function FadlBalance() {
  const [g, setG] = useState(11);
  const [when, setWhen] = useState("now");
  const equalW = g === 10;
  const later = when === "later";
  const ok = equalW && !later;
  const angle = Math.max(-1, Math.min(1, (g - 10) / 3)) * 9;
  let verdict;
  if (ok) verdict = "10g for 10g, hand to hand. Equal and on the spot. This is permitted.";
  else if (equalW && later) verdict = "10g for 10g, but delivered next month. With the same item, equal is not enough. It must be hand to hand, so the delay makes it riba.";
  else if (!equalW && !later) verdict = `10g for ${g}g, hand to hand. Unequal amounts of the same item is riba al-fadl.`;
  else verdict = `10g for ${g}g, and delayed. Unequal and late. Riba on both counts.`;
  return (
    <div>
      <Principle>Swap the same item, and it must be equal and on the spot. Unequal or delayed is riba.</Principle>
      <VisualFrame kicker="Model B · When you swap" hint="Match the amounts, and keep it hand to hand.">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
          <svg viewBox="0 0 240 150" width="100%" height="150" style={{ maxWidth: 320 }} aria-label={`Exchanging 10 grams of gold for ${g} grams, ${later ? "delivered next month" : "hand to hand"}`}>
            <defs>
              <linearGradient id="goldPan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E7D29A" /><stop offset="100%" stopColor={C.gold} />
              </linearGradient>
            </defs>
            <path d="M104 132 h32 l8 12 h-48 z" fill={C.creamHi} stroke={C.muted} strokeWidth="1.3" />
            <rect x="118" y="40" width="4" height="92" rx="2" fill={C.muted} />
            <circle cx="120" cy="40" r="4" fill={C.goldDark} />
            <g className="spring" style={{ transformOrigin: "120px 40px", transform: `rotate(${angle}deg)` }}>
              <rect x="44" y="38" width="152" height="5" rx="2.5" fill={C.goldDark} />
              <line x1="56" y1="41" x2="56" y2="64" stroke={C.muted} strokeWidth="1.2" />
              <path d="M40 64 a16 11 0 0 0 32 0 z" fill="url(#goldPan)" stroke={C.goldDark} strokeWidth="1.2" />
              <text x="56" y="58" textAnchor="middle" fontFamily={SANS} fontSize="12" fontWeight="800" fill={C.emeraldDark}>10g</text>
              <line x1="184" y1="41" x2="184" y2="64" stroke={later ? C.terra : C.muted} strokeWidth="1.2" strokeDasharray={later ? "4 3" : "0"} />
              <path d="M168 64 a16 11 0 0 0 32 0 z" fill={later ? "none" : "url(#goldPan)"} stroke={later ? C.terra : C.goldDark} strokeWidth="1.2" strokeDasharray={later ? "4 3" : "0"} opacity={later ? 0.75 : 1} />
              <text x="184" y="58" textAnchor="middle" fontFamily={SANS} fontSize="12" fontWeight="800" fill={later ? C.terraDark : C.emeraldDark}>{g}g</text>
            </g>
            <text x="56" y="96" textAnchor="middle" fontFamily={SANS} fontSize="10" fill={C.muted}>today</text>
            <text x="184" y="96" textAnchor="middle" fontFamily={SANS} fontSize="10" fontWeight={later ? 700 : 400} fill={later ? C.terraDark : C.muted}>{later ? "next month" : "today"}</text>
          </svg>
        </div>
        <Slider label="Gold offered in return" value={g} min={8} max={13} step={1} onChange={setG} format={(v) => `${v}g`} />
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>When is it handed over?</div>
          <Segmented value={when} ariaLabel="Timing of the exchange"
            options={[{ k: "now", t: "Hand to hand", icon: HeartHandshake }, { k: "later", t: "Next month", icon: Clock }]} onChange={setWhen} />
        </div>
        <Verdict tone={ok ? "sage" : "terra"} icon={ok ? Check : AlertTriangle}>{verdict}</Verdict>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {lesson.commodities.map((c) => (
            <span key={c} style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: C.goldDark, background: C.goldSoft, border: `1px solid ${C.border}`, borderRadius: 999, padding: "4px 10px" }}>{c}</span>
          ))}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginTop: 7 }}>The six commodities · Sahih Muslim</div>
      </VisualFrame>
    </div>
  );
}

/* ============================================================ shared quiz */
function ConfidenceChips({ value, onPick }) {
  const opts = [{ k: "sure", t: "Sure" }, { k: "unsure", t: "Not sure" }];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
      <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: C.muted }}>How sure are you?</span>
      {opts.map((o) => {
        const on = value === o.k;
        return (
          <button key={o.k} className="deany-btn spring" aria-pressed={on} onClick={() => { buzz(7); snd.tick(); onPick(o.k); }}
            style={{ padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${on ? C.gold : C.border}`, background: on ? C.goldSoft : C.white, color: on ? C.goldDark : C.muted, fontFamily: SANS, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>{o.t}</button>
        );
      })}
    </div>
  );
}
// generic multiple choice for the credit-card case and review remediation
// select-confirm grammar: tap holds a selection, Check resolves it
function MCQ({ id, record, onAnswer, confidenceMode = false, lockOnCorrectOnly = false, showPromptInline = true }) {
  const def = itemLookup[id];
  const answered = !!record, correct = record && record.correct;
  const locked = lockOnCorrectOnly ? correct : answered;
  const [conf, setConf] = useState(null);
  const [sel, setSel] = useState(null);
  const [phase, setPhase] = useState("pick"); // pick | flash | reveal
  const [stars, spawn] = useStars();
  const boardRef = useRef(null);
  const optRefs = useRef({});
  const needConf = confidenceMode && !answered && conf === null;
  const feedback = correct ? (def.right || def.reason) : (def.wrong || def.reason);

  const tap = (k) => {
    if (locked || needConf) return;
    if (answered && !locked && phase !== "pick") { setPhase("pick"); setSel(k); snd.tick(); buzz(5); return; }
    if (answered && phase !== "pick") return;
    snd.tick(); buzz(5);
    setSel(sel === k ? null : k);
  };
  const check = () => {
    if (sel === null || locked || needConf) return;
    const isAns = sel === def.answer;
    if (isAns) {
      snd.blip(); buzz(10);
      const el = optRefs.current[sel], b = boardRef.current;
      if (el && b) {
        const r = el.getBoundingClientRect(), rb = b.getBoundingClientRect();
        spawn(r.right - rb.left - 22, r.top - rb.top + r.height / 2);
      }
      setPhase("reveal");
      onAnswer(id, sel, true, false, conf);
    } else {
      snd.buzz(); buzz(30);
      setPhase("flash");
      const chosen = sel;
      setTimeout(() => {
        setPhase("reveal");
        onAnswer(id, chosen, false, false, conf);
      }, MT.correctRevealDelay);
    }
  };
  const resolvedView = locked || (answered && phase === "reveal") || phase === "flash";
  const shownValue = answered ? record.value : sel;
  const stateFor = (k) => {
    const isAns = k === def.answer;
    if (!resolvedView) return sel === k ? "sel" : "idle";
    if (phase === "flash") return k === sel ? "bad" : "idle";
    if (isAns) return "good";
    if (k === shownValue) return locked ? "bad" : "bad";
    return "dim";
  };
  return (
    <div>
      {showPromptInline && <div style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.5, color: C.text, marginBottom: 13, fontWeight: 500 }}>{def.prompt}</div>}
      {confidenceMode && !answered && <ConfidenceChips value={conf} onPick={setConf} />}
      <div ref={boardRef} style={{ display: "flex", flexDirection: "column", gap: 9, position: "relative" }} role="group">
        {def.options.map((opt) => {
          const st = stateFor(opt.k);
          const shaking = phase === "flash" && opt.k === sel;
          return (
            <button key={opt.k} ref={(el) => { optRefs.current[opt.k] = el; }}
              className={"deany-btn dq-press" + (shaking ? " dq-shk" : "")} disabled={(locked || needConf) && resolvedView} aria-pressed={sel === opt.k}
              onClick={() => tap(opt.k)}
              style={chunky(st, { width: "100%", minHeight: 48, textAlign: "left", padding: "13px 14px 11px", fontFamily: SANS, fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, opacity: needConf ? 0.7 : undefined, cursor: (locked || needConf) ? (needConf ? "not-allowed" : "default") : "pointer" })}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flex: 1 }}>
                {resolvedView && st === "good" && <Check size={16} style={{ flexShrink: 0 }} />}
                {resolvedView && st === "bad" && phase !== "flash" && <X size={16} style={{ flexShrink: 0 }} />}
                {opt.t}
              </span>
              <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 999, flexShrink: 0, border: `2px solid ${st === "sel" ? C.gold : "rgba(201,169,97,0.35)"}`, background: st === "sel" ? C.gold : "transparent", display: resolvedView ? "none" : "inline-flex", alignItems: "center", justifyContent: "center", transition: `all ${MT.selectColor}ms` }}>
                {st === "sel" && <Check size={13} color="#fff" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
        {stars.map((s) => <StarSeal key={s.id} x={s.x} y={s.y} />)}
      </div>
      {!resolvedView && !locked && (
        <div style={{ marginTop: 11 }}>
          <button className="deany-btn dq-press" onClick={check} disabled={sel === null || needConf}
            style={{ width: "100%", padding: "13px 0 11px", border: "none", borderBottom: `4px solid ${sel !== null && !needConf ? EDGE_EMERALD : "rgba(27,67,50,0.12)"}`, borderRadius: 14, background: sel !== null && !needConf ? C.emerald : "rgba(27,67,50,0.18)", color: sel !== null && !needConf ? "#F4EFE6" : "rgba(244,239,230,0.7)", fontFamily: SANS, fontSize: 14, fontWeight: 700, cursor: sel !== null && !needConf ? "pointer" : "not-allowed", transition: `background .2s ease, transform ${MT.press}ms` }}>
            Check
          </button>
        </div>
      )}
      {needConf && <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginTop: 8 }}>Pick how sure you are, then answer.</div>}
      {answered && phase !== "flash" && (
        <div className="reveal in" style={{ marginTop: 11, padding: "11px 13px", borderRadius: 12, background: correct ? C.sageSoft : C.terraSoft }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: SANS, fontSize: 13, fontWeight: 700, color: correct ? C.sageDark : C.terraDark, marginBottom: 4 }}>
            {correct ? <Check size={15} /> : <AlertTriangle size={15} />}{correct ? "Correct" : "Not quite"}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: C.muted }}>{feedback}</div>
          {!locked && lockOnCorrectOnly && <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: C.goldDark, marginTop: 6 }}>Tap an option to try again.</div>}
        </div>
      )}
    </div>
  );
}

/* ===================================================== page: 1 hook */
function BeatHook({ answers, onAnswer }) {
  const rec = answers.hook;
  const answered = !!rec;
  return (
    <div>
      <BeatHeading icon={HeartHandshake} kicker="A favour between family" title="Would you call this riba?" />
      <Reveal><MessageThreadHook /></Reveal>
      <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.55, color: C.text, margin: "20px 0 12px", fontWeight: 500 }}>{lesson.hook.prompt}</p>
      <div style={{ display: "flex", gap: 8 }}>
        {lesson.hook.options.map((o) => {
          const chosen = rec && rec.value === o.k;
          return (
            <button key={o.k} className="deany-btn dq-press" disabled={answered} aria-pressed={chosen}
              onClick={() => { buzz(); snd.tick(); onAnswer("hook", o.k, null); }}
              style={chunky(chosen ? "sel" : answered ? "dim" : "idle", { flex: 1, minHeight: 48, padding: "12px 8px 10px", fontFamily: SANS, fontSize: 15, fontWeight: 700, textAlign: "center", cursor: answered ? "default" : "pointer" })}>
              {o.t}
            </button>
          );
        })}
      </div>
      {answered && (
        <>
          <Bridge text={lesson.hook.note} />
          <Reveal>
            <Card style={{ marginTop: 16, background: rgba(C.emerald, 0.04), borderColor: "rgba(27,67,50,0.18)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: C.emerald }}>
                <Sparkles size={16} /><span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{lesson.hook.learnTitle}</span>
              </div>
              <div style={{ display: "grid", gap: 9 }}>
                {lesson.hook.learn.map((l, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <Check size={16} color={C.sageDark} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.5, color: C.text }}>{l}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </>
      )}
    </div>
  );
}

/* ===================================================== page: 2 sources */
function AyahCard({ s, focal, translit, idx, playingId, setPlayingId }) {
  const [open, setOpen] = useState(false);
  const isHadith = !!s.grading;
  const drawerWord = isHadith ? "explanation" : "tafsir";
  const arSize = focal ? 30 : 24;
  const center = !!focal;
  return (
    <div style={{ position: "relative", background: C.white, border: `1px solid ${focal ? "rgba(201,169,97,0.5)" : C.border}`, borderRadius: 18, padding: focal ? "22px 22px 18px" : "16px 18px", overflow: "hidden", boxShadow: focal ? "0 12px 32px rgba(42,37,32,0.08)" : "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: `linear-gradient(${C.gold},${C.sage})` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: focal ? 14 : 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 800, letterSpacing: 0.4, color: C.goldDark, textTransform: "uppercase" }}>{s.ref}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {s.audioUrl ? <RecitationButton id={`rec-${idx}`} url={s.audioUrl} label={s.ref} playingId={playingId} setPlayingId={setPlayingId} /> : null}
          {isHadith ? <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.sageDark, textTransform: "uppercase", letterSpacing: 0.3 }}>{s.grading}</span> : (s.tag ? <Tag kind={s.tag} /> : null)}
        </div>
      </div>

      {s.arabicText ? (
        <p dir="rtl" style={{ fontFamily: ARABIC, fontSize: arSize, lineHeight: 2, color: C.emerald, margin: "0 0 10px", textAlign: center ? "center" : "right" }}>{s.arabicText}</p>
      ) : (
        <div style={{ textAlign: "center", margin: "6px 0 12px" }}>
          <div dir="rtl" style={{ fontFamily: ARABIC, fontSize: arSize, color: "rgba(27,67,50,0.32)", letterSpacing: 3 }}>﴿ … ﴾</div>
          <div style={{ fontFamily: SANS, fontSize: 10.5, color: C.muted, letterSpacing: 0.3, marginTop: 4 }}>Verified Arabic to be added</div>
        </div>
      )}

      {translit && (
        <p style={{ fontFamily: SANS, fontStyle: "italic", fontSize: 13.5, lineHeight: 1.6, color: C.muted, margin: "0 0 10px", textAlign: center ? "center" : "left" }}>{s.transliteration || "Transliteration to be added."}</p>
      )}

      <p style={{ fontFamily: SERIF, fontSize: focal ? 22 : 18.5, lineHeight: 1.55, color: C.text, margin: 0, textAlign: center ? "center" : "left" }}>{s.meaning || "Licensed translation to be added."}</p>

      <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
        <button className="deany-btn" onClick={() => { buzz(7); setOpen((o) => !o); }} aria-expanded={open}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", padding: 0, color: C.sageDark, fontFamily: SANS, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
          <BookOpen size={15} /> {open ? `Hide ${drawerWord}` : `Read the ${drawerWord}`}
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s" }} />
        </button>
        {open && (
          <div className="reveal in" style={{ marginTop: 10 }}>
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.6, color: C.text, margin: 0 }}>{s.tafsir || `Short ${drawerWord} to be added from a named source.`}</p>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginTop: 6 }}>{s.tafsirSource || (isHadith ? "Source to be cited" : "Tafsir source to be cited")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
function BeatSources() {
  const [playingId, setPlayingId] = useState(null);
  const [translit, setTranslit] = useState(false);
  return (
    <div>
      <BeatHeading icon={BookOpen} kicker="Anchor in the source" title="What the revelation says" />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="deany-btn spring" onClick={() => { buzz(7); setTranslit((t) => !t); }} aria-pressed={translit}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 999, border: `1.5px solid ${translit ? C.gold : C.border}`, background: translit ? C.goldSoft : C.white, color: translit ? C.goldDark : C.muted, fontFamily: SANS, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
          {translit ? "Hide transliteration" : "Show transliteration"}
        </button>
      </div>
      <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
        <Reveal><AyahCard s={lesson.sources[0]} idx={0} focal translit={translit} playingId={playingId} setPlayingId={setPlayingId} /></Reveal>
        {lesson.sources.slice(1).map((s, i) => (
          <Reveal key={i + 1} delay={(i + 1) * 70}><AyahCard s={s} idx={i + 1} translit={translit} playingId={playingId} setPlayingId={setPlayingId} /></Reveal>
        ))}
      </div>

      <Reveal>
        <Card style={{ marginBottom: 14, background: rgba(C.emerald, 0.04), borderColor: "rgba(27,67,50,0.18)" }}>
          <SectionLabel>The definition</SectionLabel>
          <p style={{ fontFamily: SERIF, fontSize: 20, lineHeight: 1.5, color: C.emerald, margin: 0 }}>{lesson.definition}</p>
        </Card>
      </Reveal>

      <SectionLabel>Two kinds to know</SectionLabel>
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        {lesson.glossary.map((gl) => (
          <div key={gl.term} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.white, border: `1px solid ${C.border}`, borderRadius: 13, padding: "13px 15px" }}>
            <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.goldDark, flexShrink: 0, minWidth: 116 }}>{gl.term}</span>
            <span style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color: C.text }}>{gl.def}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {lesson.distinction.map((d) => (
          <div key={d.k} style={{ background: d.soft, border: `1.5px solid ${d.tone}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontFamily: SERIF, fontSize: 19, color: d.toneDark, marginBottom: 6 }}>{d.label}</div>
            <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.5, color: C.text, margin: 0 }}>{d.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================================================== page: 3 models */
function BeatModels() {
  const [tab, setTab] = useState("loan");
  const tabs = [{ k: "loan", t: "When you lend" }, { k: "gold", t: "When you swap" }];
  return (
    <div>
      <BeatHeading icon={Sparkles} kicker="See it work" title="What riba looks like" />
      <p style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.45, color: C.text, margin: "0 0 16px" }}>Riba shows up in two everyday shapes: a loan repaid with a required increase, and a swap of the same item that is unequal or delayed. Try each.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, background: C.creamHi, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4 }}>
        {tabs.map((t) => {
          const on = tab === t.k;
          return (
            <button key={t.k} className="deany-btn spring" onClick={() => { buzz(7); setTab(t.k); }} aria-pressed={on}
              style={{ flex: 1, padding: "11px 8px", borderRadius: 9, border: "none", background: on ? C.white : "transparent", color: on ? C.emerald : C.muted, fontFamily: SANS, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: on ? "0 1px 3px rgba(42,37,32,0.1)" : "none" }}>
              {t.t}
            </button>
          );
        })}
      </div>
      <div key={tab} style={{ animation: "dUp .36s both" }}>
        {tab === "loan" ? <RibaMachine /> : <FadlBalance />}
      </div>
    </div>
  );
}

/* ===================================================== page: 4 rapid fire */
function RapidFire({ answers, onAnswer }) {
  const cards = lesson.rapidfire;
  const cardBoxRef = useRef(null);
  const [rfStars, spawnStar] = useStars();
  const [idx, setIdx] = useState(() => { const f = cards.findIndex((c) => !answers[c.id]); return f === -1 ? cards.length : f; });
  const [exit, setExit] = useState(null);
  const [fb, setFb] = useState(null);
  const done = cards.every((c) => answers[c.id]);
  const card = cards[idx];
  const ok = cards.filter((c) => answers[c.id] && answers[c.id].correct).length;
  const choose = (val) => {
    if (!card || exit) return;
    const correct = val === card.answer;
    onAnswer(card.id, val, correct); buzz(correct ? 10 : 30);
    if (correct) { snd.blip(); if (cardBoxRef.current && !reducedMotion()) { const r = cardBoxRef.current.getBoundingClientRect(); spawnStar(r.width / 2, r.height / 2); } }
    else snd.buzz();
    setFb({ correct, text: correct ? card.right : card.wrong });
    setExit(val === "riba" ? "l" : "r");
    setTimeout(() => { setExit(null); setFb(null); setIdx((i) => i + 1); }, 360);
  };
  return (
    <div>
      <BeatHeading icon={Zap} kicker="Spot it fast" title="Riba or not riba?" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: C.terraDark, fontFamily: SANS, fontSize: 12.5, fontWeight: 700 }}>← Riba</span>
        <div style={{ display: "flex", gap: 6 }}>{cards.map((c, i) => <div key={i} className="spring" style={{ width: 8, height: 8, borderRadius: 999, background: answers[c.id] ? (answers[c.id].correct ? C.sage : C.terra) : (i === idx ? C.gold : C.border) }} />)}</div>
        <span style={{ color: C.sageDark, fontFamily: SANS, fontSize: 12.5, fontWeight: 700 }}>Not riba →</span>
      </div>
      <div ref={cardBoxRef} style={{ position: "relative", minHeight: 150, marginBottom: 14 }}>
        {rfStars.map((s) => <StarSeal key={s.id} x={s.x} y={s.y} />)}
        {card ? (
          <div key={card.id} className={exit === "l" ? "swl" : exit === "r" ? "swr" : "card-enter"}
            style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 22px", boxShadow: "0 8px 28px rgba(42,37,32,0.07)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 150 }}>
            <p style={{ fontFamily: SERIF, fontSize: 23, lineHeight: 1.4, color: C.text, textAlign: "center", margin: 0 }}>{card.text}</p>
          </div>
        ) : (
          <div className="reveal in" style={{ minHeight: 150, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", justifyContent: "center", color: C.sageDark, fontFamily: SANS, fontWeight: 700 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Check size={18} /> All sorted</div>
            <Band ok={ok} total={cards.length} />
          </div>
        )}
      </div>
      {card && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button className="deany-btn dq-press" onClick={() => choose("riba")} style={chunky("idle", { padding: "13px 14px 11px", minHeight: 48, fontFamily: SANS, fontSize: 15, fontWeight: 700, textAlign: "center", color: C.terraDark, borderColor: "rgba(184,105,77,0.5)", borderBottomColor: C.terraDark, background: C.terraSoft })}>Riba</button>
          <button className="deany-btn dq-press" onClick={() => choose("not")} style={chunky("idle", { padding: "13px 14px 11px", minHeight: 48, fontFamily: SANS, fontSize: 15, fontWeight: 700, textAlign: "center", color: C.sageDark, borderColor: "rgba(107,142,127,0.5)", borderBottomColor: C.sageDark, background: C.sageSoft })}>Not riba</button>
        </div>
      )}
      <div aria-live="polite">
        {fb && card && <div className="reveal in" style={{ marginTop: 12, padding: "11px 13px", borderRadius: 12, background: fb.correct ? C.sageSoft : C.terraSoft, fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color: fb.correct ? C.sageDark : C.terraDark }}>{fb.text}</div>}
      </div>
      {done && <Bridge text="Sharp. Now make the increase concrete with a little maths." />}
    </div>
  );
}

/* ===================================================== page: 5 calculate */
function CalcQuestion({ id, record, onAnswer, index }) {
  const def = itemLookup[id];
  const [val, setVal] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [tried, setTried] = useState(false);
  const [shakeNow, setShakeNow] = useState(false);
  const rowRef = useRef(null);
  const [calcStars, spawnStar] = useStars();
  const answered = !!record;
  const correct = answered && record.correct;
  const locked = correct || revealed;
  const parse = (s) => parseFloat(String(s).replace(/[^0-9.]/g, ""));
  const submit = () => {
    const n = parse(val);
    if (Number.isNaN(n)) { setTried(true); return; }
    const isOk = Math.abs(n - def.answer) < 0.001;
    onAnswer(id, String(n), isOk); buzz(isOk ? 10 : 30); setTried(true);
    if (isOk) { snd.blip(); if (rowRef.current && !reducedMotion()) { const r = rowRef.current.getBoundingClientRect(); spawnStar(r.width - 20, r.height / 2); } }
    else { snd.buzz(); setShakeNow(true); setTimeout(() => setShakeNow(false), MT.wrongShake); }
  };
  const reveal = () => { setRevealed(true); onAnswer(id, val || "", false); buzz(6); };
  return (
    <Card style={{ marginBottom: 14 }}>
      {index != null && <div style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, color: C.muted, marginBottom: 4 }}>{typeof index === "number" ? `QUESTION ${index}` : index}</div>}
      <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.5, color: C.text, margin: "0 0 13px", fontWeight: 500 }}>{def.prompt}</p>
      <div ref={rowRef} className={shakeNow ? "dq-shk" : ""} style={{ display: "flex", gap: 8, alignItems: "stretch", position: "relative" }}>
        {calcStars.map((s) => <StarSeal key={s.id} x={s.x} y={s.y} />)}
        <div style={{ display: "flex", alignItems: "center", flex: 1, border: `1.5px solid ${correct ? C.sage : C.border}`, borderRadius: 12, background: locked ? (correct ? C.sageSoft : C.terraSoft) : C.white, padding: "0 12px" }}>
          <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: C.goldDark, marginRight: 4 }}>£</span>
          <input className="num-input" inputMode="decimal" aria-label={def.prompt} value={locked ? (correct ? String(def.answer) : (val || "")) : val} disabled={locked}
            onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="0" style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", fontSize: 17, fontWeight: 700, color: C.text, padding: "12px 0" }} />
          {correct && <Check size={18} color={C.sageDark} />}
        </div>
        {!locked && (
          <button className="deany-btn dq-press" onClick={submit} style={{ padding: "0 18px", borderRadius: 12, border: "none", borderBottom: `4px solid ${EDGE_EMERALD}`, background: C.emerald, color: "#F4EFE6", fontFamily: SANS, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: `transform ${MT.press}ms` }}>Check</button>
        )}
      </div>
      {tried && !correct && !revealed && (
        <div className="reveal in" style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.terraDark }}>Not quite. Try once more.</span>
          <button className="deany-btn" onClick={reveal} style={{ background: "none", border: "none", color: C.goldDark, fontFamily: SANS, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Show working</button>
        </div>
      )}
      {locked && (
        <div className="reveal in" style={{ marginTop: 11, padding: "10px 12px", borderRadius: 11, background: correct ? C.sageSoft : C.goldSoft }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: correct ? C.sageDark : C.goldDark, marginBottom: 3 }}>{correct ? "Correct" : `Answer: £${def.answer.toLocaleString()}`}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color: C.muted }}>{def.working}</div>
        </div>
      )}
    </Card>
  );
}
function ClimbBars({ series }) {
  const max = Math.max(...series.map((s) => s.owe));
  return (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 168, padding: "8px 4px 0" }}>
      {series.map((s, i) => {
        const h = (s.owe / max) * 150;
        const addH = (s.add / s.owe) * h;
        return (
          <div key={s.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 800, color: C.terraDark }}>+{gbp(s.add)}</span>
            <div className="bargrow" style={{ width: "100%", maxWidth: 38, height: h, borderRadius: "7px 7px 0 0", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: C.sageSoft, animationDelay: `${i * 0.13}s`, boxShadow: "inset 0 0 0 1px rgba(201,169,97,0.25)" }}>
              <div style={{ height: addH, background: `linear-gradient(180deg, ${C.terra}, ${C.terraDark})` }} />
            </div>
            <span style={{ fontFamily: SANS, fontSize: 10, color: C.muted }}>Yr {s.year}</span>
          </div>
        );
      })}
    </div>
  );
}
function BeatCalculate({ answers, onAnswer }) {
  const cal = lesson.calc;
  const s1 = !!answers.calc1, s2 = !!answers.calc2;
  return (
    <div>
      <BeatHeading icon={Calculator} kicker="Make it concrete" title="The increase that grows" />
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.creamHi, border: `1px solid ${C.border}`, borderRadius: 13, padding: 14, marginBottom: 16 }}>
        <Landmark size={17} color={C.goldDark} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.55, color: C.text, margin: 0, fontWeight: 500 }}>{cal.setup}</p>
      </div>

      <CalcQuestion id="calc1" record={answers.calc1} onAnswer={onAnswer} index="Step 1" />

      {s1 && (
        <Reveal>
          <div style={{ marginTop: 2 }}>
            <div className="reveal in" style={{ marginBottom: 12, padding: "10px 13px", borderRadius: 12, background: C.goldSoft, fontFamily: SANS, fontSize: 13.5, fontWeight: 700, color: C.goldDark }}>You now owe £1,200.</div>
            <Card><MCQ id="calc2" record={answers.calc2} onAnswer={onAnswer} /></Card>
          </div>
        </Reveal>
      )}

      {s1 && s2 && (
        <Reveal>
          <figure style={{ margin: "16px 0 0", background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 22px rgba(42,37,32,0.05)" }}>
            <figcaption style={{ padding: "11px 16px", background: C.terraSoft, borderBottom: `1px solid ${rgba(C.terra, 0.3)}`, fontFamily: SANS, fontSize: 11.5, fontWeight: 800, letterSpacing: 0.5, color: C.terraDark, textTransform: "uppercase" }}>What you owe, year by year</figcaption>
            <div style={{ padding: "8px 14px 16px" }}>
              <ClimbBars series={cal.series} />
              <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted, margin: "6px 2px 0", lineHeight: 1.5 }}>The terra band is each year's riba. It gets taller every year, even though you never borrowed again.</p>
            </div>
          </figure>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: rgba(C.emerald, 0.06), border: `1px solid rgba(27,67,50,0.22)`, borderRadius: 13, padding: 15, marginTop: 14 }}>
            <Zap size={18} color={C.emerald} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.45, color: C.emeraldDark, margin: 0 }}>{cal.punchline}</p>
          </div>
          <Card style={{ marginTop: 12 }}>
            <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.55, color: C.text, margin: "0 0 8px", fontWeight: 500 }}>{cal.keyLesson}</p>
            <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.5, color: C.muted, margin: 0 }}>{cal.verseTie}</p>
          </Card>
        </Reveal>
      )}
    </div>
  );
}

/* ===================================================== page: 6 credit card */
function BeatCreditCardCase({ answers, onAnswer, confidenceMode }) {
  const cc = lesson.creditcard;
  const hookChoice = answers.hook ? cc.rulingLabel[answers.hook.value] : null;
  const [showCard, setShowCard] = useState(!!answers.cc1);
  const cc1Answered = !!answers.cc1;
  return (
    <div>
      <BeatHeading icon={HeartHandshake} kicker="Back to where we started" title="Your cousin, revisited" />
      <Reveal><MessageThreadHook animate={false} /></Reveal>

      <Reveal>
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", margin: "16px 0 0", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 130, background: C.creamHi, border: `1px solid ${C.border}`, borderRadius: 13, padding: 13 }}>
            <div style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Your first answer</div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.text }}>{hookChoice || "Not recorded"}</div>
          </div>
          <div style={{ flex: 1, minWidth: 130, background: C.terraSoft, border: `1px solid ${rgba(C.terra, 0.4)}`, borderRadius: 13, padding: 13 }}>
            <div style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.terraDark, marginBottom: 4 }}>The ruling</div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.terraDark }}>Riba (al-nasi'ah)</div>
          </div>
        </div>
      </Reveal>
      <Card style={{ marginTop: 12 }}>
        <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.55, color: C.text, margin: "0 0 10px", fontWeight: 500 }}>{cc.cousinVerdict}</p>
        <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.55, color: C.muted, margin: 0 }}>{cc.rf6Callback}</p>
      </Card>

      {!showCard && (
        <div style={{ marginTop: 16 }}>
          <Ghost onClick={() => setShowCard(true)} icon={ArrowRight}>See where it hides today</Ghost>
        </div>
      )}

      {showCard && (
        <div className="reveal in" style={{ marginTop: 22 }}>
          <Bridge text={cc.bridge2} />
          <div style={{ height: 18 }} />
          <Reveal><CreditCardHook animate={false} /></Reveal>
          <div style={{ height: 18 }} />
          <Card><MCQ id="cc1" record={answers.cc1} onAnswer={onAnswer} confidenceMode={confidenceMode} /></Card>
          {cc1Answered && (
            <>
              <Reveal>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: rgba(C.emerald, 0.06), border: `1px solid rgba(27,67,50,0.22)`, borderRadius: 13, padding: 14, margin: "12px 0" }}>
                  <Zap size={17} color={C.emerald} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: C.emeraldDark, margin: 0, fontWeight: 500 }}>{cc.compoundingCallback}</p>
                </div>
              </Reveal>
              <Card><MCQ id="cc2" record={answers.cc2} onAnswer={onAnswer} confidenceMode={confidenceMode} /></Card>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.goldSoft, border: `1px solid ${C.border}`, borderRadius: 13, padding: 14, marginTop: 12 }}>
                <Scale size={17} color={C.goldDark} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.55, color: C.text, margin: 0 }}>{cc.maturityNote}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================== page: 7 spot it in your life */
const APPLY_ICON = { home: Home, card: CreditCard, piggy: PiggyBank };
function BeatApply({ answers, onAnswer, confidenceMode }) {
  const ap = lesson.apply;
  const pairDone = !!answers.d1 && !!answers.d2;
  return (
    <div>
      <BeatHeading icon={Landmark} kicker="Take it to the real world" title="Spot it in your life" />
      <Card style={{ marginBottom: 18, background: rgba(C.emerald, 0.04), borderColor: "rgba(27,67,50,0.18)" }}>
        <Principle>{ap.principle}</Principle>
        <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.6, color: C.text, margin: 0 }}>{ap.principleBody}</p>
      </Card>

      <SectionLabel>{ap.pairTitle}</SectionLabel>
      <Card style={{ marginBottom: 12 }}><MCQ id="d1" record={answers.d1} onAnswer={onAnswer} confidenceMode={confidenceMode} /></Card>
      <Card><MCQ id="d2" record={answers.d2} onAnswer={onAnswer} confidenceMode={confidenceMode} /></Card>
      {pairDone && <div style={{ marginTop: 12 }}><Reveal><Verdict tone="gold" icon={Scale}>{ap.pair.contrast}</Verdict></Reveal></div>}

      <div style={{ height: 24 }} />
      <SectionLabel>{ap.productsTitle}</SectionLabel>
      <div style={{ display: "grid", gap: 16 }}>
        {ap.products.map((p) => {
          const Icon = APPLY_ICON[p.icon] || Landmark;
          return (
            <div key={p.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: C.goldSoft, border: `1px solid ${C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.goldDark, flexShrink: 0 }}><Icon size={16} /></span>
                <span style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 800, color: C.text }}>{p.label}</span>
              </div>
              <Card><MCQ id={p.id} record={answers[p.id]} onAnswer={onAnswer} confidenceMode={confidenceMode} /></Card>
            </div>
          );
        })}
      </div>
      <Bridge text={ap.bridge} />
    </div>
  );
}

/* ===================================================== page: 8 alternatives */
function BeatAlternatives() {
  return (
    <div>
      <BeatHeading icon={HeartHandshake} kicker="The halal way" title="Valid alternatives" />
      <p style={{ fontFamily: SANS, fontSize: 14, color: C.muted, margin: "0 0 14px", lineHeight: 1.55 }}>Now that you can spot the problem, here are valid directions to explore.</p>
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        {lesson.alternatives.map((a, i) => (
          <Reveal key={i} delay={i * 50}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 15 }}>
              <div style={{ fontFamily: SERIF, fontSize: 19, color: C.emerald, marginBottom: 4 }}>{a.name}</div>
              <div style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color: C.muted }}>{a.body}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.goldSoft, border: `1px solid ${C.border}`, borderRadius: 13, padding: 15, marginBottom: 12 }}>
        <AlertTriangle size={18} color={C.goldDark} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: C.text, margin: 0, fontWeight: 500 }}>{lesson.alternativesNote}</p>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.terraSoft, border: `1px solid rgba(184,105,77,0.3)`, borderRadius: 13, padding: 15, marginBottom: 12 }}>
        <Scale size={18} color={C.terraDark} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: C.text, margin: 0 }}>{lesson.scholarsDiffer}</p>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: rgba(C.emerald, 0.06), border: `1px solid rgba(27,67,50,0.22)`, borderRadius: 13, padding: 15 }}>
        <Moon size={18} color={C.emerald} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: C.emeraldDark, margin: 0, fontWeight: 500 }}>{lesson.scholarRouting}</p>
      </div>
    </div>
  );
}

/* ===================================================== page: 9 review */
function CircleScore({ score }) {
  const r = 42, circ = 2 * Math.PI * r;
  const shown = useCountUp(score, 900);
  const off = circ * (1 - shown);
  const lv = levelFor(score);
  return (
    <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto" }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke={C.border} strokeWidth="9" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={lv.color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 55 55)" style={{ transition: "stroke-dashoffset .3s linear" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: SANS, fontSize: 26, fontWeight: 800, color: C.text }}>{Math.round(shown * 100)}%</span>
      </div>
    </div>
  );
}
function ReviewSummary({ answers, onAnswer, score, gateCorrect, onFinish, streak, confidenceMode }) {
  const [reviewing, setReviewing] = useState(false);
  const xp = Math.round(useCountUp(lesson.xp, 900));
  useEffect(() => { buzz(22); }, []);
  const conceptStats = {};
  Object.keys(lesson.concepts).forEach((c) => (conceptStats[c] = { total: 0, correct: 0 }));
  GATE_IDS.forEach((id) => { const c = itemLookup[id].concept; conceptStats[c].total++; if (answers[id] && answers[id].correct) conceptStats[c].correct++; });
  const strong = Object.keys(conceptStats).filter((c) => conceptStats[c].total > 0 && conceptStats[c].correct === conceptStats[c].total).map((c) => lesson.concepts[c]);
  const toReview = Object.keys(conceptStats).filter((c) => conceptStats[c].total > 0 && conceptStats[c].correct < conceptStats[c].total).map((c) => lesson.concepts[c]);
  const missed = GATE_IDS.filter((id) => answers[id] && !answers[id].correct);
  const next = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + lesson.reviewIntervalDays); return d; }, []);
  const nice = next.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  return (
    <div>
      <div style={{ textAlign: "center", position: "relative", marginBottom: 8 }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ position: "absolute", width: 64, height: 64, borderRadius: 999, border: `2px solid ${C.gold}`, animation: "ring 1.1s ease-out .15s both" }} />
          <div style={{ animation: "glow .6s ease both" }}><Ornament size={34} /></div>
        </div>
        <h2 style={{ fontFamily: SERIF, fontSize: 31, fontWeight: 500, color: C.emerald, margin: "0 0 4px" }}>Lesson complete</h2>
      </div>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <CircleScore score={score} />
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontFamily: SANS, fontSize: 15, color: C.text, fontWeight: 700, marginBottom: 8 }}>You got {gateCorrect} of {GATE_IDS.length} correct</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <MasteryLevel score={score} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: C.goldSoft, color: C.goldDark, fontFamily: SANS, fontWeight: 800, fontSize: 13 }}><Sparkles size={13} /> +{xp} XP</span>
            </div>
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
        {strong.length > 0 && (
          <div style={{ background: C.sageSoft, border: `1px solid ${rgba(C.sage, 0.4)}`, borderRadius: 13, padding: 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: SANS, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: C.sageDark, marginBottom: 8 }}><Check size={14} /> Strong areas</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{strong.map((s) => <span key={s} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.sageDark, background: C.white, border: `1px solid ${rgba(C.sage, 0.4)}`, borderRadius: 999, padding: "4px 11px" }}>{s}</span>)}</div>
          </div>
        )}
        {toReview.length > 0 && (
          <div style={{ background: C.terraSoft, border: `1px solid ${rgba(C.terra, 0.35)}`, borderRadius: 13, padding: 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: SANS, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: C.terraDark, marginBottom: 8 }}><RotateCcw size={14} /> To review</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{toReview.map((s) => <span key={s} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.terraDark, background: C.white, border: `1px solid ${rgba(C.terra, 0.35)}`, borderRadius: 999, padding: "4px 11px" }}>{s}</span>)}</div>
          </div>
        )}
        <SmallNote icon={Star} label="Spaced revisit" body={`This lesson will return on ${nice} to keep it firm in memory.`} />
        <SmallNote icon={HeartHandshake} label="This week" body={lesson.action} />
        {streak ? <SmallNote icon={Sparkles} label="Consistency" body={`${streak === 1 ? "Your first day" : `${streak} days`} of seeking beneficial knowledge.`} /> : null}
      </div>

      {reviewing && missed.length > 0 && (
        <div className="reveal in" style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, color: C.muted, margin: "0 0 10px" }}>Fix these to raise your score.</div>
          {missed.map((id) => (
            <Card key={id} style={{ marginBottom: 12 }}>
              {itemLookup[id].kind === "calc"
                ? <CalcQuestion id={id} record={answers[id]} onAnswer={onAnswer} />
                : <MCQ id={id} record={answers[id]} onAnswer={onAnswer} lockOnCorrectOnly confidenceMode={confidenceMode} />}
            </Card>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        <Primary onClick={onFinish} icon={Check}>Finish lesson</Primary>
        {missed.length > 0 && <Ghost onClick={() => { setReviewing((v) => !v); }} icon={RotateCcw}>{reviewing ? "Hide missed questions" : `Review missed questions (${missed.length})`}</Ghost>}
      </div>
    </div>
  );
}
function SmallNote({ icon: Icon, label, body }) {
  return (
    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", background: C.white, border: `1px solid ${C.border}`, borderRadius: 13, padding: 14 }}>
      <Icon size={17} color={C.goldDark} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, color: C.goldDark, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
        <div style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.55, color: C.text }}>{body}</div>
      </div>
    </div>
  );
}

/* ================================================================== root */
function RibaLessonV5({
  onComplete = () => {},
  onExit = () => {},
  initialState = null,
  onProgress = () => {},
  streak = null,
  pathContext = null,
  confidenceMode = false,
}) {
  const beats = ["hook", "sources", "models", "rapidfire", "calculate", "creditcard", "apply", "alternatives", "review"];
  const beatLabels = ["Hook", "Sources", "Models", "Rapid fire", "Calculate", "Credit card", "In your life", "Alternatives", "Review"];
  const [beat, setBeat] = useState(initialState && Number.isInteger(initialState.beat) ? initialState.beat : 0);
  const [answers, setAnswers] = useState(initialState && initialState.answers ? initialState.answers : {});
  const record = (id, value, correct, discovery = false, confidence = null) =>
    setAnswers((p) => ({ ...p, [id]: { value, correct, discovery, confidence } }));

  useEffect(() => { onProgress({ beat, answers }); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [beat]);

  const gateCorrect = GATE_IDS.filter((id) => answers[id] && answers[id].correct).length;
  const score = gateCorrect / GATE_IDS.length;
  const points = gateCorrect * 10;

  const rapidDone = lesson.rapidfire.every((c) => answers[c.id]);
  const calcDone = !!answers.calc1 && !!answers.calc2;
  const ccDone = !!answers.cc1 && !!answers.cc2;
  const applyDone = !!answers.d1 && !!answers.d2 && lesson.apply.products.every((p) => answers[p.id]);

  const canAdvance = () => {
    const b = beats[beat];
    if (b === "hook") return !!answers.hook;
    if (b === "rapidfire") return rapidDone;
    if (b === "calculate") return calcDone;
    if (b === "creditcard") return ccDone;
    if (b === "apply") return applyDone;
    return true;
  };
  const nextLabel = () => (beats[beat] === "alternatives" ? "See your results" : "Continue");

  const finish = () => {
    const base = new Date(); base.setDate(base.getDate() + lesson.reviewIntervalDays);
    const schedule = GATE_IDS.map((id) => {
      const correct = !!(answers[id] && answers[id].correct);
      const due = new Date(); due.setDate(due.getDate() + (correct ? SR_LONG : SR_SHORT));
      return { id, kind: itemLookup[id].kind, correct, intervalDays: correct ? SR_LONG : SR_SHORT, dueDate: due.toISOString() };
    });
    const weakItems = GATE_IDS.filter((id) => answers[id] && !answers[id].correct);
    onComplete({ score, xpEarned: lesson.xp, nextReviewDate: base.toISOString(), weakItems, schedule });
  };

  const pct = ((beat + 1) / beats.length) * 100;
  const showFooter = beats[beat] !== "review";

  return (
    <div style={{ minHeight: "100%", position: "relative", background: `radial-gradient(120% 80% at 50% -10%, ${C.creamHi} 0%, ${C.cream} 60%)`, fontFamily: SANS, color: C.text }}>
      <style>{STYLE}</style>
      <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <pattern id="deanyGeo5" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M32 2 L62 32 L32 62 L2 32 Z" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.05" />
            <circle cx="32" cy="32" r="13" fill="none" stroke={C.gold} strokeWidth="0.4" opacity="0.05" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#deanyGeo5)" />
      </svg>

      <div style={{ position: "relative", maxWidth: 480, margin: "0 auto", padding: "16px 16px calc(40px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button className="deany-btn" onClick={onExit} aria-label="Exit lesson" style={{ border: `1px solid ${C.border}`, background: C.white, borderRadius: 10, width: 38, height: 38, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted, flexShrink: 0 }}><ArrowLeft size={18} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, color: C.goldDark, textTransform: "uppercase" }}>{lesson.path}</div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.text, lineHeight: 1 }}>{lesson.title}</div>
            {pathContext ? (
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginTop: 3 }}>
                Lesson {pathContext.position}{pathContext.total ? ` of ${pathContext.total}` : ""}{pathContext.next ? ` · Next: ${pathContext.next}` : ""}
              </div>
            ) : null}
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: C.muted, flexShrink: 0 }}>
            <Star size={11} color={C.gold} fill={C.gold} />{points}
          </span>
        </div>
        <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`Step ${beat + 1} of ${beats.length}: ${beatLabels[beat]}`} style={{ height: 5, borderRadius: 999, background: "rgba(201,169,97,0.18)", overflow: "hidden", marginBottom: 8 }}>
          <div className="spring" style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.goldDark})`, borderRadius: 999 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 8 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {beats.map((b, i) => <div key={b} className="spring" style={{ width: i === beat ? 16 : 7, height: 7, borderRadius: 999, background: i < beat ? C.gold : i === beat ? C.goldDark : C.border }} />)}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.muted }}>{beatLabels[beat]}</div>
        </div>

        <div key={beat} style={{ animation: "dUp .42s both" }}>
          {beats[beat] === "hook" && <BeatHook answers={answers} onAnswer={record} />}
          {beats[beat] === "sources" && <BeatSources />}
          {beats[beat] === "models" && <BeatModels />}
          {beats[beat] === "rapidfire" && <RapidFire answers={answers} onAnswer={record} />}
          {beats[beat] === "calculate" && <BeatCalculate answers={answers} onAnswer={record} />}
          {beats[beat] === "creditcard" && <BeatCreditCardCase answers={answers} onAnswer={record} confidenceMode={confidenceMode} />}
          {beats[beat] === "apply" && <BeatApply answers={answers} onAnswer={record} confidenceMode={confidenceMode} />}
          {beats[beat] === "alternatives" && <BeatAlternatives />}
          {beats[beat] === "review" && <ReviewSummary answers={answers} onAnswer={record} score={score} gateCorrect={gateCorrect} onFinish={finish} streak={streak} confidenceMode={confidenceMode} />}
        </div>

        {showFooter && (
          <div style={{ marginTop: 26 }}>
            <Primary onClick={() => setBeat((b) => Math.min(b + 1, beats.length - 1))} disabled={!canAdvance()}>{nextLabel()}</Primary>
            {beat > 0 && <button className="deany-btn" onClick={() => setBeat((b) => Math.max(b - 1, 0))} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: C.muted, fontFamily: SANS, fontSize: 14, cursor: "pointer" }}>Back</button>}
          </div>
        )}
      </div>
    </div>
  );
}

// App adapter: the router renders <DEANY_M1L3 onBack onHome onGoToNext savedProgress/>.
// Map those onto RibaLessonV5's own prop shape so the file drops in unchanged.
export default function DEANY_M1L3({ onBack, onHome, onGoToNext, savedProgress } = {}) {
  return (
    <RibaLessonV5
      onExit={() => { if (onBack) onBack(); }}
      onComplete={() => { if (onGoToNext) onGoToNext(); else if (onHome) onHome(); }}
      initialState={savedProgress || null}
    />
  );
}
