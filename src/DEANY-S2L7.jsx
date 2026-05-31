import React, { useEffect, useMemo, useState } from "react";

const colours = {
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
  cream: "#FDFBF7",
};

const lesson = {
  code: "S2.7",
  title: "Praying With Others",
  subtitle: "Joining late, following the imam, and leading prayer at home.",
  maxScore: 15,
};

const questions = {
  q1: {
    prompt: "It is Maghrib. You walk into the mosque and the imam is already in sujud. Your wudu is fresh. What do you do?",
    options: [
      ["Wait until the imam stands, then start.", false, "You do not wait for a special moment. Join the imam wherever he is."],
      ["Pray separately beside the congregation.", false, "A follower joins the imam's prayer, not a separate rhythm."],
      ["Make niyyah, say Allahu Akbar, and go straight into sujud with the imam.", true, "Correct. Join immediately where the imam is."],
      ["Skip it and pray later as qada.", false, "There is no need to skip when you can join the prayer now."],
    ],
  },
  q4: {
    prompt: "Hassan is leading his wife and son in Maghrib at home. He has finished al-Fatihah aloud in the second rak'ah. What should he do before ruku?",
    options: [
      ["Recite another short surah aloud, say the takbir, then bow.", true, "Correct. Maghrib's first two rak'at are aloud, and another surah after al-Fatihah is the recommended practice."],
      ["Go straight into ruku. There is no need for a second surah.", false, "Skipping it does not invalidate the prayer, but the recommended practice is to recite another surah."],
      ["Repeat al-Fatihah for clarity.", false, "Al-Fatihah is recited once per rak'ah."],
      ["Recite the third tashahhud silently before bowing.", false, "Tashahhud is said while sitting, not before bowing. There is no third tashahhud."],
    ],
  },
  q5: {
    prompt: "Yusuf joins Asr behind the imam in the third rak'ah. He completes the third and fourth rak'ah with the imam. After the imam's salam, what does he still need to pray?",
    options: [
      ["0 rak'at. His prayer is complete.", false, "He only prayed two rak'at with the imam. Asr is four."],
      ["2 rak'at, with al-Fatihah plus a short surah, silently.", true, "Correct. He completes the two he missed. Asr is silent."],
      ["2 rak'at aloud, with al-Fatihah plus a surah.", false, "Asr remains silent even when completing alone."],
      ["4 rak'at, restarting Asr.", false, "He does not restart. He completes what he missed."],
    ],
  },
  q6: {
    prompt: "Mariam joins her husband Idris for Maghrib at home. He is leading and reciting al-Fatihah aloud in the second rak'ah. She stands in a row behind him, says Allahu Akbar, and joins. Should she recite or listen?",
    options: [
      ["Recite al-Fatihah aloud with Idris.", false, "A follower should not recite aloud over the imam."],
      ["Recite al-Fatihah silently at the same time.", false, "In aloud rak'at, the follower listens."],
      ["Listen. Idris's recitation suffices for her.", true, "Correct. In the aloud rak'at of Maghrib, she listens."],
      ["Wait for him to finish, then recite after him.", false, "There is no make-up recitation here. Listening is the action."],
    ],
  },
};

const rukuCards = [
  ["🙇", "You join right as the imam goes into ruku, and you bow before he rises.", true, "Caught. You bowed with him before he rose."],
  ["🧎", "You join during sujud. The imam is already on the ground.", false, "Missed. The ruku has already passed."],
  ["🧍", "You join while the imam is standing and reciting al-Fatihah.", true, "Caught. You will bow with him when he bows."],
  ["↗️", "You join as the imam is rising from ruku, and you did not bow with him.", false, "Missed. The threshold is the bow itself."],
  ["🧎‍♂️", "You join during the final tashahhud sitting.", false, "Missed. Join and sit, then stand after salam to complete the prayer."],
];

const recitationCards = [
  ["🌗", "Asr behind an imam", false, "Asr is silent. Recite al-Fatihah silently."],
  ["🌅", "Fajr behind an imam", true, "Fajr is aloud. Listen to the imam."],
  ["🌆", "The third rak'ah of Maghrib behind an imam", false, "Maghrib's third rak'ah is silent. Recite silently."],
  ["🌃", "The first rak'ah of Isha behind an imam", true, "The first two rak'at of Isha are aloud. Listen."],
  ["☀️", "The second rak'ah of Dhuhr behind an imam", false, "Dhuhr is silent throughout. Recite silently."],
  ["🌃", "The last rak'ah of Isha behind an imam", false, "The last two rak'at of Isha are silent. Recite silently."],
];

const masbuqSteps = [
  ["🧍", "Enter", "Make niyyah and say Allahu Akbar", "You are now in the prayer with the imam."],
  ["🤲", "Follow", "Do exactly what the imam is doing", "If he is in sujud, you go to sujud. If he is sitting, you sit."],
  ["🙇", "Threshold", "A rak'ah counts only if you catch ruku", "Catching sujud does not count that rak'ah, but you still join."],
  ["👂", "During recitation", "Listen in aloud rak'at, recite silently in silent rak'at", "The rule follows the prayer's loud/silent structure."],
  ["👋", "After salam", "Stand and complete what you missed", "You continue calmly, without restarting."],
];

const homeRows = [
  ["One man following a male imam", "Stand to the imam's right."],
  ["Two or more male followers", "Stand in a row behind the imam."],
  ["A woman following a male imam", "Stand behind him, not beside him."],
  ["Family prayer at home", "The imam leads clearly and gently. Followers follow."],
];

const STORAGE_KEY = "deany_module_s2_lesson7_preview_v2";
const scoreKeys = ["q1", "ruku", "recitation", "q4", "q5", "q6"];

function safeLoad() {
  if (typeof window === "undefined") return { page: 0, scores: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { page: 0, scores: {} };
  } catch {
    return { page: 0, scores: {} };
  }
}

function safeSave(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The lesson still works if storage is blocked.
  }
}

function total(scores) {
  return scoreKeys.reduce((sum, key) => sum + (Number(scores[key]) || 0), 0);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Pill({ children, tone = "slate" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700",
    gold: "bg-amber-100 text-amber-800",
    teal: "bg-teal-100 text-teal-800",
    green: "bg-emerald-100 text-emerald-800",
    coral: "bg-rose-100 text-rose-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${map[tone]}`}>{children}</span>;
}

function Button({ children, onClick, disabled, variant = "primary" }) {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    soft: "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
    gold: "bg-amber-500 text-slate-950 hover:bg-amber-600",
  };
  return <button disabled={disabled} onClick={onClick} className={`rounded-2xl px-5 py-3 text-sm font-black transition disabled:opacity-40 ${variants[variant]}`}>{children}</button>;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function Header({ page, total, score, onBack }) {
  const pct = ((page + 1) / total) * 100;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-700 transition-all" style={{ width: `${pct}%` }} /></div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">{onBack && <button onClick={onBack} className="text-lg text-slate-950 hover:text-slate-600 transition" aria-label="Back">←</button>}<div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">{lesson.code} · Final Salah Lesson</p>
            <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{lesson.title}</h1>
          </div></div>
          <div className="flex flex-wrap gap-2"><Pill tone="teal">Score {score}/{lesson.maxScore}</Pill><Pill>Page {page + 1}/{total}</Pill></div>
        </div>
      </div>
    </header>
  );
}

function Hero({ next }) {
  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
        <div className="grid gap-6 p-2 md:grid-cols-[1.05fr_.95fr] md:items-center">
          <div>
            <Pill tone="gold">Lesson S2.7</Pill>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Praying alone is one skill. Praying with others is another.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">This lesson teaches the follower route, the imam route, and the latecomer route, without panic.</p>
            <div className="mt-6 flex flex-wrap gap-2"><Pill tone="teal">Follower</Pill><Pill tone="purple">Imam</Pill><Pill tone="green">Latecomer</Pill></div>
          </div>
          <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-200">Hadith anchor</p>
            <p className="mt-3 text-2xl font-black leading-9">The imam is appointed to be followed.</p>
            <p className="mt-4 text-sm text-white/60">Sahih al-Bukhari 722 / Sahih Muslim 414a</p>
          </div>
        </div>
      </Card>
      <Card className="border-amber-200 bg-amber-50">
        <Pill tone="gold">Goal of this lesson</Pill>
        <h3 className="mt-3 text-2xl font-black text-slate-950">By the end, you should know how to:</h3>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-3xl">🚪</p><h3 className="mt-3 font-black">Join correctly</h3><p className="mt-2 text-sm leading-6 text-slate-600">Join the imam wherever he is.</p></Card>
        <Card><p className="text-3xl">🙇</p><h3 className="mt-3 font-black">Know the ruku threshold</h3><p className="mt-2 text-sm leading-6 text-slate-600">A rak'ah counts if you catch ruku.</p></Card>
        <Card><p className="text-3xl">🕌</p><h3 className="mt-3 font-black">Lead at home</h3><p className="mt-2 text-sm leading-6 text-slate-600">Lead gently, clearly, and with the right formation.</p></Card>
      </div>
      <Button onClick={next}>Begin</Button>
    </div>
  );
}

function TrackIntro({ next }) {
  return (
    <div className="grid gap-5">
      <Card><Pill tone="teal">Two tracks</Pill><h2 className="mt-4 text-3xl font-black">This lesson has two lenses.</h2><p className="mt-3 leading-8 text-slate-700">First, you learn how to follow. Then, you learn what changes when you lead.</p></Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-teal-200 bg-teal-50"><p className="text-4xl">🤲</p><h3 className="mt-3 text-2xl font-black text-teal-950">Track A · Follower</h3><p className="mt-2 leading-7 text-slate-700">Join, follow, listen, complete missed rak'at.</p></Card>
        <Card className="border-purple-200 bg-purple-50"><p className="text-4xl">🕌</p><h3 className="mt-3 text-2xl font-black text-purple-950">Track B · Imam</h3><p className="mt-2 leading-7 text-slate-700">Lead aloud where needed, stand correctly, keep it easy.</p></Card>
      </div>
      <Button onClick={next}>Start Track A</Button>
    </div>
  );
}

function JoinLateMap({ next }) {
  const [active, setActive] = useState(0);
  const step = masbuqSteps[active];
  return (
    <div className="grid gap-5">
      <Card><Pill tone="teal">Track A</Pill><h2 className="mt-4 text-3xl font-black">The latecomer timeline.</h2><p className="mt-3 leading-8 text-slate-700">A masbūq is someone who joins after the imam has already started.</p></Card>
      <Card className="bg-gradient-to-br from-white to-teal-50">
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="text-center"><div className="text-7xl">{step[0]}</div><h3 className="mt-4 text-3xl font-black">{step[1]}</h3><p className="mt-2 text-lg font-bold text-teal-800">{step[2]}</p></div>
          <div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">What this means</p><p className="mt-3 text-lg font-semibold leading-8 text-slate-700">{step[3]}</p></div>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-2">{masbuqSteps.map((s, i) => <button key={s[1]} onClick={() => setActive(i)} className={`rounded-2xl p-3 text-center transition ${active === i ? "bg-teal-700 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}><div className="text-xl">{s[0]}</div><div className="mt-1 text-xs font-black">{i + 1}</div></button>)}</div>
      </Card>
      <Button onClick={next}>Practise joining late</Button>
    </div>
  );
}

function MC({ data, tag, next, onScore }) {
  const options = useMemo(() => shuffle(data.options), [data]);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const chosen = selected === null ? null : options[selected];
  const correct = Boolean(chosen?.[1]);
  const correctOption = options.find((o) => o[1]);
  function submit() {
    setSubmitted(true);
    onScore(correct ? 1 : 0);
  }
  function done() { next(); }
  return (
    <div className="grid gap-5">
      <Card><Pill tone="gold">{tag}</Pill><h2 className="mt-4 text-3xl font-black">Choose the best answer.</h2><p className="mt-3 text-lg font-semibold leading-8 text-slate-800">{data.prompt}</p></Card>
      <div className="grid gap-3">{options.map((o, i) => {
        const active = selected === i;
        const showCorrect = submitted && o[1];
        const showWrong = submitted && active && !o[1];
        return <button key={o[0]} disabled={submitted} onClick={() => setSelected(i)} className={`rounded-3xl border p-5 text-left transition ${showCorrect ? "border-emerald-300 bg-emerald-50" : showWrong ? "border-rose-300 bg-rose-50" : active ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}><p className="font-bold leading-7 text-slate-800">{o[0]}</p></button>;
      })}</div>
      {!submitted && <Button disabled={selected === null} onClick={submit}>Check answer</Button>}
      {submitted && <Card className={correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}><h3 className={`text-xl font-black ${correct ? "text-emerald-900" : "text-rose-900"}`}>{correct ? "Correct" : "Review"}</h3><p className="mt-2 leading-7 text-slate-700">{chosen?.[2]}</p>{!correct && <p className="mt-3 font-bold text-emerald-900">Correct answer: {correctOption?.[0]}</p>}<div className="mt-4"><Button onClick={done}>Continue</Button></div></Card>}
    </div>
  );
}

function Binary({ title, items, yes, no, next, onScore, accent = "teal" }) {
  const orderedItems = useMemo(() => shuffle(items), [items]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const done = orderedItems.every((_, i) => typeof answers[i] === "boolean");
  const score = orderedItems.reduce((s, item, i) => s + (answers[i] === item[2] ? 1 : 0), 0);
  function submit() {
    setSubmitted(true);
    onScore(score);
  }
  function finish() { next(); }
  return (
    <div className="grid gap-5">
      <Card><Pill tone={accent}>{title.includes("Ruku") ? "Ruku threshold" : "Listen or recite"}</Pill><h2 className="mt-4 text-3xl font-black">{title}</h2><p className="mt-3 leading-8 text-slate-700">Answer each scenario. The review appears after submission.</p></Card>
      <div className="grid gap-3">{orderedItems.map((item, i) => {
        const answered = typeof answers[i] === "boolean";
        const correct = submitted && answers[i] === item[2];
        const wrong = submitted && answered && !correct;
        return <Card key={item[1]} className={submitted ? correct ? "border-emerald-300 bg-emerald-50" : wrong ? "border-rose-300 bg-rose-50" : "" : answered ? "border-teal-300" : ""}>
          <div className="grid gap-3 sm:grid-cols-[44px_1fr]"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{item[0]}</div><div><p className="font-semibold leading-7 text-slate-800">{item[1]}</p><div className="mt-3 flex flex-wrap gap-2"><button disabled={submitted} onClick={() => setAnswers({ ...answers, [i]: true })} className={`rounded-full px-4 py-2 text-sm font-black ring-1 ${answers[i] === true ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-emerald-700 ring-emerald-200"}`}>{yes}</button><button disabled={submitted} onClick={() => setAnswers({ ...answers, [i]: false })} className={`rounded-full px-4 py-2 text-sm font-black ring-1 ${answers[i] === false ? "bg-rose-600 text-white ring-rose-600" : "bg-white text-rose-700 ring-rose-200"}`}>{no}</button></div>{submitted && <p className="mt-3 text-sm font-semibold leading-6 text-slate-700"><span className={correct ? "text-emerald-800" : "text-rose-800"}>{correct ? "Correct. " : "Review. "}</span>{item[3]}</p>}</div></div>
        </Card>;
      })}</div>
      {!submitted && <Button disabled={!done} onClick={submit}>Submit</Button>}
      {submitted && <Card><Pill tone={score >= Math.ceil(orderedItems.length * 0.7) ? "green" : "coral"}>Score {score}/{orderedItems.length}</Pill><div className="mt-4"><Button onClick={finish}>Continue</Button></div></Card>}
    </div>
  );
}

function RukuVisual({ next }) {
  return (
    <div className="grid gap-5">
      <Card><Pill tone="gold">The rule</Pill><h2 className="mt-4 text-3xl font-black">The rak'ah-count threshold is ruku.</h2><p className="mt-3 leading-8 text-slate-700">The visual rule is simple: if you catch the bow with the imam, that rak'ah counts. If you arrive after the bow has passed, join anyway, but complete that rak'ah after salam.</p></Card>
      <Card>
        <div className="grid gap-3 md:grid-cols-5">{[["Standing", "Counts if you reach ruku", "🧍", "green"], ["Ruku", "Threshold point", "🙇", "green"], ["Rising", "Too late for that rak'ah", "↗️", "coral"], ["Sujud", "Join, but rak'ah missed", "🧎", "coral"], ["Sitting", "Join, then complete", "🧎‍♂️", "coral"]].map((x) => <div key={x[0]} className={`rounded-3xl p-4 text-center ${x[3] === "green" ? "bg-emerald-50" : "bg-rose-50"}`}><div className="text-4xl">{x[2]}</div><h3 className="mt-3 font-black">{x[0]}</h3><p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{x[1]}</p></div>)}</div>
      </Card>
      <Button onClick={next}>Test the threshold</Button>
    </div>
  );
}

function Contract({ next }) {
  return (
    <div className="grid gap-5">
      <Card><Pill tone="purple">Track B</Pill><h2 className="mt-4 text-3xl font-black">The imam-follower contract.</h2><p className="mt-3 leading-8 text-slate-700">The imam leads so the prayer can stay unified. The follower follows, not competes.</p></Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-purple-200 bg-purple-50"><p className="text-4xl">🕌</p><h3 className="mt-3 text-xl font-black text-purple-950">Imam</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">Moves clearly, recites aloud where the prayer is aloud, and keeps the prayer gentle and easy to follow.</p></Card>
        <Card className="border-slate-800 bg-slate-950 text-white shadow-lg ring-2 ring-amber-300">
          <p className="text-4xl">🔗</p>
          <h3 className="mt-3 text-xl font-black text-white">Contract</h3>
          <div className="mt-4 rounded-2xl bg-amber-200 p-4 text-slate-950">
            <p className="text-base font-black leading-7">The imam moves first. The follower moves after him.</p>
          </div>
          <p className="mt-4 text-sm font-semibold leading-7 text-white">Do not race the imam, do not create your own rhythm, and do not recite aloud over him. The whole point is unity: one imam, one prayer, one shared movement.</p>
          <p className="mt-4 rounded-2xl bg-white p-3 text-xs font-black leading-5 text-slate-950">Hadith anchor: the imam is appointed to be followed. Sahih al-Bukhari 722 / Sahih Muslim 414a.</p>
        </Card>
        <Card className="border-teal-200 bg-teal-50"><p className="text-4xl">🤲</p><h3 className="mt-3 text-xl font-black text-teal-950">Follower</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">Waits for the imam's movement, listens when the imam recites aloud, and follows the imam's prayer.</p></Card>
      </div>
      <Button onClick={next}>Learn home formations</Button>
    </div>
  );
}

function MaghribLateExample({ next }) {
  return (
    <div className="grid gap-5">
      <Card>
        <Pill tone="gold">Trickier latecomer example</Pill>
        <h2 className="mt-4 text-3xl font-black">Arriving in the third rak'ah of Maghrib.</h2>
        <p className="mt-3 leading-8 text-slate-700">Maghrib is the prayer where latecomers often get confused because of the tashahhuds. Here is the clean route.</p>
      </Card>

      <Card className="bg-gradient-to-br from-white to-amber-50">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 ring-1 ring-amber-200">
            <p className="text-4xl">🚪</p>
            <h3 className="mt-3 text-xl font-black">1. Join the imam</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">You arrive while the imam is in Maghrib's third rak'ah. Say Allahu Akbar and join him wherever he is.</p>
          </div>
          <div className="rounded-3xl bg-white p-5 ring-1 ring-teal-200">
            <p className="text-4xl">🧎‍♂️</p>
            <h3 className="mt-3 text-xl font-black">2. Sit for his final tashahhud</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">When the imam sits for the final tashahhud, you sit with him. After his salam, you stand up because you still owe two rak'at.</p>
          </div>
          <div className="rounded-3xl bg-white p-5 ring-1 ring-purple-200">
            <p className="text-4xl">🧍</p>
            <h3 className="mt-3 text-xl font-black">3. Complete two rak'at</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">Pray the two missed rak'at. After the first of those, sit for tashahhud. Then stand for the final rak'ah, sit again for the final tashahhud, then salam.</p>
          </div>
        </div>
      </Card>

      <Card className="border-teal-200 bg-teal-50">
        <h3 className="text-xl font-black text-teal-950">Timeline</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-teal-100"><p className="text-2xl">3</p><p className="mt-1 text-xs font-black text-slate-700">Catch imam's 3rd</p></div>
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-teal-100"><p className="text-2xl">🧎‍♂️</p><p className="mt-1 text-xs font-black text-slate-700">Sit with imam</p></div>
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-teal-100"><p className="text-2xl">1</p><p className="mt-1 text-xs font-black text-slate-700">Make up 1st missed rak'ah</p></div>
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-teal-100"><p className="text-2xl">🧎‍♂️</p><p className="mt-1 text-xs font-black text-slate-700">Tashahhud</p></div>
          <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-teal-100"><p className="text-2xl">2</p><p className="mt-1 text-xs font-black text-slate-700">Make up final rak'ah, final tashahhud, salam</p></div>
        </div>
      </Card>

      <Button onClick={next}>Continue</Button>
    </div>
  );
}

function HomeFormation({ next }) {
  return (
    <div className="grid gap-5">
      <Card><Pill tone="purple">Leading at home</Pill><h2 className="mt-4 text-3xl font-black">Where does everyone stand?</h2><p className="mt-3 leading-8 text-slate-700">Keep it simple and correct. The key fix: a woman following a male imam stands behind him, not to his right.</p></Card>
      <div className="grid gap-3">{homeRows.map((row) => <Card key={row[0]}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="font-black text-slate-950">{row[0]}</p><p className="rounded-2xl bg-purple-50 px-4 py-3 text-sm font-bold text-purple-900">{row[1]}</p></div></Card>)}</div>
      <Button onClick={next}>Apply it</Button>
    </div>
  );
}

function ModuleComplete({ score, onBack }) {
  const pct = Math.round((score / lesson.maxScore) * 100);
  const lessons = ["Appointments With Allah", "Wudu", "The Rak'ah", "The Words That Rise", "When Things Go Wrong", "Your First Real Salah", "Praying With Others"];
  return (
    <div className="grid gap-5">
      <Card className="bg-gradient-to-br from-amber-50 to-white">
        <Pill tone="gold">Beginner Salah Module</Pill>
        <h2 className="mt-5 text-4xl font-black tracking-tight">Complete.</h2>
        <p className="mt-3 text-lg leading-8 text-slate-700">You finished the final lesson. You can now pray alone, join a congregation, join late, and lead at home with the basic foundations.</p>
        <div className="mt-6 grid gap-2">{lessons.map((l) => <p key={l} className="font-black text-emerald-700">✓ {l}</p>)}</div>
        <blockquote className="mt-6 rounded-3xl bg-white p-5 text-lg font-black text-slate-950 ring-1 ring-amber-200">"Pray as you have seen me praying."<p className="mt-2 text-sm font-semibold text-slate-500">Sahih al-Bukhari 631</p></blockquote>
      </Card>
      <Card><h3 className="text-2xl font-black">Final score: {score}/{lesson.maxScore} · {pct}%</h3><p className="mt-2 leading-7 text-slate-700">This preview is set up for canvas. The download can stay as a backup, but this is now the default format.</p></Card>
      <div className="grid gap-3 md:grid-cols-3"><Card><Pill tone="gold">Available</Pill><h3 className="mt-3 font-black">Memorise al-Fatihah</h3><p className="mt-2 text-sm text-slate-600">Move into the Quran module.</p></Card><Card><Pill tone="purple">Soon</Pill><h3 className="mt-3 font-black">Intermediate Salah</h3><p className="mt-2 text-sm text-slate-600">Jumu'ah, Witr, voluntary prayers.</p></Card><Card><Pill tone="teal">Soon</Pill><h3 className="mt-3 font-black">Prayer streak</h3><p className="mt-2 text-sm text-slate-600">Track your five prayers.</p></Card></div>
      {onBack && <Card><div className="flex justify-center"><Button onClick={onBack}>Back to lessons</Button></div></Card>}
    </div>
  );
}

export default function DEANYS2L7({ onBack, onHome }) {
  const saved = safeLoad();
  const [page, setPage] = useState(() => Number(saved.page) || 0);
  const [scores, setScores] = useState(() => saved.scores || {});
  const totalScore = total(scores);

  useEffect(() => {
    safeSave({ page, scores });
  }, [page, scores]);

  function setQuestionScore(key, value) {
    setScores((previous) => ({ ...previous, [key]: value }));
  }

  function resetLesson() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    setPage(0);
    setScores({});
  }

  const pages = [
    <Hero next={() => setPage(1)} />,
    <TrackIntro next={() => setPage(2)} />,
    <JoinLateMap next={() => setPage(3)} />,
    <MC data={questions.q1} tag="Question 1" next={() => setPage(4)} onScore={(value) => setQuestionScore("q1", value)} />,
    <MaghribLateExample next={() => setPage(5)} />,
    <RukuVisual next={() => setPage(6)} />,
    <Binary title="Did you catch the rak'ah?" items={rukuCards} yes="Caught" no="Missed" next={() => setPage(7)} onScore={(value) => setQuestionScore("ruku", value)} />,
    <Binary title="Listen or recite silently?" items={recitationCards} yes="Listen" no="Recite silently" next={() => setPage(8)} onScore={(value) => setQuestionScore("recitation", value)} accent="purple" />,
    <Contract next={() => setPage(9)} />,
    <MC data={questions.q4} tag="Question 4" next={() => setPage(10)} onScore={(value) => setQuestionScore("q4", value)} />,
    <MC data={questions.q5} tag="Question 5" next={() => setPage(11)} onScore={(value) => setQuestionScore("q5", value)} />,
    <HomeFormation next={() => setPage(12)} />,
    <MC data={questions.q6} tag="Question 6" next={() => setPage(13)} onScore={(value) => setQuestionScore("q6", value)} />,
    <ModuleComplete score={totalScore} onBack={onBack} />,
  ];

  const safePage = Math.min(Math.max(page, 0), pages.length - 1);

  function pageComplete(index) {
    const requiredScore = { 3: "q1", 6: "ruku", 7: "recitation", 9: "q4", 10: "q5", 12: "q6" }[index];
    if (!requiredScore) return true;
    return Object.prototype.hasOwnProperty.call(scores, requiredScore);
  }

  function canGoToPage(targetPage) {
    if (targetPage <= safePage) return true;
    for (let index = 0; index < targetPage; index += 1) {
      if (!pageComplete(index)) return false;
    }
    return true;
  }

  const canAdvance = safePage < pages.length - 1 && pageComplete(safePage) && canGoToPage(safePage + 1);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-slate-950">
      <Header page={safePage} total={pages.length} score={totalScore} onBack={onBack} />
      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div key={safePage} className="animate-[fadeUp_0.25s_ease]">
          {pages[safePage]}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <div className="flex gap-2">
            <Button variant="soft" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</Button>
            <Button variant="soft" onClick={resetLesson}>Reset</Button>
          </div>
          <div className="hidden gap-1 md:flex">{pages.map((_, i) => {
            const allowed = canGoToPage(i);
            return <button key={i} disabled={!allowed} onClick={() => allowed && setPage(i)} className={`h-2 rounded-full transition disabled:cursor-not-allowed ${i === safePage ? "w-7 bg-teal-700" : allowed ? "w-2 bg-slate-300" : "w-2 bg-slate-200 opacity-30"}`} aria-label={`Go to page ${i + 1}`} />;
          })}</div>
          <div className="grid justify-items-end gap-2">
            {!canAdvance && safePage !== pages.length - 1 && <p className="text-xs font-bold text-amber-800">Complete this activity before continuing.</p>}
            <Button disabled={safePage === pages.length - 1 || !canAdvance} onClick={() => setPage((current) => Math.min(current + 1, pages.length - 1))}>Continue</Button>
          </div>
        </div>
      </section>
      <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @media(prefers-reduced-motion:reduce){*{animation:none!important}}"}</style>
    </main>
  );
}
