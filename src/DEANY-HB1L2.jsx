import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, Award } from 'lucide-react';

// ================================================================
// TOKENS
// ================================================================
const C = {
  navy:'#0F172A', gold:'#C9972B', goldLight:'#FFF4D8',
  teal:'#0F766E', tealLight:'#E6F7F3', coral:'#C75B4C',
  coralLight:'#FCEBE7', green:'#2F855A', greenLight:'#E8F6EE',
  orange:'#D97706', orangeLight:'#FFF3E1', purple:'#6D4CC2',
  sand:'#E8D7B0', sandLight:'#F8F0DC',
  dark:'#263142', mid:'#64748B', light:'#EEE6D4',
  cream:'#F8F5EC', ivory:'#FFFDF7', pearl:'#FDFBF6', border:'#E8DFC9',
};
const STYLES = `
  @keyframes slideUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 60%{transform:translateX(7px)} }
  @keyframes pop      { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes fall     { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes pulse    { 0%,100%{opacity:0.55} 50%{opacity:1} }
  @keyframes focusRing{ 0%{opacity:0;transform:scale(0.98)} 100%{opacity:1;transform:scale(1)} }
  @keyframes escapeIn { from{opacity:0;transform:translateY(-6px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes drawLine { from{stroke-dashoffset:900} to{stroke-dashoffset:0} }
  @keyframes nodeIn   { from{opacity:0;transform:scale(0.4)} to{opacity:1;transform:scale(1)} }
  .su        { animation: slideUp   0.32s ease-out both }
  .fi        { animation: fadeIn    0.22s ease-out both }
  .shk       { animation: shake     0.28s ease both }
  .pop       { animation: pop       0.36s cubic-bezier(.17,.67,.35,1.3) both }
  .pls       { animation: pulse     1.6s ease-in-out infinite }
  .focus-ring{ animation: focusRing 0.35s cubic-bezier(.4,0,.2,1) both }
  .escape-in { animation: escapeIn  0.28s cubic-bezier(.4,0,.2,1) both }
  .draw-line { animation: drawLine  1.2s cubic-bezier(.4,0,.2,1) forwards }
  .node-in   { animation: nodeIn    0.4s cubic-bezier(.34,1.56,.64,1) both }
  @keyframes flowDash { to { stroke-dashoffset: -24 } }
  .flow-dash { animation: flowDash 3s linear infinite }
  @keyframes routeIn  { from{opacity:0} to{opacity:1} }
  .route-in  { animation: routeIn   0.6s ease-out both }

  /* ---- Approved answer grammar: tactile physics, transform/opacity only ---- */
  .chunky{ transition: transform 120ms ease, box-shadow 120ms ease;
           touch-action: manipulation; -webkit-user-select:none; user-select:none;
           -webkit-tap-highlight-color:transparent; }
  .chunky:active:not(:disabled){ transform: translateY(2px); box-shadow: 0 1px 0 var(--edge) !important; }
  @keyframes okPop  { 0%{transform:scale(1)} 40%{transform:scale(1.035)} 100%{transform:scale(1)} }
  @keyframes shakeX { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-7px)} 30%{transform:translateX(6px)} 45%{transform:translateX(-4px)} 60%{transform:translateX(3px)} 80%{transform:translateX(-1px)} }
  @keyframes seal   { 0%{transform:scale(0) rotate(0);opacity:0} 35%{transform:scale(1.25) rotate(20deg);opacity:1} 100%{transform:scale(0.6) rotate(20deg);opacity:0} }
  @keyframes sheetUp{ from{transform:translateY(14px);opacity:0} to{transform:translateY(0);opacity:1} }
  .ok-pop { animation: okPop  300ms ease }
  .shake  { animation: shakeX 330ms ease }
  .seal   { animation: seal   550ms ease-out forwards }
  .sheet  { animation: sheetUp 300ms cubic-bezier(.34,1.3,.64,1) both }
  @media (prefers-reduced-motion: reduce){
    .ok-pop,.shake,.seal,.pop,.pls{ animation: none !important }
    .sheet{ animation: fadeIn 200ms ease both !important }
  }

  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;500;700&display=swap');
  /* Arabic renders in Scheherazade New on white - distinguished by type, never by a different surface */
  :lang(ar), [dir="rtl"], .swt, .honorific, .arabic { font-family: 'Scheherazade New','Amiri',serif !important; }
  * { font-family: inherit; }
  .swt {
    font-family: 'Scheherazade New','Amiri',serif;
    font-size: 1.08em;
    letter-spacing: 0;
    display: inline;
  }
`;
function rgba(hex,a=1){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

// ================================================================
// APPROVED INTERACTION SYSTEM  -  one grammar, one physics
// (see deany-lesson-question-ui-combined spec)
// ================================================================

// Grammar tokens - the universal state colours for every tappable answer.
const G = {
  border:'#E8E4D8', edge:'#DDD8CA', ink:'#1B2A4A', inkSoft:'#3A4763',
  muted:'#8A94A8', steel:'#5C6A85',
  selBg:'#E9F6F4', selBorder:'#22A39A', selEdge:'#147067', selInk:'#0F6E56',
  okBg:'#EAF3DE', okBorder:'#3B6D11', okEdge:'#2C520C', okInk:'#3B6D11', okSupport:'#27500A',
  noBg:'#FDECEA', noBorder:'#C25446', noEdge:'#A03A2D', noInk:'#B3261E',
  sheetOkBg:'#EAF3DE', sheetNoBg:'#FDF2EC', noSupport:'#8A3418', sheetNoEdge:'#B04A2C',
  doneBorder:'#EDEAE0', doneInk:'#8A94A8',
  subject:'#E06A45', subjectTint:'#FBEEE9',
  gold:'#F0B429', streakBg:'#FBF3DF', streakBorder:'#F0DFAE', streakInk:'#B87E0A',
  page:'#F6F6F4',
};

// Motion tokens - single source, no raw ms at call sites.
const M = {
  press:120, selectColor:120, correctHold:300, wrongShake:330, fadeToDone:250,
  sheetSlide:300, progressSpring:400, matchSeal:550, tileFlight:250, correctRevealDelay:380,
};

// The chunky answer surface. state: idle | selected | correct | wrong | done.
function answerStyle(state){
  switch(state){
    case 'selected': return {background:G.selBg,borderColor:G.selBorder,color:G.selInk,boxShadow:`0 4px 0 ${G.selEdge}`,'--edge':G.selEdge};
    case 'correct':  return {background:G.okBg, borderColor:G.okBorder,color:G.okInk, boxShadow:`0 4px 0 ${G.okEdge}`, '--edge':G.okEdge};
    case 'wrong':    return {background:G.noBg, borderColor:G.noBorder,color:G.noInk, boxShadow:`0 4px 0 ${G.noEdge}`, '--edge':G.noEdge};
    case 'done':     return {background:'#fff',borderColor:G.doneBorder,color:G.doneInk,boxShadow:`0 4px 0 ${G.doneBorder}`,opacity:0.34,pointerEvents:'none'};
    default:         return {background:'#fff',borderColor:G.border,color:G.ink,   boxShadow:`0 4px 0 ${G.edge}`,   '--edge':G.edge};
  }
}

// ---- Sound: shared Web Audio, lazy, whisper-quiet, SSR-guarded ----
let _ac=null, _lastTone=0;
function _ctx(){
  if(typeof window==='undefined') return null;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC) return null;
  if(!_ac) _ac=new AC();
  if(_ac.state==='suspended') _ac.resume();
  return _ac;
}
function _tone(freq,dur=0.05,vol=0.05,type='sine'){
  const c=_ctx(); if(!c) return;
  const now=c.currentTime;
  if(now-_lastTone<0.03) return; _lastTone=now;
  const o=c.createOscillator(), g=c.createGain();
  o.type=type; o.frequency.value=freq;
  g.gain.setValueAtTime(vol,now);
  g.gain.exponentialRampToValueAtTime(0.0001,now+dur);
  o.connect(g); g.connect(c.destination);
  o.start(now); o.stop(now+dur);
}
const SFX={
  tick:()=>_tone(1800,0.03,0.05),
  place:()=>_tone(1100,0.05,0.05),
  match:()=>{_tone(880,0.06,0.05); setTimeout(()=>_tone(1320,0.06,0.05),70);},
  wrong:()=>_tone(150,0.09,0.05,'square'),
  done:()=>[660,880,1100,1320].forEach((f,i)=>setTimeout(()=>_tone(f,0.12,0.05),i*90)),
};
// Haptics: Android vibrates today; iOS Safari has no web API (silent no-op).
function haptic(ms){
  if(typeof navigator!=='undefined' && navigator.vibrate){ try{ navigator.vibrate(ms); }catch(e){} }
}
function md(text){
  const SWT = 'سُبْحَانَهُ وَتَعَالَى';
  const SAW = 'صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ';
  const AS  = 'عَلَيْهِ السَّلَام';
  const SWT_re = SWT.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&');
  const SAW_re = SAW.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&');
  const AS_re  = AS.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&');
  const parts = text.split(new RegExp('(' + SWT_re + '|' + SAW_re + '|' + AS_re + '|\\*\\*[^*]+\\*\\*)', 'g'));
  return parts.map((p,i)=>{
    if(p===SWT) return <span key={i} className="swt">{SWT}</span>;
    if(p===SAW) return <span key={i} className="honorific">{SAW}</span>;
    if(p===AS)  return <span key={i} className="honorific">{AS}</span>;
    if(p.startsWith('**')&&p.endsWith('**')) return <strong key={i} style={{color:C.navy}}>{p.slice(2,-2)}</strong>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}
const PAGE_BG = { background:G.page };
const CARD    = {
  background:'#fff',
  border:`1px solid ${G.border}`,
  boxShadow:`0 1px 2px ${rgba(C.navy,0.04)}, 0 12px 32px ${rgba(C.navy,0.06)}`
};

// ================================================================
// SHARED UI
// ================================================================
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <radialGradient id="deanyGlow" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor={C.teal} stopOpacity="0.10"/>
          <stop offset="55%" stopColor={C.gold} stopOpacity="0.035"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <pattern id="iphb2" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M36 0L72 36L36 72L0 36Z" fill="none" stroke={C.gold} strokeWidth="0.55" opacity="0.055"/>
          <circle cx="36" cy="36" r="14" fill="none" stroke={C.teal} strokeWidth="0.35" opacity="0.045"/>
          <path d="M36 22L50 36L36 50L22 36Z" fill="none" stroke={C.gold} strokeWidth="0.35" opacity="0.05"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#deanyGlow)"/>
      <rect width="100%" height="100%" fill="url(#iphb2)" opacity="0.65"/>
    </svg>
  );
}
function Confetti(){
  const items=useRef(Array.from({length:40},(_,i)=>({
    id:i,left:`${Math.random()*100}%`,size:12+Math.random()*12,
    dur:2+Math.random()*2.5,delay:Math.random()*1,
    icon:['✦','✧','☆','🌟','✨','⭐','💫','🏆'][i%8],
  })));
  return(
    <div className="fixed inset-0 pointer-events-none" style={{zIndex:200}}>
      {items.current.map(p=>(
        <div key={p.id} className="absolute" style={{left:p.left,top:'-20px',fontSize:p.size,animation:`fall ${p.dur}s ease-out ${p.delay}s both`}}>{p.icon}</div>
      ))}
    </div>
  );
}
function ProgressBar({qNum,totalQ,score}){
  const pct=Math.min((qNum/totalQ)*100,100);
  return(
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold" style={{color:C.mid}}>Question {Math.min(qNum+1,totalQ)} of {totalQ}</span>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" style={{color:C.gold}} fill={C.gold}/>
          <span className="text-xs font-bold" style={{color:C.navy}}>{score} pts</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{background:C.light}}>
        <div className="h-full rounded-full" style={{width:`${pct}%`,background:`linear-gradient(90deg,${C.gold},${C.orange})`,transition:'width 0.7s ease-out'}}/>
      </div>
    </div>
  );
}
function ModeBadge({mode,type,unscored}){
  const cfg={THINK:{bg:rgba(C.purple,0.1),color:C.purple,icon:'🧠'},PLAY:{bg:rgba(C.teal,0.1),color:C.teal,icon:'🎮'},SORT:{bg:rgba(C.orange,0.1),color:C.orange,icon:'📦'}};
  const m=cfg[mode]||cfg.THINK;
  return(
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:m.bg,color:m.color}}>{m.icon} {mode}</span>
      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:rgba(C.navy,0.06),color:C.mid}}>{type}</span>
      {unscored&&<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:rgba(C.gold,0.15),color:C.gold}}>Not scored</span>}
    </div>
  );
}
function FeedbackPanel({correct,text,bridge,meta,reflection}){
  const sc=meta?(meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.6)?C.gold:C.coral):correct?C.green:C.coral;
  const bg=reflection?C.tealLight:correct?C.greenLight:C.coralLight;
  const bc=reflection?C.teal:correct?C.green:C.coral;
  return(
    <div className="mt-4 rounded-xl p-5 border-2 su" style={{background:bg,borderColor:bc}}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {reflection?<span className="text-lg">💙</span>:correct?<CheckCircle className="w-5 h-5" style={{color:C.green}}/>:<XCircle className="w-5 h-5" style={{color:C.coral}}/>}
        </div>
        <div className="flex-1">
          {meta?(
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="text-xl font-black" style={{color:sc,fontFamily:'Georgia,serif'}}>{meta.ok}/{meta.total}</span>
              <span className="text-sm font-bold" style={{color:sc}}>correct</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.6)?C.gold:C.coral,color:'white'}}>
                {meta.ok===meta.total?'Perfect! ⭐':meta.ok>=Math.ceil(meta.total*0.6)?'Almost!':'Keep going'}
              </span>
            </div>
          ):(
            <div className="text-sm font-bold mb-1" style={{color:reflection?C.teal:correct?C.green:C.coral}}>
              {reflection?'Thank you for reflecting.':correct?'Correct!':'Not quite!'}
            </div>
          )}
          <div className="text-sm leading-relaxed" style={{color:C.dark}}>{md(text)}</div>
          {bridge&&correct&&(
            <div className="mt-3 pt-3 border-t flex items-start gap-2" style={{borderColor:rgba(bc,0.28)}}>
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:C.teal}}/>
              <span className="text-xs italic" style={{color:C.teal}}>{md(bridge)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function QuranCard({arabic,translation,ref_text,note}){
  return(
    <div className="rounded-xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.gold,0.3)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
        <span style={{fontSize:14}}>📖</span>
        <span className="text-xs font-bold tracking-wide" style={{color:rgba(C.gold,0.9)}}>{ref_text}</span>
      </div>
      <div className="px-5 py-4 text-right border-b" style={{background:`linear-gradient(135deg,${C.navy},#1e3460)`,borderColor:rgba(C.gold,0.15)}}>
        <p style={{color:C.gold,fontFamily:'serif',direction:'rtl',lineHeight:'2.2',fontSize:15,fontWeight:500}}>{arabic}</p>
      </div>
      <div className="px-4 py-4" style={{background:C.goldLight}}>
        <p className="text-sm italic leading-relaxed mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{translation}</p>
        {note&&<div className="pt-2 border-t text-xs leading-relaxed" style={{borderColor:rgba(C.gold,0.25),color:C.dark}}>{note}</div>}
      </div>
    </div>
  );
}

// Raster reference map removed - the diagram is now a custom vector map.

// ================================================================
// ARABIA DIAGRAM  -  Section A
// A custom vector map of Arabia in DEANY brand tokens: flat sand
// landmass, soft teal seas, editorial region labels. Trade routes
// are single dotted lines with flowing dots and an arrowhead.
// The camera lives inside the SVG, so zoom is crisp at any scale.
// ================================================================
function ArabiaDiagram({onActivate}){
  const [step,setStep]=useState(0);
  const [cam,setCam]=useState({scale:1,fx:50,fy:33.35});
  const activated=useRef(false);
  const fire=()=>{ if(!activated.current){activated.current=true;onActivate&&onActivate();} };
  const DOTS=[0,1,2,3];
  const VIEW_W=100;
  const VIEW_H=66.7;

  // Key locations in viewBox coordinates.
  const pts = {
    makkah:  {x:33.0, y:42.0},
    yathrib: {x:31.0, y:31.5},
    yemen:   {x:36.5, y:57.5},
    syria:   {x:30.5, y:5.5},
    gulf:    {x:73.0, y:26.0},
    jeddah:  {x:30.4, y:43.5},
  };

  // Camera targets - focus point and zoom per step.
  const CAMERAS=[
    {scale:1.18, fx:33.0, fy:34.0},   // 0: the Hijaz strip
    {scale:1.15, fx:33.0, fy:32.0},   // 1: the north-south route
    {scale:1.30, fx:50.0, fy:36.0},   // 2: the east-west route
    {scale:2.10, fx:33.0, fy:42.0},   // 3: Makkah, the crossing point
  ];

  useEffect(()=>{ setCam(CAMERAS[step]); },[step]);

  // Pan and zoom in one smooth transition, clamped to map edges.
  const camTransform=(c)=>{
    const s=c.scale;
    const tx=Math.min(0,Math.max(VIEW_W*(1-s),VIEW_W/2-c.fx*s));
    const ty=Math.min(0,Math.max(VIEW_H*(1-s),VIEW_H/2-c.fy*s));
    return `translate(${tx}px, ${ty}px) scale(${s})`;
  };

  // ---- Geography (hand-drawn, stylized) ----
  const arabiaPath = `M 27 0 L 62 0 C 63 6, 63.5 10, 65 14 C 68 18, 71 21, 73.5 24 C 75.5 26.5, 76.5 28, 77 30 C 79 32, 82 33, 84.5 32 C 86 34, 87 37, 86 40 C 83 46, 78 51, 71 54 C 63 57.5, 54 60, 46 61.5 C 42 62.2, 38 62.4, 35 61 C 33.5 58.5, 32.5 54.5, 31.5 50 C 30.5 44, 29 36, 28 28 C 27.4 22, 26.8 16, 26.5 10 C 26.4 6, 26.7 3, 27 0 Z`;
  const africaPath = `M 0 0 L 21 0 C 19 6, 18 10, 19 15 C 20 21, 17 28, 15 34 C 13 41, 14 50, 11 58 L 9 66.7 L 0 66.7 Z`;
  const persiaPath = `M 68 0 L 100 0 L 100 27 C 95 25, 90 23, 87 25 C 84 26.5, 81 28, 78 27 C 74.5 25.5, 71 20, 69.5 14 C 68.5 9, 68 4, 68 0 Z`;
  const hijazStrip = `M 31 8 C 32 16, 33 26, 34.5 36 C 35.8 44, 37.3 52, 39.5 59 L 35.2 61 C 33.5 58.5, 32.3 54.5, 31.4 50 C 29.8 42, 28.4 32, 27.6 24 C 27.2 18, 26.7 12, 26.6 8.5 Z`;

  const northSouthRoute = `M ${pts.yemen.x} ${pts.yemen.y} C 35 52, 34 46.5, ${pts.makkah.x} ${pts.makkah.y} C 32.2 38.5, 31.6 35, ${pts.yathrib.x} ${pts.yathrib.y} C 30.2 22.5, 30.2 13.5, ${pts.syria.x} ${pts.syria.y}`;
  const eastWestRoute = `M ${pts.gulf.x} ${pts.gulf.y} C 65 30.5, 56 35.5, 47 39 C 41.5 41.2, 36.8 42, ${pts.makkah.x} ${pts.makkah.y} C 32.1 42.4, 31.2 43, ${pts.jeddah.x} ${pts.jeddah.y}`;

  // Single clean dotted route with flowing dots and an arrowhead.
  const DottedRoute=({d,color,markerId})=>(
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="0.55" strokeLinecap="round" strokeDasharray="0.1 1.9" className="flow-dash"/>
      <path d={d} fill="none" stroke={color} strokeOpacity="0.01" strokeWidth="0.01" markerEnd={`url(#${markerId})`}/>
    </g>
  );

  const CargoTag=({x,y,w,label,color})=>(
    <g className="node-in">
      <rect x={x} y={y} width={w} height="3.0" rx="1.5" fill="rgba(255,255,255,0.92)" stroke={rgba(color,0.40)} strokeWidth="0.14"/>
      <text x={x+w/2} y={y+2.05} textAnchor="middle" fontSize="1.0" fontWeight="850" fill={color} fontFamily="system-ui,sans-serif">{label}</text>
    </g>
  );

  const CityDot=({p,primary=false,label,dx=1,dy=-1})=>(
    <g className="node-in">
      <circle cx={p.x} cy={p.y} r={primary?0.78:0.55} fill={primary?C.gold:C.navy} stroke="rgba(255,255,255,0.95)" strokeWidth="0.2"/>
      <text x={p.x+dx} y={p.y+dy} fontSize={primary?1.15:1.05} fontWeight="850" fill={primary?C.gold:rgba(C.navy,0.72)} fontFamily="Georgia,serif" paintOrder="stroke" stroke={C.pearl} strokeWidth="0.4" strokeLinejoin="round">
        {label}
      </text>
    </g>
  );

  const EndpointDot=({p,label,color,align='start',dy=-1})=>(
    <g className="node-in">
      <circle cx={p.x} cy={p.y} r="0.5" fill={color} stroke="rgba(255,255,255,0.95)" strokeWidth="0.18"/>
      {label&&(
        <text x={p.x+(align==='end'?-1.0:1.0)} y={p.y+dy} textAnchor={align} fontSize="1.05" fontWeight="850" fill={color} fontFamily="Georgia,serif" paintOrder="stroke" stroke={C.pearl} strokeWidth="0.36" strokeLinejoin="round">
          {label}
        </text>
      )}
    </g>
  );

  const RegionLabel=({x,y,text,rotate=0,water=false,size=1.6})=>(
    <text x={x} y={y} fontSize={size} fontWeight="700" letterSpacing="0.4"
      fill={water?rgba(C.teal,0.42):rgba(C.navy,0.30)}
      fontFamily="Georgia,serif" fontStyle={water?'italic':'normal'}
      transform={rotate?`rotate(${rotate} ${x} ${y})`:undefined}>{text}</text>
  );

  return(
    <div style={{borderRadius:24,overflow:'hidden',marginBottom:22,border:`1px solid ${rgba(C.border,0.95)}`,boxShadow:`0 24px 70px ${rgba(C.navy,0.10)}`,background:'white'}}>
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',top:14,right:16,display:'flex',gap:7,zIndex:3,padding:'7px 9px',borderRadius:999,background:'rgba(255,255,255,0.72)',border:`1px solid ${rgba(C.border,0.8)}`,backdropFilter:'blur(10px)'}}>
          {DOTS.map(d=>(
            <div key={d} style={{width:d===step?22:7,height:7,borderRadius:999,background:d<step?rgba(C.gold,0.55):d===step?C.gold:rgba(C.navy,0.14),transition:'all 0.4s cubic-bezier(.4,0,.2,1)'}}/>
          ))}
        </div>

        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" style={{display:'block'}}>
          <defs>
            <marker id="arrowGold" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="3.0" markerHeight="3.0" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M 1.5 1.5 L 10.5 6 L 1.5 10.5 z" fill={C.gold} stroke={C.pearl} strokeWidth="1.1" strokeLinejoin="round"/>
            </marker>
            <marker id="arrowTeal" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="3.0" markerHeight="3.0" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M 1.5 1.5 L 10.5 6 L 1.5 10.5 z" fill={C.teal} stroke={C.pearl} strokeWidth="1.1" strokeLinejoin="round"/>
            </marker>
          </defs>

          {/* Camera */}
          <g style={{transform:camTransform(cam),transition:'transform 1.05s cubic-bezier(.3,0,.2,1)'}}>

            {/* Sea (oversized so zoom-out never shows blank) */}
            <rect x="-60" y="-60" width="220" height="190" fill={C.tealLight}/>

            {/* Neighbouring landmasses, de-emphasized */}
            <path d={africaPath} fill={C.cream} stroke={rgba(C.navy,0.14)} strokeWidth="0.22"/>
            <path d={persiaPath} fill={C.cream} stroke={rgba(C.navy,0.14)} strokeWidth="0.22"/>

            {/* Arabian peninsula */}
            <path d={arabiaPath} fill={C.sandLight} stroke={rgba(C.navy,0.22)} strokeWidth="0.28" strokeLinejoin="round"/>

            {/* Hijaz strip tint, step 0 only */}
            {step===0&&(
              <path d={hijazStrip} fill={rgba(C.teal,0.13)} className="fi"/>
            )}

            {/* Region and sea labels - permanent map furniture */}
            <RegionLabel x={30.2} y={26} text="HIJAZ" rotate={80}/>
            <RegionLabel x={46} y={33} text="NAJD"/>
            <RegionLabel x={18.6} y={30} text="RED SEA" rotate={72} water/>
            <RegionLabel x={70.5} y={17.5} text="PERSIAN GULF" rotate={40} water size={1.35}/>
            <RegionLabel x={62} y={64} text="ARABIAN SEA" water size={1.35}/>

            {/* Routes */}
            {step>=1&&(
              <g className="route-in">
                <DottedRoute d={northSouthRoute} color={C.gold} markerId="arrowGold"/>
                <EndpointDot p={pts.yemen} label="Yemen" color={C.gold} dy="1.9"/>
                <EndpointDot p={pts.syria} label="Syria" color={C.gold} dy="-0.9"/>
                <CargoTag x={15.2} y={30.5} w={14.2} label="incense · gold · spices" color={C.gold}/>
              </g>
            )}

            {step>=2&&(
              <g className="route-in" style={{animationDelay:'0.1s'}}>
                <DottedRoute d={eastWestRoute} color={C.teal} markerId="arrowTeal"/>
                <EndpointDot p={pts.gulf} color={C.teal}/>
                <EndpointDot p={pts.jeddah} color={C.teal}/>
                <CargoTag x={46} y={44.6} w={12.0} label="silk · Indian goods" color={C.teal}/>
              </g>
            )}

            {/* Cities */}
            <CityDot p={pts.makkah} primary={step>=3} label="Makkah" dx="1.1" dy="-1.0"/>
            <CityDot p={pts.yathrib} label="Yathrib" dx="1.1" dy="0.3"/>

            {step>=3&&(
              <g className="node-in">
                <rect x="35.4" y="43.6" width="10.2" height="3.3" rx="1.65" fill="rgba(15,23,42,0.80)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.12"/>
                <text x="36.7" y="45.85" fontSize="0.92" fontWeight="900" fill="#ffffff" fontFamily="system-ui,sans-serif">crossroads</text>
              </g>
            )}
          </g>
        </svg>
      </div>

      <div style={{background:'rgba(255,255,255,0.94)',borderTop:`1px solid ${rgba(C.border,0.9)}`}}>
        {step===0&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.mid,marginBottom:9}}>
              01 - the land
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:11}}>
              The Arabian Peninsula  -  vast, dry, and at the centre of the ancient world.
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.75,marginBottom:22}}>
              Roughly the size of Western Europe. The Hijaz is the thin western coastal strip  -  home to Makkah and Yathrib (the city later known as Madinah). The Najd is the dry interior. Yemen in the south was the most fertile corner.
            </p>
            <button onClick={()=>{setStep(1);fire();}}
              style={{width:'100%',padding:'14px 0',borderRadius:14,fontSize:13,fontWeight:800,background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer',boxShadow:`0 14px 32px ${rgba(C.navy,0.18)}`}}>
              See the north-south trade route →
            </button>
          </div>
        )}

        {step===1&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.gold,marginBottom:9}}>
              02 - the gold route
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:11}}>
              From Yemen to Syria  -  the great incense route.
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.75,marginBottom:22}}>
              Every year, caravans loaded with frankincense, myrrh, gold, and spices made the long journey north. This single route made the Hijaz indispensable. Whoever controlled it controlled the wealth of Arabia.
            </p>
            <button onClick={()=>setStep(2)}
              style={{width:'100%',padding:'14px 0',borderRadius:14,fontSize:13,fontWeight:800,background:rgba(C.teal,0.1),color:C.teal,border:`1.5px solid ${rgba(C.teal,0.3)}`,cursor:'pointer',boxShadow:`0 12px 24px ${rgba(C.teal,0.08)}`}}>
              See the east-west route →
            </button>
          </div>
        )}

        {step===2&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.teal,marginBottom:9}}>
              03 - the teal route
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:11}}>
              Persian Gulf to the Red Sea  -  the route from the east.
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.75,marginBottom:22}}>
              Goods from India and Persia entered Arabia through the Gulf. They crossed the peninsula toward the Red Sea ports  -  and through them, into Egypt and the Byzantine world. Two great routes. They crossed at one point.
            </p>
            <button onClick={()=>setStep(3)}
              style={{width:'100%',padding:'14px 0',borderRadius:14,fontSize:13,fontWeight:800,background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer',boxShadow:`0 14px 32px ${rgba(C.navy,0.18)}`}}>
              See where they meet →
            </button>
          </div>
        )}

        {step===3&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.mid,marginBottom:9}}>
              04 - the point
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:15}}>
              Makkah sat at the exact crossing point. That was not a coincidence.
            </div>
            <div style={{padding:'16px 18px',borderRadius:16,background:`linear-gradient(135deg,${C.navy},#172554)`,marginBottom:16,boxShadow:`0 16px 36px ${rgba(C.navy,0.18)}`}}>
              <p style={{fontSize:13.5,fontWeight:800,color:'white',fontFamily:'Georgia,serif',lineHeight:1.58,margin:0,textAlign:'center'}}>
                Every caravan passed near Makkah.<br/>
                <span style={{color:C.gold}}>The Quraysh controlled the crossroads.</span>
              </p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{padding:'14px',borderRadius:16,background:rgba(C.goldLight,0.72),border:`1px solid ${rgba(C.gold,0.22)}`}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.gold,marginBottom:6}}>North-South</div>
                <p style={{fontSize:11.5,color:C.dark,lineHeight:1.6,margin:0}}>Yemen spices and incense to Syria and the Byzantine Empire.</p>
              </div>
              <div style={{padding:'14px',borderRadius:16,background:rgba(C.tealLight,0.58),border:`1px solid ${rgba(C.teal,0.18)}`}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.teal,marginBottom:6}}>East-West</div>
                <p style={{fontSize:11.5,color:C.dark,lineHeight:1.6,margin:0}}>Indian and Persian goods to Red Sea ports and Africa.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// TRIBAL DIAGRAM  -  Section B
// Three interlocking principles of the tribal code, presented as
// calligraphic medallions on a triangle. Tap each to open it.
// Visited medallions are marked; once all three are explored the
// triangle completes. All principle text is unchanged.
// ================================================================
function TribalDiagram({onActivate}){
  const [selected,setSelected]=useState(null);
  const [visited,setVisited]=useState([false,false,false]);
  const activated=useRef(false);
  const tap=(i)=>{
    setSelected(i===selected?null:i);
    setVisited(v=>{ if(v[i])return v; const n=[...v]; n[i]=true; return n; });
    if(!activated.current){activated.current=true;onActivate&&onActivate();}
  };

  const W=320,H=196,CX=160,CY=92;

  const PRINCIPLES=[
    {
      id:0, name:'Asabiyyah', arabic:'عصبية', x:82, y:64, color:C.teal,
      english:'Group Loyalty',
      desc:'You defended your tribe regardless of right or wrong. The tribe\'s honour was your honour. Its enemies were your enemies. Identity was entirely collective.',
      example:'A Bedouin poet would boast of his tribe the way a modern person might speak of their nation.',
    },
    {
      id:1, name:'Muruah', arabic:'مروءة', x:238, y:64, color:C.orange,
      english:'Honour Code',
      desc:'Generosity, courage, and hospitality were the highest virtues. A man\'s reputation for these was everything. To be called stingy or cowardly was the deepest insult.',
      example:'Hosting a stranger lavishly, even at personal cost, was not kindness  -  it was obligation. To refuse was disgrace.',
    },
    {
      id:2, name:"Tha'r", arabic:'ثأر', x:160, y:152, color:C.coral,
      english:'Blood Vengeance',
      desc:'Injury to one tribe member required revenge on the offending tribe. This was a moral obligation, not a choice. It kept the peace through deterrence  -  but could trap tribes in cycles of violence for generations.',
      example:'A single killing could ignite a blood feud lasting decades, with each side obligated to avenge the last death.',
    },
  ];

  const sel = selected!==null ? PRINCIPLES[selected] : null;
  const allVisited = visited.every(Boolean);
  const visitedCount = visited.filter(Boolean).length;
  const EDGES=[[0,1],[1,2],[0,2]];

  return(
    <div style={{borderRadius:24,overflow:'hidden',marginBottom:22,border:`1px solid ${rgba(C.border,0.95)}`,boxShadow:`0 24px 70px ${rgba(C.navy,0.10)}`,background:'white'}}>
      {/* STAGE */}
      <div style={{background:'#fff',position:'relative'}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block'}}>
          <defs>
            <radialGradient id="tribalGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={rgba(C.gold,0.10)}/>
              <stop offset="100%" stopColor={rgba(C.gold,0)}/>
            </radialGradient>
          </defs>

          {/* Soft centre wash + faint eight-point star backdrop */}
          <circle cx={CX} cy={CY} r="78" fill="url(#tribalGlow)"/>
          <g opacity="0.05" transform={`translate(${CX} ${CY})`}>
            {[0,45].map(r=>(
              <rect key={r} x="-52" y="-52" width="104" height="104" fill="none" stroke={C.navy} strokeWidth="1" transform={`rotate(${r})`} rx="10"/>
            ))}
          </g>

          {/* Connector triangle */}
          {EDGES.map(([a,b],k)=>{
            const active = selected===a||selected===b;
            const edgeColor = active ? PRINCIPLES[selected].color : C.navy;
            return(
              <g key={k}>
                <line x1={PRINCIPLES[a].x} y1={PRINCIPLES[a].y} x2={PRINCIPLES[b].x} y2={PRINCIPLES[b].y}
                  stroke={rgba(C.navy, allVisited?0.14:0.07)} strokeWidth="1.4"
                  strokeDasharray={allVisited?'none':'3 3'}
                  style={{transition:'stroke 0.4s ease'}}/>
                {active&&(
                  <line x1={PRINCIPLES[a].x} y1={PRINCIPLES[a].y} x2={PRINCIPLES[b].x} y2={PRINCIPLES[b].y}
                    stroke={rgba(edgeColor,0.38)} strokeWidth="1.6" strokeDasharray="3 3" className="flow-dash"/>
                )}
              </g>
            );
          })}

          {/* Centre label */}
          <text x={CX} y={CY-2} textAnchor="middle" fontSize="8.5" fontWeight="700" letterSpacing="0.16em"
            fill={allVisited?C.gold:rgba(C.navy,0.30)} fontFamily="system-ui,sans-serif"
            style={{transition:'fill 0.5s ease',textTransform:'uppercase'}}>THE TRIBAL CODE</text>
          {allVisited&&(
            <g className="pop">
              <path d={`M ${CX} ${CY+5} l 3.4 3.4 l -3.4 3.4 l -3.4 -3.4 z`} fill={C.gold} opacity="0.85"/>
            </g>
          )}

          {/* Principle medallions */}
          {PRINCIPLES.map((p,i)=>{
            const isSel=selected===i;
            const dim = selected!==null && !isSel;
            const labelAbove = p.id===2;
            return(
              <g key={p.id} onClick={()=>tap(i)} style={{cursor:'pointer',opacity:dim?0.45:1,transition:'opacity 0.35s ease'}}>
                {/* Halo ring, selected only */}
                <circle cx={p.x} cy={p.y} r={isSel?30:24} fill="none"
                  stroke={rgba(p.color,isSel?0.30:0)} strokeWidth="1.2"
                  style={{transition:'r 0.3s cubic-bezier(.34,1.4,.64,1), stroke 0.3s ease'}}/>
                {/* Medallion */}
                <circle cx={p.x} cy={p.y} r={isSel?25:22} fill="#fff"
                  stroke={p.color} strokeWidth={isSel?1.8:1.2}
                  style={{transition:'r 0.3s cubic-bezier(.34,1.4,.64,1), stroke-width 0.3s ease',filter:isSel?`drop-shadow(0 4px 10px ${rgba(p.color,0.28)})`:'none'}}/>
                {/* Inner hairline */}
                <circle cx={p.x} cy={p.y} r={isSel?21:18.5} fill="none" stroke={rgba(p.color,0.28)} strokeWidth="0.6"
                  style={{transition:'r 0.3s cubic-bezier(.34,1.4,.64,1)'}}/>
                {/* Arabic calligraphy */}
                <text x={p.x} y={p.y+5.5} textAnchor="middle" fontSize={isSel?17:15} fontWeight="700"
                  fill={p.color} fontFamily="'Scheherazade New','Amiri',serif" direction="rtl"
                  style={{transition:'font-size 0.3s ease'}}>{p.arabic}</text>
                {/* Visited tick */}
                {visited[i]&&(
                  <g className="pop">
                    <circle cx={p.x+16} cy={p.y-16} r="4.6" fill={p.color} stroke="white" strokeWidth="1.2"/>
                    <path d={`M ${p.x+13.9} ${p.y-16} l 1.5 1.6 l 2.7 -3.1`} fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                )}
                {/* Name + english */}
                <text x={p.x} y={p.y+(labelAbove?-32:37)} textAnchor="middle" fontSize="10"
                  fontWeight="800" fill={isSel?p.color:rgba(C.navy,0.72)}
                  fontFamily="Georgia,serif" style={{transition:'fill 0.25s ease'}}>{p.name}</text>
                <text x={p.x} y={p.y+(labelAbove?-42:47)} textAnchor="middle" fontSize="7.2" fontWeight="700"
                  letterSpacing="0.1em" fill={rgba(C.navy,0.38)} fontFamily="system-ui,sans-serif"
                  style={{textTransform:'uppercase'}}>{p.english}</text>
              </g>
            );
          })}
        </svg>

        {/* Progress chip */}
        <div style={{position:'absolute',top:12,right:14,display:'flex',alignItems:'center',gap:6,padding:'6px 10px',borderRadius:999,background:'rgba(255,255,255,0.72)',border:`1px solid ${rgba(C.border,0.9)}`,backdropFilter:'blur(8px)'}}>
          {PRINCIPLES.map((p,i)=>(
            <div key={i} style={{width:7,height:7,borderRadius:999,background:visited[i]?p.color:rgba(C.navy,0.12),transition:'background 0.3s ease'}}/>
          ))}
          <span style={{fontSize:9.5,fontWeight:800,color:allVisited?C.gold:rgba(C.navy,0.45),marginLeft:2}}>{visitedCount} of 3</span>
        </div>
      </div>

      {/* PANEL */}
      <div style={{background:'white',borderTop:`1px solid ${rgba(C.navy,0.07)}`}}>
        {sel?(
          <div key={sel.id} style={{padding:'20px 24px'}} className="su">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:11}}>
              <div style={{width:4,alignSelf:'stretch',borderRadius:2,background:sel.color}}/>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.15}}>{sel.name}</div>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',color:sel.color,marginTop:3}}>{sel.english}</div>
              </div>
              <span style={{marginLeft:'auto',fontSize:24,color:sel.color,fontFamily:"'Scheherazade New','Amiri',serif",direction:'rtl',lineHeight:1}}>{sel.arabic}</span>
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.72,marginBottom:12}}>{sel.desc}</p>
            <div style={{padding:'12px 16px',borderRadius:12,background:rgba(sel.color,0.055),borderLeft:`3px solid ${rgba(sel.color,0.55)}`}}>
              <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:sel.color,marginBottom:5}}>Example</div>
              <p style={{fontSize:12.5,color:C.dark,lineHeight:1.62,margin:0,fontStyle:'italic'}}>{sel.example}</p>
            </div>
          </div>
        ):(
          <div style={{padding:'20px 24px',textAlign:'center'}} className="su">
            <p style={{fontSize:13,color:rgba(C.navy,0.42),margin:'0 0 14px',fontStyle:'italic'}}>
              Tap each principle to understand how the tribal system worked.
            </p>
            <div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap'}}>
              {PRINCIPLES.map((p,i)=>(
                <button key={i} onClick={()=>tap(i)}
                  style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:999,fontSize:11.5,fontWeight:800,color:p.color,background:rgba(p.color,0.07),border:`1px solid ${rgba(p.color,0.28)}`,cursor:'pointer'}}>
                  <span style={{fontFamily:"'Scheherazade New','Amiri',serif",fontSize:14,lineHeight:1}}>{p.arabic}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// QUESTION RENDERERS
// ================================================================

// Gold star seal - one per correct resolution, self-removes.
function GoldStar({style}){
  return(
    <svg className="seal" width="30" height="30" viewBox="0 0 30 30"
      style={{position:'absolute',pointerEvents:'none',zIndex:5,...style}} aria-hidden="true">
      <path d="M15 0 L18 12 L30 15 L18 18 L15 30 L12 18 L0 15 L12 12 Z" fill={G.gold}/>
    </svg>
  );
}

// Chunky answer surface used by every tappable answer element.
function Answer({state='idle',onClick,disabled,className='',shake,pop,children,style}){
  return(
    <button type="button" disabled={disabled||state==='done'} onClick={onClick}
      className={`chunky ${shake?'shake':''} ${pop?'ok-pop':''} ${className}`}
      style={{
        width:'100%',textAlign:'left',border:'2px solid',borderRadius:14,
        padding:'14px 16px',minHeight:52,fontSize:15,fontWeight:500,
        cursor:disabled?'default':'pointer',...answerStyle(state),...style,
      }}>
      {children}
    </button>
  );
}

// Shared slide-up feedback sheet. variant: correct | wrong | reflection.
function FeedbackSheet({variant,title,line,bridge,onContinue,continueLabel}){
  const ok=variant==='correct', refl=variant==='reflection';
  const bg=ok?G.sheetOkBg:refl?G.selBg:G.sheetNoBg;
  const titleInk=ok?G.okInk:refl?G.selInk:G.noInk;
  const lineInk=ok?G.okSupport:refl?G.selInk:G.noSupport;
  const btnBg=ok?G.okBorder:refl?G.selBorder:G.sheetNoEdge;
  const btnEdge=ok?G.okEdge:refl?G.selEdge:G.noSupport;
  return(
    <div className="sheet" style={{marginTop:16,borderRadius:'18px',background:bg,padding:'16px 18px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:line?7:0}}>
        {ok&&<Star className="w-4 h-4 flex-shrink-0" style={{color:G.gold}} fill={G.gold}/>}
        <span style={{fontSize:15,fontWeight:600,color:titleInk}}>{title}</span>
      </div>
      {line&&<div style={{fontSize:12.5,lineHeight:1.65,color:lineInk}}>{md(line)}</div>}
      {bridge&&(
        <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${rgba(G.okBorder,0.22)}`,display:'flex',gap:6,alignItems:'flex-start'}}>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:lineInk}}/>
          <span style={{fontSize:11.5,fontStyle:'italic',lineHeight:1.55,color:lineInk}}>{md(bridge)}</span>
        </div>
      )}
      <button type="button" onClick={onContinue} className="chunky"
        style={{marginTop:14,width:'100%',padding:'12px 0',borderRadius:14,border:'none',
          color:'#fff',fontSize:14,fontWeight:700,background:btnBg,boxShadow:`0 4px 0 ${btnEdge}`,
          '--edge':btnEdge,cursor:'pointer',minHeight:48}}>
        {continueLabel||'Continue'}
      </button>
    </div>
  );
}

// --- MCQ ---
function MCQ({q,onFinish}){
  const [sel,setSel]=useState(null);
  const [phase,setPhase]=useState('pick');   // pick | resolved
  const [shakeId,setShakeId]=useState(null);
  const [reveal,setReveal]=useState(false);   // wrong-path: calmly show the correct option
  const lockedRef=useRef(false);

  const pick=(i)=>{ if(phase!=='pick')return; SFX.tick();haptic(5); setSel(s=>s===i?null:i); };

  const check=()=>{
    if(sel===null||phase!=='pick'||lockedRef.current)return;
    lockedRef.current=true;
    const opt=q.options[sel];
    setPhase('resolved');
    if(opt.correct){
      SFX.match();haptic(10);
      onFinish(true,q.feedback[opt.id],10);
    }else{
      SFX.wrong();haptic(30);
      setShakeId(sel);
      setTimeout(()=>setShakeId(null),M.wrongShake);
      // The truth is stated, not celebrated: pause, then highlight the correct option.
      setTimeout(()=>{ setReveal(true); onFinish(false,q.feedback[opt.id],0); },M.correctRevealDelay);
    }
  };

  const stateFor=(i,opt)=>{
    if(phase==='pick') return sel===i?'selected':'idle';
    if(opt.correct)    return (sel===i||reveal)?'correct':'done';
    if(sel===i)        return 'wrong';
    return 'done';
  };

  return(
    <div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
        {q.options.map((opt,i)=>{
          const st=stateFor(i,opt);
          const dotOn=st==='selected'||st==='correct';
          const dotColor=st==='correct'?G.okBorder:st==='wrong'?G.noBorder:G.selBorder;
          return(
            <div key={opt.id} style={{position:'relative'}}>
              <Answer state={st} shake={shakeId===i} pop={st==='correct'&&sel===i} onClick={()=>pick(i)}
                style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{flex:1,lineHeight:1.4}}>{opt.text}</span>
                <span style={{width:20,height:20,borderRadius:999,flexShrink:0,
                  border:`2px solid ${dotOn?dotColor:G.border}`,background:dotOn?dotColor:'transparent',
                  display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {dotOn&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
              </Answer>
              {st==='correct'&&sel===i&&<GoldStar style={{top:-8,right:-6}}/>}
            </div>
          );
        })}
      </div>
      {phase==='pick'&&(
        <button type="button" onClick={check} disabled={sel===null} className="chunky"
          style={{width:'100%',padding:'14px 0',borderRadius:14,border:'none',fontSize:15,fontWeight:700,minHeight:48,
            ...(sel===null
              ?{background:G.border,color:'#A5AEBF',cursor:'not-allowed'}
              :{background:G.selBorder,color:'#fff',boxShadow:`0 4px 0 ${G.selEdge}`,'--edge':G.selEdge,cursor:'pointer'})}}>
          Check
        </button>
      )}
    </div>
  );
}

// --- RAPID FIRE TRUE/FALSE (Q1) ---
function RapidFireTF({q,onFinish}){
  const [idx,setIdx]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [answered,setAnswered]=useState(null); // {val, correct, stmt} for current statement
  const [done,setDone]=useState(false);
  const [shakeVal,setShakeVal]=useState(null);
  const lockedRef=useRef(false);

  const choose=(val)=>{
    if(done||answered!==null) return;
    const stmt=q.statements[idx];
    const correct=val===stmt.answer;
    setAnswers(a=>[...a,{val,correct,stmt}]);
    setAnswered({val,correct,stmt});
    if(correct){ SFX.match(); haptic(10); }
    else { SFX.wrong(); haptic(30); setShakeVal(val); setTimeout(()=>setShakeVal(null),M.wrongShake); }
  };

  const next=()=>{
    if(idx<q.statements.length-1){
      setIdx(idx+1);
      setAnswered(null);
    } else {
      setDone(true);
      if(!lockedRef.current){
        lockedRef.current=true;
        const ok=answers.filter(a=>a.correct).length;
        onFinish(ok>=4,q.feedbackText,ok*2,{ok,total:q.statements.length});
      }
    }
  };

  const stmt=q.statements[idx];
  const isLast=idx===q.statements.length-1;

  if(done){
    return(
      <div className="su">
        <p className="text-xs font-semibold mb-3" style={{color:G.muted}}>All {q.statements.length} statements</p>
        <div className="space-y-2">
          {answers.map((a,i)=>(
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
              style={{background:a.correct?G.okBg:G.noBg}}>
              {a.correct?<CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:G.okInk}}/>:<XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:G.noInk}}/>}
              <div className="flex-1">
                <p className="text-xs font-medium leading-snug mb-1" style={{color:G.ink}}>{a.stmt.text}</p>
                <p className="text-[11px] leading-relaxed" style={{color:a.correct?G.okSupport:G.noSupport}}>{a.stmt.feedback}</p>
              </div>
              <span className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-full"
                style={{background:a.correct?G.okBorder:G.noBorder,color:'white'}}>
                {a.stmt.answer==='true'?'T':'F'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tfState=(val)=> !answered ? 'idle' : (answered.val===val ? (answered.correct?'correct':'wrong') : 'done');

  return(
    <div>
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {q.statements.map((_,i)=>(
          <div key={i} style={{
            width:i===idx?24:8,height:8,borderRadius:4,
            background:i<answers.length?(answers[i].correct?G.okBorder:G.noBorder):i===idx?G.subject:G.border,
            transition:'all 0.3s ease',
          }}/>
        ))}
        <span className="text-xs ml-auto" style={{color:G.muted}}>{idx+1} of {q.statements.length}</span>
      </div>

      {/* Statement card - white */}
      <div className="rounded-xl p-5 mb-4" style={{background:'#fff',border:`2px solid ${G.border}`}}>
        <p className="leading-relaxed text-center" style={{color:G.ink,fontFamily:'Georgia,serif',fontSize:16,fontWeight:500}}>{stmt.text}</p>
      </div>

      {/* True / False - chunky answer grammar */}
      <div style={{display:'flex',gap:12}}>
        <Answer state={tfState('true')} shake={shakeVal==='true'} pop={tfState('true')==='correct'}
          onClick={()=>choose('true')} style={{textAlign:'center',justifyContent:'center',display:'flex',fontWeight:700}}>
          <span style={{width:'100%',textAlign:'center'}}>True</span>
        </Answer>
        <Answer state={tfState('false')} shake={shakeVal==='false'} pop={tfState('false')==='correct'}
          onClick={()=>choose('false')} style={{textAlign:'center',justifyContent:'center',display:'flex',fontWeight:700}}>
          <span style={{width:'100%',textAlign:'center'}}>False</span>
        </Answer>
      </div>

      {/* Feedback after answering */}
      {answered&&(
        <div className="fi" style={{marginTop:14,borderRadius:14,padding:'14px 16px',background:answered.correct?G.okBg:G.noBg}}>
          <div className="text-sm font-bold mb-1" style={{color:answered.correct?G.okInk:G.noInk}}>
            {answered.correct?'Correct':'Not quite'}
            <span className="ml-2 text-xs font-semibold" style={{color:G.steel}}>Answer: {stmt.answer==='true'?'True':'False'}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{color:answered.correct?G.okSupport:G.noSupport}}>{stmt.feedback}</p>
        </div>
      )}

      {/* Next */}
      {answered&&(
        <button type="button" onClick={next} className="chunky su"
          style={{marginTop:14,width:'100%',padding:'13px 0',borderRadius:14,border:'none',fontSize:14,fontWeight:700,minHeight:48,
            background:G.selBorder,color:'#fff',boxShadow:`0 4px 0 ${G.selEdge}`,'--edge':G.selEdge,cursor:'pointer'}}>
          {isLast?'See results':'Next statement'}
        </button>
      )}
    </div>
  );
}

// --- BUCKET SORT (Q3) ---
function BucketSort({q,onFinish}){
  const [assignments,setAssignments]=useState({});
  const [held,setHeld]=useState(null);
  const [submitted,setSubmitted]=useState(false);
  const [results,setResults]=useState({});
  const lockedRef=useRef(false);

  const allPlaced=q.cards.length===Object.keys(assignments).length;

  const selectCard=(cardId)=>{
    if(submitted)return;
    SFX.tick();haptic(5);
    setHeld(h=>h===cardId?null:cardId);
  };
  const assignToBucket=(bucketId)=>{
    if(!held||submitted)return;
    SFX.place();haptic(5);
    setAssignments(prev=>({...prev,[held]:bucketId}));
    setHeld(null);
  };
  const removeAssignment=(cardId)=>{
    if(submitted)return;
    SFX.tick();
    setAssignments(prev=>{const n={...prev};delete n[cardId];return n;});
    setHeld(cardId);
  };

  const submit=()=>{
    if(!allPlaced||submitted||lockedRef.current)return;
    lockedRef.current=true;
    const res={};
    q.cards.forEach(c=>{ res[c.id]=assignments[c.id]===c.bucket; });
    setResults(res);
    setSubmitted(true);
    const ok=Object.values(res).filter(Boolean).length;
    const total=q.cards.length;
    if(ok>=5){SFX.done();haptic(20);} else {SFX.wrong();haptic(30);}
    onFinish(ok>=5,ok===total?q.feedback.perfect:ok>=4?q.feedback.good:q.feedback.low,ok===total?10:ok>=4?7:ok*2,{ok,total});
  };

  const unassigned=q.cards.filter(c=>!assignments[c.id]);

  return(
    <div>
      <p className="text-xs mb-4" style={{color:G.steel}}>
        {submitted?'Results shown below.':'Tap a card, then tap a category to place it.'}
      </p>

      {/* Buckets - white cards, category colour as identity only */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
        {q.buckets.map(b=>{
          const cards=q.cards.filter(c=>assignments[c.id]===b.id);
          const isTarget=held!==null&&!submitted;
          return(
            <div key={b.id}
              onClick={()=>assignToBucket(b.id)}
              style={{
                borderRadius:14,border:`2px dashed ${isTarget?b.color:rgba(b.color,0.4)}`,
                background:'#fff',boxShadow:isTarget?`0 0 0 3px ${rgba(b.color,0.12)}`:'none',
                padding:'10px 8px',minHeight:96,cursor:isTarget?'pointer':'default',
                transition:'box-shadow 0.2s ease, border-color 0.2s ease',
              }}>
              <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:b.color,marginBottom:6,textAlign:'center'}}>{b.label}</div>
              {cards.map(c=>{
                const isCorrect=submitted?results[c.id]:null;
                return(
                  <div key={c.id}
                    onClick={e=>{e.stopPropagation();removeAssignment(c.id);}}
                    style={{
                      fontSize:11,fontWeight:600,padding:'6px 7px',borderRadius:8,marginBottom:4,
                      background:isCorrect===true?G.okBg:isCorrect===false?G.noBg:'#fff',
                      color:isCorrect===true?G.okInk:isCorrect===false?G.noInk:b.color,
                      border:`1px solid ${isCorrect===true?G.okBorder:isCorrect===false?G.noBorder:rgba(b.color,0.3)}`,
                      cursor:submitted?'default':'pointer',
                      display:'flex',alignItems:'center',gap:4,
                    }}>
                    {isCorrect===true&&<CheckCircle className="w-3 h-3 flex-shrink-0"/>}
                    {isCorrect===false&&<XCircle className="w-3 h-3 flex-shrink-0"/>}
                    {c.label}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Cards to sort - chunky white pills */}
      {!submitted&&unassigned.length>0&&(
        <div style={{marginBottom:14}}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:G.muted}}>Cards to sort</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {unassigned.map(c=>{
              const on=held===c.id;
              return(
                <button key={c.id} type="button" onClick={()=>selectCard(c.id)} className="chunky"
                  style={{
                    fontSize:12.5,fontWeight:600,padding:'10px 14px',borderRadius:12,minHeight:44,border:'2px solid',
                    ...(on
                      ?{background:G.selBg,borderColor:G.selBorder,color:G.selInk,boxShadow:`0 4px 0 ${G.selEdge}`,'--edge':G.selEdge}
                      :{background:'#fff',borderColor:G.border,color:G.ink,boxShadow:`0 4px 0 ${G.edge}`,'--edge':G.edge}),
                    cursor:'pointer',
                  }}>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit */}
      {!submitted&&(
        <button type="button" onClick={submit} disabled={!allPlaced} className="chunky"
          style={{width:'100%',padding:'14px 0',borderRadius:14,border:'none',fontSize:14,fontWeight:700,minHeight:48,
            ...(allPlaced
              ?{background:G.selBorder,color:'#fff',boxShadow:`0 4px 0 ${G.selEdge}`,'--edge':G.selEdge,cursor:'pointer'}
              :{background:G.border,color:'#A5AEBF',cursor:'not-allowed'})}}>
          Check {Object.keys(assignments).length}/{q.cards.length} placed
        </button>
      )}

      {/* Per-card feedback after submit */}
      {submitted&&(
        <div className="space-y-2 mt-3">
          {q.cards.map(c=>(
            <div key={c.id} className="flex items-start gap-2 p-2.5 rounded-xl fi"
              style={{background:results[c.id]?G.okBg:G.noBg}}>
              {results[c.id]?<CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:G.okInk}}/>:<XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:G.noInk}}/>}
              <div>
                <span className="text-xs font-bold" style={{color:results[c.id]?G.okInk:G.noInk}}>{c.label}</span>
                <span className="text-xs ml-1.5" style={{color:G.steel}}>{c.feedback}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- FILL IN BLANK (Q5) ---
function FillInBlank({q,onFinish}){
  const [sels,setSels]=useState(Array(q.blanks.length).fill(''));
  const [submitted,setSubmitted]=useState(false);
  const [results,setResults]=useState([]);
  const lockedRef=useRef(false);

  const allFilled=sels.every(s=>s!=='');

  const set=(i,val)=>{
    const n=[...sels];n[i]=val;setSels(n);
  };

  const submit=()=>{
    if(!allFilled||submitted||lockedRef.current)return;
    lockedRef.current=true;
    const res=sels.map((s,i)=>s===q.blanks[i].answer);
    setResults(res);
    setSubmitted(true);
    const ok=res.filter(Boolean).length;
    if(ok===q.blanks.length){SFX.done();haptic(20);} else {SFX.wrong();haptic(30);}
    onFinish(ok===q.blanks.length,ok===q.blanks.length?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low,ok===q.blanks.length?10:ok>=3?7:ok*2,{ok,total:q.blanks.length});
  };

  // Split passage at blank markers [B0], [B1], [B2], [B3]
  const parts=q.passage.split(/(\[B\d\])/);

  return(
    <div>
      <div className="rounded-xl p-4 mb-5" style={{background:'#fff',border:`2px solid ${G.border}`}}>
        <p className="leading-relaxed" style={{color:G.ink,fontSize:15,lineHeight:2.1}}>
          {parts.map((part,i)=>{
            const match=part.match(/\[B(\d)\]/);
            if(!match) return <span key={i}>{part}</span>;
            const bi=parseInt(match[1]);
            const blank=q.blanks[bi];
            const val=sels[bi];
            const isCorrect=submitted&&results[bi];
            const isWrong=submitted&&!results[bi];
            return(
              <select key={i} value={val} disabled={submitted}
                onChange={e=>{ if(e.target.value) SFX.tick(); set(bi,e.target.value); }}
                style={{
                  display:'inline-block',marginInline:4,padding:'4px 8px',
                  borderRadius:10,border:`2px solid`,
                  borderColor:isCorrect?G.okBorder:isWrong?G.noBorder:val?G.selBorder:G.border,
                  background:isCorrect?G.okBg:isWrong?G.noBg:val?G.selBg:'#fff',
                  color:isCorrect?G.okInk:isWrong?G.noInk:val?G.selInk:G.muted,
                  fontSize:14,fontWeight:600,cursor:'pointer',appearance:'auto',
                }}>
                <option value="">choose</option>
                {blank.options.map(o=>(
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            );
          })}
        </p>
      </div>

      {submitted&&(
        <div className="space-y-2 mb-4">
          {q.blanks.map((b,i)=>(
            <div key={i} className="flex items-start gap-2 text-xs fi">
              {results[i]
                ?<CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:G.okInk}}/>
                :<XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:G.noInk}}/>}
              <span style={{color:results[i]?G.okInk:G.noInk,fontWeight:700}}>{b.answer}</span>
              <span style={{color:G.steel}}>{b.feedback}</span>
            </div>
          ))}
        </div>
      )}

      {!submitted&&(
        <button type="button" onClick={submit} disabled={!allFilled} className="chunky"
          style={{width:'100%',padding:'14px 0',borderRadius:14,border:'none',fontSize:14,fontWeight:700,minHeight:48,
            ...(allFilled
              ?{background:G.selBorder,color:'#fff',boxShadow:`0 4px 0 ${G.selEdge}`,'--edge':G.selEdge,cursor:'pointer'}
              :{background:G.border,color:'#A5AEBF',cursor:'not-allowed'})}}>
          Check
        </button>
      )}
    </div>
  );
}

// --- REFLECTION MULTI SELECT ---
function ReflectionMultiSelect({q,onFinish}){
  const [selected,setSelected]=useState(new Set());
  const [sub,setSub]=useState(false);
  const lockedRef=useRef(false);
  const toggle=(id)=>{ if(sub)return; SFX.tick();haptic(5); setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;}); };
  const submit=()=>{
    if(sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    onFinish(true,q.feedbackSummary,0);
  };
  return(
    <div>
      <div className="space-y-2.5 mb-5">
        {q.options.map(opt=>{
          const isSel=selected.has(opt.id);
          return(
            <button key={opt.id} type="button" onClick={()=>toggle(opt.id)} disabled={sub} className="chunky"
              style={{width:'100%',textAlign:'left',padding:'14px 16px',borderRadius:14,border:'2px solid',
                background:isSel?G.selBg:'#fff',borderColor:isSel?G.selBorder:G.border,
                color:G.ink,boxShadow:`0 4px 0 ${isSel?G.selEdge:G.edge}`,'--edge':isSel?G.selEdge:G.edge,
                cursor:sub?'default':'pointer'}}>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center" style={{border:'2px solid',borderColor:isSel?G.selBorder:G.border,background:isSel?G.selBorder:'#fff'}}>
                  {isSel&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </div>
                <div className="flex-1">
                  <div className="text-sm leading-relaxed" style={{color:G.ink}}>{opt.text}</div>
                  {sub&&isSel&&opt.feedback&&(
                    <div className="text-xs mt-2 fi leading-relaxed" style={{color:G.selInk,fontStyle:'italic'}}>{opt.feedback}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {!sub&&(
        <button type="button" onClick={submit} disabled={selected.size===0} className="chunky"
          style={{width:'100%',padding:'14px 0',borderRadius:14,border:'none',fontSize:14,fontWeight:700,minHeight:48,
            ...(selected.size>0
              ?{background:G.selBorder,color:'#fff',boxShadow:`0 4px 0 ${G.selEdge}`,'--edge':G.selEdge,cursor:'pointer'}
              :{background:G.border,color:'#A5AEBF',cursor:'not-allowed'})}}>
          Share reflection
        </button>
      )}
    </div>
  );
}

// ================================================================
// DATA
// ================================================================
const SECTIONS = [
  {
    id:'A', title:'The Arabian Peninsula',
    content:[
      'Islamic history did not emerge from the margins of the ancient world. The Arabian Peninsula sat at its very centre  -  a vast landmass roughly the size of Western Europe, bordered by the Red Sea to the west, the Persian Gulf to the east, and the Indian Ocean to the south.',
      'Most of it was desert: harsh, dry, and unforgiving. The interior  -  called the **Najd**  -  was home to nomadic Bedouin tribes who moved with their livestock across the land. The fertile southwest, **Yemen**, supported settled agriculture and was the source of the famous incense route. And the **Hijaz**  -  the thin western coastal strip  -  contained the two cities that would change the world: Makkah and Yathrib (later renamed Madinah after the Hijra).',
      'Makkah\'s position was not an accident. It sat at the intersection of two great trade arteries that connected the ancient world\'s superpowers. Every caravan moving between the great empires passed near it. And whoever controlled this crossroads controlled the wealth of Arabia.',
    ],
    arabiaDiagram: true,
    callout:{
      type:'insight',
      title:'Surat Quraysh  -  Quran 106',
      text:'"For the accustomed security of the Quraysh  -  their accustomed security in the caravan journeys of winter and summer  -  let them worship the Lord of this House." (Quran 106:1-3). The Quran itself references the two seasonal caravans  -  winter to Yemen, summer to Syria  -  that were the backbone of Meccan power.',
    },
  },
  {
    id:'B', title:'The Tribal System',
    content:[
      'In the absence of a central government, pre-Islamic Arabia was organised entirely around tribes. A tribe was not just a family  -  it was a complete social, legal, and military system. Your tribe determined your identity, your safety, your legal rights, and your obligations.',
      'This system produced a society of extraordinary courage and hospitality. The same values that made Arab culture celebrated in poetry also made it capable of extreme violence and deep injustice toward those without tribal protection. **A slave had no tribe. A woman had limited standing. A stranger was vulnerable.**',
      'This is the world the Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ was born into. And one of the most remarkable things he achieved was transforming it  -  redirecting these fierce tribal loyalties toward a single Ummah, united not by blood but by faith.',
    ],
    tribalDiagram: true,
  },
  {
    id:'C', title:'Arabia Between Two Superpowers',
    content:[
      'Pre-Islamic Arabia did not exist in isolation. It sat between the two dominant empires of the ancient world: the **Byzantine (Eastern Roman) Empire** to the northwest, controlling Syria, Egypt, and Anatolia  -  and the **Sasanian (Persian) Empire** to the northeast, controlling Iraq, Iran, and Central Asia.',
      'Both empires had fought each other for centuries and were, by the early 600s CE, exhausted by war. Arabia was the gap between them  -  technically outside both empires\' control, but economically vital to both. Arab tribes on the northern borders often served as buffer states or mercenary allies. The Arabs were not isolated: they were **connected to, but not controlled by**, the great civilisations of their time.',
      'This matters because when Islam emerged, it spread not into a vacuum but into a world already structured by these imperial relationships. Within decades of the Prophet\'s صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ death, the Muslim armies would shatter both empires  -  not because they came from nowhere, but because they came from the exact geographic and economic heart of the ancient world.',
    ],
  },
];

const QUESTIONS = [
  {
    id:'q1', afterSection:'A', scored:true,
    type:'rapid-fire-tf', mode:'PLAY', typeLabel:'Rapid True or False', level:'1/5',
    question:'Five quick statements about Arabian geography. True or False?',
    feedbackText:'Geography is the foundation of everything that follows in this module. The location of Makkah, the desert interior, the trade routes  -  all of it shaped how Islam emerged and spread.',
    statements:[
      {
        text:'The Arabian Peninsula is bordered by the Red Sea to the west.',
        answer:'true',
        feedback:'True. The Red Sea forms the western border, making it a natural gateway between Africa, Egypt, and the peninsula.',
      },
      {
        text:'Most of the interior of Arabia is fertile farmland.',
        answer:'false',
        feedback:'False. The interior (Najd) is arid desert. Only Yemen in the southwest had reliable agriculture  -  earning it the ancient nickname "Arabia Felix" (Fertile Arabia).',
      },
      {
        text:'Makkah is located in the Hijaz region.',
        answer:'true',
        feedback:'True. The Hijaz is the western coastal strip. Makkah and Yathrib (later: Madinah) are both located here. The name means "barrier"  -  the region sits between the coastal plains and the desert interior.',
      },
      {
        text:'Yemen is in the southwest of the Arabian Peninsula.',
        answer:'true',
        feedback:'True. Yemen\'s location in the southwest gave it access to the Indian Ocean trade and made it the source of the famous incense route northward.',
      },
      {
        text:'Arabia was isolated from the major ancient trade routes.',
        answer:'false',
        feedback:'False. Arabia was at the intersection of major trade routes connecting the Byzantine Empire, Persia, India, and East Africa. This centrality was one reason the final message was sent here.',
      },
    ],
  },
  {
    id:'q2', afterSection:'A', scored:true,
    type:'mcq', mode:'THINK', typeLabel:'Multiple choice', level:'2/5',
    question:'Why was Makkah particularly important to ancient trade routes?',
    options:[
      {id:'a', text:'It was the largest and most populous city on the Arabian Peninsula', correct:false},
      {id:'b', text:'It sat at the crossroads of north-south and east-west trade arteries', correct:true},
      {id:'c', text:'It had the most fertile land and freshwater sources in Arabia', correct:false},
      {id:'d', text:'It was the closest Arab settlement to the Persian Empire', correct:false},
    ],
    feedback:{
      a:'Makkah was not the largest city. Cities like Sanaa in Yemen or towns along the Euphrates were more populated. Makkah\'s significance was geographic and religious, not demographic.',
      b:'Correct. The north-south incense route (Yemen to Syria) and the east-west route (Persian Gulf to Red Sea) both passed near Makkah. The Quraysh leveraged this position to build a commercial and religious empire  -  and it is why Makkah became the undisputed centre of Arabia.',
      c:'Makkah\'s valley is actually quite arid. The Quran records Ibrahim عَلَيْهِ السَّلَام describing it as "an uncultivated valley" (14:37). Its importance was geographic and spiritual, not agricultural.',
      d:'Makkah is in the Hijaz on the western side of Arabia  -  it is actually distant from Persia. The Persian Gulf coast (eastern Arabia) was far closer to Persian influence.',
    },
    bridge:'The Quraysh built their entire identity on controlling this crossroads. In L1.5 you will see exactly how they turned geographic advantage into political and religious power.',
  },
  {
    id:'q3', afterSection:'B', scored:true,
    type:'bucket-sort', mode:'SORT', typeLabel:'Sort into categories', level:'2/5',
    question:'Sort these six features of pre-Islamic Arabia into the correct category.',
    buckets:[
      {id:'geo',    label:'Geographic',     color:C.teal},
      {id:'eco',    label:'Economic',       color:C.gold},
      {id:'social', label:'Social/Tribal',  color:C.navy},
    ],
    cards:[
      {id:'c1', label:'Desert interior (Najd)',       bucket:'geo',    feedback:'A geographic feature  -  the arid central plateau that shaped Bedouin nomadic life.'},
      {id:'c2', label:'Control of trade routes',      bucket:'eco',    feedback:'Economic  -  controlling the routes was the Quraysh\'s primary commercial advantage.'},
      {id:'c3', label:"Asabiyyah (tribal loyalty)",   bucket:'social', feedback:'Social  -  the defining glue of tribal Arabia, governing relationships and obligations.'},
      {id:'c4', label:'The Hijaz coastal strip',      bucket:'geo',    feedback:'Geographic  -  the western coastal region containing Makkah and Yathrib (later renamed Madinah).'},
      {id:'c5', label:'Caravan trade networks',       bucket:'eco',    feedback:'Economic  -  referenced directly in the Quran (Surat Quraysh 106:2): caravans of winter and summer.'},
      {id:'c6', label:"Blood vengeance (Tha'r)",      bucket:'social', feedback:'Social  -  a tribal obligation that locked communities in cycles of vengeance, replaced by Islamic justice.'},
    ],
    feedback:{
      perfect:'All six sorted correctly. These three categories  -  geographic, economic, social  -  are the lens through which you will read all of pre-Islamic Arabian history.',
      good:'Almost there. Review the one or two you missed. The key: Najd and Hijaz are geographic; trade routes and caravans are economic; Asabiyyah and Tha\'r are social.',
      low:'The pattern: land features are geographic; commerce features are economic; tribal codes are social. Go back to the teaching content and it will click.',
    },
  },
  {
    id:'q4', afterSection:'C', scored:true,
    type:'mcq', mode:'THINK', typeLabel:'Multiple choice', level:'3/5',
    question:'A historian argues: "Pre-Islamic Arabs were fully isolated from the civilised world." Based on what you have learned, what is the most accurate response?',
    options:[
      {id:'a', text:'This is correct  -  the vast desert formed a complete barrier between Arabia and other civilisations', correct:false},
      {id:'b', text:'This is partially correct  -  Arabs were geographically isolated but had some limited trade contact', correct:false},
      {id:'c', text:'This is incorrect  -  Arabia sat between the Byzantine and Sasanian Empires and was central to ancient trade routes', correct:true},
      {id:'d', text:'This is incorrect  -  Arabia was in fact fully part of the Byzantine Empire', correct:false},
    ],
    feedback:{
      a:'The desert created challenges but not isolation. Arab traders routinely crossed it. Makkah\'s entire economy depended on trade with Syria (Byzantine) and Yemen  -  neither is inside Arabia\'s desert interior.',
      b:'This underestimates the connection. Arabs were not peripheral  -  they were the essential economic link between major empires. Northern tribes had formal alliances with both Byzantine and Sasanian powers.',
      c:'Correct. Arabia was geographically central  -  positioned between the two dominant empires of the age. When Islam spread, it expanded into a world it was already economically and diplomatically connected to. This position explains the speed of early Islamic expansion.',
      d:'The Hijaz was never under Byzantine control. Some northern Arab tribes had Byzantine alliances (the Ghassanids), but Makkah and the Hijaz were politically independent. This matters: the message came through a community that answered to no empire.',
    },
    bridge:'In L1.3 you will examine what life inside this connected but ungoverned society actually looked like  -  and the Quran\'s name for it.',
  },
  {
    id:'q5', afterSection:'C', scored:true,
    type:'fill-in-blank', mode:'THINK', typeLabel:'Fill in the blanks', level:'3/5',
    question:'Complete the passage with the correct terms.',
    passage:'The Arabian Peninsula sits between the [B0] Empire to the northwest and the [B1] Empire to the northeast. The region containing Makkah and Yathrib is called the [B2]. The most powerful tribe controlling the trade routes of this region was the [B3].',
    blanks:[
      {
        answer:'Byzantine',
        options:['Byzantine','Ottoman','Abbasid'],
        feedback:'The Byzantine (Eastern Roman) Empire controlled Syria, Egypt, and Anatolia to the northwest.',
      },
      {
        answer:'Sasanian',
        options:['Sasanian','Mongol','Umayyad'],
        feedback:'The Sasanian (Persian) Empire controlled Iraq, Iran, and Central Asia to the northeast.',
      },
      {
        answer:'Hijaz',
        options:['Hijaz','Najd','Yemen'],
        feedback:'The Hijaz is the western coastal strip containing Makkah and Yathrib. Its name means "barrier"  -  sitting between the coastal plains and the desert interior.',
      },
      {
        answer:'Quraysh',
        options:['Quraysh','Ansar','Khazraj'],
        feedback:'The Quraysh controlled the Ka\'bah and the trade routes. Their commercial and religious power made them Arabia\'s dominant tribe.',
      },
    ],
    feedback:{
      perfect:'All four correct. You now hold the geographic and political framework for everything that follows in this module.',
      good:'Almost  -  review the one or two you missed. These four terms will reappear throughout the entire H-B1 module.',
      low:'The key facts: Byzantine (northwest), Sasanian (northeast), Hijaz (region of Makkah), Quraysh (dominant tribe). Go back to Section C and they will all click into place.',
    },
  },
  {
    id:'q6', afterSection:'C', scored:false,
    type:'reflection-multi', mode:'THINK', typeLabel:'Personal reflection', level:'5/5',
    question:'After this lesson, which of the following resonates with you? (Select all that apply  -  not graded.)',
    options:[
      {id:'r1', text:'I now understand why Makkah specifically was where it was  -  the geography makes sense',         feedback:'The location was not arbitrary. Ibrahim عَلَيْهِ السَّلَام described it as an uncultivated valley (14:37)  -  and yet it became the centre of the world. The crossroads made it inevitable.'},
      {id:'r2', text:'The tribal system feels familiar  -  I can see versions of it in the world today',               feedback:'Asabiyyah, Muruah, and Tha\'r did not disappear  -  they were transformed. Islam redirected these loyalties toward a community defined by faith, not blood.'},
      {id:'r3', text:'I had not realised how connected Arabia was to the Byzantine and Persian worlds',              feedback:'Most people imagine a remote desert. The reality is that Arabia was the economic backbone of the ancient world. That is why Islam spread so rapidly  -  into a world it was already woven into.'},
      {id:'r4', text:'The idea of Surat Quraysh  -  that Allah سُبْحَانَهُ وَتَعَالَى is the source of their security  -  is powerful',     feedback:'That is the verse\'s entire point. The Quraysh had built a commercial empire  -  and the Quran reminded them: the source of that empire is the Lord of the Ka\'bah. Worship Him.'},
      {id:'r5', text:'I want to understand more about the specific tribes and their relationships',                  feedback:'That depth comes in L1.5 when we examine the Quraysh in detail  -  their clans, their structure, and why their strengths made them the fiercest opponents of the Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ.'},
      {id:'r6', text:'The idea that geography shaped everything  -  trade, power, religion  -  is something I find compelling', feedback:'Geography as theology. The crossroads was not a coincidence  -  it was preparation. The world was arranged so that the final message would emerge from its centre.'},
    ],
    feedbackSummary:'Your reflections are noted. The land, the tribes, the trade routes, the empires  -  none of it is background noise. All of it is preparation. L1.3 takes you inside this society to examine what daily life actually looked like before the revelation.',
  },
];

const SCORED_COUNT = QUESTIONS.filter(q=>q.scored!==false).length; // 5

const FLOW = (()=>{
  const f=[];
  SECTIONS.forEach(sec=>{
    f.push({type:'section',data:sec});
    QUESTIONS.filter(q=>q.afterSection===sec.id).forEach(q=>f.push({type:'question',data:q}));
  });
  return f;
})();

// ================================================================
// SECTION CARD
// ================================================================
function SectionCard({section,onContinue}){
  const [focused,    setFocused]    = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const activate = useCallback(()=>{ setFocused(true); setHasStarted(true); },[]);
  const escape   = useCallback(()=>setFocused(false),[]);

  const ACCENTS={A:C.teal,B:C.orange,C:C.navy};
  const accent=ACCENTS[section.id]||C.teal;

  const textStyle={
    transition:'filter 0.5s ease, opacity 0.5s ease',
    filter:focused?'blur(2px)':'none',
    opacity:focused?0.22:1,
    pointerEvents:focused?'none':'auto',
    userSelect:focused?'none':'auto',
  };
  const hasDiagram=section.arabiaDiagram||section.tribalDiagram;

  return(
    <div className="su rounded-3xl overflow-hidden" style={{background:'#fff',border:focused?`1.5px solid ${rgba(accent,0.55)}`:`1px solid ${G.border}`,transition:'border-color 0.45s ease, box-shadow 0.45s ease',boxShadow:focused?`0 0 0 4px ${rgba(accent,0.08)}, 0 16px 44px ${rgba(C.navy,0.12)}`:`0 1px 2px ${rgba(C.navy,0.04)}, 0 12px 32px ${rgba(C.navy,0.06)}`}}>

      {/* HEADER */}
      <div className="px-5 pt-6 pb-5" style={{borderBottom:`1px solid ${rgba(C.border,0.75)}`,background:`linear-gradient(135deg,${rgba(accent,0.08)},rgba(255,255,255,0.20))`,transition:'opacity 0.5s ease, filter 0.5s ease',...(focused?{opacity:0.25,filter:'blur(1.5px)',pointerEvents:'none'}:{})}}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black" style={{background:`linear-gradient(135deg,${rgba(accent,0.18)},rgba(255,255,255,0.82))`,color:accent,border:`1px solid ${rgba(accent,0.20)}`,boxShadow:`inset 0 1px 0 rgba(255,255,255,0.65)`}}>{section.id}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{color:rgba(C.navy,0.35)}}>Section {section.id}</div>
            <h2 className="text-2xl font-black leading-tight" style={{color:C.navy,fontFamily:'Georgia,serif',letterSpacing:'-0.02em'}}>{section.title}</h2>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-6">
        {/* TEXT */}
        <div style={textStyle}>
          {section.content.map((p,i)=>(
            <p key={i} className="leading-relaxed mb-4" style={{color:G.inkSoft,fontSize:'15px',lineHeight:'1.8'}}>{md(p)}</p>
          ))}
        </div>

        {/* DIAGRAM ZONE */}
        {hasDiagram&&(
          <div style={{position:'relative'}}>
            {focused&&(
              <button onClick={escape} className="escape-in" style={{position:'absolute',top:-12,right:-6,zIndex:20,display:'flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:20,background:C.navy,color:'white',fontSize:11,fontWeight:700,border:'none',cursor:'pointer',boxShadow:`0 4px 14px ${rgba(C.navy,0.28)}`,letterSpacing:'0.03em'}}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}>
                  <path d="M7 5H2M2 5L4.5 2.5M2 5L4.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to lesson
              </button>
            )}
            {!hasStarted&&(
              <div className="flex items-center gap-2 mb-3 su">
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${rgba(accent,0.25)})`}}/>
                <span style={{fontSize:11,color:rgba(accent,0.7),fontWeight:600,letterSpacing:'0.04em'}}>interactive concept</span>
                <div style={{width:5,height:5,borderRadius:'50%',background:accent,opacity:0.7,animation:'pulse 1.8s ease-in-out infinite'}}/>
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,${rgba(accent,0.25)},transparent)`}}/>
              </div>
            )}
            <div className={focused?'focus-ring':''} style={{position:'relative',zIndex:focused?10:'auto',borderRadius:16,transition:'transform 0.45s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.45s ease',transform:focused?'scale(1.018)':'scale(1)',boxShadow:focused?`0 12px 48px ${rgba(C.navy,0.14)}, 0 0 0 2px ${rgba(accent,0.4)}`:'none'}}>
              {section.arabiaDiagram&&<ArabiaDiagram onActivate={activate}/>}
              {section.tribalDiagram&&<TribalDiagram onActivate={activate}/>}
            </div>
            {focused&&(
              <div className="flex gap-2 mt-4 escape-in" style={{animationDelay:'0.08s'}}>
                <button onClick={escape} style={{flex:1,padding:'10px 0',borderRadius:10,fontSize:12,fontWeight:600,background:rgba(C.navy,0.05),color:C.mid,border:`1px solid ${rgba(C.navy,0.1)}`,cursor:'pointer'}}>Show lesson text</button>
                <button onClick={onContinue} style={{flex:1,padding:'10px 0',borderRadius:10,fontSize:12,fontWeight:600,background:`linear-gradient(135deg,${C.teal},${C.green})`,color:'white',border:'none',cursor:'pointer'}}>Continue →</button>
              </div>
            )}
          </div>
        )}

        {/* POST-DIAGRAM CONTENT */}
        <div style={textStyle}>
          {section.quran&&<QuranCard {...section.quran}/>}
          {section.callout&&(
            <div className="mb-4 mt-1" style={{background:section.callout.type==='warning'?rgba(C.coralLight,0.5):rgba(C.tealLight,0.5),borderLeft:`3px solid ${section.callout.type==='warning'?C.coral:C.teal}`,padding:'12px 16px',borderRadius:0}}>
              <div style={{fontSize:11,fontWeight:700,color:section.callout.type==='warning'?C.coral:C.teal,letterSpacing:'0.05em',marginBottom:4,textTransform:'uppercase'}}>{section.callout.title}</div>
              <p className="text-sm leading-relaxed" style={{color:C.dark}}>{section.callout.text}</p>
            </div>
          )}
        </div>

        {!focused&&(
          <button onClick={onContinue} className="w-full py-4 rounded-2xl font-black text-sm mt-3"
            style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer',letterSpacing:'0.01em',boxShadow:`0 16px 36px ${rgba(C.teal,0.22)}`}}>
            Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        )}
      </div>
    </div>
  );
}

// ================================================================
// QUESTION CARD
// ================================================================
function QuestionCard({q,qNum,totalQ,onAnswer,onNext}){
  const [done,    setDone]    = useState(false);
  const [correct, setCorrect] = useState(false);
  const [fbText,  setFbText]  = useState('');
  const [fbMeta,  setFbMeta]  = useState(null);

  const finish=useCallback((isCorrect,text,pts,meta)=>{
    setDone(true);setCorrect(isCorrect);setFbText(text);
    if(meta)setFbMeta(meta);
    onAnswer(isCorrect,pts,{scored:q.scored});
  },[onAnswer,q.scored]);

  const isReflection=q.type==='reflection-multi';
  const variant=isReflection?'reflection':correct?'correct':'wrong';
  const title=isReflection?'Thank you for reflecting':correct?'Correct':'Not quite';
  const last=qNum>=SCORED_COUNT;

  return(
    <div className="su rounded-3xl overflow-hidden" style={{background:'#fff',border:`1px solid ${G.border}`,boxShadow:`0 1px 2px ${rgba(C.navy,0.04)}, 0 12px 32px ${rgba(C.navy,0.06)}`}}>
      <div className="p-5 sm:p-6">
        {/* Subject chip */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:999,background:G.subjectTint,color:G.subject}}>History · {q.typeLabel}</span>
          {q.scored===false&&<span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:999,background:G.streakBg,color:G.streakInk}}>Not scored</span>}
        </div>
        <h3 className="mb-5" style={{color:G.ink,fontFamily:'Georgia,serif',fontWeight:700,fontSize:17,lineHeight:1.4,letterSpacing:'-0.01em'}}>{q.question}</h3>

        {q.type==='rapid-fire-tf'    &&<RapidFireTF        q={q} onFinish={finish}/>}
        {q.type==='mcq'              &&<MCQ                q={q} onFinish={finish}/>}
        {q.type==='bucket-sort'      &&<BucketSort         q={q} onFinish={finish}/>}
        {q.type==='fill-in-blank'    &&<FillInBlank        q={q} onFinish={finish}/>}
        {q.type==='reflection-multi' &&<ReflectionMultiSelect q={q} onFinish={finish}/>}

        {done&&fbText&&(
          <FeedbackSheet variant={variant} title={title} line={fbText}
            bridge={correct&&!isReflection?q.bridge:null}
            onContinue={onNext} continueLabel={last?'Complete lesson':'Continue'}/>
        )}
      </div>
    </div>
  );
}

// ================================================================
// MAIN APP
// ================================================================
export default function DEANY_HB1_L2({onBack, onHome}={}){
  const [screen,      setScreen]     = useState('intro');
  const [flowIdx,     setFlowIdx]    = useState(0);
  const [score,       setScore]      = useState(0);
  const [results,     setResults]    = useState([]);
  const [streak,      setStreak]     = useState(0);
  const [streakFlash, setStreakFlash]= useState(false);
  const [confetti,    setConfetti]   = useState(false);
  const [confidence,  setConfidence] = useState(3);

  const qDoneNum=FLOW.slice(0,flowIdx).filter(f=>f.type==='question'&&f.data.scored!==false).length;
  const current=FLOW[flowIdx];

  const handleAnswer=useCallback((correct,pts,flags={})=>{
    const isScored=flags.scored!==false;
    if(isScored)setResults(r=>[...r,{correct}]);
    if(correct&&isScored){
      setScore(s=>s+pts);
      setStreak(s=>{const n=s+1;if(n>=3){setStreakFlash(true);setTimeout(()=>setStreakFlash(false),2200);}return n;});
    } else if(isScored){setStreak(0);}
  },[]);

  const advance=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(flowIdx<FLOW.length-1){setFlowIdx(i=>i+1);}
    else{setScreen('complete');setConfetti(true);setTimeout(()=>setConfetti(false),5000);}
  },[flowIdx]);

  // ── INTRO ─────────────────────────────────────────────────────
  if(screen==='intro') return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>
      <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-9 su">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-black mb-4" style={{background:'rgba(255,255,255,0.75)',color:C.teal,letterSpacing:'0.10em',border:`1px solid ${rgba(C.border,0.9)}`,boxShadow:`0 10px 24px ${rgba(C.navy,0.06)}`}}>
            H-B1 · LESSON 1.2
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{color:C.navy,fontFamily:'Georgia,serif',letterSpacing:'-0.04em'}}>The Land and Its People</h1>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{color:G.steel}}>Geography, trade routes, and the tribal world that shaped pre-Islamic Arabia.</p>
        </div>
        <div className="rounded-[32px] p-7 border su" style={CARD}>
          <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.tealLight,0.55),borderColor:rgba(C.teal,0.18)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>From L1.1</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              In the last lesson, you learned that the Prophet Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ was the final link in a chain of Prophets stretching back to Adam عَلَيْهِ السَّلَام  -  and that his ancestor Ismail عَلَيْهِ السَّلَام settled in Arabia. Now we arrive in Arabia itself. What kind of land was it? Who lived there? Why did it matter to the ancient world?
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{width:'54px',height:'54px',fontSize:'1.65rem',background:`linear-gradient(135deg,${C.teal},${C.navy})`,boxShadow:`0 16px 34px ${rgba(C.teal,0.24)}`,border:`1px solid ${rgba(C.teal,0.32)}`}}>🗺️</div>
            <div className="rounded-2xl rounded-tl-sm p-5 border flex-1" style={{background:'rgba(255,255,255,0.78)',borderColor:rgba(C.border,0.9),boxShadow:`0 14px 34px ${rgba(C.navy,0.06)}`}}>
              <p className="text-sm" style={{color:C.dark}}>
                <strong style={{color:C.teal}}>Fulus:</strong> Arabia was not a backwater  -  it sat at the crossroads of the ancient world. By the end of this lesson, you will understand exactly why this land was the place the final message was sent. 🗺️
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {icon:'🗺️', term:'The Peninsula', desc:'Geography shapes everything'},
              {icon:'⚔️', term:'The Tribes',    desc:'Loyalty, honour, vengeance'},
              {icon:'🏛️', term:'Two Empires',   desc:'Byzantine and Sasanian'},
            ].map((t,i)=>(
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:rgba(C.tealLight,0.35),borderColor:rgba(C.teal,0.18)}}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-bold" style={{color:C.navy}}>{t.term}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {icon:<Clock className="w-4 h-4"/>, label:'12 min', sub:'Duration'},
              {icon:<Target className="w-4 h-4"/>, label:'5 Qs', sub:'Questions'},
              {icon:<BookOpen className="w-4 h-4"/>, label:'L1 - L3', sub:'Difficulty'},
            ].map((m,i)=>(
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:rgba(C.tealLight,0.25),borderColor:rgba(C.teal,0.1)}}>
                <div className="flex justify-center mb-1" style={{color:C.teal}}>{m.icon}</div>
                <div className="text-sm font-bold" style={{color:C.navy}}>{m.label}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{m.sub}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setScreen('lesson')} className="w-full py-4 rounded-2xl font-black text-sm"
            style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer',boxShadow:`0 18px 44px ${rgba(C.teal,0.24)}`}}>
            Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );

  // ── COMPLETE ──────────────────────────────────────────────────
  if(screen==='complete'){
    const total=SCORED_COUNT, correct=results.filter(r=>r.correct).length;
    const pct=Math.round((correct/total)*100);
    const ring=pct>=80?C.green:pct>=60?C.gold:C.teal;
    const circ=2*Math.PI*36, offset=circ-(pct/100)*circ;
    return(
      <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
        <IslamicBg/><style>{STYLES}</style>
        {confetti&&<Confetti/>}
        <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
          <div className="rounded-[32px] p-8 border text-center su" style={CARD}>
            <div className="text-4xl mb-3">🗺️</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Lesson complete</h1>
            <p className="text-sm mb-4" style={{color:C.mid}}>The Land and Its People</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{background:rgba(C.teal,0.15),color:C.teal,border:`1px solid ${rgba(C.teal,0.3)}`}}>
              <Award className="w-3.5 h-3.5"/> Arabia Unlocked 🗺️
            </div>
            <div className="relative inline-block mb-6">
              <svg width="96" height="96" className="-rotate-90">
                <circle cx="48" cy="48" r="36" fill="none" stroke={C.light} strokeWidth="6"/>
                <circle cx="48" cy="48" r="36" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1.5s ease-out'}}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{correct}/{total}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{label:'Score',value:`${score} pts`,color:C.green,bg:C.greenLight},{label:'Accuracy',value:`${pct}%`,color:C.gold,bg:C.goldLight},{label:'Level',value:'L1-L3',color:C.purple,bg:rgba(C.purple,0.1)}].map((s,i)=>(
                <div key={i} className="p-3 rounded-xl border" style={{background:s.bg,borderColor:rgba(s.color,0.18)}}>
                  <div className="text-lg font-bold" style={{color:s.color}}>{s.value}</div>
                  <div className="text-[10px]" style={{color:C.mid}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="text-left p-4 rounded-xl mb-5" style={{background:rgba(C.greenLight,0.7),border:`1px solid ${rgba(C.green,0.18)}`}}>
              <div className="text-xs font-bold mb-2" style={{color:C.green}}>Concepts mastered</div>
              {[
                'Arabian Peninsula geography: Hijaz, Najd, Yemen and their significance',
                'The two trade routes crossing at Makkah: north-south and east-west',
                'The tribal code: Asabiyyah, Muruah, and Tha\'r',
                'Arabia between the Byzantine and Sasanian Empires',
              ].map((c,i)=>(
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.green}}/>
                  <span className="text-xs" style={{color:C.dark}}>{c}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 mb-5" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.25)}`}}>
              <div className="text-xs font-bold mb-1.5" style={{color:C.gold}}>How confident do you feel?</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] w-16 text-right" style={{color:C.mid}}>Still unsure</span>
                <input type="range" min="1" max="5" value={confidence} onChange={e=>setConfidence(+e.target.value)}
                  className="flex-1 h-2 rounded-full cursor-pointer" style={{accentColor:C.gold}}/>
                <span className="text-[10px] w-20" style={{color:C.mid}}>Very confident</span>
              </div>
              <p className="text-xs text-center" style={{color:C.dark}}>
                {confidence<=2?'The geography takes time to settle. It will come back in every subsequent lesson.':confidence===3?'Good foundation. L1.3 will build directly on what you just learned.':'You have the picture clearly. Everything from here will feel grounded.'}
              </p>
            </div>
            <div className="p-4 rounded-xl mb-5" style={{background:rgba(C.teal,0.07),border:`1px solid ${rgba(C.teal,0.16)}`}}>
              <div className="text-xs font-bold mb-1" style={{color:C.teal}}>Up next</div>
              <div className="text-sm font-semibold mb-0.5" style={{color:C.navy}}>L1.3: Jahiliyyah  -  Life Without Revelation</div>
              <div className="text-xs" style={{color:C.mid}}>We go inside this society: what did people worship? What did they value? What did they get wrong  -  and what did they get right?</div>
            </div>
            <button onClick={()=>onHome&&onHome()} className="w-full py-3.5 rounded-xl font-bold text-sm pls"
              style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy,border:'none',cursor:'pointer'}}>
              Next Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
            </button>
            {onBack && (
              <button onClick={onBack} className="w-full py-2.5 rounded-xl text-sm font-medium mt-3"
                style={{background:'none',border:`1px solid ${G.border}`,color:G.steel,cursor:'pointer'}}>
                Back to lessons
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── LESSON ────────────────────────────────────────────────────
  return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>

      {streakFlash&&(
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full su"
          style={{background:G.streakBg,border:`1px solid ${G.streakBorder}`,color:G.streakInk,boxShadow:`0 8px 24px ${rgba(C.navy,0.10)}`}}>
          <Flame className="w-4 h-4"/><span className="text-sm font-bold">{streak} in a row</span>
        </div>
      )}

      <div className="relative z-10 max-w-xl mx-auto px-4 py-6">
        {/* Header row: close, progress, streak (subject accent = History) */}
        <div className="sticky top-3 z-30 flex items-center gap-3 mb-6 rounded-2xl px-3 py-2.5"
          style={{background:'rgba(255,255,255,0.94)',backdropFilter:'blur(10px)',border:`1px solid ${G.border}`,boxShadow:`0 6px 20px ${rgba(C.navy,0.06)}`}}>
          <button type="button" onClick={()=>{ if(onBack) onBack(); else if(typeof window!=='undefined') window.history.back(); }} aria-label="Close lesson"
            className="flex items-center justify-center flex-shrink-0" style={{width:36,height:36,borderRadius:999,color:G.muted}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
          <div className="flex-1 rounded-full overflow-hidden" style={{height:12,background:G.border}}>
            <div style={{height:'100%',borderRadius:999,width:`${Math.min((qDoneNum/SCORED_COUNT)*100,100)}%`,background:G.subject,transition:`width ${M.progressSpring}ms cubic-bezier(0.34,1.4,0.64,1)`}}/>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-full" style={{background:G.streakBg,border:`1px solid ${G.streakBorder}`}}>
            <Flame className="w-3.5 h-3.5" style={{color:G.streakInk}}/>
            <span className="text-xs font-bold" style={{color:G.streakInk}}>{streak}</span>
          </div>
        </div>

        {current.type==='section'&&(
          <SectionCard key={`s${flowIdx}`} section={current.data} onContinue={advance}/>
        )}
        {current.type==='question'&&(
          <QuestionCard key={`q${flowIdx}`} q={current.data} qNum={qDoneNum} totalQ={SCORED_COUNT} onAnswer={handleAnswer} onNext={advance}/>
        )}
      </div>
    </div>
  );
}
