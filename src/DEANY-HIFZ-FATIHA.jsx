import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "deany:fatiha:memorisation:v7";

const audioFor = (ayah) => [
  `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah}.mp3`,
  `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${ayah}`,
  `/audio/quran/alafasy/001${String(ayah).padStart(3, "0")}.mp3`,
];

const fullSurahAyahs = [1, 2, 3, 4, 5, 6, 7];

const modes = {
  guided: {
    id: "guided",
    title: "Lots of help",
    tag: "Most support",
    description: "Arabic stays visible, hints are stronger, and every passage is chained back to what you already learnt.",
    showArabic: true,
    chainEvery: 1,
  },
  balanced: {
    id: "balanced",
    title: "Medium help",
    tag: "Deany default",
    description: "Listen, echo, test soon after learning, then stitch the ayahs together.",
    showArabic: true,
    chainEvery: 1,
  },
  minimal: {
    id: "minimal",
    title: "Minimal help",
    tag: "Revision",
    description: "Less visible Arabic, more recall pressure, and fewer support cues.",
    showArabic: false,
    chainEvery: 2,
  },
};

const optionTranslit = {
  "الرَّحْمَٰنِ": "ar-Raḥmān",
  "الرَّحِيمِ": "ar-Raḥīm",
  "رَبِّ": "rabbi",
  "الْعَالَمِينَ": "al-ʿālamīn",
  "الدِّينِ": "ad-dīn",
  "نَسْتَعِينُ": "nastaʿīn",
  "مَالِكِ": "māliki",
  "يَوْمِ": "yawmi",
  "وَإِيَّاكَ نَسْتَعِينُ": "wa iyyāka nastaʿīn",
  "إِيَّاكَ نَعْبُدُ": "iyyāka naʿbudu",
  "اهْدِنَا الصِّرَاطَ": "ihdinā ṣ-ṣirāṭa",
  "الصِّرَاطَ": "aṣ-ṣirāṭa",
  "الْمُسْتَقِيمَ": "al-mustaqīm",
  "عَلَيْهِمْ": "ʿalayhim",
  "الْمَغْضُوبِ": "al-maghḍūbi",
  "الضَّالِّينَ": "aḍ-ḍāllīn",
};

const passages = [
  {
    key: "1",
    ayah: 1,
    label: "Ayah 1",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translit: "Bismillāhi r-raḥmāni r-raḥīm",
    translation: "In the name of Allah, the Most Compassionate, Most Merciful.",
    cue: "Begins in Allah's name and mentions His mercy twice.",
    target: "Hear ar-Raḥmān first, then ar-Raḥīm.",
    task: {
      type: "fill",
      prompt: "Fill the missing word.",
      before: "بِسْمِ اللَّهِ",
      after: "الرَّحِيمِ",
      answer: "الرَّحْمَٰنِ",
      options: ["الرَّحْمَٰنِ", "الرَّحِيمِ", "رَبِّ", "الْعَالَمِينَ"],
    },
  },
  {
    key: "2",
    ayah: 2,
    label: "Ayah 2",
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translit: "Al-ḥamdu lillāhi rabbi l-ʿālamīn",
    translation: "All praise is for Allah, Lord of all worlds.",
    cue: "All praise belongs to Allah, Lord of all worlds.",
    target: "Start clearly with al-ḥamdu, then land on l-ʿālamīn.",
    task: {
      type: "next",
      prompt: "Choose the next word.",
      stem: "الْحَمْدُ لِلَّهِ رَبِّ",
      answer: "الْعَالَمِينَ",
      options: ["الْعَالَمِينَ", "الرَّحِيمِ", "الدِّينِ", "نَسْتَعِينُ"],
    },
  },
  {
    key: "3",
    ayah: 3,
    label: "Ayah 3",
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    translit: "Ar-raḥmāni r-raḥīm",
    translation: "The Most Compassionate, Most Merciful.",
    cue: "The two mercy names by themselves.",
    target: "Keep ar-Raḥmān first and ar-Raḥīm second.",
    task: {
      type: "order",
      prompt: "Tap the words in the correct order.",
      answer: ["الرَّحْمَٰنِ", "الرَّحِيمِ"],
      options: ["الرَّحِيمِ", "الرَّحْمَٰنِ"],
    },
  },
  {
    key: "4",
    ayah: 4,
    label: "Ayah 4",
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    translit: "Māliki yawmi d-dīn",
    translation: "Master of the Day of Judgement.",
    cue: "Allah is Master of the Day of Judgement.",
    target: "Hold the opening mā gently, then keep the three-word flow clear.",
    task: {
      type: "first",
      prompt: "Which word starts this ayah?",
      answer: "مَالِكِ",
      options: ["مَالِكِ", "يَوْمِ", "الدِّينِ", "رَبِّ"],
    },
  },
  {
    key: "5",
    ayah: 5,
    label: "Ayah 5",
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translit: "Iyyāka naʿbudu wa iyyāka nastaʿīn",
    translation: "You alone we worship, and You alone we ask for help.",
    cue: "Two halves: worship first, then asking for help.",
    target: "Notice iyyāka repeats twice.",
    task: {
      type: "next",
      prompt: "You have recited: إِيَّاكَ نَعْبُدُ. What completes the ayah?",
      stem: "إِيَّاكَ نَعْبُدُ",
      answer: "وَإِيَّاكَ نَسْتَعِينُ",
      options: ["وَإِيَّاكَ نَسْتَعِينُ", "إِيَّاكَ نَعْبُدُ", "اهْدِنَا الصِّرَاطَ", "مَالِكِ يَوْمِ الدِّينِ"],
    },
  },
  {
    key: "6",
    ayah: 6,
    label: "Ayah 6",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translit: "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
    translation: "Guide us to the straight path.",
    cue: "Asks Allah to guide us to the straight path.",
    target: "Hear ihdinā at the start, then al-mustaqīm at the end.",
    task: {
      type: "fill",
      prompt: "Fill the missing word.",
      before: "اهْدِنَا",
      after: "الْمُسْتَقِيمَ",
      answer: "الصِّرَاطَ",
      options: ["الصِّرَاطَ", "الْمُسْتَقِيمَ", "الْعَالَمِينَ", "الدِّينِ"],
    },
  },
  {
    key: "7a",
    ayah: 7,
    label: "Ayah 7, part 1",
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ",
    translit: "Ṣirāṭa lladhīna anʿamta ʿalayhim",
    translation: "The path of those You have blessed.",
    cue: "The path of those Allah has blessed.",
    target: "Keep the whole phrase smooth.",
    task: {
      type: "next",
      prompt: "Choose the next word.",
      stem: "صِرَاطَ الَّذِينَ أَنْعَمْتَ",
      answer: "عَلَيْهِمْ",
      options: ["عَلَيْهِمْ", "الْمَغْضُوبِ", "الضَّالِّينَ", "نَسْتَعِينُ"],
    },
  },
  {
    key: "7b",
    ayah: 7,
    label: "Ayah 7, part 2",
    arabic: "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ",
    translit: "Ghayri l-maghḍūbi ʿalayhim",
    translation: "Not of those who have earned anger.",
    cue: "This comes before the final phrase.",
    target: "Do not swap this with wa la ḍ-ḍāllīn.",
    task: {
      type: "fill",
      prompt: "Fill the missing word.",
      before: "غَيْرِ",
      after: "عَلَيْهِمْ",
      answer: "الْمَغْضُوبِ",
      options: ["الْمَغْضُوبِ", "الضَّالِّينَ", "الْمُسْتَقِيمَ", "الْعَالَمِينَ"],
    },
  },
  {
    key: "7c",
    ayah: 7,
    label: "Ayah 7, part 3",
    arabic: "وَلَا الضَّالِّينَ",
    translit: "Wa la ḍ-ḍāllīn",
    translation: "Nor of those who are astray.",
    cue: "The final ending of Al-Fatiha.",
    target: "Do not rush the final word.",
    task: {
      type: "next",
      prompt: "Choose the correct ending.",
      stem: "وَلَا",
      answer: "الضَّالِّينَ",
      options: ["الضَّالِّينَ", "الْمَغْضُوبِ", "الدِّينِ", "الْعَالَمِينَ"],
    },
  },
];

const defaultProgress = {
  started: false,
  mode: "balanced",
  index: 0,
  phase: "listen",
  selected: {},
  mistakes: {},
  firstAttempt: {},
  weakQueue: [],
  finalChecks: {},
  returnToFinal: false,
  complete: false,
};

function readProgress() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatSeconds(total) {
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function phasesFor(modeId, index) {
  const mode = modes[modeId] || modes.balanced;
  const shouldChain = index === passages.length - 1 || (index + 1) % mode.chainEvery === 0;
  const phases = ["listen", "echo", "quiz"];
  if (index > 0) phases.push("seam");
  if (shouldChain) phases.push("chain");
  return phases;
}

function translitForArabic(arabic) {
  return optionTranslit[arabic] || passages.find((item) => item.arabic === arabic)?.translit || "";
}

function questionTranslitFor(passage) {
  const task = passage.task;

  const blanksByKey = {
    "1": "Bismillāhi _____ r-raḥīm",
    "2": "Al-ḥamdu lillāhi rabbi _____",
    "3": "_____ _____",
    "4": "_____ yawmi d-dīn",
    "5": "Iyyāka naʿbudu _____",
    "6": "Ihdinā _____ l-mustaqīm",
    "7a": "Ṣirāṭa lladhīna anʿamta _____",
    "7b": "Ghayri _____ ʿalayhim",
    "7c": "Wa la _____",
  };

  if (blanksByKey[passage.key]) return blanksByKey[passage.key];
  if (task.type === "order") return "_____ _____";
  return "_____";
}

function Button({ children, onClick, variant = "primary", disabled = false, className = "" }) {
  const styles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    dark: "bg-slate-950 text-white hover:bg-slate-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm outline-none transition focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <section className={`rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function useRecorder() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  const supported = typeof window !== "undefined" && Boolean(window.MediaRecorder) && Boolean(navigator.mediaDevices?.getUserMedia);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, [audioUrl]);

  async function start() {
    if (!supported) {
      setError("Recording is not supported in this browser.");
      return;
    }

    try {
      setError("");
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
      setSeconds(0);
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      setError("Microphone access was blocked. Enable it in your browser to record.");
      setIsRecording(false);
    }
  }

  function stop() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRecording(false);
  }

  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setSeconds(0);
    setError("");
  }

  return { isRecording, audioUrl, seconds, error, start, stop, reset };
}

function RecorderPanel({ title = "Optional recording", helper = "Record yourself only if it helps you compare your recitation.", compact = false }) {
  const recorder = useRecorder();

  return (
    <div className={`rounded-3xl border border-slate-200 bg-slate-50 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Optional</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{helper}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${recorder.isRecording ? "bg-rose-100 text-rose-700" : "bg-white text-slate-500"}`}>
          {recorder.isRecording ? `Recording ${formatSeconds(recorder.seconds)}` : recorder.audioUrl ? "Saved" : "Ready"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {!recorder.isRecording && <Button variant="dark" onClick={recorder.start}>Start recording</Button>}
        {recorder.isRecording && <Button variant="danger" onClick={recorder.stop}>Stop recording</Button>}
        {recorder.audioUrl && <Button variant="secondary" onClick={recorder.reset}>Record again</Button>}
      </div>

      {recorder.audioUrl && (
        <div className="mt-4 rounded-2xl bg-white p-3">
          <audio src={recorder.audioUrl} controls className="w-full" />
          <p className="mt-2 text-xs font-bold text-slate-500">Play this beside the model and compare wording, endings, and pauses.</p>
        </div>
      )}

      {recorder.error && <p className="mt-3 text-sm font-bold text-amber-700">{recorder.error}</p>}
    </div>
  );
}

function AudioPlayer({ sources, label = "Play model recitation" }) {
  const ref = useRef(null);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setSourceIndex(0);
    setStatus("");
  }, [sources.join("|")]);

  async function play() {
    try {
      if (!ref.current) return;
      ref.current.currentTime = 0;
      await ref.current.play();
    } catch {
      setStatus("Tap play again, or allow audio in your browser.");
    }
  }

  function onError() {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex(sourceIndex + 1);
      setStatus("Trying a backup audio source...");
    } else {
      setStatus("Audio could not load. Check your connection or local audio path.");
    }
  }

  return (
    <div>
      <audio ref={ref} src={sources[sourceIndex]} preload="auto" onError={onError} />
      <Button variant="dark" onClick={play}>{label}</Button>
      {status && <p className="mt-2 text-xs font-bold text-amber-700">{status}</p>}
    </div>
  );
}

function FullSurahPlayer() {
  const audioRef = useRef(null);
  const [ayahIndex, setAyahIndex] = useState(0);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState("");
  const currentAyah = fullSurahAyahs[ayahIndex];
  const sources = audioFor(currentAyah);

  async function playFromStart() {
    setAyahIndex(0);
    setSourceIndex(0);
    setPlaying(true);
    setStatus("");
    setTimeout(async () => {
      try {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch {
        setStatus("Tap play again, or allow audio in your browser.");
      }
    }, 50);
  }

  function stop() {
    setPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  }

  function handleEnded() {
    if (ayahIndex < fullSurahAyahs.length - 1) {
      setAyahIndex((value) => value + 1);
      setSourceIndex(0);
      setTimeout(async () => {
        try {
          if (!audioRef.current) return;
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
        } catch {
          setStatus("Tap play again to continue.");
        }
      }, 80);
    } else {
      setPlaying(false);
      setAyahIndex(0);
    }
  }

  function onError() {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((value) => value + 1);
      setStatus("Trying a backup audio source...");
    } else {
      setStatus("This ayah audio could not load. Check your connection or local audio path.");
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <audio ref={audioRef} src={sources[sourceIndex]} preload="auto" onEnded={handleEnded} onError={onError} />
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Model recitation</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">Full Al-Fatiha</h3>
      <p className="mt-2 text-sm font-bold text-slate-600">Play the model after recording yourself and compare ayah by ayah.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="dark" onClick={playFromStart}>{playing ? `Playing ayah ${currentAyah}` : "Play full recitation"}</Button>
        {playing && <Button variant="secondary" onClick={stop}>Stop</Button>}
      </div>
      {status && <p className="mt-3 text-sm font-bold text-amber-700">{status}</p>}
    </div>
  );
}

function ArabicBlock({ text, hidden, onReveal }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-6 text-center">
      <p dir="rtl" className={`text-4xl leading-loose md:text-5xl ${hidden ? "select-none blur-sm text-slate-300" : "text-slate-950"}`}>{text}</p>
      {hidden && <Button className="mt-4" variant="secondary" onClick={onReveal}>Reveal Arabic</Button>}
    </div>
  );
}

function ModeSelect({ onChoose }) {
  return (
    <main className="min-h-screen bg-[#fbfbf8] p-6 text-slate-950">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="bg-gradient-to-br from-white to-emerald-50">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Deany Quran</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight">Memorise Al-Fatiha</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Listen, echo, recall, and stitch the surah together one passage at a time.</p>
        </Card>

        <div className="grid gap-4">
          {Object.values(modes).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChoose(mode.id)}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 text-left shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-md focus:ring-4 focus:ring-emerald-100"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-slate-950">{mode.title}</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">{mode.tag}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

function Quiz({ passage, selected, firstAttempt, onSelect, onFirstAttempt, onWeak, onCorrect }) {
  const [result, setResult] = useState(null);
  const [pickedOrder, setPickedOrder] = useState([]);
  const [round, setRound] = useState(0);
  const task = passage.task;
  const options = useMemo(() => shuffle(task.options), [passage.key, round]);

  useEffect(() => {
    setResult(null);
    setPickedOrder([]);
    setRound(0);
  }, [passage.key]);

  function registerAttempt(correct, type) {
    if (typeof firstAttempt === "undefined") onFirstAttempt(passage.key, correct, type);
    else if (!correct) onWeak(passage.key, type);
  }

  function tryAgain() {
    setResult(null);
    setPickedOrder([]);
    setRound((value) => value + 1);
  }

  function choose(option) {
    if (result === "correct") return;

    if (task.type === "order") {
      const next = [...pickedOrder, option];
      setPickedOrder(next);
      if (next.length === task.answer.length) {
        const correct = next.join(" ") === task.answer.join(" ");
        registerAttempt(correct, "order");
        setResult(correct ? "correct" : "wrong");
      }
      return;
    }

    const correct = option === task.answer;
    onSelect(passage.key, option);
    registerAttempt(correct, task.type);
    setResult(correct ? "correct" : "wrong");
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Recall check</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{task.prompt}</h2>
        </div>
        {firstAttempt === false && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">Added to review</span>}
      </div>
      <p className="mt-2 text-sm font-bold text-slate-600">Cue: {passage.cue}</p>

      <div dir="rtl" className="mt-5 rounded-3xl bg-slate-50 p-6 text-center text-3xl leading-loose text-slate-900">
        {task.type === "fill" && <>{task.before} <span className="rounded-xl bg-white px-6 py-2 text-slate-300">_____</span> {task.after}</>}
        {task.type === "next" && <>{task.stem} <span className="rounded-xl bg-white px-6 py-2 text-slate-300">_____</span></>}
        {task.type === "first" && <span className="text-slate-400">{task.prompt}</span>}
        {task.type === "order" && <div className="rounded-2xl bg-white p-3 text-emerald-700">{pickedOrder.length ? pickedOrder.join(" | ") : "Tap below to build the phrase"}</div>}
      </div>
      <p className="mt-3 text-center text-sm font-bold italic text-slate-500">{questionTranslitFor(passage)}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const translit = translitForArabic(option);
          const active = selected === option || pickedOrder.includes(option);
          return (
            <button
              key={option}
              type="button"
              disabled={(task.type === "order" && pickedOrder.includes(option)) || result === "correct"}
              onClick={() => choose(option)}
              className={`rounded-2xl border bg-white p-4 text-right outline-none transition hover:-translate-y-0.5 hover:shadow-sm focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200"}`}
            >
              <span dir="rtl" className="block text-xl font-black leading-loose text-slate-950">{option}</span>
              {translit && <span className="block text-sm font-bold italic text-slate-500">{translit}</span>}
            </button>
          );
        })}
      </div>

      {result && (
        <div className={`mt-5 rounded-3xl p-5 ${result === "correct" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
          <p className="text-xs font-black uppercase tracking-[0.18em]">{result === "correct" ? "Correct" : "Not quite"}</p>
          <p className="mt-2 text-sm font-bold leading-6">
            {result === "correct" ? "Good. Now connect it to the wider surah." : "Try again before moving on. This passage will return in your review."}
          </p>
          <div className="mt-4 flex gap-3">
            {result === "correct" ? <Button onClick={onCorrect}>Continue</Button> : <Button variant="secondary" onClick={tryAgain}>Try again</Button>}
          </div>
        </div>
      )}
    </Card>
  );
}

function SeamDrill({ index, firstAttempt, onFirstAttempt, onWeak, onContinue }) {
  const previous = passages[index - 1];
  const current = passages[index];
  const [result, setResult] = useState(null);
  const [round, setRound] = useState(0);

  const options = useMemo(() => {
    const candidates = passages.filter((item) => item.key !== current.key).map((item) => item.arabic);
    return shuffle([current.arabic, ...shuffle(candidates).slice(0, 3)]);
  }, [current.key, round]);

  function choose(option) {
    const correct = option === current.arabic;
    const attemptKey = `seam:${current.key}`;
    if (typeof firstAttempt === "undefined") onFirstAttempt(attemptKey, correct, "seam");
    else if (!correct) onWeak(current.key, "seam");
    setResult(correct ? "correct" : "wrong");
  }

  function tryAgain() {
    setResult(null);
    setRound((value) => value + 1);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Seam drill</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">What comes next?</h2>
        </div>
        {firstAttempt === false && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">Transition added to review</span>}
      </div>

      <div className="mt-5 rounded-3xl bg-slate-50 p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">After this</p>
        <p dir="rtl" className="mt-3 text-right text-3xl leading-loose text-slate-950">{previous.arabic}</p>
        <p className="mt-2 text-sm font-bold italic text-slate-500">{previous.translit}</p>
        <div className="mt-4 rounded-2xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Choose what comes next</p>
          <p className="mt-2 text-sm font-bold italic text-slate-500">Next passage transliteration: _____</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const translit = translitForArabic(option);
          return (
            <button
              key={option}
              type="button"
              disabled={result === "correct"}
              onClick={() => choose(option)}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-right outline-none transition hover:-translate-y-0.5 hover:shadow-sm focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span dir="rtl" className="block text-xl font-black leading-loose text-slate-950">{option}</span>
              {translit && <span className="block text-sm font-bold italic text-slate-500">{translit}</span>}
            </button>
          );
        })}
      </div>

      {result && (
        <div className={`mt-5 rounded-3xl p-5 ${result === "correct" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
          <p className="text-xs font-black uppercase tracking-[0.18em]">{result === "correct" ? "Correct transition" : "Not quite"}</p>
          <p className="mt-2 text-sm font-bold leading-6">
            {result === "correct" ? "Good. The join between the two passages is getting stronger." : "This is a weak seam. Try it once more before moving on."}
          </p>
          <div className="mt-4 flex gap-3">
            {result === "correct" ? <Button onClick={onContinue}>Continue</Button> : <Button variant="secondary" onClick={tryAgain}>Try again</Button>}
          </div>
        </div>
      )}
    </Card>
  );
}

function FinalGate({ progress, revealed, setRevealed, onBackToPassage, onMarkFinal, onComplete }) {
  const allMarked = passages.every((item) => typeof progress.finalChecks[item.key] === "boolean");
  const stuckItems = passages.filter((item) => progress.finalChecks[item.key] === false);
  const weakItems = passages.filter((item) => progress.weakQueue.includes(item.key));

  return (
    <main className="min-h-screen bg-[#fbfbf8] p-6 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-5">
        <Card className="bg-gradient-to-br from-white to-emerald-50">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Final memory test</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">Can you recite the whole surah?</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Keep the Arabic hidden first. Recite Al-Fatiha from memory. Record yourself if it helps, then compare with the model and tap the exact place where you got stuck.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setRevealed((value) => !value)}>{revealed ? "Hide full text" : "Reveal and self-check"}</Button>
            <Button disabled={!allMarked || stuckItems.length > 0} onClick={onComplete}>I recited it cleanly</Button>
          </div>
          {!allMarked && <p className="mt-4 text-sm font-bold text-slate-500">After comparing, mark each passage as clean or needs work.</p>}
          {stuckItems.length > 0 && <p className="mt-4 text-sm font-bold text-rose-700">Tap the passage you got stuck on to review it, then return to the full-surah test.</p>}
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <RecorderPanel
            title="Record your full recitation"
            helper="Optional. Record Al-Fatiha from memory, then play it back beside the model recitation. Listen for missing words, swapped phrases, and weak endings."
          />
          <FullSurahPlayer />
        </div>

        {weakItems.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Adaptive review queue</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Passages to strengthen before finishing</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {weakItems.map((item) => (
                <button key={item.key} type="button" onClick={() => onBackToPassage(item.key)} className="rounded-full bg-white px-4 py-2 text-sm font-black text-amber-800 shadow-sm">
                  Review {item.label}
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Where did you get stuck?</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {passages.map((item) => {
              const state = progress.finalChecks[item.key];
              return (
                <div key={item.key} className={`rounded-3xl border p-4 transition ${state === false ? "border-rose-200 bg-rose-50" : state === true ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                  <p className="text-sm font-black text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm font-bold italic text-slate-500">{item.translit}</p>
                  {revealed && <p dir="rtl" className="mt-3 text-right text-2xl leading-loose text-slate-950">{item.arabic}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button className="px-3 py-2" variant="secondary" onClick={() => onBackToPassage(item.key)}>Review</Button>
                    <Button className="px-3 py-2" variant={state === true ? "primary" : "secondary"} onClick={() => onMarkFinal(item.key, true)}>Clean</Button>
                    <Button className="px-3 py-2" variant={state === false ? "danger" : "secondary"} onClick={() => onMarkFinal(item.key, false)}>Needs work</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function DeanyFatihaMemorisationOnly({ onBack, onHome, onGoTafsir }) {
  const [progress, setProgress] = useState(readProgress);
  const [revealed, setRevealed] = useState(false);

  const mode = modes[progress.mode] || modes.balanced;
  const passage = passages[progress.index] || passages[0];
  const phaseList = phasesFor(mode.id, progress.index);
  const phaseIndex = Math.max(0, phaseList.indexOf(progress.phase));
  const width = ((progress.index + phaseIndex / phaseList.length) / passages.length) * 100;
  const learned = passages.slice(0, progress.index + 1);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Continue without saved progress.
    }
  }, [progress]);

  useEffect(() => {
    setRevealed(false);
  }, [progress.index, progress.phase]);

  function update(patch) {
    setProgress((old) => ({ ...old, ...patch }));
  }

  function addWeak(key, type) {
    setProgress((old) => ({
      ...old,
      mistakes: { ...old.mistakes, [key]: [...(old.mistakes[key] || []), type] },
      weakQueue: old.weakQueue.includes(key) ? old.weakQueue : [...old.weakQueue, key],
    }));
  }

  function recordFirstAttempt(key, correct, type) {
    setProgress((old) => ({
      ...old,
      firstAttempt: { ...old.firstAttempt, [key]: correct },
      mistakes: correct ? old.mistakes : { ...old.mistakes, [key]: [...(old.mistakes[key] || []), type] },
      weakQueue: correct || old.weakQueue.includes(key.replace("seam:", "")) ? old.weakQueue : [...old.weakQueue, key.replace("seam:", "")],
    }));
  }

  function start(modeId) {
    setProgress({ ...defaultProgress, started: true, mode: modeId });
  }

  function reset() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore reset failures.
    }
    setProgress(defaultProgress);
  }

  function next() {
    if (phaseIndex < phaseList.length - 1) {
      update({ phase: phaseList[phaseIndex + 1] });
      return;
    }

    if (progress.returnToFinal) {
      update({ phase: "final", returnToFinal: false });
      return;
    }

    if (progress.index < passages.length - 1) {
      update({ index: progress.index + 1, phase: "listen" });
      return;
    }

    update({ phase: "final" });
  }

  function selectAnswer(key, value) {
    setProgress((old) => ({ ...old, selected: { ...old.selected, [key]: value } }));
  }

  function markFinal(key, clean) {
    setProgress((old) => ({
      ...old,
      finalChecks: { ...old.finalChecks, [key]: clean },
      mistakes: clean ? old.mistakes : { ...old.mistakes, [key]: [...(old.mistakes[key] || []), "final-review"] },
      weakQueue: clean || old.weakQueue.includes(key) ? old.weakQueue : [...old.weakQueue, key],
    }));
  }

  function backToPassage(key) {
    const index = passages.findIndex((item) => item.key === key);
    if (index < 0) return;
    addWeak(key, "stuck-on-final");
    update({ index, phase: "listen", returnToFinal: true });
  }

  const reviewPlan = useMemo(() => {
    const weak = progress.weakQueue;
    if (!weak.length) {
      return ["Today: one blind recitation after a short break.", "Tomorrow: one blind recitation before learning anything new.", "Review again on day 3, day 7, day 14, and day 30."];
    }
    const names = weak.map((key) => passages.find((item) => item.key === key)?.label || key).slice(0, 5).join(", ");
    return [`Today: repeat ${names} before the full surah.`, "Tomorrow: start with the passage that needs work, then recite the full surah blind.", "Move on after one clean full recitation."];
  }, [progress.weakQueue]);

  if (!progress.started) return <ModeSelect onChoose={start} />;

  if (progress.complete) {
    const cleanCount = Object.values(progress.finalChecks).filter(Boolean).length;
    return (
      <main className="min-h-screen bg-[#fbfbf8] p-6 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Lesson complete</p>
            <h1 className="mt-4 text-5xl font-black">{cleanCount} / {passages.length} passages clean</h1>
            <p className="mt-3 text-slate-600">Your next review is based on first-attempt accuracy and where you hesitated.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {reviewPlan.map((item) => <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">{item}</div>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={reset}>Restart lesson</Button>
            </div>
          </Card>

          <Card className="mt-5 bg-gradient-to-br from-white to-emerald-50">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Optional next lesson</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">Understand what you memorised</h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-600">When the learner is ready, send them to the separate beginner tafsir lesson for Surah Al-Fatiha.</p>
            <button onClick={onGoTafsir} className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-100">
              Go to Al-Fatiha tafsir lesson
            </button>
          </Card>
        </div>
      </main>
    );
  }

  if (progress.phase === "final") {
    return (
      <FinalGate
        progress={progress}
        revealed={revealed}
        setRevealed={setRevealed}
        onBackToPassage={backToPassage}
        onMarkFinal={markFinal}
        onComplete={() => update({ complete: true })}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfbf8] p-6 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Al-Fatiha memorisation · {mode.title}</p>
            <h1 className="mt-2 text-3xl font-black">{passage.label}</h1>
            {progress.returnToFinal && <p className="mt-1 text-sm font-bold text-amber-700">Review this passage, then return to the full-surah test.</p>}
          </div>
          <Button variant="secondary" onClick={reset}>Restart</Button>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(3, width)}%` }} />
        </div>

        {progress.phase === "listen" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Card>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Listen</p>
              <h2 className="mt-3 text-3xl font-black">Focus on the sound</h2>
              <p className="mt-3 text-slate-600">{passage.target}</p>
              <div className="mt-5"><AudioPlayer sources={audioFor(passage.ayah)} /></div>
              <div className="mt-5"><Button onClick={next}>Continue</Button></div>
            </Card>
            <Card>
              <ArabicBlock text={passage.arabic} hidden={!mode.showArabic && !revealed} onReveal={() => setRevealed(true)} />
              <p className="mt-4 text-center text-sm italic text-slate-500">{passage.translit}</p>
              <p className="mt-2 text-center text-sm font-bold text-slate-700">{passage.translation}</p>
            </Card>
          </div>
        )}

        {progress.phase === "echo" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Card>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Echo</p>
              <h2 className="mt-3 text-3xl font-black">Recite it back</h2>
              <p className="mt-3 text-slate-600">Say the passage aloud, then replay the model and compare.</p>
              <div className="mt-5"><AudioPlayer sources={audioFor(passage.ayah)} label="Replay model" /></div>
              <div className="mt-5"><RecorderPanel title="Record this passage" helper="Optional. Use this to hear yourself beside the model before moving on." compact /></div>
              <div className="mt-5"><Button onClick={next}>Continue to recall</Button></div>
            </Card>
            <Card>
              <ArabicBlock text={passage.arabic} hidden={!mode.showArabic && !revealed} onReveal={() => setRevealed(true)} />
              <p className="mt-4 text-center text-sm italic text-slate-500">{passage.translit}</p>
              <p className="mt-2 text-center text-sm font-bold text-slate-700">{passage.translation}</p>
            </Card>
          </div>
        )}

        {progress.phase === "quiz" && (
          <Quiz
            passage={passage}
            selected={progress.selected[passage.key]}
            firstAttempt={progress.firstAttempt[passage.key]}
            onSelect={selectAnswer}
            onFirstAttempt={recordFirstAttempt}
            onWeak={addWeak}
            onCorrect={next}
          />
        )}

        {progress.phase === "seam" && (
          <SeamDrill
            index={progress.index}
            firstAttempt={progress.firstAttempt[`seam:${passage.key}`]}
            onFirstAttempt={recordFirstAttempt}
            onWeak={addWeak}
            onContinue={next}
          />
        )}

        {progress.phase === "chain" && (
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Chain practice</p>
              <h2 className="mt-3 text-3xl font-black">Recite from the beginning to {passage.label}</h2>
              <p className="mt-3 text-slate-600">This strengthens the joins between ayahs before moving on.</p>
              <div className="mt-5"><RecorderPanel title="Record the chain" helper="Optional. Use it if you want to hear whether the join between ayahs is smooth." compact /></div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setRevealed((value) => !value)}>{revealed ? "Hide Arabic" : "Reveal Arabic"}</Button>
                <Button onClick={next}>Continue</Button>
              </div>
            </Card>
            <Card>
              <div className="space-y-4">
                {learned.map((item) => (
                  <div key={item.key} className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-500">{item.label}</p>
                    {revealed && <p dir="rtl" className="mt-3 text-right text-3xl leading-loose text-slate-950">{item.arabic}</p>}
                    <p className="mt-2 text-sm italic text-slate-500">{item.translit}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
