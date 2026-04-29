import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DEANY Module S2 Lesson 1: "The Five Daily Appointments"
   Pipeline: Blueprint -> JSX (pure translation, zero content decisions)
   ═══════════════════════════════════════════════════════════════ */

/* ─── DESIGN TOKENS ─── */
const T = {
  navy: "#1B2A4A",
  navyDeep: "#0F1A2E",
  gold: "#C5A55A",
  goldLight: "#F5EDD6",
  goldPale: "#FBF6EC",
  teal: "#2A7B88",
  tealLight: "#E0F2F4",
  tealDeep: "#1D5A64",
  coral: "#D4654A",
  coralLight: "#FDEAE5",
  green: "#3A8B5C",
  greenLight: "#E5F5EC",
  purple: "#6B4C9A",
  magenta: "#A855A0",
  grayDark: "#3D3D3D",
  grayMed: "#6B6B6B",
  grayLight: "#F2F2F2",
  cream: "#FDFBF7",
  white: "#FFFFFF",
};

const FONT = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  ui: "'DM Sans', sans-serif",
  arabic: "'Amiri', serif",
};

/* ─── CONTENT DATA ─── */
const PRAYERS = [
  {
    ar: "\u0641\u064E\u062C\u0652\u0631",
    en: "Fajr",
    time: "~5:15 AM",
    label: "Pre-dawn",
    hour: 5.25,
    character: "The Quiet One",
    desc: "The world is still asleep. And you are awake, standing before your Creator in the stillness. Fajr costs you sleep. That is what makes it powerful.",
    icon: "\u263D",
  },
  {
    ar: "\u0638\u064F\u0647\u0652\u0631",
    en: "Dhuhr",
    time: "~12:30 PM",
    label: "Midday",
    hour: 12.5,
    character: "The Pause",
    desc: "You are in your busiest hours. Everything demands your attention. Dhuhr pulls you out and says: remember who you really work for.",
    icon: "\u2600",
  },
  {
    ar: "\u0639\u064E\u0635\u0652\u0631",
    en: "'Asr",
    time: "~3:30 PM",
    label: "Afternoon",
    hour: 15.5,
    character: "The Bridge",
    desc: "The day winds down. 'Asr bridges your productive hours and evening rest. The Prophet \uFDFA warned about missing this one.",
    icon: "\u25D0",
  },
  {
    ar: "\u0645\u064E\u063A\u0652\u0631\u0650\u0628",
    en: "Maghrib",
    time: "~6:15 PM",
    label: "Sunset",
    hour: 18.25,
    character: "The Urgent One",
    desc: "The sky changes colour. Maghrib has the shortest window. You pray right as the sun disappears. A beautiful urgency.",
    icon: "\u25D1",
  },
  {
    ar: "\u0639\u0650\u0634\u064E\u0627\u0621",
    en: "'Isha'",
    time: "~8:00 PM",
    label: "Night",
    hour: 20,
    character: "The Final Word",
    desc: "Your final conversation of the day. 'Isha' bookends your day: you began with Allah, and you end with Him.",
    icon: "\u2605",
  },
];

const CEO_SCHEDULE = [
  { hour: 6, label: "Morning Brief", icon: "\uD83D\uDCCB" },
  { hour: 12.5, label: "Partner Lunch", icon: "\uD83E\uDD1D" },
  { hour: 15.5, label: "Board Call", icon: "\uD83D\uDCDE" },
  { hour: 18, label: "Strategy Review", icon: "\uD83D\uDCCA" },
  { hour: 20.5, label: "Reflection", icon: "\uD83D\uDCDD" },
];

const SWIPE_CARDS = [
  { text: "A daily meeting with Allah", correct: "right", rightFb: "Exactly! Your personal audience with the Creator, five times a day.", wrongFb: "This IS what salah is: a daily meeting with Allah." },
  { text: "Something only scholars do", correct: "left", rightFb: "Right! Salah is for every Muslim, scholar or not.", wrongFb: "Salah is not limited to scholars. Every adult Muslim must pray." },
  { text: "The second pillar of Islam", correct: "right", rightFb: "Correct. Right after the shahadah. That is how central it is.", wrongFb: "This IS salah: the second pillar of Islam." },
  { text: "An optional extra devotion", correct: "left", rightFb: "Correct! The five daily prayers are obligatory, not optional.", wrongFb: "The five daily prayers are obligatory, not a choice." },
  { text: "Has fixed times each day", correct: "right", rightFb: "Yes! Each has a window: 'a decree of specified times.'", wrongFb: "This IS salah. Quran 4:103: 'a decree of specified times.'" },
  { text: "A one-time event like Hajj", correct: "left", rightFb: "Right! Hajj is once. Salah is five times EVERY day.", wrongFb: "Salah is five times every single day, the opposite of once." },
];

const RAPID_FIRE = [
  { text: "Salah is performed 3 times a day.", answer: false, explanation: "Five, not three." },
  { text: "Salah is the second pillar of Islam.", answer: true, explanation: "Right after the shahadah." },
  { text: "The Prophet \uFDFA compared salah to bathing in a river.", answer: true, explanation: "Bukhari 528: five daily prayers cleanse sins like a river removes dirt." },
  { text: "Fajr prayer is performed at sunset.", answer: false, explanation: "Fajr is pre-dawn. Maghrib is sunset." },
  { text: "Every Muslim must pray. It is not optional.", answer: true, explanation: "Salah is fard (obligatory)." },
];

const MC_OPTIONS = [
  { id: "A", text: "Salah is physically cleansing, like a bath.", correct: false, feedback: "Spiritual, not physical. He was talking about sins, not dirt." },
  { id: "B", text: "Regular salah washes away sins, like bathing removes dirt.", correct: true, feedback: "Exactly! Repetition is the point: continuous purification.", bridge: "Next: learn to prepare with wudu." },
  { id: "C", text: "You should perform wudu in a river.", correct: false, feedback: "The river was a metaphor, not a recommendation." },
  { id: "D", text: "Salah is only valuable if done perfectly.", correct: false, feedback: "Frequency matters more than perfection." },
];

const REFLECTIONS = [
  { text: "I pray all five consistently.", response: "Masha'Allah. This module deepens what you already practise." },
  { text: "I pray some but not all five.", response: "Great starting point. This module helps you build from here." },
  { text: "I pray occasionally.", response: "No guilt. Understanding comes first. Habit follows." },
  { text: "I don't pray yet but want to learn.", response: "You are in exactly the right place." },
  { text: "I'm not sure why salah matters.", response: "That is what this module answers. Stay with us." },
];

/* ─── UTILITIES ─── */
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export default function DEANYS2L1({ onBack, onHome }) {
  const [page, setPage] = useState(0);
  const [scores, setScores] = useState({ q1: 0, q2: 0, q3: 0, q4: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goToPage = useCallback((p) => {
    setPage(p);
    /* DEANY rule: scroll-to-top on every page transition */
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }, [reducedMotion]);

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);

  const totalPages = 12;
  const progress = Math.min(100, Math.round(((page + 1) / totalPages) * 100));

  const pages = [
    <PageBridge key={0} onNext={nextPage} rm={reducedMotion} />,
    <PageDiscoveryClocks key={1} onNext={nextPage} rm={reducedMotion} />,
    <PageTeachingSectionA key={2} onNext={nextPage} rm={reducedMotion} />,
    <PageQ1Swipe key={3} onDone={(s) => { setScores((p) => ({ ...p, q1: s })); nextPage(); }} rm={reducedMotion} />,
    <PageFivePrayers key={4} onNext={nextPage} rm={reducedMotion} />,
    <PageQ2Match key={5} onDone={(s) => { setScores((p) => ({ ...p, q2: s })); nextPage(); }} rm={reducedMotion} />,
    <PageSectionC key={6} onNext={nextPage} rm={reducedMotion} />,
    <PageQ3RapidFire key={7} onDone={(s) => { setScores((p) => ({ ...p, q3: s })); nextPage(); }} rm={reducedMotion} />,
    <PageQ4MC key={8} onDone={(s) => { setScores((p) => ({ ...p, q4: s })); nextPage(); }} rm={reducedMotion} />,
    <PageQ5Reflect key={9} onDone={nextPage} rm={reducedMotion} />,
    <PageTakeaway key={10} onNext={nextPage} rm={reducedMotion} />,
    <PageCheckpoint key={11} scores={scores} total={scores.q1 + scores.q2 + scores.q3 + scores.q4} rm={reducedMotion} />,
  ];

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", background: T.cream, position: "relative" }}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Geometric background texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.025,
          pointerEvents: "none",
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C5A55A' stroke-width='.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sticky progress bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: T.cream + "ee",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid " + T.gold + "22",
        }}
      >
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: FONT.ui, fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: 2 }}>S2.1</span>
          <div style={{ flex: 1, background: T.gold + "18", borderRadius: 20, height: 5, overflow: "hidden" }}>
            <div
              aria-label={"Lesson progress: " + progress + " percent"}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, " + T.gold + ", " + T.teal + ")",
                borderRadius: 20,
                width: progress + "%",
                transition: reducedMotion ? "none" : "width 0.5s ease",
              }}
            />
          </div>
          <span style={{ fontFamily: FONT.ui, fontSize: 11, color: T.grayMed }}>{page + 1}/{totalPages}</span>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "20px 18px 100px", minHeight: "calc(100vh - 46px)" }}>
        <div key={page} style={{ animation: reducedMotion ? "none" : "deanyFadeUp 0.35s ease" }}>
          {pages[page]}
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes deanyFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes deanyPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @keyframes deanySlideIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes deanyPopIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes deanyConfetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(260px) rotate(400deg); opacity: 0; } }
        @keyframes deanyShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes deanyGlow { 0%, 100% { filter: drop-shadow(0 0 3px ${T.gold}44); } 50% { filter: drop-shadow(0 0 10px ${T.gold}88); } }
        * { box-sizing: border-box; }
        input[type=range] { accent-color: ${T.gold}; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function PrimaryButton({ children, onClick, variant = "gold", style: extraStyle, disabled, ...rest }) {
  const variants = {
    gold: {
      background: "linear-gradient(135deg, " + T.gold + ", #D4B56A)",
      color: T.navy,
      boxShadow: "0 4px 16px " + T.gold + "44",
      border: "none",
    },
    teal: {
      background: T.tealLight,
      color: T.teal,
      border: "1.5px solid " + T.teal,
    },
    ghost: {
      background: "transparent",
      color: T.navy,
      border: "1.5px solid " + T.gold,
    },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: 12,
        padding: "14px 36px",
        fontSize: 15,
        fontWeight: 700,
        fontFamily: FONT.ui,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s",
        opacity: disabled ? 0.5 : 1,
        ...variants[variant],
        ...extraStyle,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function AccentBox({ color, bg, children, style: extraStyle }) {
  return (
    <div
      style={{
        border: "2px solid " + color,
        background: bg,
        borderRadius: 16,
        padding: "20px 24px",
        margin: "18px 0",
        position: "relative",
        overflow: "hidden",
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

function Tag({ children, color, bg }) {
  return (
    <span
      style={{
        fontFamily: FONT.ui,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 12px",
        borderRadius: 20,
        background: bg || color,
        color: bg ? color : "#fff",
        letterSpacing: 0.5,
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ icon, text, color }) {
  return (
    <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: 12, color: color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
      {icon} {text}
    </div>
  );
}

function PageTitle({ sub, title, accent }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {sub && (
        <div style={{ fontFamily: FONT.ui, fontSize: 12, fontWeight: 600, color: accent || T.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
          {sub}
        </div>
      )}
      <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: T.navy, margin: 0, lineHeight: 1.3 }}>{title}</h2>
    </div>
  );
}

function Prose({ children }) {
  return <p style={{ fontFamily: FONT.body, fontSize: 15.5, lineHeight: 1.8, color: T.grayDark, margin: "0 0 14px" }}>{children}</p>;
}

/* ═══════════════════════════════════════════════════════════════
   INTERACTIVE 24-HOUR CLOCK — REDESIGNED
   Bigger canvas, labels outside the ring with callout lines,
   day/night gradient, clear visual hierarchy
   ═══════════════════════════════════════════════════════════════ */
function DayClock({ markers, title, subtitle, bgColor, markerColor, accentColor, textColor, rm }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [visibleSet, setVisibleSet] = useState(new Set());

  useEffect(() => {
    if (rm) {
      setVisibleSet(new Set(markers.map((_, i) => i)));
      return;
    }
    markers.forEach((_, i) =>
      setTimeout(() => setVisibleSet((prev) => { const n = new Set(prev); n.add(i); return n; }), 300 + i * 350)
    );
  }, [rm, markers]);

  /* Layout constants for a 380x380 viewBox */
  const W = 380;
  const cx = W / 2;
  const cy = W / 2;
  const ringR = 120;           /* main clock ring radius */
  const tickOuterR = ringR;
  const majorTickLen = 10;
  const minorTickLen = 5;
  const hourLabelR = ringR + 18; /* 12AM / 6AM / 12PM / 6PM */
  const markerR = ringR - 20;   /* markers sit just inside the ring */
  const labelR = ringR + 42;    /* labels sit well outside the ring */

  /* Smart text-anchor based on angle */
  const getAnchor = (angleDeg) => {
    const norm = ((angleDeg % 360) + 360) % 360;
    if (norm > 100 && norm < 260) return "middle"; /* bottom-ish */
    if (norm >= 260 || norm <= 100) {
      if (norm > 180) return "end";
      return "start";
    }
    return "middle";
  };

  const getAnchorForLabel = (angleDeg) => {
    const norm = ((angleDeg % 360) + 360) % 360;
    if (norm > 45 && norm < 135) return "start";      /* right side */
    if (norm >= 135 && norm <= 225) return "middle";   /* bottom */
    if (norm > 225 && norm < 315) return "end";        /* left side */
    return "middle";                                    /* top */
  };

  return (
    <div
      style={{
        background: bgColor,
        borderRadius: 24,
        padding: "22px 16px 16px",
        textAlign: "center",
        flex: "1 1 280px",
        minWidth: 260,
        position: "relative",
        overflow: "hidden",
        border: "1px solid " + accentColor + "22",
        boxShadow: "0 4px 20px " + accentColor + "10",
      }}
      role="img"
      aria-label={title + ": " + markers.map((m) => m.label + (m.time ? " at " + m.time : "")).join(", ")}
    >
      {/* Atmosphere gradient */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, background: "radial-gradient(circle at 30% 70%, " + accentColor + ", transparent 55%)" }} />

      <div style={{ position: "relative" }}>
        {/* Title */}
        <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: 15, color: textColor, letterSpacing: 1 }}>{title}</div>
        <div style={{ fontFamily: FONT.ui, fontSize: 11, color: textColor + "77", marginBottom: 6 }}>{subtitle}</div>

        <svg viewBox={"0 0 " + W + " " + W} width="100%" style={{ maxWidth: 340 }}>

          {/* Clock face - clean light fill */}
          <circle cx={cx} cy={cy} r={ringR - 1} fill="#FFFFFF" opacity={0.6} />

          {/* Outer decorative ring */}
          <circle cx={cx} cy={cy} r={ringR + 14} fill="none" stroke={accentColor} strokeWidth={0.5} opacity={0.2} />

          {/* Main clock ring */}
          <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={accentColor} strokeWidth={2} opacity={0.6} />

          {/* 24-hour tick marks */}
          {Array.from({ length: 24 }, (_, i) => {
            const angleDeg = (i / 24) * 360 - 90;
            const angle = angleDeg * (Math.PI / 180);
            const isMajor = i % 6 === 0;
            const len = isMajor ? majorTickLen : minorTickLen;
            return (
              <line
                key={i}
                x1={cx + tickOuterR * Math.cos(angle)}
                y1={cy + tickOuterR * Math.sin(angle)}
                x2={cx + (tickOuterR - len) * Math.cos(angle)}
                y2={cy + (tickOuterR - len) * Math.sin(angle)}
                stroke={accentColor}
                strokeWidth={isMajor ? 2 : 0.8}
                opacity={isMajor ? 0.6 : 0.3}
                strokeLinecap="round"
              />
            );
          })}

          {/* Cardinal hour labels: 12AM, 6AM, 12PM, 6PM */}
          {[0, 6, 12, 18].map((h, idx) => {
            const angleDeg = (h / 24) * 360 - 90;
            const angle = angleDeg * (Math.PI / 180);
            const labels = ["12AM", "6AM", "12PM", "6PM"];
            return (
              <text
                key={h}
                x={cx + hourLabelR * Math.cos(angle)}
                y={cy + hourLabelR * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={9}
                fill={accentColor}
                opacity={0.7}
                fontFamily={FONT.ui}
                fontWeight={600}
              >
                {labels[idx]}
              </text>
            );
          })}

          {/* Centre dot */}
          <circle cx={cx} cy={cy} r={3} fill={accentColor} opacity={0.25} />

          {/* Markers + callout lines + labels */}
          {markers.map((m, i) => {
            const angleDeg = (m.hour / 24) * 360 - 90;
            const angle = angleDeg * (Math.PI / 180);
            const mx = cx + markerR * Math.cos(angle);
            const my = cy + markerR * Math.sin(angle);
            const isVisible = visibleSet.has(i);
            const isHovered = hoveredIdx === i;

            /* Label outside the ring */
            const lx = cx + labelR * Math.cos(angle);
            const ly = cy + labelR * Math.sin(angle);

            /* Callout line endpoints: from ring to label area */
            const lineStartR = ringR + 2;
            const lineEndR = labelR - 14;
            const lsx = cx + lineStartR * Math.cos(angle);
            const lsy = cy + lineStartR * Math.sin(angle);
            const lex = cx + lineEndR * Math.cos(angle);
            const ley = cy + lineEndR * Math.sin(angle);

            /* Smart text anchoring */
            const anchor = getAnchorForLabel(((angleDeg + 90) % 360 + 360) % 360);

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(i)}
                onBlur={() => setHoveredIdx(null)}
                tabIndex={0}
                role="button"
                aria-label={m.label + (m.time ? " at " + m.time : "")}
                style={{
                  cursor: "pointer",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0)",
                  transformOrigin: mx + "px " + my + "px",
                  transition: rm ? "none" : "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) " + i * 0.15 + "s",
                }}
              >
                {/* Hover glow */}
                {isHovered && <circle cx={mx} cy={my} r={22} fill={markerColor + "18"} />}

                {/* Marker circle */}
                <circle
                  cx={mx}
                  cy={my}
                  r={isHovered ? 16 : 12}
                  fill={markerColor}
                  stroke={textColor + "44"}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{
                    transition: "all 0.2s",
                    filter: isHovered ? "drop-shadow(0 0 10px " + markerColor + "99)" : "none",
                  }}
                />

                {/* Icon inside marker */}
                <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="central" fontSize={isHovered ? 14 : 11}>
                  {m.icon}
                </text>

                {/* Callout line from ring to label */}
                <line
                  x1={lsx}
                  y1={lsy}
                  x2={lex}
                  y2={ley}
                  stroke={accentColor}
                  strokeWidth={isHovered ? 1.5 : 0.8}
                  opacity={isHovered ? 0.8 : 0.45}
                  strokeDasharray={isHovered ? "none" : "2 2"}
                  style={{ transition: "all 0.2s" }}
                />

                {/* Label outside the ring */}
                <text
                  x={lx}
                  y={ly - (m.time ? 5 : 0)}
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fontSize={isHovered ? 12 : 10.5}
                  fontFamily={FONT.ui}
                  fontWeight={700}
                  fill={textColor}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: "all 0.2s" }}
                >
                  {m.label}
                </text>

                {/* Time below label (if available) */}
                {m.time && (
                  <text
                    x={lx}
                    y={ly + (m.time ? 9 : 0)}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fontSize={8.5}
                    fontFamily={FONT.ui}
                    fontWeight={500}
                    fill={textColor}
                    opacity={isHovered ? 1 : 0.7}
                    style={{ transition: "all 0.2s" }}
                  >
                    {m.time}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover detail card (below SVG, not overlapping) */}
        {hoveredIdx !== null && markers[hoveredIdx] && (
          <div
            style={{
              marginTop: 4,
              padding: "8px 14px",
              background: accentColor + "15",
              borderRadius: 10,
              fontFamily: FONT.ui,
              fontSize: 12,
              color: textColor,
              border: "1px solid " + accentColor + "30",
              animation: rm ? "none" : "deanyFadeUp 0.15s ease",
            }}
          >
            <strong>{markers[hoveredIdx].icon} {markers[hoveredIdx].label}</strong>
            {markers[hoveredIdx].time && <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 11 }}>{markers[hoveredIdx].time}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 0: BRIDGE
   ═══════════════════════════════════════════════════════════════ */
function PageBridge({ onNext, rm }) {
  return (
    <div>
      {/* Hero card */}
      <div
        style={{
          background: "linear-gradient(135deg, " + T.navy + ", " + T.navyDeep + ")",
          borderRadius: 24,
          padding: "48px 28px 40px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            background: "radial-gradient(circle at 80% 20%, " + T.gold + ", transparent 50%), radial-gradient(circle at 20% 80%, " + T.teal + ", transparent 50%)",
          }}
        />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontFamily: FONT.ui, fontSize: 11, fontWeight: 600, color: T.gold, letterSpacing: 3 }}>LESSON S2.1</div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 32, fontWeight: 900, color: "#fff", margin: "8px 0", lineHeight: 1.2 }}>
            "The Five Daily
            <br />
            Appointments"
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, fontFamily: FONT.ui, fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 14 }}>
            <span>10 min</span>
            <span>5 questions</span>
            <span>Level 1-2</span>
          </div>
        </div>
      </div>

      {/* Bridge box */}
      <AccentBox color={T.teal} bg={T.tealLight}>
        <SectionLabel icon="🔗" text="Bridge" color={T.teal} />
        <Prose>
          In the last module, you learned what it means to <em>believe</em>. You explored the shahadah. But belief is not something you carry quietly. Islam gave you a way to <strong style={{ color: T.navy }}>LIVE</strong> it, five times every single day.
        </Prose>
        <Prose>Welcome to salah.</Prose>
      </AccentBox>

      {/* Objective box */}
      <AccentBox color={T.gold} bg={T.goldLight}>
        <SectionLabel icon="🎯" text="Objective" color={T.gold} />
        <div style={{ fontFamily: FONT.body, fontSize: 14.5, color: T.grayDark }}>
          <p style={{ margin: "0 0 4px", fontWeight: 600, color: T.navy }}>By the end, you will be able to:</p>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
            <li>Explain why salah holds a unique rank among worship.</li>
            <li>Name all five daily prayers and their times.</li>
            <li>Describe salah as a "structured meeting" with Allah.</li>
          </ol>
        </div>
      </AccentBox>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <PrimaryButton onClick={onNext} aria-label="Begin lesson">Let's Begin</PrimaryButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 1: DISCOVERY CLOCKS
   ═══════════════════════════════════════════════════════════════ */
function PageDiscoveryClocks({ onNext, rm }) {
  const [revealed, setRevealed] = useState(false);
  const prayerMarkers = PRAYERS.map((p) => ({ label: p.en, icon: p.icon, hour: p.hour, time: p.time }));

  return (
    <div>
      <PageTitle sub="Discovery Moment" title="Two Days, Two Schedules" accent={T.purple} />

      <AccentBox color={T.purple} bg="#F8F4FD" style={{ padding: "16px 20px" }}>
        <Prose>
          <strong style={{ color: T.purple }}>Before we teach anything</strong> - look at these two schedules. One belongs to a CEO. The other to a Muslim.{" "}
          <em>What do they have in common?</em>
        </Prose>
      </AccentBox>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "20px 0" }}>
        <DayClock markers={CEO_SCHEDULE} title="A CEO's Day" subtitle="5 non-negotiable meetings" bgColor="#EDF1F7" markerColor={T.navy} accentColor={T.navy} textColor={T.navy} rm={rm} />
        <DayClock markers={prayerMarkers} title="A Muslim's Day" subtitle="5 appointments with Allah" bgColor={T.goldPale} markerColor={T.teal} accentColor={T.navy} textColor={T.navy} rm={rm} />
      </div>

      <div style={{ textAlign: "center", fontFamily: FONT.ui, fontSize: 12, color: T.grayMed, fontStyle: "italic", margin: "4px 0 18px" }}>
        Hover or tap any marker to explore
      </div>

      {!revealed ? (
        <div style={{ textAlign: "center" }}>
          <PrimaryButton onClick={() => setRevealed(true)} style={{ animation: rm ? "none" : "deanyPulse 2s infinite" }}>
            I see it - show me
          </PrimaryButton>
        </div>
      ) : (
        <div style={{ animation: rm ? "none" : "deanyFadeUp 0.35s ease" }}>
          <AccentBox color={T.gold} bg={T.goldPale}>
            <Prose>
              Both have <strong style={{ color: T.navy }}>FIVE structured appointments</strong> throughout the day. The CEO plans everything around them, because they are the most important things they do.
            </Prose>
            <Prose>
              <strong style={{ color: T.navy }}>Salah works the same way.</strong> Except your meetings are with the <em>Creator of the heavens and the earth.</em>
            </Prose>
          </AccentBox>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 2: TEACHING SECTION A
   ═══════════════════════════════════════════════════════════════ */
function PageTeachingSectionA({ onNext }) {
  return (
    <div>
      <PageTitle sub="Section A" title="Your Standing Appointment" />

      <Prose>
        <strong style={{ color: T.navy }}>Salah</strong> <span dir="rtl" lang="ar" style={{ fontFamily: FONT.arabic, color: T.gold, fontSize: 17 }}>(صَلاة)</span> is the Arabic word for the formal prayer every Muslim performs. It is the second pillar of Islam, right after the shahadah.
      </Prose>

      <AccentBox color={T.teal} bg={T.tealLight}>
        <SectionLabel icon="📖" text="Hadith" color={T.teal} />
        <p style={{ fontFamily: FONT.body, fontSize: 15, fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.8 }}>
          "The five daily prayers and one Friday prayer to the next are an expiation for whatever comes between them, so long as major sins are avoided."
        </p>
        <p style={{ margin: 0, fontFamily: FONT.ui, fontSize: 11, color: T.grayMed }}>(Sahih Muslim 233)</p>
      </AccentBox>

      <AccentBox color={T.teal} bg={T.tealLight} style={{ borderLeft: "5px solid " + T.gold }}>
        <SectionLabel icon="📖" text="Quran" color={T.teal} />
        <p style={{ fontFamily: FONT.body, fontSize: 15, fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.8 }}>
          "Indeed, prayer has been decreed upon the believers a decree of specified times."
        </p>
        <p style={{ margin: 0, fontFamily: FONT.ui, fontSize: 11, color: T.grayMed }}>(Quran 4:103, Saheeh International)</p>
      </AccentBox>

      <Prose>When Allah says "a decree of specified times," He means it literally. You show up when He says. That is what makes it an <em>appointment</em>.</Prose>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <PrimaryButton onClick={onNext}>Test What I've Learned</PrimaryButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 3: Q1 SWIPE SORT
   Fixed: adds advance button after completion, keyboard arrows
   ═══════════════════════════════════════════════════════════════ */
function PageQ1Swipe({ onDone, rm }) {
  const [cardIdx, setCardIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const cards = useMemo(() => shuffle(SWIPE_CARDS), []);

  const swipe = useCallback(
    (direction) => {
      if (result) return;
      const card = cards[cardIdx];
      const isCorrect = direction === card.correct;
      const feedback = isCorrect ? card.rightFb : card.wrongFb;
      setResult({ ok: isCorrect, fb: feedback });
      setAllResults((prev) => [...prev, isCorrect]);
      setStreak((s) => (isCorrect ? s + 1 : 0));
      setDragX(0);

      setTimeout(() => {
        setResult(null);
        if (cardIdx + 1 >= cards.length) {
          /* Don't auto-advance. Show results, let user click to proceed. */
        } else {
          setCardIdx((i) => i + 1);
        }
      }, 1800);
    },
    [cardIdx, cards, result]
  );

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (result || cardIdx >= cards.length) return;
      if (e.key === "ArrowLeft") swipe("left");
      if (e.key === "ArrowRight") swipe("right");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [swipe, result, cardIdx, cards.length]);

  const isComplete = cardIdx >= cards.length - 1 && result === null && allResults.length === cards.length;
  const score = allResults.filter(Boolean).length;

  /* Results view with advance button */
  if (isComplete) {
    return (
      <div>
        <PageTitle sub="Question 1 Results" title={score + "/" + cards.length} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "2px solid " + (allResults[i] ? T.green : T.coral),
                background: allResults[i] ? T.greenLight : T.coralLight,
                fontFamily: FONT.ui,
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.text}</div>
              <div style={{ fontSize: 11, color: T.grayMed }}>{c.correct === "right" ? "Salah" : "Not salah"}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <PrimaryButton onClick={() => onDone(score)}>Continue</PrimaryButton>
        </div>
      </div>
    );
  }

  const card = cards[cardIdx];
  const rotation = (dragX / 400) * 15;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <PageTitle sub="Question 1" title="Salah or Not?" />
        <Tag color="#fff" bg={T.magenta}>PLAY</Tag>
      </div>

      <Prose>"Swipe RIGHT for salah. LEFT for not."</Prose>

      {streak > 1 && (
        <div style={{ textAlign: "center", fontFamily: FONT.ui, fontSize: 13, color: T.coral, marginBottom: 6 }}>
          🔥 {streak}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.ui, fontSize: 12, fontWeight: 600, marginBottom: 6, padding: "0 4px" }}>
        <span style={{ color: T.coral, opacity: 0.4 + Math.max(0, -dragX / 200) * 0.6 }}>NOT SALAH</span>
        <span style={{ color: T.grayMed, fontSize: 10 }}>{cardIdx + 1}/{cards.length}</span>
        <span style={{ color: T.teal, opacity: 0.4 + Math.max(0, dragX / 200) * 0.6 }}>SALAH</span>
      </div>

      {!result ? (
        <>
          <div
            onPointerDown={(e) => { startX.current = e.clientX; setDragging(true); }}
            onPointerMove={(e) => { if (dragging) setDragX(e.clientX - startX.current); }}
            onPointerUp={() => { setDragging(false); if (Math.abs(dragX) > 70) swipe(dragX > 0 ? "right" : "left"); else setDragX(0); }}
            onPointerLeave={() => { setDragging(false); setDragX(0); }}
            role="button"
            aria-label={"Card: " + card.text + ". Swipe right for salah, left for not salah."}
            tabIndex={0}
            style={{
              background: "#fff",
              border: "1.5px solid " + T.grayLight,
              borderRadius: 16,
              padding: "36px 24px",
              textAlign: "center",
              fontFamily: FONT.display,
              fontSize: 20,
              fontWeight: 600,
              color: T.navy,
              cursor: "grab",
              userSelect: "none",
              boxShadow: "0 4px 20px " + T.gold + "12",
              transform: rm ? "none" : "translateX(" + dragX + "px) rotate(" + rotation + "deg)",
              transition: dragging ? "none" : rm ? "none" : "transform 0.15s",
              touchAction: "pan-y",
            }}
          >
            {card.text}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18 }}>
            <PrimaryButton onClick={() => swipe("left")} variant="ghost" style={{ borderColor: T.coral, color: T.coral, padding: "12px 22px" }} aria-label="Not salah">
              No
            </PrimaryButton>
            <PrimaryButton onClick={() => swipe("right")} variant="ghost" style={{ borderColor: T.teal, color: T.teal, padding: "12px 22px" }} aria-label="Yes, salah">
              Yes
            </PrimaryButton>
          </div>
        </>
      ) : (
        <AccentBox color={result.ok ? T.green : T.coral} bg={result.ok ? T.greenLight : T.coralLight}>
          <div style={{ textAlign: "center", fontSize: 26, marginBottom: 6 }}>{result.ok ? "✓" : "✗"}</div>
          <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 14, textAlign: "center" }}>{result.fb}</p>
        </AccentBox>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 4: FIVE PRAYERS (accordion + clock)
   ═══════════════════════════════════════════════════════════════ */
function PageFivePrayers({ onNext, rm }) {
  const [expanded, setExpanded] = useState(null);
  const prayerMarkers = PRAYERS.map((p) => ({ label: p.en, icon: p.icon, hour: p.hour, time: p.time }));

  return (
    <div>
      <PageTitle sub="Section B" title="Meet the Five Prayers" />
      <Prose>"Each prayer has a name, a time, and a character."</Prose>

      <div style={{ margin: "18px 0" }}>
        <DayClock
          markers={prayerMarkers}
          title="Your Daily Rhythm"
          subtitle="5 prayers across 24 hours"
          bgColor={T.tealLight}
          markerColor={T.gold}
          accentColor={T.navy}
          textColor={T.navy}
          rm={rm}
        />
      </div>

      {/* Accordion prayer cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0" }}>
        {PRAYERS.map((prayer, i) => {
          const isOpen = expanded === i;
          return (
            <div
              key={i}
              onClick={() => setExpanded(isOpen ? null : i)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={prayer.en + " prayer details"}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(isOpen ? null : i); } }}
              style={{
                background: isOpen ? T.goldPale : "#fff",
                border: "1.5px solid " + (isOpen ? T.gold : T.grayLight),
                borderRadius: 14,
                padding: "14px 18px",
                cursor: "pointer",
                transition: "all 0.2s",
                borderLeft: "4px solid " + (isOpen ? T.gold : T.grayLight),
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{prayer.icon}</span>
                  <div>
                    <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: 14, color: T.navy }}>
                      {prayer.en}{" "}
                      <span dir="rtl" lang="ar" style={{ fontFamily: FONT.arabic, color: T.gold, fontSize: 15 }}>
                        ({prayer.ar})
                      </span>
                    </div>
                    <div style={{ fontFamily: FONT.ui, fontSize: 11, color: T.grayMed }}>
                      {prayer.character} · {prayer.label} · {prayer.time}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 16, color: T.gold, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>▸</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid " + T.gold + "33", animation: rm ? "none" : "deanySlideIn 0.2s" }}>
                  <p style={{ fontFamily: FONT.body, fontSize: 13.5, lineHeight: 1.8, color: T.grayDark, margin: 0 }}>{prayer.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <PrimaryButton onClick={onNext}>Test What I've Learned</PrimaryButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 5: Q2 MATCH PAIRS
   Place all 5 prayers into slots freely. Submit to check.
   Wrong ones eject. Correct ones lock in green.
   ═══════════════════════════════════════════════════════════════ */
function PageQ2Match({ onDone, rm }) {
  const [selected, setSelected] = useState(null);
  const [placements, setPlacements] = useState({});
  const [locked, setLocked] = useState({});
  const [results, setResults] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [ejecting, setEjecting] = useState(false);
  const [lastRoundInfo, setLastRoundInfo] = useState(null);
  const shuffledPrayers = useMemo(() => shuffle(PRAYERS.map((p, i) => ({ ...p, idx: i }))), []);

  /* placements and locked are mutually exclusive: placements = pending, locked = confirmed correct */
  const allSlotsFilled = Object.keys(locked).length + Object.keys(placements).length === 5;
  const allCorrect = Object.keys(locked).length === 5;

  const placeInSlot = (slotIdx) => {
    if (selected === null || locked[slotIdx] !== undefined || ejecting) return;
    const updated = { ...placements };
    Object.keys(updated).forEach((k) => {
      if (updated[k] === selected) delete updated[k];
    });
    updated[slotIdx] = selected;
    setPlacements(updated);
    setSelected(null);
    setResults(null);
  };

  const removeFromSlot = (slotIdx) => {
    if (locked[slotIdx] !== undefined || ejecting) return;
    const updated = { ...placements };
    delete updated[slotIdx];
    setPlacements(updated);
    setResults(null);
  };

  const handleSubmit = () => {
    const newResults = {};
    const newLocked = { ...locked };
    let hasWrong = false;

    Object.entries(placements).forEach(([slotIdx, shuffledIdx]) => {
      const prayer = shuffledPrayers[shuffledIdx];
      const isCorrect = prayer.idx === parseInt(slotIdx);
      newResults[slotIdx] = isCorrect;
      if (isCorrect) {
        newLocked[slotIdx] = shuffledIdx;
      } else {
        hasWrong = true;
      }
    });

    setResults(newResults);
    setLocked(newLocked);
    setAttempt((a) => a + 1);

    const wrongCount = Object.values(newResults).filter((r) => r === false).length;
    const correctCount = Object.values(newResults).filter((r) => r === true).length;
    setLastRoundInfo({ wrong: wrongCount, correct: correctCount });

    if (hasWrong) {
      setEjecting(true);
      setTimeout(() => {
        setPlacements({});
        setEjecting(false);
        setResults(null);
      }, 2500);
    } else {
      setPlacements({});
    }
  };

  const handleDone = () => {
    const score = attempt === 1 ? 5 : attempt === 2 ? 2.5 : 0;
    onDone(score);
  };

  const placedIndices = new Set([...Object.values(placements), ...Object.values(locked)]);
  const lockedIndices = new Set();
  Object.values(locked).forEach((shuffledIdx) => {
    lockedIndices.add(shuffledIdx);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <PageTitle sub="Question 2" title="Match the Pairs" />
        <Tag color="#fff" bg={T.teal}>SORT</Tag>
      </div>

      <Prose>"Match each prayer to its time of day, then submit."</Prose>

      {/* Ejecting feedback: show how many wrong */}
      {ejecting && lastRoundInfo && (
        <AccentBox color={T.coral} bg={T.coralLight}>
          <p style={{ margin: "0 0 4px", fontFamily: FONT.ui, fontWeight: 700, color: T.coral }}>
            {lastRoundInfo.wrong} {lastRoundInfo.wrong === 1 ? "pair" : "pairs"} wrong
          </p>
          <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 13.5 }}>
            {lastRoundInfo.correct > 0
              ? lastRoundInfo.correct + " correct " + (lastRoundInfo.correct === 1 ? "pair is" : "pairs are") + " locked in. The wrong " + (lastRoundInfo.wrong === 1 ? "one is" : "ones are") + " being removed."
              : "All " + lastRoundInfo.wrong + " pairs are being removed. Try again."}
          </p>
        </AccentBox>
      )}

      {/* Post-eject: tell user to try again */}
      {attempt > 0 && !allCorrect && !ejecting && (
        <AccentBox color={T.gold} bg={T.goldPale} style={{ padding: "14px 20px" }}>
          <p style={{ margin: 0, fontFamily: FONT.ui, fontSize: 13, color: T.navy }}>
            {Object.keys(locked).length > 0
              ? Object.keys(locked).length + " of 5 locked in. Match the remaining " + (5 - Object.keys(locked).length) + " and submit again."
              : "None matched yet. Place all 5 prayers and try again."}
          </p>
        </AccentBox>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 130px", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ fontFamily: FONT.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1 }}>PRAYERS</div>
          {shuffledPrayers.map((prayer, i) => {
            const isPlaced = placedIndices.has(i);
            const isLocked = lockedIndices.has(i);
            const isDisabled = isPlaced || ejecting;
            return (
              <button
                key={i}
                disabled={isDisabled}
                onClick={() => setSelected(selected === i ? null : i)}
                aria-label={prayer.en + (isLocked ? " (correct)" : isPlaced ? " (placed)" : "")}
                style={{
                  background: isLocked ? T.greenLight : selected === i ? T.goldPale : "#fff",
                  border: "2px solid " + (isLocked ? T.green : selected === i ? T.gold : isPlaced ? T.gold + "66" : T.grayLight),
                  borderLeft: "4px solid " + (isLocked ? T.green : T.gold),
                  borderRadius: 10,
                  padding: "11px 13px",
                  textAlign: "left",
                  fontFamily: FONT.ui,
                  fontWeight: 700,
                  fontSize: 13,
                  color: isLocked ? T.green : isPlaced ? T.grayMed : T.navy,
                  cursor: isDisabled ? "default" : "pointer",
                  opacity: isPlaced ? 0.4 : 1,
                  transition: "all 0.15s",
                }}
              >
                {prayer.en}
                {isLocked ? " \u2713" : ""}
              </button>
            );
          })}
        </div>

        <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ fontFamily: FONT.ui, fontSize: 10, fontWeight: 700, color: T.grayMed, letterSpacing: 1 }}>TIME</div>
          {PRAYERS.map((prayer, i) => {
            const placedIdx = placements[i];
            const hasPrayer = placedIdx !== undefined;
            const isLocked = locked[i] !== undefined;
            const result = results ? results[i] : null;

            let slotBg = "#fff";
            let slotBorder = "2px dashed " + T.grayMed;
            let slotColor = T.grayMed;
            let slotFontStyle = "italic";
            let slotAnimation = "none";
            let displayContent = prayer.label;

            if (isLocked) {
              const lockedIdx = locked[i];
              const p = shuffledPrayers[lockedIdx];
              if (p) {
                displayContent = <><strong style={{ color: T.navy }}>{p.en}</strong> {"\u2192"} {prayer.label} <span style={{ color: T.green }}>{"\u2713"}</span></>;
              }
              slotBg = T.greenLight;
              slotBorder = "2px solid " + T.green;
              slotColor = T.green;
              slotFontStyle = "normal";
            } else if (hasPrayer && result === false) {
              const p = shuffledPrayers[placedIdx];
              displayContent = <><strong style={{ color: T.coral }}>{p.en}</strong> <span style={{ fontSize: 11 }}>{"\u2717"} wrong</span></>;
              slotBg = T.coralLight;
              slotBorder = "2px solid " + T.coral;
              slotColor = T.coral;
              slotFontStyle = "normal";
              slotAnimation = rm ? "none" : "deanyShake 0.4s";
            } else if (hasPrayer) {
              const p = shuffledPrayers[placedIdx];
              displayContent = <><strong style={{ color: T.navy }}>{p.en}</strong> {"\u2192"} {prayer.label}</>;
              slotBg = T.goldPale;
              slotBorder = "2px solid " + T.gold;
              slotColor = T.navy;
              slotFontStyle = "normal";
            } else if (selected !== null) {
              slotBg = T.tealLight;
              slotBorder = "2px dashed " + T.teal;
            }

            return (
              <button
                key={i}
                onClick={() => {
                  if (isLocked || ejecting) return;
                  if (hasPrayer && !results) {
                    removeFromSlot(i);
                  } else if (selected !== null && !hasPrayer) {
                    placeInSlot(i);
                  }
                }}
                disabled={isLocked || ejecting}
                aria-label={prayer.label + (hasPrayer ? ", contains " + shuffledPrayers[placedIdx].en : "")}
                style={{
                  background: slotBg,
                  border: slotBorder,
                  borderRadius: 10,
                  padding: "11px 13px",
                  textAlign: "left",
                  fontFamily: FONT.body,
                  fontSize: 12.5,
                  color: slotColor,
                  fontStyle: slotFontStyle,
                  cursor: isLocked || ejecting ? "default" : "pointer",
                  transition: rm ? "none" : "all 0.15s",
                  animation: slotAnimation,
                }}
              >
                {displayContent}
              </button>
            );
          })}
        </div>
      </div>

      {Object.keys(placements).length > 0 && !Object.keys(locked).length && !results && !ejecting && (
        <div style={{ fontFamily: FONT.ui, fontSize: 11, color: T.grayMed, fontStyle: "italic", textAlign: "center", marginTop: 10 }}>
          Tap a filled slot to remove it
        </div>
      )}

      {allSlotsFilled && !allCorrect && !ejecting && !results && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
        </div>
      )}

      {allCorrect && (
        <>
          <AccentBox color={T.green} bg={T.greenLight}>
            <p style={{ margin: 0, fontFamily: FONT.ui, fontWeight: 600, color: T.green, textAlign: "center" }}>
              {attempt === 1 ? "All five correct on the first try! \uD83C\uDF89" : "All five matched! \uD83C\uDF89"}
            </p>
          </AccentBox>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <PrimaryButton onClick={handleDone}>Continue</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 6: SECTION C - WHY THIS PILLAR IS SPECIAL
   ═══════════════════════════════════════════════════════════════ */
function PageSectionC({ onNext }) {
  return (
    <div>
      <PageTitle sub="Section C" title="Why This Pillar is Special" />

      <Prose>Zakat? Once a year. Fasting? One month. Hajj? Once in a lifetime. But salah?</Prose>

      {/* Big "5x Daily" display */}
      <div
        style={{
          textAlign: "center",
          margin: "20px 0",
          padding: "28px 20px",
          background: "linear-gradient(135deg, " + T.navy + ", " + T.navyDeep + ")",
          borderRadius: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, background: "radial-gradient(circle at 50% 50%, " + T.gold + ", transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 38, fontWeight: 900, color: T.gold }}>5x Daily</div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>Every single day of your life</div>
        </div>
      </div>

      <AccentBox color={T.green} bg={T.greenLight}>
        <SectionLabel icon="💡" text="Did You Know?" color={T.green} />
        <p style={{ fontFamily: FONT.body, fontSize: 14.5, fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.8 }}>
          "The Prophet ﷺ said: 'If there was a river by your door and you bathed five times daily, would any dirt remain?' They said: 'No.' He said: 'That is the likeness of the five daily prayers.'"
        </p>
        <p style={{ margin: 0, fontFamily: FONT.ui, fontSize: 11, color: T.grayMed }}>(Bukhari 528, Muslim 667)</p>
      </AccentBox>

      <Prose>That river image is how the Prophet ﷺ described salah. It does not just structure your day. It <em>purifies</em> it.</Prose>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <PrimaryButton onClick={onNext}>Quick: Test My Memory</PrimaryButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 7: Q3 RAPID FIRE TRUE/FALSE
   Fixed: timer timeout handler, proper auto-advance
   ═══════════════════════════════════════════════════════════════ */
function PageQ3RapidFire({ onDone, rm }) {
  const questions = useMemo(() => shuffle(RAPID_FIRE), []);
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const [timerPct, setTimerPct] = useState(100);
  const timerRef = useRef(null);
  const answeredRef = useRef(false);

  const TIME_LIMIT_MS = 3000;

  useEffect(() => {
    if (idx >= questions.length || result) return;
    answeredRef.current = false;
    setTimerPct(100);
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / TIME_LIMIT_MS) * 100);
      setTimerPct(remaining);

      /* Timer ran out: auto-answer as wrong */
      if (remaining <= 0 && !answeredRef.current) {
        answeredRef.current = true;
        clearInterval(timerRef.current);
        const q = questions[idx];
        setResult({ ok: false, explanation: "Time's up! " + q.explanation });
        setAllResults((prev) => [...prev, false]);
        setStreak(0);

        setTimeout(() => {
          setResult(null);
          if (idx + 1 >= questions.length) {
            onDone([...allResults, false].filter(Boolean).length);
          } else {
            setIdx((i) => i + 1);
          }
        }, 2200);
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [idx, result]);

  const answerQuestion = (userAnswer) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    clearInterval(timerRef.current);

    const q = questions[idx];
    const isCorrect = userAnswer === q.answer;
    setResult({ ok: isCorrect, explanation: q.explanation });
    setAllResults((prev) => [...prev, isCorrect]);
    setStreak((s) => (isCorrect ? s + 1 : 0));

    setTimeout(() => {
      setResult(null);
      if (idx + 1 >= questions.length) {
        onDone([...allResults, isCorrect].filter(Boolean).length);
      } else {
        setIdx((i) => i + 1);
      }
    }, isCorrect ? 1400 : 2200);
  };

  if (idx >= questions.length) return null;

  const q = questions[idx];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <PageTitle sub="Question 3" title="Rapid Fire" />
        <Tag color="#fff" bg={T.magenta}>PLAY</Tag>
      </div>

      {streak > 1 && (
        <div style={{ textAlign: "center", fontFamily: FONT.ui, fontSize: 13, color: T.coral, marginBottom: 6 }}>🔥 {streak}</div>
      )}

      {/* Timer bar */}
      {!result && (
        <div style={{ height: 4, background: T.grayLight, borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, " + T.gold + ", " + T.teal + ")",
              width: timerPct + "%",
              transition: rm ? "none" : "width 0.1s linear",
              borderRadius: 4,
            }}
          />
        </div>
      )}

      <div style={{ fontFamily: FONT.ui, fontSize: 10, color: T.grayMed, marginBottom: 8 }}>
        {idx + 1}/5
      </div>

      {!result ? (
        <>
          <div
            style={{
              background: "#fff",
              border: "1.5px solid " + T.grayLight,
              borderRadius: 16,
              padding: "30px 22px",
              textAlign: "center",
              fontFamily: FONT.display,
              fontSize: 18,
              color: T.navy,
              boxShadow: "0 4px 16px " + T.gold + "10",
              marginBottom: 18,
            }}
          >
            {q.text}
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <PrimaryButton
              onClick={() => answerQuestion(true)}
              style={{ background: T.green, color: "#fff", padding: "14px 36px", fontSize: 16, border: "none" }}
              aria-label="True"
            >
              TRUE
            </PrimaryButton>
            <PrimaryButton
              onClick={() => answerQuestion(false)}
              style={{ background: T.coral, color: "#fff", padding: "14px 36px", fontSize: 16, border: "none" }}
              aria-label="False"
            >
              FALSE
            </PrimaryButton>
          </div>
        </>
      ) : (
        <AccentBox color={result.ok ? T.green : T.coral} bg={result.ok ? T.greenLight : T.coralLight}>
          <div style={{ textAlign: "center", fontSize: 22, marginBottom: 4 }}>{result.ok ? "✓" : "✗"}</div>
          <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 13.5, textAlign: "center" }}>{result.explanation}</p>
        </AccentBox>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 8: Q4 MULTIPLE CHOICE (River Hadith)
   Single attempt. Right = 1 point, wrong = 0.
   ═══════════════════════════════════════════════════════════════ */
function PageQ4MC({ onDone, rm }) {
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showBridge, setShowBridge] = useState(false);
  const options = useMemo(() => shuffle(MC_OPTIONS), []);
  const correctIdx = options.findIndex((o) => o.correct);

  const checkAnswer = () => {
    if (selected === null || finished) return;
    const isCorrect = options[selected].correct;
    setFinished(true);

    if (isCorrect) {
      setTimeout(() => setShowBridge(true), 500);
      setTimeout(() => onDone(1), 3000);
    } else {
      setTimeout(() => onDone(0), 3000);
    }
  };

  const userGotItRight = finished && options[selected]?.correct;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <PageTitle sub="Question 4" title="The River Hadith" />
        <Tag color="#fff" bg={T.purple}>THINK</Tag>
      </div>

      <Prose>"The Prophet ﷺ compared salah to bathing in a river five times a day. What was his point?"</Prose>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = opt.correct;
          let borderColor = T.grayLight;
          let bgColor = "#fff";
          let opacity = 1;

          if (finished) {
            if (isCorrectOpt) {
              borderColor = T.green;
              bgColor = T.greenLight;
            } else if (isSelected) {
              borderColor = T.coral;
              bgColor = T.coralLight;
            } else {
              opacity = 0.4;
            }
          } else if (isSelected) {
            borderColor = T.navy;
            bgColor = T.goldPale;
          }

          return (
            <button
              key={i}
              onClick={() => { if (!finished) setSelected(i); }}
              disabled={finished}
              aria-label={"Option " + opt.id + ": " + opt.text}
              style={{
                background: bgColor,
                border: "2px solid " + borderColor,
                borderRadius: 12,
                padding: "13px 15px",
                textAlign: "left",
                cursor: finished ? "default" : "pointer",
                display: "flex",
                gap: 11,
                alignItems: "flex-start",
                transition: rm ? "none" : "all 0.15s",
                opacity: opacity,
                fontFamily: FONT.body,
                fontSize: 14,
              }}
            >
              <span
                style={{
                  background: isCorrectOpt && finished ? T.green : isSelected && finished ? T.coral : T.navy,
                  color: "#fff",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT.ui,
                  fontWeight: 700,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {opt.id}
              </span>
              <span style={{ lineHeight: 1.6 }}>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Check answer button */}
      {!finished && selected !== null && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <PrimaryButton onClick={checkAnswer}>Check Answer</PrimaryButton>
        </div>
      )}

      {/* Finished: correct */}
      {finished && userGotItRight && (
        <div style={{ marginTop: 10 }}>
          <AccentBox color={T.green} bg={T.greenLight}>
            <p style={{ margin: "0 0 4px", fontFamily: FONT.ui, fontWeight: 700, color: T.green }}>
              ✓ Correct!
            </p>
            <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 13.5 }}>{options[correctIdx].feedback}</p>
          </AccentBox>

          {showBridge && options[correctIdx].bridge && (
            <AccentBox color={T.teal} bg={T.tealLight}>
              <SectionLabel icon="🔗" text="Coming Up" color={T.teal} />
              <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 13.5 }}>{options[correctIdx].bridge}</p>
            </AccentBox>
          )}
        </div>
      )}

      {/* Finished: wrong (reveal correct answer) */}
      {finished && !userGotItRight && (
        <div style={{ marginTop: 10 }}>
          <AccentBox color={T.coral} bg={T.coralLight}>
            <p style={{ margin: "0 0 4px", fontFamily: FONT.ui, fontWeight: 700, color: T.coral }}>✗ Not this time</p>
            <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 13.5 }}>{options[selected]?.feedback}</p>
          </AccentBox>
          <AccentBox color={T.green} bg={T.greenLight}>
            <p style={{ margin: "0 0 4px", fontFamily: FONT.ui, fontWeight: 700, color: T.green }}>The answer:</p>
            <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 13.5 }}>{options[correctIdx].feedback}</p>
          </AccentBox>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 9: Q5 REFLECTION (unscored)
   Fixed: calls onDone() for pure advancement, not onDone(0)
   ═══════════════════════════════════════════════════════════════ */
function PageQ5Reflect({ onDone, rm }) {
  const [checked, setChecked] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i) => {
    if (submitted) return;
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <PageTitle sub="Question 5" title="Your Salah Journey" />
        <Tag color={T.gold} bg={T.goldLight}>Reflection</Tag>
      </div>

      <div style={{ fontFamily: FONT.ui, fontSize: 11, color: T.grayMed, marginBottom: 14 }}>Unscored: just for you</div>

      <Prose>"Which describes your current relationship with salah?"</Prose>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {REFLECTIONS.map((refl, i) => {
          const isOn = checked.has(i);
          return (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                aria-label={refl.text + (isOn ? " (selected)" : "")}
                aria-pressed={isOn}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  gap: 11,
                  alignItems: "center",
                  background: isOn ? T.goldPale : "#fff",
                  border: "1.5px solid " + (isOn ? T.gold : T.grayLight),
                  borderRadius: 12,
                  padding: "13px 15px",
                  cursor: submitted ? "default" : "pointer",
                  transition: rm ? "none" : "all 0.15s",
                  fontFamily: FONT.body,
                  fontSize: 14,
                  opacity: submitted && !isOn ? 0.3 : 1,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    border: "2px solid " + (isOn ? T.gold : T.grayMed),
                    background: isOn ? T.gold : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {isOn ? "✓" : ""}
                </span>
                <span>{refl.text}</span>
              </button>

              {submitted && isOn && (
                <div
                  style={{
                    marginTop: 3,
                    marginLeft: 31,
                    padding: "9px 13px",
                    borderRadius: 10,
                    background: T.goldPale,
                    borderLeft: "3px solid " + T.gold,
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontStyle: "italic",
                    color: T.navy,
                    animation: rm ? "none" : "deanySlideIn 0.25s ease " + i * 0.08 + "s both",
                  }}
                >
                  {refl.response}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && checked.size > 0 && (
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <PrimaryButton onClick={() => { setSubmitted(true); setTimeout(() => onDone(), 2500); }}>
            See My Reflection
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 10: KEY TAKEAWAY
   ═══════════════════════════════════════════════════════════════ */
function PageTakeaway({ onNext }) {
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, " + T.gold + "12, " + T.goldPale + ")",
          border: "2.5px solid " + T.gold,
          borderRadius: 20,
          padding: "30px 26px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, " + T.gold + "22, transparent 70%)", borderRadius: "50%" }} />
        <SectionLabel icon="🔑" text="Key Takeaway" color={T.gold} />
        <p style={{ fontFamily: FONT.display, fontSize: 19, fontWeight: 700, color: T.navy, lineHeight: 1.6, margin: "0 0 10px" }}>
          Salah is not a ritual you squeeze into your day. It IS the structure of your day.
        </p>
        <p style={{ fontFamily: FONT.body, fontSize: 14.5, lineHeight: 1.8, color: T.grayDark, margin: 0 }}>
          Five appointments. Five invitations to stand before Him. And like a river washing you clean: continuous purification, not just once.
        </p>
      </div>
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <PrimaryButton onClick={onNext}>See My Results</PrimaryButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 11: COMPREHENSION CHECKPOINT
   ═══════════════════════════════════════════════════════════════ */
function PageCheckpoint({ scores, total, rm }) {
  const maxScore = 17;
  const pct = Math.round((total / maxScore) * 100);
  const passed = pct >= 60;
  const [showConfetti, setShowConfetti] = useState(passed);
  const [confidence, setConfidence] = useState(3);
  const confettiColors = [T.gold, T.teal, T.green, T.coral, T.purple];

  useEffect(() => {
    if (passed) setTimeout(() => setShowConfetti(false), 2500);
  }, [passed]);

  const conceptsMastered = [
    { name: "Salah as meeting with Allah", ok: scores.q1 >= 5 && scores.q4 >= 0.5 },
    { name: "Five daily prayer names", ok: scores.q2 >= 4 && scores.q3 >= 3 },
    { name: "Prayer times", ok: scores.q2 >= 5 },
    { name: "Salah as second pillar", ok: scores.q1 >= 4 },
    { name: "Spiritual purification", ok: scores.q4 >= 0.5 },
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Confetti */}
      {showConfetti && !rm && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 240, overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: Math.random() * 100 + "%",
                top: -10,
                width: 7 + Math.random() * 5,
                height: 7 + Math.random() * 5,
                borderRadius: Math.random() > 0.5 ? "50%" : 2,
                background: confettiColors[i % 5],
                animation: "deanyConfetti " + (1 + Math.random() * 0.8) + "s ease-out " + Math.random() * 0.4 + "s forwards",
              }}
            />
          ))}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 24, border: "2px solid " + T.gold, padding: 28, boxShadow: "0 8px 40px " + T.gold + "12" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: FONT.ui, fontSize: 11, fontWeight: 600, color: T.grayMed, letterSpacing: 2, marginBottom: 10 }}>
            COMPREHENSION CHECKPOINT
          </div>

          {/* Score ring */}
          <svg width={100} height={100} viewBox="0 0 100 100" style={{ display: "block", margin: "0 auto 10px" }} role="img" aria-label={"Score: " + pct + " percent, " + Math.round(total) + " out of " + maxScore}>
            <circle cx={50} cy={50} r={42} fill="none" stroke={T.grayLight} strokeWidth={6} />
            <circle
              cx={50}
              cy={50}
              r={42}
              fill="none"
              stroke={passed ? T.green : T.coral}
              strokeWidth={6}
              strokeDasharray={(pct / 100) * 264 + " 264"}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: rm ? "none" : "stroke-dasharray 1s ease" }}
            />
            <text x={50} y={47} textAnchor="middle" fontSize={24} fontWeight={800} fontFamily={FONT.ui} fill={T.navy}>
              {pct}%
            </text>
            <text x={50} y={64} textAnchor="middle" fontSize={10} fill={T.grayMed} fontFamily={FONT.ui}>
              {Math.round(total)}/{maxScore}
            </text>
          </svg>

          <div style={{ fontFamily: FONT.ui, fontWeight: 700, color: passed ? T.green : T.coral, fontSize: 14 }}>
            {passed ? "Great foundation! Ready for Lesson 2." : "You are close! Review below."}
          </div>
        </div>

        {/* Concepts mastered */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: FONT.ui, fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Concepts Mastered</div>
          {conceptsMastered.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid " + T.grayLight + "22" }}>
              <span style={{ fontSize: 14 }}>{c.ok ? "✅" : "⬜"}</span>
              <span style={{ fontFamily: FONT.ui, fontSize: 13, color: c.ok ? T.green : T.grayMed, fontWeight: c.ok ? 600 : 400 }}>{c.name}</span>
            </div>
          ))}
        </div>

        {/* Confidence slider */}
        <div style={{ marginBottom: 20, padding: "14px 0", borderTop: "1px solid " + T.grayLight }}>
          <div style={{ fontFamily: FONT.ui, fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 8 }}>
            Confidence? <span style={{ fontWeight: 400, color: T.grayMed }}>(optional)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: FONT.ui, fontSize: 10, color: T.grayMed }}>Low</span>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={confidence}
              onChange={(e) => setConfidence(+e.target.value)}
              aria-label="Confidence level"
              style={{ flex: 1 }}
            />
            <span style={{ fontFamily: FONT.ui, fontSize: 10, color: T.grayMed }}>High</span>
          </div>
        </div>

        {/* Next lesson preview */}
        <AccentBox color={T.teal} bg={T.tealLight} style={{ borderRadius: 12 }}>
          <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: 13, color: T.teal, marginBottom: 3 }}>
            Next: Lesson 2 - "Preparing for the King"
          </div>
          <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 12.5, color: T.grayDark, lineHeight: 1.7 }}>
            Next, learn about wudu: the preparation before every prayer.
          </p>
        </AccentBox>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <PrimaryButton style={{ minWidth: 240, fontSize: 15, padding: "15px 40px" }}>
            {passed ? "Continue to Lesson 2 \u2192" : "Review Lesson"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
