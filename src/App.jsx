import React, { useState, useEffect, useRef, useCallback } from 'react';
import DEANY_M1L1 from './DEANY-M1L1.jsx';
import DEANY_M1L2 from "../DEANY_M1L2.jsx";
import DEANY_M1L3 from "../DEANY_M1L3.jsx";
import DEANY_M1L4 from "../DEANY_M1L4.jsx";
import DEANY_M1L5 from "../DEANY_M1L5.jsx";
import DEANY_HB1_L1 from './DEANY-HB1L1.jsx';
import DEANY_HB1_L2 from './DEANY-HB1L2.jsx';
import ModuleOverview from './ModuleOverview.jsx';
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
const SORTED_TERMS = [...GLOSSARY_ENTRIES].sort((a, b) => b.term.length - a.term.length);

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

// ---- Progress Persistence ----------------------------------------
const saveProgress = (id, data) => { try { localStorage.setItem(`deany-progress-${id}`, JSON.stringify(data)); } catch(e) {} };
const loadProgress = (id) => { try { const d = localStorage.getItem(`deany-progress-${id}`); return d ? JSON.parse(d) : null; } catch(e) { return null; } };
const clearProgress = (id) => { try { localStorage.removeItem(`deany-progress-${id}`); } catch(e) {} };

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
  const [heldItem, setHeldItem] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
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
  const [speedFeedback, setSpeedFeedback] = useState(null);
  const modalRef = useRef(null);
  const shuffleRef = useRef({});
  const audioCtxRef = useRef(null);

  // Global mechanical keyboard click sound on any interactive element
  useEffect(() => {
    const getCtx = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
      return audioCtxRef.current;
    };

    const playMechClick = () => {
      try {
        const ctx = getCtx();
        const t = ctx.currentTime;

        // Noise burst — the "click" body
        const bufLen = Math.floor(ctx.sampleRate * 0.04);
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
        const noise = ctx.createBufferSource();
        noise.buffer = buf;

        // Bandpass filter — mechanical resonance
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 3800;
        bp.Q.value = 1.2;

        // High-pass to remove muddiness
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 1200;

        // Envelope — sharp attack, quick decay
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(0.18, t + 0.003);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        noise.connect(bp).connect(hp).connect(env).connect(ctx.destination);
        noise.start(t);
        noise.stop(t + 0.05);

        // Tiny "thock" undertone
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.025);
        oscGain.gain.setValueAtTime(0.06, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.connect(oscGain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.035);
      } catch (_) {}
    };

    const handler = (e) => {
      const el = e.target.closest('button, a, [role="button"], [onclick], input[type="submit"], input[type="checkbox"], input[type="radio"], select, .cursor-pointer');
      if (el) playMechClick();
    };

    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
  }, []);

  const makeShuffledIndices = (n) => {
    const arr = Array.from({length: n}, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const buildShuffleMaps = (questions) => {
    const maps = {};
    questions.forEach((q, qi) => {
      if ((q.type == 'multiple-choice' || q.type == 'multi-select') && q.options) {
        maps[qi] = makeShuffledIndices(q.options.length);
      }
    });
    shuffleRef.current = maps;
  };

  const getShuffled = (qi, q) => {
    const map = shuffleRef.current[qi];
    if (!map) return { options: q.options, toOriginal: (i) => i, toShuffled: (i) => i };
    const shuffledOptions = map.map(origIdx => q.options[origIdx]);
    const toOriginal = (shuffledIdx) => map[shuffledIdx];
    const toShuffled = (origIdx) => map.indexOf(origIdx);
    return { options: shuffledOptions, toOriginal, toShuffled };
  };

  const isHistoryTopic = selectedMainTopic?.id == 'islamic-history';
  const openGlossary = (term, def) => setGlossaryPopup({ term, def });

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

  const GlossaryPopup = () => {
    if (!glossaryPopup) return null;
    return (
      <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
        onClick={() => setGlossaryPopup(null)}>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.18)', backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)' }} />
        <div style={{ position:'relative', background:'#fff', borderRadius:20, maxWidth:340, width:'100%', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)', animation:'fadeSlideIn 0.2s ease-out' }}
          onClick={e => e.stopPropagation()}>
          <div style={{ height:4, background:'linear-gradient(90deg,#059669,#0d9488,#06b6d4)' }} />
          <div style={{ padding:'24px 22px 20px' }}>
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
            <div style={{ height:1, background:'linear-gradient(90deg,transparent,#e5e7eb,transparent)', marginBottom:14 }} />
            <p style={{ fontSize:13, lineHeight:1.7, color:'#374151', margin:0 }}>{glossaryPopup.def}</p>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (showExplanation && currentAnswerCorrect) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); }
  }, [showExplanation, currentAnswerCorrect]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      id: 'module-1', title: "Principles & Basics", subtitle: "Foundation of Islamic Finance", icon: "🎯", color: "#d97706", difficulty: "Beginner", estimatedTime: "70 min", lessonCount: 5,
      mascotMessage: "Let's build a solid foundation in Islamic finance principles!",
      lessons: [
        { id: 'lesson-1-1', title: 'The Trader Prophet', description: '', duration: '12 min', questions: [] },
        { id: 'lesson-1-2', title: 'Money as Amanah', description: '', duration: '12 min', questions: [] },
        { id: 'lesson-1-3', title: 'The Three Poisons', description: '', duration: '15 min', questions: [] },
        { id: 'lesson-1-4', title: 'Substance Over Labels', description: '', duration: '14 min', questions: [] },
        { id: 'lesson-1-5', title: 'Your Money Right Now', description: '', duration: '14 min', questions: [] }
      ]
    },
    { id: 'speed-round-1', title: "Speed Round", subtitle: "Rapid-fire compliance triage", icon: "⚡", color: "#7c3aed", difficulty: "Challenge", estimatedTime: "5 min", isSpeedRound: true,
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
      mascotMessage: "Time to learn what makes a sale actually valid!",
      lessons: []
    },
    ],
    'quran-arabic': [{ id: 'arabic', title: "Arabic Alphabet", subtitle: "Learn the letters", icon: "", color: "#0284c7", difficulty: "Beginner", questions: [] }],
    'islamic-history': [{
      id: 'epoch-1', title: "Epoch 1: Creation to Pre-Islamic Arabia", subtitle: "Creation -- 610 CE", icon: "🌍", color: "#0284c7", estimatedTime: "44 min (5 lessons)",
      mascotMessage: "Let's journey to the very beginning!",
      levels: [{
        id: 'e1-beginner', name: "Beginner",
        lessons: [
        {
          id: 'creation', title: "How Allah Created the World", subtitle: "Understanding creation's purpose", icon: "🌍", color: "#0284c7", difficulty: "Beginner", estimatedTime: "8 min",
          conceptCards: [
            { title: "Why start with creation?", text: "When we learn Islamic history, we don't begin with ancient kingdoms or tribes -- we begin before humans, with how Allah created the world. This matters because Islam teaches that the universe isn't random or accidental. It was made on purpose, with wisdom, by the One who controls everything.\n\nThe Qur'an says Allah created the heavens and the earth in six \"days\" -- not days like we count, but stages that show order, planning, and power. Creation is intentional, not chaotic." },
            { title: "Humanity's purpose", text: "With Adam and Hawwa, human history starts. Humans aren't placed on earth as an afterthought. They are given dignity, the ability to choose, and responsibility to live by guidance.\n\nThe unseen world -- like angels who obey Allah and jinn who choose like humans -- reminds us that reality is bigger than what our eyes see. What we do matters, even when no one else sees it." },
            { title: "The Islamic arc of history", text: "This beginning sets up the whole Islamic view of history:\n\nAllah creates with purpose → humans are responsible → guidance is sent → people are accountable for how they respond.\n\nUnderstanding this starting point helps us understand everything that comes after." }
          ],
          questions: [
            { question: "Islamic history doesn't begin with a king, a city, or a battle. It begins with creation. Which statement best explains why?", type: "multiple-choice", options: ["History starts with creation because it explains who is in control, why humans exist, and what they are accountable for", "History starts with creation because early humans could not form societies until revelation taught them how", "History starts with creation mainly to help us calculate timelines and measure the age of the universe", "History starts with creation because nothing meaningful happened until humans appeared"], correct: 0, explanation: "Islamic history begins with creation because it establishes the framework for everything that follows: **Allah is the Creator and Sustainer**, **human life has purpose, not randomness**, and **accountability exists before politics, economics, or power**." },
            { question: "Sort each statement into the correct column based on whether it fits an Islamic view of history.", type: "column-sort", items: ["Prophets appear across different peoples because guidance is part of Allah's plan", "Human choices matter because life is a test with moral consequences", "Economic conditions influence events, but they do not fully explain why things happen", "History is best explained only by material forces like wealth and power", "Morality develops naturally with no final judgment beyond human society"], columns: [{ id: "fits", label: "Fits Islamic View", color: "#059669", correct: ["Prophets appear across different peoples because guidance is part of Allah's plan", "Human choices matter because life is a test with moral consequences", "Economic conditions influence events, but they do not fully explain why things happen"]}, { id: "not", label: "Does NOT Fit", color: "#dc2626", correct: ["History is best explained only by material forces like wealth and power", "Morality develops naturally with no final judgment beyond human society"]}], explanation: "Islamic history recognises causes like economics and power, but does not treat them as the ultimate explanation." },
            { question: "A student says: \"When the Qur'an says Allah created the heavens and earth in six 'days', it must be giving us exact time units.\" What is the best Islamic response?", type: "multiple-choice", options: ["Yes -- the six days are exactly like modern 24-hour days, so calculation is the main goal", "We affirm six 'days' as stages of creation, but the main lesson is Allah's wisdom and order, not scientific calculation", "These verses are symbolic and don't carry real meaning", "This topic is too complex to learn anything from, so we should leave it to the scholars"], correct: 1, explanation: "Allah says creation happened in six \"days\" (ayyām). He reminds us His \"day\" is not like ours. The Qur'an connects creation to worship. A balanced approach affirms what Allah said, avoids false precision, and learns the lesson of purpose and accountability." },
            { question: "Islamic history follows a clear meaning-based flow. Fill in the blanks to complete the correct sequence:", type: "drag-drop", sentence: "Creation → ___ → ___ → Accountability", wordBank: ["Human responsibility on earth", "Prophetic guidance over time", "Random chance", "Worldly success"], correct: ["Human responsibility on earth", "Prophetic guidance over time"], explanation: "This sequence captures the Islamic meaning of history: Allah creates with purpose → humans are given responsibility → Allah sends guidance through prophets → people are accountable." }
          ]
        },
        { id: 'prophets', title: "Line of Prophets", subtitle: "One message across time", icon: "👥", color: "#0284c7", difficulty: "Beginner", estimatedTime: "10 min", conceptCards: [], questions: [] },
        { id: 'prophet-messenger', title: "Prophet vs Messenger", subtitle: "Understanding their roles", icon: "📯", color: "#0284c7", difficulty: "Beginner", estimatedTime: "9 min", conceptCards: [], questions: [] },
        { id: 'arabia-before-islam', title: "Arabia Before Islam", subtitle: "Geography and society", icon: "🏜️", color: "#0284c7", difficulty: "Beginner", estimatedTime: "8 min", conceptCards: [], questions: [] },
        { id: 'faiths-in-arabia', title: "Faiths in Arabia", subtitle: "Religious diversity before Islam", icon: "🕊️", color: "#0284c7", difficulty: "Beginner", estimatedTime: "9 min", conceptCards: [], questions: [] }
        ]
      },
      { id: 'e1-int', name: "Intermediate", locked: false },
      { id: 'e1-adv', name: "Advanced", locked: false },
      ]
    },
    { id: 'epoch-2', title: "Epoch 2: Birth of Islam", subtitle: "610–632 CE", icon: "🌅", locked: false, questions: [] },
    { id: 'epoch-3', title: "Epoch 3: Rightly Guided Caliphs", subtitle: "632–661 CE", icon: "👑", locked: false, questions: [] },
    { id: 'epoch-4', title: "Epoch 4: Umayyads & Abbasids", subtitle: "661–1258 CE", icon: "🏛️", locked: false, questions: [] },
    { id: 'epoch-5', title: "Epoch 5: Sultanates & Empires", subtitle: "1258–1800", icon: "🗺️", locked: false, questions: [] },
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
    if (mod.isSpeedRound) {
      setSelectedModule(mod);
      setSpeedRoundIdx(0);
      setSpeedResults([]);
      setSpeedFeedback(null);
      setScreen('speed-round');
      return;
    }
    if (selectedMainTopic?.id == 'islamic-finance' && mod.lessons) { setSelectedModule(mod); setScreen('lessons'); return; }
    if (!mod.questions?.length) { alert('Coming soon!'); return; }
    setSelectedModule(mod); resetQuiz(mod.questions); setScreen('quiz');
  };

  const selectLvl = (l) => { setSelectedLevel(l); setScreen('history-lessons'); };
  const selectHistLesson = (l) => {
    if (l.id === 'creation') { setSelectedLesson(l); setScreen('hb1-l1'); return; }
    if (l.id === 'arabia-before-islam') { setSelectedLesson(l); setScreen('hb1-l2'); return; }
    if (!l.questions.length) return; setSelectedLesson(l); resetQuiz(l.questions); setScreen('quiz');
  };
  const selectLes = (l, i) => {
    if (l.id === 'lesson-1-1') { setSelectedLesson({...l, lessonIndex: i}); setScreen('lesson-component'); return; }
    if (l.id === 'lesson-1-2') { setSelectedLesson({...l, lessonIndex: i}); setScreen('lesson-component-2'); return; }
    if (l.id === 'lesson-1-3') { setSelectedLesson({...l, lessonIndex: i}); setScreen('lesson-component-3'); return; }
    if (l.id === 'lesson-1-4') { setSelectedLesson({...l, lessonIndex: i}); setScreen('lesson-component-4'); return; }
    if (l.id === 'lesson-1-5') { setSelectedLesson({...l, lessonIndex: i}); setScreen('lesson-component-5'); return; }
    if (!l.questions.length) return;
    setSelectedLesson({...l, lessonIndex: i});
    const saved = loadProgress(l.id);
    if (saved) {
      setCurrentQuestion(saved.currentQuestion); setQuizScore(saved.quizScore); setStreak(saved.streak);
      setQuizResults(saved.quizResults); setSelectedAnswer(null); setHeldItem(null); setDragOverCol(null);
      setShowExplanation(false); setShowConceptIntro(false); setCurrentAnswerCorrect(false);
      if (l.questions) buildShuffleMaps(l.questions);
    } else {
      resetQuiz(l.questions);
    }
    setScreen('quiz');
  };
  const resetQuiz = (questions) => {
    setCurrentQuestion(0); setSelectedAnswer(null);
    setHeldItem(null); setDragOverCol(null);
    setShowExplanation(false); setShowConceptIntro(true);
    setConceptIndex(0); setQuizScore(0); setStreak(0); setQuizResults([]);
    if (questions) buildShuffleMaps(questions);
  };
  const goHome = () => { setScreen('home'); setSelectedMainTopic(null); setSelectedModule(null); setSelectedLesson(null); };
  const goModules = () => { setScreen('modules'); setSelectedModule(null); setSelectedLesson(null); };
  const goLessons = () => { setScreen(selectedEpoch && selectedLevel ? 'history-lessons' : selectedModule ? 'lessons' : 'modules'); setSelectedLesson(null); };

  const handleMC = (i) => { if (!showExplanation) setSelectedAnswer(i); };
  const submitMC = () => {
    if (selectedAnswer == null || showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
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
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
    const a = selectedAnswer || [];
    const sh = getShuffled(currentQuestion, q);
    const origSelected = a.map(i => sh.toOriginal(i));
    doAnswer(origSelected.length == q.correct.length && origSelected.every(i => q.correct.includes(i)), q);
  };
  const initDD = (q) => {
    if (!selectedAnswer || !selectedAnswer.slots) {
      return { slots: new Array(q.correct.length).fill(null), bank: [...q.wordBank] };
    }
    return selectedAnswer;
  };
  const placeWord = (word, slotIdx) => {
    if (showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
    const state = initDD(q);
    const newSlots = [...state.slots];
    const newBank = [...state.bank];
    if (newSlots[slotIdx] !== null) { newBank.push(newSlots[slotIdx]); newSlots[slotIdx] = null; }
    newSlots[slotIdx] = word;
    const wIdx = newBank.indexOf(word);
    if (wIdx > -1) newBank.splice(wIdx, 1);
    setSelectedAnswer({ slots: newSlots, bank: newBank });
  };
  const removeWord = (slotIdx) => {
    if (showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
    const state = initDD(q);
    const newSlots = [...state.slots];
    const newBank = [...state.bank];
    if (newSlots[slotIdx] !== null) { newBank.push(newSlots[slotIdx]); newSlots[slotIdx] = null; }
    setSelectedAnswer({ slots: newSlots, bank: newBank });
  };
  const bankTapWord = (word) => {
    if (showExplanation) return;
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
    const state = initDD(q);
    const emptyIdx = state.slots.indexOf(null);
    if (emptyIdx > -1) placeWord(word, emptyIdx);
  };
  const submitDD = () => {
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
    const state = initDD(q);
    if (state.slots.some(s => s == null)) return;
    const isCorrect = state.slots.every((s, i) => s == q.correct[i]);
    doAnswer(isCorrect, q);
  };

  // Column sort handlers
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
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
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
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
    const state = initCol(q);
    const newCols = {};
    Object.keys(state.columns).forEach(k => { newCols[k] = state.columns[k].filter(x => x !== item); });
    setSelectedAnswer({ columns: newCols, pool: [...state.pool, item], lastPlaced: null });
  };
  const submitCol = () => {
    const q = (selectedLesson?.questions || selectedModule?.questions)[currentQuestion];
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
    const newScore = ok ? quizScore + 10 : quizScore;
    const newStreak = ok ? streak + 1 : 0;
    if (ok) { setQuizScore(newScore); setStreak(newStreak); if (newStreak >= 3) { setShowStreakAnim(true); setTimeout(() => setShowStreakAnim(false), 2000); } }
    else setStreak(0);
    const newResults = [...quizResults, { question: q.question, correct: ok, explanation: q.explanation }];
    setQuizResults(newResults);
    // Save progress for resume
    const lessonId = selectedLesson?.id || selectedModule?.id;
    if (lessonId) {
      saveProgress(lessonId, { currentQuestion: currentQuestion + 1, quizScore: newScore, streak: newStreak, quizResults: newResults });
    }
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
      const lessonId = selectedLesson?.id || selectedModule?.id;
      if (lessonId) clearProgress(lessonId);
      setScreen('results');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SCREEN ROUTING — STANDALONE LESSON COMPONENTS
  // ═══════════════════════════════════════════════════════════════
  // FIX: These MUST be separate top-level checks, NOT nested.

  // Islamic History standalone lessons
  if (screen === 'hb1-l1') {
    return <DEANY_HB1_L1 onBack={goLessons} onHome={goHome} />;
  }

  if (screen === 'hb1-l2') {
    return <DEANY_HB1_L2 onBack={goLessons} onHome={goHome} />;
  }

  // M1L2 check comes first so it doesn't fall into M1L1's block.
  if (screen === 'lesson-component-5') {
    return <DEANY_M1L5 onBack={goLessons} onHome={goHome} savedProgress={loadProgress('lesson-1-5')} />;
  }

  if (screen === 'lesson-component-4') {
    return <DEANY_M1L4 onBack={goLessons} onHome={goHome} savedProgress={loadProgress('lesson-1-4')} />;
  }

  if (screen === 'lesson-component-3') {
    return <DEANY_M1L3 onBack={goLessons} onHome={goHome} savedProgress={loadProgress('lesson-1-3')} />;
  }

  if (screen === 'lesson-component-2') {
    return <DEANY_M1L2 onBack={goLessons} onHome={goHome} savedProgress={loadProgress('lesson-1-2')} />;
  }

  if (screen === 'lesson-component') {
    return <DEANY_M1L1 onBack={goLessons} onHome={goHome} savedProgress={loadProgress('lesson-1-1')} />;
  }

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
            {[{l:'Points',v:totalPoints,c:'#b45309',bg:'from-amber-50 to-orange-50',bc:'#fbbf24'},{l:'Streak',v:`🔥 ${dailyStreak}`,c:'#c2410c',bg:'from-red-50 to-orange-50',bc:'#f97316'},{l:'Coins',v:`🪙 ${coins}`,c:'#a16207',bg:'from-yellow-50 to-amber-50',bc:'#eab308'},{l:'Level',v:level,c:'#047857',bg:'from-emerald-50 to-teal-50',bc:'#10b981'}].map((s,i) => (
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

    // Islamic Finance: full learning path with all modules + lessons inline
    if (isFin) {
      return (
        <ModuleOverview
          modules={mods}
          completedLessons={completedLessons}
          loadProgress={loadProgress}
          onSelectLesson={selectLes}
          onSelectModule={selectModule}
          onBack={goHome}
          onHome={goHome}
        />
      );
    }

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
                <button key={e.id} onClick={() => selectModule(e)} className={`group ${glassHover} rounded-xl p-6 text-center`}>
                  <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white text-xs font-bold mb-2 shadow-sm" style={{background:'linear-gradient(135deg,#0ea5e9,#3b82f6)'}}>{i+1}</div>
                  <div className="text-3xl mb-2">{e.icon}</div><h3 className="font-bold text-gray-900 text-xs mb-0.5">{e.title}</h3><p className="text-[10px] text-gray-500 mb-2">{e.subtitle}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold text-sky-700 bg-sky-50">Explore <ArrowRight className="w-2.5 h-2.5" /></span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map(m => (
                <button key={m.id} onClick={() => selectModule(m)} className={`group ${glassHover} rounded-xl p-5 text-left`}>
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

  // LESSONS (fallback for non-finance modules with lessons)
  if (screen == 'lessons' && selectedModule) {
    return (
      <ModuleOverview
        modules={[selectedModule]}
        completedLessons={completedLessons}
        loadProgress={loadProgress}
        onSelectLesson={selectLes}
        onSelectModule={selectModule}
        onBack={goModules}
        onHome={goHome}
      />
    );
  }

  // EPOCH LEVELS
  if (screen == 'epoch-levels' && selectedEpoch) {
    return (
      <div className="min-h-screen relative" style={pageBg}><IslamicPattern /><div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <NavHeader onBack={() => setScreen('modules')} onHome={goHome} backLabel="Epochs" />
        <div className={`${glass} rounded-2xl p-6 mb-6 text-center`}><div className="text-5xl mb-2">{selectedEpoch.icon}</div><h1 className="text-xl font-bold text-gray-900" style={{fontFamily:"Georgia,serif"}}>{selectedEpoch.title}</h1><p className="text-gray-500 text-xs">{selectedEpoch.subtitle}</p></div>
        <div className="space-y-2.5">{selectedEpoch.levels.map((l, i) => (
          <button key={l.id} onClick={() => selectLvl(l)} className={`w-full ${glassHover} rounded-xl p-4 text-left group`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl text-white shadow-md ${i==0?'bg-gradient-to-br from-green-500 to-emerald-600':i==1?'bg-gradient-to-br from-blue-500 to-sky-600':'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>{['🌱','📚','🎓'][i]}</div><div><h3 className="font-bold text-gray-900 text-sm">{l.name}</h3>{l.lessons && <p className="text-[10px] text-gray-500">{l.lessons.length} lessons</p>}</div></div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
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

  // ═══════════════════════════════════════════════════════════════
  // SPEED ROUND
  // ═══════════════════════════════════════════════════════════════
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
              <div className="text-5xl mb-3">{pct >= 80 ? '⭐' : pct >= 60 ? '👍' : '💪'}</div>
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
                <div className="text-4xl mb-3">{speedFeedback.correct ? '✅' : '❌'}</div>
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
            <div className="px-3 py-1 rounded-full text-xs font-bold" style={{background:'linear-gradient(135deg,#ede9fe,#ddd6fe)',border:'1px solid #a78bfa',color:'#6d28d9'}}>⚡ {speedRoundIdx + 1}/{total}</div>
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
                  <div className="text-lg mb-1">🚫</div>
                  <div className="text-[10px] font-bold text-red-700">Non-Compliant</div>
                </button>
                <button onClick={() => handleSwipe('nmi')} className="p-3.5 rounded-xl border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-400 transition-all text-center">
                  <div className="text-lg mb-1">🔍</div>
                  <div className="text-[10px] font-bold text-amber-700">Need More Info</div>
                </button>
                <button onClick={() => handleSwipe('c')} className="p-3.5 rounded-xl border-2 border-green-200 bg-green-50/50 hover:bg-green-100 hover:border-green-400 transition-all text-center">
                  <div className="text-lg mb-1">✅</div>
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
              {streak > 0 && <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${showStreakAnim?'animate-pulse':''}`} style={{background:'linear-gradient(135deg,#fed7aa,#fecaca)',border:'1px solid #f97316',color:'#c2410c'}}>{streak}🔥</div>}
            </div>
          </div>
          <div className={`${glass} rounded-xl p-3.5 mb-4`}>
            <div className="flex items-center gap-2.5 mb-2"><Mascot size="sm" className="!w-8 !h-8 !text-lg" /><div className="flex-grow min-w-0"><h2 className="font-bold text-gray-900 text-xs truncate">{selectedLesson?.title||selectedModule?.title}</h2><div className="flex justify-between text-[10px] text-gray-400"><span>Q{currentQuestion+1}/{total}</span><div className="flex items-center gap-0.5">{[...Array(Math.min(total,15))].map((_,i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < currentQuestion ? 'bg-emerald-400' : i === currentQuestion ? 'bg-emerald-600 w-2.5' : 'bg-gray-200'}`} />)}</div><span>{Math.round(pct)}%</span></div></div></div>
            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full transition-all duration-500" style={{width:`${pct}%`,background:'linear-gradient(90deg,#10b981,#14b8a6)'}}/></div>
          </div>
          <div className={`${glass} rounded-xl p-5 mb-4`}>
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
                  <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">SPOT THE DEFECT</span>
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
                <div className="flex items-center gap-1.5 mb-3"><span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">FLOW: Which step has the defect?</span></div>
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
            {cq.uiType == 'advise' && (<div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">💡 ADVISE: Pick the best response</span></div>)}
            {cq.uiType == 'triage' && (<div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">🎯 TRIAGE: Sort the scenarios</span></div>)}
            {cq.uiType == 'fill' && (<div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold">✏️ FILL: Complete the statement</span></div>)}
            {cq.uiType == 'match' && (<div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-bold">🔗 MATCH: Connect the pairs</span></div>)}
            {cq.uiType == 'slider' && (<div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">📊 CLASSIFY: Where does it fall?</span></div>)}
            {(cq.uiType == 'sel2' || cq.uiType == 'selall') && (<div className="mb-4 flex items-center gap-1.5"><span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{cq.uiType == 'sel2' ? '✌️ SELECT TWO' : '☑️ SELECT ALL THAT APPLY'}</span></div>)}

            <h2 className="text-base font-bold text-gray-900 mb-4 leading-relaxed"><GT text={cq.question} /></h2>

            {cq.type == 'multiple-choice' && (() => { const sh = getShuffled(currentQuestion, cq); const isAdvise = cq.uiType == 'advise'; return <>
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
              const parts = cq.sentence.split('___');
              return <>
                <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-lg p-4 mb-5 border border-indigo-100">
                  <div className="text-sm text-gray-800 leading-loose flex flex-wrap items-center gap-1">
                    {parts.map((part, i) => (
                      <React.Fragment key={i}>
                        <span className="whitespace-pre-wrap">{part}</span>
                        {i < parts.length - 1 && (
                          <button onClick={() => ddState.slots[i] !== null ? removeWord(i) : null}
                            className={`inline-flex items-center min-w-[80px] h-8 px-3 rounded-md text-xs font-bold transition-all mx-0.5 ${
                              showExplanation && ddState.slots[i] == cq.correct[i] ? 'bg-green-100 border-2 border-green-400 text-green-700'
                              : showExplanation && ddState.slots[i] !== null && ddState.slots[i] !== cq.correct[i] ? 'bg-red-50 border-2 border-red-300 text-red-600'
                              : ddState.slots[i] !== null ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700 hover:bg-red-50 hover:border-red-300 cursor-pointer'
                              : 'bg-white border-2 border-dashed border-gray-300 text-gray-400'
                            }`}>
                            {ddState.slots[i] !== null ? (
                              <span className="flex items-center gap-1">
                                {ddState.slots[i]}
                                {showExplanation && ddState.slots[i] == cq.correct[i] && <CheckCircle className="w-3 h-3 text-green-500" />}
                                {showExplanation && ddState.slots[i] !== cq.correct[i] && <XCircle className="w-3 h-3 text-red-400" />}
                                {!showExplanation && <span className="text-[9px] ml-1 opacity-60">✕</span>}
                              </span>
                            ) : <span className="text-[10px]">{i + 1}</span>}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  {showExplanation && !ddState.slots.every((s, i) => s == cq.correct[i]) && (
                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <div className="text-[10px] font-semibold text-indigo-600 mb-1">Correct order:</div>
                      <div className="flex flex-wrap gap-1">{cq.correct.map((w, i) => <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[11px] font-semibold">{w}</span>)}</div>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1"><span>📦</span> Word Bank -- tap to place</div>
                  <div className="flex flex-wrap gap-2">
                    {ddState.bank.map((word, i) => (
                      <button key={word + '-' + i} onClick={() => bankTapWord(word)} disabled={showExplanation}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${showExplanation ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 shadow-sm hover:shadow-md active:scale-95 cursor-pointer'}`}>
                        {word}
                      </button>
                    ))}
                    {ddState.bank.length == 0 && !showExplanation && <div className="text-[10px] text-gray-400 italic py-2">All words placed! Tap a slot to remove.</div>}
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
                {colState.pool.length > 0 && (
                  <div className="mb-5">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5"><span className="text-sm">✋</span>Drag statements into the cups below</div>
                    <div className="space-y-2">
                      {colState.pool.map((item) => {
                        const isHeld_ = heldItem == item;
                        return (
                          <div key={item} draggable={!showExplanation}
                            onDragStart={(e) => { e.dataTransfer.setData('text/plain', item); e.dataTransfer.effectAllowed = 'move'; setHeldItem(item); }}
                            onDragEnd={() => { setHeldItem(null); setDragOverCol(null); }}
                            onClick={() => colPickItem(item)}
                            className={`text-xs font-medium rounded-xl p-3.5 border-2 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${isHeld_ ? 'bg-indigo-50 border-indigo-400 shadow-lg scale-[1.02] ring-2 ring-indigo-200/60' : 'bg-white/90 border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}
                            style={{animation: 'fadeSlideIn 0.25s ease-out'}}>
                            <div className="flex items-center gap-2.5">
                              <div className={`flex flex-col gap-[3px] flex-shrink-0 transition-colors ${isHeld_ ? 'opacity-80' : 'opacity-30'}`}>
                                <div className="flex gap-[3px]"><div className="w-[4px] h-[4px] rounded-full bg-current"/><div className="w-[4px] h-[4px] rounded-full bg-current"/></div>
                                <div className="flex gap-[3px]"><div className="w-[4px] h-[4px] rounded-full bg-current"/><div className="w-[4px] h-[4px] rounded-full bg-current"/></div>
                                <div className="flex gap-[3px]"><div className="w-[4px] h-[4px] rounded-full bg-current"/><div className="w-[4px] h-[4px] rounded-full bg-current"/></div>
                              </div>
                              <span className={`leading-snug ${isHeld_ ? 'text-indigo-800' : 'text-gray-700'}`}>{item}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {colState.pool.length == 0 && !showExplanation && <div className="text-center text-[10px] text-gray-400 italic mb-4 py-2">All statements sorted -- tap an item in a cup to move it back</div>}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {cq.columns.map(col => {
                    const items = colState.columns[col.id] || [];
                    const isOver = dragOverCol == col.id;
                    const canDrop = (heldItem || isOver) && !showExplanation;
                    return (
                      <div key={col.id}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverCol(col.id); }}
                        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCol(null); }}
                        onDrop={(e) => { e.preventDefault(); const d = e.dataTransfer.getData('text/plain'); if (d) colDropInto(col.id, d); }}
                        onClick={() => { if (heldItem && !showExplanation) colDropInto(col.id); }}>
                        <div className={`relative overflow-hidden transition-all duration-300 ${canDrop ? 'cursor-pointer' : ''}`}
                          style={{ borderRadius: '16px 16px 24px 24px', border: `2.5px solid ${isOver ? col.color : canDrop ? col.color + '70' : col.color + '25'}`, borderTop: `3px solid ${isOver ? col.color : canDrop ? col.color + '90' : col.color + '40'}`, background: isOver ? `linear-gradient(180deg, ${col.color}15 0%, ${col.color}08 100%)` : `linear-gradient(180deg, ${col.color}08 0%, ${col.color}03 100%)`, minHeight: '180px', boxShadow: isOver ? `0 0 20px ${col.color}25, inset 0 2px 12px ${col.color}10` : `inset 0 1px 4px ${col.color}05`, transform: isOver ? 'scale(1.02)' : 'scale(1)' }}>
                          <div style={{ height: '4px', background: `linear-gradient(90deg, ${col.color}50, ${col.color}80, ${col.color}50)`, borderRadius: '16px 16px 0 0' }} />
                          <div className="flex items-center justify-center gap-1.5 py-2.5 px-3">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: col.color }} />
                            <span className="text-[11px] font-bold tracking-wide" style={{ color: col.color }}>{col.label}</span>
                            {items.length > 0 && <span className="text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white shadow-sm" style={{ background: col.color }}>{items.length}</span>}
                          </div>
                          <div className="px-2 pb-3 space-y-1.5" style={{ minHeight: '110px' }}>
                            {items.length == 0 && (
                              <div className="flex flex-col items-center justify-center py-6 rounded-xl transition-all" style={{ border: `2px dashed ${isOver ? col.color + '60' : col.color + '20'}` }}>
                                <div className="text-2xl mb-1.5" style={{ opacity: isOver ? 0.6 : 0.2 }}>↓</div>
                                <span className="text-[10px] font-medium" style={{ color: isOver ? col.color : col.color + '70' }}>{isOver ? 'Release to drop!' : canDrop ? 'Drop here' : 'Empty'}</span>
                              </div>
                            )}
                            {items.map(item => {
                              const isLastPlaced = colState.lastPlaced == item;
                              const isCorrectItem = showExplanation && col.correct.includes(item);
                              const isWrongItem = showExplanation && !col.correct.includes(item);
                              return (
                                <div key={item} draggable={!showExplanation}
                                  onDragStart={(e) => { e.dataTransfer.setData('text/plain', item); colRemoveItem(item, col.id); }}
                                  onClick={(e) => { e.stopPropagation(); if (!showExplanation) colRemoveItem(item, col.id); }}
                                  className={`text-[11px] font-medium rounded-lg p-2.5 border transition-all ${isCorrectItem ? 'bg-green-50 border-green-300 text-green-800' : isWrongItem ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white/90 border-gray-200 text-gray-700 cursor-grab active:cursor-grabbing hover:bg-red-50/30 hover:border-red-200'}`}
                                  style={isLastPlaced ? { animation: 'colBounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' } : {}}>
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
                            {isOver && items.length > 0 && (
                              <div className="flex items-center justify-center py-2 rounded-lg border-2 border-dashed transition-all" style={{ borderColor: col.color + '50', animation: 'fadeSlideIn 0.15s ease-out' }}>
                                <span className="text-[10px] font-medium" style={{ color: col.color }}>+ Drop here</span>
                              </div>
                            )}
                          </div>
                          <div style={{ height: '12px', background: `linear-gradient(180deg, transparent, ${col.color}08)`, borderRadius: '0 0 20px 20px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {showExplanation && !currentAnswerCorrect && (
                  <div className="rounded-xl p-3.5 mb-4 border border-green-200 bg-green-50/50">
                    <div className="text-[10px] font-bold text-green-700 mb-2.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct sorting</div>
                    <div className="grid grid-cols-2 gap-3">
                      {cq.columns.map(col => (
                        <div key={col.id}>
                          <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} /><span style={{ color: col.color }}>{col.label}</span></div>
                          <div className="space-y-1">{col.correct.map(item => <div key={item} className="text-[10px] text-green-800 bg-green-100 rounded-md px-2.5 py-1.5 leading-snug">{item}</div>)}</div>
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
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="h-1" style={{background: currentAnswerCorrect ? 'linear-gradient(90deg,#22c55e,#10b981)' : 'linear-gradient(90deg,#3b82f6,#6366f1)'}} />
              <div className={`p-6 ${currentAnswerCorrect ? 'bg-gradient-to-b from-green-50/50' : 'bg-gradient-to-b from-blue-50/50'}`}>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white shadow-md" style={{background: currentAnswerCorrect ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>
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
                <button onClick={handleNext} className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]" style={{background: currentAnswerCorrect ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>
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
                <div className="text-center mb-4"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md" style={{background: quizResults[selectedResultQuestion].correct ? 'linear-gradient(135deg,#22c55e,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)'}}>{quizResults[selectedResultQuestion].correct ? <><CheckCircle className="w-3.5 h-3.5" />Correct!</> : <><Lightbulb className="w-3.5 h-3.5" />Review</>}</div></div>
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

// ---- CSS Animations -----------------------------------------------
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes confettiFall { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(100vh) rotate(360deg); opacity:0; } }
@keyframes fadeSlideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes colBounce { 0% { transform: scale(0.85) translateY(8px); opacity:0.5; } 50% { transform: scale(1.05) translateY(-3px); } 70% { transform: scale(0.98) translateY(1px); } 100% { transform: scale(1) translateY(0); opacity:1; } }
`;
if (!document.getElementById('deany-styles')) { styleTag.id = 'deany-styles'; document.head.appendChild(styleTag); }

export default App;