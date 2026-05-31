import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "deany_s2_lesson6_your_first_real_salah_ship_ready_v3";
const SHIP_READY = true;

const LESSON = {
  moduleId: "S2",
  lessonId: "S2.6",
  title: "Your First Real Salah",
  estimatedMinutes: "15",
  maxScore: 22,
};

const movementPairs = [
  { id: "m1", movement: "Opening the prayer", word: "Allahu Akbar", note: "The opening takbir begins the prayer." },
  { id: "m2", movement: "Standing recitation", word: "Al-Fatihah", note: "Al-Fatihah is recited in every rak'ah." },
  { id: "m3", movement: "Bowing", word: "Subhana Rabbiyal-Adheem", note: "This is said in ruku." },
  { id: "m4", movement: "Rising from bowing", word: "Sami Allahu liman hamidah", note: "This is said while rising from ruku." },
  { id: "m5", movement: "Prostrating", word: "Subhana Rabbiyal-Ala", note: "This is said in sujud." },
  { id: "m6", movement: "Ending the prayer", word: "As-salamu alaykum", note: "The salam closes the prayer." },
];

const anatomySteps = [
  { title: "Takbir", icon: "🙌", say: "Allahu Akbar", body: "Stand, raise your hands, say the opening takbir, then fold your hands." },
  { title: "Recitation", icon: "📖", say: "Al-Fatihah", body: "Recite al-Fatihah in every rak'ah. In the first two rak'at, it is highly recommended to recite a short surah after it." },
  { title: "Ruku", icon: "🙇", say: "Subhana Rabbiyal-Adheem", body: "Bow calmly with your hands on your knees." },
  { title: "Rise", icon: "🧍", say: "Sami Allahu liman hamidah", body: "Stand back up fully. Do not rush into sujud." },
  { title: "Sujud", icon: "🕌", say: "Subhana Rabbiyal-Ala", body: "Prostrate with calm stillness." },
  { title: "Sit", icon: "🧎", say: "Pause calmly", body: "Sit between the two sujuds before going down again." },
  { title: "Second sujud", icon: "🕌", say: "Subhana Rabbiyal-Ala", body: "Repeat the second sujud with calm stillness." },
];

const fajrSteps = [
  { title: "Intention", icon: "🤲", position: "Before starting", arabic: "نية", say: "Know in your heart that you are praying Fajr, two rak'at, fard, for Allah." },
  { title: "Opening takbir", icon: "🙌", position: "Standing", arabic: "الله أكبر", say: "Say Allahu Akbar. The prayer has now begun." },
  { title: "Al-Fatihah", icon: "📖", position: "Standing", arabic: "الفاتحة", say: "Recite al-Fatihah aloud in the first rak'ah of Fajr." },
  { title: "Short surah", icon: "📘", position: "Standing", arabic: "سورة قصيرة", say: "Recite a short surah after al-Fatihah as the recommended Sunnah practice." },
  { title: "Ruku", icon: "🙇", position: "Bowing", arabic: "سبحان ربي العظيم", say: "Bow calmly and say Subhana Rabbiyal-Adheem." },
  { title: "Rise", icon: "🧍", position: "Standing", arabic: "سمع الله لمن حمده", say: "Rise fully from ruku and praise Allah." },
  { title: "First sujud", icon: "🕌", position: "Sujud", arabic: "سبحان ربي الأعلى", say: "Go down to sujud calmly." },
  { title: "Sit", icon: "🧎", position: "Sitting", arabic: "جلوس", say: "Sit briefly between the two sujuds." },
  { title: "Second sujud", icon: "🕌", position: "Sujud", arabic: "سبحان ربي الأعلى", say: "Perform the second sujud. This completes one rak'ah." },
  { title: "Second rak'ah", icon: "🔁", position: "Repeat", arabic: "ركعة ثانية", say: "Stand and repeat the same structure for the second rak'ah." },
  { title: "Final sitting", icon: "🧎", position: "Sitting", arabic: "التحيات", say: "After the second rak'ah, sit for the final tashahhud, including the Shahadah and salutations on the Prophet ﷺ." },
  { title: "Salam", icon: "🌙", position: "Ending", arabic: "السلام عليكم", say: "End the prayer with salam." },
];

const sequenceCorrect = ["Intention", "Opening takbir", "Al-Fatihah", "Ruku", "Rise from ruku", "First sujud", "Sit between sujud", "Second sujud", "Final sitting", "Salam"];

const prayers = [
  { name: "Fajr", rakah: "2", aloud: "Both rak'at", silent: "None", time: "Dawn until sunrise" },
  { name: "Dhuhr", rakah: "4", aloud: "None", silent: "All four", time: "After midday" },
  { name: "Asr", rakah: "4", aloud: "None", silent: "All four", time: "Afternoon" },
  { name: "Maghrib", rakah: "3", aloud: "First two", silent: "Third", time: "After sunset" },
  { name: "Isha", rakah: "4", aloud: "First two", silent: "Last two", time: "Night" },
];

const volumeQuestions = [
  { id: "v1", statement: "Second rak'ah of Fajr", correct: "aloud", explain: "Both rak'at of Fajr are recited aloud." },
  { id: "v2", statement: "First rak'ah of Dhuhr", correct: "silent", explain: "Dhuhr is silent." },
  { id: "v3", statement: "Fourth rak'ah of Asr", correct: "silent", explain: "Asr is silent." },
  { id: "v4", statement: "Second rak'ah of Maghrib", correct: "aloud", explain: "The first two rak'at of Maghrib are aloud." },
  { id: "v5", statement: "Third rak'ah of Maghrib", correct: "silent", explain: "The third rak'ah of Maghrib is silent." },
  { id: "v6", statement: "Fourth rak'ah of Isha", correct: "silent", explain: "The last two rak'at of Isha are silent." },
];

const maghribQuestion = {
  prompt: "Idris is praying Maghrib. In the final sitting, he suddenly worries because he recited the second rak'ah aloud. What should he do?",
  options: [
    { id: "a", text: "Restart the prayer." },
    { id: "b", text: "Perform sajdah al-sahw because the second rak'ah should be silent." },
    { id: "c", text: "Complete normally. The first two rak'at of Maghrib are recited aloud." },
    { id: "d", text: "Repeat the third rak'ah aloud." },
  ],
  correct: "c",
  explain: "Idris did not make a mistake. Maghrib has three rak'at. The first two are recited aloud and the third is silent.",
};

const mariamQuestion = {
  prompt: "Mariam prays at the time of Fajr. She makes wudu, faces the qiblah, and intends to pray Fajr, two rak'at, fard. She recites al-Fatihah and a short surah aloud in the first rak'ah. In the second rak'ah, she recites al-Fatihah aloud but does not recite another short surah after it. She completes the rest of the prayer. Did Mariam pray a valid Fajr?",
  options: [
    { id: "a", text: "No. A short surah after al-Fatihah is required for validity." },
    { id: "b", text: "No. The second rak'ah of Fajr should be silent." },
    { id: "c", text: "Yes. Her prayer is valid, but it is better to recite a short surah after al-Fatihah." },
    { id: "d", text: "Yes, but only because she prayed at the time of Fajr." },
  ],
  correct: "c",
  explain: "Her prayer is valid. She recited al-Fatihah in both rak'at and completed the prayer. In Fajr, both rak'at are aloud. Reciting a short surah after al-Fatihah is highly recommended as part of the Sunnah, but leaving it out does not invalidate the prayer.",
  insightCards: [
    { title: "Valid prayer", body: "Her prayer is still completely valid because she did not miss al-Fatihah or the core structure of prayer." },
    { title: "Better practice", body: "It is highly recommended to follow the Sunnah and recite a short surah after al-Fatihah." },
    { title: "Do not restart", body: "She should not restart just because she only recited al-Fatihah in the second rak'ah." },
  ],
};

function cx(...classes) { return classes.filter(Boolean).join(" "); }

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]; copy[i] = copy[j]; copy[j] = temp;
  }
  return copy;
}

function safeLoadState() {
  if (typeof window === "undefined") return null;
  try { const raw = window.localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function safeSaveState(state) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function scoreQ1(matches) { return movementPairs.reduce((sum, item) => sum + (matches[item.movement] === item.word ? 1 : 0), 0); }
function scoreQ2(solved, attempts) { if (!solved) return 0; if (attempts <= 1) return 8; if (attempts === 2) return 6; if (attempts === 3) return 4; return 2; }
function scoreQ3(selections) { return volumeQuestions.reduce((sum, item) => sum + (selections[item.id] === item.correct ? 1 : 0), 0); }
function scoreMC(question, selected) { return selected === question.correct ? 1 : 0; }

function Card({ children, className = "" }) { return <section className={cx("rounded-[1.75rem] border border-[#E7DFC9] bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur", className)}>{children}</section>; }

function Tag({ children, tone = "slate" }) {
  const styles = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    teal: "bg-teal-50 text-teal-900 ring-teal-200",
    gold: "bg-[#FBF6EC] text-[#8A6A20] ring-[#E8D8A8]",
    emerald: "bg-emerald-50 text-emerald-900 ring-emerald-200",
    rose: "bg-rose-50 text-rose-900 ring-rose-200",
    navy: "bg-[#102033] text-amber-200 ring-slate-800",
  };
  return <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ring-1", styles[tone] || styles.slate)}>{children}</span>;
}

function Button({ children, onClick, disabled, variant = "primary", className = "", ariaLabel }) {
  const styles = {
    primary: "bg-[#102033] text-white hover:bg-slate-900 focus:ring-slate-300",
    soft: "bg-white text-slate-800 ring-1 ring-[#E7DFC9] hover:bg-[#FBF6EC] focus:ring-amber-200",
    gold: "bg-[#C5A55A] text-slate-950 hover:bg-[#B69549] focus:ring-amber-200",
    danger: "bg-rose-50 text-rose-900 ring-1 ring-rose-200 hover:bg-rose-100 focus:ring-rose-200",
  };
  return <button type="button" aria-label={ariaLabel} disabled={disabled} onClick={onClick} className={cx("rounded-2xl px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-45", styles[variant] || styles.primary, className)}>{children}</button>;
}

function ProgressDots({ page, totalPages, setPage, canGoToPage }) {
  return <div className="hidden items-center gap-1 md:flex" aria-label="Lesson pages">{Array.from({ length: totalPages }).map((_, index) => {
    const allowed = canGoToPage ? canGoToPage(index) : true;
    return <button key={index} type="button" disabled={!allowed} onClick={() => allowed && setPage(index)} aria-label={"Go to page " + (index + 1)} className={cx("h-2.5 rounded-full transition focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:cursor-not-allowed", index === page ? "w-7 bg-teal-700" : allowed ? "w-2.5 bg-slate-300 hover:bg-slate-400" : "w-2.5 bg-slate-200 opacity-40")} />;
  })}</div>;
}

function LessonShell({ page, totalPages, setPage, children, totalScore, canAdvance, onReset, canGoToPage, onBack }) {
  const progress = ((page + 1) / totalPages) * 100;
  return <main className="min-h-screen bg-[#FDFBF7] text-slate-950">
    <header className="sticky top-0 z-40 border-b border-[#E7DFC9] bg-[#FDFBF7]/90 backdrop-blur-xl"><div className="mx-auto max-w-6xl px-4 py-3"><div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#F1E8D4]" aria-hidden="true"><div className="h-full rounded-full bg-gradient-to-r from-[#C5A55A] via-teal-700 to-[#102033] transition-all duration-300" style={{ width: progress + "%" }} /></div><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3">{onBack && <button onClick={onBack} className="text-lg text-slate-950 hover:text-slate-600 transition" aria-label="Back">←</button>}<div><p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">{LESSON.moduleId} · Lesson 6 · {LESSON.estimatedMinutes} min</p><h1 className="text-xl font-black tracking-tight sm:text-2xl">{LESSON.title}</h1></div></div><div className="flex flex-wrap items-center justify-end gap-2"><ProgressDots page={page} totalPages={totalPages} setPage={setPage} canGoToPage={canGoToPage} /><Tag tone="teal">Score {totalScore}/{LESSON.maxScore}</Tag><Tag>Page {page + 1}/{totalPages}</Tag></div></div></div></header>
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}<div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7DFC9] pt-5"><div className="flex gap-2"><Button variant="soft" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button><Button variant="danger" onClick={onReset}>Reset</Button></div><div className="grid justify-items-end gap-2">{!canAdvance && page !== totalPages - 1 && <p className="text-xs font-bold text-[#8A6A20]">Complete this page before continuing.</p>}<Button disabled={page === totalPages - 1 || !canAdvance} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>Continue</Button></div></div></section>
  </main>;
}

function IntroPage() {
  return <div className="grid gap-5"><section className="overflow-hidden rounded-[1.75rem] border border-[#E7DFC9] bg-[#102033] p-0 text-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]"><div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"><div><Tag tone="gold">Goal of this lesson</Tag><h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Put the whole prayer together.</h2><p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-white/75">You have learned the appointments, wudu, the shape of a rak'ah, the words, and what to do when something goes wrong. Now you walk through a complete Fajr prayer with calm structure.</p></div><div className="rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-5 text-white shadow-inner"><p className="text-sm font-black uppercase tracking-[0.16em] text-amber-200">Hadith anchor</p><p className="mt-3 text-2xl font-black leading-9 text-white">Pray as you have seen me praying.</p><p className="mt-3 text-sm font-semibold text-white/65">Sahih al-Bukhari 631</p></div></div></section><div className="grid gap-4 md:grid-cols-3"><Card><Tag tone="teal">Goal 1</Tag><p className="mt-4 font-bold leading-7 text-slate-700">See one rak'ah as a complete flow.</p></Card><Card><Tag tone="teal">Goal 2</Tag><p className="mt-4 font-bold leading-7 text-slate-700">Walk through Fajr from start to salam.</p></Card><Card><Tag tone="teal">Goal 3</Tag><p className="mt-4 font-bold leading-7 text-slate-700">Know which prayers are aloud and silent.</p></Card></div></div>;
}

function AnatomyPage() {
  return <div className="grid gap-5"><Card><Tag tone="teal">Arc 1</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">One rak'ah has a rhythm.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">The prayer is not random. It moves through a clear sequence of standing, bowing, rising, prostrating, sitting, and prostrating again.</p></Card><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{anatomySteps.map((step, index) => <Card key={step.title} className="relative overflow-hidden"><div className="text-4xl" aria-hidden="true">{step.icon}</div><p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p><h3 className="mt-1 text-xl font-black text-slate-950">{step.title}</h3><p className="mt-2 text-sm font-black text-teal-800">{step.say}</p><p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{step.body}</p></Card>)}</div><Card className="border-teal-200 bg-teal-50"><p className="font-black text-teal-950">Accuracy anchor</p><p className="mt-2 text-sm font-semibold leading-7 text-slate-700">Al-Fatihah is treated as essential in this beginner map, anchored in Sahih al-Bukhari 756 and Sahih Muslim 394a. For personal edge cases, follow a qualified teacher or scholar.</p></Card></div>;
}

function MatchQuestion({ matches, setMatches, submitted, setSubmitted }) {
  const [active, setActive] = useState(null);
  const words = useMemo(() => shuffleArray(movementPairs.map((item) => item.word)), []);
  const allAnswered = movementPairs.every((item) => matches[item.movement]);
  const score = scoreQ1(matches);
  function pickWord(word) { if (!active || submitted) return; setMatches((prev) => ({ ...prev, [active]: word })); setActive(null); }
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Tag tone="teal">Question 1</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Match the words to the movement.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Tap a movement, then tap the correct words.</p></div>{submitted && <Tag tone={score >= 5 ? "emerald" : "rose"}>Score {score}/6</Tag>}</div></Card><div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><Card><h3 className="text-lg font-black">Movements</h3><div className="mt-4 grid gap-3">{movementPairs.map((item) => { const selected = matches[item.movement]; const correct = selected === item.word; return <button key={item.id} type="button" disabled={submitted} onClick={() => setActive(item.movement)} aria-pressed={active === item.movement} className={cx("rounded-3xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200", active === item.movement ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white hover:bg-slate-50", submitted && correct && "border-emerald-300 bg-emerald-50", submitted && selected && !correct && "border-rose-300 bg-rose-50")}><p className="font-black text-slate-950">{item.movement}</p><p className="mt-2 text-sm font-semibold text-slate-600">{selected || "Choose words"}</p>{submitted && <p className="mt-2 text-xs font-bold text-slate-600">Correct: {item.word}. {item.note}</p>}</button>; })}</div></Card><Card><h3 className="text-lg font-black">Words</h3><p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{active ? "Selected movement: " + active : "Choose a movement first."}</p><div className="mt-4 grid gap-3">{words.map((word) => <button key={word} type="button" onClick={() => pickWord(word)} disabled={submitted || !active} className="rounded-2xl bg-slate-50 p-4 text-left text-sm font-black text-slate-900 ring-1 ring-slate-200 transition hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50">{word}</button>)}</div></Card></div>{!submitted && <Button disabled={!allAnswered} onClick={() => setSubmitted(true)}>Submit matches</Button>}</div>;
}

function PreflightPage({ checks, setChecks, setPage }) {
  const items = [["wudu", "Wudu", "I have wudu."], ["qiblah", "Qiblah", "I am facing the qiblah."], ["time", "Time", "It is the time of Fajr."], ["niyyah", "Intention", "I know I am praying Fajr, two rak'at, fard, for Allah."]];
  const allChecked = items.every(([id]) => checks[id]);
  const toggle = (id) => setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  return <div className="grid gap-5"><Card><Tag tone="gold">Pre-flight check</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Before you start.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">These four checks keep the prayer grounded and calm.</p></Card><div className="grid gap-3 md:grid-cols-2">{items.map(([id, title, body]) => <button key={id} type="button" onClick={() => toggle(id)} aria-pressed={Boolean(checks[id])} className={cx("rounded-3xl border p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200", checks[id] ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50")}><p className="text-lg font-black text-slate-950">{checks[id] ? "✓ " : ""}{title}</p><p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{body}</p></button>)}</div><Card className="bg-slate-950 text-white"><p className="text-lg font-black">Ready to walk through Fajr?</p><p className="mt-2 text-sm leading-7 text-white/75">Tick all four checks first. The purification anchor is Sahih al-Bukhari 6954 and Sahih Muslim 225.</p><Button className="mt-5" variant="gold" disabled={!allChecked} onClick={() => setPage(4)}>Begin walkthrough</Button></Card></div>;
}

function FajrWalkthrough({ completed, setCompleted, setPage }) {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const done = completed || stepIndex >= fajrSteps.length;
  const step = fajrSteps[Math.min(stepIndex, fajrSteps.length - 1)];
  function nextStep() { if (stepIndex === fajrSteps.length - 1) { setCompleted(true); setStepIndex(fajrSteps.length); } else { setStepIndex((prev) => prev + 1); } }
  if (!started && !done) return <Card className="bg-gradient-to-br from-slate-950 to-teal-950 text-white"><Tag tone="gold">Guided walkthrough</Tag><h2 className="mt-4 text-4xl font-black tracking-tight">Pray Fajr step by step.</h2><p className="mt-4 max-w-3xl text-base leading-8 text-white/75">No timer. No pressure. Tap through each step slowly.</p><Button className="mt-6" variant="gold" onClick={() => setStarted(true)}>Start</Button></Card>;
  if (done) return <div className="grid gap-5"><Card className="border-emerald-200 bg-emerald-50 text-center"><div className="text-6xl" aria-hidden="true">🤲</div><h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950">You completed the Fajr walkthrough.</h2><p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-8 text-slate-700">The prayer now has a route you can follow.</p></Card><Button onClick={() => setPage(5)}>Continue to prayer path</Button></div>;
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Tag tone="gold">Fajr walkthrough</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Step {stepIndex + 1} of {fajrSteps.length}</h2></div><Tag>{step.position}</Tag></div></Card><Card className="overflow-hidden p-0"><div className="grid lg:grid-cols-[0.85fr_1.15fr]"><div className="flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50 p-8 text-center"><div className="text-7xl" aria-hidden="true">{step.icon}</div><h3 className="mt-5 text-4xl font-black tracking-tight text-slate-950">{step.title}</h3></div><div className="p-6 sm:p-8"><p className="text-right text-4xl font-black leading-[1.8] text-slate-950" dir="rtl" lang="ar">{step.arabic}</p><p className="mt-5 text-lg font-semibold leading-8 text-slate-700">{step.say}</p><Button className="mt-6 w-full" onClick={nextStep}>{stepIndex === fajrSteps.length - 1 ? "Complete" : "Next step"}</Button></div></div></Card></div>;
}

function PrayerPath({ order, setOrder, attempts, setAttempts, solved, setSolved }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const trayOrder = useMemo(() => shuffleArray(sequenceCorrect), []);
  const placed = new Set(order.filter(Boolean));
  const tray = trayOrder.filter((item) => !placed.has(item));
  const filled = order.filter(Boolean).length;
  const ready = filled === sequenceCorrect.length;
  const score = scoreQ2(solved, attempts);
  function place(index) { if (!selected || solved) return; setOrder((prev) => { const copy = prev.map((item) => (item === selected ? null : item)); copy[index] = selected; return copy; }); setSelected(null); setFeedback(null); }
  function remove(index) { if (solved) return; setOrder((prev) => { const copy = [...prev]; copy[index] = null; return copy; }); }
  function check() { setAttempts((prev) => prev + 1); const correct = order.every((item, index) => item === sequenceCorrect[index]); if (correct) { setSolved(true); setFeedback("Correct. You built the path from intention to salam."); } else { const firstWrong = order.findIndex((item, index) => item !== sequenceCorrect[index]); setFeedback("Not yet. Start by rethinking slot " + (firstWrong + 1) + "."); } }
  return <div className="grid gap-5"><Card className="bg-gradient-to-br from-white via-teal-50 to-amber-50"><div className="flex flex-wrap items-center justify-between gap-3"><div><Tag tone="teal">Question 2</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Build the prayer path.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">Pick a tile, then place it into the correct slot.</p></div>{solved ? <Tag tone="emerald">Score {score}/8</Tag> : <Tag tone="gold">{filled}/10 placed</Tag>}</div></Card><Card className="bg-slate-950 text-white"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-black uppercase tracking-[0.16em] text-amber-300">Step tray</p><p className="mt-2 text-sm leading-7 text-white/75">Choose a tile. Selected tiles turn gold.</p></div><Button variant="gold" disabled={solved} onClick={() => { setOrder(Array(sequenceCorrect.length).fill(null)); setSelected(null); setFeedback(null); }}>Reset path</Button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{tray.map((item) => <button key={item} type="button" disabled={solved} onClick={() => setSelected(item)} className={cx("rounded-2xl p-4 text-left text-sm font-black ring-1 transition focus:outline-none focus:ring-4 focus:ring-amber-200", selected === item ? "bg-amber-400 text-slate-950 ring-amber-300 shadow-lg" : "bg-white text-slate-950 ring-white hover:bg-amber-50")}>{item}</button>)}{tray.length === 0 && <div className="rounded-2xl bg-white p-4 text-sm font-black text-slate-950">All steps placed. Check the path.</div>}</div></Card><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">{sequenceCorrect.map((slot, index) => { const item = order[index]; const locked = solved && item === slot; return <button key={slot} type="button" onClick={() => (item ? remove(index) : place(index))} disabled={locked} className={cx("min-h-32 rounded-3xl border p-4 text-left shadow-sm transition focus:outline-none focus:ring-4 focus:ring-teal-200", item ? "border-teal-200 bg-white" : "border-dashed border-slate-300 bg-slate-50 hover:bg-white", locked && "border-emerald-300 bg-emerald-50")}><span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-teal-700 text-xs font-black text-white">{index + 1}</span><p className={cx("mt-4 text-lg font-black", item ? "text-slate-950" : "text-slate-400")}>{item || "Tap to place"}</p><p className="mt-2 text-xs font-bold text-slate-500">{item ? "Tap to remove" : selected ? "Ready: " + selected : "Choose a tile first"}</p></button>; })}</div><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-600">Scoring: first try 8, second 6, third 4, after that 2.</p>{!solved && <Button disabled={!ready} onClick={check}>Check path</Button>}</div>{feedback && <Card className={solved ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}><p className="text-sm font-black leading-7 text-slate-800">{feedback}</p></Card>}</div>;
}

function PrayerTablePage() {
  return <div className="grid gap-5"><Card><Tag tone="teal">Reference</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">The five prayers.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">The structure is the same. The number of rak'at and the recitation volume change.</p></Card><Card className="p-0"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-950 text-white"><tr><th className="px-5 py-4">Prayer</th><th className="px-5 py-4">Rak'at</th><th className="px-5 py-4">Aloud</th><th className="px-5 py-4">Silent</th><th className="px-5 py-4">Time</th></tr></thead><tbody>{prayers.map((p, i) => <tr key={p.name} className={i % 2 ? "bg-slate-50" : "bg-white"}><td className="px-5 py-4 font-black text-teal-900">{p.name}</td><td className="px-5 py-4 font-semibold">{p.rakah}</td><td className="px-5 py-4 font-semibold">{p.aloud}</td><td className="px-5 py-4 font-semibold">{p.silent}</td><td className="px-5 py-4 font-semibold">{p.time}</td></tr>)}</tbody></table></div></Card></div>;
}

function VolumeQuestion({ selections, setSelections, submitted, setSubmitted }) {
  const shuffledQuestions = useMemo(() => shuffleArray(volumeQuestions), []);
  const allAnswered = volumeQuestions.every((q) => selections[q.id]);
  const score = scoreQ3(selections);
  const choose = (id, value) => { if (!submitted) setSelections((prev) => ({ ...prev, [id]: value })); };
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Tag tone="teal">Question 3</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Aloud or silent?</h2></div>{submitted && <Tag tone={score >= 5 ? "emerald" : "rose"}>Score {score}/6</Tag>}</div></Card><div className="grid gap-3">{shuffledQuestions.map((q) => { const selected = selections[q.id]; const correct = selected === q.correct; return <Card key={q.id} className={cx(submitted && correct && "border-emerald-300 bg-emerald-50", submitted && selected && !correct && "border-rose-300 bg-rose-50")}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="font-black text-slate-900">{q.statement}</p><div className="flex gap-2"><Button variant={selected === "aloud" ? "primary" : "soft"} disabled={submitted} onClick={() => choose(q.id, "aloud")}>ALOUD</Button><Button variant={selected === "silent" ? "primary" : "soft"} disabled={submitted} onClick={() => choose(q.id, "silent")}>SILENT</Button></div></div>{submitted && <p className="mt-3 text-sm font-semibold text-slate-700">{correct ? "Correct." : "Correct answer: " + q.correct + "."} {q.explain}</p>}</Card>; })}</div>{!submitted && <Button disabled={!allAnswered} onClick={() => setSubmitted(true)}>Submit answers</Button>}</div>;
}

function SupportPage() {
  const cards = [["I forgot a word", "Pause, breathe, and continue from what you remember. Do not panic."], ["I am unsure", "If you are genuinely unsure, seek knowledge and ask someone qualified. Learning takes time."], ["I rushed", "Next time, slow down. Stillness is part of learning to pray properly."]];
  return <div className="grid gap-5"><Card><Tag tone="gold">First-timer support</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Mistakes are part of learning.</h2><p className="mt-3 text-base leading-8 text-slate-700">The goal is not fear. The goal is calm correction.</p></Card><div className="grid gap-4 md:grid-cols-3">{cards.map(([title, body]) => <Card key={title}><h3 className="text-xl font-black">{title}</h3><p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{body}</p></Card>)}</div></div>;
}

function MCPage({ tag, question, selected, setSelected, submitted, setSubmitted }) {
  const orderedOptions = useMemo(() => shuffleArray(question.options), [question]);
  const correct = selected === question.correct;
  return <div className="grid gap-5"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Tag tone="teal">{tag}</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Choose the best answer.</h2><p className="mt-3 max-w-3xl text-base font-semibold leading-8 text-slate-800">{question.prompt}</p></div>{submitted && <Tag tone={correct ? "emerald" : "rose"}>Score {correct ? 1 : 0}/1</Tag>}</div></Card><div className="grid gap-3">{orderedOptions.map((option, index) => { const isSelected = selected === option.id; const isCorrect = option.id === question.correct; const displayLetter = String.fromCharCode(65 + index); return <button key={option.id} type="button" disabled={submitted} onClick={() => setSelected(option.id)} className={cx("rounded-3xl border p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200", isSelected ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white hover:bg-slate-50", submitted && isCorrect && "border-emerald-300 bg-emerald-50", submitted && isSelected && !isCorrect && "border-rose-300 bg-rose-50")}><div className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-700">{displayLetter}</span><span className="text-sm font-bold leading-7 text-slate-800">{option.text}</span></div></button>; })}</div>{!submitted && <Button disabled={!selected} onClick={() => setSubmitted(true)}>Submit answer</Button>}{submitted && <Card className={correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}><p className={cx("text-lg font-black", correct ? "text-emerald-900" : "text-rose-900")}>{correct ? "Correct" : "Review this one"}</p><p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{question.explain}</p>{question.insightCards && <div className="mt-4 grid gap-3 md:grid-cols-3">{question.insightCards.map((card) => <div key={card.title} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><p className="text-sm font-black text-slate-950">{card.title}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{card.body}</p></div>)}</div>}</Card>}</div>;
}

function PathForwardPage() {
  return <div className="grid gap-5"><Card><Tag tone="teal">Next steps</Tag><h2 className="mt-4 text-3xl font-black tracking-tight">Keep building.</h2><p className="mt-3 text-base leading-8 text-slate-700">You now have the foundation for Salah. The next step is consistency.</p></Card><div className="grid gap-4 md:grid-cols-3"><Card><h3 className="text-xl font-black">Memorise short surahs</h3><p className="mt-3 text-sm font-semibold leading-7 text-slate-600">Start with al-Ikhlas, al-Falaq, and al-Nas.</p></Card><Card><h3 className="text-xl font-black">Pray slowly</h3><p className="mt-3 text-sm font-semibold leading-7 text-slate-600">Stillness turns the structure into worship.</p></Card><Card><h3 className="text-xl font-black">Ask a teacher</h3><p className="mt-3 text-sm font-semibold leading-7 text-slate-600">Use this app as a learning aid, not a replacement for qualified guidance.</p></Card></div></div>;
}

function CompletePage({ scores, totalScore, onBack, onGoToNext }) {
  const percent = Math.round((totalScore / LESSON.maxScore) * 100);
  const items = [["Words and movements", scores.q1 + "/6"], ["Prayer path", scores.q2 + "/8"], ["Aloud and silent", scores.q3 + "/6"], ["Maghrib scenario", scores.q4 + "/1"], ["Fajr Sunnah scenario", scores.q5 + "/1"]];
  return <div className="grid gap-5"><Card className="border-emerald-200 bg-emerald-50"><Tag tone="emerald">Module complete</Tag><div className="mt-5 grid gap-6 md:grid-cols-[auto_1fr] md:items-center"><div className="flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-sm"><div className="text-center"><p className="text-4xl font-black text-slate-950">{percent}%</p><p className="text-sm font-bold text-slate-500">complete</p></div></div><div><h2 className="text-4xl font-black tracking-tight text-emerald-950">Beginner Salah is complete.</h2><p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">You are ready to pray with a real foundation. Keep learning, keep asking, and keep showing up.</p></div></div></Card><Card><h3 className="text-xl font-black">Score breakdown</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{items.map(([label, score]) => <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><p className="text-sm font-black text-slate-900">{label}</p><Tag>{score}</Tag></div>)}</div></Card><Card><div className="flex flex-wrap justify-center gap-3">{onGoToNext && <Button onClick={onGoToNext}>Continue to Lesson 7</Button>}{onBack && <Button variant="soft" onClick={onBack}>Back to lessons</Button>}</div></Card></div>;
}

export default function DEANYS2L6({ onBack, onHome, onGoToNext }) {
  const saved = safeLoadState();
  const [page, setPage] = useState(saved?.page || 0);
  const [matches, setMatches] = useState(saved?.matches || {});
  const [q1Submitted, setQ1Submitted] = useState(saved?.q1Submitted || false);
  const [checks, setChecks] = useState(saved?.checks || {});
  const [walkthroughDone, setWalkthroughDone] = useState(saved?.walkthroughDone || false);
  const [order, setOrder] = useState(saved?.order || Array(sequenceCorrect.length).fill(null));
  const [attempts, setAttempts] = useState(saved?.attempts || 0);
  const [pathSolved, setPathSolved] = useState(saved?.pathSolved || false);
  const [volumeSelections, setVolumeSelections] = useState(saved?.volumeSelections || {});
  const [volumeSubmitted, setVolumeSubmitted] = useState(saved?.volumeSubmitted || false);
  const [q4Selected, setQ4Selected] = useState(saved?.q4Selected || null);
  const [q4Submitted, setQ4Submitted] = useState(saved?.q4Submitted || false);
  const [q5Selected, setQ5Selected] = useState(saved?.q5Selected || null);
  const [q5Submitted, setQ5Submitted] = useState(saved?.q5Submitted || false);

  const allPreflightChecked = ["wudu", "qiblah", "time", "niyyah"].every((id) => checks[id]);
  const scores = useMemo(() => ({ q1: q1Submitted ? scoreQ1(matches) : 0, q2: scoreQ2(pathSolved, attempts), q3: volumeSubmitted ? scoreQ3(volumeSelections) : 0, q4: q4Submitted ? scoreMC(maghribQuestion, q4Selected) : 0, q5: q5Submitted ? scoreMC(mariamQuestion, q5Selected) : 0 }), [q1Submitted, matches, pathSolved, attempts, volumeSubmitted, volumeSelections, q4Submitted, q4Selected, q5Submitted, q5Selected]);
  const totalScore = Object.values(scores).reduce((sum, value) => sum + value, 0);

  useEffect(() => { safeSaveState({ page, matches, q1Submitted, checks, walkthroughDone, order, attempts, pathSolved, volumeSelections, volumeSubmitted, q4Selected, q4Submitted, q5Selected, q5Submitted }); }, [page, matches, q1Submitted, checks, walkthroughDone, order, attempts, pathSolved, volumeSelections, volumeSubmitted, q4Selected, q4Submitted, q5Selected, q5Submitted]);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  function resetLesson() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    setPage(0); setMatches({}); setQ1Submitted(false); setChecks({}); setWalkthroughDone(false); setOrder(Array(sequenceCorrect.length).fill(null)); setAttempts(0); setPathSolved(false); setVolumeSelections({}); setVolumeSubmitted(false); setQ4Selected(null); setQ4Submitted(false); setQ5Selected(null); setQ5Submitted(false);
  }

  const pages = [<IntroPage key="intro" />, <AnatomyPage key="anatomy" />, <MatchQuestion key="match" matches={matches} setMatches={setMatches} submitted={q1Submitted} setSubmitted={setQ1Submitted} />, <PreflightPage key="preflight" checks={checks} setChecks={setChecks} setPage={setPage} />, <FajrWalkthrough key="walkthrough" completed={walkthroughDone} setCompleted={setWalkthroughDone} setPage={setPage} />, <PrayerPath key="path" order={order} setOrder={setOrder} attempts={attempts} setAttempts={setAttempts} solved={pathSolved} setSolved={setPathSolved} />, <PrayerTablePage key="table" />, <VolumeQuestion key="volume" selections={volumeSelections} setSelections={setVolumeSelections} submitted={volumeSubmitted} setSubmitted={setVolumeSubmitted} />, <SupportPage key="support" />, <MCPage key="maghrib" tag="Question 4" question={maghribQuestion} selected={q4Selected} setSelected={setQ4Selected} submitted={q4Submitted} setSubmitted={setQ4Submitted} />, <MCPage key="mariam" tag="Question 5" question={mariamQuestion} selected={q5Selected} setSelected={setQ5Selected} submitted={q5Submitted} setSubmitted={setQ5Submitted} />, <PathForwardPage key="next" />, <CompletePage key="complete" scores={scores} totalScore={totalScore} onBack={onBack} onGoToNext={onGoToNext} />];
  const safePage = Math.min(Math.max(page, 0), pages.length - 1);

  function pageComplete(index) {
    if (!SHIP_READY) return true;
    if (index === 2) return q1Submitted;
    if (index === 3) return allPreflightChecked;
    if (index === 4) return walkthroughDone;
    if (index === 5) return pathSolved;
    if (index === 7) return volumeSubmitted;
    if (index === 9) return q4Submitted;
    if (index === 10) return q5Submitted;
    return true;
  }
  function canGoToPage(targetPage) { if (!SHIP_READY || targetPage <= safePage) return true; for (let index = 0; index < targetPage; index += 1) { if (!pageComplete(index)) return false; } return true; }
  const canAdvance = safePage < pages.length - 1 && pageComplete(safePage) && canGoToPage(safePage + 1);

  return <LessonShell page={safePage} totalPages={pages.length} setPage={setPage} totalScore={totalScore} canAdvance={canAdvance} onReset={resetLesson} canGoToPage={canGoToPage} onBack={onBack}><div key={safePage} className="animate-[fadeUp_0.25s_ease]">{pages[safePage]}</div><style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}"}</style></LessonShell>;
}
