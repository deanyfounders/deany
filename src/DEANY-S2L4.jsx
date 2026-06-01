import React, { useEffect, useMemo, useState } from "react";

/*
  DEANY Module S2 Lesson 4: The Words That Rise
  Core recitations, Surah al-Fatihah meaning, movement wording, sitting/tashahhud, salawat, and salam.
  Beginner-tier wording, no learner-facing school labels.
  Sahih al-Bukhari / Sahih Muslim hadith anchors only.
  Quran translation: Saheeh International for al-Fatihah.
*/

const T = {
  navy: "#1B2A4A",
  navyDeep: "#0F1A2E",
  gold: "#C5A55A",
  goldLight: "#F5EDD6",
  goldPale: "#FBF6EC",
  teal: "#2A7B88",
  tealLight: "#E0F2F4",
  purple: "#6B4C9A",
  purpleLight: "#F3EEFF",
  coral: "#D4654A",
  coralLight: "#FDEAE5",
  green: "#3A8B5C",
  greenLight: "#E5F5EC",
  grey: "#6B6B6B",
  greyLight: "#F2F2F2",
  cream: "#FDFBF7",
  white: "#FFFFFF",
  ink: "#31343B",
};
const F = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  ui: "'DM Sans', system-ui, sans-serif",
  ar: "'Amiri', serif",
};

const RECITATIONS = [
  { position: "Standing", emoji: "🧍", phrase: "ٱللَّٰهُ أَكْبَرُ", tr: "Allahu Akbar", meaning: "Allah is the Greatest", note: "The opening takbir begins the prayer. Then al-Fatihah is recited in every rak'ah." },
  { position: "Bowing", emoji: "🙇", phrase: "سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ", tr: "Subhana Rabbiyal-ʿAdheem", meaning: "Glory be to my Lord, the Most Great", note: "Often repeated calmly in rukuʿ. You lower yourself while praising the Most Great." },
  { position: "Rising", emoji: "🧍", phrase: "سَمِعَ ٱللَّٰهُ لِمَنْ حَمِدَهُ", tr: "Samiʿallahu liman hamidah", meaning: "Allah hears the one who praises Him", note: "Said when rising from rukuʿ. Then you may add: Rabbana wa lakal-hamd." },
  { position: "Prostration", emoji: "🧎", phrase: "سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ", tr: "Subhana Rabbiyal-Aʿla", meaning: "Glory be to my Lord, the Most High", note: "Often repeated calmly in sujud. At the lowest position, you praise the Most High." },
  { position: "Sitting", emoji: "🧎‍♂️", phrase: "ٱلتَّحِيَّاتُ لِلَّٰهِ", tr: "At-tahiyyatu lillah...", meaning: "All greetings belong to Allah", note: "The sitting has its own words: tashahhud. You learn it after the core movement phrases." },
  { position: "Closing", emoji: "👋", phrase: "ٱلسَّلَامُ عَلَيْكُمْ", tr: "As-salamu ʿalaykum", meaning: "Peace be upon you", note: "The prayer closes with salam, with the head turning to the right." },
];

const TASHAHHUD = [
  { id: "honour", label: "Honour belongs to Allah", ar: "ٱلتَّحِيَّاتُ لِلَّٰهِ وَٱلصَّلَوَاتُ وَٱلطَّيِّبَاتُ", tr: "At-tahiyyatu lillahi was-salawatu wat-tayyibat", meaning: "All greetings, prayers, and pure good words belong to Allah." },
  { id: "prophet", label: "Peace on the Prophet (peace be upon him)", ar: "ٱلسَّلَامُ عَلَيْكَ أَيُّهَا ٱلنَّبِيُّ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ", tr: "As-salamu ʿalayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh", meaning: "Peace be upon you, O Prophet, and Allah's mercy and blessings." },
  { id: "believers", label: "Peace on the believers", ar: "ٱلسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ ٱللَّٰهِ ٱلصَّالِحِينَ", tr: "As-salamu ʿalayna wa ʿala ʿibadillahiṣ-ṣalihin", meaning: "Peace be upon us and upon Allah's righteous servants." },
  { id: "testimony", label: "The testimony", ar: "أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", tr: "Ashhadu an la ilaha illa Allah, wa ashhadu anna Muhammadan ʿabduhu wa rasuluh", meaning: "I testify that there is no God but Allah, and Muhammad is His servant and Messenger." },
];
const ORDER = TASHAHHUD.map((x) => x.id);

const SALAWAT = [
  { ar: "ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ", tr: "Allahumma ṣalli ʿala Muhammad wa ʿala ali Muhammad, kama ṣallayta ʿala Ibrahim wa ʿala ali Ibrahim, innaka hamidun majid", meaning: "O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious." },
  { ar: "ٱللَّٰهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ", tr: "Allahumma barik ʿala Muhammad wa ʿala ali Muhammad, kama barakta ʿala Ibrahim wa ʿala ali Ibrahim, innaka hamidun majid", meaning: "O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious." },
];

const FATIHAH = [
  { title: "Praise", colour: T.teal, icon: "✨", ayat: [
    ["بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "In the name of Allah, the Entirely Merciful, the Especially Merciful."],
    ["ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَالَمِينَ", "All praise is due to Allah, Lord of the worlds."],
    ["ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "The Entirely Merciful, the Especially Merciful."],
    ["مَالِكِ يَوْمِ ٱلدِّينِ", "Sovereign of the Day of Recompense."],
  ], note: "You begin by naming who Allah is before asking for anything." },
  { title: "Declaration", colour: T.gold, icon: "🤲", ayat: [["إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "It is You we worship and You we ask for help."]], note: "This is the hinge of the surah: worship and reliance are directed to Allah alone." },
  { title: "Duʿaʾ", colour: T.purple, icon: "🧭", ayat: [
    ["ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", "Guide us to the straight path."],
    ["صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", "The path of those upon whom You have bestowed favour, not of those who have evoked anger or of those who are astray."],
  ], note: "The request you repeat in every rak'ah is guidance." },
];

const q1 = {
  prompt: "Which surah must be recited in every rak'ah?",
  choices: [
    ["Surah al-Ikhlas", false, "Al-Ikhlas is beautiful, but it is not the fixed surah of every rak'ah."],
    ["Surah al-Fatihah", true, "Correct. Al-Fatihah is recited in every rak'ah."],
    ["Surah al-Nas", false, "Al-Nas is often recited for protection, but it is not required in every rak'ah."],
    ["Any surah of your choice", false, "Another surah may follow al-Fatihah, but al-Fatihah itself is fixed."],
  ],
};
const q6 = {
  prompt: "Sarah is praying ʿAsr. She finishes al-Fatihah in the first rak'ah. What should she do next before rukuʿ?",
  choices: [
    ["Go straight into rukuʿ", false, "In the first two rak'at, the recommended practice is to recite another surah or verses after al-Fatihah."],
    ["Recite another surah, then go into rukuʿ", true, "Correct. In the first two rak'at, recite al-Fatihah, then another surah or verses, then rukuʿ."],
    ["Repeat al-Fatihah again", false, "Al-Fatihah is recited once in the rak'ah, then another surah or verses may follow."],
    ["Make a long personal duʿaʾ in English", false, "Personal duʿaʾ is valuable, but this point of the prayer is for recitation before rukuʿ."],
  ],
};

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Button = ({ children, onClick, disabled, variant = "gold" }) => {
  const base = variant === "ghost" ? { background: T.white, color: T.navy, border: `1.5px solid ${T.gold}` } : { background: `linear-gradient(135deg, ${T.gold}, #D7BC72)`, color: T.navy, border: "0" };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, borderRadius: 14, padding: "13px 24px", fontFamily: F.ui, fontWeight: 800, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, boxShadow: disabled ? "none" : `0 8px 22px ${T.gold}33` }}>{children}</button>;
};
const Box = ({ children, colour = T.gold, bg = T.white }) => <div style={{ border: `2px solid ${colour}55`, background: bg, borderRadius: 20, padding: 18, margin: "16px 0", boxShadow: "0 10px 28px rgba(15,26,46,.05)" }}>{children}</div>;
const H = ({ eyebrow, title }) => <div style={{ marginBottom: 18 }}><div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 900, letterSpacing: 2, color: T.gold, textTransform: "uppercase" }}>{eyebrow}</div><h2 style={{ fontFamily: F.display, fontSize: 30, lineHeight: 1.12, color: T.navy, margin: "6px 0 0" }}>{title}</h2></div>;
const P = ({ children }) => <p style={{ fontFamily: F.body, fontSize: 16, lineHeight: 1.75, color: "#374151", margin: "0 0 12px" }}>{children}</p>;
const Ar = ({ children, size = 28 }) => <div dir="rtl" lang="ar" style={{ fontFamily: F.ar, fontSize: size, lineHeight: 1.9, color: T.navy, textAlign: "center" }}>{children}</div>;
const Tag = ({ children, colour = T.teal }) => <span style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 900, letterSpacing: 1.3, background: `${colour}18`, color: colour, borderRadius: 999, padding: "5px 10px", textTransform: "uppercase" }}>{children}</span>;

export default function DEANYS2L4({ onBack, onHome, onGoToHifz, onGoToNext }) {
  const [page, setPage] = useState(0);
  const [scores, setScores] = useState({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null });
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReduce(mq.matches);
    const fn = (event) => setReduce(event.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  useEffect(() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }), [page, reduce]);

  const done = (key, value) => {
    setScores((s) => ({ ...s, [key]: value }));
    setPage((p) => Math.min(p + 1, pages.length - 1));
  };
  const pages = [
    <Bridge next={() => setPage(1)} />,
    <MapPage next={() => setPage(2)} />,
    <FatihahPage next={() => setPage(3)} />,
    <MCPage q={q1} label="Question 1" onDone={(v) => done("q1", v)} />,
    <MeaningSort onDone={(v) => done("q4", v)} />,
    <MatchPage onDone={(v) => done("q2", v)} />,
    <FillPage onDone={(v) => done("q3", v)} />,
    <TashahhudActivity next={() => setPage(8)} reduce={reduce} />,
    <RapidPage onDone={(v) => done("q5", v)} />,
    <StructurePage next={() => setPage(10)} />,
    <MCPage q={q6} label="Question 6" onDone={(v) => done("q6", v)} />,
    <Takeaway next={() => setPage(12)} />,
    <Checkpoint scores={scores} reset={() => { setScores({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null }); setPage(0); }} onGoToHifz={onGoToHifz} onGoToNext={onGoToNext} onBack={onBack} />,
  ];
  const progress = Math.round(((page + 1) / pages.length) * 100);
  return <main style={{ minHeight: "100vh", background: T.cream, color: T.navy }}>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=DM+Sans:wght@400;600;700;800;900&family=Playfair+Display:wght@600;700;900&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet" />
    <div style={{ position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)", background: `${T.cream}ee`, borderBottom: `1px solid ${T.gold}33` }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: T.navy, padding: "4px 8px" }} aria-label="Back">←</button>
        <strong style={{ fontFamily: F.ui, fontSize: 11, color: T.gold, letterSpacing: 2 }}>S2.4</strong>
        <div style={{ flex: 1, height: 7, background: `${T.gold}20`, borderRadius: 20, overflow: "hidden" }}><div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.gold}, ${T.teal})`, transition: reduce ? "none" : "width .35s ease" }} /></div>
        <span style={{ fontFamily: F.ui, fontSize: 12, color: T.grey }}>{page + 1}/{pages.length}</span>
      </div>
    </div>
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "24px 18px 88px" }}>
      <div key={page} style={{ animation: reduce ? "none" : "rise .25s ease" }}>{pages[page]}</div>
      {page > 0 && page < pages.length - 1 && <div style={{ marginTop: 26 }}><Button variant="ghost" onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button></div>}
    </section>
    <style>{`@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}} *{box-sizing:border-box}`}</style>
  </main>;
}

function Bridge({ next }) {
  return <div>
    <div style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.navyDeep})`, color: T.white, borderRadius: 28, padding: "44px 26px", textAlign: "center", overflow: "hidden", position: "relative" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: .12, background: `radial-gradient(circle at 20% 25%, ${T.gold}, transparent 32%), radial-gradient(circle at 82% 75%, ${T.teal}, transparent 36%)` }} />
      <div style={{ position: "relative" }}><div style={{ fontFamily: F.ui, color: T.gold, fontSize: 11, letterSpacing: 3, fontWeight: 900 }}>LESSON S2.4</div><h1 style={{ fontFamily: F.display, fontSize: 38, margin: "8px 0" }}>The Words That Rise</h1><p style={{ fontFamily: F.body, color: "rgba(255,255,255,.75)", margin: 0 }}>What your tongue says while your body prays.</p></div>
    </div>
    <Box colour={T.teal} bg={T.tealLight}><Tag colour={T.teal}>Goal of this lesson</Tag><P>You already learned the shape of the rak'ah: standing, bowing, prostrating, and sitting. Now you learn the words that live inside those movements.</P><P>By the end, you will know al-Fatihah, the core movement recitations, the sitting words of tashahhud, salawat, and the closing salam in their proper place.</P></Box>
    <div style={{ textAlign: "center", marginTop: 24 }}><Button onClick={next}>Begin</Button></div>
  </div>;
}

function MapPage({ next }) {
  const [active, setActive] = useState(0);
  const r = RECITATIONS[active];
  return <div>
    <H eyebrow="Section A" title="The prayer has a speech-map" />
    <P>Tap each position. Every movement has words attached to it.</P>
    <Box colour={active % 2 ? T.purple : T.teal} bg={active % 2 ? T.purpleLight : T.tealLight}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ fontSize: 54 }}>{r.emoji}</div><div><Tag colour={active % 2 ? T.purple : T.teal}>Position {active + 1}/6</Tag><h3 style={{ fontFamily: F.display, margin: "8px 0 0", fontSize: 24 }}>{r.position}</h3></div></div>
      <div style={{ background: T.white, borderRadius: 18, padding: 18, marginTop: 16 }}><Ar>{r.phrase}</Ar><p style={{ fontFamily: F.body, textAlign: "center", fontStyle: "italic", color: T.grey }}>{r.tr}</p><h3 style={{ fontFamily: F.display, color: T.navy, textAlign: "center" }}>{r.meaning}</h3><P>{r.note}</P></div>
    </Box>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>{RECITATIONS.map((x, i) => <button key={x.position} onClick={() => setActive(i)} aria-label={x.position} style={{ border: `2px solid ${i === active ? T.gold : T.greyLight}`, background: i === active ? T.goldPale : T.white, borderRadius: 14, padding: "10px 4px", cursor: "pointer" }}><div style={{ fontSize: 24 }}>{x.emoji}</div><div style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 900, color: i === active ? T.navy : T.grey }}>{x.position}</div></button>)}</div>
    <Box colour={T.teal} bg={T.tealLight}><Tag colour={T.teal}>Hadith anchor</Tag><P>"There is no prayer for the one who does not recite the Opening of the Book."</P><p style={{ fontFamily: F.ui, fontSize: 12, color: T.grey, margin: 0 }}>Sahih al-Bukhari 756</p></Box>
    <div style={{ textAlign: "center" }}><Button onClick={next}>Continue</Button></div>
  </div>;
}

function TashahhudActivity({ next, reduce }) {
  const [view, setView] = useState(0);
  const [chosen, setChosen] = useState([]);
  const [wrong, setWrong] = useState(false);
  const options = useMemo(() => shuffle(TASHAHHUD), []);
  const complete = chosen.length === ORDER.length;
  const current = TASHAHHUD[view];
  const choose = (id) => {
    if (complete || chosen.includes(id)) return;
    if (id === ORDER[chosen.length]) setChosen((x) => [...x, id]);
    else { setWrong(true); setTimeout(() => setWrong(false), 520); }
  };
  return <div>
    <H eyebrow="Section D" title="Sitting words: tashahhud" />
    <P>Now that you have learned standing, al-Fatihah, bowing, rising, and prostration, the lesson reaches the sitting. This is where tashahhud belongs pedagogically: not as the whole lesson, but as the sitting words inside the prayer map.</P>
    <Box colour={T.teal} bg={T.tealLight}><Tag colour={T.teal}>Step 1 - Read the chunks</Tag><div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>{TASHAHHUD.map((part, i) => <button key={part.id} onClick={() => setView(i)} style={{ border: `2px solid ${view === i ? T.teal : T.greyLight}`, borderRadius: 12, background: view === i ? T.white : "rgba(255,255,255,.65)", padding: 10, fontFamily: F.ui, fontWeight: 900 }}>{i + 1}</button>)}</div><div style={{ background: T.white, borderRadius: 18, padding: 18, marginTop: 14 }}><Tag colour={T.teal}>{current.label}</Tag><Ar size={25}>{current.ar}</Ar><p style={{ fontFamily: F.body, color: T.grey, fontStyle: "italic", lineHeight: 1.7 }}>{current.tr}</p><P>{current.meaning}</P></div></Box>
    <Box colour={complete ? T.green : T.gold} bg={complete ? T.greenLight : T.goldPale}><Tag colour={complete ? T.green : T.gold}>Step 2 - Build the sitting sequence</Tag><P>Tap the meaning-cards in the correct order. The aim is to attach the sitting words to the sitting posture, not to turn the whole lesson into a tashahhud lesson.</P><div style={{ display: "flex", flexDirection: "column", gap: 9, animation: wrong && !reduce ? "shake .45s ease" : "none" }}>{options.map((part) => { const picked = chosen.includes(part.id); return <button key={part.id} onClick={() => choose(part.id)} disabled={picked || complete} style={{ textAlign: "left", background: picked ? T.greenLight : T.white, border: `2px solid ${picked ? T.green : T.greyLight}`, borderRadius: 14, padding: 13, cursor: picked || complete ? "default" : "pointer" }}><div style={{ fontFamily: F.ui, color: picked ? T.green : T.navy, fontWeight: 900 }}>{picked ? "✓ " : ""}{part.label}</div><div style={{ fontFamily: F.body, color: T.grey, fontSize: 13, marginTop: 4 }}>{part.meaning}</div></button>; })}</div>{wrong && <p style={{ fontFamily: F.ui, color: T.coral, fontWeight: 900 }}>Not that one yet. Follow the meaning sequence.</p>}{complete && <p style={{ fontFamily: F.ui, color: T.green, fontWeight: 900 }}>Correct. Salawat unlocked.</p>}</Box>
    <Box colour={complete ? T.gold : T.greyLight} bg={complete ? T.goldPale : T.white}><Tag colour={complete ? T.gold : T.grey}>Step 3 - Salawat</Tag>{complete ? <><P>In the final sitting, after the tashahhud, send blessings on the Prophet (peace be upon him).</P>{SALAWAT.map((s, i) => <div key={i} style={{ border: `1.5px solid ${T.gold}55`, borderRadius: 16, padding: 14, marginTop: 10, background: T.white }}><Ar size={20}>{s.ar}</Ar><p style={{ fontFamily: F.body, fontStyle: "italic", color: T.grey }}>{s.tr}</p><P>{s.meaning}</P></div>)}</> : <P>Complete the short sitting-word activity above first. Then you will see the salawat that follows in the final sitting.</P>}</Box>
    <Box colour={T.purple} bg={T.purpleLight}><Tag colour={T.purple}>First sitting vs final sitting</Tag><P>In prayers longer than two rak'at, there is a sitting after the second rak'ah for tashahhud, then you stand again. At the final sitting, you say tashahhud, send salawat, then close with salam.</P></Box>
    <Box colour={T.greyLight} bg={T.white}><Tag colour={T.grey}>Accuracy note</Tag><P>There are authentic variations in tashahhud wording. Follow the wording taught by a qualified teacher you trust.</P></Box>
    <div style={{ textAlign: "center" }}><Button disabled={!complete} onClick={next}>{complete ? "Continue" : "Build the tashahhud to continue"}</Button></div>
  </div>;
}

function MCPage({ q, label, onDone }) {
  const choices = useMemo(() => shuffle(q.choices), [q]);
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const selected = picked !== null ? choices[picked] : null;
  return <div><H eyebrow={label} title={q.prompt} /><div style={{ display: "grid", gap: 10 }}>{choices.map((c, i) => { const show = submitted; const correct = c[1]; return <button key={c[0]} onClick={() => !submitted && setPicked(i)} style={{ border: `2px solid ${show ? (correct ? T.green : picked === i ? T.coral : T.greyLight) : picked === i ? T.gold : T.greyLight}`, background: show ? (correct ? T.greenLight : picked === i ? T.coralLight : T.white) : T.white, borderRadius: 16, padding: 16, textAlign: "left", fontFamily: F.body, fontSize: 16, cursor: submitted ? "default" : "pointer" }}>{c[0]}</button>; })}</div>{submitted && selected && <Box colour={selected[1] ? T.green : T.coral} bg={selected[1] ? T.greenLight : T.coralLight}><P>{selected[2]}</P></Box>}<div style={{ textAlign: "center", marginTop: 20 }}>{!submitted ? <Button disabled={picked === null} onClick={() => setSubmitted(true)}>Submit</Button> : <Button onClick={() => onDone(selected[1] ? 1 : 0)}>Continue</Button>}</div></div>;
}

function MatchPage({ onDone }) {
  const pairs = [
    { id: "ruku", position: "Rukuʿ", icon: "🙇", answer: "Subhana Rabbiyal-ʿAdheem", ar: "سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ", meaning: "Glory be to my Lord, the Most Great", hint: "Bowing: you lower yourself and praise the Most Great." },
    { id: "sujud", position: "Sujud", icon: "🧎", answer: "Subhana Rabbiyal-Aʿla", ar: "سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ", meaning: "Glory be to my Lord, the Most High", hint: "Prostration: at the lowest point, you praise the Most High." },
    { id: "rising", position: "Rising", icon: "🧍", answer: "Samiʿallahu liman hamidah", ar: "سَمِعَ ٱللَّٰهُ لِمَنْ حَمِدَهُ", meaning: "Allah hears the one who praises Him", hint: "This is said while rising from rukuʿ." },
    { id: "opening", position: "Opening", icon: "☝️", answer: "Allahu Akbar", ar: "ٱللَّٰهُ أَكْبَرُ", meaning: "Allah is the Greatest", hint: "The prayer opens with the takbir." },
    { id: "sitting", position: "Sitting", icon: "🪑", answer: "At-tahiyyatu lillah...", ar: "ٱلتَّحِيَّاتُ لِلَّٰهِ", meaning: "All greetings belong to Allah", hint: "The sitting begins the tashahhud." },
    { id: "closing", position: "Closing", icon: "👋", answer: "As-salamu ʿalaykum", ar: "ٱلسَّلَامُ عَلَيْكُمْ", meaning: "Peace be upon you", hint: "The salah closes with salam." },
  ];
  const bank = useMemo(() => shuffle(pairs.map((pair) => pair.answer)), []);
  const [activeId, setActiveId] = useState(pairs[0].id);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const activePair = pairs.find((pair) => pair.id === activeId) || pairs[0];
  const answeredCount = pairs.filter((pair) => answers[pair.id]).length;
  const score = pairs.reduce((n, pair) => n + (answers[pair.id] === pair.answer ? 1 : 0), 0);

  const choosePhrase = (phrase) => {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [activeId]: phrase }));
    const nextUnanswered = pairs.find((pair) => pair.id !== activeId && !answers[pair.id] && pair.answer !== phrase);
    if (nextUnanswered) setActiveId(nextUnanswered.id);
  };

  const clearAnswer = (id) => {
    if (submitted) return;
    setAnswers((current) => {
      const clone = { ...current };
      delete clone[id];
      return clone;
    });
    setActiveId(id);
  };

  return <div>
    <H eyebrow="Question 2" title="Match the position to the words" />
    <P>Tap a position, then tap the phrase that belongs there. No dropdowns. Build the prayer speech-map like a set of connected cards.</P>

    <Box colour={T.gold} bg={T.goldPale}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Tag colour={T.gold}>{answeredCount}/6 matched</Tag>
        <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 900, color: T.grey }}>Active card: {activePair.position}</div>
      </div>
      <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: `${T.gold}25`, overflow: "hidden" }}>
        <div style={{ width: `${Math.round((answeredCount / pairs.length) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${T.gold}, ${T.teal})`, borderRadius: 999 }} />
      </div>
    </Box>

    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.25fr)", gap: 14, alignItems: "start" }}>
      <div style={{ display: "grid", gap: 10 }}>
        {pairs.map((pair) => {
          const selected = activeId === pair.id;
          const answer = answers[pair.id];
          const correct = submitted && answer === pair.answer;
          const wrong = submitted && answer && answer !== pair.answer;
          return <button
            key={pair.id}
            type="button"
            onClick={() => setActiveId(pair.id)}
            style={{
              textAlign: "left",
              border: `2px solid ${submitted ? (correct ? T.green : wrong ? T.coral : T.greyLight) : selected ? T.teal : answer ? T.gold : T.greyLight}`,
              background: submitted ? (correct ? T.greenLight : wrong ? T.coralLight : T.white) : selected ? T.tealLight : answer ? T.goldPale : T.white,
              borderRadius: 20,
              padding: 14,
              cursor: "pointer",
              boxShadow: selected ? "0 12px 28px rgba(42,123,136,.15)" : "0 8px 20px rgba(15,26,46,.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 14, background: T.white, fontSize: 20 }}>{pair.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: F.ui, fontSize: 15, fontWeight: 900, color: T.navy }}>{pair.position}</div>
                <div style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 800, color: answer ? T.teal : T.grey, marginTop: 3 }}>{answer ? answer : "Choose phrase"}</div>
              </div>
            </div>
            {submitted && <div style={{ marginTop: 10, fontFamily: F.body, fontSize: 13, lineHeight: 1.55, color: T.ink }}>
              {correct ? "Correct. " : `Correct answer: ${pair.answer}. `}{pair.hint}
            </div>}
          </button>;
        })}
      </div>

      <Box colour={T.teal} bg={T.tealLight}>
        <Tag colour={T.teal}>Phrase bank</Tag>
        <h3 style={{ fontFamily: F.display, color: T.navy, margin: "10px 0 4px", fontSize: 24 }}>{activePair.icon} {activePair.position}</h3>
        <P>{activePair.hint}</P>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {bank.map((phrase) => {
            const assignedTo = pairs.find((pair) => answers[pair.id] === phrase)?.id;
            const chosenHere = answers[activeId] === phrase;
            const disabled = submitted || (assignedTo && assignedTo !== activeId);
            return <button
              key={phrase}
              type="button"
              disabled={disabled}
              onClick={() => choosePhrase(phrase)}
              style={{
                textAlign: "left",
                border: `2px solid ${chosenHere ? T.teal : T.greyLight}`,
                background: chosenHere ? T.white : disabled ? "#F7F7F7" : T.white,
                opacity: disabled && !chosenHere ? 0.42 : 1,
                borderRadius: 16,
                padding: 14,
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: F.ui,
                fontWeight: 900,
                color: T.navy,
              }}
            >{chosenHere ? "✓ " : ""}{phrase}</button>;
          })}
        </div>
        {answers[activeId] && !submitted && <div style={{ marginTop: 12 }}><Button variant="ghost" onClick={() => clearAnswer(activeId)}>Change this match</Button></div>}
      </Box>
    </div>

    {submitted && <Box colour={score >= 5 ? T.green : T.coral} bg={score >= 5 ? T.greenLight : T.coralLight}>
      <P>You scored {score}/6. The goal is recognition: body position and recitation should become one map.</P>
    </Box>}
    <div style={{ textAlign: "center", marginTop: 18 }}>
      {!submitted ? <Button disabled={answeredCount < pairs.length} onClick={() => setSubmitted(true)}>Submit matches</Button> : <Button onClick={() => onDone(score)}>Continue</Button>}
    </div>
  </div>;
}

function FillPage({ onDone }) {
  const items = [{ name: "Rukuʿ", answer: "ʿAdheem", ar: "ٱلْعَظِيمِ" }, { name: "Sujud", answer: "Aʿla", ar: "ٱلْأَعْلَىٰ" }];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const opts = ["ʿAdheem", "Aʿla", "Akbar", "Hamid"];
  const score = items.reduce((n, x, i) => n + (answers[i] === x.answer ? 1 : 0), 0);
  return <div><H eyebrow="Question 3" title="Complete the phrase" />{items.map((item, i) => <Box key={item.name} colour={i ? T.gold : T.purple} bg={i ? T.goldPale : T.purpleLight}><Tag colour={i ? T.gold : T.purple}>{item.name}</Tag><Ar>سُبْحَانَ رَبِّيَ {submitted && answers[i] === item.answer ? item.ar : "_____"}</Ar><div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>{opts.map((o) => <button key={o} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [i]: o }))} style={{ border: `2px solid ${answers[i] === o ? T.gold : T.greyLight}`, borderRadius: 12, padding: 12, background: T.white, fontFamily: F.ui, fontWeight: 800 }}>{o}</button>)}</div></Box>)}{submitted && <Box colour={score === 2 ? T.green : T.coral} bg={score === 2 ? T.greenLight : T.coralLight}><P>{score}/2. Rukuʿ uses ʿAdheem. Sujud uses Aʿla.</P></Box>}<div style={{ textAlign: "center" }}>{!submitted ? <Button disabled={Object.keys(answers).length < 2} onClick={() => setSubmitted(true)}>Submit</Button> : <Button onClick={() => onDone(score)}>Continue</Button>}</div></div>;
}

function FatihahPage({ next }) {
  const [active, setActive] = useState(0);
  const f = FATIHAH[active];
  return <div><H eyebrow="Section B" title="Al-Fatihah has a structure" /><P>Every rak'ah contains al-Fatihah. Its meaning moves in three stages: praise, declaration, then duʿaʾ.</P><Box colour={f.colour} bg={`${f.colour}18`}><Tag colour={f.colour}>{f.icon} {f.title}</Tag>{f.ayat.map(([ar, en]) => <div key={ar} style={{ background: T.white, borderRadius: 14, padding: 14, marginTop: 10 }}><Ar size={21}>{ar}</Ar><P>{en}</P></div>)}<P>{f.note}</P></Box><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>{FATIHAH.map((x, i) => <button key={x.title} onClick={() => setActive(i)} style={{ border: `2px solid ${active === i ? x.colour : T.greyLight}`, borderRadius: 14, background: active === i ? `${x.colour}18` : T.white, padding: 12, fontFamily: F.ui, fontWeight: 900 }}>{x.icon} {x.title}</button>)}</div><div style={{ textAlign: "center", marginTop: 22 }}><Button onClick={next}>Continue</Button></div></div>;
}

function MeaningSort({ onDone }) {
  const statements = [
    ["Lord of the worlds", true, "This is in al-Fatihah: Rabb al-ʿalamin."],
    ["Guide us to the straight path", true, "This is in al-Fatihah: ihdina al-sirat al-mustaqim."],
    ["Creator of the heavens and earth", false, "This is true about Allah, but it is not one of the phrases in al-Fatihah."],
    ["It is You we worship and You we ask for help", true, "This is the central declaration in al-Fatihah."],
    ["Sovereign of the Day of Recompense", true, "This is in al-Fatihah: Maliki yawm al-din."],
    ["Forgiver of all sins", false, "This is true about Allah, but this exact phrase is not in al-Fatihah."],
  ];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = statements.reduce((n, s, i) => n + (answers[i] === s[1] ? 1 : 0), 0);
  const answeredCount = Object.keys(answers).length;
  const choose = (index, value) => {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [index]: value }));
  };
  return <div>
    <H eyebrow="Question 4" title="Is it in al-Fatihah?" />
    <P>Tap one answer for each card. Your choice will visibly lock in before you submit.</P>
    {statements.map((s, i) => {
      const selected = answers[i];
      const isCorrect = submitted && selected === s[1];
      const isWrong = submitted && selected !== s[1];
      return <Box key={s[0]} colour={submitted ? (isCorrect ? T.green : T.coral) : selected === undefined ? T.greyLight : T.gold} bg={submitted ? (isCorrect ? T.greenLight : T.coralLight) : selected === undefined ? T.white : T.goldPale}>
        <P>{s[0]}</P>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {[true, false].map((value) => {
            const active = selected === value;
            const label = value ? "In al-Fatihah" : "Not there";
            return <button key={label} type="button" aria-pressed={active} disabled={submitted} onClick={() => choose(i, value)} style={{ border: `2px solid ${active ? T.teal : T.greyLight}`, background: active ? T.tealLight : T.white, color: active ? T.navy : T.grey, borderRadius: 14, padding: "13px 12px", fontFamily: F.ui, fontWeight: 900, cursor: submitted ? "default" : "pointer", boxShadow: active ? "0 8px 18px rgba(42,123,136,.16)" : "none" }}>{active ? "✓ " : ""}{label}</button>;
          })}
        </div>
        {submitted && <div style={{ marginTop: 12 }}><P>{isCorrect ? "Correct." : `Not quite. Correct answer: ${s[1] ? "In al-Fatihah" : "Not there"}.`} {s[2]}</P></div>}
      </Box>;
    })}
    {submitted && <Box colour={score >= 5 ? T.green : T.coral} bg={score >= 5 ? T.greenLight : T.coralLight}><P>{score}/6. Some statements are true about Allah, but this question is asking whether the phrase appears in al-Fatihah.</P></Box>}
    <div style={{ textAlign: "center" }}>{!submitted ? <><P>{answeredCount}/6 answered</P><Button disabled={answeredCount < statements.length} onClick={() => setSubmitted(true)}>Submit</Button></> : <Button onClick={() => onDone(score)}>Continue</Button>}</div>
  </div>;
}

function RapidPage({ onDone }) {
  const cards = [["Al-Fatihah starts with a request before praise.", false, "It begins with praise of Allah, then moves to request."], ["The tashahhud includes the Shahadah.", true, "Yes. The testimony appears inside tashahhud."], ["Subhana Rabbiyal-Aʿla is said in sujud.", true, "Correct. At the lowest position, you praise the Most High."], ["As-salamu ʿalaykum closes the prayer.", true, "Correct. Salam is the closing of salah."], ["The salawat is sent on the Prophet (peace be upon him) in the final sitting.", true, "Correct. After tashahhud in the final sitting, salawat is recited."]];
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [hits, setHits] = useState(0);
  const current = cards[i];
  const choose = (v) => {
    if (answered) return;
    const ok = v === current[1];
    setLastCorrect(ok);
    if (ok) setHits((h) => h + 1);
    setAnswered(true);
  };
  const next = () => { if (i === cards.length - 1) onDone(hits); else { setI((x) => x + 1); setAnswered(false); setLastCorrect(null); } };
  return <div><H eyebrow="Question 5" title="Rapid fire: true or false" /><Box colour={answered ? (lastCorrect ? T.green : T.coral) : T.gold} bg={answered ? (lastCorrect ? T.greenLight : T.coralLight) : T.goldPale}><Tag colour={answered ? (lastCorrect ? T.green : T.coral) : T.gold}>{answered ? (lastCorrect ? "Correct" : "Not quite") : `${i + 1}/${cards.length}`}</Tag><h3 style={{ fontFamily: F.display, fontSize: 25 }}>{current[0]}</h3>{answered && <><P>{current[2]}</P><P>Correct answer: {current[1] ? "True" : "False"}.</P></>}</Box><div style={{ display: "flex", justifyContent: "center", gap: 10 }}>{!answered ? <><Button onClick={() => choose(true)}>True</Button><Button variant="ghost" onClick={() => choose(false)}>False</Button></> : <Button onClick={next}>{i === cards.length - 1 ? "Finish" : "Next"}</Button>}</div></div>;
}

function StructurePage({ next }) {
  return <div><H eyebrow="Synthesis" title="What you now know" /><Box colour={T.teal} bg={T.tealLight}><P>Salah is not empty movement. The body moves, and the tongue rises with meaning.</P><P>Standing opens with greatness. Bowing and prostration declare glory. Sitting renews testimony. Al-Fatihah praises, declares, and asks for guidance.</P></Box><div style={{ textAlign: "center" }}><Button onClick={next}>Final question</Button></div></div>;
}

function Takeaway({ next }) {
  return <div><H eyebrow="Takeaway" title="The words are now attached to the movements" /><Box colour={T.gold} bg={T.goldPale}><P>You do not need to master everything in one day. But you now have the map: where each phrase belongs, why al-Fatihah is central, and how the tashahhud closes the prayer with testimony and peace.</P></Box><div style={{ textAlign: "center" }}><Button onClick={next}>See Results</Button></div></div>;
}

function Checkpoint({ scores, reset, onGoToHifz, onGoToNext, onBack }) {
  const max = { q1: 1, q2: 6, q3: 2, q4: 6, q5: 5, q6: 1 };
  const total = Object.entries(max).reduce((n, [k]) => n + (scores[k] ?? 0), 0);
  const outOf = Object.values(max).reduce((a, b) => a + b, 0);
  const pct = Math.round((total / outOf) * 100);
  const items = ["Al-Fatihah structure", "Core movement recitations", "Sitting words placed correctly", "Salawat introduced", "Scenario judgement"];
  return <div><H eyebrow="Checkpoint" title="Lesson complete" /><Box colour={pct >= 70 ? T.green : T.gold} bg={pct >= 70 ? T.greenLight : T.goldPale}><div style={{ textAlign: "center" }}><div style={{ fontFamily: F.display, fontSize: 58, color: T.navy }}>{pct}%</div><P>{total}/{outOf} points</P></div></Box><Box colour={T.teal} bg={T.tealLight}><Tag colour={T.teal}>Mastered</Tag>{items.map((x) => <div key={x} style={{ fontFamily: F.ui, fontWeight: 800, marginTop: 10 }}>✓ {x}</div>)}</Box><Box colour={T.gold} bg={T.goldPale}><Tag colour={T.gold}>Ready for practice</Tag><P>You can now attach the main words to the main movements of salah. Keep practising slowly and correctly.</P></Box><div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}><Button onClick={onGoToNext}>Continue to Lesson 5</Button><Button variant="ghost" onClick={onGoToHifz}>Practice Hifz</Button></div><div style={{ textAlign: "center", marginTop: 10 }}><button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: F.ui, color: T.grayMed, fontWeight: 500 }}>Back to lessons</button></div></div>;
}
