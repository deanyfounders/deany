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
    { id: 'module-2', title: "Trade Essentials", subtitle: "Rules of Valid Transactions", icon: "🤝", color: "#d97706", difficulty: "Beginner", estimatedTime: "90 min", lessonCount: 5,
  mascotMessage: "Time to learn what makes a sale actually valid -- not just legal, but Islamically sound!",
  lessons: [
    // ═══════════════════════════════════════════════════════
    // LESSON 1 — Valid Sale: Pillars & Conditions
    // ═══════════════════════════════════════════════════════
    { id: 'lesson-2-1', title: "Valid Sale: Pillars & Conditions", description: "The five pillars every sale needs", duration: "12 min",
      questions: [
        // --- ZONE 1: WARM-UP (Q1-3) ---
        { concept: "A valid sale (bay') needs five pillars: (1) offer & acceptance, (2) lawful & specified subject matter, (3) known price, (4) ability to deliver, (5) absence of riba/gharar/maysir.\\nIf ANY pillar is missing, the contract is structurally defective -- not just poor practice, but invalid.\\n\\nThink of buying a car: you need to know the exact car (specified), agree the exact price (known), actually hand it over (deliverable), and both genuinely agree (consent).",
          question: "Drag each label into the correct pillar:",
          type: "column-sort", columns: [{id: "pillars", label: "Pillars of a Valid Sale", color: "#059669", correct: ["Offer & acceptance", "Specified subject matter", "Known price", "Ability to deliver"]}, {id: "not-pillars", label: "NOT Pillars", color: "#dc2626", correct: ["Minimum five photos", "Both parties same nationality", "Witnesses present", "Payment in local currency"]}],
          explanation: "Five pillars form the skeleton: offer & acceptance, specified subject, known price, deliverability, absence of riba/gharar/maysir. Photos, nationality, witnesses, and currency are commercial details -- not structural pillars.",
          uiType: "drag-alloc", visual: { buckets: [{id: "pillars", label: "Pillars of a Valid Sale", color: "#059669"}, {id: "not-pillars", label: "NOT Pillars", color: "#dc2626"}], chips: [{text: "Offer & acceptance", correct: "pillars"}, {text: "Minimum five photos", correct: "not-pillars"}, {text: "Specified subject matter", correct: "pillars"}, {text: "Both parties same nationality", correct: "not-pillars"}, {text: "Known price", correct: "pillars"}, {text: "Witnesses present", correct: "not-pillars"}, {text: "Ability to deliver", correct: "pillars"}, {text: "Payment in local currency", correct: "not-pillars"}] } },

        { concept: "A valid sale (bay') needs five pillars: (1) offer & acceptance, (2) lawful & specified subject matter, (3) known price, (4) ability to deliver, (5) absence of riba/gharar/maysir.\\nPrice must be known and fixed at contract -- 'we'll figure it out later' is gharar.\\nBoth parties must have legal capacity and give genuine consent (no coercion, no material deception).\\n\\nThink of an online marketplace listing: 'Price: TBD after inspection.' You can't form a binding contract with an open price.",
          question: "You're reviewing a contract for a second-hand camera on an online marketplace. Select the TWO elements that are non-negotiable for the sale to be valid.",
          type: "multi-select", options: ["The camera's condition and model are clearly specified", "The total price is known and agreed at contract", "The buyer and seller must live in the same city", "The listing must include at least five photos"], correct: [0, 1],
          explanation: "A valid sale requires a specified, identifiable subject (what exactly is being sold, in what condition) and a known price. Location proximity and photo count might be good practice, but they aren't structural pillars.",
          uiType: "sel2" },

        { concept: "A valid sale (bay') needs five pillars: (1) offer & acceptance, (2) lawful & specified subject matter, (3) known price, (4) ability to deliver, (5) absence of riba/gharar/maysir.\\nOne pillar is the ability to deliver. If the seller cannot actually transfer what they're selling, the sale fails on deliverability.\\n\\nThink of trying to sell a gym membership the gym says is non-transferable -- you don't have the right to hand it over.",
          question: "Complete the five pillars: (1) Offer & ______, (2) Lawful & specified subject, (3) Known price, (4) Ability to deliver, (5) Absence of riba, gharar & ______.",
          type: "multiple-choice", options: ["(1) silence, (5) profit", "(1) acceptance, (5) maysir", "(1) estimate, (5) delay", "(1) promise, (5) debt"], correct: 1,
          explanation: "Offer & acceptance (ijab wa qabul) forms the contractual tie. The fifth pillar blocks riba, gharar, AND maysir -- all three must be absent.",
          uiType: "fill" },

        // --- ZONE 2: BUILD (Q4-7) ---
        { concept: "Price must be known and fixed at contract -- 'we'll figure it out later' is gharar.\\n\\nA car dealership posts: 'Price to be confirmed after inspection.' The buyer's obligation is undefined at the point of agreement.",
          question: "Spot the defect in this car listing:",
          type: "multiple-choice", options: ["No issue -- inspection-based pricing is standard commercial practice", "Price is unknown at contract -- a core pillar is missing, creating gharar", "The car must be brand new for the sale to be valid", "Only a documentation problem that can be fixed later"], correct: 1,
          explanation: "'Price to be confirmed' means the buyer's obligation is undefined at the point of agreement. A deposit doesn't fix an unknown price. Settle the inspection first, agree the price, then contract.",
          uiType: "spot", visual: {mockup: {title: "AutoTrader Listing", rating: "Seller Rating: ★★★★☆", price: "Price: TBC after inspection", features: ["✅ 2023 Toyota Camry, White", "✅ 18,000 km mileage", "⚠️ Price: TO BE CONFIRMED", "✅ Clean title, no accidents"], defectIndex: 2}, factChips: ["Deposit: AED 2,000 paid", "Contract: Signed before price agreed", "Inspection: Scheduled next week"]} },

        { concept: "Genuine mutual consent (ridha) is foundational. A contract signed under duress or material coercion is defective because the seller's agreement isn't real.\\n\\nFair price doesn't cure forced consent. A signed document doesn't equal valid agreement.",
          question: "A property developer tells a shop owner: 'Sell me your unit at AED 400,000, or I'll make sure the municipality rezones your area and your business dies.' The shop owner signs. Is this sale valid?",
          type: "multiple-choice", options: ["Valid -- a signed contract is binding regardless of context", "Invalid -- genuine consent (free from coercion) is a requirement; a signed document under threat is not real agreement", "Valid if the price is objectively fair for the area", "Only invalid if witnesses saw the threat being made"], correct: 1,
          explanation: "Genuine mutual consent (ridha) is foundational. Fair price doesn't cure forced consent. Witness presence is about evidence, not about whether coercion occurred. The agreement itself is fictional if one party was threatened.",
          uiType: "mcq" },

        { concept: "One pillar is the ability to deliver. If the item cannot actually be transferred, the sale is structurally defective.\\n\\nA gym membership marked 'non-transferable' in the gym's terms means the seller cannot hand over what the contract doesn't allow.",
          question: "Your friend sells you his gym membership for AED 500. You pay, he gives you his card. Two weeks later, the gym blocks the card. The gym's terms say 'non-transferable.' Who's right?",
          type: "multiple-choice", options: ["You -- you paid, so the sale is valid and the gym must honour it", "The gym -- the subject matter was never deliverable; the seller had no right to transfer", "Split the difference -- refund half", "The gym is wrong but the sale was also invalid"], correct: 1,
          explanation: "Deliverability is a pillar. If the gym's terms prohibit transfer, the seller couldn't actually deliver what they sold. The AED 500 payment doesn't create a right that doesn't exist. The sale was structurally defective from the start.",
          uiType: "mcq" },

        { concept: "All five pillars must be present simultaneously. Remove any one and the contract is structurally defective.\\n\\nThe five pillars work like a chain -- each link matters. A fair price means nothing if consent was forced.",
          question: "True or False: A sale can still be valid if the price is fair, the item is described, and the buyer is happy -- even if the seller was coerced into selling.",
          type: "multiple-choice", options: ["True -- buyer satisfaction and fair pricing validate any sale", "False -- ALL five pillars must be met, including genuine consent from BOTH parties; coercion breaks the chain"], correct: 1,
          explanation: "ALL five pillars must be present. Coerced consent is not genuine consent, regardless of how satisfied the other party is or how fair the price looks.",
          uiType: "mcq" },

        // --- ZONE 3: STRETCH (Q8-10) ---
        { concept: "Substance over labels: what something IS matters more than what it's CALLED. A 'free' app with hidden charges has a price unknown at agreement.\\n\\nThink of a 'free trial' that auto-charges without clear disclosure -- the label says free, the substance says sale.",
          question: "Spot the hidden defect in this app listing:",
          type: "multiple-choice", options: ["No pillar is compromised -- the fee is disclosed inside the app", "Known price -- the total cost was hidden at the point of agreement to download", "Deliverability -- the app was delivered to the phone", "Absence of maysir -- the hidden fee is like gambling"], correct: 1,
          explanation: "The user agreed to 'free.' The real cost (AED 49.99) was concealed. That's price unknown at agreement -- gharar in the pricing. Physical delivery happened, but the contractual price was hidden.",
          uiType: "spot", visual: {mockup: {title: "App Store Listing", price: "FREE", features: ["★★★★★ (2,340 reviews)", "\"Best budgeting app!\"", "📱 Download now -- it's FREE!", "💳 Activation fee: AED 49.99 (shown AFTER install only)"], defectIndex: 3}, factChips: ["Listed as: FREE", "Actual cost: AED 49.99", "Fee disclosed: Only after download"]} },

        { concept: "Cross-reference Module 1: truthful dealing is mandatory. Hiding defects corrupts consent.\\nA used car dealer who resets odometers hits TWO pillars: misspecified subject AND compromised consent.",
          question: "A used car dealer resets odometers before listing cars. The prices are fair for the mileage shown. The cars run fine. How many pillars are affected?",
          type: "multiple-choice", options: ["None -- the cars work and the prices are reasonable", "One -- the subject matter is misspecified only", "Two -- misspecified subject matter AND compromised consent (buyer's 'yes' is based on false information)", "Three -- add absence of riba as well"], correct: 2,
          explanation: "Two pillars hit. Subject matter not truly specified (fake mileage). Genuine consent compromised (buyer agreed based on false info). A 'fair' price based on fraudulent specs isn't actually fair. Riba isn't involved -- this is deception, not interest.",
          uiType: "slider" },

        { concept: "The adviser question: can you explain the pillars to someone starting a business?\\n\\nYour cousin wants to sell handmade jewellery on Instagram. What should you tell her?",
          question: "Your cousin is launching a handmade jewellery business on Instagram. She asks: 'What do I need to make sure each sale is Islamically valid?' Give her the best practical advice.",
          type: "multiple-choice", options: ["Just price your items fairly and you'll be fine -- Islam is flexible on business details", "Five things: (1) describe each item honestly (materials, size), (2) state the exact price, (3) have the item ready to ship, (4) get clear agreement before charging, (5) never deceive in your descriptions. That covers all five pillars.", "Get an Islamic finance certificate before selling anything", "Only sell to Muslims to ensure compliance"], correct: 1,
          explanation: "The five pillars in plain language: describe honestly (specified subject), state price clearly (known price), have it ready (deliverable), get agreement (offer & acceptance), no deception (no gharar). She doesn't need a certificate -- she needs good practice.",
          uiType: "advise" }
      ]
    },

    // ═══════════════════════════════════════════════════════
    // LESSON 2 — Ownership & Possession (Asset-First Rule)
    // ═══════════════════════════════════════════════════════
    { id: 'lesson-2-2', title: "Ownership & Possession", description: "Don't sell what you don't own", duration: "12 min",
      questions: [
        // --- ZONE 1: WARM-UP (Q1-3) ---
        { concept: "\"Don't sell what you don't own or possess\" (hadith). This is a structural rule, not a guideline.\\nConstructive possession (warehouse receipt, title documents, control + risk transfer) can count when the seller truly bears the risk.\\nExceptions are structured contracts (salam, istisna'), not loopholes.\\n\\nThink of a dropshipper who lists products they've never touched -- they're selling someone else's inventory.",
          question: "Spot the defect in this Instagram store:",
          type: "multiple-choice", options: ["No issue -- efficient supply chain management", "Selling before ownership or possession -- a structural defect", "Only a logistics problem", "Fine as long as the customer gets the product"], correct: 1,
          explanation: "The reseller finalises a sale for items they neither own nor possess. Customer satisfaction and delivery speed don't fix the structural problem. The seller must own or possess the goods before concluding the sale.",
          uiType: "spot", visual: {mockup: {title: "🎧 TechDeals Instagram Store", features: ["AirPods Pro -- AED 899", "✅ \"In stock\" (not actually held)", "📦 Ships from supplier directly", "🔄 Reseller never touches product", "💰 Customer pays BEFORE reseller buys"], defectIndex: 1}, factChips: ["Inventory held: ZERO", "Ownership at sale: NONE", "Risk borne by seller: NONE"]} },

        { concept: "Constructive possession means: legal control, payment made, risk transferred. Physical holding isn't the only form of valid possession.\\n\\nThe test: if the asset were destroyed right now, who takes the hit? If it's the seller, they have possession.",
          question: "A distributor buys 500 laptops. Paid in full, holds title/invoice, goods insured under her name in the manufacturer's warehouse. Pickup next week. Can she resell now?",
          type: "multiple-choice", options: ["Absolutely not -- must physically hold every unit", "Generally yes -- constructive possession (legal control, payment, risk transferred)", "Only if the buyer collects from the warehouse", "Only if market price hasn't changed"], correct: 1,
          explanation: "Constructive possession: paid in full, holds title, insured under her name, bears risk of loss. This level of control normally permits resale before physical pickup. What matters is who controls and bears risk.",
          uiType: "mcq" },

        { concept: "The core test for possession (qabd) is RISK. If the asset were destroyed right now, who takes the hit?\\n\\nReceipts are evidence but not the test. A good price is irrelevant. Buyer patience doesn't create seller possession.",
          question: "What single question best tests whether a seller has valid possession?",
          type: "multiple-choice", options: ["Does the seller have a receipt?", "Does the seller bear the real risk of loss on this asset right now?", "Did the seller negotiate a good price?", "Is the buyer willing to wait?"], correct: 1,
          explanation: "The core test: if destroyed right now, who takes the hit? Receipts are evidence, not the test. Price is irrelevant. Buyer patience doesn't create possession.",
          uiType: "fill" },

        // --- ZONE 2: BUILD (Q4-7) ---
        { concept: "In murabaha, the bank MUST own the asset before selling it to the customer.\\nThe sequence matters: identify -> bank acquires -> bank sells -> you pay.\\nIf the bank sells before owning, it's not murabaha -- it's a loan dressed in sale language.",
          question: "Put a murabaha smartphone purchase in the correct sequence:",
          type: "multiple-choice", options: ["You pay → Bank sells → Bank buys → You identify", "You identify the phone → Bank buys & owns it → Bank sells at cost + markup → You pay by schedule", "Bank sells → You identify → You pay → Bank buys", "Bank buys → You pay → Bank sells → You identify"], correct: 1,
          explanation: "Identify → bank acquires → bank sells → you pay. Ownership must sit with the bank before the sale to you. Skipping the ownership step collapses murabaha into a personal loan with extra steps.",
          uiType: "flow-tap", visual: {steps: [{num: 1, title: "You identify the phone you want", ok: true}, {num: 2, title: "Bank purchases and takes ownership from retailer", ok: true}, {num: 3, title: "Bank sells to you at cost + agreed markup (fixed total price)", ok: true}, {num: 4, title: "You pay according to instalment schedule", ok: true}]} },

        { concept: "Valid murabaha needs two guardrails: (1) bank owns first, (2) total price fixed at contract.\\nSelling from a catalogue of items not yet purchased is the exact ownership defect murabaha avoids.",
          question: "You're auditing a bank's murabaha product. Sort these features:",
          type: "column-sort", columns: [{id: "valid", label: "Keeps Murabaha Valid", color: "#059669", correct: ["Bank buys and owns the item first", "Sale price (cost + markup) fixed upfront"]}, {id: "defective", label: "Structural Defect", color: "#dc2626", correct: ["Bank sells from catalogue without owning", "Internal docs call payments 'interest'"]}],
          explanation: "Murabaha is only valid when the bank truly owns the asset before reselling, and the final price is fixed at contract. Selling unowned items and calling payments 'interest' signal a loan in disguise.",
          uiType: "drag-alloc", visual: { buckets: [{id: "valid", label: "Keeps Murabaha Valid", color: "#059669"}, {id: "defective", label: "Structural Defect", color: "#dc2626"}], chips: [{text: "Bank buys and owns the item first", correct: "valid"}, {text: "Sale price (cost + markup) fixed upfront", correct: "valid"}, {text: "Bank sells from catalogue without owning", correct: "defective"}, {text: "Internal docs call payments 'interest'", correct: "defective"}] } },

        { concept: "Substance over labels: 'pre-order' on Instagram where the seller takes payment then buys from supplier = selling before owning.\\nThe label doesn't create a salam structure. Salam has strict requirements.",
          question: "A sneaker reseller takes orders on Instagram, only buys from Nike once customers pay. She calls it 'pre-ordering.' Which step in her process has the defect?",
          type: "multiple-choice", options: ["Step 1: Customer browses her page (no defect)", "Step 2: Customer pays full price (this is the defect -- she sells before owning)", "Step 3: She ships to customer (no defect)", "There is no defect -- pre-ordering is standard"], correct: 1,
          explanation: "The sale is completed (payment taken) before she owns the item. The 'pre-order' label doesn't create a valid salam structure. Salam needs full prepayment, detailed specs, and fixed delivery -- not just an Instagram post.",
          uiType: "flow-tap", visual: {steps: [{num: 1, title: "Customer browses sneaker photos on Instagram", ok: true}, {num: 2, title: "Customer pays AED 899 -- sale concluded, but seller owns NOTHING", ok: false, flag: "🚩"}, {num: 3, title: "Seller now orders from Nike supplier", ok: true}, {num: 4, title: "Nike ships directly to customer", ok: true}]} },

        { concept: "Constructive possession edge case: a tech wholesaler with title, payment, insurance -- but goods in a bonded warehouse awaiting customs.\\nIs customs clearance a possession issue or just admin?",
          question: "Compare these two sellers and decide who can resell:",
          type: "multiple-choice", options: ["Neither can resell until physically holding goods", "Both can resell -- both have constructive possession", "Only Seller A -- Seller B hasn't cleared customs", "Only Seller A -- constructive possession (paid, title, insured, risk transferred); Seller B's situation also qualifies as customs is administrative, not a possession issue"], correct: 3,
          explanation: "Both have constructive possession: legal control, title, payment, and risk transferred. Customs clearance is an administrative step, not a possession question. What matters is who controls and bears risk.",
          uiType: "compare", visual: {cards: [{title: "SELLER A", neutralLines: ["Paid in full for 500 laptops", "Holds title and commercial invoice", "Insurance in her name", "Goods in manufacturer warehouse", "Pickup: next Tuesday"]}, {title: "SELLER B", neutralLines: ["Paid in full for 1,000 tablets", "Holds title and commercial invoice", "Insurance in her name", "Goods in bonded warehouse", "Customs clearance: pending"]}]} },

        // --- ZONE 3: STRETCH (Q8-10) ---
        { concept: "Salam is the structured EXCEPTION to 'sell before you own.' It has strict guardrails: full prepayment, detailed specs, fixed delivery.\\nWithout these safeguards, selling before owning is prohibited.",
          question: "What separates a prohibited 'sell before you own' arrangement from a valid salam?",
          type: "multiple-choice", options: ["There is no difference -- both involve selling goods you don't have", "Salam has strict safeguards (full prepayment, detailed specs, fixed delivery) that remove gharar; casual pre-selling has none", "Salam is only for food commodities", "The difference is just the label"], correct: 1,
          explanation: "Salam exists precisely for future delivery -- but with strict guardrails. Full prepayment, detailed specifications, fixed delivery date and place. Without these, selling before owning is prohibited because the buyer's risk is unmanaged.",
          uiType: "compare", visual: {cards: [{title: "PROHIBITED: Sell Before You Own", neutralLines: ["No formal structure", "Payment may be partial", "Specs may be vague", "Delivery date may be open", "Buyer bears unmanaged risk"]}, {title: "VALID: Salam Contract", neutralLines: ["Strict structural safeguards", "Full prepayment required", "Detailed specs (type, grade, quantity)", "Fixed delivery date & place", "Gharar removed by structure"]}]} },

        { concept: "Cross-reference Module 1: salam requires full prepayment, specified goods, fixed delivery.\\nA dropshipping business can be fixed: hold inventory, use wakala (agency), or structure as proper salam.",
          question: "Your friend runs a dropshipping business. He never touches products. He asks: 'Is there an Islamic issue?' Which response gives him a fix, not just a diagnosis?",
          type: "multiple-choice", options: ["No issue -- dropshipping is modern commerce", "Yes, you're selling before owning. Fix options: (1) hold inventory, (2) act as an agent (wakala) not a seller, or (3) structure as salam with proper specs and prepayment", "Just relabel it as 'procurement service'", "Only a problem if customers complain"], correct: 1,
          explanation: "Diagnose AND fix. Hold inventory (simplest). Use wakala (agency) where you're facilitating, not selling. Or structure as salam with full specs. The fix is structural, not a label change.",
          uiType: "advise" },

        { concept: "Adviser question: your uncle wants to invest in a gold trading platform that says 'we buy gold on your behalf.'\\nDoes the platform actually own the gold? Does ownership transfer to the investor?",
          question: "A gold platform says: 'Deposit AED 10,000. We buy gold on your behalf. Sell anytime for profit.' You ask: 'Do I actually own the gold?' They say: 'It's held in our master account.' What's the ownership issue?",
          type: "multiple-choice", options: ["No issue -- they said they buy on your behalf", "The investor never has ownership or possession -- the gold is in THEIR master account, not yours. If the platform fails, you're an unsecured creditor, not a gold owner.", "Only a custody issue, not an ownership problem", "Fine as long as they're regulated"], correct: 1,
          explanation: "'On your behalf' means nothing if ownership never transfers. In their master account = their possession, their control. If they go bankrupt, your 'gold' is just a claim against them. Real ownership requires: segregated holding, your name on title, your risk.",
          uiType: "spot" }
      ]
    },

    // ═══════════════════════════════════════════════════════
    // LESSON 3 — Risk Before Profit (al-ghurm bil-ghunm)
    // ═══════════════════════════════════════════════════════
    { id: 'lesson-2-3', title: "Risk Before Profit", description: "No risk = no legitimate return", duration: "12 min",
      questions: [
        // --- ZONE 1: WARM-UP (Q1-3) ---
        { concept: "al-ghurm bil-ghunm / al-kharaj bil-daman: entitlement to gain follows exposure to loss.\\nNo risk carried = no legitimate return. If your 'profit' comes without any skin in the game, it resembles riba.\\n\\nThis principle is the backbone of Islamic commercial law. It shows up in every contract.",
          question: "Complete the principle: 'Entitlement to benefit follows ______.'",
          type: "multiple-choice", options: ["Seniority in the industry", "Liability (exposure to loss)", "Popularity of the product", "Duration of the investment"], correct: 1,
          explanation: "al-ghurm bil-ghunm: whoever carries risk of loss earns the right to profit. Without liability, a 'return' resembles riba. Seniority, popularity, and duration don't generate entitlement by themselves.",
          uiType: "fill" },

        { concept: "In ijarah (lease): the owner/lessor bears ownership risks and major maintenance. The lessee bears operating/usage costs and misuse liability.\\n\\nThink of leasing a car: transmission fails from normal wear = lessor pays. You crash it = you pay.",
          question: "Sort these costs into the correct responsibility bucket for an ijarah lease:",
          type: "column-sort", columns: [{id: "lessor", label: "Lessor (Owner) Pays", color: "#0284c7", correct: ["Engine failure from normal wear", "Annual manufacturer servicing", "Insurance premium"]}, {id: "lessee", label: "Lessee (You) Pay", color: "#d97706", correct: ["Scratched bumper from your parking", "Fuel and oil changes", "Toner and paper (consumables)"]}],
          explanation: "Lessor bears ownership costs (structural repairs, servicing, insurance). Lessee bears usage costs (misuse damage, fuel, consumables). The split follows ownership vs usage, not who has the asset physically.",
          uiType: "drag-alloc", visual: { buckets: [{id: "lessor", label: "Lessor (Owner) Pays", color: "#0284c7"}, {id: "lessee", label: "Lessee (You) Pay", color: "#d97706"}], chips: [{text: "Engine failure from normal wear", correct: "lessor"}, {text: "Scratched bumper from your parking", correct: "lessee"}, {text: "Annual manufacturer servicing", correct: "lessor"}, {text: "Fuel and oil changes", correct: "lessee"}, {text: "Insurance premium", correct: "lessor"}, {text: "Toner and paper (consumables)", correct: "lessee"}] } },

        { concept: "Risk -> return is a diagnostic tool. Ask: 'Who carries the risk of loss right now?' The answer tells you who has a legitimate claim to profit.\\n\\nIf nobody bears risk but someone earns a return, that return has no Islamic basis.",
          question: "Select the TWO statements that correctly reflect the risk-return principle.",
          type: "multi-select", options: ["A return without bearing any liability is perfectly acceptable", "Profit belongs to the party bearing real liability for the asset", "A lessor earns rent because they own the asset and carry structural risks", "The buyer always bears all risks, even before delivery"], correct: [1, 2],
          explanation: "Profit follows liability. Rent follows ownership risk. A return without liability is what Islamic finance prevents. The buyer doesn't bear pre-delivery risk unless the contract assigns it.",
          uiType: "sel2" },

        // --- ZONE 2: BUILD (Q4-7) ---
        { concept: "In ijarah: lessor bears ownership costs (structural repairs, major wear, servicing). Lessee bears usage costs (consumables, misuse damage, running costs).\\n\\nThe split is based on ownership vs usage, not who physically has the asset.",
          question: "You lease office equipment. Calculate the split using ijarah principles:",
          type: "multiple-choice", options: ["Lessor: AED 5,300 (compressor + servicing) | You: AED 950 (broken handle + consumables)", "Lessor: AED 4,200 | You: AED 2,050", "Everything 50/50 = AED 3,125 each", "You pay everything -- it's in your office"], correct: 0,
          explanation: "Lessor bears: compressor from normal wear (AED 4,200) + manufacturer servicing (AED 1,100) = AED 5,300. You bear: dropped handle misuse (AED 350) + consumables toner/paper (AED 600) = AED 950.",
          uiType: "calc", visual: { calcSteps: ["Lessor: AED [___] (compressor) + AED [___] (servicing) = ?", "You: AED [___] (broken handle) + AED [___] (consumables) = ?"], factChips: ["Compressor replacement (normal wear): AED 4,200", "Broken handle (employee dropped): AED 350", "Annual manufacturer servicing: AED 1,100", "Toner & paper (consumables): AED 600"] } },

        { concept: "al-ghurm bil-ghunm applies to investments too.\\nGuaranteed return + protected principal = investor bears ZERO risk. The 'profit' is structurally equivalent to riba.\\n\\nLabels like 'profit sharing' don't fix substance.",
          question: "Compare these two investments. Which follows Islamic risk-return principles?",
          type: "multiple-choice", options: ["Both are fine -- they both generate returns", "Only A -- the investor shares in both upside AND downside risk", "Only B -- safety is a priority in Islam", "Neither -- all investments carry some form of riba"], correct: 1,
          explanation: "Investment A: investor can profit but also bears real loss risk (al-ghurm bil-ghunm). Investment B: guaranteed return, no downside = structurally equivalent to interest. Safety isn't the test; risk-sharing is.",
          uiType: "compare", visual: {cards: [{title: "INVESTMENT A: Mudarabah Fund", neutralLines: ["Invest AED 100,000", "Projected return: 6-9%", "Profit shared 70/30", "Capital AT RISK -- could lose", "Returns VARY with performance"]}, {title: "INVESTMENT B: 'Profit Account'", neutralLines: ["Invest AED 100,000", "GUARANTEED 5% annual return", "Principal fully protected", "Capital SAFE -- cannot lose", "Returns FIXED regardless"]}]} },

        { concept: "In a sale: risk passes to the buyer on delivery/acceptance as per contract.\\nClicking 'buy' initiates the contract but doesn't transfer physical risk. The trigger is delivery + acceptance.",
          question: "You buy a washing machine online. At what point does risk transfer to you?",
          type: "multiple-choice", options: ["When you clicked 'buy' on the website", "On delivery and your acceptance as per contract", "Only after the first instalment payment clears", "Never -- the store always bears the risk"], correct: 1,
          explanation: "Risk typically transfers on delivery and acceptance as defined in the contract. Clicking 'buy' initiates the contract. Payment timing doesn't itself move risk. The trigger is delivery + acceptance.",
          uiType: "flow-tap", visual: {steps: [{num: 1, title: "You click 'Buy Now' online -- contract initiated", ok: true}, {num: 2, title: "Store dispatches the washing machine", ok: true}, {num: 3, title: "Driver delivers to your door, you sign for it -- RISK TRANSFERS HERE", ok: true}, {num: 4, title: "You use it for 3 months -- risk is fully yours", ok: true}]} },

        { concept: "The risk-return principle connects to Module 1: riba is a guaranteed surplus on money without risk.\\nA deposit guaranteeing 4% = riba. Equity sharing profits AND losses = legitimate.\\n\\nThe distinguishing factor: does the investor share in the downside?",
          question: "True or False: An investment that guarantees your principal AND pays a fixed return can still be Shariah-compliant as long as the underlying assets are halal.",
          type: "multiple-choice", options: ["True -- halal assets make any structure compliant", "False -- guaranteed principal + fixed return = zero risk for the investor, which makes the 'profit' structurally equivalent to riba regardless of underlying assets"], correct: 1,
          explanation: "Halal underlying assets are necessary but not sufficient. If the investor bears zero risk (guaranteed principal + fixed return), the 'profit' has no basis in Islamic principles. The structure itself must involve risk-sharing.",
          uiType: "mcq" },

        // --- ZONE 3: STRETCH (Q8-10) ---
        { concept: "Edge case: ijarah contracts that dump ALL maintenance on the lessee while the lessor keeps title and earns rent.\\nThis shifts ownership risk away from the owner -- violating al-ghurm bil-ghunm.",
          question: "Spot the structural problem in this ijarah contract:",
          type: "multiple-choice", options: ["No problem -- the lessee uses the car, so they should cover everything", "Dumping ALL risk on the lessee while retaining ownership undermines ijarah; the lessor earns rent without bearing any ownership risk", "Fine as long as the rent is reduced to compensate", "Only problematic if the car is new"], correct: 1,
          explanation: "If ALL risk falls on the lessee but the lessor retains title and earns rent, the lessor earns without bearing liability -- violating al-ghurm bil-ghunm. Reduced rent doesn't fix structural misallocation of risk.",
          uiType: "spot", visual: {mockup: {title: "Islamic Bank Car Lease (Ijarah)", features: ["Monthly rent: AED 2,500", "Lessee pays: ALL maintenance", "Lessee pays: ALL repairs (including engine/transmission)", "Lessee pays: Insurance", "⚠️ Lessor pays: NOTHING beyond providing the car"], defectIndex: 4}, factChips: ["Ownership: Bank (lessor)", "Risk allocation: 100% on lessee", "Bank's ongoing obligation: ZERO"]} },

        { concept: "Cross-reference: Module 1 governance. The risk-return principle applies to fund structures too.\\nA fund manager earning fees regardless of performance has no skin in the game.",
          question: "A Shariah fund charges 2% management fee annually regardless of performance, plus 20% of profits. The manager bears NO losses if the fund declines. Rate this fee structure:",
          type: "multiple-choice", options: ["Fully aligned -- management fees are standard", "The fixed fee is justifiable for services (ujrah), but profit share without loss-sharing weakens alignment -- ideally the manager should share in downside too", "Completely non-compliant -- all fees must be performance-based", "Aligned if the fund invests in halal assets"], correct: 1,
          explanation: "A fixed fee for genuine management services can be justified (ujrah). But 20% of upside without downside = capturing gains without risk. The ideal is skin in the game on both sides. Halal assets are necessary but don't fix the fee structure.",
          uiType: "slider" },

        { concept: "Adviser question: your uncle wants to invest his retirement savings. He's been offered a guaranteed account and a mudarabah fund.\\nDiagnose the structure AND consider his personal circumstances.",
          question: "Your uncle (retiring next year) asks about two bank offers. What's the best advice that's BOTH Islamically sound AND practical for his situation?",
          type: "multiple-choice", options: ["Option A always -- guaranteed returns are safer for retirees", "Explain: Option A is structurally interest (guaranteed, no risk). Option B follows Islamic principles (shared risk). BUT for a retiree, suggest lower-risk Shariah alternatives like ijarah income funds that balance compliance with capital preservation.", "Option B only -- higher return makes it better", "Both equally compliant -- just pick whichever pays more"], correct: 1,
          explanation: "The adviser skill: diagnose the structure (A is riba, B is legitimate) AND consider circumstances. For a retiree, high-risk mudarabah may not suit even though it's compliant. Best advice points to compliant AND suitable alternatives.",
          uiType: "advise" }
      ]
    },

    // ═══════════════════════════════════════════════════════
    // LESSON 4 — Ribawi vs Non-Ribawi Exchanges
    // ═══════════════════════════════════════════════════════
    { id: 'lesson-2-4', title: "Ribawi vs Non-Ribawi Exchanges", description: "Know the matrix", duration: "12 min",
      questions: [
        // --- ZONE 1: WARM-UP (Q1-3) ---
        { concept: "Ribawi goods (classical): gold, silver, dates, wheat, barley, salt. Currencies are treated like gold/silver.\\nSame-kind ribawi: must be EQUAL and IMMEDIATE.\\nDifferent-kind ribawi: must be IMMEDIATE, equality NOT required.\\nNon-ribawi goods (cars, phones, clothes): normal sale rules apply, no special equality/spot rules.\\n\\nThe ribawi matrix is a diagnostic tool.",
          question: "Sort these items into the correct category:",
          type: "column-sort", columns: [{id: "ribawi", label: "Ribawi (Special Rules Apply)", color: "#dc2626", correct: ["Gold bars", "UAE dirhams", "US dollars", "Silver coins"]}, {id: "non-ribawi", label: "Non-Ribawi (Normal Sale Rules)", color: "#059669", correct: ["Used Tesla", "Designer handbag", "iPhone", "Office furniture"]}],
          explanation: "Gold, silver, and currencies are ribawi -- special equality and/or spot rules apply. Cars, handbags, electronics, furniture are non-ribawi -- normal sale rules (known price, specified item) but no ribawi matrix constraints.",
          uiType: "drag-alloc", visual: { buckets: [{id: "ribawi", label: "Ribawi (Special Rules)", color: "#dc2626"}, {id: "non-ribawi", label: "Non-Ribawi (Normal Rules)", color: "#059669"}], chips: [{text: "Gold bars", correct: "ribawi"}, {text: "Used Tesla", correct: "non-ribawi"}, {text: "UAE dirhams", correct: "ribawi"}, {text: "Designer handbag", correct: "non-ribawi"}, {text: "US dollars", correct: "ribawi"}, {text: "iPhone", correct: "non-ribawi"}, {text: "Silver coins", correct: "ribawi"}, {text: "Office furniture", correct: "non-ribawi"}] } },

        { concept: "Same-kind ribawi: must be EQUAL and IMMEDIATE. A 3g excess in a gold-for-gold swap = riba al-fadl.\\n'Close enough' doesn't exist in ribawi exchanges.",
          question: "Two jewellers swap 18k gold: one gives 50g, the other gives 47g. Both hand over on the spot. Verdict?",
          type: "multiple-choice", options: ["Compliant -- close enough and both on the spot", "Riba al-fadl -- same-kind ribawi at unequal weight, even though delivery was immediate", "Riba al-nasi'ah -- timing defect", "Maysir -- unequal swap is like gambling"], correct: 1,
          explanation: "Same-kind ribawi (gold for gold, same karat): must be equal AND immediate. 3g excess = riba al-fadl. 'Close enough' doesn't exist. No timing defect (both on spot), so not nasi'ah.",
          uiType: "spot", visual: {mockup: {title: "Gold Souk Swap Receipt", layout: "swap", left: {label: "JEWELLER A GIVES", items: ["18k gold", "50 grams", "Handed over: NOW"]}, right: {label: "JEWELLER B GIVES", items: ["18k gold", "47 grams", "Handed over: NOW"]}, defectItem: "47 grams"}, factChips: ["Same karat: 18k", "Same day: spot", "Excess: 3g"]} },

        { concept: "Different-kind ribawi: must be IMMEDIATE but equality NOT required.\\nGold-for-silver, AED-for-USD: negotiate the ratio, but both sides deliver on the spot.\\n\\nThink of a bureau de change: AED cash for EUR cash at the counter = valid sarf.",
          question: "Gold coin swapped for silver bar. Negotiated ratio. Both handed over on the spot. Compliant?",
          type: "multiple-choice", options: ["Yes -- different-kind ribawi: spot required, equality not required", "No -- all precious metals need equal weight", "Only if a third party certifies purity", "Only if both are investment-grade"], correct: 0,
          explanation: "Gold and silver = different ribawi categories. Rule: must be immediate, equality NOT required. A negotiated ratio is fine as long as both sides hand over in the same sitting.",
          uiType: "mcq" },

        // --- ZONE 2: BUILD (Q4-7) ---
        { concept: "Currency exchange (sarf): currencies are ribawi. AED-for-USD: different-kind = spot required, equality not required.\\n10,000 AED at 3.67 AED/USD = approx. USD 2,724.80. Both delivered at counter = valid sarf.",
          question: "Check this currency exchange. Is it valid?",
          type: "multiple-choice", options: ["Valid and correct: 10,000 / 3.67 ≈ USD 2,724.80, both delivered on the spot", "Invalid -- amounts aren't equal so it's riba al-fadl", "Valid only if you come back tomorrow for the USD", "Invalid -- all currency exchange is prohibited"], correct: 0,
          explanation: "AED and USD are different-kind ribawi. Rule: immediate, equality not required. 10,000 / 3.67 ≈ USD 2,724.80. Both delivered on the spot = valid sarf. Equality isn't required. Coming back tomorrow = nasi'ah.",
          uiType: "calc", visual: { calcSteps: ["AED [___] ÷ Rate [___] = USD [___]", "Delivery: Both [spot/deferred]?", "Same-kind or different-kind?"], factChips: ["You give: AED 10,000 cash", "Rate: 3.67 AED/USD", "You receive: USD 2,724.80", "Delivery: Both at counter"] } },

        { concept: "Same-kind ribawi: EQUAL and IMMEDIATE. Break either rule = riba.\\n100g vs 103g gold on the spot = 3g excess = riba al-fadl.\\nThe size of the excess is irrelevant.",
          question: "Calculate the excess and classify the defect:",
          type: "multiple-choice", options: ["3g excess = riba al-fadl (same-kind, unequal spot exchange)", "3g excess = compliant because amounts are close", "No excess -- different pieces aren't 'same-kind'", "3g excess = riba al-nasi'ah (timing defect)"], correct: 0,
          explanation: "Same-kind ribawi (24k gold for 24k gold): equal AND immediate required. 103g - 100g = 3g excess on the spot = riba al-fadl. Not nasi'ah (both delivered now). Different pieces are still same-kind if same metal and karat.",
          uiType: "calc", visual: { calcSteps: ["Trader A gives: [___]g", "Trader B gives: [___]g", "Excess = [___]g", "Defect: [fadl / nasi'ah / none]"], factChips: ["Trader A: 100g 24k gold", "Trader B: 103g 24k gold", "Delivery: Both spot"] } },

        { concept: "Non-ribawi exchanges: car for laptop, phone for furniture -- no special equality/spot rules apply.\\nUnequal value is just a negotiated barter for non-ribawi goods.",
          question: "You trade your iPhone (worth AED 2,000) for your colleague's MacBook (worth AED 3,500). Both items handed over. Any ribawi issue?",
          type: "multiple-choice", options: ["Riba al-fadl -- values are unequal", "No ribawi issue -- phones and laptops are non-ribawi; equality rules don't apply", "Riba al-nasi'ah -- electronics must be deferred", "Gharar -- can't swap electronics directly"], correct: 1,
          explanation: "Phones and laptops are non-ribawi. The ribawi equality and spot rules don't apply. Unequal value is simply a negotiated barter -- fine for non-ribawi. You still need a valid sale (both agree, items specified), but no matrix rules.",
          uiType: "mcq" },

        { concept: "Sarf (currency exchange) must be spot on both sides. Fixing the rate doesn't cure a delayed handover.\\nA remittance app locking today's rate but crediting in 3 days has a timing defect.",
          question: "Currency exchange (sarf) must be ______ on both sides to be Sharia-compliant.",
          type: "multiple-choice", options: ["Collateralised with a third-party guarantee", "Spot / immediate -- both currencies delivered now", "Notarised by a Shariah board", "Equal in nominal value"], correct: 1,
          explanation: "Both currencies must be delivered on the spot. Any deferral = riba al-nasi'ah. A fixed rate, collateral, or notarisation don't fix the timing. The handover itself must happen now.",
          uiType: "fill" },

        // --- ZONE 3: STRETCH (Q8-10) ---
        { concept: "Edge case: remittance apps. Same-day settlement (2 hours) has stronger scholarly support than 3-day delays.\\nClassical sarf = same sitting. Modern scholars discuss near-instantaneous electronic settlement.",
          question: "Compare these two remittance options for sending GBP to family:",
          type: "multiple-choice", options: ["Both fine -- rate is locked in both", "Option A better -- near-immediate settlement has stronger scholarly support; 3-day delay is a clear deferral", "Option B better -- locking the rate matters more than speed", "Neither -- only physical cash at a counter counts"], correct: 1,
          explanation: "Classical sarf = same sitting. 2 hours has stronger support than 3 days. Rate locking is not the same as delivery timing. The question is: when does each currency actually change hands?",
          uiType: "compare", visual: {cards: [{title: "OPTION A: InstaPay", neutralLines: ["Rate locked now", "AED debited immediately", "GBP credited in 2 hours", "Same business day settlement"]}, {title: "OPTION B: SlowTransfer", neutralLines: ["Rate locked now", "AED debited immediately", "GBP credited in 3 business days", "Multi-day settlement"]}]} },

        { concept: "Cross-reference Module 1: the GoldRush app scenario. Real products often have MULTIPLE overlapping defects.\\nThe ribawi matrix helps you systematically classify each defect type.",
          question: "A new app: 'Deposit AED 5,000. We invest in gold. Guaranteed 4% monthly. Withdraw anytime.' How many defects?",
          type: "multiple-choice", options: ["Just one -- it's riba only", "Just two -- riba and gharar", "At least three: (1) Guaranteed return = riba, (2) No spot gold delivery to investor = potential nasi'ah, (3) 'We invest on your behalf' with guaranteed outcome ≠ valid mudarabah", "Compliant -- gold is an Islamic asset"], correct: 2,
          explanation: "Layer cake: guaranteed return (riba), no spot gold delivery (nasi'ah risk), 'investing on your behalf' with guaranteed outcome isn't mudarabah (no risk-sharing). Gold being halal doesn't cure structural defects.",
          uiType: "slider" },

        { concept: "Adviser question: your friend is starting a jewellery business and asks about gold exchange rules.\\nExplain practically -- what should she do when customers want to swap old gold for new?",
          question: "Your friend opens a gold shop. She asks: 'Can I swap old gold pieces from customers for new ones?' Give her the safest practical advice.",
          type: "multiple-choice", options: ["Swap freely -- gold is halal", "Same-karat: must be equal weight and spot. Safest route: two separate transactions -- sell old gold for cash, then use cash to buy new pieces. This avoids the ribawi exchange entirely while serving the customer.", "Only swap if the customer pays extra cash for weight difference", "Gold-for-gold swaps are always prohibited"], correct: 1,
          explanation: "Same-kind ribawi requires equal weight + spot. The safest practical route: two transactions -- sell old for cash, buy new with cash. Avoids ribawi exchange entirely. Still serves the customer. Simple, clean, compliant.",
          uiType: "advise" }
      ]
    },

    // ═══════════════════════════════════════════════════════
    // LESSON 5 — Price, Time & Credit Sales
    // ═══════════════════════════════════════════════════════
    { id: 'lesson-2-5', title: "Price, Time & Credit Sales", description: "Deferred payment ≠ interest", duration: "12 min",
      questions: [
        // --- ZONE 1: WARM-UP (Q1-3) ---
        { concept: "It's permissible to sell today at a higher fixed price payable later (deferred/credit sale), as long as the total price is fixed at contract.\\nA higher credit price is compensation for deferred payment within a SALE -- not interest on a loan.\\n\\nThe distinction: riba attaches to MONEY (loans). Credit markup attaches to an ASSET (sale).",
          question: "True or False: Selling an item at a higher price for deferred payment is the same as charging interest on a loan.",
          type: "multiple-choice", options: ["True -- any markup for time is interest by definition", "False -- a credit sale price fixed at contract is compensation for deferred payment within a sale, not interest on money lent"], correct: 1,
          explanation: "A credit sale price (fixed upfront) is NOT interest. The seller owns an asset, sells at an agreed price, buyer pays over time. Riba is surplus on MONEY lent. Here it's a sale price negotiation for a real asset.",
          uiType: "mcq" },

        { concept: "NOT allowed: leaving two prices open ('Cash AED 9,000 / Credit AED 10,000 -- decide later'). Pick one at contract.\\nNOT allowed: increasing the amount after default as profit.\\n\\nThe rule: one fixed price, agreed at signing.",
          question: "Spot the defect in this store's policy:",
          type: "multiple-choice", options: ["No issue -- both prices are transparently disclosed", "Non-compliant: price not fixed at contract (two prices open after delivery = gharar)", "Only a documentation problem", "Compliant as long as buyer eventually chooses"], correct: 1,
          explanation: "You must fix ONE price at contract. Two prices open until after delivery = gharar. Disclosure isn't agreement. Consent 'later' doesn't fix a price undefined at contract.",
          uiType: "spot", visual: {mockup: {title: "FurniturePlus Store Policy", features: ["🛋️ Premium Sofa Set", "Cash: AED 5,000", "Credit: AED 5,800 (12 months)", "⚠️ \"Choose your price AFTER delivery\"", "📋 Contract signed before price selected"], defectIndex: 3}, factChips: ["Price fixed at contract: NO", "Both options left open", "Decision point: After delivery"]} },

        { concept: "A deferred sale at a higher fixed price is a credit sale, not a loan.\\nThe AED 300 difference between cash (AED 2,900) and instalment (AED 3,200) is part of the sale price, not interest.",
          question: "Appliance store: fridge for AED 3,200 total on 8 monthly instalments of AED 400. Cash price: AED 2,900. No loan. Compliant?",
          type: "multiple-choice", options: ["No -- the AED 300 markup is disguised interest", "Yes -- it's a sale at a fixed deferred price, not a loan with interest", "Only if the receipt says 'no interest'", "Only if collateral is provided"], correct: 1,
          explanation: "The AED 3,200 is the agreed sale price. The AED 300 is part of sale price negotiation, not a charge on money lent. The store sold an asset at a known total price, payable in instalments. Credit sale, not a loan.",
          uiType: "mcq" },

        // --- ZONE 2: BUILD (Q4-7) ---
        { concept: "Credit sale math: Total - Cash price = Markup. Markup / Cash price × 100 = Markup %.\\nMonthly = Total / Months.\\n\\nA phone shop: Cash AED 3,400. 12-month price: AED 3,720 (fixed at contract).",
          question: "Calculate the monthly instalment and credit markup:",
          type: "multiple-choice", options: ["Monthly: AED 310 | Markup: AED 320 (9.4% of cash price)", "Monthly: AED 283.33 | Markup: AED 0 (interest-free)", "Monthly: AED 310 | Markup: AED 320 (this is riba)", "Cannot calculate without bank base rate"], correct: 0,
          explanation: "Monthly: 3,720 ÷ 12 = AED 310. Markup: 3,720 - 3,400 = AED 320 (320/3,400 = 9.4%). The markup is part of the sale price, not interest. Bank rates are irrelevant -- this is priced as a sale.",
          uiType: "calc", visual: { calcSteps: ["Monthly = AED [___] ÷ 12 = AED [___]", "Markup = AED [___] - AED [___] = AED [___]", "Markup % = [___] ÷ [___] × 100 = [___]%"], factChips: ["Cash price: AED 3,400", "12-month total: AED 3,720", "Price fixed at: Contract signing"] } },

        { concept: "Late payments: adding extra money to debt as profit = riba territory. Compounding arrears mimics interest.\\nGenuine restructuring (same amount, clearer terms) and at-cost admin fees can be acceptable.",
          question: "Customer missed 3 TV payments. Sort which responses are allowed vs prohibited:",
          type: "column-sort", columns: [{id: "prohibited", label: "NOT Allowed (Riba Territory)", color: "#dc2626", correct: ["Add AED 500 to debt as late profit", "Compound: charge penalty interest on the penalty"]}, {id: "allowed", label: "Acceptable Responses", color: "#059669", correct: ["Restructure: same total, clearer schedule", "Charge documented at-cost admin fee (AED 25)"]}],
          explanation: "Monetising time on unpaid debt as profit = riba. Compounding arrears mimics conventional interest. Genuine restructuring (same amount) and real at-cost admin fees can be acceptable -- they're not profit on debt.",
          uiType: "drag-alloc", visual: { buckets: [{id: "prohibited", label: "NOT Allowed", color: "#dc2626"}, {id: "allowed", label: "Acceptable", color: "#059669"}], chips: [{text: "Add AED 500 to debt as late profit", correct: "prohibited"}, {text: "Restructure: same total, clearer schedule", correct: "allowed"}, {text: "Compound: charge penalty interest on the penalty", correct: "prohibited"}, {text: "Charge documented at-cost admin fee (AED 25)", correct: "allowed"}] } },

        { concept: "Substance check: a car dealership selling at AED 45,000 on 24 months (cash: AED 42,000) with total fixed at contract = credit sale, not loan.\\nThe AED 3,000 is sale price markup, not interest.",
          question: "Is this a loan or a sale? Calculate the monthly payment.",
          type: "multiple-choice", options: ["Loan with AED 3,000 interest", "Sale: AED 45,000 fixed deferred price. Monthly: AED 1,875. The AED 3,000 is part of the sale price, not interest on money.", "Only compliant if contract says 'no interest'", "Gharar -- two prices discussed"], correct: 1,
          explanation: "Total AED 45,000 fixed at contract. Monthly: 45,000 ÷ 24 = AED 1,875. The AED 3,000 from cash price is sale markup, not interest. There aren't 'two prices' open -- one (AED 45,000) was chosen at signing.",
          uiType: "calc", visual: { calcSteps: ["Monthly = AED [___] ÷ 24 = AED [___]", "Credit markup = AED [___] - AED [___] = AED [___]"], factChips: ["Sale price: AED 45,000 (fixed at contract)", "Cash price: AED 42,000", "Term: 24 months", "Contract: Signed, one price agreed"] } },

        { concept: "The price must be FIXED at contract. Floating, estimated, or indexed prices slide from sale territory into loan territory.\\n'Market rate at delivery' or 'we'll adjust based on time' = gharar.",
          question: "In a compliant credit sale, the final price must be ______ at the point of contract.",
          type: "multiple-choice", options: ["Floating based on market conditions", "Fixed, known, and agreed by both parties", "Estimated with room for later adjustment", "Indexed to the central bank rate"], correct: 1,
          explanation: "Fixing the price at contract separates a deferred sale from a loan charging interest. A floating or indexed price means the buyer's obligation changes with time -- that's loan territory.",
          uiType: "fill" },

        // --- ZONE 3: STRETCH (Q8-10) ---
        { concept: "Edge case: 'AED 4,500 cash or AED 5,100 credit -- we'll lock the price after you take it home.'\\nTwo prices open after delivery = gharar. You can offer both BEFORE, but one must be chosen AT contract.",
          question: "Spot the defect in this electronics store policy:",
          type: "multiple-choice", options: ["Fine -- both options are transparent", "Non-compliant: price not fixed at contract; two prices open after delivery = gharar", "Only a marketing issue", "Compliant if customer verbally agrees"], correct: 1,
          explanation: "Price must be fixed at point of sale. Two prices open until after delivery = gharar. You can offer both options before, but one must be chosen and agreed at contract.",
          uiType: "spot", visual: {mockup: {title: "ElectroMart Checkout", features: ["💻 Gaming Laptop Pro X", "Cash: AED 4,500", "Credit: AED 5,100 (12 months)", "⚠️ \"We'll confirm your price after you take it home\"", "📦 Laptop leaves store before price is locked"], defectIndex: 3}, factChips: ["Options disclosed: YES", "Price fixed at contract: NO", "Laptop delivered: Before price decided"]} },

        { concept: "Cross-reference Module 1: riba = surplus on MONEY lent. Credit sale markup = profit on a SALE of a real asset.\\nRemove the asset and just lend money at a premium = riba. The asset is what makes the difference.",
          question: "What is the FUNDAMENTAL structural difference between a credit sale markup and riba?",
          type: "multiple-choice", options: ["There is no difference -- both charge more for time", "Credit sale markup = profit on sale of a REAL ASSET at a fixed price. Riba = surplus on MONEY LENT without underlying asset or risk.", "The difference is only in the label used", "Credit markup becomes riba if it exceeds 10%"], correct: 1,
          explanation: "Structural, not cosmetic. Credit sale: real asset changes hands, price fixed, markup is part of sale negotiation. Riba: money lent, surplus guaranteed on the money itself. Remove the asset and the markup becomes interest. No percentage threshold.",
          uiType: "compare", visual: {cards: [{title: "CREDIT SALE MARKUP", neutralLines: ["Real asset changes hands", "Total price fixed at contract", "Markup is part of sale negotiation", "Buyer owns an asset", "Risk transfers with delivery"]}, {title: "RIBA (INTEREST)", neutralLines: ["No asset -- money for money", "Surplus guaranteed on loan", "Interest is a charge on time", "Borrower owes money only", "Lender bears no risk"]}]} },

        { concept: "Adviser question: your sister asks if the extra AED 1,800 on furniture instalments is 'just interest with a different name.'\\nExplain WHY it's different, WHAT makes it compliant, and WHAT would make it problematic.",
          question: "Your sister is buying a bedroom set. Cash: AED 12,000. Instalments: AED 13,800 over 18 months. She asks: 'Isn't the extra AED 1,800 just interest?' Best response?",
          type: "multiple-choice", options: ["She's right -- any extra charge for time is interest", "Explain: 'It's not interest. The store owns the furniture and sells it to you at AED 13,800 -- that IS the sale price. It's not a loan plus interest. The key: one fixed price agreed before delivery. If they leave both prices open after delivery, THAT's the problem.'", "Tell her it doesn't matter -- pick whatever's convenient", "It's a grey area scholars disagree on -- avoid it entirely"], correct: 1,
          explanation: "Best advice explains WHY it's different (asset sale vs money loan), WHAT makes it compliant (one fixed price at contract), and WHAT would be problematic (two open prices, floating amounts). Don't just classify -- equip her to evaluate.",
          uiType: "advise" }
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
      { id: 'e1-int', name: "Intermediate", locked: false },
      { id: 'e1-adv', name: "Advanced", locked: false },
      ]
    },
    { id: 'epoch-2', title: "Epoch 2: Birth of Islam", subtitle: "610–632 CE", icon: "🌅", locked: false, questions: [] },
    { id: 'epoch-3', title: "Epoch 3: Rightly Guided Caliphs", subtitle: "632–661 CE", icon: "👑", locked: false, questions: [] },
    { id: 'epoch-4', title: "Epoch 4: Umayyads & Abbasids", subtitle: "661–1258 CE", icon: "🏛️", locked: false, questions: [] },
    { id: 'epoch-5', title: "Epoch 5: Sultanates & Empires", subtitle: "1258–1800", icon: "--️", locked: false, questions: [] },
    { id: 'epoch-6', title: "Epoch 6: Colonialism to Today", subtitle: "1800–Present", icon: "🌐", locked: false, questions: [] },
    ]
  };

  // ---- Helpers ----------------------------------------------------
  const isModuleLocked = (i, tid) => false;
  const isLessonLocked = (i, mid) => false;
  const markModComplete = (id) => { if (!completedModules.includes(id)) setCompletedModules([...completedModules, id]); };
  const markLesComplete = (mid, i) => setCompletedLessons({ ...completedLessons, [`${mid}-lesson-${i}`]: true });

  const selectMainTopic = (id) => { setSelectedMainTopic(mainTopics.find(t => t.id == id)); setLastSelectedTopicId(id); setScreen('modules'); };
  const selectModule = (mod, idx) => {
    if (selectedMainTopic?.id == 'islamic-history' && mod.levels) { setSelectedEpoch(mod); setScreen('epoch-levels'); return; }
    // locking disabled
    // locking disabled
    if (selectedMainTopic?.id == 'islamic-finance' && mod.lessons) { setSelectedModule(mod); setScreen('lessons'); return; }
    if (!mod.questions?.length) { alert('Coming soon!'); return; }
    setSelectedModule(mod); resetQuiz(mod.questions); setScreen('quiz');
  };
  const selectLvl = (l) => { setSelectedLevel(l); setScreen('history-lessons'); };
  const selectHistLesson = (l) => { if (!l.questions.length) return; setSelectedLesson(l); resetQuiz(l.questions); setScreen('quiz'); };
  const selectLes = (l, i) => { if (!l.questions.length) return; setSelectedLesson({...l, lessonIndex: i}); resetQuiz(l.questions); setScreen('quiz'); };
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
                <button key={e.id} onClick={() => selectModule(e)} disabled={false} className={`group ${glassHover} rounded-xl p-6 text-center ${e.''}`}>
                  <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white text-xs font-bold mb-2 shadow-sm" style={{background:'linear-gradient(135deg,#0ea5e9,#3b82f6)'}}>{i+1}</div>
                  <div className="text-3xl mb-2">{e.icon}</div><h3 className="font-bold text-gray-900 text-xs mb-0.5">{e.title}</h3><p className="text-[10px] text-gray-500 mb-2">{e.subtitle}</p>
                  {!false ? <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold text-sky-700 bg-sky-50">Explore <ArrowRight className="w-2.5 h-2.5" /></span> : <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold text-gray-400 bg-gray-100"><Lock className="w-2.5 h-2.5" />Soon</span>}
                </button>
              ))}
            </div>
          ) : isFin ? (
            <div className="max-w-xl mx-auto space-y-3">
              {mods.map((m, i) => {
                const locked = false;
                return (
                  <button key={m.id} onClick={() => selectModule(m, i)} disabled={false} className={`w-full ${glassHover} rounded-xl p-5 text-left group ${''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm" style={{background:m.color+'12'}}>{m.icon}</div>
                      <div className="flex-grow min-w-0"><h3 className="font-bold text-gray-900 text-sm">{m.title}</h3><p className="text-xs text-gray-500">{m.subtitle}</p>
                        <div className="flex gap-2 mt-1">{m.difficulty && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${m.difficulty=='Beginner'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-700'}`}>{m.difficulty}</span>}{m.lessonCount && <span className="text-[10px] text-gray-400">{m.lessonCount} lessons</span>}</div>
                      </div>
                      {<ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map(m => (
                <button key={m.id} onClick={() => selectModule(m)} disabled={false} className={`group ${glassHover} rounded-xl p-5 text-left ${m.''}`}>
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
              <button key={l.id} onClick={() => selectLes(l, i)} disabled={false} className={`w-full ${glassHover} rounded-lg p-4 text-left group ${''} ${done ? 'ring-1 ring-emerald-200' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-xs shadow-sm" style={{background:lk?'#e5e7eb':selectedModule.color+'12',color:lk?'#9ca3af':selectedModule.color}}>{i+1}</div>
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
          <button key={l.id} onClick={() => selectLvl(l)} disabled={false} className={`w-full ${glassHover} rounded-xl p-4 text-left group ${l.''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl text-white shadow-md ${i==0?'bg-gradient-to-br from-green-500 to-emerald-600':i==1?'bg-gradient-to-br from-blue-500 to-sky-600':'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>{['🌱','📚','🎓'][i]}</div><div><h3 className="font-bold text-gray-900 text-sm">{l.name}</h3>{false && l.message && <p className="text-[10px] text-gray-500">{l.message}</p>}{l.lessons && <p className="text-[10px] text-gray-500">{l.lessons.length} lessons</p>}</div></div>
              {true ? <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" /> : <Lock className="w-4 h-4 text-gray-300" />}
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
