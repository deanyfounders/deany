import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "deany_b1_shahadah_lesson2_ship_ready_v4";
const SHIP_READY = true;

const verse331 = {
  ar: "قُلْ إِنْ كُنْتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَاللَّهُ غَفُورٌ رَحِيمٌ",
  en: "Say, [O Muhammad], \"If you should love Allah, then follow me, [so] Allah will love you and forgive you your sins. And Allah is Forgiving and Merciful.\"",
};

const questions = {
  q1: {
    kind: "mc",
    title: "Question 1 \u00b7 Think",
    prompt: "In the second testimony, Muhammad \uFDFA is named as rasul of Allah. Which best captures what rasul means?",
    points: 1,
    options: [
      ["A teacher or wise man who arrives at religious truth through reflection.", false, "That describes a wise teacher, not a rasul. A rasul is sent with a message that comes from outside himself."],
      ["Anyone who speaks about Allah in a general spiritual sense.", false, "Too general. Rasul means one sent by Allah with a defined message and mission."],
      ["One who is sent with a message and a mission by an authority.", true, "Correct. Rasul carries the meaning of being sent with a message, on a mission, by an authority."],
      ["The most virtuous person in a generation, regardless of revelation.", false, "Virtue alone is not what defines rasul. Revelation and being sent define the role."],
    ],
  },
  q2: {
    kind: "sort",
    title: "Question 2 \u00b7 Sort",
    prompt: "What does the second testimony imply?",
    left: "Implied",
    right: "Not implied",
    points: 4,
    items: [
      ["That Muhammad \uFDFA is to be worshipped alongside Allah.", false, "Not implied. The Shahadah says rasul, Messenger, not ilah. Worship belongs to Allah alone."],
      ["That what Muhammad \uFDFA taught about worship is authoritative.", true, "Implied. If he is Allah's Messenger, his teaching about worship is authoritative guidance."],
      ["That his life and example serve as a model for how to live as a Muslim.", true, "Implied. Qur'an 33:21 describes the Messenger of Allah as an excellent pattern."],
      ["That Muhammad \uFDFA shares in Allah's divine attributes.", false, "Not implied. He is Allah's servant and Messenger. The Shahadah keeps that distinction clear."],
    ],
  },
  q3: {
    kind: "sortText",
    title: "Question 3 \u00b7 Investigate",
    prompt: "Classify each statement by its source emphasis.",
    left: "Qur'an",
    right: "Sunnah",
    leftValue: "quran",
    rightValue: "sunnah",
    points: 6,
    items: [
      ["That prayer is obligatory on every Muslim.", "quran", "The command to establish prayer is Qur'anic. The form is taught through the Sunnah."],
      ["That Fajr is two rak'at and recited aloud.", "sunnah", "The Qur'an does not list each prayer's rak'at. This is known from the Prophet's \uFDFA practice."],
      ["That Ramadan is the month of fasting.", "quran", "The Qur'an names Ramadan as the month of fasting."],
      ["That the fast is broken at sunset.", "quran", "The Qur'an tells believers to complete the fast until the night. The preferred way of breaking it is taught in the Sunnah."],
      ["What to say when bowing in prayer.", "sunnah", "The Qur'an does not give the ruku words. They are known from the Prophet's \uFDFA teaching and practice."],
      ["That Hajj is required for those able to make the journey.", "quran", "Qur'an 3:97 states that pilgrimage to the House is owed to Allah by whoever is able to find a way."],
    ],
  },
  q4: {
    kind: "mc",
    title: "Question 4 \u00b7 Think",
    prompt: "Tariq believes in Allah, prays five times a day, and accepts the Qur'an as Allah's revealed word. He argues that only the Qur'an is binding and that the Sunnah is not necessary. He says he loves Allah and that following only the Qur'an is enough. What is the issue with his position, structurally?",
    points: 1,
    options: [
      ["There is no issue. Following only the Qur'an is complete and coherent.", false, "There is an issue. The Qur'an itself instructs believers to follow the Messenger \uFDFA."],
      ["His prayer does not count because he has misunderstood the Sunnah.", false, "This goes too far. The issue is not whether his prayer counts. The problem is the inconsistency in claiming to follow the Qur'an while rejecting the Messenger's \uFDFA authority, even though the Qur'an itself commands following him."],
      ["It contradicts itself: the Qur'an he accepts directly instructs the believer to follow the Messenger \uFDFA.", true, "Correct. Qur'an 3:31 links love of Allah to following the Messenger \uFDFA, and Qur'an 4:80 states that whoever obeys the Messenger has obeyed Allah."],
      ["He is correct about Qur'an-only practice but should make exceptions for widely accepted hadith.", false, "This still misses the structure. The Qur'an itself gives authority to following the Messenger \uFDFA, so the answer begins inside the Qur'an."],
    ],
  },
  q5: {
    kind: "mc",
    title: "Question 5 \u00b7 Capstone",
    prompt: "Which answer best captures the relationship between the two testimonies?",
    points: 1,
    options: [
      ["They are independent. One can be accepted without the other.", false, "The first testimony names the One worshipped. The second names the Messenger \uFDFA through whom worship is taught."],
      ["The second testimony is a recommendation, while the first is the obligation.", false, "The second testimony is not optional. The Qur'an connects love of Allah to following the Messenger \uFDFA."],
      ["They form one structural whole: the first names the object of worship, and the second establishes the method by which that worship is taught and known.", true, "Correct. The first testimony establishes who is worshipped. The second establishes how that worship is taught."],
      ["The second testimony is necessary because Muhammad \uFDFA is divine.", false, "This is a serious error. The Prophet \uFDFA is not divine. The Shahadah calls him rasul, Messenger."],
    ],
  },
};

const pageData = [
  { type: "intro" },
  { type: "rasul" },
  { type: "question", id: "q1" },
  { type: "why" },
  { type: "question", id: "q2" },
  { type: "sunnah" },
  { type: "question", id: "q3" },
  { type: "quran" },
  { type: "question", id: "q4" },
  { type: "following" },
  { type: "question", id: "q5" },
  { type: "closing" },
  { type: "review" },
];

const cx = (...parts) => parts.filter(Boolean).join(" ");
const maxScore = Object.values(questions).reduce((sum, q) => sum + q.points, 0);
const shuffle = (items) => [...items].map((value) => ({ value, n: Math.random() })).sort((a, b) => a.n - b.n).map((item) => item.value);

function loadState() {
  if (typeof window === "undefined") return { page: 0, scores: {}, confidence: 3 };
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || { page: 0, scores: {}, confidence: 3 };
  } catch {
    return { page: 0, scores: {}, confidence: 3 };
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function scoreTotal(scores) {
  return Object.values(scores).reduce((sum, value) => sum + (Number(value) || 0), 0);
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

function Card({ children, className = "" }) {
  return <section className={cx("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm", className)}>{children}</section>;
}

function Button({ children, onClick, disabled, variant = "primary" }) {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    gold: "bg-amber-500 text-slate-950 hover:bg-amber-600",
    soft: "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
  };
  return <button type="button" disabled={disabled} onClick={onClick} className={cx("rounded-2xl px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-45", variants[variant])}>{children}</button>;
}

function Arabic({ children, size = "text-3xl", className = "" }) {
  return <div dir="rtl" lang="ar" className={cx("font-serif leading-loose tracking-wide text-slate-950", size, className)}>{children}</div>;
}

function Label({ children, className = "" }) {
  return <p className={cx("text-xs font-black uppercase tracking-[0.2em] text-slate-500", className)}>{children}</p>;
}

function Header({ page, score, onBack }) {
  return <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div className="mx-auto max-w-5xl px-4 py-3">
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-700 transition-all" style={{ width: `${Math.round(((page + 1) / pageData.length) * 100)}%` }} /></div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && <button type="button" onClick={onBack} className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition" aria-label="Back to lessons">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </button>}
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">B1.2 · Beginner tier</p><h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">The Second Testimony</h1></div>
        </div>
        <div className="flex flex-wrap gap-2"><Pill tone="teal">Score {score}/{maxScore}</Pill><Pill>Page {page + 1}/{pageData.length}</Pill></div>
      </div>
    </div>
  </header>;
}

function IntroPage() {
  return <div className="grid gap-6">
    <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-8 text-white shadow-sm sm:p-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Lesson 2 of the Shahadah module</p>
      <h2 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">The Second Testimony</h2>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Why the Shahadah does not stop at illa Allah.</p>
      <div className="mt-6 flex flex-wrap gap-2"><Pill tone="gold">13 min</Pill><Pill tone="teal">5 questions</Pill><Pill tone="purple">Qur'an + Sunnah</Pill></div>
    </div>
    <Card className="border-amber-200 bg-amber-50"><Pill tone="gold">Goal of this lesson</Pill><h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Understand why Muslims testify that Muhammad \uFDFA is the Messenger of Allah.</h3><p className="mt-3 leading-8 text-slate-800">The first testimony tells you who is worshipped: Allah alone. The second testimony tells you how that worship is taught: through the Messenger \uFDFA sent by Allah.</p></Card>
  </div>;
}

function RasulPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">The word</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">What rasul means.</h2><p className="mt-3 leading-8 text-slate-700">The second testimony names Muhammad \uFDFA as the Messenger of Allah.</p></Card>
    <Card className="border-amber-300 bg-[#FBF6EC]"><Arabic size="text-[2rem] sm:text-4xl" className="text-center">{"\u0648\u064E\u0623\u064E\u0634\u0652\u0647\u064E\u062F\u064F \u0623\u064E\u0646\u0651\u064E \u0645\u064F\u062D\u064E\u0645\u0651\u064E\u062F\u064B\u0627 \u0631\u064E\u0633\u064F\u0648\u0644\u064F \u0627\u0644\u0644\u0651\u064E\u0647\u0650"}</Arabic><p className="mt-4 text-center font-serif text-lg italic leading-8 text-slate-600">Wa ashhadu anna Muhammadan rasulullah.</p><p className="mt-3 text-center font-semibold leading-7 text-slate-800">Translation: "And I testify that Muhammad is the Messenger of Allah."</p></Card>
    <Card><p className="leading-8 text-slate-700">Rasul comes from a root that carries the meaning of sending. A rasul is one who is sent with a message, on a mission, by an authority. Not a self-appointed speaker. Not a teacher who reached wisdom through private reflection.</p></Card>
    <Card className="border-amber-300 bg-amber-50"><div dir="rtl" className="grid grid-cols-3 gap-3 text-center">{[["\u0631", "r"], ["\u0633", "s"], ["\u0644", "l"]].map(([letter, sound]) => <div key={letter} className="rounded-3xl bg-white p-5 ring-1 ring-amber-200"><Arabic size="text-5xl">{letter}</Arabic><p dir="ltr" className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-amber-800">{sound}</p></div>)}</div></Card>
  </div>;
}

function WhyPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">The structural gap</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Why a second testimony?</h2><p className="mt-3 leading-8 text-slate-700">Belief in one God is not the same as knowing how Allah is to be worshipped.</p></Card>
    <Card className="overflow-hidden p-0"><div className="grid md:grid-cols-2"><div className="bg-slate-100 p-6 text-center"><Label>Testimony 1</Label><h3 className="mt-4 text-2xl font-black text-slate-950">Who is worshipped?</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Allah alone.</p></div><div className="bg-amber-100 p-6 text-center"><Label className="text-amber-700">Testimony 2</Label><h3 className="mt-4 text-2xl font-black text-amber-950">How is He worshipped?</h3><p className="mt-2 text-sm font-semibold leading-6 text-amber-900">Through what the Messenger \uFDFA taught.</p></div></div></Card>
    <Card><p className="leading-8 text-slate-700">The first testimony names Allah as the only object of worship, but it does not by itself tell you the form that worship should take. This is the gap the second testimony closes.</p><p className="mt-3 leading-8 text-slate-700">The testimony anchors worship in a Messenger whose words were recorded, whose actions were observed, and whose way was transmitted.</p></Card>
  </div>;
}

function SunnahPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="teal">The Sunnah</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The Prophet's \uFDFA way.</h2><p className="mt-3 leading-8 text-slate-700">The Sunnah refers to the Prophet's \uFDFA way: what he did, what he said, and what he approved.</p></Card>
    <Card className="overflow-hidden p-0"><div className="grid md:grid-cols-2"><div className="border-b border-slate-200 bg-teal-50 p-6 md:border-b-0 md:border-r"><Label className="text-teal-800">The Qur'an</Label><h3 className="mt-3 text-2xl font-black text-teal-950">What to do</h3><ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700"><li>Establish prayer</li><li>Fast Ramadan</li><li>Give zakah</li><li>Perform Hajj if able</li></ul></div><div className="bg-amber-50 p-6"><Label className="text-amber-800">The Sunnah</Label><h3 className="mt-3 text-2xl font-black text-amber-950">How to do it</h3><ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700"><li>Pray in this form, with these words</li><li>Begin the fast at fajr and end it at sunset</li><li>Give zakah according to its rules</li><li>Perform Hajj according to the Prophet's \uFDFA way</li></ul></div></div></Card>
    <Card><p className="leading-8 text-slate-700">The Qur'an commands the pillars, including prayer, fasting, zakah, and Hajj for the one who is able. The Prophet \uFDFA teaches the form, sequence, words, and living practice of worship.</p></Card>
    <Card className="border-teal-200 bg-teal-50"><Label className="text-teal-800">Hadith anchor</Label><p className="mt-4 font-serif text-lg italic leading-8 text-slate-800">"Pray as you have seen me praying."</p><p className="mt-3 text-xs font-bold text-slate-500">Sahih al-Bukhari 6008</p></Card>
  </div>;
}

function QuranPage() {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">The Qur'anic basis</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Why follow the Messenger \uFDFA?</h2><p className="mt-3 leading-8 text-slate-700">The Qur'an itself gives the answer directly.</p></Card>
    <Card className="border-amber-300 bg-[#FBF6EC] p-6 sm:p-8"><Arabic size="text-[1.85rem] sm:text-4xl" className="text-center">{verse331.ar}</Arabic><div className="my-6 h-px bg-amber-300" /><Label>Saheeh International translation</Label><p className="mt-3 font-serif text-lg italic leading-8 text-slate-800">{verse331.en}</p><p className="mt-3 text-xs font-bold text-slate-500">Qur'an 3:31</p></Card>
    <Card><Label>What the verse establishes</Label><p className="mt-4 leading-8 text-slate-700">If you love Allah, then follow the Messenger \uFDFA. The claim of love is verified by following, not by the assertion itself. Qur'an 4:80 also states that whoever obeys the Messenger has obeyed Allah.</p></Card>
  </div>;
}

function FollowingPage() {
  const rows = [["Foundational acts", "Prayer, fasting, zakah, and Hajj are commanded by the Qur'an. The Prophet \uFDFA taught their form through his words and practice."], ["Daily acts", "How to greet, eat, remember Allah, and carry oneself through ordinary life."], ["Moral and ethical acts", "How to treat parents, handle disagreement, use wealth, respond to anger, and act under pressure."]];
  return <div className="grid gap-5"><Card><Pill tone="purple">Following</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">What following the Messenger \uFDFA looks like.</h2><p className="mt-3 leading-8 text-slate-700">If the second testimony commits the believer to follow the Prophet \uFDFA, the next question is practical: follow him in what?</p></Card>{rows.map((row, index) => <Card key={row[0]} className={index === 0 ? "border-teal-200 bg-teal-50" : index === 1 ? "border-amber-200 bg-amber-50" : "border-purple-200 bg-purple-50"}><div className="flex gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white font-black ring-1 ring-slate-200">{index + 1}</div><div><Label>{row[0]}</Label><p className="mt-3 leading-8 text-slate-700">{row[1]}</p></div></div></Card>)}<Card className="border-teal-200 bg-teal-50"><Label className="text-teal-800">Boundary hadith</Label><p className="mt-4 font-serif text-lg italic leading-8 text-slate-800">"Whoever introduces into this affair of ours something that is not from it will have it rejected."</p><p className="mt-3 text-xs font-bold text-slate-500">Sahih Muslim 1718</p><p className="mt-4 leading-8 text-slate-800">This speaks about practices, not labelling people. The Prophet's \uFDFA way is a boundary against inventing religious practices with no basis.</p></Card></div>;
}

function ClosingPage() {
  return <Card><Pill tone="gold">Closing reflection</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The two testimonies together.</h2><div className="mt-5 grid gap-4 text-[1.05rem] leading-9 text-slate-800"><p>Lesson 1 took the first testimony apart: what an ilah is, why negation precedes affirmation, and what ashhadu carries.</p><p>Lesson 2 took the second testimony apart: what rasul means, why a second testimony is necessary, why the Qur'an itself directs the believer to the Messenger \uFDFA, and what following him involves.</p><p>The Shahadah is the doorway. Everything else becomes worship because of what this doorway establishes.</p><p>The next lesson asks what walking through that doorway commits the believer to.</p></div></Card>;
}

function MCQuestion({ q, onSubmit }) {
  const options = useMemo(() => shuffle(q.options), [q]);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const chosen = selected === null ? null : options[selected];
  const correct = Boolean(chosen?.[1]);
  const right = options.find((option) => option[1]);
  return <div className="grid gap-5"><QuestionIntro q={q} />
    <div className="grid gap-3">{options.map((option, index) => {
      const active = selected === index;
      const showRight = submitted && option[1];
      const showWrong = submitted && active && !option[1];
      return <button key={option[0]} type="button" disabled={submitted} onClick={() => setSelected(index)} className={cx("rounded-3xl border p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200", showRight ? "border-emerald-300 bg-emerald-50" : showWrong ? "border-rose-300 bg-rose-50" : active ? "border-teal-500 bg-teal-50" : submitted ? "border-slate-200 bg-white opacity-40" : "border-slate-200 bg-white hover:bg-slate-50")}><p className="font-semibold leading-7 text-slate-800">{option[0]}</p></button>;
    })}</div>
    {!submitted && <Button disabled={selected === null} onClick={() => setSubmitted(true)}>Check answer</Button>}
    {submitted && <Card className={correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}><h3 className={cx("text-xl font-black", correct ? "text-emerald-900" : "text-rose-900")}>{correct ? "Correct" : "Review"}</h3><p className="mt-2 leading-7 text-slate-700">{chosen?.[2]}</p>{!correct && <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-emerald-900 ring-1 ring-emerald-200">Correct answer: {right?.[0]}</p>}<div className="mt-4"><Button onClick={() => onSubmit(correct ? 1 : 0)}>Save and continue</Button></div></Card>}
  </div>;
}

function SortQuestion({ q, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const complete = q.items.every((_, index) => answers[index] !== undefined);
  const score = q.items.reduce((sum, item, index) => sum + (answers[index] === item[1] ? 1 : 0), 0);
  const leftValue = q.leftValue ?? true;
  const rightValue = q.rightValue ?? false;
  return <div className="grid gap-5"><QuestionIntro q={q} />
    <div className="grid gap-3">{q.items.map((item, index) => {
      const correct = submitted && answers[index] === item[1];
      const wrong = submitted && answers[index] !== item[1];
      return <Card key={item[0]} className={cx(correct ? "border-emerald-300 bg-emerald-50" : "", wrong ? "border-rose-300 bg-rose-50" : "")}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-lg font-black text-slate-950">{item[0]}</p>{submitted && <div className="mt-2 grid gap-2 text-sm font-semibold leading-6 text-slate-700"><p><span className={correct ? "text-emerald-800" : "text-rose-800"}>{correct ? "Correct. " : "Review. "}</span>{item[2]}</p>{!correct && <p className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-emerald-900 ring-1 ring-emerald-200">Correct answer: {item[1] === leftValue ? q.left : q.right}</p>}</div>}</div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" disabled={submitted} onClick={() => setAnswers({ ...answers, [index]: leftValue })} className={cx("rounded-full px-4 py-2 text-sm font-black ring-1", answers[index] === leftValue ? "bg-teal-700 text-white ring-teal-700" : "bg-white text-teal-800 ring-teal-200")}>{q.left}</button><button type="button" disabled={submitted} onClick={() => setAnswers({ ...answers, [index]: rightValue })} className={cx("rounded-full px-4 py-2 text-sm font-black ring-1", answers[index] === rightValue ? "bg-slate-800 text-white ring-slate-800" : "bg-white text-slate-700 ring-slate-200")}>{q.right}</button></div></div></Card>;
    })}</div>
    {!submitted && <Button disabled={!complete} onClick={() => setSubmitted(true)}>Submit answers</Button>}
    {submitted && <Card><Pill tone={score >= Math.ceil(q.items.length * 0.75) ? "green" : "rose"}>Score {score}/{q.items.length}</Pill><div className="mt-4"><Button onClick={() => onSubmit(score)}>Save and continue</Button></div></Card>}
  </div>;
}

function QuestionIntro({ q }) {
  return <Card><Pill tone="purple">{q.title}</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">{q.kind === "mc" ? "Choose the best answer." : "Classify each card."}</h2><p className="mt-3 text-lg font-semibold leading-8 text-slate-800">{q.prompt}</p></Card>;
}

function ReviewPage({ scores, confidence, setConfidence, reset, onGoToNext }) {
  const score = scoreTotal(scores);
  const pct = Math.round((score / maxScore) * 100);
  const pass = score >= 8;
  const concepts = [["What rasul means", scores.q1 >= 1], ["What the second testimony does and does not imply", scores.q2 >= 3], ["Qur'an vs Sunnah", scores.q3 >= 5], ["Why rejecting the Sunnah while accepting the Qur'an is inconsistent", scores.q4 >= 1], ["The relationship between the two testimonies", scores.q5 >= 1]];
  return <div className="grid gap-5"><Card className="bg-gradient-to-br from-white to-amber-50"><Pill tone={pass ? "green" : "rose"}>{pass ? "Checkpoint passed" : "Review recommended"}</Pill><div className="mt-6 grid gap-6 md:grid-cols-[160px_1fr] md:items-center"><div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full" style={{ background: `conic-gradient(rgb(15 118 110) ${pct}%, rgb(226 232 240) 0)` }}><div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white"><p className="text-4xl font-black text-slate-950">{score}</p><p className="text-sm font-bold text-slate-500">/{maxScore}</p></div></div><div><h2 className="text-3xl font-black tracking-tight text-slate-950">You have completed Lesson 2.</h2><p className="mt-3 leading-8 text-slate-700">You can now explain why the Shahadah continues past illa Allah: the first testimony names who is worshipped, and the second names the Messenger \uFDFA through whom that worship is taught.</p></div></div></Card><Card><h3 className="text-xl font-black text-slate-950">Concepts mastered</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{concepts.map(([label, ok]) => <div key={label} className={cx("rounded-2xl p-4", ok ? "bg-emerald-50" : "bg-slate-50")}><p className={cx("font-bold", ok ? "text-emerald-800" : "text-slate-500")}>{ok ? "\u2713" : "\u25A1"} {label}</p></div>)}</div></Card><Card><h3 className="text-xl font-black text-slate-950">Confidence check</h3><p className="mt-2 text-sm leading-6 text-slate-600">How confident do you feel explaining why the second testimony matters?</p><div className="mt-5 flex flex-wrap gap-2">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setConfidence(value)} className={cx("flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ring-1 transition", confidence === value ? "bg-teal-700 text-white ring-teal-700" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50")}>{value}</button>)}</div></Card>
    <button type="button" onClick={onGoToNext} disabled={!onGoToNext} className={cx("rounded-3xl border bg-slate-950 p-6 text-left text-white transition", onGoToNext ? "cursor-pointer hover:bg-slate-900" : "opacity-70 cursor-default")}>
      <Pill tone="gold">Next</Pill>
      <h3 className="mt-4 text-2xl font-black">Module B1.3 - What the Shahadah Commits You To</h3>
      <p className="mt-3 leading-7 text-white/70">Now that both testimonies are clear, the next lesson asks what walking through that doorway commits the believer to.</p>
      {!onGoToNext && <p className="mt-2 text-xs font-bold text-amber-400">Coming soon</p>}
    </button>
    <Button variant="soft" onClick={reset}>Restart lesson</Button></div>;
}

function renderPage(type) {
  switch (type) {
    case "intro": return <IntroPage />;
    case "rasul": return <RasulPage />;
    case "why": return <WhyPage />;
    case "sunnah": return <SunnahPage />;
    case "quran": return <QuranPage />;
    case "following": return <FollowingPage />;
    case "closing": return <ClosingPage />;
    default: return null;
  }
}

export default function DeanyB1ShahadahLesson2({ onBack, onHome, onGoToNext }) {
  const saved = loadState();
  const [page, setPage] = useState(() => Number(saved.page) || 0);
  const [scores, setScores] = useState(() => saved.scores || {});
  const [confidence, setConfidence] = useState(() => Number(saved.confidence) || 3);
  const safePage = Math.min(Math.max(page, 0), pageData.length - 1);
  const current = pageData[safePage];
  const currentQuestionId = current.type === "question" ? current.id : null;
  const lockedOnQuestion = SHIP_READY && currentQuestionId && scores[currentQuestionId] === undefined;

  function setScoreAndContinue(id, value) {
    setScores((previous) => ({ ...previous, [id]: value }));
    setPage((p) => Math.min(p + 1, pageData.length - 1));
  }

  function canEnterPage(target) {
    if (!SHIP_READY || target <= safePage) return true;
    for (let i = 0; i < target; i += 1) {
      const item = pageData[i];
      if (item.type === "question" && scores[item.id] === undefined) return false;
    }
    return true;
  }

  function reset() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    setPage(0);
    setScores({});
    setConfidence(3);
  }

  useEffect(() => saveState({ page: safePage, scores, confidence }), [safePage, scores, confidence]);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }, [safePage]);

  return <main className="min-h-screen bg-[#FDFBF7] text-slate-950">
    <Header page={safePage} score={scoreTotal(scores)} onBack={onBack} />
    <section className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div key={safePage} className="animate-[fadeUp_0.25s_ease]">
        {current.type === "question" && questions[current.id].kind === "mc" && <MCQuestion q={questions[current.id]} onSubmit={(value) => setScoreAndContinue(current.id, value)} />}
        {current.type === "question" && questions[current.id].kind !== "mc" && <SortQuestion q={questions[current.id]} onSubmit={(value) => setScoreAndContinue(current.id, value)} />}
        {current.type === "review" && <ReviewPage scores={scores} confidence={confidence} setConfidence={setConfidence} reset={reset} onGoToNext={onGoToNext} />}
        {current.type !== "question" && current.type !== "review" && renderPage(current.type)}
      </div>
      <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <div className="flex gap-2"><Button variant="soft" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button><Button variant="soft" onClick={reset}>Reset</Button></div>
        <div className="hidden gap-1 md:flex">{pageData.map((_, index) => { const allowed = canEnterPage(index); return <button key={index} type="button" disabled={!allowed} onClick={() => allowed && setPage(index)} className={cx("h-2 rounded-full transition", index === safePage ? "w-7 bg-teal-700" : allowed ? "w-2 bg-slate-300" : "w-2 bg-slate-200 opacity-40")} aria-label={`Go to page ${index + 1}`} />; })}</div>
        <div className="grid justify-items-end gap-2">{lockedOnQuestion && <p className="text-xs font-bold text-amber-700">Answer this question to continue.</p>}<Button disabled={safePage === pageData.length - 1 || lockedOnQuestion || !canEnterPage(safePage + 1)} onClick={() => setPage((p) => Math.min(p + 1, pageData.length - 1))}>Continue</Button></div>
      </nav>
    </section>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`}</style>
  </main>;
}
