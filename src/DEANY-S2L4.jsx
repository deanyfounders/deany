import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DEANY Module S2 Lesson 4: "The Words That Rise"
   Ship-ready JSX lesson: core salah recitations, tashahhud,
   salawat, and Surah al-Fatihah's meaning structure.
   Learner-facing content stays beginner-friendly and concise.
   Quran translation: Saheeh International.
   ═══════════════════════════════════════════════════════════════ */

const T = {
  navy: "#1B2A4A", navyDeep: "#0F1A2E",
  gold: "#C5A55A", goldLight: "#F5EDD6", goldPale: "#FBF6EC",
  teal: "#2A7B88", tealLight: "#E0F2F4", tealDeep: "#1D5A64",
  coral: "#D4654A", coralLight: "#FDEAE5",
  green: "#3A8B5C", greenLight: "#E5F5EC",
  purple: "#6B4C9A", magenta: "#A855A0",
  grayDark: "#3D3D3D", grayMed: "#6B6B6B", grayLight: "#F2F2F2",
  cream: "#FDFBF7", white: "#FFFFFF",
};
const F = { display: "'Playfair Display', Georgia, serif", body: "'Source Serif 4', Georgia, serif", ui: "'DM Sans', sans-serif", ar: "'Amiri', serif" };

/* ─── RECITATION MAP DATA ─── */
const RECITATIONS = [
  {
    id: 0,
    pos: "Qiyam",
    posEn: "Standing",
    emoji: "🧍",
    accent: T.teal,
    bg: T.tealLight,
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah is the Greatest",
    note: "The opening takbir (Takbirat al-Ihram) begins the prayer. In a normal solo prayer, you then recite al-Fatihah, followed by another surah in the first two rak'at.",
  },
  {
    id: 1,
    pos: "Rukuʿ",
    posEn: "Bowing",
    emoji: "🙇",
    accent: T.purple,
    bg: "#F3EEFF",
    arabic: "سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ",
    transliteration: "Subhana Rabbiyal-ʿAdheem",
    meaning: "Glory be to my Lord, the Most Great",
    note: "Commonly repeated three times while bowing. Notice the word 'Great' (ʿAdheem): said while you make yourself small in bowing.",
  },
  {
    id: 2,
    pos: "Iʿtidal",
    posEn: "Rising from rukuʿ",
    emoji: "🧍",
    accent: T.teal,
    bg: T.tealLight,
    arabic: "سَمِعَ ٱللَّٰهُ لِمَنْ حَمِدَهُ",
    transliteration: "Samiʿallahu liman hamidah",
    meaning: "Allah hears the one who praises Him",
    note: "Said once while rising. Then in the standing position you may add: 'Rabbana wa lakal-hamd' (Our Lord, all praise belongs to You).",
  },
  {
    id: 3,
    pos: "Sujud",
    posEn: "Prostration",
    emoji: "🧎",
    accent: T.gold,
    bg: T.goldPale,
    arabic: "سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ",
    transliteration: "Subhana Rabbiyal-Aʿla",
    meaning: "Glory be to my Lord, the Most High",
    note: "Commonly repeated three times in each prostration. The word 'Most High' (Aʿla) is said at the lowest physical position. Beautiful contrast.",
  },
  {
    id: 4,
    pos: "Final Sitting",
    posEn: "Tashahhud",
    emoji: "🧎‍♂️",
    accent: T.teal,
    bg: T.tealLight,
    arabic: "ٱلتَّحِيَّاتُ لِلَّٰهِ",
    transliteration: "At-tahiyyatu lillah...",
    meaning: "All greetings, prayers, and good deeds belong to Allah",
    note: "The tashahhud is the declaration of faith said while seated. A dedicated page in this lesson breaks it down before you learn the salam.",
  },
  {
    id: 5,
    pos: "Taslim",
    posEn: "Salam (ending)",
    emoji: "👋",
    accent: T.gold,
    bg: T.goldPale,
    arabic: "ٱلسَّلَامُ عَلَيْكُمْ",
    transliteration: "As-salamu ʿalaykum",
    meaning: "Peace be upon you",
    note: "Said to end the prayer, turning out of salah with peace. Some communities are taught one taslim, others two; follow the wording your teacher has shown you.",
  },
];

/* ─── FATIHAH STRUCTURE (3 movements) ─── */
const FATIHAH = [
  {
    movement: "Praise",
    color: T.teal,
    icon: "✨",
    ayat: [
      { ar: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { ar: "ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَالَمِينَ", en: "All praise is due to Allah, Lord of the worlds." },
      { ar: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "The Entirely Merciful, the Especially Merciful." },
      { ar: "مَالِكِ يَوْمِ ٱلدِّينِ", en: "Sovereign of the Day of Recompense." },
    ],
    explainer: "The first part is pure praise. You begin every rak'ah by acknowledging who Allah is: Merciful, Lord of all worlds, the Sovereign of judgement. Praise comes before any request.",
  },
  {
    movement: "Declaration",
    color: T.gold,
    icon: "🤲",
    ayat: [
      { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "It is You we worship and You we ask for help." },
    ],
    explainer: "The middle is the turning point. After acknowledging Allah, you declare your relationship with Him: I worship You, and only You. I ask You for help, and only You. This single ayah is the heart of the surah.",
  },
  {
    movement: "Duʿaʾ",
    color: T.purple,
    icon: "🙏",
    ayat: [
      { ar: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", en: "Guide us to the straight path." },
      { ar: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", en: "The path of those upon whom You have bestowed favour, not of those who have evoked anger or of those who are astray." },
    ],
    explainer: "The final part is your request. Of all the things you could ask for, what does Allah teach you to ask? Guidance. The straight path. This is what you need most, and you ask for it 17+ times every day.",
  },
];


/* ─── TASHAHHUD TEACHING DATA ─── */
const TASHAHHUD_PARTS = [
  {
    id: "greetings",
    label: "Belonging",
    short: "All worshipful greetings belong to Allah.",
    arabic: "ٱلتَّحِيَّاتُ لِلَّٰهِ وَٱلصَّلَوَاتُ وَٱلطَّيِّبَاتُ",
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat",
    meaning: "All greetings, prayers, and pure good words belong to Allah.",
    note: "You begin the sitting by returning every form of honour and worship back to Allah.",
  },
  {
    id: "prophet",
    label: "Greeting the Prophet ﷺ",
    short: "Peace upon the Prophet ﷺ.",
    arabic: "ٱلسَّلَامُ عَلَيْكَ أَيُّهَا ٱلنَّبِيُّ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ",
    transliteration: "As-salamu ʿalayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh",
    meaning: "Peace be upon you, O Prophet, and Allah's mercy and blessings.",
    note: "You send peace upon the one who taught us how to pray.",
  },
  {
    id: "believers",
    label: "Joining the believers",
    short: "Peace for us and the righteous servants.",
    arabic: "ٱلسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ ٱللَّٰهِ ٱلصَّالِحِينَ",
    transliteration: "As-salamu ʿalayna wa ʿala ʿibadillahiṣ-ṣalihin",
    meaning: "Peace be upon us and upon Allah's righteous servants.",
    note: "Your prayer is personal, but you are never alone. You include the righteous servants of Allah.",
  },
  {
    id: "testimony",
    label: "The testimony",
    short: "I testify to Allah and His Messenger ﷺ.",
    arabic: "أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "Ashhadu an la ilaha illa Allah, wa ashhadu anna Muhammadan ʿabduhu wa rasuluh",
    meaning: "I testify that there is no god but Allah, and I testify that Muhammad is His servant and Messenger.",
    note: "This is the centre of the tashahhud: tawhid and the messengership of the Prophet ﷺ.",
  },
];

const SALAWAT_PARTS = [
  {
    id: "salah",
    arabic: "ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allahumma ṣalli ʿala Muhammad wa ʿala ali Muhammad, kama ṣallayta ʿala Ibrahim wa ʿala ali Ibrahim, innaka hamidun majid",
    meaning: "O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.",
  },
  {
    id: "barakah",
    arabic: "ٱللَّٰهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allahumma barik ʿala Muhammad wa ʿala ali Muhammad, kama barakta ʿala Ibrahim wa ʿala ali Ibrahim, innaka hamidun majid",
    meaning: "O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.",
  },
];

const TASHAHHUD_ORDER = ["greetings", "prophet", "believers", "testimony"];

/* ─── Q1: MC ─── */
const Q1 = {
  prompt: "Which surah must be recited in every single rak'ah of every prayer?",
  options: [
    { id: "A", text: "Surah al-Ikhlas", correct: false, fb: "Al-Ikhlas is a beautiful surah, but it is not required in every rak'ah. Only al-Fatihah holds that status." },
    { id: "B", text: "Surah al-Fatihah", correct: true, fb: "Correct. Al-Fatihah is called 'The Opening' because it opens every rak'ah. The Prophet ﷺ said there is no prayer without it." },
    { id: "C", text: "Surah al-Nas", correct: false, fb: "Al-Nas is the final surah of the Quran and is often recited for protection, but it is not required in every rak'ah." },
    { id: "D", text: "Any surah of your choice", correct: false, fb: "After al-Fatihah you can choose another surah, but al-Fatihah itself is fixed and required." },
  ],
};

/* ─── Q2: MATCH PAIRS (drag/tap) ─── */
const Q2_PAIRS = [
  { left: "Rukuʿ (bowing)", right: "Subhana Rabbiyal-ʿAdheem", leftId: 0, fb: "While bowing, you say 'Glory to my Lord, the Most Great.'" },
  { left: "Sujud (prostration)", right: "Subhana Rabbiyal-Aʿla", leftId: 1, fb: "At the lowest position, you praise the Most High." },
  { left: "Rising from rukuʿ", right: "Samiʿallahu liman hamidah", leftId: 2, fb: "Said as you stand back up: 'Allah hears the one who praises Him.'" },
  { left: "Beginning the prayer", right: "Allahu Akbar", leftId: 3, fb: "The opening takbir. Nothing before it counts as part of the prayer." },
  { left: "Final sitting", right: "At-tahiyyatu lillah...", leftId: 4, fb: "The tashahhud is said while seated before the salam." },
  { left: "Ending the prayer", right: "As-salamu ʿalaykum", leftId: 5, fb: "Saying salam ends the prayer." },
];

/* ─── Q3: FILL IN THE BLANK (visual word-pick) ─── */
const Q3_BLANKS = [
  {
    pos: "Rukuʿ",
    posEn: "Bowing",
    emoji: "🙇",
    accent: T.purple,
    bg: "#F3EEFF",
    arabicPrefix: "سُبْحَانَ رَبِّيَ",
    transliterationPrefix: "Subhana Rabbiyal-",
    correct: "ʿAdheem",
    correctAr: "ٱلْعَظِيمِ",
    correctMeaning: "the Most Great",
    options: [
      { word: "ʿAdheem", ar: "ٱلْعَظِيمِ", meaning: "the Most Great" },
      { word: "Aʿla", ar: "ٱلْأَعْلَىٰ", meaning: "the Most High" },
      { word: "Akbar", ar: "أَكْبَرُ", meaning: "is Greatest" },
      { word: "Hamid", ar: "ٱلْحَمِيدُ", meaning: "the Praiseworthy" },
    ],
  },
  {
    pos: "Sujud",
    posEn: "Prostration",
    emoji: "🧎",
    accent: T.gold,
    bg: T.goldPale,
    arabicPrefix: "سُبْحَانَ رَبِّيَ",
    transliterationPrefix: "Subhana Rabbiyal-",
    correct: "Aʿla",
    correctAr: "ٱلْأَعْلَىٰ",
    correctMeaning: "the Most High",
    options: [
      { word: "ʿAdheem", ar: "ٱلْعَظِيمِ", meaning: "the Most Great" },
      { word: "Aʿla", ar: "ٱلْأَعْلَىٰ", meaning: "the Most High" },
      { word: "Akbar", ar: "أَكْبَرُ", meaning: "is Greatest" },
      { word: "Hamid", ar: "ٱلْحَمِيدُ", meaning: "the Praiseworthy" },
    ],
  },
];

/* ─── Q4: SWIPE (FATIHAH MEANINGS) ─── */
const Q4_CARDS = [
  { text: "Lord of all the worlds", inFatihah: true, fb: "Yes - in the second ayah: 'All praise is due to Allah, Lord of the worlds.'" },
  { text: "Forgiver of all sins", inFatihah: false, fb: "A true attribute of Allah, but it is not what al-Fatihah specifically says." },
  { text: "Guide us to the straight path", inFatihah: true, fb: "Yes - the central duʿaʾ of the surah." },
  { text: "It is You we worship and You we ask for help", inFatihah: true, fb: "Yes - the heart of the surah, the declaration." },
  { text: "Creator of the heavens and earth", inFatihah: false, fb: "True about Allah, but al-Fatihah uses 'Lord of the worlds' rather than this specific phrase." },
  { text: "Sovereign of the Day of Recompense", inFatihah: true, fb: "Yes - the fourth ayah, acknowledging Allah's authority over the Day of Judgement." },
];

/* ─── Q5: T/F + JUSTIFICATION ─── */
const Q5_STATEMENT = "Praise of Allah comes before any request in al-Fatihah.";
const Q5_ANSWER = true;
const Q5_MODEL = "True. Al-Fatihah opens with four ayat of pure praise (Allah's mercy, His lordship, His sovereignty) before the request for guidance. This teaches that we approach Allah with praise first, then ask.";

/* ─── Q6: MC SCENARIO ─── */
const Q6_SCENARIO = {
  prompt: "Sarah is praying ʿAsr. She finishes al-Fatihah in the first rak'ah. What should she do next, before going into rukuʿ?",
  options: [
    { id: "A", text: "Go straight into rukuʿ.", correct: false, fb: "After al-Fatihah in the first two rak'at of an obligatory prayer, the recommended (sunnah) practice is to recite another surah before bowing." },
    { id: "B", text: "Recite another surah, then go into rukuʿ.", correct: true, fb: "Correct. After al-Fatihah, you recite another surah (or some verses) before bowing. This is in the first two rak'at of every obligatory prayer." },
    { id: "C", text: "Repeat al-Fatihah a second time.", correct: false, fb: "Al-Fatihah is recited once per rak'ah. Repeating it is not part of the prayer's structure." },
    { id: "D", text: "Make a long duʿaʾ in English.", correct: false, fb: "Personal duʿaʾ is beautiful but happens at specific points in salah, not between al-Fatihah and rukuʿ. After al-Fatihah, recite another surah." },
  ],
};

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

const LESSON_STORAGE_KEY = "deany_s2_lesson4_words_that_rise_ship_ready_v1";
const EMPTY_SCORES = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 };

function loadSavedLessonState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LESSON_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      page: Number.isFinite(parsed.page) ? parsed.page : 0,
      scores: { ...EMPTY_SCORES, ...(parsed.scores || {}) },
      completed: Boolean(parsed.completed),
    };
  } catch {
    return null;
  }
}


/* ═══ MAIN APP ═══ */
export default function DEANYS2L4({ onBack, onHome, onGoToHifz }) {
  const saved = useMemo(() => loadSavedLessonState(), []);
  const totalPages = 13;
  const [page, setPage] = useState(() => Math.min(Math.max(saved?.page ?? 0, 0), totalPages - 1));
  const [scores, setScores] = useState(() => saved?.scores || EMPTY_SCORES);
  const [completed, setCompleted] = useState(() => Boolean(saved?.completed));
  const [rm, setRm] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event) => setRm(event.matches);
    setRm(m.matches);
    if (m.addEventListener) m.addEventListener("change", update);
    else if (m.addListener) m.addListener(update);
    return () => {
      if (m.removeEventListener) m.removeEventListener("change", update);
      else if (m.removeListener) m.removeListener(update);
    };
  }, []);

  const go = useCallback((p) => {
    const nextPage = Math.min(Math.max(p, 0), totalPages - 1);
    setPage(nextPage);
    if (ref.current) ref.current.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" });
    else if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
  }, [rm, totalPages]);
  const nx = useCallback(() => go(page + 1), [page, go]);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify({ page, scores, completed }));
    } catch {}
  }, [page, scores, completed]);

  const prog = Math.min(100, Math.round(((page + 1) / totalPages) * 100));

  const pages = [
    <PBridge key={0} nx={nx} rm={rm} />,
    <PRecitationMap key={1} nx={nx} rm={rm} />,
    <PTashahhudTeach key={2} nx={nx} rm={rm} />,
    <PQ1MC key={3} done={s => { setScores(p => ({ ...p, q1: s })); nx(); }} rm={rm} />,
    <PQ2Match key={4} done={s => { setScores(p => ({ ...p, q2: s })); nx(); }} rm={rm} />,
    <PQ3Fill key={5} done={s => { setScores(p => ({ ...p, q3: s })); nx(); }} rm={rm} />,
    <PFatihahTeach key={6} nx={nx} rm={rm} />,
    <PQ4Swipe key={7} done={s => { setScores(p => ({ ...p, q4: s })); nx(); }} rm={rm} />,
    <PQ5TF key={8} done={s => { setScores(p => ({ ...p, q5: s })); nx(); }} rm={rm} />,
    <PFatihahStructure key={9} nx={nx} rm={rm} />,
    <PQ6MC key={10} done={s => { setScores(p => ({ ...p, q6: s })); nx(); }} rm={rm} />,
    <PTakeaway key={11} nx={nx} />,
    <PCheckpoint key={12} scores={scores} total={totalScore} rm={rm} onReview={() => go(0)} onComplete={() => setCompleted(true)} onGoToHifz={onGoToHifz} />,
  ];

  return (
    <div ref={ref} style={{ minHeight: "100vh", background: T.cream, position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, opacity: .025, pointerEvents: "none", background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C5A55A' stroke-width='.5'/%3E%3C/svg%3E")` }} />
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: T.cream + "ee", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid " + T.gold + "22" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          {onBack && <button type="button" onClick={onBack} aria-label="Back to lessons" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 2px", display: "flex", alignItems: "center", color: T.grayMed }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>}
          <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: 2 }}>S2.4</span>
          <div style={{ flex: 1, background: T.gold + "18", borderRadius: 20, height: 5, overflow: "hidden" }}>
            <div role="progressbar" aria-valuenow={prog} aria-valuemin={0} aria-valuemax={100} style={{ height: "100%", background: "linear-gradient(90deg," + T.gold + "," + T.teal + ")", borderRadius: 20, width: prog + "%", transition: rm ? "none" : "width .5s ease" }} />
          </div>
          {completed && <span style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.green, background: T.greenLight, padding: "3px 8px", borderRadius: 20 }}>DONE</span>}
          <span style={{ fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>{page + 1}/{totalPages}</span>
        </div>
      </div>
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "20px 18px 100px", minHeight: "calc(100vh - 46px)" }}>
        <div key={page} style={{ animation: rm ? "none" : "dFadeUp .35s ease" }}>{pages[page]}</div>
      </div>
      <style>{`
        @keyframes dFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dSlide{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
        @keyframes dShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes dConfetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(260px) rotate(400deg);opacity:0}}
        @keyframes dPop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
        @keyframes dShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes dPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        *{box-sizing:border-box}input[type=range]{accent-color:${T.gold}}
      `}</style>
    </div>
  );
}

/* ─── SHARED ─── */
const Btn = ({ children, onClick, v = "gold", style: s, disabled: d, ...r }) => { const vs = { gold: { background: "linear-gradient(135deg," + T.gold + ",#D4B56A)", color: T.navy, boxShadow: "0 4px 16px " + T.gold + "44", border: "none" }, teal: { background: T.tealLight, color: T.teal, border: "1.5px solid " + T.teal }, ghost: { background: "transparent", color: T.navy, border: "1.5px solid " + T.gold } }; return <button disabled={d} onClick={onClick} style={{ borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 700, fontFamily: F.ui, cursor: d ? "default" : "pointer", transition: "all .2s", opacity: d ? .5 : 1, ...vs[v], ...s }} {...r}>{children}</button>; };
const Box = ({ color: c, bg, children, style: s }) => <div style={{ border: "2px solid " + c, background: bg, borderRadius: 16, padding: "20px 24px", margin: "18px 0", position: "relative", overflow: "hidden", ...s }}>{children}</div>;
const Tag = ({ children, c, bg }) => <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: bg || c, color: bg ? c : "#fff", letterSpacing: .5 }}>{children}</span>;
const SL = ({ icon, text, color: c }) => <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: c, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{icon} {text}</div>;
const PT = ({ sub, title, accent }) => <div style={{ marginBottom: 24 }}>{sub && <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 600, color: accent || T.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{sub}</div>}<h2 style={{ fontFamily: F.display, fontSize: 26, fontWeight: 700, color: T.navy, margin: 0, lineHeight: 1.3 }}>{title}</h2></div>;
const Pr = ({ children }) => <p style={{ fontFamily: F.body, fontSize: 15.5, lineHeight: 1.8, color: T.grayDark, margin: "0 0 14px" }}>{children}</p>;

const ArabicText = ({ children, size = 24, color = T.navy }) => (
  <div dir="rtl" lang="ar" style={{ fontFamily: F.ar, fontSize: size, color, lineHeight: 1.9, fontWeight: 400, letterSpacing: 0.5 }}>
    {children}
  </div>
);

/* ═══ P0: BRIDGE ═══ */
function PBridge({ nx }) {
  return <div>
    <div style={{ background: "linear-gradient(135deg," + T.navy + "," + T.navyDeep + ")", borderRadius: 24, padding: "48px 28px 40px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .08, background: "radial-gradient(circle at 80% 20%," + T.teal + ",transparent 50%),radial-gradient(circle at 20% 80%," + T.gold + ",transparent 50%)" }} />
      {/* Decorative Arabic in background */}
      <div dir="rtl" lang="ar" aria-hidden="true" style={{ position: "absolute", top: 14, right: 18, fontFamily: F.ar, fontSize: 38, color: T.gold, opacity: .12 }}>الكلمات</div>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, color: T.gold, letterSpacing: 3 }}>LESSON S2.4</div>
        <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 900, color: "#fff", margin: "8px 0", lineHeight: 1.2 }}>"The Words That Rise"</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontFamily: F.ui, fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 14 }}>
          <span>13 min</span><span>6 questions</span><span>Level 2-4</span>
        </div>
      </div>
    </div>
    <Box color={T.teal} bg={T.tealLight}><SL icon="🔗" text="Bridge" color={T.teal} />
      <Pr>You learned the body of prayer in Lesson 3. The standing, the bowing, the prostrating. But salah is not silent.</Pr>
      <Pr>At every position your lips move with words. Words that have travelled across centuries. Words that mean something specific. <strong style={{ color: T.navy }}>Today you learn what those words are, and what they mean.</strong></Pr>
    </Box>
    <Box color={T.gold} bg={T.goldLight}><SL icon="🎯" text="Goal of this lesson" color={T.gold} />
      <div style={{ fontFamily: F.body, fontSize: 14.5, color: T.grayDark }}>
        <p style={{ margin: "0 0 4px", fontWeight: 600, color: T.navy }}>By the end, you will be able to:</p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
          <li>Name the core recitation at each prayer position.</li>
          <li>Break down the tashahhud and salawat in the final sitting.</li>
          <li>Recite Surah al-Fatihah's structure: praise, declaration, duʿaʾ.</li>
        </ol>
      </div>
    </Box>
    <div style={{ textAlign: "center", marginTop: 28 }}><Btn onClick={nx}>Begin</Btn></div>
  </div>;
}

/* ═══ P1: RECITATION MAP - INTERACTIVE FIGURE WITH SPEECH BUBBLE ═══ */
function PRecitationMap({ nx, rm }) {
  const [active, setActive] = useState(0);
  const r = RECITATIONS[active];

  return <div>
    <PT sub="Section A" title="The Recitation Map" />
    <Pr>Each position has a specific phrase. Tap each one to see what is said and what it means.</Pr>

    {/* Main display: position + speech bubble */}
    <div key={active} style={{
      background: "#fff",
      border: "2px solid " + r.accent + "33",
      borderRadius: 24,
      overflow: "hidden",
      marginBottom: 18,
      boxShadow: "0 8px 30px " + r.accent + "12",
      animation: rm ? "none" : "dFadeUp .35s ease",
    }}>
      {/* Top: position visual */}
      <div style={{ background: "linear-gradient(135deg," + r.bg + ",#fff)", padding: "28px 24px 22px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: 14 }}><Tag c={r.accent} bg="#fff">{active + 1}/6</Tag></div>
        <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 10, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.08))" }}>{r.emoji}</div>
        <div style={{ fontFamily: F.display, fontSize: 26, fontWeight: 700, color: T.navy }}>{r.pos}</div>
        <div style={{ fontFamily: F.ui, fontSize: 12, color: r.accent, fontWeight: 600, letterSpacing: 1 }}>{r.posEn}</div>
      </div>

      {/* Speech bubble */}
      <div style={{ padding: "24px 22px" }}>
        <div style={{ position: "relative", background: r.bg, borderRadius: 18, padding: "22px 20px", marginBottom: 16, border: "2px solid " + r.accent + "22" }}>
          <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 24, height: 24, background: r.bg, borderLeft: "2px solid " + r.accent + "22", borderTop: "2px solid " + r.accent + "22" }} />
          <ArabicText size={28} color={r.accent}>{r.arabic}</ArabicText>
          <p style={{ fontFamily: F.body, fontSize: 15, fontStyle: "italic", color: T.grayDark, textAlign: "center", margin: "10px 0 0" }}>{r.transliteration}</p>
        </div>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1.5, marginBottom: 4 }}>MEANS</div>
          <div style={{ fontFamily: F.display, fontSize: 20, fontWeight: 700, color: T.navy }}>{r.meaning}</div>
        </div>
        <p style={{ fontFamily: F.body, fontSize: 13.5, lineHeight: 1.7, color: T.grayDark, background: T.cream, borderRadius: 12, padding: "12px 14px", margin: 0 }}>{r.note}</p>
      </div>
    </div>

    {/* Position selector */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 24 }}>
      {RECITATIONS.map((item, i) => <button key={item.id} onClick={() => setActive(i)} aria-label={"Show " + item.pos} style={{ background: active === i ? item.bg : "#fff", border: "2px solid " + (active === i ? item.accent : T.grayLight), borderRadius: 14, padding: "12px 8px", cursor: "pointer", transition: rm ? "none" : "all .15s", boxShadow: active === i ? "0 3px 10px " + item.accent + "33" : "none" }}>
        <div style={{ fontSize: 24, marginBottom: 4 }}>{item.emoji}</div>
        <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: active === i ? item.accent : T.grayMed }}>{item.pos}</div>
      </button>)}
    </div>

    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Learn the Tashahhud</Btn></div>
  </div>;
}

/* ═══ P2: TASHAHHUD TEACHING ═══ */
function PTashahhudTeach({ nx, rm }) {
  const [active, setActive] = useState(0);
  const [practice, setPractice] = useState([]);
  const [mistake, setMistake] = useState(false);
  const current = TASHAHHUD_PARTS[active];
  const practiceOptions = useMemo(() => shuffle(TASHAHHUD_PARTS), []);
  const nextNeeded = TASHAHHUD_ORDER[practice.length];
  const practiceDone = practice.length === TASHAHHUD_ORDER.length;

  const handlePractice = (id) => {
    if (practiceDone || practice.includes(id)) return;
    if (id === nextNeeded) {
      setPractice(p => [...p, id]);
      setMistake(false);
    } else {
      setMistake(true);
      setTimeout(() => setMistake(false), 900);
    }
  };

  return <div>
    <PT sub="Section A2" title="The Final Sitting: Tashahhud" />
    <Pr>In the final sitting, salah gathers its meaning into words: greetings for Allah, peace upon the Prophet ﷺ, peace for the righteous servants, then the testimony of faith.</Pr>

    <div style={{ background: "#fff", border: "2px solid " + T.teal + "33", borderRadius: 20, padding: "20px 18px", boxShadow: "0 8px 28px " + T.teal + "12", marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.teal, letterSpacing: 2 }}>TASHAHHUD PART {active + 1}</div>
          <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: T.navy }}>{current.label}</div>
        </div>
        <span style={{ fontSize: 28 }}>🧎</span>
      </div>
      <div style={{ background: T.tealLight, borderRadius: 16, padding: "18px 16px", marginBottom: 12 }}>
        <ArabicText size={22} color={T.teal}>{current.arabic}</ArabicText>
        <p style={{ fontFamily: F.body, fontSize: 13.5, color: T.grayDark, fontStyle: "italic", textAlign: "center", margin: "10px 0 0", lineHeight: 1.7 }}>{current.transliteration}</p>
      </div>
      <div style={{ fontFamily: F.display, fontSize: 18, color: T.navy, fontWeight: 700, lineHeight: 1.5, marginBottom: 8 }}>{current.meaning}</div>
      <p style={{ fontFamily: F.body, fontSize: 13.5, lineHeight: 1.7, color: T.grayDark, margin: 0 }}>{current.note}</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
      {TASHAHHUD_PARTS.map((part, i) => <button key={part.id} onClick={() => setActive(i)} aria-label={"Open tashahhud part " + (i + 1) + ": " + part.label} style={{ border: "2px solid " + (active === i ? T.teal : T.grayLight), background: active === i ? T.tealLight : "#fff", color: active === i ? T.teal : T.grayMed, borderRadius: 10, padding: "9px 4px", fontFamily: F.ui, fontSize: 10, fontWeight: 700, cursor: "pointer", transition: rm ? "none" : "all .15s" }}>{i + 1}</button>)}
    </div>

    <Box color={T.gold} bg={T.goldPale}>
      <SL icon="🌿" text="Then send salawat" color={T.gold} />
      <Pr>After the tashahhud in the final sitting, send blessings on the Prophet ﷺ. Learn it in two breathing chunks:</Pr>
      {SALAWAT_PARTS.map((part) => <div key={part.id} style={{ background: "#fff", border: "1.5px solid " + T.gold + "44", borderRadius: 14, padding: "14px 14px", marginTop: 10 }}>
        <ArabicText size={19} color={T.navy}>{part.arabic}</ArabicText>
        <p style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayDark, fontStyle: "italic", margin: "7px 0", lineHeight: 1.65 }}>{part.transliteration}</p>
        <p style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayDark, margin: 0, lineHeight: 1.65 }}>{part.meaning}</p>
      </div>)}
    </Box>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
      <Box color={T.teal} bg={T.tealLight} style={{ margin: 0, padding: 14 }}>
        <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.teal, marginBottom: 4 }}>MIDDLE SITTING</div>
        <p style={{ fontFamily: F.body, fontSize: 12.8, color: T.grayDark, lineHeight: 1.7, margin: 0 }}>In prayers longer than two rakʿat, you sit after the second rakʿah, say tashahhud, then stand for the next rakʿah.</p>
      </Box>
      <Box color={T.gold} bg={T.goldPale} style={{ margin: 0, padding: 14 }}>
        <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.gold, marginBottom: 4 }}>FINAL SITTING</div>
        <p style={{ fontFamily: F.body, fontSize: 12.8, color: T.grayDark, lineHeight: 1.7, margin: 0 }}>At the end of the prayer, sit for tashahhud, send salawat on the Prophet ﷺ, then end with salam.</p>
      </Box>
    </div>

    <Box color={T.purple} bg="#F3EEFF" style={{ animation: mistake && !rm ? "dShake .25s" : "none" }}>
      <SL icon="🧠" text="Mini practice" color={T.purple} />
      <Pr>Tap the tashahhud in order. The next part needed is highlighted by meaning.</Pr>
      <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.grayMed, marginBottom: 8 }}>NEXT: {practiceDone ? "Complete" : TASHAHHUD_PARTS.find(p => p.id === nextNeeded)?.short}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
        {practiceOptions.map((part) => {
          const done = practice.includes(part.id);
          const needed = part.id === nextNeeded;
          return <button key={part.id} disabled={done || practiceDone} onClick={() => handlePractice(part.id)} aria-label={"Choose tashahhud part: " + part.short} style={{ background: done ? T.greenLight : needed ? "#fff" : "#fff", border: "2px solid " + (done ? T.green : needed ? T.teal : T.grayLight), borderRadius: 12, padding: "12px 14px", textAlign: "left", cursor: done || practiceDone ? "default" : "pointer", opacity: done ? .65 : 1, transition: rm ? "none" : "all .15s" }}>
            <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 800, color: done ? T.green : needed ? T.teal : T.navy }}>{done ? "✓ " : ""}{part.label}</div>
            <div style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayDark, lineHeight: 1.6 }}>{part.short}</div>
          </button>;
        })}
      </div>
      {mistake && <p style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.coral, margin: "10px 0 0" }}>Not yet. Follow the meaning order shown above.</p>}
      {practiceDone && <p style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 800, color: T.green, margin: "12px 0 0" }}>✓ Tashahhud order locked in.</p>}
    </Box>

    <Box color={T.teal} bg={T.tealLight}>
      <Pr>Some communities teach slightly different authentic wordings of the tashahhud. For your own prayer, follow the wording taught by a qualified teacher you trust.</Pr>
    </Box>

    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Start the Questions</Btn></div>
  </div>;
}

/* ═══ P3: Q1 MC ═══ */
function PQ1MC({ done, rm }) {
  const [sel, setSel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = Q1.options.find(o => o.correct);
  const selected = sel ? Q1.options.find(o => o.id === sel) : null;
  const submit = () => { if (sel && !submitted) setSubmitted(true); };
  const handleContinue = () => done(selected?.correct ? 1 : 0);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 1" title="The Fixed Surah" /><Tag c="#fff" bg={T.teal}>MCQ</Tag></div>
    <Pr>{Q1.prompt}</Pr>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Q1.options.map(o => {
        const isSel = sel === o.id;
        let bc = T.grayLight, bg = "#fff", op = 1;
        if (submitted) { if (o.correct) { bc = T.green; bg = T.greenLight; } else if (isSel) { bc = T.coral; bg = T.coralLight; } else op = .5; }
        else if (isSel) { bc = T.teal; bg = T.tealLight; }
        return <button key={o.id} onClick={() => !submitted && setSel(o.id)} disabled={submitted} style={{ border: "2px solid " + bc, background: bg, borderRadius: 14, padding: "15px 18px", textAlign: "left", cursor: submitted ? "default" : "pointer", display: "flex", gap: 12, alignItems: "center", opacity: op, transition: rm ? "none" : "all .15s" }}>
          <span style={{ width: 28, height: 28, borderRadius: "50%", background: isSel || (submitted && o.correct) ? bc : T.grayLight, color: (isSel || (submitted && o.correct)) ? "#fff" : T.grayMed, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 13 }}>{o.id}</span>
          <span style={{ fontFamily: F.body, fontSize: 15, color: T.navy }}>{o.text}</span>
        </button>;
      })}
    </div>
    {!submitted && sel && <div style={{ textAlign: "center", marginTop: 18 }}><Btn onClick={submit}>Check Answer</Btn></div>}
    {submitted && <>
      <Box color={selected.correct ? T.green : T.coral} bg={selected.correct ? T.greenLight : T.coralLight}>
        <p style={{ margin: "0 0 6px", fontFamily: F.ui, fontWeight: 700, color: selected.correct ? T.green : T.coral }}>{selected.correct ? "✓ Correct" : "✗ Not quite"}</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 14 }}>{selected.fb}</p>
      </Box>
      {!selected.correct && <Box color={T.green} bg={T.greenLight}><p style={{ margin: "0 0 6px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>Correct answer:</p><p style={{ margin: 0, fontFamily: F.body, fontSize: 14 }}>{correct.fb}</p></Box>}
      <Box color={T.gold} bg={T.goldPale}><p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5, lineHeight: 1.7 }}>Evidence: the Prophet ﷺ said, "Whoever does not recite al-Fatihah in his prayer, his prayer is invalid." <strong>Sahih al-Bukhari 756</strong>.</p></Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P4: Q2 MATCHING ═══ */
function PQ2Match({ done, rm }) {
  const [leftSel, setLeftSel] = useState(null);
  const [matches, setMatches] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const rightOptions = useMemo(() => shuffle(Q2_PAIRS), []);
  const matchedRights = Object.values(matches);

  const tryMatch = (ri) => {
    if (submitted || leftSel === null) return;
    const pair = Q2_PAIRS[leftSel];
    const right = rightOptions[ri];
    if (right.leftId === pair.leftId) {
      setMatches(m => ({ ...m, [leftSel]: ri }));
      setFeedback({ ok: true, text: pair.fb });
      setLeftSel(null);
    } else {
      setFeedback({ ok: false, text: "Not that phrase. Think of the body position: what is said there?" });
    }
    setTimeout(() => setFeedback(null), 1600);
  };

  const score = Object.keys(matches).length;
  const complete = score === Q2_PAIRS.length;
  const handleContinue = () => done(score);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 2" title="Match Position to Words" /><Tag c="#fff" bg={T.gold}>MATCH</Tag></div>
    <Pr>Tap a position, then tap the words that belong there.</Pr>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div>
        <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, marginBottom: 8, letterSpacing: 1 }}>POSITIONS</div>
        {Q2_PAIRS.map((p, i) => {
          const matched = matches[i] !== undefined;
          const active = leftSel === i;
          return <button key={i} disabled={matched || submitted} onClick={() => setLeftSel(active ? null : i)} style={{ width: "100%", marginBottom: 8, padding: "12px 10px", borderRadius: 12, border: "2px solid " + (matched ? T.green : active ? T.teal : T.grayLight), background: matched ? T.greenLight : active ? T.tealLight : "#fff", fontFamily: F.ui, fontSize: 13, fontWeight: 600, color: matched ? T.green : T.navy, cursor: matched ? "default" : "pointer", textAlign: "left", transition: rm ? "none" : "all .15s" }}>
            {matched ? "✓ " : ""}{p.left}
          </button>;
        })}
      </div>
      <div>
        <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, marginBottom: 8, letterSpacing: 1 }}>WORDS</div>
        {rightOptions.map((r, i) => {
          const used = matchedRights.includes(i);
          return <button key={i} disabled={used || submitted || leftSel === null} onClick={() => tryMatch(i)} style={{ width: "100%", marginBottom: 8, padding: "12px 10px", borderRadius: 12, border: "2px solid " + (used ? T.green : T.grayLight), background: used ? T.greenLight : "#fff", fontFamily: F.body, fontSize: 12.5, color: used ? T.green : T.navy, cursor: used || leftSel === null ? "default" : "pointer", textAlign: "left", opacity: leftSel === null && !used ? .55 : 1, transition: rm ? "none" : "all .15s" }}>
            {used ? "✓ " : ""}{r.right}
          </button>;
        })}
      </div>
    </div>
    {feedback && <div style={{ animation: feedback.ok ? "dPop .25s" : "dShake .25s", marginTop: 12 }}><Box color={feedback.ok ? T.green : T.coral} bg={feedback.ok ? T.greenLight : T.coralLight}><p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{feedback.ok ? "✓ " : "✗ "}{feedback.text}</p></Box></div>}
    <div style={{ fontFamily: F.ui, fontSize: 12, color: T.grayMed, textAlign: "center", marginTop: 12 }}>{score}/{Q2_PAIRS.length} matched</div>
    {complete && <div style={{ textAlign: "center", marginTop: 14 }}><Btn onClick={handleContinue}>Continue</Btn></div>}
  </div>;
}

/* ═══ P5: Q3 FILL BLANK - ENHANCED VISUAL WORD-PICK ═══ */
function PQ3Fill({ done, rm }) {
  const [answers, setAnswers] = useState([null, null]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const allFilled = answers.every(Boolean);
  const score = answers.filter((a, i) => a === Q3_BLANKS[i].correct).length;

  const setAnswer = (idx, word) => {
    if (submitted) return;
    setAnswers(p => {
      const n = [...p]; n[idx] = word; return n;
    });
    // Auto-advance to next empty slot
    const nextEmpty = answers.findIndex((a, i) => i !== idx && !a);
    if (nextEmpty >= 0) setActiveSlot(nextEmpty);
  };

  const submit = () => { if (allFilled && !submitted) setSubmitted(true); };
  const handleContinue = () => done(score);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 3" title="Greatness or Highness?" /><Tag c="#fff" bg={T.purple}>FILL</Tag></div>
    <Pr>Both phrases begin the same way: <strong>Subhana Rabbiyal...</strong> Pick the ending that fits each position.</Pr>

    {/* Two visual prayer position cards */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginBottom: 16 }}>
      {Q3_BLANKS.map((b, i) => {
        const ans = answers[i];
        const isActive = activeSlot === i && !submitted;
        const isCorrect = ans === b.correct;
        return <div key={b.pos} onClick={() => !submitted && setActiveSlot(i)} style={{
          background: "#fff",
          border: "3px solid " + (submitted ? (isCorrect ? T.green : T.coral) : isActive ? b.accent : T.grayLight),
          borderRadius: 18,
          overflow: "hidden",
          cursor: submitted ? "default" : "pointer",
          boxShadow: isActive && !submitted ? "0 6px 24px " + b.accent + "33" : "0 3px 12px rgba(0,0,0,.04)",
          transition: rm ? "none" : "all .2s",
          transform: isActive && !rm ? "scale(1.01)" : "none",
        }}>
          {/* Header with position visual */}
          <div style={{
            background: submitted ? (isCorrect ? T.greenLight : T.coralLight) : b.bg,
            padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 12,
            borderBottom: "1px solid " + (submitted ? (isCorrect ? T.green : T.coral) : b.accent) + "33",
          }}>
            <span style={{ fontSize: 28, lineHeight: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.08))" }}>{b.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: T.navy, lineHeight: 1.1 }}>{b.pos}</div>
              <div style={{ fontFamily: F.ui, fontSize: 11, color: submitted ? (isCorrect ? T.green : T.coral) : b.accent, fontWeight: 600 }}>{b.posEn}</div>
            </div>
            {!submitted && (
              <span style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, color: b.accent, background: "#fff", padding: "3px 8px", borderRadius: 6, letterSpacing: 1 }}>
                {ans ? "FILLED" : "FILL IN"}
              </span>
            )}
            {submitted && <span style={{ fontSize: 18, color: isCorrect ? T.green : T.coral, fontWeight: 700 }}>{isCorrect ? "✓" : "✗"}</span>}
          </div>

          {/* Phrase area with Arabic + transliteration + slot */}
          <div style={{ padding: "20px 18px 18px" }}>
            {/* Arabic line */}
            <div dir="rtl" lang="ar" style={{ fontFamily: F.ar, fontSize: 24, color: T.navy, lineHeight: 1.9, textAlign: "center", marginBottom: 6 }}>
              {b.arabicPrefix}{" "}
              <span style={{
                display: "inline-block",
                minWidth: 80,
                padding: "0 12px",
                margin: "0 4px",
                borderBottom: "3px solid " + (submitted ? (isCorrect ? T.green : T.coral) : (ans ? b.accent : b.accent + "55")),
                color: submitted && !isCorrect ? T.coral : (ans ? b.accent : T.grayMed),
                fontWeight: 700,
                background: ans ? b.bg : "transparent",
                borderRadius: ans ? 6 : 0,
              }}>
                {ans ? b.options.find(o => o.word === ans).ar : "____"}
              </span>
            </div>

            {/* Transliteration line */}
            <div style={{ fontFamily: F.body, fontSize: 14, fontStyle: "italic", color: T.grayMed, textAlign: "center", marginBottom: submitted ? 4 : 0 }}>
              {b.transliterationPrefix}<span style={{ color: submitted && !isCorrect ? T.coral : (ans ? b.accent : T.grayMed), fontWeight: 600, fontStyle: "normal" }}>{ans || "____"}</span>
            </div>

            {/* Meaning when filled */}
            {ans && (
              <div style={{ fontFamily: F.ui, fontSize: 12, color: submitted ? (isCorrect ? T.green : T.coral) : b.accent, textAlign: "center", marginTop: 8, fontWeight: 600 }}>
                "{b.options.find(o => o.word === ans).meaning}"
              </div>
            )}

            {/* Reset button when answered (pre-submit only) */}
            {!submitted && ans && (
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <button onClick={(e) => { e.stopPropagation(); setAnswers(p => { const n = [...p]; n[i] = null; return n; }); setActiveSlot(i); }}
                  style={{ background: "none", border: "1px solid " + T.grayMed + "55", borderRadius: 6, padding: "4px 10px", fontFamily: F.ui, fontSize: 10, color: T.grayMed, cursor: "pointer" }}>
                  ✕ Clear
                </button>
              </div>
            )}
          </div>
        </div>;
      })}
    </div>

    {/* Word options (only shown for active slot, pre-submit) */}
    {!submitted && answers.some(a => a === null) && (
      <div style={{
        background: "#fff",
        border: "2px solid " + Q3_BLANKS[activeSlot].accent + "44",
        borderRadius: 16,
        padding: "16px 14px",
        marginBottom: 14,
        boxShadow: "0 4px 16px " + Q3_BLANKS[activeSlot].accent + "11",
      }}>
        <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: Q3_BLANKS[activeSlot].accent, letterSpacing: 1.5, marginBottom: 10, textAlign: "center" }}>
          PICK A WORD FOR {Q3_BLANKS[activeSlot].pos.toUpperCase()}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Q3_BLANKS[activeSlot].options.map(opt => {
            const usedHere = answers[activeSlot] === opt.word;
            return <button
              key={opt.word}
              onClick={() => setAnswer(activeSlot, opt.word)}
              disabled={usedHere}
              style={{
                background: usedHere ? Q3_BLANKS[activeSlot].bg : "#fff",
                border: "2px solid " + (usedHere ? Q3_BLANKS[activeSlot].accent : T.grayLight),
                borderRadius: 12,
                padding: "12px 10px",
                cursor: usedHere ? "default" : "pointer",
                transition: rm ? "none" : "all .15s",
                textAlign: "center",
                opacity: usedHere ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { if (!usedHere) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px " + Q3_BLANKS[activeSlot].accent + "22"; e.currentTarget.style.borderColor = Q3_BLANKS[activeSlot].accent; } }}
              onMouseLeave={(e) => { if (!usedHere) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = T.grayLight; } }}
            >
              <div dir="rtl" lang="ar" style={{ fontFamily: F.ar, fontSize: 20, color: T.navy, marginBottom: 4, lineHeight: 1.4 }}>{opt.ar}</div>
              <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 2 }}>{opt.word}</div>
              <div style={{ fontFamily: F.body, fontSize: 10, fontStyle: "italic", color: T.grayMed, lineHeight: 1.3 }}>"{opt.meaning}"</div>
            </button>;
          })}
        </div>
      </div>
    )}

    {!submitted && allFilled && <div style={{ textAlign: "center", marginTop: 8 }}><Btn onClick={submit}>Check Answer</Btn></div>}

    {submitted && <>
      <Box color={score === 2 ? T.green : T.coral} bg={score === 2 ? T.greenLight : T.coralLight}>
        <p style={{ margin: "0 0 8px", fontFamily: F.ui, fontWeight: 700, color: score === 2 ? T.green : T.coral, fontSize: 14 }}>{score === 2 ? "✓ Both correct!" : score + " of 2 correct"}</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5, lineHeight: 1.7 }}>
          In <strong>rukuʿ</strong> (bowing): <strong style={{ color: T.purple }}>ʿAdheem</strong> - "the Most Great." In <strong>sujud</strong> (prostration): <strong style={{ color: T.gold }}>Aʿla</strong> - "the Most High." The word changes with the position. Bowing acknowledges Allah's <em>greatness</em>. Prostration, the lowest physical position, acknowledges His <em>highness</em>. A beautiful contrast built into every rak'ah.
        </p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P5: TEACH FATIHAH (full text + intro) ═══ */
function PFatihahTeach({ nx, rm }) {
  return <div>
    <PT sub="Section B" title="Surah al-Fatihah - The Key" />
    <Pr>No prayer is valid without al-Fatihah. It is recited in <strong style={{ color: T.navy }}>every rak'ah of every prayer</strong>. That is 17 times a day, 119 times a week, over 6,000 times a year.</Pr>
    <Pr>It is the most-repeated passage in the life of any Muslim. Understanding what it means transforms every prayer.</Pr>

    {/* The full surah card */}
    <div style={{ background: "linear-gradient(135deg, #fff, " + T.cream + ")", border: "2px solid " + T.gold + "44", borderRadius: 20, padding: "26px 22px", margin: "20px 0", boxShadow: "0 6px 24px " + T.gold + "12", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: 8, right: 14, fontFamily: F.ar, fontSize: 28, color: T.gold, opacity: .15 }}>الفاتحة</div>
      <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: 2, marginBottom: 4 }}>QURAN 1:1-7</div>
      <div style={{ fontFamily: F.display, fontSize: 18, fontWeight: 700, color: T.navy, marginBottom: 16 }}>Al-Fatihah (The Opening)</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { ar: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
          { ar: "ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَالَمِينَ", en: "All praise is due to Allah, Lord of the worlds." },
          { ar: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "The Entirely Merciful, the Especially Merciful." },
          { ar: "مَالِكِ يَوْمِ ٱلدِّينِ", en: "Sovereign of the Day of Recompense." },
          { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "It is You we worship and You we ask for help." },
          { ar: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", en: "Guide us to the straight path." },
          { ar: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", en: "The path of those upon whom You have bestowed favour, not of those who have evoked anger or of those who are astray." },
        ].map((a, i) => (
          <div key={i} style={{ paddingBottom: 10, borderBottom: i < 6 ? "1px solid " + T.gold + "22" : "none" }}>
            <ArabicText size={20}>{a.ar}</ArabicText>
            <p style={{ fontFamily: F.body, fontSize: 13.5, color: T.grayDark, fontStyle: "italic", margin: "8px 0 0", lineHeight: 1.7 }}>{a.en}</p>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: F.ui, fontSize: 10, color: T.grayMed, marginTop: 14, textAlign: "right" }}>Saheeh International translation</p>
    </div>

    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Test What I've Learned</Btn></div>
  </div>;
}

/* ═══ P6: Q4 SWIPE (FATIHAH MEANINGS) ═══ */
function PQ4Swipe({ done, rm }) {
  const cards = useMemo(() => shuffle(Q4_CARDS), []);
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [all, setAll] = useState([]);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const sx = useRef(0);

  const swipe = useCallback((dir) => {
    if (result) return;
    const card = cards[idx];
    const userSays = dir === "right";
    const ok = userSays === card.inFatihah;
    setResult({ ok, fb: card.fb });
    setAll(p => [...p, ok]);
    setDx(0);
    setTimeout(() => {
      setResult(null);
      if (idx + 1 >= cards.length) { /* completion handled below */ } else setIdx(i => i + 1);
    }, 1700);
  }, [idx, cards, result]);

  useEffect(() => {
    const h = (e) => { if (result || idx >= cards.length) return; if (e.key === "ArrowRight") swipe("right"); if (e.key === "ArrowLeft") swipe("left"); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [swipe, result, idx, cards.length]);

  const isComplete = idx >= cards.length - 1 && result === null && all.length === cards.length;
  const score = all.filter(Boolean).length;
  const handleContinue = () => done(score);

  if (isComplete) return <div>
    <PT sub="Question 4 Complete" title={score + "/" + cards.length} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
      {cards.map((c, i) => <div key={i} style={{ padding: 12, borderRadius: 12, border: "2px solid " + (all[i] ? T.green : T.coral), background: all[i] ? T.greenLight : T.coralLight, fontFamily: F.ui, fontSize: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.text}</div>
        <div style={{ fontSize: 11, color: T.grayMed }}>{c.inFatihah ? "✓ In Fatihah" : "✗ NOT in Fatihah"}</div>
      </div>)}
    </div>
    <div style={{ textAlign: "center" }}><Btn onClick={handleContinue}>Continue</Btn></div>
  </div>;

  const card = cards[idx]; const rot = (dx / 400) * 15;
  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 4" title="Is This in al-Fatihah?" /><Tag c="#fff" bg={T.magenta}>PLAY</Tag></div>
    <Pr>"Swipe RIGHT if it appears in al-Fatihah. LEFT if not."</Pr>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontSize: 12, fontWeight: 600, marginBottom: 6, padding: "0 4px" }}>
      <span style={{ color: T.coral, opacity: .4 + Math.max(0, -dx / 200) * .6 }}>NOT IN IT</span>
      <span style={{ color: T.grayMed, fontSize: 10 }}>{idx + 1}/{cards.length}</span>
      <span style={{ color: T.green, opacity: .4 + Math.max(0, dx / 200) * .6 }}>IN IT</span>
    </div>
    {!result ? <>
      <div onPointerDown={e => { sx.current = e.clientX; setDragging(true); }} onPointerMove={e => { if (dragging) setDx(e.clientX - sx.current); }} onPointerUp={() => { setDragging(false); Math.abs(dx) > 70 ? swipe(dx > 0 ? "right" : "left") : setDx(0); }} onPointerLeave={() => { setDragging(false); setDx(0); }}
        role="button" tabIndex={0} aria-label={"Card: " + card.text}
        style={{ background: "#fff", border: "1.5px solid " + T.grayLight, borderRadius: 16, padding: "36px 24px", textAlign: "center", fontFamily: F.display, fontSize: 18, fontWeight: 600, color: T.navy, cursor: "grab", userSelect: "none", boxShadow: "0 4px 20px " + T.gold + "12", transform: rm ? "none" : "translateX(" + dx + "px) rotate(" + rot + "deg)", transition: dragging ? "none" : rm ? "none" : "transform .15s", touchAction: "pan-y" }}>"{card.text}"</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18 }}>
        <Btn onClick={() => swipe("left")} v="ghost" style={{ borderColor: T.coral, color: T.coral, padding: "12px 22px" }}>Not in it</Btn>
        <Btn onClick={() => swipe("right")} v="ghost" style={{ borderColor: T.green, color: T.green, padding: "12px 22px" }}>In it</Btn>
      </div>
    </> : <Box color={result.ok ? T.green : T.coral} bg={result.ok ? T.greenLight : T.coralLight}>
      <div style={{ textAlign: "center", fontSize: 26, marginBottom: 6 }}>{result.ok ? "✓" : "✗"}</div>
      <p style={{ margin: 0, fontFamily: F.body, fontSize: 14, textAlign: "center" }}>{result.fb}</p>
    </Box>}
  </div>;
}

/* ═══ P7: Q5 T/F WITH JUSTIFICATION ═══ */
function PQ5TF({ done, rm }) {
  const [answer, setAnswer] = useState(null);
  const [justification, setJustification] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const tooShort = justification.trim().length < 15;
  const submit = () => {
    if (answer === null || tooShort || submitted) return;
    setSubmitted(true);
  };
  const ok = submitted ? answer === Q5_ANSWER : null;
  const handleContinue = () => done(ok ? 1 : 0);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 5" title="True or False" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <div style={{ background: "#fff", border: "1.5px solid " + T.grayLight, borderRadius: 16, padding: "26px 22px", textAlign: "center", fontFamily: F.display, fontSize: 17, color: T.navy, boxShadow: "0 4px 16px " + T.gold + "10", marginBottom: 16 }}>"{Q5_STATEMENT}"</div>

    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
      <Btn onClick={() => !submitted && setAnswer(true)} disabled={submitted} style={{ background: answer === true ? (submitted ? (ok ? T.green : T.coral) : T.green) : (submitted ? T.grayLight : T.green + "44"), color: answer === true ? "#fff" : T.navy, padding: "12px 32px", fontSize: 15, border: "none", opacity: submitted && answer !== true ? .5 : 1 }}>TRUE</Btn>
      <Btn onClick={() => !submitted && setAnswer(false)} disabled={submitted} style={{ background: answer === false ? (submitted ? (ok ? T.green : T.coral) : T.coral) : (submitted ? T.grayLight : T.coral + "44"), color: answer === false ? "#fff" : T.navy, padding: "12px 32px", fontSize: 15, border: "none", opacity: submitted && answer !== false ? .5 : 1 }}>FALSE</Btn>
    </div>

    {answer !== null && !submitted && <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.grayMed, letterSpacing: 1, marginBottom: 6 }}>EXPLAIN YOUR REASONING (MIN 15 CHARS)</div>
      <textarea
        value={justification}
        onChange={e => setJustification(e.target.value)}
        placeholder="In your own words, why?"
        rows={3}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "2px solid " + T.grayLight, fontFamily: F.body, fontSize: 14, color: T.grayDark, resize: "vertical", outline: "none" }}
      />
      <div style={{ fontFamily: F.ui, fontSize: 10, color: tooShort ? T.coral : T.green, marginTop: 4 }}>
        {justification.trim().length} / 15+ chars
      </div>
    </div>}

    {answer !== null && !submitted && !tooShort && <div style={{ textAlign: "center" }}><Btn onClick={submit}>Submit</Btn></div>}

    {submitted && <>
      <Box color={ok ? T.green : T.coral} bg={ok ? T.greenLight : T.coralLight}>
        <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: ok ? T.green : T.coral }}>{ok ? "✓ Correct" : "✗ Not quite"}</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>The answer is <strong>{Q5_ANSWER ? "TRUE" : "FALSE"}</strong>.</p>
      </Box>
      <Box color={T.gold} bg={T.goldPale}>
        <p style={{ margin: "0 0 6px", fontFamily: F.ui, fontWeight: 700, color: T.gold }}>Model answer:</p>
        <p style={{ margin: "0 0 10px", fontFamily: F.body, fontSize: 13.5, fontStyle: "italic" }}>{Q5_MODEL}</p>
        <p style={{ margin: 0, fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>Compare to your reasoning. There is no auto-grading on the writing - this is for your own reflection.</p>
      </Box>
      <Box color={T.teal} bg={T.tealLight}>
        <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.teal }}>Your reasoning:</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: T.grayDark }}>"{justification}"</p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P8: TEACH FATIHAH STRUCTURE (3 movements) ═══ */
function PFatihahStructure({ nx, rm }) {
  const [active, setActive] = useState(0);
  const m = FATIHAH[active];

  return <div>
    <PT sub="Section C" title="The Three Movements" />
    <Pr>Look closer at al-Fatihah and you will see it has three distinct movements: <strong style={{ color: T.teal }}>praise</strong>, <strong style={{ color: T.gold }}>declaration</strong>, and <strong style={{ color: T.purple }}>duʿaʾ</strong>. Every rak'ah, you cycle through all three.</Pr>

    {/* Movement tabs */}
    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
      {FATIHAH.map((mv, i) => (
        <button key={i} onClick={() => setActive(i)}
          style={{
            flex: 1, padding: "12px 8px", borderRadius: 12,
            border: "2px solid " + (active === i ? mv.color : T.grayLight),
            background: active === i ? mv.color + "12" : "#fff",
            cursor: "pointer", transition: rm ? "none" : "all .15s",
            boxShadow: active === i ? "0 3px 10px " + mv.color + "33" : "none",
          }}>
          <div style={{ fontSize: 22, marginBottom: 2 }}>{mv.icon}</div>
          <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: active === i ? mv.color : T.grayMed }}>{mv.movement.toUpperCase()}</div>
          <div style={{ fontFamily: F.ui, fontSize: 9, color: T.grayMed, marginTop: 1 }}>{i + 1}</div>
        </button>
      ))}
    </div>

    {/* Active movement detail */}
    <div key={active} style={{
      background: "#fff",
      border: "2px solid " + m.color + "33",
      borderLeft: "5px solid " + m.color,
      borderRadius: 16,
      padding: "20px 22px",
      marginBottom: 16,
      boxShadow: "0 6px 20px " + m.color + "12",
      animation: rm ? "none" : "dFadeUp .3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 26 }}>{m.icon}</span>
        <div>
          <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: m.color, letterSpacing: 1.5 }}>MOVEMENT {active + 1}</div>
          <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: T.navy }}>{m.movement}</div>
        </div>
      </div>

      {/* Ayat */}
      <div style={{ background: m.color + "08", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
        {m.ayat.map((a, i) => (
          <div key={i} style={{ paddingBottom: i < m.ayat.length - 1 ? 10 : 0, marginBottom: i < m.ayat.length - 1 ? 10 : 0, borderBottom: i < m.ayat.length - 1 ? "1px solid " + m.color + "22" : "none" }}>
            <ArabicText size={19}>{a.ar}</ArabicText>
            <p style={{ fontFamily: F.body, fontSize: 13, color: T.grayDark, fontStyle: "italic", margin: "6px 0 0", lineHeight: 1.6 }}>{a.en}</p>
          </div>
        ))}
      </div>

      {/* Explainer */}
      <p style={{ fontFamily: F.body, fontSize: 14, lineHeight: 1.75, color: T.grayDark, margin: 0 }}>{m.explainer}</p>
    </div>

    {/* Summary insight */}
    <Box color={T.gold} bg={T.goldPale}>
      <p style={{ fontFamily: F.body, fontSize: 14, color: T.grayDark, margin: 0, lineHeight: 1.75 }}>
        Every prayer follows this rhythm: you praise before you ask. You acknowledge who Allah is, declare your relationship with Him, then ask for the one thing you need most: guidance.
      </p>
    </Box>

    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>One Last Question</Btn></div>
  </div>;
}

/* ═══ P9: Q6 MC SCENARIO ═══ */
function PQ6MC({ done, rm }) {
  const [sel, setSel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const options = useMemo(() => shuffle(Q6_SCENARIO.options), []);
  const correctIdx = options.findIndex(o => o.correct);
  const submit = () => { if (sel === null || submitted) return; setSubmitted(true); };
  const userCorrect = submitted && options[sel]?.correct;
  const handleContinue = () => done(userCorrect ? 1 : 0);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 6" title="Scenario" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <Box color={T.navy} bg={T.goldPale} style={{ padding: "18px 20px" }}>
      <Pr><strong style={{ color: T.navy }}>Scenario:</strong> {Q6_SCENARIO.prompt}</Pr>
    </Box>
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {options.map((o, i) => {
        const isSel = sel === i;
        let bc = T.grayLight, bg = "#fff", op = 1;
        if (submitted) { if (o.correct) { bc = T.green; bg = T.greenLight; } else if (isSel) { bc = T.coral; bg = T.coralLight; } else op = .4; }
        else if (isSel) { bc = T.navy; bg = T.goldPale; }
        return <button key={i} onClick={() => { if (!submitted) setSel(i); }} disabled={submitted}
          style={{ background: bg, border: "2px solid " + bc, borderRadius: 12, padding: "13px 15px", textAlign: "left", cursor: submitted ? "default" : "pointer", display: "flex", gap: 11, alignItems: "flex-start", transition: rm ? "none" : "all .15s", opacity: op, fontFamily: F.body, fontSize: 14 }}>
          <span style={{ background: o.correct && submitted ? T.green : isSel && submitted ? T.coral : T.navy, color: "#fff", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{o.id}</span>
          <span style={{ lineHeight: 1.6 }}>{o.text}</span>
        </button>;
      })}
    </div>
    {!submitted && sel !== null && <div style={{ textAlign: "center", marginTop: 14 }}><Btn onClick={submit}>Check Answer</Btn></div>}
    {submitted && userCorrect && <>
      <Box color={T.green} bg={T.greenLight}><p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>✓ Correct!</p><p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[correctIdx].fb}</p></Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
    {submitted && !userCorrect && <>
      <Box color={T.coral} bg={T.coralLight}><p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.coral }}>✗ Not quite</p><p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[sel]?.fb}</p></Box>
      <Box color={T.green} bg={T.greenLight}><p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>The answer:</p><p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[correctIdx].fb}</p></Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P10: KEY TAKEAWAY ═══ */
function PTakeaway({ nx }) {
  return <div>
    <div style={{ background: "linear-gradient(135deg," + T.gold + "12," + T.goldPale + ")", border: "2.5px solid " + T.gold, borderRadius: 20, padding: "30px 26px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle," + T.gold + "22,transparent 70%)", borderRadius: "50%" }} />
      <SL icon="🔑" text="Key Takeaway" color={T.gold} />
      <p style={{ fontFamily: F.display, fontSize: 19, fontWeight: 700, color: T.navy, lineHeight: 1.6, margin: "0 0 10px" }}>Every word you speak in salah carries weight.</p>
      <p style={{ fontFamily: F.body, fontSize: 14.5, lineHeight: 1.8, color: T.grayDark, margin: 0 }}>
        Allahu Akbar opens the door. Subhana Rabbiyal-ʿAdheem in the bow. Subhana Rabbiyal-Aʿla in prostration. Al-Fatihah threads the prayer together: praise, declaration, duʿaʾ. Then tashahhud renews the testimony before salam closes the prayer with peace.
      </p>
    </div>
    <div style={{ textAlign: "center", marginTop: 28 }}><Btn onClick={nx}>See My Results</Btn></div>
  </div>;
}

/* ═══ P11: CHECKPOINT ═══ */
function PCheckpoint({ scores, total, rm, onReview, onComplete, onGoToHifz }) {
  const maxScore = 17; /* Q1=1 + Q2=6 + Q3=2 + Q4=6 + Q5=1 + Q6=1 */
  const pct = Math.round((total / maxScore) * 100);
  const pass = pct >= 60;
  const [showConf, setShowConf] = useState(pass);
  const [conf, setConf] = useState(3);
  const [finished, setFinished] = useState(false);
  const colors = [T.gold, T.teal, T.green, T.coral, T.purple];

  useEffect(() => { if (pass) setTimeout(() => setShowConf(false), 2500); }, [pass]);

  const concepts = [
    { name: "Required surah (al-Fatihah)", ok: scores.q1 >= 1 },
    { name: "Recitations by position", ok: scores.q2 >= 5 },
    { name: "Tashahhud and salawat", ok: scores.q2 >= 5 },
    { name: "ʿAdheem vs Aʿla", ok: scores.q3 >= 1 },
    { name: "What's in al-Fatihah", ok: scores.q4 >= 4 },
    { name: "Praise before request", ok: scores.q5 >= 1 },
    { name: "After al-Fatihah (scenario)", ok: scores.q6 >= 1 },
  ];

  return <div style={{ position: "relative" }}>
    {showConf && !rm && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 240, overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
      {Array.from({ length: 35 }, (_, i) => <div key={i} style={{ position: "absolute", left: Math.random() * 100 + "%", top: -10, width: 7 + Math.random() * 5, height: 7 + Math.random() * 5, borderRadius: Math.random() > .5 ? "50%" : 2, background: colors[i % 5], animation: "dConfetti " + (1 + Math.random() * .8) + "s ease-out " + Math.random() * .4 + "s forwards" }} />)}
    </div>}
    <div style={{ background: "#fff", borderRadius: 24, border: "2px solid " + T.gold, padding: 28, boxShadow: "0 8px 40px " + T.gold + "12" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, color: T.grayMed, letterSpacing: 2, marginBottom: 10 }}>COMPREHENSION CHECKPOINT</div>
        <svg width={100} height={100} viewBox="0 0 100 100" style={{ display: "block", margin: "0 auto 10px" }} role="img" aria-label={"Score: " + pct + "%"}>
          <circle cx={50} cy={50} r={42} fill="none" stroke={T.grayLight} strokeWidth={6} />
          <circle cx={50} cy={50} r={42} fill="none" stroke={pass ? T.green : T.coral} strokeWidth={6} strokeDasharray={(pct / 100) * 264 + " 264"} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: rm ? "none" : "stroke-dasharray 1s ease" }} />
          <text x={50} y={47} textAnchor="middle" fontSize={24} fontWeight={800} fontFamily={F.ui} fill={T.navy}>{pct}%</text>
          <text x={50} y={64} textAnchor="middle" fontSize={10} fill={T.grayMed} fontFamily={F.ui}>{Math.round(total)}/{maxScore}</text>
        </svg>
        <div style={{ fontFamily: F.ui, fontWeight: 700, color: pass ? T.green : T.coral, fontSize: 14 }}>{pass ? "Strong work! Ready for Lesson 5." : "You are close - review below."}</div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Concepts Mastered</div>
        {concepts.map((c, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid " + T.grayLight + "22" }}>
          <span style={{ fontSize: 14 }}>{c.ok ? "✅" : "⬜"}</span>
          <span style={{ fontFamily: F.ui, fontSize: 13, color: c.ok ? T.green : T.grayMed, fontWeight: c.ok ? 600 : 400 }}>{c.name}</span>
        </div>)}
      </div>
      <div style={{ marginBottom: 20, padding: "14px 0", borderTop: "1px solid " + T.grayLight }}>
        <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Confidence? <span style={{ fontWeight: 400, color: T.grayMed }}>(optional)</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontFamily: F.ui, fontSize: 10, color: T.grayMed }}>Low</span><input type="range" min={1} max={5} step={1} value={conf} onChange={e => setConf(+e.target.value)} aria-label="Confidence" style={{ flex: 1 }} /><span style={{ fontFamily: F.ui, fontSize: 10, color: T.grayMed }}>High</span></div>
      </div>

      {/* Cross-module bridge to Quran section */}
      <div
        onClick={() => { if (onGoToHifz) onGoToHifz(); }}
        role="link"
        tabIndex={0}
        aria-label="Memorise Surah al-Fatihah in the Quran section (coming soon)"
        style={{
          background: "linear-gradient(135deg, " + T.navy + " 0%, " + T.navyDeep + " 100%)",
          borderRadius: 16,
          padding: "20px 22px",
          marginBottom: 16,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: rm ? "none" : "all .25s",
          boxShadow: "0 6px 24px " + T.navy + "33",
        }}
        onMouseEnter={(e) => { if (!rm) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px " + T.navy + "44"; } }}
        onMouseLeave={(e) => { if (!rm) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px " + T.navy + "33"; } }}
      >
        {/* Decorative arabic in background */}
        <div aria-hidden="true" dir="rtl" lang="ar" style={{ position: "absolute", top: -6, right: -8, fontFamily: F.ar, fontSize: 56, color: T.gold, opacity: 0.1, lineHeight: 1, fontWeight: 400 }}>الفاتحة</div>

        {/* "Coming soon" tag */}
        <div style={{ position: "absolute", top: 12, right: 14, fontFamily: F.ui, fontSize: 8, fontWeight: 700, color: T.gold, background: T.gold + "22", padding: "3px 8px", borderRadius: 6, letterSpacing: 1.5, border: "1px solid " + T.gold + "44" }}>
          COMING SOON
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>📖</span>
            <span style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: 2 }}>QURAN MODULE</span>
          </div>

          {/* Title */}
          <div style={{ fontFamily: F.display, fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 6 }}>
            Memorise Surah al-Fatihah
          </div>

          {/* Description */}
          <p style={{ fontFamily: F.body, fontSize: 12.5, color: "rgba(255,255,255,.72)", lineHeight: 1.6, margin: "0 0 14px", paddingRight: 60 }}>
            You learned what al-Fatihah <em>means</em>. Next, learn to <strong style={{ color: "#fff" }}>recite it from memory</strong>: ayah by ayah, with audio, repetition, and review.
          </p>

          {/* Action row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.15)" }}>
            <div style={{ fontFamily: F.ui, fontSize: 11, color: T.gold, fontWeight: 600 }}>
              Start the talaqqi method →
            </div>
            <div style={{ background: T.gold, color: T.navy, fontFamily: F.ui, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6, letterSpacing: .5 }}>
              GO
            </div>
          </div>
        </div>
      </div>

      <Box color={T.teal} bg={T.tealLight} style={{ borderRadius: 12 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13, color: T.teal, marginBottom: 3 }}>Next: Lesson 5 - "When Things Go Wrong"</div>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 12.5, color: T.grayDark, lineHeight: 1.7 }}>You know the words and the movements. Next: how to handle mistakes. The prostration of forgetfulness, missed prayers, doubts mid-prayer.</p>
      </Box>
      {finished && <Box color={T.green} bg={T.greenLight} style={{ borderRadius: 12 }}>
        <p style={{ margin: 0, fontFamily: F.ui, fontSize: 13, fontWeight: 700, color: T.green, textAlign: "center" }}>Lesson complete saved. You can continue to Lesson 5 in your course flow.</p>
      </Box>}
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <Btn
          onClick={() => {
            if (pass) { onComplete?.(); setFinished(true); }
            else onReview?.();
          }}
          style={{ minWidth: 240, fontSize: 15, padding: "15px 40px" }}
        >
          {pass ? "Mark Lesson Complete" : "Review Lesson"}
        </Btn>
      </div>
    </div>
  </div>;
}
