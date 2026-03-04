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
  const [showProTip, setShowProTip] = useState(false);
  const [showTrapAnalysis, setShowTrapAnalysis] = useState(false);
  const [showThinkDeeper, setShowThinkDeeper] = useState(false);
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
    { id: 'islamic-finance': [{
  id: 'module-b1', title: 'Why This Matters', subtitle: 'Islam is pro-wealth, pro-commerce — and your money is a trust', icon: '🎯', color: '#d97706', difficulty: 'Beginner', estimatedTime: '50 min', lessonCount: 5,
  mascotMessage: 'This is your foundation — by the end you will see money through the lens of amānah!',
  lessons: [
    { id: 'lesson-1-1', title: 'The Trader Prophet ﷺ', description: 'Islam is not anti-money', duration: '12 min', questions: [] },
    { id: 'lesson-1-2', title: 'Money as Amānah', description: 'You do not own wealth, you manage it', duration: '13 min', questions: [] },
    { id: 'lesson-1-3',    { id: 'lesson-1Prohibitions', description: 'Ribā, gharar and maysir basics', duration: '14 min', questions: [] },
    { id: 'lesson-1-4', title: 'Substa    { id: 'lesson-1-4'ription: 'What IS this deal doing, not what it is call    { id:tion: '13 min', questions: [] },
    { id: 'lesson-1-5', title: 'Your Money Right Now', description:    { id: 'lesson-1-5', title: 'Your Minance    { id: 'less12 min', questions: [] },
  ]
}],
    'islamic-finance': [{
      id: 'module-b1', title: "Why This Matters", subtitle: "Islam is pro-wealth, pro-commerce — and your money is a trust", icon: "🎯", color: "#d97706", difficulty: "Beginner", estimatedTime: "50 min", lessonCount: 5,
      mascotMessage: "This is your foundation — by the end you'll see money through the lens of amānah!",
      lessons: [
        { id: 'lesson-1-1', title: "The Trader Prophet         { id: 'lesson-1-1', title:ti-money", duration: "12 min", questions: [] },
        { id: 'lesson-1-2', title: "Money as Amānah", description: "You don't own wealth, you manage it", duration: "13 min", questions: [] },
        { id: 'lesson-1-3', title: "The Three Prohibitions", description: "Ribā, gharar and maysir basics", duration: "14 min", questions: [] },
        { id: 'lesson-1-4'        { id: 'lesson-1-4'        { id: ption: "What IS this deal doing, not what's it called", duration: "13 min", questions: [] },
        { id: 'lesson-1-5', title: "Your Money Right Now", description: "Guided self-assessment of your own finances", duration: "12 min", questions: [] },
      ]
    }],
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
  const resetQuiz = (questions) => { setCurrentQuestion(0); setSelectedAnswer(null); setHeldItem(null); setDragOverCol(null); setShowExplanation(false); setShowConceptIntro(true); setConceptIndex(0); setQuizScore(0); setStreak(0); setQuizResults([]); setShowProTip(false); setShowTrapAnalysis(false); setShowThinkDeeper(false); if (questions) buildShuffleMaps(questions); };
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
    const items = q.items
      || (q.visual?.chips ? q.visual.chips.map(c => c.text) : null)
      || q.columns.flatMap(c => c.correct || []);
    return { columns: cols, pool: [...items] };
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
    if (totalPlaced < (q.items?.length || q.visual?.chips?.length || q.columns.reduce((s, c) => s + (c.correct?.length || 0), 0))) return;
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
    if (currentQuestion < qs.length - 1) { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(null); setHeldItem(null); setDragOverCol(null); setShowExplanation(false); setCurrentAnswerCorrect(false); setShowTrapAnalysis(false); setShowThinkDeeper(false); }
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
                <button key={e.id} onClick={() => selectModule(e)} disabled={false} className={`group ${glassHover} rounded-xl p-6 text-center `}>
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
                  <button key={m.id} onClick={() => selectModule(m, i)} disabled={false} className={`w-full ${glassHover} rounded-xl p-5 text-left group `}>
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
                <button key={m.id} onClick={() => selectModule(m)} disabled={false} className={`group ${glassHover} rounded-xl p-5 text-left `}>
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
              <button key={l.id} onClick={() => selectLes(l, i)} disabled={false} className={`w-full ${glassHover} rounded-lg p-4 text-left group  ${done ? 'ring-1 ring-emerald-200' : ''}`}>
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
          <button key={l.id} onClick={() => selectLvl(l)} disabled={false} className={`w-full ${glassHover} rounded-xl p-4 text-left group `}>
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
      if (!cards?.length) { /* skip concept intro -- handled below */ }
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
                <div className="text-gray-800 leading-relaxed text-sm mb-4 whitespace-pre-line"><GT text={cc.text} /></div>
                {cc.proTip && (
                  <div className="mb-5">
                    <button onClick={() => setShowProTip(!showProTip)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 ${showProTip ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-amber-50/50 border-amber-200/60 text-amber-700 hover:border-amber-300'}`}>
                      <span className="flex items-center gap-1.5">💡 Pro Tip</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showProTip ? 'rotate-90' : ''}`} />
                    </button>
                    {showProTip && <div className="mt-2 px-3.5 py-2.5 bg-amber-50 rounded-xl text-xs text-amber-900 leading-relaxed border border-amber-200" style={{animation:'fadeSlideIn 0.2s ease-out'}}>{cc.proTip}</div>}
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 mb-5">{cards.map((_,i)=><div key={i} className={`h-1 rounded-full transition-all ${i==conceptIndex?'w-5 bg-indigo-500':i<conceptIndex?'w-1.5 bg-indigo-300':'w-1.5 bg-gray-200'}`}/>)}</div>
                <div className="flex gap-2">
                  {conceptIndex > 0 && <button onClick={() => {setConceptIndex(conceptIndex-1);setShowProTip(false);}} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1"><ChevronLeft className="w-3.5 h-3.5" />Prev</button>}
                  {!last ? <button onClick={() => {setConceptIndex(conceptIndex+1);setShowProTip(false);}} className="flex-1 text-white py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 shadow-md" style={{background:'linear-gradient(135deg,#3b82f6,#6366f1)'}}>Next <ArrowRight className="w-3.5 h-3.5" /></button>
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
            <div className="flex items-center gap-2.5 mb-2"><Mascot size="sm" className="!w-8 !h-8 !text-lg" /><div className="flex-grow min-w-0"><h2 className="font-bold text-gray-900 text-xs truncate">{selectedLesson?.title||selectedModule?.title}</h2><div className="flex justify-between text-[10px] text-gray-400"><span className="flex items-center gap-1.5">Q{currentQuestion+1}/{total}{cq.zone && <span className={`px-1.5 py-0.5 rounded-full font-bold text-[8px] ${cq.zone===1?'bg-amber-100 text-amber-700':cq.zone===2?'bg-blue-100 text-blue-700':'bg-violet-100 text-violet-700'}`}>{cq.zone===1?'⚡ WARM-UP':cq.zone===2?'🔧 BUILD':'🚀 STRETCH'}</span>}{cq.xp && <span className="text-amber-600 font-bold">+{cq.xp}XP</span>}</span><div className="flex items-center gap-0.5">{[...Array(Math.min(total,15))].map((_,i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < currentQuestion ? 'bg-emerald-400' : i === currentQuestion ? 'bg-emerald-600 w-2.5' : 'bg-gray-200'}`} />)}</div><span>{Math.round(pct)}%</span></div></div></div>
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

            {/* ---- SCENARIO / CONTEXT ---- */}
            {cq.concept && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-4 text-xs text-gray-700 leading-relaxed italic" style={{borderLeft:'3px solid #6366f1'}}>
                <GT text={cq.concept} />
              </div>
            )}

            {/* ---- QUESTION TEXT ---- */}
            <h2 className="text-base font-bold text-gray-900 mb-4 leading-relaxed"><GT text={cq.question} /></h2>

            {/* ---- HINT (costs XP) ---- */}
            {cq.hint && !showExplanation && (
              <button onClick={() => { const el = document.getElementById('hint-reveal'); if(el) el.style.display = el.style.display === 'none' ? 'block' : 'none'; }} className="mb-4 flex items-center gap-1.5 text-[10px] text-amber-600 hover:text-amber-800 font-medium">
                💡 Show hint
              </button>
            )}
            {cq.hint && <div id="hint-reveal" style={{display:'none'}} className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">{cq.hint}</div>}

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
              const totalItems = cq.items?.length || cq.visual?.chips?.length || cq.columns.reduce((s, c) => s + (c.correct?.length || 0), 0);
              const allPlaced = totalPlaced >= totalItems;
              return <>
                {/* Scenario context for column-sort */}
                {cq.concept && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-4 text-xs text-gray-700 leading-relaxed italic" style={{borderLeft:'3px solid #6366f1'}}>
                    <GT text={cq.concept} />
                  </div>
                )}
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
                    <div><div className="text-lg font-bold text-amber-600">+{cq.xp || 10}</div><div className="text-[10px] text-gray-500">XP</div></div>
                    <div><div className="text-lg font-bold text-emerald-600">+{(cq.xp || 10) * 2}</div><div className="text-[10px] text-gray-500">Pts</div></div>
                    <div><div className="text-lg font-bold text-orange-600">{streak}</div><div className="text-[10px] text-gray-500">Streak</div></div>
                  </div>
                )}

                {/* Interactive: Trap Analysis */}
                {cq.trapAnalysis && (
                  <div className="mb-3">
                    <button onClick={() => setShowTrapAnalysis(!showTrapAnalysis)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 ${showTrapAnalysis ? 'bg-red-50 border-red-300 text-red-800' : 'bg-red-50/50 border-red-200/60 text-red-700 hover:border-red-300'}`}>
                      <span className="flex items-center gap-1.5">🪤 Trap Analysis</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showTrapAnalysis ? 'rotate-90' : ''}`} />
                    </button>
                    {showTrapAnalysis && <div className="mt-2 px-3.5 py-2.5 bg-red-50 rounded-xl text-xs text-red-900 leading-relaxed border border-red-200" style={{animation:'fadeSlideIn 0.2s ease-out'}}>{cq.trapAnalysis}</div>}
                  </div>
                )}

                {/* Interactive: Think Deeper */}
                {cq.thinkDeeper && (
                  <div className="mb-3">
                    <button onClick={() => setShowThinkDeeper(!showThinkDeeper)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 ${showThinkDeeper ? 'bg-violet-50 border-violet-300 text-violet-800' : 'bg-violet-50/50 border-violet-200/60 text-violet-700 hover:border-violet-300'}`}>
                      <span className="flex items-center gap-1.5">🧠 Think Deeper</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showThinkDeeper ? 'rotate-90' : ''}`} />
                    </button>
                    {showThinkDeeper && <div className="mt-2 px-3.5 py-2.5 bg-violet-50 rounded-xl text-xs text-violet-900 leading-relaxed border border-violet-200 italic" style={{animation:'fadeSlideIn 0.2s ease-out'}}>{cq.thinkDeeper}</div>}
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
