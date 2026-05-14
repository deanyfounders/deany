import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "deany_b1_shahadah_lesson3_ship_ready_final_v2";
const SHIP_READY = true;
const MAX_SCORE = 8;

const verse318 = {
  ar: "\u0634\u064E\u0647\u0650\u062F\u064E \u0671\u0644\u0644\u0651\u064E\u0647\u064F \u0623\u064E\u0646\u0651\u064E\u0647\u06E5 \u0644\u064E\u0622 \u0625\u0650\u0644\u064E\u0670\u0647\u064E \u0625\u0650\u0644\u0651\u064E\u0627 \u0647\u064F\u0648\u064E \u0648\u064E\u0671\u0644\u0652\u0645\u064E\u0644\u064E\u0670\u0653\u0626\u0650\u0643\u064E\u0629\u064F \u0648\u064E\u0623\u064F\u0648\u06DF\u0644\u064F\u0648\u0627\u06DF \u0671\u0644\u0652\u0639\u0650\u0644\u0652\u0645\u0650 \u0642\u064E\u0622\u0626\u0650\u0645\u064B\u06E2\u0627 \u0628\u0650\u0671\u0644\u0652\u0642\u0650\u0633\u0652\u0637\u0650 \u06DA \u0644\u064E\u0622 \u0625\u0650\u0644\u064E\u0670\u0647\u064E \u0625\u0650\u0644\u0651\u064E\u0627 \u0647\u064F\u0648\u064E \u0671\u0644\u0652\u0639\u064E\u0632\u0650\u064A\u0632\u064F \u0671\u0644\u0652\u062D\u064E\u0643\u0650\u064A\u0645\u064F",
  en: "Allah witnesses that there is no deity except Him, and [so do] the angels and those of knowledge, [that He is] maintaining [creation] in justice. There is no deity except Him, the Exalted in Might, the Wise."
};

const questions = {
  q1: {
    points: 1,
    title: "Question 1 \u00b7 Think",
    prompt: "In a practising Muslim's life, the Shahadah is present in which way?",
    options: [
      ["Only once, at the moment of entering Islam.", false, "The Shahadah opens the door to Islam, but it does not stay only at the doorway. It is renewed throughout Muslim life, especially in prayer."],
      ["In two modes: renewed at structural moments and expressed through the four other pillars.", true, "Correct. It is renewed on the tongue and lived through worship: salah, zakah, sawm, and Hajj."],
      ["Only when faith feels strong and someone wants to recommit.", false, "That makes the Shahadah feeling-dependent. The Shahadah is a testimony of truth, not a mood."],
      ["Only at major life events such as birth, marriage, and death.", false, "Major moments matter, but the Shahadah is woven into everyday worship."],
    ]
  },
  q3: {
    points: 1,
    title: "Question 3 \u00b7 Count",
    prompt: "In obligatory prayer alone, how many times does a practising Muslim recite the Shahadah every day?",
    options: [
      ["Five, once per prayer.", false, "This counts the prayers, not the tashahhuds. Prayers of three or four rak'at have two tashahhuds."],
      ["Seventeen, once per rak'ah.", false, "There are 17 obligatory rak'at, but the Shahadah is recited in the sitting recitation, not in every rak'ah."],
      ["Nine, once in each tashahhud sitting.", true, "Correct. Fajr has one. Dhuhr, Asr, Maghrib, and Isha each have two. 1 + 2 + 2 + 2 + 2 = 9."],
      ["It varies because the Shahadah is not part of obligatory prayer.", false, "The Shahadah is part of the tashahhud, the sitting recitation in prayer."],
    ]
  },
  q4: {
    points: 1,
    title: "Question 4 \u00b7 Apply carefully",
    prompt: "Karim sincerely declared the Shahadah at age 22 and practised consistently for five years. He has now drifted. He prays inconsistently, has stopped giving zakah, and rarely attends the mosque. He still believes in Allah and in the Prophet \uFDFA as Messenger. His brother says Karim's Shahadah no longer counts and that he must re-declare it. Which response is safest and most accurate?",
    options: [
      ["The brother is correct. Sustained weak practice automatically erases the original Shahadah.", false, "This is not a safe conclusion. Karim's neglect is serious, but his brother should not treat weak practice as automatic proof that Karim's Shahadah has disappeared."],
      ["The brother is correct, but only because Karim stopped giving zakah specifically.", false, "Stopping zakah is serious and must be addressed, but this answer treats one neglected obligation as automatically erasing the Shahadah."],
      ["The brother is incorrect. Karim needs repentance, support, and a path back to prayer and zakah. His brother should not declare his Shahadah erased from this information.", true, "Correct. Karim's drift is serious and must not be minimised, but the answer is not careless judgement. He needs help returning to prayer, zakah, and consistent worship."],
      ["The brother is incorrect only because Karim has not committed a specific disqualifying sin.", false, "The conclusion is right, but the reasoning is unsafe. This lesson avoids threshold-games and focuses on support, repentance, and returning to obligations."],
    ]
  },
  q5: {
    points: 1,
    title: "Question 5 \u00b7 Capstone",
    prompt: "Which statement best captures the Shahadah after all three lessons?",
    options: [
      ["A sentence whose recitation guarantees salvation regardless of practice.", false, "This detaches the Shahadah from its weight. The testimony is essential, but it is also binding. Practice matters."],
      ["A personal expression of religious feeling, renewed when faith feels strong.", false, "The Shahadah is not feeling-dependent. It is renewed structurally even when feelings rise and fall."],
      ["A testimony entered formally, renewed across daily life, expressed through the pillars, and joined to a witness Allah Himself has made.", true, "Correct. This gathers the whole module: testimony, renewal, lived obligation, and the witness recorded in Qur'an 3:18."],
      ["A creed mainly useful for distinguishing Muslims from non-Muslims doctrinally.", false, "That is too narrow. The Shahadah is doctrine, worship, renewal, action, and witness."],
    ]
  }
};

const pillarMatches = [
  { id: "salah", pillar: "Salah", title: "Testimony with the body", statement: "That Allah is the only One before whom the body bows in worship.", feedback: "Salah makes the body's posture follow the tongue's testimony: standing, bowing, and prostrating for Allah." },
  { id: "zakah", pillar: "Zakah", title: "Wealth is not an ilah", statement: "That wealth must remain below obedience to Allah.", feedback: "Zakah trains the heart not to treat wealth as ultimate. Giving from wealth challenges greed and attachment." },
  { id: "sawm", pillar: "Sawm", title: "Desire is not an ilah", statement: "That hunger, thirst, and physical desire are real needs, but not gods.", feedback: "Sawm denies the body's strongest pulls for fixed hours, testifying that desire does not rule the believer." },
  { id: "hajj", pillar: "Hajj", title: "The whole life ordered by worship", statement: "That body, wealth, travel, status, and memory can be ordered around obedience to Allah.", feedback: "Hajj gathers body, travel, wealth, status, and memory into one defined act of worship." },
];

const prayers = [
  ["Fajr", 2, 1],
  ["Dhuhr", 4, 2],
  ["Asr", 4, 2],
  ["Maghrib", 3, 2],
  ["Isha", 4, 2],
];

const cx = (...x) => x.filter(Boolean).join(" ");
const shuffle = (items) => [...items].map((value) => ({ value, n: Math.random() })).sort((a, b) => a.n - b.n).map((item) => item.value);
const scoreTotal = (scores) => ["q1", "q2", "q3", "q4", "q5"].reduce((sum, key) => sum + (Number(scores[key]) || 0), 0);

function loadState() {
  if (typeof window === "undefined") return { page: 0, scores: {}, confidence: 3 };
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || { page: 0, scores: {}, confidence: 3 }; } catch { return { page: 0, scores: {}, confidence: 3 }; }
}
function saveState(state) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    gold: "bg-amber-100 text-amber-800",
    teal: "bg-teal-100 text-teal-800",
    purple: "bg-purple-100 text-purple-800",
    green: "bg-emerald-100 text-emerald-800",
    rose: "bg-rose-100 text-rose-800",
  };
  return <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-black", tones[tone])}>{children}</span>;
}
function Button({ children, onClick, disabled, variant = "primary" }) {
  const variants = { primary: "bg-teal-700 text-white hover:bg-teal-800", gold: "bg-amber-500 text-slate-950 hover:bg-amber-600", soft: "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50" };
  return <button type="button" disabled={disabled} onClick={onClick} className={cx("rounded-2xl px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-45", variants[variant])}>{children}</button>;
}
function Card({ children, className = "" }) { return <section className={cx("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm", className)}>{children}</section>; }
function Label({ children, className = "" }) { return <p className={cx("text-xs font-black uppercase tracking-[0.2em] text-slate-500", className)}>{children}</p>; }
function Arabic({ children, className = "" }) { return <div dir="rtl" lang="ar" className={cx("font-serif text-[1.85rem] leading-loose tracking-wide text-slate-950 sm:text-4xl", className)}>{children}</div>; }

function Header({ page, totalPages, score, onBack }) {
  return <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div className="mx-auto max-w-5xl px-4 py-3">
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-700 transition-all" style={{ width: `${Math.round(((page + 1) / totalPages) * 100)}%` }} /></div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && <button type="button" onClick={onBack} className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition" aria-label="Back to lessons">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </button>}
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">B1.3 · Beginner tier</p><h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Living the Shahadah</h1></div>
        </div>
        <div className="flex flex-wrap gap-2"><Pill tone="teal">Score {score}/{MAX_SCORE}</Pill><Pill>Page {page + 1}/{totalPages}</Pill></div>
      </div>
    </div>
  </header>;
}

function MCPage({ data, onSave }) {
  const options = useMemo(() => shuffle(data.options), [data]);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const chosen = selected === null ? null : options[selected];
  const correct = Boolean(chosen?.[1]);
  const right = options.find((option) => option[1]);
  return <div className="grid gap-5">
    <Card><Pill tone="purple">{data.title}</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Choose the best answer.</h2><p className="mt-3 text-lg font-semibold leading-8 text-slate-800">{data.prompt}</p></Card>
    <div className="grid gap-3">{options.map((option, index) => {
      const active = selected === index;
      const showRight = submitted && option[1];
      const showWrong = submitted && active && !option[1];
      return <button key={option[0]} type="button" disabled={submitted} onClick={() => setSelected(index)} className={cx("rounded-3xl border p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200", showRight ? "border-emerald-300 bg-emerald-50" : showWrong ? "border-rose-300 bg-rose-50" : active ? "border-teal-500 bg-teal-50" : submitted ? "border-slate-200 bg-white opacity-40" : "border-slate-200 bg-white hover:bg-slate-50")}><p className="font-semibold leading-7 text-slate-800">{option[0]}</p></button>;
    })}</div>
    {!submitted && <Button disabled={selected === null} onClick={() => setSubmitted(true)}>Check answer</Button>}
    {submitted && <Card className={correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}><h3 className={cx("text-xl font-black", correct ? "text-emerald-900" : "text-rose-900")}>{correct ? "Correct" : "Review"}</h3><p className="mt-2 leading-7 text-slate-700">{chosen?.[2]}</p>{!correct && <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-emerald-900 ring-1 ring-emerald-200">Correct answer: {right?.[0]}</p>}<div className="mt-4"><Button onClick={() => onSave(correct ? data.points : 0)}>Save and continue</Button></div></Card>}
  </div>;
}

function MatchPage({ onSave }) {
  const statements = useMemo(() => shuffle(pillarMatches.map((x) => ({ id: x.id, text: x.statement }))), []);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const complete = pillarMatches.every((item) => answers[item.id]);
  const score = pillarMatches.reduce((sum, item) => sum + (answers[item.id] === item.id ? 1 : 0), 0);
  return <div className="grid gap-5">
    <Card><Pill tone="teal">Question 2 · Match</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Match the pillar to its form of testimony.</h2><p className="mt-3 leading-8 text-slate-700">For each pillar, choose what the believer is testifying to through that act.</p></Card>
    <Card className="border-amber-200 bg-amber-50"><Label className="text-amber-800">Available statements</Label><div className="mt-4 grid gap-3 md:grid-cols-2">{statements.map((s) => <div key={s.id} className="rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-amber-200">{s.text}</div>)}</div></Card>
    <div className="grid gap-3">{pillarMatches.map((item) => {
      const selected = answers[item.id];
      const correct = submitted && selected === item.id;
      const wrong = submitted && selected !== item.id;
      return <Card key={item.id} className={cx(correct ? "border-emerald-300 bg-emerald-50" : "", wrong ? "border-rose-300 bg-rose-50" : "")}>
        <div className="grid gap-4 md:grid-cols-[180px_1fr]"><div><Label>Pillar</Label><h3 className="mt-2 text-2xl font-black text-slate-950">{item.pillar}</h3><p className="mt-2 text-sm font-bold text-amber-800">{item.title}</p></div>
        <div className="grid gap-2">{statements.map((statement) => <button key={statement.id} type="button" disabled={submitted} onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: statement.id }))} className={cx("rounded-2xl border p-4 text-left text-sm font-semibold leading-6 transition focus:outline-none focus:ring-4 focus:ring-teal-200", selected === statement.id ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:bg-slate-50")}>{statement.text}</button>)}
        {submitted && <div className="mt-2 grid gap-2 text-sm font-semibold leading-6 text-slate-700"><p><span className={correct ? "text-emerald-800" : "text-rose-800"}>{correct ? "Correct. " : "Review. "}</span>{item.feedback}</p>{wrong && <p className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-emerald-900 ring-1 ring-emerald-200">Correct match: {item.statement}</p>}</div>}</div></div>
      </Card>;
    })}</div>
    {!submitted && <Button disabled={!complete} onClick={() => setSubmitted(true)}>Submit matches</Button>}
    {submitted && <Card><Pill tone={score >= 3 ? "green" : "rose"}>Score {score}/4</Pill><div className="mt-4"><Button onClick={() => onSave(score)}>Save and continue</Button></div></Card>}
  </div>;
}

function IntroPage() {
  return <div className="grid gap-6">
    <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-8 text-white shadow-sm sm:p-10"><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Lesson 3 of the Shahadah module</p><p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">Module closer</p><h2 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">Living the Shahadah</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">The doorway has been opened. This lesson asks what it means to live on the other side of it.</p><div className="mt-6 flex flex-wrap gap-2"><Pill tone="gold">15 min</Pill><Pill tone="teal">5 checks</Pill><Pill tone="purple">Ship-ready</Pill></div></div>
    <Card className="border-amber-200 bg-amber-50"><Pill tone="gold">Goal of this lesson</Pill><h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Connect the Shahadah to daily worship, the other pillars, and the witness Allah Himself has made.</h3><div className="mt-4 grid gap-3 leading-8 text-slate-800"><p>Lesson 1 worked through the first testimony: ilah, negation before affirmation, and ashhadu.</p><p>Lesson 2 worked through the second testimony: rasul, following the Messenger \uFDFA, and the Qur'an's command to obey him.</p><p>This lesson closes the module by asking how the Shahadah is lived.</p></div></Card>
  </div>;
}

function ModesPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">Two modes</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The Shahadah is present in two ways.</h2><p className="mt-3 leading-8 text-slate-700">A Muslim does not say the Shahadah once and then leave it behind. The testimony remains present through renewal and through action.</p></Card>
    <div className="grid gap-4 md:grid-cols-2"><Card className="border-amber-200 bg-amber-50"><Label className="text-amber-800">Mode 1 · Renewal</Label><h3 className="mt-4 text-2xl font-black text-amber-950">The Shahadah repeated</h3><p className="mt-3 text-sm font-semibold leading-7 text-slate-700">Prayer, tashahhud, dhikr, and major moments of Muslim life keep the testimony on the tongue.</p></Card><Card className="border-teal-200 bg-teal-50"><Label className="text-teal-800">Mode 2 · Action</Label><h3 className="mt-4 text-2xl font-black text-teal-950">The Shahadah enacted</h3><p className="mt-3 text-sm font-semibold leading-7 text-slate-700">Salah, zakah, sawm, and Hajj express the testimony through body, wealth, desire, and life.</p></Card></div>
    <Card><Label>Why this matters</Label><p className="mt-4 leading-8 text-slate-700">Repetition is not decoration. It is grounding. The testimony made once at the start is renewed across the texture of every day, then tested through real acts of worship.</p></Card>
  </div>;
}

function PillarsPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">The four pillars</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The four other pillars are lived Shahadah.</h2><p className="mt-3 leading-8 text-slate-700">The standard list of salah, zakah, sawm, and Hajj can sound like four separate obligations placed next to the Shahadah. As a learning lens, this lesson shows how they express the testimony in action.</p></Card>
    <Card className="border-teal-200 bg-teal-50"><Label className="text-teal-800">Hadith anchor</Label><p className="mt-4 font-serif text-lg italic leading-8 text-slate-800">"Islam is built upon five."</p><p className="mt-3 text-sm font-semibold leading-7 text-slate-700">The hadith lists the testimony, prayer, zakah, Hajj, and fasting Ramadan.</p><p className="mt-3 text-xs font-bold text-slate-500">Sahih al-Bukhari 8; Sahih Muslim 16</p></Card>
    <div className="grid gap-4 md:grid-cols-2">{pillarMatches.map((item) => <Card key={item.id} className="bg-gradient-to-br from-white to-amber-50"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-amber-300">{item.pillar[0]}</div><Pill tone="gold">Pillar</Pill></div><h3 className="mt-4 text-2xl font-black text-slate-950">{item.pillar}</h3><p className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-amber-800">{item.title}</p><p className="mt-4 text-sm leading-7 text-slate-700">{item.statement}</p></Card>)}</div>
  </div>;
}

function TashahhudPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="teal">Renewal in prayer</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The tashahhud places the Shahadah in every prayer.</h2><p className="mt-3 leading-8 text-slate-700">In salah, the Shahadah appears verbally in the sitting recitation called tashahhud.</p></Card>
    <Card className="overflow-hidden p-0"><div className="grid grid-cols-3 bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white"><span>Prayer</span><span>Rak'at</span><span className="text-amber-300">Tashahhuds</span></div>{prayers.map(([name, rakat, tash]) => <div key={name} className="grid grid-cols-3 border-b border-slate-100 px-5 py-4 text-sm font-bold text-slate-800"><span>{name}</span><span>{rakat}</span><span className="rounded-xl bg-amber-50 px-3 py-1 text-center text-amber-900 ring-1 ring-amber-200">{tash}</span></div>)}<div className="grid grid-cols-3 bg-amber-100 px-5 py-5 font-black text-slate-950"><span>Total per day</span><span>17</span><span className="rounded-2xl bg-amber-500 px-4 py-2 text-center text-2xl">9</span></div></Card>
    <Card><p className="leading-8 text-slate-700">Nine recitations per day in obligatory prayer alone. Voluntary prayers and dhikr add more. The five daily prayers place the Shahadah on the tongue at fixed intervals across a Muslim's day.</p></Card>
  </div>;
}

function GrowthPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="purple">Growth and weakness</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Faith is not static.</h2><p className="mt-3 leading-8 text-slate-700">A Muslim's iman strengthens through worship, learning, and obedience. It weakens through sin, neglect, or distraction.</p></Card>
    <Card className="border-teal-200 bg-teal-50"><Label className="text-teal-800">Qur'an 8:2</Label><p className="mt-4 font-serif text-lg italic leading-8 text-slate-800">"...when His verses are recited to them, it increases them in faith..."</p><p className="mt-3 text-xs font-bold text-slate-500">Saheeh International, excerpt</p></Card>
    <Card><Label>What this means and what it does not</Label><p className="mt-4 leading-8 text-slate-700">Faith fluctuating means weak practice should be taken seriously. It calls for repentance, support, learning, and a return to worship.</p><p className="mt-3 leading-8 text-slate-700">It does not give a friend or relative a licence to declare that someone's Shahadah has been erased from weak practice. The useful conclusion is: help them return. The damaging conclusion is: their testimony has disappeared.</p></Card>
  </div>;
}

function WitnessPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">The final observation</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The testimony is not yours alone.</h2><p className="mt-3 leading-8 text-slate-700">When a Muslim says the Shahadah, they are not inventing the testimony. They are joining an existing one.</p></Card>
    <Card className="border-amber-300 bg-[#FBF6EC] p-6 sm:p-8"><Arabic className="text-center">{verse318.ar}</Arabic><div className="my-6 h-px bg-amber-300" /><Label>Saheeh International translation</Label><p className="mt-3 font-serif text-lg italic leading-8 text-slate-800">"{verse318.en}"</p><p className="mt-3 text-xs font-bold text-slate-500">Qur'an 3:18</p></Card>
    <div className="grid gap-3 md:grid-cols-3"><Card className="bg-slate-950 text-center text-white"><Label className="text-amber-300">Witness 1</Label><p className="mt-3 text-2xl font-black">Allah Himself</p></Card><Card className="border-amber-200 bg-amber-50 text-center"><Label className="text-amber-800">Witness 2</Label><p className="mt-3 text-2xl font-black text-amber-950">The angels</p></Card><Card className="border-teal-200 bg-teal-50 text-center"><Label className="text-teal-800">Witness 3</Label><p className="mt-3 text-2xl font-black text-teal-950">Those of knowledge</p></Card></div>
    <Card><p className="leading-8 text-slate-700">When a Muslim speaks the Shahadah, they join a testimony already established by Allah. This is the structural conclusion of the module.</p></Card>
  </div>;
}

function ClosingPage() {
  return <Card><Pill tone="gold">Closing reflection</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">You have completed the Shahadah module.</h2><div className="mt-5 grid gap-4 text-[1.05rem] leading-9 text-slate-800"><p>The testimony is no longer just a sentence. You can explain what ashhadu weighs, why negation comes before affirmation, what ilah means, what rasul does, why the Qur'an binds the believer to follow the Messenger \uFDFA, and how the other pillars are lived forms of worship built on the testimony.</p><p>The next module is salah.</p><p className="italic text-slate-500">Ask Allah for acceptance, then begin.</p></div></Card>;
}

function ResultsPage({ scores, confidence, setConfidence, reset, onGoToSalah }) {
  const score = scoreTotal(scores);
  const pct = Math.round((score / MAX_SCORE) * 100);
  const pass = score >= 5;
  const concepts = [["Two modes of living the Shahadah", scores.q1 >= 1], ["Pillars as forms of testimony", scores.q2 >= 3], ["Tashahhud frequency", scores.q3 >= 1], ["Careful faith framing", scores.q4 >= 1], ["Full module synthesis", scores.q5 >= 1]];
  return <div className="grid gap-5">
    <Card className="bg-gradient-to-br from-white to-amber-50"><Pill tone={pass ? "green" : "rose"}>{pass ? "Checkpoint passed" : "Review recommended"}</Pill><div className="mt-6 grid gap-6 md:grid-cols-[160px_1fr] md:items-center"><div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full" style={{ background: `conic-gradient(rgb(15 118 110) ${pct}%, rgb(226 232 240) 0)` }}><div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white"><p className="text-4xl font-black text-slate-950">{score}</p><p className="text-sm font-bold text-slate-500">/{MAX_SCORE}</p></div></div><div><h2 className="text-3xl font-black tracking-tight text-slate-950">Lesson score</h2><p className="mt-3 leading-8 text-slate-700">This score measures the five checks from this lesson: modes, pillars, tashahhud count, careful faith framing, and capstone synthesis.</p></div></div></Card>
    <Card><h3 className="text-xl font-black text-slate-950">Concepts mastered</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{concepts.map(([label, ok]) => <div key={label} className={cx("rounded-2xl p-4", ok ? "bg-emerald-50" : "bg-slate-50")}><p className={cx("font-bold", ok ? "text-emerald-800" : "text-slate-500")}>{ok ? "\u2713" : "\u25A1"} {label}</p></div>)}</div></Card>
    <Card className="relative overflow-hidden border-[3px] border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-100 p-8 text-center"><p className="text-xs font-black uppercase tracking-[0.3em] text-amber-700">Pillar 1 · Shahadah module</p><h2 className="mt-3 text-5xl font-black tracking-tight text-slate-950">Complete.</h2><p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-700">You have completed the first pillar module. The doorway is open. You are ready for the second pillar: Salah.</p><div className="mx-auto mt-6 grid max-w-xl gap-3 text-left">{["Lesson 1 \u00b7 The Shahadah", "Lesson 2 \u00b7 The Second Testimony", "Lesson 3 \u00b7 Living the Shahadah"].map((item) => <div key={item} className="rounded-2xl bg-white/80 p-4 font-bold text-emerald-800 ring-1 ring-amber-200">{"\u2713"} {item}</div>)}</div></Card>
    <button type="button" onClick={onGoToSalah} disabled={!onGoToSalah} className={cx("rounded-3xl border bg-slate-950 p-6 text-left text-white transition", onGoToSalah ? "cursor-pointer hover:bg-slate-900" : "opacity-70 cursor-default")}>
      <Pill tone="gold">Next module</Pill>
      <h3 className="mt-4 text-2xl font-black">Salah - The Five Daily Appointments</h3>
      <p className="mt-3 leading-7 text-white/70">The second pillar. Now that the doorway is open, learn how the body follows the tongue in worship.</p>
      {!onGoToSalah && <p className="mt-2 text-xs font-bold text-amber-400">Coming soon</p>}
    </button>
    <Card><h3 className="text-xl font-black text-slate-950">Confidence check</h3><p className="mt-2 text-sm leading-6 text-slate-600">How confident do you feel explaining the Shahadah after this module?</p><div className="mt-5 flex flex-wrap gap-2">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setConfidence(value)} className={cx("flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ring-1 transition focus:outline-none focus:ring-4 focus:ring-teal-200", confidence === value ? "bg-teal-700 text-white ring-teal-700" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50")}>{value}</button>)}</div></Card>
    <Button variant="soft" onClick={reset}>Restart lesson</Button>
    <p className="text-center text-sm italic text-slate-500">Ask Allah for acceptance, then begin.</p>
  </div>;
}

export default function DeanyB1ShahadahLesson3({ onBack, onHome, onGoToSalah }) {
  const saved = loadState();
  const [page, setPage] = useState(() => Number(saved.page) || 0);
  const [scores, setScores] = useState(() => saved.scores || {});
  const [confidence, setConfidence] = useState(() => Number(saved.confidence) || 3);
  const pageQuestionKeys = { 2: "q1", 4: "q2", 6: "q3", 8: "q4", 10: "q5" };

  const pages = [
    <IntroPage />,
    <ModesPage />,
    <MCPage data={questions.q1} onSave={(value) => saveScore("q1", value)} />,
    <PillarsPage />,
    <MatchPage onSave={(value) => saveScore("q2", value)} />,
    <TashahhudPage />,
    <MCPage data={questions.q3} onSave={(value) => saveScore("q3", value)} />,
    <GrowthPage />,
    <MCPage data={questions.q4} onSave={(value) => saveScore("q4", value)} />,
    <WitnessPage />,
    <MCPage data={questions.q5} onSave={(value) => saveScore("q5", value)} />,
    <ClosingPage />,
    <ResultsPage scores={scores} confidence={confidence} setConfidence={setConfidence} reset={resetLesson} onGoToSalah={onGoToSalah} />,
  ];

  const safePage = Math.min(Math.max(page, 0), pages.length - 1);
  const currentQuestionKey = pageQuestionKeys[safePage];
  const lockedOnQuestion = SHIP_READY && currentQuestionKey && scores[currentQuestionKey] === undefined;

  function saveScore(key, value) {
    setScores((previous) => ({ ...previous, [key]: value }));
    setPage((current) => Math.min(current + 1, pages.length - 1));
  }

  function canEnterPage(targetPage) {
    if (!SHIP_READY || targetPage <= safePage) return true;
    for (let index = 0; index < targetPage; index += 1) {
      const key = pageQuestionKeys[index];
      if (key && scores[key] === undefined) return false;
    }
    return true;
  }

  function resetLesson() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    setPage(0);
    setScores({});
    setConfidence(3);
  }

  useEffect(() => saveState({ page: safePage, scores, confidence }), [safePage, scores, confidence]);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }, [safePage]);

  return <main className="min-h-screen bg-[#FDFBF7] text-slate-950">
    <Header page={safePage} totalPages={pages.length} score={scoreTotal(scores)} onBack={onBack} />
    <section className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div key={safePage} className="animate-[fadeUp_0.25s_ease]">{pages[safePage]}</div>
      <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <div className="flex gap-2"><Button variant="soft" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</Button><Button variant="soft" onClick={resetLesson}>Reset</Button></div>
        <div className="hidden gap-1 md:flex">{pages.map((_, index) => {
          const allowed = canEnterPage(index);
          return <button key={index} type="button" disabled={!allowed} onClick={() => allowed && setPage(index)} className={cx("h-2 rounded-full transition disabled:cursor-not-allowed", index === safePage ? "w-7 bg-teal-700" : allowed ? "w-2 bg-slate-300" : "w-2 bg-slate-200 opacity-40")} aria-label={`Go to page ${index + 1}`} />;
        })}</div>
        <div className="grid justify-items-end gap-2">{lockedOnQuestion && <p className="text-xs font-bold text-amber-700">Answer this question to continue.</p>}<Button disabled={safePage === pages.length - 1 || lockedOnQuestion || !canEnterPage(safePage + 1)} onClick={() => setPage((current) => Math.min(current + 1, pages.length - 1))}>Continue</Button></div>
      </nav>
    </section>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`}</style>
  </main>;
}
