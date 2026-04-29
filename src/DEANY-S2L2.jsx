import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DEANY Module S2 Lesson 2: "Before You Pray"
   Wudu, prerequisites, and what breaks purification.
   Maliki madhab (unnamed at Beginner tier).
   Sahih al-Bukhari / Sahih Muslim ONLY.
   Pipeline: Blueprint -> JSX (zero content decisions).
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
const F = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  ui: "'DM Sans', sans-serif",
  ar: "'Amiri', serif",
};

/* ─── FARD vs SUNNAH teaching data ─── */
const FARD_ACTS = [
  { name: "Intention (niyyah)", desc: "In your heart, not spoken aloud. You must intend to purify yourself for prayer." },
  { name: "Washing the face", desc: "From the hairline to the chin, from ear to ear." },
  { name: "Washing the arms to the elbows", desc: "Including the elbows. Fingertips all the way up." },
  { name: "Wiping the entire head", desc: "The whole head must be wiped, front to back. Not just a part of it." },
  { name: "Washing the feet to the ankles", desc: "Including the ankles. Washed, not wiped." },
  { name: "Rubbing (dalk)", desc: "You must rub each limb as you wash it, not just let water flow over it." },
  { name: "Continuity (muwalat)", desc: "Do the steps without long pauses. One flows into the next." },
];

const SUNNAH_ACTS = [
  { name: "Washing the hands first", desc: "Three times at the start, before putting them into the water vessel." },
  { name: "Rinsing the mouth", desc: "Three times. Recommended but your wudu is valid without it." },
  { name: "Rinsing the nose", desc: "Three times. Recommended but your wudu is valid without it." },
  { name: "Wiping the ears", desc: "After wiping the head. Inside with the index finger, outside with the thumb." },
  { name: "Repeating washings three times", desc: "Once is the minimum for each obligatory washing. Three times is the sunnah." },
  { name: "Starting with the right side", desc: "Wash the right arm before the left, the right foot before the left." },
];

/* ─── PREREQUISITES ─── */
const PREREQS = [
  { name: "Islam", desc: "You must be Muslim (covered in Module S1)." },
  { name: "Sanity and consciousness", desc: "You must be aware of what you are doing." },
  { name: "Purity (wudu)", desc: "You must be in a state of ritual purity." },
  { name: "Correct time", desc: "Each prayer has its window. You cannot pray Fajr at noon." },
  { name: "Facing the qiblah", desc: "You pray towards the Ka'bah in Makkah." },
];

/* ─── Q1: FILL IN THE BLANK ─── */
const BLANKS = [
  { label: "Before praying, a Muslim must be in a state of", correct: "purity (wudu)", options: ["purity (wudu)", "fasting", "meditation", "silence"] },
  { label: "face the", correct: "qiblah", options: ["qiblah", "mosque", "sun", "east"] },
  { label: "in Makkah, and pray within the correct", correct: "time window", options: ["time window", "lunar month", "season", "location"] },
];

/* ─── Q2: BODY HOTSPOT (all zones defined in SVG coordinates, 200x400 viewBox) ─── */
const BODY_ZONES = [
  { id: "head", label: "Head", type: "fard", fb: "Obligatory. The entire head must be wiped, front to back." },
  { id: "face", label: "Face", type: "fard", fb: "Obligatory. From hairline to chin, ear to ear." },
  { id: "leftArm", label: "Left Arm", type: "fard", fb: "Obligatory. Fingertips to elbows, including the elbows." },
  { id: "rightArm", label: "Right Arm", type: "fard", fb: "Obligatory. Fingertips to elbows, including the elbows." },
  { id: "leftHand", label: "Left Hand", type: "sunnah", fb: "Sunnah. Washing the hands first is recommended, not obligatory." },
  { id: "rightHand", label: "Right Hand", type: "sunnah", fb: "Sunnah. Washing the hands first is recommended, not obligatory." },
  { id: "mouth", label: "Mouth/Nose", type: "sunnah", fb: "Sunnah. Rinsing mouth and nose is recommended, not obligatory." },
  { id: "leftFoot", label: "Left Foot", type: "fard", fb: "Obligatory. Including the ankles. Washed, not wiped." },
  { id: "rightFoot", label: "Right Foot", type: "fard", fb: "Obligatory. Including the ankles. Washed, not wiped." },
  { id: "chest", label: "Chest", type: "none", fb: "Not part of wudu. The chest is covered in ghusl (full body wash), not wudu." },
  { id: "leftKnee", label: "Left Knee", type: "none", fb: "Not part of wudu. Wudu stops at the elbows and ankles." },
  { id: "rightKnee", label: "Right Knee", type: "none", fb: "Not part of wudu. Wudu stops at the elbows and ankles." },
];

/* ─── Q3: SWIPE (WUDU BREAKERS) ─── */
const SWIPE_CARDS = [
  { text: "Eating food", breaksWudu: false, rightFb: "Eating does not break wudu. You are still pure after a meal.", wrongFb: "Actually, eating does not break wudu. You are still pure after a meal." },
  { text: "Using the bathroom", breaksWudu: true, rightFb: "Correct. Anything that exits the private parts breaks wudu.", wrongFb: "Using the bathroom does break wudu. Anything exiting the private parts invalidates it." },
  { text: "Sleeping deeply", breaksWudu: true, rightFb: "Yes. Deep sleep breaks wudu because you lose awareness of your state.", wrongFb: "Deep sleep does break wudu. You lose awareness of your state." },
  { text: "Touching water", breaksWudu: false, rightFb: "Water does not break wudu. Water IS what wudu uses.", wrongFb: "Water does not break wudu. That would make wudu impossible." },
  { text: "Bleeding from a small cut", breaksWudu: false, rightFb: "Correct. Minor bleeding does not break wudu.", wrongFb: "Minor bleeding does not break wudu. Your purification remains valid." },
  { text: "Passing gas", breaksWudu: true, rightFb: "Yes. This is explicitly mentioned as something that breaks wudu.", wrongFb: "Passing gas does break wudu. It is explicitly mentioned in the hadith." },
];

/* ─── Q5: T/F ─── */
const TF_STATEMENT = "You can pray salah facing any direction as long as you have wudu.";
const TF_ANSWER = false;
const TF_FEEDBACK = "Facing the qiblah is one of the five prerequisites. Without it, the prayer is not valid.";

/* ─── Q6: MC SCENARIO ─── */
const MC_SCENARIO = {
  prompt: "Amina made wudu at home. She then sat on the couch and fell asleep for about five minutes. When she woke up, she went straight to the mosque to pray. Does she need to make wudu again?",
  options: [
    { id: "A", text: "No, five minutes is too short to matter.", correct: false, fb: "The length of sleep is not the issue. What matters is whether you lost awareness of your state. A brief nap where you are deeply asleep still breaks wudu." },
    { id: "B", text: "Yes, because sleeping breaks wudu.", correct: true, fb: "Correct! Sleep where you lose awareness of your body breaks wudu, even if it was only a few minutes. Amina needs to make wudu again before praying." },
    { id: "C", text: "No, wudu only breaks if you use the bathroom.", correct: false, fb: "Using the bathroom is one thing that breaks wudu, but it is not the only thing. Deep sleep, passing gas, and loss of consciousness also break it." },
    { id: "D", text: "It depends on whether she was lying down.", correct: false, fb: "The position does not determine it. What matters is whether she lost awareness. Falling asleep on a couch still counts." },
  ],
};

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export default function DEANYS2L2({ onBack, onHome }) {
  const savedPage = useMemo(() => { try { const d = localStorage.getItem("deany-progress-s2-l2"); return d ? (JSON.parse(d).page || 0) : 0; } catch { return 0; } }, []);
  const [page, setPage] = useState(savedPage);
  const [scores, setScores] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 });
  const [rm, setRm] = useState(false);
  const ref = useRef(null);

  useEffect(() => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); setRm(m.matches); m.addEventListener("change", e => setRm(e.matches)); }, []);

  const go = useCallback((p) => {
    setPage(p);
    try { localStorage.setItem("deany-progress-s2-l2", JSON.stringify({ page: p })); } catch {}
    if (ref.current) ref.current.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
  }, [rm]);
  const nx = useCallback(() => go(page + 1), [page, go]);

  const totalPages = 13;
  const prog = Math.min(100, Math.round(((page + 1) / totalPages) * 100));
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const pages = [
    <PBridge key={0} nx={nx} rm={rm} />,
    <PPrereqs key={1} nx={nx} rm={rm} />,
    <PQ1Fill key={2} done={s => { setScores(p => ({ ...p, q1: s })); nx(); }} rm={rm} />,
    <PWuduDiscovery key={3} nx={nx} rm={rm} />,
    <PWuduTeach key={4} nx={nx} rm={rm} />,
    <PQ2Hotspot key={5} done={s => { setScores(p => ({ ...p, q2: s })); nx(); }} rm={rm} />,
    <PBreakers key={6} nx={nx} rm={rm} />,
    <PQ3Swipe key={7} done={s => { setScores(p => ({ ...p, q3: s })); nx(); }} rm={rm} />,
    <PQ4Sequence key={8} done={s => { setScores(p => ({ ...p, q4: s })); nx(); }} rm={rm} />,
    <PQ5TF key={9} done={s => { setScores(p => ({ ...p, q5: s })); nx(); }} rm={rm} />,
    <PQ6MC key={10} done={s => { setScores(p => ({ ...p, q6: s })); nx(); }} rm={rm} />,
    <PTakeaway key={11} nx={nx} rm={rm} />,
    <PCheckpoint key={12} scores={scores} total={totalScore} rm={rm} />,
  ];

  return (
    <div ref={ref} style={{ minHeight: "100vh", background: T.cream, position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, opacity: 0.025, pointerEvents: "none", background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C5A55A' stroke-width='.5'/%3E%3C/svg%3E")` }} />
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: T.cream + "ee", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid " + T.gold + "22" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} aria-label="Back to lessons" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 2px", display: "flex", alignItems: "center", color: T.grayMed }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: 2 }}>S2.2</span>
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
        @keyframes dPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes dSlide{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
        @keyframes dShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes dConfetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(260px) rotate(400deg);opacity:0}}
        @keyframes dPop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
        *{box-sizing:border-box}input[type=range]{accent-color:${T.gold}}
      `}</style>
    </div>
  );
}

/* ─── SHARED COMPONENTS ─── */
const Btn = ({ children, onClick, v = "gold", style: s, disabled: d, ...r }) => {
  const vs = { gold: { background: "linear-gradient(135deg," + T.gold + ",#D4B56A)", color: T.navy, boxShadow: "0 4px 16px " + T.gold + "44", border: "none" }, teal: { background: T.tealLight, color: T.teal, border: "1.5px solid " + T.teal }, ghost: { background: "transparent", color: T.navy, border: "1.5px solid " + T.gold } };
  return <button disabled={d} onClick={onClick} style={{ borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 700, fontFamily: F.ui, cursor: d ? "default" : "pointer", transition: "all .2s", opacity: d ? .5 : 1, ...vs[v], ...s }} {...r}>{children}</button>;
};
const Box = ({ color: c, bg, children, style: s }) => <div style={{ border: "2px solid " + c, background: bg, borderRadius: 16, padding: "20px 24px", margin: "18px 0", position: "relative", overflow: "hidden", ...s }}>{children}</div>;
const Tag = ({ children, c, bg }) => <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: bg || c, color: bg ? c : "#fff", letterSpacing: .5 }}>{children}</span>;
const SL = ({ icon, text, color: c }) => <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: c, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{icon} {text}</div>;
const PT = ({ sub, title, accent }) => <div style={{ marginBottom: 24 }}>{sub && <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 600, color: accent || T.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{sub}</div>}<h2 style={{ fontFamily: F.display, fontSize: 26, fontWeight: 700, color: T.navy, margin: 0, lineHeight: 1.3 }}>{title}</h2></div>;
const Pr = ({ children }) => <p style={{ fontFamily: F.body, fontSize: 15.5, lineHeight: 1.8, color: T.grayDark, margin: "0 0 14px" }}>{children}</p>;

/* ═══ P0: BRIDGE ═══ */
function PBridge({ nx, rm }) {
  return <div>
    <div style={{ background: "linear-gradient(135deg," + T.navy + "," + T.navyDeep + ")", borderRadius: 24, padding: "48px 28px 40px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .08, background: "radial-gradient(circle at 80% 20%," + T.teal + ",transparent 50%),radial-gradient(circle at 20% 80%," + T.gold + ",transparent 50%)" }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 600, color: T.gold, letterSpacing: 3 }}>LESSON S2.2</div>
        <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 900, color: "#fff", margin: "8px 0", lineHeight: 1.2 }}>"Before You Pray"</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontFamily: F.ui, fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 14 }}>
          <span>12 min</span><span>6 questions</span><span>Level 1-3</span>
        </div>
      </div>
    </div>
    <Box color={T.teal} bg={T.tealLight}><SL icon="🔗" text="Bridge" color={T.teal} />
      <Pr>In Lesson 1, you learned that salah is your daily appointment with Allah. Five times a day, you stand before Him.</Pr>
      <Pr>But you do not just walk up and start. <strong style={{ color: T.navy }}>There are things you need to do first</strong>, and things that need to be true before your prayer is valid.</Pr>
    </Box>
    <Box color={T.gold} bg={T.goldLight}><SL icon="🎯" text="Objective" color={T.gold} />
      <div style={{ fontFamily: F.body, fontSize: 14.5, color: T.grayDark }}>
        <p style={{ margin: "0 0 4px", fontWeight: 600, color: T.navy }}>By the end, you will be able to:</p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
          <li>List the 5 prerequisites for a valid prayer.</li>
          <li>Perform the wudu sequence in the correct order.</li>
          <li>Identify what breaks wudu and what does not.</li>
        </ol>
      </div>
    </Box>
    <div style={{ textAlign: "center", marginTop: 28 }}><Btn onClick={nx}>Let's Begin</Btn></div>
  </div>;
}

/* ═══ P1: FIVE PREREQUISITES ═══ */
function PPrereqs({ nx, rm }) {
  const [revealed, setRevealed] = useState(0);
  return <div>
    <PT sub="Section A" title="The Entry Checklist" />
    <Pr>Before a single movement of prayer, five conditions must be met. Think of them as your entry checklist.</Pr>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0" }}>
      {PREREQS.map((p, i) => {
        const show = i <= revealed;
        return <div key={i} onClick={() => { if (i === revealed && revealed < PREREQS.length - 1) setRevealed(revealed + 1); }}
          style={{ background: show ? T.goldPale : "#fff", border: "2px solid " + (show ? T.gold : T.grayLight), borderLeft: "4px solid " + (show ? T.gold : T.grayLight), borderRadius: 14, padding: "14px 18px", cursor: i === revealed && revealed < PREREQS.length - 1 ? "pointer" : "default", opacity: show ? 1 : .4, transition: rm ? "none" : "all .25s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ background: show ? T.gold : T.grayLight, color: show ? "#fff" : T.grayMed, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
            <div>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 14, color: T.navy }}>{p.name}</div>
              {show && <div style={{ fontFamily: F.body, fontSize: 13, color: T.grayDark, marginTop: 2, animation: rm ? "none" : "dSlide .2s" }}>{p.desc}</div>}
            </div>
          </div>
        </div>;
      })}
    </div>
    {revealed < PREREQS.length - 1 && <div style={{ textAlign: "center", fontFamily: F.ui, fontSize: 12, color: T.grayMed, fontStyle: "italic" }}>Tap each to reveal</div>}
    {revealed >= PREREQS.length - 1 && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={nx}>Test What I've Learned</Btn></div>}
  </div>;
}

/* ═══ P2: Q1 FILL IN THE BLANK ═══ */
function PQ1Fill({ done, rm }) {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (idx, val) => { if (submitted) return; const n = [...answers]; n[idx] = val; setAnswers(n); };
  const allFilled = answers.every(a => a !== "");
  const submit = () => {
    if (!allFilled || submitted) return;
    setSubmitted(true);
    const correct = answers.filter((a, i) => a === BLANKS[i].correct).length;
    setTimeout(() => done(correct), 2500);
  };
  const score = answers.filter((a, i) => a === BLANKS[i].correct).length;

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 1" title="Complete the Sentence" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <Pr>"Fill in the blanks to complete the prerequisites for prayer."</Pr>
    <div style={{ background: "#fff", border: "2px solid " + T.grayLight, borderRadius: 16, padding: "24px 20px", lineHeight: 2.2, fontFamily: F.body, fontSize: 15, color: T.grayDark }}>
      {BLANKS.map((b, i) => (
        <span key={i}>
          {b.label}{" "}
          <select
            value={answers[i]}
            onChange={e => setAnswer(i, e.target.value)}
            disabled={submitted}
            aria-label={"Blank " + (i + 1)}
            style={{
              fontFamily: F.ui, fontSize: 13, fontWeight: 600, padding: "4px 8px", borderRadius: 8,
              border: "2px solid " + (submitted ? (answers[i] === b.correct ? T.green : T.coral) : answers[i] ? T.gold : T.grayMed),
              background: submitted ? (answers[i] === b.correct ? T.greenLight : T.coralLight) : answers[i] ? T.goldPale : "#fff",
              color: T.navy, cursor: submitted ? "default" : "pointer",
            }}
          >
            <option value="">___</option>
            {b.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {i < BLANKS.length - 1 ? ", " : "."}
        </span>
      ))}
    </div>
    {!submitted && allFilled && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Check Answer</Btn></div>}
    {submitted && <Box color={score === 3 ? T.green : T.coral} bg={score === 3 ? T.greenLight : T.coralLight}>
      <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: score === 3 ? T.green : T.coral }}>{score === 3 ? "✓ All three correct!" : score + " of 3 correct."}</p>
      {score < 3 && <p style={{ margin: "6px 0 0", fontFamily: F.body, fontSize: 13.5 }}>The answers: purity (wudu), qiblah, time window.</p>}
    </Box>}
  </div>;
}

/* ═══ P3: WUDU DISCOVERY (FARD STEPS ONLY - sunnah not yet taught) ═══ */
function PWuduDiscovery({ nx, rm }) {
  const FARD_STEPS = [
    { id: 0, name: "Wash face", icon: "😌" },
    { id: 1, name: "Wash arms to elbows", icon: "💪" },
    { id: 2, name: "Wipe entire head", icon: "🫳" },
    { id: 3, name: "Wash feet to ankles", icon: "🦶" },
  ];
  const shuffled = useMemo(() => shuffle(FARD_STEPS), []);
  const [order, setOrder] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const addStep = (step) => { if (submitted || order.find(s => s.id === step.id)) return; setOrder([...order, step]); };
  const removeStep = (idx) => { if (submitted) return; setOrder(order.filter((_, i) => i !== idx)); };

  const submit = () => {
    if (order.length !== 4 || submitted) return;
    setSubmitted(true);
  };

  const results = submitted ? order.map((s, i) => s.id === i) : null;
  const correctCount = results ? results.filter(Boolean).length : 0;
  const usedIds = new Set(order.map(s => s.id));

  return <div>
    <PT sub="Discovery Moment" title="Build the Wudu Sequence" accent={T.purple} />
    <Box color={T.purple} bg="#F8F4FD" style={{ padding: "16px 20px" }}>
      <Pr><strong style={{ color: T.purple }}>Before we teach you the details</strong>, see if you can figure out the order. These are the four essential parts of wudu. Tap them in the order you think they happen.</Pr>
    </Box>

    {/* Available steps */}
    <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1, marginTop: 20, marginBottom: 8 }}>THE FOUR ESSENTIAL STEPS</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {shuffled.map(step => {
        const used = usedIds.has(step.id);
        return <button key={step.id} disabled={used || submitted} onClick={() => addStep(step)}
          style={{ background: used ? T.grayLight : "#fff", border: "1.5px solid " + (used ? T.grayLight : T.teal), borderRadius: 10, padding: "10px 14px", fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: used ? T.grayMed : T.teal, cursor: used || submitted ? "default" : "pointer", opacity: used ? .3 : 1, transition: "all .15s" }}>
          {step.icon} {step.name}
        </button>;
      })}
    </div>

    {/* Your sequence */}
    <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1, marginBottom: 8 }}>YOUR SEQUENCE</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 60 }}>
      {order.length === 0 && <div style={{ fontFamily: F.ui, fontSize: 13, color: T.grayMed, fontStyle: "italic", padding: 16, textAlign: "center", border: "2px dashed " + T.grayLight, borderRadius: 12 }}>Tap steps above to build your sequence</div>}
      {order.map((step, i) => (
        <div key={step.id} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
          background: submitted ? (results[i] ? T.greenLight : T.coralLight) : T.goldPale,
          border: "2px solid " + (submitted ? (results[i] ? T.green : T.coral) : T.gold),
          animation: submitted && !results[i] ? (rm ? "none" : "dShake .3s") : "none",
        }}>
          <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: submitted ? (results[i] ? T.green : T.coral) : T.navy, width: 22, textAlign: "center" }}>{i + 1}</span>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: T.navy, flex: 1 }}>{step.icon} {step.name}</span>
          {submitted && <span style={{ fontSize: 14 }}>{results[i] ? "✓" : "✗"}</span>}
          {!submitted && <button onClick={() => removeStep(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.grayMed, padding: 4 }} aria-label={"Remove " + step.name}>✕</button>}
        </div>
      ))}
    </div>

    {!submitted && order.length === 4 && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Check My Order</Btn></div>}
    {submitted && <div>
      <Box color={correctCount === 4 ? T.green : T.gold} bg={correctCount === 4 ? T.greenLight : T.goldPale}>
        <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: correctCount === 4 ? T.green : T.navy }}>
          {correctCount === 4 ? "Perfect sequence!" : correctCount + " of 4 in the right position."}
        </p>
        {correctCount < 4 && <p style={{ margin: "6px 0 0", fontFamily: F.body, fontSize: 13.5, color: T.grayDark }}>The correct order: Face, arms, head, then feet.</p>}
      </Box>
      <Pr>These four are the obligatory parts of wudu. But there is more to it. Next, you will learn which steps are obligatory and which are recommended.</Pr>
      <div style={{ textAlign: "center", marginTop: 10 }}><Btn onClick={nx}>Learn the Full Picture</Btn></div>
    </div>}
  </div>;
}

/* ═══ P4: WUDU TEACHING (FARD vs SUNNAH) ═══ */
function PWuduTeach({ nx, rm }) {
  return <div>
    <PT sub="Section B" title="The Wudu Sequence" />
    <Pr>Not all parts of wudu carry the same weight. Some are <strong style={{ color: T.navy }}>obligatory (fard)</strong>: skip them and your wudu is invalid. Others are <strong style={{ color: T.gold }}>recommended (sunnah)</strong>: doing them earns reward and follows the Prophet's ﷺ example, but your wudu is still valid without them.</Pr>

    {/* FARD section */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ background: T.teal, color: "#fff", padding: "4px 12px", borderRadius: 8, fontFamily: F.ui, fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>OBLIGATORY (FARD)</span>
        <span style={{ fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>Skip any of these and wudu is invalid</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FARD_ACTS.map((act, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: T.tealLight, border: "1.5px solid " + T.teal, borderLeft: "4px solid " + T.teal, borderRadius: 12 }}>
            <span style={{ background: T.teal, color: "#fff", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</span>
            <div>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13.5, color: T.navy }}>{act.name}</div>
              <div style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayDark, marginTop: 2 }}>{act.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* SUNNAH section */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ background: T.gold, color: "#fff", padding: "4px 12px", borderRadius: 8, fontFamily: F.ui, fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>RECOMMENDED (SUNNAH)</span>
        <span style={{ fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>Rewarded but wudu is valid without them</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SUNNAH_ACTS.map((act, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: T.goldPale, border: "1.5px solid " + T.gold + "66", borderLeft: "4px solid " + T.gold, borderRadius: 12 }}>
            <span style={{ background: T.gold, color: "#fff", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>+</span>
            <div>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13.5, color: T.navy }}>{act.name}</div>
              <div style={{ fontFamily: F.body, fontSize: 12.5, color: T.grayDark, marginTop: 2 }}>{act.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Box color={T.teal} bg={T.tealLight}><SL icon="📖" text="Hadith" color={T.teal} />
      <p style={{ fontFamily: F.body, fontSize: 15, fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.8 }}>"When a Muslim servant washes his face in the course of wudu, every sin that he committed with his eyes will be washed away with the last drop of water."</p>
      <p style={{ margin: 0, fontFamily: F.ui, fontSize: 11, color: T.grayMed }}>(Sahih Muslim 244)</p>
    </Box>
    <Pr>Wudu is not just physical cleaning. Every limb you wash carries away the sins associated with it. Purification of the body and the soul at once.</Pr>
    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Test What I've Learned</Btn></div>
  </div>;
}

/* ═══ P5: Q2 HOTSPOT BODY TAP (FARD vs SUNNAH vs NOT WUDU) ═══ */
function PQ2Hotspot({ done, rm }) {
  const [tapped, setTapped] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [lastTap, setLastTap] = useState(null);

  const tap = (zoneId) => {
    if (submitted) return;
    setLastTap(zoneId);
    setTimeout(() => setLastTap(null), 400);
    setTapped(p => {
      const n = { ...p };
      if (n[zoneId]) delete n[zoneId]; else n[zoneId] = true;
      return n;
    });
  };

  const submit = () => {
    setSubmitted(true);
    const fardTapped = BODY_ZONES.filter(z => z.type === "fard" && tapped[z.id]).length;
    const sunnahTapped = BODY_ZONES.filter(z => z.type === "sunnah" && tapped[z.id]).length;
    const wrongTapped = BODY_ZONES.filter(z => z.type === "none" && tapped[z.id]).length;
    const score = Math.max(0, fardTapped * 1 + sunnahTapped * 0.5 - wrongTapped);
    setTimeout(() => done(score), 3500);
  };

  const tappedCount = Object.keys(tapped).length;
  const tc = (type) => type === "fard" ? T.teal : type === "sunnah" ? T.gold : T.coral;
  const tbg = (type) => type === "fard" ? T.tealLight : type === "sunnah" ? T.goldPale : T.coralLight;
  const tl = (type) => type === "fard" ? "FARD" : type === "sunnah" ? "SUNNAH" : "NOT WUDU";

  /* Zone fill logic */
  const zoneFill = (z) => {
    const on = tapped[z.id];
    if (submitted) {
      if (on) return tc(z.type) + "55";
      if (z.type !== "none") return T.gold + "22"; /* missed wudu zone */
      return "transparent";
    }
    if (on) return T.teal + "35";
    return "transparent";
  };
  const zoneStroke = (z) => {
    const on = tapped[z.id];
    if (submitted) return on ? tc(z.type) : (z.type !== "none" ? T.gold + "66" : "transparent");
    if (on) return T.teal;
    return T.grayMed + "55";
  };
  const zoneStrokeW = (z) => tapped[z.id] ? 2.5 : 1.5;
  const zoneDash = (z) => tapped[z.id] || submitted ? "none" : "4 3";

  /* Render a single zone as an SVG group */
  const Zone = ({ id, children, cx, cy }) => {
    const z = BODY_ZONES.find(b => b.id === id);
    const on = tapped[id];
    const anim = lastTap === id && !rm;
    return (
      <g
        onClick={() => tap(id)}
        style={{ cursor: submitted ? "default" : "pointer", transition: rm ? "none" : "all .2s" }}
        role="button"
        tabIndex={0}
        aria-label={z.label + (on ? " (selected)" : "")}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(id); } }}
      >
        {children}
        {/* Label */}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={9} fontFamily={F.ui} fontWeight={700}
          fill={submitted ? (on ? tc(z.type) : (z.type !== "none" ? T.gold + "99" : T.grayMed + "44")) : (on ? T.teal : T.grayMed + "88")}
          style={{ pointerEvents: "none", transition: "all .2s" }}>
          {z.label}
        </text>
        {/* Classification badge after submit */}
        {submitted && on && (
          <g style={{ animation: rm ? "none" : "dPop .3s ease" }}>
            <rect x={cx - 18} y={cy + 6} width={36} height={12} rx={4} fill={tc(z.type)} />
            <text x={cx} y={cy + 12.5} textAnchor="middle" dominantBaseline="central" fontSize={6.5} fontFamily={F.ui} fontWeight={700} fill="#fff" style={{ pointerEvents: "none" }}>{tl(z.type)}</text>
          </g>
        )}
        {submitted && !on && z.type !== "none" && (
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize={7} fontFamily={F.ui} fontWeight={600} fill={tc(z.type)} opacity={.6} style={{ pointerEvents: "none" }}>missed</text>
        )}
        {/* Ripple */}
        {anim && <circle cx={cx} cy={cy} r={16} fill="none" stroke={T.teal} strokeWidth={2} opacity={0}>
          <animate attributeName="r" from="8" to="24" dur="0.4s" />
          <animate attributeName="opacity" from="0.5" to="0" dur="0.4s" />
        </circle>}
      </g>
    );
  };

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 2" title="Find the Wudu Zones" /><Tag c="#fff" bg={T.teal}>INVESTIGATE</Tag></div>
    <Pr>"Tap every body part that is washed or wiped during wudu. Then submit to see which are obligatory and which are recommended."</Pr>

    <div style={{ maxWidth: 320, margin: "0 auto 12px" }}>
      <svg viewBox="0 0 200 420" width="100%" style={{ display: "block" }}>
        <defs>
          <linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8DDD0" />
            <stop offset="100%" stopColor="#D4C8B8" />
          </linearGradient>
          <filter id="bodyShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000015" />
          </filter>
        </defs>

        {/* ── BODY SILHOUETTE (single unified shape) ── */}
        <g filter="url(#bodyShadow)">
          {/* Head */}
          <ellipse cx={100} cy={35} rx={28} ry={32} fill="url(#skinG)" />
          {/* Neck */}
          <rect x={88} y={64} width={24} height={18} rx={6} fill="url(#skinG)" />
          {/* Torso */}
          <path d="M62 82 Q58 78 66 76 L134 76 Q142 78 138 82 L142 200 Q142 212 130 212 L70 212 Q58 212 58 200 Z" fill="url(#skinG)" />
          {/* Left upper arm */}
          <path d="M62 82 L38 130 L32 140 Q28 148 34 148 L46 144 L52 132 L66 94" fill="url(#skinG)" />
          {/* Left forearm + hand */}
          <path d="M34 148 L20 200 L14 218 Q10 228 18 230 L30 226 L34 208 L46 164" fill="url(#skinG)" />
          {/* Right upper arm */}
          <path d="M138 82 L162 130 L168 140 Q172 148 166 148 L154 144 L148 132 L134 94" fill="url(#skinG)" />
          {/* Right forearm + hand */}
          <path d="M166 148 L180 200 L186 218 Q190 228 182 230 L170 226 L166 208 L154 164" fill="url(#skinG)" />
          {/* Left leg */}
          <path d="M72 210 L66 310 L62 360 L60 385 Q58 395 66 396 L82 394 L80 370 L82 310 L90 212" fill="url(#skinG)" />
          {/* Right leg */}
          <path d="M110 212 L118 310 L120 370 L118 394 L134 396 Q142 395 140 385 L138 360 L134 310 L128 210" fill="url(#skinG)" />
        </g>

        {/* ── INTERACTIVE ZONES ── */}

        {/* HEAD zone (top of skull - wiped) */}
        <Zone id="head" cx={100} cy={20}>
          <ellipse cx={100} cy={20} rx={26} ry={16} fill={zoneFill(BODY_ZONES[0])} stroke={zoneStroke(BODY_ZONES[0])} strokeWidth={zoneStrokeW(BODY_ZONES[0])} strokeDasharray={zoneDash(BODY_ZONES[0])} />
        </Zone>

        {/* FACE zone (forehead to chin - washed) */}
        <Zone id="face" cx={100} cy={48}>
          <ellipse cx={100} cy={48} rx={18} ry={12} fill={zoneFill(BODY_ZONES[1])} stroke={zoneStroke(BODY_ZONES[1])} strokeWidth={zoneStrokeW(BODY_ZONES[1])} strokeDasharray={zoneDash(BODY_ZONES[1])} />
        </Zone>

        {/* MOUTH/NOSE zone - callout to the side with a line pointing to face */}
        <Zone id="mouth" cx={158} cy={48}>
          <line x1={120} y1={48} x2={140} y2={48} stroke={zoneStroke(BODY_ZONES[6])} strokeWidth={1} strokeDasharray="3 2" />
          <rect x={140} y={36} width={36} height={24} rx={8} fill={zoneFill(BODY_ZONES[6])} stroke={zoneStroke(BODY_ZONES[6])} strokeWidth={zoneStrokeW(BODY_ZONES[6])} strokeDasharray={zoneDash(BODY_ZONES[6])} />
        </Zone>
        <Zone id="leftArm" cx={38} cy={146}>
          <rect x={26} y={122} width={26} height={48} rx={10} fill={zoneFill(BODY_ZONES[2])} stroke={zoneStroke(BODY_ZONES[2])} strokeWidth={zoneStrokeW(BODY_ZONES[2])} strokeDasharray={zoneDash(BODY_ZONES[2])} transform="rotate(-15 39 146)" />
        </Zone>

        {/* RIGHT ARM zone */}
        <Zone id="rightArm" cx={162} cy={146}>
          <rect x={148} y={122} width={26} height={48} rx={10} fill={zoneFill(BODY_ZONES[3])} stroke={zoneStroke(BODY_ZONES[3])} strokeWidth={zoneStrokeW(BODY_ZONES[3])} strokeDasharray={zoneDash(BODY_ZONES[3])} transform="rotate(15 161 146)" />
        </Zone>

        {/* LEFT HAND zone */}
        <Zone id="leftHand" cx={22} cy={220}>
          <ellipse cx={22} cy={220} rx={14} ry={12} fill={zoneFill(BODY_ZONES[4])} stroke={zoneStroke(BODY_ZONES[4])} strokeWidth={zoneStrokeW(BODY_ZONES[4])} strokeDasharray={zoneDash(BODY_ZONES[4])} />
        </Zone>

        {/* RIGHT HAND zone */}
        <Zone id="rightHand" cx={178} cy={220}>
          <ellipse cx={178} cy={220} rx={14} ry={12} fill={zoneFill(BODY_ZONES[5])} stroke={zoneStroke(BODY_ZONES[5])} strokeWidth={zoneStrokeW(BODY_ZONES[5])} strokeDasharray={zoneDash(BODY_ZONES[5])} />
        </Zone>

        {/* LEFT FOOT zone */}
        <Zone id="leftFoot" cx={72} cy={390}>
          <ellipse cx={72} cy={390} rx={16} ry={10} fill={zoneFill(BODY_ZONES[7])} stroke={zoneStroke(BODY_ZONES[7])} strokeWidth={zoneStrokeW(BODY_ZONES[7])} strokeDasharray={zoneDash(BODY_ZONES[7])} />
        </Zone>

        {/* RIGHT FOOT zone */}
        <Zone id="rightFoot" cx={128} cy={390}>
          <ellipse cx={128} cy={390} rx={16} ry={10} fill={zoneFill(BODY_ZONES[8])} stroke={zoneStroke(BODY_ZONES[8])} strokeWidth={zoneStrokeW(BODY_ZONES[8])} strokeDasharray={zoneDash(BODY_ZONES[8])} />
        </Zone>

        {/* CHEST zone (wrong answer) */}
        <Zone id="chest" cx={100} cy={150}>
          <rect x={68} y={120} width={64} height={56} rx={8} fill={zoneFill(BODY_ZONES[9])} stroke={zoneStroke(BODY_ZONES[9])} strokeWidth={zoneStrokeW(BODY_ZONES[9])} strokeDasharray={zoneDash(BODY_ZONES[9])} />
        </Zone>

        {/* LEFT KNEE zone (wrong answer) */}
        <Zone id="leftKnee" cx={74} cy={310}>
          <ellipse cx={74} cy={310} rx={12} ry={14} fill={zoneFill(BODY_ZONES[10])} stroke={zoneStroke(BODY_ZONES[10])} strokeWidth={zoneStrokeW(BODY_ZONES[10])} strokeDasharray={zoneDash(BODY_ZONES[10])} />
        </Zone>

        {/* RIGHT KNEE zone (wrong answer) */}
        <Zone id="rightKnee" cx={126} cy={310}>
          <ellipse cx={126} cy={310} rx={12} ry={14} fill={zoneFill(BODY_ZONES[11])} stroke={zoneStroke(BODY_ZONES[11])} strokeWidth={zoneStrokeW(BODY_ZONES[11])} strokeDasharray={zoneDash(BODY_ZONES[11])} />
        </Zone>

      </svg>
    </div>

    {/* Legend (after submit) */}
    {submitted && <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 14 }}>
      {[{ label: "Obligatory (Fard)", c: T.teal }, { label: "Recommended (Sunnah)", c: T.gold }, { label: "Not Wudu", c: T.coral }].map(l => (
        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: l.c }} />
          <span style={{ fontFamily: F.ui, fontSize: 10, color: T.grayDark }}>{l.label}</span>
        </div>
      ))}
    </div>}

    {/* Instruction */}
    {!submitted && <div style={{ fontFamily: F.ui, fontSize: 12, color: T.grayMed, textAlign: "center", marginBottom: 12 }}>
      {tappedCount === 0 ? "Tap the zones you think are part of wudu" : tappedCount + " selected. Tap again to deselect."}
    </div>}

    {!submitted && tappedCount > 0 && <div style={{ textAlign: "center" }}><Btn onClick={submit}>Submit</Btn></div>}

    {/* Detailed feedback */}
    {submitted && <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10 }}>
      {BODY_ZONES.filter(z => tapped[z.id]).map(z => (
        <div key={z.id} style={{ padding: "8px 12px", borderRadius: 8, background: tbg(z.type), border: "1px solid " + tc(z.type), fontFamily: F.ui, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, color: tc(z.type), fontSize: 11, minWidth: 56 }}>{tl(z.type)}</span>
          <span style={{ color: T.grayDark }}><strong>{z.label}:</strong> {z.fb}</span>
        </div>
      ))}
      {BODY_ZONES.filter(z => !tapped[z.id] && z.type !== "none").map(z => (
        <div key={z.id} style={{ padding: "8px 12px", borderRadius: 8, background: T.grayLight, border: "1px dashed " + T.grayMed, fontFamily: F.ui, fontSize: 12, color: T.grayMed }}>
          <strong>Missed: {z.label}</strong> - {z.fb}
        </div>
      ))}
    </div>}
  </div>;
}

/* ═══ P6: WHAT BREAKS WUDU ═══ */
function PBreakers({ nx }) {
  return <div>
    <PT sub="Section C" title="What Breaks Your Wudu" />
    <Pr>Wudu stays valid until something specific breaks it. It does not expire with time and it does not break from walking, eating, or touching water.</Pr>
    <Pr>The things that break wudu are specific and limited:</Pr>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
      {[
        { text: "Anything exiting the private parts", icon: "🚻" },
        { text: "Passing gas", icon: "💨" },
        { text: "Deep sleep (losing awareness)", icon: "😴" },
        { text: "Loss of consciousness", icon: "🧠" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: T.coralLight, border: "1.5px solid " + T.coral, borderRadius: 12 }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: T.navy }}>{item.text}</span>
        </div>
      ))}
    </div>
    <Box color={T.green} bg={T.greenLight}><SL icon="✓" text="Does NOT Break Wudu" color={T.green} />
      <Pr>Eating, drinking, minor bleeding, touching water, walking any distance. These do not affect your wudu.</Pr>
    </Box>
    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={nx}>Test My Knowledge</Btn></div>
  </div>;
}

/* ═══ P7: Q3 SWIPE (WUDU BREAKERS) ═══ */
function PQ3Swipe({ done, rm }) {
  const cards = useMemo(() => shuffle(SWIPE_CARDS), []);
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [all, setAll] = useState([]);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const sx = useRef(0);

  const swipe = useCallback((dir) => {
    if (result) return;
    const card = cards[idx];
    const userSaysBreaks = dir === "right";
    const ok = userSaysBreaks === card.breaksWudu;
    setResult({ ok, fb: ok ? card.rightFb : card.wrongFb });
    setAll(p => [...p, ok]);
    setDx(0);
    setTimeout(() => {
      setResult(null);
      if (idx + 1 >= cards.length) { /* done */ } else setIdx(i => i + 1);
    }, 1800);
  }, [idx, cards, result]);

  useEffect(() => {
    const h = (e) => { if (result || idx >= cards.length) return; if (e.key === "ArrowRight") swipe("right"); if (e.key === "ArrowLeft") swipe("left"); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [swipe, result, idx, cards.length]);

  const isComplete = idx >= cards.length - 1 && result === null && all.length === cards.length;
  const score = all.filter(Boolean).length;

  if (isComplete) return <div>
    <PT sub="Question 3 Results" title={score + "/" + cards.length} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {cards.map((c, i) => <div key={i} style={{ padding: 12, borderRadius: 12, border: "2px solid " + (all[i] ? T.green : T.coral), background: all[i] ? T.greenLight : T.coralLight, fontFamily: F.ui, fontSize: 13 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.text}</div>
        <div style={{ fontSize: 11, color: T.grayMed }}>{c.breaksWudu ? "Breaks wudu" : "Does NOT break"}</div>
      </div>)}
    </div>
    <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={() => done(score)}>Continue</Btn></div>
  </div>;

  const card = cards[idx]; const rot = (dx / 400) * 15;
  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 3" title="Breaks Wudu?" /><Tag c="#fff" bg={T.magenta}>PLAY</Tag></div>
    <Pr>"Swipe RIGHT if it breaks wudu. LEFT if it does not."</Pr>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontSize: 12, fontWeight: 600, marginBottom: 6, padding: "0 4px" }}>
      <span style={{ color: T.green, opacity: .4 + Math.max(0, -dx / 200) * .6 }}>SAFE</span>
      <span style={{ color: T.grayMed, fontSize: 10 }}>{idx + 1}/{cards.length}</span>
      <span style={{ color: T.coral, opacity: .4 + Math.max(0, dx / 200) * .6 }}>BREAKS</span>
    </div>
    {!result ? <>
      <div onPointerDown={e => { sx.current = e.clientX; setDragging(true); }} onPointerMove={e => { if (dragging) setDx(e.clientX - sx.current); }} onPointerUp={() => { setDragging(false); Math.abs(dx) > 70 ? swipe(dx > 0 ? "right" : "left") : setDx(0); }} onPointerLeave={() => { setDragging(false); setDx(0); }}
        role="button" tabIndex={0} aria-label={"Card: " + card.text} style={{ background: "#fff", border: "1.5px solid " + T.grayLight, borderRadius: 16, padding: "36px 24px", textAlign: "center", fontFamily: F.display, fontSize: 20, fontWeight: 600, color: T.navy, cursor: "grab", userSelect: "none", boxShadow: "0 4px 20px " + T.gold + "12", transform: rm ? "none" : "translateX(" + dx + "px) rotate(" + rot + "deg)", transition: dragging ? "none" : rm ? "none" : "transform .15s", touchAction: "pan-y" }}>{card.text}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18 }}>
        <Btn onClick={() => swipe("left")} v="ghost" style={{ borderColor: T.green, color: T.green, padding: "12px 22px" }}>Safe</Btn>
        <Btn onClick={() => swipe("right")} v="ghost" style={{ borderColor: T.coral, color: T.coral, padding: "12px 22px" }}>Breaks</Btn>
      </div>
    </> : <Box color={result.ok ? T.green : T.coral} bg={result.ok ? T.greenLight : T.coralLight}>
      <div style={{ textAlign: "center", fontSize: 26, marginBottom: 6 }}>{result.ok ? "✓" : "✗"}</div>
      <p style={{ margin: 0, fontFamily: F.body, fontSize: 14, textAlign: "center" }}>{result.fb}</p>
    </Box>}
  </div>;
}

/* ═══ P8: Q4 SEQUENCE REORDER (full sequence, post-teaching) ═══ */
function PQ4Sequence({ done, rm }) {
  const STEPS = [
    { text: "Wash hands three times", tag: "sunnah" },
    { text: "Rinse mouth and nose", tag: "sunnah" },
    { text: "Wash face", tag: "fard" },
    { text: "Wash arms to elbows", tag: "fard" },
    { text: "Wipe entire head", tag: "fard" },
    { text: "Wash feet to ankles", tag: "fard" },
  ];
  const shuffled = useMemo(() => shuffle(STEPS.map((s, i) => ({ ...s, correctIdx: i }))), []);
  const [order, setOrder] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const usedSet = new Set(order.map(s => s.text));

  const add = (step) => { if (submitted || usedSet.has(step.text)) return; setOrder([...order, step]); };
  const remove = (idx) => { if (submitted) return; setOrder(order.filter((_, i) => i !== idx)); };

  const submit = () => {
    if (order.length !== 6 || submitted) return;
    setSubmitted(true);
    const correct = order.filter((s, i) => s.correctIdx === i).length;
    setTimeout(() => done(correct), 2500);
  };

  const results = submitted ? order.map((s, i) => s.correctIdx === i) : null;
  const correctCount = results ? results.filter(Boolean).length : 0;

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 4" title="The Full Sequence" /><Tag c="#fff" bg={T.teal}>SORT</Tag></div>
    <Pr>"Now that you know the difference between fard and sunnah, put the complete wudu sequence in order."</Pr>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
      {shuffled.map(step => {
        const used = usedSet.has(step.text);
        const tagColor = step.tag === "fard" ? T.teal : T.gold;
        return <button key={step.text} disabled={used || submitted} onClick={() => add(step)}
          style={{ background: used ? T.grayLight : "#fff", border: "1.5px solid " + (used ? T.grayLight : tagColor), borderRadius: 10, padding: "10px 14px", fontFamily: F.ui, fontWeight: 600, fontSize: 12, color: used ? T.grayMed : T.navy, cursor: used || submitted ? "default" : "pointer", opacity: used ? .3 : 1, display: "flex", alignItems: "center", gap: 6 }}>
          {step.text}
          <span style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, color: "#fff", background: tagColor, padding: "1px 6px", borderRadius: 4 }}>{step.tag === "fard" ? "F" : "S"}</span>
        </button>;
      })}
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 40 }}>
      {order.length === 0 && <div style={{ fontFamily: F.ui, fontSize: 13, color: T.grayMed, fontStyle: "italic", padding: 16, textAlign: "center", border: "2px dashed " + T.grayLight, borderRadius: 12 }}>Tap steps above to build the sequence</div>}
      {order.map((step, i) => {
        const tagColor = step.tag === "fard" ? T.teal : T.gold;
        return <div key={step.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: submitted ? (results[i] ? T.greenLight : T.coralLight) : T.goldPale, border: "2px solid " + (submitted ? (results[i] ? T.green : T.coral) : T.gold) }}>
          <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: submitted ? (results[i] ? T.green : T.coral) : T.navy, width: 22, textAlign: "center" }}>{i + 1}</span>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: T.navy, flex: 1 }}>{step.text}</span>
          <span style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, color: "#fff", background: tagColor, padding: "1px 6px", borderRadius: 4 }}>{step.tag === "fard" ? "F" : "S"}</span>
          {submitted && <span style={{ fontSize: 14 }}>{results[i] ? "✓" : "✗"}</span>}
          {!submitted && <button onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.grayMed, padding: 4 }}>✕</button>}
        </div>;
      })}
    </div>

    {!submitted && order.length === 6 && <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={submit}>Submit</Btn></div>}
    {submitted && <Box color={correctCount === 6 ? T.green : T.coral} bg={correctCount === 6 ? T.greenLight : T.coralLight}>
      <p style={{ margin: 0, fontFamily: F.ui, fontWeight: 700, color: correctCount === 6 ? T.green : T.coral }}>
        {correctCount === 6 ? "✓ Perfect order!" : correctCount + " of 6 correct. The right order: Hands (S), mouth/nose (S), face (F), arms (F), head (F), feet (F)."}
      </p>
    </Box>}
  </div>;
}

/* ═══ P9: Q5 TRUE/FALSE ═══ */
function PQ5TF({ done, rm }) {
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = (a) => {
    if (submitted) return;
    setAnswer(a);
    setSubmitted(true);
    const ok = a === TF_ANSWER;
    setTimeout(() => done(ok ? 1 : 0), 2500);
  };
  const ok = submitted ? answer === TF_ANSWER : null;

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 5" title="True or False" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <div style={{ background: "#fff", border: "1.5px solid " + T.grayLight, borderRadius: 16, padding: "30px 22px", textAlign: "center", fontFamily: F.display, fontSize: 18, color: T.navy, boxShadow: "0 4px 16px " + T.gold + "10", marginBottom: 18 }}>{TF_STATEMENT}</div>
    <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
      <Btn onClick={() => submit(true)} disabled={submitted} style={{ background: submitted && answer === true ? (ok ? T.green : T.coral) : T.green, color: "#fff", padding: "14px 36px", fontSize: 16, border: "none", opacity: submitted && answer !== true ? .4 : 1 }}>TRUE</Btn>
      <Btn onClick={() => submit(false)} disabled={submitted} style={{ background: submitted && answer === false ? (ok ? T.green : T.coral) : T.coral, color: "#fff", padding: "14px 36px", fontSize: 16, border: "none", opacity: submitted && answer !== false ? .4 : 1 }}>FALSE</Btn>
    </div>
    {submitted && <Box color={ok ? T.green : T.coral} bg={ok ? T.greenLight : T.coralLight}>
      <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: ok ? T.green : T.coral }}>{ok ? "✓ Correct!" : "✗ That's false."}</p>
      <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{TF_FEEDBACK}</p>
    </Box>}
  </div>;
}

/* ═══ P10: Q6 MC SCENARIO ═══ */
function PQ6MC({ done, rm }) {
  const [sel, setSel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const options = useMemo(() => shuffle(MC_SCENARIO.options), []);
  const correctIdx = options.findIndex(o => o.correct);

  const submit = () => {
    if (sel === null || submitted) return;
    setSubmitted(true);
    const ok = options[sel].correct;
    setTimeout(() => done(ok ? 1 : 0), 3000);
  };
  const userCorrect = submitted && options[sel]?.correct;

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><PT sub="Question 6" title="Scenario" /><Tag c="#fff" bg={T.purple}>THINK</Tag></div>
    <Box color={T.navy} bg={T.goldPale} style={{ padding: "18px 20px" }}>
      <Pr><strong style={{ color: T.navy }}>Scenario:</strong> {MC_SCENARIO.prompt}</Pr>
    </Box>
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {options.map((opt, i) => {
        const isSel = sel === i;
        let bc = T.grayLight, bg = "#fff", op = 1;
        if (submitted) {
          if (opt.correct) { bc = T.green; bg = T.greenLight; }
          else if (isSel) { bc = T.coral; bg = T.coralLight; }
          else op = .4;
        } else if (isSel) { bc = T.navy; bg = T.goldPale; }
        return <button key={i} onClick={() => { if (!submitted) setSel(i); }} disabled={submitted}
          style={{ background: bg, border: "2px solid " + bc, borderRadius: 12, padding: "13px 15px", textAlign: "left", cursor: submitted ? "default" : "pointer", display: "flex", gap: 11, alignItems: "flex-start", transition: rm ? "none" : "all .15s", opacity: op, fontFamily: F.body, fontSize: 14 }}>
          <span style={{ background: opt.correct && submitted ? T.green : isSel && submitted ? T.coral : T.navy, color: "#fff", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{opt.id}</span>
          <span style={{ lineHeight: 1.6 }}>{opt.text}</span>
        </button>;
      })}
    </div>
    {!submitted && sel !== null && <div style={{ textAlign: "center", marginTop: 14 }}><Btn onClick={submit}>Check Answer</Btn></div>}
    {submitted && userCorrect && <Box color={T.green} bg={T.greenLight}>
      <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>✓ Correct!</p>
      <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[correctIdx].fb}</p>
    </Box>}
    {submitted && !userCorrect && <div>
      <Box color={T.coral} bg={T.coralLight}>
        <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.coral }}>✗ Not quite</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[sel]?.fb}</p>
      </Box>
      <Box color={T.green} bg={T.greenLight}>
        <p style={{ margin: "0 0 4px", fontFamily: F.ui, fontWeight: 700, color: T.green }}>The answer:</p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13.5 }}>{options[correctIdx].fb}</p>
      </Box>
    </div>}
  </div>;
}

/* ═══ P11: KEY TAKEAWAY ═══ */
function PTakeaway({ nx }) {
  return <div>
    <div style={{ background: "linear-gradient(135deg," + T.gold + "12," + T.goldPale + ")", border: "2.5px solid " + T.gold, borderRadius: 20, padding: "30px 26px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle," + T.gold + "22,transparent 70%)", borderRadius: "50%" }} />
      <SL icon="🔑" text="Key Takeaway" color={T.gold} />
      <p style={{ fontFamily: F.display, fontSize: 19, fontWeight: 700, color: T.navy, lineHeight: 1.6, margin: "0 0 10px" }}>Salah begins before you raise your hands.</p>
      <p style={{ fontFamily: F.body, fontSize: 14.5, lineHeight: 1.8, color: T.grayDark, margin: 0 }}>Wudu is your preparation. The qiblah is your orientation. The prayer time is your appointment window. Get these right, and you are ready to stand before Allah.</p>
    </div>
    <div style={{ textAlign: "center", marginTop: 28 }}><Btn onClick={nx}>See My Results</Btn></div>
  </div>;
}

/* ═══ P12: CHECKPOINT ═══ */
function PCheckpoint({ scores, total, rm }) {
  const maxScore = 23;
  const pct = Math.round((total / maxScore) * 100);
  const pass = pct >= 60;
  const [showConf, setShowConf] = useState(pass);
  const [conf, setConf] = useState(3);
  const colors = [T.gold, T.teal, T.green, T.coral, T.purple];

  useEffect(() => { if (pass) setTimeout(() => setShowConf(false), 2500); }, [pass]);

  const concepts = [
    { name: "Five prerequisites", ok: scores.q1 >= 2 && scores.q5 >= 1 },
    { name: "Wudu sequence", ok: scores.q4 >= 4 },
    { name: "Wudu body parts", ok: scores.q2 >= 3 },
    { name: "What breaks wudu", ok: scores.q3 >= 4 },
    { name: "Wudu validity (scenario)", ok: scores.q6 >= 1 },
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
        <div style={{ fontFamily: F.ui, fontWeight: 700, color: pass ? T.green : T.coral, fontSize: 14 }}>{pass ? "Great foundation! Ready for Lesson 3." : "You are close! Review below."}</div>
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
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13, color: T.teal, marginBottom: 3 }}>Next: Lesson 3 - "The Architecture of Prayer"</div>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 12.5, color: T.grayDark, lineHeight: 1.7 }}>Now that you know how to prepare, learn what happens when you actually stand on the prayer mat.</p>
      </Box>
      <div style={{ textAlign: "center", marginTop: 18 }}><Btn style={{ minWidth: 240, fontSize: 15, padding: "15px 40px" }}>{pass ? "Continue to Lesson 3" : "Review Lesson"}</Btn></div>
    </div>
  </div>;
}
