import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DEANY Module S2 Lesson 4: "The Words That Rise"
   Core recitations at each position + Surah al-Fatihah meaning.
   Maliki madhab (unnamed at Beginner tier).
   Sahih al-Bukhari / Sahih Muslim ONLY.
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
    note: "The opening takbir (Takbirat al-Ihram) begins the prayer. Then you recite al-Fatihah, followed by another surah in the first two rak'at.",
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
    note: "Said three times while bowing. Notice the word 'Great' (ʿAdheem) - said while you make yourself small in bowing.",
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
    note: "Said three times in each prostration. The word 'Most High' (Aʿla) is said at the lowest physical position. Beautiful contrast.",
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
    note: "The tashahhud is a longer declaration. You testify to Allah's oneness and the Prophet's ﷺ messengership while seated. Lesson 5 will cover the full text.",
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
    note: "Said once turning the head right to end the prayer. You have just left the audience of your Lord - you exit with peace.",
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
  { left: "Ending the prayer", right: "As-salamu ʿalaykum", leftId: 4, fb: "Saying salam ends the prayer." },
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

/* ═══ MAIN APP ═══ */
export default function DEANYS2L4({ onBack, onHome }) {
  const savedPage = useMemo(() => { try { const d = localStorage.getItem("deany-progress-s2-l4"); return d ? (JSON.parse(d).page || 0) : 0; } catch { return 0; } }, []);
  const [page, setPage] = useState(savedPage);
  const [scores, setScores] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 });
  const [rm, setRm] = useState(false);
  const ref = useRef(null);

  useEffect(() => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); setRm(m.matches); m.addEventListener("change", e => setRm(e.matches)); }, []);

  const go = useCallback((p) => {
    setPage(p);
    try { localStorage.setItem("deany-progress-s2-l4", JSON.stringify({ page: p })); } catch {}
    if (ref.current) ref.current.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
  }, [rm]);
  const nx = useCallback(() => go(page + 1), [page, go]);

  const totalPages = 13;
  const prog = Math.min(100, Math.round(((page + 1) / totalPages) * 100));
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const pages = [
    <PBridge key={0} nx={nx} rm={rm} />,
    <PRecitationMap key={1} nx={nx} rm={rm} />,
    <PQ1MC key={2} done={s => { setScores(p => ({ ...p, q1: s })); nx(); }} rm={rm} />,
    <PQ2Match key={3} done={s => { setScores(p => ({ ...p, q2: s })); nx(); }} rm={rm} />,
    <PQ3Fill key={4} done={s => { setScores(p => ({ ...p, q3: s })); nx(); }} rm={rm} />,
    <PFatihahTeach key={5} nx={nx} rm={rm} />,
    <PQ4Swipe key={6} done={s => { setScores(p => ({ ...p, q4: s })); nx(); }} rm={rm} />,
    <PQ5TF key={7} done={s => { setScores(p => ({ ...p, q5: s })); nx(); }} rm={rm} />,
    <PFatihahStructure key={8} nx={nx} rm={rm} />,
    <PQ6MC key={9} done={s => { setScores(p => ({ ...p, q6: s })); nx(); }} rm={rm} />,
    <PTakeaway key={10} nx={nx} />,
    <PCheckpoint key={11} scores={scores} total={totalScore} rm={rm} />,
  ];

  return (
    <div ref={ref} style={{ minHeight: "100vh", background: T.cream, position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, opacity: .025, pointerEvents: "none", background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C5A55A' stroke-width='.5'/%3E%3C/svg%3E")` }} />
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: T.cream + "ee", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid " + T.gold + "22" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} aria-label="Back to lessons" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 2px", display: "flex", alignItems: "center", color: T.grayMed }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: 2 }}>S2.4</span>
          <div style={{ flex: 1, background: T.gold + "18", borderRadius: 20, height: 5, overflow: "hidden" }}>
            <div role="progressbar" aria-valuenow={prog} aria-valuemin={0} aria-valuemax={100} style={{ height: "100%", background: "linear-gradient(90deg," + T.gold + "," + T.teal + ")", borderRadius: 20, width: prog + "%", transition: rm ? "none" : "width .5s ease" }} />
          </div>
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
    <Box color={T.gold} bg={T.goldLight}><SL icon="🎯" text="Objective" color={T.gold} />
      <div style={{ fontFamily: F.body, fontSize: 14.5, color: T.grayDark }}>
        <p style={{ margin: "0 0 4px", fontWeight: 600, color: T.navy }}>By the end, you will be able to:</p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
          <li>Name the core recitation at each prayer position.</li>
          <li>Recite Surah al-Fatihah's structure: praise, declaration, duʿaʾ.</li>
          <li>Explain what your daily 17 raka'at are actually saying.</li>
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
      {/* Top half: position banner with emoji */}
      <div style={{ background: r.bg, padding: "24px 20px 20px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: 16, fontFamily: F.ui, fontSize: 9, color: r.accent, letterSpacing: 2, fontWeight: 700, opacity: .7 }}>POSITION {active + 1} / 6</div>
        <div style={{ fontSize: 64, lineHeight: 1, marginTop: 14, marginBottom: 10, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))", animation: rm ? "none" : "dPop .5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>{r.emoji}</div>
        <div style={{ fontFamily: F.display, fontSize: 20, fontWeight: 700, color: T.navy }}>{r.pos}</div>
        <div style={{ fontFamily: F.ui, fontSize: 12, color: r.accent, fontWeight: 600, marginTop: 2 }}>{r.posEn}</div>
      </div>

      {/* Speech bubble - the key visual */}
      <div style={{ padding: "20px 20px 18px", position: "relative" }}>
        {/* Bubble pointer */}
        <div aria-hidden="true" style={{ position: "absolute", top: -10, left: "50%", width: 20, height: 20, background: "#fff", border: "2px solid " + r.accent + "55", borderRight: "none", borderBottom: "none", transform: "translateX(-50%) rotate(45deg)" }} />
        <div style={{ background: "#fff", border: "2px solid " + r.accent + "55", borderRadius: 18, padding: "20px 18px", textAlign: "center" }}>
          <ArabicText size={28} color={T.navy}>{r.arabic}</ArabicText>
          <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 14, color: T.grayMed, marginTop: 10 }}>{r.transliteration}</div>
          <div style={{ height: 1, background: r.accent + "22", margin: "14px 0" }} />
          <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: r.accent, lineHeight: 1.5 }}>"{r.meaning}"</div>
        </div>
        <p style={{ fontFamily: F.body, fontSize: 13.5, color: T.grayDark, lineHeight: 1.75, margin: "14px 0 0", padding: "0 4px" }}>{r.note}</p>
      </div>
    </div>

    {/* Position selector strip */}
    <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 16 }}>
      {RECITATIONS.map((rec, i) => (
        <button key={i} onClick={() => setActive(i)} aria-label={rec.pos}
          style={{
            flex: "1 1 0", maxWidth: 56, padding: "8px 2px 5px", borderRadius: 10,
            border: "2.5px solid " + (active === i ? rec.accent : T.grayLight),
            background: active === i ? rec.bg : "#fff",
            cursor: "pointer", transition: rm ? "none" : "all .15s",
            boxShadow: active === i ? "0 3px 10px " + rec.accent + "22" : "none",
            transform: active === i ? "scale(1.05)" : "scale(1)",
          }}>
          <div style={{ fontSize: 20, lineHeight: 1, textAlign: "center" }}>{rec.emoji}</div>
          <div style={{ fontFamily: F.ui, fontSize: 7, fontWeight: 700, color: active === i ? rec.accent : T.grayMed, marginTop: 2, textAlign: "center" }}>{rec.pos.split(" ")[0]}</div>
        </button>
      ))}
    </div>

    {/* Hadith */}
    <Box color={T.teal} bg={T.tealLight}><SL icon="📖" text="Hadith" color={T.teal} />
      <p style={{ fontFamily: F.body, fontSize: 15, fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.8 }}>"There is no prayer for the one who does not recite the Opening of the Book."</p>
      <p style={{ margin: 0, fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>(Sahih al-Bukhari 756)</p>
    </Box>

    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Test What I've Learned</Btn></div>
  </div>;
}

/* ═══ P2: Q1 MC ═══ */
function PQ1MC({ done, rm }) {
  const [sel, setSel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const options = useMemo(() => shuffle(Q1.options), []);
  const correctIdx = options.findIndex(o => o.correct);
  const submit = () => { if (sel === null || submitted) return; setSubmitted(true); };
  const userCorrect = submitted && options[sel]?.correct;
  const handleContinue = () => done(userCorrect ? 1 : 0);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 1" title="The Required Surah" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <Pr>"{Q1.prompt}"</Pr>
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
      <Box color={T.green} bg={T.greenLight}>
        <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>✓ Correct!</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[correctIdx].fb}</p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
    {submitted && !userCorrect && <>
      <Box color={T.coral} bg={T.coralLight}>
        <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.coral }}>✗ Not quite</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[sel]?.fb}</p>
      </Box>
      <Box color={T.green} bg={T.greenLight}>
        <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>The answer:</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[correctIdx].fb}</p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P3: Q2 MATCH PAIRS (drag + tap) ═══ */
function PQ2Match({ done, rm }) {
  const leftItems = useMemo(() => shuffle(Q2_PAIRS.map(p => ({ text: p.left, id: p.leftId }))), []);
  const rightItems = useMemo(() => shuffle(Q2_PAIRS.map(p => ({ text: p.right, leftId: p.leftId }))), []);
  /* placements: { leftId: rightItem | null } */
  const [placements, setPlacements] = useState({});
  const [draggingRight, setDraggingRight] = useState(null); /* {text, leftId} */
  const [selectedRight, setSelectedRight] = useState(null);
  const [hoverLeftId, setHoverLeftId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const placeRightInLeft = (right, leftItem) => {
    if (submitted) return;
    /* Remove right from any other left first */
    const newPlacements = { ...placements };
    Object.keys(newPlacements).forEach(k => { if (newPlacements[k]?.text === right.text) delete newPlacements[k]; });
    newPlacements[leftItem.id] = right;
    setPlacements(newPlacements);
  };
  const removeFromLeft = (leftId) => {
    if (submitted) return;
    const np = { ...placements }; delete np[leftId]; setPlacements(np);
  };

  const usedRights = new Set(Object.values(placements).map(r => r?.text));
  const allPlaced = Object.keys(placements).length === Q2_PAIRS.length;

  const submit = () => { if (!allPlaced || submitted) return; setSubmitted(true); };

  const correctCount = submitted ? leftItems.filter(l => placements[l.id]?.leftId === l.id).length : 0;
  const handleContinue = () => done(correctCount);

  /* Drag handlers */
  const onDragStartRight = (e, right) => {
    if (submitted) return;
    setDraggingRight(right);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", right.text); } catch {}
  };
  const onDragEnd = () => { setDraggingRight(null); setHoverLeftId(null); };
  const onDragOverLeft = (e, leftId) => {
    if (submitted || !draggingRight) return;
    e.preventDefault();
    setHoverLeftId(leftId);
  };
  const onDropOnLeft = (e, leftItem) => {
    e.preventDefault();
    if (submitted || !draggingRight) return;
    placeRightInLeft(draggingRight, leftItem);
    setDraggingRight(null); setHoverLeftId(null);
  };

  /* Tap mode */
  const tapRight = (right) => {
    if (submitted) return;
    if (usedRights.has(right.text)) return;
    setSelectedRight(selectedRight?.text === right.text ? null : right);
  };
  const tapLeft = (leftItem) => {
    if (submitted) return;
    if (selectedRight) {
      placeRightInLeft(selectedRight, leftItem);
      setSelectedRight(null);
    } else if (placements[leftItem.id]) {
      removeFromLeft(leftItem.id);
    }
  };

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 2" title="Match the Words to the Position" /><Tag c="#fff" bg={T.teal}>SORT</Tag></div>
    <Pr>"Drag each recitation onto the matching position, or tap to place."</Pr>

    {/* Available right items (recitations) */}
    {!allPlaced && <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1.5, marginBottom: 8 }}>RECITATIONS - DRAG OR TAP</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {rightItems.filter(r => !usedRights.has(r.text)).map(right => {
          const isSelected = selectedRight?.text === right.text;
          const isDragging = draggingRight?.text === right.text;
          return <div
            key={right.text}
            draggable
            onDragStart={(e) => { setSelectedRight(null); onDragStartRight(e, right); }}
            onDragEnd={onDragEnd}
            onClick={() => tapRight(right)}
            role="button" tabIndex={0}
            style={{
              background: isSelected ? T.goldPale : "#fff",
              border: "2px solid " + (isSelected ? T.gold : T.gold + "44"),
              boxShadow: isSelected ? "0 4px 14px " + T.gold + "44" : "0 1px 3px rgba(0,0,0,.04)",
              borderRadius: 12,
              padding: "10px 12px",
              fontFamily: F.ui, fontSize: 12.5, fontWeight: 600, color: T.navy,
              cursor: "grab",
              userSelect: "none",
              opacity: isDragging ? .4 : 1,
              transition: rm ? "none" : "all .15s",
              transform: isSelected ? "scale(1.03)" : "scale(1)",
              display: "flex", alignItems: "center", gap: 5,
            }}>
            <span style={{ color: T.gold, fontSize: 9 }}>⋮⋮</span>
            <span>{right.text}</span>
          </div>;
        })}
      </div>
    </div>}

    {/* Left items (positions) - drop targets */}
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {leftItems.map(leftItem => {
        const placed = placements[leftItem.id];
        const isHover = hoverLeftId === leftItem.id;
        const isCorrect = submitted ? placed?.leftId === leftItem.id : null;
        const primed = isHover || (selectedRight && !placed);
        return <div
          key={leftItem.id}
          onDragOver={(e) => onDragOverLeft(e, leftItem.id)}
          onDragLeave={() => setHoverLeftId(null)}
          onDrop={(e) => onDropOnLeft(e, leftItem)}
          onClick={() => tapLeft(leftItem)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px",
            borderRadius: 12,
            background: submitted ? (isCorrect ? T.greenLight : T.coralLight) : (placed ? T.goldPale : (primed ? T.tealLight : "#fff")),
            border: "2px " + (placed || submitted ? "solid" : "dashed") + " " + (submitted ? (isCorrect ? T.green : T.coral) : (placed ? T.gold : (primed ? T.teal : T.grayLight))),
            cursor: submitted ? "default" : "pointer",
            transition: rm ? "none" : "all .15s",
            transform: primed ? "scale(1.01)" : "scale(1)",
            boxShadow: primed ? "0 4px 14px " + T.teal + "22" : "none",
          }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13.5, color: T.navy }}>{leftItem.text}</div>
            {placed && <div style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayMed, marginTop: 3, fontStyle: "italic" }}>→ {placed.text}</div>}
            {!placed && <div style={{ fontFamily: F.ui, fontSize: 11, color: T.grayMed, marginTop: 3, fontStyle: "italic" }}>{primed ? "Drop or tap here" : "Empty"}</div>}
          </div>
          {submitted && <span style={{ fontSize: 16, color: isCorrect ? T.green : T.coral, fontWeight: 700 }}>{isCorrect ? "✓" : "✗"}</span>}
          {!submitted && placed && <button onClick={(e) => { e.stopPropagation(); removeFromLeft(leftItem.id); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: T.grayMed }}>✕</button>}
        </div>;
      })}
    </div>

    {allPlaced && !submitted && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Submit</Btn></div>}

    {submitted && <>
      <Box color={correctCount === leftItems.length ? T.green : T.coral} bg={correctCount === leftItems.length ? T.greenLight : T.coralLight}>
        <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: correctCount === leftItems.length ? T.green : T.coral, textAlign: "center" }}>
          {correctCount === leftItems.length ? "✓ All matched correctly!" : correctCount + " of " + leftItems.length + " correct."}
        </p>
      </Box>
      {/* Per-pair feedback for wrong ones */}
      {correctCount < leftItems.length && <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
        {leftItems.filter(l => placements[l.id]?.leftId !== l.id).map(l => {
          const correctPair = Q2_PAIRS.find(p => p.leftId === l.id);
          return <div key={l.id} style={{ padding: "10px 12px", borderRadius: 10, background: T.coralLight, border: "1px solid " + T.coral + "44", fontFamily: F.ui, fontSize: 12 }}>
            <div style={{ fontWeight: 700, color: T.coral, marginBottom: 2 }}>{l.text} → {correctPair.right}</div>
            <div style={{ color: T.grayDark }}>{correctPair.fb}</div>
          </div>;
        })}
      </div>}
      <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P4: Q3 FILL IN BLANK (elevated word-pick) ═══ */
function PQ3Fill({ done, rm }) {
  const [answers, setAnswers] = useState([null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);

  const setAnswer = (idx, word) => {
    if (submitted) return;
    const n = [...answers];
    n[idx] = word;
    setAnswers(n);
    /* auto-advance to next empty slot */
    const nextEmpty = n.findIndex((a, i) => i > idx && !a);
    if (nextEmpty !== -1) setActiveSlot(nextEmpty);
  };

  const allFilled = answers.every(a => a !== null);
  const score = answers.filter((a, i) => a === Q3_BLANKS[i].correct).length;
  const submit = () => { if (!allFilled || submitted) return; setSubmitted(true); };
  const handleContinue = () => done(score);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 3" title="Complete the Phrases" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <Pr>"Tap the word that completes each recitation."</Pr>

    {/* Two position cards stacked */}
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
      {Q3_BLANKS.map((b, i) => {
        const ans = answers[i];
        const isActive = !submitted && activeSlot === i && ans === null;
        const isCorrect = submitted ? ans === b.correct : null;

        return <div key={i}
          onClick={() => { if (!submitted && ans === null) setActiveSlot(i); }}
          style={{
            background: "#fff",
            border: "2px solid " + (submitted ? (isCorrect ? T.green : T.coral) : (isActive ? b.accent : T.grayLight)),
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: isActive ? "0 6px 20px " + b.accent + "33" : "0 2px 8px rgba(0,0,0,.04)",
            transition: rm ? "none" : "all .2s",
            transform: isActive ? "scale(1.01)" : "scale(1)",
            cursor: !submitted && ans === null && !isActive ? "pointer" : "default",
          }}>
          {/* Header strip with emoji */}
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
        Allahu Akbar opens the door. Subhana Rabbiyal-ʿAdheem in the bow. Subhana Rabbiyal-Aʿla in prostration. Al-Fatihah threads them together: praise, declaration, duʿaʾ. Seventeen times a day, you ask the same question: guide me.
      </p>
    </div>
    <div style={{ textAlign: "center", marginTop: 28 }}><Btn onClick={nx}>See My Results</Btn></div>
  </div>;
}

/* ═══ P11: CHECKPOINT ═══ */
function PCheckpoint({ scores, total, rm }) {
  const maxScore = 16; /* Q1=1 + Q2=5 + Q3=2 + Q4=6 + Q5=1 + Q6=1 */
  const pct = Math.round((total / maxScore) * 100);
  const pass = pct >= 60;
  const [showConf, setShowConf] = useState(pass);
  const [conf, setConf] = useState(3);
  const colors = [T.gold, T.teal, T.green, T.coral, T.purple];

  useEffect(() => { if (pass) setTimeout(() => setShowConf(false), 2500); }, [pass]);

  const concepts = [
    { name: "Required surah (al-Fatihah)", ok: scores.q1 >= 1 },
    { name: "Recitations by position", ok: scores.q2 >= 4 },
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
        onClick={() => { /* PLACEHOLDER: navigate to Quran module, Lesson 1 (Surah al-Fatihah memorisation) */ console.log("Navigate to Quran/al-Fatihah memorisation lesson"); }}
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
      <div style={{ textAlign: "center", marginTop: 18 }}><Btn style={{ minWidth: 240, fontSize: 15, padding: "15px 40px" }}>{pass ? "Continue to Lesson 5" : "Review Lesson"}</Btn></div>
    </div>
  </div>;
}
