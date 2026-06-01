import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "deany_s2_lesson5_when_things_go_wrong_ship_ready_syntax_fixed_v1";
const SHIP_READY = true;
const MAX_SCORE = 27;

const buckets = {
  continue: { title: "Continue", icon: "🟢", subtitle: "Keep praying calmly.", card: "border-emerald-200 bg-emerald-50", text: "text-emerald-900" },
  repair: { title: "Repair", icon: "🟡", subtitle: "Return and fix the missed pillar.", card: "border-amber-200 bg-amber-50", text: "text-amber-900" },
  restart: { title: "Restart", icon: "🔴", subtitle: "Start again properly.", card: "border-rose-200 bg-rose-50", text: "text-rose-900" },
};

const sortItems = [
  ["s1", "Forgot to say Subhana Rabbiyal-A'la three times in sujud.", "continue", "Extra dhikr repetition is not the same as missing sujud itself."],
  ["s2", "Realised mid-prayer that you do not have wudu.", "restart", "Wudu is a condition for salah. Stop, make wudu, and pray again."],
  ["s3", "Forgot the second sujud, stood up, then remembered before starting the next rak'ah properly.", "repair", "Sujud is a pillar. Return to the missed sujud, complete it calmly, then continue."],
  ["s4", "Forgot the opening takbir entirely and only began reciting.", "restart", "The opening takbir begins the prayer. If it was never done, start properly."],
  ["s5", "Forgot to raise your hands at the opening takbir.", "continue", "Raising the hands is not a reason to restart. Continue calmly."],
  ["s6", "Did an extra ruku by mistake in one rak'ah.", "continue", "This is an addition. Complete the prayer, then repair with sajdah al-sahw after salam in this beginner map."],
  ["s7", "Forgot the first tashahhud and stood fully into the third rak'ah.", "continue", "Do not sit back down once fully standing. Continue and repair with sajdah al-sahw before salam."],
  ["s8", "Started Dhuhr with no intention to pray Dhuhr.", "restart", "Intention is a foundation. Without intention, start properly."],
];

const sahwRows = [
  ["b1", "Forgot the first tashahhud and went straight into the third rak'ah.", "before", "This is a deficiency, so this beginner map places sajdah al-sahw before salam."],
  ["b2", "Realised at the end that you prayed five rak'at instead of four.", "after", "An extra rak'ah is an addition, so this beginner map places sajdah al-sahw after salam."],
  ["b3", "Did an extra ruku by mistake.", "after", "An extra ruku is an addition, so this beginner map places sajdah al-sahw after salam."],
  ["b4", "Left out the first sitting/tashahhud in a prayer that has more than two rak'at.", "before", "That missed sitting is treated here as a deficiency."],
  ["b5", "Made both a deficiency and an addition in the same prayer.", "before", "For this simplified beginner map, the deficiency route takes priority."],
];

const doubtQuestion = {
  prompt: "Layla is praying Asr. She is unsure whether she is in the third or fourth rak'ah. Neither number feels more likely. What should she do?",
  correct: "c",
  options: [
    ["a", "Stop and start the prayer again from the beginning."],
    ["b", "Pick whichever number feels better and continue."],
    ["c", "Build on the lower certain number, complete a fourth rak'ah, then do sajdah al-sahw before salam."],
    ["d", "Assume it is the fourth and do sajdah al-sahw after salam."],
  ],
  explain: "Certainty comes before doubt. When neither side feels stronger, build on the lower certain number and complete what may be missing. The direct hadith route taught here places the two prostrations before salam.",
};

const wuduQuestion = {
  prompt: "After he prayed, Yusuf realised that he had not made wudu before starting. What should he do?",
  correct: "b",
  options: [
    ["a", "Do sajdah al-sahw because he only remembered after finishing."],
    ["b", "Make wudu, then pray again."],
    ["c", "Ignore it because the prayer has already ended."],
    ["d", "Wait until the next prayer time and combine it with that prayer."],
  ],
  explain: "Wudu is a foundation of prayer. If he prayed without wudu, sajdah al-sahw cannot fix it. He should make wudu and pray again.",
};

const rapid = [
  ["r1", "If you realise you have no wudu mid-prayer, you must stop and pray again after wudu.", true, "Wudu is a foundation for salah. Sajdah al-sahw cannot repair missing purification."],
  ["r2", "Sajdah al-sahw is two prostrations.", true, "It is performed as two prostrations of forgetfulness."],
  ["r3", "If you forget the opening takbir entirely, sajdah al-sahw fixes it.", false, "The opening takbir begins the prayer. If it was never done, the prayer needs to be started properly."],
  ["r4", "When you genuinely doubt whether it is three or four rak'at, and neither feels stronger, build on the higher number.", false, "Build on what is certain. The lower number is the safer certainty."],
  ["r5", "For genuine doubt with no stronger side, the route taught here is: build on the lower number, then sahw before salam.", true, "This follows the direct hadith route used in this lesson."],
  ["r6", "If you accidentally add an extra ruku, the usual beginner-map placement is after salam.", true, "An addition is repaired after salam in this beginner map."],
  ["r7", "If you miss a prayer because you slept or forgot, you should make it up when you remember.", true, "A missed obligatory prayer is prayed when remembered."],
  ["r8", "Every tiny mistake means you must restart the whole prayer.", false, "Most mistakes do not require restart. Salah has a repair system."],
];

const blanks = [
  ["f1", "If I leave out the first sitting/tashahhud, I do sajdah al-sahw", "the salam.", "before"],
  ["f2", "If I add an extra rak'ah, I do sajdah al-sahw", "the salam.", "after"],
  ["f3", "When I genuinely doubt my rak'ah count and neither side feels stronger, I build on the", "number.", "lower"],
  ["f4", "If I prayed without wudu, I make wudu and", "the prayer.", "repeat"],
];

const cx = (...classes) => classes.filter(Boolean).join(" ");
const load = () => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)); } catch { return null; }
};
const save = (state) => {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
};

function scoreSort(x) { return sortItems.reduce((n, [id, , correct]) => n + (x[id] === correct ? 1 : 0), 0); }
function scoreRows(x) { return sahwRows.reduce((n, [id, , correct]) => n + (x[id] === correct ? 1 : 0), 0); }
function scoreRapid(x) { return rapid.reduce((n, [id, , correct]) => n + (x[id] === correct ? 1 : 0), 0); }
function scoreBlanks(x) { return blanks.reduce((n, [id, , , correct]) => n + (x[id] === correct ? 1 : 0), 0); }

function Card({ children, className = "" }) { return <section className={cx("rounded-[1.75rem] border border-[#E7DFC9] bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]", className)}>{children}</section>; }
function Pill({ children, tone = "gold" }) {
  const tones = { gold: "bg-[#FBF6EC] text-[#8A6A20] ring-[#E8D8A8]", teal: "bg-teal-50 text-teal-900 ring-teal-200", slate: "bg-slate-100 text-slate-700 ring-slate-200", green: "bg-emerald-50 text-emerald-900 ring-emerald-200", rose: "bg-rose-50 text-rose-900 ring-rose-200", dark: "bg-slate-950 text-amber-200 ring-slate-800" };
  return <span className={cx("inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ring-1", tones[tone])}>{children}</span>;
}
function Button({ children, onClick, disabled, variant = "primary", className = "" }) {
  const styles = { primary: "bg-[#102033] text-white hover:bg-slate-900", gold: "bg-[#C5A55A] text-slate-950 hover:bg-[#B69549]", soft: "bg-white text-slate-800 ring-1 ring-[#E7DFC9] hover:bg-[#FBF6EC]", danger: "bg-rose-50 text-rose-900 ring-1 ring-rose-200 hover:bg-rose-100" };
  return <button type="button" disabled={disabled} onClick={onClick} className={cx("rounded-2xl px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-45", styles[variant], className)}>{children}</button>;
}

function Intro() {
  return <div className="grid gap-5">
    <section className="overflow-hidden rounded-[1.75rem] bg-[#102033] p-7 text-white shadow-[0_22px_55px_rgba(15,23,42,0.16)] sm:p-10">
      <Pill tone="dark">A relief lesson</Pill>
      <div className="mt-7 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div><h2 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Mistakes do not have to become panic.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Lessons 1 to 4 built the ideal prayer: time, wudu, the rak'ah structure, and the words. This lesson gives you the calm repair map for real life.</p><div className="mt-6 flex flex-wrap gap-2"><Pill>Continue</Pill><Pill>Repair</Pill><Pill>Restart</Pill></div></div>
        <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-5 shadow-inner"><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Sahih anchor</p><blockquote className="mt-3 text-xl font-black leading-9 text-white">The Prophet (peace be upon him) taught: cast aside doubt and build on what is certain.</blockquote><p className="mt-4 text-sm font-semibold text-white/60">Sahih Muslim 571a. Used here because this lesson teaches how to handle mistakes and doubt in salah.</p></div>
      </div>
    </section>
    <div className="grid gap-4 md:grid-cols-3">{[["1", "Sort", "Place mistakes into continue, repair, or restart."], ["2", "Repair", "Know the simple before-salam and after-salam pattern."], ["3", "Doubt", "Handle genuine uncertainty without spiralling."]].map(([n, t, b]) => <Card key={n}><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102033] text-sm font-black text-amber-200">{n}</div><h3 className="mt-4 text-xl font-black text-[#102033]">{t}</h3><p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{b}</p></Card>)}</div>
    <Card className="border-amber-200 bg-[#FBF6EC]"><Pill>Important scope</Pill><p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-slate-700">This is a beginner map, not a fatwa engine. Some details differ between qualified teachers. The lesson teaches one clean route for confidence and reminds learners to ask a qualified teacher for complex or repeated cases.</p></Card>
  </div>;
}

function Tiers() {
  const rows = [
    ["continue", "Small mistake, extra movement, or first-sitting issue", "Example: forgot the first tashahhud and only remembered after standing fully.", "Continue calmly, then use sajdah al-sahw if needed."],
    ["repair", "A pillar was missed but caught in time", "Example: stood up before completing the second sujud, then remembered before properly entering the next rak'ah.", "Return to the missed pillar and continue."],
    ["restart", "A foundation was missing", "Example: no wudu, no intention, or no opening takbir.", "Start the prayer again properly."],
  ];
  return <div className="grid gap-5"><Card><Pill tone="teal">The mental model</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Three tiers of mistakes.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Before worrying about details, ask: is this a small mistake to continue through, a pillar to repair, or a foundation that means restart?</p></Card>{rows.map(([key, title, example, action], i) => <div key={key} className={cx("rounded-[1.75rem] border p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]", buckets[key].card)}><div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{buckets[key].icon}</div><div><p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Tier {i + 1}</p><h3 className="mt-1 text-2xl font-black text-[#102033]">{buckets[key].title}</h3><p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{title}</p><p className="mt-1 text-sm leading-7 text-slate-600">{example}</p></div><div className="rounded-2xl bg-white p-4 text-sm font-black leading-6 text-slate-800 shadow-sm md:max-w-xs">{action}</div></div></div>)}</div>;
}

function SortQuestion({ value, setValue, done, setDone }) {
  const [selected, setSelected] = useState(null);
  const complete = sortItems.every(([id]) => value[id]);
  const score = scoreSort(value);
  const place = (bucket) => { if (selected && !done) { setValue((p) => ({ ...p, [selected]: bucket })); setSelected(null); } };
  if (done) return <Review title="Question 1 · Review" score={`${score}/8`}>{sortItems.map(([id, text, correct, explain], i) => <ReviewCard key={id} number={i + 1} ok={value[id] === correct} title={text} body={explain} your={value[id] ? buckets[value[id]].title : "Not answered"} correct={buckets[correct].title} />)}</Review>;
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Pill tone="teal">Question 1 · Sort</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Sort each mistake into its tier.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Tap a card, then tap a bucket.</p></div><Pill>{Object.keys(value).length}/8 placed</Pill></div></Card><div className="grid gap-5 lg:grid-cols-[1fr_1fr]"><Card><h3 className="text-lg font-black text-[#102033]">Scenario cards</h3><p className="mt-2 text-sm font-semibold text-slate-600">Selected: {selected ? sortItems.find(([id]) => id === selected)?.[1] : "none"}</p><div className="mt-4 grid gap-3">{sortItems.map(([id, text]) => <button key={id} type="button" onClick={() => setSelected(id)} className={cx("rounded-2xl border p-4 text-left text-sm font-semibold leading-6 transition focus:outline-none focus:ring-4 focus:ring-teal-200", selected === id ? "border-teal-600 bg-teal-50" : "border-[#E7DFC9] bg-white hover:bg-[#FBF6EC]", value[id] ? "ring-2 ring-amber-200" : "")}><span>{text}</span>{value[id] && <span className="mt-2 block text-xs font-black text-[#8A6A20]">Placed: {buckets[value[id]].title}</span>}</button>)}</div></Card><div className="grid gap-4">{Object.entries(buckets).map(([key, b]) => <button key={key} type="button" onClick={() => place(key)} className={cx("min-h-32 rounded-[1.75rem] border p-5 text-left shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition focus:outline-none focus:ring-4 focus:ring-teal-200", b.card)}><div className="flex items-center justify-between gap-3"><div><p className="text-xl font-black text-[#102033]">{b.icon} {b.title}</p><p className="mt-1 text-sm font-semibold text-slate-600">{b.subtitle}</p></div><Pill tone="slate">{Object.values(value).filter((x) => x === key).length}</Pill></div></button>)}</div></div><Button variant="gold" disabled={!complete} onClick={() => setDone(true)}>Submit answers</Button></div>;
}

function SahwLearn() {
  return <div className="grid gap-5"><Card><Pill>Sajdah al-sahw</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Two prostrations that repair forgetfulness.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">A clean beginner pattern: deficiency before salam, addition after salam. Doubt is taught separately because the hadith route is specific.</p></Card><div className="grid gap-4 md:grid-cols-2"><Card className="border-teal-200 bg-teal-50"><div className="text-4xl">🧎</div><h3 className="mt-4 text-2xl font-black text-teal-950">Before salam</h3><p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-teal-700">Deficiency route</p><ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-slate-700"><li>Used here for a missing first sitting/tashahhud.</li><li>Do two prostrations near the end of the prayer.</li><li>Then say salam to close the prayer.</li></ul></Card><Card className="border-amber-200 bg-[#FBF6EC]"><div className="text-4xl">🧎</div><h3 className="mt-4 text-2xl font-black text-amber-950">After salam</h3><p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-amber-700">Addition route</p><ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-slate-700"><li>Used here for an extra rak'ah or extra ruku.</li><li>Complete the prayer with salam.</li><li>Then do two prostrations and say salam again.</li></ul></Card></div><Card><Pill>Prophetic precedent</Pill><p className="mt-4 text-base leading-8 text-slate-700">The hadith collections show the Prophet (peace be upon him) using sajdah al-sahw in real prayer mistakes, including an omitted first sitting and an extra rak'ah.</p><p className="mt-3 text-sm font-bold text-slate-500">Examples: Sahih al-Bukhari 1224 and 1226.</p></Card></div>;
}

function BeforeAfter({ value, setValue, done, setDone }) {
  const complete = sahwRows.every(([id]) => value[id]);
  const score = scoreRows(value);
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Pill tone="teal">Question 2 · Think</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Before or after salam?</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Choose where the two prostrations belong in this beginner map.</p></div>{done && <Pill tone={score >= 4 ? "green" : "rose"}>Score {score}/5</Pill>}</div></Card>{sahwRows.map(([id, text, correct, explain]) => { const selected = value[id]; const ok = selected === correct; return <Card key={id} className={cx(done && ok ? "border-emerald-200 bg-emerald-50" : "", done && selected && !ok ? "border-rose-200 bg-rose-50" : "")}><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><p className="text-base font-bold leading-7 text-slate-800">{text}</p><div className="flex shrink-0 gap-2">{["before", "after"].map((x) => <button key={x} type="button" disabled={done} onClick={() => setValue((p) => ({ ...p, [id]: x }))} className={cx("rounded-2xl px-4 py-3 text-xs font-black ring-1 transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed", selected === x ? "bg-[#102033] text-white ring-[#102033]" : "bg-white text-slate-700 ring-[#E7DFC9] hover:bg-[#FBF6EC]")}>{x.toUpperCase()}</button>)}</div></div>{done && <p className={cx("mt-3 text-sm font-semibold", ok ? "text-emerald-800" : "text-rose-800")}>{ok ? "Correct." : `Correct answer: ${correct}.`} {explain}</p>}</Card>; })}{!done && <Button variant="gold" disabled={!complete} onClick={() => setDone(true)}>Submit answers</Button>}</div>;
}

function Doubt() {
  const [active, setActive] = useState(0);
  const nodes = [["Passing thought?", "Ignore it and continue.", "A quick whisper or passing worry does not need a full reset."], ["Genuine uncertainty?", "Build on the lower certain number.", "If you truly cannot tell whether it is three or four, the lower number is the safer certainty."], ["Then what?", "Complete what may be missing, then sahw before salam.", "The direct hadith route is to cast aside doubt, build on certainty, then perform two prostrations before salam."]];
  return <div className="grid gap-5"><Card><Pill tone="teal">Decision tree</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Doubt has a route.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">The principle is: certainty beats doubt. Tap each node.</p></Card><Card><div className="grid gap-4 md:grid-cols-3">{nodes.map(([label, result], i) => <button key={label} type="button" onClick={() => setActive(i)} className={cx("rounded-[1.5rem] border p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200", active === i ? "border-teal-600 bg-teal-50" : "border-[#E7DFC9] bg-[#FDFBF7] hover:bg-[#FBF6EC]")}><p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Step {i + 1}</p><p className="mt-2 text-xl font-black text-[#102033]">{label}</p><p className="mt-2 text-sm font-semibold text-teal-800">{result}</p></button>)}</div><div className="mt-5 rounded-[1.5rem] bg-[#102033] p-5 text-white"><p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-200">Expanded explanation</p><p className="mt-2 text-lg font-black">{nodes[active][1]}</p><p className="mt-2 text-sm leading-7 text-white/75">{nodes[active][2]}</p></div></Card><Card className="border-teal-200 bg-teal-50"><Pill tone="teal">Hadith anchor</Pill><p className="mt-4 text-base leading-8 text-slate-700">When someone is unsure whether they prayed three or four, the Prophet (peace be upon him) taught building on what is certain and performing two prostrations before salam.</p><p className="mt-3 text-sm font-bold text-slate-500">Sahih Muslim 571a.</p></Card></div>;
}

function MC({ label, question, selected, setSelected, done, setDone }) {
  const ok = selected === question.correct;
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Pill tone="teal">{label}</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Choose the best answer.</h2><p className="mt-3 max-w-3xl text-base font-semibold leading-8 text-slate-800">{question.prompt}</p></div>{done && <Pill tone={ok ? "green" : "rose"}>Score {ok ? 1 : 0}/1</Pill>}</div></Card><div className="grid gap-3">{question.options.map(([id, text]) => <button key={id} type="button" disabled={done} onClick={() => setSelected(id)} className={cx("rounded-[1.5rem] border p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed", selected === id ? "border-teal-600 bg-teal-50" : "border-[#E7DFC9] bg-white hover:bg-[#FBF6EC]", done && id === question.correct ? "border-emerald-200 bg-emerald-50" : "", done && selected === id && id !== question.correct ? "border-rose-200 bg-rose-50" : "")}><div className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#102033] text-sm font-black text-amber-200">{id.toUpperCase()}</span><span className="text-sm font-bold leading-7 text-slate-800">{text}</span></div></button>)}</div>{!done && <Button variant="gold" disabled={!selected} onClick={() => setDone(true)}>Submit answer</Button>}{done && <Card className={ok ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}><h3 className={cx("text-xl font-black", ok ? "text-emerald-900" : "text-rose-900")}>{ok ? "Correct" : "Review this one"}</h3><p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{question.explain}</p></Card>}</div>;
}

function Rapid({ answers, setAnswers, done, setDone }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = rapid[index];
  const score = scoreRapid(answers);
  const choose = (value) => { if (!current || revealed) return; setAnswers((p) => ({ ...p, [current[0]]: value })); setRevealed(true); };
  const next = () => { if (index === rapid.length - 1) setDone(true); else { setIndex((p) => p + 1); setRevealed(false); } };
  if (done) return <Review title="Rapid fire review" score={`${score}/8`}>{rapid.map(([id, text, correct, explain]) => <ReviewCard key={id} ok={answers[id] === correct} title={text} body={`Answer: ${correct ? "True" : "False"}. ${explain}`} your={answers[id] === undefined ? "Not answered" : answers[id] ? "True" : "False"} correct={correct ? "True" : "False"} />)}</Review>;
  return <div className="grid gap-5"><Card><Pill>Question 4 · Play</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Rapid fire: true or false.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Eight statements. Each answer reveals correct or incorrect immediately. Full review comes at the end.</p></Card>{!started ? <Card className="bg-[#102033] text-white"><p className="text-lg font-black">Ready?</p><p className="mt-2 text-sm leading-7 text-white/75">This is recall practice, not a fatwa test. The aim is quick recognition with instant feedback.</p><Button className="mt-5" variant="gold" onClick={() => setStarted(true)}>Start rapid fire</Button></Card> : <Card><div className="flex items-center justify-between gap-3"><Pill tone="slate">Statement {index + 1}/8</Pill></div><p className="mt-6 text-2xl font-black leading-10 text-[#102033]">{current[1]}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Button variant="soft" disabled={revealed} onClick={() => choose(true)}>TRUE</Button><Button variant="soft" disabled={revealed} onClick={() => choose(false)}>FALSE</Button></div>{revealed && <div className={cx("mt-5 rounded-[1.5rem] p-5", answers[current[0]] === current[2] ? "bg-emerald-50 text-emerald-950" : "bg-rose-50 text-rose-950")}><p className="text-xl font-black">{answers[current[0]] === current[2] ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm font-semibold leading-7">The answer is {current[2] ? "True" : "False"}. {current[3]}</p><Button className="mt-4" onClick={next}>{index === rapid.length - 1 ? "Finish review" : "Next statement"}</Button></div>}</Card>}</div>;
}

function Missed() { return <div className="grid gap-5"><Card><Pill>Missed prayers</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">A missed obligatory prayer is made up.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Sometimes a prayer is missed because of sleep or forgetfulness. The response is not panic. The response is to make up the prayer when remembered.</p></Card><div className="grid gap-4 md:grid-cols-4">{[["Make it up", "A missed obligatory prayer is prayed as qada."], ["Pray once remembered", "Do not delay it carelessly."], ["Make intention", "Intend that this is the make-up of the missed prayer."], ["Ask for a plan", "If many prayers were missed, ask a qualified teacher."]].map(([t, b]) => <Card key={t}><p className="text-lg font-black text-[#102033]">{t}</p><p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{b}</p></Card>)}</div><Card className="border-emerald-200 bg-emerald-50"><Pill tone="green">Hadith anchor</Pill><p className="mt-4 text-sm font-semibold leading-7 text-slate-700">The Prophet (peace be upon him) taught that whoever forgets a prayer should pray it when they remember.</p><p className="mt-2 text-sm font-bold text-slate-500">Sahih al-Bukhari 597; Sahih Muslim 684.</p></Card></div>; }

function Fill({ value, setValue, done, setDone }) {
  const opts = ["before", "after", "lower", "higher", "repeat"];
  const complete = blanks.every(([id]) => value[id]);
  const score = scoreBlanks(value);
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Pill tone="teal">Question 5 · Think</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">Complete the rules.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Tap the word that completes each sentence.</p></div>{done && <Pill tone={score >= 3 ? "green" : "rose"}>Score {score}/4</Pill>}</div></Card>{blanks.map(([id, before, after, correct]) => { const ok = value[id] === correct; return <Card key={id} className={cx(done && ok ? "border-emerald-200 bg-emerald-50" : "", done && value[id] && !ok ? "border-rose-200 bg-rose-50" : "")}><p className="text-lg font-black leading-8 text-[#102033]">{before} <span className="rounded-xl bg-[#FBF6EC] px-3 py-1 text-teal-800 ring-1 ring-[#E8D8A8]">{value[id] || "_____"}</span> {after}</p><div className="mt-4 flex flex-wrap gap-2">{opts.map((o) => <button key={`${id}-${o}`} type="button" disabled={done} onClick={() => setValue((p) => ({ ...p, [id]: o }))} className={cx("rounded-2xl px-4 py-3 text-sm font-black ring-1 transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed", value[id] === o ? "bg-[#102033] text-white ring-[#102033]" : "bg-white text-slate-700 ring-[#E7DFC9] hover:bg-[#FBF6EC]")}>{o}</button>)}</div>{done && <p className={cx("mt-3 text-sm font-bold", ok ? "text-emerald-800" : "text-rose-800")}>{ok ? "Correct." : `Correct answer: ${correct}.`}</p>}</Card>; })}{!done && <Button variant="gold" disabled={!complete} onClick={() => setDone(true)}>Submit answers</Button>}</div>;
}

function Takeaway() { return <Card className="border-amber-300 bg-gradient-to-br from-[#FBF6EC] via-white to-amber-50 p-7 ring-1 ring-amber-200"><Pill>Key takeaway</Pill><h2 className="mt-5 text-4xl font-black tracking-tight text-[#102033]">The system is designed to absorb mistakes.</h2><p className="mt-5 max-w-3xl text-lg font-semibold leading-9 text-slate-700">A deficiency usually means sahw before salam. An addition usually means sahw after salam. Genuine doubt means build on certainty. A missed prayer is made up. Missing wudu means pray again.</p><p className="mt-5 max-w-3xl text-lg font-semibold leading-9 text-slate-700">Pray with confidence, not fear. When a case is complex, ask a qualified teacher.</p></Card>; }

function Results({ scores, total, onBack, onGoToNext }) {
  const pct = Math.round((total / MAX_SCORE) * 100);
  const concepts = [["The three tiers of mistakes", scores.q1 >= 6, `${scores.q1}/8`], ["Before vs after salam", scores.q2 >= 4, `${scores.q2}/5`], ["Handling doubt", scores.q3 === 1, `${scores.q3}/1`], ["Core sahw rules", scores.q4 >= 6, `${scores.q4}/8`], ["Rule completion", scores.q5 >= 3, `${scores.q5}/4`], ["No-wudu scenario", scores.q6 === 1, `${scores.q6}/1`]];
  return <div className="grid gap-5"><Card><Pill tone="teal">Checkpoint</Pill><div className="mt-5 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center"><div className="flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(#0F766E ${pct}%, #E7DFC9 0)` }}><div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-sm"><p className="text-4xl font-black text-[#102033]">{total}</p><p className="text-sm font-bold text-slate-500">/{MAX_SCORE}</p></div></div><div><h2 className="text-3xl font-black tracking-tight text-[#102033]">Lesson complete.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">You now have a practical beginner map for common mistakes: continue, repair, restart, handle doubt, and make up missed prayers.</p></div></div></Card><Card><h3 className="text-xl font-black text-[#102033]">Concepts mastered</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{concepts.map(([label, ok, detail]) => <div key={label} className={cx("rounded-2xl p-4", ok ? "bg-emerald-50" : "bg-slate-50")}><div className="flex items-center justify-between gap-3"><p className="text-sm font-black text-slate-900">{ok ? "✓" : "•"} {label}</p><Pill tone={ok ? "green" : "slate"}>{detail}</Pill></div></div>)}</div></Card><Card><div className="flex flex-wrap justify-center gap-3">{onGoToNext && <Button onClick={onGoToNext}>Continue to Lesson 6</Button>}{onBack && <Button variant="soft" onClick={onBack}>Back to lessons</Button>}</div></Card></div>;
}

function Review({ title, score, children }) { return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Pill tone="teal">{title}</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-[#102033]">What was right and what needs review.</h2></div><Pill tone="slate">Score {score}</Pill></div></Card><div className="grid gap-4">{children}</div></div>; }
function ReviewCard({ number, ok, title, body, your, correct }) { return <Card className={ok ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}><div className="grid gap-4 lg:grid-cols-[1fr_320px]"><div><div className="flex flex-wrap gap-2"><Pill tone={ok ? "green" : "rose"}>{ok ? "Correct" : "Review"}</Pill>{number && <Pill tone="slate">Card {number}</Pill>}</div><p className="mt-4 text-lg font-black leading-8 text-slate-950">{title}</p><p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{body}</p></div><div className="grid gap-3"><div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Your answer</p><p className="mt-2 text-base font-black text-slate-950">{your}</p></div><div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-200"><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Correct answer</p><p className="mt-2 text-base font-black text-emerald-950">{correct}</p></div></div></div></Card>; }

export default function DEANYS2L5({ onBack, onHome, onGoToNext }) {
  const saved = load() || {};
  const [page, setPage] = useState(saved.page || 0);
  const [sort, setSort] = useState(saved.sort || {});
  const [sortDone, setSortDone] = useState(Boolean(saved.sortDone));
  const [rows, setRows] = useState(saved.rows || {});
  const [rowsDone, setRowsDone] = useState(Boolean(saved.rowsDone));
  const [q3, setQ3] = useState(saved.q3 || null);
  const [q3Done, setQ3Done] = useState(Boolean(saved.q3Done));
  const [rap, setRap] = useState(saved.rap || {});
  const [rapDone, setRapDone] = useState(Boolean(saved.rapDone));
  const [fill, setFill] = useState(saved.fill || {});
  const [fillDone, setFillDone] = useState(Boolean(saved.fillDone));
  const [q6, setQ6] = useState(saved.q6 || null);
  const [q6Done, setQ6Done] = useState(Boolean(saved.q6Done));

  const scores = useMemo(() => ({ q1: sortDone ? scoreSort(sort) : 0, q2: rowsDone ? scoreRows(rows) : 0, q3: q3Done && q3 === doubtQuestion.correct ? 1 : 0, q4: rapDone ? scoreRapid(rap) : 0, q5: fillDone ? scoreBlanks(fill) : 0, q6: q6Done && q6 === wuduQuestion.correct ? 1 : 0 }), [sort, sortDone, rows, rowsDone, q3, q3Done, rap, rapDone, fill, fillDone, q6, q6Done]);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const pages = [
    <Intro key="intro" />,
    <Tiers key="tiers" />,
    <SortQuestion key="sort" value={sort} setValue={setSort} done={sortDone} setDone={setSortDone} />,
    <SahwLearn key="sahw" />,
    <BeforeAfter key="ba" value={rows} setValue={setRows} done={rowsDone} setDone={setRowsDone} />,
    <Doubt key="doubt" />,
    <MC key="q3" label="Question 3 · Doubt" question={doubtQuestion} selected={q3} setSelected={setQ3} done={q3Done} setDone={setQ3Done} />,
    <Rapid key="rapid" answers={rap} setAnswers={setRap} done={rapDone} setDone={setRapDone} />,
    <Missed key="missed" />,
    <Fill key="fill" value={fill} setValue={setFill} done={fillDone} setDone={setFillDone} />,
    <MC key="q6" label="Question 6 · Scenario" question={wuduQuestion} selected={q6} setSelected={setQ6} done={q6Done} setDone={setQ6Done} />,
    <Takeaway key="takeaway" />,
    <Results key="results" scores={scores} total={total} onBack={onBack} onGoToNext={onGoToNext} />,
  ];

  const doneMap = { 2: sortDone, 4: rowsDone, 6: q3Done, 7: rapDone, 9: fillDone, 10: q6Done };
  const safePage = Math.min(Math.max(page, 0), pages.length - 1);
  const canContinue = !SHIP_READY || !Object.prototype.hasOwnProperty.call(doneMap, safePage) || doneMap[safePage];
  function canEnter(target) { if (!SHIP_READY || target <= safePage) return true; for (let i = 0; i < target; i += 1) if (Object.prototype.hasOwnProperty.call(doneMap, i) && !doneMap[i]) return false; return true; }
  function reset() { if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY); setPage(0); setSort({}); setSortDone(false); setRows({}); setRowsDone(false); setQ3(null); setQ3Done(false); setRap({}); setRapDone(false); setFill({}); setFillDone(false); setQ6(null); setQ6Done(false); }
  useEffect(() => save({ page: safePage, sort, sortDone, rows, rowsDone, q3, q3Done, rap, rapDone, fill, fillDone, q6, q6Done }), [safePage, sort, sortDone, rows, rowsDone, q3, q3Done, rap, rapDone, fill, fillDone, q6, q6Done]);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }, [safePage]);

  return <main className="min-h-screen bg-[#FDFBF7] text-slate-950"><header className="sticky top-0 z-40 border-b border-[#E7DFC9] bg-[#FDFBF7]/90 backdrop-blur-xl"><div className="mx-auto max-w-6xl px-4 py-3"><div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#F1E8D4]"><div className="h-full rounded-full bg-gradient-to-r from-[#C5A55A] via-teal-700 to-[#102033] transition-all duration-300" style={{ width: `${((safePage + 1) / pages.length) * 100}%` }} /></div><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><button onClick={onBack} className="text-lg text-[#102033] hover:text-slate-600 transition" aria-label="Back">←</button><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#8A6A20]">S2 · Lesson 5 · 14 min</p><h1 className="text-xl font-black tracking-tight text-[#102033] sm:text-2xl">When Things Go Wrong</h1></div></div><div className="flex flex-wrap items-center justify-end gap-2"><div className="hidden items-center gap-1 lg:flex">{pages.map((_, i) => <button key={i} type="button" disabled={!canEnter(i)} onClick={() => canEnter(i) && setPage(i)} aria-label={`Go to page ${i + 1}`} className={cx("h-2.5 rounded-full transition focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:cursor-not-allowed", i === safePage ? "w-7 bg-teal-700" : canEnter(i) ? "w-2.5 bg-slate-300 hover:bg-slate-400" : "w-2.5 bg-slate-200 opacity-40")} />)}</div><Pill tone="teal">Score {total}/{MAX_SCORE}</Pill><Pill tone="slate">Page {safePage + 1}/{pages.length}</Pill></div></div></div></header><section className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:py-8"><div key={safePage}>{pages[safePage]}</div><nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7DFC9] pt-5"><div className="flex gap-2"><Button variant="soft" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button><Button variant="danger" onClick={reset}>Reset</Button></div><div className="grid justify-items-end gap-2">{!canContinue && <p className="text-xs font-bold text-[#8A6A20]">Complete this activity to continue.</p>}<Button disabled={safePage === pages.length - 1 || !canContinue || !canEnter(safePage + 1)} onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}>Continue</Button></div></nav></section></main>;
}
