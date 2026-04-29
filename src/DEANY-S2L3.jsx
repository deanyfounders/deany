import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DEANY Module S2 Lesson 3: "Inside the Rak'ah"
   Physical movements, arkan (pillars) vs sunnah, raka'at counts.
   Maliki madhab (unnamed at Beginner tier).
   Sahih al-Bukhari / Sahih Muslim ONLY.
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

/* ─── RAK'AH POSITIONS (correct order) ─── */
const POSITIONS = [
  { id: 0, name: "Qiyam (Standing)", ar: "قِيَام", desc: "You stand upright, facing the qiblah. Hands folded. This is where you recite al-Fatihah.", icon: "🧍", spirit: "Servitude: standing before your Lord." },
  { id: 1, name: "Ruku' (Bowing)", ar: "رُكُوع", desc: "You bow with your back straight, hands on your knees. You say: Subhana Rabbiyal-'Adheem (Glory to my Lord, the Most Great).", icon: "🙇", spirit: "Humility: bowing in reverence." },
  { id: 2, name: "Rising from Ruku'", ar: "اِعْتِدَال", desc: "You stand back up straight. You say: Sami'Allahu liman hamidah (Allah hears the one who praises Him).", icon: "🧍", spirit: "Acknowledgement: Allah hears your praise." },
  { id: 3, name: "First Sujud (Prostration)", ar: "سُجُود", desc: "You place your forehead, nose, palms, knees, and toes on the ground. This is the closest you are to Allah. You say: Subhana Rabbiyal-A'la (Glory to my Lord, the Most High).", icon: "🤲", spirit: "Surrender: the closest point to Allah." },
  { id: 4, name: "Sitting Between Sujud", ar: "جُلُوس", desc: "You sit back on your heels between the two prostrations, hands resting on your thighs. A brief moment of stillness before surrendering again.", icon: "🧎", spirit: "Pause: collecting yourself before surrendering again." },
  { id: 5, name: "Second Sujud", ar: "سُجُود", desc: "You prostrate a second time, same as the first. Repetition deepens the surrender.", icon: "🤲", spirit: "Deepening: the surrender is repeated, not rushed." },
];

/* ─── ARKAN (PILLARS) vs SUNNAH of SALAH (Maliki) ─── */
/* Per Maliki fiqh: arkan are the actions whose omission invalidates the prayer */
const ARKAN = [
  { name: "Intention (niyyah)", ar: "النية", desc: "Knowing in your heart which prayer you are about to perform. The intention is in the heart, not spoken aloud." },
  { name: "Opening Takbir", ar: "تكبيرة الإحرام", desc: "Saying 'Allahu Akbar' to begin the prayer. It must be said while standing, and nothing before it counts as part of the prayer." },
  { name: "Standing (qiyam)", ar: "القيام", desc: "Standing upright for the obligatory prayer, if you are physically able. Reciting al-Fatihah while sitting (when you can stand) invalidates the prayer." },
  { name: "Reciting al-Fatihah", ar: "قراءة الفاتحة", desc: "The opening chapter of the Quran, recited in every rak'ah for the imam and the one praying alone." },
  { name: "Bowing (rukuʿ)", ar: "الركوع", desc: "Bowing so the palms can be placed at the level of the knees. Tilting the head down is not enough." },
  { name: "Rising from rukuʿ", ar: "الرفع من الركوع", desc: "Standing back up fully straight after bowing, before going into prostration." },
  { name: "Prostration (sujud)", ar: "السجود", desc: "Placing the forehead, nose, palms, knees, and toes on the ground. Twice in every rak'ah." },
  { name: "Rising from sujud", ar: "الرفع من السجود", desc: "Lifting the head fully from prostration, both between the two sujud and after the second." },
  { name: "Final salam", ar: "السلام", desc: "Saying 'As-salamu alaykum' to end the prayer. The first salam is the pillar that closes the prayer." },
  { name: "Stillness (tumaʾninah)", ar: "الطمأنينة", desc: "Settling into each position before moving to the next. No rushing through the prayer." },
  { name: "Correct order (tartib)", ar: "الترتيب", desc: "The actions must happen in sequence. Bowing must come before prostration, and so on." },
];

const SUNNAH_SALAH = [
  { name: "Raising the hands with the opening takbir", desc: "Lifting the hands to the level of the shoulders or ears as you say Allahu Akbar." },
  { name: "Reciting a surah after al-Fatihah", desc: "In the first two rak'at of the obligatory prayer." },
  { name: "Saying 'Sami'Allahu liman hamidah'", desc: "When rising from rukuʿ, said by the imam and the one praying alone." },
  { name: "The takbirs of transition", desc: "Saying 'Allahu Akbar' when moving between positions (other than the opening takbir)." },
  { name: "The tashahhud and sitting for it", desc: "The seated declaration of faith at the middle and end of the prayer." },
  { name: "Sending salutations on the Prophet ﷺ", desc: "Reciting the salawat after the final tashahhud." },
  { name: "Reciting silently or aloud as appropriate", desc: "Aloud in Fajr, Maghrib, and 'Isha' (first two rak'at). Silent in Dhuhr and 'Asr." },
];

/* ─── RAKA'AT DATA ─── */
const RAKAAT = [
  { prayer: "Fajr", count: 2, time: "Pre-dawn" },
  { prayer: "Dhuhr", count: 4, time: "Midday" },
  { prayer: "'Asr", count: 4, time: "Afternoon" },
  { prayer: "Maghrib", count: 3, time: "Sunset" },
  { prayer: "'Isha'", count: 4, time: "Night" },
];

/* ─── Q2: BUCKET SORT DATA ─── */
const BUCKET_ITEMS = [
  { text: "Reciting al-Fatihah", isPillar: true, fb: "Pillar. Required in every rak'ah for the imam and the one praying alone." },
  { text: "Raising hands with the opening takbir", isPillar: false, fb: "Sunnah. Recommended but the prayer is valid without it." },
  { text: "The opening Allahu Akbar", isPillar: true, fb: "Pillar. The takbirat al-ihram begins the prayer." },
  { text: "Reciting a surah after al-Fatihah", isPillar: false, fb: "Sunnah. Recommended in the first two rak'at." },
  { text: "Two prostrations per rak'ah", isPillar: true, fb: "Pillar. Each rak'ah requires two full sujud." },
  { text: "Saying Sami'Allahu liman hamidah", isPillar: false, fb: "Sunnah. Said when rising from rukuʿ." },
  { text: "The final salam", isPillar: true, fb: "Pillar. Saying 'As-salamu alaykum' ends the prayer." },
  { text: "Standing for al-Fatihah (if able)", isPillar: true, fb: "Pillar. Reciting al-Fatihah while seated when you can stand invalidates the prayer." },
];

/* ─── Q4: RAPID FIRE ─── */
const RAPID = [
  { text: "One rak'ah includes two prostrations.", answer: true, exp: "Correct. Every rak'ah has two sujud with a brief sitting in between." },
  { text: "Fajr prayer has 4 raka'at.", answer: false, exp: "Fajr has 2 raka'at, the shortest of the five daily prayers." },
  { text: "Al-Fatihah must be recited in every rak'ah.", answer: true, exp: "It is a pillar of the prayer. Without it, the rak'ah is not valid." },
  { text: "The total daily raka'at across all five prayers is 17.", answer: true, exp: "2 + 4 + 4 + 3 + 4 = 17 raka'at every single day." },
  { text: "You can prostrate before bowing and the prayer is still valid.", answer: false, exp: "Correct order is a pillar. Bowing must come before prostration." },
];

/* ─── Q5: MC SCENARIO ─── */
const MC_SCENARIO = {
  prompt: "Yusuf is praying Maghrib. In the second rak'ah, after rising from the first sujud, he gets distracted by his thoughts and stands straight up to begin the next rak'ah without performing the second sujud. He realises his mistake just as he stands. What should he do?",
  options: [
    { id: "A", text: "Continue the prayer normally. One sujud is enough.", correct: false, fb: "Two prostrations per rak'ah is a pillar of the prayer. A rak'ah with only one sujud is not a complete rak'ah." },
    { id: "B", text: "Sit back down and perform the missed sujud, then continue.", correct: true, fb: "Correct. Sujud is a pillar and there must be two per rak'ah. He returns to the missed pillar before continuing the prayer." },
    { id: "C", text: "Restart the entire prayer from the beginning.", correct: false, fb: "He does not need to restart. He can correct the rak'ah by returning to the missed pillar." },
    { id: "D", text: "Add an extra rak'ah at the end to make up for it.", correct: false, fb: "Adding a rak'ah does not replace a missed pillar. The pillar itself must be performed in its proper place." },
  ],
};

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

/* ═══ MAIN APP ═══ */
export default function DEANYS2L3({ onBack, onHome }) {
  const [page, setPage] = useState(0);
  const [scores, setScores] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
  const [rm, setRm] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); setRm(m.matches); m.addEventListener("change", e => setRm(e.matches)); }, []);
  const go = useCallback((p) => { setPage(p); if (ref.current) ref.current.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" }); else window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" }); }, [rm]);
  const nx = useCallback(() => go(page + 1), [page, go]);

  const totalPages = 12;
  const prog = Math.min(100, Math.round(((page + 1) / totalPages) * 100));
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const pages = [
    <PBridge key={0} nx={nx} rm={rm} />,
    <PDiscover key={1} nx={nx} rm={rm} />,
    <PTeachPositions key={2} nx={nx} rm={rm} />,
    <PQ1Sequence key={3} done={s => { setScores(p => ({ ...p, q1: s })); nx(); }} rm={rm} />,
    <PTeachArkan key={4} nx={nx} rm={rm} />,
    <PQ2Buckets key={5} done={s => { setScores(p => ({ ...p, q2: s })); nx(); }} rm={rm} />,
    <PTeachRakaat key={6} nx={nx} rm={rm} />,
    <PQ3Match key={7} done={s => { setScores(p => ({ ...p, q3: s })); nx(); }} rm={rm} />,
    <PQ4Rapid key={8} done={s => { setScores(p => ({ ...p, q4: s })); nx(); }} rm={rm} />,
    <PQ5MC key={9} done={s => { setScores(p => ({ ...p, q5: s })); nx(); }} rm={rm} />,
    <PTakeaway key={10} nx={nx} />,
    <PCheckpoint key={11} scores={scores} total={totalScore} rm={rm} />,
  ];

  return (
    <div ref={ref} style={{ minHeight: "100vh", background: T.cream, position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, opacity: .025, pointerEvents: "none", background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C5A55A' stroke-width='.5'/%3E%3C/svg%3E")` }} />
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: T.cream + "ee", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid " + T.gold + "22" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: 2 }}>S2.3</span>
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

/* ═══ P0: BRIDGE ═══ */
function PBridge({ nx }) {
  return <div>
    <div style={{ background: "linear-gradient(135deg," + T.navy + "," + T.navyDeep + ")", borderRadius: 24, padding: "48px 28px 40px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .08, background: "radial-gradient(circle at 80% 20%," + T.teal + ",transparent 50%),radial-gradient(circle at 20% 80%," + T.gold + ",transparent 50%)" }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, color: T.gold, letterSpacing: 3 }}>LESSON S2.3</div>
        <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 900, color: "#fff", margin: "8px 0", lineHeight: 1.2 }}>"Inside the Rak'ah"</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontFamily: F.ui, fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 14 }}>
          <span>14 min</span><span>5 questions</span><span>Level 2-3</span>
        </div>
      </div>
    </div>
    <Box color={T.teal} bg={T.tealLight}><SL icon="🔗" text="Bridge" color={T.teal} />
      <Pr>You now know how to prepare for prayer: wudu, qiblah, the right time. Now you are standing on the prayer mat. What happens next?</Pr>
      <Pr>Every prayer has a structure as precise as a building. The building block is called a <strong style={{ color: T.navy }}>rak'ah</strong>. Master one rak'ah, and you can perform any of the five daily prayers.</Pr>
    </Box>
    <Box color={T.gold} bg={T.goldLight}><SL icon="🎯" text="Objective" color={T.gold} />
      <div style={{ fontFamily: F.body, fontSize: 14.5, color: T.grayDark }}>
        <p style={{ margin: "0 0 4px", fontWeight: 600, color: T.navy }}>By the end, you will be able to:</p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
          <li>Describe the physical movements of one rak'ah in order.</li>
          <li>Distinguish between the pillars (arkan) and sunnah acts of prayer.</li>
          <li>State the number of raka'at in each of the five daily prayers.</li>
        </ol>
      </div>
    </Box>
    <div style={{ textAlign: "center", marginTop: 28 }}><Btn onClick={nx}>Let's Begin</Btn></div>
  </div>;
}

/* ═══ P1: DISCOVERY - SORT THE POSITIONS ═══ */
function PDiscover({ nx, rm }) {
  const shuffled = useMemo(() => shuffle(POSITIONS), []);
  const [order, setOrder] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const add = (s) => { if (submitted || order.find(o => o.id === s.id)) return; setOrder([...order, s]); };
  const remove = (i) => { if (submitted) return; setOrder(order.filter((_, idx) => idx !== i)); };
  const submit = () => { if (order.length !== 6 || submitted) return; setSubmitted(true); };
  const results = submitted ? order.map((s, i) => s.id === i) : null;
  const correctCount = results ? results.filter(Boolean).length : 0;
  const usedIds = new Set(order.map(s => s.id));

  return <div>
    <PT sub="Discovery Moment" title="Arrange the Prayer" accent={T.purple} />
    <Box color={T.purple} bg="#F8F4FD" style={{ padding: "16px 20px" }}>
      <Pr><strong style={{ color: T.purple }}>Before we teach you</strong>, see if you can figure it out. These are the six positions of one rak'ah. Tap them in the order you think they happen.</Pr>
    </Box>

    <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1, marginTop: 20, marginBottom: 8 }}>POSITIONS</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {shuffled.map(p => {
        const used = usedIds.has(p.id);
        return <button key={p.id} disabled={used || submitted} onClick={() => add(p)}
          style={{ background: used ? T.grayLight : "#fff", border: "1.5px solid " + (used ? T.grayLight : T.teal), borderRadius: 10, padding: "10px 14px", fontFamily: F.ui, fontWeight: 600, fontSize: 12, color: used ? T.grayMed : T.teal, cursor: used || submitted ? "default" : "pointer", opacity: used ? .3 : 1, transition: "all .15s" }}>
          {p.icon} {p.name}
        </button>;
      })}
    </div>

    <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1, marginBottom: 8 }}>YOUR SEQUENCE</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 60 }}>
      {order.length === 0 && <div style={{ fontFamily: F.ui, fontSize: 13, color: T.grayMed, fontStyle: "italic", padding: 16, textAlign: "center", border: "2px dashed " + T.grayLight, borderRadius: 12 }}>Tap positions above to build your sequence</div>}
      {order.map((p, i) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: submitted ? (results[i] ? T.greenLight : T.coralLight) : T.goldPale, border: "2px solid " + (submitted ? (results[i] ? T.green : T.coral) : T.gold), animation: submitted && !results[i] ? (rm ? "none" : "dShake .3s") : "none" }}>
          <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: submitted ? (results[i] ? T.green : T.coral) : T.navy, width: 22, textAlign: "center" }}>{i + 1}</span>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: T.navy, flex: 1 }}>{p.icon} {p.name}</span>
          {submitted && <span style={{ fontSize: 14 }}>{results[i] ? "✓" : "✗"}</span>}
          {!submitted && <button onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.grayMed, padding: 4 }}>✕</button>}
        </div>
      ))}
    </div>

    {!submitted && order.length === 6 && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Check My Order</Btn></div>}
    {submitted && <div>
      <Box color={correctCount === 6 ? T.green : T.gold} bg={correctCount === 6 ? T.greenLight : T.goldPale}>
        <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: correctCount === 6 ? T.green : T.navy }}>
          {correctCount === 6 ? "Perfect! You already knew the structure." : correctCount + " of 6 in the right spot. Let's walk through it properly."}
        </p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 10 }}><Btn onClick={nx}>Learn the Full Sequence</Btn></div>
    </div>}
  </div>;
}

/* ═══ POSITION EMOJIS & COLORS ═══ */
const POSE_EMOJI = ["🧍", "🙇", "🧍", "🧎", "🧎‍♂️", "🧎"];
const POSE_ACCENT = [T.teal, T.purple, T.teal, T.gold, T.teal, T.gold];
const POSE_BG = [T.tealLight, "#F3EEFF", T.tealLight, T.goldPale, T.tealLight, T.goldPale];
const POSE_CONTACT = [
  ["Feet"],
  ["Feet", "Hands on knees"],
  ["Feet"],
  ["Forehead", "Nose", "Both palms", "Both knees", "Toes"],
  ["Knees", "Shins", "Feet"],
  ["Forehead", "Nose", "Both palms", "Both knees", "Toes"],
];

/* ═══ P2: TEACH THE RAK'AH ═══ */
function PTeachPositions({ nx, rm }) {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(null);

  const startAutoPlay = () => {
    setAutoPlay(true); setActive(0); let step = 0;
    autoRef.current = setInterval(() => { step++; if (step >= 6) { clearInterval(autoRef.current); setAutoPlay(false); } else setActive(step); }, 2400);
  };
  useEffect(() => () => { if (autoRef.current) clearInterval(autoRef.current); }, []);

  const pos = POSITIONS[active];
  const accent = POSE_ACCENT[active];

  return <div>
    <PT sub="Section A" title="One Rak'ah, Six Positions" />
    <Pr>A rak'ah is one complete cycle of prayer. Tap each position below, or watch the full sequence.</Pr>

    {/* Main display card */}
    <div style={{ background: "#fff", border: "2px solid " + accent + "33", borderRadius: 24, overflow: "hidden", marginBottom: 18, boxShadow: "0 8px 30px " + accent + "10" }}>

      {/* Top section: emoji + gradient bg */}
      <div key={active} style={{
        background: POSE_BG[active],
        padding: "32px 20px 28px",
        textAlign: "center",
        position: "relative",
        animation: rm ? "none" : "dPop .35s ease",
      }}>
        {/* Qiblah + step */}
        <div style={{ position: "absolute", top: 12, left: 16, fontFamily: F.ui, fontSize: 9, color: accent + "88", letterSpacing: 2 }}>QIBLAH →</div>
        <div style={{ position: "absolute", top: 10, right: 16, fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: accent, background: "#fff", padding: "3px 12px", borderRadius: 8, boxShadow: "0 1px 4px " + accent + "22" }}>{active + 1} / 6</div>

        {/* Large emoji */}
        <div style={{ fontSize: 96, lineHeight: 1, marginBottom: 14, filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.12))", animation: rm ? "none" : "dPop .5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>{POSE_EMOJI[active]}</div>

        {/* Name + Arabic */}
        <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: T.navy }}>{pos.name}</div>
        <div dir="rtl" lang="ar" style={{ fontFamily: F.ar, fontSize: 22, color: T.gold, marginTop: 4 }}>{pos.ar}</div>

        {/* Spiritual meaning */}
        <div style={{ fontFamily: F.ui, fontSize: 12, fontStyle: "italic", color: accent, marginTop: 10, fontWeight: 600, letterSpacing: 0.5 }}>{pos.spirit}</div>
      </div>

      {/* Bottom section: description + ground contact */}
      <div style={{ padding: "20px 20px 24px" }}>
        {/* Description */}
        <p key={"d" + active} style={{ fontFamily: F.body, fontSize: 14.5, lineHeight: 1.85, color: T.grayDark, margin: "0 0 16px", animation: rm ? "none" : "dFadeUp .3s ease" }}>
          {pos.desc}
        </p>

        {/* Ground contact */}
        <div style={{ background: T.cream, border: "1.5px solid " + T.grayLight, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1, marginBottom: 6 }}>GROUND CONTACT</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {POSE_CONTACT[active].map((c, i) => (
              <span key={i} style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, color: T.teal, background: T.tealLight, padding: "3px 10px", borderRadius: 8 }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Nav arrows */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <button onClick={() => { if (active > 0) setActive(active - 1); }} disabled={active === 0}
            style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid " + T.grayLight, background: "#fff", cursor: active === 0 ? "default" : "pointer", opacity: active === 0 ? .3 : 1, fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: T.navy }}>
            ← Previous
          </button>
          <button onClick={() => { if (active < 5) setActive(active + 1); }} disabled={active === 5}
            style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid " + T.grayLight, background: "#fff", cursor: active === 5 ? "default" : "pointer", opacity: active === 5 ? .3 : 1, fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: T.navy }}>
            Next →
          </button>
        </div>
      </div>
    </div>

    {/* Thumbnail strip */}
    <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 16 }}>
      {POSITIONS.map((p, i) => (
        <button key={i}
          onClick={() => { if (autoRef.current) { clearInterval(autoRef.current); setAutoPlay(false); } setActive(i); }}
          aria-label={p.name}
          style={{
            flex: "1 1 0", maxWidth: 54, padding: "8px 2px 4px", borderRadius: 12,
            border: "2.5px solid " + (active === i ? POSE_ACCENT[i] : T.grayLight),
            background: active === i ? POSE_BG[i] : "#fff",
            cursor: "pointer", transition: rm ? "none" : "all .15s",
            boxShadow: active === i ? "0 3px 10px " + POSE_ACCENT[i] + "25" : "none",
            transform: active === i ? "scale(1.05)" : "scale(1)",
          }}>
          <div style={{ fontSize: 22, lineHeight: 1, textAlign: "center" }}>{POSE_EMOJI[i]}</div>
          <div style={{ fontFamily: F.ui, fontSize: 7, fontWeight: 700, color: active === i ? POSE_ACCENT[i] : T.grayMed, marginTop: 3, textAlign: "center", lineHeight: 1.1 }}>
            {["Stand", "Bow", "Rise", "Prostrate", "Sit", "Prostrate"][i]}
          </div>
        </button>
      ))}
    </div>

    {/* Auto-play */}
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <Btn onClick={startAutoPlay} v="ghost" disabled={autoPlay} style={{ fontSize: 13, padding: "10px 24px" }}>
        {autoPlay ? "Playing..." : "▶ Watch Full Rak'ah"}
      </Btn>
    </div>

    <Box color={T.teal} bg={T.tealLight}><SL icon="📖" text="Hadith" color={T.teal} />
      <p style={{ fontFamily: F.body, fontSize: 15, fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.8 }}>"The closest a servant is to his Lord is when he is prostrating, so increase your supplication in it."</p>
      <p style={{ margin: 0, fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>(Sahih Muslim 482)</p>
    </Box>
    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Test What I've Learned</Btn></div>
  </div>;
}

/* ═══ P3: Q1 SEQUENCE REORDER (retry until correct) ═══ */
function PQ1Sequence({ done, rm }) {
  const shuffled = useMemo(() => shuffle(POSITIONS.map((p, i) => ({ text: p.name, icon: p.icon, correctIdx: i }))), []);
  const [order, setOrder] = useState([]);
  const [results, setResults] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [locked, setLocked] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null); /* {fromPool: bool, text, fromIdx?} */
  const [dropZoneActive, setDropZoneActive] = useState(false);

  const usedSet = new Set(order.map(s => s.text));

  const add = (s) => { if (locked || usedSet.has(s.text)) return; setOrder([...order, s]); setResults(null); };
  const remove = (i) => { if (locked) return; setOrder(order.filter((_, idx) => idx !== i)); setResults(null); };

  /* DRAG handlers */
  const onDragStartPool = (e, item) => {
    if (locked || usedSet.has(item.text)) return;
    setDraggingItem({ fromPool: true, text: item.text, item });
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", item.text); } catch (err) {}
  };
  const onDragStartSlot = (e, idx) => {
    if (locked) return;
    setDraggingItem({ fromPool: false, text: order[idx].text, fromIdx: idx, item: order[idx] });
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", order[idx].text); } catch (err) {}
  };
  const onDragEnd = () => { setDraggingItem(null); setDropZoneActive(false); };
  const onDropZoneOver = (e) => {
    if (locked || !draggingItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropZoneActive(true);
  };
  const onDropZoneLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDropZoneActive(false);
  };
  const onDropToZone = (e) => {
    e.preventDefault();
    if (locked || !draggingItem) return;
    if (draggingItem.fromPool) {
      if (!usedSet.has(draggingItem.text)) {
        setOrder([...order, draggingItem.item]);
        setResults(null);
      }
    }
    setDraggingItem(null);
    setDropZoneActive(false);
  };
  /* Drop ONTO an existing slot to swap */
  const onDropOnSlot = (e, targetIdx) => {
    e.preventDefault();
    e.stopPropagation();
    if (locked || !draggingItem) return;
    if (!draggingItem.fromPool) {
      /* Reorder: swap items at fromIdx and targetIdx */
      const newOrder = [...order];
      [newOrder[draggingItem.fromIdx], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[draggingItem.fromIdx]];
      setOrder(newOrder);
      setResults(null);
    } else {
      /* From pool: insert at targetIdx, push others back (only if not full) */
      if (order.length < 6 && !usedSet.has(draggingItem.text)) {
        const newOrder = [...order];
        newOrder.splice(targetIdx, 0, draggingItem.item);
        setOrder(newOrder);
        setResults(null);
      }
    }
    setDraggingItem(null);
    setDropZoneActive(false);
  };

  const submit = () => {
    if (order.length !== 6 || locked) return;
    const r = order.map((s, i) => s.correctIdx === i);
    const c = r.filter(Boolean).length;
    setResults(r);
    setAttempt(a => a + 1);
    if (c === 6) {
      setLocked(true);
    } else {
      setLocked(true);
      setTimeout(() => {
        const newOrder = order.filter((s, i) => r[i]);
        setOrder(newOrder);
        setResults(null);
        setLocked(false);
      }, 2000);
    }
  };

  const handleContinue = () => {
    const score = attempt === 1 ? 6 : attempt === 2 ? 4 : attempt === 3 ? 2 : 1;
    done(score);
  };

  const wrongCount = results ? results.filter(r => r === false).length : 0;

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 1" title="Order the Rak'ah" /><Tag c="#fff" bg={T.teal}>SORT</Tag></div>
    <Pr>"Drag positions into the sequence below, or tap to add. Keep trying until all six are correct."</Pr>

    {attempt > 0 && !locked && results === null && <div style={{ fontFamily: F.ui, fontSize: 12, color: T.gold, fontWeight: 600, marginBottom: 12, padding: "10px 14px", background: T.goldPale, borderRadius: 10, borderLeft: "3px solid " + T.gold }}>
      Attempt {attempt}. Some positions are correct and locked. Place the remaining ones.
    </div>}

    {/* Pool of available positions */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
      {shuffled.map(s => {
        const used = usedSet.has(s.text);
        const isDragging = draggingItem && draggingItem.fromPool && draggingItem.text === s.text;
        return <div
          key={s.text}
          draggable={!used && !locked}
          onDragStart={(e) => onDragStartPool(e, s)}
          onDragEnd={onDragEnd}
          onClick={() => add(s)}
          role="button"
          tabIndex={used || locked ? -1 : 0}
          aria-label={s.name + " (drag or tap to add)"}
          style={{
            background: used ? T.grayLight : "#fff",
            border: "1.5px solid " + (used ? T.grayLight : T.teal),
            borderRadius: 10, padding: "10px 14px",
            fontFamily: F.ui, fontWeight: 600, fontSize: 12,
            color: used ? T.grayMed : T.teal,
            cursor: used || locked ? "default" : "grab",
            opacity: used ? .3 : (isDragging ? .4 : 1),
            userSelect: "none",
            display: "flex", alignItems: "center", gap: 6,
            transition: rm ? "none" : "all .15s",
          }}>
          {!used && <span style={{ color: T.gold, fontSize: 10 }}>⋮⋮</span>}
          <span>{s.icon} {s.text}</span>
        </div>;
      })}
    </div>

    {/* Sequence drop zone */}
    <div
      onDragOver={onDropZoneOver}
      onDragLeave={onDropZoneLeave}
      onDrop={onDropToZone}
      style={{
        display: "flex", flexDirection: "column", gap: 6, minHeight: 60,
        padding: order.length === 0 ? 0 : 6,
        border: dropZoneActive && draggingItem?.fromPool ? "2px dashed " + T.gold : "2px solid transparent",
        borderRadius: 12,
        background: dropZoneActive && draggingItem?.fromPool ? T.goldPale + "55" : "transparent",
        transition: rm ? "none" : "all .15s",
      }}>
      {order.length === 0 && <div style={{ fontFamily: F.ui, fontSize: 13, color: T.grayMed, fontStyle: "italic", padding: 16, textAlign: "center", border: "2px dashed " + T.grayLight, borderRadius: 12 }}>
        {draggingItem ? "Drop here" : "Drag or tap positions to build the sequence"}
      </div>}
      {order.map((s, i) => {
        const isCorrect = results ? results[i] : null;
        const isDragging = draggingItem && !draggingItem.fromPool && draggingItem.fromIdx === i;
        return <div
          key={s.text + i}
          draggable={!locked && !results}
          onDragStart={(e) => onDragStartSlot(e, i)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => { if (!locked && draggingItem) { e.preventDefault(); e.stopPropagation(); } }}
          onDrop={(e) => onDropOnSlot(e, i)}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
            background: results ? (isCorrect ? T.greenLight : T.coralLight) : T.goldPale,
            border: "2px solid " + (results ? (isCorrect ? T.green : T.coral) : T.gold),
            animation: results && !isCorrect ? (rm ? "none" : "dShake .3s") : "none",
            cursor: locked || results ? "default" : "grab",
            opacity: isDragging ? .4 : 1,
            userSelect: "none",
            transition: rm ? "none" : "all .15s",
          }}>
          {!results && !locked && <span style={{ color: T.gold, fontSize: 10 }}>⋮⋮</span>}
          <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: results ? (isCorrect ? T.green : T.coral) : T.navy, width: 22, textAlign: "center" }}>{i + 1}</span>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: T.navy, flex: 1 }}>{s.icon} {s.text}</span>
          {results && <span style={{ fontSize: 14 }}>{isCorrect ? "✓" : "✗"}</span>}
          {!results && !locked && <button onClick={(e) => { e.stopPropagation(); remove(i); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.grayMed, padding: 4 }}>✕</button>}
        </div>;
      })}
    </div>

    {!locked && order.length === 6 && results === null && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Check My Order</Btn></div>}

    {results && wrongCount > 0 && <Box color={T.coral} bg={T.coralLight}>
      <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.coral }}>{wrongCount} {wrongCount === 1 ? "position is" : "positions are"} wrong</p>
      <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>The correct ones will stay locked. The wrong ones will be returned. Try again.</p>
    </Box>}

    {results && wrongCount === 0 && <>
      <Box color={T.green} bg={T.greenLight}>
        <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: T.green, textAlign: "center" }}>
          ✓ Perfect sequence! {attempt === 1 ? "First try!" : "Got it on attempt " + attempt + "."}
        </p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P4: TEACH ARKAN vs SUNNAH ═══ */
function PTeachArkan({ nx, rm }) {
  return <div>
    <PT sub="Section B" title="Pillars vs Sunnah" />
    <Pr>Not every action in prayer carries the same weight. Some are <strong style={{ color: T.teal }}>pillars (arkan)</strong>: miss one and your prayer is invalid. Others are <strong style={{ color: T.gold }}>sunnah acts</strong>: doing them earns reward and follows the Prophet's ﷺ example, but your prayer is still valid without them.</Pr>

    {/* PILLARS section */}
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", background: T.teal, borderRadius: 12 }}>
        <span style={{ fontSize: 18 }}>🏛️</span>
        <div>
          <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: "#fff" }}>PILLARS (Arkan)</div>
          <div style={{ fontFamily: F.ui, fontSize: 10, color: "rgba(255,255,255,.75)" }}>Miss one and the prayer is invalid</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {ARKAN.map((a, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "#fff", border: "1.5px solid " + T.teal + "44", borderLeft: "4px solid " + T.teal, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <span style={{ background: T.tealLight, color: T.teal, fontFamily: F.ui, fontWeight: 700, fontSize: 12, width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13.5, color: T.navy }}>{a.name}</div>
              {a.ar && <div dir="rtl" lang="ar" style={{ fontFamily: F.ar, fontSize: 14, color: T.gold }}>{a.ar}</div>}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayDark, marginTop: 3, lineHeight: 1.6 }}>{a.desc}</div>
          </div>
        </div>)}
      </div>
    </div>

    {/* SUNNAH section */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", background: T.gold, borderRadius: 12 }}>
        <span style={{ fontSize: 18 }}>⭐</span>
        <div>
          <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: "#fff" }}>SUNNAH ACTS</div>
          <div style={{ fontFamily: F.ui, fontSize: 10, color: "rgba(255,255,255,.85)" }}>Rewarded but prayer valid without them</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {SUNNAH_SALAH.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "#fff", border: "1.5px solid " + T.gold + "44", borderLeft: "4px solid " + T.gold, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <span style={{ background: T.goldPale, color: T.gold, fontFamily: F.ui, fontWeight: 700, fontSize: 14, width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13.5, color: T.navy }}>{s.name}</div>
            <div style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayDark, marginTop: 3, lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        </div>)}
      </div>
    </div>

    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Test This</Btn></div>
  </div>;
}

/* ═══ P5: Q2 BUCKET SORT (drag and drop) ═══ */
function PQ2Buckets({ done, rm }) {
  const items = useMemo(() => shuffle(BUCKET_ITEMS), []);
  const [pillarBucket, setPillarBucket] = useState([]);
  const [sunnahBucket, setSunnahBucket] = useState([]);
  const [draggingText, setDraggingText] = useState(null);
  const [selectedText, setSelectedText] = useState(null); /* tap-mode selection */
  const [hoverBucket, setHoverBucket] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const placed = new Set([...pillarBucket, ...sunnahBucket]);
  const allPlaced = placed.size === items.length;
  const activeText = draggingText || selectedText;

  const placeIn = (text, bucket) => {
    if (submitted) return;
    /* Remove from any existing bucket first */
    setPillarBucket(p => p.filter(t => t !== text));
    setSunnahBucket(p => p.filter(t => t !== text));
    /* Then add to target */
    if (bucket === "pillar") setPillarBucket(p => [...p, text]);
    else setSunnahBucket(p => [...p, text]);
  };

  const removeFrom = (text, bucket) => {
    if (submitted) return;
    if (bucket === "pillar") setPillarBucket(p => p.filter(t => t !== text));
    else setSunnahBucket(p => p.filter(t => t !== text));
  };

  const submit = () => {
    if (!allPlaced || submitted) return;
    setSubmitted(true);
  };

  const correctCount = submitted ? (() => {
    let c = 0;
    pillarBucket.forEach(t => { if (items.find(i => i.text === t)?.isPillar) c++; });
    sunnahBucket.forEach(t => { if (!items.find(i => i.text === t)?.isPillar) c++; });
    return c;
  })() : 0;

  const handleContinue = () => done(correctCount);

  /* Drag handlers */
  const onDragStart = (e, text) => {
    if (submitted) return;
    setDraggingText(text);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", text); } catch (err) {}
  };
  const onDragEnd = () => { setDraggingText(null); setHoverBucket(null); };
  const onDragOver = (e, bucket) => {
    if (submitted || !draggingText) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoverBucket(bucket);
  };
  const onDragLeave = (e) => {
    /* only clear if leaving the actual bucket box */
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setHoverBucket(null);
  };
  const onDrop = (e, bucket) => {
    e.preventDefault();
    if (submitted || !draggingText) return;
    placeIn(draggingText, bucket);
    setDraggingText(null);
    setHoverBucket(null);
  };

  const renderBucketItem = (text, bucketName, color) => {
    const item = items.find(i => i.text === text);
    const isRight = submitted ? (bucketName === "pillar" ? item?.isPillar : !item?.isPillar) : null;
    const isDragging = draggingText === text;
    return (
      <div
        key={text}
        draggable={!submitted}
        onDragStart={(e) => onDragStart(e, text)}
        onDragEnd={onDragEnd}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: submitted ? (isRight ? T.greenLight : T.coralLight) : "#fff",
          border: "1.5px solid " + (submitted ? (isRight ? T.green : T.coral) : color + "55"),
          fontFamily: F.ui, fontSize: 12.5, fontWeight: 600, color: T.navy,
          display: "flex", alignItems: "center", gap: 8,
          cursor: submitted ? "default" : "grab",
          opacity: isDragging ? 0.4 : 1,
          animation: submitted && !isRight ? (rm ? "none" : "dShake .3s") : (rm ? "none" : "dPop .25s ease"),
        }}>
        <span style={{ flex: 1, lineHeight: 1.4, userSelect: "none" }}>{text}</span>
        {submitted && <span style={{ fontSize: 14, color: isRight ? T.green : T.coral, fontWeight: 700 }}>{isRight ? "✓" : "✗"}</span>}
        {!submitted && <button onClick={() => removeFrom(text, bucketName)} aria-label="Remove" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: T.grayMed, padding: 2 }}>✕</button>}
      </div>
    );
  };

  const renderUnplaced = (item) => {
    const isDragging = draggingText === item.text;
    const isSelected = selectedText === item.text;
    return (
      <div
        key={item.text}
        draggable
        onDragStart={(e) => { setSelectedText(null); onDragStart(e, item.text); }}
        onDragEnd={onDragEnd}
        onClick={() => { if (submitted) return; setSelectedText(isSelected ? null : item.text); }}
        role="button"
        tabIndex={0}
        aria-label={item.text + (isSelected ? " (selected, tap a category)" : "")}
        style={{
          background: isSelected ? T.goldPale : "#fff",
          border: "2px solid " + (isSelected ? T.gold : T.grayLight),
          boxShadow: isSelected ? "0 4px 14px " + T.gold + "44" : "0 2px 6px rgba(0,0,0,.06)",
          borderRadius: 12,
          padding: "10px 14px",
          fontFamily: F.ui, fontSize: 13, fontWeight: 600, color: T.navy,
          cursor: "grab",
          userSelect: "none",
          opacity: isDragging ? 0.4 : 1,
          transition: rm ? "none" : "all .15s",
          transform: isSelected ? "scale(1.03)" : "scale(1)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
        <span style={{ color: T.gold, fontSize: 11 }}>⋮⋮</span>
        <span style={{ flex: 1 }}>{item.text}</span>
      </div>
    );
  };

  const renderBucket = (bucketName, label, sublabel, icon, color, bg, bucket) => {
    const isHover = hoverBucket === bucketName;
    const isPrimed = isHover || (selectedText !== null);
    return (
      <div
        onDragOver={(e) => onDragOver(e, bucketName)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, bucketName)}
        onClick={() => {
          if (selectedText && !submitted) {
            placeIn(selectedText, bucketName);
            setSelectedText(null);
          }
        }}
        role={selectedText ? "button" : undefined}
        aria-label={selectedText ? "Place in " + label : undefined}
        style={{
          background: isPrimed ? bg : bg + "66",
          border: "2.5px " + (isPrimed ? "solid" : "dashed") + " " + (isPrimed ? color : color + "66"),
          borderRadius: 16,
          padding: "16px 18px",
          minHeight: 120,
          cursor: selectedText ? "pointer" : "default",
          transition: rm ? "none" : "all .15s",
          transform: isHover ? "scale(1.01)" : "scale(1)",
          boxShadow: isHover ? "0 6px 20px " + color + "44" : (selectedText ? "0 3px 12px " + color + "22" : "none"),
          animation: selectedText && !isHover && !rm ? "dPulse 1.6s infinite" : "none",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: T.navy }}>{label}</span>
            </div>
            <div style={{ fontFamily: F.ui, fontSize: 10, color: color, marginTop: 2 }}>{sublabel}</div>
          </div>
          <div style={{ background: color, color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 13 }}>{bucket.length}</div>
        </div>
        {bucket.length === 0 ? (
          <div style={{ fontFamily: F.ui, fontSize: 11, color: T.grayMed, fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
            {activeText ? (draggingText ? "Drop here" : "Tap to place") : "Drag or tap items here"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {bucket.map(t => renderBucketItem(t, bucketName, color))}
          </div>
        )}
      </div>
    );
  };

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 2" title="Pillar or Sunnah?" /><Tag c="#fff" bg={T.purple}>SORT</Tag></div>
    <Pr>"Drag each action into the correct category, or tap an item then tap a bucket."</Pr>

    {/* Unsorted card deck */}
    {!allPlaced && (
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1.5, marginBottom: 8 }}>
          {items.filter(i => !placed.has(i.text)).length} REMAINING
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {items.filter(i => !placed.has(i.text)).map(renderUnplaced)}
        </div>
      </div>
    )}

    {/* Two big drop targets */}
    <div style={{ display: "flex", gap: 12, flexDirection: "column", marginBottom: 14 }}>
      {renderBucket("pillar", "PILLAR (Arkan)", "Miss it = prayer invalid", "🏛️", T.teal, T.tealLight, pillarBucket)}
      {renderBucket("sunnah", "SUNNAH", "Rewarded but prayer still valid", "⭐", T.gold, T.goldPale, sunnahBucket)}
    </div>

    {allPlaced && !submitted && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Submit</Btn></div>}

    {submitted && (
      <div>
        <Box color={correctCount === 8 ? T.green : T.coral} bg={correctCount === 8 ? T.greenLight : T.coralLight}>
          <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: correctCount === 8 ? T.green : T.coral, textAlign: "center" }}>
            {correctCount === 8 ? "✓ All 8 sorted correctly!" : correctCount + " of 8 correct."}
          </p>
        </Box>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          {items.map(item => {
            const placedInPillar = pillarBucket.includes(item.text);
            const isRight = (placedInPillar && item.isPillar) || (!placedInPillar && !item.isPillar);
            if (isRight) return null;
            return <div key={item.text} style={{ padding: "10px 12px", borderRadius: 10, background: T.coralLight, border: "1px solid " + T.coral + "44", fontFamily: F.ui, fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: T.coral, marginBottom: 2 }}>{item.text}</div>
              <div style={{ color: T.grayDark }}>{item.fb}</div>
            </div>;
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={handleContinue}>Continue</Btn></div>
      </div>
    )}
  </div>;
}

/* ═══ P6: TEACH RAKA'AT ═══ */
function PTeachRakaat({ nx, rm }) {
  return <div>
    <PT sub="Section C" title="How Many Raka'at?" />
    <Pr>Now that you know what one rak'ah looks like, the question is: how many per prayer?</Pr>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0" }}>
      {RAKAAT.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#fff", border: "1.5px solid " + T.tealLight, borderLeft: "4px solid " + T.teal, borderRadius: 14 }}>
          <div>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 14, color: T.navy }}>{r.prayer}</div>
            <div style={{ fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>{r.time}</div>
          </div>
          <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 900, color: T.gold }}>{r.count}</div>
        </div>
      ))}
    </div>
    {/* Total */}
    <div style={{ textAlign: "center", margin: "20px 0", padding: "24px 20px", background: "linear-gradient(135deg," + T.navy + "," + T.navyDeep + ")", borderRadius: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .08, background: "radial-gradient(circle at 50% 50%," + T.gold + ",transparent 60%)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: F.ui, fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: 2, marginBottom: 4 }}>DAILY TOTAL</div>
        <div style={{ fontFamily: F.display, fontSize: 42, fontWeight: 900, color: T.gold }}>17</div>
        <div style={{ fontFamily: F.body, fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>raka'at every single day</div>
      </div>
    </div>
    <Pr>2 + 4 + 4 + 3 + 4 = 17. That is 17 times you bow and prostrate before Allah daily.</Pr>
    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Test My Memory</Btn></div>
  </div>;
}

/* ═══ P7: Q3 MATCH PRAYER TO RAKA'AT ═══ */
function PQ3Match({ done, rm }) {
  const [placements, setPlacements] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState(null);
  const options = [2, 3, 4];

  const place = (prayerIdx) => {
    if (submitted || selected === null) return;
    setPlacements(p => ({ ...p, [prayerIdx]: selected }));
    setSelected(null);
  };

  const allPlaced = Object.keys(placements).length === 5;
  const submit = () => {
    if (!allPlaced || submitted) return;
    setSubmitted(true);
  };
  const correctCount = submitted ? RAKAAT.filter((r, i) => placements[i] === r.count).length : 0;
  const handleContinue = () => done(correctCount);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 3" title="How Many Raka'at?" /><Tag c="#fff" bg={T.teal}>SORT</Tag></div>
    <Pr>"Assign the correct number of raka'at to each prayer."</Pr>

    {/* Number selector */}
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
      {options.map(n => (
        <button key={n} onClick={() => setSelected(selected === n ? null : n)} disabled={submitted}
          style={{ width: 50, height: 50, borderRadius: "50%", border: "2.5px solid " + (selected === n ? T.gold : T.grayLight), background: selected === n ? T.goldPale : "#fff", fontFamily: F.display, fontSize: 22, fontWeight: 900, color: selected === n ? T.gold : T.navy, cursor: submitted ? "default" : "pointer", transition: "all .15s" }}>
          {n}
        </button>
      ))}
    </div>
    {!submitted && <div style={{ fontFamily: F.ui, fontSize: 11, color: T.grayMed, textAlign: "center", marginBottom: 12 }}>{selected ? "Now tap a prayer to assign " + selected + " raka'at" : "Select a number, then tap a prayer"}</div>}

    {/* Prayer slots */}
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {RAKAAT.map((r, i) => {
        const val = placements[i];
        const hasVal = val !== undefined;
        const isCorrect = submitted ? val === r.count : null;
        return <button key={i} onClick={() => { if (!submitted && !hasVal) place(i); else if (!submitted && hasVal) { setPlacements(p => { const n = { ...p }; delete n[i]; return n; }); } }}
          disabled={submitted}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: submitted ? (isCorrect ? T.greenLight : T.coralLight) : hasVal ? T.goldPale : (selected ? T.tealLight : "#fff"), border: "2px " + (hasVal || submitted ? "solid" : "dashed") + " " + (submitted ? (isCorrect ? T.green : T.coral) : hasVal ? T.gold : selected ? T.teal : T.grayMed), borderRadius: 12, cursor: submitted ? "default" : "pointer", transition: rm ? "none" : "all .15s" }}>
          <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 14, color: T.navy }}>{r.prayer}</span>
          <span style={{ fontFamily: F.display, fontSize: 24, fontWeight: 900, color: submitted ? (isCorrect ? T.green : T.coral) : hasVal ? T.gold : T.grayMed }}>
            {hasVal ? val : "?"}
            {submitted && <span style={{ fontSize: 14, marginLeft: 6 }}>{isCorrect ? "✓" : "✗ (" + r.count + ")"}</span>}
          </span>
        </button>;
      })}
    </div>

    {allPlaced && !submitted && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Submit</Btn></div>}
    {submitted && <>
      <Box color={correctCount === 5 ? T.green : T.coral} bg={correctCount === 5 ? T.greenLight : T.coralLight}>
        <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: correctCount === 5 ? T.green : T.coral }}>{correctCount === 5 ? "✓ All five correct!" : correctCount + " of 5. Fajr=2, Dhuhr=4, 'Asr=4, Maghrib=3, 'Isha'=4."}</p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </>}
  </div>;
}

/* ═══ P8: Q4 RAPID FIRE ═══ */
function PQ4Rapid({ done, rm }) {
  const questions = useMemo(() => shuffle(RAPID), []);
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [all, setAll] = useState([]);
  const [tmr, setTmr] = useState(100);
  const tR = useRef(null);
  const answered = useRef(false);

  useEffect(() => {
    if (idx >= questions.length || result) return;
    answered.current = false; setTmr(100);
    const s = Date.now();
    tR.current = setInterval(() => {
      const r = Math.max(0, 100 - ((Date.now() - s) / 3000) * 100);
      setTmr(r);
      if (r <= 0 && !answered.current) {
        answered.current = true; clearInterval(tR.current);
        setResult({ ok: false, exp: "Time's up! " + questions[idx].exp });
        setAll(p => [...p, false]);
        setTimeout(() => { setResult(null); if (idx + 1 >= questions.length) done([...all, false].filter(Boolean).length); else setIdx(i => i + 1); }, 2200);
      }
    }, 50);
    return () => clearInterval(tR.current);
  }, [idx, result]);

  const ans = (a) => {
    if (answered.current) return;
    answered.current = true; clearInterval(tR.current);
    const q = questions[idx]; const ok = a === q.answer;
    setResult({ ok, exp: q.exp }); setAll(p => [...p, ok]);
    setTimeout(() => { setResult(null); if (idx + 1 >= questions.length) done([...all, ok].filter(Boolean).length); else setIdx(i => i + 1); }, ok ? 1400 : 2200);
  };

  if (idx >= questions.length) return null;
  const q = questions[idx];
  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 4" title="Rapid Fire" /><Tag c="#fff" bg={T.magenta}>PLAY</Tag></div>
    {!result && <div style={{ height: 4, background: T.grayLight, borderRadius: 4, marginBottom: 14, overflow: "hidden" }}><div style={{ height: "100%", background: "linear-gradient(90deg," + T.gold + "," + T.teal + ")", width: tmr + "%", transition: rm ? "none" : "width .1s linear", borderRadius: 4 }} /></div>}
    <div style={{ fontFamily: F.ui, fontSize: 10, color: T.grayMed, marginBottom: 8 }}>{idx + 1}/5</div>
    {!result ? <>
      <div style={{ background: "#fff", border: "1.5px solid " + T.grayLight, borderRadius: 16, padding: "30px 22px", textAlign: "center", fontFamily: F.display, fontSize: 18, color: T.navy, boxShadow: "0 4px 16px " + T.gold + "10", marginBottom: 18 }}>{q.text}</div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        <Btn onClick={() => ans(true)} style={{ background: T.green, color: "#fff", padding: "14px 36px", fontSize: 16, border: "none" }}>TRUE</Btn>
        <Btn onClick={() => ans(false)} style={{ background: T.coral, color: "#fff", padding: "14px 36px", fontSize: 16, border: "none" }}>FALSE</Btn>
      </div>
    </> : <Box color={result.ok ? T.green : T.coral} bg={result.ok ? T.greenLight : T.coralLight}>
      <div style={{ textAlign: "center", fontSize: 22, marginBottom: 4 }}>{result.ok ? "✓" : "✗"}</div>
      <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5, textAlign: "center" }}>{result.exp}</p>
    </Box>}
  </div>;
}

/* ═══ P9: Q5 MC SCENARIO ═══ */
function PQ5MC({ done, rm }) {
  const [sel, setSel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const options = useMemo(() => shuffle(MC_SCENARIO.options), []);
  const correctIdx = options.findIndex(o => o.correct);

  const submit = () => { if (sel === null || submitted) return; setSubmitted(true); };
  const userCorrect = submitted && options[sel]?.correct;
  const handleContinue = () => done(userCorrect ? 1 : 0);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 5" title="Scenario" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <Box color={T.navy} bg={T.goldPale} style={{ padding: "18px 20px" }}>
      <Pr><strong style={{ color: T.navy }}>Scenario:</strong> {MC_SCENARIO.prompt}</Pr>
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
    {submitted && !userCorrect && <div>
      <Box color={T.coral} bg={T.coralLight}><p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.coral }}>✗ Not quite</p><p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[sel]?.fb}</p></Box>
      <Box color={T.green} bg={T.greenLight}><p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>The answer:</p><p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[correctIdx].fb}</p></Box>
      <div style={{ textAlign: "center", marginTop: 12 }}><Btn onClick={handleContinue}>Continue</Btn></div>
    </div>}
  </div>;
}

/* ═══ P10: KEY TAKEAWAY ═══ */
function PTakeaway({ nx }) {
  return <div>
    <div style={{ background: "linear-gradient(135deg," + T.gold + "12," + T.goldPale + ")", border: "2.5px solid " + T.gold, borderRadius: 20, padding: "30px 26px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle," + T.gold + "22,transparent 70%)", borderRadius: "50%" }} />
      <SL icon="🔑" text="Key Takeaway" color={T.gold} />
      <p style={{ fontFamily: F.display, fontSize: 19, fontWeight: 700, color: T.navy, lineHeight: 1.6, margin: "0 0 10px" }}>A rak'ah is the building block of every prayer.</p>
      <p style={{ fontFamily: F.body, fontSize: 14.5, lineHeight: 1.8, color: T.grayDark, margin: 0 }}>Master it once: stand, bow, rise, prostrate, sit, prostrate again. The structure is identical across all five prayers. Only the number of repetitions changes: 2, 4, 4, 3, 4. Seventeen daily conversations with your Lord.</p>
    </div>
    <div style={{ textAlign: "center", marginTop: 28 }}><Btn onClick={nx}>See My Results</Btn></div>
  </div>;
}

/* ═══ P11: CHECKPOINT ═══ */
function PCheckpoint({ scores, total, rm }) {
  const maxScore = 25;
  const pct = Math.round((total / maxScore) * 100);
  const pass = pct >= 60;
  const [showConf, setShowConf] = useState(pass);
  const [conf, setConf] = useState(3);
  const colors = [T.gold, T.teal, T.green, T.coral, T.purple];
  useEffect(() => { if (pass) setTimeout(() => setShowConf(false), 2500); }, [pass]);

  const concepts = [
    { name: "Rak'ah sequence", ok: scores.q1 >= 4 },
    { name: "Arkan vs sunnah", ok: scores.q2 >= 6 },
    { name: "Raka'at per prayer", ok: scores.q3 >= 4 },
    { name: "Core facts (rapid fire)", ok: scores.q4 >= 3 },
    { name: "Applying pillar rules (scenario)", ok: scores.q5 >= 1 },
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
        <div style={{ fontFamily: F.ui, fontWeight: 700, color: pass ? T.green : T.coral, fontSize: 14 }}>{pass ? "Great foundation! Ready for Lesson 4." : "You are close! Review below."}</div>
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
      <Box color={T.teal} bg={T.tealLight} style={{ borderRadius: 12 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13, color: T.teal, marginBottom: 3 }}>Next: Lesson 4 - "The Words That Rise"</div>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 12.5, color: T.grayDark, lineHeight: 1.7 }}>You know the movements. Next, learn what you SAY at each position, and what those words mean.</p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 18 }}><Btn style={{ minWidth: 240, fontSize: 15, padding: "15px 40px" }}>{pass ? "Continue to Lesson 4" : "Review Lesson"}</Btn></div>
    </div>
  </div>;
}
