import React, { useMemo, useState } from "react";

/**
 * Deany Quran Tafsir Module
 * Module: Beginner Tafsir
 * Lesson 1: Surah Al-Fatiha
 * Scholar basis: Tafsir Ibn Kathir, simplified for beginners.
 *
 * Pedagogy update:
 * - Deany pattern = learn one thing, then test it soon after.
 * - Learners are allowed to get answers wrong and continue.
 * - Wrong answers produce a clear feedback card and count as a miss.
 * - Correct answers produce a positive explanation card.
 * - Answer order is shuffled.
 * - The end score uses the learner's first attempt, not a forced-correct retry.
 */

const MODULE_ID = "deany-tafsir-fatiha-beginner-ibn-kathir";
const STORAGE_KEY = `${MODULE_ID}:progress:v5`;

const ayahs = [
  {
    id: "1",
    label: "Ayah 1",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Bismillāhi r-raḥmāni r-raḥīm",
    translation: "In the name of Allah, the Most Compassionate, Most Merciful.",
    beginnerMeaning:
      "The surah begins by turning the learner towards Allah before anything else. It opens with Allah's name and reminds the learner of His mercy.",
    ibnKathirNote:
      "Ibn Kathir explains the importance of beginning with Allah's name and discusses Allah's beautiful names, including ar-Raḥmān and ar-Raḥīm.",
    memoryHook: "Opening = Allah's name + mercy twice.",
    reflection: "Before I begin something important, do I remember Allah?",
    keyWords: [
      { word: "بِسْمِ", meaning: "In the name" },
      { word: "اللَّهِ", meaning: "Allah" },
      { word: "الرَّحْمَٰنِ", meaning: "The Most Compassionate" },
      { word: "الرَّحِيمِ", meaning: "The Most Merciful" },
    ],
  },
  {
    id: "2",
    label: "Ayah 2",
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Al-ḥamdu lillāhi rabbi l-ʿālamīn",
    translation: "All praise is for Allah, Lord of all worlds.",
    beginnerMeaning:
      "The learner praises Allah because He is Rabb: the Lord, Owner, Sustainer, and Carer of all creation.",
    ibnKathirNote:
      "Ibn Kathir explains that al-ḥamd is praise for Allah and that Rabb al-ʿālamīn refers to Allah as Lord of all creation.",
    memoryHook: "Praise belongs to Allah because He is Lord of everything.",
    reflection: "What is one blessing I can praise Allah for today?",
    keyWords: [
      { word: "الْحَمْدُ", meaning: "All praise" },
      { word: "لِلَّهِ", meaning: "For Allah" },
      { word: "رَبِّ", meaning: "Lord" },
      { word: "الْعَالَمِينَ", meaning: "All worlds / all creation" },
    ],
  },
  {
    id: "3",
    label: "Ayah 3",
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Ar-raḥmāni r-raḥīm",
    translation: "The Most Compassionate, Most Merciful.",
    beginnerMeaning:
      "Allah's mercy is repeated. Before the surah speaks about judgement, it keeps Allah's mercy clearly in the learner's mind.",
    ibnKathirNote:
      "Ibn Kathir discusses these names as names of Allah connected to mercy. For beginners, the key point is that Allah's mercy is central.",
    memoryHook: "Same mercy order as ayah 1: ar-Raḥmān, then ar-Raḥīm.",
    reflection: "When I make a mistake, do I still remember Allah's mercy?",
    keyWords: [
      { word: "الرَّحْمَٰنِ", meaning: "The Most Compassionate" },
      { word: "الرَّحِيمِ", meaning: "The Most Merciful" },
    ],
  },
  {
    id: "4",
    label: "Ayah 4",
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    transliteration: "Māliki yawmi d-dīn",
    translation: "Master of the Day of Judgement.",
    beginnerMeaning:
      "The surah balances mercy with accountability. Life matters, choices matter, and everyone returns to Allah.",
    ibnKathirNote:
      "Ibn Kathir explains that yawm ad-dīn refers to the Day of recompense and judgement, when Allah judges His servants.",
    memoryHook: "Mālik = Master. Yawm ad-dīn = Day of Judgement.",
    reflection: "How can remembering accountability make me more sincere?",
    keyWords: [
      { word: "مَالِكِ", meaning: "Master / Owner" },
      { word: "يَوْمِ", meaning: "Day" },
      { word: "الدِّينِ", meaning: "Judgement / recompense" },
    ],
  },
  {
    id: "5",
    label: "Ayah 5",
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyāka naʿbudu wa iyyāka nastaʿīn",
    translation: "You alone we worship, and You alone we ask for help.",
    beginnerMeaning:
      "The surah now shifts. The learner stops speaking about Allah and speaks directly to Allah. Worship and seeking help are directed to Him alone.",
    ibnKathirNote:
      "Ibn Kathir explains that this ayah combines sincerity in worship with reliance on Allah for help.",
    memoryHook: "Iyyāka repeats twice. Worship first, help second.",
    reflection: "Where do I need Allah's help most right now?",
    keyWords: [
      { word: "إِيَّاكَ", meaning: "You alone" },
      { word: "نَعْبُدُ", meaning: "We worship" },
      { word: "نَسْتَعِينُ", meaning: "We ask for help" },
    ],
  },
  {
    id: "6",
    label: "Ayah 6",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    transliteration: "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
    translation: "Guide us to the straight path.",
    beginnerMeaning:
      "This is the main request of the surah. After praising Allah and turning to Him, the learner asks for guidance.",
    ibnKathirNote:
      "Ibn Kathir explains guidance as being directed and kept firm upon the straight path.",
    memoryHook: "Ihdinā = guide us. Ṣirāṭ al-mustaqīm = straight path.",
    reflection: "Guidance is not only information. What action do I need help staying firm on?",
    keyWords: [
      { word: "اهْدِنَا", meaning: "Guide us" },
      { word: "الصِّرَاطَ", meaning: "The path" },
      { word: "الْمُسْتَقِيمَ", meaning: "Straight / upright" },
    ],
  },
  {
    id: "7",
    label: "Ayah 7",
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    transliteration:
      "Ṣirāṭa lladhīna anʿamta ʿalayhim, ghayri l-maghḍūbi ʿalayhim wa la ḍ-ḍāllīn",
    translation:
      "The path of those You have blessed, not of those who have earned anger, nor of those who are astray.",
    beginnerMeaning:
      "The learner asks for the path of those Allah has blessed, and asks to be protected from paths of knowing the truth and rejecting it, or losing the way.",
    ibnKathirNote:
      "Ibn Kathir explains this ayah as asking Allah for the path of the people of guidance and avoiding wrong paths. For beginners, this should be taught as a humble personal dua, not as arrogance over others.",
    memoryHook: "Blessed path first. Then: not anger, not astray.",
    reflection: "Do I ask Allah to guide me with humility, not pride?",
    keyWords: [
      { word: "أَنْعَمْتَ", meaning: "You have blessed" },
      { word: "الْمَغْضُوبِ", meaning: "Those who earned anger" },
      { word: "الضَّالِّينَ", meaning: "Those who are astray" },
    ],
  },
];

const structureCards = [
  {
    title: "Praise and recognition",
    ayahs: "Ayahs 1 to 4",
    body: "The learner begins with Allah's name, mercy, praise, lordship, and accountability.",
  },
  {
    title: "Direct worship",
    ayahs: "Ayah 5",
    body: "The learner turns from speaking about Allah to speaking directly to Allah.",
  },
  {
    title: "The central request",
    ayahs: "Ayahs 6 to 7",
    body: "The learner asks for guidance to the straight path and protection from wrong paths.",
  },
];

const assessmentItems = {
  "structure-check": {
    type: "sort",
    title: "Surah map check",
    question: "Put the simple structure of Al-Fatiha in order.",
  },
  "ayah-1-check": {
    type: "mcq",
    title: "Ayah 1 check",
    question: "What is the strongest beginner takeaway from the opening ayah?",
    options: [
      {
        text: "The reciter begins with Allah's name and is reminded of His mercy.",
        correct: true,
        explanation:
          "Correct. This ayah opens the surah with Allah's name and two names connected to mercy.",
      },
      {
        text: "The reciter begins by asking for guidance to the straight path.",
        correct: false,
        explanation:
          "That is the main request later in the surah. Ayah 1 begins with Allah's name and mercy.",
      },
      {
        text: "The reciter begins by describing the Day of Judgement.",
        correct: false,
        explanation:
          "The Day of Judgement appears in ayah 4. Ayah 1 is about beginning in Allah's name and remembering mercy.",
      },
      {
        text: "The reciter begins by comparing two different paths.",
        correct: false,
        explanation:
          "That belongs to the final ayah. Ayah 1 is the opening turn towards Allah.",
      },
    ],
  },
  "ayah-2-check": {
    type: "meaning-match",
    title: "Rabb al-ʿālamīn check",
    cue: "Lord of all worlds.",
    question: "Which beginner meaning fits this phrase best?",
    options: [
      {
        text: "Allah is the Lord, Owner, Sustainer, and Carer of all creation.",
        correct: true,
        explanation:
          "Correct. Rabb is richer than just 'creator'. It carries lordship, care, ownership, and sustaining.",
      },
      {
        text: "Allah is only Lord of the people who already worship Him correctly.",
        correct: false,
        explanation:
          "Not quite. Rabb al-ʿālamīn points to Allah's lordship over all worlds and all creation.",
      },
      {
        text: "Allah's mercy is repeated before judgement.",
        correct: false,
        explanation:
          "That is closer to ayah 3. This phrase is about Allah's lordship over all creation.",
      },
      {
        text: "Allah owns the Day when everyone is judged.",
        correct: false,
        explanation:
          "That is ayah 4. Ayah 2 focuses on praise and Allah being Rabb of all worlds.",
      },
    ],
  },
  "ayah-3-check": {
    type: "mcq",
    title: "Mercy repetition check",
    question: "Why does the lesson highlight mercy again in ayah 3?",
    options: [
      {
        text: "Because Allah's mercy is central before the surah moves into accountability.",
        correct: true,
        explanation:
          "Correct. The learner holds Allah's mercy clearly before ayah 4 mentions judgement.",
      },
      {
        text: "Because the repeated words are only there to help memorisation.",
        correct: false,
        explanation:
          "The repetition can help memory, but it is not only a memory trick. It carries meaning.",
      },
      {
        text: "Because ayah 3 introduces the main request for guidance.",
        correct: false,
        explanation:
          "The main request for guidance comes in ayah 6. Ayah 3 keeps mercy in focus.",
      },
      {
        text: "Because mercy cancels the need to think about judgement.",
        correct: false,
        explanation:
          "No. Al-Fatiha teaches both mercy and accountability. It does not cancel either one.",
      },
    ],
  },
  "ayah-4-scenario": {
    type: "scenario",
    title: "Accountability scenario",
    scenario:
      "A beginner hears 'Master of the Day of Judgement' and feels worried that the surah has suddenly become harsh.",
    question: "What is the best beginner explanation?",
    options: [
      {
        text: "The surah balances mercy with accountability, so life and choices matter.",
        correct: true,
        explanation:
          "Correct. Ayah 4 does not erase mercy. It balances mercy with the reality that everyone returns to Allah.",
      },
      {
        text: "The Day of Judgement should only be explained in advanced courses.",
        correct: false,
        explanation:
          "Not quite. Beginners can understand accountability simply and gently without advanced detail.",
      },
      {
        text: "This ayah mainly means Allah is merciful, so judgement is not important here.",
        correct: false,
        explanation:
          "Mercy is central, but ayah 4 specifically teaches accountability and judgement.",
      },
      {
        text: "This ayah is mainly a memorisation marker between mercy and worship.",
        correct: false,
        explanation:
          "It may help structure the surah, but it carries meaning: Allah is Master of the Day of Judgement.",
      },
    ],
  },
  "ayah-5-check": {
    type: "mcq",
    title: "Ayah 5 check",
    question: "What is the key shift in ayah 5, iyyāka naʿbudu wa iyyāka nastaʿīn?",
    options: [
      {
        text: "The reciter moves from speaking about Allah to speaking directly to Allah.",
        correct: true,
        explanation:
          "Correct. Ayah 5 is the direct turn: You alone we worship, and You alone we ask for help.",
      },
      {
        text: "The reciter moves from Allah's mercy to Allah's judgement and accountability.",
        correct: false,
        explanation:
          "That shift happens around ayah 4. Ayah 5 is different because the reciter now speaks directly to Allah.",
      },
      {
        text: "The surah moves from personal worship to the history of previous nations.",
        correct: false,
        explanation:
          "The final ayah mentions paths, but ayah 5 itself is about worship and seeking help from Allah alone.",
      },
      {
        text: "The ayah repeats the meaning of Rabb al-ʿālamīn in a more personal form.",
        correct: false,
        explanation:
          "It is related to Allah's lordship, but it is not a repeat. It is a direct pledge of worship and dependence.",
      },
    ],
  },
  "ayah-6-check": {
    type: "meaning-match",
    title: "Central request check",
    cue: "Guide us to the straight path.",
    question: "Why is this ayah so important in the surah?",
    options: [
      {
        text: "It is the main request after praise, worship, and seeking help.",
        correct: true,
        explanation:
          "Correct. The surah builds towards asking Allah for guidance to the straight path.",
      },
      {
        text: "It mainly repeats the idea that Allah is Lord of all worlds.",
        correct: false,
        explanation:
          "It connects to Allah's lordship, but the ayah itself is a direct dua for guidance.",
      },
      {
        text: "It mainly explains who has earned anger and who is astray.",
        correct: false,
        explanation:
          "That clarification comes in ayah 7. Ayah 6 is the central request for guidance.",
      },
      {
        text: "It is mainly a reflection on Allah's mercy.",
        correct: false,
        explanation:
          "Mercy is part of the surah's context, but this ayah directly asks for guidance.",
      },
    ],
  },
  "ayah-7-scenario": {
    type: "scenario",
    title: "Final ayah reflection",
    scenario:
      "A learner finishes the final ayah and says: 'This ayah is mainly about other people being wrong.'",
    question: "What should the lesson guide them towards?",
    options: [
      {
        text: "A humble personal dua: O Allah, guide me and protect me from wrong paths.",
        correct: true,
        explanation:
          "Correct. At beginner level, the strongest framing is humility, guidance, and asking Allah for protection.",
      },
      {
        text: "A debate about exactly which people are included in every tafsir discussion.",
        correct: false,
        explanation:
          "That may belong in a deeper tafsir course, but it is too heavy for this beginner lesson.",
      },
      {
        text: "A confidence boost that the reciter is already on the correct path.",
        correct: false,
        explanation:
          "Not quite. The reciter is asking Allah for guidance, which should create humility rather than self-certainty.",
      },
      {
        text: "A memory trick only: blessed path first, then two wrong paths.",
        correct: false,
        explanation:
          "That is useful for recall, but it misses the deeper beginner lesson: asking Allah for guidance with humility.",
      },
    ],
  },
};

const lessonFlow = [
  { type: "intro", id: "intro" },
  { type: "structure", id: "structure" },
  { type: "sort", id: "structure-check" },
  { type: "ayah", id: "1" },
  { type: "assessment", id: "ayah-1-check" },
  { type: "ayah", id: "2" },
  { type: "assessment", id: "ayah-2-check" },
  { type: "ayah", id: "3" },
  { type: "assessment", id: "ayah-3-check" },
  { type: "ayah", id: "4" },
  { type: "assessment", id: "ayah-4-scenario" },
  { type: "ayah", id: "5" },
  { type: "assessment", id: "ayah-5-check" },
  { type: "ayah", id: "6" },
  { type: "assessment", id: "ayah-6-check" },
  { type: "ayah", id: "7" },
  { type: "assessment", id: "ayah-7-scenario" },
  { type: "complete", id: "complete" },
];

function seededShuffle(array, seedText) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }

  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function getFreshState() {
  return { index: 0, answers: {}, firstAnswers: {}, sorted: [], firstSortCorrect: null, completed: false };
}

function getSavedState() {
  try {
    if (typeof window === "undefined") return getFreshState();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : getFreshState();
    return { ...getFreshState(), ...parsed };
  } catch {
    return getFreshState();
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Works without localStorage.
  }
}

function Button({ children, onClick, disabled, variant = "primary", className = "" }) {
  const variants = {
    primary: "bg-[#0f766e] text-white hover:bg-[#115e59] focus:ring-[#99f6e4]",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
    soft: "border border-teal-100 bg-teal-50 text-[#0f766e] hover:bg-teal-100 focus:ring-teal-100",
    dark: "bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-300",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </section>
  );
}

function OrnamentDivider({ className = "" }) {
  return (
    <div className={`mx-auto flex items-center justify-center gap-3 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#c9a54c]" />
      <span className="h-px w-14 bg-[#d8bf7a]" />
      <span className="h-2.5 w-2.5 rotate-45 border border-[#c9a54c] bg-[#fff8e8]" />
      <span className="h-px w-14 bg-[#d8bf7a]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#c9a54c]" />
    </div>
  );
}

function MushafAyahBlock({ ayah, compact = false }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#d8bf7a] bg-[#f4e8cb] p-3 shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #c9a54c 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative rounded-[1.55rem] border border-[#d8bf7a] bg-[#fffaf0] px-5 py-8 md:px-7 md:py-10">
        <div className="mx-auto mb-6 flex w-fit items-center justify-center rounded-full border border-[#c9a54c] bg-[#fff8e8] px-5 py-2 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#7b5d19]">{ayah.label}</span>
        </div>

        <OrnamentDivider className="mb-8" />

        <p
          dir="rtl"
          className={`text-center leading-[2.15] text-[#2f2416] ${compact ? "text-[2rem]" : "text-[2.35rem] md:text-[3.05rem]"}`}
          style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif" }}
        >
          {ayah.arabic}
        </p>

        <OrnamentDivider className="my-7" />

        <p className="text-center text-[15px] italic leading-7 text-[#6e5a3a] md:text-base">{ayah.transliteration}</p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[16px] font-semibold leading-8 text-[#3f3424] md:text-[17px]">
          {ayah.translation}
        </p>
      </div>

      <div className="pointer-events-none absolute left-5 top-5 h-4 w-4 rounded-full border border-[#c9a54c] bg-[#fff8e8]" />
      <div className="pointer-events-none absolute right-5 top-5 h-4 w-4 rounded-full border border-[#c9a54c] bg-[#fff8e8]" />
      <div className="pointer-events-none absolute bottom-5 left-5 h-4 w-4 rounded-full border border-[#c9a54c] bg-[#fff8e8]" />
      <div className="pointer-events-none absolute bottom-5 right-5 h-4 w-4 rounded-full border border-[#c9a54c] bg-[#fff8e8]" />
    </div>
  );
}

function KeyWords({ words }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {words.map((item) => (
        <div key={item.word} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p
            dir="rtl"
            className="text-2xl font-black text-slate-950"
            style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Scheherazade New', serif" }}
          >
            {item.word}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-600">{item.meaning}</p>
        </div>
      ))}
    </div>
  );
}

function Progress({ current, total }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        <span>Beginner Tafsir</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-[#0f766e] transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function IntroScreen() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-center">
        <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">
          Separate module
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-6xl">Surah Al-Fatiha: Beginner Tafsir</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          A clean, beginner-safe tafsir lesson that explains one idea, then checks it immediately.
        </p>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-black text-slate-950">Deany lesson rhythm</p>
          <p className="mt-2 leading-7 text-slate-600">
            Learn one piece. Answer a quick check. Get feedback. Continue whether you were right or wrong.
          </p>
        </div>
      </div>
      <MushafAyahBlock ayah={ayahs[0]} />
    </div>
  );
}

function StructureScreen() {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0f766e]">Whole-surah map</p>
      <h2 className="mt-3 text-4xl font-black text-slate-950">The simple structure of Al-Fatiha</h2>
      <p className="mt-3 max-w-3xl text-slate-600">
        Start with a tiny map, then immediately test the map before going ayah by ayah.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {structureCards.map((card, index) => (
          <div
            key={card.title}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
              {index + 1}
            </div>
            <h3 className="text-2xl font-black text-slate-950">{card.title}</h3>
            <p className="mt-1 text-sm font-bold text-[#0f766e]">{card.ayahs}</p>
            <p className="mt-3 leading-7 text-slate-600">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AyahScreen({ ayah }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <MushafAyahBlock ayah={ayah} />
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0f766e]">Learn this piece</p>
        <h2 className="mt-3 text-4xl font-black text-slate-950">{ayah.label}</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Beginner meaning</p>
            <p className="mt-2 leading-8 text-slate-700">{ayah.beginnerMeaning}</p>
          </div>
          <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Scholar note: Ibn Kathir</p>
            <p className="mt-2 leading-8 text-[#134e4a]">{ayah.ibnKathirNote}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">Memory hook</p>
            <p className="mt-2 leading-8 text-white">{ayah.memoryHook}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:col-span-2 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Key words</p>
          <KeyWords words={ayah.keyWords} />
        </Card>
        <Card className="bg-gradient-to-br from-white to-teal-50">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Reflection</p>
          <p className="mt-4 text-2xl font-black leading-9 text-slate-950">{ayah.reflection}</p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Next screen checks this exact idea, so the learner is not waiting until the end to retrieve it.
          </p>
        </Card>
      </div>
    </div>
  );
}

function SortScreen({ sorted, setSorted, firstSortCorrect, setFirstSortCorrect }) {
  const correct = ["Praise and recognition", "Direct worship", "The central request"];
  const options = ["The central request", "Praise and recognition", "Direct worship"];
  const isComplete = sorted.length === 3;
  const isCorrect = isComplete && sorted.every((item, index) => item === correct[index]);

  function pick(option) {
    if (sorted.includes(option)) return;
    const nextSorted = [...sorted, option];
    setSorted(nextSorted);
    if (nextSorted.length === 3 && firstSortCorrect === null) {
      setFirstSortCorrect(nextSorted.every((item, index) => item === correct[index]));
    }
  }

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0f766e]">Immediate check</p>
      <h2 className="mt-3 text-4xl font-black text-slate-950">Put the surah map in order</h2>
      <p className="mt-3 max-w-3xl text-slate-600">
        This comes straight after the map. The learner can get it wrong and still continue after feedback.
      </p>

      <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-sm font-black text-slate-700">Your order</p>
        <div className="flex min-h-[72px] flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          {sorted.length === 0 ? (
            <span className="text-sm font-semibold text-slate-500">Tap the cards below</span>
          ) : (
            sorted.map((item) => (
              <span key={item} className="rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-black text-[#0f766e]">
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {options.map((option) => (
          <Button key={option} variant="secondary" disabled={sorted.includes(option)} onClick={() => pick(option)}>
            {option}
          </Button>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            setSorted([]);
            setFirstSortCorrect(null);
          }}
        >
          Try again
        </Button>
      </div>

      {isComplete && (
        <div className={`mt-5 rounded-3xl border p-5 font-bold ${isCorrect ? "border-teal-100 bg-teal-50 text-[#134e4a]" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          {isCorrect
            ? "Correct. Al-Fatiha moves from praise and recognition, to direct worship, to the central request for guidance."
            : "Not quite, and that's okay. The correct flow is: praise and recognition, then direct worship, then the central request for guidance."}
          <p className="mt-3 text-sm font-semibold opacity-80">You can continue now. This first attempt is what counts for the end score.</p>
        </div>
      )}
    </div>
  );
}

function AssessmentScreen({ item, itemId, selected, firstAnswer, onSelect }) {
  const shuffledOptions = useMemo(() => seededShuffle(item.options, `${itemId}:${MODULE_ID}`), [item, itemId]);
  const selectedOption = selected ? item.options.find((option) => option.text === selected) : null;
  const firstSelectedOption = firstAnswer ? item.options.find((option) => option.text === firstAnswer) : null;
  const isCorrect = Boolean(selectedOption && selectedOption.correct);
  const firstAttemptWasWrong = Boolean(firstSelectedOption && !firstSelectedOption.correct);
  const label = item.type === "scenario" ? "Scenario" : item.type === "meaning-match" ? "Meaning match" : "Quick check";

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0f766e]">{label}</p>
      <h2 className="mt-3 text-4xl font-black text-slate-950">{item.title}</h2>

      {item.scenario && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Scenario</p>
          <p className="mt-2 text-lg font-bold leading-8 text-slate-800">{item.scenario}</p>
        </div>
      )}

      {item.cue && (
        <div className="mt-6 rounded-3xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Meaning cue</p>
          <p className="mt-2 text-2xl font-black leading-9 text-[#134e4a]">“{item.cue}”</p>
        </div>
      )}

      <h3 className="mt-6 text-2xl font-black text-slate-950">{item.question}</h3>
      <p className="mt-2 max-w-3xl text-slate-600">
        Pick an answer. If you get it wrong, you still get feedback and can continue.
      </p>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {shuffledOptions.map((option) => {
          const isSelected = selected === option.text;
          const selectedStyle = option.correct
            ? "border-[#0f766e] bg-teal-50 ring-2 ring-teal-100"
            : "border-rose-300 bg-rose-50 ring-2 ring-rose-100";

          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSelect(option.text)}
              className={`rounded-3xl border p-5 text-left font-black leading-7 shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-md focus:ring-4 ${
                isSelected ? selectedStyle : "border-slate-200 bg-white hover:bg-slate-50 focus:ring-teal-100"
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div className={`mt-6 rounded-3xl border p-5 shadow-sm ${isCorrect ? "border-teal-100 bg-teal-50" : "border-rose-200 bg-rose-50"}`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${isCorrect ? "bg-[#0f766e] text-white" : "bg-rose-600 text-white"}`}>
              {isCorrect ? "✓" : "!"}
            </div>
            <div>
              <p className={`text-sm font-black uppercase tracking-[0.16em] ${isCorrect ? "text-[#0f766e]" : "text-rose-700"}`}>
                {isCorrect ? "Correct" : "Not quite"}
              </p>
              <p className={`mt-2 leading-8 ${isCorrect ? "text-[#134e4a]" : "text-rose-800"}`}>{selectedOption.explanation}</p>
              {!isCorrect && (
                <p className="mt-3 text-sm font-bold leading-6 text-rose-700">
                  You can continue with this as a miss, or tap another option to learn the distinction.
                </p>
              )}
              {firstAttemptWasWrong && isCorrect && (
                <p className="mt-3 text-sm font-bold leading-6 text-[#0f766e]">
                  Nice correction. The first attempt still counts as a miss, but the learning is the point.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompleteScreen({ score, total, onRestart }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0f766e]">Lesson complete</p>
        <h2 className="mt-3 text-5xl font-black text-slate-950">Beginner tafsir complete</h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          The learner learnt each idea and was tested soon after it appeared.
        </p>
        <div className="mt-6 rounded-3xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-lg font-black text-[#134e4a]">First-attempt score: {score} / {total}</p>
          <p className="mt-2 leading-7 text-[#134e4a]">
            This score is honest because wrong answers were allowed. It can feed review, spacing, or a weaker-area recap.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onRestart} variant="secondary">Restart tafsir</Button>
          <Button variant="primary">Continue to next module</Button>
        </div>
      </div>
      <Card className="bg-slate-950 text-white">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-200">What they should remember</p>
        <div className="mt-5 space-y-4">
          {[
            "Al-Fatiha begins with Allah's name, mercy, praise, and lordship.",
            "The surah balances mercy with accountability.",
            "Ayah 5 is the direct turn to Allah: worship and help.",
            "The central request is guidance to the straight path.",
            "The ending is a humble dua for protection from wrong paths.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-semibold leading-6">{item}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function DeanyFatihaTafsirBeginnerIbnKathir({ onBack, onHome }) {
  const [state, setState] = useState(getSavedState);
  const step = lessonFlow[state.index] || lessonFlow[0];
  const currentAyah = step.type === "ayah" ? ayahs.find((ayah) => ayah.id === step.id) : null;
  const assessment = step.type === "assessment" ? assessmentItems[step.id] : null;

  const totalAssessments = Object.keys(assessmentItems).length;

  const assessmentScore = useMemo(() => {
    let score = state.firstSortCorrect === true ? 1 : 0;

    Object.entries(assessmentItems).forEach(([id, item]) => {
      if (item.type === "sort") return;
      const selectedText = state.firstAnswers[id];
      const selectedOption = item.options.find((option) => option.text === selectedText);
      if (selectedOption && selectedOption.correct) score += 1;
    });

    return score;
  }, [state.firstAnswers, state.firstSortCorrect]);

  function update(patch) {
    const next = { ...state, ...patch };
    setState(next);
    saveState(next);
  }

  function next() {
    if (state.index < lessonFlow.length - 1) update({ index: state.index + 1 });
    else update({ completed: true });
  }

  function back() {
    if (state.index > 0) update({ index: state.index - 1 });
  }

  function restart() {
    const fresh = getFreshState();
    setState(fresh);
    saveState(fresh);
  }

  function selectAnswer(answer) {
    const alreadyHasFirstAnswer = Boolean(state.firstAnswers[step.id]);
    update({
      answers: { ...state.answers, [step.id]: answer },
      firstAnswers: alreadyHasFirstAnswer ? state.firstAnswers : { ...state.firstAnswers, [step.id]: answer },
    });
  }

  const selectedAssessmentOption = assessment
    ? assessment.options.find((option) => option.text === state.answers[step.id])
    : null;
  const assessmentAnswered = assessment ? Boolean(selectedAssessmentOption) : true;
  const sortComplete = step.type !== "sort" || state.sorted.length === 3;
  const canContinue = step.type === "assessment" ? assessmentAnswered : step.type === "sort" ? sortComplete : true;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfeff_0,#f8fafc_35%,#eef2ff_100%)] p-6 text-slate-950">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&display=swap');`}</style>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Progress current={state.index} total={lessonFlow.length} />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[#0f766e]">Deany · Tafsir Module · Lesson 1</p>
            <h1 className="text-3xl font-black text-slate-950">Surah Al-Fatiha with Ibn Kathir</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-black text-[#0f766e] shadow-sm">
              Beginner
            </div>
            <Button variant="secondary" onClick={restart}>Reset</Button>
          </div>
        </div>

        <Card className="min-h-[620px] bg-white/90 backdrop-blur">
          {step.type === "intro" && <IntroScreen />}
          {step.type === "structure" && <StructureScreen />}
          {step.type === "sort" && (
            <SortScreen
              sorted={state.sorted}
              firstSortCorrect={state.firstSortCorrect}
              setSorted={(sorted) => update({ sorted })}
              setFirstSortCorrect={(value) => update({ firstSortCorrect: value })}
            />
          )}
          {step.type === "ayah" && currentAyah && <AyahScreen ayah={currentAyah} />}
          {step.type === "assessment" && assessment && (
            <AssessmentScreen
              item={assessment}
              itemId={step.id}
              selected={state.answers[step.id]}
              firstAnswer={state.firstAnswers[step.id]}
              onSelect={selectAnswer}
            />
          )}
          {step.type === "complete" && (
            <CompleteScreen score={assessmentScore} total={totalAssessments} onRestart={restart} />
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <Button variant="secondary" onClick={back} disabled={state.index === 0}>Back</Button>
            <div className="text-sm font-semibold text-slate-500">
              {step.type === "assessment" && !assessmentAnswered ? "Pick an answer to unlock Continue." : null}
              {step.type === "sort" && !sortComplete ? "Complete the order to unlock Continue. It does not need to be correct." : null}
            </div>
            <Button variant={step.type === "complete" ? "soft" : "primary"} onClick={next} disabled={!canContinue}>
              {step.type === "complete" ? "Finish" : "Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
