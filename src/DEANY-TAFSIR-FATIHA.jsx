import React, { useMemo, useState } from "react";


const ayahs = [
  {
    id: "1",
    label: "Ayah 1",
    title: "Beginning with Allah’s name",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translit: "Bismillāhi r-raḥmāni r-raḥīm",
    translation: "In the name of Allah, the Most Compassionate, Most Merciful.",
    source:
      "Based on Ibn Kathir’s discussion of the Basmalah and the names Ar-Rahman and Ar-Rahim.",
    explanation:
      "Al-Fatiha opens by attaching the recitation to Allah’s name. The first meaning the learner meets is mercy: Ar-Rahman and Ar-Rahim. The surah does not begin coldly. It begins with the name of Allah and with a reminder that His mercy surrounds the servant before the request for guidance is even made.",
    salah:
      "When you begin Al-Fatiha in salah, slow down enough to feel that you are beginning in Allah’s name, not simply starting a memorised passage.",
  },
  {
    id: "2",
    label: "Ayah 2",
    title: "Praise and Lordship",
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translit: "Al-ḥamdu lillāhi rabbi l-ʿālamīn",
    translation: "All praise is for Allah, Lord of all worlds.",
    source:
      "Based on Ibn Kathir’s explanation of Al-Hamd, Rabb, and Al-‘Alamin.",
    explanation:
      "The servant praises Allah because He is the Lord, Owner, Master, and Sustainer of all worlds. Praise is not only a sentence on the tongue. It is recognition that every blessing, every form of provision, and every act of guidance ultimately comes from Allah.",
    salah:
      "This ayah turns the heart away from self-reliance and back to gratitude: all praise belongs to Allah.",
  },
  {
    id: "3",
    label: "Ayah 3",
    title: "Mercy returns",
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    translit: "Ar-raḥmāni r-raḥīm",
    translation: "The Most Compassionate, Most Merciful.",
    source:
      "Based on Ibn Kathir’s explanation of Ar-Rahman and Ar-Rahim as names of mercy.",
    explanation:
      "After Allah is praised as Lord of all worlds, mercy is mentioned again. This matters. Allah’s Lordship is not distant or harsh. The servant stands before the Lord of all worlds, but also before the Most Compassionate, Most Merciful.",
    salah:
      "This ayah balances awe with hope. You are standing before the Lord, but the Lord you are calling upon is merciful.",
  },
  {
    id: "4",
    label: "Ayah 4",
    title: "Accountability before Allah",
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    translit: "Māliki yawmi d-dīn",
    translation: "Master of the Day of Judgement.",
    source:
      "Based on Ibn Kathir’s explanation of Allah’s ownership and authority on the Day of Recompense.",
    explanation:
      "The surah now moves from mercy to accountability. Allah is Master of the Day when people return to Him and are recompensed for their deeds. The servant remembers that life is not random, hidden actions are not lost, and the final return is to Allah.",
    salah:
      "This ayah should make the recitation serious. Mercy gives hope, and Judgement gives weight to how we live.",
  },
  {
    id: "5",
    label: "Ayah 5",
    title: "Worship and reliance",
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translit: "Iyyāka naʿbudu wa iyyāka nastaʿīn",
    translation: "You alone we worship, and You alone we ask for help.",
    source:
      "Based on Ibn Kathir’s explanation that worship is for Allah alone and help is sought from Him.",
    explanation:
      "This is the turning point. The servant moves from speaking about Allah to speaking directly to Allah. Worship and seeking help are joined together: the servant worships Allah alone, and also admits that even worship cannot be done properly without Allah’s help.",
    salah:
      "In this ayah, you are not only reciting meaning. You are making a declaration: I worship You, and I need You.",
  },
  {
    id: "6",
    label: "Ayah 6",
    title: "The central request",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translit: "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
    translation: "Guide us to the straight path.",
    source:
      "Based on Ibn Kathir’s explanation of guidance and the straight path.",
    explanation:
      "After praise, mercy, Judgement, worship, and reliance, the servant asks for the thing they need most: guidance. The straight path is not merely information. It is being led by Allah to what is true, pleasing to Him, and ultimately saving.",
    salah:
      "Every salah repeats this request because the servant never outgrows the need for guidance.",
  },
  {
    id: "7",
    label: "Ayah 7",
    title: "The path to follow and the paths to avoid",
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    translit:
      "Ṣirāṭa lladhīna anʿamta ʿalayhim, ghayri l-maghḍūbi ʿalayhim wa la ḍ-ḍāllīn",
    translation:
      "The path of those You have blessed, not of those who have earned anger, nor of those who are astray.",
    source:
      "Based on Ibn Kathir’s explanation of the blessed path and the contrast with anger and misguidance.",
    explanation:
      "The final ayah explains guidance by showing the path we want and the paths we fear. The straight path is the path of those Allah has blessed. The servant also asks to be protected from ways that lead to anger or misguidance. Guidance means knowing the truth, loving it, and walking upon it.",
    salah:
      "This ending makes the request practical: do not only ask to know the right path. Ask Allah to keep you on it.",
  },
];

const checkpointOptions = [
  {
    id: "correct",
    text: "The surah begins with Allah’s name and mercy, moves into praise and Lordship, then brings the servant before the reality of Judgement.",
  },
  {
    id: "guidance-first",
    text: "The surah begins by asking for guidance, then later explains who Allah is and why He should be praised.",
  },
  {
    id: "judgement-only",
    text: "The opening section is mainly about Judgement, while mercy and praise are secondary background details.",
  },
  {
    id: "worship-first",
    text: "The opening section begins with the servant’s worship, then later introduces Allah’s names and attributes.",
  },
];

const flowItems = [
  { id: "begin", text: "Begin with Allah’s name and mercy" },
  { id: "praise", text: "Praise Allah as Lord of all worlds" },
  { id: "mercy", text: "Return to Allah’s mercy" },
  { id: "judgement", text: "Remember the Day of Judgement" },
  { id: "worship", text: "Declare worship and reliance" },
  { id: "guidance", text: "Ask for the straight path" },
  { id: "path", text: "Ask for the blessed path and protection from misguidance" },
];

const correctFlow = ["begin", "praise", "mercy", "judgement", "worship", "guidance", "path"];

function Button({ children, onClick, disabled = false, variant = "primary", className = "" }) {
  const styles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    dark: "bg-slate-950 text-white hover:bg-slate-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <section className={`rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function SourceNote() {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
      This lesson is a Deany summary based on Tafsir Ibn Kathir. It is not a direct quotation unless a passage is clearly marked as a quote. Full source details are included at the end of the lesson.
    </div>
  );
}

function SourceReference() {
  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Source</p>
      <h2 className="mt-3 text-3xl font-black text-slate-950">Primary reference for this lesson</h2>
      <div className="mt-5 rounded-3xl bg-slate-50 p-5">
        <p className="text-sm font-black leading-7 text-slate-900">
          Tafsir Ibn Kathir, Surah Al-Fatihah section, authorised English translation provided for this Deany lesson.
        </p>
        <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
          Sections used: the names and virtues of Al-Fatiha, its status in prayer, the explanation of the Basmalah, the ayah-by-ayah meanings, and the discussion of saying Amin after recitation.
        </p>
      </div>
      <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
        Editorial note: the lesson text is written as Deany explanatory summary. Any future direct quote from the translation should be kept short, clearly marked as a quotation, and reviewed against the authorised source before publishing.
      </div>
    </Card>
  );
}

function Header({ onRestart, progress }) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Deany Quran · Tafsir</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Surah Al-Fatiha</h2>
        </div>
        <Button variant="secondary" onClick={onRestart}>Restart</Button>
      </header>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(4, progress)}%` }} />
      </div>
    </>
  );
}

function Intro({ onNext }) {
  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-br from-white to-emerald-50">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Before we begin</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">Why Al-Fatiha matters</h1>
        <p className="mt-5 max-w-3xl text-lg font-bold leading-8 text-slate-600">
          Ibn Kathir presents Al-Fatiha as a surah of special status: the Opening of the Book, the seven often-repeated verses, and a surah deeply tied to prayer. It is short, but it carries the whole movement of worship: praise, mercy, accountability, reliance, and guidance. The source reference for this lesson can be found at the end.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Status</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">Not just an opening</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">Al-Fatiha is recited constantly in salah, so understanding it changes the way a person prays.</p>
        </Card>
        <Card>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Shape</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">A complete movement</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">The surah begins with Allah, then brings the servant to the request for guidance.</p>
        </Card>
        <Card>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Aim</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">Presence in salah</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">The goal is not information alone. It is to recite with more awareness.</p>
        </Card>
      </div>

      <SourceNote />
      <div className="flex justify-end"><Button onClick={onNext}>Begin lesson</Button></div>
    </div>
  );
}

function AyahPage({ item, onNext }) {
  return (
    <div className="space-y-5">
      <Card>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">{item.label}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{item.title}</h1>

        <div className="mt-6 rounded-[2rem] border border-slate-100 bg-[#fbfaf5] p-6 text-center shadow-inner">
          <p dir="rtl" className="text-4xl leading-loose text-slate-950 md:text-5xl">{item.arabic}</p>
          <p className="mt-4 text-sm font-bold italic text-slate-500">{item.translit}</p>
          <p className="mt-2 text-base font-bold leading-7 text-slate-800">{item.translation}</p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Source basis</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{item.source}</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Explanation</p>
            <p className="mt-2 text-sm font-bold leading-7 text-emerald-950">{item.explanation}</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">In salah</p>
          <p className="mt-2 text-base font-black leading-7">{item.salah}</p>
        </div>
      </Card>

      <div className="flex justify-end"><Button onClick={onNext}>Continue</Button></div>
    </div>
  );
}

function CheckpointOne({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const options = useMemo(() => [...checkpointOptions].sort(() => Math.random() - 0.5), []);
  const correct = selected === "correct";

  function choose(id) {
    setSelected(id);
    setAnswered(true);
  }

  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Checkpoint</p>
      <h1 className="mt-3 text-4xl font-black text-slate-950">What journey has the surah taken so far?</h1>
      <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-600">
        Think about the movement from the Basmalah through the Day of Judgement.
      </p>

      <div className="mt-5 grid gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => choose(option.id)}
            className={`rounded-2xl border p-4 text-left text-sm font-black leading-6 transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 ${selected === option.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"}`}
          >
            {option.text}
          </button>
        ))}
      </div>

      {answered && (
        <div className={`mt-5 rounded-3xl p-5 ${correct ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
          <p className="text-xs font-black uppercase tracking-[0.18em]">{correct ? "Correct" : "Not quite"}</p>
          <p className="mt-2 text-sm font-bold leading-6">
            {correct
              ? "Good. The first half moves from Allah’s name and mercy, to praise and Lordship, then to accountability before Him."
              : "Close, but the order matters. The first half does not begin with the request for guidance. It prepares the heart before the request is made."}
          </p>
          <div className="mt-4 flex gap-3">
            {correct ? <Button onClick={onComplete}>Continue</Button> : <Button variant="secondary" onClick={() => { setSelected(null); setAnswered(false); }}>Try again</Button>}
          </div>
        </div>
      )}
    </Card>
  );
}

function FlowOrdering({ onComplete }) {
  const [picked, setPicked] = useState([]);
  const [result, setResult] = useState(null);
  const choices = useMemo(() => [...flowItems].sort(() => Math.random() - 0.5), []);

  function pick(item) {
    if (picked.includes(item.id) || result === "correct") return;
    const next = [...picked, item.id];
    setPicked(next);
    if (next.length === correctFlow.length) {
      setResult(next.join("|") === correctFlow.join("|") ? "correct" : "wrong");
    }
  }

  function reset() {
    setPicked([]);
    setResult(null);
  }

  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Flow check</p>
      <h1 className="mt-3 text-4xl font-black text-slate-950">Put Al-Fatiha’s meaning in order</h1>
      <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-600">
        Tap the cards in the order the surah moves. This tests the whole meaning, not one isolated fact.
      </p>

      <div className="mt-5 rounded-3xl bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Your order</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {picked.length === 0 && <span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-slate-400">No cards selected yet</span>}
          {picked.map((id, index) => {
            const item = flowItems.find((entry) => entry.id === id);
            return <span key={id} className="rounded-full bg-white px-3 py-2 text-sm font-black text-slate-700">{index + 1}. {item?.text}</span>;
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {choices.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={picked.includes(item.id) || result === "correct"}
            onClick={() => pick(item)}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-black leading-6 transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {item.text}
          </button>
        ))}
      </div>

      {result && (
        <div className={`mt-5 rounded-3xl p-5 ${result === "correct" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
          <p className="text-xs font-black uppercase tracking-[0.18em]">{result === "correct" ? "Correct flow" : "Not quite"}</p>
          <p className="mt-2 text-sm font-bold leading-6">
            {result === "correct"
              ? "Good. You are seeing Al-Fatiha as one connected prayer, not disconnected lines."
              : "The ideas are right, but the order is off. Reset and rebuild the journey from Allah’s name to the request for guidance."}
          </p>
          <div className="mt-4 flex gap-3">
            {result === "correct" ? <Button onClick={onComplete}>Continue</Button> : <Button variant="secondary" onClick={reset}>Reset order</Button>}
          </div>
        </div>
      )}
    </Card>
  );
}

function Reflection({ onComplete }) {
  const [choice, setChoice] = useState(null);
  const reflections = [
    "Beginning with Allah’s name",
    "Praising Allah as Lord",
    "Remembering Allah’s mercy",
    "Standing before the Day of Judgement",
    "Saying: You alone we worship and ask for help",
    "Asking for the straight path",
    "Asking to follow the blessed path",
  ];

  return (
    <Card className="bg-gradient-to-br from-white to-emerald-50">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Reflection</p>
      <h1 className="mt-3 text-4xl font-black text-slate-950">Where should you slow down in your next salah?</h1>
      <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-600">
        There is no wrong answer here. Choose the part of Al-Fatiha you most want to recite with more presence.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {reflections.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setChoice(item)}
            className={`rounded-2xl border p-4 text-left text-sm font-black leading-6 transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 ${choice === item ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {choice && (
        <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Your focus</p>
          <p className="mt-2 text-lg font-black leading-7">Next time you recite Al-Fatiha, slow down at: {choice}.</p>
          <div className="mt-4"><Button onClick={onComplete}>Finish lesson</Button></div>
        </div>
      )}
    </Card>
  );
}

function Completion({ onRestart, onGoToHifz }) {
  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-br from-white to-emerald-50">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Lesson complete</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">Al-Fatiha in one flow</h1>
        <div className="mt-6 grid gap-3">
          {flowItems.map((item, index) => (
            <div key={item.id} className="flex gap-3 rounded-3xl bg-white p-4 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">{index + 1}</span>
              <p className="text-sm font-black leading-7 text-slate-800">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onGoToHifz} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-100">Return to memorisation</button>
          <button disabled className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-400 shadow-sm cursor-not-allowed">Next tafsir lesson — coming soon</button>
          <Button variant="secondary" onClick={onRestart}>Restart</Button>
        </div>
      </Card>
      <SourceNote />
      <SourceReference />
    </div>
  );
}

export default function DeanyFatihaTafsirBeginnerIbnKathir({ onBack, onHome, onGoToHifz }) {
  const [step, setStep] = useState(0);

  const totalSteps = 12;
  const progress = (step / totalSteps) * 100;

  function restart() {
    setStep(0);
  }

  function next() {
    setStep((value) => value + 1);
  }

  let screen;
  if (step === 0) screen = <Intro onNext={next} />;
  else if (step >= 1 && step <= 4) screen = <AyahPage item={ayahs[step - 1]} onNext={next} />;
  else if (step === 5) screen = <CheckpointOne onComplete={next} />;
  else if (step >= 6 && step <= 8) screen = <AyahPage item={ayahs[step - 2]} onNext={next} />;
  else if (step === 9) screen = <FlowOrdering onComplete={next} />;
  else if (step === 10) screen = <Reflection onComplete={next} />;
  else screen = <Completion onRestart={restart} onGoToHifz={onGoToHifz} />;

  return (
    <main className="min-h-screen bg-[#fbfbf8] p-6 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-5">
        <Header onRestart={restart} progress={progress} />
        {screen}
      </div>
    </main>
  );
}
