import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, XCircle, Star, Trophy, ArrowRight, Sparkles, BookOpen, Home,
  Lightbulb, Award, Menu, X, ChevronLeft, Flame, Zap, Target,
  Calendar, Clock, Gift, Lock, Play, Settings, User, Share2,
  ChevronRight, Eye
} from 'lucide-react';

// ---- Shared Components --------------------------------------------
const IslamicPattern = ({ opacity = 0.035, color = "#065f46" }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}/>
        <circle cx="30" cy="30" r="12" fill="none" stroke={color} strokeWidth="0.3" opacity={opacity}/>
        <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity}/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo)"/>
  </svg>
);

const Mascot = ({ size = 'md', className = "" }) => {
  const s = { sm: 'w-10 h-10 text-xl', md: 'w-14 h-14 text-3xl', lg: 'w-20 h-20 text-5xl' };
  return (
    <div className={`${s[size]} rounded-full flex items-center justify-center shadow-lg ${className}`}
      style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)', boxShadow: '0 6px 24px rgba(245,158,11,0.3)' }}>
      <span>🪙</span>
    </div>
  );
};

const NavHeader = ({ onBack, onHome, backLabel = "Back" }) => (
  <div className="flex justify-between items-center mb-6">
    <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors text-sm font-medium">
      <ChevronLeft className="w-4 h-4" /><span>{backLabel}</span>
    </button>
    <button onClick={onHome} className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all" style={{background: 'linear-gradient(135deg, #059669, #0d9488)'}}>
      <Home className="w-4 h-4" /><span>Home</span>
    </button>
  </div>
);

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none" style={{zIndex: 100}}>
    {[...Array(30)].map((_, i) => (
      <div key={i} className="absolute" style={{ left: `${Math.random()*100}%`, top: '-20px', fontSize: `${14+Math.random()*10}px`,
        animation: `confettiFall ${2+Math.random()*2}s ease-out forwards`, animationDelay: `${Math.random()*1.2}s` }}>
        {['✦','✧','☆','🌟','✨'][Math.floor(Math.random()*5)]}
      </div>
    ))}
  </div>
);

// ---- Styles ------------------------------------------------------
const pageBg = { background: 'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)' };
const glass = "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg";
const glassHover = `${glass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`;

// ---- Glossary (Islamic History) ----------------------------------
const GLOSSARY_ENTRIES = [
  { term: "Finality of Prophethood", def: "The belief that Muhammad ﷺ is the last prophet and messenger, and that no new revelation will come after him." },
  { term: "Idol Worship", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "idol worship", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "Tribal Society", def: "A social system where protection, honour, and alliances are based on family and tribe rather than a central government." },
  { term: "tribal", def: "Relating to a social system where protection, honour, and alliances are based on family and tribe rather than a central government." },
  { term: "Polytheism", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "polytheism", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "Revelation", def: "Guidance sent by Allah to prophets. It is not personal opinion, inspiration, or guesswork." },
  { term: "revelation", def: "Guidance sent by Allah to prophets. It is not personal opinion, inspiration, or guesswork." },
  { term: "sharīʿah", def: "The practical laws and rules given by Allah. These can differ by time and people, while the core belief remains the same." },
  { term: "tawḥīd", def: "Belief in and worship of Allah alone, rejecting all forms of false worship. This is the central belief of every prophet." },
  { term: "tawhid", def: "Belief in and worship of Allah alone, rejecting all forms of false worship. This is the central belief of every prophet." },
  { term: "Kaʿbah", def: "The sacred House in Mecca, originally built by Ibrāhīm. A central gathering place for worship and pilgrimage." },
  { term: "Yathrib", def: "An oasis settlement later known as Medina, shaped by agriculture, land ownership, and local alliances." },
  { term: "Sunnah", def: "The teachings, actions, and example of the Prophet Muhammad ﷺ, explaining how to live the Qur'an." },
  { term: "Hijrah", def: "The migration from Mecca to Yathrib (Medina), marking a major shift in Islamic history." },
  { term: "Tawrah", def: "The scripture revealed to Prophet Mūsā (Moses)." },
  { term: "Hijaz", def: "The western region of Arabia that includes Mecca and Yathrib, where Islam first emerged." },
  { term: "Injīl", def: "The scripture revealed to Prophet ʿĪsā (Jesus)." },
  { term: "waḥy", def: "Guidance sent by Allah to prophets. It is not personal opinion, inspiration, or guesswork." },
  { term: "ḥanīfs", def: "People who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "ḥanīf", def: "A person who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "hanifs", def: "People who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "hanif", def: "A person who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "Qur'an", def: "The final revelation from Allah, sent to Prophet Muhammad ﷺ. The primary source of guidance for Muslims." },
  { term: "nabī", def: "A prophet -- someone chosen by Allah who receives revelation and teaches, but may not be sent with a new public mission." },
  { term: "nabi", def: "A prophet -- someone chosen by Allah who receives revelation and teaches, but may not be sent with a new public mission." },
  { term: "rasūl", def: "A messenger -- a prophet sent with a clear public mission to deliver Allah's message, often with a new scripture." },
  { term: "rasul", def: "A messenger -- a prophet sent with a clear public mission to deliver Allah's message, often with a new scripture." },
];
// Sort longest-first so multi-word terms match before their sub-words
const SORTED_TERMS = [...GLOSSARY_ENTRIES].sort((a, b) => b.term.length - a.term.length);

// Split text into segments: plain strings and { term, def } objects
function splitGlossary(text) {
  if (!text) return [];
  const result = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliest = -1, matchLen = 0, matchDef = "";
    for (const entry of SORTED_TERMS) {
      const idx = remaining.indexOf(entry.term);
      if (idx !== -1 && (earliest == -1 || idx < earliest || (idx == earliest && entry.term.length > matchLen))) {
        earliest = idx;
        matchLen = entry.term.length;
        matchDef = entry.def;
      }
    }
    if (earliest == -1) { result.push(remaining); break; }
    if (earliest > 0) result.push(remaining.substring(0, earliest));
    result.push({ term: remaining.substring(earliest, earliest + matchLen), def: matchDef });
    remaining = remaining.substring(earliest + matchLen);
  }
  return result;
}

// ---- Main App ----------------------------------------------------
const App = () => {
  const [screen, setScreen] = useState('home');
  const [selectedMainTopic, setSelectedMainTopic] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedEpoch, setSelectedEpoch] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [selectedResultQuestion, setSelectedResultQuestion] = useState(null);
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState(false);
  const [showConceptIntro, setShowConceptIntro] = useState(true);
  const [conceptIndex, setConceptIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStreakAnim, setShowStreakAnim] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [coins, setCoins] = useState(100);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [completedModules, setCompletedModules] = useState([]);
  const [completedLessons, setCompletedLessons] = useState({});
  const [lastSelectedTopicId, setLastSelectedTopicId] = useState(null);
  const [glossaryPopup, setGlossaryPopup] = useState(null);
  const [speedRoundIdx, setSpeedRoundIdx] = useState(0);
  const [speedResults, setSpeedResults] = useState([]);
  const [speedFeedback, setSpeedFeedback] = useState(null); // { term, definition }
  const modalRef = useRef(null);
  const shuffleRef = useRef({});

  // Fisher-Yates shuffle -- returns a new shuffled array of indices [0..n-1]
  const makeShuffledIndices = (n) => {
    const arr = Array.from({length: n}, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Build shuffle maps for an entire question set (called once per quiz start)
  const buildShuffleMaps = (questions) => {
    const maps = {};
    questions.forEach((q, qi) => {
      if ((q.type == 'multiple-choice' || q.type == 'multi-select') && q.options) {
        maps[qi] = makeShuffledIndices(q.options.length);
      }
    });
    shuffleRef.current = maps;
  };

  // Get shuffled option data for the current question
  const getShuffled = (qi, q) => {
    const map = shuffleRef.current[qi];
    if (!map) return { options: q.options, toOriginal: (i) => i, toShuffled: (i) => i };
    const shuffledOptions = map.map(origIdx => q.options[origIdx]);
    const toOriginal = (shuffledIdx) => map[shuffledIdx];
    const toShuffled = (origIdx) => map.indexOf(origIdx);
    return { options: shuffledOptions, toOriginal, toShuffled };
  };

  // Glossary: check if current topic is Islamic History
  const isHistoryTopic = selectedMainTopic?.id == 'islamic-history';
  const openGlossary = (term, def) => setGlossaryPopup({ term, def });

  // Render text with clickable glossary terms (only for Islamic History)
  const GT = ({ text }) => {
    if (!isHistoryTopic || !text) return <>{text}</>;
    const segments = splitGlossary(text);
    return <>{segments.map((seg, i) => {
      if (typeof seg == 'string') return <React.Fragment key={i}>{seg}</React.Fragment>;
      return (
        <span key={i}
          onClick={(e) => { e.stopPropagation(); openGlossary(seg.term, seg.def); }}
          style={{ color: '#047857', borderBottom: '2px dotted #6ee7b7', paddingBottom: 1, cursor: 'pointer', fontWeight: 600 }}
        >{seg.term}</span>
      );
    })}</>;
  };

  // Glossary popup
  const GlossaryPopup = () => {
    if (!glossaryPopup) return null;
    return (
      <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
        onClick={() => setGlossaryPopup(null)}>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.18)', backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)' }} />
        <div style={{ position:'relative', background:'#fff', borderRadius:20, maxWidth:340, width:'100%', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)', animation:'fadeSlideIn 0.2s ease-out' }}
          onClick={e => e.stopPropagation()}>
          {/* Top accent bar */}
          <div style={{ height:4, background:'linear-gradient(90deg,#059669,#0d9488,#06b6d4)' }} />
          <div style={{ padding:'24px 22px 20px' }}>
            {/* Term header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>📖</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:600, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>Key Term</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#111827', fontFamily:'Georgia,serif', lineHeight:1.2 }}>{glossaryPopup.term}</div>
              </div>
              <div onClick={() => setGlossaryPopup(null)}
                style={{ width:30, height:30, borderRadius:15, background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, color:'#9ca3af', flexShrink:0, transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='#e5e7eb'}
                onMouseLeave={e => e.currentTarget.style.background='#f3f4f6'}>✕</div>
            </div>
            {/* Divider */}
            <div style={{ height:1, background:'linear-gradient(90deg,transparent,#e5e7eb,transparent)', marginBottom:14 }} />
            {/* Definition */}
            <p style={{ fontSize:13, lineHeight:1.7, color:'#374151', margin:0 }}>{glossaryPopup.def}</p>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (showExplanation && currentAnswerCorrect) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); }
  }, [showExplanation, currentAnswerCorrect]);

  useEffect(() => {
    if (!showExplanation || (!selectedModule && !selectedLesson)) return;
    const h = (e) => { if (e.key == 'Enter') { e.preventDefault(); handleNext(); } };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [showExplanation, currentQuestion, selectedModule, selectedLesson, quizScore, totalPoints, coins, xp, level]);

  useEffect(() => {
    if (!showConceptIntro) return;
    const cards = selectedLesson?.conceptCards || selectedModule?.conceptCards;
    if (!cards?.length) return;
    const h = (e) => {
      if (e.key == 'ArrowRight' || e.key == 'Enter') {
        e.preventDefault();
        if (conceptIndex < cards.length - 1) setConceptIndex(conceptIndex + 1);
        else { setShowConceptIntro(false); setConceptIndex(0); }
      } else if (e.key == 'ArrowLeft' && conceptIndex > 0) { e.preventDefault(); setConceptIndex(conceptIndex - 1); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [showConceptIntro, conceptIndex, selectedLesson, selectedModule]);

  const fmt = (text) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={i} style={{color:'#065f46'}} className="font-bold">{p.slice(2, -2)}</strong>;
      }
      return <span key={i}>{p}</span>;
    });
  };

  // ---- Data ------------------------------------------------------
  const mainTopics = [
    { id: '5-pillars', title: "5 Pillars", subtitle: "Foundation of Islam", icon: "🕌", color: "#0d9488", gradient: "from-teal-600 to-emerald-700" },
    { id: 'islamic-finance', title: "Islamic Finance", subtitle: "Shariah-compliant economics", icon: "💰", color: "#d97706", gradient: "from-amber-600 to-orange-700" },
    { id: 'quran-arabic', title: "Quran & Arabic", subtitle: "Learn to read & understand", icon: "📖", color: "#0284c7", gradient: "from-sky-600 to-blue-700" },
    { id: 'islamic-history', title: "Islamic History", subtitle: "Journey through time", icon: "📜", color: "#7c3aed", gradient: "from-violet-600 to-purple-700" }
  ];

  const modules = {
    '5-pillars': [
      { id: 'shahada', title: "Shahada", subtitle: "Declaration of Faith", icon: "☝️", color: "#0d9488", difficulty: "Beginner", estimatedTime: "10 min", questions: [] },
      { id: 'salah', title: "Salah", subtitle: "Prayer", icon: "🤲", color: "#0d9488", difficulty: "Beginner", estimatedTime: "15 min", questions: [] },
      { id: 'zakat', title: "Zakat", subtitle: "Charity", icon: "💎", color: "#0d9488", difficulty: "Intermediate", estimatedTime: "12 min", questions: [] },
      { id: 'sawm', title: "Sawm", subtitle: "Fasting", icon: "🌙", color: "#0d9488", difficulty: "Beginner", estimatedTime: "12 min", questions: [] },
      { id: 'hajj', title: "Hajj", subtitle: "Pilgrimage", icon: "🕋", color: "#0d9488", difficulty: "Intermediate", estimatedTime: "18 min", questions: [] }
    ],
    'islamic-finance': [{
      id: 'module-1', title: "Principles & Basics", subtitle: "Foundation of Islamic Finance", icon: "🎯", color: "#d97706", difficulty: "Beginner", estimatedTime: "70 min", lessonCount: 6,
      mascotMessage: "Let's build a solid foundation in Islamic finance principles!",
      lessons: [
        { id: 'lesson-1-1', title: "Intro to Islamic Finance", description: "Core philosophy of halal transactions", duration: "12 min",
        questions: [
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "A valid sale requires mutual consent communicated as \"_______ and _______.'", type: "multiple-choice", options: ["Counter-offer and silence", "Offer and acceptance (ijab and qabul)", "Wish and estimate", "Silence and counter-offer"], correct: 1, explanation: "Mutual consent = offer + acceptance. This is the legal tie. The other pillars (known price, specified subject, deliverability) carry the sale from there. Without clear offer and acceptance, nothing else fixes the contract. Silence, wishes, and estimates don't create a binding agreement." , uiType: "fill"},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "A reseller lists a refurbished phone as \"brand new.\" They re-applied shrink wrap themselves and photographed it sealed. The phone works fine. Ruling?", type: "multiple-choice", options: ["Permissible -- the phone works, so no harm done", "Forbidden -- misrepresenting condition corrupts the buyer's consent", "Permissible if the return window is generous", "Makruh only -- a minor issue"], correct: 1, explanation: "The Prophet ﷺ condemned trade deception. Misrepresenting a refurbished phone as new corrupts informed consent (Q 4:29). The phone working doesn't cure the fraud. A return policy doesn't whitewash dishonesty. The defect is in the seller's lie, not the product's condition. Q 83:1–3 warns against giving less than what's due." , uiType: "mcq"},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "Why is earning from alcohol off-limits, even if you never drink it yourself?", type: "multi-select", options: ["Allowed if you donate some of the profit", "Allowed if you only handle logistics, not production", "Prohibited: all roles in the alcohol supply chain are cursed in hadith", "Prohibited: intoxicants are categorically commanded to be avoided (Q 5:90)"], correct: [2, 3], explanation: "The Prophet ﷺ cursed ten roles connected to wine (presser, buyer, seller, carrier…). The Qur'an commands avoidance entirely. This shuts the door at every stage -- personal consumption is not the test. Donating profits or limiting your role to \"just logistics\" doesn't change the source. The prohibition targets the supply chain itself." , uiType: "sel2"},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "Your savings account auto-credited AED 52.00 in interest this quarter. Your halal salary deposited was AED 18,000. What is the purification amount, and does it affect your zakat calculation?", type: "multiple-choice", options: ["AED 52.00 purified; yes, it reduces your zakat base", "AED 52.00 purified; no -- zakat is calculated separately on halal wealth", "Nothing -- it's too small to matter", "AED 18,052 -- the entire balance is contaminated"], correct: 1, explanation: "Purify the exact interest amount by donating it without intending reward. Zakat is a separate obligation on lawful wealth -- purification doesn't reduce or replace it. Size doesn't excuse it. And zakat ≠ purification: one is worship on halal wealth, the other is removing money you shouldn't keep." , uiType: "calc", visual: {calcSteps: ["Purification amount = [___]", "Reduce zakat base? [Yes/No]"], factChips: ["Interest: AED 52.00", "Halal salary: AED 18,000", "Source: Bank auto-credit"]}},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "A friend says: \"I'm investing in a cannabis dispensary, but my niyyah is to give ALL the profits to an orphanage.\" What's the correct response?", type: "multiple-choice", options: ["Valid -- good intention purifies the source", "Valid -- charity always overrides", "Invalid -- good intention cannot make a prohibited source halal; both means and ends must be sound", "Invalid -- but only because cannabis is medical, not recreational"], correct: 2, explanation: "\"Deeds are only by intentions\" means niyyah directs reward -- but it operates on LAWFUL actions. It cannot convert a haram source into halal. Both the means and the ends must be sound. Channelling prohibited income to charity is purification of contamination, not a licence to generate it deliberately." , uiType: "mcq"},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "An online electronics store shows \"ONLY 2 LEFT!\" with a countdown timer on every product page, even when they have 500 units in stock. The prices are fair and delivery is reliable. What is the problematic element?", type: "multiple-choice", options: ["The price", "The delivery promise", "The warranty", "The fake scarcity claim -- \"ONLY 2 LEFT!\" manipulates consent"], correct: 3, explanation: "The store has 500 units but shows \"Only 2 left!\" to pressure buying decisions. This artificial urgency manipulates consent (Q 2:188; Q 4:29). The product being halal doesn't fix the method of selling it. The price is fair, delivery is real, and the warranty is genuine. The defect isn't in the product -- it's in the DISHONEST sales tactic." , uiType: "spot", visual: {mockup: {title: "Premium Wireless Earbuds", rating: "\u2605\u2605\u2605\u2605\u2606", price: "AED 299", features: ["\u2705 Free delivery", "\u2705 1-year warranty", "\u23f0 ONLY 2 LEFT! \u2014 countdown timer", "\u2705 Halal-certified electronics"], defectIndex: 2}, factChips: ["Actual stock: 500 units", "Price: Fair market rate", "Delivery: Reliable"]}},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "Two influencer posts promote the same halal skincare brand. Post A: genuinely uses the product but does NOT disclose a 20% affiliate commission. Post B: genuinely uses the product AND openly discloses the commission. Which post has the defect?", type: "multiple-choice", options: ["Post B -- disclosing the commission is unnecessary", "Post A -- the undisclosed financial incentive undermines informed consent", "Neither -- the product is halal so both are fine", "Both -- affiliate marketing is always prohibited"], correct: 1, explanation: "Truthful dealing extends to the full picture a buyer relies on. When followers trust a \"personal recommendation\" but don't know the recommender profits 20% on every sale, their consent is based on incomplete information. Post B is transparent. The issue isn't the products or the business model -- it's the non-disclosure." , uiType: "compare", visual: {cards: [{title: "POST A", lines: ["\"I use this every day. Genuinely love it!'", "", "No disclosure of 20% affiliate commission", "", "\ud83d\udea9 Hidden?"], neutralLines: ["\"I use this every day. Genuinely love it!'", "Affiliate link present", "20% commission rate"], flag: true}, {title: "POST B", lines: ["\"I love this brand \u2014 been using it for 6 months.'", "Affiliate link \u2014 I earn commission if you buy.", "", "Full disclosure \u2713"], neutralLines: ["\"I love this brand \u2014 been using it for 6 months.'", "Affiliate link disclosed", "Commission earned on purchases"], flag: false}]}},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "A fintech app called 'Halal Boost' offers: deposit AED 5,000, receive AED 5,250 after 6 months. No purchase, no asset, no service -- just cash in, more cash out. The branding is green with Islamic geometric patterns and a \"Shariah-inspired\" badge. Is this compliant?", type: "multiple-choice", options: ["Yes -- the branding signals Islamic compliance", "Yes -- the 5% return is modest and reasonable", "No -- labels and branding don't change the substance: cash in → guaranteed surplus out → no trade or service = riba", "Depends on whether the app has a Shariah board"], correct: 2, explanation: "Strip the branding and look at the structure: money in → guaranteed surplus out → no asset, trade, or service = loan with interest. Green branding, geometric patterns, and a \"Shariah-inspired\" badge are marketing -- not compliance. This is substance-over-labels in its purest form. Even an SSB couldn't approve a structure that is functionally interest on a deposit." , uiType: "advise"},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "Sort these features into the correct bucket: which ones actually MAKE a product Shariah-compliant vs. which are JUST marketing?", type: "column-sort", columns: [{id: "compliant", label: "Makes It Compliant", color: "#059669", correct: ["Real asset ownership by bank before sale", "Fixed total sale price agreed at contract", "Genuine risk-sharing (returns vary)", "SSB oversight with published reports"]}, {id: "marketing", label: "Just Marketing", color: "#d97706", correct: ["Green branding & Islamic patterns", "\"Shariah-inspired\" badge", "Arabic product name", "Celebrity sheikh endorsement"]}], items: ["Real asset ownership by bank before sale", "Green branding & Islamic patterns", "Fixed total sale price agreed at contract", "\"Shariah-inspired\" badge", "Genuine risk-sharing (returns vary)", "SSB oversight with published reports", "Arabic product name", "Celebrity sheikh endorsement"], explanation: "Compliance lives in STRUCTURE -- ownership, pricing, risk allocation, governance. Labels, colours, and endorsements are presentation. A product called \"Al-Baraka Growth\" with no real asset behind it is just a regular deposit in Arabic packaging. This is the single most important filter you'll use in every future lesson." , uiType: "drag-alloc", visual: {buckets: [{id: "compliant", label: "Makes It Compliant", color: "#059669"}, {id: "marketing", label: "Just Marketing", color: "#d97706"}], chips: [{text: "Real asset ownership by bank before sale", correct: "compliant"}, {text: "Green branding & Islamic patterns", correct: "marketing"}, {text: "Fixed total sale price agreed at contract", correct: "compliant"}, {text: "\"Shariah-inspired\" badge", correct: "marketing"}, {text: "Genuine risk-sharing (returns vary)", correct: "compliant"}, {text: "SSB oversight with published reports", correct: "compliant"}, {text: "Arabic product name", correct: "marketing"}, {text: "Celebrity sheikh endorsement", correct: "marketing"}]}},
          { concept: "Islamic finance = every deal must be honest, based on real activity, and free from exploitation. Your niyyah matters, but it can't turn a haram deal into a halal one.\\n\\nTruthful dealing is mandatory -- hiding defects or faking scarcity corrupts consent and makes earnings haram.\\nEnabling a haram product at ANY stage is prohibited -- not just personal use. The hadith curses 10 roles in the wine trade.\\nNiyyah (intention) completes halal actions but cannot convert prohibited means into halal outcomes.\\n\\nThink of a reseller re-shrink-wrapping a used phone and listing it as 'brand new' -- the phone works fine, but the dishonesty poisons the sale.", question: "Your cousin Layla (22, just started working) asks: \"I want my income to be halal but I don't know where to start. My salary is from a tech company, I have money in a regular savings account earning interest, and I'm thinking about investing.\" What three things should you advise?", type: "multiple-choice", options: ["(1) Your tech salary is fine -- no haram sector. (2) Purify the interest: donate that exact amount without intending reward. (3) For investing, look for screened funds that exclude haram sectors, and know you'll need to purify any small non-compliant income they disclose.", "(1) Quit your job to be safe. (2) Donate your entire savings. (3) Don't invest.", "(1) Interest is too small to worry about. (2) Just pay extra zakat. (3) Invest wherever returns are highest.", "(1) Salary is fine. (2) Interest is fine because the bank gave it without asking. (3) Any investment is fine if intention is good."], correct: 0, explanation: "Practical, proportionate, and principled. Halal salary ✓. Purify the exact interest (not as zakat) ✓. Screened investments with purification awareness ✓. This respects Islamic principles WITHOUT creating paralysis. Extreme reactions (quit, donate everything) aren't required. And \"intention fixes everything\" or \"ignore small amounts\" contradict core principles." , uiType: "advise"}
        ]
      },
        { id: 'lesson-1-2', title: "What Makes Money Halal?", description: "Risk, ownership, and permissible returns", duration: "12 min",
        questions: [
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "\"Lawful profit follows bearing _______ or ownership in real assets.\" Fill in the blank.", type: "multiple-choice", options: ["Managerial control", "Risk", "Market information advantage", "Contractual duration"], correct: 1, explanation: "al-ghurm bil-ghunm: entitlement to gain follows exposure to loss. No risk = no legitimate return. Management skill, insider knowledge, or contract length don't by themselves justify profit. The backbone is: risk carried → return earned." , uiType: "fill"},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "You rent a self-storage unit for AED 300/month to keep your furniture while relocating. No loan is involved. Is the fee:", type: "multiple-choice", options: ["Generally acceptable -- it's a fee for a real service", "Riba, because any fee is a return on money", "Gambling, because the monthly price could change", "Gharar, because \"storage\" is always ambiguous"], correct: 0, explanation: "Fees for real services (space, security, access) are permissible. You're paying for use of physical space, not lending money. Service fees ≠ riba. Not every fee is riba. Riba is gain on a money loan. A storage provider sells you a tangible service with real costs." , uiType: "mcq"},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "You want a MacBook through your bank's murabaha plan. Which TWO features make this compliant at a basic level?", type: "multi-select", options: ["Monthly payments are indexed to the central bank rate", "The bank owns the MacBook before selling it to you", "The total sale price (cost + agreed markup) is fixed upfront at contract", "The bank calls the instalments \"interest\" but says the structure is different"], correct: [1, 2], explanation: "Your repayments settle a SALE, not rent on money. Ownership + fixed price = the two non-negotiable murabaha guardrails. Indexing payments to a policy rate or relabelling repayments as \"interest\" undermines the asset-sale logic. Substance over labels." , uiType: "sel2"},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "Your savings account auto-credited AED 87.50 in interest. Your halal salary deposited was AED 24,000. What is the purification amount, and does it reduce your zakat base?", type: "multiple-choice", options: ["AED 87.50 purified; yes, it reduces your zakat base", "AED 87.50 purified; no -- zakat is calculated separately on halal wealth", "Nothing -- it's too small to matter", "AED 24,087.50 -- the entire balance is contaminated"], correct: 1, explanation: "Purify the exact interest -- donate without intending reward. Zakat is separate, on your halal wealth. Purification doesn't reduce zakat. AED 87.50 of interest is still interest regardless of size. And zakat ≠ purification -- different obligations, different calculations." , uiType: "calc", visual: {calcSteps: ["Purification amount = [___]", "Reduce zakat base? [Yes/No]"], factChips: ["Interest: AED 87.50", "Halal salary: AED 24,000", "Source: Bank auto-credit"]}},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "Your colleague asks to borrow AED 5,000 through a peer-to-peer app. The app guarantees you'll get AED 5,400 back in 6 months, regardless of what your colleague does with the money. Which SINGLE feature makes this non-compliant?", type: "multiple-choice", options: ["Using an app instead of cash makes it invalid", "The guaranteed return on a cash loan -- profit without bearing asset risk", "Six months is too long", "The amount is too small to matter"], correct: 1, explanation: "Cash lent → guaranteed surplus back → no asset, no trade, no service = money breeding money. That's riba. The platform, timeframe, or loan size don't determine compliance. Loan + guaranteed surplus = riba, regardless of packaging." , uiType: "mcq"},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "Two savings products. Product A: 'Profit Shares' -- fixed 4.2% annually, paid monthly, rate never changes, principal guaranteed. Product B: \"Mudarabah Fund\" -- returns varied (+7%/+3%/-2% last 3 years), capital at risk. Which has the structural defect?", type: "multiple-choice", options: ["Product B -- variable returns are suspicious", "Product A -- fixed guaranteed return with principal protection is interest by another name", "Both are fine", "Both are defective"], correct: 1, explanation: "Fixed guaranteed return + principal protection + rate never varies = interest on a deposit, relabelled \"profit shares.\" Real profit sharing means returns fluctuate with actual performance and capital is at risk (like Product B). Fluctuation feels riskier -- but that risk is what makes the return legitimate." , uiType: "compare", visual: {cards: [{title: "PRODUCT A: 'Profit Shares'", lines: ["Fixed 4.2% annually", "Paid monthly like clockwork", "Rate never changes", "Principal guaranteed"], neutralLines: ["Returns: 4.2% annually", "Paid monthly", "Rate: Fixed", "Principal: Guaranteed"], flag: true}, {title: "PRODUCT B: \"Mudarabah Fund'", lines: ["Returns: 7% / 3% / -2% (last 3 yrs)", "Varies with actual performance", "Capital at risk"], neutralLines: ["Returns: +7% / +3% / -2% (last 3 yrs)", "Varies with performance", "Capital: At risk"], flag: false}]}},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "A murabaha flow has 4 steps: (1) Bank buys car from dealer, (2) Bank sells to you at cost + agreed markup (fixed total price), (3) You pay monthly instalments, (4) If you miss a payment, remaining balance is RECALCULATED at a higher rate. Which step has the defect?", type: "multiple-choice", options: ["Step 1 -- the bank shouldn't buy the car", "Step 2 -- markup is not allowed", "Step 3 -- instalments are interest", "Step 4 -- recalculating at a higher rate introduces riba on arrears"], correct: 3, explanation: "Murabaha requires a FIXED total sale price. Steps 1–3 are solid. But Step 4 recalculates the price upward on default -- that converts a sale-price shortfall into interest on arrears. A compliant alternative: a fixed penalty donated to charity. The defect is specifically in the penalty clause." , uiType: "flow-tap", visual: {steps: [{num: 1, title: "Bank buys car from dealer", ok: true}, {num: 2, title: "Bank sells to you at cost + agreed markup (fixed total price)", ok: true}, {num: 3, title: "You pay monthly instalments", ok: true}, {num: 4, title: "If you miss a payment, remaining balance is RECALCULATED at a higher rate", ok: false, flag: "\ud83d\udea9"}]}},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "A graphic designer charges AED 3,000 for a logo. The client offers: AED 2,500 now + AED 700 in three months (AED 3,200 total). The extra AED 200 is \"for the inconvenience of waiting.\" Is the extra AED 200 problematic?", type: "multiple-choice", options: ["Yes -- any extra amount for delay is riba", "No -- this is a sale of services; charging more for deferred payment is a pricing decision in a genuine trade, not a loan", "Only problematic if the designer charges \"interest\" explicitly", "Problematic because the client initiated the delay"], correct: 1, explanation: "This is a sale of services, not a loan. Offering different prices for immediate vs deferred payment is a recognised principle in Islamic commercial law. The key: the total price is fixed at contract and it's genuine trade. This is the EXACT distinction that separates murabaha (sale with markup, including time value) from a loan with interest. \"Any extra for delay = riba\" is true for LOANS. In a SALE, different prices for different payment terms is a pricing decision." , uiType: "mcq"},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "\"Islamic Home Investment Certificates\": you deposit money, receive a fixed 5.5% annually (guaranteed), no asset ownership, no profit-and-loss sharing, principal guaranteed, brochure says 'Blessed earnings' with Islamic branding. Sort these features -- which are structural RED FLAGS vs. which are neutral/cosmetic?", type: "column-sort", columns: [{id: "redflag", label: "Red Flags 🚩", color: "#dc2626", correct: ["Fixed 5.5% return (guaranteed)", "No asset ownership for investor", "Principal guaranteed", "No profit-and-loss sharing"]}, {id: "neutral", label: "Neutral / Cosmetic", color: "#6b7280", correct: ["Islamic terminology in brochure", "'Blessed earnings' label", "Green branding", "Developer is Muslim"]}], items: ["Fixed 5.5% return (guaranteed)", "Islamic terminology in brochure", "No asset ownership for investor", "'Blessed earnings' label", "Principal guaranteed", "No profit-and-loss sharing", "Green branding", "Developer is Muslim"], explanation: "Combine Lesson 0 (niyyah can't convert haram means) + Lesson 1 (profit requires risk/ownership): no asset + guaranteed fixed return + protected principal = interest on deposit. Islamic branding ≠ structural compliance. Labels like 'Blessed earnings' are cosmetic; the structure underneath is functionally interest." , uiType: "drag-alloc", visual: {buckets: [{id: "redflag", label: "Red Flags \ud83d\udea9", color: "#dc2626"}, {id: "neutral", label: "Neutral / OK", color: "#059669"}], chips: [{text: "Fixed 5.5% return", correct: "redflag"}, {text: "Islamic terminology in brochure", correct: "neutral"}, {text: "No asset ownership for investor", correct: "redflag"}, {text: "'Blessed earnings' label", correct: "neutral"}, {text: "Principal guaranteed", correct: "redflag"}, {text: "No profit-and-loss sharing", correct: "redflag"}, {text: "Green branding", correct: "neutral"}, {text: "Developer is Muslim", correct: "neutral"}]}},
          { concept: "Lawful profit comes from bearing real risk or owning real assets -- guaranteed gain on a cash loan is the definition of riba.\\n\\nRisk justifies return (al-ghurm bil-ghunm): no risk carried → no legitimate return.\\nA valid sale needs: known item, known price, deliverability, consent -- no riba/gharar/maysir.\\nFees for real services are permissible -- they're payment for work, not 'return on money.'\\n\\nYour bank's murabaha car plan: the bank buys the car first (takes ownership risk), then sells it to you at a fixed total price. Your repayments settle a sale -- not interest on a loan.", question: "Your best friend received AED 100,000 inheritance. A colleague says \"put it in savings -- the interest is small so it doesn't count.\" Another friend says \"invest with me -- I'll guarantee 10% a year.\" What should you advise?", type: "multiple-choice", options: ["(1) Interest is interest regardless of amount -- a savings account earning it isn't halal. (2) A \"guaranteed 10%\" without genuine risk-sharing is likely riba in disguise. (3) Look into screened investments where returns tie to real business performance.", "(1) Small interest is fine. (2) The friend's deal sounds great. (3) Don't overthink it.", "(1) Keep it all in cash under the mattress. (2) Never invest. (3) Only safe option.", "(1) Interest is wrong. (2) The friend's deal is fine because he promised. (3) Just invest anywhere with good niyyah."], correct: 0, explanation: "Interest = riba regardless of size. Guaranteed fixed return without risk-sharing contradicts al-ghurm bil-ghunm. Genuine halal investments involve real risk tied to real activity. Proportionate -- not extreme, not careless. \"Too small to count\" has no basis. A guaranteed return from a friend is still a guaranteed return." , uiType: "advise"}
        ]
      },
        { id: 'lesson-1-3', title: "Quick Map: Riba, Gharar, Maysir", description: "Diagnosing the three major prohibitions", duration: "12 min",
        questions: [
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "Which prohibited element describes a contract where the buyer doesn't know what they're actually purchasing?", type: "multiple-choice", options: ["Riba", "Gharar -- material uncertainty about the subject matter", "Maysir", "All three equally"], correct: 1, explanation: "When the subject is materially unknown, that's gharar. Can't consent to what you can't identify. Riba = loan surpluses. Maysir = chance-based wealth transfer. Ambiguity about what's being sold = gharar." , uiType: "mcq"},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "Sort these three scenarios: (1) \"Mystery tech box: AED 200, contents unknown.\" (2) \"Online raffle: AED 50 ticket, random winner gets iPhone.\" (3) \"P2P loan: lend AED 5,000, guaranteed AED 5,400 back.\" Which is gharar, which is maysir, which is riba?", type: "multiple-choice", options: ["All three are riba", "(1) Gharar (contents unknown), (2) Maysir (wealth by chance), (3) Riba (guaranteed surplus on loan)", "(1) Maysir, (2) Gharar, (3) Riba", "(1) Riba, (2) Riba, (3) Gharar"], correct: 1, explanation: "Gharar = ambiguity about what's being exchanged. Maysir = wealth by chance. Riba = guaranteed gain on a loan. Different defects, different fixes -- correct triage is the skill." , uiType: "triage"},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "Diagnose three transactions: A personal loan repaid with a guaranteed extra = _______. An online draw with outcome depending purely on luck = _______. A contract where the item being sold is materially unclear = _______.", type: "multiple-choice", options: ["Maysir; Riba; Gharar", "Riba; Maysir; Gharar", "Gharar; Riba; Maysir", "Riba; Gharar; Maysir"], correct: 1, explanation: "Riba = loan + surplus. Maysir = wealth by chance. Gharar = material uncertainty. Diagnosis drives the fix." , uiType: "fill"},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "A peer-to-peer lending app offers a guaranteed 6% annual return on a loan of AED 20,000 for 1 year, with no underlying asset. Calculate the guaranteed surplus and classify it.", type: "multiple-choice", options: ["AED 1,200 surplus -- this is gharar", "AED 1,200 surplus -- this is riba (guaranteed gain on a cash loan with no asset)", "AED 1,200 surplus -- this is compliant", "AED 200 surplus -- this is maysir"], correct: 1, explanation: "AED 20,000 Ô 6% = AED 1,200. Money lent at a guaranteed return, no asset, no risk sharing, no service = textbook riba. Rate transparency doesn't change it. The return is GUARANTEED -- that guarantee is the problem." , uiType: "calc", visual: {calcSteps: ["Surplus = AED [___] \u00d7 [___]% = AED [___]", "This is: [riba/gharar/maysir/compliant]"], factChips: ["Loan: AED 20,000", "Guaranteed return: 6%", "Duration: 1 year", "Underlying asset: None"]}},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "Your uncle lends people money and says \"I don't charge interest.\" But every borrower gives him ~5% as a \"thank-you gift\" -- it's consistent, expected, and he clearly expects it. What is this really?", type: "multiple-choice", options: ["Compliant generosity", "Riba via an expected 'gift' that functions as a loan surplus", "Gharar", "Maysir"], correct: 1, explanation: "A 'gift' that's expected/conditioned at ~5% on every loan is a loan surplus. Label says gift; substance says interest. Consistent + expected + percentage-based = it walks and talks like interest." , uiType: "mcq"},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "A \"Community Prize Event\": AED 50 entry, random draw (no skill), 1 winner gets an iPhone, everyone else gets nothing. The organiser calls it a \"community event.\" Primary issue?", type: "multiple-choice", options: ["Gharar", "Maysir -- chance-based wealth transfer, regardless of the label", "Riba", "No issue if it's for charity"], correct: 1, explanation: "Pay money → random outcome → winners gain because losers lose = maysir. \"Community prize event\" is a label. The structure is a gamble. Terms are clear (not gharar). No loan (not riba). Charity wrapper doesn't fix the mechanism." , uiType: "mcq"},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "A crypto platform offers \"leveraged tokens\": deposit AED 1,000 with 5x leverage. No actual asset changes hands. A 2% market move gives you +10% or -10%. What is the MOST accurate primary classification?", type: "multiple-choice", options: ["Gharar only", "Maysir -- amplified, zero-sum speculation with no underlying asset transfer", "Riba -- because leverage involves borrowing", "Compliant -- all trading involves risk"], correct: 1, explanation: "No asset changes hands + extreme amplification + zero-sum structure = closer to a wager than a trade. The dominant defect is the gambling-like payoff. Some gharar exists in all forward transactions. Leverage alone isn't automatically riba. The core issue: speculative, zero-sum mechanism." , uiType: "slider"},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "Travel insurance: AED 150 premium. If flight cancelled: AED 5,000 payout. If nothing happens: AED 0 back. A friend says \"This is maysir.\" Is your friend right?", type: "multiple-choice", options: ["Yes -- any insurance is maysir", "No -- this is closer to gharar", "It's a legitimate concern -- conventional insurance has elements of gharar and maysir-like structure, which is exactly why takaful (cooperative insurance) was developed", "No issue at all"], correct: 2, explanation: "The friend's instinct is partially right. Conventional insurance contains gharar (uncertain event) and maysir-like features (premium paid, uncertain payout). Takaful was designed to provide coverage while addressing these structural concerns. Dismissing or fully agreeing both miss the nuance." , uiType: "mcq"},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "Two investment products. Product X: variable returns (+7%/+3%/-2% last 3 years), capital at risk. Product Y: guaranteed 5% annually, principal protected. Using Lesson 2's framework AND Lesson 1's risk principle -- which is more likely compliant?", type: "multiple-choice", options: ["Product Y -- guaranteed returns are safer", "Product X -- variable returns + capital at risk = genuine risk-sharing (al-ghurm bil-ghunm)", "Both are equally compliant", "Neither is compliant"], correct: 1, explanation: "Variable returns + capital at risk = genuine risk-sharing (al-ghurm bil-ghunm). Product Y's guaranteed return + protected principal = functionally interest (riba). Fluctuation feels riskier, but that risk is what makes the return legitimate." , uiType: "compare", visual: {cards: [{title: "PRODUCT X", lines: ["Returns: Variable", "Last 3 years: +7% / +3% / -2%", "Capital: At risk", "", "Feels: Risky \ud83d\ude2c"], neutralLines: ["Returns: Variable", "Last 3 years: +7% / +3% / -2%", "Capital: At risk"], flag: false}, {title: "PRODUCT Y", lines: ["Returns: Guaranteed 5% annually", "Paid monthly", "Principal: Protected", "", "Feels: Safe \ud83d\ude0a"], neutralLines: ["Returns: 5% annually", "Paid monthly", "Principal: Protected"], flag: true}]}},
          { concept: "Riba is guaranteed gain on a loan. Gharar is dangerous uncertainty in a contract. Maysir is wealth won by pure chance. Diagnosing the right defect determines the right fix.\\n\\nRiba = guaranteed increase on a money loan, or defects in ribawi exchanges.\\nGharar = material uncertainty about the subject, price, or deliverability that undermines consent.\\nMaysir = gaining or losing wealth mainly through chance, speculation, or a zero-sum gamble.\\n\\n'Mystery box' (don't know what's inside) = gharar. Lottery ticket (pay to maybe win) = maysir. P2P loan with guaranteed 5% = riba. Different defects, different fixes.", question: "Your colleague says: \"I keep hearing riba, gharar, maysir -- can't tell the difference. Almost invested in a 'guaranteed 8%' scheme (someone said riba). My friend says her lottery ticket is riba. My brother says his mystery box is riba. They can't all be riba, right?'", type: "multiple-choice", options: ["They're all the same thing -- just avoid anything involving money", "Your friend is right -- they're all riba", "You're right -- they're different. The 8% scheme = riba (guaranteed extra on a loan). The lottery = maysir (winning/losing by pure chance). The mystery box = gharar (paying for something you can't identify). Different problems, different fixes.", "Don't worry about categories -- just check if it feels Islamic"], correct: 2, explanation: "Three distinct diagnostic categories, not synonyms. Triage correctly → classify correctly → fix correctly. Collapsing all three into \"riba\" leads to wrong classifications or paralysis. \"Feels Islamic\" isn't a diagnostic tool." , uiType: "advise"}
        ]
      },
        { id: 'lesson-1-4', title: "Riba Types & Currency Basics (Sarf)", description: "Fadl, nasi'ah, and currency exchange rules", duration: "12 min",
        questions: [
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "What does \"riba al-fadl\" mean?", type: "multiple-choice", options: ["Interest charged on a bank loan", "Unequal exchange of the same type of ribawi commodity, even if done on the spot", "Any profit made from trading", "Delay in delivering goods"], correct: 1, explanation: "Fadl = excess. 25g gold swapped for 23g of the same gold = 2g riba al-fadl, even though both sides handed over immediately." , uiType: "mcq"},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "Gold souk swap: Your 21k gold bracelet (25g) for a jeweller's 21k gold chain (23g). Both handed over on the spot. Same karat. What creates the problem?", type: "multiple-choice", options: ["The karat being 21k instead of 24k", "The 2g weight difference (25g vs 23g) -- same-kind must be equal", "Handing over on the spot", "Nothing -- this is fine"], correct: 1, explanation: "Same-kind (gold--gold, same karat) must be equal AND immediate. 25g vs 23g = riba al-fadl. No delay (so not nasi'ah). Same karat (so it IS same-kind). The defect is purely the unequal weight." , uiType: "spot", visual: {mockup: {title: "Gold Souk Swap", layout: "swap", left: {label: "YOUR BRACELET", items: ["21k gold", "25g", "Handed over: NOW"]}, right: {label: "JEWELLER'S CHAIN", items: ["21k gold", "23g", "Handed over: NOW"]}, defectItem: "23g"}, factChips: ["Same karat", "Same day", "Spot exchange"]}},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "In a same-currency exchange (e.g. AED cash → AED in your bank), the trade must be \"_______ and _______\" to avoid riba.", type: "multiple-choice", options: ["Unequal and deferred", "Equal and immediate", "Collateralised and fixed-rate", "Equal and deferred"], correct: 1, explanation: "\"Equal\" blocks fadl. \"Immediate\" blocks nasi'ah. Both required for same-kind ribawi. Missing either condition = non-compliant." , uiType: "fill"},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "Two traders swap silver. Trader A has 150g of .925 sterling. Trader B has 145g of .925 sterling. Same purity, both hand over on the spot. What is the excess and is it permissible?", type: "multiple-choice", options: ["5g excess -- permissible because it's spot", "5g excess -- not permissible: riba al-fadl (same-kind must be equal)", "No excess -- both are silver", "5g excess -- this is gharar, not riba"], correct: 1, explanation: "150 - 145 = 5g excess. Not permissible. Same-kind, same purity → must be equal AND immediate. Size of excess is irrelevant -- 5g or 0.5g, it's still fadl." , uiType: "calc", visual: {calcSteps: ["Excess = [___]g \u2212 [___]g = [___]g", "Permissible? [Yes/No]", "Defect type: [fadl/nasi'ah/both]"], factChips: ["Trader A: 150g .925 sterling", "Trader B: 145g .925 sterling", "Same purity", "Both spot"]}},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "A remittance app: you want to send AED → GBP. Rate is locked today. AED debited today. GBP credited tomorrow (T+1). What's the issue?", type: "multiple-choice", options: ["Compliant sarf -- rate was fixed", "Riba al-nasi'ah -- delay on both sides in a currency exchange", "Riba al-fadl", "Gharar"], correct: 1, explanation: "Sarf requires spot delivery of BOTH currencies. Locked rate ≠ spot delivery. Money-owed-for-money-owed = nasi'ah." , uiType: "mcq"},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "Two gold purchase options. Option A: 'Gold Savings Plan' -- pay AED 500/month for 12 months, gold delivered at month 12 only. Option B: Pay AED 6,000 cash, receive 10g 24k gold on the spot. Which has the structural issue?", type: "multiple-choice", options: ["Option B -- paying cash is risky", "Option A -- money paid over time for gold delivered only at the end = deferred exchange of ribawi commodities = riba al-nasi'ah", "Both are fine", "Neither is compliant"], correct: 1, explanation: "Money (ribawi) paid over time for gold (ribawi) delivered only at the end = deferred exchange of two ribawi commodities = riba al-nasi'ah. The \"savings plan\" label is cosmetic. Option B (cash for gold, spot) is clean sarf." , uiType: "compare", visual: {cards: [{title: "OPTION A: 'Gold Savings Plan'", lines: ["Pay AED 500/month for 12 months", "Gold delivered at month 12 only", "No gold until then", "Label: 'savings tool'"], neutralLines: ["Pay AED 500/month for 12 months", "Gold delivered at month 12 only", "Label: 'savings tool'"], flag: true}, {title: "OPTION B: 'Gold Purchase'", lines: ["Pay AED 6,000 cash", "Receive 10g 24k gold on the spot", "", "Label: 'purchase'"], neutralLines: ["Pay AED 6,000 cash", "Receive 10g 24k gold on the spot", "Label: 'purchase'"], flag: false}]}},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "You walk into a bureau de change to swap AED for EUR. Which TWO conditions make this valid sarf?", type: "multi-select", options: ["Both currencies handed over on the spot (same sitting)", "It's a straight sale, not an \"I owe you later\" structure", "One side may defer if fully collateralised", "Either side may defer as long as the rate is fixed"], correct: [0, 1], explanation: "Spot delivery + genuine sale. If one side is delayed → debt-for-debt in money → riba. Collateral or fixed rate don't fix timing. The issue isn't credit risk -- it's the delayed obligation itself." , uiType: "sel2"},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "Two remittance options for sending GBP to your family. Option A: GBP credited in 2 hours (same business day). Option B: GBP credited in 3 business days. Both lock today's rate. Which better satisfies sarf requirements?", type: "multiple-choice", options: ["Both fine -- rate is locked in both", "Option A -- near-immediate settlement; Option B's 3-day delay is a clear deferral", "Option B -- locking the rate matters more", "Neither -- only physical cash counts"], correct: 1, explanation: "Classical sarf = same sitting. Modern scholars discuss near-instantaneous electronic settlement (same-day) as potentially satisfying this. 2 hours has stronger support than 3 days. Rate locking ≠ delivery timing." , uiType: "mcq"},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "'GoldRush' app: deposit AED 1,000, algorithm trades gold futures, guaranteed minimum 3%/month, \"up to 15%,\" actual gold delivered to you: NEVER. How many defects can you identify?", type: "multiple-choice", options: ["Just one -- it's only riba", "Just two -- riba and gharar", "Four defects: (1) Guaranteed 3% floor = riba, (2) No spot gold delivery = nasi'ah, (3) Vague \"up to 15%\" = gharar, (4) Speculative futures = maysir", "Compliant -- it involves gold"], correct: 2, explanation: "This is a layer cake of defects. Guaranteed 3% floor = riba. No spot gold delivery = nasi'ah. Vague \"up to 15%\" = gharar. Speculative futures = maysir. Real products often have MULTIPLE overlapping defects. The skill is identifying all of them." , uiType: "slider"},
          { concept: "Riba comes in two forms -- unequal swap of the same commodity (fadl), or delayed exchange of ribawi goods (nasi'ah) -- and currencies follow the same rules as gold and silver.\\n\\nSame-kind ribawi (gold--gold, AED--AED): must be EQUAL and IMMEDIATE. Break either = riba.\\nDifferent-kind ribawi (gold--silver, AED--GBP): must be IMMEDIATE. Amounts can differ.\\nCurrencies are treated like gold/silver -- FX (sarf) requires both sides to settle on the spot.\\n\\nBureau de change, AED cash → EUR cash, both handed over on the spot = valid sarf. Remittance app, rate locked today but both sides settle tomorrow = riba al-nasi'ah.", question: "Your father wants to convert savings into gold. Three options: (1) Physical gold coins from the souk, cash on the spot. (2) \"Gold Accumulation Plan\" -- pay monthly, receive gold after 12 months. (3) Gold ETF through his brokerage. Best advice?", type: "multiple-choice", options: ["(1) Cleanest -- cash for gold, spot delivery = valid sarf. (2) Ask: does gold transfer with each payment, or only at end? End-only = nasi'ah risk. (3) Ask: does the ETF hold physical gold you actually own, or is it a derivative?", "All three are fine -- gold is inherently Islamic", "Only (1). The others are automatically haram.", "(2) is best -- it builds savings discipline"], correct: 0, explanation: "Recommend the cleanest path + equip with the right QUESTIONS for alternatives. Adviser skill = don't just classify, enable investigation." , uiType: "advise"}
        ]
      },
        { id: 'lesson-1-5', title: "Gharar in Practice (Salam & Istisna')", description: "Buying what doesn't exist yet -- correctly", duration: "12 min",
        questions: [
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "What is the key purpose of a salam contract?", type: "multiple-choice", options: ["To buy goods that don't exist yet while eliminating gharar through full specification and prepayment", "To let the seller set the price at delivery", "To avoid paying upfront", "To guarantee handmade quality"], correct: 0, explanation: "Full prepayment + complete spec + fixed delivery = both sides know exactly what they've agreed to, even though goods aren't produced yet." , uiType: "mcq"},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "A specialty roaster offers: pay AED 600 now for 6 monthly deliveries of 1kg Ethiopian Yirgacheffe, medium roast, to your door, starting March. All specs in contract. Classification?", type: "multiple-choice", options: ["Gambling -- quality varies", "Valid salam -- full prepayment, fully specified, fixed delivery", "Gharar -- beans don't exist yet", "Murabaha -- there's a markup"], correct: 1, explanation: "Ticks every salam box. Beans not existing yet is the whole point -- salam is designed for exactly this." , uiType: "mcq"},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "Which combination correctly matches features to contract types? Full prepayment + standardised generic goods = ___. Staged milestone payments + custom-built bespoke item = ___.", type: "multiple-choice", options: ["Salam; Istisna'", "Istisna'; Salam", "Murabaha; Salam", "Istisna'; Murabaha"], correct: 0, explanation: "Salam = full upfront + generic. Istisna' = staged payments + bespoke. Payment timing + nature of goods = the two clearest differentiators." , uiType: "match"},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "Custom walnut bookshelf (istisna'): total price AED 4,500, terms: 40% upfront / 30% at frame / 30% on delivery. Calculate each payment.", type: "multiple-choice", options: ["AED 1,800 / AED 1,350 / AED 1,350", "AED 1,500 / AED 1,500 / AED 1,500", "AED 2,250 / AED 1,125 / AED 1,125", "AED 4,500 / AED 0 / AED 0"], correct: 0, explanation: "AED 4,500 Ô 40% = AED 1,800. AED 4,500 Ô 30% = AED 1,350 (twice). Istisna' accommodates exactly this kind of milestone structure for custom manufacturing." , uiType: "calc", visual: {calcSteps: ["Payment 1 (40%): AED 4,500 \u00d7 0.40 = AED [___]", "Payment 2 (30%): AED 4,500 \u00d7 0.30 = AED [___]", "Payment 3 (30%): AED 4,500 \u00d7 0.30 = AED [___]"], factChips: ["Total price: AED 4,500", "Terms: 40% / 30% / 30%"]}},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "Two date deals. Deal A: Pay AED 3,000 now for 200kg Medjool dates, Grade A, delivered Sept 15th to your warehouse. Deal B: Pay AED 3,000 now for \"whatever dates are available\" delivered \"sometime in Q4.\" Which has gharar?", type: "multiple-choice", options: ["Deal A -- paying upfront is always gharar", "Deal B -- type, grade, and delivery date all vague = material gharar", "Both are valid salam", "Neither has any issues"], correct: 1, explanation: "Deal A locks every essential = valid salam. Deal B leaves type, grade, and delivery date open = material gharar. Prepayment alone doesn't make salam; specification removes the gharar." , uiType: "compare", visual: {cards: [{title: "DEAL A", lines: ["Pay AED 3,000 now", "200kg Medjool dates", "Grade A", "Delivered: Sept 15th", "Location: Your warehouse", "\u2705 Fully specified"], neutralLines: ["Pay AED 3,000 now", "200kg Medjool dates, Grade A", "Delivered: Sept 15th", "Location: Your warehouse"], flag: false}, {title: "DEAL B", lines: ["Pay AED 3,000 now", "\"Whatever dates are available'", "Delivered: \"sometime in Q4'", "", "\ud83d\udea9 Vague?"], neutralLines: ["Pay AED 3,000 now", "Type: \"Whatever dates are available'", "Delivered: \"sometime in Q4'"], flag: true}]}},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "\"Salam Gold Certificates\": pay AED 10,000 upfront, receive \"gold OR equivalent cash value\" at the company's discretion after 12 months. What breaks the salam structure?", type: "multiple-choice", options: ["The upfront payment", "\"Gold OR equivalent cash value\" at company's discretion -- valid salam must specify the EXACT commodity; cash option introduces gharar and potential riba", "The 12-month timeframe", "The investment label"], correct: 1, explanation: "Valid salam must specify the EXACT commodity to be delivered. \"Gold or cash\" gives the seller discretion (gharar) and the cash option potentially turns this into money-in → more-money-out (riba). The name \"salam\" doesn't fix either defect." , uiType: "spot", visual: {mockup: {title: "\u2728 SALAM GOLD CERTIFICATES \u2728", lines: ["Pay: AED 10,000 upfront", "Receive: \"gold OR equivalent", "cash value\" at company's", "discretion after 12 months", "", "\"Your golden future starts here!'"], defectLine: 1}, factChips: ["Name: Salam Gold Certificates", "Label: Investment product"]}},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "What is the SINGLE clearest difference between salam and istisna'?", type: "multiple-choice", options: ["Salam requires specs; istisna' doesn't", "Salam requires full prepayment; istisna' allows staged payments", "Only istisna' has a delivery date", "Salam = expensive items; istisna' = cheap items"], correct: 1, explanation: "Both need specs and delivery terms. Payment timing + nature of goods = the distinguishers." , uiType: "mcq"},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "You prepaid (salam) AED 5,000 for 200kg Medjool dates, delivery in September. It's August and the price has spiked. A restaurant wants your batch. You do NOT have the dates yet. Can you sell?", type: "multiple-choice", options: ["Yes -- great deal", "Avoid selling before possession -- receive the dates first, then sell", "Yes, if the restaurant pays cash", "Yes, if the farmer agrees"], correct: 1, explanation: "\"Don't sell what you haven't received.\" Price, payment method, and farmer's consent don't fix the possession gap." , uiType: "mcq"},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "A gold refinery offers \"Gold Salam\": pay AED 25,000 now, receive 100g 24k gold in 6 months. This looks like salam -- but recall that gold is a ribawi commodity. Is there a conflict?", type: "multiple-choice", options: ["No -- salam covers everything", "Yes -- salam in ribawi commodities (gold, silver) is problematic because delayed delivery of a ribawi item against upfront cash raises riba al-nasi'ah concerns", "No issue -- price is fixed", "Fine if the refinery has an SSB"], correct: 1, explanation: "Salam works for non-ribawi goods (dates, coffee). But gold is ribawi -- and money-for-gold needs spot delivery to avoid nasi'ah. Many scholars prohibit salam in gold/silver for this reason. Cross-concept awareness is key." , uiType: "mcq"},
          { concept: "Salam and istisna' are Shariah-approved ways to buy something that doesn't exist yet -- salam requires full prepayment for specified generic goods, istisna' allows staged payments for custom-made items.\\n\\nSalam: pay full price NOW + specify goods completely (type/grade/quantity) + lock delivery date & place.\\nIstisna': custom build + clear specs + timeline + staged/milestone payments OK.\\n'Market price at delivery' = classic gharar. ALWAYS fix price at contract.\\n\\nAED 600 upfront for 6 monthly deliveries of 1kg Ethiopian coffee (grade, roast, schedule all specified) = salam. Custom bookshelf with 40/30/30 milestone payments = istisna'.", question: "A friend wants to start importing specialty olive oil from Turkey. The producer requires full prepayment. Oil ships 3 months later. Type, grade, quantity, packaging, delivery date all clearly specified. Best advice?", type: "multiple-choice", options: ["Looks like valid salam. Watch for: (1) Contract specifies EVERY detail. (2) Total price is FIXED -- no \"market price at delivery.\" (3) Don't sell the oil to someone else before you've received it.", "Don't do it -- paying upfront for future goods is always gharar", "It's fine, don't worry about details", "Only do it with a Shariah scholar's approval"], correct: 0, explanation: "Textbook salam done right. Practical watch-outs: full specification, fixed price, no selling before possession. Actionable guardrails she can verify herself." , uiType: "advise"}
        ]
      },
        { id: 'lesson-1-6', title: "Governance, Screening & Purification", description: "SSB oversight, equity screening, and tathir", duration: "12 min",
        questions: [
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "Match each governance role to its primary responsibility: SSB = ___. Management = ___. State Regulator = ___.", type: "multiple-choice", options: ["SSB → Shariah rulings & oversight; Management → Day-to-day operations; Regulator → Licensing & consumer protection", "SSB → Day-to-day operations; Management → Licensing; Regulator → Shariah rulings", "SSB → Licensing; Management → Shariah rulings; Regulator → Operations", "All three share identical responsibilities"], correct: 0, explanation: "Three layers, three jobs, three accountabilities. None replaces the others." , uiType: "match"},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "Which statement is most accurate about Shariah equity screening?", type: "multiple-choice", options: ["All providers use identical ratios", "Core sector exclusions (alcohol, pork, gambling) are widely shared", "Charity donations make any company compliant", "Conventional banks pass if profitable"], correct: 1, explanation: "Sector bans are consistent. Financial ratio thresholds vary. Charity ≠ compliance." , uiType: "mcq"},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "Your stockbroker auto-credits AED 14.25 interest on idle cash. You didn't request it. Cleanest response?", type: "multiple-choice", options: ["Keep it -- you didn't ask", "Pay extra zakat to offset", "Donate AED 14.25 to charity without intending reward (tathir)", "Close the entire account"], correct: 2, explanation: "Purify the exact amount. \"Didn't ask for it\" doesn't make it halal. Zakat ≠ purification." , uiType: "mcq"},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "Your Shariah-screened fund earned AED 18,000. The fund reports 2.4% non-compliant income. Calculate your purification amount. Does it count as zakat?", type: "multiple-choice", options: ["AED 432 purification; yes, it counts as zakat", "AED 432 purification; no -- zakat is a separate obligation on halal wealth", "AED 18,000 purification; yes", "No purification needed -- the fund handles it"], correct: 1, explanation: "AED 18,000 Ô 2.4% = AED 432. SSB oversight doesn't eliminate your purification duty. Separate obligations." , uiType: "calc", visual: {calcSteps: ["Purification = AED [___] \u00d7 [___]% = AED [___]", "Count as zakat? [Yes/No]"], factChips: ["Fund return: AED 18,000", "Non-compliant income: 2.4%"]}},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "Which of the following would cause a publicly listed company to FAIL a typical Shariah screen?", type: "multi-select", options: ["Core business: alcohol manufacturing", "Core business: conventional interest-based banking", "Earns 1.5% of revenue from interest on cash holdings (below threshold)", "Core business: operating casinos"], correct: [0, 1, 3], explanation: "Core haram sectors = automatic fail. Incidental 1.5% interest below threshold = purification, not failure." , uiType: "selall"},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "A startup's SSB rules a product non-compliant. Management launches it anyway with the label \"Shariah-Inspired™.\" Where is the governance failure?", type: "multiple-choice", options: ["The SSB ruling was wrong", "Management launching despite the SSB ruling -- SSB rulings are meant to be binding, not advisory", "The product label is fine", "The regulator should have stopped the SSB"], correct: 1, explanation: "SSB rulings are meant to be binding, not advisory. \"Shariah-Inspired™\" is not a compliance category. Management treating SSB as a suggestion box = governance breakdown." , uiType: "spot", visual: {mockup: {title: "Governance Scenario", lines: ["SSB RULING: \u274c Non-compliant", "", "MANAGEMENT ACTION: Launched anyway", "", "NEW LABEL: \"Shariah-Inspired\u2122'", "", "\ud83d\udea9 Where's the governance failure?"]}, factChips: ["SSB said no", "Management overrode"]}},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "You hold two funds. Fund A: return AED 12,000, non-compliant income 3.1%. Fund B: return AED 8,500, non-compliant income 1.6%. Calculate total purification.", type: "multiple-choice", options: ["AED 372 + AED 136 = AED 508", "AED 120 + AED 85 = AED 205", "AED 12,000 + AED 8,500 = AED 20,500", "No purification needed"], correct: 0, explanation: "Fund A: AED 12,000 Ô 3.1% = AED 372. Fund B: AED 8,500 Ô 1.6% = AED 136. Total: AED 508. Calculate each separately, then sum. Screening ≠ zero contamination." , uiType: "calc", visual: {calcSteps: ["Fund A: AED 12,000 \u00d7 3.1% = AED [___]", "Fund B: AED 8,500 \u00d7 1.6% = AED [___]", "TOTAL purification: AED [___]"], factChips: ["Fund A: AED 12,000 return, 3.1% NC", "Fund B: AED 8,500 return, 1.6% NC"]}},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "A fund holding was reclassified as non-compliant mid-year. SSB required sell-off within 90 days (done). Your total return: AED 6,000. Income from the non-compliant holding during its time in portfolio: AED 300. What's the right purification approach?", type: "multiple-choice", options: ["Nothing -- fund handled it", "Purify AED 300 from the non-compliant holding + standard purification % on remaining AED 5,700", "Purify entire AED 6,000", "Sue the fund"], correct: 1, explanation: "Fund acted correctly. But income earned during the non-compliant period still needs YOUR purification. Precise, specific -- not all-or-nothing." , uiType: "mcq"},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "A commodity fund uses salam to buy agricultural goods. It also enters \"parallel salam\" -- selling to third-party buyers via separate contracts BEFORE taking delivery. Is this permissible?", type: "multiple-choice", options: ["Always fine -- both contracts are independent", "Nuanced -- parallel salam is accepted IF contracts are genuinely independent and not conditional on each other. If the fund is simply flipping before possession, that violates the \"don't sell what you haven't received\" rule.", "All selling before delivery is prohibited", "Only the SSB decides"], correct: 1, explanation: "Independence of the two contracts is what makes/breaks it. Genuine obligation to source & deliver vs. flipping a paper claim." , uiType: "mcq"},
          { concept: "Islamic finance has a three-layer governance system -- regulator, management, and SSB -- supported by screening, purification, and your own due diligence.\\n\\nThree layers, three jobs: regulator (framework), management (operations), SSB (Shariah rulings & oversight). None replaces the others.\\nScreening uses shared sector exclusions + varying financial thresholds. 'Screened' ≠ 'zero contamination.'\\nPurification = donate exact non-compliant income amount, no reward intended. Zakat = separate duty on halal wealth. NEVER interchangeable.\\n\\nYour screened fund's report shows 2.4% non-compliant income. You calculate 2.4% of your returns, donate that amount (purification), then calculate zakat separately on your halal wealth.", question: "A first-time investor found a fund with: (1) sector exclusions, (2) SSB, (3) purification, (4) quarterly compliance reports. She asks: \"Is this enough?'", type: "multiple-choice", options: ["Strong checklist. Also: (1) Check WHO is on the SSB -- are they qualified? (2) READ the compliance report -- does it identify and resolve issues? (3) Understand the purification rate -- you'll need to purify your share. (4) \"Screened\" ≠ \"guaranteed halal\" -- personal due diligence still matters.", "SSB = done. Don't overthink it.", "None of that matters -- invest wherever returns are highest.", "Personally audit every holding."], correct: 0, explanation: "Informed engagement: trust the structure while understanding what it does and doesn't guarantee." , uiType: "advise"}
        ]
      }
      ]
    },
    { id: 'speed-round-1', title: "Speed Round", subtitle: "Rapid-fire compliance triage", icon: "\u26a1", color: "#7c3aed", difficulty: "Challenge", estimatedTime: "5 min", isSpeedRound: true,
      mascotMessage: "Think fast! Swipe to classify each scenario.",
      questions: [
        { question: "Loan: AED 5K. Return: AED 5.3K guaranteed. No asset.", type: "triage", answer: "nc", reasoning: "Riba -- guaranteed surplus on cash loan, no asset or service.", tags: ["riba"] },
        { question: "Prepaid AED 2K for 50kg jasmine rice, Grade A. Delivery: April 1, warehouse.", type: "triage", answer: "c", reasoning: "Valid salam -- full prepayment, specified goods, fixed delivery.", tags: ["salam"] },
        { question: "Mystery box: AED 150. Contents unknown. No returns.", type: "triage", answer: "nc", reasoning: "Gharar -- subject matter is materially unknown.", tags: ["gharar"] },
        { question: "Swap: 25g vs 22g, same 24k gold, both spot.", type: "triage", answer: "nc", reasoning: "Riba al-fadl -- unequal exchange of same ribawi commodity.", tags: ["riba"] },
        { question: "Storage locker: AED 200/month. Service: furniture storage.", type: "triage", answer: "c", reasoning: "Real service fee -- payment for physical space, not return on money.", tags: ["service"] },
        { question: "Deposit AED 10K. Return: 4% guaranteed. Principal protected.", type: "triage", answer: "nc", reasoning: "Interest -- guaranteed return + protected principal = riba.", tags: ["riba"] },
        { question: "Raffle: AED 50 ticket. Random winner gets AED 5K. Losers get nothing.", type: "triage", answer: "nc", reasoning: "Maysir -- wealth transfer by pure chance.", tags: ["maysir"] },
        { question: "AED to GBP at bureau de change. Both currencies: spot delivery.", type: "triage", answer: "c", reasoning: "Valid sarf -- different currencies, both delivered on the spot.", tags: ["sarf"] },
        { question: "Custom bookshelf. Exact specs. AED 3K. 40/30/30 milestone payments.", type: "triage", answer: "c", reasoning: "Valid istisna -- custom item, clear specs, staged payments.", tags: ["istisna"] },
        { question: "Screened fund. SSB. 2.1% non-compliant. Purification: investor's duty.", type: "triage", answer: "nmi", reasoning: "Structure looks OK -- but do YOU know to purify the 2.1%? Need more info.", tags: ["screening"] }
      ]
    },
    { id: 'module-2', title: "Trade Essentials", subtitle: "Rules of Valid Transactions", icon: "🤝", color: "#d97706", difficulty: "Intermediate", estimatedTime: "70 min", lessonCount: 6,
      mascotMessage: "Time to master the contracts that power Islamic finance!",
      lessons: [
        { id: 'lesson-2-1', title: "Valid Sale (Bay')", description: "Pillars & conditions of a lawful sale", duration: "12 min",
        questions: [
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "A valid Islamic sale requires five pillars. Which list is correct?", type: "multiple-choice", options: ["Seller, buyer, subject matter, price, offer & acceptance", "Seller, buyer, witnesses, notary, government stamp", "Buyer, price, marketing, delivery, warranty", "Subject matter, intention, charity, price, receipt"], correct: 0, explanation: "The five pillars: (1) Seller, (2) Buyer, (3) Subject matter (mabi'), (4) Price (thaman), (5) Offer & acceptance (ijab & qabul). Witnesses and documentation may be recommended but aren't pillars of the sale contract itself." , uiType: "mcq"},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "Your neighbour lists his car for sale at AED 45,000. You agree. He hands over the keys, you transfer the money. Which pillar is represented by the handshake and verbal agreement?", type: "multiple-choice", options: ["Price", "Subject matter", "Offer and acceptance (ijab & qabul)", "Ownership transfer"], correct: 2, explanation: "The handshake and verbal 'I sell / I buy' = offer & acceptance (ijab & qabul). This is the pillar that binds the contract. Without it, even if price and item are known, no sale exists." , uiType: "mcq"},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "A seller offers: 'Buy my shipment of electronics -- I'll tell you the price when it arrives.' What condition of a valid sale is violated?", type: "multiple-choice", options: ["The subject matter condition -- electronics are haram", "The price condition -- price must be known and fixed at contract", "The consent condition -- the buyer hasn't agreed", "No violation -- flexible pricing is fine"], correct: 1, explanation: "'Market price at delivery' or 'I'll tell you later' = unknown price at contract = gharar. The price must be determined and agreed upon at the time of the contract, not left open." , uiType: "mcq"},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "Ahmed finds a buyer for a rare watch he doesn't own yet. He plans to buy it from a dealer AFTER the buyer pays him. Is this valid?", type: "multiple-choice", options: ["Yes -- he'll get it eventually", "No -- selling what you don't own violates the ownership condition; the Prophet ﷺ said 'Do not sell what is not with you'", "Yes, if the buyer agrees to wait", "Only invalid if the watch doesn't exist"], correct: 1, explanation: "The hadith is explicit: 'Do not sell what is not with you' (la tabi' ma laysa 'indak). Ahmed must own the watch BEFORE selling it. The buyer's patience doesn't fix the ownership gap. This protects against selling what you can't deliver." , uiType: "mcq"},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "A man in severe debt is pressured into selling his home at half its value. The sale has all five pillars technically present. Is it valid?", type: "multiple-choice", options: ["Yes -- all pillars are present", "Voidable -- consent under duress or exploitation of desperation undermines genuine mutual agreement (taradi)", "Only invalid if violence was used", "Valid but morally discouraged"], correct: 1, explanation: "Technical presence of pillars isn't enough. Consent must be genuine (taradi). Exploiting someone's desperation corrupts the consent pillar. The Qur'an says: 'Do not consume one another's wealth unjustly' (Q 4:29). Coercion doesn't require physical violence." , uiType: "mcq"},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "Sort these into valid vs. invalid sale conditions.", type: "column-sort", columns: [{id: "valid", label: "Valid Sale Condition", color: "#059669", correct: ["Subject matter is known and specified", "Price is fixed at the time of contract", "Seller owns the item before selling", "Both parties consent freely"]}, {id: "invalid", label: "Invalid / Defective", color: "#dc2626", correct: ["Price determined at delivery", "Seller doesn't own the item yet", "Buyer coerced into the deal", "Subject matter is unknown"]}], items: ["Subject matter is known and specified", "Price determined at delivery", "Price is fixed at the time of contract", "Seller doesn't own the item yet", "Seller owns the item before selling", "Buyer coerced into the deal", "Both parties consent freely", "Subject matter is unknown"], explanation: "Valid sales need: known subject, fixed price, seller ownership, and free consent. Violating any of these creates a defective or void contract. These aren't formalities -- they protect both parties from injustice." , uiType: "drag-alloc", visual: {buckets: [{id: "valid", label: "Valid Condition", color: "#059669"}, {id: "invalid", label: "Invalid / Defective", color: "#dc2626"}], chips: [{text: "Subject matter is known and specified", correct: "valid"}, {text: "Price determined at delivery", correct: "invalid"}, {text: "Price is fixed at the time of contract", correct: "valid"}, {text: "Seller doesn't own the item yet", correct: "invalid"}, {text: "Seller owns the item before selling", correct: "valid"}, {text: "Buyer coerced into the deal", correct: "invalid"}, {text: "Both parties consent freely", correct: "valid"}, {text: "Subject matter is unknown", correct: "invalid"}]}},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "Two sale scenarios. Sale A: 'I'll sell you my laptop for AED 3,000. Here it is, inspect it.' Sale B: 'I'll sell you a laptop -- not sure which model yet -- for somewhere between AED 2,000 and AED 4,000.' Which has defects?", type: "multiple-choice", options: ["Sale A -- selling used goods is problematic", "Sale B -- both subject matter AND price are uncertain = double gharar", "Both are fine", "Both are defective"], correct: 1, explanation: "Sale A: known item, known price, available for inspection = clean. Sale B: model unknown + price range instead of fixed amount = gharar in both subject and price. Two pillars are compromised." , uiType: "compare", visual: {cards: [{title: "SALE A", lines: ["'I'll sell you my laptop'", "AED 3,000 fixed", "Item present for inspection", "", "\u2705 Clear terms"], neutralLines: ["Specific laptop offered", "AED 3,000 fixed price", "Item available for inspection"], flag: false}, {title: "SALE B", lines: ["'I'll sell you a laptop'", "Model: 'not sure yet'", "Price: 'AED 2,000-4,000'", "", "\ud83d\udea9 Uncertain?"], neutralLines: ["Unspecified laptop", "Model: unknown", "Price: AED 2,000-4,000 range"], flag: true}]}},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "The Prophet ﷺ prohibited certain sale practices. Match each prohibition to the correct reason.", type: "multiple-choice", options: ["Bay' al-najash (shill bidding) = manipulated consent; Bay' al-gharar (ambiguous sale) = unknown subject/price; Bay' al-ma'dum (selling non-existent goods) = no deliverability", "All three are the same prohibition", "Bay' al-najash = unknown price; Bay' al-gharar = shill bidding; Bay' al-ma'dum = manipulated consent", "None of these were actually prohibited"], correct: 0, explanation: "Three distinct prohibited practices: (1) Najash = fake bids to inflate price = consent manipulated. (2) Gharar sale = material ambiguity = parties can't consent to what they don't know. (3) Ma'dum = selling what doesn't exist = can't deliver. Different defects, different harms." , uiType: "match"},
          { concept: "A valid sale (bay') in Islam rests on five pillars: seller, buyer, subject matter, price, and offer & acceptance (ijab & qabul). Remove any pillar and there's no sale.\\n\\nThe subject must exist, be owned by the seller, be deliverable, and be known to both parties.\\nThe price must be fixed and known at contract -- 'market price at delivery' is gharar.\\nConsent must be genuine -- no coercion, deception, or exploitation of desperation.\\nSelling what you don't own or can't deliver is void -- the Prophet ﷺ said: 'Do not sell what is not with you.'\\n\\nThink of buying a car: you see it, agree on AED 45,000, shake hands (offer & acceptance), and exchange keys for payment. Every pillar is present.", question: "Your friend is opening a small online store. She asks: 'What do I need to know about selling the Islamic way?' Best advice?", type: "multiple-choice", options: ["(1) Own or have possession of items BEFORE listing them for sale. (2) Describe products accurately -- no hidden defects, no fake reviews. (3) Fix clear prices -- no bait-and-switch. (4) Don't pressure buyers with fake scarcity or shill reviews. Honest trade is worship.", "(1) Just say bismillah before each sale. (2) Give charity from profits. (3) The rest will take care of itself.", "(1) Sell only Islamic products. (2) Only sell to Muslims. (3) Avoid online selling entirely.", "(1) Copy what other successful sellers do. (2) Maximise profit -- that's the point of trade."], correct: 0, explanation: "Practical guardrails rooted in the pillars: ownership before sale, truthful description (no gharar), fixed pricing (no bait-and-switch), genuine consent (no manipulation). Islamic commercial ethics aren't extra -- they're the baseline for all trade." , uiType: "advise"}
        ]
      },
        { id: 'lesson-2-2', title: "Murabaha Deep Dive", description: "Cost-plus financing: how it works and where it breaks", duration: "12 min",
        questions: [
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "What is the core structure of a murabaha transaction?", type: "multiple-choice", options: ["A loan with interest relabelled as 'profit'", "The bank buys an asset, then resells it to the customer at cost plus a disclosed markup", "A lease agreement with an option to buy", "A profit-sharing partnership"], correct: 1, explanation: "Murabaha = cost-plus sale. The bank purchases the asset first (taking ownership and risk), then sells it to you at a known, fixed total price. This is fundamentally a SALE, not a loan." , uiType: "mcq"},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "A murabaha car deal has 4 steps. Which step carries the CRITICAL compliance requirement?", type: "multiple-choice", options: ["Step 1: Customer identifies the car they want", "Step 2: Bank purchases the car from the dealer and takes ownership", "Step 3: Bank sells the car to customer at cost + markup", "Step 4: Customer pays in instalments"], correct: 1, explanation: "Step 2 is the compliance backbone. If the bank never truly owns the car -- never bears the risk of it being damaged or defective while in their possession -- then Steps 3-4 are just a loan in disguise. Real ownership = real risk = legitimate markup." , uiType: "flow-tap", visual: {steps: [{num: 1, title: "Customer identifies the car they want", ok: true}, {num: 2, title: "Bank purchases the car from dealer and takes ownership", ok: true, flag: "⭐ KEY"}, {num: 3, title: "Bank sells car to customer at cost + markup", ok: true}, {num: 4, title: "Customer pays in instalments", ok: true}]}},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "Bank offers murabaha on a laptop. Cost: AED 5,000. Markup: 10%. Total: AED 5,500. Paid over 12 months. But the fine print says: 'Rate may be adjusted quarterly based on EIBOR.' What's the problem?", type: "multiple-choice", options: ["The markup is too high", "The payment period is too long", "Floating rate adjustments after contract violate the fixed-price requirement -- this turns a sale into a variable-rate loan", "No problem -- banks need flexibility"], correct: 2, explanation: "Murabaha requires a FIXED total sale price agreed at contract. If the rate adjusts quarterly, the total price is no longer known at contract. This is the exact gap between genuine murabaha and a disguised floating-rate loan." , uiType: "spot", visual: {mockup: {title: "Murabaha Laptop Plan", lines: ["Cost: AED 5,000", "Markup: 10%", "Total: AED 5,500", "12 monthly instalments", "\u23f0 Rate adjusted quarterly (EIBOR)", "\u2705 SSB-approved branding"], defectIndex: 4}, factChips: ["EIBOR = Emirates Interbank Offered Rate", "Changes every quarter"]}},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "You're buying a car via murabaha. Cost: AED 80,000. Markup: 15%. Calculate the total sale price and each monthly instalment over 48 months.", type: "multiple-choice", options: ["Total: AED 92,000; Monthly: AED 1,916.67", "Total: AED 88,000; Monthly: AED 1,833.33", "Total: AED 80,000; Monthly: AED 1,666.67", "Total: AED 96,000; Monthly: AED 2,000.00"], correct: 0, explanation: "AED 80,000 × 1.15 = AED 92,000 total. AED 92,000 ÷ 48 = AED 1,916.67/month. This total is FIXED at contract -- it doesn't change regardless of what happens to interest rates." , uiType: "calc", visual: {calcSteps: ["Total = AED [___] × 1.[___] = AED [___]", "Monthly = AED [___] ÷ [___] = AED [___]"], factChips: ["Car cost: AED 80,000", "Markup: 15%", "Term: 48 months"]}},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "During murabaha, the car is damaged in a flood WHILE the bank still owns it (before selling to customer). Who bears the loss?", type: "multiple-choice", options: ["The customer -- they ordered it", "The bank -- they own it, so the risk is theirs", "The dealer -- they originally sold it", "Split 50/50"], correct: 1, explanation: "Ownership = risk. If the bank owns the asset and it's destroyed, that's the bank's loss. This is the EXACT risk that justifies the markup. No risk = no legitimate return. This is al-ghurm bil-ghunm in action." , uiType: "mcq"},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "Commodity murabaha (tawarruq): Bank buys aluminium on London Metal Exchange → sells it to you at markup → you immediately sell aluminium on market for cash. You never see the aluminium. What's the controversy?", type: "multiple-choice", options: ["Aluminium is haram", "The commodity is just a pass-through to generate cash -- if no one intends to actually use the commodity, this gets close to 'cash loan with extra steps'", "The London Metal Exchange isn't Shariah-compliant", "No controversy -- this is perfectly clean"], correct: 1, explanation: "Tawarruq is the most debated structure in Islamic finance. The commodity serves no economic purpose -- it's a legal device to turn a loan into two 'sales.' Some scholars accept it as a necessity; others (including AAOIFI in 2009) declared organised tawarruq impermissible. The closer to 'loan with extra steps,' the weaker the compliance argument." , uiType: "mcq"},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "Sort these features: which make a murabaha genuine vs. which are red flags that it's a disguised loan?", type: "column-sort", columns: [{id: "genuine", label: "Genuine Murabaha", color: "#059669", correct: ["Bank owns the asset before reselling", "Total price fixed at contract signing", "Bank bears risk while it owns the asset", "Markup is disclosed to the customer"]}, {id: "redflag", label: "Red Flag 🚩", color: "#dc2626", correct: ["Bank never takes title to the asset", "Rate adjusts quarterly based on benchmark", "Customer signs before bank purchases", "Asset goes directly from dealer to customer (bank never possesses)"]}], items: ["Bank owns the asset before reselling", "Bank never takes title to the asset", "Total price fixed at contract signing", "Rate adjusts quarterly based on benchmark", "Bank bears risk while it owns the asset", "Customer signs before bank purchases", "Markup is disclosed to the customer", "Asset goes directly from dealer to customer (bank never possesses)"], explanation: "Genuine murabaha: real ownership, real risk, fixed price, transparent markup. Red flags: skipped ownership, floating rates, pre-signed contracts, no actual possession. Each red flag moves the structure closer to a conventional loan with Islamic labelling." , uiType: "drag-alloc", visual: {buckets: [{id: "genuine", label: "Genuine Murabaha", color: "#059669"}, {id: "redflag", label: "Red Flag \ud83d\udea9", color: "#dc2626"}], chips: [{text: "Bank owns the asset before reselling", correct: "genuine"}, {text: "Bank never takes title to the asset", correct: "redflag"}, {text: "Total price fixed at contract signing", correct: "genuine"}, {text: "Rate adjusts quarterly based on benchmark", correct: "redflag"}, {text: "Bank bears risk while it owns the asset", correct: "genuine"}, {text: "Customer signs before bank purchases", correct: "redflag"}, {text: "Markup is disclosed to the customer", correct: "genuine"}, {text: "Asset goes directly from dealer to customer (bank never possesses)", correct: "redflag"}]}},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "Your sister wants to buy furniture through an Islamic bank's murabaha plan. Furniture costs AED 12,000, bank markup is 8%, paid over 24 months. She asks: 'How is this different from a regular instalment plan with 8% interest?' What's your answer?", type: "multiple-choice", options: ["(1) The bank BUYS the furniture first -- owns it, bears risk if it's damaged. (2) The total AED 12,960 is fixed forever -- no rate changes. (3) You're repaying a SALE price, not a loan + interest. If the bank skips ownership or adjusts rates later, THAT's when it becomes a relabelled loan.", "There's no real difference -- it's the same thing with an Arabic name", "The bank prays over the furniture, making it halal", "It's different because Islamic banks don't make profit"], correct: 0, explanation: "The structural difference: ownership transfer + risk bearing + fixed sale price. If these are genuine, it's a sale. If they're bypassed, it's a loan in disguise. The 8% is a sale markup, not interest -- but ONLY if the ownership step is real. Numbers can be similar; structure must be different." , uiType: "advise"},
          { concept: "Murabaha is a sale where the bank buys an asset, then sells it to you at cost + disclosed markup. The bank must genuinely own the asset (even briefly) and bear its risk before reselling. Without real ownership, murabaha collapses into a disguised loan.\\n\\nThree non-negotiables: (1) Bank must purchase and own the asset first. (2) Total price (cost + markup) is FIXED at contract -- no floating rate. (3) Risk must transfer with ownership -- if the asset is destroyed while bank-owned, that's the bank's loss.\\n\\nCommodity murabaha (tawarruq): bank buys commodity → sells to you at markup → you sell commodity on market for cash. Controversial because the commodity is just a pass-through to generate cash -- the closer it gets to 'loan with extra steps,' the weaker the compliance.", question: "Two murabaha offers for the same AED 60,000 car. Bank A: owns the car for 3 days, fixed total AED 69,000 over 36 months. Bank B: never takes title, rate adjusts semi-annually, car delivered directly from dealer. Which is more compliant?", type: "multiple-choice", options: ["Bank B -- more efficient process", "Bank A -- genuine ownership, fixed price; Bank B has skipped the ownership step and introduced a floating rate", "Both are equally compliant", "Neither is compliant"], correct: 1, explanation: "Bank A: owns the asset (3 days is fine), fixed price = genuine murabaha. Bank B: no title transfer + floating rate = two critical failures. Efficiency doesn't override structural integrity." , uiType: "compare", visual: {cards: [{title: "BANK A", lines: ["Owns car for 3 days", "Fixed total: AED 69,000", "36 monthly payments", "Title transfers to bank first", "\u2705 Fixed price"], neutralLines: ["Ownership: 3 days", "Total: AED 69,000 fixed", "36 months", "Title: Bank → Customer"], flag: false}, {title: "BANK B", lines: ["Never takes title to car", "Rate adjusts semi-annually", "Car: dealer → customer directly", "", "\ud83d\udea9 Issues?"], neutralLines: ["Ownership: Never", "Rate: Semi-annual adjustment", "Delivery: Direct from dealer"], flag: true}]}}
        ]
      },
        { id: 'lesson-2-3', title: "Ijara (Leasing)", description: "Using without owning -- and doing it right", duration: "12 min",
        questions: [
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "In an ijara contract, who retains ownership of the asset?", type: "multiple-choice", options: ["The lessee (tenant/user)", "The lessor (owner)", "Shared ownership", "Ownership is irrelevant in leasing"], correct: 1, explanation: "The lessor retains ownership. The lessee pays for the RIGHT TO USE the asset, not for the asset itself. This is the fundamental distinction between a lease and a sale." , uiType: "mcq"},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "A car breaks down due to engine failure (manufacturing defect) during an ijara lease. Who pays for the repair?", type: "multiple-choice", options: ["The lessee -- they were driving it", "The lessor -- major/structural repairs are an ownership obligation", "Split equally", "Depends on the mileage"], correct: 1, explanation: "The lessor owns the asset and bears ownership-related costs: structural defects, major repairs, insurance. The lessee handles day-to-day operational costs (fuel, tyres, cleaning). Engine failure from a manufacturing defect is clearly an ownership cost." , uiType: "mcq"},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "Sort these maintenance obligations between lessor and lessee.", type: "column-sort", columns: [{id: "lessor", label: "Lessor (Owner)", color: "#0284c7", correct: ["Roof repair (structural)", "Insurance premium", "Engine replacement (defect)", "Major plumbing overhaul"]}, {id: "lessee", label: "Lessee (User)", color: "#d97706", correct: ["Replacing lightbulbs", "Daily cleaning", "Fuel / consumables", "Minor wear-and-tear fixes"]}], items: ["Roof repair (structural)", "Replacing lightbulbs", "Insurance premium", "Daily cleaning", "Engine replacement (defect)", "Fuel / consumables", "Major plumbing overhaul", "Minor wear-and-tear fixes"], explanation: "Ownership costs (structural, insurance, major defects) stay with the lessor. Operational/usage costs (consumables, cleaning, minor wear) go to the lessee. This allocation reflects WHO benefits from what: the owner benefits from the asset's existence; the user benefits from its daily function." , uiType: "drag-alloc", visual: {buckets: [{id: "lessor", label: "Lessor (Owner)", color: "#0284c7"}, {id: "lessee", label: "Lessee (User)", color: "#d97706"}], chips: [{text: "Roof repair (structural)", correct: "lessor"}, {text: "Replacing lightbulbs", correct: "lessee"}, {text: "Insurance premium", correct: "lessor"}, {text: "Daily cleaning", correct: "lessee"}, {text: "Engine replacement (defect)", correct: "lessor"}, {text: "Fuel / consumables", correct: "lessee"}, {text: "Major plumbing overhaul", correct: "lessor"}, {text: "Minor wear-and-tear fixes", correct: "lessee"}]}},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "An ijara contract says: 'Rent is AED 2,500/month for the first year. After that, rent will be adjusted to market rate.' What's the issue?", type: "multiple-choice", options: ["AED 2,500 is too high", "No issue -- market-rate adjustments are standard", "'Market rate' after year 1 is gharar -- rent must be known for the full contract period, or adjustment mechanisms must be clearly defined at contract", "The issue is the 1-year lock-in"], correct: 2, explanation: "Rent must be known and determinable. 'Market rate' is vague -- which market? Whose assessment? When? If adjustments are needed, the contract must specify the mechanism clearly (e.g., 'CPI + 2%' or 'fixed 5% annual increase'). Open-ended 'market rate' = gharar." , uiType: "spot", visual: {mockup: {title: "Ijara Lease Agreement", lines: ["Year 1: AED 2,500/month \u2705", "Year 2+: \"Adjusted to market rate'", "", "\ud83d\udea9 What does 'market rate' mean?"], defectLine: 1}, factChips: ["Year 1: Clear", "Year 2+: Undefined adjustment"]}},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "What is 'ijara muntahia bit-tamlik' (IMBT)?", type: "multiple-choice", options: ["A regular rental with no end date", "A lease that ends with ownership transfer to the lessee -- via gift or token-price sale at the end", "A sale disguised as a lease", "A lease where the lessee can never own the asset"], correct: 1, explanation: "IMBT = 'lease ending with ownership.' The lessee leases the asset for a period, and at the end, ownership transfers (usually as a gift or for a nominal amount). Common in Islamic home and vehicle finance. It's two contracts: a lease + a promise to transfer ownership." , uiType: "mcq"},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "In an IMBT home finance: bank buys house (AED 1,000,000), leases it to you for 20 years (rent: AED 5,000/month), then transfers ownership for AED 1. Calculate total rent paid over 20 years.", type: "multiple-choice", options: ["AED 1,200,000", "AED 1,000,000", "AED 600,000", "AED 1,200,001"], correct: 3, explanation: "AED 5,000 × 12 months × 20 years = AED 1,200,000 in rent + AED 1 transfer = AED 1,200,001 total. The bank earns through rent (legitimate return on an asset it owns), not interest on a loan. The AED 200,000 difference from the purchase price represents the bank's return for providing the asset over 20 years." , uiType: "calc", visual: {calcSteps: ["Monthly rent × 12 × 20 = AED [___]", "Transfer fee: AED [___]", "Total: AED [___]"], factChips: ["House cost: AED 1,000,000", "Monthly rent: AED 5,000", "Term: 20 years", "Transfer price: AED 1"]}},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "An ijara contract states: 'If the asset is destroyed by fire, the lessee must continue paying rent for the remaining term.' Is this clause valid?", type: "multiple-choice", options: ["Yes -- the lessee signed the contract", "No -- if the asset is destroyed, there's nothing to lease; rent for a non-existent usufruct is not permissible", "Valid if the lessee caused the fire", "Valid if insurance covers it"], correct: 1, explanation: "Rent is payment for USAGE. If the asset no longer exists, there's no usufruct to pay for. Continuing to charge rent for a destroyed asset = collecting money for nothing. The lessor bears the destruction risk as owner. If the lessee negligently caused damage, that's a separate liability claim -- not continued rent." , uiType: "mcq"},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "Two home finance options. Option A (Ijara): bank owns the house, you pay AED 4,500/month rent for 25 years, ownership transfers at end for AED 1. Option B (Conventional mortgage): bank lends you money, you repay with 4.5% interest, bank has a lien on your house. Key structural difference?", type: "multiple-choice", options: ["No structural difference -- same monthly payment", "In A, the bank OWNS the house (bears destruction risk, handles structural repairs); in B, YOU own the house and the bank just lent money secured by it", "Option B is more Islamic because you own the house from day 1", "The only difference is the label"], correct: 1, explanation: "Ownership location is everything. In ijara: bank owns → bank bears asset risk → rent is payment for use. In mortgage: bank lent money → bank's return is interest on the loan → your house is collateral. Similar cash flows; fundamentally different structures. The bank's obligations (repairs, insurance, destruction risk) are the proof that ownership is real." , uiType: "compare", visual: {cards: [{title: "OPTION A: Ijara", lines: ["Bank OWNS the house", "You pay rent: AED 4,500/month", "Bank handles structural repairs", "Ownership transfers at end", "Bank bears destruction risk"], neutralLines: ["Owner: Bank", "Rent: AED 4,500/month", "Structural repairs: Bank", "End: Ownership transfers"], flag: false}, {title: "OPTION B: Mortgage", lines: ["YOU own the house (bank has lien)", "You repay loan + 4.5% interest", "All repairs: your responsibility", "Bank's security: your house", "Bank bears no asset risk"], neutralLines: ["Owner: You", "Repayment: Loan + 4.5%", "All repairs: You", "Bank security: Lien on house"], flag: true}]}},
          { concept: "Ijara is a lease: the owner (lessor) grants the right to USE an asset for a set period and price, while retaining ownership and its obligations. The lessee pays for usage, not ownership.\\n\\nOwner keeps: structural maintenance, insurance, major repairs (ownership costs).\\nLessee handles: day-to-day upkeep, operational wear.\\nRent must be known and fixed for the contract period -- 'market rate as we go' = gharar.\\nIjara muntahia bit-tamlik (IMBT) = lease ending with ownership transfer (gift or token sale at end).\\n\\nRenting an apartment: landlord fixes the roof (structural), you replace lightbulbs (operational). That's ijara logic.", question: "Your cousin is choosing between an Islamic bank's IMBT home finance and a conventional mortgage. Both have similar monthly payments. She says: 'If the numbers are the same, what's the point?' Best response?", type: "multiple-choice", options: ["(1) Numbers CAN be similar -- the difference is WHO owns the house and WHO bears asset risk. (2) With ijara, the bank owns it and must handle structural issues. With a mortgage, you own it but owe a loan with interest. (3) Test: if the house burns down, an Islamic bank loses its asset; a conventional bank still wants its loan repaid. That's the structural proof.", "You're right -- there's no real difference, just pick the cheaper one", "Islamic finance is always more expensive, so go conventional", "The difference is spiritual only -- both work the same way legally"], correct: 0, explanation: "Similar numbers ≠ same structure. The ownership test (who bears destruction risk, who pays for major repairs) is the proof. If a house burns down under ijara, the bank lost its property. Under a mortgage, the bank still wants its loan back. That single test reveals whether it's a genuine asset arrangement or just a relabelled loan." , uiType: "advise"}
        ]
      },
        { id: 'lesson-2-4', title: "Musharakah & Mudarabah", description: "Partnership-based finance and profit sharing", duration: "12 min",
        questions: [
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "In a musharakah partnership, how are LOSSES distributed?", type: "multiple-choice", options: ["Equally regardless of capital", "By the agreed profit-sharing ratio", "Strictly by each partner's capital contribution ratio", "The managing partner absorbs all losses"], correct: 2, explanation: "Losses follow capital -- always. If you contributed 40% of capital, you bear 40% of losses. This is a firm Shariah rule. Profit ratios can be negotiated (to reward effort/expertise), but loss ratios MUST match capital ratios." , uiType: "mcq"},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "Musharakah venture: Partner A contributes AED 200,000 (66.7%), Partner B contributes AED 100,000 (33.3%). Agreed profit split: 60/40 (A gets 60%). The business makes AED 30,000 profit. How much does each partner receive?", type: "multiple-choice", options: ["A: AED 18,000; B: AED 12,000", "A: AED 20,000; B: AED 10,000", "A: AED 15,000; B: AED 15,000", "A: AED 30,000; B: AED 0"], correct: 0, explanation: "Profit by AGREED ratio: A gets 60% × AED 30,000 = AED 18,000. B gets 40% × AED 30,000 = AED 12,000. Note: the profit ratio (60/40) differs from the capital ratio (66.7/33.3) -- this is allowed to reward B's management efforts." , uiType: "calc", visual: {calcSteps: ["Partner A profit: AED 30,000 × [___]% = AED [___]", "Partner B profit: AED 30,000 × [___]% = AED [___]"], factChips: ["A capital: AED 200,000 (66.7%)", "B capital: AED 100,000 (33.3%)", "Profit split: 60/40", "Total profit: AED 30,000"]}},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "Same venture loses AED 15,000. How is the loss distributed?", type: "multiple-choice", options: ["A: AED 9,000; B: AED 6,000 (by profit ratio 60/40)", "A: AED 10,000; B: AED 5,000 (by capital ratio 66.7/33.3)", "A: AED 7,500; B: AED 7,500 (equal split)", "B: AED 15,000 (junior partner bears all losses)"], correct: 1, explanation: "Losses ALWAYS follow capital ratio. A contributed 66.7% → bears AED 10,000. B contributed 33.3% → bears AED 5,000. The 60/40 profit agreement is irrelevant for losses. This is the Shariah safeguard: you can't push losses onto someone who contributed less capital." , uiType: "calc", visual: {calcSteps: ["Partner A loss: AED 15,000 × [___]% = AED [___]", "Partner B loss: AED 15,000 × [___]% = AED [___]", "Loss ratio = [profit ratio / capital ratio]?"], factChips: ["A capital: 66.7%", "B capital: 33.3%", "Total loss: AED 15,000", "Rule: Losses follow CAPITAL"]}},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "How does mudarabah differ from musharakah?", type: "multiple-choice", options: ["In mudarabah, one partner provides ONLY capital (rabb al-mal) and the other provides ONLY labour/expertise (mudarib) -- no capital from the mudarib", "They're the same thing", "Mudarabah requires government approval", "Mudarabah is only for large corporations"], correct: 0, explanation: "Musharakah = all partners contribute capital. Mudarabah = one side capital, one side labour. The mudarib contributes skill and effort, not money. This division defines who bears what: capital losses fall on the rabb al-mal; the mudarib loses their time and effort." , uiType: "mcq"},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "A mudarabah investment: investor provides AED 500,000. Fund manager (mudarib) provides expertise. Agreed profit split: 70% investor / 30% mudarib. The fund loses AED 40,000. Who bears the loss?", type: "multiple-choice", options: ["Split 70/30 like profits", "The investor bears the full AED 40,000 capital loss; the mudarib loses only their time and effort", "The mudarib bears the full loss", "Split 50/50"], correct: 1, explanation: "In mudarabah, capital losses fall ONLY on the capital provider (rabb al-mal). The mudarib's loss is their effort and time -- they don't owe money they never contributed. This is fair: the mudarib risked their labour; the investor risked their capital." , uiType: "mcq"},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "A 'mudarabah' investment guarantees the investor 8% annually, regardless of business performance. The capital provider can never lose money. Is this valid mudarabah?", type: "multiple-choice", options: ["Yes -- guaranteed returns protect the investor", "No -- a guaranteed return turns mudarabah into a loan with interest; genuine mudarabah requires actual profit-and-loss exposure", "Valid if the mudarib agrees to guarantee", "Valid if an SSB approves"], correct: 1, explanation: "Guaranteed return = no risk = no legitimate profit sharing. This is functionally a loan: money in → guaranteed surplus out. Mudarabah REQUIRES that returns vary with actual performance. A mudarib guaranteeing capital turns themselves into a borrower, and the 'profit share' into interest." , uiType: "mcq"},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "Diminishing musharakah for a home: bank owns 80%, you own 20%. Over 15 years, you buy the bank's share gradually. Each payment has two parts: (1) rent on the bank's portion and (2) purchase of a further share. After 5 years, you've bought an additional 30%. What's the new ownership split?", type: "multiple-choice", options: ["Bank: 50%, You: 50%", "Bank: 80%, You: 20%", "Bank: 30%, You: 70%", "Bank: 0%, You: 100%"], correct: 0, explanation: "Start: Bank 80%, You 20%. You bought 30% more. Bank: 80% - 30% = 50%. You: 20% + 30% = 50%. As your share grows, you pay LESS rent (because the bank owns less). This is the elegance of diminishing musharakah: your rent decreases as your ownership increases." , uiType: "calc", visual: {calcSteps: ["Bank start: [___]%", "You bought: [___]%", "Bank now: [___]% - [___]% = [___]%", "You now: [___]% + [___]% = [___]%"], factChips: ["Start: Bank 80% / You 20%", "Additional purchased: 30%", "Time elapsed: 5 years"]}},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "Sort these features into musharakah vs. mudarabah.", type: "column-sort", columns: [{id: "mush", label: "Musharakah", color: "#059669", correct: ["All partners contribute capital", "Losses shared by capital ratio", "All partners may manage", "Profit ratio can differ from capital ratio"]}, {id: "mud", label: "Mudarabah", color: "#0284c7", correct: ["One side: capital only", "Other side: labour/expertise only", "Capital losses: capital provider only", "Mudarib loses time & effort, not money"]}], items: ["All partners contribute capital", "One side: capital only", "Losses shared by capital ratio", "Other side: labour/expertise only", "All partners may manage", "Capital losses: capital provider only", "Profit ratio can differ from capital ratio", "Mudarib loses time & effort, not money"], explanation: "Musharakah: all contribute capital, all may manage, losses by capital ratio. Mudarabah: one side capital, one side labour, capital losses on capital provider. These aren't just academic distinctions -- they determine who bears what risk and who has what rights." , uiType: "drag-alloc", visual: {buckets: [{id: "mush", label: "Musharakah", color: "#059669"}, {id: "mud", label: "Mudarabah", color: "#0284c7"}], chips: [{text: "All partners contribute capital", correct: "mush"}, {text: "One side: capital only", correct: "mud"}, {text: "Losses shared by capital ratio", correct: "mush"}, {text: "Other side: labour/expertise only", correct: "mud"}, {text: "All partners may manage", correct: "mush"}, {text: "Capital losses: capital provider only", correct: "mud"}, {text: "Profit ratio can differ from capital ratio", correct: "mush"}, {text: "Mudarib loses time & effort, not money", correct: "mud"}]}},
          { concept: "Musharakah and mudarabah are partnership contracts where returns come from sharing actual business results -- not from guaranteed interest.\\n\\nMusharakah: ALL partners contribute capital AND may manage. Profits split by agreed ratio. Losses split strictly by capital ratio.\\nMudarabah: one partner provides capital (rabb al-mal), the other provides expertise/labour (mudarib). Profits by agreed ratio. Capital losses fall on the capital provider ONLY (mudarib loses effort).\\nDiminishing musharakah: bank + you co-own an asset; you gradually buy out the bank's share over time.\\n\\nYour friend puts AED 100K and you put AED 50K into a restaurant. Profits: agreed 60/40. Losses: always 67/33 (matching capital ratio). That's musharakah.", question: "A friend is starting a bakery. He has the skills but no money. You have AED 150,000 but no baking expertise. He proposes: you put up the capital, he runs the business, profits split 60/40 (you/him). What type of contract is this, and what should you watch for?", type: "multiple-choice", options: ["This is a mudarabah. Watch for: (1) profits must come from actual business results -- no guarantee. (2) If the bakery loses money, YOU bear capital losses; he loses his effort. (3) He must not mix your funds with his personal money. (4) Set clear reporting intervals.", "This is musharakah -- refuse unless he also puts in capital", "Don't do it -- partnerships are always haram", "Accept but demand a guaranteed 10% return"], correct: 0, explanation: "Classic mudarabah: you = rabb al-mal (capital), he = mudarib (expertise). Practical guardrails: no guaranteed return, clear profit calculation, segregated funds, regular reporting. Demanding a guarantee would convert this into a loan." , uiType: "advise"}
        ]
      },
        { id: 'lesson-2-5', title: "Takaful (Cooperative Insurance)", description: "Protection without gambling -- how takaful works", duration: "12 min",
        questions: [
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "What is the core structural difference between conventional insurance and takaful?", type: "multiple-choice", options: ["Takaful is more expensive", "Conventional = risk TRANSFER to a company for profit; Takaful = risk SHARING among participants through mutual contributions", "They're the same with different names", "Takaful doesn't pay claims"], correct: 1, explanation: "Conventional insurance: company accepts your risk in exchange for premium (the company profits from the risk gap). Takaful: participants pool contributions (tabarru') and share risk collectively. The operator manages the pool but doesn't own it or profit from claims not being made." , uiType: "mcq"},
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "In takaful, what is 'tabarru'?", type: "multiple-choice", options: ["The operator's profit margin", "A donation/contribution by each participant into the common risk pool", "A government tax on insurance", "The claim payout amount"], correct: 1, explanation: "Tabarru' = voluntary donation to the shared pool. This donation structure removes the exchange-of-risk-for-money element that creates gharar in conventional insurance. You're donating to help others in the group, and they donate to help you." , uiType: "mcq"},
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "A takaful fund collected AED 2,000,000 in contributions. Claims paid: AED 1,200,000. Management expenses: AED 300,000. What happens to the AED 500,000 surplus?", type: "multiple-choice", options: ["The operator keeps it as profit", "It belongs to participants -- distributed back to them or carried forward to the pool", "Donated to charity automatically", "Paid to the government"], correct: 1, explanation: "AED 2,000,000 - AED 1,200,000 - AED 300,000 = AED 500,000 surplus. This belongs to the PARTICIPANTS, not the operator. It's either distributed back proportionally or kept in the pool to reduce future contributions. This is a key structural difference from conventional insurance, where surplus = insurer profit." , uiType: "calc", visual: {calcSteps: ["Contributions: AED [___]", "Claims: AED [___]", "Expenses: AED [___]", "Surplus: AED [___] - AED [___] - AED [___] = AED [___]", "Surplus belongs to: [operator/participants]?"], factChips: ["Contributions: AED 2,000,000", "Claims: AED 1,200,000", "Expenses: AED 300,000"]}},
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "Sort these features into conventional insurance vs. takaful.", type: "column-sort", columns: [{id: "conv", label: "Conventional Insurance", color: "#dc2626", correct: ["Company owns the premium pool", "Surplus = company profit", "Risk transferred to insurer", "Funds invested in any asset class"]}, {id: "takaful", label: "Takaful", color: "#059669", correct: ["Participants own the pool via tabarru'", "Surplus returned to participants", "Risk shared among participants", "Funds invested in Shariah-compliant assets"]}], items: ["Company owns the premium pool", "Participants own the pool via tabarru'", "Surplus = company profit", "Surplus returned to participants", "Risk transferred to insurer", "Risk shared among participants", "Funds invested in any asset class", "Funds invested in Shariah-compliant assets"], explanation: "Every feature pair highlights a structural difference: ownership of pool, destination of surplus, direction of risk, and investment criteria. These aren't cosmetic rebranding -- they fundamentally change the incentive structure." , uiType: "drag-alloc", visual: {buckets: [{id: "conv", label: "Conventional", color: "#dc2626"}, {id: "takaful", label: "Takaful", color: "#059669"}], chips: [{text: "Company owns the premium pool", correct: "conv"}, {text: "Participants own the pool via tabarru'", correct: "takaful"}, {text: "Surplus = company profit", correct: "conv"}, {text: "Surplus returned to participants", correct: "takaful"}, {text: "Risk transferred to insurer", correct: "conv"}, {text: "Risk shared among participants", correct: "takaful"}, {text: "Funds invested in any asset class", correct: "conv"}, {text: "Funds invested in Shariah-compliant assets", correct: "takaful"}]}},
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "In the wakalah model, how does the takaful operator earn money?", type: "multiple-choice", options: ["By keeping unclaimed premiums", "Through a fixed management fee (wakala fee) charged to the pool for administrative services", "By investing participant funds in conventional markets", "By denying claims"], correct: 1, explanation: "Wakalah = agency. The operator acts as an agent for participants and earns a pre-agreed fee for managing the pool, processing claims, and handling administration. Their income is the fee -- not the underwriting result. This separates the operator's earnings from the claims outcome." , uiType: "mcq"},
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "A 'takaful' product has these features: surplus kept by operator, contributions invested in conventional bonds, no SSB oversight. How many red flags?", type: "multiple-choice", options: ["One -- just the bonds", "Two -- bonds and no SSB", "Three -- surplus kept by operator (should go to participants) + conventional bonds (not Shariah-compliant) + no SSB oversight", "None -- operator discretion is normal"], correct: 2, explanation: "Three red flags: (1) Surplus must go to participants, not operator -- otherwise it's just conventional insurance. (2) Pool must be invested in Shariah-compliant assets. (3) SSB oversight is essential for governance. This product has the takaful label but the conventional insurance structure." , uiType: "slider"},
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "If the takaful pool runs out of money (claims exceed contributions + investment returns), what happens?", type: "multiple-choice", options: ["Claims are denied", "The operator provides a qard hasan (benevolent loan) to cover the shortfall -- repaid from future surplus, no interest", "Participants must pay more immediately", "The government covers it"], correct: 1, explanation: "The operator extends a qard hasan (interest-free loan) to the pool. This is repaid when the pool returns to surplus. No interest. The operator bears the short-term cash burden, but it's a LOAN to the pool, not a gift. This mechanism keeps claims flowing without converting the structure into risk-transfer-for-profit." , uiType: "mcq"},
          { concept: "Conventional insurance has structural issues: you pay a premium, and whether you receive anything depends on chance (gharar/maysir elements). Takaful redesigns insurance as mutual cooperation.\\n\\nConventional insurance: risk TRANSFER to a company. Takaful: risk SHARING among participants.\\nParticipants contribute to a common pool (tabarru' -- donation). Claims are paid from this pool.\\nThe takaful operator MANAGES the pool (for a fee or share of investment profits) but does NOT own the pool.\\nSurplus (what's left after claims and expenses) belongs to participants -- returned or carried forward.\\nTwo common models: wakalah (operator as agent, earns fee) and mudarabah (operator as manager, earns share of investment profit).", question: "Your colleague says: 'Insurance is gambling -- you pay money hoping something bad happens so you can collect.' Another says: 'We need protection for our families.' How do you reconcile this?", type: "multiple-choice", options: ["The first colleague has a point about conventional insurance -- elements of gharar and maysir exist. But the second colleague's need is real. Takaful addresses BOTH: it provides genuine protection through mutual cooperation (tabarru'), removes the gambling structure, and invests ethically. Protection ≠ gambling when the structure is right.", "Insurance is always haram -- just trust Allah", "All insurance is fine -- just buy the cheapest", "Only life insurance is problematic"], correct: 0, explanation: "Both colleagues touch truth. Conventional insurance's premium-for-uncertain-payout structure has gharar/maysir concerns. But families genuinely need protection. Takaful resolves the tension: mutual cooperation (not risk-for-profit), participant-owned pool (not company profit), and Shariah-compliant investments. The need is real; the solution must be structured correctly." , uiType: "advise"}
        ]
      },
        { id: 'lesson-2-6', title: "Sukuk Basics", description: "Islamic securities -- bonds without the interest", duration: "12 min",
        questions: [
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "What is the fundamental difference between a conventional bond and a sukuk?", type: "multiple-choice", options: ["Sukuk pay higher returns", "Bonds represent debt (loan + interest); sukuk represent ownership in a real asset (returns from that asset)", "There is no difference", "Sukuk are only for governments"], correct: 1, explanation: "Bond = 'I lent you money, pay me back with interest.' Sukuk = 'I own a share of this asset, and I receive returns from its performance.' The ownership of an underlying asset is what makes sukuk fundamentally different from interest-bearing debt." , uiType: "mcq"},
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "An ijara sukuk works by: investors collectively purchase a building (via sukuk), lease it to a tenant, and receive rental income as returns. What makes this compliant?", type: "multiple-choice", options: ["The Arabic name", "Investors OWN a share of a real asset (building) and returns come from its productive use (rent) -- not from a loan", "The building is in a Muslim country", "The tenant is a government entity"], correct: 1, explanation: "The building is the underlying asset. Investors genuinely own shares of it. Rental income flows to them as owners. This is asset-based return, not interest on a loan. Location and tenant identity are irrelevant to the structural compliance." , uiType: "mcq"},
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "Sort these into bonds vs. sukuk characteristics.", type: "column-sort", columns: [{id: "bond", label: "Conventional Bond", color: "#dc2626", correct: ["Represents a loan (debt obligation)", "Returns = fixed interest payments", "No asset ownership for investor", "Guaranteed coupon regardless of performance"]}, {id: "sukuk", label: "Sukuk", color: "#059669", correct: ["Represents ownership in an asset", "Returns linked to asset performance", "Investor bears asset risk", "Must have an underlying real asset"]}], items: ["Represents a loan (debt obligation)", "Represents ownership in an asset", "Returns = fixed interest payments", "Returns linked to asset performance", "No asset ownership for investor", "Investor bears asset risk", "Guaranteed coupon regardless of performance", "Must have an underlying real asset"], explanation: "Bonds: debt, guaranteed interest, no ownership. Sukuk: ownership, performance-linked returns, real asset backing. These distinctions determine whether returns are legitimate (from an asset) or riba (from a loan)." , uiType: "drag-alloc", visual: {buckets: [{id: "bond", label: "Conventional Bond", color: "#dc2626"}, {id: "sukuk", label: "Sukuk", color: "#059669"}], chips: [{text: "Represents a loan (debt obligation)", correct: "bond"}, {text: "Represents ownership in an asset", correct: "sukuk"}, {text: "Returns = fixed interest payments", correct: "bond"}, {text: "Returns linked to asset performance", correct: "sukuk"}, {text: "No asset ownership for investor", correct: "bond"}, {text: "Investor bears asset risk", correct: "sukuk"}, {text: "Guaranteed coupon regardless of performance", correct: "bond"}, {text: "Must have an underlying real asset", correct: "sukuk"}]}},
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "Match each sukuk type to its underlying structure: Ijara sukuk = ___. Musharakah sukuk = ___. Murabaha sukuk = ___.", type: "multiple-choice", options: ["Ijara = rental income from a leased asset; Musharakah = partnership profit sharing; Murabaha = returns from cost-plus trade transactions", "All three are identical structures", "Ijara = profit sharing; Musharakah = rental; Murabaha = leasing", "None of these have real underlying assets"], correct: 0, explanation: "Each sukuk type is named after its underlying contract. Ijara sukuk: income from leasing an asset. Musharakah sukuk: returns from a joint business venture. Murabaha sukuk: returns from trade transactions. The contract type determines the risk profile and return structure." , uiType: "match"},
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "A government issues 'sukuk' worth AED 1 billion. There is NO underlying asset -- the government simply promises to pay 5% annually and return the principal at maturity. Is this truly sukuk?", type: "multiple-choice", options: ["Yes -- governments can issue whatever they want", "No -- without an underlying asset, this is a conventional bond with an Arabic label; the 5% is interest, not asset-based return", "Yes, if an SSB approves it", "It depends on the credit rating"], correct: 1, explanation: "Sukuk without an underlying asset = bond with an Arabic name. The whole point of sukuk is ownership in something real. Government promise to pay 5% + return principal = textbook debt with interest. This was the exact critique raised by AAOIFI's 2008 statement on sukuk compliance." , uiType: "mcq"},
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "Ijara sukuk scenario: 500 investors each buy AED 10,000 in sukuk backed by a commercial building. Annual rent: AED 750,000. Management costs: AED 150,000. Calculate each investor's annual return.", type: "multiple-choice", options: ["AED 1,200 per investor", "AED 1,500 per investor", "AED 1,000 per investor", "AED 750 per investor"], correct: 0, explanation: "Net rental income: AED 750,000 - AED 150,000 = AED 600,000. Split among 500 investors: AED 600,000 ÷ 500 = AED 1,200 each. This return comes from RENT on a real building -- not interest on a loan. If the building is vacant for 3 months, returns drop. That's real asset risk." , uiType: "calc", visual: {calcSteps: ["Gross rent: AED [___]", "Costs: AED [___]", "Net: AED [___] - AED [___] = AED [___]", "Per investor: AED [___] \u00f7 [___] = AED [___]"], factChips: ["Investors: 500", "Investment each: AED 10,000", "Annual rent: AED 750,000", "Management costs: AED 150,000"]}},
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "A 'sukuk' product has these features: guaranteed 6% annual return, principal fully protected, no identifiable underlying asset, issuer promises to 'buy back' at par value. How many red flags?", type: "multiple-choice", options: ["One", "Two", "Four -- guaranteed return (should vary with performance) + protected principal (should bear risk) + no underlying asset (must have one) + guaranteed buyback at par (no asset risk)", "None -- this is well-structured"], correct: 2, explanation: "Four red flags: (1) Guaranteed 6% = no performance link. (2) Principal protection = no capital risk. (3) No underlying asset = nothing to own. (4) Par buyback = no asset risk on exit. Strip these features and you have: money in → guaranteed surplus out → return of principal = a bond. Every feature that should distinguish sukuk from bonds is missing." , uiType: "slider"},
          { concept: "Sukuk are Islamic investment certificates that represent ownership in an underlying asset, project, or business activity. Unlike conventional bonds (loan → interest), sukuk give investors a share in a real asset and its returns.\\n\\nBonds = debt: you lend money, receive guaranteed interest. Sukuk = ownership: you own a share of an asset and receive returns from it.\\nSukuk holders bear asset risk -- if the asset underperforms, returns may be lower. No guaranteed coupon.\\nCommon types: ijara sukuk (rental income), musharakah sukuk (partnership returns), murabaha sukuk (trade receivables).\\nThe underlying asset is ESSENTIAL -- without it, sukuk become bonds with an Arabic name.\\n\\nThink of it this way: a bond is an IOU. A sukuk is a share certificate in a real building, project, or trade.", question: "Your uncle wants to invest AED 100,000 and is comparing: (1) a conventional government bond paying 5% fixed, (2) an ijara sukuk backed by a government-leased hospital, and (3) a 'sukuk' with guaranteed 5% and no identified asset. Best advice?", type: "multiple-choice", options: ["(1) Bond = interest (riba). (2) Ijara sukuk = real asset (hospital), real rental income, genuine structure -- worth investigating further. (3) 'Sukuk' with guaranteed return + no asset = bond with an Arabic name. Look deeper at option 2: WHO is on the SSB? What's the actual building? What happens if it's vacant?", "All three are the same -- just pick the highest return", "Avoid all three -- investing is gambling", "Option 3 is safest because returns are guaranteed"], correct: 0, explanation: "Option 1 is clearly riba. Option 3 looks Islamic but has no substance (no asset + guaranteed return = relabelled bond). Option 2 has the right structure -- but still needs due diligence. The advice equips your uncle with the RIGHT QUESTIONS, not just a yes/no." , uiType: "advise"}
        ]
      }
      ]
    },
    ],
    'quran-arabic': [{ id: 'arabic', title: "Arabic Alphabet", subtitle: "Learn the letters", icon: "", color: "#0284c7", difficulty: "Beginner", questions: [] }],
    'islamic-history': [{
      id: 'epoch-1', title: "Epoch 1: Creation to Pre-Islamic Arabia", subtitle: "Creation -- 610 CE", icon: "🌍", color: "#0284c7", estimatedTime: "44 min (5 lessons)",
      mascotMessage: "Let's journey to the very beginning!",
      levels: [{
        id: 'e1-beginner', name: "Beginner",
        lessons: [
        // ═══════════════════════════════════════════════════════════
        // LESSON 1 -- How Allah Created the World
        // ═══════════════════════════════════════════════════════════
        {
          id: 'creation', title: "How Allah Created the World", subtitle: "Understanding creation's purpose", icon: "🌍", color: "#0284c7", difficulty: "Beginner", estimatedTime: "8 min",
          conceptCards: [
            { title: "Why start with creation?", text: "When we learn Islamic history, we don't begin with ancient kingdoms or tribes -- we begin before humans, with how Allah created the world. This matters because Islam teaches that the universe isn't random or accidental. It was made on purpose, with wisdom, by the One who controls everything.\n\nThe Qur'an says Allah created the heavens and the earth in six \"days\" -- not days like we count, but stages that show order, planning, and power. Creation is intentional, not chaotic." },
            { title: "Humanity's purpose", text: "With Adam and Hawwa, human history starts. Humans aren't placed on earth as an afterthought. They are given dignity, the ability to choose, and responsibility to live by guidance.\n\nThe unseen world -- like angels who obey Allah and jinn who choose like humans -- reminds us that reality is bigger than what our eyes see. What we do matters, even when no one else sees it." },
            { title: "The Islamic arc of history", text: "This beginning sets up the whole Islamic view of history:\n\nAllah creates with purpose → humans are responsible → guidance is sent → people are accountable for how they respond.\n\nUnderstanding this starting point helps us understand everything that comes after." }
          ],
          questions: [
            {
              question: "Islamic history doesn't begin with a king, a city, or a battle. It begins with creation. Which statement best explains why?",
              type: "multiple-choice",
              options: [
                "History starts with creation because it explains who is in control, why humans exist, and what they are accountable for",
                "History starts with creation because early humans could not form societies until revelation taught them how",
                "History starts with creation mainly to help us calculate timelines and measure the age of the universe",
                "History starts with creation because nothing meaningful happened until humans appeared"
              ],
              correct: 0,
              explanation: "Islamic history begins with creation because it establishes the framework for everything that follows: **Allah is the Creator and Sustainer**, **human life has purpose, not randomness**, and **accountability exists before politics, economics, or power**.\n\nThe other options miss the core Islamic worldview: B assumes humans needed revelation just to function socially. C reduces revelation to a scientific tool. D treats creation as a delay before \"real\" history, but in Islam, creation is the foundation of all meaning in history."
            },
            {
              question: "Sort each statement into the correct column based on whether it fits an Islamic view of history.",
              type: "column-sort",
              items: [
                "Prophets appear across different peoples because guidance is part of Allah's plan",
                "Human choices matter because life is a test with moral consequences",
                "Economic conditions influence events, but they do not fully explain why things happen",
                "History is best explained only by material forces like wealth and power",
                "Morality develops naturally with no final judgment beyond human society"
              ],
              columns: [
                { id: "fits", label: "Fits Islamic View", color: "#059669", correct: [
                  "Prophets appear across different peoples because guidance is part of Allah's plan",
                  "Human choices matter because life is a test with moral consequences",
                  "Economic conditions influence events, but they do not fully explain why things happen"
                ]},
                { id: "not", label: "Does NOT Fit", color: "#dc2626", correct: [
                  "History is best explained only by material forces like wealth and power",
                  "Morality develops naturally with no final judgment beyond human society"
                ]}
              ],
              explanation: "Islamic history recognises causes like economics and power, but does not treat them as the ultimate explanation. **Life is a test, so choices matter.** **Guidance explains why prophets appear across cultures and eras.** **Economic conditions play a role, but are not the full explanation.**\n\nThe statements that don't fit assume history is self-contained. In Islam, **material causes exist, but they are not ultimate**. History points beyond itself to judgment and accountability."
            },
            {
              question: "A student says: \"When the Qur'an says Allah created the heavens and earth in six 'days', it must be giving us exact time units.\" What is the best Islamic response?",
              type: "multiple-choice",
              options: [
                "Yes -- the six days are exactly like modern 24-hour days, so calculation is the main goal",
                "We affirm six 'days' as stages of creation, but the main lesson is Allah's wisdom and order, not scientific calculation",
                "These verses are symbolic and don't carry real meaning",
                "This topic is too complex to learn anything from, so we should leave it to the scholars"
              ],
              correct: 1,
              explanation: "Allah says creation happened in six \"days\" (ayyām): **\"Allah created the heavens and the earth in six days…\"** (7:54). He reminds us His \"day\" is not like ours: **\"A day with your Lord is like a thousand years of what you count\"** (22:47).\n\nThe Qur'an connects creation to worship: **\"That is Allah, your Lord, so worship Him\"** (10:3). A balanced approach **affirms what Allah said**, avoids false precision, and learns the lesson of purpose and accountability."
            },
            {
              question: "Islamic history follows a clear meaning-based flow. Fill in the blanks to complete the correct sequence:",
              type: "drag-drop",
              sentence: "Creation → ___ → ___ → Accountability",
              wordBank: ["Human responsibility on earth", "Prophetic guidance over time", "Random chance", "Worldly success"],
              correct: ["Human responsibility on earth", "Prophetic guidance over time"],
              explanation: "This sequence captures the Islamic meaning of history: **Allah creates with purpose** → **humans are given responsibility** → **Allah sends guidance through prophets** → **people are accountable**.\n\nThe incorrect options remove meaning from history -- if events are driven only by random chance or if worldly success is the final goal, then guidance, responsibility, and judgment no longer make sense."
            }
          ]
        },

        // ═══════════════════════════════════════════════════════════
        // LESSON 2 -- Line of Prophets
        // ═══════════════════════════════════════════════════════════
        {
          id: 'prophets', title: "Line of Prophets", subtitle: "One message across time", icon: "👥", color: "#0284c7", difficulty: "Beginner", estimatedTime: "10 min",
          conceptCards: [
            { title: "One line, one core message", text: "Prophets are a connected line sent to different peoples across history -- not isolated \"random\" figures.\n\nWhat stays the same across all of them is the core creed: worship Allah alone (tawḥīd) and reject false worship. What can change is the law (sharīʿah details): specific rules may differ by time, place, and community needs -- while the foundation remains consistent.\n\nSo when you hear different prophets had different \"rules,\" that doesn't mean different religions -- it means one religion with context-specific laws.\n\nTimeline: Adam → Nūḥ → Ibrāhīm → Mūsā → ʿĪsā → Muḥammad ﷺ" },
            { title: "How prophetic stories teach history", text: "Prophetic stories aren't meant to be trivia. They train you to read history through repeating human patterns:\n\n• Truth vs. comfort: people resist guidance when it threatens habits, power, or profits\n• Patience vs. pressure: prophets and believers stay steady even when mocked or outnumbered\n• Justice vs. corruption: societies rise and fall with arrogance, oppression, and denial of accountability\n\nThese stories help you see why events unfold -- not just what happened." },
            { title: "A framework, not a list", text: "If you treat prophets as disconnected names, history becomes a blur. But if you treat them as a framework, you start to see a meaningful storyline:\n\nAllah sends guidance → people respond (accept/reject) → outcomes follow (reform/consequence).\n\nThis makes later topics (like Qur'an themes, ethics, and leadership) easier because you already understand the pattern behind events." }
          ],
          questions: [
            {
              question: "Across history, prophets were sent to different peoples, in different places, with different challenges. What is the most consistent message across all their missions?",
              type: "multiple-choice",
              options: [
                "Calling people to worship Allah alone and reject false worship",
                "Teaching one legal system that does not change",
                "Establishing the same political structure for every society",
                "Encouraging people to follow popular beliefs"
              ],
              correct: 0,
              explanation: "The unchanging core of every prophetic mission is **tawḥīd** -- worshipping Allah alone. While specific laws could differ by time and place, **the creed never changed**. This is why prophets across history are part of one continuous message, not unrelated religions.\n\nThe other options confuse unity of message with uniformity of culture. **Laws can vary without changing the creed.**"
            },
            {
              question: "Prophetic stories in the Qur'an train readers to recognise repeating patterns. Select exactly two lessons these stories consistently teach.",
              type: "multi-select",
              options: [
                "Arrogance and injustice eventually destroy societies",
                "Wealth and success are reliable signs that a belief is true",
                "Remaining steadfast matters even when truth is unpopular or resisted",
                "Loyalty to tribe or majority opinion determines what is right"
              ],
              correct: [0, 2],
              explanation: "Prophetic history teaches cause → effect: **arrogance and injustice corrode societies from within**, and **steadfastness in truth matters even when it brings pressure or isolation**. These patterns repeat across different prophets, peoples, and eras.\n\nThe incorrect options reflect the worldview prophets consistently challenge: **wealth and dominance are not proof of truth**; tribe and popularity do not decide right and wrong."
            },
            {
              question: "A learner says: \"Different prophets must have taught different religions, because the rules they taught weren't the same.\" What is the best correction?",
              type: "multiple-choice",
              options: [
                "Each prophet created a new religion to fit their tribe and culture",
                "The core belief was always the same (worship Allah alone), while some laws differed by time and community needs",
                "Prophets mainly taught moral values, not belief or worship",
                "No rules ever differed; all prophets taught identical laws"
              ],
              correct: 1,
              explanation: "All prophets shared the same core belief: **worship Allah alone and reject false worship**. What could change were specific laws -- details suited to a people's time, place, and circumstances. **Different rules do not mean different religions.**\n\nIslam teaches **shared belief with contextual laws**, which explains both consistency and variation across prophetic history."
            },
            {
              question: "Fill in the blanks to complete the prophetic timeline:",
              type: "drag-drop",
              sentence: "Islam is the same call to worship Allah alone that began with ___, continued through ___, ___, ___, and ___, and was completed with Muhammad ﷺ.",
              wordBank: ["Adam", "Nūḥ (Noah)", "Ibrāhīm (Abraham)", "Mūsā (Moses)", "ʿĪsā (Jesus)", "Dāwūd (David)", "Yūnus (Jonah)"],
              correct: ["Adam", "Nūḥ (Noah)", "Ibrāhīm (Abraham)", "Mūsā (Moses)", "ʿĪsā (Jesus)"],
              explanation: "In Islam, the call to worship Allah alone began with **Adam**, continued through **Nūḥ, Ibrāhīm, Mūsā, and ʿĪsā**, and was completed with **Muhammad ﷺ**. Islam presents itself as **continuous guidance**, not a religion that suddenly appeared in the 7th century.\n\n**Islam does not begin with a people or a place -- it begins with humanity itself.**"
            }
          ]
        },

        // ═══════════════════════════════════════════════════════════
        // LESSON 3 -- What Is a Prophet and Messenger?
        // ═══════════════════════════════════════════════════════════
        {
          id: 'prophet-messenger', title: "Prophet vs Messenger", subtitle: "Understanding their roles", icon: "📯", color: "#0284c7", difficulty: "Beginner", estimatedTime: "9 min",
          conceptCards: [
            { title: "Prophets and messengers", text: "In Islam, Allah guides humanity through special individuals chosen from among people -- not angels, kings, or supernatural beings. These individuals are called prophets (anbiyā') and messengers (rusul). Understanding the difference helps us understand how guidance reached different nations across history." },
            { title: "The key distinction", text: "A prophet (nabī) is someone Allah chooses, teaches, and inspires with revelation. Prophets guide their communities and call them back to worshipping Allah. Not every prophet brings a new scripture. Examples include Adam, Hārūn (Aaron), and Yaḥyā (John).\n\nA messenger (rasūl) is a prophet who is specifically sent with a mission to deliver Allah's message openly, often with a new scripture. Every messenger is a prophet, but not every prophet is a messenger.\n\nExamples of messengers include Nūḥ, Mūsā (who delivered the Tawrāh), ʿĪsā (who delivered the Injīl), and Muhammad ﷺ, the final messenger who brought the Qur'an." },
            { title: "Why this matters", text: "Messengers often faced stronger resistance because they were commanded to confront their societies' false beliefs and practices. This helps us understand why their stories in the Qur'an emphasise courage, clarity, and public responsibility.\n\nThe final point is essential: Muhammad ﷺ is the last prophet and messenger, meaning no new revelation or messenger will ever come after him. Guidance is preserved now through the Qur'an and his Sunnah, protecting the religion from confusion or false claims." }
          ],
          questions: [
            {
              question: "In Islam, both prophets (nabī) and messengers (rasūl) receive revelation from Allah. What best explains the commonly taught difference between them?",
              type: "multiple-choice",
              options: [
                "A messenger is a prophet sent with a clear public mission to deliver Allah's message, while a prophet receives revelation and teaches but may not be sent with a new mission",
                "A prophet gives personal advice based on wisdom, while a messenger delivers revelation from Allah",
                "A messenger focuses on renewing traditions, while a prophet introduces new beliefs",
                "A prophet works quietly with leaders, while a messenger works mainly with ordinary people"
              ],
              correct: 0,
              explanation: "Both are chosen by Allah and receive revelation. The key difference is the mission. **Every messenger is a prophet, but not every prophet is a messenger.** A messenger is commanded to publicly deliver Allah's message, often to confront widespread false beliefs.\n\nFor example, Prophet Yaḥyā guided his people with truth, but was not sent with a new scripture or separate public mission."
            },
            {
              question: "A learner says: \"Prophets were just wise people who gave advice based on their own experience.\" What is the best Islamic correction?",
              type: "multiple-choice",
              options: [
                "Prophets are chosen by Allah and speak with revelation, not personal opinions or guesses",
                "Prophets were mainly respected elders who passed down cultural traditions",
                "Prophets became leaders because people recognised their intelligence and honesty",
                "Prophets told symbolic stories but had no special authority beyond teaching morals"
              ],
              correct: 0,
              explanation: "**Prophets are chosen by Allah**, **they receive revelation (waḥy)**, and **their authority comes from Allah, not from popularity, culture, or intellect**. This is essential because belief in Islam begins with trusting that guidance comes from Allah, not from human opinion.\n\n**Prophets were not elected, trained, or self-made.** Following them is an act of faith, not just respect."
            },
            {
              question: "Believing that Muhammad ﷺ is the final messenger has clear implications. Select exactly two statements that correctly follow from this belief.",
              type: "multi-select",
              options: [
                "No prophet or messenger will come after him",
                "Guidance is preserved through the Qur'an and Sunnah, not future revelations",
                "Religious leaders may receive new forms of divine guidance that carry authority similar to revelation",
                "Future communities may be given new revealed texts to address new circumstances"
              ],
              correct: [0, 1],
              explanation: "**Prophethood has ended** -- no prophet or messenger will come after him, and **guidance is complete and preserved** through the Qur'an and the Sunnah. This protects the religion from confusion, constant change, and false claims to revelation.\n\n**Revelation ended with Muhammad ﷺ.** Scholars explain and apply guidance, but they do not receive new revelation. **Finality preserves clarity, unity, and trust.**"
            },
            {
              question: "Fill in the blanks using the word bank:",
              type: "drag-drop",
              sentence: "After prophethood ended, the two primary sources of guidance for the community are the ___ and the ___.",
              wordBank: ["Qur'an", "Sunnah", "Tribal customs", "Dreams", "Poetry", "Court rulings"],
              correct: ["Qur'an", "Sunnah"],
              explanation: "**The Qur'an is Allah's final revelation**, and **the Sunnah is the lived example and teaching of the Prophet ﷺ**. Together they form the foundation for how Muslims learn, worship, and live.\n\nCustoms, dreams, or poetry may influence culture, but they are not sources of revelation and cannot replace the Qur'an and Sunnah."
            }
          ]
        },

        // ═══════════════════════════════════════════════════════════
        // LESSON 4 -- Arabia Before Islam
        // ═══════════════════════════════════════════════════════════
        {
          id: 'arabia-before-islam', title: "Arabia Before Islam", subtitle: "Geography and society", icon: "🏜️", color: "#0284c7", difficulty: "Beginner", estimatedTime: "8 min",
          conceptCards: [
            { title: "Two key settings", text: "Mecca was centred on the Kaʿbah. Regular visits created repeated gatherings, which built wide trade, social, and trust networks across Arabia.\n\nYathrib (later Medina) was an oasis settlement. Farming, land control, and local alliances shaped its politics and conflicts.\n\nThere was no strong central state; tribal protection and agreements filled that role." },
            { title: "Why settings matter", text: "Different settings produce different histories: gathering hubs spread ideas widely, while oasis towns manage local power and rivalry.\n\n\"Bakkah\" is a Qur'anic name tied to the sacred precinct of the House; names can highlight function, not a separate city." }
          ],
          questions: [
            {
              question: "Before Islam, why did Mecca have influence in western Arabia despite having no farmland, army, or central government?",
              type: "multiple-choice",
              options: [
                "The Kaʿbah made Mecca a recognised sacred gathering place, bringing repeated visits that strengthened trade, trust, and social networks",
                "Mecca controlled large agricultural lands and river-based irrigation systems",
                "A royal palace system imposed authority inherited from previous empires",
                "A coastal navy controlling Red Sea trade routes gave Mecca dominance"
              ],
              correct: 0,
              explanation: "Mecca's influence came from **return, not rule**. Because people repeatedly travelled to the Kaʿbah, Mecca became a regular meeting point, a place of trust, and a hub for long-distance trade. This produced **influence without land, armies, or a state**.\n\nThe other answers apply the wrong model of power. Farms, empires, and navies explain power elsewhere -- but not inland Arabia."
            },
            {
              question: "Before Islam, different environments produced different patterns. Select the two that describe Mecca (not Yathrib).",
              type: "multi-select",
              options: [
                "A settlement shaped by regular visitors, long-distance networks, and shared religious meaning",
                "A settlement shaped by land ownership, farming, and local alliances",
                "Influence spread through movement and trust rather than territory",
                "Politics focused on neighbourhood balance, treaties, and internal rivalry"
              ],
              correct: [0, 2],
              explanation: "**Mecca** functioned as a gathering hub, spreading influence through movement, trust, and shared rituals. **Yathrib** functioned as an oasis town, where land, alliances, and local power mattered more.\n\nUnderstanding this difference explains why **ideas spread easily from Mecca** -- and why **community-building later succeeded in Yathrib**."
            },
            {
              question: "A learner reads \"Bakkah\" in the Qur'an and assumes it must refer to a completely different city from Mecca. What is the best clarification?",
              type: "multiple-choice",
              options: [
                "\"Bakkah\" highlights the sacred precinct and religious function of the House, not a separate city",
                "\"Bakkah\" was an older agricultural town that later disappeared",
                "\"Bakkah\" refers to a nearby coastal port on the Red Sea",
                "\"Bakkah\" was a temporary settlement used only during pilgrimage seasons"
              ],
              correct: 0,
              explanation: "In the Qur'an, place-names can emphasise **meaning and function**, not introduce new geography. \"Bakkah\" points to the **sacred role of the area around the House**.\n\nThe other options assume every name must describe a new physical location. This creates unnecessary confusion and breaks continuity between the Qur'an's language and the known geography of Arabia."
            },
            {
              question: "Match each description to the correct place:\n\n1. Influence from movement, repeated visits, and shared sacred meaning\n2. Land ownership, farming, and local alliances shaped politics",
              type: "multiple-choice",
              options: [
                "1 = Mecca, 2 = Yathrib",
                "1 = Yathrib, 2 = Mecca",
                "1 = Taif, 2 = Mecca",
                "1 = Medina, 2 = Jerusalem"
              ],
              correct: 0,
              explanation: "**Mecca's power came from gatherings and networks**, not territory. **Yathrib's politics came from land, farming, and alliances.**\n\nIslamic history makes sense when you ask: **what kind of power does this place produce?** Movement-based power and land-based power lead to very different outcomes."
            }
          ]
        },

        // ═══════════════════════════════════════════════════════════
        // LESSON 5 -- Faiths in Arabia
        // ═══════════════════════════════════════════════════════════
        {
          id: 'faiths-in-arabia', title: "Faiths in Arabia", subtitle: "Religious diversity before Islam", icon: "🕊️", color: "#0284c7", difficulty: "Beginner", estimatedTime: "9 min",
          conceptCards: [
            { title: "A diverse religious landscape", text: "Before Islam, Arabia was religiously diverse. Many people worshipped idols placed around the Kaaba, believing these idols could bring luck, protection, or blessings. But this was not the whole picture.\n\nThere were also Jewish and Christian communities living in different parts of Arabia. They had scriptures, places of learning, and long traditions of belief. Their presence meant that conversations about God, prophets, revelation, and morality were already happening before Islam arrived." },
            { title: "The ḥanīfs and the search for truth", text: "Alongside them were individuals called ḥanīfs -- people who rejected idol worship and searched for the pure devotion of Ibrāhīm. They did not follow Judaism or Christianity, but they believed in One God and tried to worship Him sincerely.\n\nThis mixture -- idol worship, Jewish and Christian teachings, and monotheist seekers -- created an environment where questions about truth, scripture, identity, and worship were already active. So when Islam began, it didn't enter a silent or spiritually empty society -- it entered a world where people were thinking, debating, and searching." }
          ],
          questions: [
            {
              question: "In the pre-Islamic Hijaz, the term \"ḥanīf\" referred to a specific kind of belief and practice. Which option best captures what it meant?",
              type: "multiple-choice",
              options: [
                "A person who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm",
                "A person who believed in one God and focused mainly on personal morality rather than organised religion",
                "A person influenced by Jewish or Christian ideas while still living within wider Arabian society",
                "A person who questioned idol worship but did not adopt a clear alternative form of belief"
              ],
              correct: 0,
              explanation: "A ḥanīf was someone who **rejected idol worship** and **sought pure monotheism**, associating that belief with the way of Ibrāhīm. They did not mix idol worship with belief in one God. Their importance lies in showing that **some people were already searching for true monotheism before Islam arrived**.\n\nThe other options describe people who were morally reflective or questioning, but a ḥanīf is defined by a **clear commitment to pure monotheism** and a **clear break from idol worship**."
            },
            {
              question: "Before Islam, the Hijaz was not religiously uniform. Select exactly four religious streams that were meaningfully present in the region.",
              type: "multi-select",
              options: [
                "Idol worship (polytheism)",
                "Judaism",
                "Christianity",
                "Ḥanīf monotheists",
                "Zoroastrianism",
                "Hinduism"
              ],
              correct: [0, 1, 2, 3],
              explanation: "Before Islam, the Hijaz included: **widespread idol worship**, **Jewish communities** with scripture and learning, **Christian communities** connected to wider religious networks, and **ḥanīfs** -- individuals seeking pure monotheism. **Arabia was religiously active, not spiritually empty.**\n\nZoroastrianism and Hinduism existed in other regions, but were not major religious streams in the Hijaz."
            },
            {
              question: "A learner asks: \"Before Islam, were people in Arabia actually thinking seriously about religion?\" What is the best answer?",
              type: "multiple-choice",
              options: [
                "Many people followed inherited idol traditions, but there were also Jewish and Christian communities, and ḥanīfs who questioned idol worship -- so religious discussion was common",
                "Most people followed idols blindly, and serious religious thinking only began after the Qur'an was revealed",
                "Everyone shared the same beliefs, so there was little disagreement or discussion",
                "Religious ideas were present, but they were mostly ignored and had little influence on society"
              ],
              correct: 0,
              explanation: "Pre-Islamic Arabia was **not spiritually silent**. Idol worship was widespread, but Jewish and Christian communities discussed scripture and morality, and ḥanīfs searched for pure belief. **Islam entered a society where religious ideas were already being discussed and debated.**\n\nThe other options flatten the picture. Understanding this diversity helps explain why Islam's message was understood, challenged, and debated from the start."
            },
            {
              question: "Fill in the blank using the word bank:",
              type: "drag-drop",
              sentence: "Islam did not enter a society that was spiritually empty; it entered a society where ___ already existed.",
              wordBank: ["debates about God and worship", "complete religious agreement", "scientific explanations of the universe", "political unity under a single ruler", "widespread indifference to belief"],
              correct: ["debates about God and worship"],
              explanation: "Because **people were already thinking, discussing, and disagreeing** about God, revelation, and morality, **Islam's message was immediately understood, questioned, and debated**.\n\nThere was no single political authority, people did not all agree religiously, and religious belief was not ignored. Islam entered a **responsive environment**, not a blank slate."
            }
          ]
        }
        ]
      },
      { id: 'e1-int', name: "Intermediate", locked: true, message: "Complete Beginner to unlock" },
      { id: 'e1-adv', name: "Advanced", locked: true, message: "Complete Intermediate to unlock" },
      ]
    },
    { id: 'epoch-2', title: "Epoch 2: Birth of Islam", subtitle: "610–632 CE", icon: "🌅", locked: true, questions: [] },
    { id: 'epoch-3', title: "Epoch 3: Rightly Guided Caliphs", subtitle: "632–661 CE", icon: "👑", locked: true, questions: [] },
    { id: 'epoch-4', title: "Epoch 4: Umayyads & Abbasids", subtitle: "661–1258 CE", icon: "🏛️", locked: true, questions: [] },
    { id: 'epoch-5', title: "Epoch 5: Sultanates & Empires", subtitle: "1258–1800", icon: "--️", locked: true, questions: [] },
    { id: 'epoch-6', title: "Epoch 6: Colonialism to Today", subtitle: "1800–Present", icon: "🌐", locked: true, questions: [] },
    ]
  };

  // ---- Helpers ----------------------------------------------------
  const isModuleLocked = (i, tid) => { if (tid !== 'islamic-finance' || i == 0) return false; return !completedModules.includes(modules[tid]?.[i-1]?.id); };
  const isLessonLocked = (i, mid) => i == 0 ? false : !completedLessons[`${mid}-lesson-${i-1}`];
  const markModComplete = (id) => { if (!completedModules.includes(id)) setCompletedModules([...completedModules, id]); };
  const markLesComplete = (mid, i) => setCompletedLessons({ ...completedLessons, [`${mid}-lesson-${i}`]: true });

  const selectMainTopic = (id) => { setSelectedMainTopic(mainTopics.find(t => t.id == id)); setLastSelectedTopicId(id); setScreen('modules'); };
  const selectModule = (mod, idx) => {
    if (selectedMainTopic?.id == 'islamic-history' && mod.levels) { setSelectedEpoch(mod); setScreen('epoch-levels'); return; }
    if (selectedMainTopic?.id == 'islamic-finance' && isModuleLocked(idx, selectedMainTopic.id)) return;
    if (mod.locked) return;
    if (selectedMainTopic?.id == 'islamic-finance' && mod.lessons) { setSelectedModule(mod); setScreen('lessons'); return; }
    if (!mod.questions?.length) { alert('Coming soon!'); return; }
    setSelectedModule(mod); resetQuiz(mod.questions); setScreen('quiz');
  };
  const selectLvl = (l) => { if (l.locked) return; setSelectedLevel(l); setScreen('history-lessons'); };
  const selectHistLesson = (l) => { if (!l.questions.length) return; setSelectedLesson(l); resetQuiz(l.questions); setScreen('quiz'); };
  const selectLes = (l, i) => { if (isLessonLocked(i, selectedModule.id) || !l.questions.length) return; setSelectedLesson({...l, lessonIndex: i}); resetQuiz(l.questions); setScreen('quiz'); };
  const resetQuiz = (questions) => { setCurrentQuestion(0); setSelectedAnswer(null); setHeldItem(null); setDragOverCol(null); setShowExplanation(false); setShowConceptIntro(true); setConceptIndex(0); setQuizScore(0); setStreak(0); setQuizResults([]); if (questions) buildShuffleMaps(questions); };
  const goHome = () => { setScreen('home'); setSelectedMainTopic(null); setSelectedModule(null); setSelectedLesson(null); };
  const goModules = () => { setScreen('modules'); setSelectedModule(null); setSelectedLesson(null); };
  const goLessons = () => { setScreen(selectedEpoch && selectedLevel ? 'history-lessons' : 'lessons'); setSelectedLesson(null); };

  const handleMC = (i) => { if (!showExplanation) setSelectedAnswer(i); };
  const submitMC = () => {
    if (selectedAnswer == null || showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const sh = getShuffled(currentQuestion, q);
    doAnswer(sh.toOriginal(selectedAnswer) == q.correct, q);
  };
  const handleMS = (i) => {
    if (showExplanation) return;
    const a = selectedAnswer ? [...selectedAnswer] : [];
    const idx = a.indexOf(i); if (idx > -1) a.splice(idx, 1); else a.push(i);
    setSelectedAnswer(a);
  };
  const submitMS = () => {
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const a = selectedAnswer || [];
    const sh = getShuffled(currentQuestion, q);
    const origSelected = a.map(i => sh.toOriginal(i));
    doAnswer(origSelected.length == q.correct.length && origSelected.every(i => q.correct.includes(i)), q);
  };
  // Drag-drop fill-in-the-blank handlers
  const initDD = (q) => {
    if (!selectedAnswer || !selectedAnswer.slots) {
      return { slots: new Array(q.correct.length).fill(null), bank: [...q.wordBank] };
    }
    return selectedAnswer;
  };
  const placeWord = (word, slotIdx) => {
    if (showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const state = initDD(q);
    const newSlots = [...state.slots];
    const newBank = [...state.bank];
    // If slot already has a word, return it to bank
    if (newSlots[slotIdx] !== null) {
      newBank.push(newSlots[slotIdx]);
      newSlots[slotIdx] = null;
    }
    // Place the word
    newSlots[slotIdx] = word;
    const wIdx = newBank.indexOf(word);
    if (wIdx > -1) newBank.splice(wIdx, 1);
    setSelectedAnswer({ slots: newSlots, bank: newBank });
  };
  const removeWord = (slotIdx) => {
    if (showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const state = initDD(q);
    const newSlots = [...state.slots];
    const newBank = [...state.bank];
    if (newSlots[slotIdx] !== null) {
      newBank.push(newSlots[slotIdx]);
      newSlots[slotIdx] = null;
    }
    setSelectedAnswer({ slots: newSlots, bank: newBank });
  };
  const bankTapWord = (word) => {
    if (showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const state = initDD(q);
    // Find first empty slot
    const emptyIdx = state.slots.indexOf(null);
    if (emptyIdx > -1) placeWord(word, emptyIdx);
  };
  const submitDD = () => {
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const state = initDD(q);
    if (state.slots.some(s => s == null)) return;
    const isCorrect = state.slots.every((s, i) => s == q.correct[i]);
    doAnswer(isCorrect, q);
  };
  // Column sort handlers
  const [heldItem, setHeldItem] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const initCol = (q) => {
    if (selectedAnswer?.columns) return selectedAnswer;
    const cols = {};
    q.columns.forEach(c => { cols[c.id] = []; });
    return { columns: cols, pool: [...q.items] };
  };
  const colPickItem = (item) => {
    if (showExplanation) return;
    setHeldItem(heldItem == item ? null : item);
  };
  const colDropInto = (colId, item) => {
    if (showExplanation) return;
    const dropping = item || heldItem;
    if (!dropping) return;
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const state = initCol(q);
    const newCols = {};
    Object.keys(state.columns).forEach(k => { newCols[k] = state.columns[k].filter(x => x !== dropping); });
    newCols[colId] = [...(newCols[colId] || []), dropping];
    const newPool = state.pool.filter(x => x !== dropping);
    setSelectedAnswer({ columns: newCols, pool: newPool, lastPlaced: dropping });
    setHeldItem(null);
    setDragOverCol(null);
    setTimeout(() => setSelectedAnswer(prev => prev?.lastPlaced == dropping ? { ...prev, lastPlaced: null } : prev), 500);
  };
  const colRemoveItem = (item, colId) => {
    if (showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const state = initCol(q);
    const newCols = {};
    Object.keys(state.columns).forEach(k => { newCols[k] = state.columns[k].filter(x => x !== item); });
    setSelectedAnswer({ columns: newCols, pool: [...state.pool, item], lastPlaced: null });
  };
  const submitCol = () => {
    const q = (selectedLesson?.questions || selectedModule.questions)[currentQuestion];
    const state = initCol(q);
    const totalPlaced = Object.values(state.columns).reduce((s, arr) => s + arr.length, 0);
    if (totalPlaced < q.items.length) return;
    const isCorrect = q.columns.every(col => {
      const placed = state.columns[col.id] || [];
      return placed.length == col.correct.length && col.correct.every(item => placed.includes(item));
    });
    doAnswer(isCorrect, q);
    setHeldItem(null);
    setDragOverCol(null);
  };
  const doAnswer = (ok, q) => {
    setCurrentAnswerCorrect(ok); setShowExplanation(true);
    if (ok) { setQuizScore(quizScore + 10); setStreak(streak + 1); if (streak + 1 >= 3) { setShowStreakAnim(true); setTimeout(() => setShowStreakAnim(false), 2000); } }
    else setStreak(0);
    setQuizResults([...quizResults, { question: q.question, correct: ok, explanation: q.explanation }]);
  };
  const handleNext = () => {
    const qs = selectedLesson?.questions || selectedModule?.questions;
    if (!qs) return;
    if (currentQuestion < qs.length - 1) { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(null); setHeldItem(null); setDragOverCol(null); setShowExplanation(false); setCurrentAnswerCorrect(false); }
    else {
      const eXP = quizScore * 2, eC = Math.floor(quizScore / 2);
      setTotalPoints(totalPoints + quizScore); setXp(xp + eXP); setCoins(coins + eC);
      if (xp + eXP >= level * 100) { setLevel(level + 1); setXp(xp + eXP - level * 100); }
      if (selectedLesson?.lessonIndex !== undefined && selectedModule) markLesComplete(selectedModule.id, selectedLesson.lessonIndex);
      else if (selectedModule) markModComplete(selectedModule.id);
      setScreen('results');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════════════════════════
  if (screen == 'home') {
    const xpNext = level * 100, xpPct = (xp / xpNext) * 100;
    return (
      <div className="min-h-screen relative overflow-hidden" style={pageBg}>
        <IslamicPattern />
        <nav className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-b border-emerald-100/50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-14">
            <div className="flex items-center gap-2.5">
              <Mascot size="sm" />
              <div><span className="text-lg font-bold tracking-tight" style={{fontFamily:"Georgia,serif",color:'#065f46'}}>Deany</span><div className="text-[10px] text-emerald-600/60" style={{fontFamily:"Georgia,serif"}}>Learn Islam Beautifully</div></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{background:'linear-gradient(135deg,#fef3c7,#fed7aa)',border:'1px solid #fbbf24',color:'#b45309'}}><Flame className="w-3.5 h-3.5" />{dailyStreak}</div>
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{background:'linear-gradient(135deg,#fef9c3,#fef08a)',border:'1px solid #facc15',color:'#a16207'}}>🪙 {coins}</div>
              <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{background:'linear-gradient(135deg,#d1fae5,#a7f3d0)',border:'1px solid #34d399',color:'#047857'}}><Trophy className="w-3.5 h-3.5" />Lvl {level}</div>
            </div>
          </div>
        </nav>

        <section className="relative max-w-5xl mx-auto px-4 pt-10 pb-6 md:pt-16">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-200/50 text-xs font-medium text-gray-500"><Target className="w-3 h-3 text-emerald-600" />Daily Goal: 35/50 XP</div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-[1.1]" style={{fontFamily:"Georgia,serif"}}>
              Learn Islam,{' '}<span style={{background:'linear-gradient(135deg,#059669,#0d9488,#0284c7)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>beautifully</span>
            </h1>
            <p className="text-base text-gray-500 max-w-md mx-auto">Interactive lessons, gamified learning, and a supportive journey through Islamic knowledge.</p>
            <div className={`${glass} rounded-xl p-4 max-w-xs mx-auto`}>
              <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:'linear-gradient(135deg,#059669,#0d9488)'}}>{level}</div><span className="text-xs font-bold text-gray-800">Level {level}</span></div><span className="text-[10px] text-gray-400">{xp}/{xpNext} XP</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"><div className="h-2.5 rounded-full transition-all duration-700" style={{width:`${Math.max(xpPct,3)}%`,background:'linear-gradient(90deg,#10b981,#14b8a6,#06b6d4)'}}/></div>
            </div>
            <div className="pt-2">
              <button onClick={() => lastSelectedTopicId ? selectMainTopic(lastSelectedTopicId) : document.getElementById('paths')?.scrollIntoView({behavior:'smooth'})}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl transition-all hover:shadow-emerald-500/25 hover:-translate-y-0.5"
                style={{background:'linear-gradient(135deg,#059669,#0d9488)'}}>
                {lastSelectedTopicId ? <><Play className="w-5 h-5" />Continue Learning</> : <><BookOpen className="w-5 h-5" />Choose Your Path</>}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="max-w-xs mx-auto pt-4">
              <div className={`${glass} rounded-xl p-4 relative`} style={{borderColor:'rgba(16,185,129,0.15)'}}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Mascot size="sm" /></div>
                <p className="pt-3 text-emerald-700 font-semibold text-xs text-center" style={{fontFamily:"Georgia,serif"}}>"As-salamu alaykum! Ready to learn today?"</p>
                <p className="text-gray-400 text-[10px] text-center mt-0.5">-- Fulus</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-4 gap-2.5">
            {[{l:'Points',v:totalPoints,c:'#b45309',bg:'from-amber-50 to-orange-50',bc:'#fbbf24'},{l:'Streak',v:` ${dailyStreak}`,c:'#c2410c',bg:'from-red-50 to-orange-50',bc:'#f97316'},{l:'Coins',v:`🪙 ${coins}`,c:'#a16207',bg:'from-yellow-50 to-amber-50',bc:'#eab308'},{l:'Level',v:level,c:'#047857',bg:'from-emerald-50 to-teal-50',bc:'#10b981'}].map((s,i) => (
              <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-xl p-3.5 text-center border hover:shadow-md transition-all`} style={{borderColor:s.bc+'30'}}>
                <div className="text-lg font-bold" style={{color:s.c}}>{s.v}</div>
                <div className="text-[10px] text-gray-500 font-medium mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="paths" className="relative py-12" style={{background:'linear-gradient(180deg,transparent,rgba(255,255,255,0.4),transparent)'}}>
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center" style={{fontFamily:"Georgia,serif"}}>Learning Paths</h2>
            <p className="text-gray-500 text-sm text-center mb-8 max-w-md mx-auto">Curated journeys through Islamic knowledge</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {mainTopics.map(t => (
                <button key={t.id} onClick={() => selectMainTopic(t.id)} className={`group ${glassHover} rounded-xl p-5 text-center`}>
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl shadow-md bg-gradient-to-br ${t.gradient} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>{t.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{t.title}</h3>
                  <p className="text-[11px] text-gray-500 mb-3">{t.subtitle}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold group-hover:gap-2 transition-all" style={{background:t.color+'12',color:t.color}}>Explore <ArrowRight className="w-3 h-3" /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-6">
          <div className="relative rounded-2xl p-6 text-white overflow-hidden" style={{background:'linear-gradient(135deg,#7c3aed,#6d28d9,#4f46e5)'}}>
            <IslamicPattern color="#fff" opacity={0.05} />
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
              <div><div className="flex items-center gap-2 mb-1.5"><Zap className="w-4 h-4" /><h3 className="text-base font-bold">Today's Challenge</h3></div><p className="text-white/70 text-xs max-w-sm">Complete 3 lessons to maintain your streak!</p></div>
              <div className="flex items-center gap-2">
                <button className="bg-white text-violet-700 px-4 py-2 rounded-lg font-semibold text-xs shadow-md">Accept</button>
                <div className="flex items-center gap-1 bg-white/15 px-3 py-1.5 rounded-lg text-xs"><Gift className="w-3.5 h-3.5" /><span className="font-semibold">+50 XP</span></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MODULES
  // ═══════════════════════════════════════════════════════════════
  if (screen == 'modules') {
    if (selectedMainTopic.id == 'quran-arabic') {
      return (<div className="min-h-screen relative" style={pageBg}><IslamicPattern /><div className="relative z-10 max-w-2xl mx-auto px-4 py-8"><NavHeader onBack={goHome} onHome={goHome} backLabel="Topics" /><div className={`${glass} rounded-2xl p-12 text-center`}><div className="text-6xl mb-4">🚧</div><h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily:"Georgia,serif"}}>Coming Soon!</h1><p className="text-gray-500 text-sm">{selectedMainTopic.title} content is being crafted.</p></div></div></div>);
    }
    const mods = modules[selectedMainTopic.id] || [];
    const isHist = selectedMainTopic.id == 'islamic-history';
    const isFin = selectedMainTopic.id == 'islamic-finance';
    return (
      <div className="min-h-screen relative" style={pageBg}>
        <IslamicPattern /><div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
          <NavHeader onBack={goHome} onHome={goHome} backLabel="Topics" />
          <div className={`${glass} rounded-2xl p-6 mb-6`}>
            <div className="flex items-center gap-4"><div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md bg-gradient-to-br ${selectedMainTopic.gradient}`}>{selectedMainTopic.icon}</div><div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"Georgia,serif"}}>{selectedMainTopic.title}</h1><p className="text-gray-500 text-xs">{selectedMainTopic.subtitle} · {mods.length} modules</p></div></div>
          </div>
          {isHist ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map((e, i) => (
                <button key={e.id} onClick={() => !e.locked && selectModule(e)} disabled={e.locked} className={`group ${glassHover} rounded-xl p-6 text-center ${e.locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white text-xs font-bold mb-2 shadow-sm" style={{background:'linear-gradient(135deg,#0ea5e9,#3b82f6)'}}>{i+1}</div>
                  <div className="text-3xl mb-2">{e.icon}</div><h3 className="font-bold text-gray-900 text-xs mb-0.5">{e.title}</h3><p className="text-[10px] text-gray-500 mb-2">{e.subtitle}</p>
                  {!e.locked ? <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold text-sky-700 bg-sky-50">Explore <ArrowRight className="w-2.5 h-2.5" /></span> : <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold text-gray-400 bg-gray-100"><Lock className="w-2.5 h-2.5" />Soon</span>}
                </button>
              ))}
            </div>
          ) : isFin ? (
            <div className="max-w-xl mx-auto space-y-3">
              {mods.map((m, i) => {
                const locked = isModuleLocked(i, selectedMainTopic.id);
                return (
                  <button key={m.id} onClick={() => selectModule(m, i)} disabled={locked} className={`w-full ${glassHover} rounded-xl p-5 text-left group ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm" style={{background:m.color+'12'}}>{locked ? <Lock className="w-5 h-5 text-gray-300" /> : m.icon}</div>
                      <div className="flex-grow min-w-0"><h3 className="font-bold text-gray-900 text-sm">{m.title}</h3><p className="text-xs text-gray-500">{m.subtitle}</p>
                        <div className="flex gap-2 mt-1">{m.difficulty && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${m.difficulty=='Beginner'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-700'}`}>{m.difficulty}</span>}{m.lessonCount && <span className="text-[10px] text-gray-400">{m.lessonCount} lessons</span>}</div>
                      </div>
                      {!locked && <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map(m => (
                <button key={m.id} onClick={() => selectModule(m)} disabled={m.locked} className={`group ${glassHover} rounded-xl p-5 text-left ${m.locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="w-12 h-12 mb-2 rounded-lg flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform" style={{background:m.color+'12'}}>{m.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{m.title}</h3><p className="text-[11px] text-gray-500 mb-2">{m.subtitle}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{background:m.color+'12',color:m.color}}>Coming Soon</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // LESSONS
  if (screen == 'lessons' && selectedModule) {
    return (
      <div className="min-h-screen relative" style={pageBg}><IslamicPattern /><div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <NavHeader onBack={goModules} onHome={goHome} backLabel="Modules" />
        <div className={`${glass} rounded-2xl p-6 mb-6`}>
          <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md" style={{background:selectedModule.color+'12'}}>{selectedModule.icon}</div><div><h1 className="text-xl font-bold text-gray-900" style={{fontFamily:"Georgia,serif"}}>{selectedModule.title}</h1><p className="text-gray-500 text-xs">{selectedModule.subtitle}</p></div></div>
          {selectedModule.mascotMessage && <div className="mt-3 bg-emerald-50/50 rounded-lg p-2.5 border border-emerald-100 flex items-start gap-2"><Mascot size="sm" className="flex-shrink-0 !w-8 !h-8 !text-lg" /><p className="text-xs text-gray-700"><b className="text-emerald-700">Fulus:</b> {selectedModule.mascotMessage}</p></div>}
        </div>
        <div className="space-y-2.5 max-w-lg mx-auto">
          {selectedModule.lessons?.map((l, i) => {
            const lk = isLessonLocked(i, selectedModule.id), done = completedLessons[`${selectedModule.id}-lesson-${i}`];
            return (
              <button key={l.id} onClick={() => selectLes(l, i)} disabled={lk} className={`w-full ${glassHover} rounded-lg p-4 text-left group ${lk ? 'opacity-50 cursor-not-allowed' : ''} ${done ? 'ring-1 ring-emerald-200' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-xs shadow-sm" style={{background:lk?'#e5e7eb':selectedModule.color+'12',color:lk?'#9ca3af':selectedModule.color}}>{lk?<Lock className="w-3.5 h-3.5" />:i+1}</div>
                  <div className="flex-grow min-w-0"><h3 className="font-bold text-gray-900 text-xs">{l.title}</h3><p className="text-[10px] text-gray-500">{l.description}</p><span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock className="w-2.5 h-2.5" />{l.duration}{!l.questions.length && !lk && <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Soon</span>}</span></div>
                  {!lk && <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-600 transition-all" />}
                </div>
              </button>
            );
          })}
        </div>
      </div></div>
    );
  }

  // EPOCH LEVELS
  if (screen == 'epoch-levels' && selectedEpoch) {
    return (
      <div className="min-h-screen relative" style={pageBg}><IslamicPattern /><div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <NavHeader onBack={() => setScreen('modules')} onHome={goHome} backLabel="Epochs" />
        <div className={`${glass} rounded-2xl p-6 mb-6 text-center`}><div className="text-5xl mb-2">{selectedEpoch.icon}</div><h1 className="text-xl font-bold text-gray-900" style={{fontFamily:"Georgia,serif"}}>{selectedEpoch.title}</h1><p className="text-gray-500 text-xs">{selectedEpoch.subtitle}</p></div>
        <div className="space-y-2.5">{selectedEpoch.levels.map((l, i) => (
          <button key={l.id} onClick={() => !l.locked && selectLvl(l)} disabled={l.locked} className={`w-full ${glassHover} rounded-xl p-4 text-left group ${l.locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl text-white shadow-md ${i==0?'bg-gradient-to-br from-green-500 to-emerald-600':i==1?'bg-gradient-to-br from-blue-500 to-sky-600':'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>{['🌱','📚','🎓'][i]}</div><div><h3 className="font-bold text-gray-900 text-sm">{l.name}</h3>{l.locked && l.message && <p className="text-[10px] text-gray-500">{l.message}</p>}{!l.locked && l.lessons && <p className="text-[10px] text-gray-500">{l.lessons.length} lessons</p>}</div></div>
              {!l.locked ? <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" /> : <Lock className="w-4 h-4 text-gray-300" />}
            </div>
          </button>
        ))}</div>
      </div></div>
    );
  }

  // HISTORY LESSONS
  if (screen == 'history-lessons' && selectedLevel && selectedEpoch) {
    return (
      <div className="min-h-screen relative" style={pageBg}><IslamicPattern /><div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <NavHeader onBack={() => setScreen('epoch-levels')} onHome={goHome} backLabel="Levels" />
        <div className={`${glass} rounded-2xl p-4 mb-6`}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-xl shadow-sm">{selectedEpoch.icon}</div><div><h1 className="text-lg font-bold text-gray-900" style={{fontFamily:"Georgia,serif"}}>{selectedEpoch.title}</h1><p className="text-gray-500 text-[10px]">{selectedLevel.name}</p></div></div></div>
        <div className="grid sm:grid-cols-2 gap-3">{selectedLevel.lessons.map(l => (
          <button key={l.id} onClick={() => selectHistLesson(l)} className={`group ${glassHover} rounded-xl p-5 text-center`}>
            <div className="text-3xl mb-2">{l.icon}</div><h3 className="font-bold text-gray-900 text-xs mb-0.5">{l.title}</h3><p className="text-[10px] text-gray-500 mb-2">{l.subtitle}</p>
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mb-2"><Clock className="w-2.5 h-2.5" />{l.estimatedTime}<BookOpen className="w-2.5 h-2.5 ml-1" />{l.questions.length}Q</div>
            <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold text-white shadow-sm" style={{background:'linear-gradient(135deg,#0ea5e9,#3b82f6)'}}>Start <ArrowRight className="w-2.5 h-2.5" /></span>
          </button>
        ))}</div>
      </div></div>
    );
  }


  // SPEED ROUND
  if (screen === 'speed-round' && selectedModule?.isSpeedRound) {
    const qs = selectedModule.questions;
    const total = qs.length;
    
    if (speedRoundIdx >= total && !speedFeedback) {
      const correct = speedResults.filter(r => r.correct).length;
      const pct = Math.round((correct / total) * 100);
      return (
        <div className="min-h-screen relative" style={pageBg}>
          <IslamicPattern /><div className="relative z-10 max-w-xl mx-auto px-4 py-8">
            <div className={`${glass} rounded-2xl p-8 text-center`}>
              <div className="text-5xl mb-3">{pct >= 80 ? '\u2b50' : pct >= 60 ? '\ud83d\udc4d' : '\ud83d\udcaa'}</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily:"Georgia,serif"}}>Speed Round Complete!</h1>
              <p className="text-sm text-gray-500 mb-5">{pct >= 80 ? 'Lightning Fast!' : pct >= 60 ? 'Quick Thinker!' : 'Keep Sharpening!'}</p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100"><div className="text-xl font-bold text-green-700">{correct}/{total}</div><div className="text-[10px] text-gray-500">Correct</div></div>
                <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100"><div className="text-xl font-bold text-purple-700">{pct}%</div><div className="text-[10px] text-gray-500">Accuracy</div></div>
                <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100"><div className="text-xl font-bold text-amber-700">+{correct * 15}</div><div className="text-[10px] text-gray-500">XP</div></div>
              </div>
              <div className="space-y-1.5 mb-5 max-h-64 overflow-y-auto">{speedResults.map((r, i) => (
                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg text-left text-xs ${r.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex-shrink-0 mt-0.5">{r.correct ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}</div>
                  <div><div className="font-medium text-gray-800 text-[11px] mb-0.5">{r.question}</div><div className="text-[10px] text-gray-500">{r.reasoning}</div></div>
                </div>
              ))}</div>
              <button onClick={goModules} className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{background:'linear-gradient(135deg,#059669,#0d9488)'}}>Back to Modules</button>
            </div>
          </div>
        </div>
      );
    }

    if (speedFeedback) {
      return (
        <div className="min-h-screen relative flex items-center justify-center px-4" style={pageBg}>
          <IslamicPattern /><div className="relative z-10 max-w-md w-full">
            <div className={`${glass} rounded-2xl overflow-hidden`} style={{animation:'fadeSlideIn 0.2s ease-out'}}>
              <div className="h-1.5" style={{background: speedFeedback.correct ? 'linear-gradient(90deg,#22c55e,#10b981)' : 'linear-gradient(90deg,#ef4444,#f97316)'}} />
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">{speedFeedback.correct ? '\u2705' : '\u274c'}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{speedFeedback.correct ? 'Correct!' : 'Not quite'}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{speedFeedback.reasoning}</p>
                <button onClick={() => { setSpeedFeedback(null); setSpeedRoundIdx(speedRoundIdx + 1); }}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white" style={{background: speedFeedback.correct ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>
                  {speedRoundIdx < total - 1 ? 'Next Card' : 'See Results'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const cq = qs[speedRoundIdx];
    const handleSwipe = (dir) => {
      const isCorrect = dir === cq.answer;
      setSpeedResults([...speedResults, { question: cq.question, correct: isCorrect, reasoning: cq.reasoning }]);
      setSpeedFeedback({ correct: isCorrect, reasoning: cq.reasoning });
    };

    return (
      <div className="min-h-screen relative flex items-center justify-center px-4" style={pageBg}>
        <IslamicPattern /><div className="relative z-10 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <button onClick={goModules} className="flex items-center gap-1.5 bg-white/50 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200/50"><Home className="w-3.5 h-3.5" />Exit</button>
            <div className="px-3 py-1 rounded-full text-xs font-bold" style={{background:'linear-gradient(135deg,#ede9fe,#ddd6fe)',border:'1px solid #a78bfa',color:'#6d28d9'}}>\u26a1 {speedRoundIdx + 1}/{total}</div>
          </div>
          <div className={`${glass} rounded-2xl overflow-hidden`} style={{animation:'fadeSlideIn 0.25s ease-out'}}>
            <div className="h-1.5" style={{background:'linear-gradient(90deg,#7c3aed,#6366f1)'}} />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">SPEED TRIAGE</span>
                {cq.tags?.map((t,i) => <span key={i} className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-6">{cq.question}</p>
              <div className="grid grid-cols-3 gap-2.5">
                <button onClick={() => handleSwipe('nc')} className="p-3.5 rounded-xl border-2 border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-400 transition-all text-center">
                  <div className="text-lg mb-1">\ud83d\udeab</div>
                  <div className="text-[10px] font-bold text-red-700">Non-Compliant</div>
                </button>
                <button onClick={() => handleSwipe('nmi')} className="p-3.5 rounded-xl border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-400 transition-all text-center">
                  <div className="text-lg mb-1">\ud83d\udd0d</div>
                  <div className="text-[10px] font-bold text-amber-700">Need More Info</div>
                </button>
                <button onClick={() => handleSwipe('c')} className="p-3.5 rounded-xl border-2 border-green-200 bg-green-50/50 hover:bg-green-100 hover:border-green-400 transition-all text-center">
                  <div className="text-lg mb-1">\u2705</div>
                  <div className="text-[10px] font-bold text-green-700">Compliant</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════════════
  // QUIZ
  // ═══════════════════════════════════════════════════════════════
  if (screen == 'quiz' && (selectedModule || selectedLesson)) {
    const qs = selectedLesson?.questions || selectedModule?.questions;
    const cq = qs[currentQuestion], total = qs.length, pct = ((currentQuestion+1)/total)*100;

    if (showConceptIntro) {
      const cards = selectedLesson?.conceptCards || selectedModule?.conceptCards;
      if (!cards?.length) { setShowConceptIntro(false); }
      else {
      const cc = cards[conceptIndex], last = conceptIndex == cards.length - 1;
      return (
        <div className="min-h-screen relative flex items-center justify-center px-4 py-8" style={pageBg}>
          <IslamicPattern /><GlossaryPopup /><div className="relative z-10 max-w-xl w-full">
            <div className={`${glass} rounded-2xl overflow-hidden`} style={{animation:'fadeSlideIn 0.3s ease-out'}}>
              <div className="h-1" style={{background:'linear-gradient(90deg,#3b82f6,#6366f1)'}} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-md flex items-center justify-center" style={{background:'linear-gradient(135deg,#3b82f6,#6366f1)'}}><BookOpen className="w-4 h-4 text-white" /></div><div><h2 className="text-sm font-bold text-gray-900" style={{fontFamily:"Georgia,serif"}}>Lesson Concepts</h2><p className="text-[10px] text-gray-500">{selectedLesson?.title || selectedModule?.title}</p></div></div>
                  <div className="text-right"><div className="text-lg font-bold text-indigo-600">{conceptIndex+1}</div><div className="text-[10px] text-gray-400">of {cards.length}</div></div>
                </div>
                {cc.title && <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-3"><Sparkles className="w-3 h-3" />{cc.title}</div>}
                <div className="text-gray-800 leading-relaxed text-sm mb-5 whitespace-pre-line"><GT text={cc.text} /></div>
                <div className="flex items-center justify-center gap-1 mb-5">{cards.map((_,i)=><div key={i} className={`h-1 rounded-full transition-all ${i==conceptIndex?'w-5 bg-indigo-500':i<conceptIndex?'w-1.5 bg-indigo-300':'w-1.5 bg-gray-200'}`}/>)}</div>
                <div className="flex gap-2">
                  {conceptIndex > 0 && <button onClick={() => setConceptIndex(conceptIndex-1)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1"><ChevronLeft className="w-3.5 h-3.5" />Prev</button>}
                  {!last ? <button onClick={() => setConceptIndex(conceptIndex+1)} className="flex-1 text-white py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 shadow-md" style={{background:'linear-gradient(135deg,#3b82f6,#6366f1)'}}>Next <ArrowRight className="w-3.5 h-3.5" /></button>
                  : <button onClick={() => {setShowConceptIntro(false);setConceptIndex(0);}} className="flex-1 text-white py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-lg" style={{background:'linear-gradient(135deg,#059669,#0d9488)'}}>Start Quiz <Sparkles className="w-3.5 h-3.5" /></button>}
                </div>
                <button onClick={() => {setShowConceptIntro(false);setConceptIndex(0);}} className="w-full mt-3 text-[10px] text-gray-400 hover:text-gray-600 py-1">Skip to quiz →</button>
              </div>
            </div>
          </div>
        </div>
      );
      }
    }

    return (
      <div className="min-h-screen relative" style={pageBg}>
        {showConfetti && <Confetti />}
        <GlossaryPopup />
        <IslamicPattern /><div className="relative z-10 max-w-xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center mb-3">
            <button onClick={goHome} className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200/50"><Home className="w-3.5 h-3.5" />Exit</button>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{background:'linear-gradient(135deg,#fef9c3,#fef08a)',border:'1px solid #facc15'}}><Star className="w-3 h-3 text-amber-600 fill-amber-500" /><span className="font-bold text-amber-700">{quizScore}</span></div>
              {streak > 0 && <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${showStreakAnim?'animate-pulse':''}`} style={{background:'linear-gradient(135deg,#fed7aa,#fecaca)',border:'1px solid #f97316',color:'#c2410c'}}>{streak}</div>}
            </div>
          </div>
          <div className={`${glass} rounded-xl p-3.5 mb-4`}>
            <div className="flex items-center gap-2.5 mb-2"><Mascot size="sm" className="!w-8 !h-8 !text-lg" /><div className="flex-grow min-w-0"><h2 className="font-bold text-gray-900 text-xs truncate">{selectedLesson?.title||selectedModule?.title}</h2><div className="flex justify-between text-[10px] text-gray-400"><span>Q{currentQuestion+1}/{total}</span><div className="flex items-center gap-0.5">{[...Array(Math.min(total,15))].map((_,i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < currentQuestion ? 'bg-emerald-400' : i === currentQuestion ? 'bg-emerald-600 w-2.5' : 'bg-gray-200'}`} />)}</div><span>{Math.round(pct)}%</span></div></div></div>
            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full transition-all duration-500" style={{width:`${pct}%`,background:'linear-gradient(90deg,#10b981,#14b8a6)'}}/></div>
          </div>
          <div className={`${glass} rounded-xl p-5 mb-4`}>
            {/* ---- VISUAL HEADER based on uiType ---- */}
            {cq.uiType == 'compare' && cq.visual?.cards && (
              <div className="grid grid-cols-2 gap-2.5 mb-5" style={{animation:'fadeSlideIn 0.3s ease-out'}}>
                {cq.visual.cards.map((card, ci) => (
                  <div key={ci} className="rounded-xl p-3.5 border-2 border-gray-200 bg-gradient-to-b from-slate-50/60 to-white">
                    <div className="text-[10px] font-black tracking-widest mb-2.5 px-2 py-1 rounded-md inline-block bg-slate-100 text-slate-700">{card.title}</div>
                    <div className="space-y-1.5">{(card.neutralLines || card.lines).filter(l=>l).map((line, li) => (
                      <div key={li} className="text-[11px] leading-snug text-gray-600">{line}</div>
                    ))}</div>
                  </div>
                ))}
                <div className="col-span-2 flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-semibold mt-1"><Eye className="w-3 h-3"/>COMPARE: Read both carefully</div>
              </div>
            )}
            {cq.uiType == 'spot' && cq.visual?.mockup && (
              <div className="mb-5 rounded-xl border-2 border-slate-200 bg-gradient-to-b from-slate-50/50 to-white overflow-hidden" style={{animation:'fadeSlideIn 0.3s ease-out'}}>
                <div className="bg-gradient-to-r from-slate-100 to-gray-100 px-3.5 py-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">{cq.visual.mockup.title}</span>
                  <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold"> SPOT THE DEFECT</span>
                </div>
                {cq.visual.mockup.rating && <div className="px-3.5 pt-2 text-xs text-gray-500">{cq.visual.mockup.rating}</div>}
                {cq.visual.mockup.price && <div className="px-3.5 text-sm font-bold text-gray-900">{cq.visual.mockup.price}</div>}
                {cq.visual.mockup.features && <div className="px-3.5 py-2.5 space-y-1.5">{cq.visual.mockup.features.map((f,fi) => (
                  <div key={fi} className="text-[11px] px-2.5 py-1.5 rounded-md bg-gray-50 text-gray-700">{f}</div>
                ))}</div>}
                {cq.visual.mockup.layout == 'swap' && (
                  <div className="px-3.5 py-3 flex items-center gap-2">
                    <div className="flex-1 bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-center">
                      <div className="text-[9px] font-bold text-slate-600 mb-1">{cq.visual.mockup.left.label}</div>
                      {cq.visual.mockup.left.items.map((it,ii)=><div key={ii} className="text-[11px] text-gray-700">{it}</div>)}
                    </div>
                    <div className="text-lg">⇌</div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-center">
                      <div className="text-[9px] font-bold text-slate-600 mb-1">{cq.visual.mockup.right.label}</div>
                      {cq.visual.mockup.right.items.map((it,ii)=><div key={ii} className="text-[11px] text-gray-700">{it}</div>)}
                    </div>
                  </div>
                )}
                {cq.visual.mockup.lines && !cq.visual.mockup.layout && <div className="px-3.5 py-2.5 space-y-1">{cq.visual.mockup.lines.filter(l=>l).map((l,li) => (
                  <div key={li} className="text-[11px] text-gray-700">{l}</div>
                ))}</div>}
                {cq.visual?.factChips && <div className="px-3.5 pb-3 flex flex-wrap gap-1.5 mt-1">{cq.visual.factChips.map((fc,fi)=><span key={fi} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">{fc}</span>)}</div>}
              </div>
            )}
            {cq.uiType == 'flow-tap' && cq.visual?.steps && (
              <div className="mb-5 space-y-0" style={{animation:'fadeSlideIn 0.3s ease-out'}}>
                <div className="flex items-center gap-1.5 mb-3"><span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold"> FLOW: Which step has the defect?</span></div>
                {cq.visual.steps.map((step, si) => (
                  <div key={si}>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-gray-200 bg-white transition-all">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-indigo-100 text-indigo-700">{step.num}</div>
                      <div className="flex-1"><div className="text-[11px] font-medium leading-snug text-gray-700">{step.title}</div></div>
                    </div>
                    {si < cq.visual.steps.length - 1 && <div className="flex justify-center py-1"><div className="w-0.5 h-4 bg-gray-200 rounded"/></div>}
                  </div>
                ))}
              </div>
            )}
            {cq.uiType == 'calc' && cq.visual && (
              <div className="mb-5 rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/50 to-white p-4" style={{animation:'fadeSlideIn 0.3s ease-out'}}>
                <div className="flex items-center gap-1.5 mb-3"><span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">🧮 CALCULATION</span></div>
                {cq.visual.factChips && <div className="flex flex-wrap gap-1.5 mb-3">{cq.visual.factChips.map((fc,fi)=><span key={fi} className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg font-semibold border border-blue-200">{fc}</span>)}</div>}
                {cq.visual.calcSteps && <div className="space-y-2 bg-white/80 rounded-lg p-3 border border-blue-100">{cq.visual.calcSteps.map((step,si)=>(
                  <div key={si} className="text-[11px] font-mono text-gray-700 flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[9px] font-bold flex-shrink-0">{si+1}</span><span>{step}</span></div>
                ))}</div>}
              </div>
            )}
            {cq.uiType == 'advise' && (
              <div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">💡 ADVISE: Pick the best response</span></div>
            )}
            {cq.uiType == 'triage' && (
              <div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold"> TRIAGE: Sort the scenarios</span></div>
            )}
            {cq.uiType == 'fill' && (
              <div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold">✏️ FILL: Complete the statement</span></div>
            )}
            {cq.uiType == 'match' && (
              <div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-bold"> MATCH: Connect the pairs</span></div>
            )}
            {cq.uiType == 'slider' && (
              <div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">📊 CLASSIFY: Where does it fall?</span></div>
            )}
            {(cq.uiType == 'sel2' || cq.uiType == 'selall') && (
              <div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{cq.uiType == 'sel2' ? '✌️ SELECT TWO' : '☑️ SELECT ALL THAT APPLY'}</span></div>
            )}

            {/* ---- QUESTION TEXT ---- */}
            <h2 className="text-base font-bold text-gray-900 mb-4 leading-relaxed"><GT text={cq.question} /></h2>

            {/* ---- ANSWER OPTIONS ---- */}
            {cq.type == 'multiple-choice' && (() => { const sh = getShuffled(currentQuestion, cq); const isAdvise = cq.uiType == 'advise'; const isCompare = cq.uiType == 'compare'; const isFlow = cq.uiType == 'flow-tap'; return <>
              <div className={`${isAdvise ? 'space-y-2.5' : 'space-y-2'} mb-4`}>{sh.options.map((o,i) => {const sel = selectedAnswer==i, origI = sh.toOriginal(i), cor = origI==cq.correct; return (
                <button key={i} onClick={() => handleMC(i)} disabled={showExplanation} className={`w-full transition-all text-left text-xs font-medium border-2 ${
                  isAdvise ? `p-4 rounded-xl ${showExplanation&&cor?'bg-green-50 border-green-400 ring-2 ring-green-200':showExplanation&&sel&&!cor?'bg-red-50 border-red-300':!showExplanation&&sel?'bg-violet-50 border-violet-500 shadow-md ring-2 ring-violet-200':'bg-white border-gray-200 hover:border-violet-300 hover:shadow-sm'}` :
                  `p-3 rounded-lg ${showExplanation&&cor?'bg-green-50 border-green-400':showExplanation&&sel&&!cor?'bg-red-50 border-red-300':!showExplanation&&sel?'bg-emerald-50 border-emerald-500 shadow-sm':'bg-white border-gray-200 hover:border-emerald-300'}`
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    {isAdvise && <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${sel && !showExplanation ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{String.fromCharCode(65+i)}</div>}
                    <span className={`flex-1 ${isAdvise ? 'leading-relaxed' : ''}`}>{o}</span>
                    {showExplanation&&cor&&<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0"/>}
                    {showExplanation&&sel&&!cor&&<XCircle className="w-4 h-4 text-red-400 flex-shrink-0"/>}
                    {sel&&!showExplanation&&!isAdvise&&<div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3 h-3 text-white"/></div>}
                  </div>
                </button>);
              })}</div>
              {!showExplanation && <button onClick={submitMC} disabled={selectedAnswer==null} className={`w-full py-3 rounded-lg font-bold text-xs transition-all ${selectedAnswer!==null?'text-white shadow-md':'bg-gray-100 text-gray-300 cursor-not-allowed'}`} style={selectedAnswer!==null?{background:'linear-gradient(135deg,#059669,#0d9488)'}:{}}>Check Answer</button>}
            </>; })()}
            {cq.type == 'multi-select' && (() => { const sh = getShuffled(currentQuestion, cq); const isSel2 = cq.uiType == 'sel2'; const selCount = selectedAnswer?.length || 0; return <>
              {isSel2 && !showExplanation && <div className="flex items-center gap-2 mb-3"><div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${selCount == 2 ? 'bg-emerald-100 text-emerald-700' : selCount > 2 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{selCount}/2 selected</div></div>}
              <div className="space-y-2 mb-4">{sh.options.map((o,i) => {const sel = selectedAnswer?.includes(i), origI = sh.toOriginal(i), cor = cq.correct.includes(origI), wrong = showExplanation&&sel&&!cor, missed = showExplanation&&!sel&&cor; return (
                <button key={i} onClick={() => handleMS(i)} disabled={showExplanation} className={`w-full p-3 rounded-lg transition-all text-left text-xs font-medium border-2 ${showExplanation&&sel&&cor?'bg-green-50 border-green-400':wrong?'bg-red-50 border-red-300':missed?'bg-amber-50 border-amber-300':!showExplanation&&sel?'bg-emerald-50 border-emerald-500 shadow-sm':'bg-white border-gray-200 hover:border-emerald-300'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1"><div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${sel && !showExplanation ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>{sel && !showExplanation && <CheckCircle className="w-3 h-3 text-white"/>}</div><span>{o}</span></div>
                    {showExplanation&&sel&&cor&&<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0"/>}
                    {wrong&&<XCircle className="w-4 h-4 text-red-400 flex-shrink-0"/>}
                    {missed&&<span className="text-[10px] text-amber-600 font-semibold flex-shrink-0">Missed</span>}
                  </div>
                </button>);
              })}</div>
              {!showExplanation && <button onClick={submitMS} disabled={!selectedAnswer?.length} className={`w-full py-3 rounded-lg font-bold text-xs transition-all ${selectedAnswer?.length?'text-white shadow-md':'bg-gray-100 text-gray-300 cursor-not-allowed'}`} style={selectedAnswer?.length?{background:'linear-gradient(135deg,#059669,#0d9488)'}:{}}>Check Answer</button>}
            </>; })()}
            {cq.type == 'drag-drop' && (() => {
              const ddState = selectedAnswer?.slots ? selectedAnswer : { slots: new Array(cq.correct.length).fill(null), bank: [...cq.wordBank] };
              const allFilled = ddState.slots.every(s => s !== null);
              // Build the sentence with blank slots
              const parts = cq.sentence.split('___');
              return <>
                {/* Sentence with drop zones */}
                <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-lg p-4 mb-5 border border-indigo-100">
                  <div className="text-sm text-gray-800 leading-loose flex flex-wrap items-center gap-1">
                    {parts.map((part, i) => (
                      <React.Fragment key={i}>
                        <span className="whitespace-pre-wrap">{part}</span>
                        {i < parts.length - 1 && (
                          <button
                            onClick={() => ddState.slots[i] !== null ? removeWord(i) : null}
                            className={`inline-flex items-center min-w-[80px] h-8 px-3 rounded-md text-xs font-bold transition-all mx-0.5 ${
                              showExplanation && ddState.slots[i] == cq.correct[i]
                                ? 'bg-green-100 border-2 border-green-400 text-green-700'
                                : showExplanation && ddState.slots[i] !== null && ddState.slots[i] !== cq.correct[i]
                                ? 'bg-red-50 border-2 border-red-300 text-red-600'
                                : ddState.slots[i] !== null
                                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700 hover:bg-red-50 hover:border-red-300 cursor-pointer'
                                : 'bg-white border-2 border-dashed border-gray-300 text-gray-400'
                            }`}
                          >
                            {ddState.slots[i] !== null ? (
                              <span className="flex items-center gap-1">
                                {ddState.slots[i]}
                                {showExplanation && ddState.slots[i] == cq.correct[i] && <CheckCircle className="w-3 h-3 text-green-500" />}
                                {showExplanation && ddState.slots[i] !== cq.correct[i] && <XCircle className="w-3 h-3 text-red-400" />}
                                {!showExplanation && <span className="text-[9px] ml-1 opacity-60">✕</span>}
                              </span>
                            ) : (
                              <span className="text-[10px]">{i + 1}</span>
                            )}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  {/* Show correct answers when wrong */}
                  {showExplanation && !ddState.slots.every((s, i) => s == cq.correct[i]) && (
                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <div className="text-[10px] font-semibold text-indigo-600 mb-1">Correct order:</div>
                      <div className="flex flex-wrap gap-1">
                        {cq.correct.map((w, i) => (
                          <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[11px] font-semibold">{w}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Word Bank */}
                <div className="mb-4">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <span>📦</span> Word Bank -- tap to place
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ddState.bank.map((word, i) => (
                      <button
                        key={word + '-' + i}
                        onClick={() => bankTapWord(word)}
                        disabled={showExplanation}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                          showExplanation
                            ? 'bg-gray-50 border-gray-200 text-gray-400'
                            : 'bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 shadow-sm hover:shadow-md active:scale-95 cursor-pointer'
                        }`}
                      >
                        {word}
                      </button>
                    ))}
                    {ddState.bank.length == 0 && !showExplanation && (
                      <div className="text-[10px] text-gray-400 italic py-2">All words placed! Tap a slot to remove.</div>
                    )}
                  </div>
                </div>
                {!showExplanation && <button onClick={submitDD} disabled={!allFilled} className={`w-full py-3 rounded-lg font-bold text-xs transition-all ${allFilled?'text-white shadow-md':'bg-gray-100 text-gray-300 cursor-not-allowed'}`} style={allFilled?{background:'linear-gradient(135deg,#059669,#0d9488)'}:{}}>Check Answer</button>}
              </>;
            })()}
            {cq.type == 'column-sort' && (() => {
              const colState = selectedAnswer?.columns ? selectedAnswer : initCol(cq);
              const totalPlaced = Object.values(colState.columns).reduce((s, arr) => s + arr.length, 0);
              const allPlaced = totalPlaced >= cq.items.length;
              return <>
                {/* Draggable Statement Pool */}
                {colState.pool.length > 0 && (
                  <div className="mb-5">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="text-sm">✋</span> Drag statements into the cups below
                    </div>
                    <div className="space-y-2">
                      {colState.pool.map((item) => {
                        const isHeld = heldItem == item;
                        return (
                          <div
                            key={item}
                            draggable={!showExplanation}
                            onDragStart={(e) => { e.dataTransfer.setData('text/plain', item); e.dataTransfer.effectAllowed = 'move'; setHeldItem(item); }}
                            onDragEnd={() => { setHeldItem(null); setDragOverCol(null); }}
                            onClick={() => colPickItem(item)}
                            className={`text-xs font-medium rounded-xl p-3.5 border-2 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                              isHeld
                                ? 'bg-indigo-50 border-indigo-400 shadow-lg scale-[1.02] ring-2 ring-indigo-200/60'
                                : 'bg-white/90 border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'
                            }`}
                            style={{animation: 'fadeSlideIn 0.25s ease-out'}}
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Drag handle */}
                              <div className={`flex flex-col gap-[3px] flex-shrink-0 transition-colors ${isHeld ? 'opacity-80' : 'opacity-30'}`}>
                                <div className="flex gap-[3px]"><div className="w-[4px] h-[4px] rounded-full bg-current"/><div className="w-[4px] h-[4px] rounded-full bg-current"/></div>
                                <div className="flex gap-[3px]"><div className="w-[4px] h-[4px] rounded-full bg-current"/><div className="w-[4px] h-[4px] rounded-full bg-current"/></div>
                                <div className="flex gap-[3px]"><div className="w-[4px] h-[4px] rounded-full bg-current"/><div className="w-[4px] h-[4px] rounded-full bg-current"/></div>
                              </div>
                              <span className={`leading-snug ${isHeld ? 'text-indigo-800' : 'text-gray-700'}`}>{item}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {colState.pool.length == 0 && !showExplanation && (
                  <div className="text-center text-[10px] text-gray-400 italic mb-4 py-2">All statements sorted -- tap an item in a cup to move it back</div>
                )}

                {/* Cup Drop Zones */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {cq.columns.map(col => {
                    const items = colState.columns[col.id] || [];
                    const isOver = dragOverCol == col.id;
                    const canDrop = (heldItem || isOver) && !showExplanation;
                    return (
                      <div
                        key={col.id}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverCol(col.id); }}
                        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCol(null); }}
                        onDrop={(e) => { e.preventDefault(); const d = e.dataTransfer.getData('text/plain'); if (d) colDropInto(col.id, d); }}
                        onClick={() => { if (heldItem && !showExplanation) colDropInto(col.id); }}
                        className="relative"
                      >
                        {/* Cup Shape: open top, curved sides, wider at top narrower at bottom */}
                        <div
                          className={`relative overflow-hidden transition-all duration-300 ${canDrop ? 'cursor-pointer' : ''}`}
                          style={{
                            borderRadius: '16px 16px 24px 24px',
                            border: `2.5px solid ${isOver ? col.color : canDrop ? col.color + '70' : showExplanation ? col.color + '30' : col.color + '25'}`,
                            borderTop: `3px solid ${isOver ? col.color : canDrop ? col.color + '90' : col.color + '40'}`,
                            background: isOver
                              ? `linear-gradient(180deg, ${col.color}15 0%, ${col.color}08 100%)`
                              : `linear-gradient(180deg, ${col.color}08 0%, ${col.color}03 100%)`,
                            minHeight: '180px',
                            boxShadow: isOver
                              ? `0 0 20px ${col.color}25, inset 0 2px 12px ${col.color}10`
                              : canDrop
                              ? `inset 0 2px 8px ${col.color}08`
                              : `inset 0 1px 4px ${col.color}05`,
                            transform: isOver ? 'scale(1.02)' : 'scale(1)',
                          }}
                        >
                          {/* Cup rim -- thick top edge */}
                          <div style={{
                            height: '4px',
                            background: `linear-gradient(90deg, ${col.color}50, ${col.color}80, ${col.color}50)`,
                            borderRadius: '16px 16px 0 0',
                          }} />

                          {/* Label tab */}
                          <div className="flex items-center justify-center gap-1.5 py-2.5 px-3">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: col.color }} />
                            <span className="text-[11px] font-bold tracking-wide" style={{ color: col.color }}>{col.label}</span>
                            {items.length > 0 && (
                              <span className="text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white shadow-sm" style={{ background: col.color }}>{items.length}</span>
                            )}
                          </div>

                          {/* Inner cup area */}
                          <div className="px-2 pb-3 space-y-1.5" style={{ minHeight: '110px' }}>
                            {/* Empty state */}
                            {items.length == 0 && (
                              <div className="flex flex-col items-center justify-center py-6 rounded-xl transition-all" style={{ border: `2px dashed ${isOver ? col.color + '60' : col.color + '20'}` }}>
                                <div className="text-2xl mb-1.5" style={{ opacity: isOver ? 0.6 : 0.2 }}>
                                  ↓
                                </div>
                                <span className="text-[10px] font-medium" style={{ color: isOver ? col.color : col.color + '70' }}>
                                  {isOver ? 'Release to drop!' : canDrop ? 'Drop here' : 'Empty'}
                                </span>
                              </div>
                            )}

                            {/* Placed items */}
                            {items.map(item => {
                              const isLastPlaced = colState.lastPlaced == item;
                              const isCorrectItem = showExplanation && col.correct.includes(item);
                              const isWrongItem = showExplanation && !col.correct.includes(item);
                              return (
                                <div
                                  key={item}
                                  draggable={!showExplanation}
                                  onDragStart={(e) => { e.dataTransfer.setData('text/plain', item); colRemoveItem(item, col.id); }}
                                  onClick={(e) => { e.stopPropagation(); if (!showExplanation) colRemoveItem(item, col.id); }}
                                  className={`text-[11px] font-medium rounded-lg p-2.5 border transition-all ${
                                    isCorrectItem ? 'bg-green-50 border-green-300 text-green-800'
                                    : isWrongItem ? 'bg-red-50 border-red-300 text-red-700'
                                    : 'bg-white/90 border-gray-200 text-gray-700 cursor-grab active:cursor-grabbing hover:bg-red-50/30 hover:border-red-200'
                                  }`}
                                  style={isLastPlaced ? { animation: 'colBounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' } : {}}
                                >
                                  <div className="flex items-start justify-between gap-1.5">
                                    <span className="leading-snug">{item}</span>
                                    <div className="flex-shrink-0 mt-0.5">
                                      {isCorrectItem && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                                      {isWrongItem && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                      {!showExplanation && <span className="text-[9px] text-gray-300 hover:text-red-400">✕</span>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Drop hint when dragging and already has items */}
                            {isOver && items.length > 0 && (
                              <div className="flex items-center justify-center py-2 rounded-lg border-2 border-dashed transition-all" style={{ borderColor: col.color + '50', animation: 'fadeSlideIn 0.15s ease-out' }}>
                                <span className="text-[10px] font-medium" style={{ color: col.color }}>+ Drop here</span>
                              </div>
                            )}
                          </div>

                          {/* Cup inner shadow at bottom -- gives depth */}
                          <div style={{
                            height: '12px',
                            background: `linear-gradient(180deg, transparent, ${col.color}08)`,
                            borderRadius: '0 0 20px 20px',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Correct sorting on wrong answer */}
                {showExplanation && !currentAnswerCorrect && (
                  <div className="rounded-xl p-3.5 mb-4 border border-green-200 bg-green-50/50">
                    <div className="text-[10px] font-bold text-green-700 mb-2.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct sorting</div>
                    <div className="grid grid-cols-2 gap-3">
                      {cq.columns.map(col => (
                        <div key={col.id}>
                          <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
                            <span style={{ color: col.color }}>{col.label}</span>
                          </div>
                          <div className="space-y-1">
                            {col.correct.map(item => (
                              <div key={item} className="text-[10px] text-green-800 bg-green-100 rounded-md px-2.5 py-1.5 leading-snug">{item}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!showExplanation && <button onClick={submitCol} disabled={!allPlaced} className={`w-full py-3 rounded-lg font-bold text-xs transition-all ${allPlaced?'text-white shadow-md':'bg-gray-100 text-gray-300 cursor-not-allowed'}`} style={allPlaced?{background:'linear-gradient(135deg,#059669,#0d9488)'}:{}}>Check Answer</button>}
              </>;
            })()}
          </div>
        </div>

        {showExplanation && (
          <div ref={modalRef} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{animation:'fadeSlideIn 0.2s ease-out'}} tabIndex={-1}>
            <div className={`bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl`}>
              <div className="h-1" style={{background: currentAnswerCorrect ? 'linear-gradient(90deg,#22c55e,#10b981)' : 'linear-gradient(90deg,#3b82f6,#6366f1)'}} />
              <div className={`p-6 ${currentAnswerCorrect ? 'bg-gradient-to-b from-green-50/50' : 'bg-gradient-to-b from-blue-50/50'}`}>
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white shadow-md ${currentAnswerCorrect ? '' : ''}`} style={{background: currentAnswerCorrect ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>
                    {currentAnswerCorrect ? <><CheckCircle className="w-4 h-4" />Correct!</> : <><Lightbulb className="w-4 h-4" />Let's Learn This</>}
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${currentAnswerCorrect ? 'bg-green-100' : 'bg-blue-100'}`}>{currentAnswerCorrect ? <CheckCircle className="w-6 h-6 text-green-600" /> : <Lightbulb className="w-6 h-6 text-blue-600" />}</div>
                  <div><h3 className={`text-base font-bold mb-2 ${currentAnswerCorrect ? 'text-green-800' : 'text-blue-900'}`} style={{fontFamily:"Georgia,serif"}}>{currentAnswerCorrect ? 'Excellent!' : 'Key Insight'}</h3><p className="text-gray-700 text-sm leading-relaxed">{fmt(cq.explanation)}</p></div>
                </div>
                {currentAnswerCorrect && (
                  <div className="bg-white/80 rounded-lg p-3 mb-4 border border-green-200 flex items-center justify-center gap-6 text-center">
                    <div><div className="text-lg font-bold text-amber-600">+10</div><div className="text-[10px] text-gray-500">Pts</div></div>
                    <div><div className="text-lg font-bold text-emerald-600">+20</div><div className="text-[10px] text-gray-500">XP</div></div>
                    <div><div className="text-lg font-bold text-orange-600">{streak}</div><div className="text-[10px] text-gray-500">Streak</div></div>
                  </div>
                )}

                <button onClick={handleNext} className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]`} style={{background: currentAnswerCorrect ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>
                  {currentQuestion < total-1 ? 'Continue' : 'View Results'}<ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════════════════════
  if (screen == 'results') {
    const correct = quizResults.filter(r => r.correct).length;
    const pct = Math.round((correct/quizResults.length)*100);
    const eXP = quizScore*2, eC = Math.floor(quizScore/2);
    return (
      <div className="min-h-screen relative" style={pageBg}>
        <IslamicPattern /><div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
          <div className="flex justify-end mb-4"><button onClick={goHome} className="flex items-center gap-1.5 bg-white/50 text-gray-500 px-4 py-2 rounded-lg text-xs font-medium border border-gray-200/50"><Home className="w-3.5 h-3.5" />Home</button></div>
          <div className={`${glass} rounded-2xl p-8 mb-6 text-center`}>
            <div className="flex justify-center items-center gap-3 mb-4"><Mascot size="md" /><Trophy className="w-14 h-14 text-amber-500" /></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily:"Georgia,serif"}}>Quiz Complete!</h1>
            <p className="text-gray-500 text-sm mb-5">{selectedLesson?.title || selectedModule?.title}</p>
            <div className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold mb-5 ${pct>=80?'bg-green-100 text-green-700 border border-green-200':pct>=60?'bg-blue-100 text-blue-700 border border-blue-200':'bg-orange-100 text-orange-700 border border-orange-200'}`}>{pct>=80?'🌟 Outstanding!':pct>=60?'👍 Good Job!':'💪 Keep Practicing!'}</div>
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              {[{l:'Points',v:quizScore,c:'#b45309',bg:'from-amber-50 to-orange-50'},{l:'XP',v:eXP,c:'#047857',bg:'from-emerald-50 to-teal-50'},{l:'Correct',v:`${correct}/${quizResults.length}`,c:'#7c3aed',bg:'from-purple-50 to-indigo-50'},{l:'Accuracy',v:`${pct}%`,c:'#0284c7',bg:'from-sky-50 to-blue-50'}].map((s,i) => (
                <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-lg p-3 text-center border border-white/50`}><div className="text-xl font-bold" style={{color:s.c}}>{s.v}</div><div className="text-[10px] text-gray-500">{s.l}</div></div>
              ))}
            </div>
            <div className="bg-amber-50 rounded-lg p-3 mb-5 border border-amber-200 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2"><span className="text-2xl">🪙</span><div className="text-left"><div className="text-lg font-bold text-amber-700">+{eC}</div><div className="text-[10px] text-gray-500">Coins</div></div></div>
              <div className="w-px h-8 bg-amber-200" />
              <div className="flex items-center gap-2"><Zap className="w-6 h-6 text-orange-600" /><div className="text-left"><div className="text-lg font-bold text-orange-700">+{eXP}</div><div className="text-[10px] text-gray-500">XP</div></div></div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={goLessons} className="flex items-center gap-1.5 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-md" style={{background:'linear-gradient(135deg,#059669,#0d9488)'}}><BookOpen className="w-4 h-4" />{selectedLesson ? 'Back to Lessons' : 'More Lessons'}</button>
              <button className="flex items-center gap-1.5 bg-white text-gray-700 px-5 py-2.5 rounded-lg text-xs font-semibold shadow-md border border-gray-200"><Share2 className="w-4 h-4" />Share</button>
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-3" style={{fontFamily:"Georgia,serif"}}>Review Answers</h2>
          <div className="space-y-2">{quizResults.map((r,i) => (
            <button key={i} onClick={() => setSelectedResultQuestion(i)} className={`w-full p-3.5 rounded-lg border transition-all text-left hover:shadow-md ${r.correct ? 'bg-green-50/50 border-green-200 hover:border-green-300' : 'bg-blue-50/50 border-blue-200 hover:border-blue-300'}`}>
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-md flex items-center justify-center ${r.correct?'bg-green-100':'bg-blue-100'}`}>{r.correct?<CheckCircle className="w-5 h-5 text-green-600"/>:<Lightbulb className="w-5 h-5 text-blue-600"/>}</div><div><div className="font-bold text-gray-900 text-xs">Q{i+1}</div><div className="text-[10px] text-gray-500 line-clamp-1">{r.question}</div></div></div><ArrowRight className="w-3.5 h-3.5 text-gray-300"/></div>
            </button>
          ))}</div>
        </div>

        {selectedResultQuestion !== null && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{animation:'fadeSlideIn 0.2s ease-out'}} onClick={(e) => { if (e.target == e.currentTarget) setSelectedResultQuestion(null); }}>
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="h-1" style={{background: quizResults[selectedResultQuestion].correct ? 'linear-gradient(90deg,#22c55e,#10b981)' : 'linear-gradient(90deg,#3b82f6,#6366f1)'}} />
              <div className={`p-6 ${quizResults[selectedResultQuestion].correct ? 'bg-gradient-to-b from-green-50/50' : 'bg-gradient-to-b from-blue-50/50'}`}>
                <div className="text-center mb-4"><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md`} style={{background: quizResults[selectedResultQuestion].correct ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>{quizResults[selectedResultQuestion].correct ? <><CheckCircle className="w-3.5 h-3.5" />Correct!</> : <><Lightbulb className="w-3.5 h-3.5" />Review</>}</div></div>
                <p className="text-gray-900 font-semibold text-sm mb-3">{quizResults[selectedResultQuestion].question}</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{fmt(quizResults[selectedResultQuestion].explanation)}</p>
                <button onClick={() => setSelectedResultQuestion(null)} className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-md" style={{background: quizResults[selectedResultQuestion].correct ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>Got It</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// ---- CSS Animations (injected via style tag) ----------------------
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes floatOrb { 0% { transform: translate(0,0); } 100% { transform: translate(30px,-20px); } }
@keyframes confettiFall { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(100vh) rotate(360deg); opacity:0; } }
@keyframes fadeSlideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes colBounce { 0% { transform: scale(0.85) translateY(8px); opacity:0.5; } 50% { transform: scale(1.05) translateY(-3px); } 70% { transform: scale(0.98) translateY(1px); } 100% { transform: scale(1) translateY(0); opacity:1; } }
`;
if (!document.getElementById('deany-styles')) { styleTag.id = 'deany-styles'; document.head.appendChild(styleTag); }

export default App;
