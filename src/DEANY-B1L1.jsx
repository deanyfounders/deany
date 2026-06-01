import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "deany_b1_shahadah_lesson1_ship_ready_v1";
const SHIP_READY = true;
const scoreKeys = ["q1", "q2", "q3", "q4", "q5"];
const MAX_SCORE = 9;

const lesson = {
  code: "B1.1",
  title: "The Shahadah",
  subtitle: "Lesson 1 of the DEANY curriculum",
};

const shortShahadah = {
  ar: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
  tr: "Ashhadu an la ilaha illa Allah, wa ashhadu anna Muhammadan rasulullah.",
  en: "I testify that there is no God except Allah, and I testify that Muhammad is the Messenger of Allah.",
};

const longShahadah = {
  line1: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
  line2: "وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
  tr: "Ashhadu an la ilaha illa Allah, wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluh.",
  en: "I testify that there is no God except Allah, alone, with no partner. And I testify that Muhammad is His servant and His Messenger.",
};

const q1 = {
  prompt: "How many distinct testimonies does the Shahadah contain?",
  options: [
    { text: "One unified testimony, divided into two phrases for emphasis.", correct: false, feedback: "The repetition of ashhadu is not for emphasis. The two ashhadus mark two separate declarations, each with its own object. Together they form the Shahadah." },
    { text: "Two separate testimonies: one about Allah and one about the Prophet \uFDFA.", correct: true, feedback: "Correct. Ashhadu appears twice. The first testimony is about Allah: what He is and what He is not. The second is about Muhammad \uFDFA and his role as Allah's Messenger. The word wa joins them." },
    { text: "Three: one about Allah, one about the Prophet \uFDFA, and one about Islam itself.", correct: false, feedback: "The Shahadah contains two testimonies, not three. There is no separate testimony about Islam. Islam is what one enters by making these two testimonies." },
    { text: "The number varies depending on the version recited.", correct: false, feedback: "The core structure is two testimonies. Longer wordings can add detail, but they do not change the two-testimony structure." },
  ],
};

const q2 = {
  prompt: "Below are four phrases. Three express a feeling, hope, or preference. One is a formal declaration of fact. Which is the Shahadah closest to in structure?",
  options: [
    { text: "I think this might be true.", correct: false, feedback: "This phrase expresses an internal state: a thought. The Shahadah uses testimony form: ashhadu, I bear witness. It declares fact, not a private feeling." },
    { text: "I really hope this is true.", correct: false, feedback: "This phrase expresses hope. The Shahadah is structured differently. It is not hope language. It is testimony language." },
    { text: "I testify that this is true.", correct: true, feedback: "Correct. The Shahadah uses the same grammatical form as testimony. It is not a hope, feeling, or wish. It is a declaration that something is true." },
    { text: "I want to believe this is true.", correct: false, feedback: "This phrase describes a wish inside the speaker. The Shahadah describes what is true outside the speaker. It is a formal act of bearing witness." },
  ],
};

const q3Items = [
  { text: "Allah", applies: false, feedback: "The Shahadah excepts Allah from the negation. The word illa, except, does this work. He is the only true ilah, the only object of worship the Shahadah affirms." },
  { text: "The wealth one accumulates", applies: true, feedback: "Wealth can become an ilah when its accumulation shapes choices more than the pursuit of Allah's approval does. The Shahadah denies wealth that place." },
  { text: "Social status or reputation", applies: true, feedback: "Status can become an ilah. When the desire for it begins to shape decisions and self-understanding, it has moved into the place worship belongs in." },
  { text: "The Prophet Muhammad \uFDFA", applies: false, feedback: "The Prophet \uFDFA is not a God. He is Allah's Messenger. The second testimony is structurally careful: it uses rasul, Messenger, never ilah, God. It testifies to his messengership, not his divinity." },
  { text: "One's own desires and ego", applies: true, feedback: "The Qur'an warns about taking desire as a God in 45:23. Ego can become an ilah when self-interest occupies the place that worship belongs in. The Shahadah's negation applies." },
];

const q4 = {
  prompt: "Amina declared the Shahadah at a young age and sincerely believes it. Recently, she has struggled to pray consistently due to depression and has missed several weeks of prayers. A friend tells her she should re-declare the Shahadah to be sure she is still Muslim. Which response is safest and most accurate?",
  options: [
    { text: "The friend is correct. Missed prayers automatically erase the Shahadah, so she must re-declare it.", correct: false, feedback: "This is not a safe or careful conclusion. Missing prayer is extremely serious, but a friend should not declare that Amina's Islam has disappeared from this alone." },
    { text: "The friend is correct because weak practice means faith has dissolved.", correct: false, feedback: "This conflates two separate things. Faith can weaken through neglect, but weak practice is not treated by a friend as proof that the Shahadah has vanished." },
    { text: "The friend is incorrect. Amina should be helped back to prayer with repentance and support, not told that her Shahadah has disappeared from this struggle.", correct: true, feedback: "Correct. The Shahadah is not re-declared every time a Muslim falls short. Prayer remains a serious obligation, and Amina should be supported back to it. This is not a licence to minimise missed prayer, but it avoids careless judgement about her Islam." },
    { text: "The friend is incorrect only because Amina has a valid excuse. Without that, the friend would be correct.", correct: false, feedback: "The conclusion is right, but the reasoning is wrong. Her struggle matters for responsibility and support, but it is not a licence for a friend to declare her outside Islam." },
  ],
};

const q5 = {
  prompt: "You have learned that the Shahadah contains two testimonies, uses the testimony form of ashhadu, and negates before it affirms. Which answer best captures what makes it distinct as a declaration of faith?",
  options: [
    { text: "Its length, because it is fewer than 15 Arabic words.", correct: false, feedback: "Length is not what makes the Shahadah distinct. What matters is what the Shahadah does in those words: formal testimony, then negation before affirmation." },
    { text: "Its form, because it is a testimony, not a feeling, and it clears the field of false objects of worship before affirming the true one.", correct: true, feedback: "Correct. The Shahadah's distinctness is structural. Ashhadu makes it a formal declaration, and the order clears the field before placing the truth." },
    { text: "Its emotional effect, because it makes a person feel connected to Muslims around the world.", correct: false, feedback: "The Shahadah can create a powerful sense of belonging, but that is not what makes it structurally distinct. The question is asking about how the declaration itself works: testimony, then negation before affirmation." },
    { text: "Its recitation frequency, because Muslims say it more often than other religious creeds.", correct: false, feedback: "Frequency describes how Muslims relate to the Shahadah. It is not the structural feature of the Shahadah itself. The structural answer is form and order." },
  ],
};

const faithComponents = [
  { ar: "تَصْدِيق", term: "Tasdiq", title: "Belief in the heart", body: "You hold the testimony to be true internally. Not as a maybe, not as a hope, but as a conviction." },
  { ar: "إِقْرَار", term: "Iqrar", title: "Declaration with the tongue", body: "You speak the testimony aloud. The words leave the heart and enter the world." },
  { ar: "عَمَل", term: "Amal", title: "Action with the limbs", body: "You live in accordance with what you have declared. The testimony shapes how you behave." },
];

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
  } catch {}
}

function total(scores) {
  return scoreKeys.reduce((sum, key) => sum + (Number(scores[key]) || 0), 0);
}

function shuffle(arr) {
  return [...arr].map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Pill({ children, tone = "slate" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700",
    gold: "bg-amber-100 text-amber-800",
    teal: "bg-teal-100 text-teal-800",
    purple: "bg-purple-100 text-purple-800",
    green: "bg-emerald-100 text-emerald-800",
    coral: "bg-rose-100 text-rose-800",
  };
  return <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-black", map[tone])}>{children}</span>;
}

function Button({ children, onClick, disabled, variant = "primary" }) {
  const map = {
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    gold: "bg-amber-500 text-slate-950 hover:bg-amber-600",
    soft: "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
  };
  return <button type="button" disabled={disabled} onClick={onClick} className={cx("rounded-2xl px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-45", map[variant])}>{children}</button>;
}

function Card({ children, className = "" }) {
  return <section className={cx("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm", className)}>{children}</section>;
}

function Arabic({ children, size = "text-3xl", className = "" }) {
  return <div dir="rtl" lang="ar" className={cx("font-serif leading-loose tracking-wide text-slate-950", size, className)}>{children}</div>;
}

function Header({ page, totalPages, score, onBack }) {
  const pct = Math.round(((page + 1) / totalPages) * 100);
  return <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div className="mx-auto max-w-5xl px-4 py-3">
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-700 transition-all" style={{ width: `${pct}%` }} /></div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && <button type="button" onClick={onBack} className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition" aria-label="Back to lessons">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </button>}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">{lesson.code} - Beginner tier</p>
            <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{lesson.title}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2"><Pill tone="teal">Score {score}/{MAX_SCORE}</Pill><Pill>Page {page + 1}/{totalPages}</Pill></div>
      </div>
    </div>
  </header>;
}

function ShahadahCard({ compact = false }) {
  return <Card className="border-amber-300 bg-[#FBF6EC]">
    <Arabic size={compact ? "text-2xl" : "text-[2rem] sm:text-4xl"} className="text-center">
      <span className="rounded-lg bg-amber-200/60 px-2 text-amber-900">أَشْهَدُ</span>{" أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَ"}<span className="rounded-lg bg-amber-200/60 px-2 text-amber-900">أَشْهَدُ</span>{" أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ"}
    </Arabic>
    {!compact && <><p className="mt-4 text-center font-serif text-lg italic leading-8 text-slate-600">{shortShahadah.tr}</p><p className="mt-3 text-center text-base font-semibold leading-7 text-slate-800">Translation: "{shortShahadah.en}"</p></>}
  </Card>;
}

function MCPage({ data, tag, onScore, next }) {
  const options = useMemo(() => shuffle(data.options), [data]);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const chosen = selected === null ? null : options[selected];
  const correct = Boolean(chosen?.correct);
  const correctOption = options.find((option) => option.correct);

  function finish() {
    onScore(correct ? 1 : 0);
    next();
  }

  return <div className="grid gap-5">
    <Card>
      <Pill tone="purple">{tag}</Pill>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Choose the best answer.</h2>
      <p className="mt-3 text-lg font-semibold leading-8 text-slate-800">{data.prompt}</p>
    </Card>
    <div className="grid gap-3">{options.map((option, index) => {
      const active = selected === index;
      const showCorrect = submitted && option.correct;
      const showWrong = submitted && active && !option.correct;
      return <button key={option.text} type="button" disabled={submitted} onClick={() => setSelected(index)} className={cx("rounded-3xl border p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-200", showCorrect ? "border-emerald-300 bg-emerald-50" : showWrong ? "border-rose-300 bg-rose-50" : active ? "border-teal-500 bg-teal-50" : submitted ? "border-slate-200 bg-white opacity-40" : "border-slate-200 bg-white hover:bg-slate-50")}>
        <p className="font-semibold leading-7 text-slate-800">{option.text}</p>
      </button>;
    })}</div>
    {!submitted && <Button disabled={selected === null} onClick={() => setSubmitted(true)}>Check answer</Button>}
    {submitted && <Card className={correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}>
      <h3 className={cx("text-xl font-black", correct ? "text-emerald-900" : "text-rose-900")}>{correct ? "Correct" : "Review"}</h3>
      <p className="mt-2 leading-7 text-slate-700">{chosen?.feedback}</p>
      {!correct && <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-emerald-900 ring-1 ring-emerald-200">Correct answer: {correctOption?.text}</p>}
      <div className="mt-4"><Button onClick={finish}>Continue</Button></div>
    </Card>}
  </div>;
}

function ClassifierPage({ onScore, next }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const allAnswered = q3Items.every((_, index) => typeof answers[index] === "boolean");
  const score = q3Items.reduce((sum, item, index) => sum + (answers[index] === item.applies ? 1 : 0), 0);

  function finish() {
    onScore(score);
    next();
  }

  return <div className="grid gap-5">
    <Card>
      <Pill tone="purple">Question 3</Pill>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">What does la ilaha negate?</h2>
      <p className="mt-3 leading-8 text-slate-700">For each card, decide whether the Shahadah's negation applies, meaning whether it denies that this thing is worthy of worship.</p>
    </Card>
    <div className="grid gap-3">{q3Items.map((item, index) => {
      const answered = typeof answers[index] === "boolean";
      const correct = submitted && answers[index] === item.applies;
      const wrong = submitted && answered && !correct;
      return <Card key={item.text} className={cx(submitted && correct ? "border-emerald-300 bg-emerald-50" : "", wrong ? "border-rose-300 bg-rose-50" : "")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-slate-950">{item.text}</p>
            {submitted && <p className="mt-2 text-sm font-semibold leading-6 text-slate-700"><span className={correct ? "text-emerald-800" : "text-rose-800"}>{correct ? "Correct. " : "Review. "}</span>{item.feedback}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" disabled={submitted} onClick={() => setAnswers({ ...answers, [index]: true })} className={cx("rounded-full px-4 py-2 text-sm font-black ring-1", answers[index] === true ? "bg-teal-700 text-white ring-teal-700" : "bg-white text-teal-800 ring-teal-200")}>Applies</button>
            <button type="button" disabled={submitted} onClick={() => setAnswers({ ...answers, [index]: false })} className={cx("rounded-full px-4 py-2 text-sm font-black ring-1", answers[index] === false ? "bg-slate-800 text-white ring-slate-800" : "bg-white text-slate-700 ring-slate-200")}>Does NOT apply</button>
          </div>
        </div>
      </Card>;
    })}</div>
    {!submitted && <Button disabled={!allAnswered} onClick={() => setSubmitted(true)}>Submit answers</Button>}
    {submitted && <Card><Pill tone={score >= 4 ? "green" : "coral"}>Score {score}/5</Pill><div className="mt-4"><Button onClick={finish}>Continue</Button></div></Card>}
  </div>;
}

function BridgePage({ next }) {
  return <div className="grid gap-6">
    <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-8 text-white shadow-sm sm:p-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{lesson.subtitle}</p>
      <h2 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">The Shahadah</h2>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">The testimony that opens the door to Islam and shapes everything after it.</p>
    </div>
    <Card className="border-amber-200 bg-amber-50">
      <Pill tone="gold">Why this matters</Pill>
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">This is the sentence that opens the door to Islam.</h3>
      <p className="mt-3 leading-8 text-slate-800">Before salah, zakah, fasting, or Hajj, there is testimony. The Shahadah is not a slogan and not a vibe. It is a declaration that changes what you worship, who you follow, and how the rest of Islam makes sense.</p>
    </Card>
    <div className="grid gap-4 md:grid-cols-3">
      <Card><p className="text-3xl">🗣️</p><h3 className="mt-3 font-black">Say it clearly</h3><p className="mt-2 text-sm leading-6 text-slate-600">Ashhadu means "I testify." It is stronger than "I feel" or "I think."</p></Card>
      <Card><p className="text-3xl">🚪</p><h3 className="mt-3 font-black">Enter Islam</h3><p className="mt-2 text-sm leading-6 text-slate-600">The authentic hadith place the testimony at the entrance of Islam.</p></Card>
      <Card><p className="text-3xl">🧭</p><h3 className="mt-3 font-black">Live from it</h3><p className="mt-2 text-sm leading-6 text-slate-600">The rest of worship grows from what this testimony means.</p></Card>
    </div>
    <Card className="border-teal-200 bg-teal-50">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">Hadith anchor</p>
      <p className="mt-4 font-serif text-lg italic leading-8 text-slate-800">"Islam is built upon five: testifying that there is no God but Allah and that Muhammad is the Messenger of Allah..."</p>
      <p className="mt-3 text-xs font-bold text-slate-500">Sahih al-Bukhari 8 / Sahih Muslim 16c</p>
    </Card>
    <Button variant="gold" onClick={next}>Begin</Button>
  </div>;
}

function TextPage({ next }) {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">The text</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The full Shahadah.</h2></Card>
    <ShahadahCard />
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Two testimonies, not one</p>
      <p className="mt-4 leading-8 text-slate-700">Notice that the word <span className="font-black text-amber-800">ashhadu</span>, "I testify," appears twice. This is not repetition for emphasis. The two ashhadus mark two distinct declarations.</p>
      <p className="mt-3 leading-8 text-slate-700">The first testifies to what Allah is and is not. The second testifies to who Muhammad ﷺ is. They are joined by <span className="font-black">wa</span>, meaning "and." You are not making one testimony. You are making two.</p>
    </Card>
    <Button onClick={next}>Continue</Button>
  </div>;
}

function AshhaduPage({ next }) {
  return <div className="grid gap-5">
    <Card><Pill tone="teal">The word</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">What ashhadu actually means.</h2><p className="mt-3 leading-8 text-slate-700">The Arabic word ashhadu comes from the root sh-h-d.</p></Card>
    <Card className="border-amber-300 bg-amber-50">
      <div dir="rtl" className="grid grid-cols-3 gap-3 text-center">
        {[['ش', 'sh'], ['ه', 'h'], ['د', 'd']].map(([letter, sound]) => <div key={letter} className="rounded-3xl bg-white p-5 ring-1 ring-amber-200"><Arabic size="text-5xl">{letter}</Arabic><p dir="ltr" className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-amber-800">{sound}</p></div>)}
      </div>
    </Card>
    <Card>
      <p className="leading-8 text-slate-700">In Arabic usage, the root carries the meaning of witnessing and testifying. In legal settings, testimony is not casual speech. It is a formal claim that something is true.</p>
      <p className="mt-3 leading-8 text-slate-700">The Qur'an uses the same root in the sense of bearing witness, including in 3:18, where Allah witnesses that there is no deity except Him.</p>
      <p className="mt-3 leading-8 text-slate-700">When you say <span className="font-black">ashhadu an la ilaha illa Allah</span>, you are not saying "I think," "I hope," or "I want to believe." You are entering testimony.</p>
      <p className="mt-3 font-semibold leading-8 text-slate-950">A feeling can change tomorrow. A testimony is binding.</p>
    </Card>
    <Button onClick={next}>Continue</Button>
  </div>;
}

function NegationPage({ next }) {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">Structure</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Negation, then affirmation.</h2><p className="mt-3 leading-8 text-slate-700">The first testimony has two halves, in a specific order.</p></Card>
    <Card className="overflow-hidden p-0">
      <div className="grid md:grid-cols-2">
        <div className="bg-slate-100 p-6 text-center"><Arabic size="text-4xl">لَا إِلَٰهَ</Arabic><p className="mt-2 font-black text-slate-700">la ilaha</p><p className="text-sm text-slate-500">there is no God</p></div>
        <div className="bg-amber-100 p-6 text-center"><Arabic size="text-4xl" className="text-amber-950">إِلَّا اللَّهُ</Arabic><p className="mt-2 font-black text-amber-900">illa Allah</p><p className="text-sm text-amber-800">except Allah</p></div>
      </div>
    </Card>
    <Card>
      <p className="leading-8 text-slate-700">The Arabic structure is called <span className="font-black">nafy wa ithbat</span>: negation and affirmation. The order is deliberate. You do not start by affirming Allah. You start by negating everything else.</p>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-slate-500">What ilah actually means</p>
      <p className="mt-3 leading-8 text-slate-700">The word <span className="font-black">ilah</span> is often translated as "God," but the Arabic is more specific. It refers to what is worshipped, or what occupies the place worship belongs in.</p>
      <p className="mt-3 leading-8 text-slate-700">Money can become an ilah. Status can become an ilah. The desire for approval can become an ilah. The Shahadah negates every false claim on the human capacity for worship before affirming the only true object of it.</p>
      <p className="mt-3 font-semibold leading-8 text-slate-950">The Shahadah clears the field, then states the truth.</p>
    </Card>
    <Button onClick={next}>Test this</Button>
  </div>;
}

function WhyBothPage({ next }) {
  return <div className="grid gap-5">
    <Card><Pill tone="teal">Structure visible</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Why both testimonies?</h2></Card>
    <Card className="border-amber-300 bg-[#FBF6EC]"><Arabic size="text-3xl" className="text-center">أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ</Arabic><p className="mt-3 text-center font-serif italic text-slate-600">Ashhadu an la ilaha illa Allah</p><p className="mt-2 text-center font-semibold text-slate-800">I testify there is no God except Allah.</p></Card>
    <Card className="border-amber-300 bg-[#FBF6EC]"><Arabic size="text-3xl" className="text-center">وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</Arabic><p className="mt-3 text-center font-serif italic text-slate-600">Wa ashhadu anna Muhammadan rasulullah</p><p className="mt-2 text-center font-semibold text-slate-800">And I testify that Muhammad is the Messenger of Allah.</p></Card>
    <Card>
      <p className="leading-8 text-slate-700">The first testimony establishes Allah's exclusive right to worship. The second establishes how that worship is to be performed.</p>
      <p className="mt-3 leading-8 text-slate-700">Many people throughout history have believed in one God. What makes the Muslim's testimony distinct is not just monotheism. It is the recognition that Allah sent Muhammad ﷺ as His final Messenger to teach humanity how to worship Him.</p>
      <p className="mt-4 text-lg font-black leading-8 text-slate-950">To affirm one without the other is to know Allah exists but not to know how He has chosen to be known.</p>
    </Card>
    <Button onClick={next}>Continue</Button>
  </div>;
}

function FaithComponentsPage({ next }) {
  return <div className="grid gap-5">
    <Card>
      <Pill tone="purple">Belief, speech, action</Pill>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">How the Shahadah becomes real.</h2>
      <p className="mt-3 leading-8 text-slate-700">The Shahadah is the doorway into Islam. It is believed in the heart, declared with the tongue, and then lived through action.</p>
    </Card>
    <div className="grid gap-4 md:grid-cols-3">{faithComponents.map((item, index) => <Card key={item.term} className="bg-gradient-to-br from-white to-amber-50"><div className="flex items-center justify-between"><Pill tone="gold">{index + 1}</Pill><Arabic size="text-3xl" className="text-amber-900">{item.ar}</Arabic></div><h3 className="mt-4 text-xl font-black text-slate-950">{item.term}</h3><p className="mt-1 text-sm font-black text-amber-800">{item.title}</p><p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p></Card>)}</div>
    <Card className="border-teal-200 bg-teal-50">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">Proof anchor</p>
      <p className="mt-4 leading-8 text-slate-800">The Prophet ﷺ said that whoever professes la ilaha illa Allah and rejects what is worshipped besides Allah has their life and property protected, and their reckoning is with Allah.</p>
      <p className="mt-3 text-xs font-bold text-slate-500">Sahih Muslim 23a</p>
      <p className="mt-4 leading-8 text-slate-800">This is why we do not treat a struggling Muslim as if their Shahadah has simply disappeared. Missing obligations are serious and must be addressed, but the door into Islam is the testimony itself.</p>
    </Card>
    <Card className="border-amber-200 bg-amber-50">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Balance</p>
      <p className="mt-4 leading-8 text-slate-800">The Shahadah enters a person into Islam. Prayer, zakah, fasting, Hajj when able, and the rest of worship are then demanded by that Shahadah. So the lesson is not "actions do not matter." The lesson is: actions follow the testimony, they do not replace it.</p>
    </Card>
    <Button onClick={next}>Apply this carefully</Button>
  </div>;
}

function LongerFormPage({ next }) {
  return <div className="grid gap-5">
    <Card><Pill tone="gold">Longer form</Pill><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">The fuller wording.</h2><p className="mt-3 leading-8 text-slate-700">The Shahadah can also be recited in a fuller wording that appears in authentic formulations of testimony and is familiar from the language of tashahhud.</p></Card>
    <Card className="border-amber-300 bg-[#FBF6EC]">
      <Arabic size="text-3xl" className="text-center">أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ <span className="rounded-lg bg-teal-100 px-2 text-teal-900">وَحْدَهُ لَا شَرِيكَ لَهُ</span></Arabic>
      <Arabic size="text-3xl" className="mt-3 text-center">وَأَشْهَدُ أَنَّ مُحَمَّدًا <span className="rounded-lg bg-teal-100 px-2 text-teal-900">عَبْدُهُ وَرَسُولُهُ</span></Arabic>
      <p className="mt-4 text-center font-serif italic leading-8 text-slate-600">{longShahadah.tr}</p>
      <p className="mt-3 text-center font-semibold leading-7 text-slate-800">Translation: "{longShahadah.en}"</p>
    </Card>
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">What the longer form adds</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4"><h3 className="font-black text-slate-950">wahdahu la sharika lah</h3><p className="mt-2 text-sm leading-6 text-slate-700">Alone, with no partner. This emphasizes that Allah has no associates, partners, or co-deities.</p></div>
        <div className="rounded-3xl bg-slate-50 p-4"><h3 className="font-black text-slate-950">abduhu wa rasuluh</h3><p className="mt-2 text-sm leading-6 text-slate-700">His servant and His Messenger. The order matters: servant first, Messenger second.</p></div>
      </div>
      <p className="mt-4 leading-8 text-slate-700">Both wordings preserve the same two-testimony structure. The shorter wording is sufficient as the core Shahadah, and the fuller wording adds important clarifying phrases.</p>
    </Card>
    <Card className="border-teal-200 bg-teal-50">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">Hadith</p>
      <p className="mt-4 font-serif text-lg italic leading-8 text-slate-800">"Islam is built upon five: testifying that there is no God but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakat, fasting Ramadan, and pilgrimage to the House for whoever is able."</p>
      <p className="mt-3 text-xs font-bold text-slate-500">Sahih al-Bukhari 8 / Sahih Muslim 16c</p>
      <p className="mt-4 leading-8 text-slate-800">The Shahadah is named first. Every other pillar follows from it. Prayer without belief is empty motion. Zakat without belief is charity. The Shahadah is what makes the other four pillars worship.</p>
    </Card>
    <Button onClick={next}>Final question</Button>
  </div>;
}

function CheckpointPage({ scores, reset, onGoToNext }) {
  const score = total(scores);
  const pct = Math.round((score / MAX_SCORE) * 100);
  const pass = score >= 5;
  const concepts = [
    { label: "Two distinct testimonies in the Shahadah", ok: (scores.q1 || 0) >= 1 },
    { label: "Testimony as legal declaration, not feeling", ok: (scores.q2 || 0) >= 1 },
    { label: "The scope of ilah", ok: (scores.q3 || 0) >= 4 },
    { label: "Faith does not require perfect practice", ok: (scores.q4 || 0) >= 1 },
    { label: "Structural distinctness of the Shahadah", ok: (scores.q5 || 0) >= 1 },
  ];
  return <div className="grid gap-5">
    <Card className="bg-gradient-to-br from-white to-amber-50">
      <Pill tone={pass ? "green" : "coral"}>{pass ? "Checkpoint passed" : "Review recommended"}</Pill>
      <div className="mt-6 grid gap-6 md:grid-cols-[160px_1fr] md:items-center">
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full" style={{ background: `conic-gradient(rgb(15 118 110) ${pct}%, rgb(226 232 240) 0)` }}>
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white"><p className="text-4xl font-black text-slate-950">{score}</p><p className="text-sm font-bold text-slate-500">/{MAX_SCORE}</p></div>
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">You have completed Lesson 1.</h2>
          <p className="mt-3 leading-8 text-slate-700">You can now say what the Shahadah is, why ashhadu carries the weight it does, why negation comes before affirmation, and how belief, declaration, and action relate without erasing the Shahadah of a struggling Muslim.</p>
          <p className="mt-3 font-semibold leading-8 text-slate-950">The rest of the curriculum is built on what you just learned.</p>
        </div>
      </div>
    </Card>
    <Card><h3 className="text-xl font-black text-slate-950">Concepts mastered</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{concepts.map((concept) => <div key={concept.label} className={cx("rounded-2xl p-4", concept.ok ? "bg-emerald-50" : "bg-slate-50")}><p className={cx("font-bold", concept.ok ? "text-emerald-800" : "text-slate-500")}>{concept.ok ? "✓" : "□"} {concept.label}</p></div>)}</div></Card>
    <button type="button" onClick={onGoToNext} disabled={!onGoToNext} className={cx("rounded-3xl border bg-slate-950 p-6 text-left text-white transition", onGoToNext ? "cursor-pointer hover:bg-slate-900" : "opacity-70 cursor-default")}>
      <Pill tone="gold">Next</Pill>
      <h3 className="mt-4 text-2xl font-black">Module B1.2 - The Second Testimony</h3>
      <p className="mt-3 leading-7 text-white/70">Now that the first testimony is clear, the next lesson explains the second testimony: why Muslims testify that Muhammad ﷺ is the Messenger of Allah.</p>
      {!onGoToNext && <p className="mt-2 text-xs font-bold text-amber-400">Coming soon</p>}
    </button>
    <Button variant="soft" onClick={reset}>Restart lesson</Button>
  </div>;
}

export default function DeanyB1ShahadahLesson1({ onBack, onHome, onGoToNext }) {
  const saved = safeLoad();
  const [page, setPage] = useState(() => Number(saved.page) || 0);
  const [scores, setScores] = useState(() => saved.scores || {});
  const score = total(scores);

  function setQuestionScore(key, value) {
    setScores((previous) => ({ ...previous, [key]: value }));
  }

  function resetLesson() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    setPage(0);
    setScores({});
  }

  useEffect(() => {
    safeSave({ page, scores });
  }, [page, scores]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pages = [
    <BridgePage next={() => setPage(1)} />,
    <TextPage next={() => setPage(2)} />,
    <MCPage data={q1} tag="Question 1" onScore={(v) => setQuestionScore("q1", v)} next={() => setPage(3)} />,
    <AshhaduPage next={() => setPage(4)} />,
    <MCPage data={q2} tag="Question 2" onScore={(v) => setQuestionScore("q2", v)} next={() => setPage(5)} />,
    <NegationPage next={() => setPage(6)} />,
    <ClassifierPage onScore={(v) => setQuestionScore("q3", v)} next={() => setPage(7)} />,
    <WhyBothPage next={() => setPage(8)} />,
    <FaithComponentsPage next={() => setPage(9)} />,
    <MCPage data={q4} tag="Question 4" onScore={(v) => setQuestionScore("q4", v)} next={() => setPage(10)} />,
    <LongerFormPage next={() => setPage(11)} />,
    <MCPage data={q5} tag="Question 5" onScore={(v) => setQuestionScore("q5", v)} next={() => setPage(12)} />,
    <CheckpointPage scores={scores} reset={resetLesson} onGoToNext={onGoToNext} />,
  ];

  const pageQuestionKeys = { 2: "q1", 4: "q2", 6: "q3", 9: "q4", 11: "q5" };
  const safePage = Math.min(Math.max(page, 0), pages.length - 1);
  const currentQuestionKey = pageQuestionKeys[safePage];
  const lockedOnQuestion = SHIP_READY && currentQuestionKey && scores[currentQuestionKey] === undefined;

  function canEnterPage(targetPage) {
    if (!SHIP_READY || targetPage <= safePage) return true;
    for (let index = 0; index < targetPage; index += 1) {
      const key = pageQuestionKeys[index];
      if (key && scores[key] === undefined) return false;
    }
    return true;
  }

  return <main className="min-h-screen bg-[#FDFBF7] text-slate-950">
    <Header page={safePage} totalPages={pages.length} score={score} onBack={onBack} />
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div key={safePage} className="animate-[fadeUp_0.25s_ease]">{pages[safePage]}</div>
      <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <div className="flex gap-2"><Button variant="soft" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button><Button variant="soft" onClick={resetLesson}>Reset</Button></div>
        <div className="hidden gap-1 md:flex">{pages.map((_, index) => {
          const allowed = canEnterPage(index);
          return <button key={index} type="button" disabled={!allowed} onClick={() => allowed && setPage(index)} className={cx("h-2 rounded-full transition disabled:cursor-not-allowed", index === safePage ? "w-7 bg-teal-700" : allowed ? "w-2 bg-slate-300" : "w-2 bg-slate-200 opacity-40")} aria-label={`Go to page ${index + 1}`} />;
        })}</div>
        <div className="grid justify-items-end gap-2">
          {lockedOnQuestion && <p className="text-xs font-bold text-amber-700">Answer this question to continue.</p>}
          <Button disabled={safePage === pages.length - 1 || lockedOnQuestion || !canEnterPage(safePage + 1)} onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}>Continue</Button>
        </div>
      </nav>
    </div>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`}</style>
  </main>;
}
